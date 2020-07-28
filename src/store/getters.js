export const getters = {
  getSinger(state) {
    return state.singer
  },
  getPlaying(state) {
    return state.playing
  },
  getFullScreen(state) {
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
    return state.playlist[state.currentIndex] || {}
  },
}
