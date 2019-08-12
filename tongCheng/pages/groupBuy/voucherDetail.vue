<template>
	<view class="page">
		<view class="voucher_detail_box">
			<view class="shop_name">{{goodsInfo.shopName}}</view>
			<view class="voucher_info_box">
				<view class="price_box">
					<view>{{goodsInfo.priceDiscount}}</view>
					<view>代{{goodsInfo.priceTotal}}元</view>
				</view>
				<view class="voucher_info">
					<view class="info_box">
						<view class="name">{{goodsInfo.name}}</view>
						<view class="info">{{goodsInfo.useDateStr}} {{goodsInfo.reserveStr}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="content">
			<view v-for="(item,index) of goodsInfo.description" :key="index">{{item}}</view>
		</view>
		<view class="submit_btn_box">
			<view class="price">
				<view>{{goodsInfo.priceDiscount}}</view>
				<text>门市价 {{goodsInfo.priceTotal}}</text>
			</view>
			<button @click="onSubmit">立即抢购</button>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			objId:"",
			goodsInfo:{}
		};
	},
	//第一次加载
	onLoad(e) {
		if(e){
			this.objId = e.objId;
			this.pageData();
		}
	},
	//页面显示
	onShow() {},
	//方法
	methods: {
		...mapMutations(['setGoodsData']),
		pageData(){
			this.$http
				.get('api/tg/shop/v1/goods_detail', {
					objId: this.objId
				})
				.then(res => {
					this.goodsInfo = res;
				});
		},
		onSubmit(){
			this.judgeLogin('judge', () => {
				this.goodsInfo.type = 1201;
				this.setGoodsData(this.goodsInfo);
				uni.navigateTo({
					url:"/pages/groupBuy/confirmOrder"
				});
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
.page {
	padding-top: 10upx;
}
.voucher_detail_box {
	background-color: #ffffff;
	border-radius: 40upx;
	padding: 30upx;
	.shop_name {
		font-size: 30upx;
		color: #333333;
		font-weight: bold;
		padding-bottom: 30upx;
	}
	.voucher_info_box {
		display: flex;
		background-color: #fefaf5;
		border-radius: 10upx;
		.price_box {
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
		}
	}
}
.content {
	padding: 30upx;
	font-size: 28upx;
	color: #666666;
}
.submit_btn_box {
	position: fixed;
	left: 0;
	bottom: 0;
	background-color: #fff;
	width: 100%;
	border-top: solid 2upx #f8f8f8;
	display: flex;
	justify-content: space-between;
	.price {
		padding-left: 30upx;
		display: flex;
		align-items: center;
		view {
			font-size: 48upx;
			color: #fd595a;
			font-weight: bold;
		}
		text {
			font-size: 24upx;
			color: #999999;
			margin-left: 16upx;
			text-decoration: line-through;
		}
	}
	button {
		width: 240upx;
		height: 94upx;
		line-height: 94upx;
		background-image: linear-gradient(90deg, #ea552d 0%, #f19837 100%), linear-gradient(#fd595a, #fd595a);
		border-radius: 0;
		color: #FFF;
		font-size: 36upx;
	}
}
</style>
