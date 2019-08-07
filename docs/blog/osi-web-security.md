# Web 安全

Web 安全是个很大的概念，本篇文章介绍几种常见的攻击方式。

- XSS 攻击
- CSRF 攻击
- 点击劫持
- Web Shell 网站提权渗透
- 网页挂马和流量劫持

## XSS 攻击

恶意攻击者往 Web 页面里插入恶意 script 代码，当用户浏览该页时，嵌入其中 Web 里面的 script 代码会被执行，从而达到恶意攻击用户的目的。

- 非持久型：一般通过修改 URL 参数的方式加入攻击代码，诱导用户访问链接从而进行攻击。
- 持久型：也叫存储型 XSS，主动提交恶意数据到服务器，当其他用户请求后，服务器从数据库中查询数据并发给用户受到攻击。

```html
<!-- 非持久型 http://www.domain.com?name=<script>alert(1)</script> -->
<div>{{name}}</div>
```

```html
<!-- 持久型-->
<img src="xx" onerror="console.log(document.cookie);" />
```

## CSRF 攻击

CSRF（Cross-site request forgery），中文名称：跨站请求伪造，也被称为：one click attack/session riding，缩写为：CSRF/XSRF。

![csrf](osi-web-security-csrf.jpg)

### CSRF 防范

- 低安全级别：被黑客抓包，获取请求地址，直接修改参数。
- 中安全级别：加入验证码，判断 reffer，但这些参数前端都是可以篡改的，这样还会影响用户体验。
- 高安全级别：验证 token，每次动态更新。
- 终极防范： 强验证码 + 动态 token 验证。

### Token

CSRF 攻击之所以能够成功，是因为黑客可以完全伪造用户的请求，该请求中所有的用户验证信息都是存在于 Cookie 中，因此黑客可以直接利用用户自己的 Cookie 来通过安全验证。

要抵御 CSRF，关键在于在请求中放入黑客所不能伪造的信息，并且该信息不存在于 Cookie 之中。可以在 HTTP 请求中以参数的形式加入一个随机产生的 token，并在服务器端建立一个拦截器来验证这个 token，如果请求中没有 token 或者 token 内容不正确，则认为可能是 CSRF 攻击而拒绝该请求。

:::tip 动态 token
每当服务器端验证过 token 之后，便会生成一个新的 token 返给客户端，这样保证客户端手里的 token 只能使用一次，即使 token 被劫持，被劫持到的 token 也已过期，不能使用了。
:::

## 点击劫持

点击劫持是一种视觉欺骗的攻击手段。攻击者将需要攻击的网站通过 iframe 嵌套的方式嵌入自己的网页中，并将 iframe 设置为透明，在页面中透出一个按钮诱导用户点击。

就像一张图片上面铺了一层透明的纸一样，你看到的是黑客的页面，但是其实这个页面只是在底部，而你真正点击的是被黑客透明化的另一个网页。一个简单的点击劫持例子，就是当你点击了一个不明链接之后，自动关注了某一个人的博客或者订阅了视频。[演示](https://blog.csdn.net/qq_32523587/article/details/79613768)

### 点击劫持防御

X-FRAME-OPTIONS 是一个 HTTP 响应头，在现代浏览器有一个很好的支持。这个 HTTP 响应头 就是为了防御用 iframe 嵌套的点击劫持攻击。

该响应头有三个值可选，分别是

- DENY，表示页面不允许通过 iframe 的方式展示。
- SAMEORIGIN，表示页面可以在相同域名下通过 iframe 的方式展示。
- ALLOW-FROM，表示页面可以在指定来源的 iframe 中展示。

我们也可以通过 js 判断页面是否内嵌在 iframe 中，从而进行相应的处理。

```js
// 通过 js 判断是否内嵌在 iframe，如果是，则隐藏页面
if (self !== top) {
  // 删除页面的内容
  var style = document.getElementById('main-container');
  document.body.removeChild(style);
  // 跳回原页面
  top.location = self.location;
}
```

## Web Shell 网站提权渗透

它是以 asp，php，jsp 或者 cgi 等网页文件形式存在的一种命令执行环境，由于 webshell 其大多数是以动态脚本的形式出现，也有人称之为网站的后门工具。

- 编写可执行的 web 脚本文件（木马）。
- 寻找上传漏洞，上传木马文件。
- 找到上传后路径，并执行。
- 安装好中国菜刀，管理木马（获取整个网站的目录了）。

上传木马文件注意事项：

![上传文件扩展名](osi-web-security-1.png)

也可以利用部分服务器的漏洞进行上传。

![上传文件 HTTP 请求伪造](osi-web-security-2.png)

如何防范 Web Shell 网站提权渗透？

- 上传时检测字节码。如果是图片，字节码前面的几个字符是固定的。
- 修改上传文件名。
- 修改静态资源的执行权限。

## 网页挂马和流量劫持

### 网页挂马

网页挂马指的是把一个木马程序部署到一个网站上。具体操作可以先用木马生成器生一个[网马](https://baike.baidu.com/item/%E7%BD%91%E9%A9%AC)，然后再加代码使得木马在打开网页时就运行！

### 流量劫持

流量劫持是什么？简单来说：

- 如果你想访问 A 网站，但实际上打开的是 B 网站，这叫 DNS 劫持。
- 如果你访问 A 网站，但实际上打开的是 A 网站 + 注入的广告，这叫数据劫持。

更多关于流量劫持的文章，可以参考[流量劫持](osi-hijack.html)。

## 相关链接

- [流量劫持](http://fex.baidu.com/blog/2014/04/traffic-hijack/)
