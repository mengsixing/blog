# RxJS 基础知识总结

对于 RxJS 一直都是比较感兴趣，但是却没有很深入地去研究，这一节先介绍一下基础知识，以后再深入学习。

## Observable

Observable (可观察对象): 表示一个概念，这个概念是一个可调用的未来值或事件的集合。

Observables 是使用 Rx.Observable.create 或创建操作符创建的，并使用观察者来订阅它，然后执行它并发送 next / error / complete 通知给观察者，而且执行可能会被清理。这四个方面全部编码在 Observables 实例中。

Observable 的核心关注点：

- 创建 Observables
- 订阅 Observables
- 执行 Observables
- 清理 Observables

## Observer

Observer (观察者): 一个回调函数的集合，它知道如何去监听由 Observable 提供的值。

观察者是由 Observable 发送的值的消费者。观察者只是一组回调函数的集合，每个回调函数对应一种 Observable 发送的通知类型：next、error 和 complete 。

## Subscription

Subscription (订阅): 表示 Observable 的执行，主要用于取消 Observable 的执行。

Subscription 是表示可清理资源的对象，通常是 Observable 的执行。Subscription 有一个重要的方法，即 unsubscribe，它不需要任何参数，只是用来清理由 Subscription 占用的资源。

## Operators

操作符是 Observable 类型上的方法，比如 .map(...)、.filter(...)、.merge(...)，等等。当操作符被调用时，它们不会改变已经存在的 Observable 实例。相反，它们返回一个新的 Observable ，它的 subscription 逻辑基于第一个 Observable 。

:::tip
操作符是函数，它基于当前的 Observable 创建一个新的 Observable。这是一个无副作用的操作：前面的 Observable 保持不变。

操作符是采用函数式编程风格的纯函数 (pure function)，使用像 map、filter、concat、flatMap 等这样的操作符来处理集合。
:::

## Subject

Subject (主体): 相当于 EventEmitter，并且是将值或事件多路推送给多个 Observer 的唯一方式。

RxJS Subject 是一种特殊类型的 Observable，它允许将值多播给多个观察者，所以 Subject 是多播的，而普通的 Observables 是单播的(每个已订阅的观察者都拥有 Observable 的独立执行)。

变种：

BehaviorSubject：Subject 的其中一个变体就是 BehaviorSubject，它有一个“当前值”的概念。它保存了发送给消费者的最新值。并且当有新的观察者订阅时，会立即从 BehaviorSubject 那接收到“当前值”。

ReplaySubject： 类似于 BehaviorSubject，它可以发送旧值给新的订阅者，但它还可以记录 Observable 执行的一部分。

AsyncSubject： 只有当 Observable 执行完成时(执行 complete())，它才会将执行的最后一个值发送给观察者。

## Schedulers

Schedulers (调度器): 用来控制并发并且是中央集权的调度员，允许我们在发生计算时进行协调，例如 setTimeout 或 requestAnimationFrame 或其他。

调度器控制着何时启动 subscription 和何时发送通知。它由三部分组成：

- 调度器是一种数据结构。 它知道如何根据优先级或其他标准来存储任务和将任务进行排序。
- 调度器是执行上下文。 它表示在何时何地执行任务(举例来说，立即的，或另一种回调函数机制(比如 setTimeout 或 process.nextTick)，或动画帧)。
- 调度器有一个(虚拟的)时钟。 调度器功能通过它的 getter 方法 now() 提供了“时间”的概念。在具体调度器上安排的任务将严格遵循该时钟所表示的时间。
- 调度器可以让你规定 Observable 在什么样的执行上下文中发送通知给它的观察者。

| 调度器             | 目的                                                                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rx.Scheduler.queue | 当前事件帧中的队列调度(蹦床调度器)。用于迭代操作。                                                                                                      |
| Rx.Scheduler.asap  | 微任务的队列调度，它使用可用的最快速的传输机制，比如 Node.js 的 process.nextTick() 或 Web Worker 的 MessageChannel 或 setTimeout 或其他。用于异步转换。 |
| Rx.Scheduler.async | 使用 setInterval 的调度。用于基于时间的操作符。                                                                                                         |

## 小示例

```javascript
//第一步，创建一个可观察对象（也可以通过fromEvent...）
var observable = Rx.Observable.create(function(observer) {
  observer.next('first');
  setInterval(function() {
    observer.next('5');
  }, 1000);
  setTimeout(function() {
    throw new Error('错误');
  }, 3000);
  setTimeout(function() {
    observer.complete('6');
  }, 6000);
})
  .map(e => e.bold()) // 使用操作符过滤观察流
  .observeOn(Rx.Scheduler.async); //让流变为异步

var subject = new Rx.Subject();

//增加两个监听函数
var observer1 = e => {
  console.log(e);
};
var observer2 = e => {
  console.log('监听2');
};

//未使用subject传播
// var subscription1 = observable.subscribe(observer1);
// var subscription2 = observable.subscribe(observer2);

//使用subject多播给多个观察者
var subscription1 = subject.subscribe(observer1);
var subscription2 = subject.subscribe(observer2);
observable.subscribe(subject);

console.log('waibu');

//增加取消监听
setTimeout(function() {
  subscription1.unsubscribe();
  subscription2.unsubscribe();
}, 1500);
```
