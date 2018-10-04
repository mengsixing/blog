# Webpack 小总结

webpack 是一个模块打包器。webpack 的主要目标是将 `javaScript` 文件打包在一起，打包后的文件用于在浏览器中使用，但它也能够胜任转换(transform)、打包(bundle)或包裹(package)任何资源(resource or asset)。

## Webpack 核心概念

- 入口(entry)
- 输出(output)
- loader
- 插件(plugins)

### 入口

入口是 webpack 构建开始的地方，通过入口文件，webpack 可以找到入口文件所依赖的文件，并逐步递归，找出所有依赖的文件。

```js
module.exports = {
  entry: "./path/to/my/entry/file.js"
};
```

### 输出

output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件。

```js
const path = require("path");

module.exports = {
  entry: "./path/to/my/entry/file.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "my-first-webpack.bundle.js"
  }
};
```

### loader

webpack 自身只支持 JavaScript。而 loader 能够让 webpack 处理那些非 JavaScript 文件，并且先将它们转换为有效的模块，然后添加到依赖图中，这样就可以提供给应用程序使用。

#### loader 的使用

```js {8}
const path = require("path");

module.exports = {
  output: {
    filename: "my-first-webpack.bundle.js"
  },
  module: {
    rules: [{ test: /\.txt$/, use: "raw-loader" }]
  }
};
```

### loader 的编写

loader 其实就是一个 function，接收一个参数 source，就是当前的文件内容，然后稍加处理，就可以 return 出一个新的文件内容。

```js
const loaderUtils = require("loader-utils");

module.exports = function(source) {
  // 获取loader中传递的配置信息
  const options = loaderUtils.getOptions(this);
  // 返回处理后的内容
  this.callback(null, "/ *增加一个注释 */" + source);
  // 也可以直接return
  // return "/ *增加一个注释 */" + source;
};
```

### 插件

插件其实就是一个类，通过监听 webpack 执行流程上的钩子函数，可以更精密地控制 webpack 的输出，包括：打包优化、资源管理和注入环境变量。

#### 插件的使用

```js {1,7}
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  module: {
    rules: [{ test: /\.txt$/, use: "raw-loader" }]
  },
  plugins: [new HtmlWebpackPlugin({ template: "./src/index.html" })]
};
```

#### 编写自定义插件

我们可以利用 webpack 提供的钩子函数，编写自定义插件，相当于监听 webpack 的事件，做出对应的响应，webpack 是通过[Tapable](https://github.com/webpack/tapable)进行事件流管理的。

```js
class APlugin {
  // apply方法，会在new plugin后被webpack自动执行。
  apply(compiler) {
    // 可以在任意的钩子函数中去触发自定义事件
    compiler.hooks.compilation.tap("APlugin", compilation => {
      compilation.hooks.afterOptimizeChunkAssets.tap("APlugin", chunks => {
        //   这里只是简单的打印了chunks，你如果有更多的想法，都可以在这里实现。
        console.log("打印chunks：", chunks);
      });
    });
  }
}
```

## Webpack 调优

在 webpack4 之后，使用了 node.js 原生的 cluster 模块去开辟多进程执行构建，webpack 打包的性能变得越来越快，一些常规优化 webpack 都已经帮我们做了，使得 webpack 变得越来越简单，甚至可以达到零配置，但是对于零配置而言，不能满足全部需求，所以还是建议进行手动配置。

### 使用 mode 配置项

最懒人的写法，在 webpack 配置项中 mode = production ，webpack 就帮我们把常用的配置都配好了，而且还很不错。

```js {2}
module.exports = {
  mode: "development"
};
```

使用该配置后，webpack 会将 process.env.NODE_ENV 的值设为 production。

并且还会帮我们配置好以下插件：

- FlagDependencyUsagePlugin（标记没有用到的依赖）
- FlagIncludedChunksPlugin（标记用到的依赖）
- ModuleConcatenationPlugin（scope hoisting）
- NoEmitOnErrorsPlugin（遇到错误代码不跳出）
- OccurrenceOrderPlugin（给生成的 chunkid 排序）
- SideEffectsFlagPlugin
- uglifyjs-webpack-plugin（压缩 js）

### 拆分文件

如果不使用 plugin，webpack 会把所有文件都打包在一个 js 文件中，这往往会使得文件很大，加载时间会变得很长，我们可以配置 optimization.splitChunks 来设置拆分文件规则。

这是 webpack 默认的配置，也可以根据自己需求做对应修改。

```js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: "async", // 参数可能是：all，async和initial，这里表示拆分异步模块。
      minSize: 30000, // 如果模块的大小大于30kb，才会被拆分
      minChunks: 1,
      maxAsyncRequests: 5, // 按需加载时最大的请求数，意思就是说，如果拆得很小，就会超过这个值，限制拆分的数量。
      maxInitialRequests: 3, // 入口处的最大请求数
      automaticNameDelimiter: "~", // webpack将使用块的名称和名称生成名称（例如vendors~main.js）
      name: true, // 拆分块的名称
      cacheGroups: {
        // 缓存splitchunks
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2, // 一个模块至少出现2次引用时，才会被拆分
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

### 使用 DllPlugin

DllPlugin：用于打包单独的动态链接库文件。

DllReferencePlugin：用于在主要的配置文件中引入 DllPlugin 插件打包好的动态链接库文件。

这里需要建 2 个配置文件，先执行 webpack.dll.config.js，生成 mainfest，然后再执行 webpack.config.js 打包文件，可以看到，构建速度有了非常大的提升。

动态链接库配置：

```js {5,12,13,14,15}
// webpack.dll.config.js
// 这里配置DllPlugin，生成mainifest
module.exports = {
  entry:{
      // 将react相关，放入一个单独的动态链接库中
      react:['react','react-dom']
  },
  output:{
      filename:'[name].dll.js'
  },
  plugins:[
    new webpack.DllPlugin({
        name: '_dll_[name]',
        path: path.join(__dirname, '[name].manifest.json'),
    );
  ]
};
```

使用打包后的动态链接库：

```js {5,6,7}
// webpack.config.js
// 这里配置DllPlugin，生成mainifest
module.exports = {
  plugins:[
    new webpack.DllReferencePlugin({
        manifest: require('./react.manifest.json')
    });
  ]
};
```

### 其他优化方法

1、在处理 `loader` 时，配置 `include`，缩小 `loader` 检查范围。

2、使用 `alias` 可以更快地找到对应文件。

3、如果在 `require` 模块时不写后缀名，默认 webpack 会尝试`.js`,`.json` 等后缀名匹配，`extensions` 配置，让 webpack 少做一点后缀匹配。

4、静态资源上 cdn。

5、使用 `tree shaking`，只打包用到的模块，删除没有用到的模块。

6、配置 `scope hoisting` 作用域提升，将多个 IIFE 放在一个 IIFE 中。

7、在开发阶段，可以直接引用 `cdn` 上的库文件，使用 `externals` 配置全局对象，避免打包。

```js {4,12,18,23,26,29,30,31,32}
module.exports = {
  output: {
    // 静态资源上cdn
    publicPath: "//xxx/cdn.com"
  },
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: "raw-loader",
        // 缩小loader检查范围
        include: path.join(__dirname, "src")
      }
    ]
  },
  plugins: [
    // 开启scope hoisting
    new ModuleConcatenationPlugin()
  ],
  resolve: {
    // 使用别名，加快搜索
    alias: {
      "~": path.resolve(__dirname, "../src")
    },
    // 配置用到的后缀名，方便webpack查找
    extensions: ["js", "css"]
  },
  // 开发阶段引用cdn上文件，可以避免打包库文件
  externals: {
    vue: "Vue",
    "element-ui": "ELEMENT"
  }
};
```

## Webpack 运行原理

webpack 在运行时大致分为这几个阶段：

1、读取 webpack.config.js 配置文件，生成 compiler 实例，并把 compiler 实例注入 plugin 中的 apply 方法中。

2、读取配置的 `Entries`，递归遍历所有的入口文件。

3、对入口文件进行编译，开始 `compilation` 过程，使用 `loader` 对文件内容编译，再将编译好的文件内容解析成 `AST` 静态语法树。

4、递归依赖的模块，重复第 3 步，生成 `AST` 语法树，在 `AST` 语法树中可以分析到模块之间的依赖关系，对应做出优化。

5、将所有模块中的 require 语法替换成`__webpack_require__`来模拟模块化操作。

6、最后把所有的模块打包进一个自执行函数（IIFE）中。

---

::: tip 参考资料
[webpack 官网](https://webpack.js.org/)

[Webpack 揭秘——走向高阶前端的必经之路](https://juejin.im/post/5badd0c5e51d450e4437f07a)
:::
