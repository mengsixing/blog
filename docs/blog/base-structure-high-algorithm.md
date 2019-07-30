# 高级算法

介绍三种高级算法：

- 分治法
- 动态规划
- 贪心算法

## 分治法

分治法(Divide-and-Conquer) : 将原问题划分成 n 个规模较小而结构与原问题相似的子问题；递归地解决这些子问题，然后再合并其结果，就得到原问题的解。

分治模式在每一层递归上都有三个步骤：

- 分解(Divide)：将原问题分解成一系列子问题。
- 解决(Conquer)：递归地解决各个子问题。若子问题足够小，则直接求解。
- 合并(Combine)：将子问题的结果合并成原问题的解。

案例：最大子数组问题。在一个数列当中寻找一个子数列，使得这个子数列的元素之和最大。

- 分解：将原数组重中间拆分为 2 个小数组。最大子数组，要么在左边小数组，要么在右边小数组，要么在左右小数组之间。
- 解决：如果小数组元素很多，继续拆分，当拆到 1 个元素的数组时，直接求值。
- 合并：分别将最大左小数组，最大右小数组，中间数组的最大子数组进行合并。

```js
// 分治法
function findMaxSubArray(array, start, end) {
  if (start == end) {
    return [start, end, array[start]];
  }
  const mid = Math.floor((start + end) / 2);
  const leftMaxSum = findMaxSubArray(array, start, mid);
  const rightMaxSum = findMaxSubArray(array, mid + 1, end);
  const acrossMaxSum = findAcrossMidSubArray(array, start, end);

  if (leftMaxSum[2] > rightMaxSum[2] && leftMaxSum[2] > acrossMaxSum[2]) {
    return leftMaxSum;
  }

  if (rightMaxSum[2] > leftMaxSum[2] && rightMaxSum[2] > acrossMaxSum[2]) {
    return rightMaxSum;
  }
  return acrossMaxSum;
}

// 在左右数组之间
function findAcrossMidSubArray(array, start, end) {
  if (start == end) {
    return [start, end, array[start]];
  }

  const mid = Math.floor((start + end) / 2);
  //求左侧最大数组值及下标
  var leftMaxSum = Number.NEGATIVE_INFINITY;
  var leftSum = 0;
  var maxArrLeftIdx = mid;
  for (var i = mid; i >= start; i--) {
    leftSum += array[i];
    if (leftSum > leftMaxSum) {
      leftMaxSum = leftSum;
      maxArrLeftIdx = i;
    }
  }

  //求右侧最大数组值
  var rightMaxSum = Number.NEGATIVE_INFINITY;
  var rightSum = 0;
  var maxArrRightIdx = mid;
  for (var j = mid + 1; j <= end; j++) {
    rightSum += array[j];
    if (rightSum > rightMaxSum) {
      rightMaxSum = rightSum;
      maxArrRightIdx = j;
    }
  }
  return [maxArrLeftIdx, maxArrRightIdx, leftMaxSum + rightMaxSum];
}

console.warn(
  '分治法：',
  findMaxSubArray([-11, 34, 37, 30, -42, 4, 16, 47, 36, 19], 0, 9)
);
```

## 动态规划

动态规划算法的设计可以分为如下 4 个步骤：

- 描述最优解的结构。
- 递归定义最优解的值。
- 按自底向上的方式计算最优解的值。
- 由计算出的结果构造一个最优解。

动态规划适用于子问题独立且重叠的情况，也就是各子问题包含公共的子子问题。在这种情况下，若用分治法则会做许多不必要的工作，即重复地求解公共的子问题。动态规划算法对每个子子问题只求解一次，将其结果保存在一张表中，从而避免每次遇到各个子问题时重新计算答案。

案例：计算斐波那契数列，数列中第 n 项的值 = 第 n-1 项的值 + 第 n-2 项的值。

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

贪心算法（greedy algorithm），又称贪婪算法，是一种在每一步选择中都采取在当前状态下最好或最优（即最有利）的选择，从而希望导致结果是最好或最优的算法。例如在找零钱时，默认先找最大的金额，然后依次减小，那这就是一种贪心算法。

贪心算法在对问题求解时，总是做出在当前看来是最好的选择。也就是说，不从整体最优上加以考虑，他所做出的仅是在某种意义上的**局部最优解**。

案例：老师分饼干，每个孩子只能得到一块饼干，但每个孩子想要的饼干大小不尽相同。目标是尽量让更多的孩子满意。 如孩子的要求是 [1, 3, 5, 4, 2]，饼干大小是[1, 1]，最多能让 1 个孩子满足。 如孩子的要求是 [10, 9, 8, 7, 6]，饼干大小是[7, 6, 5]，最多能让 2 个孩子满足。

```js
var findContentChildren = function(children, cake) {
  var sortChildren = children.sort((a, b) => a - b);
  var sortCake = cake.sort((a, b) => a - b);
  var i = 0,
    j = 0;
  var result = 0;
  while (sortChildren[i] && sortCake[j]) {
    if (sortChildren[i] <= sortCake[j]) {
      result++;
      i++;
    }
    j++;
  }
  return result;
};
```
