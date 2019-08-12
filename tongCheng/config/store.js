import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
import {
	modifyJson
} from '@/utils/utils';
import base from '@/config/baseUrl';
//变量
const state = {
	//用户数据
	userInfo: {
		// token: "b22fea55f73e412f8958249afa6c13b1"
	},
	//webView地址
	webViewUrl:"",
	//数据加载状态
	requestState:999,
	//微信场景参数
	chatScenesInfo:{},
	//地址选择的地址
	selectAddress:{},
	//选中的收货地址
	checkedAddressData:{},
	//选中的优惠券
	checkedCouponData:{},
	//客服电话
	serverPhone:"",
	//当前位置
	currentAddress:{},
	//团购商品详情信息
	goodsData:{},
	//当前选择的区域
	regionIndex:0
};
//缓存浏览器的数据名称
const cacheNameList = ["userInfo","regionIndex","checkedAddressData","checkedCouponData","webViewUrl","goodsData"];
const mutations = {
	//取出缓存数据
	setCacheData(state) {
		for (let name of cacheNameList) {
			// #ifdef MP-WEIXIN
			let data = uni.getStorageSync(name);
			// #endif
			// #ifdef H5
			let data = sessionStorage.getItem(name) || localStorage.getItem(name);
			// #endif
			if (data) {
				// #ifdef H5
				try {
					data = JSON.parse(data);
				} catch(e) {
				}
				// #endif
				state[name] = data;
			}
		}
	},
	//储存用户信息
	setUserInfo(state, data) {
		if (data) {
			state.userInfo = modifyJson(data, state.userInfo);
			// #ifdef H5
			window.sessionStorage.setItem('userInfo', JSON.stringify(state.userInfo));
			// #endif
		}
	},
	//WebView地址
	setWebViewUrl(state, data) {
		if (data) {
			state.webViewUrl = data;
			// #ifdef H5
			window.sessionStorage.setItem('webViewUrl', data);
			// #endif
		}
	},
	//数据加载状态
	setRequestState(state, data) {
		if (data) {
			state.requestState = data;
		}
	},
	//微信场景参数
	setChatScenesInfo(state, data) {
		if (data) {
			console.log(data);
			state.chatScenesInfo = data;
		}
	},
	//地址选择的地址
	setSelectAddress(state, data) {
		if (data) {
			state.selectAddress = data;
		}
	},
	//选中的收货地址
	setCheckedAddressData(state, data) {
		if (data) {
			state.checkedAddressData = data;
			// #ifdef H5
			window.sessionStorage.setItem('checkedAddressData', JSON.stringify(state.checkedAddressData));
			// #endif
		}
	},
	//选中的优惠券
	setCheckedCouponData(state, data) {
		if (data) {
			state.checkedCouponData = data;
			// #ifdef H5
			window.sessionStorage.setItem('checkedCouponData', JSON.stringify(state.checkedCouponData));
			// #endif
		}
	},
	//客服电话
	setServerPhone(state, data) {
		if (data) {
			state.serverPhone = data;
		}
	},
	//当前地址
	setCurrentAddress(state, data) {
		if (data) {
			state.currentAddress = data;
		}
	},
	//团购商品详情信息
	setGoodsData(state, data) {
		if (data) {
			state.goodsData = data;
			// #ifdef H5
			window.sessionStorage.setItem('goodsData', JSON.stringify(state.goodsData));
			// #endif
		}
	},
	//当前选择的区域
	setRegionIndex(state, data) {
		state.regionIndex = data;
		// #ifdef H5
		window.sessionStorage.setItem('regionIndex', JSON.stringify(state.regionIndex));
		// #endif
	},
};
//异步处理
const actions = {};
export default new Vuex.Store({
	state,
	mutations,
	actions
});
