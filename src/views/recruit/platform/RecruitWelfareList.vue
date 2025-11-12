<template>
    <div class="ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
        <a-button type="primary" @click="$refs.createModal.add()"  style="margin-left:15px"><a-icon type="plus" />新增企业福利</a-button>
        <!-- 搜索栏 -->
        <!-- <a-form-model layout="inline" :model="searchForm" style="float:right;margin-bottom:30px">
            <a-form-model-item label="">
                <a-input v-model="searchForm.cont" placeholder="输入Hr信息搜索" style="width:180px;"/>
            </a-form-model-item>
            <a-form-model-item>
                <a-button type="primary" icon="search" @click="submitForm(true)" class="ml-20"> 查询</a-button>
            </a-form-model-item>
        </a-form-model> -->
        <div style="height: 30px"></div>
        <a-card :bordered="false">
            <a-table :columns="columns"
                :data-source="hrList"
                :pagination="pagination"
                @change="handleChange"
                rowKey="id"
            >
                <span slot="action" slot-scope="text, record">
                    <a @click="$refs.createModal.edit(record.id)">编辑</a>
                    <a-divider type="vertical"/>
                    <a @click="del(record.id)">删除</a>
                </span>
            </a-table>
            <recruit-welfare-create ref="createModal" @ok="handleOk" :id="id"/>
        </a-card>
    </div>
</template>
<script>
import RecruitWelfareCreate from "./RecruitWelfareCreate";
import recruitPlatformApi from '@/api/recruit/platform';

export default {
    name: 'RecruitHrList',
    components: {
        RecruitWelfareCreate,
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
                    title: '福利名称',
                    dataIndex: 'name',
                    key: 'name',
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
           /* if (param.is_search == true) {
                params.page = 1
                this.$set(this.pagination, 'current', 1)
            } else {
                params.page = this.pagination.current
                this.$set(this.pagination, 'current', this.pagination.current)
            }
            if(this.pagination.total > 0){
                if(Math.ceil(this.pagination.total/this.pagination.pageSize) < params.page){
                    this.pagination.current = 0
                    params.page = 1
                }
            }
            params.pageSize = this.pagination.pageSize*/
            this.request(recruitPlatformApi.getRecruitWelfareList, params).then((res) => {
                this.hrList = res.list
                this.$set(this.pagination, 'total', res.count)
            })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
           // this.submitForm()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            //this.submitForm()
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
                content: '是否确认删除？',
                onOk: () => {
                    this.request(recruitPlatformApi.getRecruitWelfareDel, {id: id}).then((res) => {
                        this.getRecruitHrList({is_search: false})
                        this.$message.success('删除成功')
                    })
                },
                onCancel() {},
            });
        },
        // 展示
        dis(id, type) {
            this.$confirm({
                title: '提示',
                content: '是否确认删除？',
                onOk: () => {
                    this.request(recruitPlatformApi.getRecruitWelfareDis, {id: id, type: type}).then((res) => {
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