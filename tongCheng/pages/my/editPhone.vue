<template>
	<view class="page">
		<view class="title">修改手机</view>
		<view class="input_box"><input type="number" v-model="phone" placeholder="请输入手机号" /></view>
		<view class="input_box">
			<input type="number" v-model="code" placeholder="请输入验证码" />
			<button @click="getCode">{{ codeText }}</button>
		</view>
		<view class="btn_box"><button @click="onSubmit">下一步</button></view>
	</view>
</template>
<script>

import md5 from '@/utils/md5';
var clear;
export default {
	data() {
		return {
			//手机号
			phone: '',
			//验证码
			code: '',
			//验证码
			codeText: '获取验证码',
			//验证码已发
			readonly: false
		};
	},
	
	//第一次加载
	onLoad(e) {},
	//页面显示
	onShow() {},
	//方法
	methods: {
		
		onJumpPage(url) {
			uni.navigateTo({
				url: url
			});
		},
		//获取验证码
		getCode() {
			if (this.readonly) {
				uni.showToast({
					title: '验证码已发送',
					icon: 'none'
				});
				return;
			}
			if (!this.phone) {
				uni.showToast({
					title: '请输入手机号',
					icon: 'none'
				});
				return;
			}
			if (!this.$base.phoneRegular.test(this.phone)) {
				uni.showToast({
					title: '请输入正确的手机号',
					icon: 'none'
				});
				return;
			}
			this.$http
				.post('api/open/v1/send_sms', {
					phone: this.phone,
					type: 3105
				})
				.then(res => {
					this.getCodeState();
				});
		},
		//验证码按钮文字状态
		getCodeState() {
			const _this = this;
			this.readonly = true;
			this.codeText = '60S后重新获取';
			var s = 60;
			clear = setInterval(() => {
				s--;
				_this.codeText = s + 'S后重新获取';
				if (s <= 0) {
					clearInterval(clear);
					_this.codeText = '获取验证码';
					_this.readonly = false;
				}
			}, 1000);
		},
		onSubmit() {
			if (!this.phone) {
				uni.showToast({
					title: '请输入手机号',
					icon: 'none'
				});
				return;
			}
			if (!this.$base.phoneRegular.test(this.phone)) {
				uni.showToast({
					title: '请输入正确的手机号',
					icon: 'none'
				});
				return;
			}
			if (!this.code) {
				uni.showToast({
					title: '请输入验证码',
					icon: 'none'
				});
				return;
			}

			this.$http
				.post('api/mime/v1/check_old_phone', {
					phone: this.phone,
					code: this.code
				})
				.then(res => {
					uni.navigateTo({
						url:'/pages/my/editPhone2'
					})
				});
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
@import '@/style/mixin.scss';
.page {
	background-color: #fff;
	background-image: url('../../static/icon/login_bg2.png');
	background-repeat: no-repeat;
	background-position: center bottom;
	background-size: 100% auto;
	padding: 0 65upx;
	min-height: 100vh;
	.title {
		padding: 120upx 0 40upx 0;
		font-size: 60upx;
		color: #333333;
	}
	.input_box {
		display: flex;
		justify-content: space-between;
		height: 100upx;
		padding-top: 20upx;
		border-bottom: 1upx solid #eeeeee;
		input {
			flex: 1;
			height: 80upx;
			line-height: 80upx;
			font-size: 30upx;
		}
		button {
			height: 78upx;
			line-height: 78upx;
			font-size: 30upx;
			color: #f19837;
			&:active {
				background-color: transparent;
			}
		}
	}
	.btn_box {
		margin-top: 70upx;
		button {
			height: 86upx;
			background-image: linear-gradient(90deg, #ea552d 0%, #f19837 100%), linear-gradient(#d4d4d4, #d4d4d4);
			border-radius: 43upx;
			font-size: 36upx;
			color: #ffffff;
		}
	}
}
</style>
