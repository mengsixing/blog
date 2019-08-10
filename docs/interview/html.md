# HTML 面试题

## 1、DOCTYPE 有什么用

文档模式：混杂模式和标准模式，主要影响 css 内容的呈现，在某些情况下也会影响 js 的执行。不同浏览器的怪异模式差别非常大。

在 HTML 4.01 中，<!DOCTYPE> 声明引用 DTD，因为 HTML 4.01 基于 SGML。DTD 规定了标记语言的规则，这样浏览器才能正确地呈现内容。

HTML5 不基于 SGML，所以不需要引用 DTD。

## 2、什么是可替换元素，什么是非替换元素，他们的差异是什么，并举例说明

不可替换元素：其内容直接表现给浏览器。

例如：div 中的内容可以直接显示。

```html
<div>content</div>
```

替换元素：没有实际的内容，需根据元素的标签和属性，来决定元素的具体显示内容。

例如浏览器会根据 img 标签的 src 属性的值来读取图片信息并显示出来，这些元素往往没有实际的内容，即是一个空元素。

```html
<img src="xxx" alt="xxx" />
```

## 3、一个 div，高度是宽度的 50%，让该 div 的宽度占据整个屏幕，然后能自适应，垂直居中，怎么实现

```css
body {
  display: flex;
  align-items: center;
  height: 100vh;
}

.item {
  margin-bottom: 50%;
  width: 100%;
  background-color: orange;
}
```

## 4、行内标签都有哪些

- 行内标签它和其它标签处在同一行内。
- 行内标签无法设置宽度，高度、行高、距顶部距离、距底部距离。
- 行内标签的宽度是直接由内部的文字或图片等内容撑开的。
- 行内标签内部不能嵌套行块级元素。

```xml
<a></a>
<span></span>
<i></i>
<em></em>
<strong></strong>
<label></label>
<q></q>
<var></var>
<cite></cite>
<code></code>
```

## 5、data-xxx 属性的作用是什么

- 增加自定义属性的可读性，可维护性。
- dom.dataset 可以直接访问 dataset。
