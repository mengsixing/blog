# JS 实现继承

JS 中可以通过多种方式来实现继承，我们来仔细分析一下。

## ES5 中的继承

ES5 中可以通过如下方式实现继承：

- 原型链
  - 重写原型对象，代之以一个新的类型实例。
  - 问题：引用类型所有实例共享，无法向超类型传参，会影响其他子元素。
- 借用构造函数
  - 子类型构造函数内部调用超类型构造函数，call，apply。
  - 问题：函数复用无从谈起
- 组合继承
  - 使用原型链实现对原型属性和方法的继承，用构造函数类实现对实例属性的继承。
  - 问题：执行 2 次
- 原型继承
  - Object.create()
  - 返回新对象，原型指向传入对象。
- 寄生式继承
  - 在 Object.create()的基础上，增加自定义属性和方法来增强对象。
- 寄生组合式继承
  - es5 中完美解决方案

```js
function inherit(subType, superType) {
  var prototype = Object.create(superType.prototype);
  prototype.constructor = subType;
  subType.prototype = prototype;
}

function SuperType(age) {
  this.age = age;
}

function SubType(age) {
  SuperType.call(this, age);
}

inherit(SubType, SuperType);

var instance = new SubType(123);
var instance2 = new SubType(456);

console.log(instance.age);
console.log(instance2.age);
```

## ES6 中的继承

ES6 采用 class extends 进行继承。和 ES5 继承的区别：

- ES5 的继承实质是先创造子类的实例对象 this，然后再将父类的方法添加到 this 上面。
- ES6 的继承实质是先创造父类的实例对象 this，然后再用子类的构造函数修改 this。

### super

使用 super 的时候，必须显示指定是作为函数还是作为对象使用，否则会报错。

super 调用父类的方法时，super 会绑定子类的 this。

### __proto__属性

每一个对象都有__proto__属性，指向对应的构造函数的 prototype 属性。

子类的__proto__属性表示构造函数的继承，总是指向父类。

子类 prototype 的__proto__属性表示方法的继承，总是指向父类的 prototype 属性。

```js
class A{}
class B extends A{}

console.log(B.__proto__ ===A); // true
console.log(B.prototype.__proto__ ===A.prototype); // true
```

### 继承目标

只要是一个有 prototype 属性的函数，就能被继承。

根据 ES5 和 ES6 继承的区别，可以得出如下结论：

ES5 无法继承内置构造函数，Boolean，Number，String，Array，Date，Function，RegExp，Error，Object。

ES6 可以，但继承 Object 不行，（特例，因为无法向父类 object 传参）。
