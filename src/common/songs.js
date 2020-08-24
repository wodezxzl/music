import { getLyric } from '@/network/songs'
import { getSongRealAddress } from '@/network/songs'
import { ERR_OK } from '@/network/config'
import { Base64 } from 'js-base64'

// 歌曲信息公共类
export default class Song {
  constructor({ id, mid, singer, name, album, duration, img, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.img = img
    this.url = url
  }

  // 1.获取歌词,并返回出去
  getLyric() {
    // 如歌已经有了歌词返回
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    // 否则返回一个promise,里面处理歌词获取情况
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.data.code === ERR_OK) {
          this.lyric = Base64.decode(res.data.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }

  // 2.获取真实歌曲url
  getSongUrl() {
    if (this.url) return
    getSongRealAddress(this.mid).then(res => {
      if (res.data.code === ERR_OK && res.data.req_0.code === ERR_OK) {
        let url = []
        let baseUrl = res.data.req_0.data.sip
        let pUrl = res.data.req_0.data.midurlinfo[0].purl
        for (const item of baseUrl) {
          let comP = item + pUrl
          url.push(comP)
        }
        this.url = url
      }
    })
  }
}

// 创建歌曲类函数
export function createSong(musicData) {
  return new Song({
    id: musicData.songid || musicData.id,
    mid: musicData.songmid || musicData.mid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname || musicData.name,
    album: musicData.albumname || musicData.album.name,
    duration: musicData.interval,
    img: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid ||
    musicData.album.mid}.jpg?max_age=2592000`,
    /*开始为空,当点击播放时谁才请求它歌曲地址*/
    url: null,
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(s => {
    ret.push(s.name)
  })
  return ret.join('/')
}
