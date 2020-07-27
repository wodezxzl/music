<template>
  <div class="loading">
    <img src="~assets/image/loading.gif" alt=""/>
    <p>{{ dsec }}</p>
  </div>
</template>

<script>
  export default {
    name: 'Loading',
    props: {
      dsec: {
        type: String,
        default: '正在载入...',
      },
    },
  }
</script>

<style scoped lang="less">
  .loading {
    width: 100vw;
    text-align: center;
    color: #ccc;

    img {
      width: 6%;
      margin-left: -10px;
      margin-bottom: 10px;
    }

    p {
      font-size: 12px;
    }
  }
</style>
