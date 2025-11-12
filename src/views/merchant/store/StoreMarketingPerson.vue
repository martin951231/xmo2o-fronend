<template>
    <div id="components-layout-demo-basic">
        <a-layout>
            <a-layout-content
                    :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '100px' }">
                <a-tabs default-active-key="1">
                    <a-tab-pane key="1" tab="分销员列表">
                        <a-spin :spinning="spinning" size="large">
                            <div class="content">
                                <!--<a-row>-->
                                <a-form-model layout="inline" style="padding: 20px auto">
                                    <a-row type="flex">
                                        <a-col :span="10" style="padding-left: 29px;">
                                            <a-form-model-item label="姓名:">
                                                <a-input v-model="formData.name" placeholder="请输入姓名"
                                                         style="width: 365px;"/>
                                            </a-form-model-item>
                                        </a-col>
                                        <a-col :span="10">
                                            <a-form-model-item label="绑定状态:">
                                                <a-select v-model="formData.status" style="width: 365px"
                                                          placeholder="绑定状态">
                                                    <a-select-option :value="1">
                                                        待确认
                                                    </a-select-option>
                                                    <a-select-option :value="2">
                                                        已绑定
                                                    </a-select-option>
                                                    <a-select-option :value="3">
                                                        已拒绝
                                                    </a-select-option>
                                                </a-select>
                                            </a-form-model-item>
                                        </a-col>
                                        <a-col :span="4" class="text-right">
                                            <a-button style="margin-top: 4px" type="primary" @click="getPersonList()"
                                                      class="mr-20">
                                                查询
                                            </a-button>
                                            <a-button type="warning" @click="reset()" class="mr-20"> 重置</a-button>
                                        </a-col>
                                    </a-row>
                                </a-form-model>
                                <!--</a-row>-->

                                <a-form-model layout="inline" style="padding: 30px auto">
                                    <a-row type="flex">
                                        <a-col :span="10">
                                            <a-form-model-item label="添加时间:">
                                                <a-range-picker
                                                        :ranges="{
            今日: [moment(), moment()],
            近7天: [moment(), moment().add(7, 'days')],
            近15天: [moment(), moment().add(15, 'days')],
            近30天: [moment(), moment().add(30, 'days')],
          }"
                                                        :value="formData.time"
                                                        format="YYYY-MM-DD"
                                                        @change="onDateRangeChange"
                                                        style="width: 365px"
                                                />
                                            </a-form-model-item>
                                        </a-col>
                                    </a-row>
                                </a-form-model>

                                <a-row style="margin-bottom: 20px;">
                                    <a-button style="margin-top: 4px" type="primary" class="mr-20"
                                              @click="addStoreMarketingPerson()">
                                        添加分销员
                                    </a-button>
                                </a-row>

                                <a-table :columns="columns"
                                         :data-source="data"
                                         :pagination="pagination"
                                         rowKey="id"
                                         :row-selection="{ selectedRowKeys: selectedRows, onChange: onSelectChange }"
                                         @change="handleTableChange">
                                    <!-- 状态 -->
                                    <span slot="status" slot-scope="text">
                                        <a-badge v-if="text == 1" status="processing" text="待确认"/>
                                        <a-badge v-if="text == 2" status="success" text="已绑定"/>
                                        <a-badge v-if="text == 3" status="error" text="已拒绝"/>
                                   </span>
                                    <span slot="action"
                                          slot-scope="text, record">
                                   <a class="inline-block"
                                      @click="$refs.editStoreMarketingPerson.edit(record.id,store_id)">编辑</a>

                                   <a class="ml-10 inline-block" @click="delData(record.id,store_id)">删除</a>
                            </span>
                                </a-table>
                            </div>
                        </a-spin>
                    </a-tab-pane>

                    <a-tab-pane key="2" tab="分销记录" force-render>
                        <store-marketing-record ref="storeMarketingRecord"
                                                :store_id="store_id"></store-marketing-record>
                    </a-tab-pane>
                </a-tabs>
                <add-store-marketing-person ref="addStoreMarketingPerson"
                                            @ok="handleUpdate"></add-store-marketing-person>
                <edit-store-marketing-person ref="editStoreMarketingPerson"
                                             @ok="handleUpdate"></edit-store-marketing-person>
            </a-layout-content>
        </a-layout>
    </div>
</template>

<script>
    import moment from 'moment'
    import mallMerchantApi from '@/api/merchant/store'
    import ARow from "ant-design-vue/es/grid/Row";
    import ACol from "ant-design-vue/es/grid/Col";
    import AddStoreMarketingPerson from "./modules/addStoreMarketingPerson";
    import EditStoreMarketingPerson from "./modules/editStoreMarketingPerson";
    import StoreMarketingRecord from "./StoreMarketingRecord";

    const selectedRows = []
    const columns = [
        {
            title: '昵称',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'},
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            scopedSlots: {customRender: 'phone'},
        },
        {
            title: '抽成比例',
            dataIndex: 'ratio_type',
            scopedSlots: {customRender: 'ratio_type'},
            align: "center"
        },
        {
            title: '总业绩',
            dataIndex: 'all_achievement',
            scopedSlots: {customRender: 'all_achievement'},
            align: "center"
        },
        {
            title: '总抽成',
            dataIndex: 'all_percentage',
            scopedSlots: {customRender: 'all_percentage'},
            align: "center"
        },
        {
            title: '绑定状态',
            dataIndex: 'status',
            scopedSlots: {customRender: 'status'},
            align: "center"
        },
        {
            title: '添加时间',
            dataIndex: 'create_time',
            scopedSlots: {customRender: 'create_time'},
            align: "center",
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => moment(a.create_time).unix() - moment(b.create_time).unix(),
        },
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
        },
    ];
    export default {
        name: "StoreMarketingPerson",
        components: {StoreMarketingRecord, EditStoreMarketingPerson, AddStoreMarketingPerson},
        data() {
            return {
                spinning: false,
                columns,
                selectedRows,
                data: [],
                store_id: this.$route.query.store_id,
                formData: {
                    name: undefined,
                    store_id: this.$route.query.store_id,
                    start_time: "",
                    end_time: "",
                    status: undefined,
                    time: []
                },
                queryParam: {
                    page: 1,
                    pageSize: 10,
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
            '$route.query.store_id'(val) {
                if (val) {
                    this.formData.store_id = val
                    this.store_id = val
                    this.getPersonList()
                }
            },
        },
        mounted() {
            this.getPersonList()
        },
        methods: {
            moment,
            reset() {
                this.formData = {
                    store_id: this.$route.query.store_id,
                    name: undefined,
                    start_time: "",
                    end_time: "",
                    status: undefined,
                    time: [],
                    page: 1
                }
                this.data = []
                this.$set(this.pagination, 'current', 1)
                this.getPersonList()
            },
            getPersonList() {
                this.selectedRows = [];
                this.request(mallMerchantApi.getPersonList, this.formData).then((res) => {
                    this.data = res.list
                    this.pagination.total = res.count
                    this.areaList = res.areaList
                })
            },
            delData(id, store_id) {
                this.$confirm({
                    title: '是否确定删除该分销员?',
                    centered: true,
                    onOk: () => {
                        this.request(mallMerchantApi.delPerson, {'id': id, 'store_id': store_id}).then((res) => {
                            if (res) {
                                this.getPersonList()
                            }
                        })
                    },
                    onCancel() {
                    },
                })

            },
            addStoreMarketingPerson() {
                this.$refs.addStoreMarketingPerson.add(this.formData.store_id)
            },
            handleUpdate() {
                this.reset()
            },
            changeArea(val) {
                this.formData.province_id = val[0] || 0
                this.formData.city_id = val[1] || 0
                this.formData.area_id = val[2] || 0
                this.formData.check_areaList = [val[0], val[1], val[2]]
            },
            // 处理时间
            date_moment(time, dateFormat) {
                if (!time) {
                    return null
                }
                return moment(time, dateFormat)
            },
            onDateRangeChange(date, dateString) {
                // 更新搜索框表单数据
                this.$set(this.formData, 'time', [date[0], date[1]])
                this.$set(this.formData, 'start_time', dateString[0])
                this.$set(this.formData, 'end_time', dateString[1])
            },
            onSelectChange(selectedRowKeys, selectedRows) {
                this.selectedRows = [];
                this.total_num = selectedRows.length
                this.achievement = 0
                var total = 0
                if (selectedRows.length) {
                    selectedRows.map((item) => {
                        this.selectedRows.push(item.id)
                        total = total + item.total_performance * 1
                    })
                }
                this.achievement = total
            },
            handleTableChange(e) {
                if (e.current && e.current > 0) {
                    this.queryParam['page'] = e.current
                }
            },
            // 页码变化
            onPageChange(page, pageSize) {
                this.formData.page = page
                this.queryParam.page = page
                this.$set(this.pagination, 'current', page)
            },
            onPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
            },
        }
    }
</script>

<style scoped>

</style>