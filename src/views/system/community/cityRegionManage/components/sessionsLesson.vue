<!-- 三会一课 -->
<template>
	<div class="charts_container_9" ref="charts_container_9"></div>
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
                url: ''
			}
		},
        watch: {
            addressParams: {
                handler(val){
                    if(val.city_area_id!=undefined && val.city_area_id>=0){
                        console.log('val.city_area_id===>', val.city_area_id)
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
                self.request(houseCityApi.getPartyMeetingStatistics,this.addressParams).then((res) => {
                    console.log("sessionsLesson===>", res)
                    self.setCharts(res.list)
                    self.url = res.url
                })
            },
            
			setCharts(params) {
				const myCharts = echarts.init(this.$refs.charts_container_9);
                let that = this
                myCharts.on('click',function(params){
                	// that.$router.push(that.url)
                    // window.location.href = that.url
                    if(that.url){
                        window.open(that.url)
                    }
                    
                });
				let option = utils.getPie3D(params, 2, '三会一课');
				myCharts.setOption(option)
			},
		}
	}
</script>

<style lang="less" scoped>
    .charts_container_9{
        width: calc(100vw/4 - 10px);
        height: calc((100vh - 90px - 6px)/3 - 42px);
    }
</style>