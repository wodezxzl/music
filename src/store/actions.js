export const actions = {
  selectSongPlay({ commit }, { list, index, url }) {
    commit('setSequenceList', list)
    commit('setPlayList', list)
    commit('setCurrentIndex', index)
    commit('setPlaying', true)
    commit('setFullScreen', true)
    commit('setSongRealAddress', url)
  },
}
