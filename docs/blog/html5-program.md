# html5 脚本编程

## 跨文档消息传递
postMessage方法,向当前页面的iframe，或由当前页面弹出的窗口中，传递数据。
> 只能发送字符串

发送数据：
``` js
var iframe = document.getElementById('iframe');
iframe.postMessage('text message','http://www.xxx.com');
```

接收数据：
``` js
window.onmessage=function(event){
  if(event.origin == 'http://www.xxx.com'){
    //获取数据
    console.log(event.data);
    //向来源窗口发送回执
    event.source.postMessage('收到请求','http://www.xxx.com');
  }
}
```

## 拖放API

### 拖放事件
* dragstart
* dragenter 进入放置目标
* dragover 在放置目标上移动
* drag 拖动期间
* dragleave 离开放置目标
* dragend

### dataTransfer对象
只能在上述拖放事件中才能访问dataTransfer对象。
``` js
div.ondrag=function(event){
  //setData第一个参数表示数据类型 url/text/..
  event.dataTransfer.setData('text','some text');
  var text = event.dataTransfer.getData('text');
}
```

### dropEffect和effectAllowed
dataTransfer对象两个属性dropEffect和effectAllowed。
> dropEffect可以知道被拖动元素能够执行那种放置行为，必须在ondrogenter事件中设置。
* none 不能把拖动的元素放在这里。这是除文本框之外所有元素的默认值。
* move 应该把拖动的元素移动到放置目标。
* copy 应该把拖动的元素复制到放置目标。
* link 表示放置目标会打开拖动的元素(但拖动的元素必须是一个链接，有URL)。

> dropEffect 属性只有搭配effectAllowed属性才有用。effectAllow属性表示允许拖动元素的那种dropEffect。
dropEffect 属性值。
* uninitialized 没有给被拖动的元素设置任何放置行为。
* none 被拖动的元素不能有任何行为。
* copy 只允许值为copy的dropEffect。
* link 只允许值为link的dropEffect。
* move 只允许值为move的dropEffect。
* copyLink 只允许值为copy和link的dropEffect。
* copyMove 只允许值为copy和move的dropEffect。
* linkMove 只允许值为link和move的dropEffect。
* all 允许任意dropEffect。

### 可拖动
默认情况下，图像、链接和文本是可以拖动的，文本是选中的情况下才可以，让其他元素可拖动，使用draggable属性。
``` html
<div draggable="true">可拖动div</div>
```

## 媒体元素
audio和video可以不依赖任何插件，嵌入浏览器音频和视频内容。
poster属性可以指定加载视频时，显示一幅图像。

## 历史状态管理
在现代web应用中，用户的每次操作不一定会打开一个全新的页面，因此“后退”和”前进“按钮也就失去了作用。使用hashchange事件可以解决这个问题。
通过hashchange事件，可以知道url的参数什么时候发生了变化，然后使用```history.pushState();```去设置状态。
``` js
// 参数分别为L状态对象，新状态标题，可选的相对URL
history.pushState({name:'yhl'},'new title','yhl.html');
```

执行pushState()方法后，新的状态信息就会被加入历史状态栈，而浏览器状态栏也会变成新的相对url。按下后退按钮，会触发window对象的popState事件。
``` js
window.onpopstate=function(event){
  var state=event.state;
  //......
}
```

更新当前状态，使用replaceState，会重写当前状态，不会再历史状态站中创建新状态。

