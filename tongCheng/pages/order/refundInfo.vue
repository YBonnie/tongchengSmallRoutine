<template>
	<!-- 退款信息 -->
	<view class="refund_info">
		<view class="delivery_info">
			<view class="tip_box">{{orderInfo.afterSaleInfo.refundStatusStr}} ></view>
			<view class="info_box">
				<view class="name">申请信息</view>
				<!-- 退款原因 -->
				<view class="layout">
					<text>退款原因</text>
					<text>{{orderInfo.afterSaleInfo.refundReason}}</text>
				</view>
				<view class="layout">
					<text>退款描述</text>
					<text>{{orderInfo.afterSaleInfo.refundDesc}}</text>
				</view>
				<!-- 退款图片 -->
				<swiper display-multiple-items="3.5">
					<swiper-item v-for="(item, index) of orderInfo.afterSaleInfo.imgRecord" :key="index" >
						<image @click="onPreviewImage(index,orderInfo.afterSaleInfo.imgRecord)" class="image_box" :src="item" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<view class="info_box">
			<view class="name">拒绝退款原因</view>
			<view class="reason">{{orderInfo.afterSaleInfo.refuseReason}}</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderInfo:{
				afterSaleInfo:{
					imgRecord:[]
				}
			},
		};
	},
	//第一次加载
	onLoad(e) {
		this.orderNo = e.orderNo;
		this.loadData();
	},
	//页面显示
	onShow() {},
	//方法
	methods: {
		// 获取数据
		loadData() {
			this.$http
				.get('api/order/wm/v1/order_info', {
					orderNo: this.orderNo
				})
				.then(res => {
					this.orderInfo = res;
				});
		},
		// 图片预览的方法
		onPreviewImage(index, imgs) {
			if (imgs && imgs instanceof Array && imgs.length > 0) {
				uni.previewImage({
					current: imgs[index],
					urls: imgs
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
		color: #ffffff;
	}
	
}
.info_box {
		margin-top: 36upx;
		background-color: #ffffff;
		border-radius: 40upx;
		padding: 40upx 30upx 36upx;
		.name {
			font-weight: bolder;
			font-size: 30upx;
			color: #333333;
			padding-bottom: 30upx;
			border-bottom: 1upx solid #efefef;
		}
		.reason{
			margin-top: 30upx;
			font-size: 26upx;
	color: #333333;
		}
		.layout {
			margin-top: 30upx;
			display: flex;
			align-items: baseline;
			> text {
				font-size: 26upx;
				&:nth-of-type(1) {
					color: #999999;
					flex-shrink: 0;
				}
				&:nth-of-type(2) {
					margin-left: 40upx;
					color: #333333;
				}
			}
		}
		swiper {
			padding-left: 30upx;
			width: 100%;
			height: 160upx;
			margin-top: 30upx;
			swiper-item {
				margin-right: 30upx;
				box-sizing: border-box;
				height: 160upx;
				width: 160upx;
					image {
						border-radius: 10upx;
						width: 160upx;
						height: 160upx;
					}
				
			}
		}
	}
</style>
