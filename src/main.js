import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import less from 'less'
import fastclick from 'fastclick'
import VuelazyLoad from 'vue-lazyload'

// 导入基本样式
import 'assets/css/index'

// 解决移动端300ms延迟
fastclick.attach(document.body)
Vue.use(less)
Vue.use(VuelazyLoad, {
  loading: require('assets/image/default.png'),
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
