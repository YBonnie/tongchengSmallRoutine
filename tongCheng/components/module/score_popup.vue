<template>
	<view>
		<view class="popupClick" @click="onPopupShow">
			<slot></slot>
		</view>
		<view class="mask" v-if="popupShow" @click="onPopupHide"></view>
		<view class="popup_box" v-if="popupShow">
			<view class="title">
				<text>跑腿打分</text>
			</view>
			<view class="content_box">
				<view class="score_box">
					<text :class="{ active: score >= item }" v-for="(item, index) of 5" :key="index" @click="onScore(item)"></text>
				</view>
				<view class="btn_box">
					<button @click="onPopupHide">取消</button>
					<button class="active" @click="onConfirm">确定</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				popupShow: false,
				score:5,
				orderNo: "",
			};
		},
		//方法
		methods: {
			//打开弹窗
			onPopupShow(orderNo) {
				this.popupShow = true;
				this.orderNo = orderNo;
			},
			onPopupHide() {
				this.popupShow = false;
			},
			onScore(item) {
				this.score = item;
			},
			onConfirm() {
				this.$http
					.post('api/order/v1/order_comment', {
						orderNo: this.orderNo,
						deliveryScore:this.score
					})
					.then(data => {
						this.$emit("change", {
							orderNo:this.orderNo,
							score:this.score,
						});
						uni.showToast({
							title:"评价成功！"
						});
						this.popupShow = false;
					});
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
			justify-content: center;
			align-items: center;
			padding: 0 30upx;

			text {
				font-size: 36upx;
				color: #333333;
			}
		}

		.content_box {
			border-top: 2upx solid #f5f5f5;
			padding: 60upx 30upx;
			.score_box {
				display: flex;
				justify-content: center;
				text {
					@include bis('../../static/icon/evaluation_star2.png', 100% 100%);
					width: 69upx;
					height: 64upx;
					margin: 0 20upx;
					&.active {
						background-image: url('../../static/icon/evaluation_star1.png');
					}
				}
			}
			.btn_box {
				display: flex;
				justify-content: center;
				margin-top: 100upx;
				button {
					width: 240upx;
					margin: 14upx 0;
					height: 70upx;
					line-height: 66upx;
					border-radius: 4upx;
					border: solid 2upx $mainColor;
					color: $mainColor;
					font-size: 28upx;
					&:nth-child(2) {
						margin-left: 20upx;
					}
				
					&.active {
						background-color: $mainColor;
						color: #FFF;
					}
				}
			}
		}
		
	}
</style>
