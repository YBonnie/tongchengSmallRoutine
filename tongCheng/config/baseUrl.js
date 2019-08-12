// 当前环境
const court = "都市云";
const courtConfig = {
	/****************开发环境****************/
	"开发": {
		//微信小程序appid=wxd0e0881530ee4444
		//微信公众号APPID
		publicAppId:"wx946e72c5bea5ccdc",
		//请求接口
		baseUrl: "https://dev.kemean.net/cityUser/",
		//图片路径
		imgBaseUrl: "https://dev.kemean.net/cityUser/",
		//项目logo
		logoUrl: "https://qn.kemean.cn/upload/201906/19/3f3b4751f3ed4a97be804450c3ec4c79",
		//项目token
		// projectToken: "2018103101",
		 projectToken: "18031201",
		// projectToken: "19052801",
		//平台名称
		platformName:"佳品多多",
		//小程序页面分享配置
		share: function () {
			return {
				title: '都市云',
				// #ifdef MP-WEIXIN
				path: '/pages/home/home', //小程序分享路径
				// #endif
				// #ifdef H5
				//公众号分享
				desc: "都市云同城,最长24公里配送", // 分享描述
				link: "https://www.kemean.com/sameCity/18031201/index.html", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: "http://qn.kemean.cn/upload/201901/28/23bedfc34597482292ecd6dc107f6342", // 分享图标
				// #endif
			}
		},
		//模块显示
		module:{
			
		},
		//可选区域（默认显示第一个，最少一个）
		regionList:[
			{
				name:"武江区",
				objId:440203
			},
			{
				name:"浈江区",
				objId:440204
			},
			{
				name:"曲江区",
				objId:440205
			},
			{
				name:"始兴县",
				objId:440222
			},
			{
				name:"仁化县",
				objId:440224
			},
			{
				name:"翁源县",
				objId:440229
			},
			{
				name:"乳源瑶族自治县",
				objId:440232
			},
			{
				name:"新丰县",
				objId:440233
			},
			{
				name:"乐昌县",
				objId:440281
			},
			{
				name:"南雄县",
				objId:440282
			},
		]
	},
	"都市云": {
		//微信小程序appid=
		//微信公众号APPID
		publicAppId:"wxf86b20ee205f9f2d",
		//请求接口
		baseUrl: "https://www.kemean.com/cityUser/",
		//图片路径
		imgBaseUrl: "https://www.kemean.com/cityUser/",
		//项目logo
		logoUrl: "https://qn.kemean.cn/upload/201906/19/3f3b4751f3ed4a97be804450c3ec4c79",
		//项目token
		projectToken: "18031201",
		//平台名称
		platformName:"都市云",
		//页面分享配置
		share: function () {
			return {
				title: '都市云',
				// #ifdef MP-WEIXIN
				path: '/pages/home/home', //小程序分享路径
				// #endif
				// #ifdef H5
				//公众号分享
				desc: "都市云同城,最长24公里配送", // 分享描述
				link: "https://www.kemean.com/sameCity/18031201/index.html", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: "http://qn.kemean.cn/upload/201901/28/23bedfc34597482292ecd6dc107f6342", // 分享图标
				// #endif
			}
		},
		//模块显示
		module:{
			
		},
		//可选区域（默认显示第一个，最少一个）
		regionList:[
			{
				name:"武江区",
				objId:"440203"
			},
			{
				name:"浈江区",
				objId:"440204"
			},
			{
				name:"曲江区",
				objId:"440205"
			},
			{
				name:"始兴县",
				objId:"440222"
			},
			{
				name:"仁化县",
				objId:"440224"
			},
			{
				name:"翁源县",
				objId:"440229"
			},
			{
				name:"乳源瑶族自治县",
				objId:"440232"
			},
			{
				name:"新丰县",
				objId:"440233"
			},
			{
				name:"乐昌县",
				objId:"440281"
			},
			{
				name:"南雄县",
				objId:"440282"
			},
		]
	}
};
//手机号验证正则表达式
const phoneRegular = /^1\d{10}$/;
//邮箱验证正则表达式
const mailRegular = /^\w+@\w+(\.[a-zA-Z]{2,3}){1,2}$/;
//密码验证正则表达式
const passwordRegular = /^[a-zA-Z0-9]{4,10}$/;
export default Object.assign({
	phoneRegular,
	mailRegular,
	passwordRegular
}, courtConfig[court]);
