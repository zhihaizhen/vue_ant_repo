import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// import tradingView from './plugins/tradingView'

Vue.config.productionTip = false;
// Vue.prototype.TradingView = tradingView;

import 'normalize.css/normalize.css'; //css resets
import '@/styles/index.scss'; // global css

import './icons'; //icon

import './permission'; // 路由导航守卫

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.use(Antd);

import scrollBar from '@/components/scrollBar';
import '@/components/scrollBar/index.scss';
Vue.component('scroll-bar', scrollBar);

import { mockXHR } from '../mock';
if (process.env.NODE_ENV === 'production') {
  mockXHR();
}

import loading from '@/components/loading/loading'; // 引入loading
Vue.use(loading); // 全局使用loading

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
