<template>
	<view class="page">
		<view class="user_info">
			<view class="edit_box">
				<view class="cell_list" @click="onUnloadImg">
					<view class="cell_left txt">头像</view>
					<view class="cell_right arrow"><image :src="headImg" mode="aspectFill"></image></view>
				</view>
				<z-prompt ref="popup" :value="nickName" text="请输入昵称" @change="onNameChange" :options="popupOptions">
					<view class="cell_list">
						<view class="cell_left txt">昵称</view>
						<view class="cell_right arrow">{{ nickName }}</view>
					</view>
				</z-prompt>
				
					<view class="cell_list last">
						<view class="cell_left txt">手机号</view>
						<view class="cell_right">{{ userInfo.phone }}</view>
					</view>
				
			</view>
		</view>
		<!-- 按钮 -->
		<view class="btn_box"><button @click="onSubmit">保存</button></view>
	</view>
</template>

<script>
import zPrompt from '@/components/common/prompt';
import { mapState, mapMutations } from 'vuex';
export default {
	components: {
		zPrompt
	},
	data() {
		return {
			popupOptions: {
				placeholder: ''
			},
			headImg: '',
			nickName: ''
		};
	},
	computed: {
		...mapState(['userInfo'])
	},
	//第一次加载
	onLoad(e) {
		this.headImg = this.userInfo.headImg;
		this.nickName = this.userInfo.nickName;
	},
	//页面显示
	onShow() {},
	//方法
	methods: {
		...mapMutations(['setUserInfo']),
		//修改昵称
		onNameChange(e) {
			this.nickName = e.value;
			e.close();
		},
		//修改头像
		onUnloadImg() {
			this.$http.qn({ count: 1 }).then(res => {
				this.headImg = res[0];
			});
		},
		//提交
		onSubmit() {
			if (this.headImg == '') {
				uni.showToast({
					title: '请上传头像',
					icon: 'none'
				});
				return;
			}
			if (this.nickName == '') {
				uni.showToast({
					title: '请输入昵称',
					icon: 'none'
				});
				return;
			}
			this.$http
				.post('api/mime/v1/edit', {
					nickName: this.nickName,
					headImg: this.headImg
				})
				.then(res => {
					this.setUserInfo({
						nickName: this.nickName,
						headImg: this.headImg
					});
					uni.showToast({
						title: '修改成功！'
					});
					
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
.user_info {
	// background-color: #f19837;
	border-radius: 0 0 40upx 40upx;
	.edit_box {
		background-color: #ffffff;
		border-radius: 40upx;
		padding: 10upx 30upx;
	}
}
.cell_list {
	padding: 48upx 0;
}
.last{
	border-bottom:none;
}
.txt {
	font-size: 32upx;
}
.cell_right image {
	width: 80upx;
	height: 80upx;
	border-radius: 50%;
}
.btn_box {
	margin: 100upx 105upx 0;
	>button {
		width: 534upx;
		height: 86upx;
		background-image: linear-gradient(90deg, #ea552d 0%, #f19837 100%), linear-gradient(#d4d4d4, #d4d4d4);
		background-blend-mode: normal, normal;
		border-radius: 43upx;
		color: #ffffff;
		line-height: 86upx;
		
	}
}
</style>
