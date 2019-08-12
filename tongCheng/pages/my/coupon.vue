<template>
	<view class="page">
		<view class="not_use_coupon" v-if="goodsPrice && couponList.length > 0" @click="onSelectCoupon({})">
			<view>不使用优惠券</view>
			<text :class="{'active':!checkedCouponData.objId}"></text>
		</view>
		<view class="coupon_list" :class="{'active':item.canUse}" v-for="(item,index) of couponList" :key="index" @click="onSelectCoupon(item)">
			<view class="coupon_info_box">
				<view class="name">
					<view>{{item.title}}</view>
					<text>{{item.subtitle}}</text>
				</view>
				<view class="amount">
					￥
					<text>{{item.priceDiscount}}</text>
				</view>
			</view>
			<view class="period_box">
				<text>{{item.effectiveDateStr || '长期有效'}}</text>
				<view :class="{'active':checkedCouponData.objId == item.objId}" v-if="shopId">使用</view>
			</view>
		</view>
		<load-more :type="3" @change="getLoadState"></load-more>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			shopId:"",
			goodsPrice:"",
			type:"",
			couponList:[],
			// 第一页
			pageNo: 1,
			// 总页数默认第一页
			pages: 1,
			//选中的优惠券
			selectCoupon:"",
			//状态
			loadState:999
		};
	},
	computed: {
		...mapState(['checkedCouponData'])
	},
	//第一次加载
	onLoad(e) {
		if(e.shopId){
			this.shopId = e.shopId;
		}
		if(e.goodsPrice){
			this.goodsPrice = e.goodsPrice;
		}
		if(e.type){
			this.type = e.type;
		}
		this.loadData();
	},
	//页面显示
	onShow() {},
	//方法
	methods: {
		...mapMutations(['setCheckedCouponData']),
		getLoadState(val){
			this.loadState = val;
		},
		loadData() {
			if (this.pageNo <= this.pages) {
				var httpData = {
					pageNo: this.pageNo,
					pageSize: 15,
					useType:1601
				};
				if(this.shopId){
					httpData.shopId = this.shopId;
				}
				if(this.goodsPrice){
					httpData.goodsPrice = this.goodsPrice;
				}
				if(this.type){
					httpData.useType = this.type;
				}
				this.$http.post('api/mime/v1/discount_voucher_list', httpData,{
					load:false
				}).then(res => {
					uni.stopPullDownRefresh();
					this.pages = res.pages;
					if (this.pageNo == 1) {
						this.couponList = res.data;
					} else {
						this.couponList = this.couponList.concat(res.data);
					}
					if (res.data.length > 0) {
						this.pageNo = this.pageNo + 1;
					}
				});
			}
		},
		onSelectCoupon(item){
			if(this.goodsPrice){
				this.setCheckedCouponData(item);
				uni.navigateBack();
			}
		}
	},
	//页面隐藏
	onHide() {},
	//页面卸载
	onUnload() {},
	//页面下来刷新
	onPullDownRefresh() {},
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
.page {
	padding: 30upx;
	.not_use_coupon {
		height: 120upx;
		background-color: #ffffff;
		border-radius: 20upx;
		display: flex;
		align-items: center;
		padding: 30upx 30upx 35upx 30upx;
		justify-content: space-between;
		position: relative;
		overflow: hidden;
		&::after {
			content: '';
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 5upx;
			background-image: linear-gradient(90deg, #f19837 0%, #ea552d 100%);
		}
		view {
			font-size: 36upx;
			color: #333333;
		}
		text {
			@include bis('../../static/icon/ic_gender_unselected.png', 100% 100%);
			width: 38upx;
			height: 38upx;
			&.active {
				background-image: url('../../static/icon/ic_gender_selected.png');
			}
		}
	}
	.coupon_list {
		margin-top: 20upx;
		background-color: #ffffff;
		border-radius: 20upx;
		padding-bottom: 5upx;
		position: relative;
		overflow: hidden;
		
		&::after {
			content: '';
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 5upx;
			background-color: #999999;
		}
		&.active {
			.coupon_info_box .amount {
				color: #f19837;
			}
			.period_box view {
				display: flex;
			}
			&::after {
				background-image: linear-gradient(90deg, #f19837 0%, #ea552d 100%);
			}
		}
		.coupon_info_box {
			display: flex;
			justify-content: space-between;
			padding: 30upx;
			.name {
				margin-top: 10upx;
				view {
					font-size: 36upx;
					color: #333333;
				}
				text {
					font-size: 22upx;
					color: #999999;
				}
			}
			.amount {
				font-size: 36upx;
				color: #999999;
				text {
					font-size: 140upx;
					line-height: 120upx;
				}
			}
		}
		.period_box {
			border-top: 1upx solid #f6f6f6;
			padding: 20upx 30upx;
			display: flex;
			justify-content: space-between;
			text {
				font-size: 24upx;
				color: #999999;
			}
			view {
				display: none;
				align-items: center;
				font-size: 24upx;
				color: #999999;
				&::before {
					content: '';
					@include bis('../../static/icon/home_ic_unagree.png', 100% 100%);
					width: 38upx;
					height: 38upx;
					margin-right: 20upx;
				}
				&.active::before {
					background-image: url('../../static/icon/home_ic_agree.png');
				}
			}
		}
	}
}
</style>
