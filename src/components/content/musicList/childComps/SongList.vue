<template>
  <div class="song-list" v-show="songs.length">
    <ul>
      <li v-for="item in songs" :key="item.id">
        <div class="song-name">{{ item.name }}</div>
        <div class="singer-name">{{ item.singer + '·' + item.album }}</div>
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
