# 高级算法

介绍两种高级算法：动态规划和贪心算法。

## 动态规划

分治法(Divide-and-Conquer) : 将原问题划分成 n 个规模较小而结构与原问题相似的子问题；递归地解决这些子问题，然后再合并其结果，就得到原问题的解。

分治模式在每一层递归上都有三个步骤：

分解(Divide)：将原问题分解成一系列子问题；
解决(Conquer)：递归地解决各个子问题。若子问题足够小，则直接求解。
合并(Combine)：将子问题的结果合并成原问题的解。

```js
//斐波那契数列
function recurFib(n) {
  if (n < 2) {
    return n;
  } else {
    return recurFib(n - 1) + recurFib(n - 2);
  }
}
console.log('斐波那契数列', recurFib(100));

//动态规划
function dynFib(n) {
  var val = [];
  for (var i = 0; i <= n; i++) {
    val[i] = 0;
  }
  if (n == 0) {
    return 0;
  } else if (n == 1 || n == 2) {
    return 1;
  } else {
    val[0] = 0;
    val[1] = 1;
    val[2] = 1;
    for (var i = 3; i <= n; i++) {
      val[i] = val[i - 1] + val[i - 2];
    }
    return val[n];
  }
}
console.log('动态规划', dynFib(10));

//动态规划，不用数组
function iterFib(n) {
  if (n > 0) {
    var last = 1;
    var nestLast = 1;
    var result = 1;
    for (var i = 2; i < n; i++) {
      result = last + nestLast;
      nestLast = last;
      last = result;
    }
    return result;
  } else {
    return 0;
  }
}
console.log('动态规划不用数组', iterFib(10));
```

## 贪心算法

他是一种寻找“优质解”为手段达成整体解决方案的算法。这些优质的解决方案称为局部最优解。将有希望得到正确答案的最终解决方案称为全局最优解，“贪心”会用那些看起来近乎无法找到完整解决方案的问题，次优解也是可以接受的。

```js
//贪心算法
function makeChange(orginRmb, coins) {
  var remainRmb = 0;
  if (originRmb % 50 < originRmb) {
    coins[3] = parseInt(originRmb % 50, 10);
    remainRmb = originRmb % 50;
    originRmb = remainRmb;
  }
  if (originRmb % 10 < originRmb) {
    coins[2] = parseInt(originRmb % 10, 10);
    remainRmb = originRmb % 10;
    originRmb = remainRmb;
  }
  if (originRmb % 5 < originRmb) {
    coins[1] = parseInt(originRmb % 5, 10);
    remainRmb = originRmb % 5;
    originRmb = remainRmb;
  }
  coins[0] = originRmb % 1;
}
var originRmb = 63;
var coins = [];
makeChange(originRmb, coins);
for (var i = 3; i >= 0; i--) {
  if (coins[i] >= 0) {
    var text =
      i == 3
        ? '使用 50 元找零后，'
        : i === 2
        ? '使用 10元 找零后，'
        : i === 1
        ? '使用 5 元找零后，'
        : i === 0
        ? '使用 1 元找零后，'
        : '';
    console.log(text + '剩余：', coins[i]);
  } else {
    var text =
      i == 3
        ? '没有使用 50 元找零，'
        : i === 2
        ? '没有使用 10 元找零，'
        : i === 1
        ? '没有使用 5 元找零，'
        : i === 0
        ? '没有使用 1 元找零，'
        : '';
    console.log(text + '剩余：', coins[i + 1]);
  }
}
```
