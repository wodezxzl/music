<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="isShow" @click.stop="hide">
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{ text }}</p>
          <div class="operate">
            <div class="operate-btn left" @click.stop="clearHistory">
              {{ confirmBtnText }}
            </div>
            <div class="operate-btn" @click.stop="hide">
              {{ cancelBtnText }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'Confirm',
    props: {
      text: {
        type: String,
        default: '',
      },
      confirmBtnText: {
        type: String,
        default: '清空',
      },
      cancelBtnText: {
        type: String,
        default: '取消',
      },
    },
    data() {
      return {
        isShow: false,
      }
    },
    methods: {
      // 事件处理
      // 1.清空按钮点击
      clearHistory() {
        this.hide()
        this.$emit('clearHistory')
      },

      // 方法
      show() {
        this.isShow = true
      },
      hide() {
        this.isShow = false
      },
    },
  }
</script>

<style scoped lang="less">
  @import '~assets/css/variable';

  .confirm {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: @color-background-d;
    z-index: 998;

    &.confirm-fade-enter-active {
      animation: confirm-fadein 0.3s;

      .confirm-content {
        animation: confirm-zoom 0.3s;
      }
    }

    .confirm-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      z-index: 999;

      .confirm-content {
        width: 270px;
        border-radius: 14px;
        background-color: @color-highlight-background;

        .text {
          padding: 20px 40px;
          line-height: 22px;
          text-align: center;
          font-size: @font-size-large;
          color: @color-text-l;
        }

        .operate {
          display: flex;
          align-items: center;
          text-align: center;
          font-size: @font-size-large;

          .operate-btn {
            flex: 1;
            line-height: 22px;
            padding: 10px 0;
            border-top: 1px solid @color-background-d;
            color: @color-text-d;
          }

          &.left {
            border-right: 1px solid @color-background-d;
          }
        }
      }
    }
  }

  @keyframes confirm-fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes confirm-zoom {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
