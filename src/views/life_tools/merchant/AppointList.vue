<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <div
            class="page-title"
            style="
                padding-left: 0px;
                margin-left: 0px;
                padding-top: 0px;
                border-bottom: none;
                margin-top: 0px;
                padding-bottom: 10px;
            "
        >
            预约列表
        </div>
        <a-form-model layout="inline" :model="searchForm" style="margin-bottom: 20px">
            <a-input-group compact> 
             
               <label style="line-height: 31px;">活动名称：</label>
                        <a-input v-model="searchForm.title" placeholder="请输入活动名称" style="width: 160px" />
                     
               <label style="line-height: 31px;margin-left: 20px;">活动时间：</label> 
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
 
                        <a-button type="primary" icon="search" style="margin-left: 20px;" @click="getAppointList()"> 查询</a-button>
     
                        <a-button type="primary" style="margin-left: 20px;" @click="onReset()"> 重置</a-button>
               
            
            </a-row>
            </a-input-group>
        </a-form-model>
        <div>
            <a-form-model-item>
                <a-button type="primary" @click="$refs.appointEdit.edit(0)" class="maxbox"> 添加预约</a-button>
            </a-form-model-item>
        </div>
        <a-table :columns="columns" :data-source="data" rowKey="appoint_id" @change="handleTableChange">
            <span slot="set_suspend" slot-scope="text, record">
                <a class="ml-10 inline-block" @click="setSuspend(record)">设置</a>
            </span>
            <span slot="look" slot-scope="text, record">
                <a class="ml-10 inline-block" @click="$refs.userRecordList.showRes(record.appoint_id)">查看</a>
            </span>
            <span slot="is_select_seat" slot-scope="text, record">
                <a-button type="link" v-if="text == 1" @click="viewSeat(record.appoint_id)">查看</a-button>
            </span>

            <span slot="action" slot-scope="text, record">
                <a class="ml-10 inline-block" @click="editAct(record.appoint_id)">编辑</a>
                <a
                    class="ml-10 inline-block"
                    @click="closeAct(record.appoint_id, record.status)"
                    v-if="record.status == 1"
                    >关闭预约</a
                >
                <a
                    class="ml-10 inline-block"
                    @click="closeAct(record.appoint_id, record.status)"
                    v-if="record.status == 0"
                    style="color: red"
                    >开启预约</a
                >
                <a class="ml-10 inline-block" @click="delAct(record.appoint_id)">删除</a>
            </span>
        </a-table>
        <appoint-user-record-list @getAppointList="getAppointList" ref="userRecordList"></appoint-user-record-list>
        <appoint-edit @getAppointList="getAppointList" ref="appointEdit"></appoint-edit>
        <a-modal
            :title="modalTitle[modalType]"
            width="60%"
            :visible="modalVisible"
            :footer="modalType != 'seatData'?undefined:null"
            :destroyOnClose="true"
            @cancel="cancelModal"
            :bodyStyle="{
                maxHeight: '600px',
                overflowY: 'auto',
            }"
        >
            <template slot="footer">
                <a-button key="back" @click="cancelModal"> 取消 </a-button>
                <a-button key="submit" type="primary" @click="okModal"> 确定 </a-button>
            </template>
            <div class="decorate-cube" v-if="modalType == 'seatData'">
                <ul v-for="rowItem in seatData" :key="rowItem.row" class="cube-row">
                    <li v-for="colItem in rowItem.list" :key="`${rowItem.row}_${colItem.col}`" class="cube-item">
                        <template v-if="colItem.seat_title">
                            <div class="no-wrap">{{ colItem.seat_title }}</div>
                            <div
                                class="no-wrap"
                                v-if="(colItem.seat_price || colItem.seat_price == 0) && colItem.is_buy === 1"
                            >
                                {{ currency }}{{ colItem.seat_price }}
                            </div>
                            <div class="no-wrap" v-if="colItem.is_buy === 0">不可购买</div>
                        </template>
                    </li>
                </ul>
            </div>

            <a-form-model
                layout="inline"
                :model="curAppointRecord"
                style="margin-bottom: 20px"
                v-if="modalType == 'setSuspend'"
                :labelCol="{
                    xs: {
                        span: 24,
                    },
                    sm: {
                        span: 7,
                    },
                }"
                :wrapperCol="{
                    xs: {
                        span: 24,
                    },
                    sm: {
                        span: 13,
                    },
                }"
            >
                <a-form-model-item label="是否暂停">
                    <a-switch
                        checked-children="是"
                        un-checked-children="否"
                        :checked="curAppointRecord.is_suspend == 1 ? true : false"
                        @change="switchChange($event, 'curAppointRecord', 'is_suspend')"
                    />
                </a-form-model-item>
                <a-form-model-item label="自定义按钮文案">
                    <a-textarea
                        v-model="curAppointRecord.suspend_msg"
                        :autoSize="{
                            minRows: 4,
                            maxRows: 10
                        }"
                        placehodler="请输入"
                        style="resize: none;"
                    />
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import moment from 'moment'
import appointMerchantApi from '@/api/life_tools/merchant/index'
import ARow from 'ant-design-vue/es/grid/Row'
import ACol from 'ant-design-vue/es/grid/Col'
import 'ant-design-vue/dist/antd.css'
import AppointUserRecordList from './modules/AppointUserRecordList'
import AppointEdit from './modules/AppointEdit'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'

Vue.use(Viewer)

const selectedRows = []
const columns = [
    {
        title: '活动名称',
        dataIndex: 'title',
        scopedSlots: { customRender: 'title' },
    },
    {
        title: '活动时间',
        dataIndex: 'activity_time',
        scopedSlots: { customRender: 'activity_time' },
    },
    {
        title: '活动地点',
        dataIndex: 'address',
        slots: { customRender: 'address' },
    },
    {
        title: '报名费用',
        dataIndex: 'price',
        scopedSlots: { customRender: 'price' },
        align: 'center',
    },
    {
        title: '暂停活动',
        scopedSlots: { customRender: 'set_suspend' },
        align: 'center',
    },
    {
        title: '查看报名信息',
        scopedSlots: { customRender: 'look' },
        align: 'center',
    },
    // 暂时隐藏
   /*  {
            title: '会场分布图',
            dataIndex: 'is_select_seat',
            key: 'is_select_seat',
            scopedSlots: {customRender: 'is_select_seat'},
            align:'center'
        }, */
    {
        title: '操作',
        dataIndex: 'tools_id',
        key: 'tools_id',
        scopedSlots: { customRender: 'action' },
        align: 'center',
    },
]
export default {
    name: 'AppointList',
    components: {
        AppointEdit,
        AppointUserRecordList,
        ACol,
        ARow,
    },
    data() {
        return {
            total_num: 0,
            visible: false,
            columns,
            selectedRows,
            data: [],
            areaList: [],
            formData: {},
            searchForm: {
                title: '', // 搜索内容
                time: [],
                start_time: '', // 开始时间
                end_time: '', // 结束时间
            },
            queryParam: {
                page: 1,
                pageSize: 10,
                education: -1,
                job_age: '',
                status: -1,
                keywords: '',
                cates: '',
                mer_id: 0,
            },
            // 弹框显隐
            modalVisible: false,
            // 座位分布
            seatData: [],
            currency: '￥',
            // 弹框类型 seatData = 位置分布 setSuspend = 活动暂停设置
            modalType: '',
            // 弹框标题
            modalTitle: {
                seatData: '会场分布',
                setSuspend: '设置暂停活动',
            },
            // 预约详情
            curAppointRecord: '',
        }
    },
    created() {
        this.getAppointList()
    },
    activated() {
        this.getAppointList()
    },
    methods: {
        moment,
        reset() {
            this.data = []
            this.getAppointList()
        },
        onReset(){
          this.searchForm = {
              title: '', // 搜索内容
              time: [],
              start_time: '', // 开始时间
              end_time: '', // 结束时间
          };
          this.getAppointList();
        },
        // 监听日期选择变化
        onDateRangeChange(date, dateString) {
            // 更新搜索框表单数据
            this.$set(this.searchForm, 'time', [date[0], date[1]])
            this.$set(this.searchForm, 'start_time', dateString[0])
            this.$set(this.searchForm, 'end_time', dateString[1])
        },
        closeAct(id, status) {
            if (status) {
                status = 0
            } else {
                status = 1
            }
            this.request(appointMerchantApi.closeAppoint, {
                appoint_id: id,
                status: status,
            }).then((res) => {
                this.getAppointList()
            })
        },
        editAct(id) {
            this.$refs.appointEdit.edit(id)
        },
        getAppointList() {
            this.selectedRows = []
            this.request(appointMerchantApi.getAppointList, this.searchForm).then((res) => {
                this.data = res.list
                this.total_num = res.total
            })
        },
        delAct(id) {
            this.$confirm({
                title: '是否删除预约',
                content: '',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    this.request(appointMerchantApi.delAppoint, {
                        appoint_id: id,
                    }).then((res) => {
                        this.getAppointList()
                    })
                },
                class: 'test',
            })
        },
        clikPersent() {},
        handleUpdate() {
            this.getAppointList()
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
        onSelectChange(selectedRowKeys, selectedRows) {
            this.selectedRows = []
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
            this.queryParam.page = page
            this.$set(this.pagination, 'current', page)
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
        },
        // 会场分布图查看
        viewSeat(appoint_id) {
            this.request(appointMerchantApi.getAppointMsg, { appoint_id }).then((res) => {
                if (res.seat_data && res.seat_data.length) {
                    this.seatData = res.seat_data
                    this.modalVisible = true
                    this.modalType = 'seatData'
                }
            })
        },
        // 暂停活动设置
        setSuspend(record) {
            this.curAppointRecord = {...record}
            this.modalVisible = true
            this.modalType = 'setSuspend'
        },
        switchChange(e, dataField, field) {
            this.$set(this[dataField], field, e ? 1 : 0)
        },
        // 弹框关闭
        cancelModal() {
            this.modalVisible = false
            this.modalType = ''
            this.curAppointRecord = ''
        },
        // 弹框确定
        okModal() {
            if (this.modalType == 'setSuspend') {
                let params = {
                    appoint_id: this.curAppointRecord.appoint_id,
                    is_suspend: this.curAppointRecord.is_suspend,
                    suspend_msg: this.curAppointRecord.suspend_msg,
                }
                this.request(appointMerchantApi.suspend, params).then((res) => {
                    this.$message.success('操作成功')
                    this.data.forEach((item,index) => {
                        if (item.appoint_id == this.curAppointRecord.appoint_id) {
                            item.is_suspend = this.curAppointRecord.is_suspend
                            item.suspend_msg = this.curAppointRecord.suspend_msg
                            this.$set(this.data,index,item)
                        }
                    })
                    this.cancelModal()
                })
            } else {
                this.cancelModal()
            }
        },
    },
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

.decorate-cube ul {
    margin: 0;
    padding: 0;
}
.decorate-cube ul li {
    list-style: none;
}
.decorate-cube .cube-row {
    display: flex;
}
.decorate-cube .cube-row .cube-item:last-child {
    border-right: 1px solid #e5e5e5;
}
.decorate-cube .cube-row:first-child .cube-item {
    border-top: 1px solid #e5e5e5;
}

.decorate-cube .cube-item {
    padding: 10px;
    position: relative;
    min-width: 80px;
    min-height: 80px;
    width: 80px;
    height: 80px;
    background: #ffffff;
    border-left: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    cursor: pointer;
    text-align: center;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    overflow: hidden;
}
</style>
