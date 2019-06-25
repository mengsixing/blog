# Commitlint 使用总结

11 月 10 日，参加了 2018 前端大会，收货颇多，令我印象最深的是京东 taro 团队同学分享的关于开源项目维护的主题，其中就包含有今天介绍的工程化方面的工具 commitlint。

## Commitlint 是什么

一句话说，当我们运行 `git commmit -m 'xxx'` 时，用来检查 `xxx` 是否满足固定格式的工具。

- 为什么使用 commitlint?

我们都知道，在使用 git commit 时，git 会提示我们填入此次提交的信息。可不要小看了这些 commit，团队中规范了 commit 可以更清晰的查看每一次代码提交记录，还可以根据自定义的规则，自动生成 changeLog 文件。

## Commitlint 推荐的格式

commitlint 推荐我们使用 config-conventional 配置去写 commit。

例如，当我们修复了某个 bug：

```shell
git commit -m 'fix(scope): fix ie6 margin bug'
```

- fix 表示 commit 的类型。
- scope 表示 作用的范围（可选）。
- 冒号后 表示 commit 对应的信息。

除了 fix 外，还有其他的标识：

| 类型     | 描述                                 |
| -------- | ------------------------------------ |
| build    | 发布版本                             |
| chore    | 改变构建流程、或者增加依赖库、工具等 |
| ci       | 持续集成修改                         |
| docs     | 文档修改                             |
| feat     | 新特性                               |
| fix      | 修改问题                             |
| perf     | 优化相关，比如提升性能、体验         |
| refactor | 代码重构                             |
| revert   | 回滚到上一个版本                     |
| style    | 代码格式修改                         |
| test     | 测试用例修改                         |

## 总结

使用 commitlint 可以规范我们每一次的 commit，我们可以用来自动生成 changeLog 等文件，方便代码管理。

## 相关链接

- [Commitlint](https://github.com/conventional-changelog/commitlint)
