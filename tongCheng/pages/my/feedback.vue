<template>
	<view class="feedback_page">
		<view class="bg">
			<view class="input_form_box">
				<view class="input_box">
					<view class="name required">问题描述</view>
					<view class="textarea_info"><textarea maxlength="255" v-model="content" placeholder="请输入反馈内容（必填）" /></view>
				</view>
				<view class="input_box line">
					<view class="name">上传问题图片（选填）</view>
					<view class="upload_info">
						<view class="upload_img" v-for="(item, index) of imgs" :key="index">
							<image :src="item" mode="aspectFill"></image>
							<text class="delete" @click="onDeleteImg(index)"></text>
						</view>
						<view class="upload_img upload" @click="onImgsUpload" v-if="imgs.length < 9"></view>
					</view>
				</view>
			</view>
		</view>
		<view class="from_but"><button class="active" @click="onSubmit">提交</button></view>
	</view>
</template>
<script>
export default {
	components: {},
	data() {
		return {
			imgs: [],
			content: ''
		};
	},
	methods: {
		//上传艺术照
		onImgsUpload() {
			var count = 9 - this.imgs.length;
			this.$http.qn({ count: count }).then(res => {
				this.imgs = this.imgs.concat(res);
			});
		},
		//删除艺术照
		onDeleteImg(index) {
			this.imgs.splice(index, 1);
		},
		onSubmit() {
			if (this.content == '') {
				uni.showToast({
					title: '请输入反馈内容',
					icon: 'none'
				});
				return;
			}
			this.$http
				.post('api/open/v1/feedback', {
					content: this.content,
					imgs: this.imgs
				})
				.then(res => {
					uni.showModal({
						title: '提示',
						content: '提交成功！',
						showCancel: false,
						success: res => {
							uni.navigateBack();
						}
					});
				});
		}
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
.bg {
	// background-color: #f19837;
	border-radius: 0 0 40upx 40upx;
}
.input_form_box {
	border-radius: 40upx;
}
.input_box.line {
	position: relative;
	&::after {
		content: '';
		position: absolute;
		top: 0px;
		left: 30upx;
		right: 0upx;
		height: 1upx;
		background-color: #e5e5e5;
	}
}
.from_but {
	margin-top: 120upx;
	padding: 30upx;
}
</style>
