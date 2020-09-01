import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

// 向数组中插入值
function insertArr(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    // 数组中已有该值,且是第一个,不用操作
    return
  }
  if (index > 0) {
    // 如果已经有该值,删除(因为总是要保证最近搜索的值在最前面,也就是下一步添加在头部)
    arr.splice(index, 1)
  }
  arr.unshift(val)
  // 数组长度超标删除一个
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

// 从数组中删除元素
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveSearch(query) {
  // 得到当前SEARCH_KEY的存储情况,没有给一个空数组
  let searches = storage.get(SEARCH_KEY, [])
  insertArr(
    searches,
    query,
    item => {
      return item === query
    },
    SEARCH_MAX_LENGTH,
  )
  // 存储数组
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 获取本地存储值
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

// 删除本地存储
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, item => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 清空储存
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

// 存储播放歌曲
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArr(
    songs,
    song,
    item => {
      return item.id === song.id
    },
    PLAY_MAX_LENGTH,
  )
  storage.set(PLAY_KEY, songs)
  return songs
}

// 读取存储的播放歌曲
export function readPlay() {
  return storage.get(PLAY_KEY, [])
}

// 保存收藏歌曲
export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArr(
    songs,
    song,
    item => {
      return song.id === item.id
    },
    FAVORITE_MAX_LENGTH,
  )
  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 删除收藏歌曲
export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, item => {
    return song.id === item.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 读取存储的收藏歌曲列表
export function readFavorite() {
  return storage.get(FAVORITE_KEY, [])
}
