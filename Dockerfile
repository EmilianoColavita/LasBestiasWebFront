# ---------- Etapa 1: build de React ----------
FROM node:20-alpine AS build
WORKDIR /app

# URL del backend: se "hornea" en el JS durante el build (Create React App)
ARG REACT_APP_API_BASE_URL=https://api.lasbestiasok.com.ar
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
# Evita que los warnings de ESLint rompan el build
ENV CI=false

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Etapa 2: servir estáticos con Nginx ----------
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
