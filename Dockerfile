################################################################################
# 1. Scala/Akka backend збірка
################################################################################
FROM eclipse-temurin:17-jdk-alpine AS scala-build
WORKDIR /app/backend

# sbt встановлення
RUN apk add --no-cache curl bash \
 && curl -L https://github.com/sbt/sbt/releases/download/v1.9.9/sbt-1.9.9.tgz \
    | tar xvz -C /usr/local \
 && ln -s /usr/local/sbt/bin/sbt /usr/local/bin/sbt

# Копіюємо весь проект Scala (разом з project/, build.sbt тощо)
COPY backend/ ./

# Збираємо fat-jar
RUN sbt clean assembly

################################################################################
# 2. Python/FastAPI збірка
################################################################################
FROM python:3.12-slim AS py-builder
WORKDIR /app/backendv2
ENV DEBIAN_FRONTEND=noninteractive

# збираємо wheel-файли
RUN apt-get update \
 && apt-get install -y --no-install-recommends build-essential git \
 && rm -rf /var/lib/apt/lists/*

COPY backendv2/requirements.txt ./
RUN pip install --upgrade pip \
 && pip wheel --no-cache-dir --wheel-dir wheels -r requirements.txt

# копіюємо код і встановлюємо з колеса
COPY backendv2/ ./
RUN pip install --no-cache-dir --no-index --find-links wheels -r requirements.txt \
 && python - <<\EOF
from marker.converters.pdf import PdfConverter
from marker.models import create_model_dict
PdfConverter(artifact_dict=create_model_dict())
EOF

################################################################################
# 3. Python runtime
################################################################################
FROM python:3.12-slim AS py-runtime
WORKDIR /app/backendv2

COPY --from=py-builder /app/backendv2/wheels ./wheels
COPY --from=py-builder /root/.cache /root/.cache
COPY backendv2/ ./

RUN pip install --no-cache-dir --no-index --find-links wheels -r requirements.txt

ENV HF_HOME=/root/.cache/huggingface
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/healthz')"

################################################################################
# 4. Kotlin/Ktor збірка
################################################################################
FROM gradle:8.5-jdk17 AS kt-build
WORKDIR /app/backendv3

# копіюємо весь проект Kotlin
COPY backendv3/ ./

# збираємо fat-jar (buildFatJar або shadowJar залежить від вашого скрипта)
RUN gradle buildFatJar --no-daemon

################################################################################
# 5. Kotlin runtime
################################################################################
FROM eclipse-temurin:17-jre-alpine AS kt-runtime
WORKDIR /app/backendv3

COPY --from=kt-build /app/backendv3/build/libs/*.jar ./app.jar
ENV PORT=8001
EXPOSE 8001

################################################################################
# 6. Frontend збірка
################################################################################
FROM node:20-alpine AS fe-build
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

################################################################################
# 7. Frontend runtime (Nginx)
################################################################################
FROM nginx:alpine AS fe-runtime
# копіюємо перевірені nginx-конфи в наступному кроці
COPY --from=fe-build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80

################################################################################
# 8. Фінальний образ з Supervisor + Nginx + всі сервіси
################################################################################
FROM eclipse-temurin:17-jre-alpine AS final

# встановлюємо runtime для Python, Supervisor та Nginx
RUN apk add --no-cache \
    python3 py3-pip \
    nginx \
    supervisor \
    bash

# створимо директорії
RUN mkdir -p /srv/backend /srv/backendv2 /srv/backendv3 /srv/frontend \
         /etc/supervisor/conf.d /var/log/supervisor

# копіюємо зібрані артефакти
COPY --from=scala-build   /app/backend/target/scala-2.13/*.jar /srv/backend/backend.jar
COPY --from=py-runtime    /app/backendv2                   /srv/backendv2
COPY --from=kt-runtime    /app/backendv3/app.jar           /srv/backendv3/app.jar
COPY --from=fe-runtime    /usr/share/nginx/html            /srv/frontend

# копіюємо nginx-конфіги з фронтенду
COPY frontend/nginx/nginx.conf      /etc/nginx/nginx.conf
COPY frontend/nginx/default.conf    /etc/nginx/conf.d/default.conf

# копіюємо Supervisor-конфіг
COPY docker/supervisord.conf        /etc/supervisor/conf.d/supervisord.conf

# відкриваємо HTTP/HTTPS
EXPOSE 80 443

# запускаємо Supervisor у foreground
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf", "-n"]
