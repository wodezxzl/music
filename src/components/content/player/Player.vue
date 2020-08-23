<template>
  <div class="player" v-show="getPlayList.length > 0">
    <!--展开全屏播放器-->
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="isFullScreen">
        <!--背景图片-->
        <div class="bg-img" v-if="getCurrentSong" :style="bgImg"></div>

        <!--顶栏返回和歌曲信息-->
        <div class="top-layer">
          <!--返回-->
          <div class="back" @click="back"><i class="icon-back"></i></div>
          <!--歌曲信息-->
          <div class="song-detail" v-if="getCurrentSong">
            <span v-html="getCurrentSong.name"></span>
            <span v-html="getCurrentSong.singer"></span>
          </div>
        </div>

        <!--中间展示区-->
        <div class="middle">
          <!--cd图片区-->
          <div class="cd-wrapper">
            <!--**这里用v-show会报错**-->
            <div class="cd" v-if="getCurrentSong" ref="cdWrapper">
              <!--这个cdCls中的动画不能和父级动画放在一起-->
              <img :src="getCurrentSong.img" :class="cdCls" alt="" />
            </div>
          </div>
        </div>

        <!--底部播放选项区-->
        <div class="player-layer">
          <!--进度条-->
          <div class="progress-wrapper">
            <span class="time time-l">{{ songPlayedTime }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="percentChange"/>
            </div>
            <span class="time time-r">{{ songTotalTime }}</span>
          </div>
          <!--按钮区-->
          <div class="button">
            <i class="icon-random"></i>
            <i class="icon-prev" :class="disableCls" @click="prev"></i>
            <i :class="[playIcon, disableCls]" @click="togglePlaying"></i>
            <i class="icon-next" :class="disableCls" @click="next"></i>
            <i class="icon-not-favorite"></i>
          </div>
        </div>
      </div>
    </transition>
    <!--缩小小播放器-->
    <transition name="mini">
      <div class="mini-player" v-show="!isFullScreen" @click="openFullScreen">
        <!--右边缩略图-->
        <div class="left-desc" v-if="getCurrentSong">
          <img :src="getCurrentSong.img" :class="cdCls" alt="" />
          <div class="desc">
            <span v-html="getCurrentSong.name"></span>
            <span v-html="getCurrentSong.singer"></span>
          </div>
        </div>

        <!--左边按钮-->
        <div class="right-button">
          <!--圆形播放进度条-->
          <progress-circle :radius="radius" :percent="percent">
            <!--这里要阻止冒泡,因为父级也有点击事件-->
            <i
              @click.stop="togglePlaying"
              class="icon-mini"
              :class="playMiniIcon"
            ></i>
          </progress-circle>
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!--audio标签播放-->
    <div v-if="getCurrentSong && getCurrentSong.url">
      <audio
        :src="getCurrentSong.url"
        ref="audio"
        @canplay="ready"
        @error="error"
        @timeupdate="updateTime"
      />
    </div>
  </div>
</template>

<script>
  // 公共组件
  import ProgressBar from './ProgressBar'
  import ProgressCircle from './ProgressCircle'

  // 公共资源
  import animations from 'create-keyframe-animation'
  import { formatTime } from '@/common/utils'

  // vuex
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'Player',
    data() {
      return {
        songReady: false,
        currentTime: 0,
        radius: 34,
      }
    },
    computed: {
      ...mapGetters([
        'isPlaying',
        'isFullScreen',
        'getCurrentSong',
        'getPlayList',
        'getCurrentIndex',
      ]),
      // 0.切换歌曲的得到的新url
      // **直接判断getCurrentSong的变化来播放歌曲不行(在上一首下一首时)
      newUrl() {
        if (this.getCurrentSong && this.getCurrentSong.url) {
          return this.getCurrentSong.url
        }
        return null
      },
      // 1.设置背景图片
      bgImg() {
        return `backgroundImage: url(${this.getCurrentSong.img})`
      },
      // 2.根据播放状态改变全屏按钮样式
      playIcon() {
        return this.isPlaying ? 'icon-pause' : 'icon-play'
      },
      // 3.根据播放状态改变小屏按钮样式
      playMiniIcon() {
        return this.isPlaying ? 'icon-pause-mini' : 'icon-play-mini'
      },
      // 4.cd旋转动画样式
      cdCls() {
        return this.isPlaying ? 'play-rotate' : 'play-rotate pause-rotate'
      },
      // 5.songReady为false时上下曲的图标样式
      disableCls() {
        return this.songReady ? '' : 'disableCls'
      },
      // 6.歌曲已经播放时间
      songPlayedTime() {
        return formatTime(this.currentTime)
      },
      // 7.歌曲总时间
      songTotalTime() {
        return this.getCurrentSong
          ? formatTime(this.getCurrentSong.duration)
          : '00:00'
      },
      // 8.已播放量的百分比
      percent() {
        return this.getCurrentSong
          ? this.currentTime / this.getCurrentSong.duration
          : 0
      },
    },
    methods: {
      /**
       *vuex
       */
      ...mapMutations(['setFullScreen', 'setPlaying', 'setCurrentIndex']),

      /**
       * 事件处理
       */
      // 1.点击返回显示mini播放器,回到歌手详情页面
      back() {
        this.setFullScreen(false)
      },
      // 2.点击小播放器显示全屏播放器
      openFullScreen() {
        this.setFullScreen(true)
      },
      // 3.点击播放和暂停按钮时保存状态
      togglePlaying() {
        // 先把state中保存的播放状态设置正确
        this.setPlaying(!this.isPlaying)
      },
      // 4.点击上一曲
      prev() {
        // 还不能播放时不进行后续操作
        if (!this.songReady) return
        let index = this.getCurrentIndex - 1
        if (index === -1) {
          index = this.getCurrentIndex.length - 1
        }
        this.setCurrentIndex(index)
        // 点击之后恢复
        this.songReady = false
      },
      // 5.点击下一曲
      next() {
        if (!this.songReady) return
        let index = this.getCurrentIndex + 1
        if (index === this.getCurrentIndex.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        this.songReady = false
      },
      // 6.audio可以播放时触发该canplay事件
      ready() {
        this.songReady = true
      },
      // 7.歌曲播放失败触发函数
      error() {
        // 发生错误后也能下一曲和上一曲切换
        this.songReady = true
      },
      // 8.歌曲播放时会触发事件updateTime
      updateTime(e) {
        // 事件对象里面的currentTime可读写
        this.currentTime = e.target.currentTime
      },
      // 9.进度条拖动后传出事件,重新设置播放进度
      percentChange(percent) {
        this.$refs.audio.currentTime = this.getCurrentSong.duration * percent
        // 如果当前是暂停状态,拖动切换为播放状态
        if (!this.isPlaying) {
          this.togglePlaying()
        }
      },

      /**
       *私有方法
       */
      // 1.获得位移距离和缩放比例
      _getPosAndScale() {
        const targetWidth = 40
        const marginLeft = 40
        const marginBottom = 30
        const paddingTop = 100
        const width = 300
        const scale = targetWidth / width
        const x = -(window.innerWidth / 2 - marginLeft)
        const y = window.innerHeight - paddingTop - width / 2 - marginBottom
        return {
          x,
          y,
          scale,
        }
      },

      /**
       * 动画回调
       */
      enter(el, done) {
        const { x, y, scale } = this._getPosAndScale()

        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`,
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`,
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`,
          },
        }
        // 注册动画
        animations.registerAnimation({
          name: 'move',
          animation,
          // 预设
          presets: {
            duration: 400,
            easing: 'linear',
          },
        })
        // 运行动画
        //TODO 这里动画对象的选择不是很明白(应该是父级对象绝对定位的影响)
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        // 取消动画
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
        // 变成mini播放器时运行函数
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const { x, y, scale } = this._getPosAndScale()
        this.$refs.cdWrapper.style[
          'transform'
        ] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        // 动画完成后需要调用done函数
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave() {
        // 最后清除所有动画
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style['transform'] = ''
      },
    },
    watch: {
      // 1.getCurrentSong变化时说明有值了,可以播放了,调用audio的方法来播放音乐
      newUrl(newValue) {
        // TODO $nextTick的作用还不是很了解
        this.$nextTick(() => {
          newValue ? this.$refs.audio.play() : ''
        })
      },
      // 2.记录播放状态的数据变化,改变播放状态
      isPlaying(newValue) {
        this.$nextTick(() => {
          if (this.$refs.audio) {
            const audio = this.$refs.audio
            newValue ? audio.play() : audio.pause()
          }
        })
      },
    },
    components: {
      ProgressBar,
      ProgressCircle,
    },
  }
</script>

<style scoped lang="less">
  @import '~assets/css/variable';

  .player {
    .normal-player {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 10000;
      background-color: #000;
      overflow: hidden;
      /*背景图片*/
      .bg-img {
        position: absolute;
        top: -5%;
        left: -5%;
        width: 110%;
        height: 110%;
        background: no-repeat center;
        background-size: cover;
        filter: blur(12px);
        opacity: 0.8;
        z-index: -1;
      }

      /*顶栏返回和歌曲信息*/
      .top-layer {
        .back {
          display: inline-block;
          padding: 20px;
          font-size: 30px;
          color: @color-theme;
          transform: rotate(-90deg);
        }

        .song-detail {
          display: flex;
          flex-direction: column;
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;

          span {
            display: inline-block;
            margin: 6px 0;
          }

          span:first-child {
            font-size: @font-size-large;
          }

          span:last-child {
            font-size: @font-size-medium;
          }
        }
      }

      /*中间区域*/
      .middle {
        position: fixed;
        top: 100px;
        bottom: 180px;
        width: 100%;
        /*cd图片区*/

        .cd-wrapper {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 300px;
          height: 300px;

          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 10px solid @color-dialog-background;
            box-sizing: border-box;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }

      /*底部播放区*/
      .player-layer {
        position: absolute;
        bottom: 50px;
        width: 100%;
        /*进度条*/

        .progress-wrapper {
          display: flex;
          align-items: center;
          padding: 20px 40px;

          .progress-bar-wrapper {
            flex: 1;
          }

          .time {
            flex: 0 0 40px;
            font-size: 12px;
          }

          .time-l {
            text-align: left;
          }

          .time-r {
            text-align: right;
          }
        }

        /*按钮*/

        .button {
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          width: 100%;
          font-size: 32px;
          color: @color-theme;

          i:nth-child(3) {
            font-size: 44px;
          }
        }
      }

      /*动画*/
      &.normal-enter-active,
      &.normal-leave-active {
        transition: all 0.4s;

        .top-layer,
        .player-layer {
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
        }
      }

      &.normal-enter,
      &.normal-leave-to {
        opacity: 0;

        .top-layer {
          transform: translate3d(0, -100px, 0);
        }

        .player-layer {
          transform: translate3d(0, 100px, 0);
        }
      }
    }

    .mini-player {
      display: flex;
      justify-content: space-between;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 60px;
      z-index: 10000;
      background-color: @color-highlight-background;

      .left-desc {
        display: flex;
        align-items: center;

        img {
          margin: 0 10px 0 20px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .desc {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: flex-start;
          height: 60px;

          span:first-child {
            color: @color-text;
            font-size: @font-size-medium-x;
          }

          span:last-child {
            color: @color-text-d;
            font-size: @font-size-small;
          }
        }
      }

      .right-button {
        display: flex;
        align-items: center;
        margin-right: 10px;
        color: @color-theme-d;
        font-size: 34px;

        .icon-mini {
          position: absolute;
          left: -10px;
          top: 1px;
        }

        i {
          margin: 0 10px;
        }
      }

      /*动画*/
      &.mini-enter-active,
      &.mini-leave-active {
        transition: all 0.4s;
      }

      &.mini-enter,
      &.mini-leave-to {
        opacity: 0;
      }
    }

    /*cd旋转动画*/
    // **这里动画样式不能写在外面,会与播放器展开收缩冲突
    .play-rotate {
      animation: rotateAnimation 20s linear infinite;
    }
    .pause-rotate {
      animation-play-state: paused;
    }
  }

  @keyframes rotateAnimation {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
