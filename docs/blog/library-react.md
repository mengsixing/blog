# React 使用总结

总结一下常用的 React 知识。

## React 生命周期

### 创建时

#### constructor

React 组件的构造函数将会在装配之前被调用。

构造函数是初始化状态的合适位置，可以基于属性来初始化状态。

#### static getDerivedStateFromProps

组件实例化后和接受新属性时将会调用 getDerivedStateFromProps。它应该返回一个对象来更新状态，或者返回 null 来表明新属性不需要更新任何状态。

getDerivedStateFromProps 只存在一个目的。它使组件能够根据 props 的更改来更新其内部状态。

#### render

将虚拟 DOM 渲染成真实的 DOM。

#### componentDidMount

在组件被装配后立即调用。初始化使得 DOM 节点应该进行到这里。`若你需要从远端加载数据，这是一个适合实现网络请求的地方。`在该方法里设置状态将会触发重渲。

您可以调用 `setState`立即在 `componentDidMount`。它将触发额外的渲染，但它将在浏览器更新屏幕之前发生。这保证即使 `render`在这种情况下将被调用两次，用户也不会看到中间状态。

### 更新时

#### getDerivedStateFromProps

同上。

#### shouldComponentUpdate

此方法仅作为性能优化存在。不要依赖它来“防止”渲染，因为这可能导致错误。考虑使用内置 PureComponent 而不是 shouldComponentUpdate()手写。

#### render。

将虚拟 DOM 渲染成真实的 DOM。

#### getSnapshotBeforeUpdate

- 触发时间: update 发生的时候，在 render 之后，在组件 dom 渲染之前。
- 返回一个值，作为 componentDidUpdate 的第三个参数。

#### componentDidUpdate

componentDidUpdate(prevProps, prevState, snapshot)

将此作为在更新组件时对 DOM 进行操作的机会。只要您将当前道具与之前的道具进行比较（例如，如果道具未更改，则可能不需要网络请求），`这也是进行网络请求的好地方。`

### 卸载时

#### componentWillUnmount

`componentWillUnmount`在卸载和销毁组件之前立即调用。在此方法中执行任何必要的清理，例如使计时器无效，取消网络请求或清除在其中创建的任何订阅。

### 弃用生命周期

#### componentWillMount

`componentWillMount` 是在 `render` 之前执行，所以在这个方法中 setState 不会发生重新渲染(re-render)。通常情况下，推荐用 constructor()方法代替。

这里发请求是异步的，在 render 之前还是不会返回数据。

componentWillMount 在 ssr 中会被调用 2 次。

#### componentWillReceiveProps

UNSAFE_componentWillReceiveProps(nextProps)

使用不当可能体现为组件陷入渲染死循环，他会一直接受新的外部状态导致自身一直在重渲染。导致被多次调用，循环调用。

例如：在 componentWillReceiveProps 中 setState 引起父组件渲染。

#### componentWillUpdate

更新前读取当前某个 DOM 元素的状态，用 getSnapshotBeforeUpdate 代替。

不能 setState，也会导致循环渲染问题。

[生命周期图](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

## 可控组件和不可控组件

在 HTML 当中，像`<input>`,`<textarea>`, 和 `<select>`这类表单元素会维持自身状态，并根据用户输入进行更新。但在 React 中，可变的状态通常保存在组件的状态属性中，并且只能用 setState() 方法进行更新。

我们通过使 react 变成一种单一数据源的状态来结合二者。React 负责渲染表单的组件仍然控制用户后续输入时所发生的变化。相应的，其值由 React 控制的输入表单元素称为“受控组件”。

使用”受控组件”,每个状态的改变都有一个与之相关的处理函数。这样就可以直接修改或验证用户输入。

## React 异步渲染

将 setState() 认为是一次请求而不是一次立即执行更新组件的命令。为了更为可观的性能，React 可能会推迟它，稍后会一次性更新这些组件。React 不会保证在 setState 之后，能够立刻拿到改变的结果。

1、在 setState 中调用了 enqueueSetState 方法将传入的 state 放到一个队列中

2、enqueueSetState 中先是找到需渲染组件并将新的 state 并入该组件的需更新的 state 队列中，接下来调用了 enqueueUpdate 方法

3、isBatchingUpdates 标识是否在一个更新组件的事务流中。

3.1、如果没有在事务流中，调用 batchedUpdates 方法进入更新流程，进入流程后，会将 isBatchingUpdates 设置为 true。

3.2、否则，将需更新的组件放入 dirtyComponents 中。

### 什么时候会标识 isBatchingUpdates 为 true？

1、当处于生命周期 render 之后的生命周期中。

2、合成事件中（jsx 中的事件都是合成事件）。

::: tip 提示
所以在 setTimeout，源生事件中的 setState 会同步渲染。
:::

## react 怎样提高性能？

1、使用 shouldComponentUpdate 和 Immutable 组合控制合适的时间渲染。PureComponent

2、render 里面尽量减少新建变量和 bind 函数，传递参数是尽量减少传递参数的数量。

3、多个 react 组件性能优化，key 的优化

4、redux 性能优化：reselect（数据获取时优化）。

## props 和 state 分别在什么时候用？

1、如果在 Component 中需要在某个时间点改变，那么应该使用 state，否则应该使用 prop。

2、state 是组件在内部管理自己的状态。

3、prop 只能是父组件传入，或者是初始化时自定义，一旦定义，不能改变。

无状态组件： 只有 prop，没有 state。除了这个 render()功能之外没有多少事情发生，所有的逻辑都围绕着 prop。

- 纯静态展示,可读性更好，并能大大减少代码量
- 省去了多余的生命周期，提升了整体的渲染性能
- 可复用性强

## Time slicing

We've built a generic way to ensure that high-priority updates like user input don't get blocked by rendering low-priority updates.

CPU 层面优化

ReactJS 关注设备的 CPU 能力。在渲染时，ReactJS 确保它不会阻塞线程，从而导致应用程序冻结。

时间分片允许现在在 React Fiber 上运行的 ReactJS 在空闲回调期间将子组件的更新计算分成块，并且渲染工作分布在多个帧上。现在，在异步呈现过程中，它确保如果用户的设备非常快，应用程序内的更新会感觉同步，如果用户的设备很慢，则应用程序会感觉响应。没有冻结，没有 janky UI 体验！

## Suspense

We have built a generic way for components to suspend rendering while they load asynchronous data.

悬念功能的简单定义是 ReactJS 可以暂停任何状态更新，直到提取的数据准备好呈现。本质上，ReactJS 在等待完全获取数据的同时挂起组件树。在暂停期间，它继续处理其他高优先级更新。
