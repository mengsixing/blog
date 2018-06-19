module.exports = {
  title: 'yhlben',
  description: '欢迎来到我的空间',
  ga: 'UA-121061441-1',
  themeConfig: {
    repo: 'yhlben/blog',
    nav: [{
      text: '博客',
      link: '/blog/'
    }, {
      text: '日志',
      link: '/work/'
    }, {
      text: '关于',
      link: '/about'
    }],
    sidebar: {
      '/blog/': [
        'node',
        'base-select',
        'base-sort',
        'docker-demo',
        'functional',
        'design-pattern',
        'graph-http',
        'high-algorithm',
        'http',
        'interview',
        'js_inherit',
        'js-form',
        'linux',
        'nginx-conf',
        'observer',
        'performance',
        'redux',
        'rxjs',
        'senior-sort',
        'structure',
      ],
      '/work/': [
        '2018-06-19',
      ],
    },
    lastUpdated: '最后更新',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: '帮助我改善此页面！'
  }
}
