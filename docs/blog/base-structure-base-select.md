# 查找算法

在列表中查找数据分为两种方式，顺序查找和二分查找。顺序查找适用于元素随机排列，二分查找用于已排好的元素。

查找数据最简单的思路是从第一个元素开始对列表元素进行查找，直到找到查询的数据。这种方式称为线性查找，属于暴力查找的一种。

## 顺序查找

顺序查找会从第一个元素开始对列表元素进行查找，查询效率很低。我们可以借助于 LRU 算法思想，即最近最少使用。把经常用到的数据排到数组顶端，以减少查询次数。

```javascript
//顺序查找
function seqSearch(arr, data) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == data) {
      // 找到元素后，将元素往前移一位，下次就少循环一次，如果经常用到，就会大大减少查询次数。
      if (i > arr.length * 0.2) {
        swap(arr, i, i - 1);
      }
      return true;
    }
  }
  return -1;
}
function swap(arr, index1, index2) {
  var tmp = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = tmp;
}
var arr = [4, 6, 8, 5, 3, 1, 2, 9, 7];
console.log(arr);
seqSearch(arr, 9);
seqSearch(arr, 9);
seqSearch(arr, 9);
console.log(arr);
```

## 二分查找法

二分查找也称折半查找（Binary Search），它是一种效率较高的查找方法。但折半查找要求线性表必须采用顺序存储结构，而且表中元素按关键字有序排列。

```js
//二分查找
function bindSearch(arr, data) {
  var upperBound = arr.length - 1;
  var lowerBound = 0;
  while (lowerBound <= upperBound) {
    var mid = Math.floor((upperBound + lowerBound) / 2);
    if (arr[mid] < data) {
      lowerBound = mid + 1;
    } else if (arr[mid] > data) {
      upperBound = mid - 1;
    } else {
      return mid;
    }
  }
  return -1;
}
var sss = bindSearch(arr, 9);
console.log(sss);
```

二分查找的时间复杂度为 log(2^n).

假如有 32 个数，第 1 次查找还剩 16 份 ，第 2 次查找还剩下 8 份，第 3 次查找就只剩下 4 份了，可以这么一直找下去，找到第 5 次，就只剩下 1 个数了，即找到了对应的数字。 log(2^32) = 5。
