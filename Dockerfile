# =============================================================================
# Dockerfile multi-stage sécurisé pour Next.js
# Exécute l'application avec un utilisateur non-root (UID 1001)
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Base avec les dépendances
# -----------------------------------------------------------------------------
FROM node:22-alpine AS base

# Désactiver la télémétrie Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# -----------------------------------------------------------------------------
# Stage 2: Installation des dépendances
# -----------------------------------------------------------------------------
FROM base AS deps

WORKDIR /app

# Installer les dépendances système pour node-gyp si nécessaire
RUN apk add --no-cache libc6-compat

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installation des dépendances avec npm ci pour reproductibilité
RUN npm ci --ignore-scripts

# -----------------------------------------------------------------------------
# Stage 3: Build de l'application
# -----------------------------------------------------------------------------
FROM base AS builder

WORKDIR /app

# Copier les dépendances depuis le stage précédent
COPY --from=deps /app/node_modules ./node_modules

# Copier le code source
COPY . .

# Variables d'environnement pour le build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build de l'application
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 4: Image de production
# -----------------------------------------------------------------------------
FROM base AS runner

WORKDIR /app

# Configuration sécurisée
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Créer l'utilisateur non-root avec UID 1001
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copier les fichiers publics
COPY --from=builder /app/public ./public

# Créer le répertoire .next et définir les permissions
RUN mkdir -p .next \
    && chown nextjs:nodejs .next

# Copier le build standalone avec les permissions correctes
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Passer à l'utilisateur non-root
USER nextjs

# Exposer le port (non-privilégié)
EXPOSE 3000

# Variables d'environnement runtime
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Healthcheck (utilise Node.js car wget n'est pas dans alpine)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "fetch('http://localhost:3000/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Démarrer l'application
CMD ["node", "server.js"]
