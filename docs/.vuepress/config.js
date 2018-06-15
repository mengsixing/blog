module.exports = {
  title: 'My home',
  description: 'Just playing around',
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
          '/blog/node'
        ]
      },
      {
        title: '生活',
        children: [ 
        ]
      }
    ],
    lastUpdated: 'Last Updated', 
  }
}
