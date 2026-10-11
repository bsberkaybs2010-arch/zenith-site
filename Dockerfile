FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
RUN sed -i 's/listen       80;/listen       10000;/; s/listen  80;/listen  10000;/' /etc/nginx/conf.d/default.conf
EXPOSE 10000
