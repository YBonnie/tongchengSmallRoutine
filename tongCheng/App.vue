<script>
import store from '@/config/store';
export default {
	// 只有 app 才会有 onLaunch 的生命周期
	onLaunch: function(e) {
		//取出缓存数据
		store.commit('setCacheData');
		// #ifdef MP-WEIXIN
		store.commit("setChatScenesInfo",e);
		// #endif
	},
	onShow: function() {
		// #ifdef MP-WEIXIN
		//小程序更新
		if (uni.getUpdateManager) {
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				// console.log(res.hasUpdate);
			});
			updateManager.onUpdateReady(function(res) {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					}
				});
			});
			updateManager.onUpdateFailed(function(res) {
				// 新的版本下载失败
				uni.showModal({
					title: '已经有新版本了哟~',
					content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
					showCancel: false
				});
			});
		}
		// #endif
	},
	onShow: function() {},
	onHide: function() {},
};
</script>

<style lang="scss">
@import './style/common.scss';
@import './style/icon.scss';
@import './style/input.scss';
// #ifdef H5
// 头部导航
uni-page-head {
	display: none;
}
//修复H5底部导航挡住内容bug
uni-app {
	height: auto;
}
// #endif
page {
	height: 100%;
	background-color: #f5f5f5;
}
//去除地图上高德地图标识符
.amap-copyright {
	display: none !important;
}
.amap-logo {
	display: none !important;
}
.amap-ui-control-zoom {
	width: 60upx !important;
}
.amap-ui-control-zoom > * {
	width: 60upx !important;
	height: 60upx !important;
	line-height: 60upx !important;
}
.amap-ui-control-theme-dark {
	display: none !important;
}
</style>
