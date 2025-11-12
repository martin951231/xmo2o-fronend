<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <!-- <div class="page-title" style="padding-left: 0px;margin-left: 0px;padding-top: 0px;border-bottom: none;margin-top: 0px;padding-bottom: 10px;">赛事列表</div> -->
        <a-tabs v-model="aTabsIndex">
            <a-tab-pane :key="0" tab="赛事列表">
                <a-form-model layout="inline" :model="searchForm"
                      style="margin-bottom:20px;">
            <a-row>
                <a-col :span="4">
                    <a-form-model-item label="活动名称">
                        <a-input v-model="searchForm.title" placeholder="请输入活动名称" style="width:160px;"/>
                    </a-form-model-item>
                </a-col>

                <a-col :span="6">
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
                <a-col :span="4">
                    <a-form-model-item>
                        <a-button type="primary" icon="search" @click="getSportList()"> 查询</a-button>
                    </a-form-model-item>
                </a-col>
            </a-row>
        </a-form-model>
        <div>
            <a-form-model-item>
                <a-button type="primary" @click="$refs.editPlatformSports.edit(0)" class="maxbox"> 添加赛事</a-button>
            </a-form-model-item>
        </div>
        <a-table :columns="columns"
                 :data-source="data"
                 rowKey="competition_id"
                 @change="handleTableChange">

                <span slot="look" slot-scope="text,record">
                     <a class="ml-10 inline-block" @click="$refs.userRecordList.showRes(record.competition_id)">查看</a>
                </span>

            <span slot="action" slot-scope="text,record">
                          <a class="ml-10 inline-block" @click="editAct(record.competition_id)">编辑赛事</a>
                          <a class="ml-10 inline-block" @click="closeAct(record.competition_id,record.status)"
                             v-if="record.status==1">关闭赛事</a>
                          <a class="ml-10 inline-block" @click="closeAct(record.competition_id,record.status)"
                             v-if="record.status==0" style="color: red;">打开赛事</a>
                          <a class="ml-10 inline-block" @click="delAct(record.competition_id)">删除赛事</a>
                  </span>
        </a-table>
        <user-record-list @getSportList="getSportList" ref="userRecordList"></user-record-list>
        <edit-platform-sports @getSportList="getSportList" ref="editPlatformSports"></edit-platform-sports>
            </a-tab-pane>
            <a-tab-pane :key="1" :tab="'我的审核('+wait_audit+')'">
                <sports-my-review @totalNum="totalNum"/>
            </a-tab-pane>
        </a-tabs>

        
    </div>
</template>

<script>
    import moment from 'moment'
    import marketingPlatformApi from '@/api/life_tools/platform/index'
    import 'ant-design-vue/dist/antd.css'
    import UserRecordList from "./modules/userRecordList";
    import EditPlatformSports from "./modules/editPlatformSports";
    import SportsMyReview from "./modules/sportsMyReview";
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
        name: "PlatformSports",
        components: {
            EditPlatformSports,
            UserRecordList,
            SportsMyReview,
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
                aTabsIndex: 0,
                wait_audit: 0,
            }
        },
        created() {
            this.getSportList()
            this.getMyAuditCount();
        },
        activated() {
            this.getSportList()
            this.getMyAuditCount();
        },
        methods: {
            moment,
            reset() {
                this.data = []
                this.getSportList()
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
                this.request(marketingPlatformApi.closeCompetition, {
                    competition_id: id,
                    status: status
                }).then((res) => {
                    this.getSportList()
                })
            },
            editAct(id) {
                this.$refs.editPlatformSports.edit(id);
            },
            getSportList() {
                this.selectedRows = [];
                this.request(marketingPlatformApi.getSportList, this.searchForm).then((res) => {
                    this.data = res.list
                    this.total_num = res.total
                })
            },
            delAct(id) {
                this.$confirm({
                    title: "是否删除赛事",
                    content: '',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        this.request(marketingPlatformApi.delSport, {
                            competition_id: id,
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
            backfnc() {
                this.$router.replace('/new_marketing/platform/regionalAgencyList')
            },
            clikPersent() {
                alert(13123)
            },
            handleUpdate() {
                this.getSportList()
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
            delData(id) {
                this.$confirm({
                    title: '是否确定移除该区域代理?',
                    centered: true,
                    onOk: () => {
                        this.request(marketingPlatformApi.delRegionalAgency, {
                            id: id
                        }).then((res) => {
                            this.$set(this.pagination, 'current', 1)
                            this.getSportList()
                        })
                    },
                    onCancel() {
                    },
                })

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
                this.queryParam.page = page
                this.$set(this.pagination, 'current', page)
            },
            onPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
            },
            totalNum(e){
                this.getMyAuditCount();
            },
            //获取审核数量
            getMyAuditCount(){
                this.request(marketingPlatformApi.getMyAuditCount, {}).then((res) => {
                            this.wait_audit = res.wait_audit
                        })
            }
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
