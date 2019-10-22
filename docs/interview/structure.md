# 数据结构面试题

- 树
- 链表
- 数组
- 栈和队列
- 哈希表
- 堆
- 字符串
- 指针

## 树

- 144 二叉树的前序遍历
- 94 二叉树的中序遍历
- 145 二叉树的后序遍历
- 235 二叉搜索树的最近公共祖先
- 230 二叉搜索树中第 K 小的元素
- 104 二叉树的最大深度
- 236 二叉树的最近公共祖先
- 124 二叉树中的最大路径和

### 二叉树代码实现

```js
function Node(data, left, right) {
  this.data = data;
  this.left = left;
  this.right = right;
  this.show = show;
}
function show() {
  console.log(this.data);
}
function BST() {
  this.root = null;
  this.insert = insert;
  this.inOrder = inOrder;
  this.getSmalllest = getSmalllest;
  this.getMax = getMax;
  this.find = find;
  this.remove = remove;
}
function insert(data) {
  var n = new Node(data, null, null);
  if (this.root == null) {
    this.root = n;
  } else {
    var current = this.root;
    var parent;
    while (true) {
      parent = current;
      if (data < current.data) {
        current = current.left;
        if (current == null) {
          parent.left = n;
          break;
        }
      } else {
        current = current.right;
        if (current == null) {
          parent.right = n;
          break;
        }
      }
    }
  }
}
//中序排序
function inOrder(node) {
  if (node != null) {
    this.inOrder(node.left);
    console.log(node.data);
    this.inOrder(node.right);
  }
}
function getSmalllest(root) {
  var current = root;
  while (true) {
    if (!current.left) {
      return current;
    } else {
      current = current.left;
    }
  }
}
function getMax(root) {
  var current = root;
  while (true) {
    if (!current.right) {
      return current;
    } else {
      current = current.right;
    }
  }
}
function remove(data) {
  removeNode(this.root, data);
}
function find(data) {
  var current = this.root;
  while (true) {
    if (data < current.data) {
      current = current.left;
    } else if (data > current.data) {
      current = current.right;
    } else {
      return current;
    }
  }
  return null;
}
function removeNode(node, data) {
  if (node == null) {
    return null;
  }
  if (data == node.data) {
    debugger;
    if (node.left == null && node.right == null) {
      return null;
    }
    if (node.left == null && node.right != null) {
      return node.right;
    }
    if (node.right == null && node.left != null) {
      return node.right;
    }
    var tempNode = getSmalllest(node.right);
    node.data = tempNode.data;
    node.right = removeNode(node.right, tempNode.data);
    return node;
  } else if (data < node.data) {
    node.left = removeNode(node.left, data);
  } else {
    node.right = removeNode(node.right, data);
  }
}

var nums = new BST();
nums.insert(23);
nums.insert(123);
nums.insert(213);
nums.insert(3);
nums.insert(73);
nums.insert(43);
nums.insert(63);
nums.insert(13);
nums.insert(2993);
nums.inOrder(nums.root);
nums.remove(123);
console.warn('删除123以后');
nums.inOrder(nums.root);
//nums.getSmalllest(nums.root);
//nums.getMax(nums.root);
//console.log(nums.find(213));
```

### 二叉树遍历常用写法

二叉树遍历有一个通用的解决办法，适合于[前序遍历](https://leetcode-cn.com/problems/binary-tree-preorder-traversal/)，[中序遍历](https://leetcode-cn.com/problems/binary-tree-inorder-traversal/)，[后序遍历](https://leetcode-cn.com/problems/binary-tree-postorder-traversal/)。

```js
// 后序遍历
var postorderTraversal = function(root) {
  if (!root) {
    return [];
  }
  var result = [];
  traversal(root, result);
  return result;
};

function traversal(root, result) {
  // 左，右，根，则为后续遍历
  // 交换相应顺序，即可实现前序遍历，如：根，左，右
  if (root.left) {
    traversal(root.left, result);
  }
  if (root.right) {
    traversal(root.right, result);
  }
  result.push(root.val);
}
```

### 235 二叉搜索树的最近公共祖先

[leetcode 235](https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)

二叉搜索树是一种特殊的二叉树，即左节点一定小于跟节点，跟节点一定小于右节点。

```js
// 如果 root 节点都大于 p，q，证明 p，q 在 root 节点的左侧
// 如果 root 节点都小于 p，q，证明 p，q 在 root 节点的右侧
// 否则就在中间，即找到了公共父节点
var lowestCommonAncestor = function(root, p, q) {
  if (p.left === q || p.right === q) {
    return p;
  }
  if (q.left === p || q.right === p) {
    return q;
  }

  if (root.val > p.val && root.val > q.val) {
    return lowestCommonAncestor(root.left, p, q);
  }
  if (root.val < p.val && root.val < q.val) {
    return lowestCommonAncestor(root.right, p, q);
  }
  return root;
};
```

### 230 二叉搜索树中第 K 小的元素

[leetcode 230](https://leetcode-cn.com/problems/kth-smallest-element-in-a-bst/)

可以经过中序遍历，生成排好序的列表，就可以找到第 K 个元素了。

```js
var kthSmallest = function(root, k) {
  var result = [];
  traversal(root, result);
  return result[k - 1];
};

function traversal(root, result) {
  if (root.left) {
    traversal(root.left, result);
  }
  result.push(root.val);
  if (root.right) {
    traversal(root.right, result);
  }
}
```

### 104 二叉树的最大深度

[leetcode 104](https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/)

```js
var maxDepth = function(root) {
  if (!root) {
    return 0;
  }
  var leftMax = maxDepth(root.left);
  var rightMax = maxDepth(root.right);

  return Math.max(leftMax, rightMax) + 1;
};
```

### 236 二叉树的最近公共祖先

[leetcode 236](https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-tree/)

找左边子数是否满足，找右边子数是否满足，如果都不满足，则是当前 node。

```js
//所有的递归的返回值有 4 种可能性，null、p、q、公共祖先
var lowestCommonAncestor = function(root, p, q) {
  //当遍历到叶结点后就会返回 null
  if (!root) {
    return root;
  }
  // 找到元素，并返回
  if (root === p || root === q) {
    return root;
  }

  var findLeft = lowestCommonAncestor(root.left, p, q);
  var findRight = lowestCommonAncestor(root.right, p, q);

  // 左边找到一个，右边找到一个，那么公共节点就是 root 节点
  if (findLeft && findRight) {
    return root;
  }
  // 如果只在左边找到，那么就为左边的跟元素。
  if (findLeft && !findRight) {
    return findLeft;
  }
  if (findRight && !findLeft) {
    return findRight;
  }
  return null;
};
```

### 124 二叉树中的最大路径和

[leetcode 124](https://leetcode-cn.com/problems/binary-tree-maximum-path-sum/)

一个路径可以包括，左边部分，右边部分，和左中右部分。我们可以分别求出这三个部分的最大路径，然后计算出最大的最大路径。

```js
var maxPathSum = function(root) {
  var max = { number: root.val };
  loop(root, max);
  return max.number;
};

function loop(root, max) {
  if (!root) {
    return 0;
  }
  var maxLeft = Math.max(loop(root.left, max), 0);
  var maxRight = Math.max(loop(root.right, max), 0);
  var sum = root.val + maxLeft + maxRight;

  max.number = Math.max(sum, max.number);
  return Math.max(maxLeft, maxRight) + root.val;
}
```

## 栈和队列

- 155 最小栈
- 20 有效的括号

## 哈希表

### 哈希表代码实现

```js
function HashTable() {
  this.table = new Array(137);
  this.simpleHash = simpleHash;
  this.showDistro = showDistro;
  this.put = put;
  this.get = get;
  this.buildChains = buildChains;
}
//开链法解决冲突
function buildChains() {
  for (var i = 0; i < this.table.length; i++) {
    this.table[i] = new Array();
  }
}
function simpleHash(data) {
  var total = 0;
  for (var i = 0; i < data.length; i++) {
    total += data.charCodeAt(i);
  }
  return total % this.table.length;
}
function betterHash(data) {
  var H = 31;
  var total = 0;
  for (var i = 0; i < data.length; i++) {
    total += H * total + data.charCodeAt(i);
  }
  if (total < 0) {
    total += this.table.length - 1;
  }
  return total % this.table.length;
}
function put(data) {
  var pos = this.simpleHash(data);
  //this.table[pos]=data;
  var index = 0;
  //开链法
  if (this.table[pos][index] == undefined) {
    this.table[pos][index] = data;
    index++;
  } else {
    while (this.table[pos][index] != undefined) {
      ++index;
    }
    this.table[pos][index] = data;
  }

  //线性探测法
  // if(this.table[pos]==undefined) {
  //   this.table[pos]=data;
  // } else {
  //   while(this.table[pos]!=undefined) {
  //     pos++;
  //   }
  // }
}
function get(key) {
  return this.table[this.simpleHash(key)];
}
function showDistro() {
  var n = 0;
  for (var i = 0; i < this.table.length; i++) {
    if (this.table[i][0] != undefined) {
      console.log('键是：' + i + '，值是：' + this.table[i]);
    }
  }
}

var hTable = new HashTable();
hTable.buildChains();
hTable.put('china');
hTable.put('cainh');
hTable.put('aosdn');
hTable.put('vnvnin');

hTable.showDistro();
```

### 155 最小栈

[leetcode 155](https://leetcode-cn.com/problems/min-stack/)

```js
var MinStack = function() {
  this.queue = [];
  this.min = Number.MAX_SAFE_INTEGER;
};

MinStack.prototype.push = function(x) {
  this.queue.push(x);
  this.min = Math.min(x, this.min);
};

MinStack.prototype.pop = function() {
  this.queue.pop();
  this.min = Math.min.apply(null, this.queue);
};

MinStack.prototype.top = function() {
  return this.queue[this.queue.length - 1];
};

MinStack.prototype.getMin = function() {
  return this.min;
};
```

### 20 有效的括号

[leetcode 20](https://leetcode-cn.com/problems/valid-parentheses/)

```js
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
  var stack = [];
  var map = {
    '(': ')',
    '[': ']',
    '{': '}'
  };

  for (var i = 0; i < s.length; i++) {
    if (['(', '[', '{'].includes(s[i])) {
      stack.push(s[i]);
    } else {
      if (map[stack[stack.length - 1]] === s[i]) {
        stack.pop();
      } else {
        return false;
      }
    }
  }

  return stack.length === 0;
};
```

## 堆

- 23 合并 K 个排序链表
- 215 数组中的第 K 个最大元素

## 链表

- 142 环形链表 II
- 237 删除链表中的节点
- 61 旋转链表
- 160 相交链表
- 141 环形链表
- 148 排序链表
- 23 合并 K 个排序链表
- 21 合并两个有序链表
- 206 反转链表

### 环形链表 II

[leetcode 142](https://leetcode-cn.com/problems/linked-list-cycle-ii/)

```js
var detectCycle = function(head) {
  var quick = head;
  var slow = head;
  var visited;
  var isCircle = false;
  while (quick && quick.next) {
    quick = quick.next.next;
    slow = slow.next;
    if (quick === slow) {
      isCircle = true;
      xiangyu = quick;
      break;
    }
  }

  if (isCircle) {
    while (head) {
      if (head === visited) {
        return head;
      }
      head = head.next;
      visited = visited.next;
    }
  }

  return null;
};
```

解析：这里使用的 Floyd 算法，用一个快指针和慢指针来遍历数据，如果相遇，记录下相遇的位置。然后从开始位置和相遇位置进行遍历，再一次相遇的位置即是环的起始位置。

### 237 删除链表中的节点

[237 删除链表中的节点](https://leetcode-cn.com/problems/delete-node-in-a-linked-list/)

```js
var deleteNode = function(node) {
  var oldNext = node.next;
  node.val = node.next.val;
  node.next = oldNext.next;
};
```

### 160 相交链表

[leetcode 160](https://leetcode-cn.com/problems/intersection-of-two-linked-lists/)

定义两个指针, 第一轮让两个到达末尾的节点指向另一个链表的头部, 最后如果相遇则为交点(在第一轮移动中恰好抹除了长度差)。

两个指针等于移动了相同的距离, 有交点就返回, 无交点就是各走了两条指针的长度。

```js
var getIntersectionNode = function(headA, headB) {
  var h1 = headA;
  var h2 = headB;
  while (h1 != h2) {
    h1 = h1 == null ? headB : h1.next;
    h2 = h2 == null ? headA : h2.next;
  }
  return h1;
};
```

## 数组

- 11 盛最多水的容器
- 33 搜索旋转排序数组
- 54 螺旋矩阵

### 11 盛最多水的容器

[leetcode 11](https://leetcode-cn.com/problems/container-with-most-water/)

双指针算法，分别从队首和队尾进行移动，每次移动两端比较小的数据，以保证面积最大。

```js
var maxArea = function(height) {
  var max = 0;
  var left = 0;
  var right = height.length - 1;
  while (left < right) {
    var h = Math.min(height[left], height[right]);
    var area = h * (right - left);
    max = Math.max(max, area);
    if (h === height[left]) {
      left++;
    }
    if (h === height[right]) {
      right--;
    }
  }
  return max;
};
```

### 33 搜索旋转排序数组

[leetcode 33](https://leetcode-cn.com/problems/search-in-rotated-sorted-array/)

```js
var search = function(nums, target) {
  var start = 0;
  var end = nums.length - 1;
  while (start <= end) {
    var mid = ((start + end) / 2) | 0;
    // const mid = start + ((end - start) >> 1);
    if (nums[mid] === target) {
      return mid;
    }

    if (nums[mid] >= nums[start]) {
      // 前半段有序
      if (target >= nums[start] && target <= nums[mid]) {
        end = mid - 1;
      } else {
        // 不在前半段
        start = mid + 1;
      }
    } else {
      // 后半段有序
      if (target >= nums[mid] && target <= nums[end]) {
        start = mid + 1;
      } else {
        // 不在后半段
        end = mid - 1;
      }
    }
  }

  return -1;
};
```

### 54 螺旋矩阵

[leetcode 54](https://leetcode-cn.com/problems/spiral-matrix/)

按照以下顺序进行遍历。

```js
   c0 c1 c2
r0  1  2  3
r1  8  9  4
r2  7  6  5

// r0 c0->c2
// c2 r1->r2
// r2 c2->c0
// c0 r2->r1

// 遍历内层数组
// r0 +=1
// r2 -=1
// c0 +=1
// c2 -=1
```

```js
var spiralOrder = function(matrix) {
  var result = [];
  if (matrix.length == 0) return result;
  var r1 = 0,
    r2 = matrix.length - 1; // 规定当前层的上下边界
  var c1 = 0,
    c2 = matrix[0].length - 1; // 规定当前层的左右边界
  while (r1 <= r2 && c1 <= c2) {
    for (var c = c1; c <= c2; c++) result.push(matrix[r1][c]);
    for (var r = r1 + 1; r <= r2; r++) result.push(matrix[r][c2]);
    if (r1 < r2 && c1 < c2) {
      for (var c = c2 - 1; c > c1; c--) result.push(matrix[r2][c]);
      for (var r = r2; r > r1; r--) result.push(matrix[r][c1]);
    }
    // 往内部进一层
    r1++;
    r2--;
    c1++;
    c2--;
  }
  return result;
};
```

## 指针

- 26 删除排序数组中的重复项
- 415 两字符串相加
- 283 移动零
- 16 最接近的三数之和
- 19 删除链表的倒数第 N 个节点
- 27 移除元素
- 28 实现 strStr()
- 61 旋转链表
- 75 颜色分类

### 26 删除排序数组中的重复项

[leetcode 26](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array/)

```js
var removeDuplicates = function(nums) {
  var index = 1;
  for (var i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) {
      nums[index] = nums[i];
      index++;
    }
  }
  return index;
};
```

### 415 两字符串相加

[leetcode 415](https://leetcode-cn.com/problems/add-strings/solution/)

```js
var addStrings = function(num1, num2) {
  var i = num1.length - 1,
    j = num2.length - 1;
  var result = [];
  var carry = 0;
  while (i >= 0 || j >= 0 || carry != 0) {
    if (i >= 0) {
      carry += Number(num1[i--]);
    }
    if (j >= 0) {
      carry += Number(num2[j--]);
    }

    result.push(carry % 10);
    carry = (carry / 10) | 0;
  }

  return result.reverse().join('');
};
```

### 283 移动零

[leetcode 283](https://leetcode-cn.com/problems/move-zeroes/)

```js
var moveZeroes = function(nums) {
  var i = 0;
  for (var j = 0; j < nums.length; j++) {
    if (nums[j] !== 0) {
      if (i !== j) {
        nums[i] = nums[j];
        nums[j] = 0;
      }
      i++;
    }
  }
  return nums;
};
```

### 16 最接近的三数之和

[leetcode 16](https://leetcode-cn.com/problems/3sum-closest/)

1、先排序。

2、外层遍历，遍历 nums 中的每一项。

3、内层循环，以 nums[i]、nums[start]、nums[end]为组合进行比较，将最小的替换给全局的 sum 变量，根据组合的大小动态调整 start 和 end 指针，直到 start 和 end 指针重合。

4、最终得到的 sum 即为最接近 target 的 3 个数的和。

时间复杂度：nlogn + n^2 + 1 = n^2。

```js
var threeSumClosest = function(nums, target) {
  var sum = Number.MAX_SAFE_INTEGER;
  nums = nums.sort((a, b) => a - b);
  for (let i = 0; i < nums.length; i++) {
    var start = i + 1;
    var end = nums.length - 1;
    while (start < end) {
      var r = nums[i] + nums[start] + nums[end];
      if (r > target) {
        end--;
      }
      if (r < target) {
        start++;
      }
      if (r === target) {
        return target;
      }
      if (Math.abs(target - r) < Math.abs(target - sum)) {
        sum = r;
      }
    }
  }
  return sum;
};
```

### 19 删除链表的倒数第 N 个节点

[leetcode 19](https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/)

1、定义两个指针 start，end，将 end 指针移动 N 个位置。

2、将两个指针移动到链表尾部，这样 start 指针的位置就是倒数第 N+1 的元素的位置。

3、删除 start.next = start.next.next 即可删除倒数第 N 个元素。

```js
var removeNthFromEnd = function(head, n) {
  // 拼接新的 head 头部
  var start = new ListNode(Symbol());
  start.next = head;

  // 备份newHead
  var newHeadBackUp = start;

  // 将 end 移动到对应位置
  var end = start;
  var newHead = start;
  for (var i = 0; i < n; i++) {
    end = newHead.next;
    newHead = newHead.next;
  }

  // 将双指针移动到链表末尾
  while (end.next) {
    start = start.next;
    end = end.next;
  }

  // 删除节点
  start.next = start.next.next;

  return newHeadBackUp.next;
};
```

### 27 移除元素

[leetcode 27](https://leetcode-cn.com/problems/remove-element/)

1、指针 i 从数组开头开始遍历。

2、指针 j 从数组尾部开始计数。

3、当发现指针 nums[i] = val 时，将数组 j 和 i 上的数据交换（即将数组尾部和 i 进行交换，然后把尾部指针往前移，就不用再次遍历了），然后 i--。

4、当 i 和 j 相遇时，即停止遍历 i。

```js
var removeElement = function(nums, val) {
  var len = nums.length;
  var i = 0;
  var j = len;
  while (i < j) {
    if (nums[i] === val) {
      var temp = nums[j - 1];
      nums[i] = temp;
      nums[j - 1] = val;
      j--;
    } else {
      i++;
    }
  }
  return j;
};
```

### 28 实现 strStr()

[leetcode 28](https://leetcode-cn.com/problems/implement-strstr/)

这里使用了暴力法。

```js
var strStr = function(haystack, needle) {
  if (needle.length === 0) {
    return 0;
  }
  var j = 0;
  for (var i = 0; i < haystack.length; i++) {
    if (haystack[i] === needle[j]) {
      j++;
      if (j === needle.length) {
        return i - j + 1;
      }
    } else if (j > 0) {
      i = i - j;
      j = 0;
    }
  }
  return -1;
};
```

更高级的解法有：KMP 算法，Sunday 算法等。

[字符串匹配的 KMP 算法](http://www.ruanyifeng.com/blog/2013/05/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm.html)

### 61 旋转链表

[leetcode 61](https://leetcode-cn.com/problems/rotate-list/)

将链表看成一个环形，找到需要截断的部分进行截断。

1、找到链表长度，通过 k % length 找到移动的位置 x。

2、通过 length - x 即找到了最终的头部，length - x - 1 即是新链表的尾部。

3、然后进行截断拼接操作。

```js
var rotateRight = function(head, k) {
  // 边界判断
  if (!head || k === 0) {
    return head;
  }

  var length = 1;
  var headEnd = head;
  while (headEnd.next) {
    length++;
    headEnd = headEnd.next;
  }

  var moveLength = k % length;

  if (moveLength > 0) {
    var leftList = head; // 最终的尾部
    var rightList = head; // 最终的头部

    var i = length - moveLength - 1;
    while (i > 0) {
      leftList = leftList.next;
      rightList = rightList.next;
      i--;
    }

    // 将链表看成一个环形，尾部多移动一位就是头部
    rightList = rightList.next;
    // 最终的尾部
    leftList.next = null;
    // 拼接
    headEnd.next = head;
    return rightList;
  }
  return head;
};
```

### 75 颜色分类

[leetcode 75](https://leetcode-cn.com/problems/sort-colors/)

使用三指针算法进行解答。

1、使用 start 指针指向数组第一项。

2、使用 end 指针指向数组最后一项。

3、使用 current 指针指向当前访问元素。

4、遍历数组。

- 当发现 nums[current] === 0 就把当前元素和 start 位置做交换，然后 current++ start ++
- 当发现 nums[current] === 1 current++
- 当发现 nums[current] === 2 就把当前元素和 end 位置做交换，然后 end--
- 当发现 current > end 退出循环

```js
var sortColors = function(nums) {
  var start = 0;
  var end = nums.length - 1;
  var current = 0;
  while (current <= end) {
    switch (nums[current]) {
      case 0:
        swap(nums, current, start);
        start++;
        current++;
        break;
      case 2:
        swap(nums, current, end);
        end--;
        break;
      default:
        current++;
    }
  }
  return nums;
};

function swap(nums, a, b) {
  [nums[a], nums[b]] = [nums[b], nums[a]];
}
```
