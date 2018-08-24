# 测试

测试的目的：

- 正确性：测试可以验证代码的正确性，在上线前心里有底。
- 自动化：通过编写测试用例，可以做到一次编写，多次运行。`当然手工也可以测试，通过console可以打印出内部信息，但是这是一次性的事情，下次测试还得重头来过，效率不能得到保证。`
- 解释性：测试用例用于测试接口、模块的重要性，在测试用例中会设计如何使用这些 API。`其他开发人员如果要使用这些API，阅读测试用例是一种很好的途径，有时比文档说明更清晰。`
- 驱动开发，设计指导：代码被测试的前提是代码本身的可测试性，要保证代码的可测试性，就需要在开发中注意 API 的设计，TDD 将测试前移就是起到这么一个作用。
- 保证重构：互联网行业产品迭代速度很快，迭代后必然存在代码重构的过程，那怎么才能保证重构后代码的质量呢？有测试用例做后盾，就可以大胆的进行重构。

## 单元测试

单元测试包括：断言，测试框架，测试用例，测试覆盖率，mock，持续集成等几个方面。

目的：单元测试能够让开发者明确知道代码结果。

### 断言

断言：保证最小单元是否正常运行检测方法。

### 测试框架

测试框架用于为测试服务，让本身并不参与测试，主要用于管理测试用例和生成测试报告，提升测试用例的开发速度，提高测试用例的可维护性和可读性。`有mocha，jest，jasmine等框架。`

测试风格:

- 测试驱动开发（TDD）关注所有的功能是否被实现，每一个功能都具备对应的测试用例。
- 行为驱动开发（BDD）关注整体行为是否符合预期，编写的每一行代码都有目的提供一个全面的测试用例集。

#### TDD 运行流程

TDD（Test Drived Develop）。TDD 的原理是在开发功能代码之前，先编写单元测试用例代码，通过测试来推动整个开发的进行。

- setup（单个测试用例开始之前）
- suiteSetup（每一个测试用例开始之前）
- test（定义测试用例，并用断言库进行设置）
- teardown（单个测试用例开始之后）
- suiteTeardown（每一个测试用例开始之后）

```js
mocha --> *.test.js --> suite --> test --> 断言

suite('Array', function(){
    setup(function(){
        // 测试用例开始之前
    });
    suite('#indexOf',function(){
        test('should return -1 when not present',function(){
            assert.equal(-1,[1,2,3].indexOf(4));
        })
    })
    teardown(function(){
        // 测试用例之后
    });
})
```

#### BDD 运行流程

BDD（Behavior Driven Development）。行为驱动的开发，描述了软件的行为过程，可以直接作为软件的需求文档。

- before（单个测试用例开始之前）
- beforeEach（每一个测试用例开始之前）
- it（定义测试用例，并用断言库进行设置）
- after（单个测试用例开始之后）
- afterEach（每一个测试用例开始之后）

```js
mocha  --> *.test.js --> describe --> it --> 断言

describe('Array', function(){
    before(function(){
        // 测试用例开始之前
    });
    describe('#indexOf',function(){
        it('should return -1 when not present',function(){
            [1,2,3].indexOf(4).should.equal(-1);
        })
    })
})
```

### 测试用例

测试用例最小需要通过正向测试和反向测试来保证测试对功能的覆盖。

#### 异步测试

在执行测试用例时，会将 done()注入实参。

```js
it("should return -1 when not present", function(done) {
  setTimeout(() => {
    done();
  }, 1000);
});
```

### 测试覆盖率

判断单元测试对代码的覆盖情况。`原理是通过向代码中注入代码，然后执行，可以统计：是否执行和执行次数。`

- 行覆盖率（line coverage）：是否每一行都执行了？
- 函数覆盖率（function coverage）：是否每个函数都调用了？
- 分支覆盖率（branch coverage）：是否每个 if 代码块都执行了？
- 语句覆盖率（statement coverage）：是否每个语句都执行了？

### e2e 测试

E2E（End To End）测试是模拟用户进行页面操作，通过来判断页面状态的变化，从而检查功能是否运行正常的测试方法。

常用的库：

- selenium/webdriver
- nightwatch
- puppeteer

## 性能测试

性能测试的范畴比较广泛，包括负载测试、要测试和基准测试等。

### 基准测试

基准测试统计的是在多少时间内执行了多少次某个方法。

使用 Benchmark 库

- 面向切面编程 AOP 无侵入式统计
- Benchmark 基准测试方法，他并不是简单地统计执行多少次测试代码后对比时间，它对测试有着严密的抽样过程，执行多少次取决于采样到的额数据能否完成统计。根据统计次数计算方差。

```js
var suite = new Benchmark.Suite();

// add tests
suite
  .add("RegExp#test", function() {
    /o/.test("Hello World!");
  })
  .add("String#indexOf", function() {
    "Hello World!".indexOf("o") > -1;
  })
  // add listeners
  .on("cycle", function(event) {
    console.log(String(event.target));
  })
  .on("complete", function() {
    console.log("Fastest is " + this.filter("fastest").map("name"));
  })
  // run async
  .run({ async: true });

// logs:
// => RegExp#test x 4,161,532 +-0.99% (59 cycles)
// => String#indexOf x 6,139,623 +-1.00% (131 cycles)
// => Fastest is String#indexOf
```

### 压力测试

对网络接口做压力测试需要检查的几个常用指标有吞吐率，响应时间和并发数，这些指标反映了服务器并发处理能力。

pv 网站当日访问人数，uv 独立访问人数。 QPS=pv/t。

常用的压力测试工具：ab、siege、http_load。

QPS: Request per second 标识服务器每秒处理请求数。

## 安全测试

- XSS
- SQL
- CSRF

## 功能测试

### 冒烟测试

自由测试的一种，找到一个 bug 然后修复，然后专门针对此 bug。

- 优点节省时间。
- 缺点覆盖率极低。

### 回归测试

修改一处对整体功能全部测试，一般配合自动化测试。

## 测试相关库

- karma：使用真实的浏览器环境，并且可测试兼容性
- mocha：测试框架
- chai：断言库
- istanbuljs/nyc：覆盖率库
- backstopjs：测试 UI
- benchmark：基准测试
- phantomjs：无头浏览器
- nightwatch：e2e 测试
- jest：大而全
