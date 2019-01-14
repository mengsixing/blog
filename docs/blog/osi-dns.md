# 域名劫持 / 数据劫持

最公司首页被流量劫持了，首页被插入了小广告，引起了公司层面的注意，大家一起开了个会，发表了一下当前预防劫持的几个方法，我也参与其中，学到了一些防劫持的知识，在这里写个总结。

## 域名劫持

域名劫持是互联网攻击的一种方式，通过攻击域名解析服务器（DNS），或伪造域名解析服务器（DNS）的方法，`把目标网站域名解析到错误的地址`从而实现用户无法访问目标网站的目的。

### DNS 是如何工作的

客户端访问服务端，需要经过路由器，DNS 解析，CDN，等环节，都有可能发生流量劫持。

- 浏览器可能会缓存域名解析。
- 用户系统中可以有自己的域名映射表(hosts)。
- 用户设备到公共域名服务器，是通过 UDP 协议通信。
- 公共域名服务器通常由 ISP（互联网服务提供商）提供。
- 公共应服务器会缓存上一级域名服务器的结果。
- 公共域名服务器 TTL 到期后，会向顶级域名服务器获取信息。

### 如何污染 DNS

- 篡改 hosts 文件
- 拦截 DNS 请求
- 污染链路设备
- 中间人攻击
- 利用 DNS 服务漏洞
- 污染上一级 DNS

### 如何抵御 DNS 攻击

#### Content-Security-Policy (CSP)

[Content-Security-Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy__by_cnvoid) 的实质就是白名单制度，开发者明确告诉客户端，哪些外部资源可以加载和执行，等同于提供白名单。它的实现和执行全部由浏览器完成，开发者只需提供配置。

- 指定每种资源类型可以加载执⾏的条件。
- 主要⽤用于防御 XSS 攻击。
- 也可以⽤于强迫资源使用 https 加载。

两种方式开启 CSP：

```html
// 通过http头信息
Content-Security-Policy: default-src https:

// 通过meta标签
<meta http-equiv="Content-Security-Policy" content="default-src https:">
```

缺点:

- ⽤于 http ⻚面时⽆法抵抗中间人攻击。
- 规则⽐较复杂。
- 影响动态创建脚本的使⽤。

#### HTTP-DNS

即用 `http 协议去解析域名`，从而绕过运营商，避免劫持。

用户在浏览器输入网址，即发出一个 HTTP 请求，首先需要进行域名解析，得到业务服务器的 IP 地址。使用传统 DNS 解析时，会通过当地网络运营商提供的 Local DNS 解析得到结果。域名劫持，即是在请求 Local DNS 解析域名时出现问题，目标域名被恶意地解析到其他 IP 地址，造成用户无法正常使用服务。

解决域名劫持的一个办法就是绕开 Local DNS，通过一个可信的源头来解析域名，解析方式不需要拘泥于 DNS 协议，也可以通过 HTTP 的方式。

### DNS 劫持总结

- 使用 csp 限制外部 js 文件加载
- 使用 http-dns 绕过运营商解析域名

> DNS 劫持是属于违法行为，已经被严厉打击，很少见了。

## 数据劫持

数据劫持基本针对明文传输的内容发生。用户发起 HTTP 请求，服务器返回页面内容时，经过中间的运营商网络，页面内容被篡改或加塞内容，强行插入弹窗或者广告。

### 数据劫持是什么工作的

- http 响应经过运营商时，被加塞或串改内容

### 如何监控数据劫持

行业内解决的办法即是对内容进行 HTTPS 加密，实现密文传输，彻底避免劫持问题。MD5 校验同样能起到防止数据劫持的作用，MD5 校验是指内容返回前，应用层对返回的数据进行校验，生成校验值；同时，内容接收方接收到内容后，也对内容进行校验，同样生成校验值，将这两个校验值进行比对，倘若一致，则可以判断数据无劫持。

:::warning https 也能被运营商劫持
1、伪造证书，通过病毒或者其他方式将伪造证书的根证书安装在用户系统中（较少）

2、代理也有客户的证书与私钥，或者客户端与代理认证的时候不校验合法性，即可通过代理来与我们服务端进行数据交互（较多）
:::

#### Subresource Integrity (SRI)

[Subresource Integrity](https://developer.mozilla.org/zh-CN/docs/Web/Security/子资源完整性) 允许浏览器检查其获得的资源（例如从 CDN 获得的）是否被篡改的一项安全特性。

```html
<script crossorigin="anonymous" integrity=“sha256-+Ec97...E=“ src=“https://a.com"></script>
```

缺点:

- 用于 http ⻚面时⽆法抵抗中间⼈攻击。
- 影响动态创建脚本的使⽤。
- 校验失败时影响可⽤性。
- 兼容性有限， iOS Safari 不支持。

#### HTTP Strict-Transport-Security

[HTTP Strict-Transport-Security](https://developer.mozilla.org/zh-CN/docs/Security/HTTP_Strict_Transport_Security) 是一个安全功能，它告诉浏览器只能通过 HTTPS 访问当前资源，而不是 HTTP。

```http
Strict-Transport-Security: max-age=<expire-time>
```

问题:

- ⽤户的第⼀次访问不受控。

### 数据劫持总结

- 使用 https 加密传输数据，确保内容保密
- 使用 SRI 校验文件一致性
- 使用 Strict-Transport-Security 强制用户使用 https

> 以上方法都只能起到监控数据劫持作用，并不能对劫持后的页面进行修复。

## 基于代码校验的防治⽅案

### 现有方案

- ⽅案 A：在某些省份、地区⾃建监测站，定期抓取固定资源（问题:资源太固定，监测站数量也远远不够）。
- ⽅案 B：业务⽅在⾃己的 html 中监听资源的 error 事件（问题:⽆法确认问题在于链路，也可能只是普通的 js 出错）。
- ⽅案 C：使⽤用第三⽅方企业服务进⾏监控（问题:服务越多成本越⾼）。
- ⽅案 D：CSP、SRI（问题:兼容性和灵活性差，⽆无法进行⾃定义逻辑）。

参考一下美团点评的防治方案：

![基于代码校验的防治⽅案](/blog/dns-hijacking.png)

### 我们的解决方案

- app 端采用 hybrid 方案加载 webview

app 里的 webview 不直接请求一个链接，而是先下载一个 download.zip 文件，解压后 app 内部直接渲染，越过了 http 层面，从而避免数据被劫持。

- 业务代码规范

1、在页面 dom 中定义一个根元素 root，所有的业务代码都在这里，页面渲染完毕后，直接清理掉非 root 元素目录的其他 dom。

2、script 标签打上自定义属性，页面渲染时，把没有打自定义属性的删掉。

3、MutationObserver 监听 dom 插入，如果是非法 js 或 html，则阻止。

- 异常上报
  - 上报是否被套在 iframe。
  - 上报是否有其他代码被插入。
  - 上报被 csp 屏蔽的外部链接。
  - 附带上传客户端 ua 等。

---

参考资料：

[干货！防运营商劫持](https://juejin.im/post/5bea7eb4f265da612859a9e4)
