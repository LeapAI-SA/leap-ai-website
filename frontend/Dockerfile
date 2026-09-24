FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_API_URL=/backend
ARG NEXT_PUBLIC_BASE_PATH=
ARG NEXT_PUBLIC_SITE_URL=https://leapai-webhook.bab.solutions
ARG NEXT_PUBLIC_GTM_ID=GTM-KTRBN5S2
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID=G-7NWB9C7RNB
ARG API_URL=http://backend:4000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_GTM_ID=$NEXT_PUBLIC_GTM_ID
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID
ENV SKIP_CMS_FETCH=true
ENV NEXT_TELEMETRY_DISABLED=1
# Alpine is musl; npm often installs the gnu SWC optional dep instead.
RUN npm install --no-save @next/swc-linux-x64-musl@16.2.6
RUN npm run build

FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=/backend
ENV NEXT_PUBLIC_BASE_PATH=
ENV NEXT_PUBLIC_SITE_URL=https://leapai-webhook.bab.solutions
ENV NEXT_PUBLIC_GTM_ID=GTM-KTRBN5S2
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=G-7NWB9C7RNB
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
