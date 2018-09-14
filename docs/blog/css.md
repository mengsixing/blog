# 编写高质量 CSS

我么经常用 CSS 静态地修饰网页，可是有想过怎么写出高质量的 CSS？

下面介绍几个用来写好 CSS 的方法。

## 面向对象的 CSS

OO CSS 将⻚面可重用元素抽象成一个类，用 Class 加以描述，而与其对应的 HTML 即可看成是此类的一个实例。

主要特点：

- 结构和皮肤相分离。
- 容器和内容相分离。

作用：

- 1.加强代码复用以便方便维护。
- 2.减小 CSS 体积。
- 3.提升渲染效率。
- 4.组件库思想、栅格布局可共用、减少选择器、方便扩展。

注意事项：

- 不要直接定义子节点，应把共性声明放到父类。
- 抽象出可重用的元素，建好组件库，在组件库内寻找可用的元素组装⻚面。
- 往你想要扩展的对象本身增加 class 而不是他的父节点。
- 对象应保持独立性。
- 避免使用 ID 选择器，权重太高，无法重用。
- 避免位置相关的样式。
- 保证选择器相同的权重。
- 类名简短清晰语义化 OOCSS 的名字并不影响 HTML 语义化。

## CSS 分层

CSS 有语义化的命名约定和 CSS 层的分离，团队命名统一规范，方便维护，最常用的是 BEM 规范。

[BEM](https://en.bem.info/)

- block 代表了更高级别的抽象或组件。
- block-name 长名称中使用连字符分隔单词。
- block\_\_element 代表.block 的后代，用于形成一个完整的.block 的整体。
- .block--modifier 代表.block 的不同状态或不同版本。

还有以下几总规范，了解即可。

[SMACSS](https://smacss.com/)

[SUIT](https://suitcss.github.io/)

[Atomic](https://acss.io/)

## CSS 工作流

古老的 CSS 无法定义变量，无法进行运算，需要手写很多浏览器兼容前缀，写出来的代码可能会占很大篇幅。

CSS 预处理器和后处理器可以帮助我们解决此类问题。

### CSS 预处理器

预处理器可以让我们使用变量，继承，嵌套规则，运算，函数，scope 等编程的方式，书写 css。`一句话总结：增强 css 语法。`

我们使用 sass，less，stylus 等语法编写的类 css 代码，然后经过编译，最后转换为真正的 css 代码。

### CSS 后处理器

后处理器可以将我们的 css 进行压缩，美化，以及加上浏览器前缀，减少我们的开发工作量。`一句话总结：增强css的兼容性。`

我们使用 postcss，将 css 进行美化，压缩，加前缀等操作。对 css 加入一些扩展。

## 格式化上下文

Box: CSS 布局的基本单位 。

Box 是 CSS 布局的对象和基本单位， 直观点来说，就是一个页面是由很多个 Box 组成的。元素的类型和 display 属性，决定了这个 Box 的类型。 不同类型的 Box， 会参与不同的 Formatting Context（一个决定如何渲染文档的容器），因此 Box 内的元素会以不同的方式渲染。让我们看看有哪些盒子：

block-level box:display 属性为 block, list-item, table 的元素，会生成 block-level box。并且参与 block fomatting context。

inline-level box:display 属性为 inline, inline-block, inline-table 的元素，会生成 inline-level box。并且参与 inline formatting context。

Formatting context 是 W3C CSS2.1 规范中的一个概念。它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。最常见的 Formatting context 有 Block fomatting context (简称 BFC)和 Inline formatting context (简称 IFC)。

### BFC 特点

- 在 BFC 中，内部的 Box 会在垂直方向，一个接一个地放置。

- Box 垂直方向的距离由 margin 决定，同一个 BFC 下相邻两个 Box 的 margin 会发生重叠。

- 在 BFC 中，每一个盒子的左外边缘（margin-left）会触碰到容器的左边缘(border-left)（对于从右到左的格式来说，则触碰到右边缘），即使存在浮动也是如此。（即不会发生 margin 穿透）。

- 形成了 BFC 的区域不会与 float box 重叠（可阻止因浮动元素引发的文字环绕现象）。

- 计算 BFC 高度时，浮动元素也参与计算（BFC 会确切包含浮动的子元素，即闭合浮动）。

### IFC 特点

- 水平方向根据 direction 依次布局。

- 不会在元素前后换行。

- 受 white-space 属性的影响。

- margin/padding 在竖直方向无效，水平方向有效的。

- width/height 对非替换行内元素无效，宽度由元素内容决定。

- 非替换行内元素的行框高由 line-height 决定而替换行内元素的行框高则是由 height，padding，border，margin 决定。

- 浮动或者绝对定位会转化为 block。

- vertical-align 属性生效。

### FFC

FFC(Flex Formatting Contexts)直译为"自适应格式化上下文"，display 值为 flex 或者 inline-flex 的元素将会生成自适应容器（flex container）。

### GFC

GFC(GridLayout Formatting Contexts)直译为"网格布局格式化上下文"，当为一个元素设置 display 值为 grid 的时候，此元素将会获得一个独立的渲染区域，我们可以通过在网格容器（grid container）上定义网格定义行（grid definition rows）和网格定义列（grid definition columns）属性各在网格项目（grid item）上定义网格行（grid row）和网格列（grid columns）为每一个网格项目（grid item）定义位置和空间。

## CSS 技巧

我们可以利用 CSS 技巧创建各种规则和不规则形状的图形。

[css 图标](https://cssicon.space)

### CSS 绘制技巧

css 绘制图形的技巧可以通过以下几种方式实现：

- border && border-radius
- after && before
- box-shadow
- linear-gradient radial-gradient

---

::: tip 参考链接
[面向对象的 CSS](https://www.w3cplus.com/css/an-introduction-to-object-oriented-css-oocss.html)

[常用布局之 IFC 布局](https://blog.csdn.net/weixin_38080573/article/details/79364754)

[行内布局](https://segmentfault.com/a/1190000003043991)
:::
