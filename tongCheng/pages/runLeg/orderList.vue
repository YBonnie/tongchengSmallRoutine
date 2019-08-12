<template>
	<view>
		<!-- 菜单 -->
		<view class="menu_box">
			<view :class="{ active: orderStatus == '' }" @click="onOrderStatus('')">全部</view>
			<view :class="{ active: orderStatus == 1101 }" @click="onOrderStatus(1101)">待接单</view>
			<view :class="{ active: orderStatus == 1202 }" @click="onOrderStatus(1202)">待补费</view>
			<view :class="{ active: orderStatus == 1200 }" @click="onOrderStatus(1200)">配送中</view>
			<view :class="{ active: orderStatus == 1400 }" @click="onOrderStatus(1400)">已完成</view>
			<!-- <view :class="{ active: orderStatus == 1500 }" @click="onOrderStatus(1500)">售后</view> -->
		</view>
		<view class="support"></view>
		<view class="order_list_box">
			<view class="order_list" :class="{'active':item.orderStatus == 1202}" v-for="(item,index) of orderList" :key="index" @click="onJumpDetails(item)">
				<view class="order_title">
					<view class="order_type">
						<image v-if="item.orderType == 1101" src="../../static/icon/runLeg/order_ic_buy.png" mode="aspectFit"></image>
						<image v-if="item.orderType == 1201" src="../../static/icon/runLeg/order_ic_help.png" mode="aspectFit"></image>
						<image v-if="item.orderType == 1301" src="../../static/icon/runLeg/order_ic_pickup.png" mode="aspectFit"></image>
						{{item.orderTypeStr}}
						<text v-if="item.orderStatus == 1202">下单时间：{{item.createTime}}</text>
					</view>
					<view class="state" :class="{'red':item.orderStatus == 1101 || item.orderStatus == 1202,'blue':item.orderStatus == 1200}">{{item.orderStatusStr}}</view>
				</view>
				<view class="order_content">
					<view class="content">{{item.goodsDesc}}</view>
					<view class="price">￥{{item.payPrice}}</view>
				</view>
				<view class="order_btn">
					<view class="time">下单时间：{{item.createTime}}</view>
					<view class="btn_box">
						<button class="active" v-if="item.orderStatus == 1401" @click="onAssess(index)">去评价</button>
						<button class="active" v-if="item.orderStatus == 1202" @click="openMakeUpPopup(item)">订单补费</button>
						<button class="active" v-if="item.orderStatus == 1101" @click="openTipPopup(index)">补加小费</button>
						<button class="active" v-if="item.orderStatus == 1001" @click="onPay(index)">去支付</button>
						<button v-if="item.orderStatus == 1001 || item.orderStatus == 1101 || item.orderStatus == 1201 || item.orderStatus == 1202" @click="onCancel(index)">取消</button>
						<button v-if="item.orderStatus == 1204 || item.orderStatus == 1301" @click="onConfirm(index)">确认完成</button>
						<button v-if="item.orderStatus >= 1201" @click="onCall(item.deliveryPhone)">联系跑腿</button>
						<button v-if="item.orderStatus == 1501 || item.orderStatus == 1503">联系客服</button>
						<button v-if="item.orderStatus == 1002 || item.orderStatus == 1400 || item.orderStatus == 1401 || item.orderStatus == 1402 || item.orderStatus == 1502 || item.orderStatus == 1503" @click="onDelete(index)">删除</button>
					</view>
				</view>
			</view>
		</view>
		<load-more text="暂无订单~" :height="40"></load-more>
		<tip-popup title="补加小费" ref="tipPopup" @change="tipChange"></tip-popup>
		<make-up-popup ref="makeUpPopup"></make-up-popup>
		<score-popup ref="scorePopup" @change="assessChange"></score-popup>
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
				orderStatus: '',
				tipPopupIndex:"",
				// 第一页
				pageNo: 1,
				// 总页数默认第一页
				pages: 1,
				orderList: []
			};
		},
		//第一次加载
		onLoad(e) {
			this.loadData();
		},
		//页面显示
		onShow() {},
		//方法
		methods: {
			// 菜单筛选
			onOrderStatus(value) {
				this.orderStatus = value;
				this.pageNo = 1;
				this.pages = 1;
				this.loadData();
			},
			//跳转页面
			pageJump(url) {
				uni.navigateTo({
					url: url
				});
			},
			loadData() {
				if (this.pageNo <= this.pages) {
					var httpData = {
						pageNo: this.pageNo,
						pageSize: 15
					};
					if (this.orderStatus) {
						httpData.orderStatus = this.orderStatus;
					}
					this.$http
						.post('api/mime/v1/order_list', httpData, {
							load: false
						})
						.then(res => {
							uni.stopPullDownRefresh();
							this.pages = res.pages;
							if (this.pageNo == 1) {
								this.orderList = res.data;
							} else {
								this.orderList = this.orderList.concat(res.data);
							}
							if (res.data.length > 0) {
								this.pageNo = this.pageNo + 1;
							}
						});
				}
			},
			//去评价
			onAssess(index){
				this.$refs.scorePopup.onPopupShow(this.orderList[index].orderNo);
			},
			//评论成功回调
			assessChange(e){
				this.pageNo = 1;
				this.pages = 1;
				this.loadData();
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
									orderNo: this.orderList[index].orderNo,
									operateStatus: 1002
								})
								.then(data => {
									uni.showToast({
										title: '取消订单成功!',
										icon: 'none'
									});
									this.orderList[index].orderStatus = 1002;
									this.orderList[index].orderStatusStr = '已取消';
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
									orderNo: this.orderList[index].orderNo,
									operateStatus: 1000
								})
								.then(data => {
									uni.showToast({
										title: '删除订单成功!',
										icon: 'none'
									});
									this.orderList.splice(index,1);
								});
						}
					}
				});
			},
			// 去付款
			onPay(index) {
				let item = this.orderList[index];
				//支付
				// #ifdef MP-WEIXIN
				setWxPay(item.orderNo, res => {
					if (res.success) {
						this.pageNo = 1;
						this.pages = 1;
						this.loadData();
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
						url: '/pages/home/weChatPay?orderNo=' + item.orderNo + '&price=' + item.payPrice + '&title='+item.orderTypeStr+"订单"
					});
				} else {
					appMutual('setJumpPay', {
						orderNo: item.orderNo,
						title: item.orderTypeStr+"订单",
						price: item.payPrice
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
			//打开补加小费弹窗
			openTipPopup(index){
				this.tipPopupIndex = index;
				this.$refs.tipPopup.onPopupShow();
			},
			//补加小费
			tipChange(e){
				if(e == 0){
					uni.showToast({
						title:"金额不能为空",
						icon:"none"
					});
					return;
				}
				this.$http
					.get('api/order/v1/add_price_tip', {
						orderNo: this.orderList[this.tipPopupIndex].orderNo,
						payPrice: e
					})
					.then(data => {
						//支付
						// #ifdef MP-WEIXIN
						setWxPay(res.orderNo, data => {
							if (res.success) {
								this.pageNo = 1;
								this.pages = 1;
								this.loadData();
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
			//订单补费
			openMakeUpPopup(item){
				this.$refs.makeUpPopup.onPopupShow(item.orderNo);
			},
			//确认完成
			onConfirm(index){
				uni.showModal({
					title: '提示',
					content: '确定完成此订单吗？',
					success: res => {
						if (res.confirm) {
							this.$http
								.get('api/order/v2/cancel_or_confirm', {
									orderNo: this.orderList[index].orderNo,
									operateStatus: 1301
								})
								.then(data => {
									uni.showToast({
										title: '订单已完成!'
									});
									this.orderList[index].orderStatus = 1401;
									this.orderList[index].orderStatusStr = '已完成';
								});
						}
					}
				});
			},
			//跳转订单详情
			onJumpDetails(item){
				let url;
				if(item.orderType == 1101){
					url = "/pages/runLeg/helpBuyOrderDetails?orderNo="+item.orderNo;
				}else if(item.orderType == 1201){
					url = "/pages/runLeg/helpOrderDetails?orderNo="+item.orderNo;
				}else if(item.orderType == 1301){
					url = "/pages/runLeg/giveAwayOrderDetails?orderNo="+item.orderNo;
				}
				uni.navigateTo({
					url:url
				})
			}
		},
		//页面隐藏
		onHide() {},
		//页面卸载
		onUnload() {},
		//页面下来刷新
		onPullDownRefresh() {
			this.pageNo = 1;
			this.pages = 1;
			this.loadData();
		},
		//页面上拉触底
		onReachBottom() {
			this.loadData();
		},
		//用户点击分享
		onShareAppMessage(e) {
			return this.$base.share();
		}
	};
</script>
<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.support {
		height: 108upx;
	}

	.menu_box {
		height: 88upx;
		background-color: #ffffff;
		padding: 31upx 25upx 10upx;
		border-bottom: 1upx solid #e5e5e5;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 3;
		>view {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			font-size: 30upx;
			color: #333333;

			&::after {
				content: '';
				width: 40upx;
				height: 6upx;
				margin-top: 18upx;
			}

			&.active {
				color: #f19837;

				&::after {
					content: '';
					width: 40upx;
					height: 6upx;
					background-color: #f19837;
					border-radius: 3upx;
					margin-top: 18upx;
				}
			}
		}
	}

	.order_list_box {
		padding: 0 30upx 30upx 30upx;

		.order_list {
			background-color: #FFF;
			border-radius: 10upx;
			margin-bottom: 20upx;
			// &.active {
			// 	background-image: url("../../static/icon/runLeg/order_img_bg.png");
			// 	background-position: center center;
			// 	background-repeat: no-repeat;
			// 	background-size: 100% 100%;
			// 	.order_title .order_type {
			// 		color: #FFF;
			// 	}
			// 	.order_content .content {
			// 		color: #FFF;
			// 	}
			// }
			.order_title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 30upx;

				.order_type {
					display: flex;
					align-items: center;
					font-size: 26upx;
					color: #333333;

					image {
						width: 38upx;
						height: 32upx;
						margin-right: 10upx;
					}

					text {
						font-size: 20upx;
						color: #999999;
						margin-left: 20upx;
					}
				}

				.state {
					font-size: 30upx;
					color: #666666;

					.red {
						color: #fd595a;
					}

					.blue {
						color: #666666;
					}
				}
			}

			.order_content {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 40upx 30upx;
				border-top: 1upx solid #efefef;

				.content {
					font-size: 30upx;
					color: #333333;
				}

				.price {
					font-size: 36upx;
					color: #fd595a;
				}
			}

			.order_btn {
				padding: 0upx 30upx 30upx 30upx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.time {
					font-size: 20upx;
					color: #999999;
				}

				.btn_box {
					display: flex;
					align-items: center;

					button {
						width: 140upx;
						height: 50upx;
						line-height: 46upx;
						border-radius: 10upx;
						border: solid 2upx $mainColor;
						font-size: 26upx;
						color: $mainColor;
						margin-left: 20upx;
						background-color: transparent;
						&.active {
							border: 0;
							background-image: linear-gradient(90deg, #ea552d 0%, #f19837 100%), linear-gradient(#ffffff, #ffffff);
							color: #ffffff;
						}
					}
				}
			}
		}
	}
</style>
