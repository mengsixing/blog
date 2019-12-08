# 记录遇到的坑

## Linux sed 命令在 mac 上使用的坑

在 mac 上使用 sed -i 参数时会报错，解决方法如下：

```sh
sed -i 's/xxx/yyy/g' xxx.txt
```

修改为：

```sh
sed -i '' -e 's/xxx/yyy/g' xxx.txt
```

[参考链接](https://stackoverflow.com/questions/7573368/in-place-edits-with-sed-on-os-x)
