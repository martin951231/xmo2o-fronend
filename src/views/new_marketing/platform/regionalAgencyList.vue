<template>
    <div class="bg-ff wrap">
        <div class="page-title">区域代理列表</div>
        <div class="content">
            <!--<a-row>-->
            <a-form-model layout="inline" style="padding: 20px auto">
                <a-row type="flex">
                    <a-col :span="10">
                        <a-form-model-item label="选择区域:">
                            <a-cascader :options="areaList" placeholder="请选择省市区" :value="formData.check_areaList"
                                        @change="changeArea" style="width: 365px;"/>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="10">
                        <a-form-model-item label="区域代理姓名:">
                            <a-input v-model="formData.put_text" placeholder="请输入区域代理人姓名" style="width: 365px;"/>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="4" class="text-right">
                        <a-button style="margin-top: 4px" type="primary" @click="getRegionalAgencyList()" class="mr-20">
                            查询
                        </a-button>
                        <a-button type="warning" @click="reset()" class="mr-20"> 重置</a-button>
                    </a-col>
                </a-row>
            </a-form-model>
            <!--</a-row>-->

            <a-form-model layout="inline" style="padding: 20px auto">
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
                            />
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>

            <a-row style="margin-bottom: 20px;">
                <a-button style="margin-top: 4px" type="primary" @click="$refs.addRegionalAgent.add()" class="mr-20">
                    添加区域代理
                </a-button>
            </a-row>

            <!--<a-layout style="padding: 0px; background: #fff">-->
            <div style="width: 100%;border: 1px solid lightblue;background-color: #E6F7FF;height: 40px;line-height: 40px;padding-left: 15px;">
                已选择{{total_num}}项 团队总业绩: {{achievement}} <a class="label-sm blue" @click="reset()">清空</a>
            </div>
            <!-- <a-layout-content :style="{ margin: '0px', padding: '0px', background: '#fff', minHeight: '100px' }">-->
            <a-table :columns="columns"
                     :data-source="data"
                     :pagination="pagination"
                     rowKey="id"
                     :row-selection="{ selectedRowKeys: selectedRows, onChange: onSelectChange }"
                     @change="handleTableChange">
                <router-link
                        :to="{ path: '/recruit/platform/TalentManagementList', query: { id: record.id } }"
                        slot="team_nums"
                        slot-scope="text, record"
                        v-if="text"
                >
                    <a class="label-sm-1 blue">{{text}}</a>
                </router-link>
                <span slot="team_nums" slot-scope="text, record" v-if="text">
                             <a class="label-sm blue"
                                @click="openWin(record.id)">{{text}}</a>
                        </span>
                <span slot="team_nums" v-else>
                            0
                        </span>
                <!-- <span slot="customName"> 代理抽成比例 <a-icon type="smile-o" style="color: #ff6b81"
                                                         @click="clikPersent"/></span>-->
                <span slot="customName">
                <template>
                  <a-popover title="店铺业务抽成比例设置" trigger="click" style="text-align:center" v-model="listDiscountShow">
                    <template slot="content">
                      <a-row style="margin-bottom:10px;text-align:center">
                        <a-input-number
                                :precision="2"
                                :min="0"
                                :max="100"
                                step="1"
                                style="width: 100px"
                                v-model="discount_ratio"
                        />
                      </a-row>
                      <a-row style="text-align:center">
                        <a-button style="margin-right:20px" @click="cancelHandle('store')">取消</a-button>
                        <a-button type="primary" @click="confirmHandle('store')">确认</a-button>
                      </a-row>
                    </template>
                    <span>店铺业务抽成比例<a-icon type="edit" theme="twoTone" style="margin-left:5px;"/></span>
                  </a-popover>
                </template>
              </span>
                <span slot="customName1">
                <template>
                  <a-popover title="社区业务抽成比例设置" trigger="click" style="text-align:center" v-model="listDiscountShow1">
                    <template slot="content">
                      <a-row style="margin-bottom:10px;text-align:center">
                        <a-input-number
                                :precision="2"
                                :min="0"
                                :max="100"
                                step="1"
                                style="width: 100px"
                                v-model="discount_ratio1"
                        />
                      </a-row>
                      <a-row style="text-align:center">
                        <a-button style="margin-right:20px" @click="cancelHandle('village')">取消</a-button>
                        <a-button type="primary" @click="confirmHandle('village')">确认</a-button>
                      </a-row>
                    </template>
                    <span>社区业务抽成比例<a-icon type="edit" theme="twoTone" style="margin-left:5px;"/></span>
                  </a-popover>
                </template>
              </span>
                <span slot="action"
                      slot-scope="text, record">
                            <a class="label-sm blue" @click="$refs.editRegionalAgent.edit(record.id)">编辑</a>
                            <a-dropdown>
                                <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                                  更多 <a-icon type="down"/>
                                </a>
                                <a-menu slot="overlay">
                                  <a-menu-item @click="$refs.reduceRegionalAgent.add(record.id)">
                                    降级
                                  </a-menu-item>
                                  <a-menu-item @click="$refs.delRegionalAgent.delData(record.id)">
                                    移除
                                  </a-menu-item>
                                </a-menu>
                              </a-dropdown>
                            </span>
            </a-table>
            <!--  </a-layout-content>
          </a-layout>-->
            <delete-regional-agent ref="delRegionalAgent" @ok="handleUpdate"></delete-regional-agent>
            <add-regional-agent ref="addRegionalAgent" @ok="handleUpdate"></add-regional-agent>
            <edit-regional-agent ref="editRegionalAgent" @ok="handleUpdate"></edit-regional-agent>
            <reduce-regional-agent ref="reduceRegionalAgent" @ok="handleUpdate"></reduce-regional-agent>
        </div>
    </div>
</template>

<script>
    import moment from 'moment'
    import marketingPlatformApi from '@/api/new_marketing/platform/index'
    import ARow from "ant-design-vue/es/grid/Row";
    import ACol from "ant-design-vue/es/grid/Col";
    import AddRegionalAgent from "./modules/addRegionalAgent";
    import EditRegionalAgent from "./modules/editRegionalAgent";
    import 'ant-design-vue/dist/antd.css'
    import ReduceRegionalAgent from "./modules/reduceRegionalAgent";
    import MarketingAreaTeamList from "./MarketingAreaTeamList";
    import DeleteRegionalAgent from "./modules/deleteRegionalAgent";

    const selectedRows = []
    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'},
        },
        {
            title: '团队数量',
            dataIndex: 'team_nums',
            scopedSlots: {customRender: 'team_nums'},
        },
        {
            dataIndex: 'store_percent',
            align: "center",
            scopedSlots: {
                customRender: 'store_percent',
            },
            slots: {title: 'customName'}
        },
        {
            dataIndex: 'village_percent',
            align: "center",
            scopedSlots: {
                customRender: 'village_percent',
            },
            slots: {title: 'customName1'}
        },
        {
            title: '总团队业绩',
            dataIndex: 'total_performance',
            scopedSlots: {customRender: 'total_performance'},
            align: "center"
        },
        {
            title: '总抽成',
            dataIndex: 'total_percentage',
            scopedSlots: {customRender: 'total_percentage'},
            align: "center"
        },
        {
            title: '区域',
            dataIndex: 'areas',
            scopedSlots: {customRender: 'areas'},
            align: "center"
        },
        {
            title: '添加时间',
            dataIndex: 'add_time',
            scopedSlots: {customRender: 'add_time'},
            align: "center"
        },
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
        },
    ];
    export default {
        name: "regionalAgencyList",
        components: {
            DeleteRegionalAgent,
            MarketingAreaTeamList,
            ReduceRegionalAgent,
            EditRegionalAgent,
            AddRegionalAgent,
            ACol,
            ARow,
        },
        data() {
            return {
                columns,
                selectedRows,
                listDiscountShow: false, // 是否显示批量设置折扣弹窗
                listDiscountShow1: false, // 是否显示批量设置折扣弹窗
                discount_ratio: 10, // 批量设置折扣
                discount_ratio1: 10, // 批量设置折扣
                total_num: 0,
                achievement: 0,
                data: [],
                areaList: [],
                formData: {
                    name: "",
                    uid: 0,
                    province_id: 0,
                    city_id: 0,
                    area_id: 0,
                    start_time: "",
                    end_time: "",
                    put_text: "",
                    check_areaList: [],
                    time: []
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
                    this.getRegionalAgencyList()
                },
            },
        },
        mounted() {
            this.getRegionalAgencyList()
        },
        methods: {
            moment,
            reset() {
                this.formData = {
                    name: "",
                    uid: 0,
                    province_id: 0,
                    city_id: 0,
                    area_id: 0,
                    start_time: "",
                    end_time: "",
                    put_text: "",
                    check_areaList: [],
                    time: []
                }
                this.data = []
                this.$set(this.pagination, 'current', 1)
                this.getRegionalAgencyList()
            },
            cancelHandle(id) {
                if (id == 'store') {
                    this.listDiscountShow = false
                } else {
                    this.listDiscountShow1 = false
                }
            },
            confirmHandle(id) {
                if (id == "store") {
                    this.listDiscountShow = false
                    let arr = []
                    this.selectedRows.map(item => {
                        arr.push({
                            id: item,
                            discount_ratio: this.discount_ratio
                        })
                        return item
                    })
                    if(arr.length==0){
                        this.$message.error('请选择设置项设置！')
                        return false
                    }
                    this.request(marketingPlatformApi.updatePercent, {
                        data: arr,
                        length: this.selectedRows.length,
                        discount_ratio: this.discount_ratio
                    }).then(res => {
                        this.$message.success('设置成功！')
                        this.getRegionalAgencyList()
                    })
                } else {
                    this.listDiscountShow1 = false
                    let arr = []
                    this.selectedRows.map(item => {
                        arr.push({
                            id: item,
                            discount_ratio1: this.discount_ratio1
                        })
                        return item
                    })
                    if(arr.length==0){
                        this.$message.error('请选择设置项设置！')
                        return false
                    }
                    this.request(marketingPlatformApi.updatePercent, {
                        data: arr,
                        length: this.selectedRows.length,
                        discount_ratio1: this.discount_ratio1
                    }).then(res => {
                        this.$message.success('设置成功！')
                        this.getRegionalAgencyList()
                    })
                }
            },
            openWin(id) {
                this.$router.push({path: '/new_marketing/platform/MarketingAreaTeamList', query: {id: id}});
            },
            getRegionalAgencyList() {
                this.selectedRows = [];
                this.total_num = 0
                this.achievement = 0
                this.request(marketingPlatformApi.regionalAgencyList, this.formData).then((res) => {
                    this.data = res.list
                    this.pagination.total = res.count
                    this.areaList = res.areaList
                })
            },
            clikPersent() {
                alert(13123)
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
           /* delData(id) {
                this.$confirm({
                    title: '是否确定移除该区域代理?',
                    centered: true,
                    onOk: () => {
                        this.$refs.delRegionalAgent.delData(id);
                    },
                    onCancel() {
                    },
                })

            },*/
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
        font-size: 18px;
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