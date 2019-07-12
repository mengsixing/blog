# CSS Houdini 画一片星空

这一章通过一个案例来学习一下 CSS Houdini。

- CSS Houdini 简介
- CSS Houdini API
- CSS Houdini 实战

## CSS Houdini 简介

CSS Houdini 旨在建立一系列的 api，让开发者能够介入浏览器的 css engine 操作，带给开发者更多的解決方案，用来解決 css 长久以来的问题：

- Cross-Browser 浏览器兼容性问题
- CSS Polyfill 制作困难问题

## CSS Houdini API

列举一下 Houdini 具体的 API：

- CSS Properties and Values API
- Box Tree API
- CSS Layout API
- CSS Painting API
- Worklets
- CSS Parser API
- CSS Typed OM
- Font Metrics API

### CSS Properties and Values API

让 css 支持定义变量，类似于 css next。

```css
/* root element selector (全局) */
:root {
  --main-color: #ff00ff;
  --main-bg: rgb(200, 255, 255);
  --block-font-size: 1rem;
}
.btn__active::after {
  --btn-text: 'This is btn'; /* 相当于 --box-highlight-text:'This is btn been actived'; */
  --btn-highlight-text: var(--btn-text) ' been actived';
  content: var(--btn-highlight-text); /* 也可以使用 calc 來做运算 */
  font-size: calc(var(--block-font-size) * 1.5);
}
body {
  /* variable usage */
  color: var(--main-color);
}
```

### Box Tree API

大家都知道在 DOM tree 中的每个元素都有一个 Box Modal，而在浏览器解析过程中，还会将其拆分成 fragments，至于什么是 fragments？

```html
<style>
  p::first-line {
    color: green;
  }

  p::first-letter {
    color: red;
  }

  .wrapper {
    width: 60px;
  }
</style>

<div class="wrapper">
  <p>foo <i>bar baz</i></p>
</div>
```

渲染结果如下：

![fragments 渲染结果](css-houdini-star-fragments.png)

上面的 HTML 总共就会拆出七个 fragments：

- 最外层的 div。
- 第一行的 box (包含 foo bar)。
- 第二行的 box (包含 baz)。
- 匹配到 ::first-line 与 ::first-letter 的 f 也会被拆出来形成独立的 fragments。
- 只匹配到 ::first-line 的 oo 也会独立出來。
- 匹配到 ::first-line 与 包在 `<i>` 內的 bar 当然也是。
- 在第二行底下的 baz。

而 Box tree API 目的就是希望让开发者能够取得这些 fragments 的信息，至于取得后要如何使用，基本上会跟后面介绍的 Parser API、Layout API 与 Paint API 有关联，当我们能取得详细的 Box Modal 信息时，要定制化 Layout Module 才更为方便。

### CSS Layout API

Layout API 顾名思义就是提供开发者撰写自己的 Layout module，也就是用来给 display 属性的值，像是 display: grid 或 display: flex。 你只要通过 registerLayout 定一个自己的 layout，然后在 css 中使用 layout 方法引用即可。

```js
registerLayout(
  'my-block',
  class extends Layout {
    // 在这里编写自定义layout
  }
);
```

使用自定义 layout：

```css
.wrapper {
  display: layout('my-block');
}
```

### CSS Painting API

Painting API 与 Layout 类似，提供一个叫做 registerPaint 的方法，可以提供给 background-image 等属性的值。

```js
class SkyStar {
  // 绘画函数
  paint(ctx, paintSize, properties) {
    // 自定义绘画
  }
}
// 注册星星绘画方法，提供给页面paint函数调用
registerPaint('sky-star', SkyStar);
```

使用自定义 paint：

```css
body {
  /* 自定义css属性，传递给js调用 */
  --star-density: 0.001;
  --star-opacity: 0.1;
  background-image: paint(sky-star);
}
```

### Worklets

上文中使用 Layout API，Painting API 都需要在 js 中去自定义类型。但这里的 js 不能直接用 script 标签引用，必须通过 Worklets 引入。

```js
CSS.paintWorklet.addModule('sky-star.js');
```

### CSS Parser API

Parser API 目前还是处在草案阶段，但我相信如果这个 API 确认的话，对前端开发有绝对的帮助，它的概念是想让开发者能扩充浏览器解析 HTML、CSS 的功能， 也就是说，你可以想办法让他看得懂最新定义的 pseudo-classes 或甚至是 element-queries 等等，这样就能正确解析出 CSSOM，从此不用再等浏览器更新。

### CSS Typed OM

CSS Typed OM 就是 CSSOM 的强化版，最主要的功能在于将 CSSOM 所使用的字串值转换成具有型別意义的 js 表示形态。

```js
// CSS -> JS
const map = document.querySelector('.example').styleMap;
console.log(map.get('font-size'));
// CSSSimpleLength {value: 12, type: "px", cssText: "12px"} // JS -> JS
console.log(new CSSUnitValue(5, 'px'));
// CSSUnitValue{value:5,unit:"px",type:"length",cssText:"5px"}
// JS -> CSS
// set style "transform: translate3d(0px, -72.0588%, 0px);"
elem.outputStyleMap.set(
  'transform',
  new CSSTransformValue([
    new CSSTranslation(0, new CSSSimpleLength(100 - currentPercent, '%'), 0)
  ])
);
```

根据草案的內容，有了 CSS Typed OM 的定义，在 js 的操作上据说会有性能上的显著提升。此外，CSS Typed OM 也应用在 Parser API 与 CSS Properties API 上。

### Font Metrics API

不同 font-family 在相同 font-size 下，所产生的 span 高度会不同。

要想控制 Font metrics，也就是控制字所占的宽高的话，目前可以先用 CSS Properties 來处理，根据已知字体的 font-metrics 动态算出我们要 apply 多少的 font-size：

```css
p {
  /* 定义好我们已知字型的 Font metrics */
  /* font metrics */
  --font: Catamaran;
  --fm-capitalHeight: 0.68;
  --fm-descender: 0.54;
  --fm-ascender: 1.1;
  --fm-linegap: 0;
  /* 定义想要的高度 */
  --capital-height: 100;
  /* 设置 font-family */
  font-family: var(--font);
  /* 利用 Font metrics 的信息來计算出 font-size */
  --computedFontSize: (var(--capital-height) / var(--fm-capitalHeight));
  font-size: calc(var(--computedFontSize) * 1px);
}
```

Font Metrics API 就是希望能暴露出更方便的 API 来达成上述的事情。

## CSS Houdini 实战

接下来我们使用 CSS Painting API 来画一片星空。

1、首先创建 sky-star.html。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>CSS Houdini 画一片星空</title>
    <style>
      body {
        background-color: black;
      }

      body:before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        --star-density: 0.001;
        --star-opacity: 0.1;
        background-image: paint(sky-star);
      }

      body:before {
        animation: shine 1s linear alternate infinite;
      }

      @keyframes shine {
        from {
          opacity: 1;
        }
        to {
          opacity: 0.6;
        }
      }
    </style>
  </head>

  <body>
    <script>
      CSS.paintWorklet.addModule('sky-star.js');
    </script>
  </body>
</html>
```

然后创建 sky-star.js。

```js
class SkyStar {
  // 接受 css 中的自定义属性
  static get inputProperties() {
    return ['--star-density', '--star-opacity'];
  }
  random(size) {
    return Math.random() * size;
  }
  // 绘画函数
  paint(ctx, paintSize, properties) {
    // 密度
    var density = +properties.get('--star-density').toString();
    var opacity = +properties.get('--star-opacity').toString();
    // 绘制星星
    var starNumbers = paintSize.width * paintSize.height * density;
    for (var i = 0; i < starNumbers; i++) {
      var starOpacity = (this.random(1) + this.random(1)) * opacity;
      ctx.fillStyle = `hsla(${this.random(360)}, 30%, 80%, ${starOpacity})`;
      ctx.fillRect(
        this.random(paintSize.width),
        this.random(paintSize.height),
        this.random(2) + 1,
        this.random(2) + 1
      );
    }
  }
}
// 注册星星绘画方法，提供给页面paint函数调用
registerPaint('sky-star', SkyStar);
```

创建完成之后，启动一个 server 服务，就可以运行了，运行效果如下：

![星空图](css-houdini-star.gif)

## 参考链接

[css-houdini](https://www.w3cplus.com/css/css-houdini.html)

[CSS-Houdini-starry-sky](https://www.w3cplus.com/css/CSS-Houdini-starry-sky.html)
