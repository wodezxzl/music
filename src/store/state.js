import { playMode } from '@/common/utils'
import { loadSearch, readPlay, readFavorite } from '@/common/cache'

export const state = {
  // 点击对应歌手,获得的歌手信息
  singer: {},
  // 正在播放
  playing: false,
  // 是否全屏
  fullScreen: false,
  // 播放列表
  playList: [],
  // 顺序播放列表
  sequenceList: [],
  // 播放模式
  mode: playMode.sequence,
  // 当前播放索引
  currentIndex: -1,
  // 推荐页歌单
  recommendSongList: {},
  // 排行榜数据
  topList: {},
  // 搜索历史数据
  searchHistory: loadSearch(),
  // 播放历史
  playHistory: readPlay(),
  // 收藏的歌曲列表
  favoriteList: readFavorite(),
}
