// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 导入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入font-awesome
import 'font-awesome/css/font-awesome.min.css'
// 全局引入echarts
import * as echarts from 'echarts'
// 导入axios
import axios from 'axios'

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$echarts = echarts;
Vue.prototype.$axios = axios;

// 设置接口请求的前缀地址
axios.defaults.baseURL = '/zhifou-study';
// 全局设置token
axios.interceptors.request.use(function (config) {
  let token = sessionStorage.getItem('token');
  if (token) {
    config.headers['token'] = token;
  }
  return config;
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
