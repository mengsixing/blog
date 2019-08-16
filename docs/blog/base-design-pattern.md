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
  - 外观模式
  - 适配器模式
  - 代理模式
  - 装饰器模式
  - 桥接模式
  - 组合模式
  - 享元模式
- 行为型，设计对象的行为
  - 模板方法模式
  - 观察者模式
  - 状态模式
  - 策略模式
  - 职责链模式
  - 命令模式
  - 访问者模式
  - 中介者模式
  - 备忘录模式
  - 迭代器模式
  - 解释器模式

## 创建型设计模式

### 单例模式

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

### 简单工厂模式

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

### 建造者模式

建造者模式是指将一个复杂的对象分解成多个简单的对象来进行构建，将复杂的构建层与表示层分离，使得相同的构建过程可以创建不同的表示。

案例：创建一个汽车。

```js
// 产品类：car 目前需要构建一辆车。
function car() {
  this.wheel = '';
  this.engine = '';
}

// 建造者类，里面有专门负责各个部分的工人
function carBuilder() {
  this.wheelBuilder = function() {
    this.wheel = '轮子';
  };
  this.engineBuilder = function() {
    this.engine = '发动机';
  };
  this.getCar = function() {
    var Car = new car();
    Car.wheel = this.wheel;
    Car.engine = this.engine;
    return Car;
  };
}

// 指挥者类，指挥各个部分的工人工作
function director() {
  this.action = function(builder) {
    builder.wheelBuilder();
    builder.engineBuilder();
  };
}

// 开始创建
var builder = new carBuilder();
var director = new director();
director.action(builder);
var Car = builder.getCar();
console.log(Car);
```

### 原型模式

原型模式是指用原型实例指向创建对象的类，使用于创建新的对象的类共享原型对象的属性以及方法。

```js
var someCar = {
  drive: function() {
    console.log('drive' + this.name);
  },
  name: '马自达 3'
};

// 使用 Object.create 创建一个新车 x
var anotherCar = Object.create(someCar); // anotherCar.__proto__ === someCar true
anotherCar.name = '丰田佳美';
anotherCar.drive();
```

## 结构型设计模式

### 外观模式

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

### 适配器模式

将一个类的接口转化为另外一个接口，以满足用户需求，使类之间接口不兼容问题通过适配器得以解决。

```js
class Duck {
  fly() {
    console.log('fly Duck');
  }
  quack() {
    console.log('gaga~');
  }
}

class Turkey {
  fly() {
    console.log('fly Turkey');
  }
  gobble() {
    console.log('gugu~');
  }
}

class TurkeyAdapter = {
  constructor(){
    super();
    this.turkey = Turkey.apply(this);
    this.quack = function(){
      this.turkey.gobble();
    }
  }
}

// 适配之后 TurkeyAdapter 和 Duck 拥有的方法名就保持一致了。
var duck = new Duck();
var turkey = new Turkey();
var turkeyAdapter = new TurkeyAdapter(turkey);

//原有的鸭子行为
duck.fly();
duck.quack();

//原有的火鸡行为
turkey.fly();
turkey.gobble();

// 适配器火鸡的行为（火鸡调用鸭子的方法名称）
turkeyAdapter.fly();
turkeyAdapter.quack();

```

可以用来适配对象，适配代码库，适配数据等。

### 代理模式

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

### 装饰器模式

在程序开发中，许多时候都并不希望某个类天生就非常庞大，一次性包含许多职责。那么我们就可以使用装饰者模式。装饰者模式可以动态地给某个对象添加一些额外的职责，而不会影响从这个类中派生的其他对象。

案例：ES6 中的装饰器就是一个典型的代表。

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

装饰者模式能够在不改变对象自身的基础上，在程序运行期间给对象动态地添加职责。跟继承相比，装饰者是一种更轻便灵活的做法，这是一种**即用即付**的方式，比如天冷了就多穿一件外套，天热了就扇扇子等。

### 桥接模式

桥接模式：在系统沿着多个维度变化的时候，不增加复杂度以达到解耦的目的。

在我们日常开发中，需要对相同的逻辑做抽象的处理。桥接模式就是为了解决这类的需求。

```js
//运动单元
class Speed {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  run() {
    console.log('动起来');
  }
}

// 着色单元
class Color {
  constructor(cl) {
    this.color = cl;
  }
  draw() {
    console.log('绘制色彩');
  }
}

//说话单元
class Speak {
  constructor(wd) {
    this.word = wd;
  }
  say() {
    console.log('请开始你的表演');
  }
}

//创建球类，并且它可以运动可以着色
class Ball {
  constructor(x, y, c) {
    this.speed = new Speed(x, y);
    this.color = new Color(c);
  }
  init() {
    //实现运动和着色
    this.speed.run();
    this.color.draw();
  }
}

class People {
  constructor(x, y, f) {
    this.speed = new Speed(x, y);
    this.speak = new Speak(f);
  }
  init() {
    this.speed.run();
    this.speak.say();
  }
}

// 当我们实例化一个人物对象的时候，他就可以有对应的方法实现了

var p = new People(10, 12, '我是一个人');
p.init();
var ball = new Ball(10, 12, 'red');
ball.init();
```

### 组合模式

组合模式就是用小的子对象来构建更大的对象，而这些小的子对象本身也许是由更小的孙对象构成的。

案例：扫描文件夹。

文件夹和文件之间的关系，非常适合用组合模式来描述。文件夹里既可以包含文件，又可以包含其他文件夹，最终可能组合成一棵树，组合模式在文件夹的应用中有以下两层好处。

```js
// folder 相关
var Folder = function(name) {
  this.name = name;
  this.files = [];
};
Folder.prototype.add = function(file) {
  this.files.push(file);
};

Folder.prototype.scan = function() {
  console.log('开始扫描文件夹: ' + this.name);
  for (var i = 0, file, files = this.files; (file = files[i++]); ) {
    file.scan();
  }
};

// file 相关
var File = function(name) {
  this.name = name;
};
File.prototype.scan = function() {
  console.log('开始扫描文件: ' + this.name);
};

// 创建数据
var folder = new Folder('学习资料');
var folder1 = new Folder('JavaScript');
var folder2 = new Folder('jQuery');
var file1 = new File('JavaScript 设计模式与开发实践');
var file2 = new File('精通 jQuery');
var file3 = new File('重构与模式');
folder1.add(file1);
folder2.add(file2);

folder.add(folder1);
folder.add(folder2);
folder.add(file3);

// 开始扫描
folder.scan();
```

运用了组合模式之后，扫描整个文件夹的操作也是轻而易举的，我们只需要操作树的最顶端对象。

### 享元模式

享元(flyweight)模式是一种用于性能优化的模式，“fly”在这里是苍蝇的意思，意为蝇量级。享元模式的核心是运用共享技术来有效支持大量细粒度的对象。

如果系统中因为创建了大量类似的对象而导致内存占用过高，享元模式就非常有用了。在 JavaScript 中，浏览器特别是移动端的浏览器分配的内存并不算多，如何节省内存就成了一件非常有意义的事情。

假设有个内衣工厂，目前的产品有 50 种男式内衣和 50 种女士内衣，为了推销产品，工厂决定生产一些塑料模特来穿上他们的内衣拍成广告照片。正常情况下需要 50 个男模特和 50 个女模特，然后让他们每人分别穿上一件内衣来拍照。仔细想想其实没必要用这么多人，只用 1 个男模特和 1 个女模特，让他们分别传上不同的内衣拍照就行了。

```js
var Model = function(sex) {
  this.sex = sex;
};
Model.prototype.takePhoto = function() {
  console.log('sex= ' + this.sex + ' underwear=' + this.underwear);
};
// 分别创建一个男模特对象和一个女模特对象:
var maleModel = new Model('male');
var femaleModel = new Model('female');

// 给男模特依次穿上所有的男装，并进行拍照:
for (var i = 1; i <= 50; i++) {
  maleModel.underwear = 'underwear' + i;
  maleModel.takePhoto();
}

// 同样，给女模特依次穿上所有的女装，并进行拍照:
for (var j = 1; j <= 50; j++) {
  femaleModel.underwear = 'underwear' + j;
  femaleModel.takePhoto();
}
```

其他案例：

- 数据分页显示，只需操作一页的 DOM，
- React 源码中 React.children.map 会创建一个 contextPool 来复用相似对象。

享元模式是为解决性能问题而生的模式，这跟大部分模式的诞生原因都不一样。在一个存在大量相似对象的系统中，享元模式可以很好地解决大量对象带来的性能问题。

## 行为型设计模式

### 模板方法模式

模板方法模式是一种只需使用继承就可以实现的非常简单的模式。

模板方法模式由两部分结构组成，第一部分是抽象父类，第二部分是具体的实现子类。通常在抽象父类中封装了子类的算法框架，包括实现一些公共方法以及封装子类中所有方法的执行顺序。子类通过继承这个抽象类，也继承了整个算法结构，并且可以选择重写父类的方法。

假如我们有一些平行的子类，各个子类之间有一些相同的行为，也有一些不同的行为。如果相同和不同的行为都混合在各个子类的实现中，说明这些相同的行为会在各个子类中重复出现。但实际上，相同的行为可以被搬移到另外一个单一的地方，模板方法模式就是为解决这个问题而生的。在模板方法模式中，子类实现中的相同部分被上移到父类中，而将不同的部分留待子类来实现。这也很好地体现了泛化的思想。

:::tip 咖啡与茶
泡咖啡步骤:

- 把水煮沸
- 用沸水冲泡咖啡
- 把咖啡倒进杯子
- 加糖和牛奶

泡茶步骤：

- 把水煮沸
- 用沸水浸泡茶叶
- 把茶水倒进杯子
- 加柠檬

分离出共同点：

- 原料不同。一个是咖啡，一个是茶，但我们可以把它们都抽象为“饮料”。
- 泡的方式不同。咖啡是冲泡，而茶叶是浸泡，我们可以把它们都抽象为“泡”。
- 加入的调料不同。一个是糖和牛奶，一个是柠檬，但我们可以把它们都抽象为“调料”。

最终抽象出如下步骤：

- 把水煮沸
- 用沸水冲泡饮料
- 把饮料倒进杯子
- 加调料

:::

具体的 js 代码如下

```js
// 抽象步骤
var Beverage = function(){};
Beverage.prototype.boilWater = function(){ console.log( '把水煮沸' );};
Beverage.prototype.brew = function(){};
Beverage.prototype.pourInCup = function(){};
Beverage.prototype.addCondiments = function(){};
Beverage.prototype.init = function(){ this.boilWater();
this.brew();
this.pourInCup(); this.addCondiments();

// 创建咖啡类
var Coffee = function(){};
Coffee.prototype = new Beverage();
Coffee.prototype.brew = function(){ console.log( '用沸水冲泡咖啡' );};
Coffee.prototype.pourInCup = function(){console.log( '把咖啡倒进杯子' );};
Coffee.prototype.addCondiments = function(){ console.log( '加糖和牛奶' );};
var Coffee = new Coffee();
Coffee.init();

var Tea = function(){};
Tea.prototype = new Beverage();
Tea.prototype.brew = function(){ console.log( '用沸水浸泡茶叶' );};
Coffee.prototype.pourInCup = function(){console.log( '把茶倒进杯子' );};
Coffee.prototype.addCondiments = function(){ console.log( '加柠檬' );};
var tea = new Tea();
tea.init();
```

在上面的例子中，到底谁才是所谓的模板方法呢?

答案是 Beverage.prototype.init。

Beverage.prototype.init 被称为模板方法的原因是，该方法中封装了子类的算法框架，它作为一个算法的模板，指导子类以何种顺序去执行哪些方法。在 Beverage.prototype.init 方法中，算法内的每一个步骤都清楚地展示在我们眼前。

### 观察者模式

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

### 状态模式

状态模式的关键是区分事物内部的状态，事物内部状态的改变往往会带来事物的行为改变。

案例：开关电灯问题。

```js
// OffLightState:
var OffLightState = function(light) {
  this.light = light;
};
OffLightState.prototype.buttonWasPressed = function() {
  console.log('弱光'); // offLightState 对应的行为
  this.light.setState(this.light.weakLightState);
};
// WeakLightState:
var WeakLightState = function(light) {
  this.light = light;
};
WeakLightState.prototype.buttonWasPressed = function() {
  console.log('强光'); // weakLightState 对应的行为
  this.light.setState(this.light.strongLightState);
};
// StrongLightState:
var StrongLightState = function(light) {
  this.light = light;
};
StrongLightState.prototype.buttonWasPressed = function() {
  console.log('关灯'); // strongLightState 对应的行为
  this.light.setState(this.light.offLightState); // 切换状态到 offLightState
};

var Light = function() {
  this.offLightState = new OffLightState(this);
  this.weakLightState = new WeakLightState(this);
  this.strongLightState = new StrongLightState(this);
  this.button = null;
};

Light.prototype.init = function() {
  var button = document.createElement('button');
  var self = this;

  this.button = document.body.appendChild(button);
  this.button.innerHTML = '开关';
  this.setState(this.offLightState);
  this.button.onclick = function() {
    self.currState.buttonWasPressed();
  };
};
// 设置当前状态
Light.prototype.setState = function(newState) {
  this.currState = newState;
};

var light = new Light();
light.init();
```

使用状态模式的好处很明显，它可以使每一种状态和它对应的行为之间的关系局部化，这些行为被分散和封装在各自对应的状态类之中，便于阅读和管理代码。

另外，状态之间的切换都被分布在状态类内部，这使得我们无需编写过多的 if、else 条件分支语言来控制状态之间的转换。

当我们需要为 light 对象增加一种新的状态时，只需要增加一个新的状态类，再稍稍改变一些现有的代码即可。

### 策略模式

策略模式的定义是：定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。

我们可以编写一个名为 calculateBonus 的函数来计算每个人的奖金数额。很显然， calculateBonus 函数要正确工作，就需要接收两个参数:员工的工资数额和他的绩效考核等级。 代码如下:

```js
var strategies = {
  S: function(salary) {
    return salary * 4;
  },
  A: function(salary) {
    return salary * 3;
  },
  B: function(salary) {
    return salary * 2;
  }
};

var calculateBonus = function(level, salary) {
  return strategies[level](salary);
};
console.log(calculateBonus('S', 20000)); // 输出:80000
console.log(calculateBonus('A', 10000)); // 输出:30000
```

### 职责链模式

职责链模式的定义是：使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。

具体实际相关的例子：如果早高峰能顺利挤上公交车的话，那么估计这一天都会过得很开心。因为公交车上人实在太多了，经常上车后却找不到售票员在哪，所以只好把两块钱硬币往前面递。除非你运气够好，站在你前面的第一个人就是售票员，否则，你的硬币通常要在 N 个人手上传递，才能最终到达售票员的手里。

我们很容易找到职责链模式的最大优点：请求发送者只需要知道链中的第一个节点，从而弱化了发送者和一组接收者之间的强联系。如果不使用职责链模式，那么在公交车上，我就得先搞清楚谁是售票员，才能把硬币递给他。

实战案例：

公司针对支付过定金的用户有一定的优惠政策。在正式购买后，已经支付过 500 元定金的用户会收到 100 元的商城优惠券，200 元定金的用户可以收到 50 元的优惠券，而之前没有支付定金 的用户只能进入普通购买模式，也就是没有优惠券，且在库存有限的情况下不一定保证能买到。

- orderType，表示订单类型(定金用户或者普通购买用户)，code 的值为 1 的时候是 500 元定金用户，为 2 的时候是 200 元定金用户，为 3 的时候是普通购买用户。
- pay，表示用户是否已经支付定金，值为 true 或者 false, 虽然用户已经下过 500 元定金的 订单，但如果他一直没有支付定金，现在只能降级进入普通购买模式。
- stock，表示当前用于普通购买的手机库存数量，已经支付过 500 元或者 200 元定金的用户不受此限制。

```js
var order500 = function(orderType, pay, stock) {
  if (orderType === 1 && pay === true) {
    console.log('500 元定金预购，得到 100 优惠券');
  } else {
    // 我不知道下一个节点是谁，反正把请求往后面传递
    return 'nextSuccessor';
  }
};

var order200 = function(orderType, pay, stock) {
  if (orderType === 2 && pay === true) {
    console.log('200 元定金预购，得到 50 优惠券');
  } else {
    // 我不知道下一个节点是谁，反正把请求往后面传递
    return 'nextSuccessor';
  }
};

var orderNormal = function(orderType, pay, stock) {
  if (stock > 0) {
    console.log('普通购买，无优惠券');
  } else {
    console.log('手机库存不足');
  }
};

// 封装职责链
var Chain = function(fn) {
  this.fn = fn;
  this.successor = null;
};
Chain.prototype.setNextSuccessor = function(successor) {
  return (this.successor = successor);
};

Chain.prototype.passRequest = function() {
  var ret = this.fn.apply(this, arguments);
  if (ret === 'nextSuccessor') {
    return (
      this.successor &&
      this.successor.passRequest.apply(this.successor, arguments)
    );
  }
  return ret;
};

// 现在我们把 3 个订单函数分别包装成职责链的节点
var chainOrder500 = new Chain(order500);
var chainOrder200 = new Chain(order200);
var chainOrderNormal = new Chain(orderNormal);

// 然后指定节点在职责链中的顺序:
chainOrder500.setNextSuccessor(chainOrder200);
chainOrder200.setNextSuccessor(chainOrderNormal);

// 最后把请求传递给第一个节点:
chainOrder500.passRequest(1, true, 500); // 输出:500 元定金预购，得到 100 优惠券
chainOrder500.passRequest(2, true, 500); // 输出:200 元定金预购，得到 50 优惠券
chainOrder500.passRequest(3, true, 500); // 输出:普通购买，无优惠券
chainOrder500.passRequest(1, false, 0); // 输出:手机库存不足
```

### 命令模式

命令模式是最简单和优雅的模式之一，命令模式中的命令(command)指的是一个执行某些特定事情的指令。

命令模式使用场景：有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道被请求的操作是什么，此时希望用一种松耦合的方式来设计软件，使得请求发送者和请求接收者能够消除彼此之间的耦合关系。

拿订餐来说，客人需要向厨师发送请求，但是完全不知道这些厨师的名字和联系方式，也不知道厨师炒菜的方式和步骤。 命令模式把客人订餐的请求封装成 command 对象，也就是订餐中的订单对象。这个对象可以在程序中被四处传递，就像订单可以从服务员手中传到厨师的手中。这样一来，客人不需要知道厨师的名字，从而解开了请求调用者和请求接收者之间的耦合关系。

另外，相对于过程化的请求调用，command 对象拥有更长的生命周期。对象的生命周期是跟初始请求无关的，因为这个请求已经被封装在了 command 对象的方法中，成为了这个对象的行为。我们可以在程序运行的任意时刻去调用这个方法，就像厨师可以在客人预定 1 个小时之后才帮他 炒菜，相当于程序在 1 个小时之后才开始执行 command 对象的方法。

除了这两点之外，命令模式还支持撤销、排队等操作。

案例：HTML5 版《街头霸王》游戏。

```html
<html>
  <body>
    <button id="replay">播放录像</button>
  </body>
  <script>
    // 定义一系列操作
    var Ryu = {
      attack: function() {
        console.log('攻击');
      },
      defense: function() {
        console.log('防御');
      },
      jump: function() {
        console.log('跳跃');
      },
      crouch: function() {
        console.log('蹲下');
      }
    };

    // 创建命令
    var makeCommand = function(receiver, state) {
      return function() {
        receiver[state]();
      };
    };
    var commands = {
      '119': 'jump', // W
      '115': 'crouch', // S
      '97': 'defense', // A
      '100': 'attack' // D
    };
    // 保存命令的堆栈
    var commandStack = [];
    document.onkeypress = function(ev) {
      var keyCode = ev.keyCode;
      var command = makeCommand(Ryu, commands[keyCode]);
      if (command) {
        command(); // 执行命令
        commandStack.push(command); // 将刚刚执行过的命令保存进堆栈
      }
    };

    // 点击播放录像
    document.getElementById('replay').onclick = function() {
      var command;
      // 从堆栈里依次取出命令并执行
      while ((command = commandStack.shift())) {
        command();
      }
    };
  </script>
</html>
```

可以看到，当我们在键盘上敲下 W、A、S、D 这几个键来完成一些动作之后，再按下 Replay 按钮，此时便会重复播放之前的动作。

### 访问者模式

访问者模式：针对于对象结构中的元素，定义在不改变对象的前提下访问结构中元素的方法。

在访问者模式中，主要包括下面几个角色

1、抽象访问者：抽象类或者接口，声明访问者可以访问哪些元素，具体到程序中就是 visit 方法中的参数定义哪些对象是可以被访问的。

2、访问者：实现抽象访问者所声明的方法，它影响到访问者访问到一个类后该干什么，要做什么事情。

3、抽象元素类：接口或者抽象类，声明接受哪一类访问者访问，程序上是通过 accept 方法中的参数来定义的。抽象元素一般有两类方法，一部分是本身的业务逻辑，另外就是允许接收哪类访问者来访问。

4、元素类：实现抽象元素类所声明的 accept 方法，通常都是 visitor.visit(this)，基本上已经形成一种定式了。

5、结构对象：一个元素的容器，一般包含一个容纳多个不同类、不同接口的容器，如 List、Set、Map 等，在项目中一般很少抽象出这个角色。

```js
// 访问者
function Visitor() {
  this.visit = function(concreteElement) {
    concreteElement.doSomething();
  };
}
// 元素类
function ConceteElement() {
  this.doSomething = function() {
    console.log('这是一个具体元素');
  };
  this.accept = function(visitor) {
    visitor.visit(this);
  };
}
// Client
var ele = new ConceteElement();
var v = new Visitor();
ele.accept(v);
```

### 中介者模式

中介者模式的作用就是解除对象与对象之间的紧耦合关系。增加一个中介者对象后，所有的相关对象都通过中介者对象来通信，而不是互相引用，所以当一个对象发生改变时，只需要通知中介者对象即可。

案例：泡泡堂游戏。

传统的双人对战中，可能出现 A 玩家内部引用 B 玩家，A 玩家胜利时，会调用 A.B.win 方法，通知 B 玩家获胜，但随着玩家不断增多，玩家之间的互相引用势必会造成大量引用，难以维护的问题。以下代码使用中介者模式解决了这个问题。

```js
function Player(name, teamColor) {
  this.name = name; // 角色名字 this.teamColor = teamColor; // 队伍颜色 this.state = 'alive'; // 玩家生存状态
}
Player.prototype.win = function() {
  console.log(this.name + ' won ');
};
Player.prototype.lose = function() {
  console.log(this.name + ' lost');
};

/*******************玩家死亡*****************/
Player.prototype.die = function() {
  this.state = 'dead';
  playerDirector.reciveMessage('playerDead', this);
};

var playerFactory = function(name, teamColor) {
  var newPlayer = new Player(name, teamColor); // 创造一个新的玩家对象
  playerDirector.reciveMessage('addPlayer', newPlayer); // 给中介者发送消息，新增玩家
  return newPlayer;
};

var playerDirector = (function() {
  var players = {}; // 保存所有玩家
  var operations = {}; // 中介者可以执行的操作

  /****************新增一个玩家***************************/
  operations.addPlayer = function(player) {
    var teamColor = player.teamColor; // 玩家的队伍颜色
    players[teamColor] = players[teamColor] || []; // 如果该颜色的玩家还没有成立队伍，则新成立一个队伍
    players[teamColor].push(player); // 添加玩家进队伍
  };

  operations.playerDead = function(player) {
    var teamColor = player.teamColor,
      teamPlayers = players[teamColor];
    var all_dead = true;
    // 玩家死亡 // 玩家所在队伍
    for (var i = 0, player; (player = teamPlayers[i++]); ) {
      if (player.state !== 'dead') {
        all_dead = false;
        break;
      }
    }
    if (all_dead === true) {
      // 全部死亡
      for (var i = 0, player; (player = teamPlayers[i++]); ) {
        player.lose(); // 本队所有玩家 lose
      }
      for (var color in players) {
        if (color !== teamColor) {
          var teamPlayers = players[color]; // 其他队伍的玩家
          for (var i = 0, player; (player = teamPlayers[i++]); ) {
            player.win(); // 其他队伍所有玩家win
          }
        }
      }
    }
  };

  var reciveMessage = function() {
    var message = Array.prototype.shift.call(arguments);
    operations[message].apply(this, arguments);
  };
  return {
    reciveMessage: reciveMessage
  };
})();
```

可以看到，除了中介者本身，没有一个玩家知道其他任何玩家的存在，玩家与玩家之间的耦合关系已经完全解除，某个玩家的任何操作都不需要通知其他玩家，而只需要给中介者发送一个消息，中介者处理完消息之后会把处理结果反馈给其他的玩家对象。我们还可以继续给中介者扩展更多功能，以适应游戏需求的不断变化。

### 备忘录模式

备忘录模式定义，在不破坏封装性的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态。这样就可以将该对象恢复到原先保存的状态。

案例：备忘录模式在 js 中经常用于数据缓存. 比如一个分页控件, 从服务器获得某一页的数据后可以存入缓存。以后再翻回这一页的时候，可以直接使用缓存里的数据而无需再次请求服务器。

```js
var Page = (function() {
  var page = 1,
    cache = {},
    data;
  return function(page) {
    if (cache[page]) {
      data = cache[page];
      render(data);
    } else {
      Ajax.send('cgi.xx.com/xxx', function(data) {
        cache[page] = data;
        render(data);
      });
    }
  };
})();
```

### 迭代器模式

迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。迭代器模式可以把迭代的过程从业务逻辑中分离出来，在使用迭代器模式之后，即使不关心对象的内部构造，也可以按顺序访问其中的每个元素。

目前，恐怕只有在一些“古董级”的语言中才会为实现一个迭代器模式而烦恼，现在流行的 大部分语言如 Java、Ruby 等都已经有了内置的迭代器实现，许多浏览器也支持 JavaScript 的 Array.prototype.forEach。

现在我们来自己实现一个 each 函数，each 函数接受 2 个参数，第一个为被循环的数组，第二个为循环中的每一步后将被触发的回调函数:

```js
// 定义迭代器
function each(ary, callback) {
  for (var i = 0, l = ary.length; i < l; i++) {
    callback.call(ary[i], i, ary[i]);
  }
}

// 使用迭代器遍历
each([1, 2, 3], function(i, n) {
  alert([i, n]);
});
```

### 解释器模式

解释器模式是指，对于一种语言，给出其文法表示形式，并定义一种解释器，通过使用这种解释器，来解释语言中定义的句子。

案例：解析 dom 树。

```js
// xPath解释器
var Interpreter = (function() {
  // 获取兄弟元素名称
  function getSulingName(node) {
    if (node.previousSibling) {
      var name = '',
        count = 1,
        nodeName = node.nodeName,
        sibling = node.previousSibling;
      while (sibling) {
        if (
          sibling.nodeType == 1 &&
          sibling.nodeType === node.nodeType &&
          sibling.nodeName
        ) {
          // 如果节点名称和前一个兄弟元素名称相同
          if (nodeName == sibling.nodeName) {
            name += ++count;
          } else {
            count = 1;
            name += '|' + sibling.nodeName.toUpperCase();
          }
        }
        sibling = sibling.previousSibling;
      }
      return name;
    } else {
      return '';
    }
  }
  return function(node, wrap) {
    var path = [],
      wrap = wrap || document;
    if (node == wrap) {
      if (wrap.nodeType == 1) {
        path.push(wrap.nodeName.toUpperCase());
      }
      return path;
    }
    if (node.parentNode !== wrap) {
      path = arguments.callee(node.parentNode, wrap);
    } else {
      if (wrap.nodeType == 1) {
        path.push(wrap.nodeName.toUpperCase());
      }
    }
    var sublingsNames = getSulingName(node);
    if (node.nodeType == 1) {
      path.push(node.nodeName.toUpperCase() + sublingsNames);
    }
    return path;
  };
})();
var path = Interpreter(document.getElementsByTagName('img')[0]);
// ["HTML", "BODY|HEAD", "DIV", "SECTION", "HEADER", "DIV", "DIV", "DIV", "A", "IMG"]
```

babel 中的 AST 解析器也是一个比较好的案例。

## 其他类型设计模式

### MVC 模式

传统的 MVC 架构通常是使用控制器更新模型，视图从模型中获取数据去渲染。当用户有输入时，会通过控制器去更新模型，并且通知视图进行更新。但是 MVC 有一个巨大的缺陷就是控制器承担的责任太大了，随着项目愈加复杂，控制器中的代码会越来越臃肿，导致出现不利于维护的情况。

view->controller->model->view

![MVC模式](base-design-pattren-mvc.png)

### MVP 模式

在 MVP 中，View 自己实现如何进行视图更新的实现细节，并抽象出一层视图接口，而 Presenter 在 Model 更新后，通过调用这些接口来实现 View 的更新。同时 Presenter 也向 View 注册相关的需要 Presenter 来决定的视图事件。

view->presenter->model->presenter->view

> MVP 与 MVC 有着一个重大的区别：在 MVP 中 View 并不直接使用 Model，它们之间的通信是通过 Presenter (MVC 中的 Controller)来进行的，所有的交互都发生在 Presenter 内部，而在 MVC 中 View 会直接从 Model 中读取数据而不是通过 Controller。

mvp 和 mvvm 很像，**数据流是一致的**，只是 mvvm 实现了双向绑定，而 **mvp 需要手动绑定**。

![MVP模式](base-design-pattren-mvp.png)

### MVVM 模式

在 MVVM 架构中，引入了 ViewModel 的概念。ViewModel 只关心数据和业务的处理，不关心 View 如何处理数据，在这种情况下，View 和 Model 都可以独立出来，任何一方改变了也不一定需要改变另一方，并且可以将一些可复用的逻辑放在一个 ViewModel 中，让多个 View 复用这个 ViewModel。

以 Vue 框架来举例，ViewModel 就是组件的实例。View 就是模板，Model 的话在引入 Vuex 的情况下是完全可以和组件分离的。对于 MVVM 来说，其实最重要的并不是通过双向绑定或者其他的方式将 View 与 ViewModel 绑定起来，而是通过 ViewModel 将视图中的状态和用户的行为分离出一个抽象，这才是 MVVM 的精髓。

view<->viewModel->model->viewModel<->view

> MVVM 模式将 Presenter 改名为 ViewModel，基本上与 MVP 模式完全一致。唯一的区别是，它采用双向绑定（data-binding）：View 的变动，自动反映在 ViewModel，反之亦然。

![MVVM模式](base-design-pattren-mvvm.png)
