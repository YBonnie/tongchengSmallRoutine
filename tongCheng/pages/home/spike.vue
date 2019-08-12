<template>
	<view>
		<view class="tab_box">
			<view :class="{'active':ongoing}" @click="onChange(true)">限时秒杀</view>
			<view :class="{'active':!ongoing}" @click="onChange(false)">待秒杀</view>
		</view>
		<view class="support"></view>
		<view class="spike_list_box">
			<view class="spike_list" v-for="(item,index) of goodsList" :key="index">
				<view class="image_box">
					<image :src="item.imgs[0]" mode="aspectFill"></image>
					<text>剩余：{{item.numBalance}}份</text>
					<view v-if="item.spikeBegin">距结束：{{item.countdown}}</view>
					<view v-else="">开始时间：{{childItem.spikeBeginTimeStr}}</view>
				</view>
				<view class="name">{{item.name}}</view>
				<view class="price">
					{{item.priceDiscount}}
					<text>门市价 {{item.priceTotal}}</text>
				</view>
				<view class="buy">
					<button @click="onGoodsJump(item)">立即抢购</button>
				</view>
			</view>
		</view>
		<load-more text="暂无商品~" :height="40"></load-more>
		<z-login ref="login"></z-login>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import zLogin from '@/components/module/login';
	export default {
		components: {
			zLogin
		},
		data() {
			return {
				// 列表
				goodsList: [],
				pageNo: 1,
				pages: 1,
				ongoing:true
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
			...mapMutations(['setGoodsData']),
			onChange(val){
				this.ongoing = val;
				this.pageNo = 1;
				this.pages = 1;
				this.loadData();
			},
			loadData() {
				if (this.pageNo <= this.pages) {
					let httpData = {
						pageNo: this.pageNo,
						pageSize: 15,
						ongoing:this.ongoing
					};
					this.$http
						.post('api/tg/shop/v1/spike', httpData, {
							load: false
						})
						.then(res => {
							uni.stopPullDownRefresh();
							this.pages = res.pages;
							if (this.pageNo == 1) {
								this.goodsList = res.data;
							} else {
								this.goodsList = this.goodsList.concat(res.data);
							}
							this.goodsList.map((item,index) => {
								if(item.countdown === undefined){
									item.countdown = "";
									this.getCountdown(index);
								}
								return item;
							});
							if (res.data.length > 0) {
								this.pageNo = this.pageNo + 1;
							}
						});
				}
			},
			//倒计时
			getCountdown(index){
				let item = this.goodsList[index];
				let currentTime = new Date().getTime();
				if(currentTime < item.spikeEndTime){
					let differenceTime = parseInt((item.spikeEndTime - currentTime)/1000);
					let clear = setInterval(() => {
						differenceTime--;
						if(differenceTime <= 0 || item.spikeBegin !== this.ongoing){
							clearInterval(clear);
							return;
						}
						let day = parseInt(differenceTime / 86400);
						let time = parseInt((differenceTime - day*86400)/ 3600);
						let minute = parseInt((differenceTime- day*86400 -  time*3600)/60);
						let second = differenceTime- day*86400 -  time*3600 - minute*60;
						this.goodsList[index].countdown = day+"天 "+time+":"+minute+":"+second;
						this.$forceUpdate();
					},1000);
				}else{
					this.goodsList[index].countdown = "已结束";
				}
			},
			onGoodsJump(item){
				let url = "/pages/groupBuy/goodsDetail?objId="+item.objId
				// item.shopName = this.shopInfo.name;
				item.type = 1102;
				this.setGoodsData(item);
				uni.navigateTo({
					url:url
				});
			}
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
	@import "@/style/mixin.scss";

	.tab_box {
		position: fixed;
		z-index: 2;
		background-color: #FFF;
		left: 0;
		width: 100%;
		height: 88upx;
		display: flex;
		justify-content: space-around;

		view {
			height: 88upx;
			line-height: 88upx;
			font-size: 30upx;
			color: #333333;

			&.active {
				color: #f19837;
				position: relative;

				&::after {
					content: "";
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
					width: 40upx;
					height: 4upx;
					background-image: linear-gradient(#f19837,
						#f19837),
						linear-gradient(#6eaefd,
						#6eaefd);
					border-radius: 2upx;
				}
			}
		}
	}

	.support {
		height: 88upx;
	}

	.spike_list_box {
		padding: 30upx;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;

		.spike_list {
			width: 330upx;
			background-color: #ffffff;
			border-radius: 40upx;
			overflow: hidden;
			margin-bottom: 30upx;
			.image_box {
				position: relative;

				image {
					width: 100%;
					height: 260upx;
				}

				text {
					position: absolute;
					top: 20upx;
					right: 20upx;
					font-size: 24upx;
					color: #ffffff;
				}

				view {
					position: absolute;
					left: 0;
					bottom: 0;
					width: 100%;
					padding: 15upx 0;
					text-align: center;
					font-size: 28upx;
					color: #ffffff;
				}
			}

			.name {
				font-size: 30upx;
				color: #333333;
				padding: 15upx 20upx 0 20upx;
				font-weight: bold;
				width: 100%;
				@include toe();
			}

			.price {
				padding: 15upx 20upx 0 20upx;
				font-size: 36upx;
				color: #ea562d;

				text {
					font-size: 24upx;
					color: #999999;
					text-decoration: line-through;
					margin-left: 15upx;
				}
			}

			.buy {
				display: flex;
				justify-content: flex-end;
				padding-top: 15upx;
				padding-bottom: 15upx;

				button {
					background-image: linear-gradient(90deg,
						#ea552d 0%,
						#f19837 100%),
						linear-gradient(#fd595a,
						#fd595a);
					font-size: 26upx;
					color: #ffffff;
					height: 50upx;
					line-height: 50upx;
					border-radius: 25upx 0 0 25upx;
					padding: 0 20upx;
				}
			}
		}
	}
</style>
