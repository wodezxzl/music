<template>
  <div class="swiper-item">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'SwiperItem',
  }
</script>

<style scoped lang="less">
  .swiper-item {
    float: left;
    width: 100vw;
    img {
      width: 100%;
    }
  }
</style>
