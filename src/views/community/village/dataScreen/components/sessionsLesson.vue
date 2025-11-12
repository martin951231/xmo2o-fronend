<!-- 三会一课 -->
<template>
	<div class="charts_container_9" ref="charts_container_9"></div>
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
				const myCharts = echarts.init(this.$refs.charts_container_9);
				let option = utils.getPie3D([{
						name: '支部党员大会',
						value: 3,
						itemStyle: {
							opacity: 1,
							color: 'RGBA(140, 211, 246, 1)',
						}
					}, {
						name: '支部党委会',
						value: 1,
						itemStyle: {
							opacity: 1,
							color: 'RGBA(21, 240, 225, 1)',
						}
					}, {
						name: '党小组会',
						value: 1,
						itemStyle: {
							opacity: 1,
							color: 'RGBA(229, 215, 84, 1)',
						}
					}, {
						name: '党课',
						value: 1,
						itemStyle: {
							opacity: 1,
							color: 'RGBA(68, 103, 227, .5)',
						}
					}
				], 2);
				myCharts.setOption(option)
			}
		}
	}
</script>

<style lang="less" scoped>
    .charts_container_9{
        width: calc(100vw/4 - 10px);
        height: calc((100vh - 90px - 6px)/3 - 42px);
    }
</style>