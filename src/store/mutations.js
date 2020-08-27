import Vue from 'vue'
export const mutations = {
  setSinger(state, singer) {
    state.singer = singer
  },
  setPlaying(state, flag) {
    Vue.set(state, 'playing', flag)
  },
  setFullScreen(state, flag) {
    Vue.set(state, 'fullScreen', flag)
  },
  setPlayList(state, list) {
    // 直接赋值不具有响应式
    Vue.set(state, 'playList', list)
  },
  // 设置真实的歌曲播放地址
  setSongRealAddress(state, url) {
    // 索引为0时需要判断一下
    if (state.currentIndex === 0 || state.currentIndex) {
      if (state.playList) {
        Vue.set(state.playList[state.currentIndex], 'url', url)
      }
    }
  },
  setSequenceList(state, list) {
    Vue.set(state, 'sequenceList', list)
  },
  setMode(state, mode) {
    Vue.set(state, 'mode', mode)
  },
  setCurrentIndex(state, index) {
    Vue.set(state, 'currentIndex', index)
  },
  setRecommendSongList(state, songItems) {
    Vue.set(state, 'recommendSongList', songItems)
  },
  setTopList(state, topListSong) {
    Vue.set(state, 'topList', topListSong)
  },
  setSearchHistory(state, history) {
    Vue.set(state, 'searchHistory', history)
  },
}
