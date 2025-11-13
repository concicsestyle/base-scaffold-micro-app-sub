FROM hbr.sinomach-he.cn:12345/library/nginx:1.26.3

RUN rm -rf /etc/nginx/nginx.conf && mkdir -p /data/frontend/

ADD  nginx.conf   /etc/nginx/

ADD dist /data/frontend/

