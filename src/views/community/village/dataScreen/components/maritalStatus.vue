<!-- 婚姻状况统计 -->
<template>
	<div class="charts_container_11" ref="charts_container_11"></div>
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
				const myCharts = echarts.init(this.$refs.charts_container_11);
				let option = utils.getPie3D([{
						name: '未婚',
						value: 3,
						itemStyle: {
							opacity: 1,
							color: 'RGBA(140, 211, 246, 1)',
						}
					}, {
						name: '已婚',
						value: 1,
						itemStyle: {
							opacity: 1,
							color: 'RGBA(21, 240, 225, 1)',
						}
					}, {
						name: '离婚',
						value: 1,
						itemStyle: {
							opacity: 1,
							color: 'RGBA(229, 215, 84, 1)',
						}
					}, {
						name: '丧偶',
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
    .charts_container_11{
        width: calc(100vw/4 - 10px);
        height: calc((100vh - 90px - 6px)/3 - 42px);
    }
</style>