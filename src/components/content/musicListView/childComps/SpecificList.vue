<template>
  <div class="song-list" v-show="songs.length">
    <ul>
      <li
        v-for="(item, index) in songs"
        :key="item.id"
        @click="songClick(item, index)"
      >
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)">{{ getRankText(index) }}</span>
        </div>
        <div class="content">
          <div class="song-name">{{ item.name }}</div>
          <div class="singer-name">
            {{ item.singer + ' · ' + item.album }}
          </div>
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
      rank: {
        // 默认没有排行榜数据
        type: Boolean,
        default: false,
      },
    },
    methods: {
      // 1.歌曲被点击进入播放器页面
      songClick(item, index) {
        this.$emit('songClick', item, index)
      },
      // 2.排行榜样式
      getRankCls(index) {
        if (index <= 2) {
          return `icon icon${index}`
        } else {
          return 'text'
        }
      },
      // 3.排行榜内容
      getRankText(index) {
        if (index > 2) {
          return index + 1
        }
      },
    },
  }
</script>

<style scoped lang="less">
  @import '~assets/css/variable';
  /*@import '~assets/css/mixin';*/

  .song-list {
    ul {
      display: flex;
      flex-direction: column;
      padding: 20px 32px;

      li {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 13px 0;

        .rank {
          margin-right: 30px;
          text-align: center;
          color: @color-theme;

          span {
            display: inline-block;
            width: 25px;
            height: 25px;

            &.icon0 {
              background-image: url('first@2x.png');
              background-size: 25px;
            }

            &.icon1 {
              background-image: url('second@2x.png');
              background-size: 25px;
            }

            &.icon2 {
              background-image: url('third@2x.png');
              background-size: 25px;
            }
          }
        }

        .content {
          flex: 1;

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
  }
</style>
