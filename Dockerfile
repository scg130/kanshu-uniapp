FROM nginx:alpine

ADD unpackage/dist/build/web /kanshu-uniapp
RUN rm -f /etc/nginx/conf.d/default.conf
COPY unpackage/nginx/admin.conf /etc/nginx/conf.d/admin.conf
RUN chmod -R 755 /kanshu-uniapp/*
EXPOSE 80