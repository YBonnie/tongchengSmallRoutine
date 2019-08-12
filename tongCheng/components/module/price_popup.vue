<template>
	<view>
		<view class="popupClick" @click="onPopupShow">
			<slot></slot>
		</view>
		<view class="mask" v-if="popupShow" @click="onPopupHide"></view>
		<view class="popup_box" v-if="popupShow">
			<view class="title">
				<button></button>
				<text>费用明细</text>
				<button @click="onPopupHide">取消</button>
			</view>
			<view class="priceListBox">
				<view v-if="type == 1201">
					<text>雇佣费用</text>
					<text>￥{{priceList.priceHire}}</text>
				</view>
				<view v-if="type == 1401">
					<text>商品预估费</text>
					<text>￥{{priceList.priceGoods}}</text>
				</view>
				<view v-if="type == 1301 || type == 1401">
					<text>配送费</text>
					<text>￥{{priceList.priceService}}</text>
				</view>
				<view v-if="type == 1301 || type == 1401">
					<text>小费</text>
					<text>￥{{priceList.priceTip}}</text>
				</view>
				<view>
					<text>优惠卷</text>
					<text>￥{{priceList.priceOffer}}</text>
				</view>
				<view>
					<text>附加费用</text>
					<text>￥{{priceList.priceAdd}}</text>
				</view>
				<view class="active">
					<text>合计</text>
					<text>￥{{priceList.priceTotal}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				popupShow: false
			};
		},
		props: {
			priceList: {
				type: Object,
				default () {
					return {
						priceService: 0,
						priceHire: 0,
						priceOffer: 0,
						priceTip: 0,
						priceGoods: 0,
						deliveryTime: 0,
						priceTotal: 0
					};
				}
			},
			type: String
		},
		//方法
		methods: {
			//打开弹窗
			onPopupShow() {
				this.popupShow = true;
			},
			onPopupHide() {
				this.popupShow = false;
			},
			onConfirm() {
				this.$emit("change");
				this.popupShow = false;
			}
		},
	};
</script>
<style lang="scss" scoped>
	@import "@/style/mixin.scss";

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: 5;
	}

	.popup_box {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 6;
		background-color: #FFF;

		.title {
			height: 100upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 30upx;

			button {
				font-size: 30upx;
				min-width: 70upx;
				background-color: transparent;

				&:first-child {
					color: #999999;
				}

				&:last-child {
					color: $mainColor;
				}
			}

			text {
				font-size: 36upx;
				color: #333333;
			}
		}

		.priceListBox {
			padding: 80upx 80upx 50upx 80upx;

			>view {
				display: flex;
				justify-content: space-between;
				margin-bottom: 30upx;

				text {
					font-size: 28upx;
					color: #333;

					&:last-child {
						color: #666;
					}
				}

				&.active text {
					color: #f00;
				}
			}
		}
	}
</style>
