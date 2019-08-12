<template>
	<view>
		<view class="shop_info_box">
			<view class="shop_info">
				<view class="shop_img" @click="onPreviewImage(0, shopInfo.environmentImgs)">
					<image :src="shopInfo.logo" mode="aspectFill"></image>
					<text>{{ shopInfo.environmentImgs ? shopInfo.environmentImgs.length : 0 }}张</text>
				</view>
				<view class="info_box">
					<view class="name">{{ shopInfo.name }}</view>
					<view class="score_box">
						<view :class="{ active: shopInfo.score >= item }" v-for="(item, index) in 5" :key="index"></view>
						<text>{{ shopInfo.score }}分</text>
					</view>
					<view class="average">人均{{shopInfo.priceAverage}}</view>
					<view class="time"><view>营业时间 {{shopInfo.shopRunBegin}}-{{shopInfo.shopRunEnd}}</view> <text class="collection" :class="{'active':shopInfo.collection}" @click="onCollection"></text></view>
				</view>
			</view>
			<view class="cell_list">
				<view class="cell_left">
					<image src="../../static/icon/orderdetails_ads.png" mode="aspectFit"></image>
					<text>{{shopInfo.regionStr}}</text>
				</view>
				<view class="cell_right" @click="onPhoneCall(shopInfo.phone)"><image src="../../static/icon/orderdetails_phone.png" mode="aspectFit"></image></view>
			</view>
			<view class="cell_list" v-if="shopInfo.runWm" @click="onPageJump('/pages/delivery/shopDetail?objId='+shopInfo.objId)">
				<view class="cell_left">
					<image class="car" src="../../static/icon/groupbuy_ic1.png" mode="aspectFit"></image>
					<text>外卖</text>
				</view>
				<view class="cell_right arrow"></view>
			</view>
		</view>
		<view class="tab_box">
			<view :class="{'fixed':tabFixed}">
				<view :class="{'active':position == 1}" @click="onPosition(1)">商品信息</view>
				<view :class="{'active':position == 2}" @click="onPosition(2)">用户评价</view>
				<view :class="{'active':position == 3}" @click="onPosition(3)">商家信息</view>
			</view>
		</view>
		<view class="package_box" id="view1">
			<view>
				<view v-for="(item,index) of goodsList" :key="index">
					<view class="package_title">
						<image v-if="item.type == 1101" src="../../static/icon/icon_daijinquan.png" mode="aspectFit"></image>
						<image v-else-if="item.type == 1201" src="../../static/icon/groupbuy_ic2.png" mode="aspectFit"></image>
						<image v-else-if="item.type == 1102" src="../../static/icon/groupbuy_ic3.png" mode="aspectFit"></image>
						<image v-else-if="item.type == 1103" src="../../static/icon/groupbuy_ic4.png" mode="aspectFit"></image>
						{{item.name}}
					</view>
					<view class="package_list" :class="{'spike':item.type == 1102}" v-for="(childItem,childIndex) of item.goods" :key="childIndex" @click="onGoodsJump(item.type,childItem)">
						<view class="voucher_price_box" v-if="item.type == 1201">
							<view>{{item.priceDiscount}}</view>
							<view>代{{item.priceTotal}}元</view>
						</view>
						<image v-else="" :src="childItem.imgs[0]" mode="aspectFill"></image>
						<view class="voucher_info" v-if="item.type == 1201">
							<view class="info_box">
								<view class="name">{{childItem.name}}</view>
								<view class="info">{{childItem.useDateStr}} {{childItem.reserveStr}}</view>
							</view>
							<view class="arrow"></view>
						</view>
						<view class="package_info" v-else="">
							<view class="info_box">
								<view class="name">{{childItem.name}}</view>
							</view>
							<view class="info_box" v-if="item.spike">
								<view class="time" v-if="childItem.spikeBegin">倒计时 {{childItem.countdown}}</view>
								<view class="time" v-else="" >开始时间：{{childItem.spikeBeginTimeStr}}</view>
							</view>
							<view class="info_box">
								<view>{{childItem.useDateStr}} {{childItem.reserveStr}}</view>
								<view>剩余{{childItem.numBalance}}份 ></view>
							</view>
							<view class="price_box">
								<view class="price">
									<text v-if="item.spike">秒杀价:</text>
									{{childItem.priceDiscount}}
								</view>
								<view class="store" v-if="!item.spike">门市价：{{childItem.priceTotal}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="assess_box"  id="view2">
			<view class="title arrow" @click="onPageJump('/pages/groupBuy/assessList?objId='+shopInfo.objId)">
				用户评价（{{shopInfo.commentNum}}）
			</view>
			<evaluation-item v-for="(item, index) of commentList" :key="index" :item="item" :index="index"></evaluation-item>
			<view class="noData" v-if="noData">
				<image src="http://qn.kemean.cn/upload/201907/23/illustration3.png" mode="aspectFit"></image>
				<text>暂无评论</text>
			</view>
		</view>
		<view class="merchant_box" id="view3">
			<view class="title">
				商家信息
			</view>
			<view class="merchant_info_box">
				<view class="info_box">
					<image src="../../static/icon/ic_merchant2.png" mode=""></image>
					<view class="info">
						<view>营业时间</view>
						<text>周一至周五 {{shopInfo.shopRunBegin}} - {{shopInfo.shopRunEnd}}</text>
					</view>
				</view>
				<view class="info_box">
					<image src="../../static/icon/ic_merchant3.png" mode=""></image>
					<view class="info">
						<view>优惠信息</view>
						<text>· {{ shopInfo.discountStr }}</text>
					</view>
				</view>
				<view class="info_box">
					<image src="../../static/icon/groupbuy_ic_paper.png" mode=""></image>
					<view class="info">
						<view class="arrow" @click="onPreviewImage(0, shopInfo.qualificationImgs)">商家资质信息</view>
						<text>· 查看营业执照、商家店铺许可证</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import evaluationItem from '@/components/module/evaluation_item';
	import { mapState, mapMutations } from 'vuex';
export default {
	components:{
		evaluationItem
	},
	data() {
		return {
			objId:"",
			shopInfo:{},
			//位置
			position:1,
			scrollViewList:[],
			tabFixed:false,
			noData:false,
			//评论
			commentList:[],
			goodsList:[]
		};
	},
	//第一次加载
	onLoad(e) {
		if (e.objId) {
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
				.get('api/tg/shop/v1/info', {
					objId: this.objId
				})
				.then(res => {
					this.shopInfo = res;
					if(this.scrollViewList.length < 2){
						this.scrollViewList.push(0);
					}else{
						this.getViewScroll();
					}
				});
			this.$http
				.post('api/order/v2/comment_list', {
					shopId: this.objId,
					pageNo:1,
					pageSize:10,
					type:1501
				})
				.then(res => {
					this.commentList = res.data;
					if(this.scrollViewList.length < 2){
						this.scrollViewList.push(0);
					}else{
						this.getViewScroll();
					}
					if(res.data.length <= 0){
						this.noData = true;
					}
				});
				this.$http
					.get('api/tg/shop/v1/goods', {
						objId: this.objId,
					})
					.then(res => {
						this.goodsList = res;
						this.goodsList.map((item,index) => {
							item.goods.map((childItem,childIndex) => {
								if(childItem.spike){
									childItem.countdown = "";
									this.getCountdown(index,childIndex);
								}
								return childItem;
							});
							return item;
						});
						if(this.scrollViewList.length < 2){
							this.scrollViewList.push(0);
						}else{
							this.getViewScroll();
						}
					});	
		},
		//倒计时
		getCountdown(index,childIndex){
			let item = this.goodsList[index].goods[childIndex];
			let currentTime = new Date().getTime();
			if(currentTime < item.spikeEndTime){
				let differenceTime = parseInt((item.spikeEndTime - currentTime)/1000);
				let clear = setInterval(() => {
					differenceTime--;
					if(differenceTime <= 0){
						clearInterval(clear);
					}
					let day = parseInt(differenceTime / 86400);
					let time = parseInt((differenceTime - day*86400)/ 3600);
					let minute = parseInt((differenceTime- day*86400 -  time*3600)/60);
					let second = differenceTime- day*86400 -  time*3600 - minute*60;
					this.goodsList[index].goods[childIndex].countdown = day+"天 "+time+":"+minute+":"+second;
					this.$forceUpdate();
				},1000);
			}else{
				this.goodsList[index].goods[childIndex].countdown = "已结束";
			}
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
		// 拨打电话
		onPhoneCall(phone) {
			if (phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				});
			}
		},
		//页面跳转
		onPageJump(url){
			uni.navigateTo({
				url:url
			});
		},
		//商品跳转
		onGoodsJump(type,item){
			let url = "/pages/groupBuy/goodsDetail?objId="+item.objId
			if(type == 1201){
				url = "/pages/groupBuy/voucherDetail?objId="+item.objId
			}
			uni.navigateTo({
				url:url
			});
		},
		//位置跳转
		onPosition(val){
			uni.pageScrollTo({
				scrollTop: this.scrollViewList[val],
				duration: 200,
			});
			setTimeout(() => {
				this.position = val;
			},500);
		},
		//获取位置信息
		getViewScroll(){
			this.$nextTick(() => {
				//获取商品类型对应的top值
				var query = uni.createSelectorQuery();
				[1,2,3].forEach((item, index) => {
					query.select('#view' + item)
						.boundingClientRect(res => {
							this.scrollViewList[item] = res.top;
						})
						.exec();
				});
			});
		},
		//收藏
		onCollection(){
			this.$http
				.post('api/collect/v1/operate_data', {
					objIds: [this.shopInfo.objId],
					type:1101
				})
				.then(res => {
					let content = "";
					if(this.shopInfo.collection){
						this.shopInfo.collection = false;
						content = "取消收藏成功！"
					}else{
						this.shopInfo.collection = true;
						content = "收藏成功！"
					}
					uni.showToast({
						title:content
					});
				});
		}
	},
	//页面隐藏
	onHide() {},
	//页面卸载
	onUnload() {},
	onPageScroll(e) {
		if(e.scrollTop > this.scrollViewList[1]){
			this.tabFixed = true;
		} else {
			this.tabFixed = false;
		}
		if(e.scrollTop+50 > this.scrollViewList[3]){
			this.position = 3;
		}else if(e.scrollTop+50 > this.scrollViewList[2]){
			this.position = 2;
		} else {
			this.position = 1;
		}
	},
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
.shop_info_box {
	background-color: #ffffff;
	border-radius: 40upx;
	overflow: hidden;
	padding: 0 30upx;
	.shop_info {
		padding: 30upx 0;
		display: flex;
		align-items: flex-start;
		.shop_img {
			width: 200upx;
			height: 160upx;
			border-radius: 10upx;
			overflow: hidden;
			position: relative;
			flex-shrink: 0;
			image {
				width: 100%;
				height: 100%;
			}
			text {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 45upx;
				line-height: 45upx;
				background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
				text-align: right;
				font-size: 18upx;
				color: #ffffff;
				padding: 0 10upx;
				border-radius: 0 0 10upx 10upx;
			}
		}
		.info_box {
			margin-left: 30upx;
			width: calc(100% - 230upx);
			.name {
				font-size: 30upx;
				color: #333333;
			}
			.score_box {
				margin-top: 6upx;
				display: flex;
				align-items: center;
				view {
					width: 27upx;
					height: 26upx;
					background-image: url('../../static/icon/evaluation_star2.png');
					background-position: center center;
					background-repeat: no-repeat;
					background-size: 100% 100%;
					margin-right: 8upx;
					&.active {
						background-image: url('../../static/icon/evaluation_star1.png');
					}
				}
				text {
					font-size: 20upx;
					color: #333333;
					margin-left: 20upx;
				}
			}
			.average {
				margin-top: 6upx;
				font-size: 24upx;
				color: #666666;
			}
			.time {
				margin-top: 6upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				>view {
					font-size: 28upx;
					color: #666666;
					display: flex;
					align-items: center;
					&::before {
						content: '';
						width: 24upx;
						height: 24upx;
						background-image: url('../../static/icon/list_ic_time.png');
						background-position: center center;
						background-repeat: no-repeat;
						background-size: 100% 100%;
						margin-right: 10upx;
					}
				}
				.collection {
					width: 35upx;
					height: 32upx;
					background-image: url('../../static/icon/nav_ic_heart1.png');
					background-position: center center;
					background-repeat: no-repeat;
					background-size: 100% 100%;
					&.active {
						background-image: url('../../static/icon/nav_ic_heart2.png');
					}
				}
			}
		}
	}
	.cell_list {
		border-top: 1upx solid #f5f5f5;
		border-bottom: 0;
		padding-left: 0;
		padding-right: 0;
		.car {
			width: 41upx;
			height: 30upx;
		}
	}
}
.tab_box {
	margin-top: 20upx;
	background-color: #fff;
	border-radius: 40upx 40upx 0 0;
	height: 107upx;
	>view {
		background-color: #fff;
		display: flex;
		border-radius: 40upx 40upx 0 0;
		&.fixed {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			z-index: 2;
		}
		> view {
			flex: 1;
			height: 107upx;
			line-height: 107upx;
			text-align: center;
			font-size: 30upx;
			color: #333333;
			position: relative;
			&.active {
				color: #f19837;
				&::after {
					content: '';
					position: absolute;
					bottom: 15upx;
					left: 50%;
					transform: translateX(-50%);
					width: 30upx;
					height: 4upx;
					background-color: #f19837;
					border-radius: 2upx;
				}
			}
		}
	}
	
}
.package_box {
	background-color: #fff;
	border-radius: 0 0 40upx 40upx;
	> view {
		border-radius: 40upx;
		border-top: 1upx solid #f5f5f5;
		border-left: 1upx solid #f5f5f5;
		border-right: 1upx solid #f5f5f5;
		padding-left: 30upx;
		font-size: 26upx;
		color: #666666;
		padding-bottom: 30upx;
		padding-top: 20upx;
		.package_title {
			padding: 20upx 0 20upx 0;
			display: flex;
			align-items: center;
			image {
				width: 26upx;
				height: 26upx;
				margin-right: 15upx;
			}
		}
		.package_list {
			display: flex;
			background-color: #fcf9fc;
			border-radius: 10upx;
			margin-bottom: 20upx;
			&.spike {
				background-color: #fff6f3;
			}
			image {
				width: 160upx;
				height: 160upx;
				border-radius: 10upx;
				flex-shrink: 0;
			}
			.voucher_price_box {
				width: 160upx;
				height: 160upx;
				background-color: #f19837;
				border-radius: 10upx;
				flex-shrink: 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				view:nth-child(1){
					font-size: 48upx;
					color: #ffffff
				}
				view:nth-child(2){
					font-size: 26upx;
					color: #ffffff
				}
			}
			.voucher_info {
				width: calc(100% - 160upx);
				padding: 0 30upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.info_box {
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					height: 160upx;
					padding: 30upx 0;
					.name {
						font-size: 32upx;
						color: #333333;
						font-weight: bold;
					}
					.info {
						font-size: 24upx;
						color: #666666;
					}
				}
				.arrow {
					@include bis('http://qn.kemean.cn/upload/201907/23/me_lise_more.png', 100% 100%);
					width: 12upx;
					height: 22upx;
					margin-left: 20upx;
				}
			}
			.package_info {
				width: calc(100% - 160upx);
				padding: 15upx 30upx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.info_box {
					margin-bottom: 8upx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 24upx;
					color: #666666;
				}
				.name {
					font-size: 32upx;
					color: #333333;
					font-weight: bold;
				}
				.time {
					font-size: 24upx;
					color: #f19837;
					font-weight: bold;
				}
				.price_box {
					display: flex;
					align-items: center;
					.price {
						font-size: 32upx;
						color: #e84134;
						display: flex;
						align-items: center;
						text {
							font-size: 24upx;
							color: #e84134;
						}
					}
					.store {
						font-size: 20upx;
						color: #666666;
						margin-left: 30upx;
						text-decoration: line-through;
					}
				}
			}
		}
	}
}
.title {
	padding: 30upx 0;
	font-size: 30upx;
	color: #333333;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1upx solid #efefef;
	&.arrow::after {
		content: '';
		@include bis('http://qn.kemean.cn/upload/201907/23/me_lise_more.png', 100% 100%);
		width: 12upx;
		height: 22upx;
		margin-left: 20upx;
	}
}
.assess_box {
	border-radius: 40upx;
	margin-top: 16upx;
	background-color: #FFF;
	padding: 0 30upx;
}
.merchant_box {
	border-radius: 40upx;
	margin-top: 16upx;
	background-color: #FFF;
	padding: 0 30upx;
	.merchant_info_box {
		background-color: #ffffff;
		border-radius: 40upx;
		padding: 30upx 30upx 0 30upx;
		.info_box {
			display: flex;
			padding-bottom: 30upx;
			image {
				width: 36upx;
				height: 36upx;
				margin-right: 20upx;
			}
			.info {
				display: flex;
				flex-direction: column;
				view {
					font-size: 30upx;
					color: #333333;
					font-weight: bold;
					display: flex;
					align-items: center;
					&.arrow::after {
						content: '';
						@include bis('./../../static/icon/me_lise_more.png', 100% 100%);
						width: 12upx;
						height: 22upx;
						margin-left: 20upx;
					}
				}
				text {
					font-size: 26upx;
					color: #333333;
					margin-top: 10upx;
				}
			}
		}
	}
}
.noData {
		width: 100%;
		height: 40vh;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		image {
			width: 270upx;
			height: 240upx;
		}
		text {
			font-size: 28upx;
			color: #999;
			margin-top: 30upx;
		}
	}
</style>
