# Redux 使用总结

这一节我们来讨论一下 Redux。

## 历史说起

我们先从历史的角度，分析一下 Redux 的产生。

### MVC 架构

在 MVC 架构时代，对数据、视图、逻辑有了清晰的分工。

- Model：负责保存应用数据，和后端交互同步应用数据。
- View：标识当前状态的视图。
- Controller：负责连接 Model 和 View。Model 的任何改变会应用到 View 中，View 的操作会通过 Controller 应用到 Model。

但是一旦项目变得复杂起来，可能会变成这个样子。

![mvc](https://user-gold-cdn.xitu.io/2018/2/11/16183c3fae895d43)

问题：

- 由于可以在不止一个 View 里修改同个 Model 的数据，一个 Model 的数据同时对应多个 View 的呈现，如图所示。当业务逻辑过多时，`多个 Model 和多个 View 就会耦合到一块`，可以想到排查 bug 的时候会比较痛苦。
- 更糟糕的是，一个 Model 还能改变另一个 Model，使整个`数据流动的方式变得更加混乱`。

### Flux 架构

为了解决 MVC 架构的问题，Flux 采用单向数据流的方式。

- View： 视图层。
- Action（动作）：视图层发出的消息（比如 mouseClick）。
- Dispatcher（派发器）：用来接收 Actions、执行回调函数。
- Store（数据层）：用来存放应用的状态，一旦发生变动，就提醒 Views 要更新页面。

![flux架构](http://www.ruanyifeng.com/blogimg/asset/2016/bg2016011503.png)

Flux 存在多种实现，Redux 就是其中一种。

## Redux 基本概念

Redux 是 JavaScript 状态容器，提供可预测化的状态管理。

- Web 应用是一个状态机，视图与状态是一一对应的。
- 所有的状态，保存在一个对象里面。

Redux 采用函数式编程的写法，实现了单向数据流，同时封装了一个订阅者模式，在数据改动时，会给订阅者发布消息。

```js
import { createStore } from 'redux';

// 定义一个改变 store 数据的方法
function reducer(state,action){
  switch(action.type){
    case 'xxx':
      return {...state,other}
    default 'xxx':
      return {...state,other}
  }
}

const store = createStore(reducer);

// 获取 store 中的数据
store.getState();

// 改变 store 中的数据
store.dispatch({
  type:'xxx',
  data:'123'
});

// 订阅 store 改变后的事件
store.subscribe(()=>{
  console.log('store changed');
});
```

### Redux 工作流

Redux 把所有的状态都存在了一个对象里，这个对象是只读的，必须通过指定工作流才能修改。

view -> dispatch(action) -> store(reducer) -> store(subscribe) -> view。

视图层 -> 触发 action 事件，传递 type 参数 -> 根据 type 参数，匹配 reducer 规则 -> 返回新 store，触发监听事件 -> 重绘视图。

![redux工作流](http://www.ruanyifeng.com/blogimg/asset/2016/bg2016091802.jpg)

## React 中使用 Redux

在 React 中， 我们使用 Redux 抽离页面中的 state，将状态抽离到 store 中进行统一管理，可以`解决各种状态依赖的问题`。抽离状态后，页面中的组件变为`无状态组件`，还能优化渲染性能。

使用 React-Redux 方便在 React 中使用 Redux。

```jsx
const store = createStore(reducer);
<Provider store={store}>
  <Home />
</Provider>;

// home.jsx
class Home extends React.Component {
  render() {
    // 可以获取到store 中的数据
    console.log(this.props);
    return <div />;
  }
}

function mapStateToProps(){}
function mapDispatchToProps(){}

export connect(mapStateToProps,mapDispatchToProps)(Home);
```

react-redux 实现原理：

- react-redux 其实是利用 context API 去做的。
- provider 先调用 createContext 创建一个 context。然后将接收到的 store 数据绑定到 context 上。
- connect 实现了一个高阶组件，返回一个被 Consumer 包裹的组件，同时执行 mapStateToProps 和 mapDispatchToProps 方法，将 store 中的数据和 dispatch 挂载到组件的属性上，最后，在组件 componentDidMounted 生命周期上去订阅 store 的更新，在 component­Will­Unmount 上去取消订阅。

其他可选库。

- connected-react-router（原 react-router-redux） 将路由的状态抽离到 Redux 中。

### 注意事项

- 不能在 reducer 中调用 dispatch，会造成数据流死循环。
- createStore 有 3 个参数，第一个是 reducer，第二个是 store 初始值，第三个是 enhace，扩展 reducer 用。
- combineReducer 用于合并 reducer，实现原理：就是一个纯函数，来组合多个 reducer。
- reducer 函数必须返回返回 state，否则会抛出错误。
- bindActionCreators 自动将参数 actions，绑定 dispatch。

## Redux 异步处理

- redux-thunk 可以返回一个函数类型的 action，接收 dispatch 参数，可以在异步回调中使用。
- redux-promise 可以返回一个 Promise 类型的 action，直接 resolve 异步数据就行了。
- redux-saga 可以无侵入的处理异步，只需要拦截 action，然后在单独的 sagas 文件中进行异步处理，最后返回一个新的 action。通过 generate 实现。

## Redux 优化

首先 Redux 的优化和 store 密切相关，store 里的对象应尽可能地`保持扁平化的设计结构`，避免多层嵌套。

下面介绍几个关于优化 Redux 的库：

### Reselect

对于 Redux 来说，每当 store 发生变化时，所有的 connect 都会重新计算，在一个大型应用中，会造成大量的重复计算。Redux 拥抱了函数式编程，在函数式编程中，`纯函数的好处之一就是方便做缓存`。

Reselect 库就是利用纯函数，`同样的输入必定会有同样的输出`特性，完成对 connect 计算时优化的。

如果我们需要根据 Redux store 的某几部分进行组合计算，才能得到渲染所需的数据，那么这就是使用 Reselect 的最佳场景。

### Immutable

由于 React 拥抱函数式编程，在 setState 时，会返回一个新的 state 实例，可能出现这样的代码，`Object.assign({},this.state,{changedata})`，这种方式。使用 Immutable，可以方便地生成一个新的对象，并且帮我们做了内存优化，只生成改动部分的对象。

- redux-immutable 将 store 中的所有对象，转换为 immutable 对象。
- react-immutable-proptypes 对 immutable 对象的类型检查。

:::warning 注意
1、使用 immutable 后，所有的 state，store，router 中的对象都得改成 immutable 对象，`改造成本较大`。

2、在不支持 immutable 的地方，得进行 toJS()处理，`消耗多余性能`。
:::

### 其他方法

1、在 Redux 中，每个 action 被分发，所有的 reducer 都会被执行一次，我们可以指定环境，让 Redux 在特殊环境之外，只执行 action 对应的 reducer。

```js
const splitActions = (reducer,reg,actions)=>{
  return (state,action)=>{
    if(actions.indexOf(action.type) === -1) {
      return reducer(state);
    }
    if(actions.type.match(reg)) {
      return reducer(state);
    }
    return state;
}

combineReducers({
  counter: splitActions(counter,/COUNTER$/,[SELECT_RADIO]),
  radio: splitActions(counter,/RADIO$/,[INCREMENT_COUNTER])
});
```

2、当我们有连续多个独立的 action 触发时，我们只需要关心最终的状态，即可以把 action 进行合并。

```js
dispatch(action1);
dispatch(action2);
dispatch(action3);

// 转换为
dispatch(batchActions([action1, action2, action3]));

const BATCH = 'BATCHED_ACTIONS';
const batchActions = actions => ({ type: BATCH, payload: actions });

const canBatchedReducer = reducer => {
  const batchedReducer = (state, action) => {
    if (action.type === BATCH) {
      return action.payload.reduce(batchedReducer, state);
    }
    return reducer(state, action);
  };
};
```

3、如果 reducer 会进行大量的计算操作，可以使用 redux-worker 让子进程去帮忙计算。

## Redux API

- createStore 创建 store。
- combineReducers 合并 reducer。
- applyMiddleware 添加中间件。
- bindActionCreators 绑定 dispatch 到 action。
- compose 函数组合。

store 对象：

- 维持应用的 state。
- 提供 getState() 方法获取 state。
- 提供 dispatch(action) 方法更新 state。
- 通过 subscribe(listener) 注册监听器，可通过但会的对象取消监听。
- 通过 replaceReducer(nextReducer) 替换 store 当前用来计算 state 的 reducer。

## react-redux API

- Provider 提供子组件可访问 store 能力。
- connect 连接 React 组件与 Redux store。

### connect 方法

connect 是连接 redux 和 react 和核心，包含 4 个参数。

```js
connect(
  [mapStateToProps],
  [mapDispatchToProps],
  [mergeProps],
  [options]
);
```

#### mapStateToProps

将 store 中的 state 映射到组件的 props 里。

#### mapDispatchToProps

将 store 中的 dispatch 映射到组件的 props 里(一般配合 redux 的 bindActionCreators 直接把绑定了 dispath 的 action 映射到组件中)

#### mergeProps(stateProps, dispatchProps, ownProps)

- stateProps ：mapStateToProps()的返回值。
- dispatchProps：mapDispatchToProps()的返回值。
- ownProps: 组件自己的 props。

这个方法方便对三种来源的 props 进行更好的分类、命名和重组，如果省略这个参数，默认情况下返回 `Object.assign({}, ownProps, stateProps, dispatchProps)` 的结果。

#### options

如果指定这个参数，可以定制 connector 的行为。

- pure: 默认值为 true。如果为 true，Connect 中会定义 shouldComponentUpdate 方法并使用浅比较对比判断前后两次 props 是否发生了变化，从此来减少不必要的刷新。
- withRef: 默认值为 false。如果为 true，Connect 会保存一个对被包装组件实例的引用 refs，该引用通过 getWrappedInstance() 方法获得，并最终获得原始的 dom 节点。

## 相关链接

- 《深入 React 技术栈》
- 《React 状态管理与同构实战》
