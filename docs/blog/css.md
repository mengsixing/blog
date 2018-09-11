# CSS 浅析

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

CSS 有语义化的命名约定和 CSS 层的分离，团队命名统一规范，方便维护。

[BEM](https://en.bem.info/)

[SMACSS](https://smacss.com/)

[SUIT](https://suitcss.github.io/)

[Atomic](https://acss.io/)

---

## CSS 技巧

[css 图标](https://cssicon.space)

### CSS 绘制技巧

- border && border-radius
- after && before
- box-shadow
- linear-gradient radial-gradient

### BFC IFC GFC FFC

Box: CSS 布局的基本单位 。

Box 是 CSS 布局的对象和基本单位， 直观点来说，就是一个页面是由很多个 Box 组成的。元素的类型和 display 属性，决定了这个 Box 的类型。 不同类型的 Box， 会参与不同的 Formatting Context（一个决定如何渲染文档的容器），因此 Box 内的元素会以不同的方式渲染。让我们看看有哪些盒子：

block-level box:display 属性为 block, list-item, table 的元素，会生成 block-level box。并且参与 block fomatting context；

inline-level box:display 属性为 inline, inline-block, inline-table 的元素，会生成 inline-level box。并且参与 inline formatting context；

Formatting context 是 W3C CSS2.1 规范中的一个概念。它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。最常见的 Formatting context 有 Block fomatting context (简称 BFC)和 Inline formatting context (简称 IFC)。

FFC(Flex Formatting Contexts)直译为"自适应格式化上下文"，display 值为 flex 或者 inline-flex 的元素将会生成自适应容器（flex container），

GFC(GridLayout Formatting Contexts)直译为"网格布局格式化上下文"，当为一个元素设置 display 值为 grid 的时候，此元素将会获得一个独立的渲染区域，我们可以通过在网格容器（grid container）上定义网格定义行（grid definition rows）和网格定义列（grid definition columns）属性各在网格项目（grid item）上定义网格行（grid row）和网格列（grid columns）为每一个网格项目（grid item）定义位置和空间。

::: tip tip
[面向对象的 CSS](https://www.w3cplus.com/css/an-introduction-to-object-oriented-css-oocss.html)
:::
