<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-layout style="padding: 0 20px; background: #fff">
            <a-layout-content :style="{ margin: '0px', padding: '0px', background: '#fff', minHeight: '100px' }">
                <div class="table-operations">
                    <a-row align="top" style="padding: 0px;width: 100%;">
                        <a-col :span="2" class="text-center">
                            <a-button type="primary"
                                      style="height: 40px;width: 100px;border-radius: 7px;"
                                      @click="goAdd">
                                添加优惠券
                            </a-button>
                        </a-col>
                        <a-col :span="2" class="text-left">
                        </a-col>
                        <a-col :span="18" class="text-center">
                        </a-col>
                    </a-row>
                </div>
                <a-table :columns="columns"
                         :data-source="data"
                         rowKey="id"
                         @change="handleTableChange">
                <span slot="bg_image" slot-scope="text,record">
                     <img :src="record.bg_image" width="60px"/>
                </span>
                    <span slot="status" slot-scope="text,record">
                     <a v-if="record.status==1" class="ml-10 inline-block">开启</a>
                     <a v-if="record.status==0" class="ml-10 inline-block">关闭</a>
                </span> 
                <span slot="is_default" slot-scope="text,record">
                    <a-switch checked-children="开启" un-checked-children="关闭" :checked="record.is_default == 1 ? true : false"
                              @change="switchChange(record.pigcms_id, $event)" />
                </span>
    
                    <span slot="action" slot-scope="text,record">
                          <a class="ml-10 inline-block" @click="editAct(record.pigcms_id)">编辑</a>
                          <a class="ml-10 inline-block" @click="delAct(record.pigcms_id)">删除</a>
            </span>
                </a-table>
            </a-layout-content>
        </a-layout>
        <edit-coupon @getSportList="getSportList" ref="editCoupon"></edit-coupon>
    </div>
</template>

<script>
    import lifeMerchantApi from '@/api/employee/merchant/index'
    import 'ant-design-vue/dist/antd.css'
    import 'viewerjs/dist/viewer.css'
    import Viewer from 'v-viewer'
    import Vue from 'vue'
    import EditCoupon from "./editCoupon";

    Vue.use(Viewer)
    const columns = [
        {
            title: '券名称',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'},
        },
        {
            title: '开始时间',
            dataIndex: 'start_time',
            scopedSlots: {customRender: 'start_time'},
        },
        {
            title: '结束时间',
            dataIndex: 'end_time',
            slots: {customRender: 'end_time'}
        },
        {
            title: '可核销的数量',
            dataIndex: 'send_num',
            scopedSlots: {customRender: 'send_num'},
            align: "center",
        },
        {
            title: '核销的时扣除的余额',
            dataIndex: 'money',
            scopedSlots: {customRender: 'money'},
            align: "center",
        },
        {
            title: '未核销增加积分数量',
            dataIndex: 'add_score_num',
            scopedSlots: {customRender: 'add_score_num'},
            align: "center",
        },
        {
            title: '未核销增加积分数量需要扣除的余额',
            dataIndex: 'deduct_money',
            scopedSlots: {customRender: 'deduct_money'},
            align: "center",
        },
        {
            title: '是否开启余额默认消费',
            dataIndex: 'is_default',
            scopedSlots: {customRender: 'is_default'},
            align: "center",
        },
        {
            title: '状态',
            dataIndex: 'status',
            scopedSlots: {customRender: 'status'},
            align: "center",
        },
        {
            title: '操作',
            dataIndex: 'pigcms_id',
            key: 'pigcms_id',
            scopedSlots: {customRender: 'action'},
        },
    ];
    export default {
        name: "EmployeeCardCoupon",
        components: {EditCoupon},
        props: {
            card_id: {
                type: [String, Number],
                default: '0',
            },
        },
        data() {
            return {
                total_num: 0,
                visible: false,
                columns,
                data: [],
                formData: {},
                queryParam: {
                    page: 1,
                    pageSize: 10,
                },
            }
        },
        activated() {
            this.getSportList()
        },
        created() {
            this.getSportList()
        },
        methods: {
            reset() {
                this.data = []
                this.getSportList()
            },
            employEdit(card_id) {
                this.$router.push({path: '/merchant/merchant.employee/editEmployeeCard'})
            },
            editAct(id) {
                this.$refs.editCoupon.edit(id,this.card_id);
            },
            goAdd(){
                this.$refs.editCoupon.edit(0,this.card_id);
            },
            getSportList() {
                this.request(lifeMerchantApi.getCouponList, {card_id: this.card_id}).then((res) => {
                    this.data = res.list
                    this.total_num = res.total
                })
            },
            delAct(id) {
                this.$confirm({
                    title: "是否删除优惠券？",
                    content: '',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        this.request(lifeMerchantApi.delCoupon, {
                            pigcms_id: id,
                        }).then((res) => {
                            this.getSportList()
                        })
                    },
                    onCancel: () => {
                        console.log('Cancel')
                        this.currentBtn = ''
                    },
                    class: 'test',
                })
            },
            handleUpdate() {
                this.getSportList()
            },
            handleTableChange(e) {
                if (e.current && e.current > 0) {
                    this.queryParam['page'] = e.current
                }
            },
            // 页码变化
            onPageChange(page, pageSize) {
                this.queryParam.page = page
                this.$set(this.pagination, 'current', page)
            },
            onPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
            },
            switchChange(pigcms_id, status) {
                status = status ? 1 : 0
                this.request(lifeMerchantApi.isOpenUseMoney,{pigcms_id, status}).then((res)=>{
                    this.getSportList()
                })
            },
        }
    }
</script>

<style scoped>

</style>