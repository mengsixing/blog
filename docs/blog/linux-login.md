# Linux 免密登录配置

## 基本

### 1、生成密钥

``` shell
cd ~/.ssh/
ssh-keygen -t rsa -C "my_name" -f "my_key"
# 这一步会生成 my_key.pub（公钥） my_key(私钥)
```

### 2、将公钥放在目标服务器上

``` shell
scp ./my_key.pub root@192.168.1.1:/root/.ssh/
# 这里使用scp命令远程复制公钥(注意要存放在登录用户所在目录的.ssh文件夹里，这里使用root用户登录，故存在root用户的用户目录)
```

### 3、将公钥存放进目标服务器authorized_keys里

``` shell
cat my_key.pub >> authorized_keys
```

### 4、这样就可以免密登录了

``` shell
ssh -i ~/.ssh/my_key root@192.168.1.1
# -i指定私钥的路径
```

## 进阶

配置本地.ssh 下的config 实现一键登录

### 1、进入config文件

``` shell
cd ~/.ssh/
vi config
```

### 2、编辑config文件

``` shell
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

### 3、现在可以一键登录了

``` shell
ssh aliyun
```

### 4、配置多个服务器登录

``` shell
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

### 5、现在可以免密登录多个服务器了

``` shell
ssh aliyun
ssh fanqiang
```

`注：192.168.1.1为测试服务器地址`
