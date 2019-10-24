# Docker 使用总结

最近在学习 Docker，并用 Docker 重新部署了[cdfang-spider](https://github.com/lmjben/cdfang-spider)项目，使用 docker 后确实大幅度地降低了部署难度。如果你也想用 Docker 来部署自己的项目，那就让我们一起往下看。

本文通过以下 3 个方面来聊聊 Docker：

- Docker 发展史。
- Docker 基础。
- Docker 项目实战。

## Docker 发展史

### 上古时代

在很久以前，发布一个 App 应用，应该是这样的。首先购买一台物理服务器，然后手动安装对应的操作系统，搭建 App 应用运行环境，部署 App 应用，最后才能被其他人访问。这样做看似没毛病，但可能会造成几个问题：

- 部署非常慢。
  - 购买物理服务器到收货需要时间。
  - 手动安装操作系统需要时间。
  - 安装 App 应用以及对应的环境需要时间。
- 成本非常高。
  - 物理服务器很贵。
- 资源浪费。
  - 如果项目很小，不能充分利用这台服务器的资源。
- 难于迁移和扩展。
  - 如果 CPU，内存，硬盘不够，只能加物理设备，但这个是有上限的。
- 可能会被限定硬件厂商。

### 虚拟化时代

为了解决物理设备的诸多问题，出现了虚拟机。虚拟机出现之后大大地降低了部署难度，要想部署一个应用程序，新建一个虚拟机就可以了，还可以根据应用程序的大小，分配合适的系统资源。

虚拟技术有以下几个特点：

- 一个物理机的资源分配到了不同的虚拟机里。
- 很容易扩展，加物理机 / 虚拟机。
- 很容易云化，阿里云，AWS 等。

虚拟化技术实现了**物理层的隔离**，但却还有以下问题：

- 每一个虚拟机都是一个完整的操作系统，每次新建都得手动安装一遍。
- 虚拟机中的项目环境每次也需要重新安装。
- 虚拟机本身消耗的系统资源也比较多。

### 容器化时代

为了更方便的部署项目，出现了容器化技术，主要有以下几个特点：

- 实现应用程序及其环境打包。
- 实现应用之间相互隔离、共享同一个操作系统内核。
- 容器本身比较轻，相比虚拟机，占用的系统资源更少。

Docker 是容器化技术的一种，也是最流行的一个。Docker 提供了一种隔离机制，它将不同应用程序的依赖项和库打包在一起，运行在不同的容器中，从而实现**应用层的隔离**。

:::tip
容器化技术大都是基于 Linux 内核提供的两个机制：Cgroups（实现资源按需分配）和 Namespace（实现任务隔离）。
:::

### 虚拟化 vs 容器化

虚拟化和容器化都是目前主流的的部署技术，两者之间的差别如下：

- 虚拟机技术已经发展了很多年，配套技术和标准都已经标准化了，而容器最近几年才兴起，配套技术和标准还在完善中。
- 虚拟机由于有 GuestOS(虚拟机操作系统) 存在，可以和宿主机运行不同 OS，而容器只能支持和宿主机内核相同的操作系统，隔离性相对较差。
- 容器比虚拟机明显更轻量级，对宿主机操作系统而言，容器就跟一个进程差不多。因此容器有着更快的启动速度、更方便的集群管理等优点。同时由于没有 GuestOS 存在，在容器中运行应用和直接在宿主机上几乎没有性能损失，性能上优于虚拟机。

## Docker 基础

Docker 的核心是在 Docker Engine 层实现应用层的隔离。

| Docker 分层              |
| ------------------------ |
| Application（应用层）    |
| Container（容器层）      |
| Docker Engine (隔离层)   |
| Host OS 操作系统         |
| infrastructure(基础设施) |

Docker 分为 Client 和 Server 两个部分，我们在 Client 中执行 Docker 命令，最后创建的 Container 和 Image 则会在 Server 中运行。Dcoker 架构如下图所示：

![Docker 架构](devops-docker.png)

### Image

Image 主要用来打包应用程序以及它的依赖环境，为 Container 提供必要的环境以及安装好的应用程序。Image 本身并不能执行，只能通过 Container 去运行。

Image 主要有以下几点特征：

- 文件和 meta data 的集合（root filesystem）。
- 分层的，并且每一层都可以添加改变删除文件，成为一个新的 Image。
- 不同 Image 可以共享相同的底层。
- Image 本身是只读的。

Image 可以通过 Dockerfile 去构建，也可以通过 DockerHub 上去拉取。

:::tip
Dockerfile 是一个文本文件，其中包含构建 Image 的所有命令。Docker 可以通过 `docker build` 从 Dockerfile 中读取命令来自动构建 Image。常用配置信息可以参考下文 Dockerfile 文件中的注释，也建议大家阅读官方文档 [Dockerfile reference](https://docs.docker.com/engine/reference/builder/)
:::

### Container

Container 是运行 Image 的实例，通过 `docker run image`即可启动并运行一个 Container。

Container 主要有以下几点特征：

- 通过 Image 创建。
- 在 Image 之上建立一个 Container 层（可读写）。
- 类比面向对象：类(Image) 和实例(Container)。
- Image 负责 App 的存储和分发，Container 负责运行 App。

### Networks

使用 Dcoker 部署项目常常会生成很多个容器，这些容器默认只能通过 ip 地址进行访问，但新建一个容器所产生的 ip 地址是不可控的，这就给容器之间通信带来了一定的麻烦。Docker 中使用 Network 来管理容器之间的通信，只要两个 Conteiner 处于同一个 Network 之中，就可以通过容器名去互相通信。

Docker 中内置 5 中类型的 Network :

- bridge（相同 bridge 中的 container 可以相互访问）。
- host(将 container 与宿主机的网络相连通，虽然很直接，但是却破获了 container 的隔离性)。
- none 禁用所有网络。
- overlay 集群使用。
- macvlan。

除了这 5 中 Network 之外，用户也可以自定义编写 Network Plugin。

### Docker Compose

Docker Compose 是一个工具，这个工具可以通过一个 yml 文件定义多容器的 Docker 应用。通过一条命令就可以根据 yml 文件的定义去创建或者管理多个容器。接下来分别使用命令行和 Docker Compose 的方式来对比一下创建容器的方式。

#### 不使用 Docker Compose 创建容器

```shell
docker pull lmjben/cdfang-spider
docker pull mongo
docker network create webapp-network
docker run -d --network webapp-network -v ~/data/db:/data/db mongo
docker run -p 8082:8082 --network webapp-network -d lmjben/cdfang-spider
```

可见，手动创建容器，需要在命令行中手动执行很多命令，这些命令一旦敲错了，就得重来，不便于容器的管理。

#### 使用 Docker Compose 创建容器

1、新建 docker-compose.yml 文件。

```yml
version: '3.7'
services:
  database:
    image: mongo
    restart: always
    volumes:
      - ~/data/db:/data/db
    networks:
      - webapp-network
  web:
    image: lmjben/cdfang-spider
    depends_on:
      - database
    ports:
      - 8082:8082
    networks:
      - webapp-network
networks:
  webapp-network:
    driver: bridge
```

2、运行 docker-compose

```shell
docker-compose up -d
```

可见，使用 Docker Compose 创建容器只需要提前编写好 yml 文件，然后执行一条命令就行了，比起手动敲命令，更加方便。

除此之外，Docker Compose 还可以使用 `docker-compose -scale` 扩展多个相容的容器，用来实现负载均衡，可以扩容，也可以减容。例如：实现无缝部署项目，先扩容一个新的 Container，当 Container 启动完毕后，加入到集群中，然后更新老容器，更新完后再加入集群中。

#### Docker Compose 配置

Docker Compose 的配置文件一般定义在 `docker-compose.yml` 文件中，主要的配置项如下：

- services
  - 一个 service 代表一个 container，这个 container 可以从 dockerHub 中的镜像来创建，也可以使用本地 dockerfile build 出来的镜像来创建。
  - service 的启动类似 `docker run`，可以给 service 指定 network 和 volume 的引用。
- networks
  - 定义 networks ，相当于执行 `docker network create xxxx`。
- volumes
  - 定义 volume ，相当于执行 `docker volume create xxx`。

更多配置项可以参考[官方文档 compose-file](https://docs.docker.com/compose/compose-file/)

## Docker 项目实战

接下来以 [cdfang-spider](https://github.com/lmjben/cdfang-spider) 项目为例，使用 Docker 部署项目。

### 全手动部署

1、编写 Dockerfile 文件。

```docker
# 加载基础镜像
FROM mhart/alpine-node

# 注释
LABEL maintainer = "lmjben <yinhengliben@gmail.com>"

# 创建工作目录
RUN rm -rf /app
RUN mkdir /app
WORKDIR /app

# 安装项目依赖
COPY . /app
RUN npm install
RUN npm run build
RUN mv ./dist/* ./

# 对外暴露端口
EXPOSE 8082

# 启动 Image 时执行命令
CMD BUILD_ENV=docker node app.js
```

2、通过 Dockerfile 文件构建 Image。

```shell
docker build -t lmjben/cdfang-spider .
```

3、拉取 mongo 官方 Image。

```shell
docker pull mongo
```

4、创建 network，让两个容器可以相互通信。

```shell
docker network create webapp-network
```

5、运行容器

```shell
docker run -d --network webapp-network -v ~/data/db:/data/db mongo
docker run -p 8082:8082 --network webapp-network -d lmjben/cdfang-spider
```

6、通过访问 localhost:8082 访问项目。

### 自动化部署

1、编写 Dockerfile 文件。

```docker
# 加载基础镜像
FROM mhart/alpine-node

# 注释
LABEL maintainer = "lmjben <yinhengliben@gmail.com>"

# 创建工作目录
RUN rm -rf /app
RUN mkdir /app
WORKDIR /app

# 安装项目依赖
COPY . /app
RUN npm install
RUN npm run build
RUN mv ./dist/* ./

# 对外暴露端口
EXPOSE 8082

# 启动 Image 时执行命令
CMD BUILD_ENV=docker node app.js
```

2、在 dockerHub 上授权 github 项目，这样当 github 项目有更新时，会自动执行 Dockerfile 进行构建，并将构建结果保存到 dockerHub 仓库中。

3、编写 docker-compose.yml 文件。

```yml
version: '3.7'
services:
  database:
    image: mongo
    restart: always
    volumes:
      - ~/data/db:/data/db
    networks:
      - webapp-network
  web:
    image: lmjben/cdfang-spider
    depends_on:
      - database
    ports:
      - 8082:8082
    networks:
      - webapp-network
networks:
  webapp-network:
    driver: bridge
```

4、一键启动，确保已安装 docker-compose。

```shell
docker-compose up -d
```

5、通过访问 localhost:8082 访问项目。

## 总结

通过 Docker 部署完项目后，感受很不错，主要分以下几点：

- 使用 Docker Compose 一键启动项目。
- 再也不用在服务器上安装各种杂七杂八的环境，全部封装到 Image 里，启动一个 Container 跑起来就行了，不用的时候直接删除 Container 就行了，服务器上不会受到任何污染。
- 对于耗时的 Image 构建过程，直接交给 dockerHub 去自动构建。

:::tip
本项目使用单机部署，即所有的容器都在同一台服务器上。除此之外，docker 还支持分布式容器部署，可以使用 docker swarm 或者 kubernetes 来管理，目前还在学习中，争取早日整理好分享给大家，感谢大家支持！
:::
