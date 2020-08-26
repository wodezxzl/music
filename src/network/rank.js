import { request } from '@/network/axios'
import jsonp from '@/network/jsonp'
import { options } from '@/network/config'

export function getRank() {
  const url = '/api/getRank'
  const data = {
    comm: {
      g_tk: 5381,
      uin: '',
      format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      ct: 23,
      cv: 0,
    },
    topList: {
      module: 'musicToplist.ToplistInfoServer',
      method: 'GetAll',
      param: {},
    },
  }
  return request({
    url,
    params: {
      data,
    },
  })
}

// 获取具体排行榜歌曲信息
export function getRankSong(topId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  const data = {
    g_tk: 5381,
    uin: 0,
    format: `json`,
    inCharset: `utf-8`,
    outCharset: `utf-8¬ice=0`,
    platform: `h5`,
    needNewCode: 1,
    tpl: 3,
    page: `detail`,
    type: `top`,
    topid: `${topId}`,
  }
  return jsonp(url, data, options)
}
