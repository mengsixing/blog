# CSS 设备像素比

```text
设备像素比 = 物理像素 / 设备独立像素
```

在浏览器中可以通过 window.devicePixelRatio 获取。

## 物理像素

物理像素：显示屏是由一个个物理像素点组成的，通过控制每个像素点的颜色，使屏幕显示出不同的图像，屏幕从工厂出来那天起，它上面的物理像素点就固定不变了，单位 pt。 1pt = 1 / 72 (inch);

## 设备独立像素

```text
设备独立像素 = 逻辑像素 = CSS像素
```

设备独立像素，一种形象的说法，可以理解为在 css 中的 px。

## viewport

viewport 是用户网页的可视区域,可以叫做"视区"

手机浏览器是把页面放在一个虚拟的"窗口"（viewport）中，通常这个虚拟的"窗口"（viewport）比屏幕宽，这样就不用把每个网页挤到很小的窗口中，用户可以通过平移和缩放来看网页的不同部分。

viewport 的意义在于，无论在何种分辨率的屏幕下，那些针对 viewport 而设计的网站，不需要用户手动缩放，也不需要出现横向滚动条，都可以完美的呈现给用户。

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

- width：控制 viewport 的大小，可以指定的一个值，如 600，或者特殊的值，如 device-width 为设备的宽度（单位为缩放为 100% 时的 CSS 的像素）。
- height：和 width 相对应，指定高度。
- initial-scale：初始缩放比例，也即是当页面第一次 load 的时候缩放比例。
- maximum-scale：允许用户缩放到的最大比例。
- minimum-scale：允许用户缩放到的最小比例。
- user-scalable：用户是否可以手动缩放。

## 参考链接

- [CSS 像素、物理像素、逻辑像素、设备像素比、PPI、Viewport](https://github.com/jawil/blog/issues/21)
