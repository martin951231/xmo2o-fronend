<template>
    <div class="community_security">
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
        <div class="right_chart" id="security_chart"></div>
    </div>
</template>

<script>
    import * as echarts from 'echarts';
    export default {
        props: {
            params: {
                type: Object,
                default: ()=>{ return {}}
            }
        },
        data() {
            return {
                // image: 'image://https://hf.pigcms.com/static/wxapp/cockpitScreen/little_circle.png',
                image: 'circle',
                left_list: [{
                        title: '总警力',
                        value: 82,
                        color: '#1ABFF1'
                    },
                    {
                        title: '总警力',
                        value: '正常',
                        color: "#1AF17A"
                    },
                    {
                        title: '总警力',
                        value: 82,
                        color: "#1ABFF1"
                    },
                    {
                        title: '总警力',
                        value: 82,
                        color: "#1ABFF1"
                    },
                    {
                        title: '总警力',
                        value: 82,
                        color: "#1ABFF1"
                    }
                ]
            }
        },
        
        watch: {
            params: {
                handler(val){
                    this.setCharts(val)
                }
            }
        },
        
        mounted() {
        },
        methods: {
            setCharts(val) {
                let links = [{
                        source: "1",
                        target: "2"
                    },
                    {
                        source: "1",
                        target: "3"
                    },
                    {
                        source: "1",
                        target: "4"
                    },
                    {
                        source: "1",
                        target: "5"
                    },
                    {
                        source: "1",
                        target: "6"
                    },
                    {
                        source: "1",
                        target: "7"
                    },
                    {
                        source: "1",
                        target: "8"
                    },
                    {
                        source: "1",
                        target: "9"
                    },
                    {
                        source: "1",
                        target: "10"
                    },
                ];

                let nodes = [{
                        name: "",
                        id: "1",
                        symbolSize: 10, //节点大小
                        // symbol:'circle',//节点形状，'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'也可'image://url'设置节点图片
                        symbol: this.image
                    },
                    {
                        name: "方怡",
                        id: "2",
                        symbolSize: 3,
                        symbol: this.image
                    },
                    {
                        name: "双儿",
                        id: "3",
                        symbolSize: 3,
                        symbol: this.image
                    },
                    {
                        name: "茅十八",
                        id: "4",
                        symbolSize: 3,
                        symbol: this.image
                    },
                    {
                        name: "",
                        id: "5",
                        symbolSize: 3,
                        symbol: this.image
                    },
                    {
                        name: "",
                        id: "6",
                        symbolSize: 3,
                        symbol: this.image
                    },
                    {
                        name: "",
                        id: "7",
                        symbolSize: 3,
                        symbol: this.image
                    },
                    {
                        name: "",
                        id: "8",
                        symbolSize: 3,
                        symbol: this.image
                    },
                    {
                        name: "",
                        id: "9",
                        symbolSize: 3,
                        symbol: this.image
                    },
                    {
                        name: "",
                        id: "10",
                        symbolSize: 3,
                        symbol: this.image
                    },
                ];
                
                let options = {
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
                    series: [{
                        type: 'graph',
                        layout: 'force',
                        nodes: val.tj_list,
                        links: val.links,
                        draggable: false,
                        symbolSize: [149, 100],
                        nodeScaleRadio: 0,
                        // roam: true,
                        top: '-5%',
                        force: {
                            initLayout: 'circular',
                            gravity: .5,
                            repulsion: 200,
                            edgeLength: 50
                        },
                        itemStyle: {
                            color: {
                                type: "radial",
                                x: 0.5,
                                y: 0.5,
                                r: 0.5,
                                colorStops: [{
                                        offset: 0,
                                        color: "rgba(78,172,206, .1)", // 0% 处的颜色
                                    },
                                    {
                                        offset: 0.7,
                                        color: "rgba(78,172,206,.7)", // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: "rgba(78,172,206, 1)", // 100% 处的颜色
                                    },
                                ],
                                global: false, // 缺省为 false
                            },
                        },
                        lineStyle: {
                            opacity: 1,
                            width: 1.5,
                            normal: {
                                color: '#38AAD0'
                            }
                        },
                        label: {
                            show: true,
                            position: "bottom",
                            distance: 5,
                            fontSize: 10,
                            color: '#ffffff',
                            align: "center",
                            formatter: (params) => {
                                // return params.data.name + '\n\n' + params.data.percent
                                return '{name|'+params.data.name+'} \n {percent|'+params.data.percent+'}'
                            },
                            rich: {
                                name: {
                                    fontSize: 10,
                                    color: '#ffffff',
                                    align: "center",
                                },
                                percent: {
                                    fontSize: 10,
                                    color: '#ffffff',
                                    align: "center",
                                    height: 20
                                }
                            }
                        },
                        autoCurveness: 5, //多条边的时候，自动计算曲率
                        edgeLabel: { //边的设置
                            show: true,
                            position: "middle",
                            fontSize: 10,
                            formatter: () => {
                                return '';
                            },
                        },
                        // edgeSymbol: ["circle"], //边两边的类型
                    }, ],
                };

                var myChart = echarts.init(document.getElementById('security_chart'));
                myChart.setOption(options)
            }
        }
    }
</script>

<style lang="less" scoped>
    .community_security {
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
        }
    }
</style>
