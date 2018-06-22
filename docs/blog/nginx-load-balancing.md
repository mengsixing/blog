# 最简单的 nginx 负载均衡

``` nginx
worker_processes 4;
events{
    worker_connections 1024;
}
http{
    upstream firsttest {
        server 111.13.103.91 weight=3;
        server 111.13.179.222;
    }
    server{
        listen 8080;
        location / {
            proxy_pass http://firsttest;
        }
    }
}
```
