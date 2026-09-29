FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    MODEL_PATH=app/ml/models/promptshield-distilbert-v2 \
    PORT=8000

WORKDIR /app

# Install system dependencies if required
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install PyTorch CPU first to keep image lightweight and fast to build
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code, models, and rules
COPY . /app/

# Expose default port
EXPOSE 8000

# Run FastAPI via Uvicorn listening on Render's dynamic $PORT or default 8000
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
