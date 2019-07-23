# 前端测试

长期以来，前端测试并不是开发者必须要编写的，但随着前端工程化的发展，前端测试已经成为持续集成中重要的组成部分，编写前端测试可以达到以下目的：

- 正确性：可以验证代码的正确性，在**上线前心里有底**。
- 自动化：通过编写测试用例，可以做到**一次编写，多次运行**。
- 解释性：测试用例中会设计如何使用这些 API，**良好的测试用例比开发文档更直观**。
- 驱动开发：要保证代码的可测试性，就需要在开发中注意 API 的设计。**TDD 测试驱动开发**的思想就是在开发阶段编写可测试性代码，以保证代码的可测试性。
- 保证重构：互联网行业产品迭代速度很快，迭代后必然存在代码重构的过程，那怎么才能保证重构后代码的质量呢？有测试用例做后盾，就可以**大胆的进行重构**。

## 单元测试

单元测试包括：断言，测试框架，测试用例，测试覆盖率，mock 等几个方面。目的是**让开发者明确知道代码结果**。

### 断言

断言：保证最小单元是否正常运行检测方法。

### 测试框架

测试框架用于为测试服务，它本身并不参与测试，主要用于管理测试用例和生成测试报告，提升测试用例的开发速度、可读性和可维护性。常见的测试框架有：mocha，jest，jasmine 等。

#### 测试风格

通常有以下两种测试风格，开发者可以根据情况选择。

- 测试驱动开发（TDD）：关注所有的功能是否被实现，每一个功能都具备对应的测试用例。
- 行为驱动开发（BDD）：关注整体行为是否符合预期，编写的每一行代码都有目的提供一个全面的测试用例集。

##### TDD 运行流程

TDD（Test Drived Develop）。TDD 的原理是**在开发功能代码之前，先编写单元测试用例代码，通过测试来推动整个开发的进行**。

- setup（单个测试用例开始之前）
- suiteSetup（每一个测试用例开始之前）
- test（定义测试用例，并用断言库进行设置）
- teardown（单个测试用例开始之后）
- suiteTeardown（每一个测试用例开始之后）

```js
suite('Array', function() {
  setup(function() {
    // 测试用例开始之前
  });
  suite('#indexOf', function() {
    test('should return -1 when not present', function() {
      assert.equal(-1, [1, 2, 3].indexOf(4));
    });
  });
  teardown(function() {
    // 测试用例之后
  });
});
```

##### BDD 运行流程

BDD（Behavior Driven Development）。行为驱动的开发，**描述了软件的行为过程，可以直接作为软件的需求文档**。

- before（单个测试用例开始之前）
- beforeEach（每一个测试用例开始之前）
- it（定义测试用例，并用断言库进行设置）
- after（单个测试用例开始之后）
- afterEach（每一个测试用例开始之后）

```js
describe('Array', function() {
  before(function() {
    // 测试用例开始之前
  });
  describe('#indexOf', function() {
    it('should return -1 when not present', function() {
      [1, 2, 3].indexOf(4).should.equal(-1);
    });
  });
});
```

### 测试用例

测试用例（Test Case）是为某个特殊目标而编制的一组测试输入、执行条件以及预期结果，用来判断一个代码功能是否满足特定需求。测试用例最小需要通过正向测试和反向测试来保证对功能的覆盖。

使用 it 来定义一个测试用例：

```js
it('should return -1 when not present', function(done) {
  // xxx
});
```

#### 异步测试

在执行异步测试用例时，会将 done 函数注入实参。

```js
it('should return -1 when not present', function(done) {
  setTimeout(() => {
    done();
  }, 1000);
});
```

### 测试覆盖率

测试覆盖率用来判断单元测试对代码的覆盖情况。原理是**通过向源代码中注入统计代码，用于监听每一行代码的执行情况**。可以统计到该行代码是否执行和执行次数。测试覆盖率包括以下几个方面：

- 行覆盖率（line coverage）：是否每一行都执行了？
- 函数覆盖率（function coverage）：是否每个函数都调用了？
- 分支覆盖率（branch coverage）：是否每个 if 代码块都执行了？
- 语句覆盖率（statement coverage）：是否每个语句都执行了？

### E2E 测试

E2E（End To End）测试是模拟用户进行页面操作，通过来判断页面状态的变化，从而检查功能是否运行正常的测试方法。

在使用 E2E 测试时，测试程序常常会自动打开浏览器，执行配置的操作，因此需要驱动浏览器，常见的库有：

- selenium/webdriver
- nightwatch
- puppeteer

## 性能测试

性能测试的范畴比较广泛，包括基准测试、压力测试等。

### 基准测试

基准测试统计的是在多少时间内执行了多少次某个方法。常用 Benchmark 库来编写。

- 面向切面编程（AOP）无侵入式统计。
- Benchmark 基准测试方法，他并不是简单地统计执行多少次测试代码后对比时间，它对测试有着严密的抽样过程，执行多少次取决于采样到的数据能否完成统计。根据统计次数计算方差。

```js
var suite = new Benchmark.Suite();

// add tests
suite
  .add('RegExp#test', function() {
    /o/.test('Hello World!');
  })
  .add('String#indexOf', function() {
    'Hello World!'.indexOf('o') > -1;
  })
  // add listeners
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({ async: true });

// logs:
// => RegExp#test x 4,161,532 +-0.99% (59 cycles)
// => String#indexOf x 6,139,623 +-1.00% (131 cycles)
// => Fastest is String#indexOf
```

### 压力测试

压力测试主要是针对于服务器端，它可以帮助我们发现系统中的瓶颈问题，减少发布到生产环境后出问题的几率。还能预估系统的承载能力，使我们能根据其做出一些应对措施。

对网络接口做压力测试需要检查的几个常用指标有吞吐率，响应时间和并发数，这些指标反映了服务器并发处理能力。

- pv 网站当日访问人数。
- uv 独立访问人数。
- qps 服务器每秒处理请求数。qps=pv/t。

常用的压力测试工具：ab、JMeter。

### Monkey 测试

Monkey 测试也有人叫做搞怪测试。就是用一些稀奇古怪的操作方式去测试被测试系统，以测试系统的稳定性，兼容性。

Monkey 测试本身非常简单，就是模拟用户的按键输入，触摸屏输入，手势输入等，看设备多长时间会出异常。

当 Monkey 程序在模拟器或设备运行的时候，如果用户触发了比如点击，触摸，手势或一些系统级别的事件的时候，它就会产生随机脉冲，所以可以用 Monkey 用随机重复的方法去负荷测试你开发的软件。

## 安全测试

安全测试是比较专业的测试，测试人员需要了解常见的 web 攻击方式，然后模拟攻击测试的程序，以防上线后其他不法人员使用同样的方式对程序进行攻击。前端常见的攻击方式有：

- XSS
- SQL 注入
- CSRF

## 功能测试

功能测试是对产品的各功能进行验证，根据功能测试用例，逐项测试，检查产品是否达到用户要求的功能。常见的功能测试方法有冒烟测试、回归测试等。

### 冒烟测试

自由测试的一种，找到一个 bug 然后修复，然后专门针对此 bug。优缺点如下：

- 节省时间。
- 缺点覆盖率极低。

### 回归测试

修改一处对整体功能全部测试，一般配合自动化测试。优缺点如下：

- 大幅度降低出错概率。
- 时间耗费重。

## 测试相关库

- karma：使用真实的浏览器环境，并且可测试兼容性。
- mocha：测试框架。
- chai：断言库。
- istanbuljs/nyc：覆盖率库。
- backstopjs：测试 UI。
- benchmark：基准测试。
- phantomjs：无头浏览器。
- nightwatch：e2e 测试。
- jest：大而全。
