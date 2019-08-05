# React 源码解析（二）FiberRoot 构建

Fiber 是对 React 核心算法的重构，也是 React 最重要的概念，这一章从 ReactDOM.render 开始，逐步分析 FiberRoot 的创建过程。

- 创建 FiberRoot
- BatchUpdate 和 setState

## 创建 FiberRoot

我们顺着流程继续分析，jsx 转换后的代码，会在 ReactDOM.render 中进行执行。会依次调用以下几个方法，最终会构建一颗 fiber 树。

- legacyRenderSubtreeIntoContainer
- legacyCreateRootFromDOMContainer
- ReactSyncRoot
- 进入 react-reconciler 库
  - 具体通过 createContainer -> createFiberRoot 创建 fiberRoot。

ReactDOM.render 执行时，首先在 legacyRenderSubtreeIntoContainer 方法中执行初始化，然后在 legacyCreateRootFromDOMContainer 方法里给 root 元素打上标识 \_reactRootContainer，并调用 ReactSyncRoot 创建 fiberRoot，具体的创建过程在 react-reconciler 中。

首次渲染时采用 ReactSyncRoot 进行同步渲染，不会进入异步调度过程，因为组件需要尽快的完成渲染。最终渲染完成后生成一颗完整的 fiber 树。

![cmd-react-children](library-react-tree-demo-Fiber.png)

### React Fiber

在 ReactDOM 中可以看到，具体的创建 fiber，更新 fiber，批量更新等过程都是在 react-reconciler 这个库里进行管理的。

```js
import {
  updateContainerAtExpirationTime,
  createContainer,
  updateContainer,
  batchedUpdates,
  unbatchedUpdates
} from 'react-reconciler/inline.dom';
```

react-reconciler 负责具体 FiberRoot 的构建，它承载了整个 React 更新调度全部的数据结构。

#### Fiber 的数据结构

首先看一下 fiberRoot 的数据结构。

```js
// FiberRoot 的数据结构
type BaseFiberRootProperties = {|
  // root节点，render方法接收的第二个参数
  containerInfo: any,
  // 只有在持久更新中会用到，也就是不支持增量更新的平台，react-dom不会用到
  pendingChildren: any,
  // 当前应用对应的Fiber对象，是Root Fiber
  current: Fiber,

  // 一下的优先级是用来区分
  // 1) 没有提交(committed)的任务
  // 2) 没有提交的挂起任务
  // 3) 没有提交的可能被挂起的任务
  // 我们选择不追踪每个单独的阻塞登记，为了兼顾性能
  // The earliest and latest priority levels that are suspended from committing.
  // 最老和新的在提交的时候被挂起的任务
  earliestSuspendedTime: ExpirationTime,
  latestSuspendedTime: ExpirationTime,
  // The earliest and latest priority levels that are not known to be suspended.
  // 最老和最新的不确定是否会挂起的优先级（所有任务进来一开始都是这个状态）
  earliestPendingTime: ExpirationTime,
  latestPendingTime: ExpirationTime,
  // The latest priority level that was pinged by a resolved promise and can
  // be retried.
  // 最新的通过一个promise被reslove并且可以重新尝试的优先级
  latestPingedTime: ExpirationTime,

  // 如果有错误被抛出并且没有更多的更新存在，我们尝试在处理错误前同步重新从头渲染
  // 在`renderRoot`出现无法处理的错误时会被设置为`true`
  didError: boolean,

  // 正在等待提交的任务的`expirationTime`
  pendingCommitExpirationTime: ExpirationTime,
  // 已经完成的任务的FiberRoot对象，如果你只有一个Root，那他永远只可能是这个Root对应的Fiber，或者是null
  // 在commit阶段只会处理这个值对应的任务
  finishedWork: Fiber | null,
  // 在任务被挂起的时候通过setTimeout设置的返回内容，用来下一次如果有新的任务挂起时清理还没触发的timeout
  timeoutHandle: TimeoutHandle | NoTimeout,
  // 顶层context对象，只有主动调用`renderSubtreeIntoContainer`时才会有用
  context: Object | null,
  pendingContext: Object | null,
  // 用来确定第一次渲染的时候是否需要融合
  +hydrate: boolean,
  // 当前root上剩余的过期时间
  // TODO: 提到renderer里面区处理
  nextExpirationTimeToWorkOn: ExpirationTime,
  // 当前更新对应的过期时间
  expirationTime: ExpirationTime,
  // List of top-level batches. This list indicates whether a commit should be
  // deferred. Also contains completion callbacks.
  // TODO: Lift this into the renderer
  // 顶层批次（批处理任务？）这个变量指明一个commit是否应该被推迟
  // 同时包括完成之后的回调
  // 貌似用在测试的时候？
  firstBatch: Batch | null,
  // root之间关联的链表结构
  nextScheduledRoot: FiberRoot | null
|};
```

可以看到，fiberRoot 是更新的主要节点，任何其他子节点更新都要经过 fiberRoot。

接下来，我们看一下 Fiber 的数据结构：

```js
// Fiber对应一个组件需要被处理或者已经处理了，一个组件可以有一个或者多个Fiber
type Fiber = {|
  // 标记不同的组件类型
  tag: WorkTag,

  // ReactElement里面的key
  key: null | string,

  // ReactElement.type，也就是我们调用`createElement`的第一个参数
  elementType: any,

  // The resolved function/class/ associated with this fiber.
  // 异步组件resolved之后返回的内容，一般是`function`或者`class`
  type: any,

  // The local state associated with this fiber.
  // 跟当前Fiber相关本地状态（比如浏览器环境就是DOM节点）
  stateNode: any,

  // 指向他在Fiber节点树中的`parent`，用来在处理完这个节点之后向上返回
  return: Fiber | null,

  // 单链表树结构
  // 指向自己的第一个子节点
  child: Fiber | null,
  // 指向自己的兄弟结构
  // 兄弟节点的return指向同一个父节点
  sibling: Fiber | null,
  index: number,

  // ref属性
  ref: null | (((handle: mixed) => void) & { _stringRef: ?string }) | RefObject,

  // 新的变动带来的新的props
  pendingProps: any,
  // 上一次渲染完成之后的props
  memoizedProps: any,

  // 该Fiber对应的组件产生的Update会存放在这个队列里面
  updateQueue: UpdateQueue<any> | null,

  // 上一次渲染的时候的state
  memoizedState: any,

  // 一个列表，存放这个Fiber依赖的context
  firstContextDependency: ContextDependency<mixed> | null,

  // 用来描述当前Fiber和他子树的`Bitfield`
  // 共存的模式表示这个子树是否默认是异步渲染的
  // Fiber被创建的时候他会继承父Fiber
  // 其他的标识也可以在创建的时候被设置
  // 但是在创建之后不应该再被修改，特别是他的子Fiber创建之前
  mode: TypeOfMode,

  // Effect
  // 用来记录Side Effect
  effectTag: SideEffectTag,

  // 单链表用来快速查找下一个side effect
  nextEffect: Fiber | null,

  // 子树中第一个side effect
  firstEffect: Fiber | null,
  // 子树中最后一个side effect
  lastEffect: Fiber | null,

  // 代表任务在未来的哪个时间点应该被完成
  // 不包括他的子树产生的任务
  expirationTime: ExpirationTime,

  // 快速确定子树中是否有不在等待的变化
  childExpirationTime: ExpirationTime,

  // 在Fiber树更新的过程中，每个Fiber都会有一个跟其对应的Fiber
  // 我们称他为`current <==> workInProgress`
  // 在渲染完成之后他们会交换位置
  alternate: Fiber | null
|};
```

在每一个 fiber 对象上都有一个 updateQueue，用来存放需要更新的队列，是一个单向链表数据结构。只要有 setState 或者其他方式触发了更新，就会在 fiber 上的 updateQueue 里插入一个 update，这样在更新的时候就可以合并一起更新。

在更新的时候会先创建和 fiber tree 一样结构的树： workInProgress tree，然后进行 dom diff 算法，在有差异的节点上打上 tag，并将打上 tag 的 workInProgress tree 推送到 effect list 中，然后进行更新操作。

#### 创建 fiber createContainer

在创建 fiberRoot 的同时，还会渲染 children。

```js
// 初始化渲染
let fiberRoot;
// 初次渲染
root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
  container,
  forceHydrate
);
fiberRoot = root._internalRoot;
// 不使用批量更新
unbatchedUpdates(() => {
  updateContainer(children, fiberRoot, parentComponent, callback);
});
```

代码中可以看到，第一次渲染时，会调用 unbatchedUpdates 下的 updateContainer 批量更新子节点。

#### 更新 fiber updateContainer

updateContainer 方法用来更新 fiber，顺着第一次渲染的情况，调用情况如下：

- updateContainerAtExpirationTime，调用方法，更新 container。
- scheduleRootUpdate 调度根组件渲染。
  - 创建 update。
  - 调用 enqueueUpdate(current, update) 更新 update 队列。
- getCurrentPriorityLevel 获取当前任务的优先级。
- scheduleWork(current, expiration Time) 进入异步调度流程。
  - renderRoot(root, Sync, true) 渲染 root 组件。
  - workLoop 执行循环渲染。
  - performUnitOfWork(workInProgress)
  - beginWork(current, unitOfWork, renderExpirationTime) 创建子节点 fiber。

创建完 Fiber Root 在 unbatchedUpdates 中执行 updateContainer 对容器内容进行更新，更新前会先通过 expirationTime 对节点计算过期时间，具体是通过在 ReactFiberWorkLoop 中 computeExpirationForFiber 进行计算。

```js
function workLoop() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

reactFiberWorkLoop 其实是一个循环监控的过程，会在执行完一定时间的 requestanimationframe 后，进行其他任务的调度。如果有多个任务 expirationTime 都在 25ms 之内，则会进行批量更新，对应一次 batchedUpdates。

这个超时时间实现的非常精妙，我们拿 computeAsyncExpiration 举例子，在 computeExpirationBucket 中接收的就是 currentTime、5000 和 250 ，最终的公式：`((((currentTime - 2 + 5000 / 10) / 25) | 0) + 1) * 25`。

```js
ceiling(
  MAGIC_NUMBER_OFFSET - currentTime + expirationInMs / UNIT_SIZE,
  bucketSizeMs / UNIT_SIZE
);

function ceiling(num: number, precision: number): number {
  return (((num / precision) | 0) + 1) * precision;
}
```

翻译一下就是：最终结果是以 25 为单位向上增加的，比如说我们输入 10002 - 10026 之间，最终得到的结果都是 10525，但是到了 10027 的结果就是 10550，这就是除以 25 取整的效果。

其实可以这样理解：

```js
100 / 25 | 0
= 4 | 0
= 4

101 / 25 | 0
= 4.04 | 0
= 4
```

React 这么设计抹相当于抹平了 25ms 内计算过期时间的误差，那它为什么要这么做呢？

细想了一下，这么做也许是为了让非常相近的两次更新得到相同的 expirationTime，然后在一次更新中完成，相当于一个自动的 batchedUpdates。

这是一张构建 fiber 树的流程图：

![scheduler-render-root](library-react-scheduler-render-root.png)

## BatchUpdate 和 setState

### BatchUpdate

之前我们已经多次的探讨过这个批处理了 batchedUpdates，那么它到底是如何工作的呢？

我们运行以下代码进行测试。

```js
import React from 'react';
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
  test() {
    this.setState({
      count: this.state.count + 1
    });
    this.setState({
      count: this.state.count + 1
    });
  }
  componentDidMount() {
    let me = this;
    me.setState({
      count: me.state.count + 1
    });
    console.log('第一次 componentDidMount:', me.state.count);
    me.setState({
      count: me.state.count + 1
    });
    console.log('第二次 componentDidMount:', me.state.count);
    setTimeout(function() {
      me.setState({
        count: me.state.count + 1
      });
      console.log('第一次 setTimeout:', me.state.count);
      me.setState({
        count: me.state.count + 1
      });
      console.log('第二次 setTimeout:', me.state.count);
    }, 0);
    setTimeout(function() {
      batchedUpdates(() => {
        me.setState({
          count: me.state.count + 1
        });
        console.log('第一次 batchedUpdates:', me.state.count);
        me.setState({
          count: me.state.count + 1
        });
        console.log('第二次 batchedUpdates:', me.state.count);
      });
    }, 0);
    console.log('第三次 componentDidMount:', me.state.count);
  }
  render() {
    return (
      <div>
        <h1>{this.state.count}</h1>
        <button onClick={this.test.bind(this)}>增加count</button>
      </div>
    );
  }
}

export default App;

// 第一次 componentDidMount: 0
// 第二次 componentDidMount: 0
// 第三次 componentDidMount: 0
// 第一次 setTimeout: 2
// 第二次 setTimeout: 3
// 第一次 batchedUpdates: 3
// 第二次 batchedUpdates: 3
```

如果你对最后的打印感到疑惑？我们再顺着 batchedUpdates 的流程图，仔细分析一下。

![scheduler-render-root](library-react-batchedUpdates.png)

首先我们可以在 react.development.js 文件中给 requestWork 方法打一个 debugger，因为整个 react 的更新调度都会进入到这个函数。接着，批量更新分为两种情况，一种是渲染中的时候并不会进入到 BatchingUpdates。另一种是调用 performWork 通过寻找 findHighestPriorityRoot 最高优先级任务，并执行任务的调度。

图中 Transaction 事务类似一个面向切面编程的概念，将主流程放入 perform 方法中执行，其他的流程必须首先在 wrapper 中的 initialize 方法中进行注册，等到主流程 perform 方法执行完毕之后，才执行对应的 close 方法。

### setState 到底是怎么运行的

在组件已经渲染完成中，setState 是同步执行的，但是不会立马更新，因为他在批量处理中会等待组件 render 才真正触发。不在批处理中的任务可能会立马更新。到底更新不更新要取决于 setState 是否在 Async 的渲染过程中，因为他会进入到异步调度过程。如果 setState 处于我们某个生命周期中，暂时不会 BatchUpdate 参与，因为组件要尽早的提前渲染。

:::tip 案例
setState 在 componentDidMount 生命周期中，isBatchUpdate 是 true，所以不会进入更新阶段，会被加入到 diryComponent 中，在 Transaction 事务完成之后，isBatchUpdate 会被重置为 false，在下一个循环中就会更新 state。

如果是在 setTimeout 中执行，不会进入到事务流程，直接进行批处理更新，但如果是异步更新，也要遵守 fiber 的调度过程。
:::

## 总结

这一章分析了 ReactDOM 创建 fiberRoot 的过程，以及 BatchUpdate 和 setState 的流程。

这一章还有个疑问，就是关于 React 具体的异步调度过程是什么呢？我们下一章继续探究~

## 相关链接

- [React 源码剖析系列 - 解密 setState](https://www.w3ctech.com/topic/1597)
