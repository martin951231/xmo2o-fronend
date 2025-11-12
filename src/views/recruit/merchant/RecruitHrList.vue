<template>
    <div class="ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
        <a-button type="primary" @click="$refs.createModal.add()"  style="margin-left:15px"><a-icon type="plus" />新增</a-button>
        <!-- 搜索栏 -->
        <a-form-model layout="inline" :model="searchForm" style="float:right;margin-bottom:30px">
            <a-form-model-item label="">
                <a-input v-model="searchForm.cont" placeholder="输入Hr信息搜索" style="width:180px;"/>
            </a-form-model-item>
            <a-form-model-item>
                <a-button type="primary" icon="search" @click="submitForm(true)" class="ml-20"> 查询</a-button>
            </a-form-model-item>
        </a-form-model><div style="height: 30px"></div>
        <a-card :bordered="false">
            <a-table :columns="columns"
                :data-source="hrList"
                :pagination="pagination"
                @change="handleChange"
                rowKey="id"
            >
                <span slot="last_name" slot-scope="text, record">
                    <span>{{record.first_name}}</span>
                    <span>{{record.last_name}}</span>
                </span>
                <span slot="sex" slot-scope="text, record">
                    <span v-if="record.sex == 1">男</span>
                    <span v-if="record.sex == 2">女</span>
                </span>
                <span slot="release" slot-scope="text, record">
                    <span v-if="text == 0" >无</span>
                    <router-link
                        :to="{ path: '/recruit/merchant.recruit/MerchantJobList', query: { author: record.uid } }"
                        v-else
                    >
                        <a class="label-sm-1 blue">{{text}}</a>
                    </router-link>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a @click="$refs.createModal.edit(record.id)">修改</a>
                    <a-divider type="vertical"/>
                    <a @click="del(record.id)">移除</a>
                </span>
            </a-table>
            <recruit-hr-create ref="createModal" @ok="handleOk" :id="id"/>
            <atlas-special-list ref="specialModel"></atlas-special-list>
        </a-card>
    </div>
</template>
<script>
import recruitMerchantApi from '@/api/recruit/merchant';
import RecruitHrCreate from './RecruitHrCreate.vue'

export default {
    name: 'RecruitHrList',
    components: {
        RecruitHrCreate,
    },
    data() {
        return {
            // 列表
            hrList: [],
            // 搜索框表单
            searchForm: {
                cont: '',    // 搜索内容
            },
            // 表头
            columns: [
                {
                    title: '姓名',
                    dataIndex: 'last_name',
                    key: 'last_name',
                    scopedSlots: { customRender: 'last_name' },
                },
                {
                    title: '性别',
                    dataIndex: 'sex',
                    key: 'sex',
                    scopedSlots: { customRender: 'sex' },
                },
                {
                    title: '登录手机号',
                    dataIndex: 'phone',
                    key: 'phone',
                },
                {
                    title: '微信号',
                    dataIndex: 'wechat',
                    key: 'wechat',
                },
                {
                    title: '邮箱',
                    dataIndex: 'email',
                    key: 'email',
                },
                {
                    title: 'QQ号',
                    dataIndex: 'qq',
                    key: 'qq',
                },
                {
                    title: '固定电话',
                    dataIndex: 'tel',
                    key: 'tel',
                },
                {
                    title: '发布职位',
                    dataIndex: 'release',
                    key: 'release',
                    scopedSlots: { customRender: 'release' },
                },
                {
                    title: '职位',
                    dataIndex: 'position',
                    key: 'position',
                },
                {
                    title: '最后登录时间',
                    dataIndex: 'last_time',
                    key: 'last_time',
                },
                {
                    title: '操作',
                    dataIndex: '',
                    key: 'x',
                    scopedSlots: {customRender: 'action'}
                },
            ],
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
    mounted() {
        this.getRecruitHrList({is_search: false});
    },
    methods: {
        // 提交搜索表单
        submitForm(is_search = false) {
            let params = {...this.searchForm}
            delete params.time
            params.is_search = is_search
            this.getRecruitHrList(params)
        },
        // 列表
        getRecruitHrList(param) {
            let params = {...this.searchForm}
            delete params.time
            if (param.is_search == true) {
                console.log(this.pagination.pageSize)
            }
            if (param.is_search == true) {
                params.page = 1
                this.$set(this.pagination, 'current', 1)
            } else {
                params.page = this.pagination.current
                this.$set(this.pagination, 'current', this.pagination.current)
            }
            params.pageSize = this.pagination.pageSize
            this.request(recruitMerchantApi.getRecruitHrList, params).then((res) => {
                this.hrList = res.list
                this.$set(this.pagination, 'total', res.count)
            })
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
        // 
        handleChange(pagination, filters, sorter) {
            this.filteredInfo = filters;
            this.sortedInfo = sorter;
        },
        // 新增
        add() {},
        // 查看职位
        getView(id,title) {
            this.$refs.specialModel.getAtlastSpecial(id, title)
        },
        handleOk() {
            this.getRecruitHrList({is_search: false})
        },
        // 删除
        del(id) {
            this.$confirm({
                title: '提示',
                content: '移除人员后，其发布的职位也将一并删除，是否确移除该人员？',
                onOk: () => {
                    this.request(recruitMerchantApi.getRecruitHrDel, {id: id}).then((res) => {
                        this.getRecruitHrList({is_search: false})
                        this.$message.success('删除成功')
                    })
                },
                onCancel() {},
            });
        },
    }
}
</script>