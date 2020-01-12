# linux 中替换一个文件内容

- sed 命令
- awk 命令

## sed 命令

sed 是一种流编辑器，它是文本处理中非常重要的工具，能够完美的配合正则表达式使用，功能不同凡响。处理时，把当前处理的行存储在临时缓冲区中，称为“模式空间”（pattern space），接着用 sed 命令处理缓冲区中的内容，处理完成后，把缓冲区的内容送往屏幕。接着处理下一行，这样不断重复，直到文件末尾。文件内容并没有 改变，除非你使用重定向存储输出。Sed 主要用来自动编辑一个或多个文件；简化对文件的反复操作；编写转换程序等。

命令规范

```sh
# 直接在命令行编写操作，并执行
sed <option> 'command 正则' file

# 将操作写在一个单独的文件里，进行执行
sed [options] -f scriptfile file(s)
```

### 命令实战

#### 替换操作：s 命令

1、替换文本中的字符串：

```sh
sed 's/books/BOOKS/' ./test.js
```

2、直接编辑文件 选项-i ，会匹配 file 文件中每一行的所有 book 替换为 books：

```sh
sed -i 's/book/books/g' file
```

#### 全面替换标记 g

使用后缀 /g 标记会替换每一行中的所有匹配：

```sh
sed 's/book/books/g' file
```

当需要从第 N 处匹配开始替换时，可以使用 /Ng：

```sh
echo sksksksksksk | sed 's/sk/SK/2g'
skSKSKSKSKSK

echo sksksksksksk | sed 's/sk/SK/3g'
skskSKSKSKSK

echo sksksksksksk | sed 's/sk/SK/4g'
skskskSKSKSK
```

#### 定界符

以上命令中字符 / 在 sed 中作为定界符使用，也可以使用任意的定界符：

```sh
sed 's:test:TEXT:g'
sed 's|test|TEXT|g'
```

定界符出现在样式内部时，需要进行转义：

```sh
sed 's/\/bin/\/usr\/local\/bin/g'
```

#### 删除操作：d 命令

删除空白行：

```sh
sed '/^$/d' file
```

删除文件的第 2 行：

```sh
sed '2d' file
```

删除文件的第 2 行到末尾所有行：

```sh
sed '2,$d' file
```

删除文件最后一行：

```sh
sed '$d' file
```

删除文件中所有开头是 test 的行：

```sh
sed '/^test/'d file
```

#### 已匹配字符串标记&

正则表达式 \w+ 匹配每一个单词，使用 [&] 替换它，& 对应于之前所匹配到的单词：

```sh
echo this is a test line | sed 's/\w\+/[&]/g'
[this] [is] [a] [test] [line]
```

所有以 192.168.0.1 开头的行都会被替换成它自已加 localhost：

```sh
sed 's/^192.168.0.1/&localhost/' file
192.168.0.1localhost
```

#### 子串匹配标记\1

匹配给定样式的其中一部分：

```sh
echo this is digit 7 in a number | sed 's/digit \([0-9]\)/\1/'
this is 7 in a number
```

命令中 digit 7，被替换成了 7。样式匹配到的子串是 7，(..) 用于匹配子串，对于匹配到的第一个子串就标记为 \1 ，依此类推匹配到的第二个结果就是 \2 ，例如：

```sh
echo aaa BBB | sed 's/\([a-z]\+\) \([A-Z]\+\)/\2 \1/'
BBB aaa
```

love 被标记为 1，所有 loveable 会被替换成 lovers，并打印出来：

```sh
echo loveable | sed -n 's/\(love\)able/\1rs/p'
```
