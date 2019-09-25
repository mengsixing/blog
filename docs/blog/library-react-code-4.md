# React 源码解析（四）深入理解 fiber 更新过程

这一章主要是对 fiber 更新时的源码分析。

- fiber 的数据结构
- fiber 中的常见概念
- fiber 具体渲染过程

## Fiber 的数据结构

Fiber 又分为 fiberRoot 节点 和普通 fiber 节点，fiberRoot 节点负责进行整个节点树的调度，fiber 则作为节点的类型，在每一个节点都有对应的数据结构。

首先看一下 fiberRoot 的数据结构。

```ts
type BaseFiberRootProperties = {|
  tag: RootTag,
  // React的DOM 容器，把整个 React 渲染到这个 DOM 内部
  containerInfo: any,
  // 指向当前已经完成的 Fiber Tree 的 Root
  current: Fiber,
  finishedExpirationTime: ExpirationTime,
  // 指向当前已经完成准备工作的 Fiber Tree Root
  finishedWork: Fiber | null,
  // Node returned by Scheduler.scheduleCallback
  callbackNode: *,
  // Expiration of the callback associated with this root
  callbackExpirationTime: ExpirationTime,
  // The earliest pending expiration time that exists in the tree
  // 最老和最新的挂起的过期时间（所有任务进来一开始都是这个状态）
  firstPendingTime: ExpirationTime,
  lastPendingTime: ExpirationTime
|};
```

可以看到，fiberRoot 定义了很多关于调度任务的时间，用于调度和管理其他 fiber 节点。

接下来，我们看一下 fiber 的数据结构：

```js {48,51}
// Fiber 对应一个组件需要被处理或者已经处理了，一个组件可以有一个或多个Fiber
type Fiber = {|
  /**************************实例相关*******************************/

  // 标记不同的组件类型
  tag: WorkTag,

  // ReactElement 里面的 key
  key: null | string,

  // ReactElement.type，也就是我们调用 createElement 的第一个参数
  elementType: any,

  // 异步组件 resolved 之后返回的内容，一般是`function`或者`class`
  type: any,

  // 当前 Fiber 的 DOM 节点
  stateNode: any,

  /**************************fiber遍历相关*******************************/

  // 当前 Fiber 节点树中的 parent，用来在处理完这个节点之后向上返回。
  return: Fiber | null,
  // 单链表树结构
  // 指向自己的第一个子节点
  child: Fiber | null,
  // 指向自己的兄弟结构
  // 兄弟节点的return指向同一个父节点
  sibling: Fiber | null,
  // 在 Fiber 树更新的过程中，每个 Fiber 都会有一个跟其对应的 Fiber
  // 我们称他为 current <==> workInProgress
  // 在渲染完成之后他们会交换位置
  // alternate 指向当前 fiber 在 workInProgress 树中的对应fiber
  alternate: Fiber | null,

  /**************************数据相关*******************************/

  // 新的变动带来的新的 props
  pendingProps: any,
  // 上一次渲染完成之后的 props
  memoizedProps: any,
  // 上一次渲染的时候的 state
  memoizedState: any,

  /**************************副作用相关*******************************/

  // 该 Fiber 对应的组件产生的 update 会存放在这个队列里面。
  updateQueue: UpdateQueue<any> | null,

  // 用来记录 Side Effect
  effectTag: SideEffectTag,

  // 子树中第一个side effect
  firstEffect: Fiber | null,

  // 单链表用来快速查找下一个side effect
  nextEffect: Fiber | null,

  // 子树中最后一个side effect
  lastEffect: Fiber | null,

  // 代表任务在未来的哪个时间点应该被完成
  // 不包括他的子树产生的任务
  expirationTime: ExpirationTime,

  // 快速确定子树中是否有不在等待的变化
  childExpirationTime: ExpirationTime
|};
```

Fiber 作为一种数据结构，表示一个工作单元，通过 fiber 的架构，提供了一种跟踪、调度、暂停和中止工作的便捷方式。

## Fiber 中的常见概念

- CurrentTree 和 WorkInProgressTree
- Update
- UpdateQueue
- Side-effects
- Effects list

### CurrentTree 和 WorkInProgressTree

在第一次渲染之后，react 最终得到一个 fiber tree，它反映了用于渲染 ui 的应用程序的状态。这棵树通常被称为 current tree。当 react 开始处理更新时，它会构建一个 workInProgress tree，它反映了要刷新到屏幕的未来状态。

所有任务都在 workInProgress tree 中的 fiber 上执行。当 react 遍历 current tree 时，对于每个现有 fiber 节点，它会使用 render 方法返回的 react 元素中的数据，创建一个备用节点（fiber.alternate），这些节点用于构成 workInProgress tree(备用 tree)。处理完更新并完成所有相关工作后，react 将备用 tree 刷新到屏幕。一旦这个 workInProgress tree 在屏幕上呈现，它就会变成 current tree。

React 的核心原则之一是一致性。 react 总是一次更新 dom，它不会显示部分结果。workInProgress tree 对用户不可见，因此 react 可以先处理完所有组件，然后将其更改刷新到屏幕。

每个 fiber 节点都会通过 alternate 字段保持对另一个树的对应节点的引用。current tree 中的节点指向 workInProgress tree 中的备用节点，反之亦然。

![workinprocess tree](library-react-code4-workinprocess.png)

### Update

在调度算法执行过程中，会将需要进行变更的动作以一个 Update 数据来表示。同一个队列中的 Update，会通过 next 属性串联起来，实际上也就是一个单链表。

```js
export type Update<State> = {
  expirationTime: ExpirationTime,
  // 分别是UpdateState、ReplaceState、ForceUpdate、CaptureUpdate
  tag: 0 | 1 | 2 | 3,
  // 表示这个更新对应的数据内容
  payload: any,
  // 表示更新后的回调函数，如果这个回调有值，就会在 UpdateQueue 的副作用链表中挂载当前 Update 对象
  callback: (() => mixed) | null,
  // UpdateQueue中的Update 之间通过 next 来串联，表示下一个 Update 对象
  next: Update<State> | null,
  nextEffect: Update<State> | null
};
```

Update 对象被创建后，会被 push 到 fiber 对象上的 UpdateQueue 属性，用来记录 Update 的集合。

### UpdateQueue

UpdateQueue 表示当前节点 Update 的集合，其中包含带有 effectTag 的副作用。

在每一个 fiber 对象上都有一个 updateQueue，用来存放需要更新的队列，是一个单向链表数据结构。只要有 setState 或者其他方式触发了更新，就会在 fiber 上的 updateQueue 里插入一个 update，这样在更新的时候就可以合并一起更新。

```js
export type UpdateQueue<State> = {
  // 表示更新前的状态
  baseState: State,
  // 第一个 Update 对象引用，总体是一条单链表
  firstUpdate: Update<State> | null,
  lastUpdate: Update<State> | null,
  // 第一个包含副作用（Callback）的 Update 对象的引用
  firstEffect: Update<State> | null,
  lastEffect: Update<State> | null,
  // 捕获到错误
  firstCapturedUpdate: Update<State> | null,
  lastCapturedUpdate: Update<State> | null,
  firstCapturedEffect: Update<State> | null,
  lastCapturedEffect: Update<State> | null
};
```

### Side-effects

我们可以将 react 中的一个组件视为一个使用 state 和 props 来计算 UI 的函数。每个其他活动，如改变 dom 或调用生命周期方法，都应该被认为是 side-effects。

大多数 state 和 props 更新将触发 side-effects。每个 fiber 节点都可以具有与之相关的 effects, 通过 fiber 节点中的 effectTag 字段表示。

因此，fiber 中的 effects 基本上定义了处理更新后需要为实例完成的工作，对于 host 组件，工作包括添加，更新或删除元素。对于 class 组件，react 可能需要更新 ref 并调用 componentDidMount 和 componentDidUpdate 生命周期方法，对于其他组件也存在对应的 effect 处理方法。

### Effects list

React 能够非常快速地更新，并且为了实现高性能，它采用了一些有趣的技术。其中之一是构建带有 side-effects 的 fiber 节点的线性列表，其具有快速迭代的效果。迭代线性列表比树快得多，并且没有必要在无 effects 标记的节点上花费时间。

Effects list 的目标是标记具有 dom 更新或与其关联的其他 effects 的节点，此列表是 finishedWork tree 的子集，并使用 nextEffect 属性，而不是 current 和 workInProgress 树中使用的 child 属性进行连接。

为了使这个 effects list 可视化，我们想象下面的 fiber tree，其中橙色的节点都有一些 effects 需要处理。例如，我们的更新导致 c2 被插入到 DOM 中，d2 和 c1 被用于更改属性，而 b2 被用于激活生命周期方法。effects list 将它们连接在一起，以便在 commit 阶段可以跳过其他节点。

![react-effect1](library-react-effect.png)

在更新的时候会先创建和 fiber tree 一样结构的树： workInProgress tree，然后进行 dom diff 算法，在有差异的节点上打上 tag，并将打上 tag 的 workInProgress tree 推送到 effect list 中，然后进行更新操作。

![react-effect2](library-react-effect-2.png)

## Fiber 具体渲染过程

Fiber 渲染过程分为两个阶段，Render 阶段和 Commit 阶段。

### Render 阶段

Render 阶段主要完成更新前的准备工作，如：构建 fiber 树，创建 update 队列，标记 effectTag 等。

- 创建 workInProgress
- wookLoop
- performUnitOfWork
- beginWork
- completeUnitOfWork

#### 创建 workInProgress

Render 阶段开始渲染时，分别经过一下几个方法，最终生成一个 workInProgress。

- ReactDOM.render
- legacyRenderSubtreeIntoContainer
- updateContainer
- updateContainerAtExpirationTime
- scheduleRootUpdate
- scheduleWork
- renderRoot
- prepareFreshStack
- createWorkInProgress

workInProgress 树是当前 fiber 树的一个克隆，用于表示即将渲染到页面上的节点状态。

```ts
function prepareFreshStack(root, expirationTime) {
  workInProgress = createWorkInProgress(root.current, null, expirationTime);
}

function createWorkInProgress(
  current: Fiber,
  pendingProps: any,
  expirationTime: ExpirationTime
) {
  let workInProgress = current.alternate;
  if (workInProgress === null) {
    workInProgress = createFiber(
      current.tag,
      pendingProps,
      current.key,
      current.mode
    );
    workInProgress.elementType = current.elementType;
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    // workInProgress 和 current 通过 alternate 属性相互引用
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  }
  return workInProgress;
}
```

#### wookLoop

所有 fiber 节点都在 workLoop 中处理。

```js
function workLoop() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

#### performUnitOfWork

performUnitOfWork 函数从 workInProgress 树接收 fiber 节点，并通过调用 beginWork 函数启动工作，即通过这个函数启动 fiber 需要执行的所有活动。beginWork 函数始终返回要在循环中处理的下一个子节点或 null。

```js
function performUnitOfWork(unitOfWork: Fiber): Fiber | null {
  const current = unitOfWork.alternate;
  let next;
  next = beginWork(current, unitOfWork, renderExpirationTime);
  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    next = completeUnitOfWork(unitOfWork);
  }
  return next;
}
```

从这里可以看出，这里对 workInProgress 节点进行一些处理，然后会通过一定的遍历规则返回 next，如果 next 不为空，就返回进入下一个 performUnitOfWork，否则就进入 completeUnitOfWork。

#### beginWork

beginWork 主要是处理 workInProgress。通过 workInProgress.tag 区分出当前 FiberNode 的类型，然后进行对应的更新处理。

```js
function beginWork() {
  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(current, workInProgress, renderExpirationTime);
    case ClassComponent:
    case FunctionComponent:
    case IndeterminateComponent:
    case LazyComponent:
    case HostComponent:
    case HostText:
    case SuspenseComponent:
    // ...
    // 根据不同组件，进行不通的方式渲染。
  }
}
```

beginWork 执行到最后会调用 processUpdateQueue 和 reconcileChildren 方法。

##### processUpdateQueue

processUpdateQueue 会遍历 fiber 节点上的 updateQuque 队列，然后批量执行 update 方法，最终生成最新状态的 state。

![library-react-code4-updatequeue.png](library-react-code4-updatequeue.png)

相关代码如下：

```js
function processUpdateQueue<State>(
  workInProgress: Fiber,
  queue: UpdateQueue<State>,
  props: any,
  instance: any,
  renderExpirationTime: ExpirationTime
): void {
  let update = queue.firstUpdate;
  let resultState = newBaseState;
  // 循环执行 update 队列，生成最终的 state
  while (update !== null) {
    // 执行 update 返回新 state
    resultState = getStateFromUpdate(
      workInProgress,
      queue,
      update,
      resultState,
      props,
      instance
    );
    const callback = update.callback;
    if (callback !== null) {
      workInProgress.effectTag |= Callback;
      // Set this to null, in case it was mutated during an aborted render.
      update.nextEffect = null;
      if (queue.lastEffect === null) {
        queue.firstEffect = queue.lastEffect = update;
      } else {
        queue.lastEffect.nextEffect = update;
        queue.lastEffect = update;
      }
    }
    // Continue to the next update.
    update = update.next;
  }
}
```

##### reconcileChildren

在 workInProgress 节点自身处理完成之后，会通过 props.children 或者 instance.render 方法获取子 ReactElement。子 ReactElement 可能是对象、数组、字符串、迭代器，这些不同的类型需要通过 reconcileChildren 单独进行处理。

```js
function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
  renderExpirationTime: ExpirationTime
) {
  workInProgress.child = reconcileChildFibers(
    workInProgress,
    current.child,
    nextChildren,
    renderExpirationTime
  );
}

function reconcileChildFibers(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChild: any,
  expirationTime: ExpirationTime
): Fiber | null {
  const isObject = typeof newChild === 'object' && newChild !== null;
  if (isObject) {
    // 根据不容元素类型，进行不同的 diff 算法。
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE:
        return placeSingleChild(
          reconcileSingleElement(
            returnFiber,
            currentFirstChild,
            newChild,
            expirationTime
          )
        );
      case REACT_PORTAL_TYPE:
        return placeSingleChild(
          reconcileSinglePortal(
            returnFiber,
            currentFirstChild,
            newChild,
            expirationTime
          )
        );
    }
  }

  // 文本节点替换
  if (typeof newChild === 'string' || typeof newChild === 'number') {
    return placeSingleChild(
      reconcileSingleTextNode(
        returnFiber,
        currentFirstChild,
        '' + newChild,
        expirationTime
      )
    );
  }

  // 子元素是数组
  if (isArray(newChild)) {
    return reconcileChildrenArray(
      returnFiber,
      currentFirstChild,
      newChild,
      expirationTime
    );
  }

  // Remaining cases are all treated as empty.
  return deleteRemainingChildren(returnFiber, currentFirstChild);
}
```

#### completeUnitOfWork

进入这个流程，表明 workInProgress 节点是一个叶子节点，或者它的子节点都已经处理完成了。现在开始要处理这个节点的剩余工作。

创建 DomElement，处理子 DomElement 绑定关系。

- 根据是否中断调用不同的处理方法。
- 根据是否有兄弟节点来执行不同的操作。
- 完成节点之后赋值 effect 链。

```js
function completeUnitOfWork(unitOfWork: Fiber): Fiber | null {
  next = completeWork(current, workInProgress, renderExpirationTime);

  // 更新effect 链
  if (returnFiber.firstEffect === null) {
    returnFiber.firstEffect = workInProgress.firstEffect;
  }
  if (workInProgress.lastEffect !== null) {
    if (returnFiber.lastEffect !== null) {
      returnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
    }
    returnFiber.lastEffect = workInProgress.lastEffect;
  }
}

// completeWork 方法中，会根据 workInProgress.tag 来区分出不同的动作
function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime
): Fiber | null {
  switch (workInProgress.tag) {
    case HostRoot: {
      updateHostContainer(workInProgress);
      break;
    }
    case IndeterminateComponent:
    case LazyComponent:
    case SimpleMemoComponent:
    case FunctionComponent:
    case ClassComponent:
    case HostComponent:
    case HostText:
    // ...
  }
}

function updateHostContainer(workInProgress: Fiber) {
  const portalOrRoot: {
    containerInfo: Container,
    pendingChildren: ChildSet
  } = workInProgress.stateNode;
  const childrenUnchanged = workInProgress.firstEffect === null;
  if (childrenUnchanged) {
    // No changes, just reuse the existing instance.
  } else {
    const container = portalOrRoot.containerInfo;
    let newChildSet = createContainerChildSet(container);
    // If children might have changed, we have to add them all to the set.
    appendAllChildrenToContainer(newChildSet, workInProgress, false, false);
    portalOrRoot.pendingChildren = newChildSet;
    // 标记 effectTag = Update 类型
    markUpdate(workInProgress);
    finalizeContainerChildren(container, newChildSet);
  }
}

function appendAllChildrenToContainer(
  containerChildSet: ChildSet,
  workInProgress: Fiber,
  needsVisibilityToggle: boolean,
  isHidden: boolean
) {
  let node = workInProgress.child;
  while (node !== null) {
    // 处理不同类型节点
    if (node.tag === HostComponent) {
      // node.stateNode 就是对应的 dom 元素
      let instance = node.stateNode;
      if (needsVisibilityToggle && isHidden) {
        // This child is inside a timed out tree. Hide it.
        const props = node.memoizedProps;
        const type = node.type;
        instance = cloneHiddenInstance(instance, type, props, node);
      }
      // 插入子节点
      appendChildToContainerChildSet(containerChildSet, instance);
    } else if (node.tag === HostText) {
      let instance = node.stateNode;
      if (needsVisibilityToggle && isHidden) {
        // This child is inside a timed out tree. Hide it.
        const text = node.memoizedProps;
        instance = cloneHiddenTextInstance(instance, text, node);
      }
      appendChildToContainerChildSet(containerChildSet, instance);
    }
  }
}
```

在处理完当前节点，返回父节点的时，把当前的链条挂接到 returnFiber 上。最终，在 HostRoot.firstEffect 上挂载着一条拥有当前 FiberNodeTree 所有副作用的 FiberNode 链表。

这里总结了一张图，表示 render 阶段的执行过程。

![library-react-code4-render-phase.png](library-react-code4-render-phase.png)

### Commit 阶段

提交阶段，就是实际执行一些生命周期函数、DOM 操作的阶段。

这里也是一个链表的遍历，而遍历的就是 Render 阶段生成的 effect 链表。

![library-react-code4-effectlist.png](library-react-code4-effectlist.png)

- 提交节点装载（ mount ）前的操作。
- 提交端原生节点（ Host ）的副作用（插入、修改、删除）。
  - 将刚创建完的 DomElement Tree 装载到容器 DomElement 中。
- 改变 workInProgress/alternate/finishedWork 的身份。
  - 在执行完成 effect 之后，将 workInProgress 树设置为当前树。
- 提交装载、变更后的生命周期调用操作。

## 相关链接

- [深入 React fiber 架构及源码](https://zhuanlan.zhihu.com/p/57346388)
