FROM nginx
COPY build /var/www/html
COPY ngnix.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT ["nginx", "-g", "daemon off;"]
EXPOSE 80
