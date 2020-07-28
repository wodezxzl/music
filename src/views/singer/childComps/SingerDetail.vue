<template>
  <transition name="slide" appear>
    <music-list
      :title="title"
      :singerBgImage="singerBgImage"
      :songs="singerDetailList"
    />
  </transition>
</template>

<script>
  // 公共组件
  import MusicList from '@/components/content/musicList/MusicList'

  // 网络请求
  import { getSingerDetail } from '@/network/singers'
  import { ERR_OK } from '@/network/config'

  // 公共属性或方法
  import { createSong } from '@/common/songs'

  // vuex
  import { mapGetters } from 'vuex'

  export default {
    name: 'SingerDetail',
    data() {
      return {
        singerDetailList: [],
      }
    },
    created() {
      // 1.请求歌手详情数据
      this._getSingerDetail(this.getSinger.id)
    },
    computed: {
      title() {
        return this.getSinger.name
      },
      singerBgImage() {
        return this.getSinger.avatar
      },

      /**
       * vuex
       */
      ...mapGetters(['getSinger']),
    },
    methods: {
      /**
       * 网络请求
       */
      // 1.请求歌手详情数据
      _getSingerDetail(singerId) {
        // 进入后再刷新id为空,没有意义,直接返回歌手页面
        if (!this.getSinger.id) {
          this.$router.replace('/singer')
          return
        }
        getSingerDetail(singerId).then(res => {
          if (res.code === ERR_OK) {
            this.singerDetailList = this._normalizedSongsDetailList(
              res.data.list,
            )
          }
        })
      },

      /**
       * 私有方法
       */
      // 1.格式化歌曲详情数据
      _normalizedSongsDetailList(list) {
        let rel = []
        list.forEach(item => {
          if (item.musicData.songid && item.musicData.albummid) {
            rel.push(createSong(item.musicData))
          }
        })
        return rel
      },
    },
    components: {
      MusicList,
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
