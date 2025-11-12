<template>
    <div class="ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
        <a-button type="primary" @click="$refs.createModal.add()"  style="margin-left:15px"><a-icon type="plus" />新增</a-button>
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
            <div>设置图片后将自动显示在招聘专栏的首页位置，对坐展示5个</div>
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
                <span slot="images" slot-scope="text, record">
                    <a @click="$refs.imagesModal.images(record.images)"><img :src='record.images' style="max-width:84px;max-height:38px"></a>
                </span>
                <span slot="links" slot-scope="text, record">
                    <a target="_blank" :href='record.links'>查看</a>
                </span>
                <span slot="status" slot-scope="text, record">
                    <span v-if="record.is_dis == 1">展示</span>
                    <span v-if="record.is_dis == 0">不展示</span>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a @click="$refs.createModal.edit(record.id)">编辑</a>
                    <a-divider type="vertical"/>
                    <a @click="del(record.id)">删除</a>
                    <a-divider type="vertical"/>
                    <a v-if="record.is_dis == 0" @click="ondis(record.id,1)">展示</a>
                    <a v-if="record.is_dis == 1" @click="dis(record.id,0)">取消展示</a>
                </span>
            </a-table>
            <recruit-banner-create ref="createModal" @ok="handleOk" :id="id"/>
            <recruit-banner-images ref="imagesModal"></recruit-banner-images>
            <atlas-special-list ref="specialModel"></atlas-special-list>
        </a-card>
    </div>
</template>
<script>
import RecruitBannerCreate from "./RecruitBannerCreate";
import RecruitBannerImages from "./RecruitBannerImages";
import RecruitBannerView from "./RecruitBannerView";
import recruitPlatformApi from '@/api/recruit/platform';

export default {
    name: 'RecruitHrList',
    components: {
        RecruitBannerCreate,
        RecruitBannerImages,
        RecruitBannerView,
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
                    title: '广告名称',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '广告图片',
                    dataIndex: 'images',
                    key: 'images',
                    scopedSlots: { customRender: 'images' },
                },
                {
                    title: '排序',
                    dataIndex: 'sort',
                    key: 'sort',
                    scopedSlots: { customRender: 'sort' },
                },
                {
                    title: '关联链接',
                    dataIndex: 'links',
                    key: 'links',
                    scopedSlots: { customRender: 'links' },
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    scopedSlots: { customRender: 'status' },
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
            this.request(recruitPlatformApi.getRecruitBannerList, params).then((res) => {
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
        // 设置排序
        handleSortChange(val, id) {
            this.request(recruitPlatformApi.getRecruitBannerSort, {
                id: id,
                sort: val,
            }).then((res) => {
                this.getRecruitHrList({is_search: false})
            })
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
                    this.request(recruitPlatformApi.getRecruitBannerDel, {id: id}).then((res) => {
                        this.getRecruitHrList({is_search: false})
                        this.$message.success('删除成功')
                    })
                },
                onCancel() {},
            });
        },
        // 展示
        ondis(id, type) {
            this.$confirm({
                title: '提示',
                content: '是否确认设置为展示？',
                onOk: () => {
                    this.request(recruitPlatformApi.getRecruitBannerDis, {id: id, type: type}).then((res) => {
                        this.getRecruitHrList({is_search: false})
                        this.$message.success('设置成功')
                    })
                },
                onCancel() {},
            });
        },
        // 展示
        dis(id, type) {
            this.$confirm({
                title: '提示',
                content: '是否确认设置为不展示？',
                onOk: () => {
                    this.request(recruitPlatformApi.getRecruitBannerDis, {id: id, type: type}).then((res) => {
                        this.getRecruitHrList({is_search: false})
                        this.$message.success('设置成功')
                    })
                },
                onCancel() {},
            });
        },
    }
}
</script>