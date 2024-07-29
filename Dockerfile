
FROM node:14 as builder

ARG HTTPS_PROXY=""

WORKDIR /app
COPY package.json package-lock.json  /app/
RUN npm install -g typescript@4.8.4 # Install a compatible TypeScript version
RUN npm install -g
RUN cd /app && npm install
COPY .  /app
RUN cd /app && npm run build:prod

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY nginx/default.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
