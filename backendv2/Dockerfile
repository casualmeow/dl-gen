
FROM python:3.12-slim AS builder
WORKDIR /app
ENV DEBIAN_FRONTEND=noninteractive
# Использовать PyTorch CPU-индекс при установке и сборке
ENV PIP_EXTRA_INDEX_URL=https://download.pytorch.org/whl/cpu

RUN apt-get update \
 && apt-get install -y --no-install-recommends build-essential git \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade pip \
 && pip install torch==2.7.0+cpu \
 && pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt \
 && pip wheel --no-cache-dir --wheel-dir /wheels fastapi uvicorn[standard]

FROM python:3.12-slim AS runtime
WORKDIR /app
ENV PIP_EXTRA_INDEX_URL=https://download.pytorch.org/whl/cpu

COPY --from=builder /wheels /wheels
COPY . .

RUN pip install --no-cache-dir \
      --find-links=/wheels \
      -r requirements.txt \
 && pip install --no-cache-dir torch==2.7.0+cpu fastapi uvicorn[standard] \
 \
 && groupadd -g 1000 appuser \
 && useradd -u 1000 -g appuser --shell /usr/sbin/nologin appuser \
 \
 && mkdir -p /usr/local/lib/python3.12/site-packages/static \
 && chown -R appuser:appuser /usr/local/lib/python3.12/site-packages/static \
 && mkdir -p /home/appuser/.cache \
 && chown -R appuser:appuser /home/appuser

ENV HOME=/home/appuser
USER appuser

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
