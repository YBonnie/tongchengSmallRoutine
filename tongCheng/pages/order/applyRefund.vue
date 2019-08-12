<template>
	<view>
		<!-- 退款原因 -->
		<view class="refundReason">
			<view class="goods_info">
				<view class="image"><image :src="orderInfo.shopLogo" mode="aspectFill"></image></view>
				<view class="info">
					<text class="name">{{orderInfo.shopName}}</text>
					<text class="count"><text v-for="(item, index) of orderInfo.goodsList" :key="index">{{item.goodsName}}</text></text>
					<text class="price">{{orderInfo.payPrice}}</text>
				</view>
			</view>
			<!-- 选择原因 -->
			<view class="reason_details">
			<view  v-for="(item, index) of reasonList" :key="index" @click="onSelectReason(item.objId)">
				<image v-if="reasonId == item.objId" src="../../static/icon/ic_gender_selected.png" mode="aspectFill"></image>
				<image v-else src="../../static/icon/ic_gender_unselected.png" mode="aspectFill"></image>
				<text>{{ item.name }}</text>
			</view>
			</view>
			<!-- 退款描述   -->
			<view class="refundDesc">
				<view class="input_box">
					<textarea class="textarea" v-model="refundDesc" placeholder="请输入退款描述..." maxlength="500"></textarea>
					<view class="img_txt_box">
						<view class="upload_box">
							<view class="upload_img" v-for="(item, index) in imgs" :key="index">
								<image mode="aspectFill" :src="item"></image>
								<text class="delete" @click="onDelete(index)"></text>
							</view>
							<view class="upload_but" v-if="imgs.length < 6" @click="onImgsUpload()">+</view>
						</view>
						<view class="txt">{{ refundDesc.length }}/500</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 按钮 -->
		<view class="btn_box"><button @click="onSubmit">申请退款</button></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			type: '',
			orderNo: '',
			orderInfo:{
				goodsList:[]
			},
			reasonList: [],
			//退款原因Id
			reasonId: '',
			// 退款描述
			refundDesc: '',
			// 退款照片
			imgs: []
		};
	},
	//第一次加载
	onLoad(e) {
		this.type = e.type
		this.orderNo = e.orderNo;
		this.loadData();
	},
	//页面显示
	onShow() {},
	//方法
	methods: {
		// 获取数据
		loadData() {
			this.$http.get('api/order/v2/refund_reason', { type: this.type }).then(data => {
				this.reasonList = data;
			});
			this.$http
				.get('api/order/wm/v1/order_info', {
					orderNo: this.orderNo
				})
				.then(res => {
					this.orderInfo = res;
				});
		},
		// 选择退款原因
		onSelectReason(id) {
			this.reasonId = id;
		},
		//上传图片
		onImgsUpload() {
			var count = 6 - this.imgs.length;
			this.$http.qn({ count: count }).then(res => {
				this.imgs = this.imgs.concat(res);
			});
		},
		// 删除照片
		onDelete(index) {
			this.imgs.splice(index, 1);
		},
		// 提交
		onSubmit() {
			if (this.reasonId == '') {
				uni.showToast({
					title: '请选择退款原因',
					icon: 'none'
				});
				return;
			}
			if (this.refundDesc == '') {
				uni.showToast({
					title: '请输入退款描述',
					icon: 'none'
				});
				return;
			}
			let httpData = {
				orderNo: this.orderNo,
				refundReasonId: this.reasonId,
				refundDesc: this.refundDesc
			};
			if (this.imgs.length > 0) {
				httpData.imgRecord = this.imgs;
			}
			this.$http.post('api/order/v1/after_sale', httpData).then(data => {
				uni.showModal({
					title: '提示',
					content: '退款申请提交成功！',
					showCancel: false,
					success: res => {
						uni.navigateBack();
					}
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
.refundReason {
	background-color: #ffffff;
	border-radius: 40upx;
	border: solid 2upx #f8f8f8;
	padding: 60upx 30upx 30upx;
	.goods_info {
		display: flex;
		padding-bottom: 30upx;
		border-bottom: 1upx solid #efefef;
		.image {
			> image {
				width: 160upx;
				height: 160upx;
				border-radius: 10upx;
			}
		}
		.info {
			width: 100%;
			display: flex;
			justify-content: space-around;
			flex-direction: column;
			background-color: #fcf9fc;
			padding-left: 20upx;
			.name {
				font-size: 32upx;
				color: #333333;
			}
			.count {
				font-size: 24upx;
				color: #666666;
				text {
					margin-right: 20upx;
				}
			}
			.price {
				font-size: 36upx;
				color: #e84134;
			}
		}
	}
	.reason_details {
		margin-top: 60upx;
		>view{
			display: flex;
			margin-bottom: 36upx;
			
			> image {
				width: 30upx;
				height: 30upx;
			}
			> text {
				font-size: 28upx;
				color: #333333;
				margin-left: 20upx;
			}
		}
		
	}
}

.input_box {
	min-height: 300upx;
	background-color: #f8f8f8;
	border: solid 1upx #e5e5e5;
	margin-top: 30upx;
	width: 100%;
	.textarea {
		resize: none;
		width: 100%;
		height: 142upx;
		background-color: transparent;
		padding: 0 30upx;
		margin: 30upx 0 0;
		font-size: 28upx;
		&::-webkit-input-placeholder {
			color: rgba(208, 208, 208, 0.8);
			font-size: 24upx;
		}
	}
	.img_txt_box {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;

		.txt {
			padding-right: 30upx;
			padding-bottom: 30upx;
			font-size: 24upx;
			color: #999999;
			opacity: 0.5;
			display: flex;
		}
		.upload_box {
			padding: 30upx 30upx 20upx;
			display: flex;
			flex-wrap: wrap;
			.upload_img {
				position: relative;
				margin-right: 45upx;
				margin-bottom: 20upx;
				border-radius: 10upx;
				image {
					width: 120upx;
					height: 120upx;
				}
				text {
					position: absolute;
					top: 0upx;
					right: 0upx;
					width: 40upx;
					height: 40upx;
					@include bis('../../static/icon/icon_guanbi.png', 100% 100%);
				}
			}
			.upload_but {
				width: 120upx;
				height: 120upx;
				display: flex;
				justify-content: center;
				align-items: center;
				border: 3upx dashed #cccccc;
				font-size: 80upx;
				line-height: 77upx;
				color: #cccccc;
				position: relative;
				overflow: hidden;
				border-radius: 10upx;
				color: #cccccc;
				font-size: 100upx;
				font-weight: 100;
				input {
					position: absolute;
					left: 0px;
					top: 0px;
					width: 100%;
					height: 100%;
					opacity: 0;
				}
			}
		}
	}
}
.btn_box {
	margin-top: 120upx;
	padding: 0 115upx;
	button {
		width: 534upx;
		height: 86upx;
		margin: 0 auto;
		background-image: linear-gradient(90deg, #ea552d 0%, #f19837 100%), linear-gradient(#d4d4d4, #d4d4d4);
		background-blend-mode: normal, normal;
		border-radius: 43upx;
		position: fixed;
		font-size: 36upx;
		color: #ffffff;
	}
}
</style>
