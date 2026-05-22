# CI-compatible Dockerfile for Week 9 CI/CD automation
# Lightweight image for GitHub Actions build/push verification

FROM python:3.10-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY . .

CMD ["python", "-c", "print('Edge VLM HVAC Docker image is ready')"]