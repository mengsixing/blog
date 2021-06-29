# 算法面试题

- 排序
- 分治
- 数学运算
- 查找
- 递归和循环
- 哈希算法
- 回溯算法
- 贪心算法
- 动态规划
- 取巧方法
- 树

## 查找

- 搜索插入位置

### 搜索插入位置

- [leetcode 35](https://leetcode-cn.com/problems/search-insert-position/)

使用二分法，效率最高。

```js
var searchInsert = function(nums, target) {
  let start = 0;
  let end = nums.length;
  while (start < end) {
    let mid = Math.floor((start + end) / 2);
    if (target === nums[mid]) {
      return mid;
    } else if (target > nums[mid]) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }

  if (nums[start] < target) {
    return start + 1;
  } else {
    return start;
  }
};
searchInsert([1, 3, 5, 6], 2);
```

## 递归和循环

属于暴利解法，使用递归或循环，将复杂的逻辑拆解，核心在于优化代码的量级，减少循环次数。

- 两数相除
- 在排序数组中查找元素的第一个和最后一个位置

### 两数相除

[leetcode 29](https://leetcode-cn.com/problems/divide-two-integers/)

```js
// string 模拟小学除法
// 除此之外，可以使用 2** 0 2** 1 2** 2 逐渐靠近除数的方式循环求解
// 使用 << 左移 >> 右移 可以模拟乘法
var divide = function(dividend, divisor) {
  var res = 0;
  var sign = dividend > 0 ? (divisor > 0 ? "" : "-") : divisor > 0 ? "-" : "";
  dividend = Math.abs(dividend);
  divisor = Math.abs(divisor);
  var strdiv = String(dividend);
  var quot = "",
    remainder = "";
  for (var i = 0; i < strdiv.length; i++) {
    remainder += strdiv[i];
    var temp = 0;
    var m = parseInt(remainder);
    while (divisor <= m) {
      m = m - divisor;
      temp++;
    }
    quot += temp;
    remainder = String(m);
  }
  var res = parseInt(sign + quot);
  if (res > Math.pow(2, 31) - 1 || res < Math.pow(-2, 31))
    return Math.pow(2, 31) - 1;
  return res;
};
```

### 在排序数组中查找元素的第一个和最后一个位置

[leetcode 34](https://leetcode-cn.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

```js
var searchRange = function(nums, target) {
  const result = [-1, -1];
  let leftIndex = binarySearch(nums, target, true);
  if (leftIndex == nums.length || nums[leftIndex] != target) {
    return result;
  }
  result[0] = leftIndex;
  result[1] = binarySearch(nums, target, false) - 1;

  return result;
};

// flag=true  表示左边坐标
// flag=false 表示右边坐标
function binarySearch(nums, target, flag) {
  let start = 0;
  let end = nums.length;
  while (start < end) {
    const mid = Math.floor((start + end) / 2);
    if (nums[mid] > target || (nums[mid] === target && flag)) {
      end = mid;
    }
    if (nums[mid] < target || (nums[mid] === target && !flag)) {
      start = mid + 1;
    }
  }
  return start;
}
// binarySearch([5, 7, 7, 8, 8, 10], 8, false);
```

## 哈希算法

- 字母异位词分组

### 字母异位词分组

[leetcode 49](https://leetcode-cn.com/problems/group-anagrams/)

```js
// todo
```

## 回溯算法

回溯算法实际上就是一个决策树的遍历过程，好像是在走路，先从列表中选一步，然后在剩下的丼中选择第二步，不断重复，直到走到路的尽头，然后再倒回来，把没有走过的路再走一遍。

- 78 子集
- 46 全排列
- 89 格雷编码
- 17 电话号码的字母组合
- 22 括号生成

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
    loop(nums, result, temp);
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

### 电话号码的字母组合

[leetcode 17](https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number/)

```js
var letterCombinations = function(digits) {
  const map = {
    2: "abc",
    3: "def",
    4: "ghi",
    5: "jkl",
    6: "mno",
    7: "pqrs",
    8: "tuv",
    9: "wxyz"
  };
  const tempArrays = [];
  const phoneNumbers = digits.split("");
  phoneNumbers.forEach(phoneNumber => {
    const charts = map[phoneNumber].split("");
    tempArrays.push(charts);
  });
  let result = [];
  loop(tempArrays, result, [], 0);
  return result;
};

function loop(array, result, temp, index) {
  if (temp.length === array.length && array.length > 0) {
    result.push(temp.join(""));
  }
  if (index > array.length - 1) {
    return;
  }
  for (var i = 0; i < array[index].length; i++) {
    temp.push(array[index][i]);
    loop(array, result, temp, index + 1);
    temp.pop();
  }
}
```

### 括号生成

[leetcode 22](https://leetcode-cn.com/problems/generate-parentheses/)

```js
var generateParenthesis = function(n) {
  let result = [];
  loop(result, [], n);
  return result;
};

function loop(result, temp, n) {
  const leftTempLength = temp.filter(item => item === "(").length;
  const rightTempLength = temp.filter(item => item === ")").length;
  if (temp.length === n * 2 && leftTempLength === rightTempLength) {
    const item = temp.join("");
    result.push(item);
    return;
  }

  if (leftTempLength < n) {
    temp.push("(");
    loop(result, temp, n);
    temp.pop();
  }

  if (leftTempLength > rightTempLength) {
    temp.push(")");
    loop(result, temp, n);
    temp.pop();
  }
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

## 取巧方法

- 下一个排列
- 有效数独
- 旋转图像

### 下一个排列

[leetcode 31](https://leetcode-cn.com/problems/next-permutation/)

```js
var nextPermutation = function(nums) {
  let i = nums.length - 2;
  while (i >= 0 && nums[i + 1] <= nums[i]) {
    i--;
  }
  if (i >= 0) {
    let j = nums.length - 1;
    while (j >= 0 && nums[j] <= nums[i]) {
      j--;
    }
    swap(nums, i, j);
  }
  reverse(nums, i + 1);
};

function reverse(nums, start) {
  let i = start,
    j = nums.length - 1;
  while (i < j) {
    swap(nums, i, j);
    i++;
    j--;
  }
}

function swap(nums, i, j) {
  const temp = nums[i];
  nums[i] = nums[j];
  nums[j] = temp;
}
```

### 有效数独

[leetcode 36](https://leetcode-cn.com/problems/valid-sudoku/)

1、行和列很好判断，直接遍历即可。
2、子数独在判断时，可以根据遍历的行和列，判断出在哪一个子数独里。
3、一次双循环就可以了。

```js
/**
 * @param {character[][]} board
 * @return {boolean}
 */
var isValidSudoku = function(board) {
  let row = {};
  let cell = {};
  let subBoard = {};
  for (let i = 0; i < 9; i++) {
    row[i] = new Set();
    cell[i] = new Set();
    subBoard[i] = new Set();
  }
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] !== ".") {
        // 判断行
        if (row[i].has(board[i][j])) {
          return false;
        }
        // 判断列
        if (cell[j].has(board[i][j])) {
          return false;
        }
        // 判断子数独
        const subIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
        if (subBoard[subIndex].has(board[i][j])) {
          return false;
        }
        // 添加到：行、列、子模块
        row[i].add(board[i][j]);
        cell[j].add(board[i][j]);
        subBoard[subIndex].add(board[i][j]);
      }
    }
  }
  return true;
};
```

### 外观数列

[leetcode 38](https://leetcode-cn.com/problems/count-and-say/)

```js
var countAndSay = function(n) {
  let list = ["1"];
  while (list.length <= n) {
    let result = "";
    let preNumber = list[list.length - 1];

    let count = 1;
    for (let i = 1; i < preNumber.length; i++) {
      if (preNumber[i] === preNumber[i - 1]) {
        count++;
      } else {
        result += count + preNumber[i - 1];
        count = 1;
      }
    }
    result += count + preNumber[preNumber.length - 1];
    list.push(result);
  }
  console.log(list);
  return list[n - 1];
};
```

### 旋转图像

[leetcode 48](https://leetcode-cn.com/problems/rotate-image/)

- 先置换，将不属于该行的元素，放在对应的行中去，通过行列交换。
- 后反转，交换后，正好每一行反转一下即可得到目标数组。

```js
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function(matrix) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = i; j < matrix.length; j++) {
      const temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }
  for (let i = 0; i < matrix.length; i++) {
    matrix[i].reverse();
  }
};
```

## 先排序再运算

- 合并区间

### 合并区间

[leetcode 56](https://leetcode-cn.com/problems/merge-intervals/)

- 先排序，然后进行合并

```js
/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {
  if (intervals.length === 0 || intervals.length === 1) {
    return intervals;
  }
  const sortIntervals = intervals.sort((a, b) => {
    return a[0] - b[0];
  });

  const result = [];
  let temp = intervals[0];
  for (let index = 1; index < sortIntervals.length; index++) {
    const current = sortIntervals[index];

    if (temp[1] >= current[0]) {
      const max = Math.max(temp[1], current[1]);
      temp[1] = max;
    } else {
      result.push([...temp]);
      temp = current;
    }

    if (index === sortIntervals.length - 1) {
      result.push(temp);
    }
  }
  return result;
};
```

## 树

### Trie 树

[leetcode 208 实现 Trie 前缀树](https://leetcode-cn.com/problems/implement-trie-prefix-tree/)

```js
class Trie {
  constructor() {
    this.root = {};
  }
  insert(word) {
    let temp = this.root;
    for (let c of word) {
      if (!temp[c]) {
        temp[c] = {};
      }
      temp = temp[c];
    }
    temp.isWord = true;
  }
  traverse(word) {
    let temp = this.root;
    for (let c of word) {
      if (!temp[c]) {
        return temp[c];
      }
      temp = temp[c];
    }
    return temp;
  }
  search(word) {
    const node = this.traverse(word);
    return !!node && !!node.isWord;
  }
  startsWith(word) {
    return !!this.traverse(word);
  }
}
```
