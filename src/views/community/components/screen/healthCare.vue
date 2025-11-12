<template>
    <div class="health_care">
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
        <div class="right_chart" id="healthCareChart"></div>
    </div>
</template>

<script>
    import * as echarts from 'echarts';
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
                left_list: [{
                        title: '60岁以上',
                        value: 82,
                        color: '#1ABFF1'
                    },
                    {
                        title: '孤寡老人',
                        value: 82,
                        color: "#1ABFF1"
                    },
                    {
                        title: '失联老人',
                        value: 82,
                        color: "#1ABFF1"
                    },
                    {
                        title: '津贴老人',
                        value: 82,
                        color: "#1ABFF1"
                    },
                    {
                        title: '独居老人',
                        value: 82,
                        color: "#1ABFF1"
                    }
                ]
            }
        },
        mounted() {
        },
        
        watch: {
            params: {
                handler(val){
                    this.setCharts()
                }
            }
        },
        methods: {
            setCharts() {
                var myCharts = echarts.init(document.getElementById('healthCareChart'));
                const option = {
                    color: this.params.color_list,
                    title: {
                        text: this.params.tj_title,
                        bottom: 3,
                        left: 'center',
                        textStyle: {
                            color: '#fff',
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontFamily: 'sans-serif',
                            fontSize: 12
                        }
                    },
                    legend: {
                        data: this.params.chart_title,
                        left: '5%',
                        textStyle: {
                            fontSize: 12,
                            color: 'rgba(255, 255, 255, .9)'
                        }
                    },
                    radar: {
                        startAngle: 68,
                        splitNumber: 4,
                        radius: 30,
                        splitArea: {
                            areaStyle: {
                                // color: ['#77EADF', '#26C3BE', '#64AFE9', '#428BD4'],
                                shadowColor: 'rgba(0, 0, 0, 0.2)',
                                shadowBlur: 10
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: 'rgba(211, 253, 250, 0.8)'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: 'rgba(211, 253, 250, 0.8)'
                            }
                        },
                        indicator: this.params.chart_x
                    },
                    series: [{
                        name: '比较',
                        type: 'radar',
                        data: this.params.chart_y
                    }]
                };
                myCharts.setOption(option);
            }
        }
    }
</script>

<style lang="less" scoped>
    .health_care {
        height: calc(20vh - 32px);
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
            height: 100%;
            // height: calc(100% + 32px);
            // transform: translateY(-32px);
        }
    }
</style>
