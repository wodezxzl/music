// import { commonParams } from '@/network/config'
import { request } from '@/network/axios'

const getSign = require('./getSign')

// 1.获取歌曲真实地址
export function getSongRealAddress(songmid) {
  const url = '/api/getSongUrl'
  // 先将data参数保存
  let datas = {
    req: {
      module: 'CDN.SrfCdnDispatchServer',
      method: 'GetCdnDispatch',
      param: { guid: '6631025311', calltype: 0, userip: '' },
    },
    req_0: {
      module: 'vkey.GetVkeyServer',
      method: 'CgiGetVkey',
      param: {
        guid: '6631025311',
        songmid: [songmid],
        songtype: [0],
        // 这里0为字符串,不是数字,不然请求不到数据
        uin: '0',
        loginflag: 1,
        platform: '20',
      },
    },
    comm: { uin: 0, format: 'json', ct: 24, cv: 0 },
  }
  // 通过算法获取sign
  let sign = getSign(datas)
  const data = Object.assign(
    {},
    {
      '-': 'getplaysongvkey39107298455762174',
      g_tk: 5381,
      sign,
      loginUin: 0,
      hostUin: 0,
      format: 'json',
      inCharset: 'utf8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'yqq.json',
      needNewCode: 0,
      data: datas,
    },
  )
  return request({
    url,
    params: data,
  })
}
