FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json tsconfig.json ./
COPY src ./src
RUN npm run build
RUN cp -r src/data dist/data

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV DEMO_LEADS_EMAIL=sales@leapai.ai
ENV SMTP_HOST=smtp.office365.com
ENV SMTP_PORT=587
ENV SMTP_SECURE=false
ENV SMTP_FROM="LeapAI Website <noreply@leapai.ai>"
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./
EXPOSE 4000
RUN mkdir -p /app/uploads /app/uploads/cv
CMD ["sh", "-c", "if [ \"$SEED_ON_START\" = \"true\" ]; then node dist/seed.js; fi && node dist/index.js"]
