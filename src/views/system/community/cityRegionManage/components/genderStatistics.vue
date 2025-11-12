<!-- 性别统计 -->
<template>
	<div class="charts_container_2" ref="charts_container_2"></div>
</template>

<script>
	import * as echarts from 'echarts';
	import utils from "../utils/utils.js";
	import 'echarts-gl'
    import houseCityApi from '@/api/system/community/house';
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
                self.request(houseCityApi.getPopulationSexStatistics, this.addressParams).then((res) => {
                    self.setCharts(res)
                })
            },
            
			setCharts(params) {
				const myCharts = echarts.init(this.$refs.charts_container_2);
				let option = utils.getPie3D(params[0], params[1], params[2]);
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