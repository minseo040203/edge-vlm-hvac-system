# Multi-stage build for Edge VLM HVAC System
FROM nvcr.io/nvidia/l4t-pytorch:r35.4.1-pth2.0-py3 as builder

WORKDIR /build
RUN apt-get update && apt-get install -y git curl wget build-essential python3-dev && rm -rf /var/lib/apt/lists/*
COPY requirements_jetson.txt .
RUN pip install --upgrade pip setuptools wheel && pip install -r requirements_jetson.txt --no-cache-dir

# Runtime stage
FROM nvcr.io/nvidia/l4t-pytorch:r35.4.1-pth2.0-py3
WORKDIR /app
RUN apt-get update && apt-get install -y libopencv-dev python3-opencv libatlas-base-dev libjasper-dev libtiff-dev && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/lib/python3.8/dist-packages /usr/local/lib/python3.8/dist-packages
COPY . .

RUN useradd -m -u 1000 hvac && chown -R hvac:hvac /app
USER hvac

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD python3 -c "import sys; sys.exit(0)" || exit 1
CMD ["python3", "main.py"]

LABEL org.opencontainers.image.source="https://github.com/KAJ-EdgeVLM-HVAC-Project/edge-vlm-hvac-system" \
      org.opencontainers.image.title="Edge VLM HVAC System"
