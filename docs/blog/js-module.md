# JS 模块化

介绍一下 JS 中的模块化。

## ES6 之前的模块化

在 ES6 之前，社区制定了一些模块加载方案，最主要的有 CommonJS 和 AMD 两种。前者用于服务器，后者用于浏览器。

- CommonJS 和 AMD 模块，都只能在运行时确定这些东西。

## ES6 中的模块化

ES6 模块化有以下特点：

- 自动采用严格模式。
- 在编译时完成模块加载。

### export 模块

用于规定模块的对外接口。

- export 命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系。
- export 命令可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域，就会报错（违背了静态化初衷）。

```js
// 报错
export 1;

// 报错
var m = 1;
export m;

// 正确
export var m = 1;

// 正确
var m = 1;
export {m};

// 正确
var n=1;
export {n as m}
```

### import 命令

用于导入其他模块。

- import 命令具有提升效果，会提升到整个模块的头部并首先执行。

- 本质是 import 命令式编译阶段执行的，在代码运行之前。

- 由于 import 是静态执行的，不能使用表达式和变量，只有在运行时才能得到结果的语法结构。

```js
// 报错
import { 'a' + 'bcd' } from 'my_module'
```

- 多次重复执行同一句 import 语句，那么只会执行一次。

```js
//执行一次
import { a } from "my_module";
import { b } from "my_module";

// 执行一次
import "lodash";
import "lodash";
```

### 模块的整体加载

用星号（\*）指定一个对象，所有输出值都加载在这个对象上面。

- 整体模块加载所在的对象应该是可以静态分析的，所以不允许运行时改变。

```js
import * as xxx from "my_module";
// 报错
xxx.foo = "123";
```

### export default 命令

本质上，export default 就是输出一个叫做 default 的变量或方法。

```js
class MyClass{}

export default MyClass;
// 相等于
export { MyClass as default } ;
```

### import() 方法

动态加载模块，可以在条件运算，表达式中使用。**返回一个 promise 对象**。

import() 类似于 node 的 require 方法，区别主要是，前者是异步加载，后者是同步加载。

```js
import("my_module").then(res => {
  console.log(res.default);
});
```

## 模块的加载实现

1、传统的 script 标签

```js
// 下载完就执行
<script type="application/javascript" scr="foo.js" async></script>
// 整个页面正常渲染完才会执行
<script type="application/javascript" scr="foo2.js" defer></script>
```

2、使用浏览器 script 标签加载 module

```js
<script type="module" scr="foo.js" />
```

- 代码是在模块作用域之中进行，而不是在全局作用域中运行。

### ES6 模块和 commonjs 模块的差异

- commonjs 模块输出的是一个值的复制，ES6 模块输出的是值的引用。
- commonjs 模块是运行时加载，ES6 模块是编译时输出接口。

- ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。
- ES6 输入的模块变量知识一个“符号链接”，所以这个变量是只读的，对他重新赋值会报错。

```js
import { a } from "my_module";
// 报错
a.porp = "123";
```

### 模块加载

```js
import './foo'
//依次寻找
.foo.js
.foo.package.json
.foo/index.js

import 'foo'
//依次寻找
./node_modules/foo.js
./node_modules/foo/packagejson.js
./node_modules/foo/index.js
//向上一级继续寻找
../node_modules/foo.js
../node_modules/foo.js
../node_modules/foo.js
//继续向上一级寻找
../../node_modules/foo.js
../../node_modules/foo.js
../../node_modules/foo.js
...
```

### 循环加载

#### commonjs 模块循环加载

commonjs 模块循环加载，只输出已执行的部分，还未执行的部分不会输出。

```js
// a.js
exports.done = false;
var b = require("./b.js");
console.log("在 a.js 之中，b.done = %j", b.done);
exports.done = true;
console.log("a.js 执行完毕");

// b.js
exports.done = false;
var a = require("./a.js");
console.log("在 b.js 之中，a.done = %j", a.done);
exports.done = true;
console.log("b.js 执行完毕");

// 执行a.js
```

- 执行 a.js。
- 执行到 a 第二行，加载 b.js。
- 执行到 b 的第二行，执行 a.js (因为 a.js 还没有执行完，从 exports 属性只能取回已经执行的部分，即：a 中的 exports.done = false;)。
- 输出 在 b.js 之中，a.done = false。
- 输出 b.js 执行完毕。
- 输出 在 a.js 之中，b.done = true。
- 输出 a.js 执行完毕。

#### ES6 模块循环加载

ES6 加载的变量都是动态引用其所在模块的。只要应用存在，代码就能执行。

```js
// a.js
import { bar } from "./b";
console.log("a.js");
console.log(bar);
export let foo = "foo";

// b.js
import { foo } from "./a";
console.log("b.js");
console.log(foo);
export let bar = "bar";
```

- 执行 a.js。
- 执行第一行，引用 b.js。
- 执行 b.js 第一行，从 a.js 输入了 foo 接口，这时不会去执行 a.js。
- 输出 b.js。
- 执行 console.log(foo); 报错，因为 foo 没有定义。

## 相关链接

- [module 语法](http://ES6.ruanyifeng.com/#docs/module)
- [module 加载的实现](http://ES6.ruanyifeng.com/#docs/module-loader)

