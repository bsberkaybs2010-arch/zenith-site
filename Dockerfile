FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.25.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY index.html vite.config.ts tsconfig*.json ./
COPY src ./src
RUN pnpm build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN printf '%s\n' 'server {' '  listen 10000;' '  server_name _;' '  root /usr/share/nginx/html;' '  index index.html;' '  location / { try_files $uri $uri/ /index.html; }' '}' > /etc/nginx/conf.d/default.conf
EXPOSE 10000
