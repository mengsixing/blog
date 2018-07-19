# js module 语法

## commonjs 模块

在运行时完成模块加载。

## es6 模块

自动采用严格模式。
es6可以在编译时完成模块加载。

### export 模块

用于规定模块的对外接口。

export命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系。

``` js
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

export 命令可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域，就会报错（违背了静态化初衷）。

### import 命令

用于输入其他模块提供的功能。

import 命令具有提升效果，会提升到整个模块的头部并首先执行。
本质是import命令式便一阶段执行的，在代码运行之前。

由于import是静态执行的，不能使用表达式和变量，只有在运行时才能得到结果的语法结构。
``` js
import { 'a'+'bcd' } from 'my_module'
```

多次重复执行同一句import语句，那么只会执行一次。
``` js
//执行一次
import {a} from 'my_module'
import {b} from 'my_module'
// 执行一次
import 'lodash'
import 'lodash'
```

### 模块的整体加载

整体模块加载所在的对象应该是可以静态分析的，所以不允许运行时改变
``` js
import * as xxx from 'my_module'
// 报错
xxx.foo = '123'
```

### export default 命令

本质上，export default 就是输出一个叫做default 的变量或方法。

``` js
class MyClass{}

export default MyClass;
// 相等于
export {MyClass as default } ;
```

### import() 方法

动态加载模块，可以在条件运算，表达式中使用。

返回一个promise对象。
import() 类似于node的require方法，区别主要是，前者是异步加载，后者是同步加载。

``` js
import('my_module').then(res=>{
    console.log(res.default);
})
```

## 模块的加载实现

0、传统的script标签

``` js
// 下载完就执行
<script type="application/javascript" scr="foo.js" async></script>
// 整个页面正常渲染完才会执行
<script type="application/javascript" scr="foo2.js" defer></script>
```

1、使用浏览器script标签

``` js
<script type="module" scr="foo.js"></script>
```

代码是在模块作用域之中云进行，而不是在全局作用域中运行。

### es6模块和commonjs模块的差异

* commonjs模块输出的是一个值得复制，es6模块输出的是值的引用
* commonjs模块是运行时加载，es6模块是编译时输出接口

es6模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。
es6输入的模块变量知识一个“符号链接”，所以这个变量是制度的，对他重新赋值会报错。

``` js
import {a} from 'my_module'
// 报错
a.porp ='123';
```

### 模块加载

``` js
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

commonjs模块循环加载，值输出已执行的部分，还未执行的额部分不会输出。
``` js
// a.js
exports.done = false;
var b = require('./b.js');
console.log('在 a.js 之中，b.done = %j', b.done);
exports.done = true;
console.log('a.js 执行完毕');

// b.js
exports.done = false;
var a = require('./a.js');
console.log('在 b.js 之中，a.done = %j', a.done);
exports.done = true;
console.log('b.js 执行完毕');
```

上面代码之中，b.js执行到第二行，就会去加载a.js，这时，就发生了“循环加载”。系统会去a.js模块对应对象的exports属性取值，可是因为a.js还没有执行完，从exports属性只能取回已经执行的部分，而不是最后的值。
a.js已经执行的部分，只有一行。
因此，对于b.js来说，它从a.js只输入一个变量done，值为false。
然后，b.js接着往下执行，等到全部执行完毕，再把执行权交还给a.js。于是，a.js接着往下执行，直到执行完毕。

``` js
在 b.js 之中，a.done = false
b.js 执行完毕
在 a.js 之中，b.done = true
a.js 执行完毕
在 main.js 之中, a.done=true, b.done=true
```


es6加载的变量都是动态引用其所在模块的。只要应用存在，代码就能执行。

``` js


Search
目录
前言
ECMAScript 6简介
let 和 const 命令
变量的解构赋值
字符串的扩展
正则的扩展
数值的扩展
函数的扩展
数组的扩展
对象的扩展
Symbol
Set 和 Map 数据结构
Proxy
Reflect
Promise 对象
Iterator 和 for...of 循环
Generator 函数的语法
Generator 函数的异步应用
async 函数
Class 的基本语法
Class 的继承
Decorator
Module 的语法
Module 的加载实现
编程风格
读懂规格
ArrayBuffer
最新提案
参考链接
其他
源码
修订历史
反馈意见
Module 的加载实现
浏览器加载
ES6 模块与 CommonJS 模块的差异
Node 加载
循环加载
ES6 模块的转码
上一章介绍了模块的语法，本章介绍如何在浏览器和 Node 之中加载 ES6 模块，以及实际开发中经常遇到的一些问题（比如循环加载）。

浏览器加载
传统方法
HTML 网页中，浏览器通过<script>标签加载 JavaScript 脚本。

<!-- 页面内嵌的脚本 -->
<script type="application/javascript">
  // module code
</script>

<!-- 外部脚本 -->
<script type="application/javascript" src="path/to/myModule.js">
</script>
上面代码中，由于浏览器脚本的默认语言是 JavaScript，因此type="application/javascript"可以省略。

默认情况下，浏览器是同步加载 JavaScript 脚本，即渲染引擎遇到<script>标签就会停下来，等到执行完脚本，再继续向下渲染。如果是外部脚本，还必须加入脚本下载的时间。

如果脚本体积很大，下载和执行的时间就会很长，因此造成浏览器堵塞，用户会感觉到浏览器“卡死”了，没有任何响应。这显然是很不好的体验，所以浏览器允许脚本异步加载，下面就是两种异步加载的语法。

<script src="path/to/myModule.js" defer></script>
<script src="path/to/myModule.js" async></script>
上面代码中，<script>标签打开defer或async属性，脚本就会异步加载。渲染引擎遇到这一行命令，就会开始下载外部脚本，但不会等它下载和执行，而是直接执行后面的命令。

defer与async的区别是：defer要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行；async一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。一句话，defer是“渲染完再执行”，async是“下载完就执行”。另外，如果有多个defer脚本，会按照它们在页面出现的顺序加载，而多个async脚本是不能保证加载顺序的。

加载规则
浏览器加载 ES6 模块，也使用<script>标签，但是要加入type="module"属性。

<script type="module" src="./foo.js"></script>
上面代码在网页中插入一个模块foo.js，由于type属性设为module，所以浏览器知道这是一个 ES6 模块。

浏览器对于带有type="module"的<script>，都是异步加载，不会造成堵塞浏览器，即等到整个页面渲染完，再执行模块脚本，等同于打开了<script>标签的defer属性。

<script type="module" src="./foo.js"></script>
<!-- 等同于 -->
<script type="module" src="./foo.js" defer></script>
如果网页有多个<script type="module">，它们会按照在页面出现的顺序依次执行。

<script>标签的async属性也可以打开，这时只要加载完成，渲染引擎就会中断渲染立即执行。执行完成后，再恢复渲染。

<script type="module" src="./foo.js" async></script>
一旦使用了async属性，<script type="module">就不会按照在页面出现的顺序执行，而是只要该模块加载完成，就执行该模块。

ES6 模块也允许内嵌在网页中，语法行为与加载外部脚本完全一致。

<script type="module">
  import utils from "./utils.js";

  // other code
</script>
对于外部的模块脚本（上例是foo.js），有几点需要注意。

代码是在模块作用域之中运行，而不是在全局作用域运行。模块内部的顶层变量，外部不可见。
模块脚本自动采用严格模式，不管有没有声明use strict。
模块之中，可以使用import命令加载其他模块（.js后缀不可省略，需要提供绝对 URL 或相对 URL），也可以使用export命令输出对外接口。
模块之中，顶层的this关键字返回undefined，而不是指向window。也就是说，在模块顶层使用this关键字，是无意义的。
同一个模块如果加载多次，将只执行一次。
下面是一个示例模块。

import utils from 'https://example.com/js/utils.js';

const x = 1;

console.log(x === window.x); //false
console.log(this === undefined); // true
利用顶层的this等于undefined这个语法点，可以侦测当前代码是否在 ES6 模块之中。

const isNotModuleScript = this !== undefined;
ES6 模块与 CommonJS 模块的差异
讨论 Node 加载 ES6 模块之前，必须了解 ES6 模块与 CommonJS 模块完全不同。

它们有两个重大差异。

CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
第二个差异是因为 CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

下面重点解释第一个差异。

CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。请看下面这个模块文件lib.js的例子。

// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};
上面代码输出内部变量counter和改写这个变量的内部方法incCounter。然后，在main.js里面加载这个模块。

// main.js
var mod = require('./lib');

console.log(mod.counter);  // 3
mod.incCounter();
console.log(mod.counter); // 3
上面代码说明，lib.js模块加载以后，它的内部变化就影响不到输出的mod.counter了。这是因为mod.counter是一个原始类型的值，会被缓存。除非写成一个函数，才能得到内部变动后的值。

// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  get counter() {
    return counter
  },
  incCounter: incCounter,
};
上面代码中，输出的counter属性实际上是一个取值器函数。现在再执行main.js，就可以正确读取内部变量counter的变动了。

$ node main.js
3
4
ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的import有点像 Unix 系统的“符号连接”，原始值变了，import加载的值也会跟着变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。

还是举上面的例子。

// lib.js
export let counter = 3;
export function incCounter() {
  counter++;
}

// main.js
import { counter, incCounter } from './lib';
console.log(counter); // 3
incCounter();
console.log(counter); // 4
上面代码说明，ES6 模块输入的变量counter是活的，完全反应其所在模块lib.js内部的变化。

再举一个出现在export一节中的例子。

// m1.js
export var foo = 'bar';
setTimeout(() => foo = 'baz', 500);

// m2.js
import {foo} from './m1.js';
console.log(foo);
setTimeout(() => console.log(foo), 500);
上面代码中，m1.js的变量foo，在刚加载时等于bar，过了 500 毫秒，又变为等于baz。

让我们看看，m2.js能否正确读取这个变化。

$ babel-node m2.js

bar
baz
上面代码表明，ES6 模块不会缓存运行结果，而是动态地去被加载的模块取值，并且变量总是绑定其所在的模块。

由于 ES6 输入的模块变量，只是一个“符号连接”，所以这个变量是只读的，对它进行重新赋值会报错。

// lib.js
export let obj = {};

// main.js
import { obj } from './lib';

obj.prop = 123; // OK
obj = {}; // TypeError
上面代码中，main.js从lib.js输入变量obj，可以对obj添加属性，但是重新赋值就会报错。因为变量obj指向的地址是只读的，不能重新赋值，这就好比main.js创造了一个名为obj的const变量。

最后，export通过接口，输出的是同一个值。不同的脚本加载这个接口，得到的都是同样的实例。

// mod.js
function C() {
  this.sum = 0;
  this.add = function () {
    this.sum += 1;
  };
  this.show = function () {
    console.log(this.sum);
  };
}

export let c = new C();
上面的脚本mod.js，输出的是一个C的实例。不同的脚本加载这个模块，得到的都是同一个实例。

// x.js
import {c} from './mod';
c.add();

// y.js
import {c} from './mod';
c.show();

// main.js
import './x';
import './y';
现在执行main.js，输出的是1。

$ babel-node main.js
1
这就证明了x.js和y.js加载的都是C的同一个实例。

Node 加载
概述
Node 对 ES6 模块的处理比较麻烦，因为它有自己的 CommonJS 模块格式，与 ES6 模块格式是不兼容的。目前的解决方案是，将两者分开，ES6 模块和 CommonJS 采用各自的加载方案。

Node 要求 ES6 模块采用.mjs后缀文件名。也就是说，只要脚本文件里面使用import或者export命令，那么就必须采用.mjs后缀名。require命令不能加载.mjs文件，会报错，只有import命令才可以加载.mjs文件。反过来，.mjs文件里面也不能使用require命令，必须使用import。

目前，这项功能还在试验阶段。安装 Node v8.5.0 或以上版本，要用--experimental-modules参数才能打开该功能。

$ node --experimental-modules my-app.mjs
为了与浏览器的import加载规则相同，Node 的.mjs文件支持 URL 路径。

import './foo?query=1'; // 加载 ./foo 传入参数 ?query=1
上面代码中，脚本路径带有参数?query=1，Node 会按 URL 规则解读。同一个脚本只要参数不同，就会被加载多次，并且保存成不同的缓存。由于这个原因，只要文件名中含有:、%、#、?等特殊字符，最好对这些字符进行转义。

目前，Node 的import命令只支持加载本地模块（file:协议），不支持加载远程模块。

如果模块名不含路径，那么import命令会去node_modules目录寻找这个模块。

import 'baz';
import 'abc/123';
如果模块名包含路径，那么import命令会按照路径去寻找这个名字的脚本文件。

import 'file:///etc/config/app.json';
import './foo';
import './foo?search';
import '../bar';
import '/baz';
如果脚本文件省略了后缀名，比如import './foo'，Node 会依次尝试四个后缀名：./foo.mjs、./foo.js、./foo.json、./foo.node。如果这些脚本文件都不存在，Node 就会去加载./foo/package.json的main字段指定的脚本。如果./foo/package.json不存在或者没有main字段，那么就会依次加载./foo/index.mjs、./foo/index.js、./foo/index.json、./foo/index.node。如果以上四个文件还是都不存在，就会抛出错误。

最后，Node 的import命令是异步加载，这一点与浏览器的处理方法相同。

内部变量
ES6 模块应该是通用的，同一个模块不用修改，就可以用在浏览器环境和服务器环境。为了达到这个目标，Node 规定 ES6 模块之中不能使用 CommonJS 模块的特有的一些内部变量。

首先，就是this关键字。ES6 模块之中，顶层的this指向undefined；CommonJS 模块的顶层this指向当前模块，这是两者的一个重大差异。

其次，以下这些顶层变量在 ES6 模块之中都是不存在的。

arguments
require
module
exports
__filename
__dirname
如果你一定要使用这些变量，有一个变通方法，就是写一个 CommonJS 模块输出这些变量，然后再用 ES6 模块加载这个 CommonJS 模块。但是这样一来，该 ES6 模块就不能直接用于浏览器环境了，所以不推荐这样做。

// expose.js
module.exports = {__dirname};

// use.mjs
import expose from './expose.js';
const {__dirname} = expose;
上面代码中，expose.js是一个 CommonJS 模块，输出变量__dirname，该变量在 ES6 模块之中不存在。ES6 模块加载expose.js，就可以得到__dirname。

ES6 模块加载 CommonJS 模块
CommonJS 模块的输出都定义在module.exports这个属性上面。Node 的import命令加载 CommonJS 模块，Node 会自动将module.exports属性，当作模块的默认输出，即等同于export default xxx。

下面是一个 CommonJS 模块。

// a.js
module.exports = {
  foo: 'hello',
  bar: 'world'
};

// 等同于
export default {
  foo: 'hello',
  bar: 'world'
};
import命令加载上面的模块，module.exports会被视为默认输出，即import命令实际上输入的是这样一个对象{ default: module.exports }。

所以，一共有三种写法，可以拿到 CommonJS 模块的module.exports。

// 写法一
import baz from './a';
// baz = {foo: 'hello', bar: 'world'};

// 写法二
import {default as baz} from './a';
// baz = {foo: 'hello', bar: 'world'};

// 写法三
import * as baz from './a';
// baz = {
//   get default() {return module.exports;},
//   get foo() {return this.default.foo}.bind(baz),
//   get bar() {return this.default.bar}.bind(baz)
// }
上面代码的第三种写法，可以通过baz.default拿到module.exports。foo属性和bar属性就是可以通过这种方法拿到了module.exports。

下面是一些例子。

// b.js
module.exports = null;

// es.js
import foo from './b';
// foo = null;

import * as bar from './b';
// bar = { default:null };
上面代码中，es.js采用第二种写法时，要通过bar.default这样的写法，才能拿到module.exports。

// c.js
module.exports = function two() {
  return 2;
};

// es.js
import foo from './c';
foo(); // 2

import * as bar from './c';
bar.default(); // 2
bar(); // throws, bar is not a function
上面代码中，bar本身是一个对象，不能当作函数调用，只能通过bar.default调用。

CommonJS 模块的输出缓存机制，在 ES6 加载方式下依然有效。

// foo.js
module.exports = 123;
setTimeout(_ => module.exports = null);
上面代码中，对于加载foo.js的脚本，module.exports将一直是123，而不会变成null。

由于 ES6 模块是编译时确定输出接口，CommonJS 模块是运行时确定输出接口，所以采用import命令加载 CommonJS 模块时，不允许采用下面的写法。

// 不正确
import { readFile } from 'fs';
上面的写法不正确，因为fs是 CommonJS 格式，只有在运行时才能确定readFile接口，而import命令要求编译时就确定这个接口。解决方法就是改为整体输入。

// 正确的写法一
import * as express from 'express';
const app = express.default();

// 正确的写法二
import express from 'express';
const app = express();
CommonJS 模块加载 ES6 模块
CommonJS 模块加载 ES6 模块，不能使用require命令，而要使用import()函数。ES6 模块的所有输出接口，会成为输入对象的属性。

// es.mjs
let foo = { bar: 'my-default' };
export default foo;

// cjs.js
const es_namespace = await import('./es.mjs');
// es_namespace = {
//   get default() {
//     ...
//   }
// }
console.log(es_namespace.default);
// { bar:'my-default' }
上面代码中，default接口变成了es_namespace.default属性。

下面是另一个例子。

// es.js
export let foo = { bar:'my-default' };
export { foo as bar };
export function f() {};
export class c {};

// cjs.js
const es_namespace = await import('./es');
// es_namespace = {
//   get foo() {return foo;}
//   get bar() {return foo;}
//   get f() {return f;}
//   get c() {return c;}
// }
循环加载
“循环加载”（circular dependency）指的是，a脚本的执行依赖b脚本，而b脚本的执行又依赖a脚本。

// a.js
var b = require('b');

// b.js
var a = require('a');
通常，“循环加载”表示存在强耦合，如果处理不好，还可能导致递归加载，使得程序无法执行，因此应该避免出现。

但是实际上，这是很难避免的，尤其是依赖关系复杂的大项目，很容易出现a依赖b，b依赖c，c又依赖a这样的情况。这意味着，模块加载机制必须考虑“循环加载”的情况。

对于 JavaScript 语言来说，目前最常见的两种模块格式 CommonJS 和 ES6，处理“循环加载”的方法是不一样的，返回的结果也不一样。

CommonJS 模块的加载原理
介绍 ES6 如何处理“循环加载”之前，先介绍目前最流行的 CommonJS 模块格式的加载原理。

CommonJS 的一个模块，就是一个脚本文件。require命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象。

{
  id: '...',
  exports: { ... },
  loaded: true,
  ...
}
上面代码就是 Node 内部加载模块后生成的一个对象。该对象的id属性是模块名，exports属性是模块输出的各个接口，loaded属性是一个布尔值，表示该模块的脚本是否执行完毕。其他还有很多属性，这里都省略了。

以后需要用到这个模块的时候，就会到exports属性上面取值。即使再次执行require命令，也不会再次执行该模块，而是到缓存之中取值。也就是说，CommonJS 模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓存。

CommonJS 模块的循环加载
CommonJS 模块的重要特性是加载时执行，即脚本代码在require的时候，就会全部执行。一旦出现某个模块被"循环加载"，就只输出已经执行的部分，还未执行的部分不会输出。

让我们来看，Node 官方文档里面的例子。脚本文件a.js代码如下。

exports.done = false;
var b = require('./b.js');
console.log('在 a.js 之中，b.done = %j', b.done);
exports.done = true;
console.log('a.js 执行完毕');
上面代码之中，a.js脚本先输出一个done变量，然后加载另一个脚本文件b.js。注意，此时a.js代码就停在这里，等待b.js执行完毕，再往下执行。

再看b.js的代码。

exports.done = false;
var a = require('./a.js');
console.log('在 b.js 之中，a.done = %j', a.done);
exports.done = true;
console.log('b.js 执行完毕');
上面代码之中，b.js执行到第二行，就会去加载a.js，这时，就发生了“循环加载”。系统会去a.js模块对应对象的exports属性取值，可是因为a.js还没有执行完，从exports属性只能取回已经执行的部分，而不是最后的值。

a.js已经执行的部分，只有一行。

exports.done = false;
因此，对于b.js来说，它从a.js只输入一个变量done，值为false。

然后，b.js接着往下执行，等到全部执行完毕，再把执行权交还给a.js。于是，a.js接着往下执行，直到执行完毕。我们写一个脚本main.js，验证这个过程。

var a = require('./a.js');
var b = require('./b.js');
console.log('在 main.js 之中, a.done=%j, b.done=%j', a.done, b.done);
执行main.js，运行结果如下。

$ node main.js

在 b.js 之中，a.done = false
b.js 执行完毕
在 a.js 之中，b.done = true
a.js 执行完毕
在 main.js 之中, a.done=true, b.done=true
上面的代码证明了两件事。一是，在b.js之中，a.js没有执行完毕，只执行了第一行。二是，main.js执行到第二行时，不会再次执行b.js，而是输出缓存的b.js的执行结果，即它的第四行。

exports.done = true;
总之，CommonJS 输入的是被输出值的拷贝，不是引用。

另外，由于 CommonJS 模块遇到循环加载时，返回的是当前已经执行的部分的值，而不是代码全部执行后的值，两者可能会有差异。所以，输入变量的时候，必须非常小心。

var a = require('a'); // 安全的写法
var foo = require('a').foo; // 危险的写法

exports.good = function (arg) {
  return a.foo('good', arg); // 使用的是 a.foo 的最新值
};

exports.bad = function (arg) {
  return foo('bad', arg); // 使用的是一个部分加载时的值
};
上面代码中，如果发生循环加载，require('a').foo的值很可能后面会被改写，改用require('a')会更保险一点。

ES6 模块的循环加载
ES6 处理“循环加载”与 CommonJS 有本质的不同。ES6 模块是动态引用，如果使用import从一个模块加载变量（即import foo from 'foo'），那些变量不会被缓存，而是成为一个指向被加载模块的引用，需要开发者自己保证，真正取值的时候能够取到值。

请看下面这个例子。

// a.mjs
import {bar} from './b';
console.log('a.mjs');
console.log(bar);
export let foo = 'foo';

// b.mjs
import {foo} from './a';
console.log('b.mjs');
console.log(foo);
export let bar = 'bar';
```

z


参考资料：

[module加载的实现](http://es6.ruanyifeng.com/#docs/module-loader)




