<template>
	<view class="shop_list_box">
		<!-- 筛选菜单 下拉菜单 -->
		<view class="tab_box">
			<view class="menu_box">
				<view :class="{ active: menuType == 3000 }" @click="onSelectMenuType(3000)">综合排序</view>
				<view :class="{ active: menuType == 3003 }" @click="onSelectMenuType(3003)">销量最高</view>
				<view :class="{ active: menuType == 3004 }" @click="onSelectMenuType(3004)">距离最近</view>
			</view>
		</view>
		<view class="support"></view>
		<!-- 商家列表 -->
		<view class="shop_list" v-if="shopsLists.length > 0"><shop-item v-for="(item, index) of shopsLists" :key="index" :item="item"></shop-item></view>
		<load-more text="暂无店铺~"></load-more>
	</view>
</template>
<script>
import shopItem from '@/components/module/shop_item';
import { mapState, mapMutations } from 'vuex';
// #ifdef H5
import { getBrowser } from '@/config/html5Utils';
import { getLocation } from '@/config/wxJsSDK';
// #endif
export default {
	components: {
		shopItem
	},
	data() {
		return {
			// 菜单选择
			menuType: 3000,
			pageNo: 1,
			pages: 1,
			// 商铺列表
			shopsLists: [],
			//当前位置信息
			currentAddress: {},
			// 分类Id
			twoTypeId: ''
		};
	},
	computed: {
		...mapState(['regionIndex'])
	},
	//第一次加载
	onLoad(e) {
		// #ifdef MP-WEIXIN
		uni.authorize({
			scope: 'scope.userLocation'
		});
		// #endif
		if(e.typeId){
			this.twoTypeId = e.typeId;
		}
		this.loadData();
	},
	//页面显示
	onShow() {},
	//方法
	methods: {
		// menu选择
		onSelectMenuType(menuType) {
			this.menuType = menuType;
			this.pageNo = 1;
			this.pages = 1;
			this.loadData();
		},
		// 获取商家列表数据
		loadData() {
			if (this.pageNo <= this.pages) {
				let httpData = {
					pageNo: this.pageNo,
					pageSize: 15,
					sortType:this.menuType
				};
				if (this.twoTypeId) {
					httpData.twoTypeId = this.twoTypeId;
				}
				if (this.currentAddress.longitude) {
					httpData.latitude = this.currentAddress.latitude;
					httpData.longitude = this.currentAddress.longitude;
				} else {
					this.getLatLon(() => {
						httpData.latitude = this.currentAddress.latitude;
						httpData.longitude = this.currentAddress.longitude;
					});
				}
				httpData.areaId = this.$base.regionList[this.regionIndex].objId;
				this.$http
					.post('api/tg/shop/v1/list', httpData, {
						load: false
					})
					.then(res => {
						uni.stopPullDownRefresh();
						this.pages = res.pages;
						res.data.map(item => {
							item.shopType = 1201;
							return item;
						});
						if (this.pageNo == 1) {
							this.shopsLists = res.data;
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
								this.currentAddress = {
									latitude: res.latitude,
									longitude: res.longitude
								};
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
					this.currentAddress = { longitude: res.longitude, latitude: res.latitude };
					callback && callback();
				});
			} else {
				var geolocation = new qq.maps.Geolocation();
				geolocation.getIpLocation(
					function(position) {
						_this.currentAddress = { longitude: position.lng, latitude: position.lat };
						callback && callback();
					},
					function(err) {}
				);
			}
			// #endif
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
@import '@/style/mixin.scss';
.support {
	height: 88upx;
}
.shop_list_box {
	background-color: #ffffff;
	overflow: hidden;
	.tab_box {
		position: fixed;
		left: 0;
		right: 0;
		z-index: 9999;
		background-color: #ff851d;
		.menu_box {
			background-color: #ffffff;
			border-radius: 40upx 40upx 0 0;
			padding: 37upx 72upx 10upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
		
			> view {
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
	}
	.shop_list {
		background-color: #fff;
	}
}
</style>
