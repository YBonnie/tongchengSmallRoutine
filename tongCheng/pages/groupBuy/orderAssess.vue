<template>
	<view class="page">
		<view class="orderAssess">
			<view class="shop_box">
				<image :src="orderInfo.shopInfo.shopLogo" mode="aspectFill"></image>
				<view class="shop_info">
					<view class="title">{{orderInfo.shopInfo.shopName}}</view>
					<view class="info">{{orderInfo.shopInfo.goodsName}}</view>
				</view>
			</view>
			<!-- 评分星星 -->
			<view class="score_box"><text :class="{ active: score >= item }" v-for="(item, index) of 5" :key="index" @click="onScore(item)"></text></view>
			<!-- 上传照片 -->
			<view class="upload_box">
				<view class="upload_img" v-for="(item, index) in imgs" :key="index">
					<image mode="aspectFill" :src="item"></image>
					<text class="delete" @click="onDelete(index)"></text>
				</view>
				<view class="upload_but" v-if="imgs.length < 6" @click="onImgsUpload()"><image src="../../static/icon/icon_shangchuantupian.png" mode="aspectFill"></image></view>
			</view>
			<!-- 输入框 -->
			<view class="textarea_upload_box">
				<view class="textarea_box">
					<textarea class="textarea" v-model="content" placeholder="亲，用餐愉快，对菜品口味如何，商家服务还满意吗？" maxlength="500"></textarea>
					<view>{{ content.length }}/500</view>
				</view>
			</view>
		</view>

		<!-- 按钮 -->
		<view class="btn_box"><button class="submit" @click="onSubmit">提交</button></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 当前订单号
			orderNo: '',
			orderInfo:{
				shopInfo:{}
			},
			// 留言内容
			content: '',
			// 上传图片数组
			imgs: [],
			// 获得的分数
			score: ""
		};
	},
	//第一次加载
	onLoad(e) {
		if (e.orderNo) {
			this.orderNo = e.orderNo;
		}
		this.getData();
	},
	//页面显示
	onShow() {},
	//方法
	methods: {
		// 星星评分
		onScore(value) {
			this.score = value;
		},
		// 获得数据
		getData() {
			this.$http
				.get('api/order/tg/v1/info_data', {
					orderNo: this.orderNo
				})
				.then(res => {
					this.orderInfo = res;
				});
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
		// 提交评价
		onSubmit() {
			if(this.score == ""){
				uni.showToast({
					title:"请先给店铺打分",
					icon:"none"
				});
				return;
			}
			let httpData = {
				orderNo: this.orderNo,
				shopScore:this.score,
			}
			if(this.content){
				httpData.content = this.content;
			}
			if(this.imgs.length > 0){
				httpData.imgs = this.imgs;
			}
			this.$http
				.post('api/order/v1/order_comment',httpData)
				.then(data => {
					uni.showToast({
						title: '评价成功!',
						icon: 'none'
					});
					uni.navigateBack();
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
.orderAssess {
	margin-top: 8upx;
	background-color: #ffffff;
	border-radius: 40upx;
	border: solid 2upx #f8f8f8;
	overflow: hidden;
	.shop_box {
		padding: 30upx 30upx 40upx;
		display: flex;
		background-color: #fff;
		border-bottom: 1upx solid #efefef;
		image {
			width: 120upx;
			height: 120upx;
			margin-right: 30upx;
			border-radius: 50%;
		}
		.shop_info {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			.title {
				font-size: 32upx;
				color: #333333;
				font-weight: bold;
			}
			.info {
				font-size: 24upx;
				color: #999999;
			}
		}
	}
	.score_box {
		padding: 41upx 0 50upx 0;
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
	.upload_box {
		display: flex;
		flex-wrap: wrap;
		padding: 0 0upx 50upx 61upx;
		.upload_img {
			position: relative;
			margin-right: 60upx;
			margin-top: 20upx;
			border-radius: 10upx;
			image {
				width: 123upx;
				height: 123upx;
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
			margin-top: 20upx;
			width: 123upx;
			height: 123upx;
			display: flex;
			justify-content: center;
			align-items: center;
			border: 3upx dashed #cccccc;
			font-size: 80upx;
			line-height: 77upx;
			color: #cccccc;
			border-radius: 10upx;
			color: #cccccc;
			font-size: 100upx;
			padding: 24upx 21upx;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
	.textarea_upload_box {
		min-height: 200upx;
		background-color: #fff;
		padding: 0 30upx 40upx;
		.textarea_box {
			background-color: #f8f8f8;
			padding: 20upx 30upx;
			.textarea {
				resize: none;
				width: 100%;
				height: 142upx;
				background-color: inherit;
				font-size: 28upx;
				box-sizing: border-box;
				&::-webkit-input-placeholder {
					color: rgba(208, 208, 208, 0.8);
					font-size: 24upx;
					opacity: 0.5;
				}
			}
			> view {
				margin-top: 10upx;
				width: 100%;
				text-align: right;
				font-size: 24upx;
				color: #999999;
				opacity: 0.5;
			}
		}
	}
}

.btn_box {
	margin:105upx 105upx 0upx ;
	.submit {
		width: 534upx;
		height: 86upx;
		background-image: linear-gradient(90deg, #ea552d 0%, #f19837 100%), linear-gradient(#d4d4d4, #d4d4d4);
		background-blend-mode: normal, normal;
		border-radius: 43upx;
		color: #ffffff;
		line-height: 86upx;
	}
}
</style>
