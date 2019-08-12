<template>
	<!-- 修改密码 -->
	<view class="edit_password_page">
		<view class="title">修改密码</view>
		<view class="input"><input type="password" v-model="oldPwd" placeholder="请输入旧密码" /></view>
		<view class="input"><input type="password" v-model="newPwd" placeholder="请输入新密码" /></view>
		<view class="input"><input type="password" v-model="surePwd" placeholder="请确认新密码" /></view>
		<view class="btn_box"><button @click="onConfirm">确认</button></view>
	</view>
</template>

<script>
import md5 from '@/utils/md5';
var clear;
export default {
	data() {
		return {
			// 旧的密码
			oldPwd: '',
			// 新密码
			newPwd: '',
			// 确认新密码
			surePwd: ''
		};
	},
	//第一次加载
	onLoad(e) {
	},
	//页面显示
	onShow() {},
	//方法
	methods: {
	
		onConfirm() {
			if (this.oldPwd == '') {
				uni.showToast({
					title: '请输入原密码',
					icon: 'none'
				});
				return;
			}
			if (this.newPwd == '') {
				uni.showToast({
					title: '请输入新密码',
					icon: 'none'
				});
				return;
			}
			if (this.surePwd == '') {
				uni.showToast({
					title: '请输入确认密码',
					icon: 'none'
				});
				return;
			}
			if (this.newPwd !== this.surePwd) {
				uni.showToast({
					title: '两次密码不一致',
					icon: 'none'
				});
				return;
			}
			
			this.$http
				.post('api/mime/v1/edit_password', {
					oldPassword: md5(this.oldPwd),
					newPassword: md5(this.newPwd)
				})
				.then(res => {
					uni.showToast({
						title: '密码修改成功',
						icon: 'success',
						success() {
							uni.navigateTo({
								url:'/pages/user/login'
							});
						}
					});
					
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
.edit_password_page {
	height: 100vh;
	background-color: #fff;
	background-image: url('../../static/icon/login_bg2.png');
	background-repeat: no-repeat;
	background-position: center bottom;
	background-size: 100% auto;
	padding: 50upx 40upx 0;
	.title {
		padding: 60upx 60upx 88upx;
		font-size: 60upx;
		color: #333333;
	}
	.input {
		margin: 0 60upx 50upx;
		padding-bottom: 20upx;
		border-bottom: 1upx solid #efefef;
		> input {
			&::placeholder {
				font-size: 30upx;
				color: #999999;
			}
		}
	}
	.btn_box {
		position: fixed;
		left: 0px;
		right: 0px;
		bottom: 447upx;
		margin: 0 95upx 0;
		> button {
			width: 100%;
			height: 86upx;
			background-image: linear-gradient(90deg, #ea552d 0%, #f19837 100%), linear-gradient(#d4d4d4, #d4d4d4);
			background-blend-mode: normal, normal;
			border-radius: 43upx;
			color: #ffffff;
			line-height: 86upx;
		}
	}
}
</style>
