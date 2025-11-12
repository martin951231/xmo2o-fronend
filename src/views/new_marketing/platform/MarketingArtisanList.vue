<template>
    <div class="ant-pro-page-header-wrap-children-content" style="margin: 24px 0 0">
        <a-card :bordered="false" style="padding: 24px">
            <a-page-header style="padding: 0 0 16px 0; font-size: 18px; color: #000; font-weight: bold"
                >技术人员列表</a-page-header
            >
            <div style="margin: 0 -24px 20px -24px; border-top: 1px solid #eee"></div>
            <!-- 搜索栏 -->
            <a-form-model layout="inline" :model="searchForm" style="margin-bottom: 30px">
                <!-- 技术人员 -->
                <a-form-model-item label="技术人员">
                    <a-input v-model="searchForm.name" placeholder="请输入姓名" style="width: 300px" />
                </a-form-model-item>
                <!-- 技术主管 -->
                <a-form-model-item label="技术主管">
                    <a-select v-model="searchForm.director_id" style="width: 300px" placeholder="请选择">
                        <a-select-option v-for="item in dirList" :key="item.director_id" :director_id="item.director_id"
                            >{{ item.director_name }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item style="float: right; margin-right: 0px">
                    <a-button type="primary" @click="submitForm(true)" class="ml-20" style="margin-right: 20px">
                        查询</a-button
                    >
                    <a-button @click="resetBtn()">重置</a-button>
                </a-form-model-item>
                <br />
                <!-- 日期 -->
                <a-form-model-item label="添加时间" style="margin-top: 20px">
                    <a-range-picker
                        style="width: 300px"
                        :ranges="{
                            过去30天: [moment().subtract(30, 'days'), moment()],
                            过去15天: [moment().subtract(15, 'days'), moment()],
                            过去7天: [moment().subtract(7, 'days'), moment()],
                            今日: [moment(), moment()],
                        }"
                        :value="searchForm.time"
                        format="YYYY-MM-DD"
                        @change="onDateRangeChange"
                    />
                </a-form-model-item>
            </a-form-model>
            <a-button type="primary" @click="add(id)" style="height: 36px">添加技术人员</a-button>
            <div style="height: 30px"></div>
            <a-table
                :columns="columns"
                :data-source="data"
                rowKey="id"
                :pagination="pagination"
                style="min-height: 700px"
            >
                <span slot="action" slot-scope="text, record">
                    <template>
                        <a @click="$refs.editModal.edit(record.id)">编辑</a>
                        <a-divider type="vertical" />
                    </template>
                    <!-- <a @click="$refs.directorModal.edit(record.id)" v-if="record.director_id > 0">更换主管</a>
                    <a @click="$refs.directorModal.edit(record.id)" v-else>选择主管</a>
                    <a-divider type="vertical"/> -->
                    <a @click="delOne(record.id)">移除</a>
                </span>
            </a-table>
            <marketing-artisan-create ref="createModal" @loaddata="getList" />
            <marketing-artisan-edit ref="editModal" @loaddata="getList" />
            <marketing-artisan-director ref="directorModal" @loaddata="getList" />
        </a-card>
    </div>
</template>
<script>
import moment from 'moment'
import MarketingArtisanDirector from './MarketingArtisanDirector'
import MarketingArtisanCreate from './MarketingArtisanCreate'
import MarketingArtisanEdit from './MarketingArtisanEdit'
import MarketingPlatformComponents from '@/api/new_marketing/platform'

export default {
    name: 'MarketingArtisanList',
    components: {
        MarketingArtisanDirector,
        MarketingArtisanEdit,
        MarketingArtisanCreate,
    },
    data() {
        return {
            dirList: [],
            // 搜索框表单
            searchForm: {
                name: '', // 搜索内容
                director_id: undefined,
                time: [],
                begin_time: '', // 开始时间
                end_time: '', // 结束时间
            },
            // 表头
            columns: [
                {
                    title: '姓名',
                    dataIndex: 'name',
                    key: 'name',
                    scopedSlots: { customRender: 'name' },
                },
                {
                    title: '绑定团队',
                    dataIndex: 'team_name',
                    key: 'team_name',
                },
                {
                    title: '技术主管',
                    dataIndex: 'director_name',
                    key: 'director_name',
                },
                {
                    title: '累计提成',
                    dataIndex: 'total_commission',
                    scopedSlots: { customRender: 'total_commission' },
                },
                {
                    title: '添加时间',
                    dataIndex: 'add_time',
                    key: 'add_time',
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    key: 'action',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            data: [],
            id: '',
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => `共 ${total} 条记录`,
            },
        }
    },
    created() {
        this.getList({ is_search: false })
    },
    activated() {
        this.id = this.$route.query.id
        this.getList({ is_search: false })
    },
    mounted() {},
    watch: {
        '$route.query.id'() {
            this.id = this.$route.query.id
            this.getList(this.id)
        },
    },
    methods: {
        moment,
        // 获取列表信息
        getList(param) {
            let params = { ...this.searchForm }
            delete params.time
            if (param.is_search && param.is_search == true) {
                params.page = 1
                this.$set(this.pagination, 'current', 1)
            } else {
                params.page = this.pagination.current
                this.$set(this.pagination, 'current', this.pagination.current)
            }
            if (this.pagination.total > 0) {
                if (Math.ceil(this.pagination.total / this.pagination.pageSize) < params.page) {
                    this.pagination.current = 0
                    params.page = 1
                }
            }
            params.pageSize = this.pagination.pageSize
            this.request(MarketingPlatformComponents.getMarketingArtisanList, params).then((res) => {
                this.data = res.list
                this.dirList = res.dirList
                this.$set(this.pagination, 'total', res.count)
            })
        },
        // 监听日期选择变化
        onDateRangeChange(date, dateString) {
            // 更新搜索框表单数据
            this.$set(this.searchForm, 'time', [date[0], date[1]])
            this.$set(this.searchForm, 'begin_time', dateString[0])
            this.$set(this.searchForm, 'end_time', dateString[1])
        },
        // 提交搜索表单
        submitForm(is_search = false) {
            let params = { ...this.searchForm }
            delete params.time
            params.is_search = is_search
            params.tablekey = 1
            this.getList(params)
        },
        // 重置
        resetBtn() {
            this.searchForm = this.$options.data().searchForm
            this.createTime = []
            this.getList({ is_search: false })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.submitForm()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.submitForm()
        },
        // 新建
        add(id) {
            this.$refs.createModal.add(id)
        },
        // 返回装修页面
        btnClick() {
            alert(2)
        },
        // 删除
        delOne(id) {
            this.$confirm({
                title: '提示',
                content: '你确定要移除该技术人员吗？',
                onOk: () => {
                    this.request(MarketingPlatformComponents.getMarketingArtisanDel, { id: id }).then((res) => {
                        this.getList({ is_search: false })
                    })
                },
                onCancel() {},
            })
        },
    },
}
</script>
<style scoped lang="less">
</style>