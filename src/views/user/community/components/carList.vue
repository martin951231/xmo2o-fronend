<template>
    <div class="car_List">
        <div id="carList"></div>
    </div>
</template>

<script>
import echarts from 'echarts' //引入echarts
export default {
    data() {
        return {
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        getData() {
            let that = this
            this.request('/community/village_api.DataStatistics/carStatistics').then(res => {
                const result = res

                this.getCharts(result)
            });
        },
        getCharts(result) {
            const myCharts = echarts.init(document.getElementById('carList'));
            const params = result.car_pay_info

            console.log(params, '这里有数据吗');
            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: params.legend_data,
                    textStyle: {
                        color: '#fff',
                        fontSize: 12
                    }
                },
                xAxis: [{
                    type: 'category',
                    data: params.xAxis_data,
                    axisLabel: {//x轴文字的配置
                        show: true,
                        rotate: 45,   // 设置x轴标签旋转角度
                        textStyle: {
                            color: 'RGBA(255, 255, 255, 0.7)',
                        }
                    }
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
                    axisLabel: {//y轴文字的配置
                        textStyle: {
                            color: 'RGBA(255, 255, 255, 0.7)',
                            margin: 15
                        }
                    }
                }],
                series: [{
                    name: '月租车缴费金额',
                    type: 'bar',
                    barWidth: 10,
                    emphasis: {
                        focus: 'series'
                    },
                    data: params.series.monthlycar,
                    itemStyle: {
                        color: '#09b9ff'
                    }
                },
                {
                    name: '临时车缴费金额',
                    type: 'bar',
                    barWidth: 10,
                    emphasis: {
                        focus: 'series'
                    },
                    data: params.series.temporarycar,
                    itemStyle: {
                        color: '#07af0e'
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
.car_List {
    width: 300px;
    height: 220px;

    #carList {
        width: 300px;
        height: 220px;
    }
}
</style>