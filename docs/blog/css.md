# CSS 使用总结

这里从几个角度来总结一下：

- CSS 编写规范
- CSS 命名规范
- CSS 工作流
- CSS 格式化上下文
- CSS 特殊技巧

## CSS 编写规范

CSS 代码可以很自由的书写，但是为了便于维护，提高渲染效率，推荐使用面向对象的思想来编写 CSS 代码。OO CSS 将⻚面可重用元素抽象成一个类，用 Class 加以描述，而与其对应的 HTML 即可看成是此类的一个实例。

主要特点：

- 结构和皮肤相分离。
- 容器和内容相分离。

作用：

- 加强代码复用以便方便维护。
- 减小 CSS 体积。
- 提升渲染效率。
- 组件库思想、栅格布局可共用、减少选择器、方便扩展。

注意事项：

- 不要直接定义子节点，应把共性声明放到父类。
- 抽象出可重用的元素，建好组件库，在组件库内寻找可用的元素组装⻚面。
- 往你想要扩展的对象本身增加 class 而不是他的父节点。
- 对象应保持独立性。
- 避免使用 ID 选择器，权重太高，无法重用。
- 避免位置相关的样式。
- 保证选择器相同的权重。
- 类名简短清晰语义化 OOCSS 的名字并不影响 HTML 语义化。

使用案例：

```html
<!-- 在一个 class 中写成公用的 css 代码，以便进行复用 -->
<style>
  .size1of4 {
    width: 25%;
  }
  .bgBlue {
    background: blue;
  }
  .solidGray {
    border: 1px solid #ccc;
  }
  .mts {
    margin-top: 5px;
  }
  .mrm {
    margin-right: 10px;
  }
  .mbm {
    margin-bottom: 10px;
  }
  .mlm {
    margin-left: 10px;
  }
</style>
<div class="size1of4 bgBlue solidGray mts mlm mrm mbm">xxx</div>
```

## CSS 命名规范

CSS 有语义化的命名约定和统一的命名规范，最常用的是 BEM 规范。

[BEM](https://en.bem.info/)

- block 代表了更高级别的抽象或组件。
- block-name 长名称中使用连字符分隔单词。
- block\_\_element 代表.block 的后代，用于形成一个完整的.block 的整体。
- block--modifier 代表.block 的不同状态或不同版本。

还有以下几点规范，了解即可。

[SMACSS](https://smacss.com/)

[SUIT](https://suitcss.github.io/)

[Atomic](https://acss.io/)

## CSS 工作流

古老的 CSS 无法定义变量，无法进行运算，需要手写很多浏览器兼容前缀，写出来的代码可能会占很大篇幅。CSS 预处理器和后处理器可以帮助我们解决此类问题。

### CSS 预处理器

预处理器可以让我们使用变量，继承，嵌套规则，运算，函数，scope 等编程的方式书写 css。**一句话总结：增强 css 语法**。

我们使用 sass，less，stylus 等语法编写的类 css 代码，然后经过编译，最后转换为真正的 css 代码。

### CSS 后处理器

后处理器可以将我们的 css 进行压缩，美化，以及加上浏览器前缀，减少我们的开发工作量。**一句话总结：增强 css 的兼容性**。

我们使用 postcss，将 css 进行美化，压缩，加前缀等操作。对 css 加入一些扩展。

## CSS 格式化上下文

格式化上下文（Formatting Context）：定义了页面中的一块渲染区域，并且有一套渲染规则，决定了其子元素将如何定位，以及和其他元素的关系和相互作用。常见的格式化上下文有 BFC、IFC、FFC、GFC。

### BFC

BFC(Block Formatting Contexts)：块级格式化上下文，以下几种元素会生成 BFC：

- float 的值不是 none。
- position 的值不是 static 或者 relative。
- display 的值是 inline-block、table-cell、flex、table-caption 或者 inline-flex。
- overflow 的值不是 visible。

BFC 的特点：

- 在 BFC 中，内部的 Box 会在垂直方向，一个接一个地放置。
- Box 垂直方向的距离由 margin 决定，同一个 BFC 下相邻两个 Box 的 margin 会发生重叠。
- 在 BFC 中，每个元素的 margin box 的左边， 与包含块 border box 的左边相接触。即使存在浮动也是如此。
- BFC 区域不会与 float Box 重叠（可阻止因浮动元素引发的文字环绕现象）。
- 计算 BFC 高度时，浮动元素也参与计算（BFC 会确切包含浮动的子元素，即清除浮动）。

### IFC

IFC(Inline Formatting Contexts)：内联格式化上下文，以下几种元素会生成 BFC：

- display 的值是 inline，inline-block，inline-table 的元素。
- 行内元素。

IFC 的特点：

- 水平方向根据 direction 依次布局。
- 不会在元素前后换行。
- 受 white-space 属性的影响。
- margin/padding 在竖直方向无效，水平方向有效的。
- width/height 对非替换行内元素无效，宽度由元素内容决定。
- 非替换行内元素的行框高由 line-height 决定而替换行内元素的行框高则是由 height，padding，border，margin 决定。
- 浮动或者绝对定位会转化为 block。
- vertical-align 属性生效。

### FFC

FFC(Flex Formatting Contexts)：自适应格式化上下文。display 值为 flex 或者 inline-flex 的元素将会生成自适应容器。

### GFC

GFC(GridLayout Formatting Contexts)：网格布局格式化上下文，当为一个元素设置 display 值为 grid 的时候，此元素将会获得一个独立的渲染区域，我们可以通过在网格容器（grid container）上定义网格定义行（grid definition rows）和网格定义列（grid definition columns）属性各在网格项目（grid item）上定义网格行（grid row）和网格列（grid columns）为每一个网格项目（grid item）定义位置和空间。

## CSS 特殊技巧

我们可以利用 CSS 技巧创建各种规则和不规则形状的图形，[cssicon](https://cssicon.space)就使用纯 CSS 实现了一些常用的 icon。

CSS 绘制图形的技巧可以通过以下几种方式实现：

- border && border-radius
- after && before
- box-shadow
- linear-gradient radial-gradient

## 相关链接

- [面向对象的 CSS](https://www.w3cplus.com/css/an-introduction-to-object-oriented-css-oocss.html)
- [常用布局之 IFC 布局](https://blog.csdn.net/weixin_38080573/article/details/79364754)
- [行内布局](https://segmentfault.com/a/1190000003043991)
