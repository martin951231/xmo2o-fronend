<template>
    <div class="mt-10 mb-10">
        <div class="main-box-content-min">
            <div class="flex justify-between align-center mb-20">
                <h3 v-if="actionType == 'signup'">{{ L('报名表单') }}</h3>
                <h3 v-else>{{ L('问卷列表') }}</h3>
                <a-form-model layout="inline" @submit.native.prevent :model="queryParams">
                    <a-form-model-item>
                        <a-input style="width: 200px" :placeholder="L('搜索名称')" v-model="queryParams.title" />
                    </a-form-model-item>
                    <a-form-model-item>
                        <a-select v-model="queryParams.status" style="width: 120px">
                            <a-select-option :value="item.value" v-for="item in statusTypeList" :key="item.value">{{
                                item.label }}</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item>
                        <a-button type="primary" @click="onSearch" icon="search">{{ L('搜索') }}</a-button>
                    </a-form-model-item>
                    <a-form-model-item v-if="tokenName == 'socialactivity'">
                        <a-button v-saction:survey_create,signup_create type="primary" @click="addQuestionnaire"
                            icon="plus">{{ L('新建') }}</a-button>
                    </a-form-model-item>
                    <a-form-model-item v-else>
                        <a-button type="primary" @click="addQuestionnaire" icon="plus">{{ L('新建') }}</a-button>
                    </a-form-model-item>
                </a-form-model>
            </div>
            <a-table :columns="columns" rowKey="id" :data-source="list" :pagination="pagination"
                :loading="tableLoading">
                <span slot="status" slot-scope="text, record">
                    <a-tag color="blue">{{ statusText[record.status] }}</a-tag>
                    <a-switch v-if="record.status != 2" :checked-children="L('启用')" :un-checked-children="L('禁用')"
                        :checked="record.status == 1 ? true : false" @change="statusChange($event, record)" />
                </span>
                <span slot="qrcode" slot-scope="text, record">
                    <a @click="viewQrCode(record)">{{ L('查看') }}</a>
                </span>
                <span slot="action" slot-scope="text, record" v-if="tokenName == 'socialactivity'">
                    <a @click="editClick(record)" v-saction:survey_edit,signup_edit>{{ L('编辑') }}</a>
                    <span v-if="actionType != 'signup'" v-saction:survey_statistics>
                        <a-divider type="vertical" />
                        <a @click="viewClick(record)">{{ L('查询数据') }}</a>
                    </span>
                    <span v-if="record.status != 1" v-saction:survey_delete,signup_delete>
                        <a-divider type="vertical" />
                        <a @click="delClick(record)" style="color: red">{{ L('删除') }}</a>
                    </span>
                </span>
                <span slot="action" slot-scope="text, record" v-else>
                    <a @click="editClick(record)">{{ L('编辑') }}</a>
                    <template v-if="actionType != 'signup'">
                        <a-divider type="vertical" />
                        <a @click="viewClick(record)">{{ L('查询数据') }}</a>
                    </template>
                    <template v-if="record.status != 1">
                        <a-divider type="vertical" />
                        <a @click="delClick(record)" style="color: red">{{ L('删除') }}</a>
                    </template>
                </span>
            </a-table>
        </div>


        <!-- 移动端预览 -->
        <a-modal v-model:visible="mobilePreviewVisible" title="移动端" :footer="null">
            <div class="content">
                <div class="code-box">
                    <div class="code" v-if="wxappQrcode">
                        <img :src="wxappQrcode" />
                        <div>{{ L('小程序') }}</div>
                    </div>
                    <div class="code" v-if="h5Qrcode">
                        <img :src="h5Qrcode" />
                        <div>{{ L('H5链接') }}
                            <a-icon type="copy" theme="outlined" v-clipboard:copy="h5Url"
                                v-clipboard:success="copySuccess" v-clipboard:error="copyError" />
                        </div>
                    </div>
                </div>
            </div>
        </a-modal>

    </div>
</template>

<script>
import questionnaireSurveyApi from '@/api/common/platform/questionnaireSurvey'
import moment from 'moment'
import { getSystemName } from '@/utils/util'
export default {
    components: {
    },
    props: {
        actionType: {
            type: String,
            default: 'survey',
        },
    },
    data() {
        return {
            statusText: {
                1: this.L('已发布'),
                2: this.L('草稿'),
                3: this.L('已关闭'),
            },
            queryParams: {
                status: 0, //状态：2-草稿 1-启用  3-禁用
                page: 1,
                pageSize: 10,
                title: '',
            },
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
            columns: [
                {
                    title: this.L('问卷名称'),
                    dataIndex: 'title',
                },
                {
                    title: this.L('提交总数'),
                    dataIndex: 'submit_count',
                },
                {
                    title: this.L('有效期限'),
                    dataIndex: 'end_time',
                },
                {
                    title: this.L('创建时间'),
                    dataIndex: 'create_time',
                },
                {
                    title: this.L('移动端'),
                    dataIndex: 'qrcode',
                    scopedSlots: { customRender: 'qrcode' },
                },
                {
                    title: this.L('问卷状态'),
                    dataIndex: 'status',
                    scopedSlots: { customRender: 'status' },
                },
                {
                    title: this.L('操作'),
                    key: 'action',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            statusTypeList: [
                {
                    label: this.L('全部'),
                    value: 0,
                },
                {
                    label: this.L('启用'),
                    value: 1,
                },
                {
                    label: this.L('草稿'),
                    value: 2,
                },
                {
                    label: this.L('禁用'),
                    value: 3,
                },
            ],
            list: [],
            tableLoading: false,
            confirmLoading: false,

            //移动端预览
            mobilePreviewVisible: false,
            wxappQrcode: '',
            h5Qrcode: '',
            h5Url: '',
            tokenName: '',
        }
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    created() {
        let sysName = getSystemName(location.hash);
        this.tokenName = sysName;
        if (this.actionType == 'signup') {
            this.columns = [
                {
                    title: this.L('表单名称'),
                    dataIndex: 'title',
                },
                {
                    title: this.L('创建时间'),
                    dataIndex: 'create_time',
                },
                {
                    title: this.L('状态'),
                    dataIndex: 'status',
                    scopedSlots: { customRender: 'status' },
                },
                {
                    title: this.L('操作'),
                    key: 'action',
                    scopedSlots: { customRender: 'action' },
                },
            ]
        }
        this.getList()
    },
    methods: {
        moment,
        onSearch() {
            this.pagination.current = 1
            this.getList()
        },
        getList(actions = '') {
            this.tableLoading = true
            this.queryParams.page = this.pagination.current
            this.queryParams.pageSize = this.pagination.pageSize
            let params = {
                ...this.queryParams,
                tokenName: this.tokenName + '_access_token',
                type: this.actionType,
            }
            if (actions == 'export') {
                params.is_export = 1
            } else {
                params.is_export = 0
            }
            this.request(questionnaireSurveyApi.getSurveyList, params)
                .then((res) => {
                    this.tableLoading = false
                    if (actions == 'export') {
                        res.url && window.open(res.url)
                        return
                    }
                    this.list = res.data
                    this.pagination.total = res.total
                })
                .catch((err) => {
                    this.tableLoading = false
                })
        },
        //新建
        addQuestionnaire() {
            this.$router.push({
                path: `/common/${this.tokenName}.QuestionnaireSurvey/QuestionnaireSurveyDetail`,
                query: {
                    back: 1,
                    actionType: this.actionType,
                },
            })
        },
        //编辑
        editClick(record) {
            this.$router.push({
                path: `/common/${this.tokenName}.QuestionnaireSurvey/QuestionnaireSurveyDetail`,
                query: {
                    id: record.id,
                    back: 1,
                    actionType: this.actionType,
                },
            })
        },
        viewClick(record) {
            this.$router.push({
                path: `/common/${this.tokenName}.QuestionnaireSurvey/QuestionnaireSurveyDetail`,
                query: {
                    id: record.id,
                    back: 1,
                    tabValue: 3,
                    actionType: this.actionType,
                },
            })
        },
        // 删除
        delClick(record) {
            this.$confirm({
                title: this.L('确定要删除吗？'),
                okType: 'danger',
                onOk: () => {
                    this.request(questionnaireSurveyApi.changeForm, {
                        form_id: record.id,
                        is_del: 1,
                        tokenName: this.tokenName + '_access_token',
                    }).then((res) => {
                        this.$message.success(this.L('删除成功！'))
                        this.getList()
                    })
                },
            })
        },
        // 状态
        statusChange(e, record) {
            this.request(questionnaireSurveyApi.changeForm, {
                form_id: record.id,
                status: e ? 1 : 3,
                tokenName: this.tokenName + '_access_token',
            }).then((res) => {
                this.$message.success(this.L('操作成功！'))
                this.getList()
            })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getList()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.getList()
        },
        //移动端预览
        viewQrCode(item) {
            this.wxappQrcode = item.wxapp_qrcode;
            this.h5Qrcode = item.h5_qrcode;
            this.h5Url = item.h5_url;
            this.mobilePreviewVisible = true;
        },
        copyError() {
            this.$message.error('复制失败！')
        },
        copySuccess() {
            this.$message.success('复制成功！')
        },

    },
}
</script>

<style scoped>
.content {
    overflow: hidden;
}

.code-box {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.code {
    margin: 10px 20px;
}

.code img {
    width: 180px;
    height: 180px;
    margin-bottom: 0.5rem;
}
</style>
