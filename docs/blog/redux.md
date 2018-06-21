# redux 使用总结

由于使用场景都是结合 react，主要讨论在 react 中使用情景。

## 基本概念

Redux 是 JavaScript 状态容器，提供可预测化的状态管理。

- Web 应用是一个状态机，视图与状态是一一对应的。
- 所有的状态，保存在一个对象里面。

## 工作流

redux 把所有的状态都存在了一个对象里，这个对象是只读的，必须通过指定工作流才能修改。

view -> dispatch(action) -> reducer -> store(subscribe) -> view。

视图层 -> 触发 action 事件，传递 type 参数 -> 根据 type 参数，匹配 reducer 规则 -> 返回新 store,触发监听事件 -> 重绘视图。

## 优化

reducer 是一个纯函数，故不能有副作用。

- 搭配 immutable，优化 reducer 。
- reselect 优化 mapStateToProps 。

## API

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

### react-redux

- Provider 提供子组件可访问 store 能力。
- connect 连接 React 组件与 Redux store。

connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])

- mapStateToProps 将 store 中的 state 映射到组件的 props 里
- mapDispatchToProps 将 store 中的 dispatch 映射到组件的 props 里(一般配合 redux 的 bindActionCreators 直接把绑定了 dispath 的 action 映射到组件中)
- mergeProps(stateProps, dispatchProps, ownProps) 如果指定了这个参数，mapStateToProps() 与 mapDispatchToProps() 的执行结果和组件自身的 props 将传入到这个回调函数中。该回调函数返回的对象将作为 props 传递到被包装的组件中。你也许可以用这个回调函数，根据组件的 props 来筛选部分的 state 数据，或者把 props 中的某个特定变量与 action creator 绑定在一起。如果你省略这个参数，默认情况下返回 Object.assign({}, ownProps, stateProps, dispatchProps) 的结果。
- [options](Object) 如果指定这个参数，可以定制 connector 的行为。
  - [pure = true](Boolean): 如果为 true，connector 将执行 shouldComponentUpdate 并且浅对比 mergeProps 的结果，避免不必要的更新，前提是当前组件是一个“纯”组件，它不依赖于任何的输入或 state 而只依赖于 props 和 Redux store 的 state。默认值为 true。
  - [withRef = false](Boolean): 如果为 true，connector 会保存一个对被包装组件实例的引用，该引用通过 getWrappedInstance() 方法获得。默认值为 false。
