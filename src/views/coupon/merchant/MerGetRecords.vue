<template>
    <div style="margin-top: 20px;padding:20px;background-color: #fff;">
        <a-form-model layout="inline" :model="searchForm">
            <a-form-model-item label="搜索">
                <a-select
                    v-model="searchForm.search_type"
                    style="width:150px;"
                >
                    <a-select-option :value="1">用户昵称</a-select-option>
                    <a-select-option :value="2">手机号</a-select-option>
                    <a-select-option :value="3">优惠券名称</a-select-option>
                    <a-select-option :value="4">店铺名称</a-select-option>
                    <a-select-option :value="5">员工会员名称</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="">
                <a-input v-model="searchForm.keyword" placeholder="关键词"></a-input>
            </a-form-model-item>
            <a-form-model-item label="日期">
                <a-select
                    v-model="searchForm.time_type"
                    style="width:100px;"
                >
                    <a-select-option :value="1">领取时间</a-select-option>
                    <a-select-option :value="2">使用时间</a-select-option>
                    <a-select-option :value="3">回收时间</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="">
                <a-range-picker
                    :ranges="{
            过去30天: [moment().subtract(30, 'days'), moment()],
            过去15天: [moment().subtract(15, 'days'), moment()],
            过去7天: [moment().subtract(7, 'days'), moment()],
            今日: [moment(), moment()],
          }"
                    :value="searchForm.time"
                    format="YYYY-MM-DD"
                    @change="onDateRangeChange"
                />
            </a-form-model-item>
            <a-form-model-item>
                <a-button type="primary" @click="submitForm(true)" class="ml-20">搜索</a-button>
                <a-button @click="resetForm()" class="ml-20">重置</a-button>
                <a-button type="primary" icon="download" @click="getExport()" class="ml-20">导出</a-button>
            </a-form-model-item>
        </a-form-model><br>
        <a-table rowKey="hadpull_id" :columns="columns" :data-source="datalist" :pagination="pagination" bordered>
            <template slot="id" slot-scope="text, record">
                <a-row>
                        <span v-if="record.is_use==0" class="cr-primary pointer inline-block" @click="backCoupon(record)">回收</span>
                </a-row>
            </template>
        </a-table>
        <a-modal :title="backTitle" :width="600" :visible="modal1Visible" @ok="handleSubmit()" @cancel="handleCancel">
            <a-form layout="inline">
                <a-form-item label="请输入回收理由">
                    <a-input v-model="backNote" placeholder="请输入回收理由"></a-input>
                </a-form-item>
            </a-form>
        </a-modal>
        <!-- <export-add ref="ExportAddModal" :exportUrl="exportUrl" :queryParam="searchForm"></export-add> -->
    </div>
</template>
<script>

import couponPlatformApi from '@/api/coupon/platform';
import ExportAdd from "@/views/common/export/ExportAdd"
import moment from 'moment'
import AFormItem from "ant-design-vue/es/form/FormItem";

const columns = [
    {
        title: '领取ID',
        dataIndex: 'hadpull_id',
        key: 'hadpull_id',
    },
    {
        title: '用户昵称',
        dataIndex: 'nickname',
        key: 'nickname',
    },
    {
        title: '员工会员名称',
        dataIndex: 'card_name',
        key: 'card_name',
    },
    {
        title: '用户手机',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: '优惠券名称',
        dataIndex: 'coupon_name',
        key: 'coupon_name',
    },
    {
        title: '数量',
        dataIndex: 'num',
        key: 'num',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: '使用店铺',
        dataIndex: 'store_name',
        key: 'store_name',
    },
    {
        title: '使用时间',
        dataIndex: 'use_time',
        key: 'use_time',
    },
    {
        title: '回收时间',
        dataIndex: 'recycle_time',
        key: 'recycle_time'
    },
    {
        title: '回收备注',
        dataIndex: 'note',
        key: 'note'
    },
    {
        title: '领取时间',
        dataIndex: 'receive_time',
        key: 'receive_time',
        scopedSlots: { customRender: 'receive_time' },
    },
    {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        scopedSlots: { customRender: 'id' },
    },

];

export default {
    components: {AFormItem, ExportAdd},
    data() {
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            datalist: [],
            modal1Visible:false,
            columns,
            backNote:'',
            backTitle:"",
            coupon_name:"",
            id:0,
            uid:0,
            //搜索框表单
            searchForm: {
                keyword: '',
                type: 0,
                search_type: 1,
                time_type: 1,
                status: -1,
                time: [],
                begin_time: '', // 开始时间
                end_time: '', // 结束时间
            },
            exportUrl: couponPlatformApi.exportMerGetRecords,
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => `共 ${total} 条记录`,
            },
        };
    },
    created() {
        this.getDataList(false)
    },
    methods: {
        moment,
        // 获取table数据
        getDataList(is_search) {
            let params = {...this.searchForm}
            if (is_search === true) {
                params.page = 1
                this.$set(this.pagination, 'current', 1)
            } else {
                params.page = this.pagination.current
                this.$set(this.pagination, 'current', this.pagination.current)
            }
            params.pageSize = this.pagination.pageSize
            this.request(couponPlatformApi.merCouponGetRecords, params).then((res) => {
                this.datalist = res.data
                this.$set(this.pagination, 'total', res.total)
            })
        },
        // 提交搜索表单
        submitForm(is_search = false) {
            this.getDataList(is_search)
        },
        backCoupon(record){
            this.modal1Visible=true
            this.id=record.id
            this.uid=record.uid
            this.coupon_name=record.coupon_name
            this.backTitle="回收优惠券-"+record.coupon_name
        },
        handleSubmit(){
            this.request(couponPlatformApi.updateUse, {id:this.id,note:this.backNote,uid:this.uid,coupon_name:this.coupon_name}).then((res) => {
                this.modal1Visible=false
                this.backNote=''
                this.getDataList(false)
            })
        },
        handleCancel(){
            this.modal1Visible=false
            this.backNote=''
        },
        // 重置表单
        resetForm() {
            this.$set(this, 'searchForm', {
                keyword: '',
                type: 0,
                search_type: 1,
                time_type: 1,
                status: -1,
                time: [],
                begin_time: '', // 开始时间
                end_time: '', // 结束时间
            })
            this.$set(this.pagination, 'current', 1)
            this.getDataList()
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
        // 监听日期选择变化
        onDateRangeChange(date, dateString) {
            // 更新搜索框表单数据
            this.$set(this.searchForm, 'time', [date[0], date[1]])
            this.$set(this.searchForm, 'begin_time', dateString[0])
            this.$set(this.searchForm, 'end_time', dateString[1])
        },
        getExport() {
            if (this.datalist.length > 0) {
                // this.$refs.ExportAddModal.exports()
                this.$message.success('正在导出，请耐心等待...');
                this.request(this.exportUrl, this.searchForm).then((res)=>{
                    if(res.file_url){
                        window.open(res.file_url)
                    }
                })
            } else {
                this.$message.warn('当前没有可以导出的内容')
            }
        },
    },
};
</script>