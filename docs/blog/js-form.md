# js表单

## 表单的基础知识

### 提交表单

  * input type=submit
  * input type=image 
  * button type=submit

以上三种方式都会触发form.submit事件。

### 重置表单

  * input type=rest
  * button type=reset

### 表单字段

  获取表单元素：
  * form.element[0]
  * form.element['text1'] 获取name=text1的元素

  共有属性：
  * disabled 是否被禁用
  * form 指向所在form
  * name 字段名称
  * readOnly 是否只读
  * tabIndex 当前字段的切换序号
  * type 类型
  * value 值
  * autofocus

  共有方法：
  * focus
  * blur
  * change inputhe textarea 需要改变并失去焦点才触发，select直接触发

## 文本框脚本

* size 显示字符数
* maxLength 接受最大字符数

### 选择文本

``` js
form.elements['text1'].selet() //获取焦点，并选中所有文字
text1.selecttionStart text1.selecttionEnd //选中的文字开头和结束的索引
text1.setSelectionRange(0,3) //选取前3个字符
```

### 过滤输入
  * beforecopy 复制
  * copy
  * beforecut 剪切
  * cut
  * beforepaste 粘贴
  * paste

### HTML5约束验证API
  * required 属性
  * type= email url 等
  * partten 属性
  * checkValidity 方法
  * novalidate 不进行验证 表单属性

## 选择框脚本
* 如果没选中，value为空字符串
* 如果有一个选中项，option有value字段，则select的value=选中option的value
* 如果有一个选中项，但option没有value字段，则select的value=选中的option 的 text
* 如果是多选框，则value=第一个选中项的值，按上面2条规则取

### 选择选项

select.selectedIndex 可读写

### 添加选项

``` js
// DOM方法：
createElement('option')  append
// newOption创建元素：
new Option('text','value') append
// select.add添加元素：
new Option('text','value')  select.add(option)
```

### 移除选项

``` js
// DOM方法：
removeChild
// 将对应选择项设置为null：
select.options[0] = null
```


### 移动和重排选项
* appendChild
* insertBefore


## 表单序列化

* 对表单字段的名称和值进行url编码，使用&分隔
* 不发送禁用的表单字段
* 只发送勾选的复选框和单选按钮
* 不发送type=reset和button的按钮
* 多选选择宽中的每个选中的值单独一个条目
* 在淡季提交按钮提交表单的情况下，也会发送提交按钮，否则不发送提交按钮，也包括type=image的元素
* select元素的值，就是选中的option的value，如果没value就是text


## 富文本编辑

* 顾问本的本质是页面中嵌入一个包含空HTML页面的iframe。通过设置designMode=“on”属性这个空白HTML页面可以被编辑，可编辑对象是body元素的HTML代码
* 使用contenteditable属性

### 操作富文本

document.execCommand

### 富文本选区

使用iframe的getSelection方法

### 表单和富文本

富文本并不属于表单，在提交时不会被提交给服务器。

