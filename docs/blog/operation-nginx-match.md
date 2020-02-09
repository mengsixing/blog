# Nginx Location 匹配规则

在 Nginx 中我们可以通过配置 location 指令块，来决定一个请求 url 如何处理。如果我们编写了多条 location 指令块，如何保证各个 location 不会产生冲突？如何理清 location 的匹配顺序？

带着这两个问题，我们先来做几道练习题。

## Nginx Location 小练习

问题 1、如果访问 /abcd 会匹配到哪个 config？

```nginx
server {
  location ~ /abc {
      #config 1
  }

  location /abc {
      #config 2
  }

  location ^~ /abc {
      #config 3
  }
}
```

问题 2、如果访问 /abcd 会匹配到哪个 config？

```nginx
server {
  location ~ /abc {
      #config 1
  }

  location /abc {
      #config 2
  }

  location ^~ /ab {
      #config 3
  }
}
```

问题 3、如果访问 /abcd 会匹配到哪个 config？

```nginx
server {
  location /abc {
      #config 2
  }

  location ^~ /ab {
      #config 3
  }
}
```

如果这 3 道小练习让你很费解，那么我们就接着深入研究，相信你一定会有所收获，如果只想知道答案，请直接看文章末尾。

## Nginx location 配置语法

Nginx location 配置语法如下

```sh
location [ = | ~ | ~* | ^~ | 空 ] url { … }
```

其中 [ = | ~ | ~* | ^~ | 空 ] 表示 location 的修饰符，具体含义如下

- = 表示精准匹配（完全相等时，才会命中规则）。
- ~ 表示区分大小写的正则匹配。
- ~\* 表示不区分大小写的正则匹配。
- ^~ 表示最佳匹配。
- 空，匹配以 url 开头的字符串，只能是普通字符串。

## Nginx location 的匹配过程

一般来说，一个 nginx.conf 文件通常会配置多个匹配规则，如果多个匹配规则都匹配到了 url，最终会执行哪一个呢？

1、Nginx 首先根据 url 检查最长匹配前缀字符串，即会判断【=】、【^~】、【空】修饰符定义的内容。

- 如果匹配到最长匹配前缀字符串。
  - 如果最长匹配前缀字符串被【=】修饰符匹配，则**立即响应**。
  - 如果没有被【=】修饰符匹配，则执行第 2 步判断。
- 如果没有匹配到最长匹配前缀字符串，则执行第 3 步判断。

2、Nginx 继续检查最长匹配前缀字符串，即判断【^~】、【空】修饰符定义的内容。

- 如果最长匹配前缀字符串被【^~】修饰符匹配，则**立即响应**。
- 如果被【空】修饰符匹配，则**将该匹配保存起来**，并执行第 3 步判断。

3、Nginx 找到 nginx.conf 中定义的所有正则匹配（~ 和 ~\*），并按顺序进行匹配。

- 如果有任何正则表达式匹配成功，则**立即响应**。
- 如果没有任何正则匹配成功，则响应第 2 步中**存储的【空】匹配**。

:::tip 小练习答案
问题 1：最长匹配字符串为 abc，且有 ^~ 匹配，故结果为：config3。

问题 2：最长匹配字符串为 abc，被【空】匹配，故会开始查询正则匹配，匹配到正则 ~ /abc，故结果为：config1。

问题 3：最长匹配字符串为 abc，被【空】匹配，故会开始查询正则匹配，没有匹配到任何正则，故使用【空】匹配到的结果：config2。
:::

## 参考资料

[Understanding Nginx Server and Location Block Selection Algorithms](https://www.digitalocean.com/community/tutorials/understanding-nginx-server-and-location-block-selection-algorithms)
