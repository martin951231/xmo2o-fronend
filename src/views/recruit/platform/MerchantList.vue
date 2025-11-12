<template>
    <div id="components-layout-demo-basic">
        <a-layout>
            <a-row style="width: 100%;height:68px;border-bottom: 1px solid #f1f1f1;background-color: white;line-height: 68px;padding-left: 10px;">
                <a-col :span="12"></a-col>
                <a-col :span="12">
                    <a-row :gutter="4">
                        <a-col :span="10" class="text-right" style="padding-right: 20px;">
                            <a-select style="width: 250px" @change="handleStatusChange" v-model="queryParam.recruit_status">
                                <a-select-option :value="3">
                                    全部
                                </a-select-option>
                                <a-select-option :value="1">
                                    正常
                                </a-select-option>
                                <a-select-option :value="0">
                                    已拉黑
                                </a-select-option>
                            </a-select>
                        </a-col>
                        <a-col :span="10">
                            <a-input v-model="queryParam.name" placeholder="搜索商家"/>
                        </a-col>
                        <a-col :span="4">
                            <a-button type="primary" @click="getMerchantList">查询</a-button>
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>
            <a-layout style="padding: 0 20px; background: #fff">
                <a-layout-content :style="{ margin: '0px', padding: '0px', background: '#fff', minHeight: '100px' }">
                    <a-table :columns="columns"
                             :data-source="data"
                             :pagination="pagination"
                             @change="handleTableChange">
                            <span slot="name" slot-scope="text">
                                {{text}}
                            </span>
                        <template slot="recruit_sort" slot-scope="text,record">
                            <a-input-number
                                    :default-value="text?text:0"
                                    :precision="0"
                                    :min="0"
                                    class="sort-input"
                                    v-model="record.recruit_sort"
                                    @blur="handleSortChange($event,text,record)"/>
                        </template>
                        <span slot="recruit_publish_nums" slot-scope="text,record">
                                <span v-if="record.recruit_publish_nums">
                                   {{text}}
                                </span>
                                <span v-else>
                                    无
                                </span>
                            </span>

                        <span slot="recruit_status" slot-scope="text,record">
                             <span v-if="record.recruit_status" :href="record.cat_url" target="_blank">
                                  正常
                            </span>
                            <span v-else>
                                已拉黑
                            </span>
                        </span>
                        <span slot="action" slot-scope="text, record">
                            <a v-if="record.recruit_status" target="_blank" @click="updateMerchant(record.mer_id,0)">
                                  拉黑
                            </a>
                            <a v-else @click="updateMerchants(record.mer_id,1)">
                                取消拉黑
                            </a>
                            </span>
                    </a-table>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </div>
</template>

<script>
    import recruitPlatformApi from '@/api/recruit/platform/index'
    import ARow from "ant-design-vue/es/grid/Row";
    import ACol from "ant-design-vue/es/grid/Col";

    const columns = [
        {
            title: '商家',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'},
        },
        {
            title: '排序',
            dataIndex: 'recruit_sort',
            scopedSlots: {customRender: 'recruit_sort'},
        },
        {
            title: '发布职位',
            dataIndex: 'recruit_publish_nums',
            scopedSlots: {customRender: 'recruit_publish_nums'},
        },
        {
            title: '状态',
            dataIndex: 'recruit_status',
            scopedSlots: {customRender: 'recruit_status'},
        },
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
        },
    ];
    export default {
        name: "MerchantList",
        components: {
            ACol,
            ARow,
        },
        data() {
            return {
                columns,
                data: [],
                queryParam: {
                    page: 1,
                    pageSize: 10,
                    name: '',
                    recruit_status: 3,
                },
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
            }
        },
        watch: {
            $route: {
                handler() {
                    this.getMerchantList()
                },
            },
        },
        mounted() {
            this.getMerchantList()
        },
        methods: {
            getMerchantList() {
                this.request(recruitPlatformApi.getMerchantList, this.queryParam).then((res) => {
                    this.data = res.list
                    this.pagination.total = res.count
                })
            },
            //保存排序
            handleSortChange(e, val, record) {
                this.request(recruitPlatformApi.updateMerchant, {
                    recruit_sort: val,
                    mer_id: record.mer_id
                }).then((res) => {
                    this.queryParam['page'] = 1
                    this.getMerchantList()
                })
            },
            handleStatusChange(val) {
                this.queryParam.recruit_status = val
            },
            updateMerchant(mer_id, val) {
                this.$confirm({
                    title: '提示',
                    content: '是否确定拉黑？',
                    onOk: () => {
                        this.request(recruitPlatformApi.updateMerchant, {
                            recruit_status: val,
                            mer_id: mer_id
                        }).then((res) => {
                            this.queryParam = {
                                page: 1,
                                pageSize: 10,
                                name: '',
                                recruit_status: 3,
                            }
                            this.getMerchantList()
                        })
                    },
                    onCancel() {},
                });
            },
            updateMerchants(mer_id, val) {
                this.$confirm({
                    title: '提示',
                    content: '是否确定取消拉黑？',
                    onOk: () => {
                        this.request(recruitPlatformApi.updateMerchant, {
                            recruit_status: val,
                            mer_id: mer_id
                        }).then((res) => {
                            this.queryParam = {
                                page: 1,
                                pageSize: 10,
                                name: '',
                                recruit_status: 3,
                            }
                            this.getMerchantList()
                        })
                    },
                    onCancel() {},
                });
            },
            handleTableChange(e) {
                if (e.current && e.current > 0) {
                    this.queryParam['page'] = e.current
                    this.getMerchantList()
                }
            },
            // 页码变化
            onPageChange(page, pageSize) {
                this.queryParam.page = page
                this.$set(this.pagination, 'current', page)
                //this.getMerchantList()
            },
            onPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
                //this.getMerchantList()
            },
        }
    }
</script>

<style scoped>

</style>