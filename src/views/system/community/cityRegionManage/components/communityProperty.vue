<!-- 社区物业统计 -->
<template>
	<div class="charts_container_13" ref="charts_container_13"></div>
</template>

<script>
	import * as echarts from 'echarts';
    import houseCityApi from '@/api/system/community/house';
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
        watch: {
            addressParams: {
                handler(val){
                    if(val.city_area_id!=undefined && val.city_area_id>=0){
                        this.getData()
                    }
                },
                immediate: true
            }
        },
        /*
        mounted() {
            this.getData()
        },
        */

		methods: {
            getData(){
                let self = this
                self.request(houseCityApi.getEventVirtualStatistics, this.addressParams).then((res) => {
                    self.setCharts(res)
                })
            },
            
			setCharts(arr) {
				const myCharts = echarts.init(this.$refs.charts_container_13);
				let option = utils.getPie3D(arr[0], arr[1], arr[2]);
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