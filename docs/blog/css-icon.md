# 网站图标开发指南

图标是网站中非常友好的附加物，许多网站都会使用各种图标来美化页面样式，给用户提供更好的指引。本文将会和大家一起学习页面图标的发展历史，以及最优的解决方案。

![](http://www.5icool.org/uploadfile/2010/0720/20100720094739885.png)

- 传统图标
- 字体图标
- SVG 图标

## 传统图标

编写图标最简单的方式就是使用一张图片，如：

```html
<html>
  <body>
    图标 <img src="xxx.png" />
  </body>
</html>
```

在我刚开始写页面的时候就是这样做的，感觉 so easy，直到业务变得越来越复杂，我就不得不思考以下几个问题：

- 图标需要适配多个客户端
- 图标太多需要优化
- 图标需要动态修改颜色

对于适配多个客户端的问题，设计师们通常都会给我们提供多个尺寸的设计图（@1x 图、@2x 图），于是我们就可以根据不同的客户端来选择对应尺寸的图片。

通常使用方式是：**媒体类型** 或 **配置 srcset** 。

例如：

```html
<html>
  <head>
    <style>
      /* 使用媒体查询，为每个端适配不同尺寸的图片 */
      .@media screen and (max-width: 300px) {
        .img {
          background-image: url("1x.png");
        }
      }
      .@media screen and (max-width: 600px) {
        .img {
          background-image: url("2x.png");
        }
      }
    </style>
  </head>
  <body>
    <!-- srcset 可以让不同的客户端自动匹配合适尺寸的图片-->
    <!-- 如：当设备像素比为 2 时，浏览器会自动选择 2x 图进行渲染-->
    <img src="1x.png" srcset="1x.png 1x, 2x.png 2x" />
  </body>
</html>
```

通过上面的方法，多客户端适配问题解决了，但我们使用了多张内容相同、尺寸不同的图标，这无疑增加了图片的数量。

随着图片的增多，图片管理就是一个问题。每一张图片都会发起一个 HTTP 请求，而浏览器并行加载同一域名下的请求是有限制的，太多的图片无法全部并行加载，就会进行排队加载，排在后面的图片也就不能及时得到渲染。

通常，解决大量图片 HTTP 请求，有以下两种方式：

- 雪碧图
- Base64 图

雪碧图指的是，将所有小图片合并成一张大图片。在浏览器渲染时，这张大图片只需要发起一次 HTTP 请求，然后就被浏览器缓存起来了，当再次使用该图片时，就会直接从缓存中进行读取，从而避免了发起多次 HTTP 请求。

首先，我们需要将许多小图片合成一张大图：

![](https://imgedu.lagou.com/1837519-20191107151128254-1992912590.png)

然后在 CSS 中进行定位。

```css
.icon1,
.icon2,
.icon3 {
  width: 54px;
  height: 54px;
  background: url("../大图.png");
}
/* 定位背景图，让图片显示到对应的位置 */
.icon1 {
  background-position: -168px 0px;
}
.icon2 {
  background-position: -56px 0px;
}
.icon3 {
  background-position: 0px 0px;
}
```

可以看到，使用雪碧图布局时，所有的图片都使用了同一张大图，然后使用背景图去定位，以区分不同的小图标。

总结一下雪碧图的特点：

- 只需发起一次 HTTP 请求。
- 只能通过 CSS 背景图渲染。
- 如果只用到了大图中的一张小图，也必须加载整张大图，有点浪费资源。
- 不利于维护，每次新增图标时，都不能影响到之前已经排好的图标，所以生活工具需要更智能。

接下来，我们看一下 Base64 图：

Base64 图指的是，将一张图片数据编码成一串字符串，并使用该字符串代替图像地址。

```html
<img
  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAkCAYAAABIdFAMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHhJREFUeNo8zjsOxCAMBFB/KEAUFFR0Cbng3nQPw68ArZdAlOZppPFIBhH5EAB8b+Tlt9MY"
/>
```

可以看到，图片的 src 并不是一个地址，而是一个字符串，这样甚至可以不发起 HTTP 请求，就能渲染图片。

> Base64 的原理是 [Data URLs](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/data_URIs)，即：前缀为 `data:` 协议的 URL，允许开发者向 HTML 中嵌入小文件。

总结一下 Base64 图的特点：

- 无 HTTP 请求。
- 图片内容由字符串表示，通常会很长，这会增加 HTML 的大小。
- Base64 并不是 url，所以不能进行缓存。
- 适用于极小的图片，如：1x1 的小图，用作背景图，重复渲染平铺整个页面。

Ok，我们来总结一下传统图片画图标的几种方式：

![](https://cdn.yinhengli.com/image-20200823163554849.png)

最后剩下动态修改图片颜色的问题，这个就比较难控制了，可以用 CSS Filter 去做滤镜，通过调整图片的模糊度、对比度、灰度、透明度等，间接地改变图片颜色。

例如：

```css
img {
  // 让图片变灰
  filter: grayscale(100%);
  // 让图片变模糊
  filter: blur(5px);
  // ...
}
```

但是 CSS Filter 能修改的颜色是有限的，如果想任意修改图标颜色，我们继续往下看。

## 字体图标

随着互联网的不断发展，字体图标逐渐来到了我们的视野，它可以像处理文字一样去处理图标，大大地提高了图标的灵活性。使用字体图标可以非常轻松地修改图标颜色。

### 字体图标的使用方式

字体图标使用方式特别方便，我们只需要在页面中引入对应的字体文件，然后编写对应的字符就可以了。

字体图标有两种写法：

- 直接编写 Unicode 编码。
- 使用伪类去写 Unicode 编码。

例如：

```html
<html>
  <head>
    <style>
      /* 首先引入字体文件 */
      @font-face {
        font-family: "iconfont";
        src: url("iconfont.eot"), url("iconfont.woff") format("woff"), url("iconfont.ttf")
            format("truetype"), url("iconfont.svg#iconfont") format("svg");
      }
      /* 定义字体类 */
      .iconfont {
        font-family: "iconfont";
        font-size: 16px;
      }
      /* 在伪类中编写 unicode 字符 */
      .icon-edit:before {
        content: "\e603";
      }
    </style>
  </head>
  <body>
    <!-- 使用 &# + unicode 编码可以渲染对应的字符。 -->
    直接使用字符编码：
    <i class="iconfont">&#xe603;</i> 使用类名渲染（将字符写在了伪类中）：<i
      class="iconfont icon-edit"
      style="color:red"
    ></i>
  </body>
</html>
```

可以看到，有了字体图标后，我们可以像处理文字一样去修改图标的颜色。

### 字体图标的原理

字体图标的本质是一种字符，而字符又是字体渲染出来的，字体决定了我们在键盘上敲打的字符最终在页面上长什么样。

这就好比书法家写字，不同的字体就是不同的书法家，不同的书法家虽然都在写同一个字，但是由于字迹的不同，写出来的文字也就大不相同。

![](https://bpic.588ku.com/element_water_pic/19/04/10/2d684d157ba90e8c6851e3a565d53491.jpg)

试想一下：有一个特立独行的书法家，他并不按照常规的写法来写字，他写出来的字都是一个个的小图标，那不就是字体图标了吗 😄

其实，书法家写字这个道理，在网页中也是一样的。

页面在渲染文字的时候，会先将文字转换为对应的 unicode 编码，然后根据 css 中配置的 `@font-face url` 找到对应的字体文件（eot ttf woff 等），接下来在该字体文件中找到这个 unicode 编码对应的绘制外形，最后绘制在页面上。

```js
我们看到的内容 = fontFamily(unicode);
```

#### 深入字符编码

在计算机中，我们能看到的所有字符，底层都是用二进制来表示的，如：空格符在二进制中就是 `00100000`，大写的字母 `A` 在二进制中就是 `01000001` 。

为了方便维护字符和二进制的关系，前辈们将这些对应关系记录成一张表，如：

| ID  | 字符   | 二进制   |
| --- | :----- | -------- |
| 32  | 空格符 | 00100000 |
| 65  | A      | 01000001 |

这个表就是我们常说的字符编码，上表即 ASCII 编码的一部分。

最初的 ASCII 编码只能表示 128 个符号，主要存储的是 26 个英文字母的大小写和数字等。有了 ASCII 编码后，我们就能编写对应的字体去渲染表中的字符了，但其他没有被记录的符号也就无法显示了，如：不同国家的汉字、emoji 符号等。

为了解决中文字符编码问题，国家制定了 GB2312 编码，该编码收录了 6763 个汉字，涵盖了中国大陆 99.75% 的使用频率，能满足绝大多数的汉字需求。

但 GB2312 编码只适用于中文，而世界上还有 200 多个国家，他们也有自己独特的文字，难道每一个国家都需要自制一套字符编码吗？

其实不用，在 1991 年 10 月，诞生了 unicode 编码，它制定了一套统一的编码标准，收纳了世界上所有国家的文字符号，到目前为止，已经有 100 多万个符号。

> unicode 最多 4 个字节，一个字节 8 个比特位（表示二进制中的 0 或 1），也就是 `2**32` 个状态，完全可以容纳世界上所有的符号。

所以，任何一个符号，都可以在 unicode 编码中被找到。

总结一下字体图标的特点：

- 字体图标是矢量图，即使放大也不会变模糊。
- 字体图标可以通过 CSS 样式进行控制，使用更加灵活。
- 字体文件一般比较大，但可以将不用的字体删掉。[删除字体中没有用到的汉字](https://www.fontke.com/tool/subfont/)

最后，字体图标虽好，但它的本质仍然一种文字，所以 CSS 在设置 color 时只能选一种颜色，如果我们想制作一个多色的小图标，也就无能为力了。

## SVG 图标

SVG 诞生于 1999 年，目的是用来绘制矢量图形，它主要通过定义必要的线和形状来创建一个图形。

### SVG 图标使用方式

SVG 采用 XML 格式的语法来画图，例如：

```html
<html>
  <head>
    <style>
      .my-style {
        /* 控制填充色 */
        fill: red;
      }
      .my-style use {
        color: orange;
      }
    </style>
  </head>
  <body>
    <svg style="display: none;">
      <symbol viewBox="0 0 24 24" id="heart">
        <path
          d="M17,0c-1.9,0-3.7,0.8-5,2.1C10.7,0.8,8.9,0,7,0C3.1,0,0,3.1,0,7c0,6.4,10.9,15.4,11.4,15.8 c0.2,0.2,0.4,0.2,0.6,0.2s0.4-0.1,0.6-0.2C13.1,22.4,24,13.4,24,7C24,3.1,20.9,0,17,0z"
        ></path>
      </symbol>
    </svg>

    <svg class="my-style">
      <use xlink:href="#heart" />
    </svg>
  </body>
</html>
```

可以看到，首先我们把需要使用的图标封装到 symbol 标签中，在使用时只需要 use 一下就可以了。这跟我们定义一个 CSS class 然后再去 HTML 中引用是一个道理。

通常的 SVG 图标库会把所有用到的图标封装到一个 JS 文件中，我们只需要引入这个 JS 文件，然后就能直接 use 对应的图标了。

我们再看一个多色图标的例子：

```html
<html>
  <head>
    <style>
      /* svg 中的元素存在于 shadom 中，可以通过自定义变量传递参数 */
      .icon {
        width: 100px;
        height: 100px;
        margin-right: 10px;
      }
      .icon--fill {
        fill: grey;
      }
      .icon--color {
        fill: #ef5b49;
        --handle-color: #c13127;
        --cup-color: #ef5b49;
        --smoke-color: #cacaea;
      }
      .icon--color-alt {
        fill: #2f3fff;
        --handle-color: #1f2bac;
        --cup-color: #2f3fff;
        --smoke-color: #a5acbd;
      }
    </style>
  </head>
  <body>
    <svg xmlns="http://www.w3.org/2000/svg" class="hidden">
      <symbol id="icon-coffee" viewBox="0 0 20 20">
        <title>icon-coffee</title>
        <!-- 使用自定义变量 -->
        <path
          fill="var(--handle-color)"
          d="M15,17H14V9h3a3,3,0,0,1,3,3h0A5,5,0,0,1,15,17Zm1-6v3.83A3,3,0,0,0,18,12a1,1,0,0,0-1-1Z"
        />
        <rect
          fill="var(--cup-color)"
          x="1"
          y="7"
          width="15"
          height="12"
          rx="3"
          ry="3"
        />
        <path
          fill="var(--smoke-color)"
          d="M7.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,0,1-1.79.89Z"
        />
        <path
          fill="var(--smoke-color)"
          d="M3.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,1,1-1.79.89Z"
        />
        <path
          fill="var(--smoke-color)"
          d="M11.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,1,1-1.79.89Z"
        />
      </symbol>
    </svg>
    使用
    <svg class="icon icon--color" aria-hidden="true">
      <use xlink:href="#icon-coffee" href="#icon-coffee" />
    </svg>
  </body>
</html>
```

可以看到，SVG 和 HTML 一样具有树形结构，结构中的 path 都是图形中的一个区域，这些区域可以被 CSS 选择器匹配到。当我们匹配到对应的区域时，就能进行对应的颜色修改了，一张多色的 SVG 图也就做好了。[案例](https://codepen.io/sarahdayan/pen/GOzaEQ)

![](https://cdn.yinhengli.com/image-20200826222025988.png)

总结一下 SVG 图标的特点：

- 支持动态修改多个区域的颜色
- 支持渐变色
- 矢量图，放大也不会变模糊

## 思考与总结

本文介绍了 3 种小图标的使用方式，这里做一个简单回顾。

- 传统图标，简单粗暴，切好图就能用，但需考虑不同尺寸以兼容不同设备，图片的颜色不好更改。
- 字体图标，需要引入字体文件，然后编写特定的字符，可以很方便的修改颜色，但只能是单色。
- SVG 图标，需要引入预先定义好图标的 SVG 文件，然后将具体的图标 use 出来即可，可以分别修改图标中不同部位的颜色。

总体来说，3 种图标使用起来都很简单，而 SVG 图标则是一个大趋势，我们可以视具体情况来做选择。

![](https://cdn.yinhengli.com/qianduanrizhi_guanzhu.png)
