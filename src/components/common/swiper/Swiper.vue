<template>
  <div class="swiper">
    <swiper-scroll ref="swiperScroll">
      <slot />
    </swiper-scroll>
    <div class="dots"></div>
  </div>
</template>

<script>
  import SwiperScroll from '@/components/common/scroll/SwiperScroll'
  export default {
    name: 'Swiper',
    props: {
      loop: {
        type: Boolean,
        default: true,
      },
      autoPlay: {
        type: Boolean,
        default: true,
      },
      interval: {
        type: Number,
        default: 4000,
      },
    },
    components: {
      SwiperScroll,
    },
    mounted() {},
  }
</script>

<style scoped lang="less">
  .swiper {
    width: 100%;
    overflow: hidden;
  }
</style>
