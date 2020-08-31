import { debounce, playMode, shuffle } from '@/common/utils'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export const imgListenerMixin = {
  mounted() {
    // _calcListGroupHeight回调函数用来计算歌手页的项目组高度
    const refresh = debounce(
      this.$refs.cScroll.refresh,
      300,
      this._calcListGroupHeight,
    )
    this.imageLoadListener = () => refresh()
  },
}

// 处理mini播放器下歌曲列表或其他滚动列表被播放器挡住的问题
export const playlistMixin = {
  computed: {
    ...mapGetters(['getPlayList']),
  },
  mounted() {
    this.handlePlaylist(this.getPlayList)
  },
  activated() {
    this.handlePlaylist(this.getPlayList)
  },
  methods: {
    handledPlayList() {
      // 你的组件里必须实现handlePlaylist方法,不然调用mixin里面的handlePlaylist报错来提醒你
      throw new Error('component must implement handlePlaylist method')
    },
  },
  watch: {
    getPlayList(newValue) {
      this.handlePlaylist(newValue)
    },
  },
}

export const playerMixin = {
  computed: {
    ...mapGetters([
      'getCurrentSong',
      'getPlayList',
      'getMode',
      'getSequenceList',
    ]),
    iconMode() {
      return this.getMode === playMode.sequence
        ? 'icon-sequence'
        : this.getMode === playMode.loop
          ? 'icon-loop'
          : 'icon-random'
    },
  },
  methods: {
    ...mapMutations([
      'setPlaying',
      'setCurrentIndex',
      'setMode',
      'setPlayList',
    ]),
    // 改变播放模式和修改播放列表
    changeMode() {
      let mode = this.getMode < 2 ? this.getMode + 1 : 0
      this.setMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.getSequenceList)
      } else {
        // 顺序播放和循环播放,列表不变
        list = this.getSequenceList
      }
      // 为了保证切换模式时当前播放歌曲不变,先将当前歌曲在新列表中的位置重置
      // 当下一步改变新列表后当前播放歌曲不会变化
      this.resetCurrentSong(list)
      // 设置当前播放列表
      this.setPlayList(list)
    },
    // 重置当前播放歌曲
    resetCurrentSong(list) {
      let index = list.findIndex(item => {
        return item.id === this.getCurrentSong.id
      })
      this.setCurrentIndex(index)
    },
  },
}

export const searchMixin = {
  data() {
    return {
      query: '',
    }
  },
  computed: {
    ...mapGetters(['getSearchHistory']),
  },
  methods: {
    ...mapActions(['saveSearchHistory', 'deleteSearchHistory']),
    // 搜索列表滚动后取消搜索框的焦点,使得移动端输入键盘消失
    blurInput() {
      this.$refs.searchBox._blur()
    },
    // 搜索的歌曲被点击,将其加入历史列表
    saveSearch(name) {
      this.saveSearchHistory(name)
    },
    // 搜索框中query发生改变,保存最新query
    getNewQuery(newQuery) {
      this.query = newQuery
    },
    // 点击热词添加到搜索框
    addQuery(query) {
      this.$refs.searchBox.changeQuery(query)
      // 并添加历史
      this.saveSearch(query)
    },
  },
}
