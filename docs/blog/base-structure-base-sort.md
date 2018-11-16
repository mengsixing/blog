# 基本排序算法

## 冒泡排序

它是最慢的排序算法之一，数据值会像气泡一样从数组的一端漂浮到另一端。

```javascript
function bubbleSort() {
  const arrayLength = this.dataSource.length;
  for (var outer = 1; outer < arrayLength; outer++) {
    for (var inner = 1; inner <= arrayLength - outer; inner++) {
      if (this.dataSource[inner - 1] > this.dataSource[inner]) {
        this.swap(inner, inner - 1);
      }
    }
  }
}
```

## 选择排序

从数组的开头开始，将第一个元素和其他元素比，较最小的元素会被放到数组的第一个位置，再从第二个位置继续。

```javascript
function selectSort() {
  var min;
  for (var outer = 0; outer < this.dataSource.length - 2; outer++) {
    min = outer;
    for (var inner = outer + 1; inner <= this.dataSource.length - 1; inner++) {
      if (this.dataSource[inner] < this.dataSource[min]) {
        min = inner;
      }
    }
    this.swap(outer, min);
  }
}
```

## 插入排序

类似于人们按数组或字母顺序对数据进行排序，后面的要为前面腾位置（叠卷子）。

```javascript
function insertSort() {
  var temp, inner;
  for (var outer = 1; outer < this.dataSource.length; outer++) {
    temp = this.dataSource[outer];
    inner = outer;
    while (inner > 0 && this.dataSource[inner - 1] >= temp) {
      this.dataSource[inner] = this.dataSource[inner - 1];
      inner--;
    }
    this.dataSource[inner] = temp;
  }
}
```

## 测试代码

```javascript
class SortArray {
  constructor(array) {
    this.dataSource = array;
  }
  //冒泡排序
  bubbleSort() {
    const arrayLength = this.dataSource.length;
    for (var outer = 1; outer < arrayLength; outer++) {
      for (var inner = 1; inner <= arrayLength - outer; inner++) {
        if (this.dataSource[inner - 1] > this.dataSource[inner]) {
          this.swap(inner, inner - 1);
        }
      }
    }
  }
  //选择排序
  selectSort() {
    var min;
    for (var outer = 0; outer < this.dataSource.length - 2; outer++) {
      min = outer;
      for (
        var inner = outer + 1;
        inner <= this.dataSource.length - 1;
        inner++
      ) {
        if (this.dataSource[inner] < this.dataSource[min]) {
          min = inner;
        }
      }
      this.swap(outer, min);
    }
  }
  //插入排序
  insertSort() {
    var temp, inner;
    for (var outer = 1; outer < this.dataSource.length; outer++) {
      temp = this.dataSource[outer];
      inner = outer;
      while (inner > 0 && this.dataSource[inner - 1] >= temp) {
        this.dataSource[inner] = this.dataSource[inner - 1];
        inner--;
      }
      this.dataSource[inner] = temp;
    }
  }

  swap(index1, index2) {
    var tmp = this.dataSource[index1];
    this.dataSource[index1] = this.dataSource[index2];
    this.dataSource[index2] = tmp;
  }
}

var myArray = [2, 3, 1, 9, 6, 4, 7, 8, 5];
console.log("原始数组：", myArray);
var s1 = new SortArray(myArray);
var s2 = new SortArray(myArray);
var s3 = new SortArray(myArray);
s1.bubbleSort();
s2.selectSort();
s3.insertSort();
console.log("冒泡排序后的数组：", s1.dataSource);
console.log("选择排序后的数组：", s1.dataSource);
console.log("插入排序后的数组：", s1.dataSource);
```
