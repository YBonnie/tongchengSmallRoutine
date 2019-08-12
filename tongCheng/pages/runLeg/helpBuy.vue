<template>
	<view class="give_away_page">
		<view class="input_form_box">
			<view class="input_box paddingTop">
				<view class="textarea_info">
					<textarea placeholder="输入想买的商品，如：牛肉面 1份" v-model="goodsDesc"></textarea>
				</view>
			</view>
			<view class="input_box">
				<view class="name">上传参考图片（可不填）</view>
				<view class="upload_info">
					<view class="upload_img" v-for="(item, index) of goodsImg" :key="index">
						<image :src="item" mode="aspectFill"></image>
						<text class="delete" @click="onDeleteImg(index)"></text>
					</view>
					<view class="upload_img upload" @click="onImgsUpload" v-if="goodsImg.length < 3"></view>
				</view>
			</view>
			<view class="input_box line">
				<view class="name estimate">
					<image src="../../static/icon/runLeg/home_ic_pay.png" mode="aspectFit"></image>
					预估费
					<image src="../../static/icon/runLeg/home_ic_sigh.png" mode="aspectFit"></image>
				</view>
				<view class="input_info">
					<input type="number" placeholder="商品预估费用" v-model="priceGoods" @input="priceGoodsChange" />
				</view>
			</view>
		</view>
		<view class="input_form_box">
			<view class="input_box buy">
				<view class="name">购买</view>
				<view class="tab_box">
					<view :class="{'active':nearBuy}" @click="nearBuy = true">就近购买</view>
					<view :class="{'active':!nearBuy}" @click="nearBuy = false">指定地址</view>
				</view>
				<view class="select_info" v-if="!nearBuy" @click="onAreaSelect">
					<view class="value" v-if="buyAddressInfo.name">{{buyAddressInfo.name}}</view>
					<view class="select" v-else="">请选择</view>
				</view>
				<view class="input_info" v-if="!nearBuy">
					<input type="text" placeholder="请输入详细地址" v-model="buyAddressInfo.address" />
				</view>
			</view>
			<view class="input_box line">
				<view class="name">收货地址</view>
				<view class="select_info" @click="onPageJump('/pages/my/addressList?isSelect=1')">
					<view class="value" v-if="checkedAddressData.objId">
						<view>{{ checkedAddressData.position }}{{ checkedAddressData.address }}</view>
						<text>{{ checkedAddressData.receiveName }} {{ checkedAddressData.phone }}</text>
					</view>
					<view class="select" v-else="">请选择</view>
				</view>
			</view>
			<date-popup @change="onDateChange">
				<view class="input_box line">
					<view class="name">配送时间</view>
					<view class="select_info">
						<view class="value" v-if="buyNow.value == 3100">立即配送</view>
						<view class="value" v-else="">{{buyNow.name}}&nbsp;{{buyNow.time}}</view>
					</view>
				</view>
			</date-popup>
		</view>
		<view class="input_form_box">
			<view class="input_box">
				<view class="name">是否需要小票</view>
				<view class="switch" :class="{'active':receipt}" @click="receipt = !receipt"></view>
			</view>
			<tip-popup @change="tipChange">
				<view class="input_box line">
					<view class="name">小费</view>
					<view class="select_info">
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
			<view :class="{'active':read}" @click="read = !read"></view>我已阅读并同意<text @click="onProtocol('/pages/')">《跑腿帮我买服务协议》</text>
		</view>
		<view class="buy_box">
			<view class="price">
				￥
				<text>{{priceDetail.priceTotal}}</text>
			</view>
			<view class="but">
				<price-popup type="1401" :priceList="priceDetail">
					<button class="price_detail">查看明细 &gt;</button>
				</price-popup>
				<button class="submit" @click="onSubmit">提交订单</button>
			</view>
		</view>
		<z-login ref="login" @success="pageData"></z-login>
	</view>
</template>

<script>
	import tipPopup from "@/components/module/tip_popup";
	import datePopup from "@/components/module/date_popup";
	import pricePopup from "@/components/module/price_popup";
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
			pricePopup
		},
		data() {
			return {
				goodsDesc: "",
				goodsImg: [],
				priceGoods: "",
				nearBuy: true,
				buyAddressInfo: {},
				priceTip: "",
				receipt: false,
				offerId: {},
				read: true,
				buyNow: {
					name: "立即配送",
					value: 3100,
					time: ""
				},
				priceDetail: {
					priceService: 0,
					priceHire: 0,
					priceOffer: 0,
					priceTip: 0,
					priceGoods: 0,
					deliveryTime: 0,
					priceAdd: 0,
					priceTotal: 0
				}
			};
		},
		computed: {
			...mapState(['userInfo', 'checkedCouponData', 'selectAddress', 'checkedAddressData'])
		},
		//第一次加载
		onLoad(e) {
			// #ifdef MP-WEIXIN
			uni.authorize({
				scope: 'scope.userLocation'
			});
			// #endif
			if (this.userInfo.token) {
				this.pageData();
			}
		},
		//页面显示
		onShow() {
			if (this.selectAddress.name) {
				this.buyAddressInfo = this.selectAddress;
			}
			this.getCost();
		},
		//方法
		methods: {
			...mapMutations(['setCheckedAddressData']),
			//页面数据
			pageData() {
				this.$http.get('api/mime/address/v1/get_default').then(res => {
					this.setCheckedAddressData(res || {});
				});
			},
			//小费选择结果
			tipChange(data) {
				this.priceTip = data;
				this.getCost();
			},
			//上传商品照
			onImgsUpload() {
				var count = 3 - this.goodsImg.length;
				this.$http.qn({
					count: count
				}).then(res => {
					this.goodsImg = this.goodsImg.concat(res);
				});
			},
			//删除商品照
			onDeleteImg(index) {
				this.goodsImg.splice(index, 1);
			},
			//页面跳转
			onPageJump(url) {
				this.judgeLogin('judge', () => {
					uni.navigateTo({
						url: url
					});
				});
			},
			//跳转协议
			onProtocol(){
				uni.navigateTo({
					url: "/pages/user/protocol?type=1201"
				});
			},
			//优惠卷
			onCoupon() {
				if (this.priceDetail.priceTotal > 0) {
					uni.navigateTo({
						url: "/pages/my/coupon?price=" + this.priceDetail.priceService + "&type=1401"
					})
				} else {
					if (!this.goodsDesc) {
						uni.showToast({
							title: "请输入商品!",
							icon: "none"
						});
					} else if (!this.priceGoods) {
						uni.showToast({
							title: "请输入商品预估费用!",
							icon: "none"
						});
					} else {
						uni.showToast({
							title: "请先选择购买地址、收货地址",
							icon: "none"
						});
					}
				}
			},
			//预估费用输入
			priceGoodsChange() {
				this.getCost();
			},
			//位置选择
			onAreaSelect() {
				// #ifdef MP-WEIXIN
				uni.getSetting({
					success: res => {
						// 定位权限是否为打开
						if (res.authSetting['scope.userLocation']) {

							uni.chooseLocation({
								success: res => {
									this.buyAddressInfo = res;
								}
							});
						} else {
							uni.showModal({
								title: '提示',
								content: '请先在设置页面打开“位置信息”使用权限',
								confirmText: '去设置',
								cancelText: '再逛会',
								success: res => {
									if (res.confirm) {
										uni.openSetting();
									}
								}
							});
						}
					}
				});
				// #endif
				// #ifdef H5
				uni.navigateTo({
					url: "/pages/my/addressSelect"
				});
				// #endif
			},
			//配送时间
			onDateChange(e) {
				this.buyNow = e;
			},
			//获取价格信息
			getCost() {
				var data = {
					nearBuy: this.nearBuy
				};
				if (this.priceGoods) {
					data.priceGoods = this.priceGoods;
				} else {
					this.priceDetail.priceTotal = 0;
					return;
				}
				if (!this.nearBuy) {
					if (this.buyAddressInfo.areaId) {
						data.buyLongitude = this.buyAddressInfo.longitude;
						data.buyLatitude = this.buyAddressInfo.latitude;
					} else {
						this.priceDetail.priceTotal = 0;
						return;
					}
				}
				if (this.checkedAddressData.objId) {
					data.addressId = this.checkedAddressData.objId;
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
				this.$http.post("api/order/buy/v1/price_total", data).then(data => {
					this.priceDetail = data;
				});
			},
			//提交
			onSubmit() {
				var data = {
					nearBuy: this.nearBuy,
					buyNow: this.buyNow.value,
					receipt: this.receipt
				};
				if (this.goodsDesc) {
					data.goodsDesc = this.goodsDesc;
				} else {
					uni.showToast({
						title: "请填写商品描述",
						icon: "none"
					});
					return;
				}
				if (this.goodsImg.length > 0) {
					data.goodsImg = this.goodsImg;
				}
				if (this.priceGoods) {
					data.priceGoods = this.priceGoods;
				} else {
					uni.showToast({
						title: "请输入商品预估费用",
						icon: "none"
					});
					return;
				}
				if (!this.nearBuy) {
					if (this.buyAddressInfo.areaId) {
						data.buyLongitude = this.buyAddressInfo.longitude;
						data.buyLatitude = this.buyAddressInfo.latitude;
						data.buyAreaId = this.buyAddressInfo.areaId;
						if (this.buyAddressInfo.address) {
							data.buyAddress = this.buyAddressInfo.address;
						} else {
							uni.showToast({
								title: "请输入详细购买地址",
								icon: "none"
							});
							return;
						}
					} else {
						uni.showToast({
							title: "请选择购买地址",
							icon: "none"
						});
						return;
					}
				}
				if (this.checkedAddressData.objId) {
					data.addressReceiveId = this.checkedAddressData.objId;
				} else {
					uni.showToast({
						title: "请选择收货地址",
						icon: "none"
					});
					return;
				}
				if (!this.read) {
					uni.showToast({
						title: "请阅读并同意跑腿协议!",
						icon: "none"
					});
					return;
				}
				if (this.buyNow.value !== 3100 && this.buyNow.time) {
					data.deliveryTime = this.buyNow.time;
				}
				if (this.priceTip) {
					data.priceTip = this.priceTip;
				}
				if (this.checkedCouponData.objId) {
					data.offerId = this.checkedCouponData.objId;
				}
				this.$http.post("api/order/buy/v1/add", data).then(res => {
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

	.input_form_box {
		border-radius: 40upx;
		margin-bottom: 20upx;
		padding-top: 20upx;

		.input_box .name,
		.input_box .select_info,
		.input_box .input_info {
			padding: 40upx 0;
		}

		.paddingTop {
			padding-top: 30upx;
		}

		.estimate {
			display: flex;
			align-items: center;

			image:nth-child(1) {
				width: 38upx;
				height: 40upx;
				margin-right: 20upx;
			}

			image:nth-child(2) {
				width: 32upx;
				height: 31upx;
				margin-left: 10upx;
			}
		}

		.buy {
			.input_info {
				width: 100%;
				flex: none;
				padding-top: 0;
			}

			.tab_box {
				padding: 30upx 0 30upx 0upx;
				display: flex;

				view {
					width: 130upx;
					height: 42upx;
					border-radius: 10upx;
					border: solid 2upx #999;
					background-color: transparent;
					text-align: center;
					font-size: 26upx;
					color: #999;
					margin-left: 15upx;

					&.active {
						border: solid 2upx $mainColor;
						color: $mainColor;
					}
				}
			}
		}

		.input_box .upload_info .upload_img {
			height: 123upx;
			width: 123upx;
		}

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
