<template>
    <div class="gender_ratio">
        <div id="genderRatio"></div>
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
                this.request('/community/village_api.DataStatistics/getPopulationSexStatistics', {}).then(res => {
                    that.getCharts(res)
                });
            },
            getCharts(res) {
                const myChart = this.$echarts.init(document.getElementById('genderRatio'));
                const option = {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        left: '60%',
                        top: 'middle',
                        width: 90,
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
                    },
                    series: [{
                        name: res[2],
                        type: 'pie',
                        center: ['30%', '50%'],
                        radius: ['40%', '65%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 14,
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: res[0]
                    }]
                };
                myChart.setOption(option);
            }
        }
    }
</script>

<style lang="less" scoped>
    .gender_ratio {
        width: 318px;
        height: 145px;

        #genderRatio {
            width: 318px;
            height: 145px;
        }
    }
</style>