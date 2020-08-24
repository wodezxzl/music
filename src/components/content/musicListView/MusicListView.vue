<template>
  <div class="music-list">
    <!--上半部分基础布局-->
    <div class="base-ui" ref="baseUI">
      <!--顶部栏-->
      <div class="top-layer" ref="bgLayer">
        <i class="icon-back" @click="backSinger"></i>
        <h2>{{ title }}</h2>
      </div>
      <!--图片层-->
      <div class="bg-img" ref="bgImg" :style="bgImg">
        <!--遮罩层-->
        <div class="filter" ref="filter"></div>
        <!--随机播放按钮-->
        <div
          class="random-play"
          ref="randomPlay"
          v-show="songs.length"
          @click="randomPlay"
        >
          <i class="icon-play"></i>
          <span>随机播放全部</span>
        </div>
      </div>
    </div>
    <!--实现跟随列表滚动的层-->
    <div class="bg-layer" :style="followScroll"></div>
    <!--滚动歌曲列表主题-->
    <vertical-scroll
      class="music-list-scroll"
      ref="cScroll"
      :data="songs"
      :probeType="3"
      @scroll="scroll"
    >
      <specific-list :songs="songs" @songClick="songClick" />
    </vertical-scroll>
    <!--加载中图标-->
    <loading v-show="!songs.length" class="loading" />
  </div>
</template>

<script>
  // 子组件
  import SpecificList from './childComps/SpecificList'

  //公共组件
  import VerticalScroll from '@/components/common/scroll/VerticalScroll'
  import Loading from '@/components/common/loading/Loading'

  // vuex
  import { mapActions, mapGetters } from 'vuex'

  // mixin
  import { playlistMixin } from '@/common/mixin'

  export default {
    mixins: [playlistMixin],
    name: 'MusicList',
    props: {
      // 1.歌手背景图
      singerBgImage: {
        type: String,
        default: '',
      },
      // 2.歌曲标题
      title: {
        type: String,
        default: '',
      },
      // 3.歌曲列表
      songs: {
        type: Array,
        default() {
          return []
        },
      },
    },
    data() {
      return {
        scrollY: 0,
        maxScroll: 0,
        topLayerHeight: 0,
        baseUIHeight: 0,
        // 比例:用来下拉放大和上拉模糊
        percent: 0,
      }
    },
    computed: {
      ...mapGetters(['getCurrentIndex', 'isFullScreen']),
      bgImg() {
        return `background-image:url(${this.singerBgImage})`
      },
      // 通过得到的滚动距离让bg-layer层跟随滚动,同时实现下拉图片放大
      followScroll() {
        if (this.scrollY <= 0) {
          // 在底部时下拉图片放大
          this._scaleImg()
        }
        if (this.scrollY <= this.maxScroll) {
          this._showPlay()
          // 没到顶部时调用方法保证为原始样式(主要是为了回拉还原样式)
          this._oldStyle()
          return `transform: translateY(${-this.scrollY}px)`
        } else {
          this._hidePlay()
          // 超出距离调用方法来实现文字溢出隐藏
          this._newStyle()
          // 当滚动太远时,滚动层停在最大滚动距离处
          return `transform: translateY(${-this.maxScroll}px)`
        }
      },
    },
    mounted() {
      // 1.顶部栏的高度
      this.topLayerHeight = `${this.$refs.bgLayer.clientHeight}`
      // 2.包含图片的baseUI层高度
      this.baseUIHeight = `${this.$refs.baseUI.clientHeight}`
      // 3.两者相减得到bgLayer层可以跟随滚动的最大距离
      this.maxScroll = this.baseUIHeight - this.topLayerHeight
      // 4.刚挂载时用baseUI高度来确定滚动父容器的高度(因为是个百分数,之前不能确定)
      this.$refs.cScroll.$el.style.top = this.baseUIHeight + 'px'
    },
    methods: {
      /**
       * vuex
       */
      ...mapActions(['selectSongPlay', 'playRandomSong']),

      /**
       * 事件处理
       */
      // 1.监听滚动给scrollY赋值
      scroll(position) {
        this.scrollY = -position.y
      },
      // 2.点击返回按钮,返回歌手页面
      backSinger() {
        this.$router.back()
      },
      // 3.点击歌曲,进入播放器页面
      // **同时加载对应歌曲的播放地址(用到时才加载不浪费资源)**
      songClick(song, index) {
        this.selectSongPlay({
          list: this.songs,
          index,
        })
      },
      // 4.随机播放歌曲
      randomPlay() {
        this.playRandomSong({
          list: this.songs,
        })
      },
      // 5.操作scroll,不让mini播放器遮盖
      handlePlaylist(playlist) {
        // 设置滚动组件的bottom为mini播放器的高度
        this.$refs.cScroll.$el.style.bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.cScroll.refresh()
      },

      /**
       * 私有方法
       */
      // 1.改变baseUI层的高度和index来实现滚动到顶部时的隐藏, 没到顶部时为原来样式
      _newStyle() {
        this.$refs.bgImg.style.paddingTop = 0
        this.$refs.bgImg.style.height = this.topLayerHeight + 'px'
        this.$refs.bgImg.style.zIndex = 1
      },
      _oldStyle() {
        if (this.$refs.bgImg) {
          this.$refs.bgImg.style.paddingTop = '70%'
          this.$refs.bgImg.style.height = 0
          this.$refs.bgImg.style.zIndex = 0
        }
      },
      // 2.下拉列表时图片放大
      _scaleImg() {
        // 确定一个比例
        if (this.$refs.bgImg) {
          let scale = this.percent + 1
          this.$refs.bgImg.style['transform'] = `scale(${scale})`
        }
      },
      // 3.上拉图片高斯模糊(通过模糊遮盖层)
      _imgBlur() {
        // TODO 高斯模糊没想好怎么做
        if (this.$refs.bgImg) {
          let blur = Math.min(20, this.percent * 20)
          this.$refs.bgImg.style['filter'] = `blur(${blur}px)`
        }
      },
      // 4.改变随机播放按钮的显示和隐藏
      _hidePlay() {
        if (this.$refs.randomPlay) {
          this.$refs.randomPlay.style.display = 'none'
        }
      },
      _showPlay() {
        if (this.$refs.randomPlay) {
          this.$refs.randomPlay.style.display = ''
        }
      },
    },
    watch: {
      // 滚动距离变化就计算出一个比例(因为上拉下拉都需要)
      scrollY() {
        this.percent = Math.abs(this.scrollY / this.baseUIHeight)
      },
    },
    components: {
      SpecificList,
      VerticalScroll,
      Loading,
    },
  }
</script>

<style scoped lang="less">
  @import '~assets/css/variable';

  .music-list {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: @color-background;
    z-index: 9999;

    .base-ui {
      position: relative;
      /*顶部栏*/

      .top-layer {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 2;

        .icon-back {
          display: inline-block;
          padding: 10px 20px;
          font-size: @font-size-large-x;
          color: @color-theme;
        }

        h2 {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          font-size: @font-size-large;
          white-space: nowrap;
        }
      }

      .bg-img {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 70%;
        background: no-repeat 0 0;
        background-size: cover;
        transform-origin: top;

        .filter {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(7, 17, 27, 0.4);
        }

        .random-play {
          position: absolute;
          top: 82%;
          left: 50%;
          transform: translateX(-50%);
          width: 160px;
          height: 34px;
          line-height: 34px;
          text-align: center;
          border-radius: 17px;
          border: 1px solid @color-theme;
          color: @color-theme;

          i {
            margin-right: 6px;
            vertical-align: middle;
          }
        }
      }
    }

    /*跟随滚动上移*/

    .bg-layer {
      position: relative;
      height: 100%;
      background-color: @color-background;
    }

    .music-list-scroll {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
    }

    .loading {
      position: fixed;
      top: 50%;
      z-index: 9999;
    }
  }
</style>
