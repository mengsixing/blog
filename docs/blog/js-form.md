# JS 表单基础知识

这一章通过以下几个方面来总结一下 js 中的表单：

- 表单元素
- 表单操作
- 富文本

## 表单元素

常见的表单元素有：文本框，下拉框等。

### 文本框

文本框是我们最常用的表单元素，它有一些独有的属性：

- size 显示字符数。
- maxLength 接受最大字符数。

获取文本框中被选择的值：

```js
form.elements['text1'].selet() //获取焦点，并选中所有文字
text1.selecttionStart text1.selecttionEnd //选中的文字开头和结束的索引
text1.setSelectionRange(0,3) //选取前3个字符
```

我们使用一下 api 来过滤输入：

- beforecopy 复制。
- copy
- beforecut 剪切。
- cut
- beforepaste 粘贴。
- paste

HTML5 中的约束验证属性：

- required 属性。
- type= email url 等。
- partten 属性。
- checkValidity 方法。
- novalidate 不进行验证 表单属性。

### 选择框

选择框也是我们常用到的表单元素。

#### 选择框的值

- 如果没选中，value 为空字符串。
- 如果有一个选中项，option 有 value 字段，则 select 的 value 为选中 option 的 value。
- 如果有一个选中项，但 option 没有 value 字段，则 select 的 value=选中的 option 的 text。
- 如果是多选框，则 value 为第一个选中项的值，按上面 2 条规则取。

#### 选择框的操作

1、设置选择框选中项

通过修改 select.selectedIndex 值。

2、添加选项

```js
// DOM方法：
createElement('option')  append
// newOption创建元素：
new Option('text','value') append
// select.add添加元素：
new Option('text','value')  select.add(option)
```

3、移除选项

```js
// DOM方法：
removeChild;
// 将对应选择项设置为null：
select.options[0] = null;
```

### 表单元素共性

所有的表单元素都有一些共有的属性和方法。

共有属性：

- disabled 是否被禁用。
- form 指向所在 form。
- name 字段名称。
- readOnly 是否只读。
- tabIndex 当前字段的切换序号。
- type 类型。
- value 值。
- autofocus 自动获取焦点。

共有方法：

- focus
- blur
- change （input textarea 需要改变并失去焦点才触发，select 直接触发）。

## 表单操作

表单操作主要是通过：提交表单和重置表单。

### 获取表单元素

直接通过 form 标签，就能获取到内部表单元素的值。

- form.element[0]
- form.element['text1'] 获取 name=text1 的元素。

### 表单提交

以下三种元素，在点击时都会触发 form.submit 事件。

- input type=submit
- input type=image
- button type=submit

### 重置表单

使用以下两种方式，可以重置表单中填写的数据。

- input type=rest
- button type=reset

### 表单序列化

在使用 get 方法表单提交时，会先将表单值进行序列化拼接到 url 上。

- 对表单字段的名称和值进行 url 编码，使用 & 分隔。
- 不发送禁用的表单字段。
- 只发送勾选的复选框和单选按钮。
- 不发送 type=reset 和 button 的按钮。
- 多选选择框中的每个选中的值单独一个条目。
- 单击提交按钮时，也会发送提交按钮，否则不发送提交按钮，也包括 type=image 的元素。
- select 元素的值，就是选中的 option 的 value，如果没 value 就是 text。

## 富文本元素

富文本元素其实并不属于表单，在提交时不会被提交给服务器。

富文本的本质是页面中嵌入一个包含空 html 页面的 iframe 。通过设置 designMode=“on” 属性这个空白 html 页面可以被编辑，可编辑对象是 body 元素的 html 代码。也可以使用 contenteditable 属性将一个 div 元素模仿富文本元素。
