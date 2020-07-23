<template>
  <div class="recommend-song-list">
    <h1>热门歌单推荐</h1>
  </div>
</template>

<script>
  export default {
    name: 'RecommendSongList',
  }
</script>

<!--suppress CssUnknownTarget, LessResolvedByNameOnly -->
<style scoped lang="less">
  @import '~assets/css/mixin';
  @import '~assets/css/variable';
  .recommend-song-list {
    h1 {
      line-height: 44px;
      text-align: center;
      font-size: @font-size-medium;
      color: @color-theme;
    }
  }
</style>
