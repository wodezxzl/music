<template>
  <div class="swiper">
    <!--轮播图+滚动插件-->
    <swiper-scroll
      ref="swiperScroll"
      @pageSlide="pageSlide"
      @touchstart.native="touchstart"
      @touchend.native="touchend"
    >
      <slot />
    </swiper-scroll>
    <!--小圆点-->
    <div class="dots">
      <span
        v-for="(item, index) in sliderImgList"
        :key="item.id"
        :class="{ active: currentPage === index }"
      ></span>
    </div>
  </div>
</template>

<script>
  import SwiperScroll from '@/components/common/scroll/SwiperScroll'
  export default {
    name: 'Swiper',
    components: {
      SwiperScroll,
    },
    props: {
      sliderImgList: {
        type: Array,
        default() {
          return []
        },
      },
    },
    data() {
      return {
        currentPage: 0,
        // 定时器
        timer: null,
      }
    },
    mounted() {
      // 挂载完毕设置定时器自动播放
      this.touchend()
    },
    methods: {
      // 1.获取当前页面来改变小圆点样式
      pageSlide(currentPage) {
        this.currentPage = currentPage
      },
      // 2.手指触摸停止定时器
      touchstart() {
        if (this.timer) {
          clearInterval(this.timer)
        }
      },
      // 2.手指触摸结束开启定时器
      touchend() {
        if (this.$refs.swiperScroll.autoPlay) {
          this.timer = setInterval(() => {
            this.$refs.swiperScroll.autoPlay(1000)
          }, 4000)
        }
      },
    },
  }
</script>

<style scoped lang="less">
  @import '~assets/css/variable';
  .swiper {
    position: relative;
    width: 100%;
    overflow: hidden;
    .dots {
      position: absolute;
      left: 50%;
      bottom: 10px;
      transform: translateX(-50%);
      span {
        display: inline-block;
        width: 10px;
        height: 10px;
        margin: 0 5px;
        border-radius: 50%;
        background-color: @color-dialog-background;
      }
      .active {
        width: 24px;
        height: 10px;
        border-radius: 5px;
        background-color: @color-text-ll;
      }
    }
  }
</style>
