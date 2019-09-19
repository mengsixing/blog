module.exports = {
  title: "yhlben的前端日志",
  description: "欢迎访问我的前端日志",
  ga: "UA-121061441-1",
  markdown: {
    lineNumbers: true
  },
  head: [
    ['link', { rel: 'icon', href: '/hero.jpeg' }]
  ],
  themeConfig: {
    repo: "yhlben/blog",
    nav: [
      {
        text: "博客",
        link: "/blog/"
      },
      {
        text: "面试题",
        link: "/interview/"
      },
      {
        text: "阅读",
        link: "/book/"
      },
    ],
    sidebar: {
      "/blog/": [
        {
          title: 'DevOps',
          collapsable: false,
          children: [
            "devops-kubernetes",
            "devops-docker",
            "devops-git",
            "devops-dependencies",
            "devops-image",
            "devops-performance",
            "devops-commitlint",
            "devops-test",
            "devops-webpack-entry",
            "devops-webpack-flow",
            "devops-webpack",
            "devops-cdfang-spider",
          ]
        },
        {
          title: 'Framework',
          collapsable: false,
          children: [
            "library-node",
            "library-react",
            "libary-react-core",
            "library-react-code-1",
            "library-react-code-2",
            "library-react-code-3",
            "library-react-code-4",
            "library-react-ssr",
            'library-react-hooks',
            "library-vue",
            "library-miniProgram",
            "library-redux",
            "library-react-redux-code",
            "library-rxjs",
            "library-koa",
            "library-koa-diy",
          ]
        },
        {
          title: 'CSS',
          collapsable: false,
          children: [
            "css",
            "css-next",
            "css-useful",
            "css-devicePixelRatio",
            "css-houdini-star",
          ]
        },
        {
          title: '网络协议',
          collapsable: false,
          children: [
            "osi-http",
            "osi-https",
            "osi-tcp",
            "osi-web-security",
            'osi-web-login',
            "osi-hijack",
          ]
        },
        {
          title: '运维相关',
          collapsable: false,
          children: [
            "operation-docker-micro-service",
            "operation-linux",
            "operation-linux-login",
            "operation-nginx-load-balancing",
          ]
        },
        {
          title: 'JS 基础',
          collapsable: false,
          children: [
            "js-principle",
            "js-promise",
            'js-this',
            'js-operator-priority',
            "js-jsBridge",
            "js-module",
            "js-inherit",
            "js-event",
            "js-form",
            "js-html5-program",
            "js-recursion",
            "js-object-ergodic",
          ]
        },
        {
          title: '编程基础',
          collapsable: false,
          children: [
            "base-ioc",
            "base-functional",
            "base-structure",
            "base-structure-base-select",
            "base-structure-base-sort",
            "base-structure-high-algorithm",
            "base-structure-senior-sort",
            "base-design-pattern",
            "base-computer"
          ]
        },
        {
          title: '总结思考',
          collapsable: false,
          children: [
            "2019-6",
            "2018",
            "frontend",
          ]
        },
        {
          title: '其它',
          collapsable: false,
          children: [
            "other-tools",
            "other-vscode",
          ]
        },
      ],
      "/interview/": [
        {
          title: '前端',
          collapsable: false,
          children: [
            "js",
            "css",
            "html",
            "framework",
            "2019-9"
          ]
        },
        {
          title: '编程基础',
          collapsable: false,
          children: [
            "base",
            "structure",
            "suanfa"
          ]
        },
      ],
      "/book/": [
        {
          title: '技术相关',
          collapsable: false,
          children: [
            "book-nodejs",
            "book-microfront",
            "book-webgl",
            "book-maintainable-js",
            "book-how-network-connect",
            "book-regular",
            "book-code",
            "book-http2",
            "book-http-graph"
          ]
        },
      ],
    },
    lastUpdated: "更新时间",
    docsDir: "docs",
    editLinks: true,
    editLinkText: "本文源码地址"
  },
  plugins: {
    '@vuepress/medium-zoom': {
      selector: 'img',
      options: {
          margin: 16
      }
    },
    '@vuepress/back-to-top':true
  }
};
