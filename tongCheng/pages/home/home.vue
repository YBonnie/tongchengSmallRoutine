<template>
  <view>
		<z-login ref="login" @success="getPageData"></z-login>
		<view class="video_box" v-if="videoShow" @click="onCloseVideo"><video :src="videoUrl" autoplay="true" controls></video></view>
	</view>
</template>

<script>
export default {
  data() {
    return {
			videoUrl: '',
			videoShow: false,
		};
  },
  //第一次加载
  onLoad(e) {
		const _this = this;
		// 页面植入打开登录方法
		this.$http.openLogin = function() {
			//跳转到首页
			uni.switchTab({
				url: '/pages/home/home'
			});
			//打开人脸识别
			_this.$refs.login.openLogin();
		};
	},
	//页面显示
	onShow() {},
  //方法
  methods: {
		getPageData(){
			
		}
	},
  //页面隐藏
  onHide() {},
  //页面卸载
  onUnload() {},
  //页面下来刷新
  onPullDownRefresh() {},
  //页面上拉触底
  onReachBottom() {},
  //用户点击分享
  onShareAppMessage(e) {
    return this.$base.share();
  }
};
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";
</style>

