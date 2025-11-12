<template>
    <div id="components-layout-demo-basic">
        <a-spin :spinning="spinning" size="large">
            <a-layout>
                <a-layout-content
                        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '100px' }">
                    <a-table :columns="columns"
                             :data-source="data"
                             :pagination="pagination"
                             @change="handleTableChange">
                            <span slot="name" slot-scope="text">
                                {{text}}
                            </span>

                        <span slot="phone" slot-scope="text">
                                {{text}}
                            </span>

                        <span slot="mer_name" slot-scope="text">
                                {{text}}
                            </span>

                        <span slot="last_time" slot-scope="text">
                                {{text}}
                            </span>

                        <span slot="group_num" slot-scope="text">
                                {{text}}
                            </span>

                        <!-- <span slot="sort,record" slot-scope="text">
                               <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
                         </span>-->
                        <template slot="sort" slot-scope="text,record">
                            <a-input-number
                                    :default-value="text?text:0"
                                    :precision="0"
                                    :min="0"
                                    class="sort-input"
                                    v-model="record.sort"
                                    @blur="handleSortChange($event,text,record)"/>
                        </template>
                        <template slot="title" slot-scope="currentPageData">
                            <a-row type="flex" justify="center" align="top">
                                <a-col :span="3" style="padding-top: 5px;">手动搜索:</a-col>
                                <a-col :span="8" class="text-left">
                                    <a-row>
                                        <a-col :span="14">
                                            <a-input
                                                    placeholder="请输入商家名称"
                                                    v-model="queryParam.mer_name">
                                            </a-input>
                                        </a-col>
                                    </a-row>
                                </a-col>
                                <a-col :span="8">
                                </a-col>
                                <a-col :span="2" class="text-right">
                                    <a-button type="primary" @click="findMer()">
                                        查询
                                    </a-button>
                                </a-col>
                                <a-col :span="1">
                                </a-col>
                                <a-col :span="2" class="text-right">
                                    <a-button type="warning" @click="showParenrModel()">
                                        返回
                                    </a-button>
                                </a-col>
                            </a-row>
                        </template>
                    </a-table>
                </a-layout-content>
            </a-layout>
        </a-spin>
    </div>
</template>

<script>
    import DiypageFeedApi from '@/api/common/platform/diypage'
    import ACol from "ant-design-vue/es/grid/Col";

    const columns = [
        {
            title: '店铺名称',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'},
        },
        {
            title: '店铺电话',
            dataIndex: 'phone',
            scopedSlots: {customRender: 'phone'},
        },
        {
            title: '所属商家',
            dataIndex: 'mer_name',
            scopedSlots: {customRender: 'mer_name'},
        },
        {
            title: '创建时间',
            dataIndex: 'last_time',
            scopedSlots: {customRender: 'last_time'},
        },
        {
            title: '团购商品数量',
            dataIndex: 'group_num',
            scopedSlots: {customRender: 'group_num'},
        },
        {
            title: '排序',
            dataIndex: 'sort',
            scopedSlots: {customRender: 'sort'},
        },
    ];
    export default {
        name: "DiypageFeedCategoryStore",
        components: {ACol},
        props: {
            cat_id: {
                type: [String, Number],
                default: '0',
            },
            ids: {
                type: [String, Number],
                default: '0',
            },
        },
        data() {
            return {
                spinning: false,
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
                    page: 1,
                    ids: "",
                    mer_name: "",
                    category_id: "",
                    pageSize: 10,
                },
                data: [],
                columns,
            }
        },
        mounted() {
            //将主分类带过来
            this.queryParam.ids = this.ids
            this.queryParam.category_id = this.cat_id
            this.getLists()
        },
        activated() {
            //将主分类带过来
            this.queryParam.ids = this.ids
            this.queryParam.category_id = this.cat_id
            this.getLists()
        },
        created() {
            //将主分类带过来
            this.queryParam.ids = this.ids
            this.queryParam.category_id = this.cat_id
        },
        methods: {
            getLists() {
                this.queryParam.page = this.pagination.current
                this.queryParam.pageSize = this.pagination.pageSize
                this.data = []
                this.request(DiypageFeedApi.diypageFeedCategoryStoreList, this.queryParam).then((res) => {
                    if (res.count > 0) {
                        this.data = res.list
                        this.$set(this, 'data', res.list)
                        this.$set(this.pagination, 'total', res.count)
                    }
                })
            },
            showParenrModel() {
                this.$emit('getShowModel')
            },
            handleTableChange(e) {
                if (e.current && e.current > 0) {
                    this.queryParam['page'] = e.current
                    this.getLists()
                }
            },
            findMer() {
                this.queryParam.page = 1
                this.data = []
                this.request(DiypageFeedApi.diypageFeedCategoryStoreList, this.queryParam).then((res) => {
                    this.$set(this.pagination, 'total', res.count)
                    if (res.count > 0) {
                        this.data = res.list
                        // this.pagination.total = res.count
                        this.$set(this, 'data', res.list)
                    }
                })
            },
            //保存排序
            handleSortChange(e, val, record) {
                this.queryParam.store_id = record.store_id
                this.queryParam.mer_id = record.mer_id
                this.queryParam.sort = val
                this.request(DiypageFeedApi.diypageFeedCategoryStoreSortEdit, this.queryParam).then((res) => {
                    this.queryParam['page'] = 1
                    this.getLists()
                })
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
        }
    }
</script>

<style scoped>

</style>