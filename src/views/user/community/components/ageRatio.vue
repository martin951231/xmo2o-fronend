<template>
    <div class="age_ratio">
        <div id="ageRatio"></div>
    </div>
</template>

<script>
    import echarts from 'echarts' //引入echarts
    export default {
        data() {
            return {
                genderList: [{
                    name: '男',
                    value: 3,
                    rate: 12,
                    itemStyle: {
                        color: '#00f6ff',
                        fontSize: 14,
                    },
                }, {
                    name: '女',
                    value: 5,
                    rate: 20,
                    itemStyle: {
                        color: '#e4007f',
                        fontSize: 14,
                    },
                }]
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData() {
                let that = this
                this.request('/community/village_api.DataStatistics/getPopulationAgeStatistics', {}).then(res => {
                    const result = res
                    this.getCharts(result)
                });
            },
            getCharts(result) {
                const myCharts = echarts.init(document.getElementById('ageRatio'));
                const option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid: {
                        top: "5%",
                        left: "10%",
                        right: "10%",
                        bottom: "30%"
                    },
                    legend: {
                        data: result.legend_data,
                        bottom: '0',
                        textStyle: {
                            color: '#fff',
                            fontSize: 12
                        }
                    },
                    xAxis: [{
                        type: 'category',
                        data: result.xAxis_data,
                        axisLabel: { //x轴文字的配置
                            show: true,
                            textStyle: {
                                color: "#fff",
                            }
                        },
                    }],
                    yAxis: [{
                        type: 'value',
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type: 'dashed',
                                color: 'RGBA(1, 100, 173, 0.7)'
                            }
                        },
                        axisLabel: { //x轴文字的配置
                            show: true,
                            textStyle: {
                                color: "#fff",
                            }
                        },
                    }],
                    series: [{
                            name: '男性',
                            type: 'bar',
                            barWidth: 10,
                            emphasis: {
                                focus: 'series'
                            },
                            data: result.series.find(v=>v.name == '男').data,
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'RGBA(1, 100, 173, 1)'
                                    },
                                    {
                                        offset: 0.3,
                                        color: 'RGBA(1, 100, 173, 0.3)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'RGBA(17, 145, 163, 0)'
                                    }
                                ])
                            }
                        },
                        {
                            name: '女性',
                            type: 'bar',
                            barWidth: 10,
                            emphasis: {
                                focus: 'series'
                            },
                            data: result.series.find(v=>v.name == '女').data,
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'RGBA(51, 243, 254, 1)'
                                    },
                                    {
                                        offset: 0.3,
                                        color: 'RGBA(51, 243, 254, .3)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'RGBA(51, 243, 254, 0)'
                                    }
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
    .age_ratio {
        width: 318px;
        height: 147px;

        #ageRatio {
            width: 318px;
            height: 147px;
        }
    }
</style>