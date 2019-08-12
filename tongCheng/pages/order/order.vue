<template>
	<view class="order">
		<!-- 导航 -->
		<view class="navbar_box">
			<view class="navbar_list">
				<view class="tuan_order" @click="onPageJump('/pages/groupBuy/orderList')">
					<!-- <text class="num">16</text> -->
					<image src="../../static/icon/order/order_homeic1.png" mode="aspectFit"></image>
					<text class="txt">团购订单</text>
				</view>
				<view class="wai_order" @click="onPageJump('/pages/delivery/orderList')">
					<!-- <text class="num">16</text> -->
					<image src="../../static/icon/order/order_homeic2.png" mode="aspectFit"></image>
					<text class="txt">外卖订单</text>
				</view>
				<view class="hotel_room" @click="onPageJump('/pages/runLeg/orderList')">
					<image src="../../static/icon/order/order_homeic4.png" mode="aspectFit"></image>
					<text class="txt">跑腿订单</text>
				</view>
			</view>
		</view>
		<view class="order_list">
			<view class="title">
				<text class="tip">最近订单</text>
			</view>
			<!-- 订单列表 -->
			<view class="list_box"><order-item v-for="(item, index) of orderList" :key="index" :item="item" :index="index" @change="onOrderChange"></order-item></view>
		</view>
		<load-more text="暂无订单~" :height="40"></load-more>
	</view>
</template>
<script>
import orderItem from '@/components/module/order_item';
import { setWxPay } from '@/utils/utils';
import { appMutual, getBrowser } from '@/config/html5Utils';
export default {
	components: {
		orderItem
	},
	data() {
		return {
			// 订单状态
			status: 1,
			// 第一页
			pageNo: 1,
			// 总页数默认第一页
			pages: 1,
			orderList:[]
		};
	},
	//第一次加载
	onLoad(e) {
		
	},
	//页面显示
	onShow() {
		this.judgeLogin('judge', () => {
			this.pageNo = 1;
			this.pages = 1;
			this.loadData();
		});
	},
	//方法
	methods: {
		loadData() {
			if (this.pageNo <= this.pages) {
				var httpData = {
					pageNo: this.pageNo,
					pageSize: 15
				};
				this.$http
					.post('api/order/v1/recent_list', httpData, {
						load: false
					})
					.then(res => {
						uni.stopPullDownRefresh();
						this.pages = res.pages;
						if (this.pageNo == 1) {
							this.orderList = res.data;
						} else {
							this.orderList = this.orderList.concat(res.data);
						}
						if (res.data.length > 0) {
							this.pageNo = this.pageNo + 1;
						}
					});
			}
		},
		onOrderChange(e){
			console.log(e);
			if(e.type == "updata"){
				this.pageNo = 1;
				this.pages = 1;
				this.loadData();
			}else if(e.type == "delete"){
				this.orderList.splice(e.index,1);
				console.log(this.orderList);
				this.$forceUpdate();
			}
		},
		//页面跳转
		onPageJump(url){
			this.judgeLogin('judge', () => {
				uni.navigateTo({
					url:url
				});
			});
		},
	},
	//页面隐藏
	onHide() {},
	//页面卸载
	onUnload() {},
	//页面下来刷新
	onPullDownRefresh() {
		this.pageNo = 1;
		this.pages = 1;
		this.loadData();
	},
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
.navbar_box {
	width: 100%;
	height: 300upx;
	background-image: url('https://qn.kemean.cn/upload/201907/04/a4a44d8639414188a3fb330dd5682c49');
	background-repeat: no-repeat;
	background-position: center bottom;
	background-size: 100% auto;
	padding-top: 50upx;
	.navbar_list {
		margin: 0 auto;
		position: relative;
		width: 660upx;
		height: 200upx;
		background-color: #ffffff;
		box-shadow: 0upx 13upx 21upx 0upx rgba(58, 13, 1, 0.1);
		border-radius: 40upx;
		opacity: 0.94;
		padding: 0upx 90upx;
		display: flex;
		justify-content:space-between;
		// align-items: center;
		> view {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			> image {
				width: 60upx;
				height: 60upx;
			}
			.num {
				width: 36upx;
				height: 36upx;
				background-color: #ef3128;
				color: #ffffff;
				font-size: 20upx;
				border-radius: 50%;
				text-align: center;
				line-height: 36upx;
				position: absolute;
				z-index: 5;
				top: 38upx;
				margin-left: 50upx;
			}
			.txt {
				margin-top: 17upx;
				font-size: 24upx;
				color: #472d22;
			}
		}
	}
}
.order_list {
	.title {
		padding: 0 30upx 35upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		> text {
			font-size: 30upx;
			color: #333333;
		}
		> image {
			width: 35upx;
			height: 35upx;
		}
	}
	
}
</style>
