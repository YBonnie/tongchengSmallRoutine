<template>
	<view class="page">
		<view class="input_form_box">
			<view class="input_box">
				<view class="name required">姓名</view>
				<view class="input_info"><input type="text" v-model="receiveName" placeholder="请输入姓名" /></view>
			</view>
			<view class="input_box">
				<view class="name required">性别</view>
				<view class="radio_box">
					<view :class="{ active: sexMan }" @click="onSexMan(true)">男</view>
					<view :class="{ active: !sexMan }" @click="onSexMan(false)">女</view>
				</view>
			</view>
			<view class="input_box">
				<view class="name required">手机</view>
				<view class="input_info"><input type="number" v-model="phone" placeholder="请输入手机" maxlength="11" /></view>
			</view>
			<view class="input_box">
				<view class="name required">位置</view>
				<view class="select_info" @click="onAreaSelect">
					<text class="value" v-if="addressInfo.address">{{ addressInfo.name }}</text>
					<text class="select" v-else="">请选择位置</text>
				</view>
			</view>
			<view class="input_box">
				<view class="name required">详细地址</view>
				<view class="input_info"><input type="text" v-model="address" placeholder="请输入详细地址" /></view>
			</view>
		</view>
		<view class="from_but"><button class="active" @click="onSubmit">确定</button></view>
	</view>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			//姓名
			receiveName: '',
			//性别
			sexMan: true,
			//手机号
			phone: '',
			//详细地址
			address: '',
			addressInfo: {
				latitude: '',
				longitude: '',
				name: '',
				address: ''
			}
		};
	},
	computed: {
		...mapState(['selectAddress'])
	},
	//第一次加载
	onLoad(e) {
		if (e.objId) {
			this.objId = e.objId;
			uni.setNavigationBarTitle({
				title: '修改收货地址'
			});
			this.pageData();
		}
		// #ifdef MP-WEIXIN
		uni.authorize({
			scope: 'scope.userLocation'
		});
		// #endif
	},
	//页面显示
	onShow() {
		// #ifdef H5
		if(this.selectAddress.latitude){
			this.addressInfo = this.selectAddress;
		}
		// #endif
	},
	//方法
	methods: {
		...mapMutations(['setSelectAddress']),
		pageData() {
			this.$http
				.get('api/mime/address/v1/info', {
					objId: this.objId
				})
				.then(res => {
					this.receiveName = res.receiveName;
					this.sexMan = res.sexMan;
					this.phone = res.phone;
					this.address = res.address;
					this.addressInfo = {
						latitude: res.latitude,
						longitude: res.longitude,
						name: res.region,
						address: res.region
					};
				});
		},
		//性别改变
		onSexMan(val) {
			this.sexMan = val;
		},
		//位置选择
		onAreaSelect() {
			// #ifdef MP-WEIXIN
			uni.getSetting({
				success: res => {
					// 定位权限是否为打开
					if (res.authSetting['scope.userLocation']) {
			
						uni.chooseLocation({
							success: res => {
								this.addressInfo = res;
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
			uni.navigateTo({
				url:"/pages/my/addressSelect"
			});
			// #endif
		},
		onSubmit() {
			if (this.receiveName == '') {
				uni.showToast({
					title: '请输入姓名',
					icon: 'none'
				});
				return;
			}
			if (this.phone == '') {
				uni.showToast({
					title: '请输入手机号',
					icon: 'none'
				});
				return;
			}
			if (!this.addressInfo.latitude) {
				uni.showToast({
					title: '请选择位置',
					icon: 'none'
				});
				return;
			}
			if (this.address == '') {
				uni.showToast({
					title: '请输入详细地址',
					icon: 'none'
				});
				return;
			}
			let httpData = {
				address: this.address,
				latitude: this.addressInfo.latitude,
				longitude: this.addressInfo.longitude,
				phone: this.phone,
				receiveName: this.receiveName,
				sexMan: this.sexMan,
				position:this.addressInfo.address,
			};
			if(this.objId){
				httpData.objId = this.objId;
			}
			this.$http
				.post('api/mime/address/v1/edit', httpData)
				.then(res => {
					this.setSelectAddress({});
					let content = "地址添加成功！";
					if(this.objId){
						content = "地址修改成功!";
					}
					uni.showModal({
						title:"提示",
						content:content,
						showCancel:false,
						success: (res) => {
							uni.navigateBack();
						}
					})
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
.page {
	padding-top: 20upx;
}
.input_box {
	border-top: 1upx solid #efefef;
	&:first-child {
		border-top: 0;
	}
}
</style>
