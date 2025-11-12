<!-- 社区关怀 -->
<template>
	<div @click="navigateTo" id="charts_container_8"></div>
</template>

<script>
	import * as echarts from 'echarts';
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
                url: ''
			}
		},

		mounted() {
            this.getData()
		},

		methods: {
            getData(){
                let self = this
                self.request(streetCommunityApi.getEventCareStatistics, {swap_community_id:this.swap_community_id}).then((res) => {
                    self.setCharts(res.list)
                    self.url = res.url
                })
            },
            
            navigateTo(){
                let that = this
                window.open(that.url)
            },
            
			setCharts(obj) {
				var myCharts = echarts.init(document.getElementById('charts_container_8'));
                let that = this
                // myCharts.on('click',function(params){
                // 	// that.$router.push(that.url)
                //     // window.location.href = that.url
                //     window.open(that.url)
                // });
				const option = {
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					legend: {
						bottom:'10',
						textStyle: {
							color: '#fff',
							fontSize: 12
						}
					},
					xAxis: [{
						type: 'category',
						data: obj.xAxis_data,
                        axisLabel: {//x轴文字的配置
                            show: true,
                            textStyle: {
                                color: 'RGBA(255, 255, 255, 0.7)',
                            }
                        }
					}],
					yAxis: [{
						type: 'value',
						splitLine: {
							show:true,
							lineStyle: {
								type: 'dashed',
								color: 'RGBA(1, 100, 173, 0.7)'
							}
						},
                        axisLabel: {//y轴文字的配置
                            textStyle: {
                                 color: 'RGBA(255, 255, 255, 0.7)',
                                 margin: 15
                            }
                        }
					}],
					series: [{
							type: 'bar',
							barWidth: 10,
							emphasis: {
								focus: 'series'
							},
							data: obj.series_data,
							itemStyle: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{ offset: 0, color: 'RGBA(1, 100, 173, 1)' },
									{ offset: 0.3, color: 'RGBA(1, 100, 173, 0.3)' },
									{ offset: 1, color: 'RGBA(17, 145, 163, 0)' }
								])
							}
						}
					]
				};
				myCharts.setOption(option);
			}
		}
	}
</script>

<style lang="less" scoped>
    #charts_container_8{
        width: calc(100vw/4 - 10px);
        height: calc((100vh - 90px - 6px) / 3 - 42px);
    }
</style>
