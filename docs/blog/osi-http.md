# 一文串联 HTTP / [0.9 | 1.0 | 1.1 | 2 | 3]

1989 年，万维网诞生之后，HTTP 迅速成为主导世界的应用层协议。在今天，几乎任何场景都或多或少用到了 HTTP 协议。

在 30 多年的历史中，HTTP 协议本身有比较大的发展，同时，还有一些重大的变动也在酝酿之中。这些演化使得这个协议的表现力更强，性能更好，更能满足日新月异的应用需求。本文就来回顾和展望一下 HTTP 的历史和未来。

- HTTP/0.9
- HTTP/1.0
- HTTP/1.1
- HTTP/2
- HTTP/3

## HTTP/0.9

HTTP/0.9 诞生于 [1991](https://www.w3.org/Protocols/HTTP/AsImplemented.html) 年，是 HTTP 协议的最初版，构造十分简单：

- 请求端只支持 GET 请求
- 响应端只能返回 HTML 文本数据

```http
GET /index.html
```

```http
<html>
  <body>
    Hello World
  </body>
</html>
```

请求示意图如下：

![HTTP/0.9](https://cdn.jsdelivr.net/gh/mengsixing/picture/img/image-20210123153342009.png)

可以看到，HTTP/0.9 只能发送 GET 请求，且每一个请求都单独创建一个 TCP 连接，响应端只能返回 HTML 格式的数据，响应完成之后 TCP 请求断开。

这样的请求方式虽然能够满足当时的使用需求，但也还是暴露出了一些问题。

HTTP/0.9 痛点：

- 请求方式唯一，返回格式唯一
- TCP 连接无法复用

## HTTP/1.0

HTTP/1.0 诞生于 [1996](https://www.w3.org/Protocols/HTTP/1.0/spec.html) 年，它在 HTTP/0.9 的基础上，增加了 HTTP 头部字段，极大扩展了 HTTP 的使用场景。这个版本的 HTTP 不仅可以传输文字，还能传输图像、视频、二进制文件，为互联网的迅速发展奠定了坚实的基础。

核心特点如下：

- 请求端增加 HTTP 协议版本，响应端增加状态码。
- 请求方法增加 POST、HEAD。
- 请求端和响应端增加头部字段。
  - Content-Type 让响应数据不只限于超文本。
  - Expires、Last-Modified 缓存头。
  - Authorization 身份认证。
  - Connection: keep-alive 支持长连接，但非标准。

```http
GET /mypage.html HTTP/1.0
User-Agent: NCSA_Mosaic/2.0 (Windows 3.1)
```

```http
200 OK
Date: Tue, 15 Nov 1994 08:12:31 GMT
Server: CERN/3.0 libwww/2.17
Content-Type: text/html

<html>
  <body>
    Hello World
  </body>
</html>
```

请求示意图如下：

![HTTP/1.0](https://cdn.jsdelivr.net/gh/mengsixing/picture/img/image-20210123153409403.png)

可以看到，HTTP/1.0 扩展了请求方法和响应状态码，并且支持定义 HTTP 头部字段，通过 `Content-Type` 头，我们就能传输任何格式的数据了。同时可以看出，HTTP/1.0 仍然是一个请求对应一个 TCP 连接，不能形成复用。

HTTP/1.0 痛点：

- TCP 连接无法复用。
- HTTP 队头阻塞，一个 HTTP 请求响应结束之后，才能发起下一个 HTTP 请求。
- 一台服务器只能提供一个 HTTP 服务。

## HTTP/1.1

HTTP/1.1 诞生于 [1999](https://www.w3.org/Protocols/rfc2616/rfc2616.html) 年，它进一步完善了 HTTP 协议，一直用到了 20 多年后的今天，仍然是使用最广的 HTTP 版本。

核心特点如下：

- 持久连接。
  - HTTP/1.1 默认开启持久连接，在 TCP 连接建立后不立即关闭，让多个 HTTP 请求得以复用。
- 管线化技术。
  - HTTP/1.1 中，多个 HTTP 请求不用排队发送，可以批量发送，这就解决了 HTTP 队头阻塞问题。但批量发送的 HTTP 请求，必须按照发送的顺序返回响应，相当于问题解决了一半，仍然不是最佳体验。
- 支持响应分块。

  - HTTP/1.1 实现了流式渲染，响应端可以不用一次返回所有数据，可以将数据拆分成多个模块，产生一块数据，就发送一块数据，这样客户端就可以同步对数据进行处理，减少响应延迟，降低白屏时间。
  - Bigpipe 的实现就是基于这个特性，具体是通过定义 `Transfer-Encoding` 头来实现的。
- 增加 Host 头。
  - HTTP/1.1 实现了虚拟主机技术，将一台服务器分成若干个主机，这样就可以在一台服务器上部署多个网站了。
  - 通过配置 Host 的域名和端口号，即可支持多个 HTTP 服务： `Host: <domain>:<port>`
- 其他扩展。

  - 增加 Cache-Control、E-Tag 缓存头。
  - 增加 PUT、PATCH、HEAD、 OPTIONS、DELETE 请求方法。

```http
GET /en-US/docs/Glossary/Simple_header HTTP/1.1
Host: developer.mozilla.org
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20100101 Firefox/50.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://developer.mozilla.org/en-US/docs/Glossary/Simple_header
```

```http
200 OK
Connection: Keep-Alive
Content-Encoding: gzip
Content-Type: text/html; charset=utf-8
Date: Wed, 20 Jul 2016 10:55:30 GMT
Etag: "547fa7e369ef56031dd3bff2ace9fc0832eb251a"
Keep-Alive: timeout=5, max=1000
Last-Modified: Tue, 19 Jul 2016 00:59:33 GMT
Server: Apache
Transfer-Encoding: chunked
Vary: Cookie, Accept-Encoding

<html>
  <body>
    Hello World
  </body>
</html>
```

请求示意图如下：

![HTTP/1.1](https://cdn.jsdelivr.net/gh/mengsixing/picture/img/image-20210123153508087.png)

可以看到，HTTP/1.1 可以并行发起多个请求，并且也能复用同一个 TCP 连接，传输效率得到了提升。但响应端只能按照发送的顺序进行返回，为此很多浏览器会为每个域名至多打开 6 个连接，用增加队列的方式减少 HTTP 队头阻塞。

HTTP/1.1 痛点：

- HTTP 队头阻塞没有彻底解决，响应端必须按照 HTTP 的发送顺序进行返回，如果排序靠前的响应特别耗时，则会阻塞排序靠后的所有响应。

## HTTP/2

HTTP/2 诞生于 [2015](https://tools.ietf.org/html/rfc7540) 年，它的最大的特点是 All in 二进制，基于二进制的特性，对 HTTP 传输效率进行了深度优化。

HTTP/2 将一个 HTTP 请求划分为 3 个部分：

- 帧：一段二进制数据，是 HTTP/2 传输的最小单位。
- 消息：一个请求或响应对应的一个或多个帧。
- 数据流：已建立的连接内的双向字节流，可以承载一条或多条消息。

![HTTP/2 数据流、消息和帧](https://cdn.jsdelivr.net/gh/mengsixing/picture/img/streams_messages_frames01.svg)

图中可以看到，一个 TCP 连接上有多个数据流，一个数据流承载着双向消息，一条消息包含了多个帧，每个帧都有唯一的标识，指向所在的数据流，来自不同数据流的帧可以交错发送，然后再根据每个帧头的数据流标识符重新组装，这样就实现了数据传输。

HTTP/2 核心特点如下：

- 请求优先级
  - 多个 HTTP 请求同时发送时，会产生多个数据流，数据流中有一个优先级的标识，服务器端可以根据这个标识来决定响应的优先顺序。
- 多路复用
  - TCP 传输时，不用按照 HTTP 的发送顺序进行响应，可以交错发送，接收端根据帧首部的标识符，就能找到对应的流，进而重新组合得到最终数据。
- 服务器端推送
  - HTTP/2 允许服务器未经请求，主动向客户端发送资源，并缓存到客户端中，以避免二次请求。
  -  HTTP/1.1 中请求一个页面时，浏览器会先发送一个 HTTP 请求，然后得到响应的 HTML 内容并开始解析，如果发现有 `<script src="xxxx.js">` 标签，则会再次发起 HTTP 请求获取对应的 JS 内容。而 HTTP/2 可以在返回 HTML 的同时，将需要用到的 JS、CSS 等内容一并返回给客户端，当浏览器解析到对应标签时，也就不需要再次发起请求了。
- 头部压缩
  - HTTP/1.1 的头部字段包含大量信息，而且每次请求都得带上，占用了大量的字节。
  - HTTP/2.0 中通信双方各自缓存一份头部字段表，如：把 `Content-Type:text/html` 存入索引表中，后续如果要用到这个头，只需要发送对应的索引号就可以了。

除此之外，虽然 HTTP/2 没有规定必须使用 TLS 安全协议，但所有实现 HTTP/2 的 Web 浏览器都只支持配置过 TLS 的网站，这是为了鼓励大家使用更加安全的 HTTPS。

请求示意图如下：

![HTTP/2](https://cdn.jsdelivr.net/gh/mengsixing/picture/img/image-20210123153541231.png)

可以看到，在 HTTP/2 中发送请求时，既不需要排队发送，也不需要排队返回，彻底解决了 HTTP 队头阻塞问题。对于头部信息，资源缓存等痛点也进行了优化，似乎已经是一种很完美的方案了。

HTTP/2 在 HTTP + TCP 的架构上已经优化到了极致，如果要想继续优化，那就只能从这个架构入手了。

首先需要优化的是 TCP，因为 TCP 核心是保证传输层的可靠性，传输效率其实并不好。

- TCP 也存在队头阻塞，TCP 在传输时使用序列号标识数据的顺序，一旦某个数据丢失，后面的数据需要等待这个数据重传后才能进行下一步处理。
- TCP 每一次建立都需要三次握手，释放连接需要四次挥手，无形中增加了传输时长。
- TCP 存在拥塞控制，内置了慢启动，拥塞避免等算法，传输效率并不稳定。

如果要解决这些问题，就需要替换掉 TCP，而这也是 HTTP/3 的解决思路，我们接着往下看。

## HTTP/3

HTTP/3 目前还在草案阶段，它的主要特点是对传输层进行了优化，使用 QUIC 替换 TCP，彻底规避了 TCP 传输的效率问题。

QUIC 由 Google 提出的基于 UDP 进行多路复用的传输协议。QUIC 没有连接的概念，不需要三次握手，在应用程序层面，实现了 TCP 的可靠性，TLS 的安全性和 HTTP2 的并发性。在设备支持层面，只需要客户端和服务端的应用程序支持 QUIC 协议即可，无操作系统和中间设备的限制。

HTTP/3 核心特点如下：

- 传输层连接更快。

  - HTTP/3 基于 QUIC 协议，可以实现 0-RTT 建立连接，而 TCP 需要 3-RTT 才能建立连接。

![HTTPS 及 QUIC 建连过程](https://cdn.jsdelivr.net/gh/mengsixing/picture/img/v2-b4b3eb89464b192eed0304e5647a2d26_1440w.jpg)

- 传输层多路复用。
  - HTTP/3 传输层使用 QUIC 协议，数据在传输时会被拆分成了多个 packet 包，每一个 packet 包都可以独立、交错发送，不用按顺序发送，也就避免了 TCP 队头阻塞。

  ![QUIC 多路复用](https://cdn.jsdelivr.net/gh/mengsixing/picture/img/v2-9e649330ab729b6438a8586c8b4f1bd3_1440w.jpg)

  上图中的 Stream 之间相互独立，如果 Stream2 丢了一个 Pakcet，不会影响 Stream3 和 Stream4 正常读取。

- 改进的拥塞控制。
  - **单调递增的 Packet Number**。在 TCP 中，每一个数据包都有一个序列号标识（seq），如果接收端超时没有收到，就会要求重发标识为 seq 的包，如果这时超时的包也接收到了，则无法区分哪个是超时的包，哪个是重传的包。QUIC 中的每一个包的标识（Packet Number）都是单调递增的，重传的 Packet Number 一定大于超时的 Packet Number，这样就能区分开了。
  - **不允许 Reneging**。在 TCP 中，如果接收方内存不够或 Buffer 溢出，则可能会把已接收的包丢弃（Reneging），这种行为对数据重传产生了很大的干扰，在 QUIC 中是明确禁止的。在 QUIC 中，一个包只要被确认，就一定是被正确接收了。
  - **更多的 ACK 块**。一般来说，接收方收到发送方的消息后都会发送一个 ACK 标识，表示收到了数据。但每收到一个数据就发送一个 ACK 效率太低了，通常是收到多个数据后再统一回复 ACK。TCP 中每收到 3 个数据包就要返回一个 ACK，而 QUIC 最多可以收到 256 个包之后，才返回 ACK。在丢包率比较严重的网络下，更多的 ACK 块可以减少重传量，提升网络效率。
  - **Ack Delay**。TCP 计算 RTT 时没有考虑接收方处理数据的延迟，如下图所示，这段延迟即 ACK Delay。QUIC 考虑了这段延迟，使得 RTT 的计算更加准确。

  ![Ack Delay](https://cdn.jsdelivr.net/gh/mengsixing/picture/img/image-20210130144400332.png)

- 优化的流量控制。

  - TCP 通过滑动窗口来控制流量，如果某一个包丢失了，滑动窗口并不能跨过丢失的包继续滑动，而是会卡在丢失的位置，等待数据重传后，才能继续滑动。
  - QUIC 流量控制的核心是：**不能建立太多的连接，以免响应端处理不过来；不能让某一个连接占用大量的资源，让其他连接没有资源可用**。为此 QUIC 流量控制分为 2 个级别：连接级别（Connection Level）和 Stream 级别（Stream Level）。
    - Stream 级别的流量控制中，`接收窗口 = 最大接收窗口- 已接收数据`。
    - Connection 级别的流量控制中，`接收窗口 = Stream1接收窗口 + Stream2接收窗口 + ... + StreamN接收窗口`。

- 加密认证的报文

  - TCP 头部没有经过任何加密和认证，在传输过程中很容易被中间网络设备篡改，注入和窃听。
  - QUIC 中报文都是经过加密和认证的，在传输过程中保证了数据的安全。

- 连接迁移

  - TCP 连接是由（源 IP，源端口，目的 IP，目的端口）组成，这四者中一旦有一项发生改变，这个连接也就不能用了。如果我们从 5G 网络切换到 WiFi 网络，IP 地址就会改变，这个时候 TCP 连接也自然断掉了。
  - QUIC 使用客户端生成的 64 位 ID 来表示一条连接，只要 ID 不变，这条连接也就一直维持着，不会中断。

- 前向纠错机制

  - QUIC 中发送数据时，除了发送本身的数据包，还会发送验证包，以减少数据丢失导致的重传。
  - 例如：
    - 发送端需要发送三个包，QUIC 在传输时会计算出这三个包的异或值，并单独发出一个校验包，也就是总共发出了四个包。
    - 如果某一个包（非校验包）传输时丢失了，则可以通过另外三个包计算出丢失数据包的内容。
    - 当然这种技术只能用在丢失一个包的情况下，如果丢失了多个包，就只能进行重传了。

可以看出，QUIC 丢掉了 TCP 的包袱，基于 UDP，实现了一个安全高效可靠的 HTTP 通信协议。凭借着 0-RTT 建立连接、传输层多路复用、连接迁移、改进的拥塞控制、流量控制等特性，QUIC 在绝大多数场景下获得了比 HTTP/2 更好的效果，HTTP/3 真是未来可期。

## 思考与总结

本文通过互联网发展历史，从 HTTP/0.9 到 HTTP/3，逐步介绍了每个版本的核心特点，最后再分别一句话总结一下。

- HTTP/0.9 实现基本请求响应。
- HTTP/1.0 增加 HTTP 头，丰富传输资源类型，奠定互联网发展基础。
- HTTP/1.1 增加持久连接、管线化、响应分块，提升了 HTTP 传输效率。
- HTTP/2 采用二进制传输格式，通过 HTTP 多路复用、头部压缩、服务器端推送，将传输效率在 HTTP + TCP 架构上发挥到了极致。
- HTTP/3 将传输层替换为 QUIC，通过改进的拥塞控制、流量控制、0-RTT 建连、传输层多路复用、连接迁移等特性，进一步提升了 HTTP 传输效率。

可以看到，从 HTTP/1.1 开始，HTTP 的发展方向就是：不断地提升传输效率。期待未来的 HTTP 能够给我们带来更加快速的传输体验。

![](https://cdn.jsdelivr.net/gh/mengsixing/picture/img/qianduanrizhi2021.png)
