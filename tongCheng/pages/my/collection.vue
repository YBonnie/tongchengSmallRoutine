<template>
	<!-- 我的收藏 -->
	<view>
		<view class="collection_box" v-if="shopsLists.length > 0">
			<view class="collection_lists"><shop-item v-for="(item, index) of shopsLists" :key="index" :item="item" type="delivery"></shop-item></view>
		</view>
		<load-more text="暂无收藏数据~" :height="80"></load-more>
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
			// 收藏列表
			shopsLists: [],
			// 第一页
			pageNo: 1,
			// 总页数默认第一页
			pages: 1
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
		loadData() {
			if (this.pageNo <= this.pages) {
				let httpData = {
					pageNo: this.pageNo,
					pageSize: 15
				};
				this.$http
					.post('api/collect/v1/list_data', httpData, {
						load: false
					})
					.then(res => {
						this.pages = res.pages;
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
.collection_box {
	border-radius: 0 0 40upx 40upx;
	.collection_lists {
		margin-top: 10upx;
		border-radius: 40upx;
		background-color: #ffffff;
		padding: 18upx 30upx;
	}
}
</style>
