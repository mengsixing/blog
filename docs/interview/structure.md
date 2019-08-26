# 数据结构面试题

- 树
- 链表
- 数组
- 栈和队列
- 哈希表
- 堆
- 字符串

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
