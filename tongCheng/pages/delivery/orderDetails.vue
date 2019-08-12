<template>
	<view class="delivery_page">
		<view class="delivery_info">
			<view class="tip_box">{{ orderInfo.orderStatusStr }} ></view>
			<view class="info_box">
				<view>
					<view class="shops_name">{{ orderInfo.shopName }}</view>
					<view class="layout_box">
						<view v-for="(item, index) of orderInfo.goodsList" :key="index">
							<view class="names">{{ item.goodsName }}</view>
							<view class="infos">
								<text>{{ item.goodsNum }}</text>
								<text>{{ item.goodsPrice }}</text>
							</view>
						</view>
					</view>
					<view class="layout_box">
						<view>
							<view class="names">打包费用</view>
							<view class="infos">
								<text>{{ orderInfo.packNumTotal }}</text>
								<text>{{ orderInfo.pricePackTotal }}</text>
							</view>
						</view>
						<view class="delivery">
							<text>配送费用</text>
							<text>{{ orderInfo.deliveryPrice }}</text>
						</view>
					</view>
					<view class="layout_box">
						<view>
							<view class="discounts">
								<image src="../../static/icon/order/icon_manjian.png" mode="aspectFill"></image>
								<text>满减优惠</text>
							</view>
							<view class="txt">{{ orderInfo.fullDiscountPrice }}</view>
						</view>
						<view>
							<view class="discounts">
								<image src="../../static/icon/order/icon_youhuiquan.png" mode="aspectFill"></image>
								<text>优惠券</text>
							</view>
							<view class="txt">{{ orderInfo.discountVoucherPrice }}</view>
						</view>
					</view>
					<view class="count_box">
						<view class="count">已优惠：{{ orderInfo.discounTotalPrice }}</view>
						<view class="pay">
							<text>实付</text>
							<text>{{ orderInfo.payPrice }}</text>
						</view>
					</view>
				</view>
				<view @click="onCall(orderInfo.shopPhone)">
					<image src="../../static/icon/orderdetails_phone.png" mode="aspectFill"></image>
					<text>联系商家</text>
				</view>
			</view>
		</view>

		<view class="total_info">
			<view>
				<view class="title">订单信息</view>
				<view class="details">
					<view class="content">
						<view>订单编号</view>
						<view>{{ orderInfo.orderInfo.orderNo }}</view>
					</view>
					<view class="content" v-if="orderInfo.orderInfo.createTimeStr">
						<view>下单时间</view>
						<view>
							<text>{{ orderInfo.orderInfo.createTimeStr }}</text>
						</view>
					</view>
					<view class="content" v-if="orderInfo.orderInfo.payTimeStr">
						<view>支付时间</view>
						<view>
							<text>{{ orderInfo.orderInfo.payTimeStr }}</text>
						</view>
					</view>
					<view class="content" v-if="orderInfo.orderInfo.sendTimeStr">
						<view>送达时间</view>
						<view>
							<text>{{ orderInfo.orderInfo.sendTimeStr }}</text>
						</view>
					</view>
					<view class="content">
						<view>支付方式</view>
						<view>{{ orderInfo.orderInfo.payMethod }}</view>
					</view>
				</view>
			</view>

			<view>
				<view class="title">配送信息</view>
				<view class="details">
					<view class="content">
						<view>配送时间</view>
						<view>{{ orderInfo.distributionInfo.distributionMethod }}</view>
					</view>
					<view class="content">
						<view>配送客户</view>
						<view>
							<text>{{ orderInfo.distributionInfo.distributionUserName }}</text>
							<text class="active" @click="onCall(orderInfo.distributionInfo.distributionPhone)">{{ orderInfo.distributionInfo.distributionPhone }}</text>
						</view>
					</view>
					<view class="content">
						<view>配送地址</view>
						<view>{{ orderInfo.distributionInfo.distributionAddress }}</view>
					</view>
					<view class="content" v-if="orderInfo.distributionInfo.remark">
						<view>客户留言</view>
						<view>{{ orderInfo.distributionInfo.remark }}</view>
					</view>
				</view>
			</view>

			<view v-if="orderInfo.deliveryInfo">
				<view class="title">跑腿信息</view>
				<view class="details">
					<view class="errand_box">
						<view class="content">
							<view>跑腿姓名</view>
							<view>{{ orderInfo.deliveryInfo.deliveryName }}</view>
						</view>
						<view class="image"><image :src="orderInfo.deliveryInfo.deliveryHeadImg" mode="aspectFill"></image></view>
					</view>
					<view class="content">
						<view>跑腿电话</view>
						<view>
							<text class="active" @click="onCall(orderInfo.deliveryInfo.deliveryPhone)">{{ orderInfo.deliveryInfo.deliveryPhone }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn_box">
			<button v-if="orderInfo.orderStatus == 1001 || orderInfo.orderStatus == 1101" @click="onCancel()">取消</button>
			<button v-if="orderInfo.orderStatus == 1002 || (orderInfo.orderStatus >= 1400 && orderInfo.orderStatus <= 1402) || orderInfo.orderStatus >= 1502" @click="onDelete()">
				删除订单
			</button>
			<button
				v-if="orderInfo.orderStatus == 1201 || orderInfo.orderStatus == 1202 || (orderInfo.orderStatus >= 1400 && orderInfo.orderStatus <= 1402)"
				@click="pageJump('/pages/order/applyRefund?orderNo=' + orderInfo.orderInfo.orderNo)"
			>
				申请退款
			</button>
			<button v-if="orderInfo.orderStatus >= 1502" @click="pageJump('/pages/order/refundInfo?orderNo=' + orderInfo.orderInfo.orderNo)">
				退款结果
			</button>
			<button v-if="orderInfo.orderStatus == 1001" @click="onPay()" class="active">去支付</button>
			<button v-if="orderInfo.orderStatus >= 1201" @click="onCall(orderInfo.shopPhone)" class="active">联系商家</button>
			<button v-if="orderInfo.orderStatus == 1503 || orderInfo.orderStatus == 1501" @click="onCall()" class="active">联系客服</button>
			<button v-if="orderInfo.orderStatus == 1401" @click="pageJump('/pages/order/deliveryOrderAssess?orderNo=' + orderInfo.orderInfo.orderNo)" class="active">去评价</button>
		</view>
	</view>
</template>

<script>
import { setWxPay } from '@/utils/utils';
import { appMutual, getBrowser } from '@/config/html5Utils';
export default {
	data() {
		return {
			orderNo: '',
			orderInfo: {
				goodsList: [],
				orderInfo: {},
				distributionInfo: {},
				afterSaleInfo: {}
			}
		};
	},
	//第一次加载
	onLoad(e) {
		if (e.orderNo) {
			this.orderNo = e.orderNo;
		}
		this.pageData();
	},
	//页面显示
	onShow() {},
	//方法
	methods: {
		pageData() {
			this.$http
				.get('api/order/wm/v1/order_info', {
					orderNo: this.orderNo
				})
				.then(res => {
					this.orderInfo = res;
				});
		},
		//页面跳转
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		},
		// 打电话
		onCall(phone) {
			if (phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				});
			}
		},
		onCancel() {
			uni.showModal({
				title: '提示',
				content: '确定要取消此订单吗？',
				success: res => {
					if (res.confirm) {
						this.$http
							.get('api/order/v2/cancel_or_confirm', {
								orderNo: this.orderInfo.orderInfo.orderNo,
								operateStatus: 1002
							})
							.then(data => {
								uni.showToast({
									title: '取消订单成功!',
									icon: 'none'
								});
								this.orderInfo.orderStatus = 1002;
								this.orderInfo.orderStatusStr = '已取消';
							});
					}
				}
			});
		},
		// 删除订单
		onDelete() {
			uni.showModal({
				title: '提示',
				content: '确定要删除此订单吗？',
				success: res => {
					if (res.confirm) {
						this.$http
							.get('api/order/v2/cancel_or_confirm', {
								orderNo: this.orderInfo.orderInfo.orderNo,
								operateStatus: 1000
							})
							.then(data => {
								uni.showToast({
									title: '删除订单成功!',
									icon: 'none'
								});
								uni.navigateBack();
							});
					}
				}
			});
		},
		// 去付款
		onPay() {
			//支付
			// #ifdef MP-WEIXIN
			setWxPay(this.orderInfo.orderInfo.orderNo, res => {
				if (res.success) {
					this.$emit('change', { type: 'updata' });
				} else {
					uni.showToast({
						title: '支付失败！',
						icon: 'none'
					});
				}
			});
			// #endif
			// #ifdef H5
			if (getBrowser() === '微信') {
				uni.navigateTo({
					url: '/pages/home/weChatPay?orderNo=' + this.orderInfo.orderInfo.orderNo + '&price=' + this.orderInfo.orderInfo.pricePay + '&title=外卖订单'
				});
			} else {
				appMutual('setJumpPay', {
					orderNo: this.orderInfo.orderInfo.orderNo,
					title: '外卖订单',
					price: this.orderInfo.orderInfo.pricePay
				});
			}
			// #endif
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
.delivery_info {
	width: 100%;
	background-image: linear-gradient(90deg, #ea552d 0%, #f19837 100%), linear-gradient(#ffffff, #ffffff);
	background-blend-mode: normal, normal;
	border-radius: 42upx;
	.tip_box {
		padding: 38upx 30upx 0;
		font-size: 48upx;
		line-height: 48upx;
		color: #ffffff;
	}
	.info_box {
		margin-top: 36upx;
		background-color: #ffffff;
		border-radius: 40upx;
		padding: 40upx 0 36upx;
		> view {
			&:nth-of-type(1) {
				padding: 0 30upx 54upx;
				border-radius: 40upx;
				border-bottom: 1upx solid #efefef;
			}
			&:nth-of-type(2) {
				padding: 36upx 0 0;
				display: flex;
				align-items: center;
				justify-content: center;

				> image {
					width: 36upx;
					height: 36upx;
				}
				> text {
					margin-left: 20upx;
					font-size: 30upx;
					color: #333333;
				}
			}
		}
		.shops_name {
			font-size: 30upx;
			color: #333333;
			padding-bottom: 30upx;
			border-bottom: 1upx solid #efefef;
		}
		.count_box {
			padding-top: 30upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.count {
				font-size: 24upx;
				color: #999999;
			}
			.pay {
				> text {
					color: #333333;
					&:nth-of-type(1) {
						font-size: 28upx;
					}
					&:nth-of-type(2) {
						font-size: 36upx;
					}
				}
			}
		}
		.layout_box {
			padding: 30upx 0 0;
			border-bottom: 1upx solid #efefef;
			> view {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 30upx;
				&.delivery {
					> text {
						font-size: 28upx;
						color: #333333;
					}
				}
				.discounts {
					display: flex;
					align-items: center;
					> image {
						width: 28upx;
						height: 28upx;
					}
					> text {
						margin-left: 10upx;
						font-size: 28upx;
						color: #333333;
					}
				}
				.txt {
					font-size: 28upx;
					color: #ea552d;
				}
				.names {
					font-size: 28upx;
					color: #333333;
				}
				.infos {
					> text {
						&:nth-of-type(1) {
							font-size: 24upx;
							color: #333333;
							margin-right: 84upx;
						}
						&:nth-of-type(2) {
							font-size: 28upx;
							color: #333333;
						}
					}
				}
			}
		}
	}
}
.total_info {
	margin-top: 20upx;
	background-color: #ffffff;
	border-radius: 40upx;
	margin-bottom: 140upx;
	> view {
		padding: 30upx 40upx 11upx;
		border-bottom: 1upx solid #efefef;
		.title {
			font-size: 30upx;
			color: #333333;
		}
		.details {
			margin-top: 32upx;
			.errand_box {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.image {
					image {
						width: 67upx;
						height: 67upx;
						border-radius: 50%;
					}
				}
			}
			.content {
				display: flex;
				margin-bottom: 19upx;
				> view {
					font-size: 26upx;
					&:nth-of-type(1) {
						color: #999999;
						flex-shrink: 0;
					}
					&:nth-of-type(2) {
						margin-left: 40upx;
						> text {
							&:nth-of-type(1) {
								color: #333333;
								margin-right: 20upx;
							}
							&.active {
								text-decoration: underline;
								color: #f19837;
							}
						}
					}
				}
			}
		}
	}
}
.btn_box {
	position: fixed;
	z-index: 5;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #ffffff;
	box-shadow: 0upx -20upx 30upx 0px rgba(0, 0, 0, 0.06);
	padding: 0upx 30upx;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	> button {
		margin-left: 20upx;
		margin-top: 15upx;
		margin-bottom: 15upx;
		width: 240upx;
		height: 70upx;
		border-radius: 4upx;
		border: solid 2upx #f19837;
		line-height: 70upx;
		font-size: 28upx;
		color: #f19837;
		&.active {
			background-image: linear-gradient(#f19837, #f19837), linear-gradient(#6eaefd, #6eaefd);
			color: #ffffff;
		}
	}
}
</style>
