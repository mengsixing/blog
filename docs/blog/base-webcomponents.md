# Web Component 基础

- 核心概念
- Web Component 实战
- 开源库

## 核心概念

- Custom elements
- Shadow DOM
- HTML templates

### Custom elements

源生 js api，可以在页面上定义自己的 html 标签，同时提供了一套生命周期方案，可以理解成一个 react 或 vue 组件，在浏览器中是可以源生支持的，不需要打包编译即可使用。

实战：编写一个 `<hello-world></hello-world>` 组件。

```js
class HelloWorld extends HTMLElement {
  constructor() {
    // 必须首先调用 super 方法
    super();
    // 元素的功能代码写在这里
    this.addEventListener("click", () => {
      alert("hello");
    });
  }
}
customElements.define("hello-world", HelloWorld);
```

### Shadow DOM

Shadow DOM 的一个重要特性是封装——可以将 html 标签结构、css 样式和行为隐藏起来，并从页面上的其他代码中分离开来，这样不同的功能不会混在一起，代码看起来也会更加干净整洁。

实战：给一个 div 元素，绑定一个 shadowDOM，让一个空 div 也能显示出一个 button。

```html
<div id="container"></div>
<script>
  const container = document.getElementById("container");
  const shadow = container.attachShadow({ mode: "open" });

  // 添加一个button
  const button = document.createElement("button");
  button.textContent = "hello";

  // 插入 shadow dom
  shadow.appendChild(button);
</script>
```

### HTML templates

当您必须在网页上重复使用相同的标记结构时，使用某种模板而不是一遍又一遍地重复相同的结构是有意义的。此元素及其内容不会在 DOM 中呈现，但仍可使用 JavaScript 去引用它。

实战：实现一个基本的 template 应用。

```html
<template id="my-paragraph">
  <p>My paragraph</p>
</template>
<script>
  const template = document.getElementById("my-paragraph");
  // 获取 template 中的内容
  const templateContent = template.content;
  document.body.appendChild(templateContent);
</script>
```

## Web Component 实战

实战：将 Custom elements、Shadow DOM、HTML templates 结合起来，实现一个完整的 webComponent 案例。

```html
<html lang="en">
  <body>
    <template id="common-title">
      <h1><slot name="title"></slot></h1>
      <p>hello-world component</p>
    </template>

    <hello-world data-title="my-title">
      <span slot="title">自定义 title</span>
    </hello-world>

    <script>
      // 1、创建一个自定义标签
      // 2、创建 template
      // 3、shadow dom 封装、隔离组件
      class HelloWorld extends HTMLElement {
        constructor() {
          super();
          // 获取 template
          const template = document.getElementById("common-title");
          // shadow dom
          const shadow = this.attachShadow({ mode: "open" });
          shadow.appendChild(template.content);

          // 绑定事件
          this.addEventListener("click", () => {
            alert("click");
          });

          // 获取自定义属性
          const title = this.getAttribute("data-title");
          console.warn("title:", title);
          // 将自定义属性赋值
          this.childNodes[1].textContent = title;
        }
      }
      customElements.define("hello-world", HelloWorld);
    </script>
  </body>
</html>
```

## 开源库

基于 webcomponent 有许多非常成熟的开源库。

- [x-tag](https://github.com/x-tag)
- [polymer](https://github.com/Polymer/polymer)
- [omi](https://github.com/Tencent/omi)

## 参考链接

[mdn webComponents](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)
