<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <label for="box"></label>
    <input
      type="text"
      id="box"
      class="box"
      ref="queryInput"
      v-model="query"
      :placeholder="placeholder"
      autocomplete="off"
    />
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script>
  import { debounce } from '@/common/utils'

  export default {
    name: 'SearchBox',
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手',
      },
    },
    data() {
      return {
        query: '',
      }
    },
    created() {
      // query发生改变发射事件
      this.$watch(
        'query',
        debounce(newValue => {
          this.$emit('newQuery', newValue)
        }),
      )
    },
    methods: {
      // 事件处理
      // 1.清空搜索栏并显示搜索热词
      clear() {
        this.query = ''
      },
      // 2.根据点击的热词改变关键词
      changeQuery(query) {
        this.query = query
      },

      // 私有方法
      // 1.输入框取消焦点
      _blur() {
        this.$refs.queryInput.blur()
      },
    },
  }
</script>

<style scoped lang="less">
  @import '~assets/css/variable';

  .search-box {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px;
    padding: 0 10px;
    height: 40px;
    border-radius: 6px;
    box-sizing: border-box;
    background-color: @color-highlight-background;
    z-index: 1;

    .icon-search {
      font-size: 24px;
      color: @color-background;
    }

    .box {
      flex: 1;
      margin: 0 6px;
      line-height: 18px;
      font-size: @font-size-medium;
      color: @color-text;
      background-color: @color-highlight-background;

      &::placeholder {
        color: @color-text-d;
      }

      &:focus {
        outline: none;
      }
    }

    .icon-dismiss {
      color: @color-background;
    }
  }
</style>
