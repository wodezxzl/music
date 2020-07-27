import { debounce } from '@/common/utils'

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
