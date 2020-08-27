import jsonp from '@/network/jsonp'
import { commonParams, options } from '@/network/config'
import { request } from '@/network/axios'

// 获取热词
export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5',
  })

  return jsonp(url, data, options)
}

// 根据输入内容检索内容
// page是当前检索所在页数,zhida表示直达歌手页面
export function search(query, page, zhida, perpage) {
  const url = '/api/search'

  const data = Object.assign(
    {},
    {
      w: query,
      p: page,
      perpage,
      n: perpage,
      catZhida: zhida ? 1 : 0,
      zhidaqu: 1,
      t: 0,
      flag: 1,
      ie: 'utf-8',
      sem: 1,
      aggr: 0,
      remoteplace: 'txt.mqq.all',
      uin: 0,
      needNewCode: 1,
      platform: 'h5',
      format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
    },
  )

  return request({
    url,
    params: data,
  })
}
