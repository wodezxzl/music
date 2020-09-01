<template>
  <transition name="list">
    <div class="playlist" v-show="showFlag" @click="_hide">
      <!--该点击事件仅仅是为了阻止其他点击事件的冒泡,影响到最顶层的点击事件造成隐藏-->
      <div class="list-wrapper" @click.stop>
        <!--头部-->
        <div class="list-header">
          <div class="title">
            <span class="icon-playlist-wrapper">
              <i :class="iconMode" @click="changeMode"></i>
            </span>
            <span class="playName">{{ modeText }}</span>
            <span class="icon-clear-wrapper" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </div>
        </div>
        <!--中间歌曲列表-->
        <vertical-scroll
          ref="playListScroll"
          :data="getSequenceList"
          :refreshDelay="refreshDelay"
        >
          <div class="list-content">
            <!--transition-group渲染成ul-->
            <!--由于有动画存在,动画需要一定时间,所以可滚动高度计算不准确-->
            <!--这里增加延时到100,以计算出正确可滚动高度-->
            <transition-group name="list" tag="ul">
              <li
                ref="listItem"
                v-for="(item, index) in getSequenceList"
                :key="item.id"
                @click="itemSelect(item, index)"
              >
                <i class="icon" :class="_getCurrentClass(item)"></i>
                <span class="song-name">{{ item.name }}</span>
                <i
                  :class="getFavoriteIcon(item)"
                  @click.stop="toggleFavorite(item)"
                ></i>
                <i class="icon-delete" @click.stop="deleteSong(item)"></i>
              </li>
            </transition-group>
          </div>
        </vertical-scroll>
        <!--添加歌曲到列表-->
        <div class="list-operate" @click="showAddSong">
          <i class="icon-add"></i>
          <span>添加歌曲到列表</span>
        </div>
        <!--关闭-->
        <div class="list-clear" @click="_hide">关闭</div>
      </div>
      <add-to-list ref="addToList"/>
      <confirm ref="confirm" text="是否清空播放列表" @clearHistory="clearAll"/>
    </div>
  </transition>
</template>

<script>
  // 公共资源
  import { playMode } from '@/common/utils'

  // 公共组件
  import VerticalScroll from '@/components/common/scroll/VerticalScroll'
  import Confirm from '@/components/common/confirm/Confirm'

  // 子组件
  import AddToList from './AddToList'

  // vuex
  import { mapActions } from 'vuex'

  // mixin
  import { playerMixin } from '@/common/mixin'

  export default {
    mixins: [playerMixin],
    name: 'PlayList',
    data() {
      return {
        showFlag: false,
        refreshDelay: 100,
      }
    },
    computed: {
      modeText() {
        return this.getMode === playMode.sequence
          ? '顺序播放'
          : this.getMode === playMode.random
            ? '随机播放'
            : '单曲循环'
      },
    },
    methods: {
      ...mapActions(['deleteOne', 'clearPlayList']),
      // 事件处理
      // 1.点击播放对应歌曲
      itemSelect(item, index) {
        if (this.getMode === playMode.random) {
          index = this.getPlayList.findIndex(song => {
            return song.id === item.id
          })
        }
        this.setCurrentIndex(index)
        this.setPlaying(true)
      },
      // 2.点击从当前列表删除歌曲
      deleteSong(item) {
        this.deleteOne(item)
        // 当删除所有列表后隐藏(如果不隐藏,当再次点击一首歌曲时在播放界面playlist会立即跳出来)
        // 因为playlist本来没有被点击关闭,是由于player组件在播放列表为空时隐藏了,所以在其里面的playlist也看不见了
        if (!this.getPlayList.length) {
          this._hide()
        }
      },
      // 3.显示confirm组件
      showConfirm() {
        this.$refs.confirm.show()
      },
      // 4.清空播放列表
      clearAll() {
        this.clearPlayList()
        this._hide()
      },
      // 5.添加歌曲到列表显示
      showAddSong() {
        this.$refs.addToList.show()
      },

      // 私有方法
      // 1.显示
      _show() {
        this.showFlag = true
        // 显示后才能计算dom,需要手动调用刷新一下(延迟一段时间等dom渲染完毕)
        setTimeout(() => {
          this.$refs.playListScroll.refresh()
          this._scrollToCurrent(this.getCurrentSong)
        }, 20)
      },
      // 2.隐藏
      _hide() {
        this.showFlag = false
      },
      // 3.设置当前播放歌曲的前面播放样式
      _getCurrentClass(item) {
        if (!this.getCurrentSong) return ''
        if (item.id === this.getCurrentSong.id) {
          return 'icon-play'
        }
      },
      // 4.滚动到正在播放歌曲
      _scrollToCurrent(current) {
        const index = this.getSequenceList.findIndex(item => {
          return item.id === current.id
        })
        this.$refs.playListScroll.scrollToElement(this.$refs.listItem[index])
      },
    },
    watch: {
      getCurrentSong(newValue, oldValue) {
        if (!this.showFlag || newValue === oldValue) return
        // 向播放列表中添加歌曲时,插入dom需要一定时间,所以等一定时间后再滚动到播放歌曲处
        setTimeout(() => {
          this._scrollToCurrent(newValue)
        }, 20)
      },
    },
    components: {
      VerticalScroll,
      Confirm,
      AddToList,
    },
  }
</script>

<style scoped lang="less">
  @import '~assets/css/variable';
  @import '~assets/css/mixin';

  .playlist {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 20000;
    background-color: @color-background-d;

    .list-wrapper {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: @color-highlight-background;

      .list-header {
        .title {
          display: flex;
          align-items: center;
          margin: 20px;

          .icon-playlist-wrapper {
            margin-right: 10px;
            font-size: 32px;
            color: @color-theme;
          }

          .playName {
            flex: 1;
            font-size: @font-size-medium;
            color: @color-text-ll;
          }

          .icon-clear-wrapper {
            color: @color-text-d;
          }
        }
      }

      .swiper-scroll {
        max-height: 240px;
        overflow: hidden;
      }

      .list-content {
        margin: 0 20px;
        /*删除动画*/

        &.list-enter-active,
        &.list-leave-active {
          transition: all 0.1s linear;
        }

        &.list-enter,
        &.list-leave-to {
          height: 0;
        }

        li {
          display: flex;
          align-items: center;
          line-height: 40px;

          .icon {
            margin-right: 6px;
            width: 16px;
          }

          .icon-play {
            color: @color-theme-d;
          }

          .song-name {
            flex: 1;
            font-size: @font-size-medium;
            color: @color-text-d;
          }

          .icon-not-favorite,
          .icon-delete {
            color: @color-theme;
            font-size: @font-size-medium;
          }

          .icon-delete {
            margin-left: 10px;
          }
        }
      }

      .list-operate {
        margin: 30px auto;
        padding: 8px 16px;
        width: fit-content;
        font-size: @font-size-medium;
        border: 1px solid;
        border-radius: 100px;
        color: @color-text-l;

        .icon-add {
          font-size: @font-size-small;
          margin-right: 10px;
        }
      }

      .list-clear {
        line-height: 49px;
        text-align: center;
        background-color: @color-background-d;
      }
    }
  }

  /*动画*/
  .list-enter-active,
  .list-leave-active {
    transition: opacity 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  .list-enter,
  .list-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
</style>
