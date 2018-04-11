---
layout: post
title:  "js继承"
date:   2018-04-10 11:02:25 +0800
categories: inherit 
---

## ES5 继承

1、原型链
> 重写原型对象，代之以一个数新类型实例。
> 问题：引用类型所有实例共享，无法向超类型传参，会影响其他子元素。

2、借用构造函数
> 子类型构造函数内部调用超类型构造函数，call，apply
> 问题：函数复用无从谈起

3、组合继承：
> 使用原型链实现对原型属性和方法的继承，用构造函数类实现对实例属性的继承。
> 缺点：执行2次

4、原型继承：
> Object.create()
> 返回新对象，原型指向传入对象。

5、寄生式继承：
> 在Object.create()的基础上，增加自定义属性和方法来增强对象。

6、寄生组合式继承：
``` js
function inherit(subType,superType){
  var prototype=Object.create(superType.prototype);
  prototype.constructor=subType;
  subType.prototype=prototype;
}
function SuperType(age){
  this.age=age;
}


function SubType(age){
  SuperType.call(this,age);
}

inherit(SubType,SuperType);

var instance = new SubType(123);
var instance2 = new SubType(456);

console.log(instance.age);
console.log(instance2.age);


```


