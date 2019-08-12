<template>
	<view class="page">
		<!-- #ifdef MP-WEIXIN -->
		<map :longitude="longitude" :latitude="latitude"></map>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view class="map" id="container"></view>
		<!-- #endif -->
		<view class="run_leg_box" v-if="orderInfo.deliveryData">
			<view class="run_leg_user_info">
				<view class="user_info_box">
					<image :src="orderInfo.deliveryData.deliveryHeadImg" mode="aspectFill"></image>
					<view class="info">
						<view class="name">{{orderInfo.deliveryData.deliveryName}}</view>
						<text>跑腿员</text>
					</view>
				</view>
				<view class="score">{{orderInfo.deliveryData.deliveryScore}}分</view>
			</view>
			<view class="dotted_line"></view>
			<view class="btn_box">
				<button class="active" @click="onCall(orderInfo.deliveryData.deliveryPhone)">电话联系</button>
				<!-- <button>发消息</button> -->
			</view>
		</view>
		<view class="order_info_box">
			<view class="title">
				<view>订单信息</view>
				<text>{{orderInfo.orderData.orderStatusStr}}</text>
			</view>
			<view class="dotted_line"></view>
			<view class="info_box">
				<view class="name">订单号码</view>
				<view class="text">{{orderInfo.orderData.orderNo}}
					<!-- #ifdef MP-WEIXIN -->
					<text class="copy" @click="onCopy(orderInfo.orderData.orderNo)">复制</text>
					<!-- #endif -->
				</view>
			</view>
			<view class="info_box">
				<view class="name">下单时间</view>
				<view class="text">{{orderInfo.orderData.createTimeStr}}</view>
			</view>
			<view class="info_box" v-if="orderInfo.orderData.completeTimeStr">
				<view class="name">完成时间</view>
				<view class="text">{{orderInfo.orderData.completeTimeStr}}</view>
			</view>
			<view class="dashed_line"></view>
			<view class="size_info_box">
				<view class="name">雇佣费用</view>
				<view class="text">￥{{orderInfo.orderData.priceService}}</view>
			</view>
			<view class="size_info_box">
				<view class="name">优惠卷</view>
				<view class="text">￥{{orderInfo.orderData.priceOffer}}</view>
			</view>
			<view class="dashed_line"></view>
			<view class="total">
				<view class="name">合计</view>
				<view class="price">￥<text>{{orderInfo.orderData.priceTotal}}</text></view>
			</view>
		</view>
		<view class="order_info_box" v-if="orderInfo.addressReceiveData">
			<view class="title">
				<view>收货信息</view>
			</view>
			<view class="dotted_line"></view>
			<view class="receipt_info">
				<view>
					{{orderInfo.addressReceiveData.receiveName}}<text>{{orderInfo.addressReceiveData.receivePhone}}</text>
				</view>
				<view>{{orderInfo.addressReceiveData.addressReceive}}</view>
			</view>
		</view>
		<view class="order_info_box">
			<view class="title">
				<view>帮忙信息</view>
			</view>
			<view class="dotted_line"></view>
			<view class="info_box">
				<view class="name">描述</view>
				<view class="text">{{orderInfo.helpDesc}}</view>
			</view>
			<view class="info_box" v-if="orderInfo.helpStartTimeStr">
				<view class="name">开始时间</view>
				<view class="text">{{orderInfo.helpStartTimeStr}}</view>
			</view>
			<view class="info_box" v-if="orderInfo.helpEndTimeStr">
				<view class="name">结束时间</view>
				<view class="text">{{orderInfo.helpEndTimeStr}}</view>
			</view>
			<view class="info_box">
				<view class="name">预估时长</view>
				<view class="text">{{orderInfo.forecastTimeStr}}</view>
			</view>
			<view class="info_box">
				<view class="name">帮忙地址</view>
				<view class="text">{{orderInfo.helpAddress}}</view>
			</view>
			<view class="info_box">
				<view class="name">联系电话</view>
				<view class="text" @click="onCall(orderInfo.phone)">{{orderInfo.phone}}</view>
			</view>
		</view>
		<view class="order_btn_box">
			<button class="active" v-if="orderInfo.orderData.orderStatus == 1401" @click="onAssess">去评价</button>
			<button class="active" v-if="orderInfo.orderData.orderStatus == 1202" @click="openMakeUpPopup(orderInfo.orderData)">订单补费</button>
			<button class="active" v-if="orderInfo.orderData.orderStatus == 1101" @click="openTipPopup">补加小费</button>
			<button class="active" v-if="orderInfo.orderData.orderStatus == 1001" @click="onPay">去支付</button>
			<button v-if="orderInfo.orderData.orderStatus == 1204 || orderInfo.orderData.orderStatus == 1301" @click="onConfirm">确认完成</button>
			<button v-if="orderInfo.orderData.orderStatus == 1001 || orderInfo.orderData.orderStatus == 1101 || orderInfo.orderData.orderStatus == 1201 || orderInfo.orderData.orderStatus == 1202"
			 @click="onCancel">取消</button>
			<button v-if="orderInfo.orderData.orderStatus == 1501 || orderInfo.orderData.orderStatus == 1503">联系客服</button>
			<button v-if="orderInfo.orderData.orderStatus == 1002 || orderInfo.orderData.orderStatus == 1400 || orderInfo.orderData.orderStatus == 1401 || orderInfo.orderData.orderStatus == 1402 || orderInfo.orderData.orderStatus == 1502 || orderInfo.orderData.orderStatus == 1503"
			 @click="onDelete">删除</button>
		</view>
		<tip-popup title="补加小费" ref="tipPopup" @change="tipChange"></tip-popup>
		<make-up-popup ref="makeUpPopup"></make-up-popup>
		<score-popup ref="scorePopup" @change="pageData"></score-popup>
	</view>
</template>

<script>
	import tipPopup from "@/components/module/tip_popup";
	import makeUpPopup from "@/components/module/make_up_popup";
	import scorePopup from "@/components/module/score_popup";
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
		components: {
			tipPopup,
			makeUpPopup,
			scorePopup
		},
		data() {
			return {
				longitude: 116.3975018263,
				latitude: 39.9087815920,
				orderInfo: {
					orderData:{}
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
		onShow() {

		},
		//方法
		methods: {
			pageData() {
				this.$http
					.get('api/mime/v1/order_info_help', {
						orderNo: this.orderNo
					})
					.then(res => {
						this.orderInfo = res;
						//设置经纬度
						if (res.deliveryData && res.deliveryData.deliveryLongitude) {
							this.longitude = res.deliveryData.deliveryLongitude;
							this.latitude = res.deliveryData.deliveryLatitude;
						} else if (res.orderData && res.orderData.receiveLongitude) {
							this.longitude = res.orderData.receiveLongitude;
							this.latitude = res.orderData.receiveLatitude;
						}
						// #ifdef H5
						this.$nextTick(() => {
							this.mapInit(this.longitude, this.latitude);
						});
						// #endif
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
			//复制
			onCopy(val) {
				uni.setClipboardData({
					data: val,
					success: function() {
						uni.showToast({
							title:"复制成功！"
						});
					}
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
			//H5地图
			mapInit(longitude, latitude) {
				const _this = this;
				//加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
				var map = new AMap.Map('container', {
					zoom: 15,
					scrollWheel: false,
					center: [longitude, latitude] //中心点坐标
				});
				//加载SimpleMarker
				AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
					//创建SimpleMarker实例
					new SimpleMarker({
						//前景文字
						iconLabel: '',
						//图标主题
						iconTheme: 'numv1',
						//背景图标样式
						iconStyle: 'blue',
						map: map,
						position: [longitude, latitude]
					});
				});
				AMapUI.loadUI(['control/BasicControl'], function(BasicControl) {
					var zoomCtrl1 = new BasicControl.Zoom({
							theme: 'dark'
						}),
						zoomCtrl2 = new BasicControl.Zoom({
							position: 'br',
							showZoomNum: true
						});
					map.addControl(zoomCtrl1);
					map.addControl(zoomCtrl2);
				});
			},
			//去评价
			onAssess() {
				this.$refs.scorePopup.onPopupShow(this.orderInfo.orderData.orderNo);
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
									orderNo: this.orderInfo.orderData.orderNo,
									operateStatus: 1002
								})
								.then(data => {
									uni.showToast({
										title: '取消订单成功!',
										icon: 'none'
									});
									this.orderInfo.orderData.orderStatus = 1002;
									this.orderInfo.orderData.orderStatusStr = '已取消';
								});
						}
					}
				});
			},
			// 删除订单
			onDelete(index) {
				uni.showModal({
					title: '提示',
					content: '确定要删除此订单吗？',
					success: res => {
						if (res.confirm) {
							this.$http
								.get('api/order/v2/cancel_or_confirm', {
									orderNo: this.orderInfo.orderData.orderNo,
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
			onPay(index) {
				let item = this.orderInfo.orderData;
				//支付
				// #ifdef MP-WEIXIN
				setWxPay(item.orderNo, res => {
					if (res.success) {
						this.pageData();
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
				if (getBrowser() === '微信') {
					uni.navigateTo({
						url: '/pages/home/weChatPay?orderNo=' + item.orderNo + '&price=' + item.priceTotal + '&title=帮买订单'
					});
				} else {
					appMutual('setJumpPay', {
						orderNo: item.orderNo,
						title: "帮买订单",
						price: item.priceTotal
					});
				}
				// #endif
			},
			//打开补加小费弹窗
			openTipPopup(index) {
				this.$refs.tipPopup.onPopupShow();
			},
			//补加小费
			tipChange(e) {
				if (e == 0) {
					uni.showToast({
						title: "金额不能为空",
						icon: "none"
					});
					return;
				}
				this.$http
					.get('api/order/v1/add_price_tip', {
						orderNo: this.orderInfo.orderData.orderNo,
						payPrice: e
					})
					.then(data => {
						//支付
						// #ifdef MP-WEIXIN
						setWxPay(res.orderNo, data => {
							if (res.success) {
								this.pageData();
								uni.showToast({
									title: '支付成功！',
								});
								this.$refs.tipPopup.onPopupHide();
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
			},
			//确认完成
			onConfirm(){
				uni.showModal({
					title: '提示',
					content: '确定完成此订单吗？',
					success: res => {
						if (res.confirm) {
							this.$http
								.get('api/order/v2/cancel_or_confirm', {
									orderNo: this.orderInfo.orderData.orderNo,
									operateStatus: 1301
								})
								.then(data => {
									uni.showToast({
										title: '订单已完成!'
									});
									this.orderInfo.orderData.orderStatus = 1401;
									this.orderInfo.orderData.orderStatusStr = '已完成';
								});
						}
					}
				});
			},
			//订单补费
			openMakeUpPopup(item) {
				this.$refs.makeUpPopup.onPopupShow(item.orderNo);
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
	@import "@/style/mixin.scss";

	.page {
		padding-bottom: 150upx;
	}

	map,
	.map {
		width: 100%;
		height: 330upx;
		border-radius: 6upx;
	}

	.dotted_line {
		width: 100%;
		border-top: 2upx dashed #ccc;
		position: relative;
		height: 1upx;

		&::before {
			content: "";
			position: absolute;
			left: -40upx;
			top: 50%;
			transform: translateY(-50%);
			background-color: #F1f1f1;
			width: 24upx;
			height: 24upx;
			border-radius: 50%;
		}

		&::after {
			content: "";
			position: absolute;
			right: -40upx;
			top: 50%;
			transform: translateY(-50%);
			background-color: #F1f1f1;
			width: 24upx;
			height: 24upx;
			border-radius: 50%;
		}
	}

	.run_leg_box {
		box-shadow: 0px -20px 30px 0px rgba(0, 0, 0, 0.06);
		margin: 0 30upx 30upx 30upx;
		background-color: #FFF;
		border-radius: 40upx;
		padding: 30upx;

		.run_leg_user_info {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 30upx;

			.user_info_box {
				display: flex;

				image {
					width: 100upx;
					height: 100upx;
					border-radius: 50%;
				}

				.info {
					margin-left: 22upx;

					.name {
						font-size: 34upx;
						color: #333333;
						font-weight: bold;
					}

					text {
						font-size: 24upx;
						color: #999999;
					}
				}
			}

			.score {
				font-size: 34upx;
				color: #333333;
				width: 170upx;
				height: 50upx;
				text-align: center;
				line-height: 50upx;
				border-left: 1upx solid #cccccc;
				font-weight: bold;
			}
		}

		.btn_box {
			display: flex;
			padding-top: 30upx;

			button {
				flex: 1;
				height: 72upx;
				line-height: 72upx;
				border-radius: 8upx;
				border: solid 2upx $mainColor;
				font-size: 28upx;
				color: $mainColor;

				&:nth-child(2) {
					margin-left: 20upx;
				}

				&.active {
					flex: 2;
					background-color: $mainColor;
					color: #FFF;
				}
			}
		}
	}

	.order_info_box {
		box-shadow: 0px -20px 30px 0px rgba(0, 0, 0, 0.06);
		margin: 0 30upx 30upx 30upx;
		background-color: #FFF;
		border-radius: 40upx;
		padding: 30upx;

		.title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 30upx;

			view {
				font-size: 34upx;
				color: #333333;
				font-weight: bold;
			}

			text {
				font-size: 28upx;
				color: #fd595a;
				font-weight: bold;
			}
		}

		.info_box {
			display: flex;
			padding-top: 26upx;

			.name {
				font-size: 26upx;
				color: #999999;
				width: 180upx;
				flex-shrink: 0;
			}

			.text {
				display: flex;
				align-items: center;
				font-size: 26upx;
				color: #333333;

				.copy {
					margin-left: 20upx;
					height: 34upx;
					line-height: 30upx;
					padding: 0 4upx;
					border-radius: 8upx;
					border: solid 2upx $mainColor;
					font-size: 18upx;
					color: $mainColor;
				}
			}

			.imgs {
				display: flex;
				flex-wrap: wrap;

				image {
					width: 124upx;
					height: 124upx;
					margin-left: 20upx;

					&:nth-child(1) {
						margin-left: 0;
					}
				}
			}
		}

		.dashed_line {
			width: 100%;
			border-bottom: 2upx dashed #ccc;
			padding-top: 30upx;
		}

		.size_info_box {
			display: flex;
			justify-content: space-between;
			padding-top: 26upx;

			.name {
				font-size: 30upx;
				color: #333;
				flex-shrink: 0;
			}

			.text {
				display: flex;
				align-items: center;
				font-size: 30upx;
				color: #333333;
			}
		}

		.total {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-top: 30upx;

			.name {
				font-size: 24upx;
				color: #999999;
				flex-shrink: 0;
			}

			.price {
				font-size: 24upx;
				color: #fd595a;

				text {
					font-size: 48upx;
					font-weight: bold;
				}
			}
		}

		.receipt_info {
			view {
				padding-top: 30upx;
				font-size: 30upx;
				color: #333333;
				display: flex;

				text {
					margin-left: 90upx;
				}
			}
		}
	}

	.order_btn_box {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #ffffff;
		box-shadow: 0px -20upx 30upx 0upx rgba(0, 0, 0, 0.06);
		display: flex;
		justify-content: flex-end;
		padding: 0 30upx;

		button {
			width: 240upx;
			margin: 14upx 0;
			height: 70upx;
			line-height: 66upx;
			font-size: 28upx;
			border-radius: 4upx;
			border: solid 2upx $mainColor;
			color: $mainColor;

			&:nth-child(2) {
				margin-left: 20upx;
			}

			&.active {
				background-color: $mainColor;
				color: #FFF;
			}
		}
	}
</style>
