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

## 布局经验

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
