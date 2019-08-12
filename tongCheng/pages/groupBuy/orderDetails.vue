<template>
	<view class="orderDetails">
		<view class="shops_info">
			<view class="shop_box" @click="onPageJump('/pages/groupBuy/shopDetail?objId='+orderInfo.shopInfo.shopId)">
				<view class="image"><image :src="orderInfo.shopInfo.shopLogo" mode="aspectFill"></image></view>
				<view class="info">
					<view class="name">{{orderInfo.shopInfo.shopName}}</view>
					<view class="goods">
						<text>{{orderInfo.shopInfo.goodsName}}</text>
						<text>{{orderInfo.shopInfo.priceDiscount}}</text>
					</view>
					<view class="price">门市价：{{orderInfo.shopInfo.priceTotal}}</view>
				</view>
			</view>
			<!-- 地址和联系方式 -->
			<view class="address_box">
				<view class="address">
					<image src="../../static/icon/orderdetails_ads.png" mode="aspectFill"></image>
					<view>{{orderInfo.shopInfo.shopAddress}}</view>
				</view>
				<image src="../../static/icon/orderdetails_phone.png" mode="aspectFill" @click="onCall(orderInfo.shopInfo.shopPhone)"></image>
			</view>
		</view>
		<!-- 团购券码 -->
		<view class="coupon_code">
			<view class="title">
				<image src="../../static/icon/orderdetails_ic1.png" mode="aspectFill"></image>
				<text>团购券码</text>
			</view>
			<view class="code">
				<text :class="[item.used ? 'failure':'active']" v-for="(item,index) of orderInfo.ticketCodes" :key="index" @click="onCode(item)">{{item.ticketCode}}</text>
			</view>
		</view>
		<!-- 套餐详情 / 订单信息 / 使用说明 -->
		<view class="total_info">
			<view class="package_details">
				<view class="title">
					<image class="icon" src="../../static/icon/orderdetails_ic2.png" mode="aspectFill"></image>
					<text>套餐详情</text>
				</view>
				<view class="detail">
					<view v-for="(item,index) of orderInfo.goodsInfo" :key="index">
						<view class="name">
							<text>{{item.goodsName}}</text>
							<text>{{item.goodsNum}}</text>
						</view>
						<view class="price">{{item.goodsPrice}}</view>
					</view>
				</view>
			</view>
			<view class="order_info">
				<view class="title">
					<image class="icon" src="../../static/icon/orderdetails_ic3.png" mode="aspectFill"></image>
					<text>使用说明</text>
				</view>
				<view class="detail">
					<view v-for="(item,index) of orderInfo.useDesc" :key="index">· {{item}}</view>
				</view>
			</view>
			<view class="instructions">
				<view class="title">
					<image class="icon" src="../../static/icon/orderdetails_ic4.png" mode="aspectFill"></image>
					<text>订单信息</text>
				</view>
				<view class="detail">
					<view>
						<text>订单号</text>
						<text>{{orderInfo.orderInfo.orderNo}}</text>
					</view>
					<view>
						<text>订单价格</text>
						<text>￥{{orderInfo.orderInfo.payPrice}}</text>
					</view>
					<view v-if="orderInfo.orderInfo.payTimeStr">
						<text>付款时间</text>
						<text>{{orderInfo.orderInfo.payTimeStr}}</text>
					</view>
					<view v-if="orderInfo.orderInfo.sendTimeStr">
						<text>完成时间</text>
						<text>{{orderInfo.orderInfo.sendTimeStr}}</text>
					</view>
				</view>
			</view>
			
		</view>
		<view class="btn_box">
			<button v-if="orderInfo.orderInfo.orderStatus == 1001 || orderInfo.orderInfo.orderStatus == 1101" @click="onCancel()">取消</button>
			<button v-if="orderInfo.orderInfo.orderStatus == 1002 || orderInfo.orderInfo.orderStatus >= 1401" @click="onDelete()">删除订单</button>
			<button v-if="orderInfo.orderInfo.orderStatus == 1001" @click="onPay()" class="active">去支付</button>
			<button v-if="orderInfo.orderInfo.orderStatus == 1401" @click="pageJump('/pages/order/groupBuyOrderAssess?orderNo=' + orderInfo.orderInfo.orderNo)" class="active">去评价</button>
		</view>
		<!-- 显示二维码 -->
		<view class="code_box" v-if="codeShow">
			<view class="mask" @click="codeShow = false"></view>
			<view class="pop_box">
				<view class="image"><image :src="codeInfo.qrCodeUrl" mode="aspectFill"></image></view>
				<view class="txt">
					<text>{{orderInfo.shopInfo.goodsName}}</text>
					<text>{{codeInfo.ticketCode}}（{{codeInfo.used ? "已使用":"未使用"}}）</text>
				</view>
			</view>
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
			// 显示二维码
			codeShow: false,
			codeInfo:{},
			orderInfo:{
				goodsInfo:[],
				shopInfo:{},
				orderInfo:{},
				ticketCodes:[],
				useDesc:[]
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
		pageData(){
			this.$http
				.get('api/order/tg/v1/info_data', {
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
		// 取消订单
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
								this.orderInfo.orderInfo.orderStatus = 1002;
								this.orderInfo.orderInfo.orderStatusStr = '已取消';
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
					this.$emit("change",{type:"updata"});
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
					url: '/pages/home/weChatPay?orderNo=' + this.orderInfo.orderInfo.orderNo + '&price=' + this.orderInfo.orderInfo.pricePay + '&title=团购订单'
				});
			} else {
				appMutual('setJumpPay', {
					orderNo: this.orderInfo.orderInfo.orderNo,
					title: "团购订单",
					price: this.orderInfo.orderInfo.pricePay
				});
			}
			// #endif
		},
		onCode(item){
			this.codeInfo=item;
			this.codeShow = true;
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
.shops_info {
	background-color: #ffffff;
	border-radius: 40upx;
	border: solid 2upx #f8f8f8;
	width: 100%;

	.shop_box {
		padding: 30upx;
		display: flex;
		border-radius: 40upx;
		border: solid 2upx #f8f8f8;
		.image {
			image {
				width: 160upx;
				height: 160upx;
				border-radius: 10px;
			}
		}
		.info {
			margin-left: 30upx;
			display: flex;
			justify-content: space-around;
			flex-direction: column;
			width: 100%;
			.name {
				font-size: 30upx;
				color: #333333;
			}
			.goods {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				> text {
					&:nth-of-type(1) {
						font-size: 28upx;
						color: #666666;
					}
					&:nth-of-type(2) {
						font-size: 36upx;
						color: #333333;
						display: flex;
						align-items: center;
						flex-shrink: 0;
						&::after {
							display: flex;
							content: '';
							width: 12upx;
							height: 22upx;
							background-image: url('http://qn.kemean.cn/upload/201907/23/me_lise_more.png');
							background-repeat: no-repeat;
							background-position: center center;
							background-size: 100%;
							margin-left: 20upx;
						}
					}
				}
			}
			.price {
				font-size: 28upx;
				color: #666666;
			}
		}
	}
	.address_box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 23upx 30upx 27upx;
		> image {
			width: 36upx;
			height: 36upx;
		}

		.address {
			width: calc(100% - 50upx);
			display: flex;
			justify-content: flex-start;
			align-items: center;
			color: #333333;
			font-size: 26upx;
			> view {
				width: calc(100% - 40upx);
			}
			> image {
				width: 20upx;
				height: 26upx;
				margin-right: 18upx;
			}
		}
	}
}
.title {
	display: flex;
	align-items: center;
	> image {
		width: 40upx;
		height: 34upx;
	}
	.icon {
		width: 34upx;
		height: 38upx;
	}
	> text {
		margin-left: 20upx;
		font-size: 34upx;
		color: #333333;
	}
}
.coupon_code {
	margin-top: 20upx;
	background-color: #ffffff;
	border-radius: 40upx;
	padding: 40upx 30upx 91upx;
	.code {
		margin-top: 38upx;
		display: flex;
		flex-wrap: wrap;
		> text {
			margin-left: 72upx;
			font-size: 28upx;
			&.active {
				text-decoration: underline;
				color: #f19837;
			}
			&.failure {
				color: #999999;
				text-decoration: line-through;
			}
		}
	}
}
.total_info {
	margin-top: 20upx;
	background-color: #ffffff;
	border-radius: 40upx;
	padding: 40upx 30upx 46upx;
	margin-bottom: 150upx;
	.package_details {
		.detail {
			margin-top: 36upx;
			margin-left: 60upx;
			> view {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 18upx;
				.name {
					display: flex;
					align-items: center;
					> text {
						font-size: 28upx;
						&:nth-of-type(1) {
							color: #333333;
							width: 45vw;
						}
						&:nth-of-type(2) {
							color: #999999;
							margin-left: 30upx;
						}
					}
				}
				.price {
					color: #333333;
					font-size: 28upx;
				}
			}
		}
	}
	.order_info {
		margin-top: 37upx;
		.detail {
			margin-top: 36upx;
			margin-left: 60upx;
			> view {
				font-size: 26upx;
				color: #666666;
				margin-bottom: 19upx;
			}
		}
	}
	.instructions {
		margin-top: 37upx;
		.detail {
			margin-top: 36upx;
			margin-left: 60upx;
			> view {
				margin-bottom: 19upx;
				> text {
					font-size: 26upx;
					&:nth-of-type(1) {
						display: inline-block;
						color: #999999;
						width: 110upx;
						margin-right: 20upx;
					}
					&:nth-of-type(2) {
						color: #333333;
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
.code_box {
	.mask{
		position: fixed;
		top: 0upx;
		left: 0upx;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 6;
	}
	animation: popupMask 0.4s;
	.pop_box {
		position: fixed;
		left: 105upx;
		right: 105upx;
		top: 224upx;
		z-index: 8;
		width: 540upx;
		background-color: #ffffff;
		border-radius: 40upx;
		animation: popupContentBox 0.4s;
		.image {
			border-bottom: 1upx solid #cccccc;
			padding: 37upx 51upx 31upx;
			> image {
				width: 436upx;
				height: 436upx;
			}
		}
		.txt {
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			padding: 22upx 0 27upx;
			> text {
				&:nth-of-type(1) {
					font-size: 36upx;
					color: #333333;
				}
				&:nth-of-type(2) {
					font-size: 24upx;
					color: #999999;
				}
			}
		}
	}
}
@keyframes popupMask {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
@keyframes popupContentBox {
	0% {
		opacity: 0;
		transform: scale(1.1,1.1);
	}
	100% {
		opacity: 1;
		transform: scale(1.0,1.0)
	}
}
</style>
