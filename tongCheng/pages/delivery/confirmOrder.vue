<template>
	<view>
		<view class="address_info_box" @click="onPageJump('/pages/my/addressList?isSelect=1')">
			<view class="address_info">
				<view class="name" v-if="checkedAddressData.objId">
					<text>{{ checkedAddressData.receiveName }}</text>
					{{ checkedAddressData.phone }}
				</view>
				<text v-if="checkedAddressData.objId" class="info">收货地址：{{ checkedAddressData.areaName }}{{ checkedAddressData.position }}{{ checkedAddressData.address }}</text>
				<view v-else="" class="select">+ 添加收货地址</view>
			</view>
		</view>
		<view class="order_info_box">
			<view class="shop_name">{{ shopInfo.name }}</view>
			<view class="goods_info">
				<view v-for="(item, index) of orderInfo.cardGoods" :key="index">
					<text class="name">{{ item.goodsName }}</text>
					<text class="num">x{{ item.goodsNum }}</text>
					<text class="price">￥{{ item.goodsSpecPrice }}</text>
				</view>
			</view>
			<view class="goods_info">
				<view>
					<text class="name">打包费用</text>
					<text class="num">x{{orderInfo.packNumTotal}}</text>
					<text class="price">￥{{orderInfo.pricePackTotal}}</text>
				</view>
				<view>
					<text class="name">配送费用</text>
					<text class="price">￥{{orderInfo.deliveryPrice}}</text>
				</view>
			</view>
			<view class="order_cell_list">
				<view class="order_cell_left">
					<text class="benefit">满</text>
					支付满减
				</view>
				<view class="order_cell_right red">-￥{{orderInfo.discounTotalPrice}}</view>
			</view>
			<view class="order_cell_list" @click="onPageJump('/pages/my/coupon?goodsPrice='+orderInfo.shoppingCardPrice)">
				<view class="order_cell_left">
					<text class="volume">券</text>
					优惠券
				</view>
				<view class="order_cell_right red arrow">{{orderInfo.discountVoucherPrice ? "-￥"+orderInfo.discountVoucherPrice : 0}}</view>
			</view>
			<view class="order_cell_list line">
				<view class="order_cell_left">
				</view>
				<view class="order_cell_right size24">
					合计：
					<text class="red size36">￥{{ orderInfo.payPrice }}</text>
				</view>
			</view>
		</view>
		<!--留言备注 -->
		<view class="remarks_info">
			<picker @change="tablewareNumChange" :value="tablewareNumIndex" :range="tablewareNumList" range-key="name">
				<view class="cell_list">
					<view class="cell_left">餐具份数</view>
					<text class="cell_right arrow" v-if="tablewareNumIndex === ''">请选择</text>
					<text class="cell_right arrow" v-else="">{{ tablewareNumList[tablewareNumIndex].name }}</text>
				</view>
			</picker>
			<view class="textarea_box">
				<textarea v-model="remark" maxlength="255" placeholder="请输入留言备注" />
				<view>{{remark.length}}/255</view>
			</view>
		</view>
		<!-- 按钮 -->
		<view class="btn_box">
			<view class="money">
				<view>
					<text>￥</text>
					<text>{{ orderInfo.payPrice }}</text>
				</view>
				<view>
					已优惠
					<text>{{ orderInfo.discounTotalPrice }}</text>
					元
				</view>
			</view>
			<button @click="onSubmit">提交订单</button>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { setWxPay } from '@/utils/utils';
// #ifdef H5
import { appMutual, getBrowser } from '@/config/html5Utils';
// #endif
export default {
	data() {
		return {
			//店铺Id
			objId: '',
			//店铺信息
			shopInfo: {},
			//店铺名称
			shopName: '',
			// 留言信息
			remark: '',
			//订单信息
			orderInfo: {},
			tablewareNumList:[
				{
					name:"无需餐具",
					value:0
				},
				{
					name:"1份餐具",
					value:1
				},
				{
					name:"2份餐具",
					value:2
				},
				{
					name:"3份餐具",
					value:3
				},
				{
					name:"4份餐具",
					value:4
				},
				{
					name:"5份餐具",
					value:5
				},
				{
					name:"6份餐具",
					value:6
				},
				{
					name:"7份餐具",
					value:7
				},
				{
					name:"8份餐具",
					value:8
				},
				{
					name:"9份餐具",
					value:9
				},
				{
					name:"10份餐具",
					value:10
				},
			],
			tablewareNumIndex:1
		};
	},
	computed: {
		...mapState(['checkedAddressData', 'checkedCouponData'])
	},
	//第一次加载
	onLoad(e) {
		if (e.objId) {
			this.objId = e.objId;
		}
		this.pageData();
	},
	//页面显示
	onShow() {
		this.getOrderInfo();
	},
	//方法
	methods: {
		...mapMutations(['setCheckedAddressData']),
		onJumpCoupon() {
			uni.navigateTo({
				url: '/pages/my/coupon?shopId=' + this.objId + '&goodsPrice=' + this.orderInfo.shoppingCardPrice
			});
		},
		//页面数据
		pageData() {
			this.$http.get('api/mime/address/v1/get_default').then(res => {
				this.setCheckedAddressData(res || {});
			});
		},
		getOrderInfo() {
			this.$http
				.get('api/wm/shop/v1/info', {
					objId: this.objId
				})
				.then(res => {
					this.shopInfo = res;
				});
			let httpData = {
				shopId: this.objId
			};
			if (this.checkedCouponData.objId) {
				httpData.voucherId = this.checkedCouponData.objId;
			}
			if (this.checkedAddressData.objId) {
				httpData.addressId = this.checkedAddressData.objId;
			}
			this.$http.post('api/order/wm/v1/budget', httpData).then(res => {
				this.orderInfo = res;
			});
		},
		//页面跳转
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		},
		tablewareNumChange(e){
			this.tablewareNumIndex = e.target.value;
		},
		onSubmit(){
			if(!this.checkedAddressData.objId){
				uni.showToast({
					title:"请选择收货地址",
					icon:"none"
				});
				return;
			}
			if(this.tablewareNumIndex == ""){
				uni.showToast({
					title:"请选择餐具数量",
					icon:"none"
				});
				return;
			}
			let httpData = {
					shopId: this.objId,
					tableware: this.tablewareNumList[this.tablewareNumIndex].value,
					addressId: this.checkedAddressData.objId,
				};
				if(this.checkedCouponData.objId){
					httpData.voucherId = this.checkedCouponData.objId;
				}
				if(this.remark){
					httpData.remark = this.remark;
				}
				this.$http
					.post('api/order/wm/v1/submit', httpData)
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
.address_info_box {
	height: 160upx;
	padding: 0 30upx;
	background-image: linear-gradient(90deg, #ea552d 0%, #f19837 100%);
	border-radius: 40upx 40upx 0upx 0upx;
	.address_info {
		height: 120upx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		padding: 15upx 0;
		.name {
			font-size: 36upx;
			color: #FFF;
			line-height: 36upx;
			> text {
				margin-right: 30upx;
			}
		}
		.info {
			font-size: 24upx;
			color: #FFF;
		}
		.select {
			font-size: 48upx;
			color: #FFF;
		}
	}
}
.order_info_box {
	background-color: #ffffff;
	padding: 0 30upx;
	margin-top: -40upx;
	border-radius: 40upx;
	padding-bottom: 30upx;
	.shop_name {
		padding: 26upx 0;
		border-bottom: 1upx solid #efefef;
		font-size: 30upx;
		color: #333333;
		font-weight: bold;
	}
	.goods_info {
		padding-bottom: 30upx;
		border-bottom: 1upx solid #efefef;
		> view {
			margin-top: 30upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			> text {
				font-size: 24upx;
				color: #333333;
				&.name {
					width: 50%;
				}
				&.num {
					width: 10%;
					text-align: right;
				}
				&.price {
					width: 30%;
					text-align: right;
				}
			}
		}
	}
}

.order_cell_list {
	padding-top: 30upx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 28upx;
	color: #333333;
	.order_cell_left {
		display: flex;
		align-items: center;
	}
	.order_cell_right {
		display: flex;
		align-items: center;
	}
	&.line {
		margin-top: 30upx;
		border-top: 1upx solid #efefef;
	}
	.volume {
		width: 30upx;
		height: 30upx;
		background-color: #ea552d;
		border-radius: 4upx;
		font-size: 20upx;
		color: #ffffff;
		text-align: center;
		line-height: 30upx;
		margin-right: 10upx;
	}
	.benefit {
		width: 30upx;
		height: 30upx;
		background-color: #f19837;
		border-radius: 4upx;
		font-size: 20upx;
		color: #ffffff;
		text-align: center;
		line-height: 30upx;
		margin-right: 10upx;
	}
	.red {
		color: #ff5527;
	}
	.gray {
		color: #999999;
	}
	.size24 {
		font-size: 24upx;
	}
	.size28 {
		font-size: 28upx;
	}
	.size36 {
		font-size: 36upx;
		line-height: 36upx;
	}
	.arrow::after {
		content: '';
		@include bis('http://qn.kemean.cn/upload/201907/23/me_lise_more.png', 100% 100%);
		width: 12upx;
		height: 22upx;
		margin-left: 20upx;
	}
}
.remarks_info {
	border-radius: 40upx;
	margin-top: 20upx;
	background-color: #ffffff;
	padding: 30upx 30upx 30upx 30upx;
	.cell_list {
		padding-left: 0;
		padding-right: 0;
		padding-top: 0;
		.cell_left {
			font-size: 30upx;
			color: #333333;
		}
	}
	.textarea_box {
		padding: 20upx;
		background-color: #f8f8f8;
		> textarea {
			height: 120upx;
			font-size: 24upx;
			&::placeholder {
				color: #c4c4c4;
			}
		}
		view {
			text-align: right;
			font-size: 24upx;
			color: #999999;
			opacity: 0.5;
		}
	}
}
.btn_box {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	height: 98upx;
	background-color: #ffffff;
	border-top: solid 1upx #e5e5e5;
	padding-left: 30upx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.money {
		display: flex;
		align-items: baseline;

		> view {
			&:nth-of-type(1) {
				> text {
					&:nth-of-type(1) {
						font-size: 24upx;
						color: #ff4233;
					}
					&:nth-of-type(2) {
						font-size: 36upx;
						color: #ff4233;
					}
				}
			}
			&:nth-of-type(2) {
				margin-left: 32upx;
				font-size: 24upx;
				color: #999999;
				> text {
					color: #ff4233;
				}
			}
		}
	}
	button {
		height: 98upx;
		line-height: 98upx;
		width: 280upx;
		background-image: linear-gradient(-90deg, #ffac29 0%, #ff7418 100%), linear-gradient(#5a61f9, #5a61f9);
		background-blend-mode: normal, normal;
		font-size: 32upx;
		color: #ffffff;
		border-radius: 0;
	}
}
</style>
