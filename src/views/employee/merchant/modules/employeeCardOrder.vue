<template>
    <a-modal :title="title" :width="940" :visible="visible" :confirmLoading="confirmLoading" :footer="null"  @cancel="handleCancelModel">
        <a-spin :spinning="confirmLoading">
            <a-form-model layout="inline" :model="searchForm">
  
                <a-row>
                    <a-col :span="2" align="right">
                        <span class="label">消费类型：</span>
                    </a-col>
                    <a-col :span="3" style="padding-right: 10px;">
                        <a-select v-model="searchForm.verify_type">
                            <a-select-option :value="0">全部</a-select-option> 
                            <a-select-option :value="1">食堂刷卡</a-select-option> 
                            <a-select-option :value="2">自动核销</a-select-option> 
                            <a-select-option :value="3">余额消费</a-select-option> 
                            <a-select-option :value="4">积分消费</a-select-option> 
                        </a-select>
                    </a-col>
                    
                    <a-col :span="2" align="right">
                        <span class="label">变动类型：</span>
                    </a-col>
                    <a-col :span="3" style="padding-right: 10px;">
                        <a-select v-model="searchForm.change_type">
                            <a-select-option :value="0">全部</a-select-option> 
                            <a-select-option :value="1">增加</a-select-option> 
                            <a-select-option :value="2">减少</a-select-option>
                        </a-select>
                    </a-col>
                    
                    <a-col :span="2" align="right">
                        <span class="label">消费时间：</span>
                    </a-col>
                    <a-col :span="10">
                        <a-range-picker
                            :ranges="{
                                过去30天: [moment().subtract(30, 'days'), moment()],
                                过去15天: [moment().subtract(15, 'days'), moment()],
                                过去7天: [moment().subtract(7, 'days'), moment()],
                                今日: [moment(), moment()],
                              }"
                            :value="searchForm.time"
                            :show-time="{
                                hideDisabledOptions: true,
                                defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')],
                                format: 'HH:mm'
                              }"
                            format="YYYY-MM-DD HH:mm"
                            @change="onDateRangeChange"
                        />
                    </a-col>
                    
                    <a-col :span="2">
                          <a-button type="primary" @click="submitForm(true)" class="ml-20">搜索</a-button>
                    </a-col>
                   
                   
                </a-row>
                
                    
                  
            
            </a-form-model><br>
            <a-table :columns="columns"
                     :data-source="data"
                     :pagination="pagination"
                     rowKey="order_id"
                     @change="handleTableChange">
            <span slot="type" slot-scope="text,record">
                     <a v-if="record.verify_type=='1'" class="ml-10 inline-block">食堂刷卡</a>
                     <a v-if="record.verify_type=='2'" class="ml-10 inline-block">自动核销</a>
                     <a v-if="record.verify_type=='3'" class="ml-10 inline-block">余额消费</a>
                     <a v-if="record.verify_type=='4'" class="ml-10 inline-block">积分消费</a>
            </span>

            <span slot="change_type" slot-scope="text,record">
                     <a v-if="record.change_type=='increase'" class="ml-10 inline-block">增加</a>
                     <a v-if="record.change_type=='success'" class="ml-10 inline-block">减少</a>
                     <a v-if="record.change_type=='decrease'" class="ml-10 inline-block">减少</a>
            </span>
            </a-table>
        </a-spin>
    </a-modal>
</template>

<script>
    import lifeMerchantApi from '@/api/employee/merchant/index'
    import 'ant-design-vue/dist/antd.css'
    import 'viewerjs/dist/viewer.css'
    import Viewer from 'v-viewer'
    import Vue from 'vue'
    import ACol from "ant-design-vue/es/grid/Col";
    import moment from 'moment'
    Vue.use(Viewer)
    const columns = [
        {
            title: '编号',
            dataIndex: 'pigcms_id',
            scopedSlots: {customRender: 'pigcms_id'},
            align: "center"
        },
        {
            title: '消费类型',
            dataIndex: 'type',
            scopedSlots: {customRender: 'type'},
            align: "center"
        },
        {
            title: '变动类型',
            dataIndex: 'change_type',
            scopedSlots: {customRender: 'change_type'},
            align: "center"
        },
        {
            title: '展示的信息',
            dataIndex: 'description',
            slots: {customRender: 'description'},
            align: "center"
        },
        {
            title: '消费时间',
            dataIndex: 'add_time',
            slots: {customRender: 'add_time'},
            align: "center"
        },
    ];
    export default {
        name: "employeeCardOrder",
        components: {ACol},
        data() {
            return {
                title:"消费列表",
                total_num: 0,
                visible: false,
                confirmLoading:true,
                columns,
                data: [],
                card_id:0,
                formData: {},
                searchForm: {
                    type:0,
                    content: '', // 搜索内容
                    time: [],
                    begin_time: '', // 开始时间
                    end_time: '', // 结束时间
                    user_id: 0,
                    card_id: 0,
                    verify_type: 0,
                    change_type: 0
                },
                pagination: {
                    page: 1,
                    current: 1,
                    total: 0,
                    pageSize: 10,
                    showSizeChanger: true,
                    onChange: (page, pageSize) => this.onPageChange(page, pageSize),
                    onShowSizeChange: (page, pageSize) => this.onPageSizeChange(page, pageSize),
                    showTotal: (total) => `共 ${total} 条`,
                },
            }
        },
        methods: {
            moment,
            edit(user_id,card_id) {
                this.$set(this.searchForm, 'user_id', user_id)
                this.$set(this.searchForm, 'card_id', card_id)
                this.searchForm.verify_type = 0;
                this.searchForm.change_type = 0;
                this.getDataList()
            },
            getDataList() {
                this.request(lifeMerchantApi.orderList, this.searchForm).then((res) => {
                    this.visible=true
                    this.confirmLoading=false
                    this.data = res.list
                    this.total_num = res.total
                    this.$set(this.pagination, 'total', res.total)
                })
            },
            // 提交搜索表单
            submitForm() {
                this.$set(this.pagination, 'current', 1)
                this.getDataList()
            },
            handleTableChange(e) {
                if (e.current && e.current > 0) {
                    this.pagination['page'] = e.current
                }
            },
            // 页码变化
            onPageChange(page, pageSize) {
                this.pagination.page = page
                this.$set(this.pagination, 'current', page)
            },
            onPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
            },
            handleCancelModel() {
                this.searchForm = {
                    type: 0,
                    content: '', // 搜索内容
                    time: [],
                    begin_time: '', // 开始时间
                    end_time: '', // 结束时间
                }
                this.visible = false
            },
            // 监听日期选择变化
            onDateRangeChange(date, dateString) {
                // 更新搜索框表单数据
                this.$set(this.searchForm, 'time', [date[0], date[1]])
                this.$set(this.searchForm, 'begin_time', dateString[0])
                this.$set(this.searchForm, 'end_time', dateString[1])
            },
        }
    }
</script>

<style scoped>
    .wrap {
        width: 100%;
        min-height: 100%;
    }

    .page-title {
        padding: 20px 30px;
        border-bottom: 1px solid #f1f1f1;
        font-size: 15px;
        font-weight: bold;
        color: #000000;
    }

    .content {
        margin: 20px 30px;
    }

    .ant-row-flex {
        margin-bottom: 12px;
    }

    .ant-form-item {
        display: flex;
        align-items: center;
    }

    .ant-form-item-control-wrapper {
        padding-right: 100px;
        flex: 1;
        box-sizing: border-box;
    }

    .ant-form-item-children {
        width: 100%;
        display: inline-block;
    }

    .total-performance {
        margin: 20px 0;
        padding: 0 30px;
        width: 100%;
        background-color: #e6f7ff;
        border: 1px solid #91d5ff;
        border-radius: 4px;
        font-size: 14px;
        line-height: 1;
    }

    .cr-f1 {
        color: #f1f1f1;
    }
    .label{
        line-height: 32px;
    }
</style>