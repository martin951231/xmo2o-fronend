<!-- 年龄段统计 -->
<template>
	<div id="charts_container_5"></div>
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
				var myCharts = echarts.init(document.getElementById('charts_container_5'));
				const option = {
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					legend: {
						data: ['男性', '女性'],
						bottom:'10',
						textStyle: {
							color: '#fff',
							fontSize: 12
						}
					},
					xAxis: [{
						type: 'category',
						data: ['0-6', '6-12', '12-18', '18-40', '40-50', '50-60', '60-70', '70以上']
					}],
					yAxis: [{
						type: 'value',
						splitLine: {
							show:true,
							lineStyle: {
								type: 'dashed',
								color: 'RGBA(1, 100, 173, 0.7)'
							}
						}
					}],
					series: [{
							name: '男性',
							type: 'bar',
							barWidth: 10,
							emphasis: {
								focus: 'series'
							},
							data: [320, 332, 301, 334, 390, 422, 457, 490],
							itemStyle: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{ offset: 0, color: 'RGBA(1, 100, 173, 1)' },
									{ offset: 0.3, color: 'RGBA(1, 100, 173, 0.3)' },
									{ offset: 1, color: 'RGBA(17, 145, 163, 0)' }
								])
							}
						},
						{
							name: '女性',
							type: 'bar',
							barWidth: 10,
							emphasis: {
								focus: 'series'
							},
							data: [220, 182, 191, 234, 290, 320, 354, 423],
							itemStyle: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{ offset: 0, color: 'RGBA(51, 243, 254, 1)' },
									{ offset: 0.3, color: 'RGBA(51, 243, 254, .3)' },
									{ offset: 1, color: 'RGBA(51, 243, 254, 0)' }
								])
							}
						}
					]
				};
				myCharts.setOption(option);
			}
		}
	}
</script>

<style lang="less" scoped>
    #charts_container_5{
        width: calc(100vw/4 - 10px);
        height: calc((100vh - 90px - 6px)/3 - 42px);
    }
</style>