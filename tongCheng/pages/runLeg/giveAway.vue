<template>
	<view class="give_away_page">
		<view class="input_form_box">
			<view class="input_box">
				<view class="name">取件地</view>
				<view class="select_info" @click="onPageJump('/pages/my/addressList?isSelect=2')">
					<view class="value" v-if="takeAddressInfo.objId">
						<view>{{ takeAddressInfo.position }}{{takeAddressInfo.address}}</view>
						<text>{{takeAddressInfo.receiveName}}&nbsp;&nbsp;{{takeAddressInfo.phone}}</text>
					</view>
					<view class="select" v-else="">请选择</view>
				</view>
			</view>
			<view class="input_box line">
				<view class="name">送达地</view>
				<view class="select_info" @click="onPageJump('/pages/my/addressList?isSelect=3')">
					<view class="value" v-if="arrivalsAddressInfo.objId">
						<view>{{ arrivalsAddressInfo.position }}{{arrivalsAddressInfo.address}}</view>
						<text>{{arrivalsAddressInfo.receiveName}}&nbsp;&nbsp;{{arrivalsAddressInfo.phone}}</text>
					</view>
					<view class="select" v-else="">请选择</view>
				</view>
			</view>
			<date-popup @change="onDateChange">
				<view class="input_box line">
					<view class="name">取件时间</view>
					<view class="select_info">
						<view class="value" v-if="takeNow.value == 3100">立即配送</view>
						<view class="value" v-else="">{{takeNow.name}}&nbsp;{{takeNow.time}}</view>
					</view>
				</view>
			</date-popup>
			<weight-popup :type="1202" @change="onWeightChange">
				<view class="input_box line">
					<view class="name">重量/类型</view>
					<view class="select_info">
						<view class="value" v-if="weightTypeInfo.goodsType">{{weightTypeInfo.goodsType}}&nbsp;{{weightTypeInfo.goodsWeight}}公斤</view>
						<view class="select" v-else="">请选择</view>
					</view>
				</view>
			</weight-popup>
			<view class="input_box line">
				<view class="name">备注</view>
				<view class="input_info">
					<input type="text" placeholder="物品描述或取送要求（可不填）" v-model="remarks" maxlength="140" />
				</view>
			</view>
		</view>
		<view class="input_form_box">
			<tip-popup @change="tipChange">
				<view class="input_box">
					<view class="name">小费</view>
					<view class="select_info" @click="tipVisible = true;">
						<view class="value" v-if="priceTip">{{priceTip}}元</view>
						<view class="select" v-else="">加小费抢单更快哦</view>
					</view>
				</view>
			</tip-popup>
			<view class="input_box line">
				<view class="name">优惠卷</view>
				<view class="select_info" @click="onCoupon">
					<div class="value" v-if="checkedCouponData.objId">{{checkedCouponData.title}}</div>
					<div class="select" v-else>请选择优惠劵</div>
				</view>
			</view>
		</view>
		<view class="protocol">
			<view :class="{'active':read}" @click="read = !read"></view>我已阅读并同意<text @click="onProtocol">《跑腿取送服务协议》</text>
		</view>
		<view class="buy_box">
			<view class="price">
				￥
				<text>{{priceDetail.priceTotal}}</text>
			</view>
			<view class="but">
				<price-popup type="1301" :priceList="priceDetail">
					<button class="price_detail">查看明细 &gt;</button>
				</price-popup>
				<button class="submit" @click="onSubmit">提交订单</button>
			</view>
		</view>
		<z-login ref="login" @success="getDefaultAddress"></z-login>
	</view>
</template>
<script>
	import tipPopup from "@/components/module/tip_popup";
	import datePopup from "@/components/module/date_popup";
	import pricePopup from "@/components/module/price_popup";
	import weightPopup from "@/components/module/weight_popup";
	import zLogin from '@/components/module/login';
	import {
		mapState,
		mapMutations
	} from 'vuex';
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
			zLogin,
			tipPopup,
			datePopup,
			pricePopup,
			weightPopup
		},
		data() {
			return {
				takeAddressInfo: {},
				arrivalsAddressInfo: {},
				takeNow: {
					name: "立即取件",
					value: 3100,
					time: ""
				},
				weightVisible: true,
				weightTypeInfo: {},
				priceTip: "",
				priceDetail: {
					priceService: 0,
					priceHire: 0,
					priceOffer: 0,
					priceTip: 0,
					priceGoods: 0,
					deliveryTime: 0,
					priceAdd: 0,
					priceTotal: 0
				},
				remarks: "",
				read: true,

				goodsWeight: 1,
				typeList: [],
				goodsType: ""
			};
		},
		computed: {
			...mapState(['userInfo', 'checkedCouponData', 'checkedAddressData'])
		},
		//第一次加载
		onLoad(e) {
			if (this.userInfo.token) {
				this.getDefaultAddress();
			}
		},
		//页面显示
		onShow() {
			if (this.checkedAddressData.objId) {
				if (this.checkedAddressData.type == 2) {
					if (this.checkedAddressData.objId === this.arrivalsAddressInfo.objId) {
						uni.showToast({
							title: "取件地址重复",
							icon: "none"
						});
					}
					this.takeAddressInfo = this.checkedAddressData;
				} else if (this.checkedAddressData.type == 3) {
					if (this.checkedAddressData.objId === this.takeAddressInfo.objId) {
						uni.showToast({
							title: "送达地址重复",
							icon: "none"
						});
					}
					this.arrivalsAddressInfo = this.checkedAddressData;
				}
			}
			this.getCost();
		},
		//方法
		methods: {
			//跳转协议
			onProtocol(){
				uni.navigateTo({
					url: "/pages/user/protocol?type=1203"
				});
			},
			//页面跳转
			onPageJump(url) {
				this.judgeLogin('judge', () => {
					uni.navigateTo({
						url: url
					});
				});
			},
			//获取默认地址
			getDefaultAddress() {
				this.$http.get("api/mime/address/v1/get_default").then(data => {
					this.takeAddressInfo = data || {};
				});
			},
			//获取价格信息
			getCost() {
				var data = {};
				if (this.takeAddressInfo.objId) {
					data.takeLongitude = this.takeAddressInfo.longitude;
					data.takeLatitude = this.takeAddressInfo.latitude;
				} else {
					this.priceDetail.priceTotal = 0;
					return;
				}
				if (this.arrivalsAddressInfo.objId) {
					data.sendLongitude = this.arrivalsAddressInfo.longitude;
					data.sendLatitude = this.arrivalsAddressInfo.latitude;
				} else {
					this.priceDetail.priceTotal = 0;
					return;
				}
				if (this.weightTypeInfo.goodsWeight) {
					data.goodsWeight = this.weightTypeInfo.goodsWeight;
				} else {
					this.priceDetail.priceTotal = 0;
					return;
				}
				if (this.priceTip) {
					data.priceTip = this.priceTip;
				}
				if (this.checkedCouponData.objId) {
					data.offerId = this.checkedCouponData.objId;
				}
				this.$http.post("api/order/take_send/v1/price_total", data).then(data => {
					this.priceDetail = data;
				});
			},
			//小费选择结果
			tipChange(data) {
				this.priceTip = data;
				this.getCost();
			},
			//配送时间
			onDateChange(e) {
				this.takeNow = e;
			},
			//重量、类型
			onWeightChange(e) {
				this.weightTypeInfo = e;
				this.getCost();
			},
			//选择优惠卷
			onCoupon() {
				if (this.priceDetail.priceTotal > 0) {
					uni.navigateTo({
						url: "/pages/my/coupon?price=" + this.priceDetail.priceTotal + "&type=1301"
					})
				} else {
					uni.showToast({
						title: "请先选择取件地、送达地、重量类型!",
						icon: "none"
					});
				}
			},
			//提交
			onSubmit() {
				var data = {
					takeNow: this.takeNow.value
				};
				if (this.takeAddressInfo.objId) {
					data.takeAddressId = this.takeAddressInfo.objId;
				} else {
					uni.showToast({
						title: "请选择取件地址",
						icon: "none"
					});
					return;
				}
				if (this.arrivalsAddressInfo.objId) {
					data.sendAddressId = this.arrivalsAddressInfo.objId;
				} else {
					uni.showToast({
						title: "请选择送达地址",
						icon: "none"
					});
					return;
				}
				if (this.takeNow.value !== 3100 && this.takeNow.time) {
					data.takeTime = this.takeNow.time;
				}
				if (this.weightTypeInfo.goodsWeight) {
					data.goodsWeight = this.weightTypeInfo.goodsWeight;
					data.goodsType = this.weightTypeInfo.goodsType;
				} else {
					uni.showToast({
						title: "请选择类型/重量",
						icon: "none"
					});
					return;
				}
				if (this.remarks) {
					data.remarks = this.remarks;
				}
				if (this.priceTip) {
					data.priceTip = this.priceTip;
				}
				if (this.checkedCouponData.objId) {
					data.offerId = this.checkedCouponData.objId;
				}
				if (!this.read) {
					uni.showToast({
						title: "请阅读并同意跑腿协议!",
						icon: "none"
					});
					return;
				}
				this.$http.post("api/order/take_send/v1/add", data).then(res => {
					//支付
					// #ifdef MP-WEIXIN
					setWxPay(res.orderNo, data => {
						let content = "支付成功！"
						if (!data.success) {
							content = "支付失败！"
						}
						uni.showModal({
							title: "支付提示",
							content: content,
							showCancel: false,
							success: (res) => {
								uni.switchTab({
									url: "/pages/my/my"
								});
							}
						})
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

	.give_away_page {
		padding-bottom: 150upx;
	}

	.input_box .name,
	.input_box .select_info,
	.input_box .input_info {
		padding: 40upx 0;
	}

	.input_form_box {
		border-radius: 40upx;
		margin-bottom: 20upx;
		padding-top: 20upx;

		.select_info .value {
			text {
				display: block;
				font-size: 28upx;
				color: #999999;
				margin-top: 8upx;
			}
		}
	}

	.buy_box {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100upx;
		background-color: #ffffff;
		display: flex;
		justify-content: space-between;
		align-items: center;

		>.price {
			font-size: 30upx;
			color: #fd595a;
			font-weight: bold;
			padding-left: 30upx;

			text {
				font-size: 48upx;
				color: #fd595a;
			}
		}

		.but {
			display: flex;
			align-items: center;

			.price_detail {
				background-color: transparent;
				padding: 0 30upx;
				font-size: 24upx;
				color: #999999;
			}

			.submit {
				width: 240upx;
				height: 100upx;
				background-image: linear-gradient(90deg,
					#ea552d 0%,
					#f19837 100%),
					linear-gradient(#fd595a,
					#fd595a);
				font-size: 36upx;
				color: #ffffff;
				border-radius: 0;
			}
		}
	}
</style>
