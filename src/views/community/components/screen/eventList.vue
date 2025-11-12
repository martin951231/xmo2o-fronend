<template>
    <div class="event_list">
        <div class="left_view" v-if="params.nav_left">{{params.nav_left.title}}<span style="margin-left: 2px; color: #fff; margin-top: 3px;">{{params.nav_left.value}}</span></div>
        <div class="right_view">
            <div class="top_chart">
                <div class="first_floor">
                    <div class="middle_con">
                        <div class="title" v-if="params.nav_list">{{params.nav_list[0].title}}</div>
                        <div class="value" v-if="params.nav_list">{{params.nav_list[0].value}}</div>
                    </div>
                    <div class="right_icon">
                        <img src="https://hf.pigcms.com/static/wxapp/cockpitScreen/right_arrow.png">
                    </div>
                </div>
                <div class="second_floor">
                    <div class="chart_1" id="eventListChart1"></div>
                    <div class="chart_2" id="eventListChart2"></div>
                    <div class="chart_3" id="eventListChart3"></div>
                </div>
            </div>
            <div class="bottom_table">
                <div class="item" v-for="(item, index) in params.tj_list" :key="index"
                    :style="{backgroundColor: index%2==0?'rgba(65,97,138,.7)':''}">
                    <div class="left_title">{{item.title}}</div>
                    <div class="right_value" :style="{color: item.color}">{{item.value}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as echarts from 'echarts';
    import 'echarts-liquidfill/src/liquidFill.js';
    export default {
        props: {
            params: {
                type: Object,
                default: ()=>{
                    return {}
                }
            }
        },
        data() {
            return {
                list: [{
                    title: '摄像头报警',
                    value: '事件数',
                    color: '#C01C38',
                }, {
                    title: '摄像头报警',
                    value: '已处置',
                    color: '#11A56A'
                }, {
                    title: '摄像头报警',
                    value: '事件数',
                    color: '#C01C38'
                }, {
                    title: '摄像头报警',
                    value: '处置中',
                    color: '#E5CC4C'
                }]
            }
        },
        mounted() {
            
        },
        
        watch: {
            params: {
                handler(val){
                    this.setChart('eventListChart1')
                    this.setChart('eventListChart2')
                    this.setChart('eventListChart3') 
                }
            }
        },

        methods: {
            setChart(id) {
                const myChart = echarts.init(document.getElementById(id));
                let waveColor = ''
                let value = ''
                let title = ''
                let percent = 0
                let color = ''
                if(id == 'eventListChart1'){
                    waveColor = 'rgba(255,0,0, .5)'
                    color = 'rgba(255,0,0, 1)'
                    value = this.params.nav_list[1].value * 1
                    title = this.params.nav_list[1].title
                    percent = value * 1 / this.params.nav_list[0].value * 1
                } else if(id == 'eventListChart2'){
                    waveColor = 'rgba(255,222,0, .5)'
                    color = 'rgba(255,222,0, 1)'
                    value = this.params.nav_list[2].value * 1
                    title = this.params.nav_list[2].title
                    percent = value * 1 / this.params.nav_list[0].value * 1
                } else if(id == 'eventListChart3'){
                    waveColor = 'rgba(0,255,58, .5)'
                    color = 'rgba(0,255,58, 1)'
                    value = this.params.nav_list[3].value * 1
                    title = this.params.nav_list[3].title
                    percent = value * 1 / this.params.nav_list[0].value * 1
                }
                let option = {
                    series: [{
                            type: 'liquidFill',
                            radius: '85%',
                            center: ['50%', '50%'],
                            data: [percent], // data个数代表波浪数
                            backgroundStyle: {
                                borderWidth: 1,
                                color: 'rgba(255, 255, 255, 0)'
                            },
                            // 修改波浪颜色
                            color: [waveColor], //所有波浪一个颜色
                            label: {
                                normal: {
                                    formatter: (params)=> {
                                        return value + '\n\n' + title
                                    },
                                    textStyle: {
                                        fontSize: 10,
                                        color: color
                                    },
                                },
                            },
                            outline: {
                                show: false,
                            },
                        },
                        {
                            type: "pie",
                            center: ["50%", "50%"],
                            radius: ["90%", "100%"],
                            hoverAnimation: false,
                            data: [{
                                name: "",
                                value: 23,
                                label: {
                                    show: true,
                                    position: "center",
                                    color: "rgba(0,0,0,0)",
                                    fontSize: 12,
                                    fontWeight: "bold",
                                    formatter: function(o) {
                                        return value
                                    }
                                },
                                itemStyle: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                            offset: 0,
                                            color: 'rgba(84, 224, 254, .2)',
                                        },
                                        {
                                            offset: 1,
                                            color: 'rgba(84, 224, 254, .5)',
                                        },
                                    ]),
                                },
                            }, {
                                name: "",
                                value: 0.3,
                                label: {
                                    show: false
                                },
                                itemStyle: {
                                    color: 'RGBA(28, 84, 147, 1)',
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                }
                            }]
                        },
                        {
                            type: 'pie',
                            center: ['50%', '52%'],
                            radius: ['80%', '90%'],
                            hoverAnimation: false,
                            data: [{
                                    name: '',
                                    value: 0,
                                    label: {
                                        show: false,
                                        position: 'center',
                                        color: 'rgba(0,0,0,0)',
                                        fontSize: 12,
                                        fontWeight: 'bold',
                                        formatter: function(o) {
                                            return value;
                                        },
                                    },
                                    itemStyle: {
                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                                offset: 0,
                                                color: '#5089FE',
                                            },
                                            {
                                                offset: 1,
                                                color: '#52C5FF',
                                            },
                                        ]),
                                    },
                                },
                                {
                                    //画剩余的刻度圆环
                                    name: '',
                                    value: 2,
                                    label: {
                                        show: false,
                                    },
                                    itemStyle: {
                                        color: 'rgba(0,0,0,0)',
                                    },
                                },
                            ],
                        },
                    ],
                };
                myChart.setOption(option);
            }
        }
    }
</script>

<style lang="less" scoped>
    .event_list {
        height: calc(27.5vh - 32px);
        width: 100%;
        padding-left: 15px;
        display: flex;

        .left_view {
            width: 14px;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            word-break: break-all;
            font-size: 14px;
            color: #00C4F5;
            font-weight: bold;
            line-height: 16px;
            margin-left: 5px;
        }

        .right_view {
            width: calc(100% - 30px);

            .top_chart {
                height: 50%;

                .first_floor {
                    display: flex;
                    justify-content: space-between;

                    .middle_con {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-left: 39%;

                        .title {
                            font-size: 14px;
                            color: #ffffff;
                        }

                        .value {
                            color: #FFDE00;
                            font-weight: bold;
                            font-size: 20px;
                            margin-left: 10px;
                        }
                    }

                    .right_icon {
                        width: 10px;
                        height: 8px;
                        margin-right: 20px;
                        margin-top: 5px;

                        img {
                            width: 10px;
                            height: 8px;
                        }
                    }
                }

                .second_floor {
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    margin-top: 5px;

                    .chart_1 {
                        width: 70px;
                        height: 70px;
                    }

                    .chart_2 {
                        width: 70px;
                        height: 70px;
                    }

                    .chart_3 {
                        width: 70px;
                        height: 70px;
                    }
                }
            }

            .bottom_table {
                height: 50%;
                overflow-y: scroll;

                &::-webkit-scrollbar {
                    width: 0;
                }

                .item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 20px;
                    height: 30px;
                    width: 90%;
                    margin: 0 auto;
                    
                    .left_title {
                        color: #fff;
                        font-weight: bold;
                        font-size: 14px;
                        width: 50%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        text-align: left;
                    }

                    .right_value {
                        font-size: 14px;
                        width: 50%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        text-align: right;
                    }
                }
            }
        }
    }
</style>
