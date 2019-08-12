<template>
	<!-- 设置 -->
	<view class="setting">
		<view class="setting_box">
			<view class="box_details">
				<view @click="onPageJump('/pages/my/editPassword')">
					<image class="set_ic1" src="../../static/icon/set_ic1.png" mode="aspectFill"></image>
					<view>
						<text class="txt">修改密码</text>
						<image class="icon" src="http://qn.kemean.cn/upload/201907/23/me_lise_more.png"></image>
					</view>
				</view>
				<view @click="onPageJump('/pages/my/editPhone')">
					<image class="set_ic2" src="../../static/icon/set_ic2.png" mode="aspectFill"></image>
					<view>
						<text class="txt">换绑手机</text>
						<image class="icon" src="http://qn.kemean.cn/upload/201907/23/me_lise_more.png"></image>
					</view>
				</view>
				<view @click="onPageJump('/pages/user/protocol')">
					<image class="set_ic3" src="../../static/icon/set_ic3.png" mode="aspectFill"></image>
					<view>
						<text class="txt">用户协议</text>
						<image class="icon" src="http://qn.kemean.cn/upload/201907/23/me_lise_more.png"></image>
					</view>
				</view>
				
			</view>
		</view>

		
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
	data() {
		return {
			iconNum: 1
		};
	},
	computed: {
		...mapState(['userInfo'])
	},
	//第一次加载
	onLoad(e) {},
	//页面显示
	onShow() {},
	//方法
	methods: {
		...mapMutations(['setUserInfo']),
		// 页面跳转
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		},
		// 退出登录
		
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
.setting_box {
	border-radius: 0 0 40upx 40upx;
	.box_details {
		border-radius: 40upx;
		background-color: #ffffff;
		padding: 18upx 30upx;
		> view {
			padding: 44upx 0;
			border-bottom: 1upx solid #efefef;
			display: flex;
			align-items: center;
			&:last-of-type {
				border-bottom: none;
			}
			.set_ic1 {
				width: 40upx;
				height: 44upx;
			}
			.set_ic2 {
				width: 29upx;
				height: 43upx;
			}
			.set_ic3 {
				width: 33upx;
				height: 39upx;
			}
			.set_ic4 {
				width: 36upx;
				height: 35upx;
			}
			> view {
				width: 100%;
				margin-left: 27upx;
				display: flex;
				justify-content: space-between;
				align-items: baseline;
				.txt {
					font-size: 32upx;
					color: #333333;
				}
				.icon {
					width: 12upx;
					height: 22upx;
				}
				.receipt {
					width: 97upx;
					height: 34upx;
				}
			}
		}
	}
}
.btn_box {
	margin: 300upx 105upx 0;
	> button {
		width: 534upx;
		height: 86upx;
		background-image: linear-gradient(90deg, #ea552d 0%, #f19837 100%), linear-gradient(#d4d4d4, #d4d4d4);
		background-blend-mode: normal, normal;
		border-radius: 43upx;
		color: #ffffff;
		line-height: 86upx;
	}
}
</style>
