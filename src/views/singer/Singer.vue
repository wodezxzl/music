<template>
  <div id="singer" ref="singer">
    <!--歌手列表-->
    <singer-list-view
      ref="listView"
      :data="normalizedSinger"
      :anchorIndex="singerListIndex"
      @nowIndex="goToNowIndex"
      @itemClick="singerItemClick"
    />
    <!--快速到达列表-->
    <div
      class="list-shortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove.prevent="onShortcutTouchMove"
    >
      <ul>
        <li
          v-for="(item, index) in title"
          :key="item"
          :data-index="index"
          :class="{ active: index === anchorIndex }"
          @click.stop="letterClick(index)"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <router-view />
  </div>
</template>

<script>
  // 子组件
  import SingerListView from '@/components/content/singerListView/SingerListView'

  // 网络请求
  import { getSingerList } from '@/network/singers'
  import { ERR_OK } from '@/network/config'

  // 公共函数或属性
  import { HOT_NAME, HOT_SINGER_LEN } from '@/common/const'
  import Singer from '@/common/singer'
  import { getDOMData } from '@/common/utils'

  // vuex
  import { mapMutations } from 'vuex'

  // mixin
  import { playlistMixin } from '@/common/mixin'

  const ANCHOR_HEIGHT = 18

  export default {
    mixins: [playlistMixin],
    name: 'Singer',
    components: {
      SingerListView,
    },
    data() {
      return {
        singersList: [],
        normalizedSinger: [],
        // 右侧快速到达栏应该活跃的index项
        anchorIndex: 0,
        // 歌手列表应该滚动到的项(这两个不能用一个变量,之后做联动时会互相影响)
        singerListIndex: 0,
      }
    },
    computed: {
      title() {
        return this.normalizedSinger.map(item => {
          if (item.title === '热门') {
            return item.title.substr(0, 1)
          }
          return item.title
        })
      },
    },
    created() {
      // 1.请求歌手列表
      this._getSingerList()
      // 2.创建一个touch对象
      // **不在data中定义的原因时这个属性不需要被监听改变
      this.touches = {}
    },
    methods: {
      /**
       *网络请求
       */
      // 1.请求歌手列表
      _getSingerList() {
        getSingerList().then(res => {
          if (res.code === ERR_OK) {
            this.singersList = res.data.list
          }
          // 将整合好的歌手哦数组保存起来
          this.normalizedSinger = this._normalizedSinger(this.singersList)
        })
      },
      // 2.整合歌手信息
      _normalizedSinger(singerList) {
        // 整合到map对象
        const map = {
          hot: {
            title: HOT_NAME,
            items: [],
          },
        }

        // 遍历向map中添加数据
        singerList.forEach((item, index) => {
          // 当index小于热门条数时向其中添加数据当做热门数据
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(
              new Singer({
                id: item.Fsinger_mid,
                name: item.Fsinger_name,
              }),
            )
          }
          // 当没有A-Z对应的对象时先创建一个对象
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: [],
            }
          }
          map[key].items.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name,
            }),
          )
        })

        // 对数据进行分类
        const hot = []
        const rel = []
        for (const key in map) {
          if (key.match(/^[a-zA-Z]$/)) {
            rel.push(map[key])
          }
          if (key === 'hot') {
            hot.push(map[key])
          }
        }

        // 对象是随机遍历的,之后的数组需要排序
        rel.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(rel)
      },

      /**
       * 事件处理
       */
      // 1.手指触摸获取快速到达列表项并添加样式
      onShortcutTouchStart(e) {
        const index = parseInt(getDOMData(e.target, 'index'))
        // 点击到盒子的其他位置为NaN,没有效果
        if (index === 0 || index) {
          // 获取触摸项的index
          this.singerListIndex = this.anchorIndex = index
          // 刚开始触摸时获取触摸位置和触摸项的index
          this.touches.y1 = e.touches[0].pageY
          this.touches.anchorIndex = this.anchorIndex
        }
      },
      // 2.手指在快速到达列表上滑动
      onShortcutTouchMove(e) {
        this.touches.y2 = e.touches[0].pageY
        // 两次手指移动的量除以每个列表项的高度,得到移动了几个列表项
        // **或0相对于Math.floor()向
        let delta = ((this.touches.y2 - this.touches.y1) / ANCHOR_HEIGHT) | 0
        // 那么现在的的anchorIndex就应该为两者相加的值
        this.singerListIndex = this.anchorIndex =
          this.touches.anchorIndex + delta
      },
      // 3.根据子组件传递过来的index改变快速到达列表样式
      goToNowIndex(nowIndex) {
        this.anchorIndex = nowIndex
      },
      // 4.歌手项被点击进行路由跳转,储存数据到vuex
      singerItemClick(item) {
        this.$router.push(`/singer/${item.id}`)
        this.setSinger(item)
      },
      // 5.某一个字母被点击跳转到相应分类歌手
      letterClick(index) {
        this.anchorIndex = index
        this.singerListIndex = index
      },
      // 6.操作scroll,不让mini播放器遮盖
      handlePlaylist(playlist) {
        // 设置滚动组件的bottom为mini播放器的高度
        this.$refs.singer.style.bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.listView._refresh()
      },

      /**
       * vuex
       */
      ...mapMutations(['setSinger']),
    },
  }
</script>

<style scoped lang="less">
  @import '~assets/css/variable';

  #singer {
    position: fixed;
    top: 88px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    overflow: hidden;

    .list-shortcut {
      position: fixed;
      right: 0;
      top: 56%;
      transform: translateY(-50%);
      font-size: @font-size-small;
      color: @color-text-l;

      ul {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0 3px;
        height: 440px;
        background-color: #000;
        border-radius: 16px;
      }

      li {
        height: 18px;
        line-height: 18px;
        width: 100%;
        text-align: center;
      }

      .active {
        color: @color-theme;
      }
    }
  }
</style>
