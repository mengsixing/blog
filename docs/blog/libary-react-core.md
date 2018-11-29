# React 核心知识

## Time slicing

We've built a generic way to ensure that high-priority updates like user input don't get blocked by rendering low-priority updates.

CPU 层面优化

ReactJS 关注设备的 CPU 能力。在渲染时，ReactJS 确保它不会阻塞线程，从而导致应用程序冻结。

时间分片允许现在在 React Fiber 上运行的 ReactJS 在空闲回调期间将子组件的更新计算分成块，并且渲染工作分布在多个帧上。现在，在异步呈现过程中，它确保如果用户的设备非常快，应用程序内的更新会感觉同步，如果用户的设备很慢，则应用程序会感觉响应。没有冻结，没有 janky UI 体验！

## Suspense

We have built a generic way for components to suspend rendering while they load asynchronous data.

Suspense 的简单定义是 ReactJS 可以暂停任何状态更新，直到提取的数据准备好呈现。本质上，ReactJS 在等待完全获取数据的同时挂起组件树。在暂停期间，它继续处理其他高优先级更新。
