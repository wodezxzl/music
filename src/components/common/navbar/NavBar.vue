<template>
  <div class="nav-bar">
    <div class="left"><slot name="left"></slot></div>
    <div class="center"><slot name="center"></slot></div>
    <div class="right"><slot name="right"></slot></div>
  </div>
</template>

<script>
  export default {
    name: 'NavBar',
  }
</script>

<style scoped lang="less">
  .nav-bar {
    position: relative;
    display: flex;
    height: 44px;
    line-height: 44px;
    font-size: 20px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    color: #fff;
    .left {
      width: 60px;
    }
    .center {
      flex: 1;
      text-align: center;
    }
    .right {
      width: 60px;
    }
  }
</style>
