# Linux 免密登录配置

这一节来实战一个免密登录，配置好之后，直接通过 `ssh + 服务器名`就能连接到远程计算机。

- 基本配置
- 进阶配置

## 基本配置

### 1、生成密钥

```sh
cd ~/.ssh/
ssh-keygen -t rsa -C "my_name" -f "my_key"
# 这一步会生成 my_key.pub（公钥） my_key(私钥)
```

### 2、将公钥放在目标服务器上

```sh
scp ./my_key.pub root@192.168.1.1:/root/.ssh/
# 这里使用 scp 命令远程复制公钥
# 注意要存放在登录用户所在目录的 .ssh 文件夹里，这里使用 root 用户登录，故存在 root 用户的用户目录。
```

### 3、将公钥存放进目标服务器 authorized_keys 里

```sh
cat my_key.pub >> authorized_keys
```

### 4、5、使用免密登录

```sh
ssh -i ~/.ssh/my_key root@192.168.1.1
# -i 指定私钥的路径
```

基本配置已经完成了，但每一次连接都得手动指定本机的私钥地址，能不能省略这一步呢？

## 进阶配置

进阶配置中，我们要配置本地 .ssh 下的 config 文件，实现自动登录，而不需要手动指定私钥地址。

### 1、进入 config 文件

```sh
cd ~/.ssh/
vi config
```

### 2、编辑 config 文件

```sh
User root
Host aliyun
HostName 192.168.1.1
Port 22
StrictHostKeyChecking no
IdentityFile ~/.ssh/my_key
IdentitiesOnly yes
Protocol 2
Compression yes
ServerAliveInterval 60
ServerAliveCountMax 20
LogLevel INFO
```

### 3、配置完成，体验一下吧

```sh
ssh aliyun
```

### 4、配置多个服务器登录

```sh
Host aliyun
    User root
    HostName 192.192.192.22
    Port 22
    StrictHostKeyChecking no
    IdentityFile ~/.ssh/my_key
    IdentitiesOnly yes
    Protocol 2
    Compression yes
    ServerAliveInterval 60
    ServerAliveCountMax 20
    LogLevel INFO

Host fanqiang
    User root
    HostName 192.192.192.23
    Port 22
    StrictHostKeyChecking no
    IdentityFile ~/.ssh/my_key
    IdentitiesOnly yes
    Protocol 2
    Compression yes
    ServerAliveInterval 60
    ServerAliveCountMax 20
    LogLevel INFO
```

### 5、使用免密登录

```sh
ssh aliyun
ssh fanqiang
```

:::tip 提示
文中的 ip 地址是为了演示，具体的 ip 需要根据服务器真实 ip 来定。
:::
