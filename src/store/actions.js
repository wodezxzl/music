import { playMode } from '@/common/utils'
import { shuffle } from '@/common/utils'
import { saveSearch, deleteSearch, clearSearch } from '@/common/cache'

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
  // 搜索页点击歌曲插入播放
  insertSong({ commit, state }, song) {
    if (state.playList && state.playList.length > 0) {
      let playList = state.playList.slice()
      let sequenceList = state.sequenceList.slice()
      let currentIndex = state.currentIndex
      // 插入歌曲主要修改这三个数据,无法传入只能先从state中获取
      // 不能在mutations之外修改state,所以用slice返回一个副本

      // 记录下当前歌曲
      let currentSong = playList[currentIndex]
      // 看插入的歌曲是否在已有的歌曲列表中,并返回索引
      let fpIndex = findSameSong(playList, song)
      // 在当前索引的下一个位置插入
      currentIndex++
      // 插入一首歌
      playList.splice(currentIndex, 0, song)
      // 如果已经包含这首歌
      if (fpIndex > -1) {
        // 当前插入序号大于之前存在的序号,删除并改变序号
        if (currentIndex > fpIndex) {
          playList.splice(fpIndex, 1)
          currentIndex--
        } else {
          // 当前插入序号小于之前存在的序号,由长度变长,所以之前歌曲序号要加一删除
          playList.splice(fpIndex + 1, 1)
        }
      }

      // 歌曲在sequenceList中要插入的位置(在这里不需要操作currentIndex)
      let currentSIndex = findSameSong(sequenceList, currentSong) + 1
      // 在sequenceList中是否存在相同歌曲
      let fsIndex = findSameSong(sequenceList, song)
      sequenceList.splice(currentSIndex, 0, song)
      if (fsIndex > -1) {
        if (currentSIndex > fpIndex) {
          sequenceList.splice(fpIndex, 1)
        } else {
          sequenceList.splice(fpIndex + 1, 1)
        }
      }

      commit('setPlayList', playList)
      commit('setCurrentIndex', currentIndex)
      commit('setSequenceList', sequenceList)
      commit('setPlaying', true)
      commit('setFullScreen', true)
    } else {
      let res = []
      res.push(song)
      commit('setPlayList', res)
      commit('setCurrentIndex', 0)
      commit('setSequenceList', res)
      commit('setPlaying', true)
      commit('setFullScreen', true)
    }
  },
  saveSearchHistory({ commit }, query) {
    commit('setSearchHistory', saveSearch(query))
  },
  deleteSearchHistory({ commit }, query) {
    commit('setSearchHistory', deleteSearch(query))
  },
  // 清空搜索历史
  clearSearchHistory({ commit }) {
    commit('setSearchHistory', clearSearch())
  },
}
