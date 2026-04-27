# ── Build stage ─────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --silent

COPY . .

ARG VITE_API_URL=/api
ARG VITE_WHATSAPP_ADMIN=5517999999999
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WHATSAPP_ADMIN=$VITE_WHATSAPP_ADMIN

RUN npm run build

# ── Runtime stage (Nginx) ────────────────────────────────────
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
