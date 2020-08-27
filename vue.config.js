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
      '/api/getSongUrl': {
        target: 'https://u.y.qq.com/cgi-bin/musics.fcg',
        changeOrigin: true,
        bypass: function(req) {
          req.headers.referer = 'https://y.qq.com/portal/player.html'
          req.headers.origin = 'https://y.qq.com'
        },
        pathRewrite: {
          '^/api/getSongUrl': '',
        },
      },
      '/api/lyric': {
        target: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
        changeOrigin: true,
        bypass: function(req) {
          req.headers.referer = 'https://y.qq.com/portal/player.html'
          req.headers.origin = 'https://y.qq.com'
        },
        pathRewrite: {
          '^/api/lyric': '',
        },
      },
      '/api/recommendSongUrl': {
        target:
          'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
        changeOrigin: true,
        bypass: function(req) {
          req.headers.referer =
            'https://y.qq.com/n/yqq/playlist/7647706897.html'
          req.headers.origin = 'https://y.qq.com'
        },
        pathRewrite: {
          '^/api/recommendSongUrl': '',
        },
      },
      '/api/getRank': {
        target: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
        changeOrigin: true,
        bypass: function(req) {
          req.headers.referer = 'https://i.y.qq.com/n2/m?tab=toplist'
          req.headers.origin = 'https://i.y.qq.com'
        },
        pathRewrite: {
          '^/api/getRank': '',
        },
      },
      '/api/search': {
        target: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',
        changeOrigin: true,
        bypass: function(req) {
          req.headers.referer =
            'https://i.y.qq.com/n2/m/index.html?tab=recommend'
          req.headers.origin = 'https://i.y.qq.com'
        },
        pathRewrite: {
          '^/api/search': '',
        },
      },
    },
  },
}
