import jsonp from './jsonp'
import { commonParams, options } from './config'
import { request } from './axios'

// 1.获取轮播图数据
export function getRecommendSwiper() {
  const url =
    'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1,
  })

  return jsonp(url, data, options)
}

// 2.获取歌单数据
export function getSongsList() {
  const url = '/api/getSongsList'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json',
  })
  return request({
    url,
    params: data,
  })
}

// 3.获取推荐页歌单歌曲列表(没有播放地址)
export function getRecommendSongsList(disstid) {
  const url = '/api/recommendSongUrl'
  const data = Object.assign(
    {},
    {
      type: 1,
      json: 1,
      utf8: 1,
      onlysong: 0,
      new_format: 1,
      disstid: `${disstid}`,
      g_tk_new_20200303: 5381,
      g_tk: 5381,
      loginUin: 0,
      hostUin: 0,
      format: 'json',
      inCharset: 'utf8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'yqq.json',
      needNewCode: 0,
    },
  )
  return request({
    url,
    params: data,
  })
}
