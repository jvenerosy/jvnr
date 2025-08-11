FROM node:18-slim AS base
WORKDIR /app

# Install system dependencies once
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Install dependencies only when needed
FROM base AS deps
# Copy package files
COPY package.json package-lock.json* ./
# Install production dependencies with cache optimization
RUN npm ci --only=production --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
# Copy package files
COPY package.json package-lock.json* ./
# Install all dependencies including devDependencies for build
RUN npm ci --frozen-lockfile

# Copy source code
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Disable telemetry during build for faster builds
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT=3000

# Start the Next.js server
CMD ["node", "server.js"]