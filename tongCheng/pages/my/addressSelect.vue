<template>
	<view>
		<view class="map">
			<view id="container"></view>
			<button class="icon icon_map_current" @click="mapMobile(currentLocation)"></button>
		</view>
		<view class="mapSearchBox">
			<view class="searchBox">
				<text></text>
				<input type="text" placeholder="建议输入附近地标名称搜索" v-model="keywords" confirm-type="search" @confirm="onSearch" />
			</view>
			<view class="searchListBox">
				<view class="searchList" v-for="(item, index) of searchList" :key="index" @click="onAddress(item, index)">
					<view class="addressInfo">
						<text>{{ item.name }}</text>
						<text>{{ item.district || item.address }}</text>
					</view>
					<text class="icon" :class="[selectIndex === index ? 'active' : '']"></text>
				</view>
				<view class="but_box"><button type="primary" @click="onConfirm">确定</button></view>
			</view>
		</view>
	</view>
</template>
<script>
// #ifdef H5
import { getBrowser } from '@/config/html5Utils';
import { getLocation } from '@/config/wxJsSDK';
// #endif
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			map: Object,
			currentLocation: [],
			keywords: '',
			searchList: [],
			//防止重复搜索
			oldSearchText: '',
			addressInfo: {},
			autoOptions: {
				city: '全国'
			},
			selectIndex: '',
			//是否更新列表
			isUpdate:true
		};
	},
	//第一次加载
	onLoad(e) {},
	mounted() {
		// #ifdef H5
		this.getCurrentLocation();
		// #endif
	},
	//页面显示
	onShow() {},
	//方法
	methods: {
		...mapMutations(['setSelectAddress']),
		//获取当前位置
		getCurrentLocation() {
			const _this = this;
			if (getBrowser() == '微信') {
				getLocation(res => {
					this.currentLocation = [res.longitude, res.latitude];
					this.mapInit();
				});
			} else {
				var geolocation = new qq.maps.Geolocation();
				geolocation.getIpLocation(
					function(position) {
						_this.currentLocation = [position.lng, position.lat];
						_this.mapInit();
					},
					function(err) {
					}
				);
			}
		},
		mapInit() {
			const _this = this;
			//加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
			AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
				var map = new AMap.Map('container', {
					zoom: 15,
					scrollWheel: false,
					center: _this.currentLocation //中心点坐标
				});
				var positionPicker = new PositionPicker({
					mode: 'dragMap',
					map: map
				});

				positionPicker.on('success', function(positionResult) {
					if(_this.isUpdate){
						//判断中心坐标是否获取到
						if (_this.currentLocation.length != 0) {
							_this.searchList = positionResult.regeocode.pois;
						}
						_this.autoOptions.city = positionResult.regeocode.addressComponent.city;
						_this.addressInfo = positionResult.regeocode.addressComponent;
						_this.selectIndex = '';
					}
					_this.isUpdate = true;
				});
				positionPicker.on('fail', function(positionResult) {
					uni.showToast({
						title: '获取地图信息失败',
						icon:"none"
					});
				});
				positionPicker.start();
				map.panBy(0, 1);
				map.addControl(
					new AMap.ToolBar({
						liteStyle: true
					})
				);
				_this.map = map;
			});
		},
		//移动地图
		mapMobile(coordinate) {
			this.map.panTo(coordinate); //设置地图中心点
		},
		//输入搜索
		onSearch() {
			const _this = this;
			if (this.keywords && this.oldSearchText !== this.keywords) {
				AMap.plugin('AMap.Autocomplete', function() {
					var autoComplete = new AMap.Autocomplete(_this.autoOptions);
					autoComplete.search(_this.keywords, function(status, result) {
						// 搜索成功时，result即是对应的匹配数据
						if (status === 'complete' && result.info === 'OK') {
							_this.oldSearchText = _this.keywords;
							_this.searchList = result.tips;
							_this.selectIndex = '';
						} else {
							uni.showToast({
								title: '搜索失败',
								icon:"none"
							});
						}
					});
				});
			}
		},
		//选择地址
		onAddress(item, index) {
			this.selectIndex = index;
			this.isUpdate = false;
			this.map.panTo([item.location.lng,item.location.lat]);
		},
		//确定地址
		onConfirm(){
			if(this.selectIndex === ""){
				uni.showToast({
					title: '请选择地址',
					icon:"none"
				});
			}else{
				const item = this.searchList[this.selectIndex];
				this.setSelectAddress({
					longitude: item.location.lng,
					latitude: item.location.lat,
					areaId: item.adcode || this.addressInfo.adcode,
					district: item.district || this.addressInfo.province + this.addressInfo.city + this.addressInfo.district,
					name: item.name,
					address: item.address,
					type: 3
				});
				console.log({
					longitude: item.location.lng,
					latitude: item.location.lat,
					areaId: item.adcode || this.addressInfo.adcode,
					district: item.district || this.addressInfo.province + this.addressInfo.city + this.addressInfo.district,
					name: item.name,
					address: item.address,
					type: 3
				});
				uni.navigateBack();
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
<style lang="scss">
@import '@/style/mixin.scss';
.map {
	position: relative;
	#container {
		width: 100%;
		height: 400upx;
	}
	.icon_map_current {
		position: absolute;
		left: 30upx;
		bottom: 30upx;
		background-color: #fff;
		width: 60upx;
		height: 60upx;
		background-image: url(https://qn.kemean.cn/upload/201904/28/00b4455157dd4f08b76a21c57c5fe7d7);
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center center;
	}
}
.mapSearchBox {
	background-color: #ffffff;
	border-radius: 40upx 40upx 0 0;
	height: calc(100vh - 400upx);
	padding: 30upx 0;
	.searchBox {
		display: flex;
		margin: 0 30upx;
		height: 73upx;
		background-color: #f0f0f0;
		border-radius: 26upx;
		align-items: center;
		padding: 0 30upx;
		text {
			flex-shrink: 0;
			width: 30upx;
			height: 30upx;
			background-image: url('../../static/icon/icon_sousuo.png');
			background-size: cover;
			background-repeat: no-repeat;
			background-position: center center;
		}
		input {
			margin-left: 15upx;
			height: 73upx;
			background-color: transparent;
			flex: 1;
			font-size: 28upx;
		}
	}
	.searchListBox {
		margin-top: 30upx;
		overflow-y: auto;
		height: calc(100% - 80upx);
		.searchList {
			padding: 30upx 30upx;
			border-top: 1px solid #efefef;
			display: flex;
			justify-content: space-between;
			align-items: center;
			&:active {
				background-color: #f5f5f5;
			}
			&:first-child {
				border-top: 0;
			}
			.addressInfo {
				display: flex;
				flex-direction: column;
				text:nth-child(1) {
					font-size: 32upx;
					color: #333333;
					font-weight: bold;
				}
				text:nth-child(2) {
					font-size: 24upx;
					color: #999999;
					margin-top: 15upx;
				}
			}
			.icon {
				width: 34upx;
				height: 34upx;
				background-image: url('../../static/icon/ic_gender_unselected.png');
				background-size: cover;
				background-repeat: no-repeat;
				background-position: center center;
				&.active {
					background-image: url('../../static/icon/ic_gender_selected.png');
				}
			}
		}
	}
}
.but_box {
	height: 120upx;
	button {
		position: fixed;
		bottom: 20upx;
		left: 20upx;
		right: 20upx;
		height: 88upx;
		line-height: 88upx;
		background-color: $mainColor;
		color: #FFF;
		border-radius: 10upx;
	}
}
</style>
