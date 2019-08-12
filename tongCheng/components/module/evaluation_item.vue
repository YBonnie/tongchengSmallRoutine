<template>
	<view class="evaluation_item" :class="{'noLine':index == 0}">
		<view class="image_box"><image :src="item.userHeadImg" mode="aspectFill"></image></view>
		<view class="info_box">
			<view class="name_box">
				<text class="name">{{ item.userNickName }}</text>
				<text class="time">{{ item.createTimeStr }}</text>
			</view>
			<view class="score_box">
				<view class="stars" v-for="(childItem, childIndex) of 5" :key="childIndex">
					<image v-if="item.score >= childItem" src="../../static/icon/evaluation_star1.png" mode="aspectFill"></image>
					<image v-else src="../../static/icon/evaluation_star2.png" mode="aspectFill"></image>
				</view>
				<text class="score">{{ item.score.toFixed(1) }}分</text>
			</view>
			<view class="content_box">{{ item.content }}</view>
			<view class="picture_box" v-if="item.imgs && item.imgs.length > 0">
				<image
					v-for="(imgsItem, imgsIndex) of item.imgs"
					:key="imgsIndex"
					@click="onPreviewImage(imgsIndex, item.imgs)"
					:src="imgsItem"
					mode="aspectFill"
				></image>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		item: {
			type: Object,
			default() {
				return {};
			}
		},
		index: {
			type: Number,
			default() {
				return 0;
			}
		}
	},
	methods: {
		// 图片预览的方法
		onPreviewImage(index, imgs) {
			if (imgs && imgs instanceof Array && imgs.length > 0) {
				uni.previewImage({
					current: imgs[index],
					urls: imgs
				});
			}
		},
	}
};
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
.evaluation_item {
	padding: 30upx 0;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	background-color: #ffffff;
	border-top: 1upx solid #efefef;
	&.noLine {
		border-top:0;
	}
	.image_box {
		> image {
			width: 72upx;
			height: 72upx;
			border-radius: 50%;
			margin-right: 20upx;
		}
	}

	.info_box {
		width: 100%;
		.name_box {
			display: flex;
			justify-content: space-between;
			align-items: baseline;
			.name {
				font-size: 26upx;
				color: #333333;
			}
			.time {
				font-size: 24upx;
				color: #999999;
			}
		}
		.score_box {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin-top: 19upx;
			.stars {
				margin-right: 5upx;
				image {
					width: 27upx;
					height: 26upx;
				}
			}
			.score {
				margin-left: 20upx;
				font-size: 20upx;
				color: #333333;
			}
		}
		.content_box {
			margin-top: 19upx;
			font-size: 24upx;
			color: #333333;
		}
		.picture_box {
			margin-top: 19upx;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			flex-wrap: wrap;
			> image {
				width: 185upx;
				height: 185upx;
				border-radius: 4upx;
				margin-right: 20upx;
				margin-bottom: 20upx;
				&:nth-of-type(3n) {
					margin-right: 0;
				}
			}
		}
	}
}
</style>
