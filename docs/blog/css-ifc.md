# CSS IFC 总结

最近在公司遇到一个问题，一个 div 的高度 auto，但总是比子元素的高度要高几 px，调试了很久，发现对 IFC 的概念还不是很深入，根据这篇文章再总结一下吧。

- CSS 内联盒子模型
- CSS line-height
- CSS vertical-align

## 内联盒子模型

IFC(Inline Formatting Context) 直译为**行内格式化上下文**。我们简单理解为每个盒子都有一个 FC 特性，不同的 FC 值代表一组盒子不同的排列方式。有的 FC 值表示盒子从上到下垂直排列，有的 FC 值表示盒子从左到右水平排列等等。而 IFC 则是表示盒子从左到右的水平排列方式。

CSS 内联盒子模型是用来渲染内容的，决定了页面中的文本，图片等内联元素如何显示。

- 内联盒子模型特点
- 内联盒子模型的分类

### 内联盒子模型特点

IFC 则是表示盒子从左到右的水平排列方式。

案例 1、父子元素嵌套。

```html
<span class="parent">
  <span class="child">
    <span class="inline-block">display:inline-block元素</span> xp子元素的文字
  </span>
  xp父元素的文字
</span>
<div class="other">其他元素</div>
```

#### line box 高度的计算方式

1、根据规则，span.parent 所在行的 line box 的高度受 span.parent、span.child、span.inline-block 元素对应的 inline-level box 高度的影响。

- span.parent 的高度为其 line-height 实际值。
- span.child 的高度为其 line-height 实际值。
- span.inline-block 的高度为其 margin box 的高度。

2、根据 vertical-align 属性垂直对齐，造成各高度间并不以上边界或下边界对齐。

3、span.inline-block 红色的上边框(border top)到 span.child 蓝色的下边框(border bottom)的距离再减去 1px 即为 line box 的高度。(line box 的下界其实是 span.child 的 content box 的下限的，你看"其他元素"的上边框不是和 span.child 的下边框重叠了吗？如果那是 line box 的下界，那怎会出现重叠呢)

##### 就盒子模型而言

1. inline-level box 与 block-level box 结构一致;
2. content box 的高度仅能通过属性 font-size 来设置，content box 的宽度则自适应其内容而无法通过属性 width 设置。
3. 当 inline-level box 的宽度大于 containing block，且达到内容换行条件时，会将 inline-level 拆散为多个 inline-level box 并分布到多行中，然后当属性 direction 为 ltr 时，margin/border/padding-left 将作用于第一个的 inline-level box，margin/border/padding-right 将作用于最后一个的 inline-level box;若属性 direction 为 rtl 时，margin/border/padding-right 将作用于第一个的 inline-level box，margin/border/padding-left 将作用于最后一个的 inline-level box。

##### 垂直排版特性

inline-level box 排版单位不是其本身，而是 line box。重点在于 line box 高度的计算。

1. 位于该行上的所有的 inline-level box 均参与该行 line box 高度的计算(注意：是所有 inline-level box，而不仅仅是子元素所生成的 inline-level box)
2. replaced elements, inline-block elements, and inline-table elements 将以其对应的 opaque inline-level box 的 margin box 高度参与 line box 高度的计算。而其他 inline-level box 则以 line-height 的实际值参与 line box 高度的计算。
3. 各 inline-level box 根据 vertical-align 属性值相对各自的父容器作垂直方向对齐。
4. 最上方的 box 的上边界到最下方的下边界则是 line box 的高度。

（1） inline-block 元素盒子里，没有内容(流内内容)，是一个空的盒子时，baseline 位置就是该盒子 margin-bottom 的边界（没有 margin-bottom 值，就是盒子的边界值）。
（2）inline-block 元素盒子里，有内容元素，并且 overflow 属性值为 visible 时(默认值)，那么该盒子的 baseline 位置就是里面最后一个内容元素的 baseline。如下图中间 div
（3）inline-block 元素盒子里，有内容元素，并且 overflow 属性值为非 visible 时 (比如 overflow:hidden)，那么该盒子的 baseline 位置就是该盒子 margin-bottom 的边界。

### 内联盒子模型下的子盒子

![css-ifc-box.jpg](css-ifc-box.jpg)

css 中的内联盒子模型可以分为以下几个部分：

1、内容区域(content area)。内容区域指一种围绕文字看不见的盒子，其大小仅受字符本身特性控制。我们可以把文本选中的背景色区域作为内容区域。

2、内联盒子(inline box)。内联盒子不会让内容成块显示，而是排成一行，这里的内联盒子实际指的就是元素的外在盒子，用来决定元素是内联还是块级。该盒子又可以细分为内联盒子和匿名内联盒子两类:

- 内联盒子。用`<span>`、`<a>`和`<em>`等标签包裹的盒子。
- 匿名内联盒子。直接写的文字部分。

3、行框盒子(line box)。例如:

```html
<p>这是一行普通的文字，这里有个 <em>em</em> 标签。</p>
```

`<p>` 标签中的每一行就是一个行框盒子，每个行框盒子又是由一个一个内联盒子组成的。如果文字超长，会自动换行，新的一行，就会被创建成一个全新的行框盒子，每一行都是一个行框盒子。

4、包含块(containing block)。例如:

```html
<p>这是一行普通的文字，这里有个 <em>em</em> 标签。</p>
```

`<p>`标签就是一个包含块，此盒子由一行一行的行框盒子组成。

### 幽灵空白节点

**幽灵空白节点**是内联盒模型中非常重要的一个概念，具体指的是:在 HTML5 文档声明 中，内联元素的所有解析和渲染表现就如同每个行框盒子的前面有一个“空白节点”一样。

## 内联元素的基石 line-height

先思考下面这个问题:默认空`<div>`高度是 0，但是一旦里面写上几个文字，`<div>`高度就有了，请问这个高度由何而来，或者说是由哪个 CSS 属性决定的?

如果仅仅通过表象来确认，估计不少人会认为`<div>`高度是由里面的文字撑开的，也就是`font-size`决定的，但本质上是由`line-height`属性全权决定的，尽管某些场景确实与`font-size`大小有关。

行距 = line-height - font-size

行距有分为上下两个部分，

em-box = font-size

内容区域高度受 font-family 和 font-size 双重影响

em-box 仅受 font-size 影响，通常内容区域高度要更高一些

### 为什么 line-height 可以让内联元素垂直居中

案例 2：使用 `line-height = height` 的方式让文字近似垂直居中。

```css
.title {
  height: 24px;
  line-height: 24px;
}
```

说近似是因为文字字形的垂直中线位置普遍要比真正的`行框盒子`的垂直中线位置低。

### 多行文本或替换元素的垂直居中的方法

如果要居中多行文本或替换元素 则需要借助 `vertical-align` 属性来帮助我们。

实现的原理大致如下。

1、多行文字使用一个标签包裹，然后设置 `display: inline-block`。好处在于既能重置外部的 `line-height` 为正常的大小，又能保持内联元素特性，从而可以设置 `vertical-align` 属性，以及产生一个非常关键的`行框盒子`。我们需要的其实并不是这个`行框盒子`，而是每个`行框盒子`都会附带的一个产物 —— **幽灵空白节点**，即一个宽度为 0 表现如同普通字符的看不见的节点。有了这个**幽灵空白节点**，我们的 `line-height:120px` 就有了作用的对象，从而相当于在 .content 元素前面撑起了一个高度为 120px 的宽度为 0 的内联元素。

2、因为内联元素默认都是基线对齐的，所以我们通过对 .content 元素设置 `vertical-align:middle` 来调整多行文本的垂直位置，从而实现我们想要的“垂直居中”效果。如果要借助 line-height 实现图片垂直居中效果，也是类似的原理和做法。

不垂直居中与 line-height 无关，而是 vertical-align 导致的

无论内联元素 line-height 如何设置，最终父级元素的高度都是由数值大的那个 line-height 决定的，我称之为**内联元素 line-height 的大值特性**。

## line-height 的好朋友 vertical-align

因为 vertical-align 起作用是有前提条件的，这个前提条件就是：只能应用于内联元素以及 display 值为 table-cell 的元素。

vertical-align 和 line-height 之间的关系很明确，即“朋友”关系。
最明显的就是 vertical-align 的百分比值是相对于 line-height 计算的
