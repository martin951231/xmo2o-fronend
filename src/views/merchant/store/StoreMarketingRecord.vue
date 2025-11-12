<template>
    <div id="components-layout-demo-basic">
        <a-layout>
            <a-layout-content
                    :style="{background: '#fff', minHeight: '100px' }">
                <a-spin :spinning="spinning" size="large">
                    <div class="content">
                        <!--<a-row>-->
                        <a-form-model layout="inline" style="padding: 20px auto">
                            <a-row type="flex">
                                <a-col :span="10">
                                    <a-form-model-item label="分销人员:">
                                        <!--<a-input v-model="formData.person_id" placeholder="请选择"
                                                 style="width: 365px;"/>-->
                                        <a-select v-model="formData.person_id" style="width: 365px" placeholder="请选择">
                                            <a-select-option :value="person.person_id" v-for="person in person_sel"
                                                             :key="person.person_id">
                                                {{person.name}}
                                            </a-select-option>
                                        </a-select>
                                    </a-form-model-item>
                                </a-col>
                                <a-col :span="10">
                                    <a-form-model-item label="商品类型:">
                                        <a-select v-model="formData.goods_type" style="width: 365px"
                                                  placeholder="请选择">
                                            <a-select-option :value="1">
                                                团购
                                            </a-select-option>
                                            <a-select-option :value="2">
                                                商城
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
                                    <a-form-model-item label="商品名称:">
                                        <a-input v-model="formData.goods_name" placeholder="请输入商品名称"
                                                 style="width: 365px;"/>
                                    </a-form-model-item>
                                </a-col>

                                <a-col :span="10">
                                    <a-form-model-item label="下单时间:">
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
                                        />
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                        </a-form-model>

                        <a-table :columns="columns"
                                 :data-source="data"
                                 :pagination="pagination"
                                 rowKey="id"
                                 @change="handleTableChange">
                                    <span slot="percentage" slot-scope="text,record">
                                {{text}}<a v-if="record.is_arrival==0">(未到账)</a>
                                </span>
                            <span slot="action"
                                  slot-scope="text, record">
                                   <router-link v-if="record.goods_type==2"
                                                :to="{ path: '/merchant/merchant.mall/orderDetail', query: { order_id: record.order_id } }"
                                   >
                                  <a class="label-sm-1 blue">订单详情</a>
                                  </router-link>
                                   <a v-else @click="openUrl(record.site_url,record.order_id)">订单详情</a>
                                <!--<a class="ml-10 inline-block">订单详情</a>-->
                            </span>
                        </a-table>
                    </div>
                </a-spin>
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

    const selectedRows = []
    const columns = [
        {
            title: '下单用户',
            dataIndex: 'nickname',
            scopedSlots: {customRender: 'nickname'},
        },
        {
            title: '商品类型',
            dataIndex: 'goods_type_text',
            scopedSlots: {customRender: 'goods_type_text'},
        },
        {
            title: '商品名称',
            dataIndex: 'goods_name',
            scopedSlots: {customRender: 'goods_name'},
            align: "center"
        },
        {
            title: '数量',
            dataIndex: 'goods_num',
            scopedSlots: {customRender: 'goods_num'},
            align: "center"
        },
        {
            title: '分销人员',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'},
            align: "center"
        },
        {
            title: '分销商品金额',
            dataIndex: 'pay_money',
            scopedSlots: {customRender: 'pay_money'},
            align: "center"
        },
        {
            title: '分销抽成',
            dataIndex: 'percentage',
            scopedSlots: {customRender: 'percentage'},
            align: "center"
        },
        {
            title: '下单时间',
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
        name: "StoreMarketingRecord",
        props: {
            store_id: {
                type: [String, Number],
                default: '0',
            },
        },
        data() {
            return {
                spinning: false,
                columns,
                selectedRows,
                data: [],
                person_sel: [],
                formData: {
                    person_id: undefined,
                    store_id: this.store_id,
                    start_time: "",
                    end_time: "",
                    goods_name: undefined,
                    goods_type: undefined,
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
                    person_id: undefined,
                    store_id: this.store_id,
                    start_time: "",
                    end_time: "",
                    goods_name: undefined,
                    goods_type: undefined,
                    time: [],
                }
                this.data = []
                this.$set(this.pagination, 'current', 1)
                this.getPersonList()
            },
            openUrl(site_url, order_id) {
                window.open(site_url + "/admin.php?g=System&c=Group&a=order_detail&order_id=" + order_id);
            },
            getPersonList() {
                this.selectedRows = [];
                this.request(mallMerchantApi.storeMarketingRecord, this.formData).then((res) => {
                    this.person_sel = res.person_sel
                    this.data = res.list
                    this.pagination.total = res.count
                    this.areaList = res.areaList
                })
            },
            handleUpdate() {
                this.reset()
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
                //this.formData.page = page
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