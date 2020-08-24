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
        <div
          class="middle"
          @touchstart="middleTouchStart"
          @touchmove="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <!--cd图片区-->
          <div class="middle-l" ref="middleLeft">
            <div class="cd-wrapper">
              <!--**这里用v-show会报错**-->
              <div class="cd" v-if="getCurrentSong" ref="cdWrapper">
                <!--这个cdCls中的动画不能和父级动画放在一起-->
                <img :src="getCurrentSong.img" :class="cdCls" alt=""/>
              </div>
            </div>
            <!--当前正在播放的歌词-->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>

          <!--歌词区-->
          <div class="middle-r">
            <vertical-scroll
              :data="currentLyric && currentLyric.lines"
              ref="lyricList"
            >
              <div class="lyric-wrapper">
                <div class="main-lyric" v-if="currentLyric">
                  <p
                    class="text"
                    :class="{ current: currentLineNum === index }"
                    ref="lyricLine"
                    v-for="(line, index) in currentLyric.lines"
                    :key="line.time"
                  >
                    {{ line.txt }}
                  </p>
                </div>
              </div>
            </vertical-scroll>
          </div>
        </div>

        <!--底部播放选项区-->
        <div class="player-layer">
          <!--dot区-->
          <div class="dot-wrapper">
            <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
            <span
              class="dot"
              :class="{ active: currentShow === 'lyric' }"
            ></span>
          </div>
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
            <i :class="iconMode" @click="changeMode"></i>
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
        @ended="songEnd"
      />
    </div>
  </div>
</template>

<script>
  // 公共组件
  import ProgressBar from './ProgressBar'
  import ProgressCircle from './ProgressCircle'
  import VerticalScroll from '@/components/common/scroll/VerticalScroll'

  // 公共资源
  import animations from 'create-keyframe-animation'
  import { formatTime } from '@/common/utils'
  import { playMode } from '@/common/utils'
  import { shuffle } from '@/common/utils'
  import { prefixStyle } from '@/common/dom'
  import LyricParser from 'lyric-parser'

  // vuex
  import { mapGetters, mapMutations } from 'vuex'

  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')

  export default {
    name: 'Player',
    data() {
      return {
        songReady: false,
        currentTime: 0,
        radius: 34,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: '',
      }
    },
    computed: {
      ...mapGetters([
        'isPlaying',
        'isFullScreen',
        'getCurrentSong',
        'getPlayList',
        'getCurrentIndex',
        'getMode',
        'getSequenceList',
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
      // 9.播放模式
      iconMode() {
        return this.getMode === playMode.sequence
          ? 'icon-sequence'
          : this.getMode === playMode.loop
            ? 'icon-loop'
            : 'icon-random'
      },
    },
    created() {
      this.touch = {}
    },
    methods: {
      /**
       *vuex
       */
      ...mapMutations([
        'setFullScreen',
        'setPlaying',
        'setCurrentIndex',
        'setMode',
        'setPlayList',
      ]),

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
        // 当暂停和开始时,歌词还是会播放,需要调用该函数解决
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      // 4.点击上一曲
      prev() {
        // 还不能播放时不进行后续操作
        if (!this.songReady) return
        // 只有一首歌曲就是单曲循环
        if (this.getPlayList.length === 1) {
          this._loop()
        } else {
          let index = this.getCurrentIndex - 1
          if (index === -1) {
            index = this.getCurrentIndex.length - 1
          }
          this.setCurrentIndex(index)
        }
        // 点击之后恢复
        this.songReady = false
      },
      // 5.点击下一曲
      next() {
        if (!this.songReady) return
        // 只有一首歌曲就是单曲循环
        if (this.getPlayList.length === 1) {
          this._loop()
        } else {
          let index = this.getCurrentIndex + 1
          if (index === this.getCurrentIndex.length) {
            index = 0
          }
          this.setCurrentIndex(index)
        }
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
        const currentTime = this.getCurrentSong.duration * percent
        this.$refs.audio.currentTime = currentTime
        // 如果当前是暂停状态,拖动切换为播放状态
        if (!this.isPlaying) {
          this.togglePlaying()
        }
        // 拖动进度条歌词显示条目跟着到相应位置
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      // 10.改变播放模式和修改播放列表
      changeMode() {
        let mode = this.getMode < 2 ? this.getMode + 1 : 0
        this.setMode(mode)
        let list = null
        if (mode === playMode.random) {
          list = shuffle(this.getSequenceList)
        } else {
          // 顺序播放和循环播放,列表不变
          list = this.getSequenceList
        }
        // 为了保证切换模式时当前播放歌曲不变,先将当前歌曲在新列表中的位置重置
        // 当下一步改变新列表后当前播放歌曲不会变化
        this._resetCurrentSong(list)
        // 设置当前播放列表
        this.setPlayList(list)
      },
      // 11.歌曲播放完毕触发函数
      songEnd() {
        if (this.getMode === playMode.loop) {
          // 播放完毕,单曲循环时执行loop函数
          this._loop()
        } else {
          // 另外两种模式下一曲就行
          this.next()
        }
      },
      // 12.手指触摸中间区域
      middleTouchStart(e) {
        this.touch.initiated = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      // 13.手指在中间区域移动
      middleTouchMove(e) {
        if (!this.touch.initiated) return
        const touch = e.touches[0]
        const distanceX = touch.pageX - this.touch.startX
        const distanceY = touch.pageY - this.touch.startY
        // 在纵轴上下滑动偏移大于横轴时什么都不做
        if (Math.abs(distanceY) > Math.abs(distanceX)) return
        // 歌词离屏幕右边缘的距离
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        // offsetWidth始终为负数,因为开始在右边,向左滑为负数,滑到指定位置后translate3d值为负
        // 从左向右滑,逐渐增大offsetWidth到0时,滑到开始位置
        const offsetWidth = Math.min(
          0,
          Math.max(-window.innerWidth, left + distanceX),
        )
        // 滑动的百分比
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        // 改变歌词的位置
        this.$refs.lyricList.$el.style[
          transform
          ] = `translate3d(${offsetWidth}px, 0, 0)`
        // 让唱片逐渐消失
        this.$refs.middleLeft.style.opacity = 1 - this.touch.percent
      },
      // 14.手指离开中间区域
      middleTouchEnd() {
        let offsetWidth
        let opacity
        // 如果是从右向左滑
        if (this.currentShow === 'cd') {
          // **只需要滑动10%就直接全部过去
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          // 如果是从左向右滑, 同样是10%
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            opacity = 1
            this.currentShow = 'cd'
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        this.$refs.lyricList.$el.style[
          transform
          ] = `translate3d(${offsetWidth}px, 0, 0)`
        // 歌词移动的过渡时间
        const time = 300
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        // 在最终位置时让唱片显示或消失
        this.$refs.middleLeft.style.opacity = opacity
        this.$refs.middleLeft.style[transitionDuration] = `${time}ms`
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
      // 2.重置当前播放歌曲
      _resetCurrentSong(list) {
        let index = list.findIndex(item => {
          return item.id === this.getCurrentSong.id
        })
        this.setCurrentIndex(index)
      },
      // 3.歌曲循环播放实现
      _loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        // 当循环播放时结束后重新开始播放需要将歌词偏移到开始位置
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      // 4.获取歌词并处理
      _parserLyric() {
        this.getCurrentSong
          .getLyric()
          .then(lyric => {
            // 处理歌词
            this.currentLyric = new LyricParser(lyric, this._handleLyric)
            if (this.isPlaying) {
              // 歌词滚动播放
              this.currentLyric.play()
            }
          })
          .catch(() => {
            this.currentLyric = null
            this.playingLyric = ''
            this.currentLineNum = 0
          })
      },
      // 5.每一行歌词改变时的回调函数
      _handleLyric({ lineNum, txt }) {
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          // 滚动当前播放超出5行,保证正在播放行在中间
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        // 设置当前正在播放歌词
        this.playingLyric = txt
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
      // **1.当getCurrentIndex变化时才请求歌曲url
      getCurrentIndex() {
        // 切换歌曲时需要先停止上一个歌曲歌词
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
        // getSongUrl定义在歌曲类的原型上,触发该函数获取url改变对应对象的url属性
        this.getCurrentSong.getSongUrl()
        // 获取处理歌词
        this._parserLyric()
      },
      // 2.getCurrentSong变化时说明有值了,可以播放了,调用audio的方法来播放音乐
      newUrl(newValue) {
        // TODO $nextTick的作用还不是很了解
        // setTimeout是为了保证当歌曲从后台切换到前台时还能播放
        setTimeout(() => {
          newValue ? this.$refs.audio.play() : ''
        }, 1000)
      },
      // 3.记录播放状态的数据变化,改变播放状态
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
      VerticalScroll,
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
        white-space: nowrap;
        top: 100px;
        bottom: 180px;
        width: 100%;
        /*cd图片区*/

        .middle-l {
          display: inline-block;
          width: 100%;
          height: 100%;
          vertical-align: top;

          .cd-wrapper {
            margin: 0 auto;
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

          .playing-lyric-wrapper {
            margin-top: 60px;
            text-align: center;
            line-height: 32px;
            color: @color-text-ll;
          }
        }

        /*歌词区*/

        .middle-r {
          display: inline-block;
          width: 100%;
          height: 100%;
          vertical-align: top;

          .swiper-scroll {
            height: 100%;
            overflow: hidden;
          }

          .lyric-wrapper {
            height: 100%;

            .main-lyric {
              width: 80%;
              margin: 0 auto;
              text-align: center;

              .text {
                line-height: 32px;
                font-size: 14px;
                color: @color-text-l;
              }

              .current {
                color: @color-theme;
                font-size: 16px;
                transition: font-size 0.5s;
              }
            }
          }
        }
      }

      /*底部播放区*/
      .player-layer {
        position: absolute;
        bottom: 50px;
        width: 100%;
        /*dot区*/

        .dot-wrapper {
          margin-top: 18px;
          text-align: center;

          .dot {
            display: inline-block;
            margin: 0 6px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: @color-text-ll;
          }

          .active {
            width: 20px;
            border-radius: 5px;
          }
        }

        /*进度条*/

        .progress-wrapper {
          display: flex;
          align-items: center;
          padding: 0 40px 20px;

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
