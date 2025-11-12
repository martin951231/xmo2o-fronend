<template>
    <div class="bg-ff wrap">
        <div class="page-title"><a style="color: grey" @click="backfnc()">区域代理</a>/<a>团队代理</a></div>
        <div class="content">
       <!-- <div class="dateinfo_container">
            <button class="default" @click="backfnc()" style="margin-bottom: 20px;">返回</button>
        </div>-->
        <!--<a-layout>
            <a-layout style="padding: 0px; background: #fff">-->
                <div style="width: 100%;border: 1px solid lightblue;background-color: #E6F7FF;height: 40px;line-height: 40px;padding-left: 15px;">
                    已选择{{total_num}}项 团队总业绩: {{achievement}} <a class="label-sm blue" @click="reset()">清空</a>
                </div>
                <!--<a-layout-content :style="{ margin: '0px', padding: '0px', background: '#fff', minHeight: '100px' }">-->
                    <a-table :columns="columns"
                             :data-source="data"
                             rowKey="id"
                             :row-selection="{ selectedRowKeys: selectedRows, onChange: onSelectChange }"
                             @change="handleTableChange">
                        <span slot="customName"> 代理抽成比例 <a-icon type="smile-o" style="color: #ff6b81"
                                                                @click="clikPersent"/></span>
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
                                  <a-menu-item @click="delData(record.id)">
                                    移除
                                  </a-menu-item>
                                </a-menu>
                              </a-dropdown>
                            </span>
                    </a-table>
           <!--     </a-layout-content>
            </a-layout>
        </a-layout>-->
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

    const selectedRows = []
    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'},
        },
        {
            title: '团队人数',
            dataIndex: 'team_nums',
            scopedSlots: {customRender: 'team_nums'},
        },
        {
            title: '业务经理',
            dataIndex: 'manager_name',
            slots: {customRender: 'manager_name'}
        },
        {
            title: '技术人员',
            dataIndex: 'tec_name',
            scopedSlots: {customRender: 'tec_name'},
            align: "center"
        },
        {
            title: '创建时间',
            dataIndex: 'add_time',
            scopedSlots: {customRender: 'add_time'},
            align: "center"
        },
        {
            title: '团队总业绩',
            dataIndex: 'total_performance',
            scopedSlots: {customRender: 'total_performance'},
            align: "center"
        },
    ];
    export default {
        name: "MarketingAreaTeamList",
        components: {
            ReduceRegionalAgent,
            EditRegionalAgent,
            AddRegionalAgent,
            ACol,
            ARow,
        },
        data() {
            return {
                total_num: 0,
                achievement: 0,
                visible: false,
                columns,
                selectedRows,
                data: [],
                areaList: [],
                formData: {
                    id: 0
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
            }
        },
        activated() {
            this.formData.id = this.$route.query.id
            this.getRegionalAgencyList()
        },
       /* watch: {
            '$route.query.id'(val) {
                if (val) {
                    this.formData.id = val
                    this.getRegionalAgencyList()
                }
            },
        },*/
        methods: {
            moment,
            reset() {
                this.data = []
                this.getRegionalAgencyList()
            },
            getRegionalAgencyList() {
                this.total_num = 0
                this.achievement = 0
                this.selectedRows = [];
                this.request(marketingPlatformApi.getTeamList1, this.formData).then((res) => {
                    this.data = res
                })
            },
            backfnc() {
                this.$router.replace('/new_marketing/platform/regionalAgencyList')
            },
            clikPersent() {
                alert(13123)
            },
            handleUpdate() {
                this.getRegionalAgencyList()
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
            delData(id) {
                this.$confirm({
                    title: '是否确定移除该区域代理?',
                    centered: true,
                    onOk: () => {
                        this.request(marketingPlatformApi.delRegionalAgency, {
                            id: id
                        }).then((res) => {
                            this.$set(this.pagination, 'current', 1)
                            this.getRegionalAgencyList()
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