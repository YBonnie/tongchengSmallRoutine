<template>
	<view class="order_item">
		<view class="title" @click="onShopJump">
			<text>{{ orderItem.shopName }}</text>
			<view class="order_state" :class="{
				'red':orderItem.orderStatus == 1101 || orderItem.orderStatus == 1001,
				'yellow':orderItem.orderStatus == 1401 ||orderItem.orderStatus == 1200
			}">{{ orderItem.orderStatusStr }}</view>
		</view>
		<view class="order_info" @click="onOrderDetailJump">
			<view class="image"><image :src="orderItem.shopLogo" mode="aspectFill"></image></view>
			<view class="txt">
				<text>{{ orderItem.goodsName }}</text>
				<text>总价：{{ orderItem.pricePay }}</text>
			</view>
		</view>
		<view class="btn_box">
			<button v-if="orderItem.orderStatus == 1001 || orderItem.orderStatus == 1101" @click="onCancel()">取消</button>
			<button v-if="orderItem.orderStatus == 1002 || (orderItem.orderStatus >= 1400 && orderItem.orderStatus <= 1402) || orderItem.orderStatus >= 1502" @click="onDelete()">
				删除订单
			</button>
			<button v-if="orderItem.orderType == 1401 && (orderItem.orderStatus == 1201 || orderItem.orderStatus == 1202 || (orderItem.orderStatus >= 1400 && orderItem.orderStatus <= 1402))" @click="pageJump('/pages/order/applyRefund?orderNo=' + orderItem.orderNo+'&type=1404')">
				申请退款
			</button>
			<button v-if="orderItem.orderType == 1401 && orderItem.orderStatus >= 1502" @click="pageJump('/pages/order/refundInfo?orderNo=' + orderItem.orderNo)">
				退款结果
			</button>
			<button v-if="orderItem.orderStatus == 1001" @click="onPay()" class="active">去支付</button>
			<button v-if="orderItem.orderStatus >= 1201" @click="onCall(orderItem.shopPhone)" class="active">联系商家</button>
			<button v-if="orderItem.orderStatus == 1503" @click="onCall()" class="active">联系客服</button>
			<button v-if="orderItem.orderStatus == 1401" @click="onAssess()" class="active">去评价</button>
		</view>
	</view>
</template>

<script>
import { setWxPay } from '@/utils/utils';
import { appMutual, getBrowser } from '@/config/html5Utils';
export default {
	name: 'orderLists',
	props: {
		item: {
			type: Object,
			default() {
				return {};
			}
		},
		index: {
			type: Number,
			default() {
				return 0;
			}
		}
	},
	data() {
		return {
			orderItem: {}
		};
	},
	//第一次加载
	created() {
		this.orderItem = this.item;
	},
	watch:{
		item(val){
			this.orderItem = val;
		}
	},
	//方法
	methods: {
		//店铺跳转
		onShopJump() {
			let url = '';
			if (this.orderItem.orderType == 1401) {
				url = '/pages/delivery/shopDetail?objId=' + this.orderItem.shopId;
			} else if (this.orderItem.orderType == 1501) {
				url = '/pages/groupBuy/shopDetail?objId=' + this.orderItem.shopId;
			}
			uni.navigateTo({
				url: url
			});
		},
		//订单详情跳转
		onOrderDetailJump() {
			let url = '';
			if (this.orderItem.orderType == 1401) {
				url = '/pages/delivery/orderDetails?orderNo=' + this.orderItem.orderNo;
			} else if (this.orderItem.orderType == 1501) {
				url = '/pages/groupBuy/orderDetails?orderNo=' + this.orderItem.orderNo;
			}
			uni.navigateTo({
				url: url
			});
		},
		//去评价
		onAssess(){
			let url = '';
			if (this.orderItem.orderType == 1401) {
				url = '/pages/delivery/orderAssess?orderNo=' + this.orderItem.orderNo;
			} else if (this.orderItem.orderType == 1501) {
				url = '/pages/groupBuy/orderAssess?orderNo=' + this.orderItem.orderNo;
			}
			uni.navigateTo({
				url: url
			});
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
								orderNo: this.orderItem.orderNo,
								operateStatus: 1002
							})
							.then(data => {
								uni.showToast({
									title: '取消订单成功!',
									icon: 'none'
								});
								this.orderItem.orderStatus = 1002;
								this.orderItem.orderStatusStr = '已取消';
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
								orderNo: this.orderItem.orderNo,
								operateStatus: 1000
							})
							.then(data => {
								uni.showToast({
									title: '删除订单成功!',
									icon: 'none'
								});
								this.$emit("change",{type:"delete",index:this.index});
							});
					}
				}
			});
		},
		// 去付款
		onPay() {
			//支付
			// #ifdef MP-WEIXIN
			setWxPay(this.orderItem.orderNo, res => {
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
			let title = "商品订单";
			if (this.orderItem.orderType == 1401) {
				title = "外卖订单";
			} else if (this.orderItem.orderType == 1501) {
				title = "团购订单";
			}
			if (getBrowser() === '微信') {
				uni.navigateTo({
					url: '/pages/home/weChatPay?orderNo=' + this.orderItem.orderNo + '&price=' + this.orderItem.pricePay + '&title='+title
				});
			} else {
				appMutual('setJumpPay', {
					orderNo: this.orderItem.orderNo,
					title: title,
					price: this.orderItem.pricePay
				});
			}
			// #endif
		},
		//拨打电话
		onCall(phone) {
			if (phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				});
			}
		},
		// 申请退款
		returnMoney() {
			
		}
	}
};
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
.order_item {
	padding: 34upx 30upx 24upx;
	background-color: #ffffff;
	border-radius: 40upx;
	margin-bottom: 30upx;
	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		> text {
			display: flex;
			align-items: center;
			font-size: 30upx;
			color: #333333;
			&::after {
				content: '';
				@include bis('http://qn.kemean.cn/upload/201907/23/me_lise_more.png', 100% 100%);
				width: 12upx;
				height: 22upx;
				margin-left: 20upx;
			}
		}
		.order_state {
			font-size: 28upx;
			color: #999999;
			&.red {
				color: #ea562d;
			}
			&.yellow {
				color: #f19837;
			}
		}
	}
	.order_info {
		margin-top: 30upx;
		display: flex;
		.image {
			> image {
				width: 160upx;
				height: 160upx;
				border-radius: 10upx;
			}
		}
		.txt {
			width: 100%;
			padding: 43upx 0 30upx 20upx;
			display: flex;
			justify-content: space-between;
			flex-direction: column;
			background-color: #fcf9fc;
			border-radius: 10upx;
			> text {
				font-size: 28upx;
				color: #666666;
			}
		}
	}

	.btn_box {
		margin-top: 30upx;
		display: flex;
		justify-content: flex-end;
		> button {
			margin-left: 20upx;
			width: 140upx;
			height: 50upx;
			line-height: 46upx;
			border-radius: 10upx;
			font-size: 26upx;
			border: solid 2upx #f19837;
			color: #f19837;
			&.active {
				background-image: linear-gradient(90deg, #ea552d 0%, #f19837 100%);
				color: #ffffff;
			}
		}
	}
}
</style>
