<template>
	<view>
		<view class="popupClick" @click="onPopupShow">
			<slot></slot>
		</view>
		<view class="mask" v-if="popupShow" @click="onPopupHide"></view>
		<view class="popup_box" v-if="popupShow">
			<view class="title">
				<button></button>
				<text>补交费用</text>
				<button @click="onPopupHide">关闭</button>
			</view>
			<view class="popup_content">
				<view class="content_title">{{makeUpInfo.goodsDesc}}</view>
				<view class="info_box">
					<view class="info"><text>预估费用</text>￥{{makeUpInfo.goodsPrice}}</view>
				</view>
				<view class="info_box">
					<view class="info"><text>补费原因</text>{{makeUpInfo.replenishReason}}</view>
					<view class="btn" @click="onCall(makeUpInfo.deliveryPhone)">
						<image src="../../static/icon/runLeg/call_ic.png" mode="aspectFit"></image>
						联系跑腿
					</view>
				</view>
				<view class="price">
					需要补交商品费用<text>￥{{makeUpInfo.replenishPrice}}</text>元
				</view>
				<view class="prompt">请尽快支付费用，有疑问联系跑腿小哥</view>
				<view class="countdown">{{makeUpInfo.replenishTime}}</view>
				<view class="btn_box">
					<button @click="onCancel">不想买了</button>
					<button class="active" @click="onMakeUp">补交费用</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		setWxPay
	} from '@/utils/utils';
	// #ifdef H5
	import {
		appMutual,
		getBrowser
	} from '@/config/html5Utils';
	// #endif
	export default {
		data() {
			return {
				popupShow: false,
				orderNo: "",
				makeUpInfo: {}
			};
		},
		//方法
		methods: {
			//打开弹窗
			onPopupShow(orderNo) {
				this.popupShow = true;
				this.orderNo = orderNo;
				this.pageData(orderNo);
			},
			onPopupHide() {
				this.popupShow = false;
			},
			pageData(orderNo) {
				this.$http
					.get('api/order/buy/v1/add_price_info', {
						orderNo: orderNo
					})
					.then(data => {
						this.makeUpInfo = data;
					});
			},
			// 取消订单
			onCancel(index) {
				uni.showModal({
					title: '提示',
					content: '确定要取消此订单吗？',
					success: res => {
						if (res.confirm) {
							this.$http
								.get('api/order/v2/cancel_or_confirm', {
									orderNo: this.orderNo,
									operateStatus: 1002
								})
								.then(data => {
									uni.showToast({
										title: '取消订单成功!',
										icon: 'none'
									});
									this.$emit("change",{
										type:"refresh"
									});
								});
						}
					}
				});
			},
			//拨打电话
			onCall(phone) {
				if (phone) {
					uni.makePhoneCall({
						phoneNumber: phone
					});
				}
			},
			//补交费用
			onMakeUp(){
				this.$http
					.get('api/order/buy/v1/add_price', {
						orderNo: this.orderNo,
					})
					.then(data => {
						//支付
						// #ifdef MP-WEIXIN
						setWxPay(res.orderNo, data => {
							if (res.success) {
								this.$emit("change",{
									type:"refresh"
								});
								uni.showToast({
									title: '支付成功！',
								});
							} else {
								uni.showToast({
									title: '支付失败！',
									icon: 'none'
								});
							}
						});
						// #endif
						// #ifdef H5
						if (getBrowser() === "微信") {
							uni.navigateTo({
								url: "/pages/home/weChatPay?orderNo=" + res.orderNo + "&price=" + res.price + "&title=" + res.title
							})
						} else {
							appMutual("setJumpPay", res);
						}
						// #endif
					});
			}
		},
	};
</script>
<style lang="scss" scoped>
	@import "@/style/mixin.scss";

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: 5;
	}

	.popup_box {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 6;
		background-color: #FFF;

		.title {
			height: 100upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 30upx;

			button {
				font-size: 30upx;
				background-color: transparent;

				&:first-child {
					color: #999999;
				}

				&:last-child {
					color: $mainColor;
				}
			}

			text {
				font-size: 36upx;
				color: #333333;
			}
		}

		.popup_content {
			border-top: 1upx solid #f5f5f5;
			padding: 40upx 60upx;

			.content_title {
				font-size: 30upx;
				color: #333333;
				margin-bottom: 30upx;
			}

			.info_box {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 20upx;

				.info {
					display: flex;
					font-size: 26upx;
					color: #333333;

					text {
						font-size: 26upx;
						color: #999999;
						width: 180upx;
					}
				}

				.btn {
					display: flex;
					align-items: center;
					font-size: 28upx;
					color: $mainColor;

					image {
						width: 34upx;
						height: 34upx;
						margin-right: 10upx;
					}
				}
			}

			.price {
				margin-top: 57upx;
				font-size: 30upx;
				color: #333333;
				text-align: center;
				font-weight: bold;

				text {
					font-size: 36upx;
					color: #fd595a;
				}
			}

			.prompt {
				font-size: 24upx;
				color: #999999;
				text-align: center;
				margin-top: 20upx;
			}

			.countdown {
				text-align: center;
				margin-top: 17upx;
				font-size: 36upx;
				color: $mainColor;
			}

			.btn_box {
				display: flex;
				justify-content: center;
				margin-top: 40upx;

				button {
					width: 240upx;
					height: 70upx;
					line-height: 70upx;
					border-radius: 4upx;
					border: solid 2upx $mainColor;
					border-radius: 4upx;
					font-size: 28upx;
					color: $mainColor;
					&:nth-child(2){
						margin-left: 20upx;
					}
					&.active {
						background-color: $mainColor;
						color: #FFF;
					}
				}
			}
		}
	}
</style>
