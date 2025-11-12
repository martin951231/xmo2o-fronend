<!-- 社区物业统计 -->
<template>
	<div class="charts_container_13" ref="charts_container_13"></div>
</template>

<script>
	import * as echarts from 'echarts';
	import utils from "../utils/utils.js";
	import 'echarts-gl'
	import store from '@/store';
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
				const myCharts = echarts.init(this.$refs.charts_container_13);
				let option = utils.getPie3D([{
						name: '无物业的'+store.getters.config.house_name,
						value: 2,
						itemStyle: {
							opacity: 1,
							color: 'RGBA(61, 107, 217, .8)',
						}
					}, {
						name: '有物业的'+store.getters.config.house_name,
						value: 1,
						itemStyle: {
							opacity: 1,
							color: 'RGBA(142, 215, 251, .8)',
						}
					}
				], 2);
				myCharts.setOption(option)
			}
		}
	}
</script>

<style lang="less" scoped>
    .charts_container_13{
        width: calc(100vw/4 - 10px);
        height: calc((100vh - 90px - 6px)/3 - 42px);
    }
</style>