# react-router 使用总结

- react-router 核心文件
- react-router-dom 绑定 dom 元素
- react-router-native 对 react-native 的支持
- react-router-config 服务器端渲染会用到

react-router 底层使用 history 库，对页面历史状态进行管理，页面状态，是路由的核心文件。

history 提供了 createBrowserHistory 等创建路由的方法

react-router-dom 基于 react 页面的封装，一般我们直接使用 react-router-dom 来实现需求。

## react-router

Route 会为组件注入一下三个属性

- history
- location
- match

## history

action: "POP"
block: ƒ block(prompt)
createHref: ƒ createHref(location)
go: ƒ go(n)
goBack: ƒ goBack()
goForward: ƒ goForward()
length: 1
listen: ƒ listen(listener)
location: {pathname: "/", search: "", hash: "", state: undefined}
push: ƒ push(path, state)
replace: ƒ replace(path, state)

操作页面路由，可以通过 push，goback 等方法上一步，下一步。

<!-- history: {length: 1, action: "POP", location: {…}, createHref: ƒ, push: ƒ, …} -->

## location

location:
hash: ""
pathname: "/"
search: ""
state: undefined

和页面 url 相关，匹配当前页面的 url

location: {pathname: "/", search: "", hash: "", state: undefined}

## match

match:
isExact: true
params: {}
path: "/"
url: "/"

match 是一个匹配路径参数的对象，它有一个属性 params，里面的内容就是路径参数，除常用的 params 属性外，它还有 url、path、isExact 属性。

<!-- match: {path: "/", url: "/", isExact: true, params: {…}} -->
