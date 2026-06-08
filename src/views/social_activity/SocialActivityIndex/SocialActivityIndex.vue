<template>
    <div class="social-activity-index">
        <h2 class="title">活动数据</h2>
        <div class="data-card-container">
            <div class="data-card">
                <div class="data-label">活动总数</div>
                <div class="data-value">{{ activity_data.total }}</div>
            </div>
            <div class="data-card">
                <div class="data-label">待审核活动</div>
                <div class="data-value">{{ activity_data.pending }}</div>
            </div>
            <div class="data-card">
                <div class="data-label">已发布活动</div>
                <div class="data-value">{{ activity_data.published }}</div>
            </div>
            <div class="data-card">
                <div class="data-label">已结束活动</div>
                <div class="data-value">{{ activity_data.ended }}</div>
            </div>
        </div>

        <h2 class="title">活动人次数据</h2>
        <div class="data-card-container">
            <div class="data-card">
                <div class="data-label">总报名人次</div>
                <div class="data-value">{{ participant_data.total_attendance }}</div>
            </div>
            <div class="data-card">
                <div class="data-label">总签到人次</div>
                <div class="data-value">{{ participant_data.total_signups }}</div>
            </div>
        </div>

        <h2 class="title">活动效果数据</h2>
        <div class="chart-container">
            <div class="chart-item">
                <div class="chart-label">
                    平均参与率
                    <a-tooltip title="活动总签到人数/活动总报名人数*100%">
                        <a-icon type="question-circle" class="question-icon" />
                    </a-tooltip>
                </div>
                <div class="chart-value">{{ effect_data.avg_participation_rate }}%</div>
                <div class="chart">
                    <div ref="chart1" class="chart-ref"></div>
                </div>
            </div>
            <div class="chart-item">
                <div class="chart-label">
                    平均转化率
                    <a-tooltip title="总报名人数/活动总浏览量（去重用户）*100%">
                        <a-icon type="question-circle" class="question-icon" />
                    </a-tooltip>
                </div>
                <div class="chart-value">{{ effect_data.avg_conversion_rate }}%</div>
                <div class="chart">
                    <div ref="chart2" class="chart-ref"></div>
                </div>
            </div>
            <div class="chart-item">
                <div class="chart-label">
                    评论覆盖率
                    <a-tooltip title="发布评论的用户/总签到用户*100%">
                        <a-icon type="question-circle" class="question-icon" />
                    </a-tooltip>
                </div>
                <div class="chart-value">{{ effect_data.comment_rate }}%</div>
                <div class="chart">
                    <div ref="chart3" class="chart-ref"></div>
                </div>
            </div>
            <div class="chart-item">
                <div class="chart-label">
                    重复参与率
                    <a-tooltip title="签到≥2的用户/总签到用户*100%">
                        <a-icon type="question-circle" class="question-icon" />
                    </a-tooltip>
                </div>
                <div class="chart-value">{{ effect_data.reengagement_rate }}%</div>
                <div class="chart">
                    <div ref="chart4" class="chart-ref"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts'
import { Tooltip, Icon } from 'ant-design-vue'
import socialActivityApi from '@/api/social_activity/index';

export default {
    name: 'SocialActivityIndex',
    components: {
        'a-tooltip': Tooltip,
        'a-icon': Icon
    },
    created() {
        this.getActivityData()
    },
    data() {
        return {
            chart1: null,
            chart2: null,
            chart3: null,
            chart4: null,
            activity_data: {
                total: 0, //活动总数
                pending: 0, //待审核
                published: 0, //已发布
                ended: 0 //已结束
            },
            participant_data: {
                total_signups: 0, //总签到数
                total_attendance: 0 //总报名数
            },
            effect_data: {
                avg_participation_rate: 0, //平均参与率
                avg_conversion_rate: 0, //平均转化率
                comment_rate: 0, //评论覆盖率
                reengagement_rate: 0 //重复参与率
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initCharts()
        })
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.handleResize)
        if (this.chart1) this.chart1.dispose()
        if (this.chart2) this.chart2.dispose()
        if (this.chart3) this.chart3.dispose()
        if (this.chart4) this.chart4.dispose()
    },
    methods: {
        getActivityData() {
            this.request(socialActivityApi.getIndexInfo, []).then((res) => {
                this.activity_data = res.activity_data
                this.participant_data = res.participant_data
                this.effect_data = res.effect_data
                this.initCharts()
            })
        },
        initCharts() {
            this.chart1 = this.initChart(this.$refs.chart1, this.effect_data.avg_participation_rate, '平均参与率')
            this.chart2 = this.initChart(this.$refs.chart2, this.effect_data.avg_conversion_rate, '平均转化率')
            this.chart3 = this.initChart(this.$refs.chart3, this.effect_data.comment_rate, '评论覆盖率')
            this.chart4 = this.initChart(this.$refs.chart4, this.effect_data.reengagement_rate, '重复参与率')
            window.addEventListener('resize', this.handleResize)
        },
        handleResize() {
            if (this.chart1) this.chart1.resize()
            if (this.chart2) this.chart2.resize()
            if (this.chart3) this.chart3.resize()
            if (this.chart4) this.chart4.resize()
        },
        initChart(ref, percent, label) {
            if (!ref) return null
            const chart = echarts.init(ref)
            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c}%',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    borderWidth: 0,
                    textStyle: {
                        color: '#fff',
                        fontSize: 12
                    },
                    padding: [6, 10]
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['55%', '75%'],
                        center: ['50%', '50%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        },
                        emphasis: {
                            scale: true,
                            scaleSize: 5
                        },
                        data: [
                            {
                                value: percent,
                                name: label,
                                itemStyle: {
                                    color: '#1890FF'
                                },
                                tooltip: {
                                    backgroundColor: 'rgba(24, 144, 255, 0.9)'
                                }
                            },
                            {
                                value: 100 - percent,
                                name: '未完成',
                                itemStyle: {
                                    color: '#CBD5E1'
                                },
                                tooltip: {
                                    backgroundColor: 'rgba(160, 175, 195, 0.9)'
                                }
                            }
                        ]
                    }
                ]
            }
            chart.setOption(option)
            return chart
        }
    }
}
</script>

<style lang="less" scoped>
@primary-color: #1890FF;
@bg-light: #F5F7FA;
@bg-card: #ffffff;
@text-primary: #303133;
@text-secondary: #606266;
@text-muted: #909399;
@border-color: #EBEEF5;
@shadow-light: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

.social-activity-index {
    padding: 24px;
    background: linear-gradient(135deg, #f6f8fc 0%, #fdfefe 100%);
    height: 100%;
    margin: 10px 0;
    box-sizing: border-box;

    .title {
        font-size: 18px;
        font-weight: 600;
        color: @text-primary;
        margin: 0 0 20px 0;
        padding-left: 12px;
        border-left: 4px solid @primary-color;
        display: flex;
        align-items: center;

        &::before {
            content: '';
            margin-right: 8px;
        }
    }

    .data-card-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 20px;
        margin-bottom: 32px;

        .data-card {
            background: @bg-card;
            padding: 24px;
            border-radius: 12px;
            position: relative;
            box-shadow: @shadow-light;
            transition: all 0.3s ease;
            border: 1px solid @border-color;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 24px 0 rgba(24, 144, 255, 0.15);
                border-color: @primary-color;
            }

            .data-label {
                font-size: 14px;
                color: @text-secondary;
                margin-bottom: 12px;
                display: flex;
                align-items: center;

                &::before {
                    content: '';
                    width: 6px;
                    height: 6px;
                    background: @primary-color;
                    border-radius: 50%;
                    margin-right: 8px;
                }
            }

            .data-value {
                font-size: 32px;
                font-weight: 700;
                color: @text-primary;
                font-family: 'Helvetica Neue', Arial, sans-serif;

                .trend {
                    display: inline-block;
                    margin-left: 12px;
                    font-size: 13px;
                    font-weight: 500;
                    padding: 2px 8px;
                    border-radius: 4px;

                    &.up {
                        color: #67C23A;
                        background: rgba(103, 194, 58, 0.1);
                    }

                    &.down {
                        color: #F56C6C;
                        background: rgba(245, 108, 108, 0.1);
                    }
                }
            }
        }
    }

    .chart-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 20px;

        .chart-item {
            background: @bg-card;
            padding: 24px;
            border-radius: 12px;
            position: relative;
            text-align: center;
            box-shadow: @shadow-light;
            transition: all 0.3s ease;
            border: 1px solid @border-color;

            &:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 24px 0 rgba(24, 144, 255, 0.15);
                border-color: @primary-color;
            }

            .chart-label {
                font-size: 15px;
                color: @text-secondary;
                margin-bottom: 8px;
                font-weight: 500;
                display: inline-block;

                .question-icon {
                    margin-left: 4px;
                    color: @text-muted;
                    cursor: pointer;
                    transition: color 0.3s;

                    &:hover {
                        color: @primary-color;
                    }
                }
            }

            .chart-value {
                font-size: 28px;
                font-weight: 700;
                color: @primary-color;
                margin-bottom: 16px;
                font-family: 'Helvetica Neue', Arial, sans-serif;
            }

            .chart {
                height: 140px;
                position: relative;

                .chart-ref {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
}
</style>