# 前端登录，这一篇就够了

登录是每个网站中都经常用到的一个功能，在页面上我们输入账号密码，敲一下回车键，就登录了，但这背后的登录原理你是否清楚呢？今天我们就来介绍几种常用的登录方式。

- Cookie + Session 登录
- Token 登录
- SSO 单点登录
- OAuth 第三方登录

## Cookie + Session 登录

HTTP 是一种无状态的协议，客户端每次发送请求时，首先要和服务器端建立一个连接，在请求完成后又会断开这个连接。这种方式可以节省传输时占用的连接资源，但同时也存在一个问题：**_每次请求都是独立的_**，服务器端无法判断本次请求和上一次请求是否来自同一个用户，进而也就无法判断用户的登录状态。

为了解决 HTTP 无状态的问题，_Lou Montulli_ 在 1994 年的时候，推出了 Cookie。

> Cookie 是服务器端发送给客户端的一段特殊信息，这些信息以文本的方式存放在客户端，客户端每次向服务器端发送请求时都会带上这些特殊信息。

有了 Cookie 之后，服务器端就能够获取到客户端传递过来的信息了，如果需要对信息进行验证，还需要通过 Session。

> 客户端请求服务端，服务端会为这次请求开辟一块内存空间，这个便是 Session 对象。

有了 Cookie 和 Session 之后，我们就可以进行登录认证了。

### Cookie + Session 实现流程

Cookie + Session 的登录方式是最经典的一种登录方式，现在仍然有大量的企业在使用。

用户首次登录时：

![](https://cdn.yinhengli.com/image-20200702094538842.png)

1. 用户访问 `a.com/pageA`，并输入密码登录。
2. 服务器验证密码无误后，会创建 SessionId，并将它保存起来。
3. 服务器端响应这个 HTTP 请求，并通过 Set-Cookie 头信息，将 SessionId 写入 Cookie 中。

> 服务器端的 SessionId 可能存放在很多地方，例如：内存、文件、数据库等。

第一次登录完成之后，后续的访问就可以直接使用 Cookie 进行身份验证了：

![](https://cdn.yinhengli.com/image-20200702094559241.png)

1. 用户访问 `a.com/pageB` 页面时，会自动带上第一次登录时写入的 Cookie。
2. 服务器端比对 Cookie 中的 SessionId 和保存在服务器端的 SessionId 是否一致。
3. 如果一致，则身份验证成功。

### Cookie + Session 存在的问题

虽然我们使用 Cookie + Session 的方式完成了登录验证，但仍然存在一些问题：

- 由于服务器端需要对接大量的客户端，也就需要存放大量的 SessionId，这样会导致服务器压力过大。
- 如果服务器端是一个集群，为了同步登录态，需要将 SessionId 同步到每一台机器上，无形中增加了服务器端维护成本。
- 由于 SessionId 存放在 Cookie 中，所以无法避免 CSRF 攻击。

## Token 登录

为了解决 Session + Cookie 机制暴露出的诸多问题，我们可以使用 Token 的登录方式。

> Token 是服务端生成的一串字符串，以作为客户端请求的一个令牌。当第一次登录后，服务器会生成一个 Token 并返回给客户端，客户端后续访问时，只需带上这个 Token 即可完成身份认证。

### Token 机制实现流程

用户首次登录时：

![](https://cdn.yinhengli.com/image-20200702095140936.png)

1. 用户输入账号密码，并点击登录。
2. 服务器端验证账号密码无误，创建 Token。
3. 服务器端将 Token 返回给客户端，由**_客户端自由保存_**。

后续页面访问时：

![](https://cdn.yinhengli.com/image-20200702095402558.png)

1. 用户访问 `a.com/pageB` 时，带上第一次登录时获取的 Token。
2. 服务器端验证 Token ，有效则身份验证成功。

### Token 机制的特点

根据上面的案例，我们可以分析出 Token 的优缺点：

- 服务器端不需要存放 Token，所以不会对服务器端造成压力，即使是服务器集群，也不需要增加维护成本。
- Token 可以存放在前端任何地方，可以不用保存在 Cookie 中，提升了页面的安全性。
- Token 下发之后，只要在生效时间之内，就一直有效，如果服务器端想收回此 Token 的权限，并不容易。

### Token 的生成方式

最常见的 Token 生成方式是使用 JWT（Json Web Token），它是一种简洁的，自包含的方法用于通信双方之间以 JSON 对象的形式安全的传递信息。

上文中我们说到，使用 Token 后，服务器端并不会存储 Token，那怎么判断客户端发过来的 Token 是合法有效的呢？

答案其实就在 Token 字符串中，其实 Token 并不是一串杂乱无章的字符串，而是通过多种算法拼接组合而成的字符串，我们来具体分析一下。

JWT 算法主要分为 3 个部分：header（头信息），playload（消息体），signature（签名）。

header 部分指定了该 JWT 使用的签名算法:

```javascript
header = '{"alg":"HS256","typ":"JWT"}'; // `HS256` 表示使用了 HMAC-SHA256 来生成签名。
```

playload 部分表明了 JWT 的意图：

```javascript
payload = '{"loggedInAs":"admin","iat":1422779638}'; //iat 表示令牌生成的时间
```

signature 部分为 JWT 的签名，主要为了让 JWT 不能被随意篡改，签名的方法分为两个步骤：

1. 输入 `base64url` 编码的 header 部分、 `.` 、`base64url` 编码的 playload 部分，输出 unsignedToken。
2. 输入服务器端私钥、unsignedToken，输出 signature 签名。

```javascript
const base64Header = encodeBase64(header);
const base64Payload = encodeBase64(payload);
const unsignedToken = `${base64Header}.${base64Payload}`;
const key = "服务器私钥";

signature = HMAC(key, unsignedToken);
```

最后的 Token 计算如下：

```javascript
const base64Header = encodeBase64(header);
const base64Payload = encodeBase64(payload);
const base64Signature = encodeBase64(signature);

token = `${base64Header}.${base64Payload}.${base64Signature}`;
```

服务器在判断 Token 时：

```javascript
const [base64Header, base64Payload, base64Signature] = token.split(".");

const signature1 = decodeBase64(base64Signature);
const unsignedToken = `${base64Header}.${base64Payload}`;
const signature2 = HMAC("服务器私钥", unsignedToken);

if (signature1 === signature2) {
  return "签名验证成功，token 没有被篡改";
}

const payload = decodeBase64(base64Payload);
if (new Date() - payload.iat < "token 有效期") {
  return "token 有效";
}
```

有了 Token 之后，登录方式已经变得非常高效，接下来我们介绍另外两种登录方式。

## SSO 单点登录

单点登录指的是在公司内部搭建一个公共的认证中心，公司下的所有产品的登录都可以在认证中心里完成，一个产品在认证中心登录后，再去访问另一个产品，可以不用再次登录，即可获取登录状态。

### SSO 机制实现流程

用户首次访问时，需要在认证中心登录：

![](http://img.mp.itc.cn/upload/20170614/2ada5907404d497bbf782d53eaabe842_th.jpg)

1. 用户访问网站 `a.com` 下的 pageA 页面。
2. 由于没有登录，则会重定向到认证中心，并带上回调地址 `www.sso.com?return_uri=a.com/pageA`，以便登录后直接进入对应页面。
3. 用户在认证中心输入账号密码，提交登录。
4. 认证中心验证账号密码有效，然后重定向 `a.com?ticket=123` 带上授权码 ticket，并将认证中心 `sso.com` 的登录态写入 Cookie。
5. 在 `a.com` 服务器中，拿着 ticket 向认证中心确认，授权码 ticket 真实有效。
6. 验证成功后，服务器将登录信息写入 Cookie（此时客户端有 2 个 Cookie 分别存有 `a.com` 和 `sso.com` 的登录态）。

---

认证中心登录完成之后，继续访问 `a.com` 下的其他页面：

![](http://img.mp.itc.cn/upload/20170614/3b6461683e044057bfad55ef6dc68a5b_th.jpg)

这个时候，由于 `a.com` 存在已登录的 Cookie 信息，所以服务器端直接认证成功。

---

如果认证中心登录完成之后，访问 `b.com` 下的页面：

![](http://img.mp.itc.cn/upload/20170614/5922c26b4d294103a15ad23a4b90a65d_th.jpg)

这个时候，由于认证中心存在之前登录过的 Cookie，所以也不用再次输入账号密码，直接返回第 4 步，下发 ticket 给 `b.com` 即可。

### SSO 单点登录退出

目前我们已经完成了单点登录，在同一套认证中心的管理下，多个产品可以共享登录态。现在我们需要考虑退出了，即：在一个产品中退出了登录，怎么让其他的产品也都退出登录？

原理其实不难，可以回过头来看第 5 步，每一个产品在向认证中心验证 ticket 时，其实可以顺带将自己的退出登录 api 发送到认证中心。

当某个产品 `c.com` 退出登录时：

1. 清空 `c.com` 中的登录态 Cookie。
2. 请求认证中心 `sso.com` 中的退出 api。
3. 认证中心遍历下发过 ticket 的所有产品，并调用对应的退出 api，完成退出。

## OAuth 第三方登录

在上文中，我们使用单点登录完成了多产品的登录态共享，但都是建立在一套统一的认证中心下，对于一些小型企业，未免太麻烦，有没有一种登录能够做到开箱即用？

其实是有的，很多大厂都会提供自己的第三方登录服务，我们一起来分析一下。

![](https://fengkui.net/uploads/article/20180515/5afaf52c64dc9.jpg)

### OAuth 机制实现流程

这里以微信开放平台的接入流程为例：

![](https://res.wx.qq.com/op_res/ZLIc-BdWcu_ixroOT0sBEtk0UwpTewqS6ujxbC2QOpbKIVp_DzleM_C9I-9GPDDh)

1. 首先，`a.com` 的运营者需要在微信开放平台注册账号，并向微信申请使用微信登录功能。
2. 申请成功后，得到申请的 appid、appsecret。
3. 用户在 `a.com` 上选择使用微信登录。
4. 这时会跳转微信的 OAuth 授权登录，并带上 `a.com` 的回调地址。
5. 用户输入微信账号和密码，登录成功后，需要选择具体的授权范围，如：授权用户的头像、昵称等。
6. 授权之后，微信会根据拉起 `a.com?code=123` ，这时带上了一个临时票据 code。
7. 获取 code 之后， `a.com` 会拿着 code 、appid、appsecret，向微信服务器申请 token，验证成功后，微信会下发一个 token。
8. 有了 token 之后， `a.com` 就可以凭借 token 拿到对应的微信用户头像，用户昵称等信息了。
9. `a.com` 提示用户登录成功，并将登录状态写入 Cooke，以作为后续访问的凭证。

## 总结

本文介绍了 4 种常见的登录方式，原理应该大家都清楚了，总结一下这 4 种方案的使用场景：

- Cookie + Session 历史悠久，适合于简单的后端架构，需开发人员自己处理好安全问题。
- Token 方案对后端压力小，适合大型分布式的后端架构，但已分发出去的 token ，如果想收回权限，就不是很方便了。
- SSO 单点登录，适用于中大型企业，想要统一内部所有产品的登录方式。
- OAuth 第三方登录，简单易用，对用户和开发者都友好，但第三方平台很多，需要选择合适自己的第三方登录平台。

![](https://cdn.yinhengli.com/qianduanrizhi_guanzhu.png)
