module.exports = {
  title: 'yhlben',
  description: '欢迎来到我的空间',
  themeConfig: {
    repo: 'yhlben/blog',
    nav: [{
      text: '关于',
      link: '/about'
    }],
    sidebar: [
      {
        title: '博客',
        collapsable: false,
        children: [
          '/blog/node',
           '/blog/base-select',
           '/blog/base-sort',
           '/blog/docker-demo',
           '/blog/functional',
           '/blog/design-pattern',
           '/blog/graph-http',
           '/blog/high-algorithm',
           '/blog/http',
           '/blog/interview',
           '/blog/js_inherit',
           '/blog/js-form',
           '/blog/linux',
           '/blog/nginx-conf',
           '/blog/observer',
           '/blog/performance',
           '/blog/redux',
           '/blog/rxjs',
           '/blog/senior-sort',
           '/blog/structure',
        ]
      },
      {
        title: '生活',
        children: [ 
          '/life/2018-06-17'
        ]
      }
    ],
    lastUpdated: 'Last Updated', 
  }
}
