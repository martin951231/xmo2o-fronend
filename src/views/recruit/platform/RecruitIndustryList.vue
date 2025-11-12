<template>
    <div class="ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
        <a-button type="primary" @click="$refs.createModal.add()"  style="margin-left:15px"><a-icon type="plus" />新增</a-button>
        <div style="height: 30px"></div>
        <a-card :bordered="false">
            <a-table :columns="columns"
                :data-source="hrList"
                :pagination="pagination"
                @change="handleChange"
                rowKey="id"
            >
                <span slot="sort" slot-scope="text, record">
                    <a-input-number :min="0" step="1" style="width: 100px" v-model="record.sort"
                    @blur="handleSortChange(text,record.id)"/>
                </span>
                <span slot="id" slot-scope="text, record">
                    <a  @click="getView(record.id,'下属行业类别管理')">管理</a>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a @click="$refs.createModal.edit(record.id)">编辑</a>
                    <a-divider type="vertical"/>
                    <a @click="del(record.id)">删除</a>
                </span>
            </a-table>
            <recruit-industry-create ref="createModal" @ok="handleOk" :id="id"/>
            <recruit-industry-level-list ref="specialModel"></recruit-industry-level-list>
        </a-card>
    </div>
</template>
<script>
import RecruitIndustryCreate from "./RecruitIndustryCreate";
import RecruitIndustryLevelList from "./RecruitIndustryLevelList";
import recruitPlatformApi from '@/api/recruit/platform';

export default {
    name: 'RecruitHrList',
    components: {
        RecruitIndustryCreate,
        RecruitIndustryLevelList,
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
                    title: '行业分类',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '排序',
                    dataIndex: 'sort',
                    key: 'sort',
                    scopedSlots: { customRender: 'sort' },
                },
                {
                    title: '下属行业类别',
                    dataIndex: 'id',
                    key: 'id',
                    scopedSlots: { customRender: 'id' },
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
            if(this.pagination.total > 0){
                if(Math.ceil(this.pagination.total/this.pagination.pageSize) < params.page){
                    this.pagination.current = 0
                    params.page = 1
                }
            }
            params.pageSize = this.pagination.pageSize
            this.request(recruitPlatformApi.getRecruitIndustryList, params).then((res) => {
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
        // 设置排序
        handleSortChange(val, id) {
            this.request(recruitPlatformApi.getRecruitIndustrySort, {
                id: id,
                sort: val,
            }).then((res) => {
                this.getRecruitHrList({is_search: false})
            })
        },
        // 删除
        del(id) {
            this.$confirm({
                title: '提示',
                content: '是否确认删除？',
                onOk: () => {
                    this.request(recruitPlatformApi.getRecruitIndustryDel, {id: id}).then((res) => {
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
                    this.request(recruitPlatformApi.getRecruitIndustryDis, {id: id, type: type}).then((res) => {
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