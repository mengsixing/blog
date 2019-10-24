# React Hooks 替代 React-Redux

随着 React Hooks 的发布，React 生态圈正在掀起一场框架的变革，一些老的框架纷纷进行的 Hooks 的支持。

生态圈变化比较大的是状态管理神器 Redux 以及配套使用的 React-Redux。因为 Hooks 内置了一套状态管理机制，即可不必使用外部的状态管理机制了。这一章我们就用 hooks 来实现一套状态管理。

- react-redux 原理
- react-redux hooks 版本实现

## React-Redux 原理

首先我们需要了解一下 Redux-React 状态管理的原理。Redux-React 核心 API 如下。

- context
- provider
- connect

### Context

Context 是 React 自带的 API，提供了一种通过组件树传递数据的方法，可以跨组件层级进行数据传递。

例如：创建一个 context 对象。

```js
// Context.js
import React from 'react';
const ReactReduxContext = React.createContext();
export default ReactReduxContext;
```

### Provider

Provider 组件，通过 Context API，为子组件注入 Store，并对 Store 进行监听，一旦 Store 改变，就会重新渲染 Provider 组件，从而渲染 Provider 下的所有子组件。

```js
// Provider.js
import React from 'react';
import { ReactReduxContext } from './Context';

class Provider extends React.Component {
  constructor(props) {
    super(props);
    const { store } = props;
    this.state = {
      storeState: store.getState(),
      store
    };
  }

  // 调用源生 redux 的事件监听函数
  componentDidMount() {
    this.subscribe();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  componentDidUpdate(prevProps) {
    this.subscribe();
  }

  subscribe() {
    // store 通过 redux.createStore() 创建
    const { store } = this.props;

    // 监听 store 更新
    this.unsubscribe = store.subscribe(() => {
      const newStoreState = store.getState();

      this.setState(providerState => {
        return { storeState: newStoreState };
      });
    });

    // 如果 store 不一致，调用 setState 重新渲染
    if (store.getState() !== this.state.storeState) {
      this.setState({ storeState: postMountStoreState });
    }
  }

  render() {
    return (
      <ReactReduxContext.Provider value={this.state}>
        {this.props.children}
      </ReactReduxContext.Provider>
    );
  }
}
```

### Connect

Connect 也是通过 Context API，负责将 Store 数据传递到需要的组件中，通过 mapStateToProps 和 mapDispatchToProps 方法，将 Store 中的数据通过属性的方式入到组件中。

```js
import React from 'react';
import { ReactReduxContext } from './Context';

const connect = (mapStateToProps, mapDispatchToProps) => WrappedComponent => {
  class HOC extends React.Component {
    render() {
      return (
        <ReactReduxContext.Consumer>
          {({ store }) => {
            // mapStateToProps，传递源生 redux store
            let stateProps = mapStateToProps(store.getState());
            // mapDispatchToProps
            let dispatchProps = mapDispatchToProps(store.dispatch, this.props);
            return <WrappedComponent {...stateProps} {...dispatchProps} />;
          }}
        </ReactReduxContext.Consumer>
      );
    }
  }
  return HOC;
};
```

至此，React-Redux 就简单实现了。

## React Hooks 实现 React-Redux

在最新的 React hooks 版本中，我们可以更简单的实现一个 React-Redux，并且不需要引入 Redux。

源生 Redux 中的基本方法如下，省去了 applyMiddleware 方法，在 createStore 方法中直接实现。

- compose
- createStore
- combineReducers
- bindActionCreators

### Compose

Compose 用来实现函数组合，是函数式编程中很重要的概念，可以用来组合多个 Redux 中间件方法。

```js
function compose(...fns) {
  if (fns.length === 0) {
    return a => a;
  }
  if (fns.length === 1) {
    return fns[0];
  }

  var fn = fns.reduce((a, b) => {
    return (...args) => {
      return a(b(...args));
    };
  });
  return fn;
}
```

### CreateStore

CreateStore 实现创建 Store，提供 Provider，以及中间件的处理。

#### 创建 Store

首先创建一个 Store，提供给外部访问。

```js
function createStore(reducer, initialState, middlewares) {
  const store = {
    _state: initialState,
    getState: () => {
      return store._state;
    }
  };

  return {
    store
  };
}
```

#### 增加 Provider

然后，需要提供一个 Provider，让其他组件能够使用创建好的 Store。

通过 React useContext API 创建 Provider，创建完成之后，被包裹的组件就能通过 useContext 来访问 Store 了。

```js
import React from 'react';
const { useContext, createContext, useReducer } = React;

function createStore(reducer, initialState, middlewares) {
  const storeContext = createContext();
  const store = {
    _state: initialState,
    getState: () => {
      return store._state;
    }
  };

  const Provider = props => {
    return <storeContext.Provider {...props} value={store._state} />;
  };

  return {
    store,
    Provider
  };
}
```

#### 提供 Dispatch

到目前为止，我们只提供了访问 Store 的方法，如果需要对 Store 进行更新，则需要提供一个 Dispatch 方法。

React 提供了 useReducer hooks，可以很方便的提供 Dispath 方法，对一个对象进行操作。

```js
import React from 'react';
const { useContext, createContext, useReducer } = React;

function createStore(reducer, initialState, middlewares) {
  const storeContext = createContext();

  const store = {
    _state: initialState,
    getState: () => {
      return store._state;
    },
    useContext: () => {
      return useContext(storeContext);
    },
    dispatch: undefined
  };

  const Provider = props => {
    const [state, dispatch] = useReducer(reducer, store._state);

    // 实现异步操作，可以 dispatch 一个 function，类似 redux-chunk
    store.dispatch = async action => {
      if (typeof action === 'function') {
        await action(dispatch, state);
      } else {
        dispatch(action);
      }
    };

    // 重置 store 中的数据
    store._state = state;

    return <storeContext.Provider {...props} value={state} />;
  };

  return {
    Provider,
    store
  };
}
```

设置好 Dispatch，整个项目流程就通了，接下来我们进行中间件的扩展。

#### 处理中间件

在 Redux 中，中间件其实是对 Dispatch 方法的增强，所以我们只需要改造一下 Dispatch 方法即可。

这里用到了函数组合 Compose，将中间件集合组合在一起。

```js
const Provider = props => {
  const [state, dispatch] = useReducer(reducer, store._state);

  store.dispatch = async action => {
    if (typeof action === 'function') {
      await action(dispatch, state);
    } else {
      dispatch(action);
    }
  };

  // 整合中间件
  var chain = middlewares.map(item => item(store));
  var middlewaresFun = compose(...chain);
  store.dispatch = middlewaresFun(store.dispatch);

  // 重置 store 中的数据
  store._state = state;

  return <storeContext.Provider {...props} value={state} />;
};
```

至此，整个 react-redux 的逻辑都已经实现了，附上一张流程图。

![library-redux-code-flow.png](library-redux-code-flow.png)

### CombineReducers

别忘了，Redux 中还提供了 CombineReducers 方法，方便整合多个 reducer，实现方法和 Redux 源生方法一致，直接复用即可。

```js
function combineReducers(reducers) {
  return function(state = {}, action) {
    let newState = {};
    Object.keys(reducers).map(key => {
      const reducer = reducers[key];
      newState[key] = reducer(state[key], action);
    });
    return newState;
  };
}
```

### bindActionCreators

当然，还有 BindActionCreators 方法，用来给 ActionCreater 绑定 Dispatch，该方法也和 Redux 源生方法一致，直接复用即可。

```js
function bindActionCreator(actionCreator, dispatch) {
  return (...arg) => {
    return dispatch(actionCreator.call(this, ...arg));
  };
}

function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  var actionCreatorKeys = Object.keys(actionCreators);
  var result = {};
  actionCreatorKeys.map(key => {
    result[key] = bindActionCreator(actionCreators[key], dispatch);
  });
  return result;
}
```

## 总结

我们用了差不多 50 行代码，实现了 React-Redux 的逻辑。

- Context API
  - useContext 返回的对象中提供了一个 Provider，替代 React-Redux 的 provider。
  - 子组件中使用 useContext，可以直接获取到 Store 中的数据，不需要 Conenct 方法进行注入。
- useReducer Hooks
  - useReducer 提供了一个套通过 Reducer 规则改变 State 的处理逻辑，可以替代 Redux 中的 Reducer。
  - useReducer 还提供了 Dispatch 方法，替代 Redux Store 中的 Dispatch。
  - 当调用 Dispatch 更新 Store 时，Provider 中的 Value 就会相应改变，从而触发 Provider 子组件更新，替代了 Redux 中的 Subscribe 事件监听。

我们再来拆解一下 Redux 和 React-Redux 的 API。

- Redux
  - createStore 实现
  - applyMiddleware 实现
  - bindActionCreators (复用 Redux)
  - combineReducers (复用 Redux)
- React-Redux
  - provider 实现
  - connect 不需要

本文代码仓库：[https://github.com/lmjben/react-redux](https://github.com/lmjben/react-redux)
