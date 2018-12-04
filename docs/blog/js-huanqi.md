# 关于 h5 唤起 app

这里讨论的是使用 schema 方式唤起，建议使用 universal link 的方式，可以避免一下坑。

- 微博中唤起 app
- 微信中唤起 app
- qq 中唤起 app
- 浏览器中唤起 app

## 踩的坑

1、微博中的唤起，不能直接使用 location.href 和 a 标签，否则换不起的话，就会报 404 错误。

2、使用 iframe 唤起，如果你的后端有配置 scp，可能会被拦截，需要配好。

3、在 ios 里面，使用 iframe 不能唤起，只能 location.href

4、ios 里，模拟 a 标签点击，如果没有安装 app，会弹出不能打开链接的 alert 错误。

## 机型采集

1、美图手机：
qq： 使用 iframe，a 标签 唤起成功
浏览器：使用 iframe，a 标签 唤起成功
微博： 使用 iframe，a 标签 唤起成功
微信： 都不能唤起

2、iphone 6s ios12
qq： 使用 a 标签 唤起成功
浏览器：使用 a 标签 唤起成功
微博： 使用 iframe，a 标签 唤起成功
微信： 都不能唤起

3、红米
qq： 使用 iframe，a 标签 唤起成功
浏览器：使用 iframe，a 标签 唤起成功
微信： 都不能唤起

4、华为荣耀 8
qq： 使用 iframe，a 标签 唤起成功
浏览器：使用 a 标签 唤起成功，iframe 只能第一次唤起
微博： 使用 iframe，a 标签 唤起成功
微信： 都不能唤起
