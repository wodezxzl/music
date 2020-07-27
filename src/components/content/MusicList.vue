<template>
  <div class="music-list"></div>
</template>

<script>
  export default {
    name: 'MusicList',
    props: {
      // 1.歌手背景图
      singerBgImage: {
        type: String,
        default: '',
      },
      // 2.歌曲列表
      songs: {
        type: Array,
        default() {
          return []
        },
      },
      // 3.歌曲标题
      title: {
        type: String,
        default: '',
      },
    },
  }
</script>

<style scoped lang="less">
  @import '~assets/css/variable';

  .music-list {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: @color-background;
    z-index: 9999;
  }
</style>
