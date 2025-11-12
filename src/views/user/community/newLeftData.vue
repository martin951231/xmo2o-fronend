<template>
    <div class="flex_1">
        <div class="flex_left_1">
            <div class="left_box_1">
                <img src="../../../assets/images/border_1.png" class="border_1" alt="">
                <img src="../../../assets/images/border_2.png" class="border_2" alt="">
                <img src="../../../assets/images/border_3.png" class="border_3" alt="">
                <img src="../../../assets/images/border_4.png" class="border_4" alt="">
                <div class="top_title_box">
                    <img src="../../../assets/images/left_icon.png" alt="">
                    <div class="mini_title">车场数据统计</div>
                    <img src="../../../assets/images/right_icon.png" alt="">
                </div>
                <div class="mini_box_1">
                    <div class="mini_box" title="真实业主+家属+租客的总和">
                        <div class="text_1">车库数量</div>
                        <div class="text_1 font_16">{{garageData.garage_count}}/个</div>
                    </div>
                    <div class="mini_box" title="真实业主+家属的总和">
                        <div class="text_1">月租车</div>
                        <div class="text_1 font_16">{{garageData.month_count}}/辆</div>
                    </div>
                    <div class="mini_box">
                        <div class="text_1">在停车辆</div>
                        <div class="text_1 font_16">{{garageData.inPark_count}}/辆</div>
                    </div>
                </div>
            </div>
            <div class="left_box_1">
                <img src="../../../assets/images/border_1.png" class="border_1" alt="">
                <img src="../../../assets/images/border_2.png" class="border_2" alt="">
                <img src="../../../assets/images/border_3.png" class="border_3" alt="">
                <img src="../../../assets/images/border_4.png" class="border_4" alt="">
                <div class="top_title_box">
                    <img src="../../../assets/images/left_icon.png" alt="">
                    <div class="mini_title">车辆类型统计</div>
                    <img src="../../../assets/images/right_icon.png" alt="">
                </div>
                <div class="mini_box_9" v-if="true">
                    <div id="carTypeChart" style="width: 100%;height:100%;"></div>
                </div>
                <div class="tip_text_box" v-else>
                    <div class="tip_text" style="text-align: center;margin-top: 5%;font-size: 14px;color: #179ee3">
                        该套餐不包含此功能</div>
                </div>
            </div>
            <div class="left_box_2">
                <img src="../../../assets/images/border_1.png" class="border_1" alt="">
                <img src="../../../assets/images/border_2.png" class="border_2" alt="">
                <img src="../../../assets/images/border_3.png" class="border_3" alt="">
                <img src="../../../assets/images/border_4.png" class="border_4" alt="">
                <div class="top_title_box">
                    <img src="../../../assets/images/left_icon.png" alt="">
                    <div class="mini_title" style="display: inline-block;text-overflow: ellipsis; overflow: hidden;
                    white-space: nowrap; width: 50%;text-align: center;">
                        <a-tooltip placement="topLeft">
                            <template slot="title">
                                <span>车流量趋势图（近一周）</span>
                            </template>
                            车流量趋势图（近一周）
                        </a-tooltip>
                    </div>
                    <img src="../../../assets/images/right_icon.png" alt="">
                </div>
                <div class="mini_box_2">
                    <div id="trafficFlowTrendChart" style="width: 100%;height:100%;"></div>
                </div>
            </div>

            <div class="left_box_2">
                <img src="../../../assets/images/border_1.png" class="border_1" alt="">
                <img src="../../../assets/images/border_2.png" class="border_2" alt="">
                <img src="../../../assets/images/border_3.png" class="border_3" alt="">
                <img src="../../../assets/images/border_4.png" class="border_4" alt="">
                <div class="top_title_box">
                    <img src="../../../assets/images/left_icon.png" alt="">
                    <div class="mini_title">通行类统计</div>
                    <img src="../../../assets/images/right_icon.png" alt="">
                </div>
                <div class="mini_box_2">
                    <div style="width: 100%;height:100%; display: flex; align-items:flex-end; justify-content:space-around;">
                        <div class="bar_item" v-for="(bar_item, bar_index) in barList" :key="bar_index" style="display: flex;flex-direction: column;align-items: center;justify-content: flex-end;">
                            <div class="top_bar" style="display: flex;align-items: flex-end;justify-content: space-around; height: 100px; width: 60px;">
                                <div class="item" v-for="(item, index) in bar_item.list" :key="index" style="height: 100%; display: flex; align-items:center; flex-direction: column; justify-content:flex-end;">
                                    <div class="bottom_chart" style="width: 19px;position: relative;" :style="{backgroundImage: 'linear-gradient(to top, '+item.bottomColor+', '+item.topColor+')', height: item.rate}">
                                        <div class="top_value" style="color: #fff; font-size: 14px; position: absolute;top: -20px; width: 100%;text-align: center;">
                                            {{item.value}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="bottom" style="color: #fff; font-size: 14px;">{{bar_item.label}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="flex_left_3">
            <div class="left_box_3">
                <img src="../../../assets/images/border_1.png" class="border_1" alt="">
                <img src="../../../assets/images/border_2.png" class="border_2" alt="">
                <img src="../../../assets/images/border_3.png" class="border_3" alt="">
                <img src="../../../assets/images/border_4.png" class="border_4" alt="">
                <div class="top_title_box">
                    <img src="../../../assets/images/left_icon.png" alt="">
                    <div class="mini_title">最近入场车辆</div>
                    <img src="../../../assets/images/right_icon.png" alt="">
                </div>
                <div class="mini_box_3" style="display: flex; align-items: center;justify-content: center;width: 100%;height: calc(100% - 30px);">
                    <div class="banner" v-if="dataList1[currentIndex1] && dataList1[currentIndex1].accessImage">
                        <div class="item">
                            <img :src="dataList1[currentIndex1].accessImage">
                        </div>
                        <div class="page" v-if="dataList1.length > 1">
                            <ul>
                                <li v-for="(item,index) in dataList1" @click.stop="gotoPage(index, 1)" :key="index"
                                    :class="{'current':currentIndex1 == index}"></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="left_box_3">
                <img src="../../../assets/images/border_1.png" class="border_1" alt="">
                <img src="../../../assets/images/border_2.png" class="border_2" alt="">
                <img src="../../../assets/images/border_3.png" class="border_3" alt="">
                <img src="../../../assets/images/border_4.png" class="border_4" alt="">
                <div class="top_title_box">
                    <img src="../../../assets/images/left_icon.png" alt="">
                    <div class="mini_title">最近出场车辆</div>
                    <img src="../../../assets/images/right_icon.png" alt="">
                </div>
                <div class="mini_box_3" style="display: flex; align-items: center;justify-content: center;width: 100%;height: calc(100% - 30px)">
                    <div class="banner" v-if="dataList2[currentIndex2] && dataList2[currentIndex2].accessImage">
                        <div class="item">
                            <img :src="dataList2[currentIndex2].accessImage">
                        </div>
                        <div class="page" v-if="dataList2.length > 1">
                            <ul>
                                <li v-for="(item,index) in dataList2" @click.stop="gotoPage(index, 2)" :key="index"
                                    :class="{'current':currentIndex2 == index}"></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="flex_left_4">
            <div class="left_box_4">
                <img src="../../../assets/images/border_1.png" class="border_1" alt="">
                <img src="../../../assets/images/border_2.png" class="border_2" alt="">
                <img src="../../../assets/images/border_3.png" class="border_3" alt="">
                <img src="../../../assets/images/border_4.png" class="border_4" alt="">
                <div class="top_title_box">
                    <img src="../../../assets/images/left_icon.png" alt="">
                    <div class="mini_title">车辆进出实时记录（今日）</div>
                    <img src="../../../assets/images/right_icon.png" alt="">
                </div>
                <div class="mini_box_4">
                    <div class="center_box_2">
                      <div class="table-scroll">
                        <div class="table-flex_body" v-for="(item,index) in parkList">
                          <div class="text_6" v-for="(items,indexs) in item">{{items.title?items.title:'暂无数据'}}</div>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Rem from '../../../utils/rem.js';
    import echarts from 'echarts' //引入echarts
    Rem.getrem();
    export default {
        mounted() {
            this.getData()
            this.frashInterval = setInterval(()=>{
                this.getData()
            }, 5*60*1000)
        },
        beforeDestroy() {
            clearInterval(this.interval)
            clearInterval(this.frashInterval)
            this.interval = null
            this.frashInterval = null
        },
        computed: {
            //下一张
            nextIndex1() {
                if (this.currentIndex1 == this.dataList1.length - 1) {
                    return 0;
                } else {
                    return this.currentIndex1 + 1;
                }
            },
            //下一张
            nextIndex2() {
                if (this.currentIndex2 == this.dataList2.length - 1) {
                    return 0;
                } else {
                    return this.currentIndex2 + 1;
                }
            }
        },
        data() {
            return {
                accessType: {},
                carData: {},
                carFlow: {},
                garageData: {},
                newInPark: {},
                parkList: [],
                barList: [
                    // {label: '月租车', list: [{rate: '20%', value: '20', bottomColor: 'rgba(24,141,240,.5)', topColor: 'rgba(24,141,240,.9)'}, {rate: '27%', value: '27', bottomColor: 'rgba(254,190,3,.5)', topColor: 'rgba(254,190,3,.9)'}]},
                    // {label: '临时车', list: [{rate: '43%', value: '43', bottomColor: 'rgba(24,141,240,.5)', topColor: 'rgba(24,141,240,.9)'}, {rate: '12%', value: '12', bottomColor: 'rgba(254,190,3,.5)', topColor: 'rgba(254,190,3,.9)'}]},
                    // {label: '免费车', list: [{rate: '34%', value: '34', bottomColor: 'rgba(24,141,240,.5)', topColor: 'rgba(24,141,240,.9)'}, {rate: '33%', value: '33', bottomColor: 'rgba(254,190,3,.5)', topColor: 'rgba(254,190,3,.9)'}]}
                ],
                dataList1: [],
                dataList2: [],
                currentIndex1: 0,
                currentIndex2: 0,
                interval: null,
                frashInterval: null
            }
        },
        components: {
        },
        methods: {
            runInv() {
                this.interval = setInterval(() => {
                    this.gotoPage(this.nextIndex1, 1)
                    this.gotoPage(this.nextIndex2, 2)
                }, 3000)
            },
            getData(){
                let that = this
                let list = []
                this.request('/community/village_api.DataStatistics/getD7ParkCount', {}).then(res => {
                    if(res.length == 0){
                        return
                    }
                    that.accessType = res.accessType
                    for(let i in res.accessType){
                        this.barList.push(res.accessType[i])
                    }
                    that.carData = res.car
                    that.carFlow = res.carFlow
                    that.garageData = res.garage
                    that.newInPark = res.newInPark
                    that.dataList1 = res.newInPark.in_list
                    that.dataList2 = res.newInPark.out_list
                    that.runInv()
                    list.push([{title: '车牌号'},{title: '入场通道'},{title: '入场时间'},{title: '出场通道'},{title: '出场时间'},{title: '停车时间'}])
                    res.parkList.map(v=>{
                        list.push([{title: v.car_number},{title: v.in_channel_name},{title: v.in_accessTime},{title: v.out_channel_name},{title: v.out_accessTime},{title: v.park_time}])
                    })
                    that.parkList = list
                    this.myEcharts()
                    this.getTrendChart()
                    this.setTrafficStatistics()
                });
            },
            
            gotoPage(index, type){
                if(type == 1){
                    this.currentIndex1 = index
                } else if(type == 2){
                    this.currentIndex2 = index
                }
            },
            
            myEcharts() {
                // 基于准备好的dom，初始化echarts实例
                const myChart = this.$echarts.init(document.getElementById('carTypeChart'));
                const data = [{
                        name: '月租车/'+this.carData.month_count,
                        value: this.carData.month_count,
                        rate: this.carData.month_count / (this.carData.month_count + this.carData.stored_count),
                        itemStyle: {
                            color: '#00f6ff',
                        },
                    },
                    {
                        name: '储值车/'+this.carData.stored_count,
                        value: this.carData.stored_count,
                        rate: this.carData.stored_count / (this.carData.month_count + this.carData.stored_count),
                        itemStyle: {
                            color: '#febe03'
                        },
                    }
                ]
                const option = {
                    legend: {
                        type: 'plain',
                        icon: 'roundRect',
                        orient: 'horizontal',
                        width: 150,
                        left: '49%',
                        top: '36%',
                        align: 'left',
                        itemGap: 25,
                        itemWidth: 8, // 设置宽度
                        itemHeight: 2, // 设置高度
                        symbolKeepAspect: false,
                        textStyle: {
                            color: '#ffffff',
                            marginLeft: 15,
                            lineHeight: 0,
                            rich: {
                                name: {
                                    verticalAlign: 'center',
                                    align: 'left',
                                    width: 50,
                                    fontSize: 15,
                                },
                            }
                        },
                        data: data.map(item => item.name),
                    },
                    series: [{
                        name: '数量',
                        type: 'pie',
                        width: 120,
                        height: 120,
                        left: '10%',
                        top: '-10%',
                        radius: ['32%', '57%'],
                        data: data,
                        label: {
                            normal: {
                                show: false,
                                position: 'center',
                                formatter: '{text|{c}}',
                                rich: {
                                    text: {
                                        align: 'center',
                                        verticalAlign: 'middle',
                                        padding: 0,
                                        fontSize: 20
                                    },
                                }
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '12'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true
                            }
                        }
                    }]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            },

            getTrendChart() {
                let that = this
                var myCharts = echarts.init(document.getElementById('trafficFlowTrendChart'));
                const option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },

                    grid: {
                        left: '3%',
                        right: '8%',
                        bottom: '3%',
                        top: '25%',
                        containLabel: true
                    },

                    legend: {
                        data: that.carFlow.chart_title,
                        top: '10',
                        textStyle: {
                            color: '#fff',
                            fontSize: 12
                        }
                    },
                    
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: that.carFlow.chart_x,
                        axisLabel: { //x轴文字的配置
                            show: true,
                            textStyle: {
                                color: 'RGBA(255, 255, 255, 0.7)',
                            }
                        }
                    },
                    
                    yAxis: {
                        type: 'value',
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type: 'solid', // 'dashed'
                                color: 'RGBA(1, 100, 173, 0.7)'
                            }
                        },
                        axisLabel: { //y轴文字的配置
                            textStyle: {
                                color: 'RGBA(255, 255, 255, 0.7)',
                                margin: 15
                            }
                        }
                    },
                    series: this.setCharts()
                };
                myCharts.setOption(option);
            },
            
            setCharts(){
                let that = this
                let arr = []
                that.carFlow.chart_y.map(v=>{
                    arr.push({
                        name: v.name,
                        symbolSize: 10,
                        data: v.data,
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: v.color,
                                lineStyle: {
                                    color: v.color,
                                },
                            },
                        }
                    })
                })
                return arr
            },

            setTrafficStatistics() {
                const option = {
                    tooltip: {
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },

                    grid: {
                        left: '3%',
                        right: '8%',
                        bottom: '3%',
                        top: '30%',
                        containLabel: true
                    },

                    legend: {
                        data: ['Evaporation', 'Precipitation']
                    },

                    xAxis: [{
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        show: true, // 不显示坐标轴线、坐标轴刻度线和坐标轴上的文字
                        axisTick: {
                            show: false // 不显示坐标轴刻度线
                        },
                        axisLine: {
                            show: false, // 不显示坐标轴线
                        },
                        splitLine: {
                            show: false // 不显示网格线
                        },
                        axisLabel: {
                            show: true, // 不显示坐标轴上的文字
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    }],

                    yAxis: [{
                        //就是一月份这个显示为一个线段，而不是数轴那种一个点点
                        show: true,
                        boundaryGap: true,
                        data: ["月租车", "临时车", "免费车"],
                        axisLine: { //y轴
                            show: false
                        },
                        axisTick: { //y轴刻度线
                            show: false
                        },
                        splitLine: { //网格线
                            show: false
                        },
                        axisLabel: {
                            show: false, // 不显示坐标轴上的文字
                        }
                    }],
                    series: [{
                            name: 'Evaporation',
                            type: 'bar',
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(24,141,240,.1)'
                                    },
                                    {
                                        offset: 0.5,
                                        color: 'rgba(24,141,240,.5)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(24,141,240,.9)'
                                    }
                                ])
                            },
                            data: [
                                2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
                            ]
                        },
                        {
                            name: 'Precipitation',
                            type: 'bar',
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(254,190,3,.1)'
                                    },
                                    {
                                        offset: 0.5,
                                        color: 'rgba(254,190,3,.5)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(254,190,3,.9)'
                                    }
                                ])
                            },
                            data: [
                                2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
                            ]
                        }
                    ]
                };
                var myCharts = echarts.init(document.getElementById('trafficStatistics'));
                myCharts.setOption(option);
            }
        }
    }
</script>

<style lang="less" scoped>
    @rem: 192; //定义页面尺寸
    
    
    // 轮播图样式
    ul{
        margin-right: 20/@rem * 1rem;
    }
    ul li {
        list-style: none;
        float: left;
        width: 8/@rem * 1rem;
        height: 8/@rem * 1rem;
        line-height: 30/@rem * 1rem;
        text-align: center;
        border-radius: 50%;
        cursor: pointer;
        background-color: RGBA(0, 255, 255, 1);
        margin: 15/@rem * 1rem 8/@rem * 1rem 15/@rem * 1rem 0;
    }
    .banner {
        height: 96%;
        width: 96%;
        margin: 0 auto;
        position: relative;
        cursor: pointer;
        overflow: hidden;
    }
    .banner img {
        width: 100%;
        display: block;
    }
    
    .banner .desc{
        position: absolute;
        left: 10/@rem * 1rem;
        bottom: 8/@rem * 1rem;
        width: 80%;
        color: rgba(255,255,255,1);
        z-index: 99;
    }
    
    .banner .page {
        background: rgba(0,0,0,.5);
        position: absolute;
        right: 0;
        bottom: 0;
        height: 35px;
        width: 100%;
    }
    .banner .page ul {
        float: right;
    }
    .current {
        background-color: RGBA(10, 112, 119, 1);
    }
    // 轮播图样式
    
    
    .font_16 {
        font-size: 20/@rem * 1rem !important;
        color: rgba(19, 241, 253, 1) !important;
        font-weight: 700 !important;
    }

    .font_20 {
        font-size: 20/@rem * 1rem !important;
        color: rgba(19, 241, 253, 1) !important;
        font-weight: 700 !important;
    }

    .border_1 {
        position: absolute;
        top: 0;
        left: 0;
    }

    .border_2 {
        position: absolute;
        top: 0;
        right: 0;
    }

    .border_3 {
        position: absolute;
        bottom: 0;
        right: 0;
    }

    .border_4 {
        position: absolute;
        bottom: 0;
        left: 0;
    }

    .top_title_box {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
        background-image: url(../../../assets/images/rgba_bg.png);
        height: 30/@rem * 1rem;
        background-size: 100% 100%;
        background-repeat: no-repeat;

        .mini_title {
            font-size: 12/@rem * 1rem;
            font-weight: 700;
            font-stretch: normal;
            line-height: 30/@rem * 1rem;
            letter-spacing: 0/@rem * 1rem;
            color: #31abe3;
            margin: 0/@rem * 1rem 5/@rem * 1rem;
        }
    }

    //公用css end
    .top-box {
        width: 100%;
        height: 57/@rem * 1rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        .logo-img {
            width: 32/@rem * 1rem;
            height: 32/@rem * 1rem;
            display: inline-block;
        }

        .title {
            font-size: 27/@rem * 1rem;
            font-weight: 700;
            font-stretch: normal;
            line-height: 57/@rem * 1rem;
            letter-spacing: 0/@rem * 1rem;
            color: #ffffff;
            margin-left: 8/@rem * 1rem;
        }
    }

    .flex_1 {
        flex: 1;
        height: 100%;
        padding-right: 5/@rem * 1rem;

        .flex_left_1 {
            width: 100%;
            height: 40%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
            flex-wrap: wrap;
            overflow: hidden;

            .left_box_1 {
                width: 49%;
                height: 40%;
                position: relative;
                border: 1px solid #0b1363;

                .mini_box_1 {
                    height: 76%;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;

                    .mini_box {
                        width: 30%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;

                        .text_1 {
                            font-size: 14/@rem * 1rem;
                            font-weight: normal;
                            font-stretch: normal;
                            line-height: 30/@rem * 1rem;
                            letter-spacing: 0/@rem * 1rem;
                            color: #08d1ea;
                        }
                    }
                }

                .mini_box_9 {
                    width: 100%;
                    height: 76%;
                    display: flex;
                    flex-direction: row;

                    .mini_box6 {
                        width: 50%;
                        height: 100%;
                        position: relative;
                        display: flex;
                        justify-content: center;

                        .pulse1 {
                            width: 90/@rem * 1rem;
                            height: 90/@rem * 1rem;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            /* border: 30px solid rgba(9, 97, 89,1); */
                            background-image: radial-gradient(circle, rgba(9, 97, 89, 0), rgba(9, 97, 89, 0.5), rgba(9, 97, 89, 1));
                            -webkit-border-radius: 50%;
                            -moz-border-radius: 50%;
                            border-radius: 50%;
                            z-index: 1;
                            opacity: 1;
                            -webkit-animation: warn1 3s ease-out;
                            -moz-animation: warn1 3s ease-out;
                            animation: warn1 3s ease-out;
                            -webkit-animation-iteration-count: infinite;
                            -moz-animation-iteration-count: infinite;
                            animation-iteration-count: infinite;
                            /* box-shadow: 1px 1px 30px red; */
                        }
                    }

                    .mini_box7 {
                        width: 50%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: flex-start;

                        .text_8 {
                            font-size: 14/@rem * 1rem;
                            font-weight: normal;
                            font-stretch: normal;
                            line-height: 30/@rem * 1rem;
                            letter-spacing: 0/@rem * 1rem;
                            color: rgba(0, 202, 255, 1);
                        }

                        .text_9 {
                            font-size: 28/@rem * 1rem;
                            width: 56/@rem * 1rem;
                            font-weight: 700;
                            font-stretch: normal;
                            line-height: 30/@rem * 1rem;
                            letter-spacing: 0/@rem * 1rem;
                            color: rgba(19, 241, 253, 1);
                            text-align: center;
                        }
                    }
                }
            }

            .left_box_2 {
                width: 49%;
                height: 57%;
                margin-top: 2%;
                position: relative;
                border: 1/@rem * 1rem solid #0b1363;

                .mini_box_2 {
                    width: 100%;
                    height: 83%;
                }

                .mini_box_10 {
                    width: 100%;
                    height: 83%;
                    display: flex;
                    flex-direction: row;

                    .mini_box8 {
                        width: 50%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;

                        .pulse_box {
                            width: 100%;
                            height: 50%;
                            position: relative;
                            display: flex;
                            justify-content: center;

                            .pulse1 {
                                width: 90/@rem * 1rem;
                                height: 90/@rem * 1rem;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                /* border: 30px solid rgba(9, 97, 89,1); */
                                background-image: radial-gradient(circle, rgba(117, 96, 43, 0), rgba(117, 96, 43, 0.5), rgba(117, 96, 43, 1));
                                -webkit-border-radius: 50%;
                                -moz-border-radius: 50%;
                                border-radius: 50%;
                                z-index: 1;
                                opacity: 1;
                                -webkit-animation: warn1 3s ease-out;
                                -moz-animation: warn1 3s ease-out;
                                animation: warn1 3s ease-out;
                                -webkit-animation-iteration-count: infinite;
                                -moz-animation-iteration-count: infinite;
                                animation-iteration-count: infinite;
                                /* box-shadow: 1px 1px 30px red; */
                            }
                        }

                        .text_box {
                            width: 100%;
                            height: 50%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            padding-top: 10/@rem * 1rem;

                            .text_10 {
                                font-size: 14/@rem * 1rem;
                                font-weight: normal;
                                font-stretch: normal;
                                line-height: 30/@rem * 1rem;
                                letter-spacing: 0/@rem * 1rem;
                                color: rgba(0, 202, 255, 1);
                            }

                            .text_11 {
                                font-size: 24/@rem * 1rem;
                                width: 48/@rem * 1rem;
                                font-weight: 700;
                                font-stretch: normal;
                                line-height: 30/@rem * 1rem;
                                letter-spacing: 0/@rem * 1rem;
                                color: rgba(19, 241, 253, 1);
                                text-align: center;
                            }
                        }
                    }

                    .mini_box9 {
                        width: 50%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;

                        .pulse_box {
                            width: 100%;
                            height: 50%;
                            position: relative;
                            display: flex;
                            justify-content: center;

                            .pulse1 {
                                width: 90/@rem * 1rem;
                                height: 90/@rem * 1rem;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                /* border: 30px solid rgba(9, 97, 89,1); */
                                background-image: radial-gradient(circle, rgba(88, 14, 86, 0), rgba(88, 14, 86, 0.5), rgba(88, 14, 86, 1));
                                -webkit-border-radius: 50%;
                                -moz-border-radius: 50%;
                                border-radius: 50%;
                                z-index: 1;
                                opacity: 1;
                                -webkit-animation: warn1 3s ease-out;
                                -moz-animation: warn1 3s ease-out;
                                animation: warn1 3s ease-out;
                                -webkit-animation-iteration-count: infinite;
                                -moz-animation-iteration-count: infinite;
                                animation-iteration-count: infinite;
                                /* box-shadow: 1px 1px 30px red; */
                            }
                        }

                        .text_box {
                            width: 100%;
                            height: 50%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            padding-top: 10/@rem * 1rem;

                            .text_10 {
                                font-size: 14/@rem * 1rem;
                                font-weight: normal;
                                font-stretch: normal;
                                line-height: 30/@rem * 1rem;
                                letter-spacing: 0/@rem * 1rem;
                                color: rgba(0, 202, 255, 1);
                            }

                            .text_11 {
                                font-size: 24/@rem * 1rem;
                                font-weight: 700;
                                font-stretch: normal;
                                line-height: 30/@rem * 1rem;
                                letter-spacing: 0/@rem * 1rem;
                                color: rgba(19, 241, 253, 1);
                            }
                        }
                    }
                }
            }
        }

        .flex_left_2 {
            width: 100%;
            height: 32%;
            margin-top: 2%;
            position: relative;
            border: 1/@rem * 1rem solid #0b1363;

            .mini_box_3 {
                width: 100%;
                height: 88%;
                display: flex;
                flex-direction: row;
                align-items: center;

                .left_mini_box {
                    width: 55%;
                    height: 100%;
                    position: relative;

                    .mini_box1 {
                        width: 50%;
                        height: 52%;
                        position: absolute;
                        top: 43%;
                        left: 48%;
                        display: flex;
                        flex-direction: row;
                        flex-wrap: wrap;

                        .mini-info {
                            width: 50%;
                            height: 50%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;

                            .text_2 {
                                font-size: 14/@rem * 1rem;
                                font-weight: normal;
                                font-stretch: normal;
                                line-height: 30/@rem * 1rem;
                                letter-spacing: 0/@rem * 1rem;
                                color: #00caff;
                                // text-align: center;
                            }

                            .text_3 {
                                font-size: 18/@rem * 1rem;
                                font-weight: 700;
                                font-stretch: normal;
                                line-height: 30/@rem * 1rem;
                                letter-spacing: 0/@rem * 1rem;
                                color: rgba(19, 241, 253, 1);
                                // text-align: center;
                            }
                        }
                    }
                }

                .line {
                    width: 1/@rem * 1rem;
                    height: 70%;
                    background-color: #00c1f5;
                    opacity: 0.1;
                    margin-top: 5%;
                }

                .right_mini_box {
                    width: 45%;
                    height: 100%;
                    position: relative;

                    .mini_box2 {
                        width: 80%;
                        height: 30%;
                        position: absolute;
                        top: 70%;
                        left: 10%;
                        display: flex;
                        flex-direction: row;
                        flex-wrap: wrap;

                        .mini-info1 {
                            width: 50%;
                            height: 50%;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            align-items: center;

                            .text_4 {
                                font-size: 12/@rem * 1rem;
                                font-weight: normal;
                                font-stretch: normal;
                                line-height: 30/@rem * 1rem;
                                letter-spacing: 0/@rem * 1rem;
                                color: #00caff;
                            }

                            .text_5 {
                                font-size: 20/@rem * 1rem;
                                font-weight: 700;
                                font-stretch: normal;
                                line-height: 30/@rem * 1rem;
                                letter-spacing: 0/@rem * 1rem;
                                color: #13f1fd;
                            }
                        }
                    }
                }
            }
        }

        .flex_left_3 {
            width: 100%;
            height: 25%;
            margin-top: 2%;
            position: relative;
            display: flex;
            justify-content: space-between;

            .left_box_3 {
                width: 49%;
                height: 100%;
                position: relative;
                border: 1/@rem * 1rem solid #0b1363;

                .mini_box_4 {
                    width: 100%;
                    height: 85%;
                    display: flex;
                    flex-direction: row;

                    .left_mini_box_1 {
                        width: 30%;
                        height: 100%;
                    }

                    .right_mini_box_1 {
                        width: 70%;
                        height: 100%;
                    }
                }
            }
        }
        
        .flex_left_4{
            width: 100%;
            height: 32%;
            margin-top: 2%;
            position: relative;
            display: flex;
            justify-content: space-between;
            
            .left_box_4 {
                width: 100%;
                height: 100%;
                position: relative;
                border: 1/@rem * 1rem solid #0b1363;
            
                .mini_box_4 {
                    width: 100%;
                    height: 85%;
                    display: flex;
                    flex-direction: row;
                    
                    .center_box_2 {
                      width: 97%;
                      height: 94%;
                      border: 1/@rem * 1rem solid rgba(19, 60, 123, 1);
                      margin: 8/@rem * 1rem;
                      position: relative;
                     
                      .table-scroll {
                        width: 100%;
                        height: 20vh;
                        overflow-y: scroll;
                        margin-top: 5%;
                        .table-flex_body {
                          width: 100%;
                          display: flex;
                          flex-direction: row;
                    
                          .text_6 {
                            width: 100%;
                            text-align: center;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            font-size: 12/@rem * 1rem;
                            padding: 5/@rem * 1rem;
                            color: rgba(0, 202, 255, 1);
                            text-overflow: ellipsis;
                            overflow: hidden;
                            word-break: break-all;
                            border-right: 1/@rem * 1rem solid rgba(19, 60, 123, 1);
                            border-bottom: 1/@rem * 1rem solid rgba(19, 60, 123, 1);
                          }
                    
                          .text_6:first-of-type {
                            width: 100%;
                            text-align: center;
                            color: rgba(0, 202, 255, 1);
                            border-right: 1/@rem * 1rem solid rgba(19, 60, 123, 1);
                            border-bottom: 1/@rem * 1rem solid rgba(19, 60, 123, 1);
                          }
                        }
                    
                        .table-flex_body:first-of-type {
                          width: 100%;
                          display: flex;
                          flex-direction: row;
                          background-color: rgba(255, 255, 255, 0.2);
                          position: absolute;
                          margin-top: -28/@rem * 1rem;
                    
                          .text_6 {
                            width: 100%;
                            text-align: center;
                            font-size: 12/@rem * 1rem;
                            padding: 5/@rem * 1rem;
                            color: rgba(171, 186, 228, 1);
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            word-break: break-all;
                            border-right: 0/@rem * 1rem solid rgba(19, 60, 123, 1);
                            border-bottom: 0/@rem * 1rem solid rgba(19, 60, 123, 1);
                          }
                        }
                      }
                    }
            
                    .left_mini_box_1 {
                        width: 30%;
                        height: 100%;
                    }
            
                    .right_mini_box_1 {
                        width: 70%;
                        height: 100%;
                    }
                }
            }
        }
    }
    
    ::-webkit-scrollbar {
      width: 3/@rem * 1rem;
      height: 16/@rem * 1rem;
      background-color: rgba(0, 62, 142, 0.3);
      right: 5/@rem * 1rem;
    }
    
    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 2/@rem * 1rem rgba(0, 0, 0, 0.3);
      border-radius: 10/@rem * 1rem;
      background-color: rgba(0, 62, 142, 0.3);
    }
    
    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
      border-radius: 10/@rem * 1rem;
      -webkit-box-shadow: inset 0 0 6/@rem * 1rem rgba(0, 0, 0, .3);
      background-color: rgba(0, 72, 165, 1);
    }
    
</style>
