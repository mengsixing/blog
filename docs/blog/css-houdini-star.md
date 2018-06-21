## CSS Houdini画一片星空

### CSS Houdini简介

CSS Houdini 是由一群来自 Mozilla, Apple, Opera, Microsoft, HP, Intel, IBM, Adobe 与 Google 的工程师所组成的工作小组，志在建立一系列的 API，让开发者能够介入浏览器的 CSS engine 操作，带给开发者更多的解決方案，用来解決 CSS 长久以来的问题：

* Cross-Browser isse
* CSS Polyfill 的制作困难

主要API：

* Box Tree API 
> DOM tree 中的每个元素都有一个 Box Modal ，而在浏览器解析过程中，还会将其拆分成 fragments。Box Tree API 让开发者可以获取 fragments 。

* CSS Layout API 
> 让开发者自己定义layout，在css中使用。

``` css
.xxx {
    display:layout(my-layout);
}
```
* CSS Painting API 

> 在css中使用paint，类似canvans语法，可以画自定义背景等。

* CSS Parser API

> 更直接地暴露CSS解析器的API，用于将任意类似CSS的语言解析为css表示。

* CSS Properties and Values API 

定义变量，类似于 css-next 。
``` css
:root { --main-color: #ff00ff; --main-bg: rgb(200, 255, 255); --block-font-size: 1rem; }
```

* CSS Typed OM 	

> CSS Typed OM 就是 CSSOM 的强化版，最主要的功能在于将 CSSOM 所使用的字串值转换成具有意义的 JavaScript 表示形态。
``` js
const map = document.querySelector('.example').styleMap; console.log( map.get('font-size') );
```

* Font Metrics API

> 为文档内和文档外的内容提供基本的字体指标。

* Worklets

> 引入单独的js文件。

### CSS Painting API

在css中使用paint，类似canvans语法，可以画自定义背景等。

``` css
body{
  /* 自定义css属性，传递给js调用 */
  --star-density: 0.001;
  --star-opacity: 0.1;
  background-image: paint(sky-star);
}
```

### Worklets
绘画代码需要定义在js中，但不能直接写在页面中，必须是单独的js文件，通过Worklets引入。

``` js
CSS.paintWorklet.addModule('sky-star.js');
```

### 绘画js

``` js
class SkyStar {
  // 接受css中的自定义属性
	static get inputProperties() {
		return ['--star-density','--star-opacity'];
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
          ctx.fillRect(this.random( paintSize.width), this.random(paintSize.height),this.random(2)+1, this.random(2)+1);
      }
  }
}
// 注册星星绘画方法，提供给页面paint函数调用
registerPaint('sky-star', SkyStar);
```

### 效果演示
<div align=center>
  <img src="/blog/css-houdini-star.gif" />
</div>

### 源码

sky-star.html
``` html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>CSS Houdini 画一片星空</title>
    <style>
    body {
        background-color: black;
    }

    body:before {
        content: "";
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

sky-star.js
``` js
class SkyStar {
    static get inputProperties() {
        return ['--star-density', '--star-opacity'];
    }
    random(size) {
        return Math.random() * size;
    }
    paint(ctx, paintSize, properties) {
        // 密度
        var density = +properties.get('--star-density').toString();
        var opacity = +properties.get('--star-opacity').toString();
        // 绘制星星
        var starNumbers = paintSize.width * paintSize.height * density;
        for (var i = 0; i < starNumbers; i++) {
            var starOpacity = (this.random(1) + this.random(1)) * opacity;
            ctx.fillStyle = `hsla(${this.random(360)}, 30%, 80%, ${starOpacity})`;
            ctx.fillRect(this.random(paintSize.width), this.random(paintSize.height), this.random(2) + 1, this.random(2) + 1);
        }
    }
}
registerPaint('sky-star', SkyStar);
```

参考链接

[css-houdini](https://www.w3cplus.com/css/css-houdini.html)
[CSS-Houdini-starry-sky](https://www.w3cplus.com/css/CSS-Houdini-starry-sky.html)

