<!-- 三会一课 -->
<template>
	<div class="charts_container_9" ref="charts_container_9"></div>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity';
	import * as echarts from 'echarts';
	import utils from "../utils/utils.js";
	import 'echarts-gl'
	export default {
        props: {
            swap_community_id: {
                type: Number,
                default: ()=>{return 0;}
            }
        },
		data() {
			return {
                url: ''
			}
		},

		mounted() {
            this.getData()
		},

		methods: {
            getData(){
                let self = this
                self.request(streetCommunityApi.getPartyMeetingStatistics, {swap_community_id:this.swap_community_id}).then((res) => {
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
                    window.open(that.url)
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