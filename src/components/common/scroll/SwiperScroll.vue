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
        // 为了监听slideWillChange事件，实时知道当前在那个页面
        probeType: 2,
        click: true,
      })
      this.scroll.on('slideWillChange', page => {
        // 当页面滑动时传出当前页面页数
        this.$emit('pageSlide', page.pageX)
      })
    },
    methods: {
      autoPlay(time) {
        if (this.scroll) {
          return this.scroll.next(time)
        }
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
