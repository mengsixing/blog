# CSS Flex 布局总结

- 基本概念
- 常用布局

## 基本概念

- 容器的属性
- 项目的属性

### 容器的属性

以下 6 个属性设置在容器上。

- flex-direction
  - 设置主轴的方向，左右，右左，上下，下上。
- flex-wrap
  - 设置主轴的换行方式，不换行，换行，换行反转。
- flex-flow
  - flex-direction 和 flex-wrap 的组合。
  - `flex-flow: <flex-direction> || <flex-wrap>;`
- justify-content
  - 设置项目在主轴上的对齐方式。
- align-items
  - 设置项目在交叉轴上的对齐方式。
- align-content
  - 设置多根轴线的对齐方式。

### 项目的属性

- order
  - 设置项目的排列顺序，数值越小，排列越靠前，默认为 0。
- flex-grow
  - 设置项目的放大比例，默认为 0，即如果存在剩余空间，也不放大。
- flex-shrink
  - 设置项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小。
- flex-basis
  - 定义了在分配多余空间之前，项目占据的主轴空间。
- flex
  - flex-grow, flex-shrink 和 flex-basis 的简写，默认值为 0 1 auto。后两个属性可选。
- align-self
  - 允许单个项目有与其他项目不一样的对齐方式，可覆盖 align-items 属性。

## Flex 布局常见问题

### 固定宽度问题

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      .container {
        display: flex;
        width: 1000px;
        overflow: hidden;
      }

      .item {
        width: 100px;
        height: 300px;
        background-color: orange;
      }

      .item2 {
        width: 900px;
        background-color: blue;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="item">1</div>
      <div class="item2">2</div>
      <div class="item">3</div>
    </div>
  </body>
</html>
```

1、上面的布局，3 个 item 已经超过了最大的 1000px，所以会被自动压缩，压缩比例为 1:9:1。

2、如果 item2 去掉 width，加上 flex:1，则实现中间自适应，两端 100px 的效果。

3、如果 item2 设置 flex-shrink :0 表示不允许缩放，那么左右两边的 item 会被缩放为 50px。

### Flex 缩放问题

以下代码中最终的 left、right 宽度是多少？

```html
<div class="container">
  <div class="left"></div>
  <div class="right"></div>
</div>

<style>
  * {
    padding: 0;
    margin: 0;
  }
  .container {
    width: 600px;
    height: 300px;
    display: flex;
  }
  .left {
    flex: 1 2 500px;
    background: red;
  }
  .right {
    flex: 2 1 400px;
    background: blue;
  }
</style>
```

:::tip 公式

1、子项的最终宽度 = 子项的原始宽度 - 子项的收缩宽度

2、子项的收缩宽度 = 子项的收缩比例 * 溢出的宽度

3、子项的收缩比例 = (子项的 flex-shrink `*` 子项的宽度) `/` (所有子项的 flex-shrink `*` 子项的宽度和)

:::

套用上述公式：

```js
子项的收缩比例 = (子项的 flex-shrink * 子项的宽度) / (所有子项的flex-shrink * 子项的宽度和)
// left  的收缩比例：500 * 2 / (500 * 2 + 400 * 1) = 0.7142857142857143
// right 的收缩比例：400 * 1 / (500 * 2 + 400 * 1) = 0.2857142857142857

子项的收缩宽度 = 子项的收缩比例 * 溢出的宽度
// 溢出宽度：500 + 400 - 600 = 300
// left  的收缩宽度：300 * 0.7142857142857143 = 214.28571428571428
// right 的收缩宽度：300 * 0.2857142857142857 = 85.71428571428571

最终宽度 = 子项的原始宽度 - 子项的收缩宽度
// left  的最终宽度：500 - 214.28571428571428 = 285.7142857142857
// right 的最终宽度：400 - 85.71428571428571 = 314.2857142857143
```

:::warning

- 如果计算出来有负数，则不显示。
- 如果没有任何子项设置 flex-basis 则直接按溢出的宽度和 flex-shrink 比例缩小即可。
- 如果有部分子项没有设置 flex-basis 则这些项目，按照比例，瓜分剩下的宽度即可。
- 如果 0 < flex-shrink < 1 ，几个子项相加也小于 1，则不会缩放到父元素宽度，最终会超出宽度，flex-grow 反向同理。
- 如果是 flex-grow 就更好理解，直接根据放大的比，去瓜分多出来的宽度即可。
:::

## 参考文章

[详解 flex-grow 与 flex-shrink](https://zhuanlan.zhihu.com/p/24372279)
