<template>
  <transition name="slide">
    <div class="add-to-list" v-show="showFlag" @click.stop>
      <!--头部标题-->
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <!--搜索框-->
      <div class="search-box-wrapper">
        <search-box
          ref="searchBox"
          placeholder="搜索歌曲"
          @newQuery="getNewQuery"
        />
      </div>
      <!--最近播放和搜索历史-->
      <div class="shortcut" v-show="!query">
        <switches
          :currentIndex="currentIndex"
          :switches="switches"
          @switchChange="switchChange"
        />
        <div class="list-wrapper">
          <!--播放历史-->
          <vertical-scroll
            class="playHistoryScroll"
            ref="playHistoryScroll"
            v-if="currentIndex === 0"
            :data="getPlayHistory"
          >
            <specific-list :songs="getPlayHistory" @songClick="songClick"/>
          </vertical-scroll>
          <!--搜索历史-->
          <vertical-scroll
            class="searchHistoryScroll"
            ref="searchHistoryScroll"
            v-if="currentIndex === 1"
            :data="getSearchHistory"
          >
            <search-history
              :query="query"
              @deleteOne="deleteSearchHistory"
              @clearHistory="showConfirm"
              @selectItem="addQuery"
            />
          </vertical-scroll>
        </div>
      </div>
      <!--搜索结果-->
      <div class="search-result" v-show="query">
        <search-suggest
          class="suggest"
          :query="query"
          :showSinger="showSinger"
          @select="saveSearch"
          @blurInput="blurInput"
        />
      </div>
      <!--confirm警告-->
      <confirm ref="confirm" text="是否清空搜索历史"/>
      <!--TopTip组件-->
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">该首歌曲已加入播放队列</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
  // 公共组件
  import SearchBox from '@/components/common/searchBox/SearchBox'
  import SearchSuggest from '@/components/common/searchSuggest/SearchSuggest'
  import Switches from '@/components/common/switches/Switches'
  import VerticalScroll from '@/components/common/scroll/VerticalScroll'
  import SpecificList from '@/components/content/musicListView/childComps/SpecificList'
  import SearchHistory from '@/components/content/searchHistory/SearchHistory'
  import Confirm from '@/components/common/confirm/Confirm'
  import TopTip from '@/components/common/topTip/TopTip'

  // 公共资源
  import Song from '@/common/songs'

  // mixin
  import { searchMixin } from '@/common/mixin'

  // vuex
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [searchMixin],
    name: 'AddToList',
    data() {
      return {
        showFlag: false,
        showSinger: false,
        currentIndex: 0,
        switches: [{ name: '最近播放' }, { name: '搜索历史' }],
      }
    },
    computed: {
      ...mapGetters(['getPlayHistory', 'getSearchHistory']),
    },
    methods: {
      ...mapActions(['insertSong', 'deleteSearchHistory']),
      // 事件处理
      // 1.点击搜索结果保存到搜索历史
      selectSuggest() {
        this.saveSearch()
      },
      // 2.最近搜索和搜索历史切换
      switchChange(switchIndex) {
        this.currentIndex = switchIndex
      },
      // 3.点击播放历史歌曲
      songClick(item, index) {
        // 当index不是第一首歌时(排第一的歌就是当前播放的歌)
        if (index !== 0) {
          // 该item还不是song实例
          this.insertSong(new Song(item))
          this.$refs.topTip.show()
        }
      },
      // 4.显示confirm
      showConfirm() {
        this.$refs.confirm.show()
      },

      // 私有方法
      show() {
        this.showFlag = true
        // 进入界面时需要手动刷新
        setTimeout(() => {
          if (this.currentIndex === 0) {
            this.$refs.playHistoryScroll.refresh()
          } else {
            this.$refs.searchHistoryScroll.refresh()
          }
        }, 20)
      },
      hide() {
        this.showFlag = false
      },
    },
    components: {
      SearchBox,
      SearchSuggest,
      Switches,
      VerticalScroll,
      SpecificList,
      SearchHistory,
      Confirm,
      TopTip,
    },
  }
</script>

<style scoped lang="less">
  @import '~assets/css/variable';
  @import '~assets/css/mixin';

  .add-to-list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 200;
    background: @color-background;

    .header {
      h1 {
        line-height: 44px;
        font-size: 18px;
        color: #fff;
        text-align: center;
      }

      .close {
        position: absolute;
        top: 0;
        right: 8px;

        .icon-close {
          display: inline-block;
          padding: 12px;
          font-size: @font-size-large;
          color: @color-theme;
        }
      }
    }

    .shortcut {
      height: calc(100vh - 124px);

      .list-wrapper {
        .playHistoryScroll {
          height: 100%;
        }

        .searchHistoryScroll {
          height: 100%;
        }
      }
    }

    .search-result {
      .suggest {
        top: 124px;
        bottom: 0;
      }
    }

    .tip-title {
      line-height: 40px;
      font-size: @font-size-medium;
      text-align: center;

      i {
        color: @color-theme;
        margin-right: 6px;
      }
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
