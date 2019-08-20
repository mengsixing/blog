# 算法面试题

## 1、老师分饼干

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

## 环形链表 II

[leetcode 142](https://leetcode-cn.com/problems/linked-list-cycle-ii/) 给定一个链表，返回链表开始入环的第一个节点。如果链表无环，则返回 null。

为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。

说明：不允许修改给定的链表。

示例 1：

输入：head = [3,2,0,-4], pos = 1
输出：tail connects to node index 1
解释：链表中有一个环，其尾部连接到第二个节点。

示例  2：

输入：head = [1,2], pos = 0
输出：tail connects to node index 0
解释：链表中有一个环，其尾部连接到第一个节点。

示例 3：

输入：head = [1], pos = -1
输出：no cycle
解释：链表中没有环。

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
