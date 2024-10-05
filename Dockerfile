FROM nginx:alpine

ADD unpackage/dist/build/web /vue-admin
RUN rm -f /etc/nginx/conf.d/default.conf
COPY unpackage/nginx/admin.conf /etc/nginx/conf.d/admin.conf
RUN chmod -R 755 /vue-admin/*
EXPOSE 80