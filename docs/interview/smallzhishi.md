# 小知识

## a 标签的 rel = noopener 有什么用

当我们使用 `targer=_blank` 打开一个新的标签页时, 新页面的 window 对象上有一个属性 opener, 它指向的是前一个页面的 window 对象。因此, 后一个页面就获得了前一个页面的控制权. 甚至在跨域的情况下也可以生效。

案例：使用 `window.opener.location.href = 'www.hack.com'` 强制更改前一个页面的 url。

使用 rel=noopener 可以把 window.opener 置为空，防止此类情况发生。

## 为什么获取 offsetTop 会引起重排

offsetTop 获取对象相对于由 offsetParent 属性指定的父坐标(css 定位的元素或 body 元素)距离顶端的高度。

因为 offsetTop 并不是保存好的一个值，而是进行动态计算出来的一个值，在计算过程中会引起页面重排。

