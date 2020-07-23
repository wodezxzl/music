<template>
  <div class="swiper-scroll" ref="swiperScroll">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from '@better-scroll/core'
  import Slide from '@better-scroll/slide'

  BScroll.use(Slide)

  export default {
    name: 'SwiperScroll',
    data() {
      return {
        scroll: null,
      }
    },
    mounted() {
      // 这里取初始化对象一定要用this.$refs(用类名它内部调用的是document.querySelector,只会找到第一个类)
      this.scroll = new BScroll(this.$refs.swiperScroll, {
        scrollX: true,
        scrollY: false,
        slide: {
          loop: true,
          threshold: 100,
        },
        momentum: false,
        bounce: false,
        stopPropagation: true,
        probeType: 2,
      })
      console.log(this.scroll.scrollerWidth)
    },
    methods: {
      // 先判断this.scroll是否存在,以免在home父组件中调用方法时scroll还没创建
      refresh() {
        this.scroll && this.scroll.refresh()
      },
    },
  }
</script>

<style scoped lang="less">
  .swiper-scroll {
    white-space: nowrap;
    .content {
      display: inline-block;
    }
  }
</style>
