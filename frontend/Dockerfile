# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# copy package & lock first for caching
COPY package.json package-lock.json* ./
RUN npm ci --silent

# copy rest and build (use VITE_API_URL build arg)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
COPY public ./public
COPY src ./src
RUN npm run build

# Production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
