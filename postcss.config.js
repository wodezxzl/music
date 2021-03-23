module.exports = {
  plugins: {
    'postcss-preset-env': {},
    'postcss-px-to-viewport': {
      viewportWidth: 375, //视窗的宽度
      viewportHeight: 667, //视窗的高度
      unitPrecision: 3, //将px转化为视窗单位值的小数位数
      viewportUnit: 'vw', //指定要转换成的视窗单位值
      selectorBlackList: ['.ignore'], //指定不转换视窗单位值得类，可以自定义，可以无限添加
      minPixelValue: 1, //小于等于1px不转换为视窗单位
      mediaQuery: false, //允许在媒体查询中使用px
    },
  },
}
