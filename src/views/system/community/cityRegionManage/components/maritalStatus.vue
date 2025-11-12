<!-- 婚姻状况统计 -->
<template>
	<div class="charts_container_11" ref="charts_container_11"></div>
</template>

<script>
    import houseCityApi from '@/api/system/community/house';
	import * as echarts from 'echarts';
	import utils from "../utils/utils.js";
	import 'echarts-gl'
	export default {
        props: {
            addressParams: {
                type: Object,
                default: ()=>{return {}}
            }
        },
		data() {
			return {
			}
		},

		mounted() {
			this.getData()
		},

		methods: {
            getData(){
                let self = this
                self.request(houseCityApi.getPopulationMarriageStatistics, this.addressParams).then((res) => {
                    console.log("marr===>", res)
                    self.setCharts(res)
                })
            },
            
			setCharts(params) {
				const myCharts = echarts.init(this.$refs.charts_container_11);
				let option = utils.getPie3D(params[0], params[1], params[2]);
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