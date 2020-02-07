# Linux 替换文件内容命令

在 linux 中，我们可以通过以下两个命令去操作文件中的内容。

- sed 命令
- awk 命令
- cut 命令

## sed 命令

sed 是一种流编辑器，它是文本处理中非常重要的工具，能够完美的配合正则表达式使用，以实现操作文件内容的效果。

sed 命令在处理时，会把当前处理的行存储在临时缓冲区中，称为“模式空间”（pattern space），接着去处理缓冲区中的内容，处理完成后，把缓冲区的内容送往屏幕。接着处理下一行，这样不断重复，直到文件末尾。原始文件内容并没有改变，除非你使用重定向存储输出。

sed 命令的主要用途：

- 自动编辑一个或多个文件
- 简化对文件的反复操作
- 编写转换程序

命令规范

```sh
# 直接在命令行编写操作，并执行
sed <option> 'command 正则' file

# 将操作写在一个单独的文件里，进行执行
sed [options] -f scriptfile file(s)
```

### sed 命令实战

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

:::tip 总结
sed 命令主要是通过正则表达式的方法去操作一个文件内容，首先定义一个正则表达式模式，然后使用对应的操作符去操作正则匹配到的内容，最终输出到控制台。
:::

## awk 命令

awk 是一种编程语言，用于在 linux/unix 下对文本和数据进行处理。数据可以来自标准输入(stdin)、一个或多个文件，或其它命令的输出。它支持用户自定义函数和动态正则表达式等先进功能，是 linux/unix 下的一个强大编程工具。

awk 有很多内建的功能，比如数组、函数等，这是它和 C 语言的相同之处，灵活性是 awk 最大的优势。

命令规范

```sh
# 基本用法
awk 'script' files
echo 'wenjian neirong' | awk 'script'

# 直接在命令行编写操作，并执行
awk [options] 'script' file(s)

# 将操作写在一个单独的文件里，进行执行
awk [options] -f scriptfile file(s)
```

常用命令选项

- -F fs fs 指定输入分隔符，fs 可以是字符串或正则表达式，如-F:
- -v var=value 赋值一个用户定义变量，将外部变量传递给 awk
- -f scripfile 从脚本文件中读取 awk 命令

### awk 基本用法

awk 在运行时包含三个步骤，写法如下：

```sh
awk 'BEGIN{ commands } pattern{ commands } END{ commands }'
```

- 第一步：执行 BEGIN{ commands }语句块中的语句。
- 第二步：从文件或标准输入(stdin)读取一行，然后执行 pattern{ commands }语句块，它逐行扫描文件，从第一行到最后一行重复这个过程，直到文件全部被读取完毕。
- 第三步：当读至输入流末尾时，执行 END{ commands }语句块。

BEGIN 语句块 在 awk 开始从输入流中读取行之前被执行，这是一个可选的语句块，如：变量初始化、打印输出表格的表头等语句通常可以写在 BEGIN 语句块中。

END 语句块 在 awk 从输入流中读取完所有的行之后即被执行，如：打印所有行的分析结果这类信息汇总都是在 END 语句块中完成，它也是一个可选语句块。

pattern 语句块 中的通用命令是最重要的部分，它也是可选的。如果没有提供 pattern 语句块，则默认执行{ print }，即打印每一个读取到的行，awk 读取的每一行都会执行该语句块。

```sh
echo -e "A line 1\nA line 2" | awk 'BEGIN{ print "Start" } { print } END{ print "End" }'
Start
A line 1
A line 2
End
```

### awk 内置变量

awk 命令除了运行步骤之外，还包括以下内置变量，方便我们在代码中进行引用。

```sh
**$n**  当前记录的第n个字段，比如n为1表示第一个字段，n为2表示第二个字段。
**$0**  这个变量包含执行过程中当前行的文本内容。
[N]  **ARGC**  命令行参数的数目。
[G]  **ARGIND**  命令行中当前文件的位置（从0开始算）。
[N]  **ARGV**  包含命令行参数的数组。
[G]  **CONVFMT**  数字转换格式（默认值为%.6g）。
[P]  **ENVIRON**  环境变量关联数组。
[N]  **ERRNO**  最后一个系统错误的描述。
[G]  **FIELDWIDTHS**  字段宽度列表（用空格键分隔）。
[A]  **FILENAME**  当前输入文件的名。
[P]  **FNR**  同NR，但相对于当前文件。
[A]  **FS**  字段分隔符（默认是任何空格）。
[G]  **IGNORECASE**  如果为真，则进行忽略大小写的匹配。
[A]  **NF**  表示字段数，在执行过程中对应于当前的字段数。
[A]  **NR**  表示记录数，在执行过程中对应于当前的行号。
[A]  **OFMT**  数字的输出格式（默认值是%.6g）。
[A]  **OFS**  输出字段分隔符（默认值是一个空格）。
[A]  **ORS**  输出记录分隔符（默认值是一个换行符）。
[A]  **RS**  记录分隔符（默认是一个换行符）。
[N]  **RSTART**  由match函数所匹配的字符串的第一个位置。
[N]  **RLENGTH**  由match函数所匹配的字符串的长度。
[N]  **SUBSEP**  数组下标分隔符（默认值是34）。
```

如：打印每一行最后匹配到的字段

```sh
echo -e "line1 f2 f3\n line2 f4 f5" | awk '{print $NF}'
f3
f5
```

### awk 命令实战

使用外部变量

```sh
var1="aaa"
var2="bbb"
echo | awk '{ print v1,v2 }' v1=$var1 v2=$var2
```

使用条件运算符

```sh
awk 'BEGIN{a=11;if(a >= 9){print "ok";}}'
ok
```

打印偶数行数据

```sh
cat text.txt
a
b
c
d
e

awk 'NR%2==1{next}{print NR,$0;}' text.txt
2 b
4 d
```

查找字符串，使用 index 内置函数

```sh
awk 'BEGIN{info="this is a test2010test!";print index(info,"test")?"ok":"no found";}'
ok
```

:::tip awk 总结

awk 提供了可编程的方法去操作文件，通过正则表达式、四则运算、条件判断、循环语句等多种方式去控制最终的输出；除此之外，awk 也有自己的生命周期 begin、print、end，让我们在操作文件时更加自如。
:::

## cut 命令

cut 命令 用来显示行中的指定部分，删除文件中指定字段。cut 经常用来显示文件的内容。

该命令有两项功能：

- 其一是用来显示文件的内容，它依次读取由参数 file 所指 明的文件，将它们的内容输出到标准输出上。
- 其二是连接两个或多个文件，如 cut fl f2 > f3 将把文件 fl 和 f2 的内容合并起来，然后通过输出重定向符“>”的作用，将它们放入文件 f3 中。

语法

```sh
cut（选项）（参数）
```

选项

```sh
-b：仅显示行中指定直接范围的内容；
-c：仅显示行中指定范围的字符；
-d：指定字段的分隔符，默认的字段分隔符为“TAB”；
-f：显示指定字段的内容；
-n：与“-b”选项连用，不分割多字节字符；
--complement：补足被选择的字节、字符或字段；
--out-delimiter= 字段分隔符：指定输出内容是的字段分割符；
--help：显示指令的帮助信息；
--version：显示指令的版本信息。
```

### cut 命令实战

案例 1：有一个学生报表信息，包含 No、Name、Mark、Percent：

```sh
[root@localhost text]# cat test.txt
No Name Mark Percent
01 tom 69 91
02 jack 71 87
03 alex 68 98
```

使用 -f 选项提取指定字段（这里的 f 参数可以简单记忆为 --fields 的缩写）：

```sh
[root@localhost text]# cut -f 1 test.txt
No
01
02
03
[root@localhost text]# cut -f2,3 test.txt
Name Mark
tom 69
jack 71
alex 68
```

案例 2：打印文件的前几列内容

```sh
[root@localhost text]# cat test.txt
abcdefghijklmnopqrstuvwxyz
abcdefghijklmnopqrstuvwxyz
abcdefghijklmnopqrstuvwxyz
abcdefghijklmnopqrstuvwxyz
abcdefghijklmnopqrstuvwxyz
```

打印第 1 个到第 3 个字符

```sh
[root@localhost text]# cut -c1-3 test.txt
abc
abc
abc
abc
abc
```

打印前 2 个字符

```sh
[root@localhost text]# cut -c-2 test.txt
ab
ab
ab
ab
ab
```

打印从第 5 个字符开始到结尾

```sh
[root@localhost text]# cut -c5- test.txt
efghijklmnopqrstuvwxyz
efghijklmnopqrstuvwxyz
efghijklmnopqrstuvwxyz
efghijklmnopqrstuvwxyz
efghijklmnopqrstuvwxyz
```

:::tip cut 命令总结

cut 命令可以对当前文件的裁剪，也可以合并多个文件内容，但操作文件具有局限性，只能按列操作内容，功能没有 sed 和 awk 命令强大。
:::

## 参考链接

- [sed 命令](https://wangchujiang.com/linux-command/c/sed.html)
- [awk 命令](https://wangchujiang.com/linux-command/c/awk.html)
- [cut 命令](https://wangchujiang.com/linux-command/c/cut.html)
