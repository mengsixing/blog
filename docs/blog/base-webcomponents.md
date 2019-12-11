# Web Component

- 核心概念
- Web Component 实战

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

          //   获取自定义属性
          const title = this.getAttribute("data-title");
          console.warn("title:", title);
        }
      }
      customElements.define("hello-world", HelloWorld);
    </script>
  </body>
</html>
```

## 参考链接

[mdn webComponents](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)
