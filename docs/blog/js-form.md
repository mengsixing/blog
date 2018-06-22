# js 表单

## 表单的基础知识

### 提交表单

- input type=submit
- input type=image
- button type=submit

以上三种方式都会触发 form.submit 事件。

### 重置表单

- input type=rest
- button type=reset

### 表单字段

获取表单元素：

- form.element[0]
- form.element['text1'] 获取 name=text1 的元素。

共有属性：

- disabled 是否被禁用。
- form 指向所在 form。
- name 字段名称。
- readOnly 是否只读。
- tabIndex 当前字段的切换序号。
- type 类型。
- value 值。
- autofocus

共有方法：

- focus
- blur
- change inputhe textarea 需要改变并失去焦点才触发，select 直接触发。

## 文本框脚本

- size 显示字符数。
- maxLength 接受最大字符数。

### 选择文本

```js
form.elements['text1'].selet() //获取焦点，并选中所有文字
text1.selecttionStart text1.selecttionEnd //选中的文字开头和结束的索引
text1.setSelectionRange(0,3) //选取前3个字符
```

### 过滤输入

- beforecopy 复制。
- copy
- beforecut 剪切。
- cut
- beforepaste 粘贴。
- paste

### HTML5 约束验证 API

- required 属性。
- type= email url 等。
- partten 属性。
- checkValidity 方法。
- novalidate 不进行验证 表单属性。

## 选择框脚本

- 如果没选中，value 为空字符串。
- 如果有一个选中项，option 有 value 字段，则 select 的 value=选中 option 的 value。
- 如果有一个选中项，但 option 没有 value 字段，则 select 的 value=选中的 option 的 text。
- 如果是多选框，则 value=第一个选中项的值，按上面 2 条规则取。

### 选择选项

select.selectedIndex 可读写。

### 添加选项

```js
// DOM方法：
createElement('option')  append
// newOption创建元素：
new Option('text','value') append
// select.add添加元素：
new Option('text','value')  select.add(option)
```

### 移除选项

```js
// DOM方法：
removeChild;
// 将对应选择项设置为null：
select.options[0] = null;
```

### 移动和重排选项

- appendChild
- insertBefore

## 表单序列化

- 对表单字段的名称和值进行 url 编码，使用 & 分隔。
- 不发送禁用的表单字段。
- 只发送勾选的复选框和单选按钮。
- 不发送 type=reset 和 button 的按钮。
- 多选选择宽中的每个选中的值单独一个条目。
- 在淡季提交按钮提交表单的情况下，也会发送提交按钮，否则不发送提交按钮，也包括 type=image 的元素。
- select 元素的值，就是选中的 option 的 value，如果没 value 就是 text。

## 富文本编辑

- 顾问本的本质是页面中嵌入一个包含空 HTML 页面的 iframe 。通过设置 designMode=“on” 属性这个空白 HTML 页面可以被编辑，可编辑对象是 body 元素的 HTML 代码。
- 使用 contenteditable 属性。

### 操作富文本

document.execCommand

### 富文本选区

使用 iframe 的 getSelection 方法。

### 表单和富文本

富文本并不属于表单，在提交时不会被提交给服务器。
