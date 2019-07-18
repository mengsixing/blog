# React 核心知识

总结一下 react 核心知识点，开发必备。

- Fiber
- 错误处理
- Suspense
- Context
- Ref
- Portals
- 生命周期

## Fiber

React 框架内部的运作可以分为 3 层：

- Virtual DOM 层，描述页面长什么样。
- Reconciler 层，负责调用组件生命周期方法，进行 Diff 运算等。
- Renderer 层，根据不同的平台，渲染出相应的页面，比较常见的是 ReactDOM 和 ReactNative。

从 React16.8 开始，对 Reconciler 层了做了很大的改动，React 团队也给它起了个新的名字，叫 Fiber Reconciler。这就引入另一个关键词：Fiber。

Fiber 把更新过程碎片化，每执行完一段更新过程，就把控制权交还给 react 负责任务协调的模块，看看有没有其他紧急任务要做，如果没有就继续去更新，如果有紧急任务，那就去做紧急任务。

为了达到这种效果，就需要有一个调度器 (Scheduler) 来进行任务分配。任务的优先级有六种：

- synchronous，与之前的 Stack Reconciler 操作一样，同步执行
- task，在 next tick 之前执行
- animation，下一帧之前执行
- high，在不久的将来立即执行
- low，稍微延迟执行也没关系
- offscreen，下一次 render 时或 scroll 时才执行

优先级高的任务（如键盘输入）可以打断优先级低的任务（如 Diff）的执行，从而更快的生效。

Fiber Reconciler 在执行过程中，会分为 2 个阶段：render 阶段 和 commit 阶段。

### Render 阶段

Render 阶段包括 render 以前的生命周期。在这个阶段执行过程中会根据任务的优先级，选择执行或者暂停。故可能发生某个生命周期被执行多次的情况。

:::tip
Render 阶段可以被打断，让优先级更高的任务先执行，从框架层面大大降低了页面掉帧的概率。
:::

### Commit 阶段

Render 之后的生命周期，都属于 commit phase。在这个阶段执行过程中不会被打断，会一直执行到底。

## 错误处理

React 新增了两种方式来捕获组件报错，componentDidCatch，static getDerivedStateFromError。

- componentDidCatch
  - 在 commit 阶段触发。
  - 只支持客户端渲染。
  - 常用于上传错误报告。
- getDerivedStateFromError
  - 在 render 阶段触发。
  - 支持服务器端渲染。
  - 常用于更新 state，显示友好的错误提示。

使用案例如下：

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  // 用来显示错误提示
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // 上报异常
  componentDidCatch(error, info) {
    logComponentStackToMyService(info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

## Suspense

Suspense 使得组件可以“等待”某些操作结束后，再进行渲染。目前主要支持的场景有：

- 动态加载组件
- 异步数据获取（未上线）

为了减少首屏加载时间，可以使用动态加载组件，将首页用不到的组件写成动态组件，单独进行打包，在真正使用到的时候进行加载。

```jsx
const Clock = React.lazy(() => {
  return import('./Clock');
});

<Suspense callback={<div>loading...</div>}>
  <Clock />
</Suspense>;
```

为了方便在异步获取数据的时候显示 loading 状态，也可以使用 suspense。

```jsx
// 这里使用官方的演示库react-cache
import { unstable_createResource } from 'react-cache';

const TodoResource = unstable_createResource(fetchTodo);

function Todo(props) {
  const todo = TodoResource.read(props.id);
  return <li>{todo.title}</li>;
}

function App() {
  return (
    // Same Suspense component you already use for code splitting
    // would be able to handle data fetching too.
    <React.Suspense fallback={<div>loading...</div>}>
      <ul>
        {/* Siblings fetch in parallel */}
        <Todo id="1" />
        <Todo id="2" />
      </ul>
    </React.Suspense>
  );
}
```

### Suspense 原理

上文中写道，Suspense 使得组件可以“等待”某些操作结束后，再进行渲染，这个等待并不是真正的等待，而是使用**错误捕获的方式，循环进行调用**。

我们先来看一下异步数据获取的案例。

```js
//创建Fetcher
var cached = {};
const createFetcher = promiseTask => {
  let ref = cached;
  return () => {
    const task = promiseTask();
    task.then(res => {
      ref = res;
    });
    // 核心是抛出错误，给外层包裹的 suspense 组件捕获
    if (ref === cached) {
      throw task;
    }
    //得到结果输出
    console.log('result:', ref);
    return ref;
  };
};
```

suspense 内部

```js
getDerivedStateFromError(error) {
   if (isPromise(error)) {
      error.then(reRender);
   }
}
```

- 异步数据获取。
- 创建 promise，调用 then 方法，看是否已获取到数据。
  - 数据获取成功，返回数据，渲染成功。
  - 数据获取失败，抛出错误。
- 外层 suspense 组件使用 getDerivedStateFromError 捕获到错误
  - 回到第二步，继续创建 promise，查看是否已获取到数据。
    - 数据获取成功，返回数据，渲染成功。
    - 数据获取失败，循环第二步，并渲染 callback 中的 loading 状态。

:::tip
可以看到，suspense 异步加载的原理是捕获错误，循环加载的方式。这也暴露出了一个问题：在报错前的代码，可能会被多次执行。
:::

## Ref

React 支持一个特殊的、可以附加到任何组件上的 ref 属性，用来对附加组件进行引用。创建在源生 dom 元素上，得到的引用是 dom 元素，创建在 react 组件上，得到的引用则是这个组件。

创建 ref 的两种方式：

- React.createRef
- 在组件上编写 ref 函数

使用 React.createRef 创建 ref：

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

在组件上编写 ref 函数，创建 ref：

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = null;
  }
  render() {
    return <div ref={element => {
      // 自己绑定 ref，当然函数中可以做其他的事情
      this.myRef = element;
    };} />;
  }
}
```

ref 编写完成之后，就可以通过 `this.myRef.current`获取 ref 数据。

:::tip
ref 可以添加在 class 组件上，通过 ref.current 可以访问到组件的实例，但你不能在函数组件上使用 ref 属性，因为它们没有实例。

ref 不仅可以在当前组件中使用，而且可以传递给子组件，获取子组件中元素的引用。
:::

通过 React.forwardRef 将 ref 传递给子组件进行绑定。

```jsx
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// 你可以直接获取子组件 DOM button 的 ref：
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

## Portals

Portals 提供了一个顶级的方法，使得我们有能力把一个子组件渲染到父组件 DOM 层级以外的 DOM 节点上。

常用于做全局性的弹窗。

```js
// 创建全局弹窗div
const globalDiv = document.createElement('div');
document.body.appendChild(globalDiv);

// 组件插槽
// 将 <span>Portal组件</span> 这段 jsx 代码渲染到 globalDiv 上。
class App extends React.Component {
  render() {
    return (
      <div>
        <div>{ReactDOM.createPortal(<span>Portal组件</span>, globalDiv)}</div>
      </div>
    );
  }
}
export default App;
```

## 生命周期

首先，我们看一下这个[生命周期演示图](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)。

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

此方法常用于性能优化，可以根据自身需要，合理控制组件是否应该渲染，如果没有特殊需要，建议使用 PureComponent。

#### render

同上。

#### getSnapshotBeforeUpdate

按字面意思理解，在更新前获取屏幕快照，主要用来记忆更新前的状态，以便在更新后进行使用。在 getSnapshotBeforeUpdate 中读取到的 DOM 元素状态是可以保证是更新前的最终状态。

- 触发时间: update 发生的时候，在 render 之后，在组件 dom 渲染之前。
- 返回一个值，作为 componentDidUpdate 的第三个参数。

#### componentDidUpdate

componentDidUpdate(prevProps, prevState, snapshot) **这也是进行网络请求的好地方**。如果触发某些回调函数时需要用到 DOM 元素的状态，则将对比或计算的过程迁移至 getSnapshotBeforeUpdate，然后在 componentDidUpdate 中统一触发回调或更新状态。

### 卸载时

#### componentWillUnmount

当组件在卸载和销毁时会触发。常用于清理内存，例如：清除无用的定时器，清除订阅事件等。

### 弃用生命周期

#### componentWillMount

ComponentWillMount 是在 render 生命周期之前执行。通常用来情况下，推荐用 constructor 方法代替。

不建议在这个生命中期中获取异步数据：

- react filber 中可能多次调用 render 之前的生命周期函数，可能会请求多次。
- 在服务器端渲染时，服务器端会执行一次，客户端也会执行一次。
- 如果请求在 componentWillMount，react 并没有挂载到 dom 上，这时候 setState 可能会有问题。

#### componentWillReceiveProps

componentWillReceiveProps 是在组件属性改变时触发，由于此方法是组件内部方法，可以使用 setState 重新渲染，使用不当可能会让组件渲染陷入渲染死循环，例如：修改父组件的 state。

如果只希望在属性改变时，渲染当前组件，可以使用 static getDerivedStateFromProps 代替。

#### componentWillUpdate

本意是提供一个在 render 方法执行之前，做一些更新之前的准备工作, 例如读取当前某个 DOM。但在 fiber 架构更新后，可能会被执行多次，已不适合使用。

如果需要在渲染前读取当前某个 DOM 元素的状态，可以用 getSnapshotBeforeUpdate 代替。

## 总结

React 中常用的核心知识其实不多，掌握好以上内容就可以很熟练的编写项目了，但要知道怎么去实现的这些功能，却是要好好研究一下源码才行。
