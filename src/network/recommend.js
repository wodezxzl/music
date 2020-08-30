import { commonParams } from './config'
import { request } from './axios'

const getSign = require('./getSign')

// 1.获取轮播图数据
export function getRecommendSwiper() {
  const url = './api/swiper'
  const datas = {
    comm: { ct: 24 },
    category: {
      method: 'get_hot_category',
      param: { qq: '' },
      module: 'music.web_category_svr',
    },
    recomPlaylist: {
      method: 'get_hot_recommend',
      param: { async: 1, cmd: 2 },
      module: 'playlist.HotRecommendServer',
    },
    playlist: {
      method: 'get_playlist_by_category',
      param: { id: 8, curPage: 1, size: 40, order: 5, titleid: 8 },
      module: 'playlist.PlayListPlazaServer',
    },
    new_song: {
      module: 'newsong.NewSongServer',
      method: 'get_new_song_info',
      param: { type: 5 },
    },
    new_album: {
      module: 'newalbum.NewAlbumServer',
      method: 'get_new_album_info',
      param: { area: 1, sin: 0, num: 20 },
    },
    new_album_tag: {
      module: 'newalbum.NewAlbumServer',
      method: 'get_new_album_area',
      param: {},
    },
    toplist: {
      module: 'musicToplist.ToplistInfoServer',
      method: 'GetAll',
      param: {},
    },
    focus: {
      module: 'music.musicHall.MusicHallPlatform',
      method: 'GetFocus',
      param: {},
    },
  }
  let sign = getSign(datas)
  const data = Object.assign(
    {},
    {
      sign,
      g_tk: 5381,
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
