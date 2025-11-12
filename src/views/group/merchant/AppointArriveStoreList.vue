<template>
    <div id="components-layout-demo-basic">
        <a-spin :spinning="spinning" size="large">
            <a-layout-content
                    :style="{ margin: '0px', padding: '0px', background: '#fff', minHeight: '100px' }">
                <a-table :columns="columns"
                         :data-source="data"
                         :pagination="pagination"
                         @change="handleTableChange">
                        <span slot="user_name" slot-scope="text">
                            {{text}}
                        </span>
                    <span slot="phone" slot-scope="text">
                                {{text}}
                    </span>
                    <span slot="appoint_content" slot-scope="text">
                                {{text}}
                    </span>
                    <span slot="appoint_time" slot-scope="text">
                                {{text}}
                    </span>
                    <span slot="arrive_time" slot-scope="text">
                                {{text}}
                    </span>
                    <span slot="store_name" slot-scope="text">
                                {{text}}
                    </span>
                    <span slot="status" slot-scope="text">
                        <span class="height-30" v-if="text ==0">
                                    待处理
                        </span>
                        <span class="height-30" v-if="text ==1">
                                    约来店
                        </span>
                        <span class="height-30" v-if="text ==2">
                                    已到店
                        </span>
                        <span class="height-30" v-if="text ==3">
                                    关闭
                        </span>
                    </span>
                    <span slot="action" slot-scope="text,record">
                        <div v-if="record.status==0">
                           <a-row>
                               <a-col :span="8">
                                    <a class="label-sm green" @click="editStatus(record.id,1)"> 约来店</a>
                               </a-col>
                               <a-col :span="8">
                                    <a class="label-sm yellow" @click="editStatus(record.id,2)"> 已到店</a>
                               </a-col>
                               <a-col :span="8">
                                    <a class="label-sm blue" @click="editStatus(record.id,3)"> 关闭</a>
                               </a-col>
                           </a-row>
                        </div>
                        <div v-if="record.status==1">
                            <a-row>
                               <a-col :span="8">
                                    <a class="label-sm yellow" @click="editStatus(record.id,2)"> 已到店</a>
                               </a-col>
                               <a-col :span="8">
                                    <a class="label-sm blue" @click="editStatus(record.id,3)"> 关闭</a>
                               </a-col>
                           </a-row>
                        </div>
                    </span>
                    <template slot="title" slot-scope="currentPageData" style="padding: 0px;">
                        <a-row type="flex" justify="center" align="top">
                            <a-col :span="8">
                            </a-col>
                            <a-col :span="3">
                                <a-form-item>
                                    <a-select  @change="handleStoreChange" style="width: 150px;" placeholder="预约店铺">
                                        <a-select-option v-for="item in store_list" :key="item.store_id"
                                                         :value="item.store_id">{{ item.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>

                            <a-col :span="3">
                                <a-form-item>
                                    <a-select  @change="handleStatusChange" style="width: 150px;" placeholder="状态">
                                        <a-select-option v-for="item in status_list" :key="item.id" :value="item.id">{{
                                            item.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>

                            <a-col :span="3">
                                <a-form-item>
                                    <a-input placeholder="输入客户姓名/手机号" v-model="formData.phone"></a-input>
                                </a-form-item>
                            </a-col>
                            <a-col :span="2" class="text-right">
                                <a-form-item>
                                    <a-button type="primary" @click="appointFind()">
                                        查询
                                    </a-button>
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </template>
                </a-table>
            </a-layout-content>
        </a-spin>
    </div>
</template>

<script>
    import groupMerchantApi from '@/api/group/merchant'
    import ARow from "ant-design-vue/es/grid/Row";
    import ACol from "ant-design-vue/es/grid/Col";

    const columns = [
        {
            title: '姓名',
            dataIndex: 'user_name',
            scopedSlots: {customRender: 'user_name'},
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            scopedSlots: {customRender: 'phone'},
        },
        {
            title: '预约内容',
            dataIndex: 'appoint_content',
            scopedSlots: {customRender: 'appoint_content'},
        },
        {
            title: '预定时间',
            dataIndex: 'appoint_time',
            scopedSlots: {customRender: 'appoint_time'},
        },
        {
            title: '来店时间',
            dataIndex: 'arrive_time',
            scopedSlots: {customRender: 'arrive_time'},
        },
        {
            title: '预约店铺',
            dataIndex: 'store_name',
            scopedSlots: {customRender: 'store_name'},
        },
        {
            title: '状态',
            dataIndex: 'status',
            scopedSlots: {customRender: 'status'},
        },
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
        },
    ];
    export default {
        name: "AppointArriveStoreList",
        components: {ACol, ARow},
        activated() {
            this.$set(this.pagination, 'current', 1)
            this.$set(this.pagination, 'pageSize', 10)
            this.$set(this.pagination, 'total', 0)
            this.getAppointList()
        },
        created() {
            this.getAppointList()
        },
        data() {
            return {
                spinning: false,
                columns,
                data: [],
                store_list: [],
                status_list: [
                    {id: 0, name: "待处理"},
                    {id: 1, name: "约来店"},
                    {id: 2, name: "已到店"},
                    {id: 3, name: "关闭"},
                ],
                pagination: {
                    current: 1,
                    total: 0,
                    pageSize: 10,
                    showSizeChanger: true,
                    onChange: (page, pageSize) => this.onPageChange(page, pageSize),
                    onShowSizeChange: (page, pageSize) => this.onPageSizeChange(page, pageSize),
                    showTotal: (total) => `共 ${total} 个商品`,
                },
                formData: {
                    store_id: "",
                    status: "",
                    phone: ""
                },
            }
        },
        methods: {
            getAppointList() {
                this.request(groupMerchantApi.getAppointArriveList, {}).then((res) => {
                    this.data = res.list
                    this.store_list = res.store_list
                    this.$set(this.pagination, 'total', res.count)
                })
            },
            handleTableChange(e) {
                if (e.current && e.current > 0) {
                    this.getAppointList()
                }
            },
            editStatus(id, status) {
                this.$confirm({
                    title: '是否确定修改该状态?',
                    centered: true,
                    onOk: () => {
                        this.request(groupMerchantApi.updateAppointArriveStatus, {id: id, status: status}).then((res) => {
                            this.getAppointList()
                            this.$message.success('操作成功！')
                        })
                    },
                    onCancel() {
                    },
                })
            },
            handleStoreChange(val) {
                this.formData.store_id = val
            },
            handleStatusChange(val) {
                this.formData.status = val
            },
            appointFind(){
                this.request(groupMerchantApi.getAppointArriveList,this.formData).then((res) => {
                    this.data = res.list
                    this.store_list = res.store_list
                    this.$set(this.pagination, 'total', res.count)
                })
            },
            // 页码变化
            onPageChange(page, pageSize) {
                this.$set(this.pagination, 'current', page)
                this.getAppointList()
            },
            onPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
                this.getAppointList()
            },
        }
    }
</script>

<style scoped>
    .label-sm.green {
        border: 1px #3e800b solid;
        padding: 3px 10px;
        color: #3e800b !important;
    }

    .label-sm.yellow {
        border: 1px #806d07 solid;
        padding: 3px 10px;
        color: #806d07 !important;
    }

    .label-sm.blue {
        border: 1px #309ddf solid;
        padding: 3px 10px;
        color: #309ddf !important;
    }
</style>