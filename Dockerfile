# 🏗️ Stage 1: Builder
FROM node:24.5.0 as builder

# Install build tools, required packages, and yarn
RUN apt update && \
    apt install -y build-essential aria2 ffmpeg curl && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp && \
    corepack enable && \
    corepack prepare yarn@stable --activate

WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies using yarn
RUN yarn install

# Copy the rest of your application code
COPY . .

# 🧼 Stage 2: Production
FROM node:24.5.0

# Install runtime tools only (no build-essential)
RUN apt update && \
    apt install -y aria2 ffmpeg curl && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp && \
    apt clean

WORKDIR /usr/src/app

# Copy built app from builder
COPY --from=builder /usr/src/app /usr/src/app

# 🚀 Start the bot
CMD ["node", "bot.js"]
