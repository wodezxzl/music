<template>
  <div id="recommend">
    <!--轮播图-->
    <!--只有当有图片时才加载,此时的滚动距离一定是正确的-->
    <swiper v-if="sliderImgList.length" :sliderImgList="sliderImgList">
      <swiper-item v-for="item in sliderImgList" :key="item.id">
        <a :href="item.linkUrl"><img :src="item.picUrl" alt=""/></a>
      </swiper-item>
    </swiper>
    <!--推荐歌单-->
    <recommend-song-list />
  </div>
</template>

<script>
  // 子组件
  import RecommendSongList from './childComps/RecommendSongList'

  // 公共组件
  import { Swiper, SwiperItem } from 'components/common/swiper/index'

  // 网络请求
  import { getRecommendSwiper } from '@/network/recommend'
  import { ERR_OK } from '@/network/config'

  export default {
    name: 'Recommend',
    data() {
      return {
        sliderImgList: [],
      }
    },
    components: {
      RecommendSongList,
      Swiper,
      SwiperItem,
    },
    methods: {
      // 网络请求
      _getRecommendSwiper() {
        getRecommendSwiper().then(res => {
          if (res.code === ERR_OK) {
            this.sliderImgList = res.data.slider
          }
        })
      },
    },
    created() {
      // 1.请求轮播图数据
      this._getRecommendSwiper()
    },
  }
</script>

<style scoped lang="less"></style>
