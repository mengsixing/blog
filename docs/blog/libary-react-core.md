# React 核心知识

## React Fiber

React Fiber 是 Facebook 折腾两年多做出来的东西，是对核心算法的一次重新实现。虽然对开发层面是无感的，但是对于 React 整个架构的优化是非常到位了，目前还没看出有其他框架能超越的地方，当前阶段出的很多新特性（Concurrent Rendering）等都是在 Fiber 基础上实现的。

React Fiber 把更新过程碎片化，每执行完一段更新过程，就把控制权交还给 React 负责任务协调的模块，看看有没有其他紧急任务要做，如果没有就继续去更新，如果有紧急任务，那就去做紧急任务。

React Fiber 分为 2 个阶段：render phase 和 commit phase。

### render phase 阶段

render 和 render 以前的生命周期，都属于 render phase。在这个阶段执行过程中会根据任务的优先级，选择执行或者暂停。故可能发生某个生命周期被执行多次的情况。

getDerivedStateFromError 专门用来捕获 render phase 阶段错误，服务器端渲染时会被调用到。

### commit phase 阶段

render 之后的生命周期，都属于 commit phase。在这个阶段执行过程中不会被打断，会一直执行到底。

componentDidCatch 专门用来捕获 commit phase 阶段错误，服务器端渲染不会被调用到。

## Suspense

Suspense 要解决的两个问题：1. 代码分片； 2. 异步获取数据。

如果有一个页面的代码引入了 1 个非常大的包，打包的时候会让最终的体积变得非常大，这个时候就需要进行懒加载。

```jsx
// Usage of Clock
const Clock = React.lazy(() => {
  console.log("start importing Clock");
  return import("./Clock");
});

<Suspense>
  { show ? <Clock/> : null}
</Suspense>
```

Suspense 的原理：

suspense 组件内部实现了 getDerivedStateFromError 方法，可以用来捕获子元素的报错信息，如果是一个异步组件，会抛出一个 proimise，来让 suspense 捕获到，然后等到异步组件加载完成，尝试重新渲染这个异步组件。

```js
getDerivedStateFromError(error) {
   if (isPromise(error)) {
      error.then(reRender);
   }
}
```

## React 生命周期

### 创建时

#### constructor

React 组件的构造函数将会在装配之前被调用。构造函数是初始化状态的合适位置。

#### static getDerivedStateFromProps

组件实例化后和接受新属性时将会调用 getDerivedStateFromProps。它应该返回一个对象来更新状态，或者返回 null 来表明新属性不需要更新任何状态。getDerivedStateFromProps 只存在一个目的。它**使组件能够根据 props 的更改来更新其内部状态**。

getDerivedStateFromProps 之所以是**静态**的，是因为 static 方法中不能获取到实例对象上的 state 和方法，所以这个方法内不能调用 setState，这就可以避免不守规矩的程序员误用。可以看出 react 对新的生命周期考虑还是挺周全的。

#### render

将虚拟 DOM 渲染成真实的 DOM。

#### componentDidMount

组件初次渲染后被触发。可以获取到真实的 DOM 元素。若你需要从远端加载数据，**这是一个适合实现网络请求的地方**。

### 更新时

#### getDerivedStateFromProps

同上。

#### shouldComponentUpdate

此方法仅作为性能优化存在。不要依赖它来“防止”渲染，因为这可能导致错误。考虑使用内置 PureComponent 而不是 shouldComponentUpdate()手写。

#### render

将虚拟 DOM 渲染成真实的 DOM。

#### getSnapshotBeforeUpdate

在 getSnapshotBeforeUpdate 中读取到的 DOM 元素状态是可以保证与 componentDidUpdate 中一致的。

- 触发时间: update 发生的时候，在 render 之后，在组件 dom 渲染之前。
- 返回一个值，作为 componentDidUpdate 的第三个参数。

#### componentDidUpdate

componentDidUpdate(prevProps, prevState, snapshot) **这也是进行网络请求的好地方**。如果触发某些回调函数时需要用到 DOM 元素的状态，则将对比或计算的过程迁移至 getSnapshotBeforeUpdate，然后在 componentDidUpdate 中统一触发回调或更新状态。

### 卸载时

#### componentWillUnmount

`componentWillUnmount`在卸载和销毁组件之前立即调用。在此方法中执行任何必要的清理，例如使计时器无效，取消网络请求或清除在其中创建的任何订阅。

### 弃用生命周期

#### componentWillMount

`componentWillMount` 是在 `render` 之前执行。通常用来情况下，推荐用 constructor()方法代替。

不建议在这个生命中期中获取异步数据：

- react filber 中可能多次调用 render 之前的生命周期函数，可能会请求多次。
- 在服务器端渲染时，服务器端会执行一次，客户端也会执行一次。
- 如果请求在 componentWillMount，react 并没有挂载到 dom 上，这时候 setState 可能会有问题。

#### componentWillReceiveProps

UNSAFE_componentWillReceiveProps(nextProps)

使用不当可能体现为组件陷入渲染死循环，他会一直接受新的外部状态导致自身一直在重渲染。导致被多次调用，循环调用。

例如：在 componentWillReceiveProps 中 setState 引起父组件渲染。

#### componentWillUpdate

本意：在 render 方法之前. 使用该方法做一些更新之前的准备工作, 例如读取当前某个 DOM。

不合理处：该生命周期有可能在一次更新中被调用多次, 也就是说写在这里的回调函数也有可能会被调用多次, 这显然是不可取的。

更新前读取当前某个 DOM 元素的状态，用 getSnapshotBeforeUpdate 代替。

不能 setState，也会导致循环渲染问题。

[生命周期图](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

## 常见问题

### 简述一下 React 中的事件机制

React 其实自己实现了一套事件机制，首先我们考虑一下以下代码：

```js
const Test = ({ list, handleClick }) => ({
    list.map((item, index) => (
        <span onClick={handleClick} key={index}>{index}</span>
    ))
})
```

以上类似代码想必大家经常会写到，但是你是否考虑过点击事件是否绑定在了每一个标签上？事实当然不是，JSX 上写的事件并没有绑定在对应的真实 DOM 上，而是通过事件代理的方式，将所有的事件都统一绑定在了 document 上。这样的方式不仅减少了内存消耗，还能在组件挂载销毁时统一订阅和移除事件。

另外冒泡到 document 上的事件也不是原生浏览器事件，而是 React 自己实现的合成事件（SyntheticEvent）。因此我们如果不想要事件冒泡的话，调用 event.stopPropagation 是无效的，而应该调用 event.preventDefault。

那么实现合成事件的目的是什么呢？总的来说在我看来好处有两点，分别是：

- 合成事件首先抹平了浏览器之间的兼容问题，另外这是一个跨浏览器原生事件包装器，赋予了跨浏览器开发的能力。
- 对于原生浏览器事件来说，浏览器会给监听器创建一个事件对象。如果你有很多的事件监听，那么就需要分配很多的事件对象，造成高额的内存分配问题。但是对于合成事件来说，有一个事件池专门来管理它们的创建和销毁，当事件需要被使用时，就会从池子中复用对象，事件回调结束后，就会销毁事件对象上的属性，从而便于下次复用事件对象。

### 什么是可控组件和不可控组件

在 HTML 当中，像`<input>`,`<textarea>`, 和 `<select>`这类表单元素会维持自身的值 value，并根据用户输入进行更新。但在 React 中，可变的状态是保存在组件的状态属性中，并且只能用 setState() 方法进行更新。

我们通过使 React 变成一种单一数据源的状态来结合二者。React 负责渲染表单的组件，仍然控制用户后续输入时所发生的变化。相应的，其值由 React 控制的输入表单元素称为“受控组件”。

使用”受控组件”，每个状态的改变都有一个与之相关的处理函数。这样就可以直接修改或验证用户输入。

### React 异步渲染

将 setState() 认为是一次请求而不是一次立即执行更新组件的命令。为了更为可观的性能，React 可能会推迟它，稍后会一次性更新这些组件。React 不会保证在 setState 之后，能够立刻拿到改变的结果。

- 在 setState 中调用了 enqueueSetState 方法将传入的 state 放到一个队列中。
- enqueueSetState 中先是找到需渲染组件并将新的 state 并入该组件的需更新的 state 队列中，接下来调用了 enqueueUpdate 方法。
- isBatchingUpdates 标识是否在一个更新组件的事务流中。
  - 如果没有在事务流中，调用 batchedUpdates 方法进入更新流程，进入流程后，会将 isBatchingUpdates 设置为 true。
  - 否则，将需更新的组件放入 dirtyComponents 中。

### 什么时候会标识 isBatchingUpdates 为 true

1、当处于生命周期 render 之后的生命周期中。

2、合成事件中（jsx 中的事件都是合成事件）。

::: tip 提示
所以在 setTimeout，源生事件中的 setState 会同步渲染。
:::

### react 怎样提高性能

1、使用 shouldComponentUpdate 和 Immutable 组合控制合适的时间渲染。PureComponent。

2、render 里面尽量减少新建变量和 bind 函数，传递参数是尽量减少传递参数的数量。

3、多个 react 组件性能优化，key 的优化。

4、redux 性能优化：reselect（数据获取时优化）。

### props 和 state 分别在什么时候用

1、如果在 Component 中需要在某个时间点改变，那么应该使用 state，否则应该使用 prop。

2、state 是组件在内部管理自己的状态。

3、prop 只能是父组件传入，或者是初始化时自定义，一旦定义，不能改变。

无状态组件： 只有 prop，没有 state。除了这个 render 功能之外没有多少事情发生，所有的逻辑都围绕着 prop。

- 纯静态展示,可读性更好，并能大大减少代码量。
- 省去了多余的生命周期，提升了整体的渲染性能。
- 可复用性强。
