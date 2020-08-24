import { playMode } from '@/common/utils'
import { shuffle } from '@/common/utils'

function findIndex(list, song) {
  list.findIndex(item => {
    return item.id === song.id
  })
}

export const actions = {
  selectSongPlay({ commit, state }, { list, index, url }) {
    commit('setSequenceList', list)
    if (state.mode === playMode.random) {
      // TODO 不是很明白不改变为什么不能正确播放
      // 当是随机播放模式时选择歌曲(mini播放器选择歌曲),list需要改变,当前歌曲在randomList中的位置也需要知道
      let randomList = shuffle(list)
      commit('setPlayList', randomList)
      index = findIndex(randomList, list[index])
    } else {
      commit('setPlayList', list)
    }
    commit('setCurrentIndex', index)
    commit('setPlaying', true)
    commit('setFullScreen', true)
    commit('setSongRealAddress', url)
  },
  // TODO 随机播放是有问题的,url都还没有请求过来
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
