# 《编写可维护的 JavaScript》

最近阅读了《编写可维护的 JavaScript》，在这里记录一下读书笔记。书中主要基于三个方向来讲解怎么增加代码的可维护性：**编程风格**、**编程实践**、**自动化**。

## 编程风格

- 缩进方式
  - 使用空格（推荐）。
  - 使用制表符（Tab 键）。
    - 不同的操作系统对于制表符的解释不一致，导致看起来不一致。
- 命名方式
  - 变量名用名词。
    - 常量使用大写单词加下划线 MAX_NUM。
  - 函数名用动词开头
    - 构造函数用大驼峰写法。
- null 对象的用法
  - 初始化一个变量。
  - 和一个已经初始化的变量做比较。
  - 函数参数期望是对象时，用作参数传入。
  - 函数返回值是对象时，可以当做返回值。

```js
// 好的写法
var person = null;

function getPerson(num) {
  if (num > 5) {
    return new Person('Lily');
  } else {
    // 好的写法
    return null;
  }
}

var person = new Person();

// 好的写法
console.log(person === null);
```

- 不要和非对象，或者未赋值变量做比较。
- 不要用来检测函数参数是否传入。

```js
var person;

// 不好的写法
console.log(person === null);

function doSomeThing(arr1, arr2) {
  // 不好的写法
  if (arr1 === null) {
    console.log('arr1 参数没有传递');
  }
}
```

### 编写注释

使用注释的一般原则是：让代码变得更清晰。我们一般通过这几点来注释代码：

- 难以理解的代码。
- 可能被误解的代码。
- 浏览器 hack。

注释的书写规范：

- 注释的上方需要一个空行。
- 单行注释，如果在尾部注释，需要加一个空格。
- 多行注释中的每一行需对齐，最好也有一个星号。
- 可以加一些注释声明。
  - TODO 代码未完成。
  - HACK 代码走了一个捷径，应注明原因
  - FIXME 代码有问题，应尽快修复
  - REVIEW 代码的改动需要评审

```js
var person = null;

if (condition) {
  // 做一些事情
  doSomeThing(); // 做一些事情
}

/*
 * 这是创建一个对象
 * 第二行
 */
var p = new Person();

/**
@method merge
@param {Object} 被合并的对象
@return {Object} 一个新的对象
**/
function doSomeThing(obj) {
  return Object.assign(obj, { asd: 123 });
}

// REVIEW: 有更好的写法吗？
if (document.all) {
}
```

### 语句和表达式

在语句和表达式一章，书中主要是写关于大括号对齐方式等，以下两点让我影响特别深刻：

- 循环中尽可能避免使用 continue，使用条件判断替代（可读性更好）。
- **for in 循环只是用来遍历对象的**，不要用来遍历数组。如果不需要遍历原型链上的对象，可以使用 `hasOwnProperty`。

### 变量、函数和运算符

- 定义变量
  - 合并 var 语句，让代码更短。
  - 函数内部的变量定义应作为函数内的第一条语句。
  - for 语句初始化部分不应该有变量声明，应提前到外面。
- 立即执行的函数需要被一眼看出来，可以将函数用一堆圆括号包裹起来。
- 严格模式不要加在全局，只应加在需要用到的函数作用域内，避免影响其他库。
- 禁止使用 eval，new Function，setTimeOut，setInterval 的字符串形式。
- 三元运算符仅仅用在赋值语句上，不要成为 if else 的替代品。

:::tip 提示
String 类型可以调用 String 包装器的方法，是因为语句的背后，JS 引擎创建了 String 类型的新实例，紧跟着就销毁了，所以给 String 类型上添加属性和方法是没有用的。
:::

## 编程实践

在 WEB 开发中，用户界面是由三个彼此隔离又相互作用的层定义的：HTML、CSS、JavaScript。由于这三个部分是相互作用的，应该尽量分开这几个模块，以增强代码的可维护性。

- 将 JS 从 CSS 中抽离出来。
  - 避免使用 CSS 表达式。
- 将 CSS 从 JS 中抽离出来。
  - 避免使用 JS 直接操作 dom.style 属性。
  - 应该只需要操作 CSS 的 className 属性。
- 将 JS 从 HTML 中抽离出来。
  - 避免使用 DOM0 级事件处理函数。 例如：`<div onclick="xxx"></div>`
  - 使用自定义事件处理函数。
- 将 HTML 从 JS 中抽离出来。
  - 避免 JS 使用写死的 HTML 字符串，去 innerHTML 插入代码。

```js
div.innerHTML = '<h1>你好</h1>';
```

JS 可以使用一下几种方式来操作 HTML：

- 请求服务器，返回一段 HTML 文本，然后 innerHTML。
- 简单客户端模板，写一个页面不可见的模板，用变量的值去填充模板后，插入到页面中来。
- 复杂客户端模板，使用 Handlebars，创建模板，渲染数据。

### 避免创建全局变量

我们都知道，在全局作用域下定义的变量和方法，都会挂载到 window 对象上，随着对象越挂越多，项目也就越来越难以维护了。创建全局变量还会导致以下几个问题：

- 命名冲突
- 代码脆弱性
  - 如果大量函数都引用了全局变量，而一旦某个地方不小心改变了值，所有使用的地方就完了。
- 难以测试
  - 开发环境，测试环境，线上环境，都需要引入一套不同的全局变量，不方便维护。

#### 解决全局变量方案

- **单全局变量**
  - 只使用一个对象定义在全局变量上，其他的对象都作为这个对象的属性和方法。
  - 引用命名空间概念：
    - 调用 namespace() 来声明开发者将要使用的命名空间，即：将对象挂载到哪个对象下，如果不存在，就创建一个对象。
- **AMD 模块化**
  - 定义一个 define 方法，将模块名，依赖，都传进去，在工厂方法里就能使用所依赖的模块了。

```js
// AMD 模块定义
define('module-name', ['dep1', 'dep2'], function(dep1, dep2) {});
```

- 使用 RequireJS 更好地引入模块。

RequireJS 增加了另一个全局函数 require()，专门用来加载指定的依赖和执行回调函数。

```js
require(['my-book'], function(books) {
  console.log(books);
});
```

- **零全局变量**
  - 如果你的脚本非常短，并且不需要和其他代码产生交互，可以**使用一个自执行函数来实现模块化**。

### 事件处理

在编写事件处理程序时，我们应该遵守一下几点：

- 隔离应用逻辑。将应用逻辑从所有的事件处理程序中抽离出来。
- 不要分发事件对象。只传递需要的数据，给应用逻辑就行了。
- 让事件处理程序成为接触到 Event 对象的唯一函数。其他需要用到的，就从事件处理程序中传递。

实际应用场景是这样的：

```html
<button onclick="doSomeThing()">click me</button>

<script>
  // 事件处理程序
  function doSomeThing(e) {
    var clientX = e.clientX;

    // 不要将e 传入应用逻辑中，只传递需要使用的字段
    log(clientX);
  }

  // 应用逻辑
  function log(text) {
    console.log(text);
  }
</script>
```

### 类型检测

#### 检测原始类型

推荐使用 typeof 来检测原始类型的值。typeof 本身是一个表达式，所以推荐使用无括号的写法。

#### 检测自定义类

JS 检测自定义类时，最好的做法是使用 instanceof，这也是唯一的方法。

```js
function Person(){}

var p = new Person():

console.log(p instanceof Person);
```

instanceof 也可以检测引用对象的值。但可能会检测到原型对象上。

```js
var now = new Date();

console.log(now instanceof Date); // true
console.log(now instanceof Object); // true
```

#### 检测函数

typeof 是检测 JS 检测函数的最佳选择。但 IE8 及其以前的浏览器对 DOM 上的方法实现方式有问题。

```js
// IE 8 会存在问题
typeof document.getElementById; // object
```

#### 检测数组

使用 Object.prototype.toString.call(value) === '[object Array]' 检测数组效果很不错，在 ES6 中可以通过 Array.isArray 来实现。

#### 检测属性

检测属性使用以下两个操作符：

- in 运算符（会检测原型链上的属性）
- hasOwnProperty

### 将配置数据从代码中分离出来

在实际的项目中可以遇到这种问题，本来只需要更改一些静态数据，但由于不小心改到了其他业务代码，导致部分业务代码报错。所以，把需要配置的静态数据抽离出来是非常利于维护的。一般按照以下几点将数据抽离出来：

- URL
- 展示给用户的字符串
- 重复的值
- 设置信息
- 任何可能发生变更的值

我们可以将抽离出来的配置数据放在以下几个地方：

- 抽离数据到一个 JSON 文件中。（通过请求去获取）
- 抽离封装到一个 JSONP 文件中。（通过 script 标签获取）
- 使用纯 javascript。（直接读取）

### 抛出自定义错误

我们在开发项目时，遇到错误其实并不可怕，可怕的将这些错误带到线上环境中去。为此，在程序的一些关键地方，使用自定义错误，可以让我们在上线前提前发现问题，避免出错的影响变大。编写自定义错误可以遵守一下几点：

- 总是在错误信息中包含函数名称，以及函数失败的原因。
- 只在该抛出错误的地方抛出错误，不必要过度的进行错误预判，抛出错误。
- 如果使用 try catch ，catch 里不能为空，应该对错误做一些处理。
- 对于自定义错误，最好是继承 Error 错误类型，浏览器会给 Error 对象附加一些额外的信息。

```js
function MyError(message) {
  this.message = message;
}
MyError.prototype = new Error();
```

### 不是你的对象不要动

在我们编写代码的时候，会用到很多其他对象，一些是存在于上下文作用域中、一些是存在于其他库里等等，这些对象都不是我们自己定义的。对于这些对象，我们要做到完全不去改动。其他对象主要包括：

- JS 原生对象
- DOM 对象
- 浏览器对象模型，BOM 对象
- 类库的对象

即使是目前项目中的对象，只要不是你写的，也不应该随便修改。

- 不要覆盖方法
- 不新增方法
  - 例如：Prototype 库，是在源生 JS 上扩展一些方法，但扩展的方法可能以后被新的规范所使用，Prototype 库不得不立即修改以支持新的规范。
- 不删除方法

如果是必须要修改其他对象，可以通过继承的方式来克隆一个之前的对象，然后再进行扩展。

- 基于对象的继承（常规的继承）
- 基于类型的继承（如继承 Error 类型）

#### 关于 Polyfill

Polyfills 的优点是：如果浏览器提供原生实现，可以非常轻松的移除他们。如果浏览器没有实现，就使用现有的方法，巧妙地实现，实现过程可能会不精确。

#### 为了防止对象修改

- 防止扩展 Object.preventExtensions() 不可扩展
- 密封对象 Object.seal() 不能删除已存在属性，不可扩展
- 冻结对象 Object.freeze() 不能修改已存在的属性，不能删除已存在属性，不可扩展

### 浏览器嗅探

1、user-agent 方式（可以被篡改）。

2、使用特性检测。为特定浏览器的特性进行测试，并仅当特性存在时即可应用特性检测。例如：

```js
// 早期浏览器不支持 getElementById
if (document.getElementById) {
  var dom = document.getElementById('xx');
} else if (document.all) {
  var dom = document.all('xx');
}
```

特性检测的流程：

- 探测标准的方法。
- 探测不同浏览器的特定方法。
- 都不存在时，提供一个合乎逻辑的备用方法。

#### 避免特性推断

推断是假设并非事实。例如：这里根据 getElementsByTagName 去推断 getElementById，显然是不合理的。

```js
if (document.getElementsByTagName) {
  var dom = document.getElementById('xx');
}
```

#### 避免浏览器推断

通过 document.all 判断就是 IE 浏览器了，这是“自作聪明”的，因为其他浏览器也可能存在 document.all。

```js
if (document.all) {
  console.log('This is IE');
}
```

## 自动化

以下列举了书中介绍的自动化配置过程，很实用，现在的项目都可以使用这些思想来配置持续集成。可惜的是，现在看来书中的信息比较滞后（因为写的早），很多介绍的库已经过时了，这里就不详细介绍了。

- ant 构建工具
- 校验语法错误
- 文件合并和加工
- 文件精简和压缩
- 文档化
- 自动化测试
  - PhantomJS
- 组装到一起
  - jekins

## 总结

这本书看着很快，三天时间就看完了，但书中的编码规范，编程实践部分还是学到了不少东西。现在写代码会常常冒出几个问题：注释该怎么写？类型判断要怎么才最好？数据代码是否抽离？
