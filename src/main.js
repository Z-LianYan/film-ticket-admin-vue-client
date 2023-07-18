import Vue from 'vue';

// import 'default-passive-events'; //(处理警告)Chrome51 版本以后，Chrome 增加了新的事件捕获机制－Passive Event Listeners；

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets
import '@/styles/index.scss'; // global css

import App from './App';
import store from './store';
import router from './router';

import './permission';

import '@/common/filters';

import '@/ElementUi';

import '@/icons'; // icon

import { Message, Loading } from 'element-ui';
Vue.prototype.$message = Message;


console.log("environment", process.env.NODE_ENV);

Vue.config.productionTip = false;

import nodeWrap from '@/views/audit/auditWorkFlow/nodeWrap'
// Vue.use(nodeWrap)
Vue.component('nodeWrap', nodeWrap); //初始化组件
import func from './plugins/preload.js'; 
Vue.prototype.$func = func;
// import addNode from '@/views/audit/auditWorkFlow/addNode';
// Vue.use(addNode)
// Vue.component('addNode', addNode); //初始化组件

import * as HttpUtil from "@/utils/request";
Vue.prototype.HttpUtil = HttpUtil;



import VueAMap from 'vue-amap';//高德地图的地图组件
Vue.use(VueAMap);
// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: '006c11d7ce6cd1c89eca4dc3758b381e',
  // 插件集合
  plugin: ['AMap.Geolocation','AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4'
});


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
