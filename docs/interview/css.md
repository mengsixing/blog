# CSS 面试题

## 1、CSS 选择器的优先级是什么

每一个选择器都有一个权重，被匹配的元素可能受到多个选择器的影响，就会进行权重叠加，权重最高的选择器中的 css 代码会被优先使用。

- 内联样式权重：1000
- id 选择器权重：0100
- 类选择器，属性选择器，伪类选择器权重：0010
- 元素选择器，伪元素选择器权重：0001
- 通配选择器 \*，子选择器 >，相邻选择器 +。权重：0000

## 2、说说 BFC，什么情况下会生成 BFC

BFC 生成了一套封闭的布局空间，内部子元素无论怎么布局，都不会影响到外部的元素。BFC 可以用来**清除浮动**，**防止 margin 重叠**，**去除 float 文字环绕**，**第一个子元素 margin-top 和父元素重叠**等。

以下几种元素会生成 BFC：

- html 元素。
- float 不是 none 的元素。
- overflow: auto/hidden/scroll 的元素。
- display: table-cell/inline-block 的元素。
- position 不是 static 和 relative 的元素。

## 3、CSS 的层叠上下文是什么

层叠上下文是 HTML 中的一个三维的概念，每个层叠上下文中都有一套元素的层叠排列顺序。页面根元素天生具有层叠上下文，所以整个页面处于一个“层叠结界”中。

层叠上下文的创建：

- 页面根元素：`html`
- z-index 值为数值的定位元素
- 其他 css 属性
  - opacity 不是 1
  - transform 不是 none
  - flex，z-index 不是 auto

层叠上下文中的排列规则，从下到上：

![CSS 层叠上下文](interview-css.png)

- background/border
- 负 z-index
- block 块状水平盒子
- float 浮动盒子
- inline 水平盒子
- z-index:auto, 或看成 z-index:0
- 正 z-index

由此引申出：定位元素的`z-index：0`和`z-index：auto`的区别是，前者会创建层叠上下文，影响布局。

## 4、flex:1 是什么单位的缩写

flex 是 flex-grow、flex-shrink、flex-basis 的缩写。

- flex-grow 属性定义项目的放大比例，默认为 0，即如果存在剩余空间，也不放大。
- flex-shrink 属性定义了项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小。
- flex-basis 属性定义了在分配多余空间之前，项目占据的主轴空间，默认为 auto。

```css
.item {
  flex: 1;
}
/* 相当于 */
.item {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0%;
}
```

## 5、垂直居中的方案

1、未知元素宽高，可以使用 position:absolute + transform:translate(-50%,-50%)

2、已知元素宽高，可以使用 position:absolute + margin: -10px 0 0 -10px;

3、使用 table-cell ，vertical-align:middle

4、绝对定位，left:0 ;right:0;top:0;bottom:0;

5、使用 flex 布局。

## 6、CSS3 有什么新特性

- 选择器增加，:not(p)，p:empty 等
- 背景 background 扩展，background-clip 规定背景绘制区域
- 线性渐变 linear-gradient
- 文本效果，text-shadow
- 2d 变换，transform:scale,translate
- 3d 变换：transform:perspective
- 过渡元素：transition
- 动画：animate
- 多列布局：multi-column
- flex 布局
- 多媒体查询 media query

## 7、CSS 画三角形

只设置底部 border 颜色，其他部分使用透明颜色代替。

```css
.div {
  width: 0;
  height: 0;
  border-top: 40px solid transparent;
  border-left: 40px solid transparent;
  border-right: 40px solid transparent;
  border-bottom: 40px solid #ff0000;
}
```

## 8、请解释以下图片的排列顺序

```html
<div style="position:relative; z-index:0;">
  <img src="1.png" style="position:absolute; z-index:2;" />
</div>
<div style="position:relative; z-index:0;">
  <img src="2.png" style="position:relative; z-index:1;" />
</div>
```

如果将两个 div 的 z-index 都设置为 auto，排列顺序会改变吗？

## 9、如何实现粘贴定位

粘性定位： position :sticky。刚开始是相对定位，当滚动到指定 top 时，变成 fixed 定位。

## 10、你遇到过哪些 css 的坑

1、chrome 小于 12px 会显示成 12px ，但在最新的 chrome 已支持小于 12px 的显示。

2、margin-top:10%; padding-top:10% 是相对于父级元素的宽度 10% 进行分配。

3、rgba 和 opacity 的透明效果有什么不同？rgba 的子元素不会透明，opacity 0 子元素会继承透明。

## 11、如何优化 CSS

- 避免重复 css
- 避免使用 important
- 移除空的 css 规则
- 值为 0 不需要任何单位
- 避免重绘重排
- 减少选择器嵌套，减少匹配次数

css 匹配选择器是从右向左进行的 `ul.ul-style{color:red;}` 先匹配`.ul-style` 再匹配它前面的`ul`标签，应尽量减少选择器的嵌套。

## 12、伪类和伪元素的区别

CSS 伪类表示元素的特殊状态。

- :link
- :visited
- :hover
- :active

伪元素是基于元素的抽象，并不存在于文档中。

- :first-line
- :first-letter
- :before
- :after

## 13、浏览器源生的 inline-block 元素都有哪些

常见的有：img，input，button，textarea。

## 14、移动端如何处理点击穿透

点击穿透的原因：

在 pc 端的事件触发顺序：mousedown -> click -> mouseup

在移动端的事件触发顺序：touchstart -> touchmove -> touchend

移动端的事件优先级高，并且会模拟 mouse 事件，所以综合来看，移动端的执行顺序：

touchstart -> touchmove -> touchend -> mousedown -> click -> mouseup

由于很多时候，我们点击关闭弹窗时，弹窗立马就关闭了，但在移动端还存在一个点击延迟效果，即执行 tap 事件之后 300ms 之后才会触发 click 事件，这个时候弹窗已经没有了，于是 click 事件就作用在了弹窗下的元素上，就形成了点击穿透现象。

解决方案：

1、使用 fastclick 禁止 300ms 点击延迟。

2、使用 pointer-events 控制是否可点击。

- 不允许点击，即让点击穿透 ：pointer-events: none;
- 允许点击，即禁止穿透（默认值）：pointer-events: auto;

[参考资料](https://blog.csdn.net/zhuyinqinying/article/details/81775671)
