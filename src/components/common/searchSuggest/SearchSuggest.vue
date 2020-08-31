<template>
  <div class="search-suggest">
    <vertical-scroll
      :data="result"
      :pullUpLoad="true"
      :beforeScroll="true"
      @getMore="getMore"
      @startScroll="startScroll"
      ref="cScroll"
    >
      <ul class="search-suggest-list">
        <li
          class="suggest-item"
          v-for="(item, index) in result"
          :key="index"
          @click="itemClick(item)"
        >
          <i class="icon" :class="_getIconCls(item)"></i>
          <span class="name" v-html="_getDisplayName(item)"></span>
        </li>
      </ul>
      <!--loading一直显示,只不过在最下面上拉才能看见,当没有更多数据时消失-->
      <loading v-show="hasMore"/>
      <!--没有搜索结果是显示-->
      <div class="no-result-wrapper" v-show="!hasMore && !result.length">
        <no-result title="抱歉,暂无搜索结果"/>
      </div>
    </vertical-scroll>
  </div>
</template>

<script>
  // 网络请求
  import { search } from '@/network/search'
  import { ERR_OK } from '@/network/config'

  // 公共资源
  import { createSong } from '@/common/songs'
  import Singer from '@/common/singer'

  // 公共组件
  import Loading from '@/components/common/loading/Loading'
  import VerticalScroll from '@/components/common/scroll/VerticalScroll'
  import NoResult from '@/components/common/noResult/NoResult'

  // vuex
  import { mapMutations, mapActions, mapGetters } from 'vuex'

  // mixin
  import { playlistMixin } from '@/common/mixin'

  const perpage = 20

  export default {
    mixins: [playlistMixin],
    name: 'SearchSuggest',
    props: {
      query: {
        type: String,
        default: '',
      },
      showSinger: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        page: 1,
        // 检索结果
        result: [],
        // 是否还有更多数据
        hasMore: true,
      }
    },
    computed: {
      ...mapGetters(['isFullScreen']),
    },
    methods: {
      ...mapMutations(['setSinger']),
      ...mapActions(['insertSong']),
      // 事件处理
      // 1.上拉加载更多
      getMore() {
        // 没有更多数据就返回
        if (!this.hasMore) return
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then(res => {
          if (res.data.code === ERR_OK) {
            this.result = this.result.concat(
              this._normalizeSearch(res.data.data),
            )
            // 在一次上拉加载后需要调用,其实放在这里不太好,应该在getMore中实现
            this.$refs.cScroll.finishPullUp()
            this._checkMore(res.data.data)
          }
        })
      },
      // 2列表点击进入歌手页或播放页
      itemClick(item) {
        // 进入歌手页
        if (item.type === 'singer') {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername,
          })
          // 跳转路由到歌手详情页
          this.$router.push({
            path: `/search/${singer.id}`,
          })
          // 传数据
          this.setSinger(singer)
        }
        // 进入播放页
        // 提交action
        this.insertSong(item)
        this.$emit('select', this._getDisplayName(item))
      },
      // 3.搜索后开始滚动
      startScroll() {
        this.$emit('blurInput')
      },
      handlePlaylist(playlist) {
        this.$refs.cScroll.$el.style.bottom =
          // 应该在mini播放器情况下才计算
          playlist.length > 0 && !this.isFullScreen ? '60px' : ''
        this.$refs.cScroll.refresh()
      },

      // 私有方法
      // 1.根据搜索框中的关键词检索歌曲
      _search() {
        this.hasMore = true
        // 重新搜索时需要将page重置为0
        this.page = 1
        // 重新搜索时需要重置滚动
        this.$refs.cScroll.scrollTo(0, 0)
        this.$refs.cScroll.refresh()
        search(this.query, this.page, this.showSinger, perpage).then(res => {
          if (res.data.code === ERR_OK) {
            this.result = this._normalizeSearch(res.data.data)
            this._checkMore(res.data.data)
          }
        })
      },
      // 2.格式化检索结果
      _normalizeSearch(res) {
        let ret = []
        if (res.zhida && res.zhida.singerid) {
          ret.push({ ...res.zhida, ...{ type: 'singer' } })
        }
        if (res.song) {
          ret = ret.concat(this._normalizeSearchSong(res.song.list))
        }
        return ret
      },
      // 3.进一步格式化检索歌曲结果
      _normalizeSearchSong(songs) {
        let ret = []
        songs.forEach(item => {
          if (item.songid && item.albumid) {
            ret.push(createSong(item))
          }
        })
        return ret
      },
      // 4.检测是否还用更多数据加载
      _checkMore(data) {
        const song = data.song
        if (!song.list.length || song.curpage * perpage >= song.totalnum) {
          this.hasMore = false
        }
      },
      // 5.根据数据设置icon样式
      _getIconCls(item) {
        if (item.type === 'singer') {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      // 6.根据数据设置name值
      _getDisplayName(item) {
        if (item.type === 'singer') {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
    },
    watch: {
      // 搜索词改变即进行搜索请求
      query() {
        this._search()
      },
    },
    components: {
      VerticalScroll,
      Loading,
      NoResult,
    },
  }
</script>

<style scoped lang="less">
  @import '~assets/css/variable';

  .search-suggest {
    position: fixed;
    top: 168px;
    bottom: 0;

    .swiper-scroll {
      position: absolute;
      top: 0;
      bottom: 0;
      overflow: hidden;
    }

    .search-suggest-list {
      display: flex;
      flex-direction: column;
      margin: 0 30px;
      color: @color-text-d;
      font-size: @font-size-medium-x;
      line-height: 40px;

      .suggest-item {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 20px;
          font-size: @font-size-medium-x;
        }

        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .no-result-wrapper {
      position: fixed;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
