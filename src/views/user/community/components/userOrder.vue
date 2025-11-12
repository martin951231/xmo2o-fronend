<template>
    <div class="user_order">
        <div id="userOrder"></div>
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
            this.request('/community/village_api.DataStatistics/getUserLableStatistics', {}).then(res => {

                res.series.forEach((item, seriesIndex) => {
                    item.data = item.data.map(v1 => v1 === 0 ? '' : v1);
                });
                const result = res
                this.getCharts(result)
            });
        },
        getCharts(result) {
            const myCharts = echarts.init(document.getElementById('userOrder'));
            const params = result
            const option = {
                tooltip: {
                    trigger: 'item',
                },
                xAxis: {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#4aa1d8'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#4aa1d8',
                            width: 1,
                            type: 'solid',
                        }
                    },
                    axisLabel: {
                        color: '#4aa1d8',
                    },
                },
                yAxis: {
                    type: 'category',
                    axisLine: {
                        lineStyle: {
                            color: '#4aa1d8'
                        }
                    },
                    axisLabel: {
                        color: '#4aa1d8',
                    },
                    data: params.axis_label,
                },
                series: []
            };

            params.series.forEach(item => {
                option.series.push(
                    {
                        name: item.name,
                        data: item.data,
                        type: 'bar',
                        stack: 'total',
                        label: {
                            show: true
                        },
                        emphasis: {
                            focus: 'series'
                        },
                    })
            })

            myCharts.setOption(option);
        }
    }
}
</script>

<style lang="less" scoped>
.user_order {
    width: 560px;
    height: 260px;
    margin-left: 10px;

    #userOrder {
        width: 560px;
        height: 260px;
    }
}
</style>