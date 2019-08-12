<template>
	<view>
		<!-- 模糊背景图 -->
		<view class="bg_blurry" :style="'background-image: url(' + shopInfo.logo + ');'"></view>
		<!-- 店铺信息 -->
		<view class="shop_info_box">
			<view class="shop_logo" @click="onPreviewImage(0, shopInfo.environmentImgs)">
				<image :src="shopInfo.logo" mode="aspectFill"></image>
				<text :class="{ active: shopInfo.shopRun }"></text>
				<view>{{ shopInfo.environmentImgs ? shopInfo.environmentImgs.length : 0 }}张</view>
			</view>
			<view class="shop_info">
				<view class="name">{{ shopInfo.name }}</view>
				<view class="score_box">
					<view :class="{ active: shopInfo.score >= item }" v-for="(item, index) in 5" :key="index"></view>
					<text>{{ shopInfo.score }}分</text>
				</view>
				<view class="notice">
					<view>{{ shopInfo.introduce }}</view>
				</view>
				<view class="favorable">
					<text v-for="(item, index) in shopInfo.fullDiscountMoney" :key="index">{{ item }}</text>
				</view>
			</view>
		</view>
		<!-- 导航条 -->
		<view class="shop_tab_box">
			<view :class="{ active: swiperIndex == 0 }" @click="swiperIndex = 0">点菜</view>
			<view :class="{ active: swiperIndex == 1 }" @click="swiperIndex = 1">评价({{ shopInfo.commentNum }})</view>
			<view :class="{ active: swiperIndex == 2 }" @click="swiperIndex = 2">商家</view>
		</view>
		<swiper class="shop_swiper" :duration="300" :current="swiperIndex" @change="onSwiperChange">
			<!-- 点菜 -->
			<swiper-item class="menu_box">
				<scroll-view scroll-y="true" class="menu_type_scroll">
					<!-- 菜单分类 -->
					<view :class="{ active: typeIndex == index }" v-for="(item, index) of typeGoodsList" :key="index" @click="onType(index)">{{ item.name }}</view>

					<view class="car_height"></view>
				</scroll-view>
				<!-- 菜单商品 -->
				<scroll-view scroll-y="true" :scroll-into-view="'view' + currentViewId" @scroll="onListScroll">
					<view class="menu_goods_box" v-for="(item, index) of typeGoodsList" :key="index" :id="'view' + index">
						<view class="menu_type">
							<image src="../../static/icon/repast/label.png" mode="aspectFit"></image>
							{{ item.name }}
						</view>

						<view class="menu_goods_list" v-for="(childItem, childIndex) of item.goods" :key="childIndex" @click="onOpenDetail(index, childIndex)">
							<image :src="childItem.imgs[0]" mode="aspectFill"></image>
							<view class="goods_info">
								<view class="name">{{ childItem.name }}</view>
								<view class="sales">月售{{ childItem.sale }}</view>
								<view class="description">{{ childItem.introduce }}</view>
								<view class="price_num_box">
									<view class="price">
										<view>¥{{ childItem.spceMinPrice }}</view>
										<text>¥{{ childItem.price }}</text>
									</view>
									<view class="num_box">
										<button class="reduce" v-if="childItem.buyNum > 0" @click.stop="onReduce(childItem.objId, childItem.spceId, childItem.buyNum)"></button>
										<text v-if="childItem.buyNum > 0">{{ childItem.buyNum }}</text>
										<button class="plus" @click.stop="addPlus(childItem.objId, childItem.spceId, childItem.buyNum)"></button>
									</view>
									<!-- <view class="select_spec">选规格</view> -->
								</view>
							</view>
						</view>
					</view>
					<view class="car_height"></view>
				</scroll-view>
			</swiper-item>
			<!-- 评价 -->
			<swiper-item>
				<scroll-view scroll-y="true" @scrolltolower="getComment" class="evaluation_box">
					<evaluation-item v-for="(item, index) of commentList" :key="index" :item="item" :index="index"></evaluation-item>
					<load-more text="还没有人评论喔~"></load-more>
				</scroll-view>
			</swiper-item>
			<!-- 商家 -->
			<swiper-item>
				<scroll-view scroll-y="true" class="merchant_box">
					<view class="cell_box">
						<view class="cell_list">
							<view class="cell_left">
								<image src="../../static/icon/orderdetails_ads.png" mode="aspectFit"></image>
								<text>{{ shopInfo.regionStr }}</text>
							</view>
							<view class="cell_right" @click="onPhoneCall(shopInfo.phone)"><image src="../../static/icon/orderdetails_phone.png" mode="aspectFit"></image></view>
						</view>
						<view class="cell_list" @click="onPreviewImage(0, shopInfo.qualificationImgs)">
							<view class="cell_left">
								<image src="../../static/icon/repast/ic_card.png" mode="aspectFit"></image>
								<text>查看营业执照、商家店铺许可证</text>
							</view>
							<view class="cell_right arrow"></view>
						</view>
					</view>
					<view class="merchant_info_box">
						<view class="info_box">
							<image src="../../static/icon/ic_merchant2.png" mode=""></image>
							<view class="info">
								<view>营业时间</view>
								<text>{{ shopInfo.shopRunBegin }} - {{ shopInfo.shopRunEnd }}</text>
							</view>
						</view>
						<view class="info_box line">
							<image src="../../static/icon/ic_merchant3.png" mode=""></image>
							<view class="info">
								<view>满减优惠信息</view>
								<text v-for="(item, index) of shopInfo.fullDiscountMoney" :key="index">· {{ item }}</text>
							</view>
						</view>
						<view class="info_box">
							<image src="../../static/icon/repast/ic_merchant4.png" mode=""></image>
							<view class="info">
								<view>折扣信息</view>
								<text>· {{ shopInfo.discountStr }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<!-- 遮罩层 -->
		<view
			class="mask"
			v-if="shopCarOpen || goodsDetailOpen"
			@click="
				shopCarOpen = false;
				goodsDetailOpen = false;
			"
		></view>
		<!-- 购物车 -->
		<view class="shop_car_box" v-if="shopCarShow">
			<view class="car_box" :class="{ active: shopCarInfo.packNumTotal > 0 }" @click="onOpenShopCar">
				<text v-if="shopCarInfo.packNumTotal > 0">{{ shopCarInfo.packNumTotal }}</text>
			</view>
			<view class="price" v-if="shopCarInfo.packNumTotal > 0">
				<view>￥{{ shopCarInfo.payPrice }}</view>
				<text>另需配送费{{ shopCarInfo.deliveryPrice }}元</text>
			</view>
			<view class="shop_car_no_data" v-else="">购物车是空的</view>
			<view class="pickUp" v-if="shopCarInfo.differencePrice > 0">还差{{ shopCarInfo.differencePrice }}元起送</view>
			<button class="active" v-else-if="shopCarInfo.packNumTotal > 0" @click="onBuy">去结算</button>
		</view>
		<!-- 购物车展开 -->
		<view class="shop_car_goods_box" v-if="shopCarOpen">
			<view class="shop_car_title">
				<view>已选商品</view>
				<text @click="onEmptyShopCar">清空</text>
			</view>
			<view class="shop_car_goods_list" v-for="(item, index) of shopCarList" :key="index">
				<view class="name">{{ item.goodsName }}</view>
				<view class="goods_price">￥{{ item.goodsSpecPrice }}</view>
				<view class="num_box">
					<button class="reduce" @click="onReduce(item.goodsId, item.goodsSpecId, item.goodsNum)"></button>
					<text>{{ item.goodsNum }}</text>
					<button class="plus" @click="addPlus(item.goodsId, item.goodsSpecId, item.goodsNum)"></button>
				</view>
			</view>
		</view>
		<!-- 商品详情展开 -->
		<view class="goods_detail_box" v-if="goodsDetailOpen">
			<view class="close" @click="goodsDetailOpen = false"></view>
			<scroll-view scroll-y="true">
				<swiper
					class="detail_swiper"
					:indicator-dots="true"
					:autoplay="true"
					:interval="3000"
					:duration="1000"
					indicator-color="rgba(255, 255, 255, .3)"
					indicator-active-color="#FFF"
				>
					<swiper-item v-for="(item, index) of detailInfo.imgs" :key="index">
						<image :src="item" mode="aspectFill" @click="onPreviewImage(index, detailInfo.imgs)"></image>
					</swiper-item>
				</swiper>
				<view class="goods_info">
					<view class="name">
						<view>{{ detailInfo.name }}</view>
						<text>月售{{ detailInfo.sale }}</text>
					</view>
					<view class="price">
						<view>¥{{ detailInfo.price }}</view>
						<text>¥{{ detailInfo.spceMinPrice }}</text>
					</view>
					<view class="num_box">
						<button class="reduce" v-if="detailInfo.buyNum > 0" @click="onReduce(detailInfo.objId, detailInfo.spceId, detailInfo.buyNum, 'detail')"></button>
						<text v-if="detailInfo.buyNum > 0">{{ detailInfo.buyNum }}</text>
						<button class="plus" @click="addPlus(detailInfo.objId, detailInfo.spceId, detailInfo.buyNum, 'detail')"></button>
						<!-- <view class="select_spec">选规格</view> -->
					</view>
					<view class="content">{{ detailInfo.introduce }}</view>
				</view>
				<view class="car_height"></view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import evaluationItem from '@/components/module/evaluation_item';
export default {
	components: {
		evaluationItem
	},
	data() {
		return {
			//swiper显示索引
			swiperIndex: 0,
			//购物车导航显示
			shopCarShow: true,
			//购物车展开
			shopCarOpen: false,
			//商品详情
			goodsDetailOpen: false,
			//商品详情数据
			detailInfo: {},
			//评论
			comments: [],
			//店铺信息

			shopInfo: {
				commentNum: 0
			},

			//商品类型列表
			typeGoodsList: [],
			//当前视图类型
			typeIndex: 0,
			//视图位置信息
			scrollViewList: [],
			//当前视图Id
			currentViewId: '',
			shopCarInfo: {
				beginPrice: 0,
				differencePrice: 0,
				packNumTotal: 0,
				deliveryPrice: 0,
				payPrice: 0,
				shoppingCardPrice: 0
			},
			//购物车商品
			shopCarList: [],
			//评论列表
			commentList: [],
			// 评论第一页
			pageNo: 1,
			// 评论总页数默认第一页
			pages: 1,
			//数据请求完成
			dataRequest: false
		};
	},
	//第一次加载
	onLoad(e) {
		if (e.objId) {
			this.objId = e.objId;
			this.pageData();
			this.getComment();
		}
	},
	//页面显示
	onShow() {},
	//方法
	methods: {
		//Swiper改变
		onSwiperChange(e) {
			this.swiperIndex = e.detail.current;
			this.shopCarOpen = false;
			if (e.detail.current == 0) {
				this.shopCarShow = true;
			} else {
				this.shopCarShow = false;
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
		//分类点击
		onType(index) {
			this.typeIndex = index;
			this.currentViewId = index;
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
		//商品列表滚动
		onListScroll(e) {
			if (this.scrollViewList.length > 0) {
				for (let index in this.scrollViewList) {
					if (this.scrollViewList[index] > e.detail.scrollTop) {
						this.typeIndex = index - 1;
						this.currentViewId = '';
						break;
					}
				}
			}
		},
		//
		pageData() {
			this.$http
				.get('api/wm/shop/v1/info', {
					objId: this.objId
				})
				.then(res => {
					this.shopInfo = res;
					if (this.dataRequest) {
						if (this.$store.state.userInfo.token && this.shopInfo.shopRun) {
							this.getShopCarList();
						}
					} else {
						this.dataRequest = true;
					}
				});
			this.$http
				.get('api/wm/shop/v1/goods', {
					shopId: this.objId
				})
				.then(res => {
					res.map(item => {
						item.goods.map(childItem => {
							childItem.buyNum = 0;
							return childItem;
						});
						return item;
					});
					this.typeGoodsList = res;
					if (this.dataRequest) {
						if (this.$store.state.userInfo.token && this.shopInfo.shopRun) {
							this.getShopCarList();
						}
					} else {
						this.dataRequest = true;
					}
					// 当dom发生变化，更新后执行的回调
					this.$nextTick(() => {
						//获取商品类型对应的top值
						var query = uni.createSelectorQuery();
						let viewheight = [];
						
						res.forEach((item, index) => {
							query
								.select('#view' + index)
								.boundingClientRect(res => {
									let currentHeight = 0;
									
									viewheight.forEach((childItem, childIndex) => {
										if (childIndex < index) {
											currentHeight += childItem;
										}
									});
									this.scrollViewList[index] = currentHeight;
									viewheight[index] = res.height;
								})
								.exec();
						});
						
					});
				});
		},
		//加入购物车
		addPlus(goodsId, specId, buyNum, type) {
			if (this.shopInfo.shopRun) {
				this.judgeLogin('judge', () => {
					this.$http
						.post('api/wm/shop/cart/v1/operate', {
							shopId: this.objId,
							goodsId: goodsId,
							specId: specId,
							num: buyNum + 1
						})
						.then(res => {
							this.shopCarInfo = res;
							this.shopCarList = res.cardGoods;
							this.setGoodsNum(res.cardGoods);
							if (type == 'detail') {
								this.detailInfo.buyNum += 1;
							}
						});
				});
			} else {
				uni.showToast({
					title: '该店铺已打样',
					icon: 'none'
				});
			}
		},
		//数量减
		onReduce(goodsId, specId, buyNum, type) {
			if (this.shopInfo.shopRun) {
				this.judgeLogin('judge', () => {
					this.$http
						.post('api/wm/shop/cart/v1/operate', {
							shopId: this.objId,
							goodsId: goodsId,
							specId: specId,
							num: buyNum - 1
						})
						.then(res => {
							this.shopCarInfo = res;
							this.shopCarList = res.cardGoods;
							this.setGoodsNum(res.cardGoods);
							if (type == 'detail') {
								this.detailInfo.buyNum -= 1;
							}
						});
				});
			} else {
				uni.showToast({
					title: '该店铺已打样',
					icon: 'none'
				});
			}
		},
		//获取价格
		setGoodsNum(data) {
			this.typeGoodsList.map((item, index) => {
				item.goods.map((childItem, childIndex) => {
					let state = false;
					data.forEach(shopItem => {
						if (shopItem.goodsId == childItem.objId && shopItem.goodsSpecId == childItem.spceId) {
							state = true;
							childItem.buyNum = shopItem.goodsNum;
						}
					});
					if (!state) {
						childItem.buyNum = 0;
					}
					return childItem;
				});
				return item;
			});
			if (data.length <= 0) {
				this.shopCarOpen = false;
			}
		},
		//获取购物车列表
		getShopCarList(callback) {
			this.$http
				.get('api/wm/shop//cart/v1/mine', {
					shopId: this.objId
				})
				.then(res => {
					this.setGoodsNum(res.cardGoods);
					this.shopCarInfo = res;
					this.shopCarList = res.cardGoods;
					callback && callback(res);
				});
		},
		//打开购物车
		onOpenShopCar() {
			if (this.shopCarOpen) {
				this.shopCarOpen = false;
			} else if (this.shopCarList.length > 0) {
				this.shopCarOpen = true;
				this.goodsDetailOpen = false;
			}
		},
		//清空购物车
		onEmptyShopCar() {
			this.$http
				.get('api/wm/shop/cart/v1/clean', {
					shopId: this.objId
				})
				.then(res => {
					this.typeGoodsList.map((item, index) => {
						item.goods.map((childItem, childIndex) => {
							childItem.buyNum = 0;
							return childItem;
						});
						return item;
					});
					this.shopCarInfo = {
						beginPrice: 0,
						differencePrice: 0,
						packNumTotal: 0,
						deliveryPrice: 0,
						payPrice: 0,
						shoppingCardPrice: 0
					};
					this.shopCarList = [];
					this.shopCarOpen = false;
				});
		},
		//打开详情
		onOpenDetail(index, childIndex) {
			let item = this.typeGoodsList[index].goods[childIndex];
			this.detailInfo = item;
			this.goodsDetailOpen = true;
		},
		//获取评论
		getComment() {
			if (this.pageNo <= this.pages) {
				var httpData = {
					pageNo: this.pageNo,
					pageSize: 10,
					shopId: this.objId,
					type: 1401
				};
				this.$http
					.post('api/order/v2/comment_list', httpData, {
						load: false
					})
					.then(res => {
						uni.stopPullDownRefresh();
						this.pages = res.pages;
						if (this.pageNo == 1) {
							this.commentList = res.data;
						} else {
							this.commentList = this.commentList.concat(res.data);
						}

						if (res.data.length > 0) {
							this.pageNo = this.pageNo + 1;
						}
					});
			}
		},
		//下单
		onBuy() {
			if (this.shopInfo.shopRun) {
				if (this.shopCarList.length > 0) {
					console.log(42543543);
					uni.navigateTo({
						url: '/pages/delivery/confirmOrder?objId=' + this.objId
					});
				}
			} else {
				uni.showToast({
					title: '该店铺已打样',
					icon: 'none'
				});
			}
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
// 取消滚动条
scroll-view {
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}
}

.bg_blurry {
	background-image: url('../../static/images/1.jpg');
	background-position: center center;
	background-repeat: no-repeat;
	background-size: cover;
	height: 270upx;
	overflow: hidden;
	filter: blur(15upx);
	position: absolute;
	left: 0;
	width: 100%;
}
.shop_info_box {
	padding: 30upx;
	display: flex;
	align-items: center;
	position: relative;
	z-index: 2;
	height: 280upx;
	.shop_logo {
		width: 200upx;
		height: 160upx;
		border-radius: 10upx;
		position: relative;
		flex-shrink: 0;
		image {
			width: 100%;
			height: 100%;
			border-radius: 10upx;
		}
		view {
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
		text {
			position: absolute;
			left: -10upx;
			top: -10upx;
			background-image: url('../../static/icon/repast/subscript_ic2.png');
			background-position: center center;
			background-repeat: no-repeat;
			background-size: cover;
			width: 128upx;
			height: 133upx;
			&.active {
				background-image: url('../../static/icon/repast/subscript_ic1.png');
			}
		}
	}
	.shop_info {
		margin-left: 30upx;
		width: calc(100% - 230upx);
		.name {
			font-size: 30upx;
			color: #ffffff;
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
				color: #ffffff;
				margin-left: 30upx;
			}
		}
		.notice {
			margin-top: 6upx;
			overflow: hidden;
			height: 36upx;
			position: relative;
			view {
				position: absolute;
				font-size: 24upx;
				color: #ffffff;
				width: auto;
				white-space: nowrap;
				animation: marquee 10s infinite linear;
				@keyframes marquee {
					from {
						transform: translateX(-100%);
					}
					to {
						transform: translateX(100%);
					}
				}
			}
		}
		.favorable {
			display: flex;
			flex-wrap: wrap;
			text {
				background-color: rgba(254, 234, 228, 0.4);
				border-radius: 6upx;
				border: solid 1upx #ea552d;
				font-size: 20upx;
				height: 32upx;
				line-height: 32upx;
				color: #ea552d;
				padding: 0upx 10upx;
				margin-right: 12upx;
				margin-top: 6upx;
				margin-bottom: 6upx;
			}
		}
	}
}
.shop_tab_box {
	position: relative;
	z-index: 2;
	height: 110upx;
	background-color: #fff;
	display: flex;
	justify-content: space-around;
	align-items: center;
	border-radius: 40upx 40upx 0 0;
	view {
		font-size: 30upx;
		color: #333333;
		position: relative;
		padding-bottom: 10upx;
		&.active::after {
			content: '';
			position: absolute;
			bottom: -10upx;
			left: 50%;
			transform: translateX(-50%);
			width: 30upx;
			height: 4upx;
			background-color: #f19837;
			border-radius: 2upx;
		}
	}
}
.shop_swiper {
	background-color: #fff;
	height: calc(100vh - 390upx);
	swiper-item {
		width: 100%;
		border-radius: 40upx 40upx 0 0;
		border: solid 2upx #f8f8f8;
		box-sizing: border-box;
		height: 100%;
	}
	scroll-view {
		height: 100%;
	}
}
.car_height {
	height: 150upx;
}
// 菜单
.menu_box {
	display: flex;
	.menu_type_scroll {
		background-color: #f8f8f8;
		width: 180upx;
		flex-shrink: 0;

		view {
			text-align: center;
			height: 114upx;
			padding: 0 10upx;
			font-size: 28upx;
			color: #666666;
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: bold;
			&.active {
				color: #f19837;
			}
		}
	}
	.menu_goods_box {
		width: calc(100vw - 180upx);
		.menu_type {
			height: 70upx;
			padding: 0 30upx;
			display: flex;
			align-items: center;
			font-size: 30upx;
			color: #ea552d;
			image {
				width: 27upx;
				height: 27upx;
				margin-right: 15upx;
			}
		}
		.menu_goods_list {
			background-color: #fcf9fc;
			border-radius: 10upx;
			padding: 20upx 30upx 20upx 0;
			display: flex;
			margin-bottom: 20upx;
			image {
				width: 160upx;
				height: 160upx;
				border-radius: 10upx;
			}
			.goods_info {
				margin-left: 20upx;
				width: calc(100% - 180upx);
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.name {
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 30upx;
					color: #333333;
					font-weight: bold;
				}
				.sales {
					font-size: 20upx;
					color: #666666;
					margin-top: 10upx;
				}
				.description {
					font-size: 24upx;
					color: #666666;
					margin-top: 10upx;
					@include bov();
				}
				.price_num_box {
					margin-top: 10upx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.price {
						display: flex;
						align-items: flex-end;
						view {
							font-size: 32upx;
							color: #e84134;
						}
						text {
							font-size: 20upx;
							color: #666666;
							text-decoration: line-through;
							margin-left: 15upx;
							padding-bottom: 6upx;
						}
					}
					.num_box {
						display: flex;
						align-items: center;
						button {
							width: 39upx;
							height: 39upx;
							background-color: transparent;
							background-position: center center;
							background-repeat: no-repeat;
							background-size: 100% 100%;
						}
						.reduce {
							background-image: url('../../static/icon/repast/ic_-.png');
						}
						.plus {
							background-image: url('../../static/icon/repast/ic_+.png');
						}
						text {
							width: 50upx;
							text-align: center;
							font-size: 30upx;
							color: #333;
						}
					}
					.select_spec {
						width: 110upx;
						height: 46upx;
						border-radius: 23upx;
						border: solid 2upx #f19837;
						font-size: 24upx;
						text-align: center;
						line-height: 46upx;
						color: #f19837;
						position: relative;
						text {
							position: absolute;
							top: -16upx;
							right: -16upx;
							width: 32upx;
							height: 32upx;
							background-color: #ea552d;
							border-radius: 50%;
							text-align: center;
							line-height: 32upx;
							font-size: 22upx;
							color: #ffffff;
						}
					}
				}
			}
		}
	}
}
.shop_car_box {
	position: fixed;
	bottom: 10upx;
	left: 30upx;
	right: 30upx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 100upx;
	background-color: #3a3635;
	border-radius: 50upx;
	padding-left: 180upx;
	z-index: 5;
	> .car_box {
		position: absolute;
		left: 30upx;
		bottom: 20upx;
		width: 110upx;
		height: 95upx;
		background-color: transparent;
		background-position: center center;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url('../../static/icon/repast/ic_shoppingcart2.png');
		&.active {
			background-image: url('../../static/icon/repast/ic_shoppingcart1.png');
		}
		text {
			position: absolute;
			top: 0upx;
			right: -10upx;
			width: 36upx;
			height: 36upx;
			background-color: #ea552d;
			border-radius: 50%;
			text-align: center;
			line-height: 36upx;
			font-size: 24upx;
			color: #ffffff;
		}
	}
	> .price {
		display: flex;
		flex-direction: column;
		view {
			font-size: 34upx;
			color: #ffffff;
		}
		text {
			font-size: 20upx;
			color: #ffffff;
		}
	}
	.shop_car_no_data {
		font-size: 28upx;
		color: #ffffff;
	}
	.pickUp {
		font-size: 28upx;
		color: #ffffff;
		padding-right: 30upx;
	}
	> button {
		width: 220upx;
		height: 100upx;
		line-height: 100upx;
		border-radius: 50upx;
		background-image: linear-gradient(90deg, #999 0%, #bbb 100%);
		&.active {
			background-image: linear-gradient(90deg, #ea552d 0%, #f19837 100);
			color: #fff;
		}
	}
}
.shop_car_goods_box {
	position: absolute;
	bottom: 60upx;
	left: 30upx;
	right: 30upx;
	background-color: #ffffff;
	border-radius: 40upx 40upx 0upx 0upx;
	z-index: 4;
	padding-bottom: 60upx;
	animation: shop_car_animation 0.4s;
	@keyframes shop_car_animation {
		0% {
			opacity: 0;
			transform: translateY(100%);
		}
		100% {
			opacity: 1;
			transform: translateY(0%);
		}
	}
	.shop_car_title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30upx;
		view {
			font-size: 30upx;
			color: #333333;
			display: flex;
			align-items: center;
			&::before {
				content: '';
				width: 10upx;
				height: 30upx;
				background-image: linear-gradient(90deg, #ea552d 0%, #f19837 100%), linear-gradient(#3a3635, #3a3635);
				border-radius: 5upx;
				margin-right: 15upx;
			}
		}
		text {
			font-size: 24upx;
			color: #333333;
			display: flex;
			align-items: center;
			&::before {
				content: '';
				width: 30upx;
				height: 30upx;
				margin-right: 15upx;
				@include bis('../../static/icon/search_ic_close.png', 100% 100%);
			}
		}
	}
	.shop_car_goods_list {
		padding: 0 30upx 30upx 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.name {
			font-size: 26upx;
			color: #333333;
			width: 330upx;
		}
		.goods_price {
			font-size: 26upx;
			color: #e84134;
		}
		.num_box {
			display: flex;
			align-items: center;
			button {
				width: 39upx;
				height: 39upx;
				background-color: transparent;
				background-position: center center;
				background-repeat: no-repeat;
				background-size: 100% 100%;
			}
			.reduce {
				background-image: url('../../static/icon/repast/ic_-.png');
			}
			.plus {
				background-image: url('../../static/icon/repast/ic_+.png');
			}
			text {
				width: 50upx;
				text-align: center;
				font-size: 30upx;
				color: #333;
			}
		}
	}
}
.mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 2;
}
// 商家
.merchant_box {
	background-color: #f5f5f5;
	.cell_box {
		padding: 0 30upx;
		background-color: #fff;
		border-radius: 0 0 40upx 40upx;
		.cell_list {
			padding-left: 0;
			padding-right: 0;
		}
	}
	.merchant_info_box {
		background-color: #ffffff;
		border-radius: 40upx;
		margin-top: 20upx;
		padding: 30upx 30upx 0 30upx;
		.info_box {
			display: flex;
			padding-bottom: 30upx;
			&.line {
				border-top: 1upx solid #efefef;
				padding-top: 30upx;
			}
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
.evaluation_box {
	padding: 30upx;
}
// 商品详情
.goods_detail_box {
	position: fixed;
	top: 10%;
	left: 0;
	bottom: 0;
	width: 100%;
	z-index: 3;
	background-color: #fff;
	border-radius: 40upx 40upx 0 0;
	.close {
		position: absolute;
		right: 30upx;
		top: 30upx;
		width: 50upx;
		height: 50upx;
		@include bis('../../static/icon/search_ic_close.png', 100% 100%);
		z-index: 10;
	}
	scroll-view {
		height: 100%;
		.detail_swiper {
			width: 100%;
			height: 400upx;
			border-radius: 40upx 40upx 0 0;
			image {
				border-radius: 40upx 40upx 0 0;
				width: 100%;
				height: 400upx;
			}
		}
		.goods_info {
			padding: 30upx;
			.name {
				display: flex;
				align-items: center;
				justify-content: space-between;
				view {
					font-size: 36upx;
					color: #333333;
					font-weight: bold;
				}
				text {
					font-size: 24upx;
					color: #666666;
					flex-shrink: 0;
				}
			}
			.price {
				display: flex;
				align-items: flex-end;
				margin-top: 40upx;
				view {
					font-size: 36upx;
					color: #e84134;
				}
				text {
					font-size: 20upx;
					color: #666666;
					text-decoration: line-through;
					margin-left: 20upx;
					padding-bottom: 10upx;
				}
			}
			.num_box {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				button {
					width: 39upx;
					height: 39upx;
					background-color: transparent;
					background-position: center center;
					background-repeat: no-repeat;
					background-size: 100% 100%;
				}
				.reduce {
					background-image: url('../../static/icon/repast/ic_-.png');
				}
				.plus {
					background-image: url('../../static/icon/repast/ic_+.png');
				}
				text {
					width: 50upx;
					text-align: center;
					font-size: 30upx;
					color: #333;
				}
			}
			.select_spec {
				width: 110upx;
				height: 46upx;
				border-radius: 23upx;
				border: solid 2upx #f19837;
				font-size: 24upx;
				text-align: center;
				line-height: 46upx;
				color: #f19837;
				position: relative;
				text {
					position: absolute;
					top: -16upx;
					right: -16upx;
					width: 32upx;
					height: 32upx;
					background-color: #ea552d;
					border-radius: 50%;
					text-align: center;
					line-height: 32upx;
					font-size: 22upx;
					color: #ffffff;
				}
			}
			.content {
				font-size: 24upx;
				color: #666666;
				line-height: 180%;
				margin-top: 30upx;
			}
		}
	}
}
</style>
