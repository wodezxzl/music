<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <div class="no-result-text"> {{ title }}</div>
  </div>
</template>

<script>
  export default {
    name: 'NoResult',
    props: {
      title: {
        type: String,
        default: '',
      },
    },
  }
</script>

<style scoped lang="less">
  @import '~assets/css/variable';

  .no-result {
    text-align: center;

    .no-result-icon {
      width: 86px;
      height: 90px;
      margin: 0 auto;
      background-image: url('no-result@2x.png');
      background-size: 86px 90px;
    }

    .no-result-text {
      margin-top: 16px;
      font-size: 14px;
      color: @color-text-d;
    }
  }
</style>
