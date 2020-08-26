export const getters = {
  getSinger(state) {
    return state.singer
  },
  isPlaying(state) {
    return state.playing
  },
  isFullScreen(state) {
    return state.fullScreen
  },
  getPlayList(state) {
    return state.playList
  },
  getSequenceList(state) {
    return state.sequenceList
  },
  getMode(state) {
    return state.mode
  },
  getCurrentIndex(state) {
    return state.currentIndex
  },
  getCurrentSong(state) {
    if (state.currentIndex >= 0 && state.playList) {
      return state.playList[state.currentIndex]
    }
  },
  getRecommendSongList(state) {
    return state.recommendSongList
  },
  getTopList(state) {
    return state.topList
  },
}
