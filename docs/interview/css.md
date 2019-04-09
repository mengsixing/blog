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

flex-grow 属性定义项目的放大比例，默认为 0，即如果存在剩余空间，也不放大。

flex-shrink 属性定义了项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小。

flex-basis 属性定义了在分配多余空间之前，项目占据的主轴空间，默认为 auto。
