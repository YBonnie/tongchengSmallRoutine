<template>
	<picker mode="multiSelector" @change="dateChange" @columnchange="dateColumnChange" :value="dateIndex" :range="dateList"
	 range-key="name">
		<slot></slot>
	</picker>
</template>
<script>
	let dateColumn = 0;
	export default {
		data() {
			return {
				dateList: [
					[{
							name: "立即配送",
							value: 3100
						},
						{
							name: "今天",
							value: 3101
						},
						{
							name: "明天",
							value: 3102
						}
					],
					[{
						name: "-",
						value: ""
					}, ],
					[{
						name: "-",
						value: ""
					}, ]
				],
				dateIndex: [0, 0, 0],
			};
		},
		//方法
		methods: {
			//配送时间
			dateChange(e) {
				let value = e.detail.value;
				this.dateIndex = value;
				let hours = this.dateList[1][value[1]].value;
				let minutes = this.dateList[2][value[2]].value;
				if (hours < 10) {
					hours = "0" + hours
				}
				if (minutes < 10) {
					minutes = "0" + minutes
				}
				this.$emit("change", {
					name: this.dateList[0][value[0]].name,
					value: this.dateList[0][value[0]].value,
					time: hours + ":" + minutes
				});
			},
			//配送时间选择时
			dateColumnChange(e) {
				let dateList = this.dateList;
				if (e.detail.column == 0) {
					dateColumn = e.detail.value;
					if (e.detail.value == 0) {
						dateList[1] = [{
							name: "-",
							value: ""
						}];
						dateList[2] = [{
							name: "-",
							value: ""
						}];
					} else if (e.detail.value == 1) {
						var hoursList = new Array();
						var minutesList = new Array();
						var currentDate = new Date();
						var hours = currentDate.getHours() + 1;
						var minutes;
						for (var h = hours; h < 24; h++) {
							if (h < 10) {
								hoursList.push({
									name: "0" + h + "时",
									value: h
								});
							} else {
								hoursList.push({
									name: h + "时",
									value: h
								});
							}
						}
						minutes = currentDate.getMinutes();
						var minutesString = minutes.toString();
						var startBit = minutesString.charAt(0);
						var lastBit = minutesString.charAt(minutesString.length - 1);
						if (lastBit > 5) {
							minutes = parseInt(parseInt(startBit) + 1 + "0");
						} else {
							minutes = parseInt(startBit + "5");
						}
						for (var m = minutes; m < 60; m = m + 5) {
							if (m < 10) {
								minutesList.push({
									name: "0" + m + "分",
									value: m
								});
							} else {
								minutesList.push({
									name: m + "分",
									value: m
								});
							}
						}
						dateList[1] = hoursList;
						dateList[2] = minutesList;
					} else if (e.detail.value == 2) {
						var hoursList = new Array();
						var minutesList = new Array();
						for (var h = 0; h < 24; h++) {
							if (h < 10) {
								hoursList.push({
									name: "0" + h + "时",
									value: h
								});
							} else {
								hoursList.push({
									name: h + "时",
									value: h
								});
							}
						}
						for (var m = 0; m < 60; m = m + 5) {
							if (m < 10) {
								minutesList.push({
									name: "0" + m + "分",
									value: m
								});
							} else {
								minutesList.push({
									name: m + "分",
									value: m
								});
							}
						}
						dateList[1] = hoursList;
						dateList[2] = minutesList;
					}
				} else if (e.detail.column == 1) {
					if (dateColumn == 1) {
						var minutesList = new Array();
						var currentDate = new Date();
						var hours = currentDate.getHours() + 1;
						var minutes;
						if (dateList[1][e.detail.value].value <= hours) {
							minutes = currentDate.getMinutes();
							var minutesString = minutes.toString();
							var startBit = minutesString.charAt(0);
							var lastBit = minutesString.charAt(minutesString.length - 1);
							if (lastBit > 5) {
								minutes = parseInt(parseInt(startBit) + 1 + "0");
							} else {
								minutes = parseInt(startBit + "5");
							}
						} else {
							minutes = 0;
						}
						for (var m = minutes; m < 60; m = m + 5) {
							if (m < 10) {
								minutesList.push({
									name: "0" + m + "分",
									value: m
								});
							} else {
								minutesList.push({
									name: m + "分",
									value: m
								});
							}
						}
						dateList[2] = minutesList;
					}
				}
				this.dateList = dateList;
				this.$forceUpdate();
			},
		},

	};
</script>
