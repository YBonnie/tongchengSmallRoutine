<template>
	<view class="we_chat_pay">
		<!-- 支付订单信息 -->
		<view class="pay_info_box">
			<view class="title">订单编号：{{ orderNo }}</view>
			<view class="price_box">
				<view class="price">
					￥
					<text>{{ price }}</text>
				</view>
				<view class="name">{{ title }}</view>
			</view>
		</view>
		<!-- 支付方式 -->
		<view class="pay_pattern">
			<text class="tip">请选择支付方式</text>
			<view class="pay_box">
				<view class="icon">
					<image src="../../static/icon/icon_wechat.png" mode="aspectFit"></image>
					<view>微信</view>
				</view>
				<view class="btn">
					<image v-if="weChatType" src="../../static/icon/icon_xuanzhong.png" mode="aspectFit"></image>
					<image v-else src="../../static/icon/icon_weixuanzhong.png" mode="aspectFit"></image>
				</view>
			</view>
		</view>
		<!-- 支付按钮 -->
		<view class="pay_btn" @click="onPay">
			<button>确定支付￥{{ price }}</button>
		</view>
	</view>
</template>

<script>
import { weiXinPay } from '@/config/html5Utils';
export default {
	data() {
		return {
			// 选择微信支付
			weChatType: true,
			// 订单号
			orderNo: '',
			// 商店名称
			title: '',
			// 订单总价
			price: ''
		};
	},
	onLoad(e) {
		this.orderNo = e.orderNo;
		this.title = e.title;
		this.price = e.price;
	},
	methods: {
		// 支付
		onPay() {
			this.$http.get('api/pay/v1/public_pay_sign_wx', { orderNo: this.orderNo }).then(res => {
				weiXinPay(res,() => {
					uni.showModal({
						title: '提示',
						content: '支付成功',
						showCancel:false,
						success: function(res) {
							if (res.confirm) {
								uni.switchTab({
									url: '/pages/my/my'
								});
							}
						}
					});
				});
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
.we_chat_pay {
	padding: 20upx 30upx;
	.pay_info_box {
		background-image: url('../../static/icon/card_bg.png');
		background-position: center bottom;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		// border-radius: 40upx;
		background-color: rgba(0, 0, 0, 0.06);
		box-shadow: 0upx 20upx 30upx 0upx rgba(0, 0, 0, 0.06);
		padding: 0 30upx;
		.title {
			padding: 25upx 0;
			border-bottom: 1upx dashed #cccccc;
			font-size: 26upx;
			color: #999999;
		}
		.price_box {
			height: 240upx;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			.price {
				font-size: 36upx;
				color: #ff5d32;
				> text {
					font-size: 72upx;
					color: #ff5d32;
				}
			}
			.name {
				font-size: 24upx;
				color: #999999;
			}
		}
	}

	.pay_pattern {
		margin-top: 50upx;
		.tip {
			font-size: 28upx;
			color: #333333;
		}
		.pay_box {
			width: 100%;
			height: 88upx;
			background-color: #ffffff;
			border-radius: 6upx;
			margin-top: 30upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 30upx;
			.icon {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				> image {
					width: 50upx;
					height: 41upx;
				}
				> view {
					margin-left: 30upx;
					font-size: 28upx;
					color: #333333;
				}
			}
			.btn {
				width: 30upx;
				height: 30upx;
				image {
					width: 30upx;
					height: 30upx;
				}
			}
		}
	}
	.pay_btn {
		width: 100%;
		> button {
			position: fixed;
			left: 30upx;
			right: 30upx;
			bottom: 30upx;
			height: 88upx;
			background-image: linear-gradient(-90deg, #ffac29 0%, #ff7418 100%), linear-gradient(#ff5148, #ff5148);
			background-blend-mode: normal, normal;
			border-radius: 6upx;
			color: #ffffff;
			font-size: 32upx;
			line-height: 88upx;
			text-align: center;
		}
	}
}
</style>
