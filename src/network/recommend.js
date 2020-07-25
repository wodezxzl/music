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
