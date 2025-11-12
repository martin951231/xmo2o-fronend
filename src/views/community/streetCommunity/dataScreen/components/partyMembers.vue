<!-- 党员数量统计 -->
<template>
	<div id="party_members_container">
        <swiper v-if="true" ref="mySwiper" @slide-change-transition-start="slideChangeTransitionStart"
          :aoto-updata="true" :options="swiperOptions" class="details_list">
          <swiper-slide class="swiper_slide_1" v-for="(items, index) in pageTotal" :key="index">
            <div class="echarts_box_1">
              <div @click="navigateTo" :id="'partyMembers'+ index" class="echarts_3"></div>
            </div>
          </swiper-slide>
          <!-- <div class="swiper-pagination" slot="pagination"></div> -->
        </swiper>
    </div>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity';
	import * as echarts from 'echarts';
    import {
      Swiper,
      SwiperSlide,
    } from 'vue-awesome-swiper'
    import 'swiper/swiper-bundle.css'
    import Swiper2, {
      Navigation,
      Pagination
    } from 'swiper';
    Swiper2.use([Navigation, Pagination]);
	export default {
        props: {
            swap_community_id: {
                type: Number,
                default: ()=>{return 0;}
            }
        },
		data() {
			return {
                pageIndex: 0,
                swiperOptions: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                  freeMode: false,
                  freeModeMomentumBounce: false,
                  pagination: {
                    el: '.swiper-pagination',
                    dynamicBullets: true,
                  },
                  paginationClickable: true,
                  // loop: true
                },
                objData: {},
                total: 1,
                pageTotal: 1,
                url: ''
			}
		},
        
        components: {
            Swiper,
            SwiperSlide,
        },

		mounted() {
            this.getPartyMemberStatistics(0)
		},

		methods: {
            navigateTo(){
                // this.$router.push(this.url)
                window.open(this.url)
            },
            slideChangeTransitionStart(index) {
                this.getPartyMemberStatistics(index.activeIndex)
            },
            
            getPartyMemberStatistics(index){
                let self = this
                if(index==0 || index<self.total-1){
                    self.pageIndex = index + 1
                    self.request(streetCommunityApi.getPartyMemberStatistics, {
                        page: self.pageIndex,
                        limit: 5,
                        swap_community_id:self.swap_community_id
                    }).then((res) => {
                        self.url = res.url
                        self.objData = res
                        self.total = res.count
                        if(res.count % 5 == 0){
                            self.pageTotal = parseInt(res.count / 5)
                        } else {
                            self.pageTotal = parseInt(res.count / 5 + 1)
                        }
                        if(res.xAxis_data.length>0 && res.xAxis_yAxis.length>0){
                            self.setCharts(index, res.xAxis_data, res.xAxis_yAxis)
                        }
                    })
                } else {
                    console.log("没有更多数据了。。。")
                }
            },
            
			setCharts(index, arrName, arrValue) {
				var myCharts = echarts.init(document.getElementById('partyMembers'+index));
                // let that = this
                // myCharts.on('click',function(params){
                // 	that.$router.push(that.url)
                // });
				const option = {
                    tooltip: {
                    	trigger: 'axis',
                    	axisPointer: {
                    		type: 'shadow'
                    	}
                    },
					legend: {
						data: ['党员数量统计'],
						bottom:'10',
						textStyle: {
							color: '#fff',
							fontSize: 12
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: arrName,
                        axisLabel: {//x轴文字的配置
                            show: true,
                            textStyle: {
                                color: 'RGBA(255, 255, 255, 0.7)',
                            }
                        }
					},
					yAxis: {
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
					},
					series: [{
                        name: '党员数量统计',
						smooth: true,
						symbolSize: 10,
						data: arrValue,
						type: 'line',
						itemStyle: {
							normal: {
								color: "#00FFFF",
								lineStyle: {
								color: "#00FFFF",
								},
							},
						},
						areaStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
									offset: 0,
									color: '#00FFFF'//下层渐变
								}, {
									offset: 0.8,
									color: 'RGBA(17, 145, 163, 0)'
								}], false),
								shadowColor: 'RGBA(17, 145, 163, 0)',
								shadowBlur: 10
							}
						},
					}]
				};
				myCharts.setOption(option);
			}
		}
	}
</script>

<style lang="less" scoped>
    #party_members_container{
        width: calc(100vw/4 - 10px);
        height: calc((100vh - 90px - 6px)/3 - 42px);
        .details_list{
            width: 100%;
            height: 100%;
            .swiper_slide_1 {
              width: 100%;
              height: 100%;
              .echarts_box_1 {
                width: 100%;
                height: 100%;
                .echarts_3 {
                  width: 100%;
                  height: 100%;
                }
              }
            }
            
            /deep/ .swiper-pagination-bullet {
                display: none;
                background: #0096FF;
            }
            
            /deep/ .swiper-pagination-bullet-active {
                display: none;
                width: 14px;
                height: 8px;
                background: #0096FF;
                border-radius: 4px;
            }
            
            /deep/ .swiper-container-horizontal>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic {
                display: none;
                left: 88% !important;
                -webkit-transform: translateX(-50%);
                transform: translateX(-50%);
                white-space: nowrap;
            }
        }
    }
</style>
