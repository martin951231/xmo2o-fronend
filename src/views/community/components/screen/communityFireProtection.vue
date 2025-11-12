<template>
    <div class="community_fire_protection">
        <div class="left_view">
            <div class="label_item" v-for="(item, index) in params.nav_list" :key="index">
                <div class="left_con">
                    <div class="icon"></div>
                    <div class="title">
                        <a-tooltip placement="topRight">
                            <template slot="title">
                                <span>{{item.title}}：</span>
                            </template>
                            {{item.title}}：
                        </a-tooltip>
                    </div>
                </div>
                <div class="right_value" :style="{color: item.color}">
                    <a-tooltip placement="topRight">
                        <template slot="title">
                            <span>{{item.value}}</span>
                        </template>
                        {{item.value}}
                    </a-tooltip>
                </div>
            </div>
        </div>
        <div class="right_chart" id="fireProtectionChart"></div>
    </div>
</template>

<script>
    import * as echarts from 'echarts';
    export default {
        props: {
            params: {
                type: Object,
                default: () => {
                    return {}
                }
            }
        },
        data() {
            return {
                left_list: [{
                        title: '消防总人力',
                        value: 82,
                        color: '#1ABFF1'
                    },
                    {
                        title: '消防站',
                        value: '正常',
                        color: "#1AF17A"
                    }
                ]
            }
        },
        mounted() {},
        watch: {
            params: {
                handler(val) {
                    this.setCharts()
                }
            }
        },
        methods: {
            setCharts() {
                var myCharts = echarts.init(document.getElementById('fireProtectionChart'));
                var getSeriesV=this.getSeriesV();
                const option = {
                    title: {
                        text: this.params.tj_title,
                        bottom: 0,
                        left: 'center',
                        textStyle: {
                            color: '#fff',
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontFamily: 'sans-serif',
                            fontSize: 12
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: this.params.chart_title,
                        top: '0%',
                        left: '5%',
                        textStyle: {
                            color: 'rgba(255, 255, 255, .9)',
                            fontSize: 12
                        }
                    },
                    grid: {
                        top: '25%',
                        left: '3%',
                        right: '4%',
                        bottom: '10%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.params.chart_x,
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
                                type: 'dashed',
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
                    series:getSeriesV ,
                };
                myCharts.setOption(option);
            },

            getSeriesV() {
                let chart_y = this.params.chart_y;
                let seriesData = [];
                if (chart_y) {
                    chart_y.forEach((item)=> {
                      let itemArr= {
                            name: item.name,
                            smooth: true,
                            symbolSize: 1,
                            data: item.data,
                            type: 'line',
                            itemStyle: {
                                normal: {
                                    color: item.color,
                                    lineStyle: {
                                        color: item.color,
                                    },
                                },
                            },
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: item.color //下层渐变
                                    }, {
                                        offset: 0.8,
                                        color: 'RGBA(26, 129, 246, 0)'
                                    }], false),
                                    shadowColor: 'RGBA(26, 129, 246, 0)',
                                    shadowBlur: 10
                                }
                            },
                        };
                        seriesData.push(itemArr);
                    })
                }
                return seriesData;
            }
        }
    }
</script>

<style lang="less" scoped>
    .community_fire_protection {
        height: calc(17.5vh - 32px);
        width: 100%;
        display: flex;
        padding-left: 20px;

        .left_view {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            flex-direction: column;
            width: 30%;
            height: 100%;

            .label_item {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin: 2px 0;

                .left_con {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;

                    .icon {
                        width: 7.5px;
                        height: 7.5px;
                        border-radius: 50%;
                        background-color: #6E94C5;
                    }

                    .title {
                        max-width: 70px;
                        color: #ffffff;
                        margin-left: 10px;
                        display: inline-block;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }

                .right_value {
                    max-width: 100px;
                    display: inline-block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }

        .right_chart {
            width: 70%;
            height: calc(100%);
        }
    }
</style>
