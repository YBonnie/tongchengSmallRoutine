<template>
	<view class="hotelOrderDetails">
		<view class="shops_info">
			<view class="shop_box">
				<view class="image"><image src="../../static/images/1.jpg" mode="aspectFill"></image></view>
				<view class="info">
					<view class="name">科名商务酒店</view>
					<view class="goods">
						<text>高级大床房</text>
						<text>¥88</text>
					</view>
					<view class="area">不含早餐 | 20平 | 大床</view>
				</view>
			</view>
			<!-- 地址和联系方式 -->
			<view class="address_box">
				<view class="address">
					<image src="../../static/icon/orderdetails_ads.png" mode="aspectFill"></image>
					<view>宝安区西乡街道银田路4号</view>
				</view>
				<image src="../../static/icon/orderdetails_phone.png" mode="aspectFill" @click="onCall()"></image>
			</view>
		</view>

		<view class="details_info">
			<view class="booking_info">
				<view class="title">
					<image class="icon" src="../../static/icon/orderdetails_ic2.png" mode="aspectFill"></image>
					<text>预定信息</text>
				</view>
				<view class="detail">
					<view>
						<text>预定房间</text>
						<text>高级大床房 x1</text>
					</view>
					<view>
						<text>入住人</text>
						<text>科小名</text>
					</view>
					<view>
						<text>联系手机</text>
						<text>13760001234</text>
					</view>
					<view>
						<text>预计到店</text>
						<text>2019年1月12日 14:00</text>
					</view>
				</view>
			</view>
			<!-- 入住需知 -->
			<view class="check_know">
				<view class="title">
					<image class="icon" src="../../static/icon/orderdetails_ic3.png" mode="aspectFill"></image>
					<text>入住须知</text>
				</view>
				<view class="detail">
					<view>· 押金类型：入住需要押金</view>
					<view>· 过夜入住：14:00 - 次日21:00</view>
					<view>· 发票须知：如需发票，请向酒店前台索取</view>
				</view>
			</view>
			<!-- 退订说明 -->
			<view class="unsubscribe_info">
				<view class="title">
					<image src="../../static/icon/orderdetails_ic1.png" mode="aspectFill"></image>
					<text>退订说明</text>
				</view>
				<view class="detail">
					<view>· 入住当天18:00可以退</view>
					<view>· 预约不可退</view>
				</view>
			</view>
			<!-- 订单信息 -->
			<view class="order_info">
				<view class="title">
					<image class="icon" src="../../static/icon/orderdetails_ic4.png" mode="aspectFill"></image>
					<text>订单信息</text>
				</view>
				<view class="detail">
					<view>
						<text>订单号</text>
						<text>1234545646456646464</text>
					</view>
					<view>
						<text>付款时间</text>
						<text>2018-10-01 17:19</text>
					</view>
					<view>
						<text>订单价格</text>
						<text>¥ 100.00</text>
					</view>
				</view>
			</view>
		</view>
		<view class="btn_box">
			<button>取消订单</button>
			<button>去支付</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	//第一次加载
	onLoad(e) {},
	//页面显示
	onShow() {},
	//方法
	methods: {
		// 打电话
		onCall(phone) {
			if (phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				});
			}
		},
		// 取消订单
		onCancle() {
			console.log(123);
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
				font-weight: bolder;
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
			.area {
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
		font-weight: bold;
	}
}
.details_info {
	margin-top: 20upx;
	background-color: #ffffff;
	border-radius: 40upx;
	padding: 40upx 30upx 46upx;
	margin-bottom: 150upx;
	.order_info {
		margin-top: 37upx;
	}
	.booking_info,
	.order_info {
		.detail {
			margin-top: 36upx;
			margin-left: 60upx;
			> view {
				margin-bottom: 19upx;
				display: flex;
				> text {
					font-size: 28upx;
					&:nth-of-type(1) {
						display: inline-block;
						color: #999999;
						width: 120upx;
						flex-shrink: 0;
						margin-right: 20upx;
					}
					&:nth-of-type(2) {
						color: #333333;
					}
				}
			}
		}
	}
	.check_know,
	.unsubscribe_info {
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
}
.btn_box {
	position: fixed;
	z-index: 5;
	bottom: 0;
	left: 0;
	right: 0;
	height: 98upx;
	background-color: #ffffff;
	box-shadow: 0upx -20upx 30upx 0px rgba(0, 0, 0, 0.06);
	padding: 0 30upx;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	> button {
		margin-left: 20upx;
		&:nth-of-type(1) {
			width: 240upx;
			height: 70upx;
			border-radius: 4upx;
			border: solid 2upx #f19837;
			line-height: 70upx;
			font-size: 28upx;
			color: #f19837;
		}
		&:nth-of-type(2) {
			width: 240upx;
			height: 70upx;
			background-image: linear-gradient(#f19837, #f19837), linear-gradient(#6eaefd, #6eaefd);
			background-blend-mode: normal, normal;
			border-radius: 4upx;
			line-height: 70upx;
			font-size: 28upx;
			color: #ffffff;
		}
	}
}
</style>
