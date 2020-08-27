<template>
  <div id="search">
    <!--搜索框-->
    <search-box ref="searchBox" @newQuery="getNewQuery"></search-box>
    <vertical-scroll :data="shortcut" ref="cScroll">
      <!--热门搜索-->
      <div class="hot-key" v-show="!query">
        <h2>热门搜索</h2>
        <ul>
          <li v-for="item in hotKey" :key="item.n" @click="addQuery(item.k)">
            {{ item.k }}
          </li>
        </ul>
      </div>
      <!--搜索历史-->
      <search-history
        :query="query"
        @selectItem="addQuery"
        @deleteOne="deleteSearchHistory"
        @clearHistory="showConfirm"
      />
    </vertical-scroll>
    <!--即时搜索索引-->
    <search-suggest
      :query="query"
      v-show="query"
      @blurInput="blurInput"
      @select="saveSearch"
    />
    <!--确定全部删除弹窗-->
    <confirm
      ref="confirm"
      text="是否清空所有搜索历史"
      @clearHistory="clearSearchHistory"
    />
    <!--如果是歌手跳转到歌手详情-->
    <router-view/>
  </div>
</template>

<script>
  // 公共组件
  import SearchBox from '@/components/common/searchBox/SearchBox'
  import SearchSuggest from '@/components/common/searchSuggest/SearchSuggest'
  import SearchHistory from '@/components/content/searchHistory/SearchHistory'
  import Confirm from '@/components/common/confirm/Confirm'
  import VerticalScroll from '@/components/common/scroll/VerticalScroll'
  // 网络请求
  import { getHotKey } from '@/network/search'
  import { ERR_OK } from '@/network/config'
  // vuex
  import { mapActions, mapGetters } from 'vuex'
  // mixin
  import { playlistMixin } from '@/common/mixin'

  export default {
    mixins: [playlistMixin],
    name: 'Search',
    data() {
      return {
        hotKey: [],
        query: '',
      }
    },
    computed: {
      ...mapGetters(['getSearchHistory']),
      shortcut() {
        // 通过热词和历史的改变来实时改变可滚动距离
        return this.hotKey.concat(this.getSearchHistory)
      },
    },
    created() {
      this._getHotKey()
    },
    methods: {
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory',
        'clearSearchHistory',
      ]),
      // 事件处理
      // 1.点击热词添加到搜索框
      addQuery(query) {
        this.$refs.searchBox.changeQuery(query)
        // 并添加历史
        this.saveSearch(query)
      },
      // 2.搜索框中query发生改变,保存最新query
      getNewQuery(newQuery) {
        this.query = newQuery
      },
      // 3.搜索列表滚动后取消搜索框的焦点,使得移动端输入键盘消失
      blurInput() {
        this.$refs.searchBox._blur()
      },
      // 4.搜索的歌曲被点击,将其加入历史列表
      saveSearch(name) {
        this.saveSearchHistory(name)
      },
      // 5.显示confirm
      showConfirm() {
        this.$refs.confirm.show()
      },
      handlePlaylist(playlist) {
        this.$refs.cScroll.$el.style.bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.cScroll.refresh()
      },

      // 私有方法
      // 1.获取热词
      _getHotKey() {
        getHotKey().then(res => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      },
    },
    watch: {
      query(newValue) {
        if (!newValue) {
          // 当你从搜索建议退出到开始状态时,由于搜索历史和热词滚动的dom还没有显示,所以不能计算滚动高度
          // 所以设置一个定时器,切换回来dom显示手动刷新高度
          setTimeout(() => {
            this.$refs.cScroll.refresh()
          }, 20)
        }
      },
    },
    components: {
      SearchBox,
      SearchSuggest,
      SearchHistory,
      Confirm,
      VerticalScroll,
    },
  }
</script>

<style scoped lang="less">
  @import '~assets/css/variable';
  @import '~assets/css/mixin';

  #search {
    .swiper-scroll {
      position: absolute;
      top: 168px;
      bottom: 0;
      overflow: hidden;
    }

    .hot-key {
      margin: 20px;

      h2 {
        margin-bottom: 20px;
        font-size: @font-size-medium;
        color: @color-text-l;
      }

      ul {
        li {
          display: inline-block;
          margin: 0 12px 12px 0;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: @font-size-medium;
          color: @color-text-d;
          background-color: @color-highlight-background;
        }
      }
    }
  }
</style>
