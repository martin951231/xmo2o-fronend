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
    import streetCommunityApi from '@/api/community/streetCommunity';
	export default {
        props: {
            swap_community_id: {
                type: Number,
                default: ()=>{return 0;}
            }
        },
		data() {
			return {
                order_url: '',
                task_url: ''
			}
		},

		mounted() {
            this.getData()
		},

		methods: {
			setleftCharts(arr) {
				let myCharts = echarts.init(this.$refs.charts_container_left);
                let that = this
                myCharts.on('click',function(params){
                	// that.$router.push(that.order_url)
                    // window.location.href = that.task_url
                    window.open(that.order_url)
                });
				let option = utils.getPie3D(arr[0], arr[1], arr[2]);
				myCharts.setOption(option)
			},
            setrightCharts(arr){
                let myCharts = echarts.init(this.$refs.charts_container_right);
                let that = this
                myCharts.on('click',function(params){
                	// that.$router.push(that.task_url)
                    // window.location.href = that.task_url
                    window.open(that.task_url)
                });
                let option = utils.getPie3D(arr[0], arr[1], arr[2]);
                myCharts.setOption(option)
            },
            
            getData(){
                let self = this
                self.request(streetCommunityApi.getEventReportStatistics,{swap_community_id:this.swap_community_id}).then((res) => {
                    self.setleftCharts(res.order)
                    self.setrightCharts(res.task)
                    self.order_url = res.order_url
                    self.task_url = res.task_url
                })
            },
            
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