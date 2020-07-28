import { playMode } from '@/common/utils'

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
}
