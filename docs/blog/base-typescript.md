# Typescript 使用总结

最近这两年，有很多人都在讨论 Typescript，无论是社区还是各种文章都能看出来，整体来说正面的信息是大于负面的，这篇文章就来整理一下我所了解的 Typescript。

本文主要分为 3 个部分：

- Typescript 基本概念
- Typescript 高级用法
- Typescript 总结

## Typescript 基本概念

至于官网的定义，这里就不多做解释了，大家可以去官网查看。[Typescript 设计目标](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Design-Goals)

我理解的定义：赋予 Javascript 类型的概念，让代码可以在运行前就能发现问题。

### Typescript 都有哪些类型

1、Typescript 基本类型，也就是可以被直接使用的单一类型。

- 数字
- 字符串
- 布尔类型
- null
- undefined
- any
- unknown
- void
- object
- 枚举
- never

2、复合类型，包含多个单一类型的类型。

- 数组类型
- 元组类型
- 字面量类型
- 接口类型

3、如果一个类型不能满足要求怎么办？

- 可空类型，默认任何类型都可以被赋值成 null 或 undefined。
- 联合类型，不确定类型是哪个，但能提供几种选择，如：type1 | type2。
- 交叉类型，必须满足多个类型的组合，如：type1 & type2。

### 类型都在哪里使用

在 Typescript 中，类型通常在以下几种情况下使用。

- 变量中使用
- 类中使用
- 接口中使用
- 函数中使用

#### 类型在变量中使用

在变量中使用时，直接在变量后面加上类型即可。

```ts
let a: number;
let b: string;
let c: null;
let d: undefined;
let e: boolean;
let obj: Ixxx = {
  a: 1,
  b: 2
};
let fun: Iyyy = () => {};
```

#### 类型在类中使用

在类中使用方式和在变量中类似，只是提供了一些专门为类设计的静态属性、静态方法、成员属性、构造函数中的类型等。

```ts
class Greeter {
    static name:string = 'Greeter'
    static log(){console.log(‘log')}
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}
let greeter = new Greeter("world");
```

#### 类型在接口中使用

在接口中使用也比较简单，可以理解为组合多个单一类型。

```ts
interface IData {
  name: string;
  age: number;
  func: (s: string) => void;
}
```

#### 类型在函数中使用

在函数中使用类型时，主要用于处理函数参数、函数返回值。

```ts
// 函数参数
function a(all: string) {}
// 函数返回值
function a(a: string): string {}
// 可选参数
function a(a: number, b?: number) {}
```

## Typescript 高级用法

Typescript 中的基本用法非常简单，有 js 基础的同学很快就能上手，接下来我们分析一下 Typescript 中更高级的用法，以完成更精密的类型检查。

### 类中的高级用法

在类中的高级用法主要有以下几点：

- 继承
- 存储器 get set
- readonly 修饰符
- 公有，私有，受保护的修饰符
- 抽象类 abstract

继承和存储器和 ES6 里的功能是一致的，这里就不多说了，主要说一下类的修饰符和抽象类。

**类中的修饰符**是体现面向对象封装性的主要手段，类中的属性和方法在被不同修饰符修饰之后，就有了不同权限的划分，例如：

- public 表示在当前类、子类、实例中都能访问。
- protected 表示只能在当前类、子类中访问。
- private 表示只能在当前类访问。

```ts
class Animal {
  // 公有，私有，受保护的修饰符
  protected AnimalName: string;
  readonly age: number;
  static type: string;
  private _age: number;
  // 属性存储器
  get age(): number {
    return this._age;
  }
  set age(age: number) {
    this._age = age;
  }
  run() {
    console.log("run", this.AnimalName, this.age);
  }
  constructor(theName: string) {
    this.AnimalName = theName;
  }
}
Animal.type = "2"; // 静态属性
const dog = new Animal("dog");
dog.age = 2; // 给 readonly 属性赋值会报错
dog.AnimalName; // 实例中访问 protected 报错
dog.run; // 正常
```

在类中的继承也十分简单，和 ES6 的语法是一样的。

```ts
class Cat extends Animal {
  dump() {
    console.log(this.AnimalName);
  }
}
let cat = new Cat("catname");

cat.AnimalName; // 受保护的对象，报错
cat.run; // 正常
cat.age = 2; // 正常
```

在面向对象中，有一个比较重要的概念就是抽象类，抽象类用于类的抽象，可以定义一些类的公共属性、公共方法，让继承的子类去实现，也可以自己实现。

抽象类有以下两个特点。

- 抽象类不能直接实例化
- 抽象类中的抽象属性和方法，必须被子类实现

:::tip 经典问题：抽象类的接口的区别

- 抽象类要被子类继承，接口要被类实现。
  - 在 ts 中使用 extends 去继承一个抽象类。
  - 在 ts 中使用 implements 去实现一个接口。
- 接口只能做方法声明，抽象类中可以作方法声明，也可以做方法实现。
- 抽象类是有规律的，抽离的是一个类别的公共部分，而接口只是对相同属性和方法的抽象，属性和方法可以无任何关联。
  :::

抽象类的用法如下。

```ts
abstract class Animal {
  abstract makeSound(): void;
  // 直接定义方法实例
  move(): void {
    console.log("roaming the earch...");
  }
}
class Cat extends Animal {
  makeSound() {} // 必须实现的抽象方法
  move() {
    console.log("move");
  }
}
new Cat3();
```

### 接口中的高级用法

接口中的高级用法主要有以下几点：

- 继承
- 可选属性
- 只读属性
- 索引类型：字符串和数字
- 函数类型接口
- 给类添加类型，构造函数类型

接口中除了可以定义常规属性之外，还可以定义可选属性、索引类型等。

```ts
interface Ia {
  a: string;
  b?: string; // 可选属性
  readonly c: number; // 只读属性
  [key: number]: string; // 索引类型
}
// 接口继承
interface Ib extends Ia {
  age: number;
}
let test1: Ia = {
  a: "",
  c: 2,
  age: 1
};
test1.c = 2; // 报错，只读属性
const item0 = test1[0]; // 索引类型
```

接口中同时也支持定义函数类型、构造函数类型。

```ts
// 接口定义函数类型
interface SearchFunc {
  (source: string, subString: string): boolean;
}
let mySearch: SearchFunc = function(x: string, y: string) {
  return false;
};
// 接口中编写类的构造函数类型检查
interface IClass {
  new (hour: number, minute: number);
}
let test2: IClass = class {
  constructor(x: number, y: number) {}
};
```

### 函数中的高级用法

函数中的高级用法主要有以下几点：

- 函数重载
- this 类型

#### 函数重载

函数重载指的是一个函数可以根据不同的入参匹配对应的类型。

例如：案例中的 `doSomeThing` 在传一个参数的时候被提示为 `number` 类型，传两个参数的话，第一个参数就必须是 `string` 类型。

```ts
// 函数重载
function doSomeThing(x: string, y: number): string;
function doSomeThing(x: number): string;
function doSomeThing(x): any {}

let result = doSomeThing(0);
let result1 = doSomeThing("", 2);
```

#### This 类型

我们都知道，Javascript 中的 this 只有在运行的时候，才能够判断，所以对于 Typescript 来说是很难做静态判断的，对此 Typescript 给我们提供了手动绑定 this 类型，让我们能够在明确 this 的情况下，给到静态的类型提示。

其实在 Javascript 中的 this，就只有这五种情况：

- 对象调用，指向调用的对象
- 全局函数调用，指向 window 对象
- call apply 调用，指向绑定的对象
- dom.addEventListener 调用，指向 dom
- 箭头函数中的 this ，指向绑定时的上下文

```ts
// 全局函数调用 - window
function doSomeThing() {
  return this;
}
const result2 = doSomeThing();

// 对象调用 - 对象
interface IObj {
  age: number;
  // 手动指定 this 类型
  doSomeThing(this: IObj): IObj;
  doSomeThing2(): Function;
}

const obj: IObj = {
  age: 12,
  doSomeThing: function() {
    return this;
  },
  doSomeThing2: () => {
    console.log(this);
  }
};
const result3 = obj.doSomeThing();
let globalDoSomeThing = obj.doSomeThing;
globalDoSomeThing(); // 这样会报错，因为我们只允许在对象中调用

// call apply 绑定对应的对象
function fn() {
  console.log(this);
}
fn.bind(document)();

// dom.addEventListener
document.body.addEventListener("click", function() {
  console.log(this); // body
});
```

### 泛型

泛型表示的是一个类型在定义时并不确定，需要在调用的时候才能确定的类型，主要包含以下几个知识点：

- 泛型函数
- 泛型类
- 泛型约束 T extends XXX

我们试想一下，如果一个函数，把传入的参数直接输出，我们怎么去给它编写类型？传入的参数可以是任何类型，难道我们需要把每个类型都写一遍？

- 使用函数重载，得把每个类型都写一遍，不适合。
- 泛型，用一个类型占位 T 去代替，在使用时指定对应的类型即可。

```ts
// 使用泛型
function doSomeThing<T>(param: T): T {
  return param;
}

let y = doSomeThing(1);

// 泛型类
class MyClass<T> {
  log(msg: T) {
    return msg;
  }
}

let my = new MyClass<string>();
my.log("");

// 泛型约束，可以规定最终执行时，只能是哪些类型
function d2<T extends string | number>(param: T): T {
  return param;
}
let z = d2(true);
```

其实泛型本来很简单，但许多初学 Typescript 的同学觉得泛型很难，其实是因为泛型可以结合索引查询符 `keyof`、索引访问符 `T[k]` 等写出难以阅读的代码，我们来看一下。

```ts
// 以下四种方法，表达的含义是一致的，都是把对象中的某一个属性的 value 取出来，组成一个数组
function showKey1<K extends keyof T, T>(items: K[], obj: T): T[K][] {
  return items.map(item => obj[item]);
}

function showKey2<K extends keyof T, T>(items: K[], obj: T): Array<T[K]> {
  return items.map(item => obj[item]);
}

function showKey3<K extends keyof T, T>(
  items: K[],
  obj: { [K in keyof T]: any }
): T[K][] {
  return items.map(item => obj[item]);
}

function showKey4<K extends keyof T, T>(
  items: K[],
  obj: { [K in keyof T]: any }
): Array<T[K]> {
  return items.map(item => obj[item]);
}

let obj22 = showKey4<"age", { name: string; age: number }>(["age"], {
  name: "yhl",
  age: 12
});
```

### 类型兼容性

类型兼容性是我认为 Typescript 中最难理解的一个部分，我们来分析一下。

- 对象中的兼容
- 函数返回值兼容
- 函数参数列表兼容
- 函数参数结构兼容
- 类中的兼容
- 泛型中的兼容

在 Typescript 中是通过结构体来判断兼容性的，如果两个的结构体一致，就直接兼容了，但如果不一致，Typescript 给我们提供了一下两种兼容方式：

以 `A = B` 这个表达式为例：

- 协变，表示 B 的结构体必须包含 A 中的所有结构，即：B 中的属性可以比 A 多，但不能少。
- 逆变，和协变相反，即：B 中的所有属性都在 A 中能找到，可以比 A 的少。
- 双向协变，即没有规则，B 中的属性可以比 A 多，也可以比 A 少。

#### 对象中的兼容

对象中的兼容，采用的是协变。

```ts
let obj1 = {
  a: 1,
  b: "b",
  c: true
};

let obj2 = {
  a: 1
};

obj2 = obj1;
obj1 = obj2; // 报错，因为 obj2 属性不够
```

#### 函数返回值兼容

函数返回值中的兼容，采用的是协变。

```ts
let fun1 = function(): { a: number; b: string } {
  return { a: 1, b: "" };
};
let fun2 = function(): { a: number } {
  return { a: 1 };
};

fun1 = fun2; // 报错，fun2 中没有 b 参数
fun2 = fun1;
```

#### 函数参数个数兼容

函数参数个数的兼容，采用的是逆变。

```ts
// 如果函数中的所有参数，都可以在赋值目标中找到，就能赋值
let fun1 = function(a: number, b: string) {};
let fun2 = function(a: number) {};

fun1 = fun2;
fun2 = fun1; // 报错， fun1 中的 b 参数不能再 fun2 中找到
```

#### 函数参数兼容

函数参数兼容，采用的是双向协变。

```ts
let fn1 = (a: { name: string; age: number }) => {
  console.log("使用 name 和 age");
};
let fn2 = (a: { name: string }) => {
  console.log("使用 name");
};

fn2 = fn1; // 正常
fn1 = fn2; // 正常
```

:::tip 理解函数参数双向协变

1、我们思考一下，一个函数 `dog => dog`，它的子函数是什么？

> 注意：原函数如果被修改成了另一个函数，但他的类型是不会改变的，ts 还是会按照原函数的类型去做类型检查!

- `grayDog => grayDog`
  - 不对，如果传了其他类型的 dog，没有 grayDog 的方法，会报错。
- `grayDog => animal`
  - 同上。
- `animal => animal`
  - 返回值不对，返回值始终是协变的，必须多传。
- `animal => grayDog`
  - 正确。

所以，函数参数类型应该是逆变的。

2、为什么 Typescript 中的函数参数也是协变呢？

```ts
enum EventType {
  Mouse,
  Keyboard
}
interface Event {
  timestamp: number;
}
interface MouseEvent extends Event {
  x: number;
  y: number;
}

function listenEvent(eventType: EventType, handler: (n: Event) => void) {
  /* ... */
}
listenEvent(EventType.Mouse, (e: MouseEvent) => console.log(e.x + "," + e.y));
```

上面代码中，我们在调用时传的是 mouse 类型，所以在回调函数中，我们是知道返回的参数一定是一个 MouseEvent 类型，这样是符合逻辑的，但由于 MouseEvent 类型的属性是多于 Event 类型的，所以说 Typescript 的参数类型也是支持协变的。
:::

### 类中的兼容

类中的兼容，是在比较两个实例中的结构体，是一种协变。

```ts
class Student1 {
  name: string;
  // private weight:number
}

class Student2 {
  // extends Student1
  name: string;
  age: number;
}

let student1 = new Student1();
let student2 = new Student2();

student1 = student2;
student2 = student1; // 报错，student1 没有 age 参数
```

需要注意的是，实例中的属性和方法会受到类中修饰符的影响，如果是 private 修饰符，那么必须保证两者之间的 private 修饰的属性来自同一对象。如上文中如果把 private 注释放开的话，只能通过继承去实现兼容。

### 泛型中的兼容

泛型中的兼容，如果没有用到 T，则两个泛型也是兼容的。

```ts
interface Empty<T> {}
let x1: Empty<number>;
let y1: Empty<string>;

x1 = y1;
y1 = x1;
```

### 高级类型

Typescript 中的高级类型包括：交叉类型、联合类型、字面量类型、索引类型、映射类型等，这里我们主要讨论一下

- 联合类型
- 映射类型

#### 联合类型

联合类型是指一个对象可能是多个类型中的一个，如：`let a :number | string` 表示 a 要么是 number 类型，要么是 string 类型。

那么问题来了，我们怎么去确定运行时到底是什么类型？

答：类型保护。类型保护是针对于联合类型，让我们能够通过逻辑判断，确定最终的类型，是来自联合类型中的哪个类型。

判断联合类型的方法很多：

- typeof
- instanceof
- in
- 字面量保护，`===`、`!===`、`==`、`!=`
- 自定义类型保护，通过判断是否有某个属性等

```ts
// 自定义类型保护
function isFish(pet: Fish | Bird): pet is Fish {
  return (<Fish>pet).swim !== undefined;
}
if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```

#### 映射类型

映射类型表示可以对某一个类型进行操作，产生出另一个符合我们要求的类型：

- `ReadOnly<T>`，将 T 中的类型都变为只读。
- `Partial<T>`，将 T 中的类型都变为可选。
- `Exclude<T, U>`，从 T 中剔除可以赋值给 U 的类型。
- `Extract<T, U>`，提取 T 中可以赋值给 U 的类型。
- `NonNullable<T>`，从 T 中剔除 null 和 undefined。
- `ReturnType<T>`，获取函数返回值类型。
- `InstanceType<T>`，获取构造函数类型的实例类型。

我们也可以编写自定义的映射类型。

```ts
//定义toPromise映射
type ToPromise<T> = { [K in keyof T]: Promise<T[K]> };
type NumberList = [number, number];
type PromiseCoordinate = ToPromise<NumberList>;
// [Promise<number>, Promise<number>]
```

## Typescript 总结

写了这么多，接下来说说我对 Typescript 的一些看法。

### Typescript 优点

1、静态类型检查，提早发现问题。

2、类型即文档，便于理解，协作。

3、类型推导，自动补全，提升开发效率。

4、出错时，可以大概率排除类型问题，缩短 bug 解决时间。

实战中的优点：

1、发现 es 规范中弃用的方法，如：Date.toGMTString。

2、避免了一些不友好的开发代码，如：动态给 obj 添加属性。

3、vue 使用变量，如果没有在 data 定义，会直接抛出问题。

### Typescript 缺点

1、短期增加开发成本。

2、部分库还没有写 types 文件。

3、不是完全的超集。

实战中的问题：

1、还有一些坑不好解决，axios 编写了拦截器之后，typescript 反映不到 response 中去。

## 参考资料

- [Typescript 官网](https://www.tslang.cn/)
- [深入理解 Typescript](https://jkchao.github.io/typescript-book-chinese/)
