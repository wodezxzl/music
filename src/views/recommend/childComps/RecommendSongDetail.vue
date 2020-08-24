<template>
  <transition name="slide" appear>
    <music-list-view :title="title" :singerBgImage="bgImage" :songs="songs"/>
  </transition>
</template>

<script>
  // 公共组件
  import MusicListView from '@/components/content/musicListView/MusicListView'

  // 公共资源
  import { createSong } from '@/common/songs'

  // vuex
  import { mapGetters } from 'vuex'

  // 网络请求
  import { getRecommendSongsList } from '@/network/recommend'
  import { ERR_OK } from '@/network/config'

  export default {
    name: 'RecommendSongDetail',
    data() {
      return {
        songs: [],
      }
    },
    computed: {
      ...mapGetters(['getRecommendSongList']),
      title() {
        return this.getRecommendSongList.dissname
      },
      bgImage() {
        return this.getRecommendSongList.imgurl
      },
    },
    created() {
      // 1.请求歌单歌曲数据
      this._getRecommendSongsList()
    },
    methods: {
      // 私有方法
      // 1.请求歌单歌曲数据
      _getRecommendSongsList() {
        // 在歌曲列表页面刷新返回
        if (!this.getRecommendSongList.dissid) {
          this.$router.replace('/recommend')
        }
        getRecommendSongsList(this.getRecommendSongList.dissid).then(res => {
          if (res.data.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.cdlist[0].songlist)
          }
        })
      },
      // 格式化歌曲信息
      _normalizeSongs(list) {
        let ret = []
        list.forEach(musicData => {
          if (musicData.mid && musicData.album['mid']) {
            ret.push(createSong(musicData))
          }
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
