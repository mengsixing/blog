## CSS Houdini画一片星空

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

[参考链接](https://www.w3cplus.com/css/CSS-Houdini-starry-sky.html)
