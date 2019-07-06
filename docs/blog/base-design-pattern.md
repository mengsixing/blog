# 设计模式

设计模式是一套被反复使用、多数人知晓的、经过分类的、代码设计经验的总结。

使用设计模式的目的：为了代码的可重用性、让代码更容易被他人理解、保证代码的可靠性。设计模式使代码编写真正的工程化。设计模式是软件工程的基石脉络，如同大厦的结构一样。

## 设计模式分类

- 创建型，研究高效的创建对象
  - 单例模式
  - 抽象工厂模式
  - 建造者模式
  - 工厂模式
  - 原型模式
- 结构型，设计对象和结构之间的关系
  - 适配器模式
  - 桥接模式
  - 装饰模式
  - 组合模式
  - 外观模式
  - 享元模式
  - 代理模式
- 行为型，设计对象的行为
  - 模板方法模式
  - 命令模式
  - 迭代器模式
  - 观察者模式
  - 中介者模式
  - 备忘录模式
  - 解释器模式
  - 状态模式
  - 策略模式
  - 职责链模式
  - 访问者模式

## 单例模式

保证一个类只有一个实例，并提供一个访问它的全局访问点。

```js
// 示例1，单例 Person 类
var Person = (function() {
  var instance;
  return function(name) {
    if (instance) {
      return instance;
    } else {
      this.name = name;
      instance = this;
    }
  };
})();

var p1 = new Person('张三');

Person.prototype.say = function() {
  console.log('hello');
};

var p2 = new Person();

console.log(p1.name, p2.name);

// 示例2：操作页面dom
function singlePattern(id) {
  var cacheDom;
  return function() {
    if (cacheDom) {
      return cacheDom;
    } else {
      var dom = document.getElementById(id);
      cacheDom = dom;
      return dom;
    }
  };
}

// 公用的单例函数，缓存函数执行结果。
function getSingle(fn) {
  var result = null;
  return function() {
    if (!result) {
      result = fn.apply(this, arguments);
    }
    return result;
  };
}
```

## 简单工厂模式

工厂模式定义创建对象的接口，但是让子类去真正的实例化。也就是说工厂方法将类的实例化延迟到了子类。

```js
class Man {
  constructor(name) {
    this.name = name;
  }
  alertName() {
    alert(this.name);
  }
}

class Factory {
  static create(name) {
    return new Man(name);
  }
}

Factory.create('Jack').alertName();
```

如例子所示，创建 Man 对象的过程可能很复杂，但我们**只需要关心创建结果**。

## 建造者模式

将一个复杂对象的构建层与其表示层相互分离，同样的构建过程可采用不同的表示。

> 参与创建的具体过程

## 原型模式

用原型实例指向创建对象的类，使用于创建新的对象的类共享原型对象的属性以及方法。

> 类似原型继承 prototype

## 外观模式

为一组复杂的子系统接口提供一个更高级的统一接口，通过这个接口使得对子系统接口的访问更加容易。

```js
function addEvent(elm, evType, fn, useCapture) {
  if (elm.addEventListener) {
    elm.addEventListener(evType, fn, useCapture);
    return true;
  } else if (elm.attachEvent) {
    var r = elm.attachEvent('on' + evType, fn);
    return r;
  } else {
    elm['on' + evType] = fn;
  }
}
```

> 在 js 中有时候会用于对底层结构兼容性做统一的封装来简化用户的使用。例如：兼容 addEventListener attachEvent。

## 适配器模式

将一个类的接口转化为另外一个接口，以满足用户需求，使类之间接口不兼容问题通过适配器得以解决。

```js
class Plug {
  getName() {
    return '港版插头';
  }
}

class Target {
  constructor() {
    this.plug = new Plug();
  }
  getName() {
    return this.plug.getName() + ' 适配器转二脚插头';
  }
}

let target = new Target();
target.getName(); // 港版插头 适配器转二脚插头
```

可以用来适配对象，适配代码库，适配数据等。

## 代理模式

为一个对象提供一种代理以控制对这个对象的访问。

- 虚拟代理，把一些开销很大的对象，延迟到真正需要它的时候才去创建执行。
- 安全代理，控制真实对象的访问权限。
- 远程代理，一个对象将不同孔家的对象进行局部代理。
- 智能代理，调用对象代理处理另外一些事情如垃圾回收机制增加额外的服务。

```html
<ul id="ul">
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
  <li>5</li>
</ul>
<script>
  let ul = document.querySelector('#ul');
  ul.addEventListener('click', event => {
    console.log(event.target);
  });
</script>
```

因为存在太多的 li，不可能每个都去绑定事件。这时候可以通过给父节点绑定一个事件，让父节点作为代理去拿到真实点击的节点。

## 装饰器模式

在不改变原对象的基础上，通过对其进行包装扩展（添加属性或方法）使原有对象可以满足用户的更复杂需求。

```js
function readonly(target, key, descriptor) {
  descriptor.writable = false;
  return descriptor;
}

class Test {
  @readonly
  name = 'Jack';
}

let t = new Test();

t.Jack = '111'; // 不可修改
```

例如：增加属性，扩展原方法，高阶组件等。

## 桥接模式

桥接模式（Bridge）将抽象部分与它的实现部分分离，使它们都可以独立地变化。

> 一个实现未必不变地绑定在一个接口上，抽象类（函数）的实现可以在运行时刻进行配置，一个对象甚至可以在运行时刻改变它的实现，同将抽象和实现也进行了充分的解耦，也有利于分层，从而产生更好的结构化系统。主要用于解耦。

## 组合模式

又称部分-整体模式，想对象组合成树形结构以表示“部分-整体”的层次结构，组合模式使得用户对单个对象和组合对象的使用具有一致性。

> 组合模式通过继承同一父类，使其具有统一的方法，便于统一管理和使用，结构清晰。

## 享元模式

运用共享技术有效的支持大量的细粒度对象，避免对象间拥有相同内容造成多余开销。

> 例如：性能优化，分页显示，只需操作一页的 DOM。

## 模板方法模式

父类中定义一组操作算法骨架，而将一些实现步骤延迟到了子类中，使得子类可以不改变父类的算法结构的同事可更新定义算法中某些实现步骤。

> 类似后端的 Interface

## 观察者模式

又被称为发布——订阅者模式，定义了一种依赖关系，解决了主题对象与观察者之间功能的耦合。

```js
var Observer = (function() {
  var _message = {};
  return {
    subscribe(type, fn) {
      if (_message[type]) {
        _message[type].push(fn);
      } else {
        _message[type] = [fn];
      }
    },
    publish(type, ...args) {
      if (!_message[type]) {
        return;
      }
      _message[type].forEach(item => {
        item.apply(this, args);
      });
    },
    unsubscribe(type, fn) {
      // fn不传，清楚type上所有的订阅，否则只清除传递的订阅
      if (!_message[type]) {
        return;
      }
      if (fn) {
        _message[type].forEach(function(item, index) {
          item === fn && _message[type].splice(index, 1);
        });
      } else {
        _message[type] = null;
      }
    }
  };
})();
```

> 解决类和对象之间的耦合，解耦 2 个相互依赖的对象，使其依赖于观察者的消息机制。

## 状态模式

当一个对象的内部状态发生改变时，会导致其行为的改变，这看起来像是改变了对象。

> 解决程序中臃肿的分支判断语句问题，将每一个分支转化为一种状态独立出来。

## 策略模式

将定义的一组算法封装起来，使其相互之间可以替换，封装的算法具有一定的独立性，不会随客户端变化而变化。

> 每组算法处理的业务是相同的。

## 职责链模式

解决请求的发送者与请求的接受者之间的耦合，通过职责链的多个对象分解请求流程，实现请求在多个对象之间的传递，直到最后一个对象完成请求的处理。

> 需求拆解，每个模块功能单一，依次执行模块。

## 命令模式

将请求与实现解耦并封装成独立的对象，从而使不同的请求对客户端的实现参数化。

> 解耦，命令发起者和执行者。

## 访问者模式

针对于对象结构中的元素，定义在不改变该对象的前提下，访问结构中元素的新方法。

> 解决数据与数据操作方法之间的耦合，将数据的操作方法独立于数据，使其可以自由化演变。

## 中介者模式

通过中介者对象封装一系列对象之间的交互，是对象之间不再相互引用，降低他们之间的耦合，有时中介者对象也可以改变对象之间的交互。

> 类似于观察者模式，但是单向的，由中介者统一管理。

## 备忘录模式

在不破坏对象的封装性的前提下，在对象之外捕获并保存该对象内部的状态，以便日后对象使用或者对象恢复到之前的某个状态。

> 分页加载，对已加载的页进行缓存。

## 迭代器模式

在不暴露对象内部结构的同时，可以顺序地访问聚合对象内部的元素。

> 隐形地将循环语句移到了迭代器中。

## 解释器模式

对于一种语言，给出其文法表示形式，并定义一种解释器，通过使用这种解释器，来解释语言中定义的句子。

> 解析 dom 树 html>head|body>button。

## 装饰模式

装饰模式不需要改变已有的接口，作用是给对象添加功能。就像我们经常需要给手机戴个保护套防摔一样，不改变手机自身，给手机添加了保护套提供防摔功能。

```js
function readonly(target, key, descriptor) {
  descriptor.writable = false;
  return descriptor;
}

class Test {
  @readonly
  name = 'yhl';
}

let t = new Test();

t.yhl = '111'; // 不可修改
```

## 数据访问对象模式

抽象和封装对数据源的访问和存储，DAO 通过对象数据源链接的管理，方便对数据的访问和存储。

> 封装操作数据库层 DAO。

## MVC 模式

传统的 MVC 架构通常是使用控制器更新模型，视图从模型中获取数据去渲染。当用户有输入时，会通过控制器去更新模型，并且通知视图进行更新。但是 MVC 有一个巨大的缺陷就是控制器承担的责任太大了，随着项目愈加复杂，控制器中的代码会越来越臃肿，导致出现不利于维护的情况。

view->controller->model->view

![MVC模式](base-design-pattren-mvc.png)

## MVP 模式

在 MVP 中，View 自己实现如何进行视图更新的实现细节，并抽象出一层视图接口，而 Presenter 在 Model 更新后，通过调用这些接口来实现 View 的更新。同时 Presenter 也向 View 注册相关的需要 Presenter 来决定的视图事件。

view->presenter->model->presenter->view

> MVP 与 MVC 有着一个重大的区别：在 MVP 中 View 并不直接使用 Model，它们之间的通信是通过 Presenter (MVC 中的 Controller)来进行的，所有的交互都发生在 Presenter 内部，而在 MVC 中 View 会直接从 Model 中读取数据而不是通过 Controller。

mvp 和 mvvm 很像，**数据流是一致的**，只是 mvvm 实现了双向绑定，而 **mvp 需要手动绑定**。

![MVP模式](base-design-pattren-mvp.png)

## MVVM 模式

在 MVVM 架构中，引入了 ViewModel 的概念。ViewModel 只关心数据和业务的处理，不关心 View 如何处理数据，在这种情况下，View 和 Model 都可以独立出来，任何一方改变了也不一定需要改变另一方，并且可以将一些可复用的逻辑放在一个 ViewModel 中，让多个 View 复用这个 ViewModel。

以 Vue 框架来举例，ViewModel 就是组件的实例。View 就是模板，Model 的话在引入 Vuex 的情况下是完全可以和组件分离的。对于 MVVM 来说，其实最重要的并不是通过双向绑定或者其他的方式将 View 与 ViewModel 绑定起来，而是通过 ViewModel 将视图中的状态和用户的行为分离出一个抽象，这才是 MVVM 的精髓。

view<->viewModel->model->viewModel<->view

> MVVM 模式将 Presenter 改名为 ViewModel，基本上与 MVP 模式完全一致。唯一的区别是，它采用双向绑定（data-binding）：View 的变动，自动反映在 ViewModel，反之亦然。

![MVVM模式](base-design-pattren-mvvm.png)
