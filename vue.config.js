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
  // 代理请求
  devServer: {
    port: 8080,
    proxy: {
      '/api/getSongsList': {
        target: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
        changeOrigin: true,
        bypass: function(req) {
          req.headers.referer = 'https://c.y.qq.com/'
          req.headers.host = 'c.y.qq.com'
        },
        pathRewrite: {
          '^/api/getSongsList': '',
        },
      },
    },
  },
}
