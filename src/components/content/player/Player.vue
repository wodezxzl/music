<template>
  <div class="player" v-show="isPlaying">
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
              <img :src="getCurrentSong.img" alt=""/>
            </div>
          </div>
        </div>

        <!--底部播放选项区-->
        <div class="player-layer">
          <!--按钮区-->
          <div class="button">
            <i class="icon-random"></i>
            <i class="icon-prev"></i>
            <i class="icon-play"></i>
            <i class="icon-next"></i>
            <i class="icon-not-favorite"></i>
          </div>
        </div>
      </div>
    </transition>
    <!--缩小小播放器-->
    <transition name="mini">
      <div class="mini-player" v-show="!isFullScreen" @click="openFullScreen">
        <!--右边-->
        <div class="left-desc" v-if="getCurrentSong">
          <img :src="getCurrentSong.img" alt=""/>
          <div class="desc">
            <span v-html="getCurrentSong.name"></span>
            <span v-html="getCurrentSong.singer"></span>
          </div>
        </div>

        <!--左边-->
        <div class="right-button">
          <i class="icon-play-mini"></i>
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!--audio标签播放-->
    <div v-if="getCurrentSong">
      <audio :src="getCurrentSong.url" ref="audio"/>
    </div>
  </div>
</template>

<script>
  // 公共资源
  import animations from 'create-keyframe-animation'

  // vuex
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'Player',
    computed: {
      ...mapGetters(['isPlaying', 'isFullScreen', 'getCurrentSong']),
      // 1.设置背景图片
      bgImg() {
        return `backgroundImage: url(${this.getCurrentSong.img})`
      },
    },
    methods: {
      /**
       *vuex
       */
      ...mapMutations(['setFullScreen']),

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
      // 1.getCurrentSong变化时说明有值了,可以播放了
      getCurrentSong() {
        // TODO $nextTick的作用还不是很了解
        this.$nextTick(() => {
          // this.$refs.audio.play()
        })
      },
    },
  }
</script>

<style scoped lang="less">
  @import '~assets/css/variable';

  .player {
    .normal-player {
      position: absolute;
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
        color: @color-theme;
        font-size: 34px;

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
  }
</style>
