---
layout: post
title: nginx负载均衡简单配置
date: 2017-12-13 22:32:22
tags: nginx
---


## 最简单的nginx负载均衡

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
