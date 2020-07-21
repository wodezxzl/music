module.exports = {
  configureWebpack: {
    resolve: {
      extensions: ['.less'],
      alias: {
        assets: '@/assets',
        common: '@/common',
        components: '@/components',
        network: '@/network',
        views: '@/views',
      },
    },
  },
}
