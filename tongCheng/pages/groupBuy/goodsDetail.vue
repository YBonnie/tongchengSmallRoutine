<template>
	<view>
		<swiper
			class="banner_swiper"
			:indicator-dots="true"
			:autoplay="true"
			:interval="3000"
			:duration="1000"
			indicator-color="rgba(255, 255, 255, .3)"
			indicator-active-color="#FFF"
		>
			<swiper-item v-for="(item,index) of goodsInfo.imgs" :key="index"><image :src="item" mode="aspectFill" @click="onPreviewImage(index,goodsInfo.imgs)"></image></swiper-item>
		</swiper>
		<view class="goods_info_box">
			<view class="goods_name">{{goodsInfo.name}}</view>
			<view class="info_box">
				<view>{{goodsInfo.useDateStr}} | {{goodsInfo.reserveStr}} | {{goodsInfo.retreatStr}}</view>
				<view>销量{{goodsInfo.numSales}}</view>
			</view>
			<view class="goods_detail_box">
				<view class="detail_box">
					<image src="../../static/icon/orderdetails_ic2.png" mode=""></image>
					<view class="goods_content">
						<view class="name">套餐详情</view>
						<view class="content_list" v-for="(item,index) of goodsInfo.goods" :key="index">
							<view>
								{{item.name}}
								<text>（{{item.number}}份）</text>
							</view>
							<view>{{item.priceStr}}</view>
						</view>
					</view>
				</view>
				<view class="detail_box">
					<image src="../../static/icon/orderdetails_ic3.png" mode=""></image>
					<view class="info">
						<view class="name">使用说明</view>
						<text v-for="(item,index) of goodsInfo.description" :key="index">· {{item}}</text>
					</view>
				</view>
			</view>
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
		// 图片预览的方法
		onPreviewImage(index, imgs) {
			if (imgs && imgs instanceof Array && imgs.length > 0) {
				uni.previewImage({
					current: imgs[index],
					urls: imgs
				});
			}
		},
		onSubmit(){
			this.judgeLogin('judge', () => {
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
.banner_swiper {
	height: 400upx;
	image {
		width: 100%;
		height: 400upx;
	}
}
.goods_info_box {
	padding: 30upx;
	background-color: #fff;
	min-height: calc(100vh - 494upx);
	padding-bottom: 100upx;
	.goods_name {
		font-size: 36upx;
		color: #333333;
		font-weight: bold;
	}
	.info_box {
		margin-top: 20upx;
		display: flex;
		justify-content: space-between;
		view {
			font-size: 24upx;
			color: #666666;
		}
	}
	.goods_detail_box {
		margin-top: 60upx;
		.detail_box {
			display: flex;
			padding-bottom: 50upx;
			image {
				width: 34upx;
				height: 38upx;
				margin-right: 20upx;
				flex-shrink: 0;
			}
			.name {
				font-size: 34upx;
				line-height: 34upx;
				color: #333333;
				font-weight: bold;
				margin-bottom: 36upx;
			}
			.goods_content {
				display: flex;
				flex-direction: column;
				width: calc(100% - 54upx);
				.content_list {
					display: flex;
					justify-content: space-between;
					align-items: center;
					> view {
						font-size: 28upx;
						color: #333333;
						text {
							color: #999999;
						}
					}
				}
			}
			.info {
				display: flex;
				flex-direction: column;
				text {
					font-size: 26upx;
					color: #333333;
					margin-top: 10upx;
				}
			}
		}
	}
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
