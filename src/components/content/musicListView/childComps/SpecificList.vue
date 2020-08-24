<template>
  <div class="song-list" v-show="songs.length">
    <ul>
      <li
        v-for="(item, index) in songs"
        :key="item.id"
        @click="songClick(item, index)"
      >
        <div class="song-name">{{ item.name }}</div>
        <div class="singer-name">
          {{ item.album + '·' + item.singer }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'SongList',
    props: {
      songs: {
        type: Array,
        default() {
          return []
        },
      },
    },
    methods: {
      // 歌曲被点击进入播放器页面
      songClick(item, index) {
        this.$emit('songClick', item, index)
      },
    },
  }
</script>

<style scoped lang="less">
  @import '~assets/css/variable';

  .song-list {
    ul {
      display: flex;
      flex-direction: column;
      padding: 20px 32px;

      li {
        margin: 13px 0;

        .song-name {
          margin-bottom: 10px;
          font-size: @font-size-medium;
          color: @color-text;
        }

        .singer-name {
          font-size: @font-size-small;
          color: @color-text-l;
        }
      }
    }
  }
</style>
