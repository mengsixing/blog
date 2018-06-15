目录

```
.
├ test.js
├ DockerFile
├ package.json

```

1、test.js

``` js
const Koa = require('koa');
const app = new Koa();
app.use(function(ctx){
  ctx.body='hello docker';
})
app.listen(3456);
```

2、DockerFile配置

``` dockerfile
FROM node
COPY . /app
WORKDIR /app
RUN ["npm", "install"]
EXPOSE 3456
CMD node test.js
```

3、生成容器

``` 
docker image build . -t mytest1
```


4、运行容器

``` 
docker container run -p 8000:3456 mytest1
```

5、访问

```
localhost:8000
```
