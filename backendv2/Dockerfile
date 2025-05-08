# builder
FROM python:3.12-slim AS builder
WORKDIR /app
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
 && apt-get install -y --no-install-recommends build-essential git \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip \
 && pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

ENV HF_HOME=/root/.cache/huggingface
RUN pip install --no-cache-dir --no-index --find-links /wheels -r requirements.txt \
 && python - <<\EOF
from marker.converters.pdf import PdfConverter
from marker.models import create_model_dict
PdfConverter(artifact_dict=create_model_dict())
EOF

# runtime
FROM python:3.12-slim AS runtime  
WORKDIR /app

COPY --from=builder /wheels /wheels
COPY --from=builder /root/.cache /root/.cache

COPY . .

RUN pip install --no-cache-dir \
      --no-index \
      --find-links=/wheels \
      -r requirements.txt \
 && groupadd -g 1000 appuser \
 && useradd -u 1000 -g appuser --shell /usr/sbin/nologin appuser \
 && mkdir -p /home/appuser/.cache \
 && chown -R appuser:appuser /home/appuser \
 && chmod -R a-w /root/.cache \
 && mkdir -p /usr/local/lib/python3.12/site-packages/static \
 && chown -R appuser:appuser /usr/local/lib/python3.12/site-packages/static

ENV HOME=/home/appuser
USER appuser

EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:8000/healthz || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
