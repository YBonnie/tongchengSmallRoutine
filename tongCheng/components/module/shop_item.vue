<template>
	<view class="shop_item" @click="onPageJump">
		<view class="shop_info_box" :class="{'noLine':index == 0}">
			<view class="shop_image">
				<image :src="item.logo" mode="aspectFill"></image>
				<text class="proofing" v-if="item.shopType == 1101 && !item.shopRun">已打烊</text>
			</view>
			<view class="shop_info">
				<view class="info_box">
					<view class="name">{{ item.name }}</view>
					<text>{{ item.distance }}</text>
				</view>
				<view class="info_box">
					<view v-if="item.shopType == 1201" class="goods_name">{{ item.recommend }}</view>
					<view v-else="">{{ item.sendTime }}送达</view>
					<text class="score_sale_box"><text class="score">{{item.score}}分 </text> | 月售{{ item.monthSale }}</text>
				</view>
				<view class="info_box" v-if="item.shopType == 1101">
					<view>起送价{{ item.sendPrice }}元 | 配送费{{ item.shippingPrice }}元</view>
				</view>
				<view class="price" v-if="item.shopType == 1201">
					<view>{{ item.priceDiscount }}</view>
					<text>门市价：{{ item.priceTotal }}</text>
				</view>
				<view class="offer">
					<text v-for="(childItem, childIndex) of item.fullDiscountMoney" :key="childIndex">{{ childItem }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'shopsLists',
	props: {
		item: {
			type: Object,
			default() {
				return {};
			}
		},
		index: {
			type: Number,
			default() {
				return 0;
			}
		}
	},
	methods: {
		onPageJump() {
			let  url = '/pages/groupBuy/shopDetail?objId=' + this.item.objId;
			if(this.item.shopType == 1101){
				url = '/pages/delivery/shopDetail?objId=' + this.item.objId;
			}
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
.shop_item {
	padding-left: 30upx;
	.shop_info_box {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		border-top: 1upx solid #ededed;
		&.noLine {
			border-top:0;
		}
		padding: 30upx 30upx 30upx 0;
		.shop_image {
			position: relative;
			image {
				width: 130upx;
				height: 130upx;
				border-radius: 6upx;
			}
			.proofing {
				position: absolute;
				bottom: 0;
				left: 0;
				z-index: 2;
				width: 130upx;
				height: 40upx;
				line-height: 40upx;
				text-align: center;
				background-color: #010101;
				opacity: 0.7;
				color: #ffffff;
				font-size: 24upx;
				border-radius: 0 0 6upx 6upx;
			}
		}
		.shop_info {
			margin-left: 30upx;
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			flex-direction: column;
			width: calc(100% - 160upx);
			.info_box {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 24upx;
				color: #666666;
				margin-bottom: 8upx;
			}
			.name {
				font-size: 34upx;
				color: #333333;
				font-weight: bold;
				width: calc(100% - 120upx);
				@include toe();
			}
			.goods_name {
				// width: calc(100% - 140upx);
				@include toe();
			}
			.score {
				color: #f39801;
				margin-right: 10upx;
			}
			.score_sale_box {
				flex-shrink: 0;
			}
			.price {
				display: flex;
				align-items: center;
				view {
					font-size: 36upx;
					color: #e84134;
					font-weight: bold;
				}
				text {
					font-size: 24upx;
					color: #666666;
					margin-left: 30upx;
				}
			}
			.offer {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				flex-wrap: wrap;
				> text {
					padding: 6upx 12upx;
					margin-right: 12upx;
					margin-top: 12upx;
					border-radius: 4upx;
					border: solid 1upx #ff4233;
					font-size: 20upx;
					color: #ff4233;
				}
			}
		}
	}
}
</style>
