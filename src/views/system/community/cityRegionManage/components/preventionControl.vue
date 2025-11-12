<!-- 疫情防控数据统计 -->
<template>
    <div id="prevention_control">
        <swiper v-if="true" ref="mySwiper" @slide-change-transition-start="slideChangeTransitionStart"
          :aoto-updata="true" :options="swiperOptions" class="details_list">
          <swiper-slide class="swiper_slide_1" v-for="(items, index) in pageTotal" :key="index">
            <div class="echarts_box_1">
              <div @click="navigateTo" :id="'preventionControl'+ index" class="echarts_3"></div>
            </div>
          </swiper-slide>
        </swiper>
    </div>
</template>

<script>
    import houseCityApi from '@/api/system/community/house';
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
            addressParams: {
                type: Object,
                default: ()=>{return {}}
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
		    this.getEpidemicPrevent(0)
		},
        
		methods: {
            navigateTo(){
                let that = this
               if(that.url){
                   window.open(that.url)
               }
            },
            slideChangeTransitionStart(index) {
                this.getEpidemicPrevent(index.activeIndex)
            },
            
            getEpidemicPrevent(index){
                let self = this
                let postParam =this.addressParams;
               
                if(index==0 || index<self.total-1){
                    self.pageIndex = index + 1
                     postParam.page=self.pageIndex;
                     postParam.limit=5;
                    self.request(houseCityApi.getEpidemicPrevent, postParam).then((res) => {
                        self.objData = res.list
                        self.total = res.list.count
                        self.url = res.url
                        if(res.list.count % 5 == 0){
                            self.pageTotal = parseInt(res.list.count / 5)
                        } else {
                            self.pageTotal = parseInt(res.list.count / 5 + 1)
                        }
                        if(res.list.count){
                            self.setCharts(index, res.list)
                        }
                        
                        console.log("self.total===>", self.total)
                        console.log("self.pageTotal===>", self.pageTotal)
                        console.log("index===>", index)
                    })
                } else {
                    console.log("没有更多数据了。。。")
                }
            },
            
			setCharts(index, res) {
				var myCharts = echarts.init(document.getElementById('preventionControl' + index));
                let that = this
                myCharts.on('click',function(params){
                    console.log("params===>", params)
                	that.$router.push(that.url)
                });
				const option = {
                    tooltip: {
                    	trigger: 'axis',
                    	axisPointer: {
                    		type: 'shadow'
                    	},
                        confine: true
                    },
                    grid:{
                        left:'3%',
                        right:'8%',
                        bottom:'30%',
                        containLabel:true
                    },
					legend: {
						data: res.legend_data,
						bottom: '10',
						textStyle: {
							color: '#fff',
							fontSize: 12
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: res.xAxis_data,
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
                    series: res.series

				};
				myCharts.setOption(option);
			}
		}
	}
</script>

<style lang="less" scoped>
    #prevention_control{
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
        }
    }
</style>
