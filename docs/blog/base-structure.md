# 数据结构总结

数据结构表示计算机存储数据的方式，常常结合算法来操作数据。

## 按逻辑结构分类

反映数据元素之间的逻辑关系。

- 集合（无逻辑关系）
- 线性结构（线性表）
  - 一维数组。
  - 队列。
  - 栈。
- 非线性结构。
  - 树。
  - 图。
  - 多维数组。

## 按存储结构分类

数据结构在计算机中的表示，是按照真实的物理地址分类。

- 顺序存储结构
  - 数组。
- 链式存储结构。
  - 链表。
- 索引存储结构。（增加了附加的索引表，来确定结点存储地址）
  - 数据库索引
- 散列存储结构。（将索引存储结构中的索引存到了数据内，即直接根据数据就能找到存储地址）

[存储结构分类](https://www.cnblogs.com/fengty90/p/3768826.html)

## 前端中的数据结构和算法

### 内存栈和内存堆

- 函数执行的时候会把局部变量压到一个栈里面。
- 内存里的堆是指存放 new 处来动态创建变量的地方。

栈区(stack)：又编译器自动分配释放，存放函数的参数值，局部变量 的值等，其操作方式类似于数据结构的栈。

堆区(heap)：一般是由程序员分配释放，若程序员不释放的话，程 序结束时可能由 OS 回收，值得注意的是他与数据结构的堆是两回事，分配方式 倒是类似于数据结构的链表。

全局区(static)：也叫静态数据内存空间，存储全局变量和静态变量， 全局变量和静态变量的存储是放一块的，初始化的全局变量和静态变量放一块 区域，没有初始化的在相邻的另一块区域，程序结束后由系统释放。

文字常量区：常量字符串就是放在这里，程序结束后由系统释放。

程序代码区：存放函数体的二进制代码。

::: tip 提示
简单类型的变量存在栈里，引用类型变量存在堆里。

堆内存低位向高位增长，栈内存相反。
:::

### 时间复杂度和空间复杂度

`时间复杂度`：这是一个函数，它定性描述了该算法的运行时间。一个算法的质量优劣将影响到算法乃至程序的效率。

`空间复杂度`：对一个算法在运行过程中临时占用存储空间大小的量度。

Set 一般是使用红黑树实现的，红黑树是一种平衡查找二叉树，它的查找时间复杂度为 O(logN)。从 O(N)变成 O(logN)，而总体时间从 O(N2)变成 O(NlogN)。

Chrome V8 的 Set 是用哈希实现的，它是一个哈希 Set，哈希的查找复杂度为 O(1)，因此总的时间复 杂度为 O(N)，Set/Map 都是这样，

哈希的存储空间通常为数据大小的两倍，典型的用空间换时间的算法。

### Object 和 Map 比较

1、都是一种以 键-值存储数据的结构，我们只要输入待查找的值即 key，即可查找到其对应的值。

2、Obejct 的 key 只能是字符串。

3、遍历 Array 的时间复杂度是 O(n)，而遍历 Object 的 时间复杂度是 O(1)，Obejct 要更快。

4、Map 可以轻松的获取大小，Object 必须手动追踪大小。

5、存储结构不一样， Object 有一个专门存放 key 和一个存放 value 的数组，如果能找到 key，则拿到这个 key 的 index 去另外一个数 组取出 value 值。当发生散列值冲突时，根据当前 的 index，直接计算下一个查找位置。

### trie 树

字典树 是一种树形结构，是一种哈希树的变种。

应用：

典型应用是用于统计，排序和保存大量的字符串(但不仅限于字符串)，所以经常被搜索引擎系统用于 文本词频统计。

优点：

利用字符串的公共前缀来减少查询时间，最大限度地减少无谓的字符串比较，查询效率比哈希树高。

## 二叉树代码实现

```javascript
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

## 散列代码实现

```javascript
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
      console.log('健是：' + i + '，值是：' + this.table[i]);
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
