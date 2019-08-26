# 算法面试题

- 排序
- 分治
- 数学运算
- 查找
- 递归和循环
- 回溯算法
- 贪心算法
- 动态规划

## 回溯算法

- 78 子集
- 46 全排列
- 89 格雷编码

### 78 子集

[leetcode 78](https://leetcode-cn.com/problems/subsets/)

```js
var subsets = function(nums) {
  var result = [];
  var temp = [];
  loop(nums, result, temp, 0);
  return result;
};

function loop(nums, result, temp, index) {
  result.push([...temp]);
  for (var i = index; i < nums.length; i++) {
    temp.push([nums[i]]);
    loop(nums, result, temp, i + 1);
    temp.pop();
  }
}
```

### 46 全排列

[leetcode 46](https://leetcode-cn.com/problems/permutations/)

```js
var permute = function(nums) {
  var result = [];
  loop(nums, result, []);
  return result;
};

function loop(nums, result, temp) {
  if (temp.length === nums.length) {
    result.push([...temp]);
  }
  for (var i = 0; i < nums.length; i++) {
    if (temp.includes(nums[i])) continue;
    temp.push(nums[i]);
    loop(nums, result, temp, i + 1);
    temp.pop();
  }
}
```

### 格雷编码

[leetcode 89](https://leetcode-cn.com/problems/gray-code/)

```js
/**
  关键是搞清楚格雷编码的生成过程, G(i) = i ^ (i/2);
  如 n = 3:
  G(0) = 000,
  G(1) = 1 ^ 0 = 001 ^ 000 = 001
  G(2) = 2 ^ 1 = 010 ^ 001 = 011
  G(3) = 3 ^ 1 = 011 ^ 001 = 010
  G(4) = 4 ^ 2 = 100 ^ 010 = 110
  G(5) = 5 ^ 2 = 101 ^ 010 = 111
  G(6) = 6 ^ 3 = 110 ^ 011 = 101
  G(7) = 7 ^ 3 = 111 ^ 011 = 100
**/
function grayCode(n) {
  var array = [];
  for (var i = 0; i < 2 ** n; i++) {
    array.push(i ^ (i / 2));
  }
  return array;
}
```

## 贪心算法

### 1、老师分饼干

老师分饼干，每个孩子只能得到一块饼干，但每个孩子想要的饼干大小不尽相同。目标是尽量让更多的孩子满意。 如孩子的要求是 [1, 3, 5, 4, 2]，饼干大小是[1, 1]，最多能让 1 个孩子满足。 如孩子的要求是 [10, 9, 8, 7, 6]，饼干大小是[7, 6, 5]，最多能让 2 个孩子满足。

符合**贪心算法**思想，在满足孩子的情况下，使孩子的饼干尽可能小。

```js
function splitCake(childrenIssue, cake) {
  var sortChildrenIssue = childrenIssue.sort((item1, item2) => item1 - item2);
  var sortCake = cake.sort((item1, item2) => item1 - item2);
  var result = [];
  for (
    var i = 0, j = 0;
    i < sortChildrenIssue.length && j < sortCake.length;
    j++
  ) {
    if (sortChildrenIssue[i] <= sortCake[j]) {
      result.push(sortChildrenIssue[i]);
      i++;
    }
  }
  return result;
}
```

排序的时间复杂度为 `O(n*log(n))`，两根指针的时间的复杂度为 `O(n)`，总的时间复杂度为`O(n*log(n))`
