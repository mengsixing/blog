# dns 劫持

客户端访问服务端，需要经过路由器，DNS解析，CDN，等环节。

## DNS是如何工作的？

* 浏览器可能会缓存域名解析
* 用户系统中可以有自己的域名映射表(hosts)

* 用户设备到公共域名服务器，是通过UDP协议通信。
* 公共域名服务器通常由ISP（互联网服务提供商）提供。
* 公共应服务器会缓存上一级域名服务器的结果。
* 公共域名服务器TTL到期后，会向顶级域名服务器获取信息。

## 如何污染DNS

* 篡改hosts文件
* 拦截DNS请求

* 污染链路设备
* 中间人攻击

* 利用DNS服务漏洞
* 污染上一级DNS

## 如何抵御DNS攻击？

### Content-Security-Policy （在http请求头中加入该字段）。

作⽤:

* 指定每种资源类型可以加载执⾏行行的条件。
* 主要⽤用于防御XSS攻击。
* 也可以⽤于强迫资源使用 https 加载。

缺点:

* ⽤于 http ⻚面时⽆法抵抗中间人攻击。
* 规则⽐比较复杂。
* 影响动态创建脚本的使⽤。

### Subresource Integrity （在script标签中加入字段）

``` html
<script crossorigin="anonymous" integrity=“sha256-+Ec97...E=“ src=“https://a.com"></script>
```

作⽤:

* 只执⾏匹配相应hash的资源

缺点:

* 用于 http ⻚面时⽆法抵抗中间⼈攻击。
* 影响动态创建脚本的使⽤。
* 校验失败时影响可⽤性。
* 兼容性有限，iOS Safari不支持。

### HTTP Strict-Transport-Security

在http头部添加信息。

``` http
Strict-Transport-Security: max-age=<expire-time>
```

* 下次请求时必定使⽤ HTTPS。
* 失效时间为1年。
* Chrome 可以内置⼀部分域名。

问题:

* HTTP 协议无效。
* ⽤户的第⼀次访问不受控。
* Chrome 的“预加载”列表名额有限。

## 走进https

利用数学方法，让传输中可见的东西不可逆破解，只能通过私钥破解。

* 客户端发起SSL/TSL握手，发送支持加密套件。
* 选取加密套件返回客户端。
* 密钥协商/密钥交换（双向）。
* 结束握手（加密）（双向）。
* 加密http数据（双向）。

## 什么是CDN？

* 用户和机房的距离客观存在。
* 利用邻近的服务器加速网站内容的访问。
* CDN可以起到一定缓存作用。
* 利用DNS引导不同地区用户到不同的CDN节点。
