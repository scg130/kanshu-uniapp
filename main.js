import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
//导入uview
import uView from "uview-ui";
//使用uview
Vue.use(uView);

import HttpRequest from './common/httpRequest'
import HttpCache from './common/caches'
import queue from './common/queue'
import './global.js'
Vue.config.productionTip = false
Vue.prototype.$Request = HttpRequest;
Vue.prototype.$queue = queue;

Vue.prototype.$Sysconf = HttpRequest.config;
Vue.prototype.$SysCache = HttpCache;

import translate from 'i18n-jsautotranslate'
translate.setUseVersion2() //设置使用v2.x 版本
translate.selectLanguageTag.show = false //是否显示切换栏
translate.listener.start() //监控页面动态渲染的文本进行自动翻译
Vue.prototype.$translate = translate

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
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif