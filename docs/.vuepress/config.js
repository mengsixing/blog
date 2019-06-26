module.exports = {
  markdown: {
    lineNumbers: true
  },
  title: "yhlben的前端日志",
  description: "欢迎访问我的前端日志",
  ga: "UA-121061441-1",
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
          title: '项目相关',
          collapsable: false,
          children: [
            "project-docker",
            "project-git",
            "project-dependencies",
            "project-image",
            "project-performance",
            "project-commitlint",
            "project-test",
            "project-node",
            "project-webpack-entry",
            "project-webpack-flow",
            "project-webpack",
          ]
        },
        {
          title: '框架学习',
          collapsable: false,
          children: [
            "library-react",
            "libary-react-core",
            "library-react-ssr",
            'library-react-hooks',
            "library-vue",
            "library-miniProgram",
            "library-redux",
            "library-rxjs",
            "libary-koa",
          ]
        },
        {
          title: 'CSS 相关',
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
            "osi-web-security",
            "osi-hijack",
          ]
        },
        {
          title: '运维相关',
          collapsable: false,
          children: [
            'operation-web-login',
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
            "js-design-pattern",
          ]
        },
        {
          title: '编程基础',
          collapsable: false,
          children: [
            "base-functional",
            "base-structure",
            "base-structure-base-select",
            "base-structure-base-sort",
            "base-structure-high-algorithm",
            "base-structure-senior-sort",
          ]
        },
        {
          title: '实战 & 思考',
          collapsable: false,
          children: [
            "cdfang-spider",
            "2018",
            "frontend",
          ]
        },
        {
          title: '工具',
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
            "framework"
          ]
        },
        {
          title: '编程基础',
          collapsable: false,
          children: [
            "base",
            "suanfa"
          ]
        },
      ],
      "/book/": [
        {
          title: '技术相关',
          collapsable: false,
          children: [
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
  plugins: [
    ['@vuepress/back-to-top', true]
  ]
};
