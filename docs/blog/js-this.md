# JS 理解 This

本以为对 js 中的 this 已经很熟练了，再看完冴羽的博客后，才发现自己对 es 规范知之甚少，原来我都是根据经验在判断 this，这篇文章会从最底层的 es 规范上去介绍 this 的判断。

## 一道测试题引发的思考

第一次做这道题时，只对了第一题。。

```js
var value = 1;

var foo = {
  value: 2,
  bar: function() {
    return this.value;
  }
};

//示例1
console.log(foo.bar());
//示例2
console.log((foo.bar)());
//示例3
console.log((foo.bar = foo.bar)());
//示例4
console.log((false || foo.bar)());
//示例5
console.log((foo.bar, foo.bar)());
```

先想一想这道题的答案，然后解释一下原因。

## 规范文档

要彻底弄明白上面的测试题，还得看规范文档 😂

常见的几种规范：

- Reference 类型
- 函数调用规范
- 属性读取规范
- 括号运算规范
- 赋值运算规范
- 逻辑与算法规范
- 逗号运算规范

### Reference 类型

在 ECMAScript 规范中还有一种只存在于规范中的类型，它们的作用是用来描述语言底层行为逻辑。

- [规范 8.7 The Reference Specification Type](http://es5.github.io/#x8.7)

  Reference 类型实例大致长这样：

  ```js
  var foo = {
    bar: function() {
      return this;
    }
  };
  var fooReference = {
    base: EnvironmentRecord,
    name: "foo",
    strict: false
  };
  GetBase(fooReference); // EnvironmentRecord;

  var barReference = {
    base: "foo",
    name: "bar",
    strict: false
  };
  GetBase(barReference); // foo;
  ```

  - `GetBase(V)`. Returns the base value component of the reference V.
  - `HasPrimitiveBase(V)`. Returns true if the base value is a Boolean, String, or Number.
  - `IsPropertyReference(V)`. Returns true if either the base value is an object or HasPrimitiveBase(V) is true; otherwise returns false.

- [8.7.1 GetValue (V)](http://es5.github.io/#x8.7.1)

  - If Type(V) is not Reference, return V.
  - Let base be the result of calling GetBase(V).

- [规范 10.2.1.1.6 ImplicitThisValue()](http://es5.github.io/#x10.2.1.1.6)

  - Return `undefined`.

### 函数调用规范

- [规范 11.2.3 Function Calls](http://es5.github.io/#x11.2.3)：

  - `步骤1`将 ref 赋值为 MemberExpression（简单理解 MemberExpression 其实就是()左边的部分）
  - `步骤2`判断 ref 的类型
    - `步骤3`如果 ref 是 Reference 类型
      - `步骤4`如果 IsPropertyReference(ref) 是 true, 那么 this 的值为 GetBase(ref)
      - `步骤5`如果 base value 值是 Environment Record, 那么 this 的值为 ImplicitThisValue(ref)
    - `步骤6`如果 ref 不是 Reference 类型，那么 this 的值为 undefined

::: warning 提示
非严格模式下，this 的值为 undefined 的时候，其值会被隐式转换为全局对象。
:::

### 示例 1 解答

1、使用`属性读取`规范：获取 `foo.bar` 的返回类型。

2、交给函数调用规范，去解析 this。

- [规范 11.2.1 Property Accessors](http://es5.github.io/#x11.2.1)

  - `Return a value of type Reference` whose base value is baseValue and whose referenced name is propertyNameString, and whose strict mode flag is strict.
  - 由此可见，属性读取，默认返回一个 Reference 类型

- 函数调用规范
  - `步骤1` -> `步骤2` -> `步骤3` -> `步骤4`

### 示例 2 解答

1、使用`属性读取`规范：获取 `foo.bar` 的返回类型。

2、使用`括号运算符`规范：获取 `(foo.bar)` 的返回类型。

3、交给函数调用规范，去解析 this。

- [查看规范 11.1.6 The Grouping Operator](http://es5.github.io/#x11.1.6)
  - Return the result of evaluating Expression. `This may be of type Reference`.
  - 实际上 () 并没有对 MemberExpression 进行计算，所以其实跟示例 1 的结果是一样的。
- 函数调用规范
  - `步骤1` -> `步骤2` -> `步骤3` -> `步骤4`

### 示例 3 解答

1、使用`赋值运算符`规范：获取 `foo.bar = foo.bar` 的返回类型。

2、使用`括号运算符`规范：获取 `(foo.bar = foo.bar)` 的返回类型。

3、交给函数调用规范，去解析 this。

- [规范 11.13.1 Simple Assignment ( = )](http://es5.github.io/#x11.13.1)
  - Let rval be `GetValue(rref)`.
  - Return rval. 返回的是 GetValue 后的值，不是一个 Refernce。
- 函数调用规范
  - `步骤1` -> `步骤2` -> `步骤6`

### 示例 4 解答

1、使用`逻辑与算法`规范：获取 `false || foo.bar` 的返回类型。

2、使用`括号运算符`规范：获取 `(false || foo.bar)` 的返回类型。

3、交给函数调用规范，去解析 this。

- [规范 11.11 Binary Logical Operators](http://es5.github.io/#x11.11)
  - Let rval be `GetValue(rref)`.
  - Return rval. 返回的是 GetValue 后的值，不是一个 Refernce。
- 函数调用规范
  - `步骤1` -> `步骤2` -> `步骤6`

### 示例 5 解答

1、使用`逗号操作符`规范：获取 `foo.bar, foo.bar` 的返回类型。

2、使用`括号运算符`规范：获取 `(foo.bar, foo.bar)` 的返回类型。

3、交给函数调用规范，去解析 this。

- [规范 11.14 Comma Operator ( , )](http://es5.github.io/#x11.14)
  - Return `GetValue(rref)`. 返回的是 GetValue 后的值，不是一个 Refernce。
- 函数调用规范
  - `步骤1` -> `步骤2` -> `步骤6`

## 一个最普通的情况

```js
function foo() {
  console.log(this);
}

foo();

GetBase(fooReference); // EnvironmentRecord;
```

1、使用`标识符解析`规范：获取 `foo` 的返回类型。

2、交给函数调用规范，去解析 this。

- [规范 10.3.1 Identifier Resolution](http://es5.github.io/#x10.3.1)
  - The result of evaluating an identifier `is always a value of type Reference` with its referenced name component equal to the Identifier String.
- 函数调用规范
  - `步骤1` -> `步骤2` -> `步骤3` -> `步骤5`

### 总结

遇到问题时，尽量从原理的角度看待问题，不要凭经验办事情，不妨多研究研究底层规范。

## 相关链接

- [JavaScript 深入之从 ECMAScript 规范解读 this](https://github.com/mqyqingfeng/Blog/issues/7)
- [ES5 规范文档](http://es5.github.io)
