<template>
  <div id="app">
    <!--顶栏图标标题区-->
    <nav-bar class="app-nav-bar">
      <template v-slot:center>
        <span class="icon"></span>
        <span class="title">Chicken Music</span>
      </template>
      <!--跳转到用户中心的路由-->
      <template v-slot:right>
        <router-link to="/user">
          <i class="icon-mine"></i>
        </router-link>
      </template>
    </nav-bar>
    <!--功能选项切换区-->
    <tab-bar class="app-tab-bar" />
    <!--主要内容区-->
    <keep-alive>
      <router-view />
    </keep-alive>
    <!--播放器-->
    <player></player>
  </div>
</template>

<script>
  import NavBar from '@/components/common/navbar/NavBar'
  import TabBar from '@/components/common/tabbar/TabBar'
  import Player from '@/components/content/player/Player'

  export default {
    name: 'App',
    components: {
      NavBar,
      TabBar,
      Player,
    },
  }
</script>

<style scoped lang="less">
  @import 'assets/css/mixin';
  @import 'assets/css/variable';
  #app {
    /*顶栏*/
    .app-nav-bar {
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

      .icon-mine {
        color: @color-theme;
      }
    }

    .app-tab-bar,
    .app-nav-bar {
      position: relative;
      background-color: #000;
      z-index: 1;
    }
  }
</style>
