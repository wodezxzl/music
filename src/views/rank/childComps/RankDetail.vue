<template>
  <div class="rank-detail">
    <transition name="slide">
      <music-list-view
        :singerBgImage="bgImg"
        :title="title"
        :songs="rankSong"
        :rank="true"
      />
    </transition>
  </div>
</template>

<script>
  // 公共组件
  import MusicListView from '@/components/content/musicListView/MusicListView'

  // 公共资源
  import { createSong } from '@/common/songs'

  // vuex
  import { mapGetters } from 'vuex'

  // 网络请求
  import { getRankSong } from '@/network/rank'
  import { ERR_OK } from '@/network/config'

  export default {
    name: 'RankDetail',
    data() {
      return {
        rankSong: [],
      }
    },
    computed: {
      ...mapGetters(['getTopList']),
      bgImg() {
        if (this.rankSong.length !== 0) {
          // 用第一首歌的封面
          return this.rankSong[0].img
        }
        return ''
      },
      title() {
        return this.getTopList.musichallTitle
      },
    },
    created() {
      this._getRankSong()
    },
    methods: {
      // 私有方法
      // 1.请求相应排行榜歌曲
      _getRankSong() {
        // 在该界面刷新不能获取数据,直接返回到rank页面
        if (!this.getTopList.topId) {
          this.$router.replace('/rank')
        }
        getRankSong(this.getTopList.topId).then(res => {
          if (res.code === ERR_OK) {
            this.rankSong = this._normalizeRankSong(res.songlist)
          }
        })
      },
      // 2.格式化歌曲数据
      _normalizeRankSong(songs) {
        let ret = []
        songs.forEach(item => {
          const musicData = item.data
          if (musicData.albumid && musicData.songid)
            ret.push(createSong(musicData))
        })
        return ret
      },
    },
    components: {
      MusicListView,
    },
  }
</script>

<style scoped lang="less">
  /*滑动动画*/
  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter,
  .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
