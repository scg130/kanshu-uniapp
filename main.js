import App from './App';

// #ifndef VUE3
import Vue from 'vue';
import './uni.promisify.adaptor';
//导入uview
import uView from "uview-ui";
//使用uview
Vue.use(uView);

import HOST  from 'global.js';
import HttpCache from './common/caches';
import HttpRequest from './common/httpRequest';
import queue from './common/queue';
// import './global.js'
Vue.config.productionTip = false
Vue.prototype.$Request = HttpRequest;
Vue.prototype.$queue = queue;

Vue.prototype.$Sysconf = HttpRequest.config;
Vue.prototype.$SysCache = HttpCache;

// import i18n from './common/wx-i18n';
// Vue.prototype.$i18n = i18n

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue';
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif