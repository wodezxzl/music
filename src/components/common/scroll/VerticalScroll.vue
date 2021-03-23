<template>
  <div class="vertical-scroll" ref="verticalScroll">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from '@better-scroll/core'
  import Pullup from '@better-scroll/pull-up'

  BScroll.use(Pullup)

  export default {
    name: 'VerticalScroll',
    props: {
      probeType: {
        type: Number,
        default: 1,
      },
      pullUpLoad: {
        type: Boolean,
        default: false,
      },
      data: {
        type: Array,
        default() {
          return []
        },
      },
      refreshDelay: {
        type: Number,
        default: 20,
      },
      beforeScroll: {
        type: Boolean,
        default: false,
      },
      click: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        Bscroll: null,
      }
    },
    mounted() {
      // 这里取初始化对象一定要用this.$refs(用类名它内部调用的是document.querySelector,只会找到第一个类)
      // this.$nextTick 的回调函数中初始化 better-scroll 。
      // 因为这个时候，wrapper 的 DOM 已经渲染了，我们可以正确计算它以及它内层 content 的高度以确保滚动正常
      this.$nextTick(() => {
        if (this.Bscroll) return
        this.Bscroll = new BScroll(this.$refs.verticalScroll, {
          probeType: this.probeType,
          pullUpLoad: this.pullUpLoad,
          click: this.click,
        })
        if (this.probeType === 2 || this.probeType === 3) {
          this.Bscroll.on('scroll', position => {
            this.$emit('scroll', position)
          })
        }
        if (this.pullUpLoad) {
          this.Bscroll.on('pullingUp', () => {
            this.$emit('getMore')
          })
        }
        if (this.beforeScroll) {
          this.Bscroll.on('beforeScrollStart', () => {
            this.$emit('startScroll')
          })
        }
      })
    },
    methods: {
      refresh() {
        this.Bscroll && this.Bscroll.refresh()
      },
      scrollTo(x = 0, y = 0, time = 100) {
        y = -y
        this.Bscroll && this.Bscroll.scrollTo(x, y, time)
      },
      scrollToElement(el, time = 100) {
        this.Bscroll && this.Bscroll.scrollToElement(el, time)
      },
      finishPullUp() {
        this.Bscroll && this.Bscroll.finishPullUp()
      },
    },
    watch: {
      // 观察到数据传进来就刷新(默认时间20为一般情况下vue挂载dom的耗时)
      data() {
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      },
    },
  }
</script>

<style scoped lang="less"></style>
