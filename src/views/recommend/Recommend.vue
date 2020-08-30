<template>
  <div id="recommend" ref="recommend">
    <vertical-scroll class="scroll" ref="scroll" :data="songsList">
      <!--轮播图-->
      <!--只有当有图片时才加载,此时的滚动距离一定是正确的-->
      <swiper v-if="sliderImgList.length" :sliderImgList="sliderImgList">
        <swiper-item v-for="item in sliderImgList" :key="item.id">
          <a href="#"
          ><img :src="item" alt="" @load="imgLoad"
          /></a>
        </swiper-item>
      </swiper>
      <!--推荐歌单-->
      <recommend-song-list :songsList="songsList" @minImgLoad="minImgLoad"/>
      <!--正在加载-->
      <div v-show="!songsList.length" class="loading">
        <loading/>
      </div>
    </vertical-scroll>
    <router-view/>
  </div>
</template>

<script>
  // 子组件
  import RecommendSongList from './childComps/RecommendSongList'

  // 公共组件
  import { Swiper, SwiperItem } from 'components/common/swiper/index'
  import VerticalScroll from 'components/common/scroll/VerticalScroll'
  import Loading from 'components/common/loading/Loading'

  // 网络请求
  import { getRecommendSwiper, getSongsList } from '@/network/recommend'
  import { ERR_OK } from '@/network/config'

  // mixin
  import { playlistMixin } from '@/common/mixin'

  export default {
    mixins: [playlistMixin],
    name: 'Recommend',
    data() {
      return {
        sliderImgList: [],
        songsList: [],
        // 是否已经加载完毕一张轮播图片
        checkLoaded: false,
      }
    },
    components: {
      RecommendSongList,
      Swiper,
      SwiperItem,
      VerticalScroll,
      Loading,
    },
    methods: {
      // 网络请求
      // 1.轮播图图片
      _getRecommendSwiper() {
        getRecommendSwiper().then(res => {
          if (res.data.code === ERR_OK) {
            const slideArr = res.data.focus.data.shelf.v_niche[0].v_card
            let arr = []
            for (const item of slideArr) {
              arr.push(item.cover)
            }
            this.sliderImgList = arr
          }
        })
      },
      // 2.请求歌单列表
      _getSongsList() {
        getSongsList().then(res => {
          console.log(res)
          if (res.data.code === ERR_OK) {
            this.songsList = res.data.data.list
          }
        })
      },
      // 3.轮播图加载完毕一张就刷新高度
      imgLoad() {
        if (!this.checkLoaded) {
          this.$refs.scroll.refresh()
          this.checkLoaded = true
        }
      },
      // 4.操作scroll,不让mini播放器遮盖
      handlePlaylist(playlist) {
        // 设置滚动组件的bottom为mini播放器的高度
        this.$refs.recommend.style.bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.scroll.refresh()
      },
      // 5.歌单列表中小图片加载完毕刷新高度
      minImgLoad() {
        this.$refs.scroll.refresh()
      },
    },
    created() {
      // 1.请求轮播图数据
      this._getRecommendSwiper()
      // 2.请求歌单列表
      this._getSongsList()
    },
  }
</script>

<style scoped lang="less">
  #recommend {
    position: relative;

    .scroll {
      height: calc(100vh - 88px);

      .loading {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
</style>
