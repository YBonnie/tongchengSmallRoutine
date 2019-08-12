<template>
	<view>
		<!-- 菜单 -->
		<view class="menu_box">
			<view :class="{ active: orderStatus == 1001 }" @click="onOrderStatus(1001)">待付款</view>
			<view :class="{ active: orderStatus == 1101 }" @click="onOrderStatus(1101)">已付款</view>
			<view :class="{ active: orderStatus == 1200 }" @click="onOrderStatus(1200)">已接单</view>
			<view :class="{ active: orderStatus == 1400 }" @click="onOrderStatus(1400)">已完成</view>
			<view :class="{ active: orderStatus == 1500 }" @click="onOrderStatus(1500)">退款</view>
		</view>
		<view class="support"></view>
		<!-- 订单列表 -->
		<view class="list_box"><order-item v-for="(item, index) of orderList" :key="index" :item="item" :index="index" @change="onOrderChange"></order-item></view>
		<load-more text="暂无订单~" :height="40"></load-more>
		
	</view>
</template>
<script>
import orderItem from '@/components/module/order_item';
export default {
	components: {
		orderItem
	},
	data() {
		return {
			orderStatus: 1001,
			// 第一页
			pageNo: 1,
			// 总页数默认第一页
			pages: 1,
			orderList:[]
		};
	},
	//第一次加载
	onLoad(e) {
		this.loadData();
	},
	//页面显示
	onShow() {},
	//方法
	methods: {
		// 菜单筛选
		onOrderStatus(value) {
			this.orderStatus = value;
			this.pageNo = 1;
			this.pages = 1;
			this.loadData();
		},
		//跳转页面
		pageJump(url) {
			uni.navigateTo({
				url: url
			});
		},
		loadData() {
			if (this.pageNo <= this.pages) {
				var httpData = {
					pageNo: this.pageNo,
					pageSize: 15
				};
				if(this.orderStatus){
					httpData.orderStatus = this.orderStatus;
				}
				this.$http
					.post('api/order/wm/v1/list_data', httpData, {
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
			if(e.type == "updata"){
				this.pageNo = 1;
				this.pages = 1;
				this.loadData();
			}else if(e.type == "delete"){
				this.orderList.splice(e.index,1);
			}
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
.support {
	height: 108upx;
}
.menu_box {
	height: 88upx;
	background-color: #ffffff;
	padding: 31upx 25upx 10upx;
	border-bottom: 1upx solid #e5e5e5;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	> view {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		font-size: 30upx;
		color: #333333;
		&::after {
			content: '';
			width: 40upx;
			height: 6upx;
			margin-top: 18upx;
		}
		&.active {
			color: #f19837;
			&::after {
				content: '';
				width: 40upx;
				height: 6upx;
				background-color: #f19837;
				border-radius: 3upx;
				margin-top: 18upx;
			}
		}
	}
}
</style>