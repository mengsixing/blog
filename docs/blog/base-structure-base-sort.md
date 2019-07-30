# 基本排序算法

基本排序算法分为：冒泡排序，选择排序，插入排序。

- 三种排序算法都是嵌套循环，故最坏的时间复杂度为 O(n²)。
- 选择排序是不稳定排序，数组中如果有相同的元素，交换后的位置可能不一致。

:::tip 算法稳定性
算法的稳定性定义：排序前后两个相等的数相对位置不变，则算法稳定。

例如：[7 2 5 9 3 4 7 1] 使用选择排序算法进行排序时候，第一个 7 和 1 调换，第一个 7 就跑到了第二个 7 的后面了，原来的次序改变了，这样就不稳定了。
:::

## 冒泡排序

它是最慢的排序算法之一，数据值会像气泡一样从数组的一端漂浮到另一端。

![冒泡排序](冒泡排序.gif)

```js
function bubbleSort(array) {
  for (let outer = 0; outer < array.length; outer++) {
    for (let inner = 0; inner < array.length - outer; inner++) {
      if (array[inner] > array[inner + 1]) {
        swap(array, inner, inner + 1);
      }
      console.log('冒泡排序循环次数');
    }
  }
  return array;
}
```

## 选择排序

从数组的开头开始，将第一个元素和其他元素比，较最小的元素会被放到数组的第一个位置，再从第二个位置继续。

![选择排序](选择排序.gif)

```js
// 选择排序
function selectSort(array) {
  for (let outer = 0; outer < array.length - 1; outer++) {
    let min = array[outer];
    for (let inner = outer + 1; inner < array.length; inner++) {
      if (array[inner] < min) {
        swap(array, inner, outer);
      }
      console.log('选择排序循环次数');
    }
  }
  return array;
}
```

## 插入排序

类似于人们按数组或字母顺序对数据进行排序，后面的要为前面腾位置（叠卷子）。

![插入排序](插入排序.gif)

```js
// 插入排序
function insertSort(array) {
  for (let outer = 1; outer < array.length; outer++) {
    for (
      let inner = outer;
      inner > 0 && array[inner] < array[inner - 1];
      inner--
    ) {
      swap(array, inner, inner - 1);
      console.log('插入排序循环次数');
    }
  }
  return array;
}
```

插入排序是稳定的排序，处理小规模数据或者基本有序数据时，十分高效。

## 最终代码

```js
// 冒泡排序
function bubbleSort(array) {
  for (let outer = 0; outer < array.length; outer++) {
    for (let inner = 0; inner < array.length - outer; inner++) {
      if (array[inner] > array[inner + 1]) {
        swap(array, inner, inner + 1);
      }
      console.log('冒泡排序循环次数');
    }
  }
  return array;
}

// 选择排序
function selectSort(array) {
  for (let outer = 0; outer < array.length - 1; outer++) {
    let min = array[outer];
    for (let inner = outer + 1; inner < array.length; inner++) {
      if (array[inner] < min) {
        swap(array, inner, outer);
      }
      console.log('选择排序循环次数');
    }
  }
  return array;
}

// 插入排序
function insertSort(array) {
  for (let outer = 1; outer < array.length; outer++) {
    for (
      let inner = outer;
      inner > 0 && array[inner] < array[inner - 1];
      inner--
    ) {
      swap(array, inner, inner - 1);
      console.log('插入排序循环次数');
    }
  }
  return array;
}

function swap(array, index1, index2) {
  var temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;
}

const array = [2, 3, 1, 9, 6, 4, 7, 8, 5];

console.warn('冒泡排序：', bubbleSort(array));
console.warn('选择排序：', selectSort(array));
console.warn('插入排序：', insertSort(array));
```
