# Linux 快捷键

## 终端快捷键

- ctrl + a/e 回到命令行的开头和结尾。
- ctrl + u/k 剪切光标前/后 所有单词。
- ctrl + y 撤销上个操作。
- ctrl + w 删除光标前一个单词。
- ctrl + h 删除光标位置的前一个字符。
- ctrl + c 结束正在运行的程序。
- ctrl + d 结束输入或退出 shell。
- ctrl + s 暂停屏幕输出。
- ctrl + q 恢复屏幕输出。
- ctrl + l 清屏，等同于 clear。

## iTerm2 快捷键

- command + ; 显示使用过的命令。
- command + shift + h 弹出历史记录窗口。
- Command + d 水平切分，⌘+Shift+d 垂直切分。
- command + Option + e 全屏展示所有的 tab，可以搜索。
- Command + / 找到光标。

## linux 命令

- open 命令

打开文件夹

```sh
open .
```

- scp 命令

```sh
scp index.html root@xxx:/root/mytest/
```

- grep 过滤

查找 a 开头的文件或文件夹。

```sh
ls | grep ^a
```

- ps 命令

显示进程信息

```sh
ps -ef #显示所有命令，连带命令行
```

- kill 命令

杀死单个进程

```sh
kill 12345
```

- pkill 命令

按照进程名杀死进程

```sh
pgrep -l Safari
pkill Safari
```

- w 命令

显示已经登陆系统的用户列表，并显示用户正在执行的指令

```sh
w
```

- mkdir 命令

创建一个文件夹，可以使用 `mkdir -p xxx/xxx` 创建多层级的文件夹。

## 网络管理

查看和配置网络基本信息

- ifconfig
- ip

排查网络故障

- tracerout

找到占用网络端口的进程

- ss
- netstat

```js
netstat -an | grep ':80'
```

查看域名对应的 ip 地址

- nslookup

```js
nslookup lmjben.com
```
