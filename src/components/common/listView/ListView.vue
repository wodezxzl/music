<template>
  <div class="list-view" v-show="data.length">
    <vertical-scroll
      class="list-view-scroll"
      ref="cScroll"
      :data="data"
      :probeType="3"
      @scroll="scroll"
    >
      <ul>
        <li
          class="list-group"
          ref="listGroup"
          v-for="group in data"
          :key="group.title"
        >
          <h2 class="list-group-title">{{ group.title }}</h2>
          <ul>
            <li
              class="list-item"
              v-for="item in group.items"
              :key="item.name"
              @click="itemClick(item)"
            >
              <img v-lazy="item.avatar" alt="" @load="imgLoad"/>
              <span class="name">{{ item.name }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </vertical-scroll>
    <!--顶部固定显示栏-->
    <div class="fixTitle" v-show="title" ref="fixTitle">
      <h2>{{ title }}</h2>
    </div>
  </div>
</template>

<script>
  // 公共组件
  import VerticalScroll from '@/components/common/scroll/VerticalScroll'

  // 混入函数
  import { imgListenerMixin } from '@/common/mixin'

  export default {
    name: 'ListView',
    mixins: [imgListenerMixin],
    components: {
      VerticalScroll,
    },
    props: {
      data: {
        type: Array,
        default() {
          return []
        },
      },
      // 右侧点击时传进来的index
      anchorIndex: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        imageLoadListener: null,
        listGroupHeight: [],
        // 自己滚动时获取的index
        scrollCurrentIndex: 0,
        // 滚动的每一组标题和滚动容器顶部的距离(用来设置固定标题的渐隐偏移)
        diff: -1,
        fixTop: 0,
      }
    },
    computed: {
      title() {
        return this.data[this.scrollCurrentIndex]
          ? this.data[this.scrollCurrentIndex].title
          : ''
      },
    },
    methods: {
      /**
       * 事件处理
       */
      // 1.图片加载完毕请求刷新可滚动高度,同时记录每一组的offsetTop
      imgLoad() {
        this.imageLoadListener()
      },
      // 2.监听滚动的距离y,联动改变右侧的快速到达栏项目样式
      scroll(position) {
        position = -position.y
        for (let i = 0; i < this.listGroupHeight.length; i++) {
          let height1 = this.listGroupHeight[i]
          let height2 = this.listGroupHeight[i + 1]
          // 1.顶端情况
          if (position <= 0) {
            this.scrollCurrentIndex = 0
            this.$emit('nowIndex', 0)
          }
          // 2.中间情况
          else if (position >= height1 && position < height2) {
            this.diff = height2 - position
            this.scrollCurrentIndex = i
            this.$emit('nowIndex', i)
            // TODO 此处不用return会出现问题,但不明白为什么
            return
          }
          // 3.低端情况
          if (!height2) {
            this.scrollCurrentIndex = i + 1
            this.$emit('nowIndex', i + 1)
          }
        }
      },
      // 3.某一个歌手项被点击
      itemClick(item) {
        this.$emit('itemClick', item)
      },

      /**
       *私有方法
       */
      // 1.滚动到相应位置
      // **此处参数的传递应该可以优化**
      _scrollTo() {
        this.$refs.cScroll.scrollTo(arguments)
      },
      _scrollToElement(el, time) {
        this.$refs.cScroll.scrollToElement(el, time)
      },
      // 2.计算每一个列表组的高度
      _calcListGroupHeight() {
        const list = this.$refs.listGroup
        if (!this.listGroupHeight.length) {
          let height = 0
          this.listGroupHeight.push(height)

          for (let i = 0; i < list.length; i++) {
            let item = list[i]
            height += item.offsetHeight
            this.listGroupHeight.push(height)
          }
        }
      },
    },
    watch: {
      // 1.当触摸的字母改变时滚动到相应元素
      anchorIndex() {
        this._scrollToElement(this.$refs.listGroup[this.anchorIndex], 200)
      },
      // 2.观察diff变化修改固定定位top值
      diff(newVal) {
        let fixTop = newVal > 0 && newVal < 30 ? 30 - newVal : 0
        if (this.fixTop === fixTop) return
        this.fixTop = fixTop
        this.$refs.fixTitle.style.transform = `translate3d(0,${-fixTop}px,0)`
      },
    },
  }
</script>

<style scoped lang="less">
  @import '~assets/css/variable';

  .list-view {
    height: 100%;

    .list-view-scroll {
      height: 100%;

      .list-group {
        padding-bottom: 30px;

        .list-group-title {
          padding-left: 20px;
          height: 30px;
          line-height: 30px;
          font-size: @font-size-small;
          color: @color-text-l;
          background-color: @color-highlight-background;
        }

        .list-item {
          display: flex;
          align-items: center;
          margin: 20px 20px 10px 30px;

          img {
            margin-right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }

          .name {
            font-size: @font-size-medium;
            color: @color-text-l;
          }
        }
      }
    }

    .fixTitle {
      position: fixed;
      top: 88px;
      left: 0;
      right: 0;
      padding-left: 20px;
      height: 30px;
      line-height: 30px;
      font-size: @font-size-small;
      color: @color-text-l;
      background-color: @color-highlight-background;
    }
  }
</style>
