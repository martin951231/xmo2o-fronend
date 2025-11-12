<!-- 社区关怀 -->
<template>
	<div id="charts_container_8"></div>
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
				var myCharts = echarts.init(document.getElementById('charts_container_8'));
				const option = {
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'	
						}
					},
					legend: {
						bottom:'10',
						textStyle: {
							color: '#fff',
							fontSize: 12
						}
					},
					xAxis: [{
						type: 'category',
						data: ['商家店铺', '学校', '医院', '银行', '其他']
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
							type: 'bar',
							barWidth: 10,
							emphasis: {
								focus: 'series'
							},
							data: [320, 332, 301, 334, 390],
							itemStyle: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{ offset: 0, color: 'RGBA(1, 100, 173, 1)' },
									{ offset: 0.3, color: 'RGBA(1, 100, 173, 0.3)' },
									{ offset: 1, color: 'RGBA(17, 145, 163, 0)' }
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
    #charts_container_8{
        width: calc(100vw/4 - 10px);
        height: calc((100vh - 90px - 6px) / 3 - 42px);
    }
</style>
