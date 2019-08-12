<template>
	<view class="search_page">
		<!--搜索框 -->
		<view class="search_box">
			<view class="search">
				<image src="../../static/icon/icon_sousuo.png" mode="aspectFit"></image>
				<input class="search_input" placeholder="请输入商家名称" type="text" confirm-type="search" v-model="keyWord" maxlength="255" @confirm="onKeyConfirm" />
				<view class="cancle" @click="onCancle"><image src="../../static/icon/search_ic_close.png" mode="aspectFill"></image></view>
			</view>
		</view>
		<view class="support"></view>
		<view class="bg" v-if="shopsLists.length > 0">
			<!-- 商家列表 -->
			<view class="shop_list"><shop-item v-for="(item, index) of shopsLists" :key="index" :item="item"  type="delivery"></shop-item></view>
		</view>
		<load-more text="暂无店铺~"></load-more>
	</view>
</template>

<script>
import shopItem from '@/components/module/shop_item';
export default {
	components: {
		shopItem
	},
	data() {
		return {
			// 搜索关键字
			keyWord: '',
			pageNo: 1,
			pages: 1,
			// 商铺列表
			shopsLists: []
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
		// 监听查询框输入
		onKeyConfirm() {
			this.shopsLists = [];
			this.pageNo = 1;
			this.pages = 1;
			this.loadData();
		},
		// 取消查询
		onCancle() {
			this.keyWord = '';
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
					keyWord: this.keyWord
				};
				this.$http
					.post('api/wm/shop/v1/list', httpData, {
						load: false
					})
					.then(res => {
						this.pages = res.pages;
						res.data.map(item => {
							item.shopType = 1101;
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
		}
	},
	//页面隐藏
	onHide() {},
	//页面卸载
	onUnload() {},
	//页面下来刷新
	onPullDownRefresh() {
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
.search_page {
	overflow: hidden;
}
.support {
	height: 103upx;
}
.search_box {
	padding: 16upx 30upx 16upx 30upx;
	background-image: linear-gradient(90deg, #ea552d 0%, #f19837 100%), linear-gradient(#ffffff, #ffffff);
	background-blend-mode: normal, normal;
	position: fixed;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 3;
	.search {
		width: 600upx;
		height: 73upx;
		background-color: #f0f0f0;
		border-radius: 20upx;
		padding: 0 20upx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		> image {
			width: 30upx;
			height: 30upx;
		}
		.search_input {
			margin-left: 19upx;
			font-size: 28upx;
			width: 100%;
			&::-webkit-input-placeholder {
				color: #999999;
				font-size: 28upx;
			}
		}
	}
	.cancle {
		image {
			width: 30upx;
			height: 30upx;
		}
	}
}
.bg {
	background-image: linear-gradient(90deg, #ea552d 0%, #f19837 100%), linear-gradient(#ffffff, #ffffff);
	background-blend-mode: normal, normal;
	.shop_list {
		border-radius: 40upx 40upx 0 0;
		background-color: #fff;
	}
}
</style>
