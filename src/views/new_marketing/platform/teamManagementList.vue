<template>
    <div class="bg-ff wrap">
        <div class="page-title">团队列表</div>

        <div class="content">
            <!-- 筛选条件 -->
            <a-form-model :model="searchForm" layout="inline" :labelCol="{ span: 5 }" :wrapperCol="{ span: 19 }">
                <a-row type="flex" align="middle">
                    <a-col :span="10">
                        <a-form-model-item>
                            <a-input-group>
                                <a-select v-model="searchForm.type" placeholder="请选择">
                                    <a-select-option value="1"> 团队名称 </a-select-option>
                                    <a-select-option value="2"> 业务经理姓名 </a-select-option>
                                </a-select>
                                <span>：</span>
                                <a-input
                                    v-model="searchForm.name"
                                    :placeholder="searchForm.type == '1' ? '请输入团队名称' : '请输入业务经理姓名'"
                                />
                            </a-input-group>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="10">
                        <a-form-model-item label="区域">
                            <a-cascader
                                v-model="searchForm.area"
                                :options="areaList"
                                placeholder="请选择省市区"
                                @change="handleChange($event, 'search', 'area')"
                            />
                        </a-form-model-item>
                    </a-col>

                    <a-col :span="4">
                        <a-button type="primary" class="mr-10" @click="getList(true)">查询</a-button>
                        <a-button @click="resetBtn()">重置</a-button>
                    </a-col>
                </a-row>
                <a-row type="flex">
                    <a-col :span="10">
                        <a-form-model-item label="区域代理">
                            <a-select v-model="searchForm.area_uid" placeholder="请选择区域代理" allowClear>
                                <a-select-option
                                    v-for="item in regionalAgentListSearch"
                                    :key="item.id"
                                    :value="item.id"
                                >
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="10">
                        <a-form-model-item label="创建时间">
                            <a-range-picker
                                :ranges="{
                                    今日: [moment(), moment()],
                                    近7天: [moment(), moment().add(7, 'days')],
                                    近15天: [moment(), moment().add(15, 'days')],
                                    近30天: [moment(), moment().add(30, 'days')],
                                }"
                                :value="createTime"
                                format="YYYY-MM-DD"
                                @change="onDateRangeChange"
                            >
                                <a-icon slot="suffixIcon" type="calendar" />
                            </a-range-picker>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>

            <!-- 创建团队 -->
            <a-row class="mt-20">
                <a-col>
                    <a-button type="primary" @click="addTeamBtn()">创建团队</a-button>
                </a-col>
            </a-row>

            <!-- 总业绩 -->
            <div class="total-performance" v-if="selectedRowKeys.length">
                <span class=""
                    >已选择<span class="cr-primary">{{ selectedRowKeys.length }}</span
                    >项</span
                >
                <span class="mr-10 ml-10 cr-f1">|</span>
                <span
                    >总业绩：<span class="fw-bold">{{ totalAchievement }}</span></span
                >
                <a-button type="link" @click="clearOpt()">清空</a-button>
            </div>

            <!-- 表格 -->
            <a-table
                :columns="columns"
                :data-source="list"
                :pagination="pagination"
                rowKey="id"
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                class="mt-20"
            >
                <span slot="team_count" slot-scope="text">
                    {{ text || '0' }}
                </span>
                <span slot="team_artisan" slot-scope="text">
                    {{ text || '-' }}
                </span>
                <span slot="area_name" slot-scope="text">
                    {{ text || '-' }}
                </span>
                <span slot="action" slot-scope="text, record">
                    <a-button type="link" @click="actionBtn(record, 'edit')">编辑详情</a-button>
                    <a-button type="link" @click="actionBtn(record, 'del')">解散</a-button>
                </span>
            </a-table>
        </div>

        <!-- 弹框 -->
        <a-modal
            :title="modalTitle"
            :visible="modalVisible"
            :maskClosable="false"
            :okText="modalType == 'addTeam' ? '提交' : modalType == 'delTeam' ? '解除' : '确定'"
            @ok="handleOk"
            @cancel="handleCancel"
            width="50%"
            :bodyStyle="{ maxHeight: '600px', overflowY: 'auto' }"
        >
            <!-- 创建团队 -->
            <div v-if="modalType == 'addTeam'">
                <a-form-model
                    :model="addTeamForm"
                    :label-col="{ span: 6 }"
                    :wrapper-col="{ span: 14 }"
                    :rules="rules"
                    ref="addTeamForm"
                >
                    <a-form-model-item label="团队名称" prop="name">
                        <a-input v-model="addTeamForm.name" placeholder="请输入名称" />
                    </a-form-model-item>
                    <a-form-model-item label="选择区域代理">
                        <a-row type="flex">
                            <a-col :span="16">
                                <a-cascader
                                    v-model="addTeamForm.area"
                                    :options="areaList"
                                    placeholder="请选择省市区"
                                    @change="handleChange($event, 'addTeam', 'area')"
                                />
                            </a-col>
                            <a-col :span="7" :offset="1">
                                <a-select
                                    v-model="addTeamForm.area_uid"
                                    placeholder="区域代理"
                                    @change="handleChange($event, 'addTeam', 'area_uid')"
                                    allowClear
                                >
                                    <a-select-option
                                        v-for="item in regionalAgentListAddTeam"
                                        :key="item.id"
                                        :value="item.id"
                                    >
                                        {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-col>
                        </a-row>
                    </a-form-model-item>
                    <a-form-model-item label="选择业务经理" prop="manager_uid">
                        <a-select v-model="addTeamForm.manager_uid" placeholder="请选择业务经理">
                            <a-select-option v-for="item in serviceManagerNoList" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-divider />
                    <div class="fs-16 fw-bold mb-10">店铺业务设置</div>
                    <a-form-model-item
                        label="业务经理抽成比例"
                        prop="manager_percent"
                        help="业务经理按团队总业绩进行抽取分成"
                    >
                        <a-input-number
                            v-model="addTeamForm.manager_percent"
                            :min="0"
                            :max="100"
                            placeholder="请输入"
                        /><span class="ml-10">%</span>
                    </a-form-model-item>
                    <a-form-model-item label="业务员提成比例" prop="personnel_percent" help="团队业务员默认提成比例">
                        <a-input-number
                            v-model="addTeamForm.personnel_percent"
                            :min="0"
                            :max="100"
                            placeholder="请输入"
                        /><span class="ml-10">%</span>
                    </a-form-model-item>
                    <a-form-model-item label="绑定技术人员">
                        <a-select
                            mode="multiple"
                            v-model="addTeamForm.artisan"
                            style="width: 100%"
                            placeholder="请选择技术人员"
                        >
                            <a-select-option v-for="item in artisanList" :key="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="技术人员提成比例">
                        <a-input-number
                            v-model="addTeamForm.technology_percent"
                            :min="0"
                            :max="100"
                            placeholder="请输入"
                        /><span class="ml-10">%</span>
                    </a-form-model-item>
                    <a-divider />
                    <div class="fs-16 fw-bold mb-10">社区业务设置</div>
                    <a-form-model-item
                        label="业务经理抽成比例"
                        prop="village_manager_percent"
                        help="业务经理按团队总业绩进行抽取分成"
                    >
                        <a-input-number
                            v-model="addTeamForm.village_manager_percent"
                            :min="0"
                            :max="100"
                            placeholder="请输入"
                        /><span class="ml-10">%</span>
                    </a-form-model-item>
                    <a-form-model-item
                        label="业务员提成比例"
                        prop="village_personnel_percent"
                        help="团队业务员默认提成比例"
                    >
                        <a-input-number
                            v-model="addTeamForm.village_personnel_percent"
                            :min="0"
                            :max="100"
                            placeholder="请输入"
                        /><span class="ml-10">%</span>
                    </a-form-model-item>
                </a-form-model>
            </div>

            <!-- 解散团队 -->
            <div v-if="modalType == 'delTeam'">
                <div class="ant-form-explain">该团队下已有成员，不可直接解散，需为成员选择新团队</div>
                <a-row type="flex" class="mt-10 align-center">
                    <a-col :span="3" class="flex align-center">选择团队：</a-col>
                    <a-col :span="12">
                        <a-select v-model="teamId" placeholder="请选择" @popupScroll="popupScroll" style="width: 100%">
                            <a-select-option v-for="item in teamList" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-col>
                </a-row>
            </div>
        </a-modal>
    </div>
</template>


<script>
import moment from 'moment'
import marketingPlatformApi from '@/api/new_marketing/platform/index'

let teamListPage = 1
export default {
    data() {
        return {
            // 区域
            areaList: [],
            // 业务经理
            serviceManagerList: [],
            // 区域代理列表 查询
            regionalAgentListSearch: [],
            // 区域代理列表 添加团队
            regionalAgentListAddTeam: [],
            // 技术人员列表
            artisanList: [],
            // 未绑定团队的业务经理 创建团队时需要
            serviceManagerNoList: [],
            // 筛选条件
            createTime: [], // 创建时间
            searchForm: {
                type: '1', // 1 团队名称 2 业务经理姓名
                area: [], // 区域
                name: '', //
                area_uid: undefined, // 区域代理
                begin_time: '',
                end_time: '',
            },
            // 表格相关
            columns: [
                {
                    title: '团队名称',
                    dataIndex: 'name',
                    align: 'center',
                    width: '12%',
                },
                {
                    title: '团队人数',
                    dataIndex: 'team_count',
                    scopedSlots: { customRender: 'team_count' },
                    align: 'center',
                },
                {
                    title: '业务经理',
                    dataIndex: 'manager_name',
                    align: 'center',
                    width: '12%',
                },
                {
                    title: '技术人员',
                    dataIndex: 'team_artisan',
                    scopedSlots: { customRender: 'team_artisan' },
                    align: 'center',
                    width: '12%',
                },
                {
                    title: '区域代理',
                    dataIndex: 'area_name',
                    scopedSlots: { customRender: 'area_name' },
                    align: 'center',
                    width: '12%',
                },
                {
                    title: '创建时间',
                    dataIndex: 'add_time',
                    align: 'center',
                    sortDirections: ['descend', 'ascend'],
                    sorter: (a, b) => moment(a.add_time).unix() - moment(b.add_time).unix(),
                },
                {
                    title: '团队总业绩',
                    dataIndex: 'achievement',
                    sortDirections: ['descend', 'ascend'],
                    sorter: (a, b) => Number(a.achievement) - Number(b.achievement),
                    align: 'center',
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                    align: 'center',
                },
            ],
            list: [],
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
            selectedRowKeys: [],
            // 弹框相关
            modalTitle: '',
            modalVisible: false,
            modalType: '', // addTeam = 创建团队 delTeam = 解散团队
            // 创建团队
            addTeamForm: {
                name: '', // 团队名称
                area: [],
                area_uid: undefined, // 区域代理
                manager_uid: undefined, // 业务经理
                manager_percent: '', // 业务经理抽成比例
                personnel_percent: '', // 业务员提成比例
                artisan: [], // 绑定技术人员
                technology_percent: '', // 技术人员提成比例
                village_manager_percent: '', // 社区业务经理抽成比例
                village_personnel_percent: '', // 社区业务员提成比例
            },
            rules: {
                name: [{ required: true, message: '请输入团队名称', trigger: 'blur' }],
                manager_uid: [{ required: true, message: '请选择业务经理', trigger: 'blur' }],
                manager_percent: [{ required: true, message: '请输入店铺业务经理抽成比例', trigger: 'blur' }],
                personnel_percent: [{ required: true, message: '请输入店铺业务员提成比例', trigger: 'blur' }],
                village_manager_percent: [{ required: true, message: '请输入社区业务经理抽成比例', trigger: 'blur' }],
                village_personnel_percent: [{ required: true, message: '请输入社区业务员提成比例', trigger: 'blur' }],
            },
            currentData: '', // 当前选择的数据
            teamId: undefined, // 选择团队 团队id
            totalAchievement: '', // 总业绩
            teamList: [], // 解散团队选择团队
        }
    },
    mounted() {
        this.getOptionsList()
        this.getList()
    },
    activated() {
        let updateTeamManageList = localStorage.getItem('updateTeamManageList') || ''
        if (updateTeamManageList) {
            localStorage.removeItem('updateTeamManageList')
            this.getList()
        }
    },
    methods: {
        moment,
        // 创建时间
        onDateRangeChange(date, dateString) {
            this.$set(this, 'createTime', [date[0], date[1]])
            this.$set(this.searchForm, 'begin_time', dateString[0])
            this.$set(this.searchForm, 'end_time', dateString[1])
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getList()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.getList()
        },
        // 获取业务经理列表  区域代理列表 技术人员 区域
        getOptionsList() {
            // 业务经理列表
            this.request(marketingPlatformApi.serviceManagerList, {}).then((res) => {
                this.serviceManagerList = res || []
            })

            // 区域代理列表
            this.getRegionalAgentList()

            // 技术人员
            this.request(marketingPlatformApi.artisanList, {}).then((res) => {
                this.artisanList = res || []
            })
            // 区域
            this.request(marketingPlatformApi.findArea, {}).then((res) => {
                this.areaList = res || []
            })
            // 业务经理列表 未绑定团队
            this.getServiceManagerNoList()
        },
        // 获取区域代理列表 type = search 筛选条件  addTeam 添加团队
        getRegionalAgentList(area = [], type = '') {
            this.request(marketingPlatformApi.regionalAgentList, { area }).then((res) => {
                if (type == 'search') {
                    this.regionalAgentListSearch = res || []
                    // 校验当前选择的区域代理是否在此区域下，不在则searchForm.area_uid = undefined,需要重新选择
                    if (this.regionalAgentListSearch.length) {
                        if (!this.regionalAgentListSearch.find((obj) => obj.id == this.searchForm.area_uid)) {
                            this.$set(this.searchForm, 'area_uid', undefined)
                        }
                    }
                } else if (type == 'addTeam') {
                    this.regionalAgentListAddTeam = res || []
                    // 校验当前选择的区域代理是否在此区域下，不在则addTeamForm.area_uid = undefined
                    if (this.regionalAgentListAddTeam.length) {
                        if (!this.regionalAgentListAddTeam.find((obj) => obj.id == this.addTeamForm.area_uid)) {
                            this.$set(this.addTeamForm, 'area_uid', undefined)
                        }
                    }
                } else {
                    this.regionalAgentListSearch = res || []
                    this.regionalAgentListAddTeam = res || []
                }
            })
        },
        // 业务经理列表 未绑定团队
        getServiceManagerNoList(area_uid = '') {
            this.request(marketingPlatformApi.serviceManagerNoList, { area_uid }).then((res) => {
                this.serviceManagerNoList = res || []
                if (this.serviceManagerNoList.length) {
                    if (!this.serviceManagerNoList.find((obj) => obj.id == this.addTeamForm.manager_uid)) {
                        this.$set(this.addTeamForm, 'manager_uid', undefined)
                    }
                }
            })
        },
        /* 筛选条件 区域 || 区域代理 change  参数 type && field
         type = search 筛选 addTeam 添加团队
         field = area = 区域 area_uid = 区域代理 */
        handleChange(e, type, field) {
            let value = e
            if (field == 'area') {
                // 筛选条件根据区域筛选区域代理
                this.getRegionalAgentList(value, type)
            } else if (type == 'addTeam' && field == 'area_uid') {
                // 添加团队 区域代理筛选业务经理
                this.getServiceManagerNoList(value)
            }
        },
        // 获取list
        getList(update = false) {
            if (update) {
                this.$set(this.pagination, 'current', 1)
                this.$set(this.pagination, 'pageSize', 10)
            }
            let params = {
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
                ...this.searchForm,
            }
            params.area_uid = params.area_uid || ''
            this.request(marketingPlatformApi.teamManagementList, params).then((res) => {
                this.list = res.list || []
                this.pagination.total = res.count
            })
        },
        // 重置
        resetBtn() {
            this.searchForm = this.$options.data().searchForm
            this.createTime = []
            // 区域代理
            this.getRegionalAgentList()
            this.getList(true)
        },
        // 表格多选 获取总业绩
        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys
            if (this.selectedRowKeys.length) {
                this.request(marketingPlatformApi.teamPerformance, { id: this.selectedRowKeys }).then((res) => {
                    if (res.total_achievement) {
                        res.total_achievement =
                            Number(res.total_achievement) > 10000
                                ? (Number(res.total_achievement) / 1000).toFixed(2) + '万'
                                : res.total_achievement.toFixed(2)
                    }
                    this.totalAchievement = res.total_achievement || '0'
                })
            }
        },
        // edit = 编辑详情 del = 解散团队
        actionBtn(current, type) {
            if (type == 'edit') {
                // 跳转详情页
                this.$router.push({ path: '/new_marketing/platform/teamDetail', query: { id: current.id } })
            } else if (type == 'del') {
                this.currentData = current
                this.modalType = 'delTeam'
                this.modalTitle = '解散团队'
                this.modalVisible = true
                teamListPage = 1
                this.getTeamList()
            }
        },
        // 清空
        clearOpt() {
            this.selectedRowKeys = []
            this.totalAchievement = ''
        },
        // 创建团队
        addTeamBtn() {
            this.modalTitle = '创建团队'
            this.modalType = 'addTeam'
            this.addTeamForm = this.$options.data().addTeamForm
            // 区域代理
            this.getRegionalAgentList(this.addTeamForm.area, 'addTeam')
            // 业务经理
            this.getServiceManagerNoList()
            this.modalVisible = true
        },
        // modal 确认
        handleOk() {
            if (this.modalType == 'addTeam') {
                this.addTeam()
            } else if (this.modalType == 'delTeam') {
                this.delTeam(this.currentData)
            }
        },
        // modal 取消
        handleCancel() {
            // 移除表单校验结果
            if (this.modalType == 'addTeam') {
                this.$refs.addTeamForm.clearValidate()
            }
            this.modalVisible = false
            this.modalTitle = ''
            this.modalType = ''
            this.currentData = ''
            this.teamId = undefined
            this.teamList = []
        },
        // 创建团队
        addTeam() {
            this.$refs.addTeamForm.validate((valid) => {
                if (valid) {
                    console.log('校验通过')
                    let params = {
                        ...this.addTeamForm,
                        area_uid: this.addTeamForm.area_uid || '',
                        manager_uid: this.addTeamForm.manager_uid || '',
                    }
                    this.request(marketingPlatformApi.teamManagementAdd, params).then((res) => {
                        this.$message.success('创建团队成功')
                        if (this.modalVisible) {
                            this.handleCancel()
                        }
                        this.resetBtn()
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 获取团队列表 用户解散团队选择团队
        getTeamList() {
            let params = {
                name: '',
                area: [],
                manager_uid: '',
                area_uid: '',
                begin_time: '',
                end_time: '',
                page: teamListPage,
                pageSize: 10,
            }
            this.request(marketingPlatformApi.teamManagementList, params).then((res) => {
                let list = this.teamList.concat(res.list) || []
                // 过滤掉当前团队
                this.teamList = list.filter((item) => item.id != this.currentData.id)
            })
        },
        // 解散团队 选择团队下拉框
        popupScroll() {
            if (this.teamList.length < Number(this.pagination.total)) {
                teamListPage++
                this.getTeamList()
            }
        },
        // 解散团队
        delTeam() {
            if (this.currentData.team_count && this.currentData.team_count != 0 && !this.teamId) {
                this.$message.error('请选择新团队')
                return
            }
            this.$confirm({
                title: '你确定要解散该团队吗?',
                icon: (h) => {
                    return h('a-icon', {
                        props: {
                            type: 'close-circle',
                            theme: 'filled',
                        },
                        style: {
                            color: '#f50f50',
                        },
                    })
                },
                onOk: () => {
                    let params = {
                        id: this.currentData.id,
                        team_id: this.teamId || '',
                    }
                    this.request(marketingPlatformApi.teamManagementDiss, params).then((res) => {
                        this.$message.success('解散团队成功')
                        if (this.modalVisible) {
                            this.handleCancel()
                        }
                        this.getList(true)
                    })
                },
            })
        },
    },
}
</script>


<style scoped lang="less">
.wrap {
    width: 100%;
    min-height: 100%;
    .page-title {
        padding: 20px 30px;
        border-bottom: 1px solid #f1f1f1;
        font-size: 18px;
        font-weight: bold;
        color: #000000;
    }

    .content {
        margin: 20px 30px;
        .ant-row-flex {
            margin-bottom: 18px;
        }
        /deep/ .ant-form-item {
            display: flex;
            align-items: center;
            /deep/ .ant-form-item-control-wrapper {
                padding-right: 100px;
                flex: 1;
                box-sizing: border-box;
                /deep/ .ant-form-item-children {
                    width: 100%;
                    display: inline-block;
                    .ant-calendar-picker {
                        width: 100%;
                    }
                }
            }
        }
        /deep/ .ant-input-group {
            display: flex;
            align-items: center;
            .ant-select {
                min-width: 116px;
            }
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
            .cr-f1 {
                color: #f1f1f1;
            }
        }
    }
}
</style>
