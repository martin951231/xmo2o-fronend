<!-- 性别统计 -->
<template>
	<div class="charts_container_2" ref="charts_container_2"></div>
</template>

<script>
	import * as echarts from 'echarts';
	import utils from "../utils/utils.js";
	import 'echarts-gl'
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
				const myCharts = echarts.init(this.$refs.charts_container_2);
				let option = utils.getPie3D([{
						name: '男',
						value: 2,
						itemStyle: {
							opacity: 1,
							color: 'RGBA(21, 240, 225, .8)',
						}
					}, {
						name: '女',
						value: 1,
						itemStyle: {
							opacity: 1,
							color: 'RGBA(140, 211, 246, 1)',
						}
					}
				], 2);
				myCharts.setOption(option)
			}
		}
	}
</script>

<style lang="less" scoped>
    .charts_container_2{
        width: calc(100vw/4 - 10px);
        height: calc((100vh - 90px - 6px)/3 - 42px);
    }
</style>