FROM nginx:alpine

# Sitio estático ya generado con `nuxi generate`
COPY .output/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
