import Vue from 'vue'
import App from './App.vue'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import locale from 'element-ui/lib/locale/lang/en'
import echarts from 'echarts'

Vue.use(ElementUI, { locale })
Vue.use(ElementUI);

axios.defaults.timeout = 100000000000000;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

if (process.env.NODE_ENV === 'development') {
  // 测试环境
  axios.defaults.baseURL = '/api';
} else {
  // 生产环境
}

Vue.prototype.$echarts = echarts;
Vue.prototype.$http = axios;
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
