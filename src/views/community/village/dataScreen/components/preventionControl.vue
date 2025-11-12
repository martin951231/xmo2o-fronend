<!-- 疫情防控数据统计 -->
<template>
	<div id="charts_container_0"></div>
</template>

<script>
	import * as echarts from 'echarts';
	export default {
		data() {
			return {
			}
		},

		mounted() {
			this.setCharts()
		},

		methods: {
			setCharts() {
				var myCharts = echarts.init(document.getElementById('charts_container_0'));
				const option = {
                    tooltip: {
                    	trigger: 'axis',
                    	axisPointer: {
                    		type: 'shadow'
                    	}
                    },
					legend: {
						data: ['已接种', '未接种'],
						bottom:'10',
						textStyle: {
							color: '#fff',
							fontSize: 12
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
					},
					yAxis: {
						type: 'value',
                        splitLine: {
                        	show:true,
                        	lineStyle: {
                        		type: 'dashed',
                        		color: 'RGBA(1, 100, 173, 0.7)'
                        	}
                        }
					},
					series: [{
                        name: '已接种',
						smooth: true,
						symbolSize: 1,
						data: [12, 34, 56, 97, 32, 23, 22],
						type: 'line',
						itemStyle: {
							normal: {
								color: "#177EED",
								lineStyle: {
								color: "#177EED",
								},
							},
						},
						areaStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
									offset: 0,
									color: '#177EED'//下层渐变
								}, {
									offset: 0.8,
									color: 'RGBA(26, 129, 246, 0)'
								}], false),
								shadowColor: 'RGBA(26, 129, 246, 0)',
								shadowBlur: 10
							}
						},
					},{
                        name: '未接种',
						smooth: true,
						symbolSize: 1,
						data: [23, 22, 56, 34, 56, 32, 12],
						type: 'line',
						itemStyle: {
							normal: {
								color: "#00FFFF",
								lineStyle: {
								color: "#00FFFF",
								},
							},
						},
						areaStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
									offset: 0,
									color: '#00FFFF'//下层渐变
								}, {
									offset: 0.8,
									color: 'RGBA(17, 145, 163, 0)'
								}], false),
								shadowColor: 'RGBA(17, 145, 163, 0)',
								shadowBlur: 10
							}
						},
					}]
				};
				myCharts.setOption(option);
			}
		}
	}
</script>

<style lang="less" scoped>
    #charts_container_0{
        width: calc(100vw/4 - 10px);
        height: calc((100vh - 90px - 6px)/3 - 42px);
    }
</style>
