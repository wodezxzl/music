<template>
  <div id="tabbar">
    <router-link class="tab-item" to="/recommend" tag="div">
      <span>推荐</span>
    </router-link>
    <router-link class="tab-item" to="/singer" tag="div">
      <span>歌手</span>
    </router-link>
    <router-link class="tab-item" to="/rank" tag="div">
      <span>排行</span>
    </router-link>
    <router-link class="tab-item" to="/search" tag="div">
      <span>搜索</span>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'TabBar',
  }
</script>

<!--suppress CssUnknownTarget, LessResolvedByNameOnly -->
<style scoped lang="less">
  @import '~assets/css/variable';
  #tabbar {
    display: flex;
    justify-content: space-around;
    height: 44px;
    line-height: 44px;
    font-size: @font-size-medium;
    .tab-item {
      flex: 1;
      text-align: center;
      color: @color-text-l;
      span {
        padding-bottom: 6px;
      }
    }
    .router-link-active {
      span {
        color: @color-theme;
        border-bottom: 2px solid @color-theme;
      }
    }
  }
</style>
