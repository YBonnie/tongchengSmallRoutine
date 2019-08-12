<template>
	<view class="page">
		<view class="assess_list_box"><evaluation-item v-for="(item, index) of commentList" :key="index" :item="item" :index="index"></evaluation-item></view>
		<load-more text="暂无评价~"></load-more>
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
			objId: '',
			commentList: [],
			pageNo: 1,
			pages: 1,
		};
	},
	//第一次加载
	onLoad(e) {
		this.objId = e.objId;
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
					pageSize: 15,
					shopId:this.objId,
					type:1501
				};
				this.$http
					.post('api/order/v2/comment_list', httpData, {
						load: false
					})
					.then(res => {
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
	padding-top: 10upx;
}
.assess_list_box {
	padding: 0 30upx;
	background-color: #fff;
	border-radius: 40upx;
}
</style>
