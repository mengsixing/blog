# DNS 劫持

域名劫持是互联网攻击的一种方式，通过攻击域名解析服务器（DNS），或伪造域名解析服务器（DNS）的方法，把目标网站域名解析到错误的地址从而实现用户无法访问目标网站的目的。

客户端访问服务端，需要经过路由器，DNS解析，CDN，等环节，都有可能发生DNS劫持。

## DNS是如何工作的？

* 浏览器可能会缓存域名解析。
* 用户系统中可以有自己的域名映射表(hosts)。
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

### Content-Security-Policy

[Content-Security-Policy 文档](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy__by_cnvoid)

* 指定每种资源类型可以加载执⾏的条件。
* 主要⽤用于防御XSS攻击。
* 也可以⽤于强迫资源使用 https 加载。

``` html
// header
Content-Security-Policy: default-src https:

// meta tag
<meta http-equiv="Content-Security-Policy" content="default-src https:">
```

缺点:

* ⽤于 http ⻚面时⽆法抵抗中间人攻击。
* 规则⽐比较复杂。
* 影响动态创建脚本的使⽤。

### Subresource Integrity （在script标签中加入字段）

[Subresource Integrity 文档](https://developer.mozilla.org/zh-CN/docs/Web/Security/子资源完整性)

Subresource Integrity 允许浏览器检查其获得的资源（例如从 CDN 获得的）是否被篡改的一项安全特性。

``` html
<script crossorigin="anonymous" integrity=“sha256-+Ec97...E=“ src=“https://a.com"></script>
```

缺点:

* 用于 http ⻚面时⽆法抵抗中间⼈攻击。
* 影响动态创建脚本的使⽤。
* 校验失败时影响可⽤性。
* 兼容性有限， iOS Safari 不支持。

### HTTP Strict-Transport-Security

[HTTP Strict-Transport-Security 文档](https://developer.mozilla.org/zh-CN/docs/Security/HTTP_Strict_Transport_Security)

HTTP Strict-Transport-Security 是一个安全功能，它告诉浏览器只能通过HTTPS访问当前资源，而不是HTTP。

``` http
Strict-Transport-Security: max-age=<expire-time>
```

问题:

* ⽤户的第⼀次访问不受控。

## 走进https

利用数学方法，让传输中可见的东西不可逆破解，只能通过私钥破解。

* 客户端发起 SSL/TSL 握手，发送支持加密套件。
* 选取加密套件返回客户端。
* 密钥协商/密钥交换。
* 结束握手（加密）。
* 加密http数据。

## 什么是CDN？

* 用户和机房的距离客观存在。
* 利用邻近的服务器加速网站内容的访问。
* CDN可以起到一定缓存作用。
* 利用DNS引导不同地区用户到不同的 CDN 节点。

## 现有方案

* ⽅案A：在某些省份、地区⾃建监测站，定期抓取固定资源（问题:资源太固定，监测站数量也远远不够）。
* ⽅案B：业务⽅在⾃己的 html 中监听资源的 error 事件（问题:⽆法确认问题在于链路，也可能只是普通的 js 出错）。
* ⽅案C：使⽤用第三⽅方企业服务进⾏监控（问题:服务越多成本越⾼）。
* ⽅案D：CSP、SRI（问题:兼容性和灵活性差，⽆无法进行⾃定义逻辑）。

## 基于代码校验的防治⽅案

![基于代码校验的防治⽅案](/blog/dns-hijacking.png)
