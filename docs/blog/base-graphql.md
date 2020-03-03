# GraphQL 使用总结

GraphQL 是一种 API 查询语言，也是一种用于实现数据查询的运行时，他和传统的 Restful 方式不一样，后端要返回的数据可以由前端来进行控制。

- GraphQL 的历史
- GraphQL 核心知识
- GraphQL 小实战

## GraphQL 的历史

在很长一段时间，包括现在，大多数的接口还是采用的 RestFul 接口方式，这非常符合我们的思维方式，RestFul 通过将接口分成不同的 controller、action 等方式来将接口进行归纳，通过制定一套标准的接口返回格式来规范前后端之间的交互。

我们仔细思考一下，RestFul 其实更多的是通过前后端的“约定”来管理接口，如果程序员不按照这个约定呢？可能就会出问题，常见的问题分为以下几类：

- 数据过量获取
- 数据获取不足
- 接口太多难以管理
- 接口返回值不按规范进行
- 一个页面需要调用多个接口才能获取全部的数据

已上几个问题相信大家也会经常遇见，虽然处理很简单，但沟通成本实在是太大，如果前端只是发现一个字段名不正确，也需要后端配合修改发布上线，才能解决。

好在 GraphQL 看到了 RestFul 的痛点，专注于接口查询，制定了一套自己的接口规范，让客户端可以根据需要，自己定制化需要返回的数据。

举一个简单的例子，我们发一个 get 请求，只要提供 query 参数，就可以根据提供的参数得到对应的数据格式。

```js
// 请求 header
query {
    person(personId:7){
        name,
        age
    }
}
// 响应
// {
//     name:'lmjben',
//     age:26
// }
```

## GraphQL 核心知识

GraphQL 中最重要的概念就是 Schema，Schema 表示的是接口的类型，也就是前后端接口的一个约定，这个约定通常是写在一个单独文件中，也即是 `.graphql` 的文件。

定义好 Schema 之后，前后端就会严格按照这个 Schema 进行请求和响应。

例如：如果我们的数据库中有一个学生表，我们可以定义一个对象类型去表示这个表中的字段，除此之外，我们可以扩展一些方法（根据学生的分数判断是否优秀）。

除此之外，在 GraphQL 中还包含有以下几种类型。

```graphql
# 内置标量类型：Int、Float、String、Boolean、ID

# 自定义标量类型
type Student {
  name: String
  age: Int
  sex: Boolean
  isGood(grade):Boolean
}

# 自定义标量类型
type Photo {
  url:String
  size:Int
  type:PhotoType
  postedBy:Student
}

# 枚举类型
enum PhotoType {
  SELFLE
  ACTION
}

# 查询类型
type Query {
  allStudents:[Student]
  allPhotos:[Photo]
}

# 变更类型
type Mutation {
  postPhoto(input: PostPhotoInput): Photo
}

# 输入类型
input PostPhotoInput {
  url:String
}

# 订阅类型
type Subscription {
  newPhoto:Photo
  newStudent:Student
}
```

在上述的类型中，有 3 个比较重要的类型，他们分别是：Query、Mutation、Subscrition，只有它们才能作为每一个 GraphQL 查询的入口（也就是 get 请求上携带的参数）。

### Query

一个 query 即表示一次查询，同时也可以支持嵌套。

例如：我们发送 allPhotos 去查询所有的照片，同时嵌套了一层 postedBy 查询，就可以找到照片的上传者。

```graphql
query {
  allPhotos {
    url
    postedBy {
      name
    }
  }
}
```

后端在接收到客户端的请求之后，使用对应的 Resolver 返回对应的所有照片，然后根据 postedBy 中存放的学生 id，找到对应的学生信息，然后一并进行返回，对应的配置如下。

```js
const students = [];
const photos = [];
const resolver = {
  Query: {
    allPhotos: () => {
      return photos;
    }
  },
  Photo: {
    postedBy: photo => {
      return students.find(item => item.id === photo.postedBy);
    }
  }
};
```

### Mutation

GraphQL 除了强大的查询系统之外，还提供了 Mutation 变更，其实就是告诉服务器，想要修改数据，类似于 RestFul 中的 put。

例如，上传一个图片，并返回上传好的图片 size，需要发送如下 header。

```js
mutation {
  postPhoto(url:'https://baidu.com/defaul.png'){
    url,
    size
  }
}
```

如果是上传多个参数，需要拼接非常多的字符串操作，Mutation 给我们提供了简便方法，即通过配合输入类型，让传参更加方便。

例如：上传数据时的查询体中只发送占位符，上传的内容单独放在 variables 字段中。

```js
mutation postPhoto($input: PostPhotoInput){
  postPhoto(url:$input.url){
    url,
    size
  }
}
// 参数单独存放
// http://xx.com/graphql?variables={input:{url:"https://baidu.com/defaul.png"}}
```

### Subscrition

Subscrition 和其他类型类似，不同点在于它表示订阅，也就是说，如果在 Subscrition 中定义了查询内容，就通过 webSocket 和前后端建立了一个双向数据通道，每当数据有变动，就可以自动向客户端推送。

例如：上面我们已经定义了 Subscrition 类型，接下来我们定义一个 action 类型的照片，当新的 action 类型的照片插入时，则会通知其他查询刷新数据。

```graphql
subscription{
  newPhoto(type:'ACTION'){
    url
    size
  }
}
```

对应的 Resolver 配置如下。

```js
const resolver = {
  Mutation: {
    postPhoto: async (parent, args, { pubsub }) => {
      // 上传图片时触发更新
      pubsub.publish("photo-add");
    }
  },
  Subscription: {
    newPhoto: {
      // 监听 photo-add 事件，并实时向客户端推送
      subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator("photo-add");
      }
    }
  }
};
```

## GraphQL 小实战

接下来我们通过 Apollo 和 Express 来搭建一个 GraphQL 服务器端。

步骤如下：

- 定义 GraphQL 类型
- 使用 Apollo 启动一个服务
- 编写处理 GraphQL 类型的方法：Resolver

### 首先定义 GraphQL 类型

第一步就是定义 GraphQL 类型，往往是前后端一起商量之后的结果，定义好类型之后，双方就可以根据这个类型并行开发，互不影响。

```graphql
# 自定义标量类型
type Student {
  name: String
  age: Int
  sex: Boolean
  grade: Int
  isGood: Boolean
}

# 自定义标量类型
type Photo {
  url: String
  size: Int
  type: PhotoType
  postedBy: Student
}

# 枚举类型
enum PhotoType {
  SELFLE # 自拍类型
  ACTION # 动作类型
}

# 查询类型
type Query {
  allStudents(id: Int): [Student]
  allPhotos: [Photo]
}

# 变更类型
type Mutation {
  postPhoto(input: PostPhotoInput): Photo
}

# 输入类型
input PostPhotoInput {
  url: String
}

# 订阅类型
type Subscription {
  newPhoto: Photo
}
```

### 启动一个 GraphQL 服务

接下来我们启动一个支持 GraphQL 的 web 服务。

我们使用 apollo-server-express 可以非常方便的创建一个 graphql 环境。

```js
const express = require("express");
const { ApolloServer, PubSub } = require("apollo-server-express");
const server = new ApolloServer();
const app = express();
server.applyMiddleware({ app });
httpServer.listen({ port: 4000 }, () =>
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
);
```

### 编写 Resolver 处理 GraphQL 类型

接下来编写 Resolver 处理 GraphQL 类型对应的业务逻辑，并返回对应类型的数据。

```js
const students = [];
const photos = [];
// 匹配处理方法
const resolvers = {
  Query: {
    // 第一个参数为父查询集，因为可能是在嵌套调用
    // 第二个参数为查询集传的参数
    // 第三个参数是在初始化 ApolloServer 时注入的对象
    allStudents: (parent, args, yy) => {
      return students;
    },
    allPhotos: () => {
      return photos;
    }
  },
  Mutation: {
    // 第一个参数为父查询集，因为可能是在嵌套调用
    // 第二个参数为查询集传的参数
    // 第三个参数是在初始化 ApolloServer 时注入的对象
    postPhoto: (parent, args, { pubsub }) => {
      return photos[0];
    }
  },
  Student: {
    isGood: parent => {
      return parent.grade > 90;
    }
  },
  Photo: {
    postedBy: photo => {
      return students.find(item => item.id === photo.postedBy);
    }
  }
};
const typeDefs = fs.readFileSync("./typeDefs.graphql", {
  encoding: "utf-8"
});
const server = new ApolloServer({
  typeDefs, // 我们定义的 type 文件
  resolvers // type 对应的处理方法
});
```

编写好这三步之后，我们的一个 GraphQL Api 就已经完成了，是不是很简单。完整的代码可以在下方链接中找到。

## 参考资料

[graphql-demo](https://github.com/lmjben/graphql-demo)
