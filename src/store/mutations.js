export const mutations = {
  setSinger(state, singer) {
    state.singer = singer
  },
  setPlaying(state, flag) {
    state.playing = flag
  },
  setFullScreen(state, flag) {
    state.fullScreen = flag
  },
  setPlayList(state, list) {
    state.playList = list
  },
  setSequenceList(state, list) {
    state.sequenceList = list
  },
  setMode(state, mode) {
    state.mode = mode
  },
  setCurrentIndex(state, index) {
    state.currentIndex = index
  },
}
