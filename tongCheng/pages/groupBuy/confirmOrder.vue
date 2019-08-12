<template>
	<view>
		<view class="goods_info_box">
			<view class="package_list" :class="{'spike':goodsData.spike}">
				<view class="voucher_price_box" v-if="goodsData.type == 1201">
					<view>{{goodsData.priceDiscount}}</view>
					<view>代{{goodsData.priceTotal}}元</view>
				</view>
				<image v-else="" :src="goodsData.imgs[0]" mode="aspectFill"></image>
				<view class="voucher_info" v-if="goodsData.type == 1201">
					<view class="info_box">
						<view class="name">{{goodsData.name}}</view>
						<view class="info">{{goodsData.useDateStr}} {{goodsData.reserveStr}}</view>
					</view>
				</view>
				<view class="package_info" v-else="">
					<view class="info_box">
						<view class="name">{{goodsData.name}}</view>
					</view>
					<!-- <view class="info_box" v-if="goodsData.spike">
						<view class="time" v-if="goodsData.spikeBegin">倒计时 {{goodsData.countdown}}</view>
						<view class="time" v-else="" >开始时间：{{goodsData.spikeBeginTimeStr}}</view>
					</view> -->
					<view class="info_box">
						<view>{{goodsData.useDateStr}} {{goodsData.reserveStr}}</view>
						<view>剩余{{goodsData.numBalance}}份</view>
					</view>
					<view class="price_box">
						<view class="price">
							<text v-if="goodsData.spike">秒杀价:</text>
							{{goodsData.priceDiscount}}
						</view>
						<view class="store" v-if="!goodsData.spike">门市价：{{goodsData.priceTotal}}</view>
					</view>
				</view>
			</view>
			<view class="cell_list">
				<view class="cell_left">数量</view>
				<view class="cell_right num_box">
					<view @click="onReduce">-</view>
					<text>{{goodsNum}}</text>
					<view @click="onPlus">+</view>
				</view>
			</view>
			<view class="cell_list noLine">
				<view class="cell_left">小计</view>
				<view class="cell_right">¥{{orderInfo.totalPrice}}</view>
			</view>
		</view>
		<view class="cell_box">
			<view class="cell_list" @click="onPageJump('/pages/my/coupon?goodsPrice='+orderInfo.totalPrice+'&shopId='+goodsData.shopId)">
				<view class="cell_left">优惠券</view>
				<view class="cell_right arrow">{{checkedCouponData.priceDiscount ? '-￥'+checkedCouponData.priceDiscount:0}}</view>
			</view>
			<view class="cell_list noLine">
				<view class="cell_left">实付金额</view>
				<view class="cell_right price">¥{{orderInfo.payPrice}}</view>
			</view>
		</view>
		<view class="from_but"><button class="active" @click="onSubmit">提交订单</button></view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { setWxPay } from '@/utils/utils';
// #ifdef H5
import { appMutual,getBrowser } from '@/config/html5Utils';
// #endif
export default {
	data() {
		return {
			goodsNum:1,
			orderInfo:{}
		};
	},
	computed: {
		...mapState(['goodsData','checkedCouponData'])
	},
	//第一次加载
	onLoad(e) {
	},
	//页面显示
	onShow() {
		this.pageData();
	},
	//方法
	methods: {
		onReduce(){
			if(this.goodsNum > 1){
				this.goodsNum--;
				this.pageData();
			}
		},
		onPlus(){
			if(this.goodsNum < this.goodsData.numBalance){
				this.goodsNum++;
				this.pageData();
			}
		},
		//页面跳转
		onPageJump(url){
			uni.navigateTo({
				url:url
			});
		},
		pageData(){
			let httpData = {
				goodsId: this.goodsData.objId,
				goodsNum: this.goodsNum,
			};
			if(this.checkedCouponData.objId){
				httpData.voucherId = this.checkedCouponData.objId;
			}
			this.$http
				.post('api/order/tg/v1/budget', httpData)
				.then(res => {
					this.orderInfo = res;
				});
		},
		onSubmit(){
			let httpData = {
				goodsId: this.goodsData.objId,
				goodsNum: this.goodsNum,
			};
			if(this.checkedCouponData.objId){
				httpData.voucherId = this.checkedCouponData.objId;
			}
			this.$http
				.post('api/order/tg/v1/submit', httpData)
				.then(res => {
					//支付
					// #ifdef MP-WEIXIN
					setWxPay(res.orderNo,data => {
						let content = "支付成功！"
						if(!data.success){
							content = "支付失败！"
						}
						uni.showModal({
							title:"支付提示",
							content:content,
							showCancel:false,
							success: (res) => {
								uni.switchTab({
									url:"/pages/my/my"
								});
							}
						})
					});
					// #endif
					// #ifdef H5
					if (getBrowser() === "微信") {
						uni.navigateTo({
							url:"/pages/home/weChatPay?orderNo="+res.orderNo+"&price="+res.price+"&title="+res.title
						})
					} else {
						appMutual("setJumpPay", res);
					}
					// #endif
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
.goods_info_box {
	background-color: #ffffff;
	border-radius: 40upx;
	overflow: hidden;
	padding: 30upx 30upx 0 30upx;
	.package_list {
		display: flex;
		background-color: #fcf9fc;
		border-radius: 10upx;
		margin-bottom: 20upx;
		&.spike {
			background-color: #fff6f3;
		}
		image {
			width: 160upx;
			height: 160upx;
			border-radius: 10upx;
			flex-shrink: 0;
		}
		.voucher_price_box {
			width: 160upx;
			height: 160upx;
			background-color: #f19837;
			border-radius: 10upx;
			flex-shrink: 0;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			view:nth-child(1){
				font-size: 48upx;
				color: #ffffff
			}
			view:nth-child(2){
				font-size: 26upx;
				color: #ffffff
			}
		}
		.voucher_info {
			width: calc(100% - 160upx);
			padding: 0 30upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.info_box {
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				height: 160upx;
				padding: 30upx 0;
				.name {
					font-size: 32upx;
					color: #333333;
					font-weight: bold;
				}
				.info {
					font-size: 24upx;
					color: #666666;
				}
			}
			.arrow {
				@include bis('http://qn.kemean.cn/upload/201907/23/me_lise_more.png', 100% 100%);
				width: 12upx;
				height: 22upx;
				margin-left: 20upx;
			}
		}
		.package_info {
			width: calc(100% - 160upx);
			padding: 15upx 30upx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.info_box {
				margin-bottom: 8upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 24upx;
				color: #666666;
			}
			.name {
				font-size: 32upx;
				color: #333333;
				font-weight: bold;
			}
			.time {
				font-size: 24upx;
				color: #f19837;
				font-weight: bold;
			}
			.price_box {
				display: flex;
				align-items: center;
				.price {
					font-size: 32upx;
					color: #e84134;
					display: flex;
					align-items: center;
					text {
						font-size: 24upx;
						color: #e84134;
					}
				}
				.store {
					font-size: 20upx;
					color: #666666;
					margin-left: 30upx;
					text-decoration: line-through;
				}
			}
		}
	}
	.cell_list {
		padding-left: 0;
		padding-right: 0;
	}
	.num_box {
		display: flex;
		border: solid 1upx #f0f0f0;
		border-radius: 4upx;
		view {
			width: 60upx;
			height: 60upx;
			text-align: center;
			line-height: 56upx;
			font-size: 34upx;
		}
		text {
			width: 60upx;
			height: 60upx;
			line-height: 60upx;
			text-align: center;
			border-left: solid 1upx #f0f0f0;
			border-right: solid 1upx #f0f0f0;
			font-size: 28upx;
		}
	}
}
.cell_box {
	background-color: #ffffff;
	border-radius: 40upx;
	margin-top: 20upx;
	overflow: hidden;
	.price {
		font-size: 36upx;
		color: #ea552d;
	}
}
</style>
