import $http from '@/config/request'
/**
 * json数据去重合并
 */
export const modifyJson = (json, oldJson) => {
	if (!json && !oldJson) {
		return;
	}
	if (typeof json !== "object") {
		json = JSON.parse(json);
	}
	if (typeof oldJson !== "object") {
		oldJson = JSON.parse(oldJson);
	}

	var jsonData = {};
	for (var i in oldJson) {
		jsonData[i] = oldJson[i];
	}
	for (var j in json) {
		jsonData[j] = json[j];
	}

	return jsonData;
}
/**
 * 时间转换为XX前
 */
export const clickDateDiff = function(value) {
	var result;
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var month = day * 30;
	var now = new Date().getTime();
	var diffValue = parseInt(now) - parseInt(value);
	if (diffValue < 0) {
		return;
	}
	var monthC = diffValue / month;
	var weekC = diffValue / (7 * day);
	var dayC = diffValue / day;
	var hourC = diffValue / hour;
	var minC = diffValue / minute;
	if (monthC >= 1) {
		result = "" + parseInt(monthC) + '月前';
	} else if (weekC >= 1) {
		result = "" + parseInt(weekC) + '周前';
	} else if (dayC >= 1) {
		result = "" + parseInt(dayC) + '天前';
	} else if (hourC >= 1) {
		result = "" + parseInt(hourC) + '小时前';
	} else if (minC >= 1) {
		result = "" + parseInt(minC) + '分钟前';
	} else {
		result = '刚刚';
	}
	return result;
};
/**
 * 时间戳转换为想要的时间格式
 */
//时间戳转换为时间 format('yyyy-MM-dd hh:mm:ss')
//时间格式转换
Date.prototype.format = function(fmt = 'yyyy-MM-dd hh:mm:ss') { //author: meizz 
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[
			k]).substr(("" + o[k]).length)));
	return fmt;
}
//微信小程序支付
export const setWxPay = function(orderNo, callback) {
	$http.get('api/pay/v1/small_pay_sign_wx',{
		orderNo:orderNo
	}).then(data => {
		let payData = {
			provider: platform,
			success: function(res) {
				callback && callback({success:true,data:res});
				console.log('success:' + JSON.stringify(res));
			},
			fail: function(err) {
				callback && callback({success:false,data:err});
				console.log('fail:' + JSON.stringify(err));
			}
		};
		let platform;
		// #ifdef MP-WEIXIN
		platform = 'weixin';
		payData.timeStamp = data.timeStamp;
		payData.nonceStr = data.nonceStr;
		payData.package = data.package;
		payData.signType = "MD5";
		payData.paySign = data.sign;
		// #endif
		// #ifdef MP-ALIPAY
		platform = 'alipay';
		payData.orderInfo = data;
		// #endif
		// #ifdef MP-BAIDU
		platform = 'baidu';
		payData.orderInfo = data;
		// #endif
		uni.requestPayment(payData);
	},err => {
		callback && callback({success:false,data:err});
	});
}
