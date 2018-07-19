# ES6 继承

es6 采用 class extends进行继承。

## es6继承和es5继承的区别

* es5 的继承实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面。
* es6 的继承实质是先创造父类的实例对象this，然后再用子类的构造函数修改this。

## super

使用super的时候，必须显示指定是作为函数还是作为对象使用，否则会报错。

super调用父类的方法时，super会绑定子类的this。

## __proto__属性

每一个对象都有__proto__属性，指向对应的构造函数的prototype属性。

子类的__proto__属性表示构造函数的继承，总是指向父类。

子类prototype的__proto__属性表示方法的继承，总是指向父类的prototype属性。

## 继承目标

只要是一个有prototype属性的函数，就能被继承。

[根据es5和es6继承的区别](#es6继承和es5继承的区别)：

es5无法继承内置构造函数，Boolean，Number，String，Array，Date，Function，RegExp，Error，Object。

es6可以，但继承Object不行，（特例，因为无法向父类object传参）。
