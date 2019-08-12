<template>
	<view class="page">
		<view class="address_list" v-for="(item, index) of addressList" :key="index">
			<view class="address_info" @click="onSelectAddress(item)">
				<view class="name">
					<text>{{ item.receiveName }}</text>
					{{ item.phone }}
				</view>
				<text>{{ item.position }}{{ item.address }}</text>
			</view>
			<view class="btn_box">
				<view class="default" :class="{ active: item.isDefault }" @click="onSetDefault(index)">默认地址</view>
				<view class="edit_delete_box">
					<view @click="onPageJump('/pages/my/addAddress?objId=' + item.objId)">
						<image src="../../static/icon/icon_edit.png" mode="aspectFit"></image>
						编辑
					</view>
					<view @click="onDelete(index)">
						<image src="../../static/icon/icon_del.png" mode="aspectFit"></image>
						删除
					</view>
				</view>
			</view>
		</view>
		<load-more text="暂无收货地址~"></load-more>
		<view class="add_address"><button @click="onPageJump('/pages/my/addAddress')">添加地址</button></view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			addressList: [],
			// 第一页
			pageNo: 1,
			// 总页数默认第一页
			pages: 1,
			//是否是选择收货地址
			isSelect: 0
		};
	},
	//第一次加载
	onLoad(e) {
		if (e.isSelect) {
			this.isSelect = e.isSelect;
		}
	},
	//页面显示
	onShow() {
		this.pageNo = 1;
		this.pages = 1;
		this.loadData();
	},
	//方法
	methods: {
		...mapMutations(['setCheckedAddressData']),
		loadData() {
			if (this.pageNo <= this.pages) {
				var httpData = {
					pageNo: this.pageNo,
					pageSize: 15
				};
				this.$http
					.post('api/mime/address/v1/list', httpData, {
						load: false
					})
					.then(res => {
						this.pages = res.pages;
						if (this.pageNo == 1) {
							this.addressList = res.data;
						} else {
							this.addressList = this.addressList.concat(res.data);
						}
						if (res.data.length > 0) {
							this.pageNo = this.pageNo + 1;
						}
					});
			}
		},
		//页面跳转
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		},
		//设置默认
		onSetDefault(index) {
			let item = this.addressList[index];
			if (!item.isDefault) {
				this.$http.get('api/mime/address/v1/set_default', { objId: item.objId }).then(res => {
					this.addressList.map(item => {
						item.isDefault = false;
						return item;
					});
					this.addressList[index].isDefault = true;
				});
			}
		},
		//删除地址
		onDelete(index) {
			uni.showModal({
				title: '提示',
				content: '确定要删除吗？',
				success: res => {
					if (res.confirm) {
						const item = this.addressList[index];
						this.$http.get('api/mime/address/v1/del', { objId: item.objId }).then(data => {
							uni.showToast({
								title: '删除成功!',
								icon: 'none'
							});
							this.addressList.splice(index, 1);
						});
					}
				}
			});
		},
		//选择收货地址
		onSelectAddress(item) {
			if (this.isSelect > 0) {
				item.type = this.isSelect;
				this.setCheckedAddressData(item);
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
.page {
	padding-top: 20upx;
	padding-bottom: 120upx;
}
.address_list {
	background-color: #ffffff;
	border-radius: 40upx;
	padding: 0 30upx;
	position: relative;
	overflow: hidden;
	margin-bottom: 30upx;
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		background-image: url('../../static/icon/icon_Decorativepattern.png');
		background-repeat: repeat-x;
		background-size: auto 100%;
		height: 6upx;
		width: 100%;
	}
	.address_info {
		padding: 50upx 0 40upx 0;
		.name {
			font-size: 32upx;
			color: #333333;
			text {
				margin-right: 30upx;
			}
		}
		> text {
			font-size: 28upx;
			color: #999999;
		}
	}
	.btn_box {
		border-top: 1upx solid #efefef;
		padding: 30upx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.default {
			display: flex;
			align-items: center;
			font-size: 26upx;
			color: #000000;
			flex-shrink: 0;
			&::before {
				content: '';
				@include bis('../../static/icon/ic_gender_unselected.png', 100% 100%);
				width: 38upx;
				height: 38upx;
				margin-right: 15upx;
			}
			&.active::before {
				background-image: url('../../static/icon/ic_agreed.png');
			}
		}
		.edit_delete_box {
			display: flex;
			view {
				display: flex;
				align-items: center;
				font-size: 26upx;
				color: #000000;
				margin-left: 40upx;
				image {
					width: 28upx;
					height: 28upx;
					margin-right: 10upx;
				}
			}
		}
	}
}
.add_address {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	button {
		width: 100%;
		height: 88upx;
		line-height: 88upx;
		background-image: linear-gradient(-90deg, #ff7e38 0%, #ff5148 100%), linear-gradient(-90deg, #ffac29 0%, #ff7418 100%), linear-gradient(#ff5148, #ff5148);
		border-radius: 0upx;
		text-align: center;
		font-size: 32upx;
		color: #ffffff;
	}
}
</style>
