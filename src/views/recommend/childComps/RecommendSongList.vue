<template>
  <div class="recommend-song-list">
    <h2>热门歌单推荐</h2>
    <ul>
      <li
        v-for="item in songsList"
        :key="item.dissid"
        class="list-item"
        @click="songItemClick(item)"
      >
        <img v-lazy="item.imgurl" alt="" @load="minImgLoad" />
        <div class="desc">
          <div class="title" v-html="item.creator.name"></div>
          <div class="detail-desc" v-html="item.dissname"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  // vuex
  import { mapMutations } from 'vuex'

  export default {
    name: 'RecommendSongList',
    props: {
      songsList: {
        type: Array,
        default() {
          return []
        },
      },
    },
    data() {
      return {
        count: 0,
      }
    },
    methods: {
      ...mapMutations(['setRecommendSongList']),
      // 1.发射图片加载完毕事件
      minImgLoad() {
        // 只有当count等于数据长度时才发出一次事件,为了防抖
        if (++this.count === this.songsList.length) {
          this.$emit('minImgLoad')
        }
      },
      // 2.歌单点击进行路由跳转
      songItemClick(item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`,
        })
        // 将歌单信息设置到vuex
        this.setRecommendSongList(item)
      },
    },
  }
</script>

<style scoped lang="less">
  @import '~assets/css/mixin';
  @import '~assets/css/variable';
  .recommend-song-list {
    h2 {
      font-size: 15px;
      line-height: 54px;
      text-align: center;
      color: @color-theme;
    }
    .list-item {
      display: flex;

      img {
        width: 60px;
        margin: 10px 20px;
        border-radius: 6px;
      }

      .desc {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;

        .detail-desc {
          color: @color-text-d;
        }
      }
    }
  }
</style>
