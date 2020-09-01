<template>
  <transition name="slide">
    <div class="user">
      <!--返回按钮-->
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <!--切换模块-->
      <div class="switches-wrapper">
        <switches
          :switches="switches"
          :currentIndex="currentIndex"
          @switchChange="switchChange"
        />
      </div>
      <!--随机播放按钮-->
      <div class="play-btn" @click="playRandom">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <!--列表-->
      <div class="list-wrapper" ref="listWrapper">
        <!--我喜欢的-->
        <vertical-scroll
          class="favoriteScroll"
          ref="favoriteScroll"
          v-if="currentIndex === 0"
          :data="getFavoriteList"
        >
          <specific-list :songs="getFavoriteList" @songClick="songClick"/>
        </vertical-scroll>
        <!--播放历史-->
        <vertical-scroll
          class="playScroll"
          ref="playScroll"
          v-if="currentIndex === 1"
          :data="getPlayHistory"
        >
          <specific-list :songs="getPlayHistory" @songClick="songClick"/>
        </vertical-scroll>
      </div>
      <div class="no-result" v-show="noResult">
        <no-result :title="title"/>
      </div>
    </div>
  </transition>
</template>

<script>
  // 公共资源
  import Song from '@/common/songs'

  // 公共组件
  import Switches from '@/components/common/switches/Switches'
  import VerticalScroll from '@/components/common/scroll/VerticalScroll'
  import SpecificList from '@/components/content/musicListView/childComps/SpecificList'
  import NoResult from '@/components/common/noResult/NoResult'

  // vuex
  import { mapActions, mapGetters } from 'vuex'

  // mixin
  import { playerMixin } from '@/common/mixin'

  export default {
    mixins: [playerMixin],
    name: 'User',
    data() {
      return {
        switches: [{ name: '我喜欢的' }, { name: '最近听的' }],
        currentIndex: 0,
      }
    },
    computed: {
      ...mapGetters(['getFavoriteList', 'getPlayHistory']),
      noResult() {
        if (this.currentIndex === 0) {
          return !this.getFavoriteList.length
        } else if (this.currentIndex === 1) {
          return !this.getPlayHistory.length
        }
        return false
      },
      title() {
        if (this.noResult) {
          if (this.currentIndex === 0) {
            return '暂无收藏歌曲'
          } else if (this.currentIndex === 1) {
            return '暂无播放历史'
          }
        }
        return '无'
      },
    },
    methods: {
      ...mapActions(['insertSong', 'playRandomSong']),
      // 事件处理
      back() {
        this.$router.back()
      },
      playRandom() {
        let list =
          this.currentIndex === 0 ? this.getFavoriteList : this.getPlayHistory
        if (list.length === 0) return
        list = list.map(song => new Song(song))
        this.playRandomSong({ list })
      },

      // 私有方法
      switchChange(index) {
        this.currentIndex = index
      },
      songClick(song) {
        this.insertSong(new Song(song))
      },
      handlePlaylist(playlist) {
        this.$refs.listWrapper.style.bottom = playlist.length > 0 ? '60px' : 0
        this.$refs.favoriteScroll && this.$refs.favoriteScroll.refresh()
        this.$refs.playScroll && this.$refs.playScroll.refresh()
      },
    },
    components: {
      Switches,
      VerticalScroll,
      SpecificList,
      NoResult,
    },
  }
</script>

<style scoped lang="less">
  @import '~assets/css/variable';

  .user {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    background: @color-background;

    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;

      i {
        display: block;
        padding: 10px;
        font-size: @font-size-large-x;
        color: @color-theme;
      }
    }

    .switches-wrapper {
      margin: 10px 0 30px 0;
    }

    .play-btn {
      box-sizing: border-box;
      width: 135px;
      padding: 7px 0;
      margin: 0 auto;
      text-align: center;
      border: 1px solid @color-text-l;
      color: @color-text-l;
      border-radius: 100px;
      font-size: 0;

      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: @font-size-medium-x;
      }

      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: @font-size-small;
      }
    }

    .list-wrapper {
      position: absolute;
      top: 110px;
      bottom: 0;
      width: 100%;

      .swiper-scroll {
        height: 100%;
        overflow: hidden;
      }
    }

    .no-result {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
    }
  }

  /*动画*/
  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter,
  .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
