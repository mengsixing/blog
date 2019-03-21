# JS 运算符优先级

前两天遇到个优先级问题：

这是之前的一段拼接 path 的代码：

```js
var id = 123;
var name = "xiaoming";
var path = "http://www.xxx.com/?id=" + id + "&name=" + name;
console.log(path);
// http://www.xxx.com/?id=123&name=xiaoming
```

现在要加上一个判断条件：
如果 name 或者 id 是 null，则替换成空字符串。

```js
var id = 123;
var name = "xiaoming";
var path =
  "http://www.xxx.com/?id=" + id ? id : "" + "&name=" + name ? name : "";
console.log(path);
// 123
```

经验告诉我是运算符优先级问题，所以就查了一下资料，是因为：`? 操作符优先级低于 + 操作符`。

加上括号是不是就清晰多了？

```js
var id = 123;
var name = 'xiaoming';
var path =
  （'http://www.xxx.com/?id=' + id） ? id : '' + '&name=' + name ? name : '';
console.log(path);
// 123
```

## js 中运算符优先级

优先级从高到低

| 运算符                             | 说明                                                   |
| ---------------------------------- | ------------------------------------------------------ |
| . [](.)                             | 字段访问、数组索引、函数调用和表达式分组               |
| ++ -- - ~ ! delete new typeof void | 一元运算符、返回数据类型、对象创建、未定义的值         |
| \* / %                             | 相乘、相除、求余数                                     |
| + - +                              | 相加、相减、字符串串联                                 |
| < <= > >= instanceof               | 小于、小于或等于、大于、大于或等于、是否为特定类的实例 |
| == != === !==                      | 相等、不相等、全等，不全等                             |
| &&                                 | 逻辑“与”                                               |
| \|\|                               | 逻辑“或”                                               |
| ?:                                 | 条件运算                                               |
| = OP=                              | 赋值、赋值运算（如 += 和 &=）                          |
| ,                                  | 多个计算                                               |

## 相关链接

- [MDN](<https://msdn.microsoft.com/zh-cn/library/z3ks45k7(v=vs.94).aspx>)
- [JavaScript 运算符优先级（从高到低）](https://github.com/xhlwill/blog/issues/16)
