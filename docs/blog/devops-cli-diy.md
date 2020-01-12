# 实现一个自己的 CLI

目前在市面上存在很多脚手架，如：create-raect-app、vue-cli。我们可以通过一行简单的命令，就能创建一个基本的项目工程，大大的提高了开发效率。

在享受命令行带给我们便利的同时，你是否也想编写一个自己的 cli？

如果回答是，那么我们就开始今天的 cli 制作吧。

- 编写 cli 的运行原理
- 编写 cli 常用的库

## CLI 的运行原理

- 创建动态链接库，暴露全局 cli 命令
- 读取并解析命令行参数
- 提供用户可选的配置项
- 拷贝自定义模板到本地

### 创建动态链接库

如果要暴露一个全局的命令，首先需要在 package.json 文件中编写一个 bin 命令。

```js
"bin": {
    "yd-cli": "./bin/ydcli"
  }
```

### 读取并解析命令行参数

读取命令行参数其实非常简单，使用 program.argv 获取。

```js
node app.js a=1
// [
//   '/Users/xxx/.nvm/versions/node/v12.4.0/bin/node',
//   '/Users/xxx/app.js',
//   'a=1',
// ]
```

但这样获取到的参数是个数组，前两项包含了 node 的安装位置、代码执行路径，所以经常看到的获取参数是`process.argv.slice(2)`。

但直接这样使用还是不够友好，我们可以使用 commander 库来快速处理参数。

### 提供用户可选的配置项

如果要实现根据用户的选择，创建不同类型的项目模板，如下图所示：

![inquirer](https://cdn.rawgit.com/SBoudrias/Inquirer.js/28ae8337ba51d93e359ef4f7ee24e79b69898962/assets/screenshots/list.svg)

对于命令行中的单选操作，我们使用 inquirer 来处理。

### 拷贝自定义模板到本地

我们通常会提供多套模板，放在 cli 的某个目录下，通过用户的选择之后，将对应的模板拷贝到指定的目录中，同时替换成我们传入的名称。

如果不想让 cli 因为模板的原因过于庞大，可以将模板上传到代码仓库中，通过 git clone 命令下载指定模板即可。

## 小实战

接下来我们实战一个小工具，用到了如下几个 npm 包：

- commander 命令行中参数的处理
- inquirer 命令行中的 select 选择器
- ora 进度条 loading
- figlet 生成好看的图标文字
- lolcatjs 生成随机颜色

```js
#!/usr/bin/env node
const figlet = require("figlet");
const Printer = require("@darkobits/lolcatjs").default;
const program = require("commander");
const inquirer = require("inquirer");
const ora = require("ora");
const shell = require("shelljs");

const text = figlet.textSync("my-cli");
const textColor = Printer.fromString(text);

program.version(textColor);

const hander = {
  create: env => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "jskind",
          message: "请选择编程语言",
          choices: ["react", "vue", "angular"]
        }
      ])
      .then(answers => {
        const spinner = ora("正在下载页面模板").start();
        console.log(answers);

        if (!shell.which("git")) {
          shell.echo("Sorry, this script requires git");
          shell.exit(1);
        } else {
          shell.exec("git clone https://github.com/xxx.git");
          shell.exec(`sed -i '' -e "s/xxx/${env}/g" ./xxx/package.json`);
          // todo 将文件夹的名字替换掉
          spinner.stop();
        }
      });
  }
};

program.arguments("<cmd> [env]").action(function(cmd, env) {
  if (hander[cmd]) {
    hander[cmd](env);
  } else {
    console.log(`很抱歉，暂未实现该${cmd}命令`);
  }
});

// 处理参数入口
program.parse(process.argv);
```

编写完成之后，执行以下命令。

![devops-cli-diy-demo.png](devops-cli-diy-demo.png)
