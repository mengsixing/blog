# CSS NEXT 语法

CSS 是纯静态的语法，初学者上手很容易，但是随着时间的推移，也暴露出了很多问题，例如：

- 无法定义变量
- 选择器无法嵌套使用
- 无法继承其他选择器

为了解决这些问题，社区出现了很多预处理器，例如：

- less
- sass
- stylus

预处理器解决了传统 css 的问题，但是最终上线时也得编译回源生 css，要是源生的 css 就支持这些功能就好了。css next 代表下一代的 css 规范，这样源生的 css 就支持了这些规则，以后就不需要再使用预处理器来实现这些规则了。

## CSS NEXT 规则

1、 **custom properties & var()**

自定义 css 变量，方便复用。

```css
:root {
  --mainColor: red;
}

a {
  color: var(--mainColor);
}
```

2、**custom properties set & @apply**

自定义一套 css 样式，通过 @apply 复用。

```css
:root {
  --danger-theme: {
    color: white;
    background-color: red;
  }
}

.danger {
  @apply --danger-theme;
}
```

3、**reduced calc()**

使用计算属性。

```css
:root {
  --fontSize: 1rem;
}

h1 {
  font-size: calc(var(--fontSize) * 2);
}
```

4、 **custom media queries**

使用自定义媒体查询

```css
/* or coupled with custom media queries */
@custom-media --only-medium-screen (width >= 500px) and (width <= 1200px);

@media (--only-medium-screen) {
  /* your styles */
}
```

5、**custom selectors**

使用自定义选择器。

```css
@custom-selector :--button button, .button;
@custom-selector :--enter :hover, :focus;

:--button {
  /* styles for your buttons */
}
:--button:--enter {
  /* hover/focus styles for your button */
  /* Read more about :enter proposal */
  /* http://discourse.specifiction.org/t/a-common-pseudo-class-for-hover-and-focus/877 */
}
```

6、 **nesting**

允许使用嵌套选择器

```css
a {
  /* direct nesting (& MUST be the first part of selector)*/
  & span {
    color: white;
  }

  /* @nest rule (for complex nesting) */
  @nest span & {
    color: blue;
  }

  /* media query automatic nesting */
  @media (min-width: 30em) {
    color: yellow;
  }
}
```

7、 **image-set() function**

根据不同的屏幕分辨率，自动使用对应大小的图片。

```css
.foo {
  background-image: image-set(
    url(img/test.png) 1x,
    url(img/test-2x.png) 2x,
    url(my-img-print.png) 600dpi
  );
}
```

当然还有很多新特性，就不全部列举了，感兴趣的话可以查看 css next 官网。

## 相关链接

- [css next](https://cssnext.github.io/features/)
