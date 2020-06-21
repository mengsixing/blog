# 你知道空白网页的颜色是什么吗？

如果下面这段代码，在浏览器中打开。最终的页面颜色是什么？

```html
<html>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

[![It's a CSS trap!](https://res.cloudinary.com/practicaldev/image/fetch/s--IGGIm3Eu--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/c2g4mq0kg4oxd5zmyu99.jpg)](https://res.cloudinary.com/practicaldev/image/fetch/s--IGGIm3Eu--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/c2g4mq0kg4oxd5zmyu99.jpg)



你可能意识到这个是陷阱问题，大部分同学会说是白色，但页面其实并不是白色的: 它是透明的。这是因为浏览器的底色是白色的，我们透过了页面的透明色，看到了浏览器的底色而已。

## 证明页面是无色的

如果我们希望有一个黄色背景的页面，我们可以在 body 上添加一个背景色:

```css
body {
  background-color: yellow;
}
```

![image-20200619092016781](https://cdn.yinhengli.com/image-20200619092016781.png)

我们看到的整个页面背景都是黄色，肯定有同学会认为：这是由于 body 填充了整个视图窗口。

但这不是真的，如果我们在 body 上添加一个边框:

```css
body {
  background-color: yellow;
  border: 3px dashed black;
}
```

![image-20200619092049570](https://cdn.yinhengli.com/image-20200619092049570.png)

您可以看到，其实 body 只包裹了 Hello World 内容区域。

> 为什么整个页面都是黄色的？

我们来看看 [w3c](https://www.w3.org/TR/css-backgrounds-3/#root-background):

> 根元素的背景将成为 canvas 的背景，其背景绘制区域扩展到覆盖整个 canvas。

大白话解释一下：如果你在 body 上设置一个背景。浏览器将使用这个背景作为 canvas 的背景。

问题又来了，什么是 [canvas](https://www.w3.org/TR/css-backgrounds-3/#special-backgrounds) ？

> canvas 是浏览器在渲染页面时，生成的画布，页面上的所有内容都会在画布上进行渲染。

这个 canvas 是相当大的。

尽管 canvas 是浏览器中一个非常重要的部分，但相关的资料却非常少。正如我们看到的，canvas 基于 body，为整个视区(viewport)提供了一个背景。

有很长一段时间，我认为 canvas 就是 body，但是 canvas 只是使用了 body 的信息，canvas 本身可比 body 大得多。

有趣的是，即使我们将 body 设置为黄色，实际上 body 真实的颜色仍然是透明的。 正如 [w3c](https://www.w3.org/TR/css-backgrounds-3/#root-background) 所言:

> 当根元素的背景成为 canvas 的背景后，浏览器将不会再绘制根元素的背景，根元素的背景实际值是透明的。

对于浏览器来说，绘制与 canvas 颜色相同的 body 是没有意义的，这也是它透明的原因。

换句话说：当您在 body 上设置背景色时，您实际上是在设置 canvas 背景。 canvas 从 body 上“偷走”了背景色。

## 影响 Canvas 的根元素

其实影响 canvas 的元素不只 body，还有 html，我们来依次分析一下。

> 先来看看什么是 body 元素？

根据 w3c 的说法，body 是展示内容的地方，包括：文本、图像、颜色、图形等。

如果 body 用来展示内容，那么 body 之外的东西就不能展示内容。

[![Yes, thank you for your input](https://res.cloudinary.com/practicaldev/image/fetch/s--Ot5nbbdO--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/efzd9izbaskuvxw97zgm.gif)](https://res.cloudinary.com/practicaldev/image/fetch/s--Ot5nbbdO--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/efzd9izbaskuvxw97zgm.gif)

所以大家是否会有这样一个疑问：在 html 元素上设置一个背景色不会有任何效果，因为它不是内容的一部分？

我们仔细想一想: 下面这个页面会显示成什么样子？

```css
html {
  background-color: green;
}

body {
  background-color: yellow;
}
```

现在页面的颜色是什么？是黄色还是绿色？还是两者都有？

![image-20200619092123439](https://cdn.yinhengli.com/image-20200619092123439.png)

答案是：两者都有。

当前页面上我们能看到什么？

- body 元素的黄色背景仅限于内容部分。
- html 元素的背景似乎占据了整个视图窗口。

错！我们又一次被愚弄了。

让我们给 html 元素添加边框，看看会发生什么:

![image-20200619092151820](https://cdn.yinhengli.com/image-20200619092151820.png)

所以实际上，html 的行为就像 body 一样：它的大小也是根据页面内容动态渲染的。

> 为什么当前整个页面都是绿色呢？

W3c 给出了同样的答案:

> - 根元素的背景将成为 canvas 的背景。
> - [W3c](https://www.w3.org/TR/css-backgrounds-3/#body-background) 中指的根元素可以是 body 或者 html。

所以，与第一个示例一样，html 真正的颜色是透明的，它的绿色被 canvas “偷走”了。

我们现在有了浏览器用来选择 canvas 颜色的完整算法:

```js
if (html 存在背景颜色) {
  // 使用 html 的背景颜色，作为 canvas 的背景
}
else if (body 存在背景颜色) {
  // 使用 body 的背景颜色，作为 canvas 的背景
}
else {
  // 使用 canvas 的默认透明颜色
}
```

好吧，我想这个谜团解开了。 你可以认为 w3c 这样做是相当聪明的，我们不用给根元素设置明确的尺寸，就能让根元素的背景色填充整个视口。

## 白色和透明色

理解白色和透明之间的区别，是解决一些 css 之谜的关键。

让我们玩一玩 css 中的在混合模式 `mix-blend-mode`。 这个 css 属性允许我们定义一个元素应该如何与它的父元素混合。 有时被称为“浏览器中的 Photoshop”。 不管有没有夸大，这个属性都是非常厉害的。

[![Mix blend mode examples](https://res.cloudinary.com/practicaldev/image/fetch/s--LGs3AKpA--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/dskw2u8s72jwjr8mqmsi.jpg)](https://res.cloudinary.com/practicaldev/image/fetch/s--LGs3AKpA--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/dskw2u8s72jwjr8mqmsi.jpg)

我们从一个简单的示例开始：

```css
h1 {
  color: green;
  mix-blend-mode: difference;
}
```

上面的实例表示，我们通过 `mix-blend-mode` 去改变本来为绿色的 h1 标题， `mix-blend-mode: difference` 意味着将文本的颜色改变成：原始颜色（绿色）与背景颜色之间的混合色值。

between（绿色 + 白色）= 粉红色，所以希望我们的标题是粉红色。

![image-20200619092216000](https://cdn.yinhengli.com/image-20200619092216000.png)

但事实证明，它**不是**粉红色的。

如果背景色是白色的话，混合出来的颜色就是粉红色的，但它不是，证明当前的背景色并不是白色，事实上是透明色。

[![Ah ah!](https://res.cloudinary.com/practicaldev/image/fetch/s--TXJgIIfC--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/8gy1spv4e86tgrrts20v.jpg)](https://res.cloudinary.com/practicaldev/image/fetch/s--TXJgIIfC--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/8gy1spv4e86tgrrts20v.jpg)

between（绿色 + 透明）= 绿色，因此标题的颜色没有变化。

让我们回顾一下:

- body 是透明的
- html 是透明的
- canvas 是透明的（由于没有设置 html 或 body 的背景）

所以我们的 h1 没有什么可以混合的。

解决方法很简单：只需要在 body 上添加一个背景色即可！

```css
body {
  background-color: white;
}
```

它现在起作用了！

![image-20200619092247864](https://cdn.yinhengli.com/image-20200619092247864.png)

让我们再来理一理:

- body 是透明的，它的背景被 canvas 偷走了
- html 是透明的，默认
- canvas 是白色的，它偷走了 body 的颜色

所以我们的绿色标题与 canvas 融合，变成粉红色。 这个标题当然可以是一张图片，一段视频，任何东西。

我们的话题即将结束，但还有最后一个问题。。。

## Canvas 的默认颜色

到目前为止，我们理想中的页面层级（从上到下）是这样的:

- body 元素
- html 元素
- canvas 画布

根据我们所学到的，如果 body 和 html 是透明的，那么画布也是透明的。

> 但是最底层的 canvas 怎么可能是透明的呢？ 如果是这样的话，我们可以通过浏览器看到桌面和其他窗口！

听我说完，如果在下面还有另一层，实际上是白色的呢？

[![There must be another layer](https://res.cloudinary.com/practicaldev/image/fetch/s--HUNrTh0N--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/8pkuwz4cm80w6a23ij8e.jpg)](https://res.cloudinary.com/practicaldev/image/fetch/s--HUNrTh0N--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/8pkuwz4cm80w6a23ij8e.jpg)

[w3c](https://www.w3.org/TR/css-backgrounds-3/#body-background) 再次给出了答案:

> 如果 canvas 背景是透明的，那么所显示的背景是依赖于用户界面（UA-dependent）

用大白话说：在 canvas 后面还有一个用户界面，如果 canvas 是透明的，你可以看到它。你看到什么取决于浏览器。

目前我见过的所有浏览器中，用户界面底层都是白色的。

有什么办法可以真正看出白色和透明 canvas 之间的区别？ 让我们能证明 canvas 默认是透明的吗？

### 通过 Iframe 证明

让我们回到一个非常简单的 css:

```css
html, body {
  border: 3px dashed black;
}
```

我们的页面是这样的:

![image-20200619092457997](https://cdn.yinhengli.com/image-20200619092457997.png)

让我们用 iframe 标签把这个页面包含在另一个页面中:

```html
<iframe src="..." width="100%" height="300px"></iframe>
```

以下是我们得到的结果:

![image-20200619092517445](https://cdn.yinhengli.com/image-20200619092517445.png)

所以，问题是: iframe 是有一个透明的还是白色的 canvas？

我们可以通过在父页面上设置背景色来回答这个问题。

```css
body {
  background-color: lightblue;
}
```

![image-20200619091815769](https://cdn.yinhengli.com/image-20200619091815769.png)

如您所见，**iframe 的 canvas 是透明的**，我们可以透过它看到父页面。

> 它真的能证明 canvas 是透明的吗? 也许 iframe 就是没有 canvas？

这是一个很好的问题，为了回答这个问题，让我们在 iframe 的 body 标签上加上一个白色背景:

```css
body {
  background-color: white;
}
```

以下是我们得到的结果:

![image-20200619091841730](https://cdn.yinhengli.com/image-20200619091841730.png)

如果 iframe 没有 canvas，那么它 body 外部的区域就不会被填充。 但是由于 canvas 机制，body 的背景颜色可以用来覆盖整个 iframe 视区。

这就是为什么我们可以在任何页面上看到，**默认的画布不是白色的，而是透明的**。

所以**当你打开一个空白页面时，你看到的不是一个白色的画布。 它只是浏览器的“底部”** ，是浏览器这个软件的背景色。

[![That's so deep](https://res.cloudinary.com/practicaldev/image/fetch/s--cdV-EL-q--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/o4353if5qaxyjzvnptp8.gif)](https://res.cloudinary.com/practicaldev/image/fetch/s--cdV-EL-q--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/o4353if5qaxyjzvnptp8.gif)

因此，我们得到的浏览器最终的层级是这样的（从上到下）：

- body 元素（默认透明）
- html 元素（默认透明）
- canvas（依赖于html 及body, 默认透明）
- 浏览器的背景（通常是白色的）

用一张三维图来看一下：

[![img](https://res.cloudinary.com/practicaldev/image/fetch/s--Bs7R2Hr9--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/nmtmi70rm29s4e0ogcha.jpg)](https://res.cloudinary.com/practicaldev/image/fetch/s--Bs7R2Hr9--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/nmtmi70rm29s4e0ogcha.jpg)

## 总结

我们通过几段 css 代码，我们发现了浏览器存在一个绘图区 canvas，这个绘图区是非常大的，这个绘图区会受页面根元素的影响：

绘图区域的颜色计算：

- 如果有定义 html 的背景色，则为 html 的背景色。
- 如果没有定义 html 背景色，但有定义 body 的背景色，则为 body 的背景色。
- 如果没有定义 html 和 body 的背景色，则为透明背景色。

最后，如果你对此有任何想法，欢迎留言评论！

![前端日志](https://cdn.yinhengli.com/qianduanrizhi-guanzhu.png)
