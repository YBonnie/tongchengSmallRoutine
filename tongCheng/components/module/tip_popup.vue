<template>
	<view>
		<view class="popupClick" @click="onPopupShow"><slot></slot></view>
		<view class="mask" v-if="popupShow" @click="onPopupHide"></view>
		<view class="popup_box" v-if="popupShow">
			<view class="title">
				<button @click="onPopupHide">取消</button>
				<text>{{title}}</text>
				<button @click="onConfirm">确定</button>
			</view>
			<view class="tip_box">
				<view class="tip_list">
					<button @click="onTip('')" :class="[tipValue == '' ? 'active':'']" v-if="title == '小费'">不加了</button>
					<button @click="onTip(item,index)" v-for="(item,index) of tipList" :key="index" :class="[tipValue == item ? 'active':'']">{{item}}</button>
					<button @click="onTip(100)" :class="[tipValue == 100 ? 'active':'']" v-if="title != '小费'">100</button>
				</view>
				<input type="number" placeholder="请输入自定义金额，最高200元" v-model="tipValue">
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tipList: [2, 3, 5, 10, 15, 20, 50],
				tipValue: "",
				popupShow:false
			};
		},
		props: {
			title: {
				type: String,
				default() {
					return "小费";
				}
			}
		},
		//方法
		methods: {
			//打开弹窗
			onPopupShow() {
				this.popupShow = true;
			},
			onPopupHide(){
				this.popupShow = false;
			},
			onTip(item) {
				this.tipValue = item;
			},
			onConfirm() {
				if (this.tipValue > 200) {
					uni.showToast({
						title: "小费不能大于200元",
						icon: "none"
					})
					return;
				}
				this.$emit("change", this.tipValue);
				if(this.title == '小费'){
					this.popupShow = false;
				}
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

		.tip_box {
			border-top: 1px solid #efefef;
			padding: 50upx 30upx 40upx 30upx;

			.tip_list {
				display: flex;
				flex-wrap: wrap;

				button {
					width: 150upx;
					height: 60upx;
					background-color: #f5f2f5;
					border-radius: 10upx;
					margin-bottom: 40upx;
					margin-right: 28upx;
					font-size: 26upx;
					color: #666666;
					line-height: 60upx;

					&:nth-child(4),
					&:nth-child(8),
					&:nth-child(12),
					&:nth-child(16) {
						margin-right: 0;
					}

					&.active {
						background-color: $mainColor;
						color: #ffffff;
					}
				}
			}

			input {
				height: 80upx;
				border-radius: 10upx;
				border: solid 1px #f5f2f5;
				width: 100%;
				padding: 0 30upx;
				font-size: 26upx;
				color: #333;

				&::-webkit-input-placeholder {
					color: #999;
				}
			}
		}
	}
</style>
