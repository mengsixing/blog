# 两行代码实现图片碎片化加载

今天来实现一个图片碎片化加载效果，效果如下：

![loading](https://cdn.yinhengli.com/img-loading.gif)

我们分为 3 个步骤来实现：

- 定义 html 结构
- 拆分图片
- 编写动画函数

## 定义 html 结构

这里只需要一个 canvas 元素就可以了。

```html
<html>
  <body>
    <canvas
      id="myCanvas"
      width="900"
      height="600"
      style="background-color: black;"
    ></canvas>
  </body>
</html>
```

## 拆分图片

这个例子中，我们将图片按照 10 行 10 列的网格，拆分成 100 个小碎片，这样就可以对每一个小碎片独立渲染了。

```js
let image = new Image();
image.src = "https://cdn.yinhengli.com/canvas-example.jpeg";
let boxWidth, boxHeight;
// 拆分成 10 行，10 列
let rows = 10,
  columns = 20,
  counter = 0;

image.onload = function() {
  // 计算每一行，每一列的宽高
  boxWidth = image.width / columns;
  boxHeight = image.height / rows;
  // 循环渲染
  requestAnimationFrame(animate);
};
```

> [requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)：告诉浏览器，你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。

## 编写动画函数

接下来我们编写动画函数，让浏览器在每一次重绘前，随机渲染某个小碎片。

这里的核心是 [context.drawImage](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/drawImage) 方法。

```js
let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");

function animate() {
  // 随机渲染某个模块
  let x = Math.floor(Math.random() * columns);
  let y = Math.floor(Math.random() * rows);
  // 核心
  context.drawImage(
    image,
    x * boxWidth, // canvas 中横坐标起始位置
    y * boxHeight, // canvas 中纵坐标起始位置
    boxWidth, // 画图的宽度（小碎片图像的宽）
    boxHeight, // 画图的高度（小碎片图像的高）
    x * boxWidth, // 从大图的 x 坐标位置开始画图
    y * boxHeight, // 从大图的 y 坐标位置开始画图
    boxWidth, // 从大图的 x 位置开始，画多宽（小碎片图像的宽）
    boxHeight // 从大图的 y 位置开始，画多高（小碎片图像的高）
  );
  counter++;
  // 如果模块渲染了 90%，就让整个图片显示出来。
  if (counter > columns * rows * 0.9) {
    context.drawImage(image, 0, 0);
  } else {
    requestAnimationFrame(animate);
  }
}
```

## 完整代码

```html
<html>
  <body>
    <canvas
      id="myCanvas"
      width="900"
      height="600"
      style="background-color: black;"
    ></canvas>
    <script>
      let image = new Image();
      image.src = "https://cdn.yinhengli.com/canvas-example.jpeg";
      let canvas = document.getElementById("myCanvas");
      let context = canvas.getContext("2d");
      let boxWidth, boxHeight;
      let rows = 10,
        columns = 20,
        counter = 0;

      image.onload = function() {
        boxWidth = image.width / columns;
        boxHeight = image.height / rows;
        requestAnimationFrame(animate);
      };

      function animate() {
        let x = Math.floor(Math.random() * columns);
        let y = Math.floor(Math.random() * rows);
        context.drawImage(
          image,
          x * boxWidth, // 横坐标起始位置
          y * boxHeight, // 纵坐标起始位置
          boxWidth, // 图像的宽
          boxHeight, // 图像的高
          x * boxWidth, // 在画布上放置图像的 x 坐标位置
          y * boxHeight, // 在画布上放置图像的 y 坐标位置
          boxWidth, // 要使用的图像的宽度
          boxHeight // 要使用的图像的高度
        );
        counter++;
        if (counter > columns * rows * 0.9) {
          context.drawImage(image, 0, 0);
        } else {
          requestAnimationFrame(animate);
        }
      }
    </script>
  </body>
</html>
```

## 总结

通过这个 Demo，我们使用了 canvasAPI 实现了图片的碎片加载效果，是不是特别简单！

![前端日志](https://cdn.yinhengli.com/qianduanrizhi.png)
