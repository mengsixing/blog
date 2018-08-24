# ES6 继承

ES6 采用 class extends 进行继承。

## ES6 继承和 ES5 继承的区别

- ES5 的继承实质是先创造子类的实例对象 this，然后再将父类的方法添加到 this 上面。
- ES6 的继承实质是先创造父类的实例对象 this，然后再用子类的构造函数修改 this。

## super

使用 super 的时候，必须显示指定是作为函数还是作为对象使用，否则会报错。

super 调用父类的方法时，super 会绑定子类的 this。

## **proto**属性

每一个对象都有**proto**属性，指向对应的构造函数的 prototype 属性。

子类的**proto**属性表示构造函数的继承，总是指向父类。

子类 prototype 的**proto**属性表示方法的继承，总是指向父类的 prototype 属性。

## 继承目标

只要是一个有 prototype 属性的函数，就能被继承。

[根据 ES5 和 ES6 继承的区别](#ES6继承和ES5继承的区别)：

ES5 无法继承内置构造函数，Boolean，Number，String，Array，Date，Function，RegExp，Error，Object。

ES6 可以，但继承 Object 不行，（特例，因为无法向父类 object 传参）。
