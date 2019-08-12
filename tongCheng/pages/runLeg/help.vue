<template>
	<view class="give_away_page">
		<view class="input_form_box">
			<view class="input_box paddingTop">
				<view class="textarea_info">
					<textarea placeholder="输入帮忙的描述，如：帮忙排队" v-model="helpDesc" maxlength="140"></textarea>
				</view>
			</view>
		</view>
		<view class="input_form_box">
			<view class="input_box buy">
				<view class="name">帮忙地址</view>
				<view class="select_info" @click="onPageJump('/pages/my/addressList?isSelect=1')">
					<view class="value" v-if="checkedAddressData.objId">
						<view>{{ checkedAddressData.position }}{{ checkedAddressData.address }}</view>
						<text>{{ checkedAddressData.receiveName }}</text>
					</view>
					<view class="select" v-else="">请选择</view>
				</view>
			</view>
			<view class="input_box line">
				<view class="name">开始时间</view>
				<view class="select_info" @click="openDate('start')">
					<view class="value" v-if="helpStartTime">{{helpStartTime}}</view>
					<view class="select" v-else="">请选择(选填)</view>
				</view>
			</view>
			<view class="input_box line">
				<view class="name">结束时间</view>
				<view class="select_info" @click="openDate('end')">
					<view class="value" v-if="helpEndTime">{{helpEndTime}}</view>
					<view class="select" v-else="">请选择(选填)</view>
				</view>
			</view>
			<picker mode="multiSelector" @change="estimateDateChange" :value="estimateDateIndex" :range="estimateDateList"
			 range-key="name">
				<view class="input_box line">
					<view class="name">预估时长</view>
					<view class="select_info">
						<view class="value" v-if="forecastInfo.dateText">{{forecastInfo.dateText}}</view>
						<view class="select" v-else="">请选择</view>
					</view>
				</view>
			</picker>
			<view class="input_box line">
				<view class="name">联系电话</view>
				<view class="input_info">
					<input type="number" placeholder="请输入" v-model="phone" />
				</view>
			</view>
		</view>
		<view class="input_form_box">
			<view class="input_box">
				<view class="name">雇佣费用</view>
				<view class="input_info">
					<input type="number" placeholder="请输入" v-model="priceHire" @input="priceHireChange" @blur="getCost" />
				</view>
				<view class="prompt">费用参考：{{priceDetail.priceService}}元</view>
			</view>
			<view class="input_box line">
				<view class="name">优惠卷</view>
				<view class="select_info" @click="onCoupon">
					<div class="value" v-if="checkedCouponData.objId">{{checkedCouponData.title}}</div>
					<div class="select" v-else>请选择优惠劵</div>
				</view>
			</view>
		</view>
		<view class="protocol">
			<view :class="{'active':read}" @click="read = !read"></view>我已阅读并同意<text @click="onProtocol">《跑腿代帮忙服务协议》</text>
		</view>
		<view class="buy_box">
			<view class="price">
				￥
				<text>{{priceDetail.priceTotal}}</text>
			</view>
			<view class="but">
				<price-popup type="1201" :priceList="priceDetail">
					<button class="price_detail">查看明细 &gt;</button>
				</price-popup>
				<button class="submit" @click="onSubmit">提交订单</button>
			</view>
		</view>
		<mx-date-picker :show="datePicker" color="#FF5723" type="datetime" format="yyyy-mm-dd hh:ii" :value="dateValue"
		 @confirm="onDateConfirm" @cancel="closeDate" />
		 <z-login ref="login" @success="pageData"></z-login>
	</view>
</template>

<script>
	import tipPopup from "@/components/module/tip_popup";
	import datePopup from "@/components/module/date_popup";
	import pricePopup from "@/components/module/price_popup";
	import mxDatePicker from "@/components/common/mx-datepicker/mx-datepicker";
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
			mxDatePicker
		},
		data() {
			return {
				helpDesc: "",
				helpAddressInfo: {},
				datePicker: false,
				dateValue: "",
				datePickerType: "start",
				helpStartTime: "",
				helpEndTime: "",
				phone: "",
				priceHire: null,
				priceTip: "",

				forecastInfo: {},
				priceDetail: {
					priceAdd: 0,
					priceService: 0,
					priceHire: 0,
					priceOffer: 0,
					priceTip: 0,
					priceGoods: 0,
					deliveryTime: 0,
					priceTotal: 0
				},
				read: true,
				estimateDateIndex: [0, 0, 0],
				estimateDateList: []
			};
		},
		computed: {
			...mapState(['userInfo', 'checkedCouponData', 'checkedAddressData'])
		},
		//第一次加载
		onLoad(e) {
			let dateList = new Array();
			let hourList = new Array();
			let minuteList = new Array();
			for (let d = 0; d < 7; d++) {
				dateList.push({
					value: d,
					name: d + "天"
				});
			}
			for (let h = 0; h < 24; h++) {
				hourList.push({
					value: h,
					name: h + "小时"
				});
			}
			for (let m = 0; m < 60; m = m + 5) {
				minuteList.push({
					value: m,
					name: m + "分钟"
				});
			}
			this.estimateDateList = [dateList, hourList, minuteList];
			if (this.userInfo.token) {
				this.pageData();
			}
		},
		//页面显示
		onShow() {
			if(this.checkedAddressData.objId){
				this.phone = this.checkedAddressData.phone;
			}
			this.getCost();
		},
		//方法
		methods: {
			...mapMutations(['setCheckedAddressData']),
			//跳转协议
			onProtocol(){
				uni.navigateTo({
					url: "/pages/user/protocol?type=1204"
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
			//页面数据
			pageData() {
				this.$http.get('api/mime/address/v1/get_default').then(res => {
					this.setCheckedAddressData(res || {});
					if(res){
						this.phone = res.phone;
					}
				});
			},
			//小费选择结果
			tipChange(data) {
				this.priceTip = data;
				this.getCost();
			},
			//打开时间选择弹窗
			openDate(type) {
				this.datePickerType = type;
				if (type == "start") {
					this.dateValue = this.helpStartTime;
				} else {
					this.dateValue = this.helpEndTime;
				}
				this.datePicker = true;
			},
			//关闭时间选择弹窗
			closeDate() {
				this.datePicker = false;
			},
			//开始帮忙时间
			onDateConfirm(e) {
				var currentTime = new Date().getTime() - 60000;
				var selectGetTime = e.date.getTime();
				if (this.datePickerType == "start") {
					let endTime = "";
					if (this.helpEndTime) {
						endTime = new Date((this.helpEndTime + ":00").replace("-", "/")).getTime();
					}
					if (selectGetTime < currentTime) {
						uni.showToast({
							title: "开始时间不能小于当前时间!",
							icon: "none"
						});
					} else if (endTime && endTime < selectGetTime) {
						uni.showToast({
							title: "开始时间不能大于结束时间!",
							icon: "none"
						});
					} else {
						this.helpStartTime = e.value;
						this.datePicker = false;
					}
				} else {
					var startTime = "";
					if (this.helpStartTime) {
						startTime = new Date((this.helpStartTime + ":00").replace("-", "/")).getTime();
					}
					if (startTime && startTime > selectGetTime) {
						uni.showToast({
							title: "结束时间不能小于开始时间!",
							icon: "none"
						});
					} else if (selectGetTime < currentTime) {
						uni.showToast({
							title: "结束时间不能小于当前时间!",
							icon: "none"
						});
					} else {
						this.helpEndTime = e.value;
						this.datePicker = false;
					}
				}
			},
			//预估时间
			estimateDateChange(e) {
				var value = e.detail.value;
				if (value[0] == 0 && value[1] == 0 && value[2] == 0) {
					uni.showToast({
						title: "预估时长不能小于5分钟",
						icon: "none"
					});
					return;
				}
				var dateText = "";
				if (value[0] > 0) {
					dateText += this.estimateDateList[0][value[0]].name;
				}
				if (value[1] > 0) {
					dateText += this.estimateDateList[1][value[1]].name;
				}
				if (value[2] > 0) {
					dateText += this.estimateDateList[2][value[2]].name;
				}
				this.forecastInfo = {
					forecastDay: this.estimateDateList[0][value[0]].value,
					forecastHour: this.estimateDateList[1][value[1]].value,
					forecastMinute: this.estimateDateList[2][value[2]].value,
					dateText: dateText
				};
				this.getCost();
			},
			//预估时间输入
			priceHireChange(e) {
				if (this.forecastInfo.dateText) {
					if (e.detail.value && parseInt(e.detail.value) > 10000) {
						this.priceHire = 10000;
					}
					this.priceDetail.priceTotal = e.detail.value;
				} else {
					uni.showToast({
						title: "请先填写预估时间",
						icon: "none"
					});
					return;
				}
			},
			//获取价格信息
			getCost() {
				var data = {};
				if (this.forecastInfo.dateText) {
					data.forecastDay = this.forecastInfo.forecastDay;
					data.forecastHour = this.forecastInfo.forecastHour;
					data.forecastMinute = this.forecastInfo.forecastMinute;
				} else {
					this.priceDetail.priceTotal = 0;
					return;
				}
				if (this.priceHire) {
					data.priceHire = this.priceHire;
				}
				if (this.checkedCouponData.objId) {
					data.offerId = this.checkedCouponData.objId;
				}
				this.$http.post("api/order/help/v1/price_total", data).then(
					data => {
						this.priceDetail = data;
					}
				);
			},
			//选择优惠卷
			onCoupon() {
				if (this.priceHire >= 0) {
					uni.navigateTo({
						url: "/pages/my/coupon?price=" + this.priceDetail.priceTotal + "&type=1201"
					})
				} else {
					uni.showToast({
						title: "请先填写雇佣费用",
						icon: "none"
					});
				}
			},
			//提交
			onSubmit() {
				var data = {};
				if (this.helpDesc) {
					data.helpDesc = this.helpDesc;
				} else {
					uni.showToast({
						title: "请输入帮忙描述",
						icon: "none"
					});
					return;
				}
				if (this.checkedAddressData.objId) {
					data.helpAddressId = this.checkedAddressData.objId;
				} else {
					uni.showToast({
						title: "请选择帮忙地址",
						icon: "none"
					});
					return;
				}
				if (this.helpStartTime) {
					data.helpStartTime = this.helpStartTime;
				}
				if (this.helpEndTime) {
					data.helpEndTime = this.helpEndTime;
				}
				if (this.forecastInfo.dateText) {
					data.forecastDay = this.forecastInfo.forecastDay;
					data.forecastHour = this.forecastInfo.forecastHour;
					data.forecastMinute = this.forecastInfo.forecastMinute;
				} else {
					uni.showToast({
						title: "请选择帮忙时长",
						icon: "none"
					});
					return;
				}
				if (this.phone == "") {
					uni.showToast({
						title: "请输入联系电话",
						icon: "none"
					});
					return;
				}
				if (/^1\d{10}$/.test(this.phone)) {
					data.phone = this.phone;
				} else {
					uni.showToast({
						title: "手机号格式不正确",
						icon: "none"
					});
					return;
				}
				if (this.priceHire) {
					data.priceHire = this.priceHire;
				} else {
					uni.showToast({
						title: "请输入雇佣费用",
						icon: "none"
					});
					return;
				}
				if (this.checkedCouponData.objId) {
					data.offerId = this.checkedCouponData.objId;
				}
				if (!this.read) {
					uni.showToast({
						title: "请阅读并同意跑腿协议",
						icon: "none"
					});
					return;
				}
				this.$http.post("api/order/help/v1/add", data).then(res => {
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

		.buy {
			.input_info {
				width: 100%;
				flex: none;
				padding-top: 0;
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
