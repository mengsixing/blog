# 高级排序算法

## 希尔排序

它会首先比较较远的元素而非相邻的元素。让元素尽快回到正确的位置。通过定义一个间隔序列来表示在排序过程中进行比较的元素间。公开的间隔序列是 701，301，132，57，23，10，4，1.(质数)。

```javascript
var CArray = function() {
  this.dataSource = [10, 8, 3, 2, 5, 9, 4, 7, 35, 47, 20];
  this.shellsort = shellSort;
  this.gaps = [5, 3, 1];
};
//希尔排序
function shellSort() {
  var gaps = [5, 3, 1];
  for (var g = 0; g < gaps.length; g++) {
    for (var i = gaps[g]; i < this.dataSource.length; i++) {
      var temp = this.dataSource[i];
      for (
        var j = i;
        j >= gaps[g] && this.dataSource[j - gaps[g]] > temp;
        j -= gaps[g]
      ) {
        this.dataSource[j] = this.dataSource[j - gaps[g]];
      }
      this.dataSource[j] = temp;
    }
    console.log("调换后：", this.dataSource);
  }
}

var c = new CArray();
c.shellsort();
console.log(c.dataSource);
```

## 快速排序

在列表中选择一个元素作为基准值，排序围绕这个基准值进行，将列表中小小于基准值的放入数组底部大于放顶部。

```javascript
function qSort(list) {
  if (list.length == 0) {
    return [];
  }
  var pivot = list[0];
  var lesser = [];
  var greater = [];
  for (var i = 1; i < list.length; i++) {
    if (list[i] < pivot) {
      lesser.push(list[i]);
    } else {
      greater.push(list[i]);
    }
  }
  return qSort(lesser).concat(pivot, qSort(greater));
}
var myArray = [2, 3, 1, 9, 6, 4, 7, 8, 5];
var arr = qSort(myArray);
console.log(arr);
```

## 归并排序

把一系列排好序的子序列合并成一个大的完整有序序列。

```javascript
//归并排序
function mergeSort(arr) {
  if (arr.length < 2) {
    return;
  }
  var step = 1;
  var left, right;
  while (step < arr.length) {
    left = 0;
    right = step;
    while (right + step <= arr.length) {
      merageArrays(arr, left, left + step, right, right + step);
      left = right + step;
      right = left + step;
    }
    if (right < arr.length) {
      merageArrays(arr, left, left + step, right, arr.length);
    }
    step *= 2;
  }
}
function merageArrays(arr, startLeft, stopLeft, startRight, stopRight) {
  var rightArr = new Array(stopRight - startRight + 1);
  var leftArr = new Array(stopLeft - startLeft + 1);
  k = startRight;
  for (var i = 0; i < rightArr.length - 1; i++) {
    rightArr[i] = arr[k];
    ++k;
  }
  k = startLeft;
  for (var i = 0; i < leftArr.length - 1; i++) {
    leftArr[i] = arr[k];
    ++k;
  }
  rightArr[rightArr.length - 1] = Infinity;
  leftArr[leftArr.length - 1] = Infinity;
  var m = 0;
  var n = 0;
  for (var k = startLeft; k < stopRight; k++) {
    if (leftArr[m] <= rightArr[n]) {
      arr[k] = leftArr[m];
      m++;
    } else {
      arr[k] = rightArr[n];
      n++;
    }
  }
}
var arr = [2, 3, 7, 9, 8, 5, 4, 6, 1];
console.log("原始数组：", arr);
mergeSort(arr);
console.log("排列后数组：", arr);
```
