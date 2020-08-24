import { debounce } from '@/common/utils'
import { mapGetters } from 'vuex'

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
