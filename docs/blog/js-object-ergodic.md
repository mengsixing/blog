# js对象属性的遍历

## 1、for ... in

for ... in 循环遍历对象自身和继承的可枚举属性（不含Symbol属性）

## 2、Object.keys(obj)

Object.keys 返回一个数组，包含对象自身的所有可枚举属性（不含Symbol属性）

## 3、Object.getOwnPropertyNames(obj)

Object.getOwnPropertyNames 返回一个数组，包含对象自身的所有属性（不含Symbol属性）

## 4、Object.getOwnPropertySymbols(obj)

Object.getOwnPropertySymbols 返回一个数组，包含自身的Symbol属性。

## 5、Reflect.ownKeys(obj)

Reflect.ownKeys 返回一个数组，包含自身的所有属性，包含Symbol和可枚举属性。

## 遍历次序规则

首先遍历属性名为数字的属性，按数字排序。
其次遍历属性名为字符串的属性，按生成时间排序。
最后遍历属性名为Symbol的属性，按生成时间排序。
