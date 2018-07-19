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


参考资料：

[module加载的实现](http://es6.ruanyifeng.com/#docs/module-loader)




