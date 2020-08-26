<template>
  <div id="rank" ref="rank">
    <vertical-scroll :data="rankList" ref="cScroll">
      <ul>
        <li
          class="rank-list-item"
          v-for="item in rankList"
          :key="item.headPicUrl"
          @click="itemClick(item)"
        >
          <!--左边图片-->
          <div class="icon-img">
            <img v-lazy="item.frontPicUrl" alt=""/>
          </div>
          <!--右边歌曲-->
          <ul class="rank-song">
            <li v-for="(song, index) in item.song" :key="index">
              <i>{{ index + '. ' }}</i>
              <span>{{ song.title + '-' + song.singerName }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </vertical-scroll>
    <div class="loading" v-show="!rankList.length">
      <loading/>
    </div>
    <router-view/>
  </div>
</template>

<script>
  // 公共组件
  import VerticalScroll from '@/components/common/scroll/VerticalScroll'
  import Loading from '@/components/common/loading/Loading'

  // mixin
  import { playlistMixin } from '@/common/mixin'

  // vuex
  import { mapMutations } from 'vuex'

  // 网络请求
  import { getRank } from '@/network/rank'
  import { ERR_OK } from '@/network/config'

  export default {
    mixins: [playlistMixin],
    name: 'Rank',
    data() {
      return {
        rankList: [],
      }
    },
    created() {
      this._getRank()
    },
    methods: {
      ...mapMutations(['setTopList']),
      // 私有方法
      // 1.请求排行榜数据
      _getRank() {
        getRank().then(res => {
          if (res.data.code === ERR_OK) {
            this.rankList = this._normalizeRankSong(res.data.topList.data.group)
          }
        })
      },
      // 2.处理排行榜歌曲数据
      _normalizeRankSong(arr) {
        let newArr = []
        arr.forEach(item => {
          if (item.toplist) {
            newArr = newArr.concat(item.toplist)
          }
        })
        return newArr
      },

      // 事件处理
      // 0.处理mini播放器时的显示问题
      handlePlaylist(playlist) {
        this.$refs.rank.style.bottom = playlist.length ? '60px' : 0
        this.$refs.cScroll.refresh()
      },
      // 1.排行榜项目点击
      itemClick(songs) {
        this.$router.push({
          path: `/rank/${songs.topId}`,
        })
        // 储存数据到vuex
        this.setTopList(songs)
      },
    },
    components: {
      VerticalScroll,
      Loading,
    },
  }
</script>

<style scoped lang="less">
  @import '~assets/css/variable';

  #rank {
    position: absolute;
    top: 88px;
    bottom: 0;
    left: 0;
    right: 0;

    .swiper-scroll {
      height: calc(100vh - 88px);
    }

    .rank-list-item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;

      &:last-child {
        padding-bottom: 20px;
      }

      .icon-img {
        box-sizing: border-box;
        min-width: 100px;
        width: 100px;
        height: 100px;

        img {
          width: 100%;
        }
      }

      .rank-song {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        flex: 1;
        padding: 16px 20px;
        font-size: @font-size-small;
        color: @color-text-d;
        background-color: @color-highlight-background;
        overflow: hidden;

        li {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
</style>
