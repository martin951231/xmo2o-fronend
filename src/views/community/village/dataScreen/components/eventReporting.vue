<!-- 事件上报统计 -->
<template>
	<div class="charts_container_12">
        <div class="left_content" ref="charts_container_left"></div>
        <div class="right_content" ref="charts_container_right"></div>
    </div>
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
			this.setleftCharts()
            this.setrightCharts()
		},

		methods: {
			setleftCharts() {
				const myCharts = echarts.init(this.$refs.charts_container_left);
				let option = utils.getPie3D([{
						name: '已完成',
						value: 2,
						itemStyle: {
							opacity: 1,
							color: 'RGBA(61, 107, 217, .8)',
						}
					}, {
						name: '未完成',
						value: 1,
						itemStyle: {
							opacity: 1,
							color: 'RGBA(0, 240, 240, .8)',
						}
					}
				], 2);
				myCharts.setOption(option)
			},
            setrightCharts(){
                const myCharts = echarts.init(this.$refs.charts_container_right);
                let option = utils.getPie3D([{
                		name: '已完成',
                		value: 2,
                		itemStyle: {
                			opacity: 1,
                			color: 'RGBA(61, 107, 217, .8)',
                		}
                	}, {
                		name: '未完成',
                		value: 1,
                		itemStyle: {
                			opacity: 1,
                			color: 'RGBA(0, 240, 240, .8)',
                		}
                	}
                ], 2);
                myCharts.setOption(option)
            }
		}
	}
</script>

<style lang="less" scoped>
    .charts_container_12{
        width: calc(100vw/4 - 10px);
        height: calc((100vh - 90px - 6px)/3 - 42px);
        display: flex;
        .left_content{
            height: 100%;
            width: 50%;
        }
        .right_content{
            height: 100%;
            width: 50%;
        }
    }
</style>