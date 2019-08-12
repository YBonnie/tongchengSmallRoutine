<template>
	<view>
		<!-- 查询框 -->
		<view class="search_box" :class="{ active: searchActive }">
			<picker @change="regionChange" :value="regionIndex" :range="regionList" range-key="name">
				<view class="region_box">
					{{regionList[regionIndex].name}}
				</view>
			</picker>
			<view class="head_seach" @click="onPageJump('/pages/delivery/search')">店铺名称</view>
		</view>
		<!-- banner -->
		<swiper class="banner_swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000"
		 indicator-color="rgba(255, 255, 255, .3)" indicator-active-color="#FFF">
			<swiper-item v-for="(item, index) of bannerList" :key="index">
				<image :src="item.imgUrl" mode="aspectFill" @click="onBanner(item)"></image>
			</swiper-item>
		</swiper>
		<!-- 导航栏 -->
		<swiper class="menu_swiper" :class="{ active: menuList.length == 1 && menuList[0].length <= 5 }" :indicator-dots="false"
		 :duration="1000" indicator-color="rgba(243,152,1,0.3)" indicator-active-color="#f39801">
			<swiper-item v-for="(item, index) of menuList" :key="index">
				<view class="nav_box">
					<view class="navs" v-for="(childItem, childIndex) of item" :key="childIndex" @click="onPageJump('/pages/delivery/shopList?typeId=' + childItem.objId)">
						<image :src="childItem.iconUrl" mode="aspectFill"></image>
						<text>{{ childItem.name }}</text>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<!-- 附近商家 -->
		<view class="nearby_shops_box">
			<view class="title">
				<image src="http://qn.kemean.cn/upload/201907/23/takeaway_ic2.png" mode="aspectFill"></image>
				<text>附近商家</text>
			</view>
			<view class="menu_box">
				<view :class="{ active: menuType == 3000 }" @click="onSelectMenuType(3000)">综合排序</view>
				<view :class="{ active: menuType == 3003 }" @click="onSelectMenuType(3003)">销量最高</view>
				<view :class="{ active: menuType == 3004 }" @click="onSelectMenuType(3004)">距离最近</view>
			</view>
			<view class="shop_list">
				<shop-item v-for="(item, index) of shopsLists" :key="index" :item="item" type="delivery"></shop-item>
			</view>
		</view>
		<load-more text="暂无店铺~"></load-more>
		<z-login ref="login"></z-login>
		<view class="video_box" v-if="videoShow" @click="onCloseVideo"><video :src="videoUrl" autoplay="true" controls></video></view>
	</view>
</template>

<script>
	import shopItem from '@/components/module/shop_item';
	import zLogin from '@/components/module/login';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	// #ifdef H5
	import {
		getBrowser
	} from '@/config/html5Utils';
	import {
		getLocation
	} from '@/config/wxJsSDK';
	// #endif
	export default {
		components: {
			zLogin,
			shopItem
		},
		data() {
			return {
				//轮播图
				bannerList: [],
				//菜单
				menuList: [],
				//搜索框激活
				searchActive: false,
				// 菜单选择
				menuType: 3000,
				pageNo: 1,
				pages: 1,
				// 商铺列表
				shopsLists: [],
				videoUrl: '',
				videoShow: false,
				//地区列表
				regionList:[]
			};
		},
		computed: {
			...mapState(['currentAddress','regionIndex'])
		},
		//第一次加载
		onLoad(e) {
			this.regionList = this.$base.regionList;
			// #ifdef MP-WEIXIN
			uni.authorize({
				scope: 'scope.userLocation'
			});
			// #endif
			this.pageData();
			this.loadData();
		},
		//页面显示
		onShow() {},
		//方法
		methods: {
			...mapMutations(['setCurrentAddress','setRegionIndex']),
			pageData() {
				// 轮播图接口
				this.$http
					.post('api/open/v1/lunbo', {
						locatType: 1102
					})
					.then(res => {
						this.bannerList = res;
					});
				// menu的接口
				this.$http
					.post('api/open/v1/shop_type', {
						wm: true
					})
					.then(res => {
						let menuList = [];
						res.forEach((item, index) => {
							let ten = parseInt(index / 10);
							if (menuList.length <= ten) {
								menuList[ten] = [];
							}
							menuList[ten].push(item);
						});
						this.menuList = menuList;
					});
			},
			// 关闭视频
			onCloseVideo() {
				this.videoShow = false;
			},
			//地区选择
			regionChange(e){
				this.setRegionIndex(e.detail.value);
				this.pageNo = 1;
				this.pages = 1;
				this.loadData();
			},
			// 轮播图点击
			onBanner(item) {
				if (item.jumpType == 1401) {
					uni.navigateTo({
						url: '/pages/home/goodsDetail?objId=' + item.jumpRecord.id
					});
				} else if (item.jumpType == 1402) {
					uni.navigateTo({
						url: '/pages/repast/shopDetail?objId=' + item.jumpRecord.id
					});
				} else if (item.jumpType == 1201) {
					this.setWebViewUrl(item.jumpRecord.webViewUrl);
					uni.navigateTo({
						url: '/pages/home/webView'
					});
				} else if (item.jumpType == 1301) {
					this.videoUrl = item.jumpRecord.videoUrl;
					this.videoShow = true;
				}
			},
			loadData() {
				if (this.pageNo <= this.pages) {
					let httpData = {
						pageNo: this.pageNo,
						pageSize: 15,
						sortType: this.menuType
					};
					if (this.currentAddress.longitude) {
						httpData.latitude = this.currentAddress.latitude;
						httpData.longitude = this.currentAddress.longitude;
					} else {
						this.getLatLon(() => {
							httpData.latitude = this.currentAddress.latitude;
							httpData.longitude = this.currentAddress.longitude;
						});
					}
					httpData.areaId = this.regionList[this.regionIndex].objId;
					this.$http
						.post('api/wm/shop/v1/list', httpData, {
							load: false
						})
						.then(res => {
							uni.stopPullDownRefresh();
							this.pages = res.pages;
							res.data.map(item => {
								item.shopType = 1101;
								return item;
							});
							if (this.pageNo == 1) {
								this.shopsLists = res.data;
								this.$forceUpdate();
							} else {
								this.shopsLists = this.shopsLists.concat(res.data);
							}
							if (res.data.length > 0) {
								this.pageNo = this.pageNo + 1;
							}
						});
				}
			},
			// 获取地址信息
			getLatLon(callback) {
				const _this = this;
				// #ifdef MP-WEIXIN
				uni.getSetting({
					success: res => {
						if (res.authSetting['scope.userLocation']) {
							uni.getLocation({
								type: 'gcj02',
								success: res => {
									this.setCurrentAddress({
										latitude: res.latitude,
										longitude: res.longitude
									});
									callback && callback();
								}
							});
						} else {
							uni.showModal({
								title: '提示',
								content: '请先在设置页面打开“位置信息”使用权限',
								confirmText: '去设置',
								cancelText: '再逛会',
								success: res => {
									if (res.confirm) {
										uni.openSetting();
									}
								}
							});
						}
					}
				});
				// #endif
				// #ifdef H5
				if (getBrowser() == '微信') {
					getLocation(res => {
						_this.setCurrentAddress({
							longitude: res.longitude,
							latitude: res.latitude
						});
						callback && callback();
					});
				} else {
					var geolocation = new qq.maps.Geolocation();
					geolocation.getIpLocation(
						function(position) {
							_this.setCurrentAddress({
								longitude: position.lng,
								latitude: position.lat
							});
							callback && callback();
						},
						function(err) {}
					);
				}
				// #endif
			},
			// 页面跳转
			onPageJump(urlPath) {
				uni.navigateTo({
					url: urlPath
				});
			},
			// menu选择
			onSelectMenuType(menuType) {
				this.menuType = menuType;
				this.pageNo = 1;
				this.loadData();
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
		onPageScroll(e) {
			if (e.scrollTop > 100) {
				this.searchActive = true;
			} else {
				this.searchActive = false;
			}
		},
		//用户点击分享
		onShareAppMessage(e) {
			return this.$base.share();
		}
	};
</script>
<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.video_box {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #000;
		display: flex;
		align-items: center;
		justify-content: center;

		video {
			width: 100%;
		}
	}

	.search_box {
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		height: 100upx;
		line-height: 100upx;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30upx;

		&.active {
			background-color: #fff;
			border-bottom: 1upx solid #f1f1f1;
		}

		.region_box {
			font-size: 30upx;
			color: #333333;
			flex-shrink: 0;
			margin-right: 30upx;
			display: flex;
			align-items: center;

			&::after {
				content: "";
				@include bis('http://qn.kemean.cn/upload/201907/23/home_ic_more.png', 100% 100%);
				width: 20upx;
				height: 15upx;
				margin-left: 10upx;
			}
		}

		.head_seach {
			display: block;
			height: 58upx;
			flex: 1;
			background-color: rgba(0, 0, 0, 0.4);
			line-height: 58upx;
			border-radius: 28upx;
			padding-left: 68upx;
			box-sizing: border-box;
			font-size: 28upx;
			color: #fff;
			background-image: url('https://qn.kemean.cn/upload/201904/29/7d398a475ef3428fab28970318209364');
			background-size: 28upx;
			background-repeat: no-repeat;
			background-position: 20upx center;

			&::-webkit-input-placeholder {
				color: #fff;
				font-size: 28upx;
			}
		}
	}

	.banner_swiper {
		height: 300upx;

		image {
			width: 100%;
			height: 300upx;
		}
	}

	.video_box {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #000;
		display: flex;
		align-items: center;
		justify-content: center;

		video {
			width: 100%;
		}
	}

	// nav
	.menu_swiper {
		height: 380upx;
		padding-bottom: 20upx 0 0;
		background-color: #fff;

		&.active {
			height: 200upx;
		}

		.nav_box {
			margin: 30upx 35upx 0 35upx;
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
			border-bottom: 1upx solid #ededed;

			.navs {
				width: 20%;
				padding-bottom: 40upx;
				display: flex;
				flex-direction: column;
				align-items: center;

				image {
					width: 88upx;
					height: 88upx;
					border-radius: 50%;
				}

				text {
					font-size: 24upx;
					color: #3d3d3d;
					margin-top: 15upx;
					@include toe();
					width: 100%;
					text-align: center;
				}
			}
		}
	}

	.nearby_shops_box {
		.title {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding: 34upx 35upx 35upx 35upx;
			background-color: #fff;

			>image {
				width: 26upx;
				height: 32upx;
			}

			>text {
				margin-left: 10upx;
				font-size: 30upx;
				color: #333333;
			}
		}

		.menu_box {
			background-color: #fff;
			padding: 0 72upx 28upx;
			border-bottom: 1upx solid #ededed;
			display: flex;
			justify-content: space-between;
			align-items: center;

			>view {
				font-size: 24upx;
				color: #666666;
				display: flex;
				justify-content: flex-start;
				align-items: center;

				&::after {
					content: '';
					width: 13upx;
					height: 9upx;
					background-image: url('../../static/icon/ic_sort.png');
					background-size: 100%, 100%;
					background-repeat: no-repeat;
					background-position: center center;
					margin-left: 12upx;
				}

				&.active {
					color: #ee7140;

					&::after {
						@include bis('../../static/icon/list_ic_flashbackde.png');
					}
				}
			}
		}

		.shop_list {
			background-color: #fff;
		}
	}
</style>
