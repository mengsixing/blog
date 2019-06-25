# JS 事件

JavaScript 使我们有能力创建动态页面。事件是可以被 JavaScript 侦测到的行为。

## 事件流

JS 中的数据流主要包括以下 3 个阶段：

- 捕获阶段
- 目标阶段
- 冒泡阶段

事件触发时，会先从根 DOM 元素向下遍历（捕获），找到事件触发元素（目标阶段），然后再依次向上传递事件（冒泡阶段），直到传递到根节点。

:::warning
如果在触发元素上既绑定了冒泡事件，也绑定了捕获事件，会按照事件注册的顺序进行执行，而不是先捕获或冒泡。
:::

### 事件委托

为了避免不断地新增 JS 事件，可以将事件绑定到父节点，利用事件冒泡，管理多个子节点的事件。

## 事件处理程序

DOM0 级事件：DOM0 级的事件处理程序被认为是元素的方法（直接在 DOM 元素上增加 onXXX 方法），this 是当前元素。

DOM2 级事件：主要定义 addEventListener removeEventListener 两个方法来绑定事件，this 是当前元素。

:::tip 移除事件处理程序
移除 DOM 时，为了避免与 DOM 绑定的事件没有被及时回收，应该一并清空事件处理程序。
:::

## 事件对象

触发事件时，会产生一个事件对象，包含所有与事件相关的信息。

```js
e.preventDefault();
e.stopPropagation();
e.target;
e.bubbles; // 是否冒泡
e.cancelable; // 是可以取消默认事件
e.eventPhase; // 1 捕获阶段 2处理阶段 3冒泡阶段
//......
```

### 事件对象中与位置相关的属性

- clientX，CLientY：相对于浏览器可视区域，滑动后，点击同一位置，值不变。
- pageX，pageY：相对于浏览器页面，滑动后，点击同一位置，值会变。
- screenX，screenY：相对于设备屏幕，如果浏览器窗口移动，则会改变。

## 事件类型

### ui 事件：不一定和用户操作相关的事件

- load
- unload
- abort
- error
- select
- resize
- scroll

### 焦点事件：元素获得或失去焦点时触发

- blur 失去焦点(不冒泡)。
- focusin (冒泡) 。
- focusout (冒泡) 。
- focus(不冒泡)。

### 鼠标和滚轮事件

- click
- dbclick
- mousedown
- mouseenter
- mouseleave
- mousemove
- mouseup
- mouseout 鼠标位于一个元素外部，然后将其首次移动到另一元素边界之内时触发。
- mouseover 鼠标位于一个元素上，然后将鼠标移入另一个元素时触发。

### 键盘与文本事件

- keydown 按下键盘上的`任意键`时触发，按住不放会重复触发。
- keyup
- keypress 按下键盘上的`字符键`时触发，按住不放会重复触发。
- textInput 当用户在可编辑区域中输入字符时触发,按下`实际字符键`才触发(如果敲退格键，不触发，因为不是实际字符键)。

### 复合事件：输入组合件触发

复合事件是 DOM3 级事件中心添加的一类事件，用于处理 IME 的输入序列（输入法输入时的事件）。

复合事件有以下三中：

- compositionstart：要开始输入。
- compositionupdate：插入新字符。
- compositionend：复合系统关闭，返回正常键盘输入状态。

### 变动事件：DOM 变化时触发事件

- DOMSubtreeModified 在 DOM 结构中发生任何变化时触发。这个事件在其他任何事件触发后都会触发。
- DOMNodeInserted 在一个节点作为子节点被插入到另一个节点中时触发。
- DOMNodeRemoved 在节点从其父节点中移除时触发。
- DOMNodeInsertedIntoDocument 在一个节点被直接插入文档或通过子树间接插入文档之后触发（在 DOMNodeInserted 之后）。
- DOMNodeRemovedFromDocument 在一个节点被直接从文档中移除或通过子树间接从文档中移除之前触发（在 DOMNodeRemoved 之后）。
- DOMAttrModified 在属性被修改之后触发。
- DOMCharacterDataModified 在文本节点的值发生改变时触发。

### HTML5 事件

- contextmenu 右键打开菜单栏
- beforeunload 页面卸载前
- DOMContentLoaded 形成完整 DOM 树时触发
- readystatechange 页面加载相关
- pageshow pagehide 前进后退事件
- hashcahnge 事件

### 设备事件

- orientationchange 切换横竖屏
- deviceorientation 设备在空间中朝向哪里
- devicemotion 检测每个方向的加速度

### 触摸与手势事件

- touchstart
- touchmove
- touchend
- touchcancel

手势

- gesturestart 当一个手指已经在屏幕上而另一个手指又触摸屏幕时触发
- gesturechange 当触摸屏幕的任何一个手指的位置发生变化时触发
- gestureend 任何一个手指从屏幕上移开时触发

当触摸屏幕上的元素时，会依次执行如下事件：

- touchstart
- mouseover
- mousemove
- mousedown
- mouseup
- click
- touchend

## 模拟事件

```js
var event = document.createEvent(type);
```

- event 就是被创建的 Event 对象.
- type 是一个字符串，表示要创建的事件类型。事件类型可能包括`UIEvents`, `MouseEvents`, `MutationEvents`, 或者 `HTMLEvents`(一般为 DOM 变动事件)。
- dom.dispatchEvent() 触发事件。
