<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <!--完整进度条-->
    <div class="bar-inner">
      <!--已经播放进度条-->
      <div class="progress" ref="progress"></div>
      <!--小圆点-->
      <div
        class="progress-dot"
        ref="progressDot"
        @touchstart.prevent="dotTouchStart"
        @touchmove.prevent="dotTouchMove"
        @touchend.prevent="dotTouchEnd"
      ></div>
    </div>
  </div>
</template>

<script>
  // 工具函数
  import { prefixStyle } from '@/common/dom'

  const progressDotWidth = 12
  const transform = prefixStyle('transform')

  export default {
    name: 'ProgressBar',
    props: {
      percent: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        // 完整可见进度条宽度(减去了小点)
        barWidth: 0,
      }
    },
    created() {
      // 创建一个touch对象共享3个时间得到一些数据
      this.touch = {}
    },
    methods: {
      /*事件监听*/
      // 1.手指触摸进度条
      dotTouchStart(e) {
        // touch初始化完成
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        // 在点击时已经播放进度条的宽度
        this.touch.leftWidth = this.$refs.progress.clientWidth
      },
      // 2.手指拖动进度条
      dotTouchMove(e) {
        if (!this.touch.initiated) return
        // 实时手指移动距离
        const distanceX = e.touches[0].pageX - this.touch.startX
        // offsetWidth不能小于0也不能大于完整进度条宽度
        const offsetWidth = Math.min(
          this.barWidth,
          Math.max(0, this.touch.leftWidth + distanceX),
        )
        this._offset(offsetWidth)
      },
      // 3.手指离开进度条
      dotTouchEnd() {
        this.touch.initiated = false
        // 拖动完毕后派发完成事件,并将此时进度传出
        this._triggerPercent()
      },
      // 4.手指点击进度条
      progressClick(e) {
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
        // this._offset(e.offsetX)
        this._triggerPercent()
      },

      /*私有方法*/
      // 1.进度条和小圆点偏移
      _offset(offsetWidth) {
        /*设置进度条偏移*/
        this.$refs.progress.style.width = `${offsetWidth}px`
        /*设置小圆点偏移*/
        this.$refs.progressDot.style[
          transform
          ] = `translate3d(${offsetWidth}px, 0, 0)`
      },
      // 2.派发拖动或点击圆点后播放进度
      _triggerPercent() {
        if (this.barWidth === 0) return
        // 使用最新的progress宽度
        const percent = this.$refs.progress.clientWidth / this.barWidth
        this.$emit('percentChange', percent)
      },
    },
    watch: {
      percent(newValue) {
        // 只有不拖动时才进行计算
        // TODO 这里barWidth不用频繁获取
        this.barWidth = this.$refs.progressBar.clientWidth - progressDotWidth
        if (newValue >= 0 && !this.touch.initiated) {
          /*播放进度条应该完成量*/
          let offsetWidth = newValue * this.barWidth
          this._offset(offsetWidth)
        }
      },
    },
  }
</script>

<style scoped lang="less">
  @import '~assets/css/variable';

  .progress-bar {
    display: flex;
    align-items: center;
    height: 30px;

    .bar-inner {
      width: 100%;
      height: 4px;
      background-color: rgba(0, 0, 0, 0.3);

      .progress {
        height: 100%;
        width: 0;
        background-color: @color-theme;
      }

      .progress-dot {
        position: relative;
        top: -12px;
        width: 12px;
        height: 12px;
        border: 3px solid #fff;
        border-radius: 50%;
        background-color: @color-theme;
      }
    }
  }
</style>
