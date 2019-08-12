<template>
	<view class="delivery_wait_pay">
		<view class="delivery_info">
			<view class="tip_box">{{orderInfo.orderStatusStr}} ></view>
			<view class="info_box">
				<view class="name">{{orderInfo.shopName}}</view>
				<view class="crosswise">
					<view class="goods_list" v-for="(item, index) of orderInfo.goodsList" :key="index">
						<view class="image"><image src="../../static/images/1.jpg" mode="aspectFill"></image></view>
						<view class="info">
							<view>
								<view class="names">红豆双皮奶</view>
								<view class="size">+热</view>
								<view class="num">x1</view>
							</view>
							<view>
								<view class="price">¥20.00</view>
								<button @click="onPageJump()">申请售后</button>
							</view>
						</view>
					</view>
				</view>
				<view class="crosswise">
					<view class="layout">
						<view class="title">运费</view>
						<view class="const active">8.00</view>
					</view>
					<view class="layout">
						<view class="title">优惠价格</view>
						<view class="const active">-¥8.00</view>
					</view>
					<view class="layout">
						<view class="title">订单总价</view>
						<view class="const">¥ 28.00</view>
					</view>
				</view>
				<view class="crosswise">
					<view class="layout">
						<view class="title">实付款</view>
						<view class="const">¥ 28.00</view>
					</view>
				</view>
				<view class="btn_box" @click="onCall()">
					<image src="../../static/icon/orderdetails_phone.png" mode="aspectFill"></image>
					<text>联系商家</text>
				</view>
			</view>
		</view>
		<view class="order_delivery_box">
			<view>
				<view class="title">订单信息</view>
				<view class="details">
					<view class="content">
						<view>订单编号</view>
						<view>18212311231222311223112231</view>
					</view>
					<view class="content">
						<view>订单时间</view>
						<view>2018-10-01 12:00:00</view>
					</view>
					<view class="content">
						<view>支付时间</view>
						<view>2018-10-01 12:00:00</view>
					</view>
					<view class="content">
						<view>发货时间</view>
						<view>2018-10-01 12:00:00</view>
					</view>
					<view class="content">
						<view>成交时间</view>
						<view>2018-10-01 12:00:00</view>
					</view>
				</view>
			</view>

			<view>
				<view class="title">配送信息</view>
				<view class="details">
					<view class="content">
						<view>配送时间</view>
						<view>立即配送</view>
					</view>
					<view class="content">
						<view>配送客户</view>
						<view>
							<text>唐先生</text>
							<text class="active">13760001234</text>
						</view>
					</view>
					<view class="content">
						<view>支付方式</view>
						<view>宝安区西乡街道银田路4号智谷科技园</view>
					</view>
				</view>
			</view>
			<view>
				<view class="title">跑腿信息</view>
				<view class="details">
					<view class="errand_box">
						<view class="content">
							<view>跑腿姓名</view>
							<view>可小名</view>
						</view>
						<view class="image"><image src="../../static/images/1.jpg" mode="aspectFill"></image></view>
					</view>
					<view class="content">
						<view>跑腿电话</view>
						<view><text class="active">13760001234</text></view>
					</view>
				</view>
			</view>
		</view>
		<view class="button_box">
			<button>取消订单</button>
			<button>去支付</button>
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
			orderInfo:{}
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
		pageData(){
			this.$http
				.get('api/order/wm/v1/order_info', {
					orderNo: this.orderNo
				})
				.then(res => {
					this.orderInfo = res;
				});
		},
		//页面跳转
		onPageJump(url){
			uni.navigateTo({
				url:url
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
		padding: 40upx 30upx 36upx;
		.name {
			font-size: 30upx;
			color: #333333;
			padding-bottom: 30upx;
			border-bottom: 1upx solid #efefef;
		}
		.crosswise {
			padding: 30upx 0;
			border-bottom: 1upx solid #efefef;
			&:last-of-type {
				border-bottom: none;
			}
			.goods_list {
				width: 100%;
				display: flex;
				margin-bottom: 50upx;
				&:last-of-type {
					margin-bottom: 0;
				}
				.image {
					> image {
						width: 90upx;
						height: 90upx;
					}
				}
				.info {
					margin-left: 30upx;
					width: 100%;
					display: flex;
					justify-content: space-between;
					> view {
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						&:nth-of-type(2) {
							align-items: flex-end;
						}
						.names,
						.price {
							font-size: 28upx;
							color: #333333;
						}
						.size,
						.num {
							font-size: 24upx;
							color: #999999;
						}
						> button {
							width: 135upx;
							height: 44upx;
							line-height: 44upx;
							border-radius: 5upx;
							border: solid 2upx #f19837;
							color: #f19837;
							font-size: 28upx;
						}
					}
				}
			}
			.layout {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 30upx;
				&:last-of-type {
					margin-bottom: 0;
				}
				.title {
					font-size: 28upx;
					color: #333333;
				}
				.const {
					font-size: 36upx;
					color: #333333;
				}
				.active {
					font-size: 28upx;
					color: #ea552d;
				}
			}
		}
		.btn_box {
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
}
.order_delivery_box {
	padding-top: 30upx;
	border-radius: 40upx;
	background-color: #ffffff;
	margin-top: 20upx;
	margin-bottom: 140upx;
	> view {
		padding: 30upx 40upx 11upx;
		border-bottom: 1upx solid #efefef;
		&:last-of-type {
			border-bottom: none;
		}
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
						color: #333333;
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
.button_box {
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
