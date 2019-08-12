<template>
	<view>
		<view class="popupClick" @click="onPopupShow">
			<slot></slot>
		</view>
		<view class="mask" v-if="popupShow" @click="onPopupHide"></view>
		<view class="popup_box" v-if="popupShow">
			<view class="title">
				<button @click="onPopupHide">取消</button>
				<text>重量/类型</text>
				<button @click="onConfirm">确定</button>
			</view>
			<view class="typesBox">
				<input type="text" placeholder="请输入物品类型" v-model="goodsType">
				<view class="typeList">
					<button @click="onType(item,index)" v-for="(item,index) of typeList" :key="index" :class="[goodsType == item.name ? 'active':'']">{{item.name}}</button>
				</view>
			</view>
			<view class="weightBox">
				<view class="weightTitle">重量</view>
				<view class="goodsWeight">{{goodsWeight}}公斤</view>
				<!-- <mt-range class="weightRange" v-model="goodsWeight" :min="1.0" :max="15" :bar-height="2"></mt-range> -->
				<slider :value="goodsWeight" activeColor="#FF5723" @change="sliderChange" :min="1.0" :max="15" />
				<view class="maxmin">
					<text>1公斤</text>
					<text>15公斤</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goodsWeight: 1,
				typeList: [],
				goodsType: "",
				popupShow: false
			};
		},
		props: {
			type: {
				type: Number,
				default () {
					return 1201;
				}
			}
		},
		created() {
			this.pageData();
		},
		//方法
		methods: {
			pageData() {
				this.$http.get("api/open/v1/delivery_category").then(data => {
					if (this.type == 1201) {
						this.typeList = data.takeBO;
					} else if (this.type == 1202) {
						this.typeList = data.sendBO;
					}
				});
			},
			//打开弹窗
			onPopupShow() {
				this.popupShow = true;
			},
			onPopupHide() {
				this.popupShow = false;
			},
			onType(item, index) {
				this.goodsType = item.name;
			},
			sliderChange(e){
				this.goodsWeight = e.detail.value;
			},
			onConfirm() {
				if (this.goodsType == "") {
					uni.showToast({
						title: "请选择物品类型",
						icon: "none"
					});
					return;
				}
				this.$emit("change", {
					goodsType: this.goodsType,
					goodsWeight: this.goodsWeight
				});
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

		.typesBox {
			border-top: 1upx solid #efefef;
			padding: 30upx;

			input {
				width: 100%;
				font-size: 30upx;
				color: #333;
			}

			.typeList {
				margin-top: 30upx;
				display: flex;
				flex-wrap: wrap;

				button {
					width: 156upx;
					height: 60upx;
					background-color: #f5f2f5;
					border-radius: 10upx;
					margin-bottom: 20upx;
					margin-right: 20upx;
					font-size: 26upx;
					color: #666666;

					&:nth-child(4),
					&:nth-child(8),
					&:nth-child(12),
					&:nth-child(16) {
						margin-right: 0;
					}

					&.active {
						background-color: #6eaefd;
						color: #ffffff;
					}
				}
			}
		}

		.weightBox {
			padding: 0 30upx 30upx 30upx;

			.weightTitle {
				height: 100upx;
				line-height: 100upx;
				text-align: center;
				font-size: 36upx;
				color: #333333;
			}

			.goodsWeight {
				text-align: center;
				font-size: 48upx;
				color: $mainColor;
			}

			.weightRange {
				margin: 30upx 40upx 0 40upx;
			}

			.maxmin {
				display: flex;
				justify-content: space-between;

				text {
					font-size: 24upx;
					color: #cccccc;
				}
			}
		}
	}
</style>
