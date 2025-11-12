<template>
    <a-modal :title="title" :width="920" :visible="visible" @ok="handleOk" @cancel="handleCancel">
        <div id="components-layout-demo-basic" v-if="!show_model">
            <a-spin :spinning="spinning" size="large">
                <a-layout>
                    <a-layout-content
                            :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '100px' }"
                    >
                        <a-table
                                :columns="columns"
                                :data-source="data"
                                :pagination="pagination"
                                @change="handleTableChange"
                        >
                            <span slot="sort" slot-scope="text">
                                {{ text }}
                            </span>

                            <span slot="title_content" slot-scope="text">
                                {{ text }}
                            </span>

                            <span slot="description" slot-scope="text">
                                {{ text }}
                            </span>

                            <span slot="type" slot-scope="text">
                                <span class="height-30" v-if="text == 1"> 子分类店铺 </span>
                                <span v-else class="height-30"> 种草话题 </span>
                            </span>

                            <span slot="cat_name" slot-scope="text">
                                {{ text.length>0?text:"全部" }}
                            </span>

                            <span slot="manage" slot-scope="text, record" class="text-center">
                                <a class="label-sm-1 label-sm-1-blue" @click="goTo(record.ids, record.category_id)"
                                   v-if="record.type==1">去管理</a>
                                <a class="label-sm-1 label-sm-1-blue" style="color: lightgrey" v-else>去管理</a>
                            </span>

                            <span slot="action" slot-scope="text, record">
                                <a class="label-sm blue" @click="diyEdit(record.category_id)">编辑</a>
                                <a
                                        class="btn label-sm blue"
                                        style="margin-left: 10px"
                                        @click="diyDel(record.category_id)"
                                >删除</a
                                >
                            </span>
                            <template slot="title" slot-scope="currentPageData">
                                <a-row type="flex" justify="center" align="top">
                                    <a-col :span="8"></a-col>
                                    <a-col :span="11"></a-col>
                                    <a-col :span="2" class="text-right">
                                        <a-button type="primary" @click="addFeedCategory()"> 新建频道分类</a-button>
                                    </a-col>
                                </a-row>
                            </template>
                        </a-table>
                    </a-layout-content>
                </a-layout>
            </a-spin>
        </div>
        <diypage-feed-category-store :cat_id="cat_ids" :ids="ids1" v-if="show_model"
                                     @getShowModel="getShowModel"></diypage-feed-category-store>
        <diypage-feed-category-edit :cat_id="cat_ids" :category_id="ids1" v-if="show_model1"
                                    @changeEditModel="changeEditModel"></diypage-feed-category-edit>
    </a-modal>
</template>
<script>
    import DiypageFeedApi from '@/api/common/platform/diypage'
    import DiypageFeedCategoryStore from "./DiypageFeedCategoryStore";
    import DiypageFeedCategoryEdit from "./DiypageFeedCategoryEdit";

    const columns = [
        {
            title: '排序',
            dataIndex: 'sort',
            scopedSlots: {customRender: 'sort'},
        },
        {
            title: '推荐标题',
            dataIndex: 'title_content',
            scopedSlots: {customRender: 'title_content'},
        },
        {
            title: '副标题',
            dataIndex: 'description',
            scopedSlots: {customRender: 'description'},
        },
        {
            title: '导航展示',
            dataIndex: 'type',
            scopedSlots: {customRender: 'type'},
        },
        {
            title: '内容分类',
            dataIndex: 'cat_name',
            scopedSlots: {customRender: 'cat_name'},
            width: 140,
        },
        {
            title: '内容管理',
            dataIndex: 'manage',
            scopedSlots: {customRender: 'manage'},
        },
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
        },
    ]
    export default {
        name: 'DiypageFeedCategory',
        components: {DiypageFeedCategoryEdit, DiypageFeedCategoryStore},
        props: {
            cat_id: {
                type: [String, Number],
                default: '0',
            },
        },
        data() {
            return {
                title: '分类导航',
                visible: true,
                spinning: false,
                ids1: "",
                cat_ids: this.cat_id,
                show_model: false,
                show_model1: false,
                pagination: {
                    current: 1,
                    total: 0,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    onChange: this.onPageChange,
                    onShowSizeChange: this.onPageSizeChange,
                    showTotal: (total) => `共 ${total} 条记录`,
                },
                queryParam: {
                    cat_id: '',
                    page: 1,
                    category_id: '',
                },
                data: [],
                columns,
            }
        },
        mounted() {
            //将主分类带过来
            this.getLists()
        },
        activated() {
            //将主分类带过来
            this.getLists()
        },
        methods: {
            getLists() {
                this.queryParam.cat_id = this.cat_id
                this.queryParam.page = this.pagination.current
                this.queryParam.pageSize = this.pagination.pageSize
                this.request(DiypageFeedApi.getLists, this.queryParam).then((res) => {
                    this.data = res.list
                    this.$set(this, 'data', res.list)
                    this.pagination.total = res.count
                    this.queryParam['page'] += 1
                })
            },
            changeEditModel(obj) {
                if (obj.id * 1) {
                    this.show_model1 = false
                    this.getLists()
                } else {
                    this.show_model1 = false
                }
            },
            hidModel() {
                this.show_model1 = false
            },
            addFeedCategory() {
                this.category_id = 0
                this.ids1 = ''
                this.cat_ids = this.cat_id
                this.show_model1 = true
            },
            diyEdit(id) {
                this.category_id = id
                this.ids1 = id
                this.cat_ids = this.cat_id
                this.show_model1 = true
            },
            diyDel(id) {
                this.$confirm({
                    title: '您确定删除此分类导航吗?',
                    centered: true,
                    onOk: () => {
                        let param = {
                            category_id: id,
                        }
                        this.request(DiypageFeedApi.diypageFeedCategoryDel, param).then((res) => {
                            if (res) {
                                this.getLists()
                            }
                        })
                    },
                    onCancel() {
                    },
                })
            },
            handleTableChange(e) {
                if (e.current && e.current > 0) {
                    this.queryParam['page'] = e.current
                    this.getLists()
                }
            },
            handleCancel() {
                this.visible = false
                this.$emit('handleCancel')
            },
            handleOk() {
                this.visible = false
                this.$emit('handleOk')
            },
            goTo(ids, category_id) {
                this.category_id = category_id
                this.ids1 = ids
                this.cat_ids = category_id
                this.show_model = true
            },
            getShowModel() {
                this.show_model = false
            },
            // 页码变化
            onPageChange(page, pageSize) {
                this.$set(this.pagination, 'current', page)
                this.getLists()
            },
            onPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
                this.getLists()
            },
        },
    }
</script>

<style scoped>
    .ant-table-title {
        display: none;
    }

    .label-sm-1-blue {
        padding: 7px;
        color: #1890ff;
        border: 1px dashed #a09da2 !important;
    }
</style>