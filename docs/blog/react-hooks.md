# 使用 React Hooks 节省 90% 的代码

Hook 是一项新功能提案，可让您在不编写类的情况下使用 state 和其他 React 功能，目前存在于React v16.7.0-alpha版本中。`据说使用 hook 重构后可以优化 90%的代码。`

## React 编写组件的 3 种方法

1、React.createClass()

适用于 es5 写法，不推荐使用。

2、 extends React.Component

class 定义的组件能够使用 React 给我们提供的所有生命周期，也提供了 PureComponent 优化渲染性能。

3、函数式定义的 function 组件（16.7 以前）

- 组件不会被实例化，整体渲染性能得到提升
- 组件不能访问 this 对象
- 组件无法访问生命周期的方法
- 无状态组件只能访问输入的 props，同样的 props 会得到同样的渲染结果，不会有副作用

在 React16.7 以后，React 为 function 组件增加了很多功能：

- 引入 state 概念
- 引入生命周期概念
- 引入 pureComponent 概念

可以这么理解，在 React16.7 之后，function 会逐渐替换掉 class 定义的组件，成为官方推荐的组件编写方法。

## 使用 State

在 function 组件中使用 State。

```js
import { useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

## 使用 Effect

在 function 组件中绑定生命周期：componentDidMount，componentDidUpdate 以及 componentWillUnmount。

```js
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // componentDidMount and componentDidUpdate生命周期
  useEffect(
    () => {
      document.title = `You clicked ${count} times`;
      // componentWillUnmount 生命周期
      return () => {
        console.log('componentWillUnmount');
      };
      // 第2个参数，相当于设置shouldComponentUpdate，仅当count改变，才会触发Effect
    },
    [count]
  );

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

## 使用 Context

使用 class 定义的组件，在使用 context 时，代码是这样的：

- 先使用 Provider 包裹起来
- 然后使用 Consumer 去绑定数据

```js
import React from 'react';
const ThemeContext = React.createContext('light');

// 子组件
class Child extends React.Component {
  render() {
    return (
      <div>
        <ThemeContext.Provider value="light">
          <ThemeContext.Consumer>
            {theme => <div>当前主题: {theme}</div>}
          </ThemeContext.Consumer>
        </ThemeContext.Provider>
      </div>
    );
  }
}
```

如果换成 useContext 语法，则会非常简单：

```js
import { useContext } from 'react';
function Example() {
  const theme = useContext(ThemeContext);
  return <div>当前主题:{theme}</div>;
}
```

## 自定义 Hook

自定义 Hook 是一个 JavaScript 函数，其名称以`use`开头，可以调用其他 Hook。

```js
// 模拟loading 3秒后，显示Online效果
import { useState, useEffect } from 'react';

function useFriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status);
  }

  setTimeout(() => {
    setIsOnline(true);
  }, 3000);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}

// 在另一个组件中使用
function Example() {
  // 自定义hook就是一个函数，直接嵌套使用。
  const isOnline = useFriendStatus();
  return <p>{isOnline}</p>;
}
```

## 总结

随着 16.7 版本的发布，React function 组件得到了很多的发展，不仅节约了代码量，也优化了渲染速度，以后必会成为官方推荐的创建组件方法。

---

参考资料

[Introducing Hooks](https://reactjs.org/docs/hooks-intro.html)

[React Today and Tomorrow and 90% Cleaner React](https://www.youtube.com/watch?v=dpw9EHDh2bM)
