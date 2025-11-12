<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <div class="page-title" style="padding-left: 0px;margin-left: 0px;padding-top: 0px;border-bottom: none;margin-top: 0px;padding-bottom: 10px;">预约列表</div>
        <a-form-model layout="inline" :model="searchForm"
                      style="margin-bottom:20px;">
            <a-row style="display:flex">
                <a-col >
                    <a-form-model-item label="活动名称">
                        <a-input v-model="searchForm.title" placeholder="请输入活动名称" style="width:160px;"/>
                    </a-form-model-item>
                </a-col>
                <a-col >
                    <a-form-model-item label="商家名称">
                        <a-input v-model="searchForm.mer_name" placeholder="请输入商家名称" style="width:160px;"/>
                    </a-form-model-item>
                </a-col>
                <a-col >
                    <a-form-model-item label="活动时间">
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
                </a-col>
                <a-col>
                    <a-form-model-item>
                        <a-button type="primary" icon="search" @click="getAppointList()"> 查询</a-button>
                    </a-form-model-item>
                </a-col>
            </a-row>
        </a-form-model>
        <a-table :columns="columns"
                 :data-source="data"
                 rowKey="appoint_id"
                 :pagination="pagination"
                 @change="onPageChange">

                <span slot="look" slot-scope="text,record">
                     <a class="ml-10 inline-block" @click="$refs.userRecordList.showRes(record.appoint_id)">查看</a>
                </span>

            <span slot="action" slot-scope="text,record">
                          <a class="ml-10 inline-block" @click="editAct(record.appoint_id)">编辑</a>
                          <a class="ml-10 inline-block" @click="closeAct(record.appoint_id,record.status)"
                             v-if="record.status==1">关闭预约</a>
                          <a class="ml-10 inline-block" @click="closeAct(record.appoint_id,record.status)"
                             v-if="record.status==0" style="color: red;">开启预约</a>
                          <a class="ml-10 inline-block" @click="delAct(record.appoint_id)">删除</a>
                  </span>
        </a-table>
        <appoint-user-record-list @getAppointList="getAppointList" ref="userRecordList"></appoint-user-record-list>
        <appoint-edit @getAppointList="getAppointList" ref="appointEdit"></appoint-edit>
    </div>
</template>

<script>
    import moment from 'moment'
    import appointPlatformApi from '@/api/life_tools/platform/index'
    import ARow from "ant-design-vue/es/grid/Row";
    import ACol from "ant-design-vue/es/grid/Col";
    import 'ant-design-vue/dist/antd.css'
    import AppointUserRecordList from "./modules/AppointUserRecordList";
    import AppointEdit from "./modules/AppointEdit";
    import 'viewerjs/dist/viewer.css'
    import Viewer from 'v-viewer'
    import Vue from 'vue'

    Vue.use(Viewer)

    const selectedRows = []
    const columns = [
        {
            title: '活动名称',
            dataIndex: 'title',
            scopedSlots: {customRender: 'title'},
        },
        {
            title: '商家名称',
            dataIndex: 'mer_name',
        },
        {
            title: '活动时间',
            dataIndex: 'activity_time',
            scopedSlots: {customRender: 'activity_time'},
        },
        {
            title: '活动地点',
            dataIndex: 'address',
            slots: {customRender: 'address'}
        },
        {
            title: '报名费用',
            dataIndex: 'price',
            scopedSlots: {customRender: 'price'},
            align: "center"
        },
        {
            title: '查看报名信息',
            scopedSlots: {customRender: 'look'},
            align: "center"
        },
        {
            title: '操作',
            dataIndex: 'tools_id',
            key: 'tools_id',
            scopedSlots: {customRender: 'action'},
            align:'center'
        },
    ];
    export default {
        name: "AppointList",
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
                    pageSize: 10, 
                    page: 1
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
                pagination: {
                    pageSize: 10,
                    total: 0,
                    current: 1,
                    page: 1
                },
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
                this.request(appointPlatformApi.closeAppoint, {
                    appoint_id: id,
                    status: status
                }).then((res) => {
                    this.getAppointList()
                })
            },
            editAct(id) {
                this.$refs.appointEdit.edit(id);
            },
            getAppointList() {
                this.selectedRows = [];
                this.searchForm.pageSize = this.pagination.pageSize
                this.searchForm.page = this.pagination.current;
                this.request(appointPlatformApi.getAppointList, this.searchForm).then((res) => {
                    this.data = res.list
                    this.total_num = res.total
                    this.pagination.total = res.total
                })
            },
            delAct(id) {
                this.$confirm({
                    title: "是否删除预约",
                    content: '',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        this.request(appointPlatformApi.delSport, {
                            appoint_id: id,
                        }).then((res) => {
                            this.getAppointList()
                        })
                    },
                    onCancel: () => {
                        console.log('Cancel')
                        this.currentBtn = ''
                    },
                    class: 'test',
                })
            },
            clikPersent() {
            },
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
                this.pagination.current = page.current;
                this.getAppointList();
            },
            // 页码变化
            onPageChange(page, pageSize) {
               this.pagination.current = page.current;
               this.getAppointList();
            },
            onPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
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
</style>
