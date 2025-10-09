# Use official Python image as base
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# TODO: install docker client to be able to run docker commands from inside the container

# Install uv package manager
RUN pip install uv

# Set work directory
WORKDIR /app

# Copy project files
COPY . /app

WORKDIR /app

# Install Python dependencies
RUN uv sync --locked

# Expose port (adjust if needed)
EXPOSE 8000

# Start backend (adjust command as needed)
CMD ["uv", "run", "fastapi", "run", "app/main.py", "--host", "0.0.0.0", "--port", "8000"]