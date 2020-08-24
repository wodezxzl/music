import { playMode } from '@/common/utils'
import { shuffle } from '@/common/utils'

function findSameSong(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}

export const actions = {
  selectSongPlay({ commit, state }, { list, index }) {
    commit('setSequenceList', list)
    if (state.mode === playMode.random) {
      // 当是随机播放模式时选择歌曲(mini播放器选择歌曲),list需要改变,当前歌曲在randomList中的位置也需要知道
      // 为你播放完你点击的歌曲后,接下来的歌曲列表还是随机的
      let randomList = shuffle(list)
      commit('setPlayList', randomList)
      index = findSameSong(randomList, list[index])
    } else {
      commit('setPlayList', list)
    }
    commit('setCurrentIndex', index)
    commit('setPlaying', true)
    commit('setFullScreen', true)
  },
  playRandomSong({ commit }, { list }) {
    let randomList = shuffle(list)
    commit('setMode', playMode.random)
    commit('setSequenceList', list)
    commit('setPlayList', randomList)
    commit('setCurrentIndex', 0)
    commit('setPlaying', true)
    commit('setFullScreen', true)
  },
}
