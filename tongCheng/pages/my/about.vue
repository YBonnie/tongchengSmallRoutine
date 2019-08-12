<template>
  <view class="about_page">
    <view class="logo">
			<image :src="aboubUs.logo" mode="aspectFit"></image>
    </view>
    <view class="content">
			<u-parse :content="aboubUs.introduction"/>
		</view>
		<view class="info">客服电话：<text @click="onCall(config.serverPhone)">{{config.serverPhone}}</text></view>
    <view class="info">官网地址：{{config.homeUrl}}</view>
    <view class="info">联系邮箱：{{config.homeEmail}}</view>
  </view>
</template>
<script>
	import uParse from "@/components/common/u-parse/u-parse.vue"
export default {
  components: {uParse},
  data() {
    return {
      aboubUs:{
				introduction:"<div></div>",
			},
			config:{}
    };
  },
	onLoad(){
		this.pageData();
	},
  methods: {
		//拨打电话
		onCall(phone){
			if(phone){
				uni.makePhoneCall({
						phoneNumber: phone
				});
			}
		},
    pageData(){
      this.$http.get("api/open/v1/conf").then(res => {
        this.aboubUs = res.aboubUs;
        this.config = res;
      });
    },
		onPhone(){
			if(this.aboubUs.phone){
				uni.makePhoneCall({
						phoneNumber: this.aboubUs.phone
				});
			}
		}
  }, 
};
</script>
<style lang="scss" scoped>
	@import "@/style/mixin.scss";
.about_page {
  background-color: #FFF;
  min-height: 100vh;
	padding-bottom: 50upx;
}
.logo {
  display: flex;
  justify-content: center;
  padding-top: 140upx;
  image {
    width: 180upx;
    height: 180upx;
    border-radius: 15upx;
  }
}
.content {
  padding: 72upx 30upx;
  font-size: 32upx;
  text-align: center;
	color: #333333;
	line-height: 150%;
}
.info {
  padding: 0 30upx;
	font-size: 30upx;
  padding-bottom: 15upx;
  text {
    color: $mainColor;
  }
}
</style>
