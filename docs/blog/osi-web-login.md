# Web 登录鉴权

Web 登录鉴权，是 web 中很重要的一个环节，下面介绍一下常用的几种方式。

- Session + Cookie
- Token
- 单点登录 SSO
- 第三方登录 OAuth

## Session + Cookie

Http 本身是无状态协议，在每次请求时，服务器端无法确定请求者是否是同一个用户，为了解决这个问题，我们可以使用 Session + Cookie 的模式进行校验。

### Session + Cookie 实现流程

1、用户登录

2、服务器端验证登录成功，创建 sessionId，保存到服务器端。

3、服务器端将 sessionId 写入 cookie 中。

4、客户端请求时带上 cookie，cookie 中包含 sessionId。

5、服务器端验证 sessionId，验证成功则识别成功。

### Session 机制遇到的问题

1、服务器端需要存放大量的 sessionId，服务器压力大。

2、服务器端集群时，sessionId 难以共享，sessionId 拷贝难度大。

3、可以使用 redis 等服务器共享 sessionId，但需要一定的成本。

4、因为 sessionId 存放在 cookie 中，所以无法避免 csrf 攻击。

## Token

为了解决 session 机制暴露出的诸多问题，我们可以使用 token 机制进行校验。

### Token 机制实现流程

1、用户登录。

2、服务器端验证登录成功，创建 token（包含过期时间，加密数据等）。

3、服务器端将 token 返回给客户端，由**客户端自由保存**。

4、客户端请求时带上 token。

5、服务器端解密 token，验证过期时间等，验证有效则识别成功。

### Token 机制的优点

1、服务器端不需要存放 token，每次请求根据 token 算法检查 token 合法性。

2、不需要 redis 等服务器，对服务器集群无任何影响。

3、token 可以不存放在 cookie 中，安全性能高。

4、使用动态 token，进一步加强安全性（会增大服务器端压力）。

### 创建 Token

创建 Token 最常用的方式是 JWT(json web token)。JWT 主要分为 3 个部分：header，playload，signature，其中 signature 是通过 header 和 playload 数据以及 header 中的加密算法得到的，服务器端通过这样的验证，可验证 token 是否被篡改。

signature 算法如下：

```js
HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret); // 服务器私钥，防止被破解
```

JWT 的优点如下：

- 因为 JSON 的通用性，所以 JWT 是可以进行跨语言支持的。
- 降低服务器端维护成本，服务器端不需要存放大量的 session 信息。
- JWT 可以在自身存储一些其他业务逻辑所必要的非敏感信息(payload 部分)。
- JWT 的构成非常简单，字节占用很小，所以它是非常便于传输的。

## 单点登录 SSO

单点登录是指在公司内部搭建一个公共的认证中心，公司下的所有产品的登录都需要在认证中心里完成，在一个产品下登录后，访问另一个产品，登录态不会消失。

### 单点登录机制实现流程

1、登录网站 `a.company.com`。

2、重定向到认证中心登录，带上回调地址`www.sso.com?return_uri=A.com/callback`。

3、输入认证中心账号密码，提交登录。

4、登陆后被重定向 `a.company.com?ticket=123` 带上授权码 ticket，并将认证中的的登录态写入 cookie。

5、重定向 `a.company.com?ticket=123` 后，服务器使用 ticket 向认证中心验证，判断是否已登录。

6、验证成功后服务器将登录信息写入 cookie（这时客户端有 2 个 cookie 分别存有 `a.company.com` 和认证中心的登录态）。

7、再次访问 `a.company.com` 下的页面时，因为保存有 `a.company.com` 的 cookie 信息，服务器直接认证成功。

8、访问 `b.company.com` 时，由于保存的有认证中心的 cookie，所以也不用再次输入账号密码，直接返回第 4 步。

首次登录流程图如下：

![首次登录](osi-web-login-sso1.jpeg)

登录同域下的网站：

![登录同域下的网站](osi-web-login-sso2.jpeg)

登录不同域下的网站：

![登录不同域下的网站](osi-web-login-sso3.jpeg)

## 第三方登录 OAuth

使用单点登录的方式，得我们自己部署一套登录认证中心，对于小型企业未免太麻烦了，其实，还可以大厂提供的第三方服务授权，进行身份验证。

### OAuth 机制实现流程

1、登录网站 `a.com`。

2、重定向到网易授权登录，带上回调地址 `www.163.com?appid=xxx&return_uri=a.com/callback`。

3、在网易中会带上具体授权的类型（可自定义选择权限），然后输入网易账号和密码，提交登录。

4、登陆后被重定向会 `a.com?code=123` 带上一个授权码 code。

5、接下来 `a.com` 会根据 code，去请求网易服务器，获取网易颁发的 token。

6、接下来 `a.com` 直接使用 token 去网易服务器获取数据。

7、登录成功。

具体的登录流程如下：

![第三方登录](osi-web-login-oauth.jpg)

## 总结

这一章介绍了 4 中常见的登录校验方式，如果你正在考虑自己网站的登录验证，不妨做个参考。

## 参考链接

[JSON Web Token 入门教程](http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)
