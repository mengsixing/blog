# Docker 微服务小 Demo

## 目录

```dir
.
├ test.js
├ DockerFile
├ package.json
```

1、test.js。

```js
const Koa = require("koa");
const app = new Koa();
app.use(function(ctx) {
  ctx.body = "hello docker";
});
app.listen(3456);
```

2、DockerFile 配置。

```dockerfile
FROM node
COPY . /app
WORKDIR /app
RUN ["npm", "install"]
EXPOSE 3456
CMD node test.js
```

## 生成容器

```shell
docker image build . -t mytest1
```

## 运行容器

```shell
docker container run -p 8000:3456 mytest1
```

## 访问

```shell
localhost:8000
```
