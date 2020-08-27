<template>
  <div class="search-history" v-show="!query">
    <div class="desc" v-show="getSearchHistory.length">
      <h2>搜索历史</h2>
      <div class="clear" @click="clearHistory">
        <i class="icon-clear"></i>
      </div>
    </div>
    <ul>
      <li
        v-for="(item, index) in getSearchHistory"
        :key="index"
        @click="selectItem(item)"
      >
        <span>{{ item }}</span>
        <div class="delete" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  // vuex
  import { mapGetters } from 'vuex'

  export default {
    name: 'SearchHistory',
    props: {
      query: {
        type: String,
        default: '',
      },
    },
    computed: {
      ...mapGetters(['getSearchHistory']),
    },
    methods: {
      // 事件处理
      // 1.历史记录被点击
      selectItem(item) {
        this.$emit('selectItem', item)
      },
      // 2.删除按钮被点击
      deleteOne(item) {
        this.$emit('deleteOne', item)
      },
      // 3.清空按钮被点击
      clearHistory() {
        this.$emit('clearHistory')
      },
    },
  }
</script>

<style scoped lang="less">
  @import '~assets/css/variable';
  @import '~assets/css/mixin';

  .search-history {
    margin: 20px;
    font-size: @font-size-medium-x;
    color: @color-text-l;

    .desc {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;

      .clear {
        .extend-click();

        i {
          font-size: 14px;
        }
      }
    }

    ul {
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;

        .delete {
          .extend-click();

          i {
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
