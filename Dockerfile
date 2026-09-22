FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000 \
    GI24_WEB_ROOT=/app/web \
    GI24_DATA_DIR=/data \
    GI24_SECURE_COOKIES=1

WORKDIR /app
RUN useradd --create-home --uid 10001 giapp && mkdir -p /data && chown giapp:giapp /data
COPY --chown=giapp:giapp backend.py /app/backend.py
COPY --chown=giapp:giapp web /app/web

USER giapp
VOLUME ["/data"]
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/api/health', timeout=3)"
CMD ["python", "backend.py", "--host", "0.0.0.0"]
