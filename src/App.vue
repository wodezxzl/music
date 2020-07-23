<template>
  <div id="app">
    <!--顶栏图标标题区-->
    <nav-bar class="nav-bar">
      <template v-slot:center>
        <span class="icon"></span>
        <span class="title">Chicken Music</span>
      </template>
    </nav-bar>
    <!--功能选项切换区-->
    <tab-bar />
    <router-view />
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import TabBar from 'components/common/tabbar/TabBar'
  export default {
    name: 'App',
    components: {
      NavBar,
      TabBar,
    },
  }
</script>

<style scoped lang="less">
  @import 'assets/css/mixin';
  @import 'assets/css/variable';
  #app {
    /*顶栏*/
    .nav-bar {
      .icon {
        display: inline-block;
        margin-top: 6px;
        margin-right: 9px;
        width: 30px;
        height: 32px;
        vertical-align: top;
        .bg-image('~assets/image/logo');
        background-size: 30px 32px;
      }
      .title {
        font-size: 18px;
        color: @color-theme;
      }
    }
  }
</style>
