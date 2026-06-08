<template>
    <div class="statistics-warp">
        <div class="main-box flex align-center">
            <div class="statistics-item">
                <div class="value">{{form_data.submit_count || 0}}</div>
                <div class="title">{{L('问卷提交总数')}}</div>
            </div>
            <a-divider type="vertical" />
            <div class="statistics-item">
                <div class="value">{{form_data.total_submit_count || 0}}</div>
                <div class="title">{{L('今日提交数')}}</div>
            </div>
            <a-divider type="vertical" />
            <div class="statistics-item">
                <div class="value">{{form_data.user_count || 0}}</div>
                <div class="flex align-center justify-center">
                    <div class="title">{{L('提交用户数')}}</div>
                    <!-- <a-tooltip placement="top">
                        <template slot="title">
                            <span>{{L('提交用户数是去重复后的统计数据，同一个用户提交 多次，只计数一次')}}</span>
                        </template>
                        <a-icon type="question-circle" />
                    </a-tooltip>-->
                </div>
            </div>
            <a-divider type="vertical" />
            <div class="statistics-item">
                <div class="value">{{form_data.visit_count || 0}}</div>
                <div class="flex align-center justify-center">
                    <div class="title">{{L('浏览总数')}}</div>
                    <!-- <a-tooltip placement="top">
                        <template slot="title">
                            <span>{{L('进入移动端投票问卷页面就增加一次浏览数，多次打 开会计算多次')}}</span>
                        </template>
                        <a-icon type="question-circle" />
                    </a-tooltip>-->
                </div>
            </div>
        </div>
        <div class="main-box">
            <a-tabs type="card" v-model="activeKey">
                <a-tab-pane :key="0" :tab="L('数据报表')">
                    <div class="table-grid mt-20">
                        <div class="item" v-for="(item,index) in question_data.questions" :key="index">
                            <div class="fw-bold mb-10">{{index+1}}、{{item.title}}</div>
                            <a-table rowKey="id" bordered :pagination="false" :columns="columns" :data-source="item.question_options">
                                <span slot="percent" slot-scope="text, record">{{record.percent}}%</span>
                                <span slot="label" slot-scope="text, record">
                                    <div v-if="item.type == 'rating'">{{record.rate}}</div>
                                    <div v-else>{{record.label}}</div>
                                </span>
                            </a-table>
                        </div>
                    </div>
                </a-tab-pane>
                <a-tab-pane :key="2" :tab="L('数据统计')">
                    <div class="mt-10"></div>
                    <div class="flex justify-end">
                        <a-form-model layout="inline" @submit.native.prevent :model="queryParams">
                            <a-form-model-item>
                                <a-button type="primary" @click="formSubmitList('export')" icon="download">{{ L('导出') }}</a-button>
                            </a-form-model-item>
                        </a-form-model>
                    </div>
                    <div class="mb-10"></div>
                    <a-table
                        :scroll="{ x: (200 * formSubmiColumns.length) }"
                        rowKey="id"
                        bordered
                        :loading="tableLoading"
                        :columns="formSubmiColumns"
                        :data-source="submitList"
                        :pagination="pagination"
                    >
                        <span slot="image" slot-scope="text, record">
                            <div class="flex" style="flex-wrap: wrap;">
                                <BeautifulImage class="mr-10 mb-10" v-for="(item,index) in record.images" :key="index" :src="item" width="50px" height="50px" visible></BeautifulImage>
                            </div>
                        </span>
                        <span slot="file" slot-scope="text, record">
                            <a :title="item" style="display: block;width:300px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" v-for="(item,index) in record.files" :key="index" :href="item" target="_blank">{{item}}</a>
                        </span>
                    </a-table>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
import questionnaireSurveyApi from '@/api/common/platform/questionnaireSurvey'
import { cloneDeep } from 'lodash'
import BeautifulImage from '@/components/BeautifulImage/BeautifulImage.vue'
export default {
    props: {
        form_id: {
            type: [Number, String],
            default: 0,
        },
        tokenName: {
            type: String,
            default: '',
        },
    },
    components: { BeautifulImage },
    data() {
        return {
            activeKey: 0,
            columns: [
                {
                    title: this.L('选项内容'),
                    dataIndex: 'label',
                    scopedSlots: { customRender: 'label' },
                },
                {
                    title: this.L('选择数量'),
                    dataIndex: 'submit_count',
                },
                {
                    title: this.L('选择占比'),
                    dataIndex: 'percent',
                    key: 'percent',
                    scopedSlots: { customRender: 'percent' },
                },
            ],
            form_data: {},
            question_data: {},
            submitList: [],
            formSubmiColumns: [
                {
                    title: this.L('提交人昵称'),
                    dataIndex: 'nickname',
                    customRender: (text, record, index) => {
                        return record.user ? record.user.nickname : record.ip_address
                    },
                    fixed: 'left',
                    width: 120,
                },
                {
                    title: this.L('提交人号码'),
                    dataIndex: 'phone',
                    customRender: (text, record, index) => {
                        return record.user ? record.user.phone : ''
                    },
                    fixed: 'left',
                    width: 150,
                },
                {
                    title: this.L('提交时间'),
                    dataIndex: 'create_time',
                    fixed: 'left',
                    width: 170,
                },
                {
                    title: this.L('消耗时间'),
                    dataIndex: 'spend_time',
                    fixed: 'left',
                    customRender: (text, record, index) => {
                        return record.spend_time + 's'
                    },
                    width: 100,
                },
            ],
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => this.L(`共 X1 条数据`, { X1: total }),
            },
            tableLoading: false,
            queryParams: {},
            detail: null,
        }
    },
    created() {},
    methods: {
        setFormData(data) {
            this.detail = cloneDeep(data)
            this.detail.questions.forEach((item) => {
                this.formSubmiColumns.push({
                    title: item.title,
                    dataIndex: item.type + '_value_' + item.id,
                    scopedSlots: { customRender: item.type },
                })
            })
            this.getOverview()
            this.formSubmitList()
        },
        getOverview() {
            this.request(questionnaireSurveyApi.overview, {
                form_id: this.form_id,
                tokenName: this.tokenName + '_access_token',
            }).then((res) => {
                this.form_data = res.form_data
                this.question_data = res.question_data
            })
        },
        formSubmitList(actions = '') {
            this.tableLoading = true
            this.queryParams.page = this.pagination.current
            this.queryParams.pageSize = this.pagination.pageSize
            let params = {
                ...this.queryParams,
                form_id: this.form_id,
                tokenName: this.tokenName + '_access_token',
            }
            if (actions == 'export') {
                params.is_export = 1
            } else {
                params.is_export = 0
            }
            this.request(questionnaireSurveyApi.formSubmitList, params)
                .then((res) => {
                    this.tableLoading = false
                    if (actions == 'export') {
                        res.url && window.open(res.url)
                        return
                    }
                    this.submitList = res.data.map((v) => {
                        v.answers.forEach((a) => {
                            const item = this.detail.questions.find((i) => i.id == a.question_id)
                            v[item.type + '_value_' + a.question_id] = a.answer
                            if (item.type == 'image') {
                                v['images'] = a.extra_answer
                            }
                            if (item.type == 'file') {
                                v['files'] = a.extra_answer
                            }
                        })
                        return v
                    })
                    this.pagination.total = res.total
                })
                .catch((err) => {
                    this.tableLoading = false
                })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.formSubmitList()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.formSubmitList()
        },
    },
}
</script>

<style lang="less" scoped>
@main-border-radius: 8px;
.statistics-warp {
    width: 100%;
    height: 100%;
    background-color: #f8f9fd;
    overflow: hidden;
    overflow-y: auto;
}
::v-deep .ant-tabs .ant-tabs-bar {
    border-bottom: 1px solid #e8e8e8 !important;
}
.main-box {
    background-color: #fff;
    margin: 20px;
    padding: 20px;
    box-shadow: 0px 2px 14px rgba(0, 0, 0, 0.03);
    border-radius: @main-border-radius;
    .statistics-item {
        flex: 1;
        text-align: center;
        .value {
            margin-bottom: 5px;
            font-weight: bold;
            color: #1890ff;
            font-size: 24px;
        }
        .title {
            font-weight: bold;
            color: #333;
        }
    }
}
.ant-divider,
.ant-divider-vertical {
    height: 50px;
}
.table-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 创建两列，每列宽度相等 */
    gap: 20px; /* 设置列和行之间的间距为 20 像素 */
}
</style>