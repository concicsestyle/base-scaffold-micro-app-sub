FROM hbr.sinomach-he.cn:12345/library/nginx:1.26.3

RUN rm -rf /usr/share/nginx/html/base-scaffold-micro-app-sub/

ADD dist /usr/share/nginx/html/base-scaffold-micro-app-sub/
