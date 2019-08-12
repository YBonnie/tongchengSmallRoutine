<template>
	<!-- 我的 -->
	<view class="my">
		<view class="header_box">
			<view class="user_info" @click="onPageJump('/pages/my/editInfo')">
				<view class="info" >
					<view class="name">{{ userInfo.nickName || '未登录' }}</view>
					<view class="person_info" >
						<image src="../../static/icon/me_ic_my.png" mode="aspectFill"></image>
						<text>个人信息</text>
					</view>
				</view>
				<view class="image"><image :src="userInfo.headImg || 'http://qn.sghappy.com/upload/201811/15/4f2f02e86d9649a8be77e4fe247562b3'" mode="aspectFill"></image></view>
			</view>
			<!-- nav -->
			<view class="navbar_box">
				<view @click="onPageJump('/pages/my/collection')">
					<image class="star" src="../../static/icon/me_ic_star.png" mode="aspectFill"></image>
					<text>收藏</text>
				</view>
				<view @click="onPageJump('/pages/my/addressList')">
					<image class="location" src="../../static/icon/me_ic_positon.png" mode="aspectFill"></image>
					<text>收货地址</text>
				</view>
				<view @click="onPageJump('/pages/my/coupon')">
					<image class="coupon" src="../../static/icon/me_ic_card.png" mode="aspectFill"></image>
					<text>优惠券</text>
				</view>
			</view>
		</view>
		<view class="options_btn">
			<view @click="onPageJump('/pages/my/feedback')">
				<image class="me_ic2" src="../../static/icon/me_ic2.png" mode="aspectFill"></image>
				<view>
					<text class="txt">意见反馈</text>
					<image class="icon" src="../../static/icon/me_lise_more.png"></image>
				</view>
			</view>
			<view @click="onPageJump('/pages/my/about')">
				<image class="me_ic3" src="../../static/icon/me_ic3.png" mode="aspectFill"></image>
				<view>
					<text class="txt">关于我们</text>
					<image class="icon" src="../../static/icon/me_lise_more.png"></image>
				</view>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<button open-type="share">
				<image class="me_ic4" src="../../static/icon/me_ic4.png" mode="aspectFill"></image>
				<view>
					<text class="txt">分享同城</text>
					<image class="icon" src="../../static/icon/me_lise_more.png"></image>
				</view>
			</button>
			<!-- #endif -->
			<view @click="onPageJump('/pages/my/setting')">
				<image class="me_ic1" src="../../static/icon/me_ic1.png" mode="aspectFill"></image>
				<view>
					<text class="txt">设置</text>
					<image class="icon" src="../../static/icon/me_lise_more.png"></image>
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
			module:{}
		};
	},
	computed: {
		...mapState(['userInfo'])
	},
	//第一次加载
	onLoad(e) {
		this.module = this.$base.module;
	},
	//页面显示
	onShow() {
		this.judgeLogin('judge', () => {
			this.pageData();
		});
	},
	//方法
	methods: {
		...mapMutations(['setUserInfo']),
		onPageJump(url) {
			this.judgeLogin('judge', () => {
				uni.navigateTo({
					url: url
				});
			});
		},
		pageData(){
			this.$http
				.get('api/mime/v1/info')
				.then(res => {
					this.setUserInfo(res);
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
.header_box {
	width: 100%;
	height: 468upx;
	background-color: #FFF;
	background-image: url('https://qn.kemean.cn/upload/201907/04/a4a44d8639414188a3fb330dd5682c49');
	background-repeat: no-repeat;
	background-position: center bottom;
	background-size: 100% auto;
	.user_info {
		padding: 50upx 50upx 0;
		display: flex;
		justify-content: space-between;
		.image {
			> image {
				width: 138upx;
				height: 138upx;
				border-radius: 50%;
				border: 4upx solid #ffffff;
			}
		}
		.info {
			display: flex;
			justify-content: space-around;
			flex-direction: column;
			.name {
				font-size: 48upx;
				color: #ffffff;
			}
			.person_info {
				display: flex;
				align-items: center;
				> image {
					width: 30upx;
					height: 27upx;
				}
				> text {
					margin-left: 20upx;
					display: flex;
					align-items: center;
					font-size: 24upx;
					color: #ffffff;
					&::after {
						display: flex;
						content: '';
						width: 8upx;
						height: 16upx;
						margin-left: 15upx;
						background-image: url('../../static/icon/icon_back1.png');
						background-repeat: no-repeat;
						background-position: center center;
						background-size: 100%;
					}
				}
			}
		}
	}
	.navbar_box {
		padding: 66upx 75upx 0;
		display: flex;
		justify-content: space-between;
		> view {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;

			.star {
				width: 41upx;
				height: 41upx;
			}
			.location {
				width: 36upx;
				height: 44upx;
			}
			.coupon {
				width: 42upx;
				height: 35upx;
			}

			> text {
				margin-top: 17upx;
				font-size: 26upx;
				color: #ffffff;
			}
		}
	}
}
.options_btn {
	background-color: #ffffff;
	padding: 20upx 50upx 320upx 58upx;
	> view,>button {
		padding: 50upx 0;

		display: flex;
		align-items: center;
		background-color: #FFF;

		.me_ic1 {
			width: 38upx;
			height: 44upx;
		}
		.me_ic2 {
			width: 40upx;
			height: 36upx;
		}
		.me_ic3 {
			width: 38upx;
			height: 40upx;
		}
		.me_ic4 {
			width: 45upx;
			height: 43upx;
		}

		> view {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-left: 36upx;
			.txt {
				font-size: 32upx;
				color: #333333;
				line-height: initial;
			}
			.icon {
				width: 12upx;
				height: 22upx;
			}
		}
	}
}
</style>
