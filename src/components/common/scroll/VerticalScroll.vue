<template>
  <div class="swiper-scroll" ref="verticalScroll">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from '@better-scroll/core'
  import Pullup from '@better-scroll/pull-up'

  BScroll.use(Pullup)

  export default {
    name: 'VerticalScroll',
    props: {
      probeType: {
        type: Number,
        default: 1,
      },
      pullUpLoad: {
        type: Boolean,
        default: false,
      },
      data: {
        type: Array,
        default() {
          return []
        },
      },
      refreshDelay: {
        type: Number,
        default: 20,
      },
    },
    data() {
      return {
        scroll: null,
      }
    },
    mounted() {
      // 这里取初始化对象一定要用this.$refs(用类名它内部调用的是document.querySelector,只会找到第一个类)
      this.scroll = new BScroll(this.$refs.verticalScroll, {
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad,
        click: true,
      })
      if (this.probeType === 2 || this.probeType === 3) {
        this.scroll.on('scroll', position => {
          this.$emit('scroll', position)
        })
      }
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
          this.$emit('getMoreGoods')
        })
      }
    },
    methods: {
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo(x = 0, y = 0, time = 100) {
        y = -y
        this.scroll && this.scroll.scrollTo(x, y, time)
      },
      scrollToElement(el, time = 100) {
        this.scroll && this.scroll.scrollToElement(el, time)
      },
    },
    watch: {
      // 观察到数据传进来就刷新(默认时间20为一般情况下vue挂载dom的耗时)
      data() {
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      },
    },
  }
</script>

<style scoped lang="less"></style>
