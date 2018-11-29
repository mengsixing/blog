# React 使用总结

聊聊当前对 react 的理解。

## 从上个时代说起

### jquery 时代

在 Jquery 主流的时代，我们大概的流程是通过 ajax 获取到后端数据，然后使用 jquery 生成 dom 更新到页面中，但是随着业务发展，我们的项目可能会越来越复杂，我们每次请求到数据，或者数据有更改的时候，我们又需要重新组装一次 dom 结构，然后更新页面，这样我们手动同步 dom 和数据的成本就越来越高，而且频繁的操作 dom，也使我我们页面的性能慢慢的降低。

痛点：`手动同步 dom 和数据`，`频繁地操作 dom`。

### 双向数据绑定 mvvm

要`解决手动同步 dom 和数据`的问题，这个时候 mvvm 出现了。mvvm 的双向数据绑定可以让我们在数据修改的同时去更新 dom，dom 的更新也可以直接同步到数据的更改，这个特定可以大大降低我们手动去维护 dom 更新的成本。虽然 react 属于单项数据流，但是我们可以手动实现双向数据绑定。

### 虚拟 dom && dom diff

有了 mvvm 还不够，因为如果每次有数据做了更改，然后我们都全量更新 dom 结构的话，也没办法解决我们`频繁操作 dom` 结构(降低了页面性能)的问题，为了解决这个问题，react 内部实现了一套虚拟 dom 结构，也就是用 js 实现的一套 dom 结构，他的作用是讲真实 dom 在 js 中做一套缓存，每次有数据更改的时候，react 内部先使用算法，也就是鼎鼎有名的 diff 算法对 dom 结构进行对比，找到那些我们需要新增、更新、删除的 dom 节点，然后一次性对真实 dom 进行更新，这样就大大降低了操作 dom 的次数。

那么 diff 算法是怎么运作的呢？首先，diff 针对类型不同的节点，会直接判定原来节点需要卸载并且用新的节点来装载卸载的节点的位置；针对于节点类型相同的节点，会对比这个节点的所有属性，如果节点的所有属性相同，那么判定这个节点不需要更新，如果节点属性不相同，那么会判定这个节点需要更新，react 会更新并重渲染这个节点。

### 状态管理

react 设计之初是主要负责 UI 层的渲染，虽然每个组件有自己的 state，state 表示组件的状态，当状态需要变化的时候，需要使用 setState 更新我们的组件，但是，我们想通过一个组件重渲染它的兄弟组件，我们就需要将组件的状态提升到父组件当中，让父组件的状态来控制这两个组件的重渲染，当我们组件的层次越来越深的时候，状态需要一直往下传，无疑加大了我们代码的复杂度，`我们需要一个状态管理中心`，来帮我们管理状态 state。

#### redux

这个时候，redux 出现了，我们可以将所有的 state 交给 redux 去管理，当我们的某一个 state 有变化的时候，依赖到这个 state 的组件就会进行一次重渲染，这样就解决了我们的我们需要一直把 state 往下传的问题。redux 有 action、reducer 的概念，action 为唯一修改 state 的来源，reducer 为唯一确定 state 如何变化的入口，这使得 redux 的数据流非常规范，同时也暴露出了 redux 代码的复杂，`本来那么简单的功能，却需要完成那么多的代码`。

#### mobx

后来，社区就出现了另外一套解决方案，也就是 mobx，它推崇代码简约易懂，只需要定义一个可观测的对象，然后哪个组件使用到这个可观测的对象，并且这个对象的数据有更改，那么这个组件就会重渲染，而且 mobx 内部也做好了是否重渲染组件的生命周期 shouldUpdateComponent，不建议开发者进行更改，这使得我们使用 mobx 开发项目的时候可以简单快速的完成很多功能，连 redux 的作者也推荐使用 mobx 进行项目开发。但是，随着项目的不断变大，mobx 也不断暴露出了它的缺点，就是`数据流太随意`，出了 bug 之后不好追溯数据的流向，这个缺点正好体现出了 redux 的优点所在，所以`针对于小项目来说，社区推荐使用 mobx，对大项目推荐使用 redux`。

## React 生命周期

### 创建时

#### constructor

React 组件的构造函数将会在装配之前被调用。

构造函数是初始化状态的合适位置，可以基于属性来初始化状态。

#### static getDerivedStateFromProps

组件实例化后和接受新属性时将会调用 getDerivedStateFromProps。它应该返回一个对象来更新状态，或者返回 null 来表明新属性不需要更新任何状态。

getDerivedStateFromProps 只存在一个目的。它`使组件能够根据 props 的更改来更新其内部状态`。

#### render

将虚拟 DOM 渲染成真实的 DOM。

#### componentDidMount

组件初次渲染后被触发。可以获取到真实的 DOM 元素。`若你需要从远端加载数据，这是一个适合实现网络请求的地方。`

::: tip

由于这个方法发生初始化挂载 render 方法之后, 因此在这个方法中调用 setState()会导致一次额外的渲染, 只不过这次渲染会发生在浏览器更新屏幕之前. 因此即使渲染了两次, 用户也不会看到中间状态, 即不会有那种状态突然跳一下的情况发生. 只不过, 虽然在用户视觉体验上可能没有影响, 但是这种操作可能会导致性能方面的问题, 因此还需慎用.

:::

### 更新时

#### getDerivedStateFromProps

同上。

#### shouldComponentUpdate

此方法仅作为性能优化存在。不要依赖它来“防止”渲染，因为这可能导致错误。考虑使用内置 PureComponent 而不是 shouldComponentUpdate()手写。

#### render。

将虚拟 DOM 渲染成真实的 DOM。

#### getSnapshotBeforeUpdate

在 getSnapshotBeforeUpdate 中读取到的 DOM 元素状态是可以保证与 componentDidUpdate 中一致的。

- 触发时间: update 发生的时候，在 render 之后，在组件 dom 渲染之前。
- 返回一个值，作为 componentDidUpdate 的第三个参数。

#### componentDidUpdate

componentDidUpdate(prevProps, prevState, snapshot)
`这也是进行网络请求的好地方。`
将现有的 componentWillUpdate 中的回调函数迁移至 componentDidUpdate.
如果触发某些回调函数时需要用到 DOM 元素的状态，则将对比或计算的过程迁移至 getSnapshotBeforeUpdate，然后在 componentDidUpdate 中统一触发回调或更新状态。

### 卸载时

#### componentWillUnmount

`componentWillUnmount`在卸载和销毁组件之前立即调用。在此方法中执行任何必要的清理，例如使计时器无效，取消网络请求或清除在其中创建的任何订阅。

### 弃用生命周期

#### componentWillMount

`componentWillMount` 是在 `render` 之前执行。通常用来情况下，推荐用 constructor()方法代替。

不建议在这个生命中期中获取异步数据：

- 会阻碍组件的实例化,阻碍组件的渲染
- 如果用 setState,在 componentWillMount 里面触发 setState 不会重新渲染

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

### 什么是可控组件和不可控组件？

在 HTML 当中，像`<input>`,`<textarea>`, 和 `<select>`这类表单元素会维持自身的值 value，并根据用户输入进行更新。但在 React 中，可变的状态是保存在组件的状态属性中，并且只能用 setState() 方法进行更新。

我们通过使 React 变成一种单一数据源的状态来结合二者。React 负责渲染表单的组件，仍然控制用户后续输入时所发生的变化。相应的，其值由 React 控制的输入表单元素称为“受控组件”。

使用”受控组件”，每个状态的改变都有一个与之相关的处理函数。这样就可以直接修改或验证用户输入。

### React 异步渲染？

将 setState() 认为是一次请求而不是一次立即执行更新组件的命令。为了更为可观的性能，React 可能会推迟它，稍后会一次性更新这些组件。React 不会保证在 setState 之后，能够立刻拿到改变的结果。

1、在 setState 中调用了 enqueueSetState 方法将传入的 state 放到一个队列中。

2、enqueueSetState 中先是找到需渲染组件并将新的 state 并入该组件的需更新的 state 队列中，接下来调用了 enqueueUpdate 方法。

3、isBatchingUpdates 标识是否在一个更新组件的事务流中。

3.1、如果没有在事务流中，调用 batchedUpdates 方法进入更新流程，进入流程后，会将 isBatchingUpdates 设置为 true。

3.2、否则，将需更新的组件放入 dirtyComponents 中。

### 什么时候会标识 isBatchingUpdates 为 true？

1、当处于生命周期 render 之后的生命周期中。

2、合成事件中（jsx 中的事件都是合成事件）。

::: tip 提示
所以在 setTimeout，源生事件中的 setState 会同步渲染。
:::

### react 怎样提高性能？

1、使用 shouldComponentUpdate 和 Immutable 组合控制合适的时间渲染。PureComponent。

2、render 里面尽量减少新建变量和 bind 函数，传递参数是尽量减少传递参数的数量。

3、多个 react 组件性能优化，key 的优化。

4、redux 性能优化：reselect（数据获取时优化）。

### props 和 state 分别在什么时候用？

1、如果在 Component 中需要在某个时间点改变，那么应该使用 state，否则应该使用 prop。

2、state 是组件在内部管理自己的状态。

3、prop 只能是父组件传入，或者是初始化时自定义，一旦定义，不能改变。

无状态组件： 只有 prop，没有 state。除了这个 render()功能之外没有多少事情发生，所有的逻辑都围绕着 prop。

- 纯静态展示,可读性更好，并能大大减少代码量
- 省去了多余的生命周期，提升了整体的渲染性能
- 可复用性强
