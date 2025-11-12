<template>
    <div>
        <a-descriptions title="二维码信息">
            <a-descriptions-item label="标题">
                {{ detailData.title}}
            </a-descriptions-item>
            <a-descriptions-item label="有效期">
                <span v-if="detailData.qrcode_type == 0">永久</span>
                <span v-else>临时</span>
            </a-descriptions-item>
            <a-descriptions-item label="回复内容">
                <span v-if="detailData.reply_type == 0">文字内容</span>
                <span v-else>图文内容</span>
            </a-descriptions-item>
            <a-descriptions-item label="状态">
                <span v-if="detailData.status == 1">开启</span>
                <span v-else>关闭</span>
            </a-descriptions-item>
        </a-descriptions>

        <a-tabs default-active-key="1" @change="callback">
            <a-tab-pane key="1" tab="汇总">
                <a-row :gutter="16">
                
                    <a-col :span="8" v-for="(item,index) in todayData">
                        <a-card :title="item.title" :bordered="true">
                        <div>
                            <div style="width:28%;float:left;text-align:center">
                                <a-icon type="dashboard"style="font-size: 2.5rem;"/>
                            </div>
                            <div style="width:70%;float:left;">
                                <p style="font-size:1.8rem;margin:0">{{ item.value}}
                                    <span v-if="item.show_percent ==1 && item.percent >= 0" style="font-size:0.6rem;color:red">较昨日 <a-icon type="arrow-up" /> {{ item.percent }}%</span>
                                    <span v-if="item.show_percent ==1 && item.percent < 0" style="font-size:0.6rem;color:green">较昨日 <a-icon type="arrow-down" /> {{ item.percent * -1 }}%</span>
                                </p>
                            </div>
                        </div>
                        </a-card>
                    </a-col>
                </a-row>

            <a-row :gutter="16" style="margin-top:40px;height:auto">
                <div style="float:right;margin-right:10px">
                    筛选：<a-range-picker
                    :ranges="{
                        过去30天: [moment().subtract(30, 'days'), moment()],
                        过去15天: [moment().subtract(15, 'days'), moment()],
                        过去7天: [moment().subtract(7, 'days'), moment()]
                    }"
                    format="YYYY-MM-DD"
                    style="width: 220px;"
                    @change="onDateRangeChange"
                />
                </div>

                <div id="echartsDiv" style="height:400px;clear:both;"></div>
            </a-row>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
import moment from 'moment'
import channelCodeApi from '@/api/channel_code/index'

export default {
    name: "channelStatistics",
    props: {
         // 存放路径
         statiistics_item: {
            type: [Object],
            default: {},
        },
    },
    data() {
        return {
            detailData: {},
            todayData:[],
            queryParam: {
                start_time:'',
                end_time :'',
            },
        }
    },
    
    mounted() {
        this.detailData = this.$props.statiistics_item;
        this.getTodaysDate();
        this.getChartsData()
    },
    methods: {
        moment,
        getTodaysDate() {
            this.queryParam.chanel_id = this.detailData.chanel_id;
            this.request(channelCodeApi.platformTodayStatistics, this.queryParam).then((res) => {
                this.todayData = res;
            })
        },
        getChartsData(){
            console.log('获取表格数据')
            // 基于准备好的dom，初始化echarts实例
            this.queryParam.chanel_id = this.detailData.chanel_id;
            this.request(channelCodeApi.platformCharts, this.queryParam).then((res) => {
                var myChart = this.$echarts.init(document.getElementById('echartsDiv'),null,{widht:1000,height:400});
                var option = {
                    legend: {},
                    tooltip: {},
                        dataset: {
                        dimensions: ['product', '新增扫码', '新增关注'],
                        //source: [
                            //  { product: '3-11', '新增扫码': 30, '新增关注': 2 },
                        //]
                        source:res
                    },
                    xAxis: {
                        name: '日期',
                        type: 'category'
                    },
                    yAxis: {
                        name: '数量',
                        type: 'value'
                    },
                    series: [
                        {
                            type: 'line',
                            itemStyle: {
                            normal: {
                                    color: '#1890ff', // 点的颜色
                                    lineStyle: {
                                        color: '#1890ff' // 线的颜色
                                    }
                                }
                            }
                        },
                        {
                            type: 'line',
                            itemStyle: {
                            normal: {
                                    color: 'red', // 点的颜色
                                    lineStyle: {
                                        color: 'red' // 线的颜色
                                    }
                                }
                            }
                        }
                    ]
                    };
                    // 绘制图表
                    myChart.setOption(option); 
            })

            
        },
        callback(i){
            if(i == 1){
                this.getChartsData();
            }
        },
        onDateRangeChange(date, dateString) {
            // 更新搜索框表单数据
            this.queryParam.start_time = dateString[0];
            this.queryParam.end_time = dateString[1];
            this.getChartsData();
        },
    },
}
</script>
  