FROM node:20-slim

# Create non-root user (required for HF Spaces)
RUN useradd -m -u 1000 user
WORKDIR /app

# Install Chromium for Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libasound2 \
    libgbm1 \
    libgtk-3-0 \
    libnss3 \
    lsb-release \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Puppeteer configuration
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY --chown=user . .

# HF Spaces uses port 7860
EXPOSE 7860

# Run as non-root user
USER user

# Start command
CMD ["npm", "start"]