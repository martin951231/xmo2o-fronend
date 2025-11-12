<!-- 商家列表 -->
<template>
    <div class="bg-ff wrap">
        <div class="page-title">商家列表</div>

        <div class="content">
            <!-- 筛选条件 -->
            <a-form-model :model="searchForm" layout="inline" :labelCol="{ span: 5 }" :wrapperCol="{ span: 19 }">
                <a-row type="flex" align="middle">
                    <a-col :span="10">
                        <a-form-model-item label="区域">
                            <a-cascader
                                v-model="searchForm.area"
                                :options="areaList"
                                placeholder="请选择省市区"
                                @change="areaChange"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="10">
                        <a-form-model-item label="区域代理">
                            <a-select v-model="searchForm.area_uid" placeholder="请选择区域代理" allowClear>
                                <a-select-option v-for="item in regionalAgentList" :key="item.id" :value="item.id">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="4">
                        <a-button type="primary" class="mr-10" @click="getList(true)">查询</a-button>
                        <a-button @click="resetBtn()">重置</a-button>
                    </a-col>
                </a-row>
                <a-row type="flex">
                    <a-col :span="10">
                        <a-form-model-item label="商家名">
                            <a-input v-model="searchForm.merchant_name" placeholder="请输入商家名称"> </a-input>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="10">
                        <a-form-model-item label="业务员">
                            <a-input v-model="searchForm.user_name" placeholder="请输入姓名"> </a-input>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row type="flex">
                    <a-col :span="10">
                        <a-form-model-item label="注册时间">
                            <a-range-picker
                                :ranges="{
                                    今日: [moment(), moment()],
                                    近7天: [moment(), moment().add(7, 'days')],
                                    近15天: [moment(), moment().add(15, 'days')],
                                    近30天: [moment(), moment().add(30, 'days')],
                                }"
                                :value="time"
                                format="YYYY-MM-DD"
                                @change="onDateRangeChange"
                            >
                                <a-icon slot="suffixIcon" type="calendar" />
                            </a-range-picker>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>

            <!-- 总业绩 -->
            <div class="total-performance" v-if="selectedRowKeys.length">
                <span class=""
                    >已选择<span class="cr-primary">{{ selectedRowKeys.length }}</span
                    >项</span
                >
                <span class="mr-10 ml-10 cr-f1">|</span>
                <span
                    >订单总金额：<span class="fw-bold">{{ totalAchievement }}</span></span
                >
                <a-button type="link" @click="clearOpt()">清空</a-button>
            </div>

            <!-- 表格 -->
            <a-table
                :columns="columns"
                :data-source="list"
                :pagination="pagination"
                rowKey="mer_id"
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                class="mt-20"
            >
                <span slot="store_count_used" slot-scope="text, record">
                    <a-button v-if="text && text != 0" type="link" @click="actionBtn(record, 'storeDetail')">{{
                        text
                    }}</a-button>
                    <span v-else>{{ text }}</span>
                </span>
                <span slot="order" slot-scope="text, record">
                    <a-button type="link" @click="actionBtn(record, 'detail')">查看</a-button>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a-button type="link" @click="actionBtn(record, 'businessTransfer')">业务转移</a-button>
                </span>
            </a-table>
        </div>

        <!-- 弹框 -->
        <a-modal
            :title="modalTitle"
            :visible="modalVisible"
            :maskClosable="false"
            @ok="handleOk"
            @cancel="handleCancel"
            width="40%"
        >
            <a-form-model :model="modalForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
                <a-form-model-item
                    label="选择接手成员"
                    help="转移后此商家后续业务归接手成员服务，且业务提成均属接手成员"
                >
                    <a-cascader
                        v-model="modalForm.manager_uid"
                        :fieldNames="{
                            label: 'name',
                            value: 'id',
                            children: 'lists',
                        }"
                        :options="transferMemberList"
                        placeholder="请选择"
                    />
                </a-form-model-item>
            </a-form-model>
        </a-modal>

        <!-- 已创建的店铺 -->
        <a-drawer
            width="60%"
            :title="drawerTitle"
            placement="right"
            :closable="false"
            :visible="drawerVisible"
            @close="drawerVisible = false"
        >
            <div class="store" v-for="(item, index) in storeList" :key="index">
                <div class="fw-bold fs-16 mb-20">
                    {{ item.name }}店
                    <span class="cr-primary" :class="item.status == 0 ? 'cr-red' : ''"
                        >（{{ item.status_value }}）</span
                    >
                </div>
                <a-row class="mt-10">
                    <a-col :span="8"
                        ><div class="flex">
                            <span class="text-nowrap">店铺名称：</span
                            ><span class="text-wrap flex-1">{{ item.name }}</span>
                        </div></a-col
                    >
                    <a-col :span="8"
                        ><div class="flex">
                            <span class="text-nowrap">店铺类型：</span
                            ><span class="text-wrap flex-1">{{ item.store_type_name }}</span>
                        </div></a-col
                    >
                    <a-col :span="8"
                        ><div class="flex">
                            <span class="text-nowrap">创建时间：</span
                            ><span class="text-wrap flex-1">{{ item.add_time }}</span>
                        </div></a-col
                    >
                </a-row>
                <a-row class="mt-10">
                    <a-col :span="8"
                        ><div class="flex">
                            <span class="text-nowrap">有效时间：</span
                            ><span class="text-wrap flex-1"> {{ item.effect_time }}</span>
                        </div></a-col
                    >
                    <a-col :span="8"
                        ><div class="flex">
                            <span class="text-nowrap">店铺电话：</span
                            ><span class="text-wrap flex-1">{{ item.phone }}</span>
                        </div></a-col
                    >
                    <a-col :span="8"
                        ><div class="flex">
                            <span class="text-nowrap">店铺地址：</span
                            ><span class="text-wrap flex-1">{{ item.address }}</span>
                        </div></a-col
                    >
                </a-row>
            </div>
        </a-drawer>
    </div>
</template>

<script>
import moment from 'moment'
import marketingPlatformApi from '@/api/new_marketing/platform/index'
export default {
    data() {
        return {
            // 区域
            areaList: [],
            // 区域代理列表 查询
            regionalAgentList: [],
            // 筛选条件
            searchForm: {
                merchant_name: '', // 商家名称
                area: [], // 区域
                user_name: '', //
                area_uid: undefined, // 区域代理
                begin_time: '',
                end_time: '',
            },
            // 注册时间
            time: [],
            // 表格相关
            columns: [
                {
                    title: '商家名称',
                    dataIndex: 'merchant_name',
                    align: 'center',
                    width: '12%',
                },
                {
                    title: '业务员',
                    dataIndex: 'user_name',
                    align: 'center',
                    width: '12%',
                },
                {
                    title: '已购买店铺数',
                    dataIndex: 'store_count_buy',
                    align: 'center',
                },
                {
                    title: '已创建店铺',
                    dataIndex: 'store_count_used',
                    scopedSlots: { customRender: 'store_count_used' },
                    align: 'center',
                },
                {
                    title: '过期店铺数',
                    dataIndex: 'store_count_overdue',
                    align: 'center',
                },
                {
                    title: '订单总金额',
                    dataIndex: 'total_money',
                    align: 'center',
                },
                {
                    title: '商家信息订单',
                    dataIndex: 'order',
                    scopedSlots: { customRender: 'order' },
                    align: 'center',
                },
                {
                    title: '注册时间',
                    dataIndex: 'reg_time',
                    align: 'center',
                    sortDirections: ['descend', 'ascend'],
                    sorter: (a, b) => moment(a.reg_time).unix() - moment(b.reg_time).unix(),
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
            totalAchievement: '', // 总业绩
            // 弹框相关
            modalTitle: '',
            modalVisible: false,
            modalType: '', // businessTransfer = 业务转移
            modalForm: {
                manager_uid: undefined,
            },
            currentData: '', // 当前选择的数据
            drawerVisible: false,
            drawerTitle: '商家店铺',
            storeList: [], // 已创建的店铺
            transferMemberList: [], // 业务转移团队业务员
        }
    },
    mounted() {
        this.getAreaList()
        this.getRegionalAgentList()
        this.getList()
    },
    methods: {
        moment,
        // 区域
        getAreaList() {
            this.request(marketingPlatformApi.findArea, {}).then((res) => {
                this.areaList = res || []
            })
        },
        // 获取区域代理列表
        getRegionalAgentList(area = []) {
            this.request(marketingPlatformApi.regionalAgentList, { area }).then((res) => {
                this.regionalAgentList = res || []
                if (this.regionalAgentList.length && this.searchForm.area_uid) {
                    if (!this.regionalAgentList.find((obj) => obj.id == this.searchForm.area_uid)) {
                        this.$set(this.searchForm, 'area_uid', undefined)
                    }
                }
            })
        },
        // 区域change
        areaChange(e) {
            this.getRegionalAgentList(e)
        },
        // 创建时间
        onDateRangeChange(date, dateString) {
            this.$set(this, 'time', [date[0], date[1]])
            this.$set(this.searchForm, 'begin_time', dateString[0])
            this.$set(this.searchForm, 'end_time', dateString[1])
        },
        // 清空
        clearOpt() {
            this.selectedRowKeys = []
            this.totalAchievement = ''
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
            this.request(marketingPlatformApi.getMerchantList, params).then((res) => {
                this.list = res.list || []
                this.pagination.total = res.count
            })
        },
        // 重置
        resetBtn() {
            this.searchForm = this.$options.data().searchForm
            this.createTime = []
            this.getRegionalAgentList()
            this.getList(true)
        },
        // 表格多选 获取总业绩
        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys
            if (this.selectedRowKeys.length) {
                let list = this.list.filter((item) => {
                    if (this.selectedRowKeys.indexOf(item.mer_id) != -1) {
                        return item
                    }
                })
                let totalAchievement = list.reduce(function (prev, cur) {
                    return Number(cur.total_money) + prev
                }, 0)
                this.totalAchievement =
                    totalAchievement > 10000
                        ? (Number(totalAchievement) / 1000).toFixed(2) + '万'
                        : totalAchievement.toFixed(2)
            }
        },
        // storeDetail = 已创建店铺 businessTransfer = 业务转移 detail= 商家信息订单查看
        actionBtn(current, type) {
            if (type == 'detail') {
                // 跳转详情页
                this.$router.push({ path: '/new_marketing/platform/merchantDetail', query: { id: current.mer_id } })
            } else if (type == 'businessTransfer') {
                this.currentData = current
                this.modalType = 'businessTransfer'
                this.modalTitle = '业务转移'
                this.modalVisible = true
                this.teamMemberList()
            } else if (type == 'storeDetail') {
                this.currentData = current
                // 已创建店铺 查看店铺列表
                this.drawerVisible = true
                this.drawerTitle = current.merchant_name + '商家店铺'
                this.getMerchantStoreList()
            }
        },
        // modal 确认
        handleOk() {
            if (this.modalType == 'businessTransfer') {
                // 业务转移
                this.businessTransfer()
            }
        },
        // modal 取消
        handleCancel() {
            this.modalVisible = false
            this.modalTitle = ''
            this.modalType = ''
            this.currentData = ''
            this.modalForm = this.$options.data().modalForm
        },
        // 业务转移
        businessTransfer() {
            if (!this.modalForm.manager_uid.length) {
                this.$message.error('请选择接手成员')
                return
            }
            let params = {
                id: this.currentData.id,
                team_id: this.modalForm.manager_uid[0],
                per_id: this.modalForm.manager_uid[1],
            }
            this.request(marketingPlatformApi.teamManagementMerchantTransferCreate, params).then((res) => {
                this.$message.success('业务转移成功')
                this.getList(true)
                if (this.modalVisible) {
                    this.handleCancel()
                }
            })
        },
        // 业务转移团队业务员
        teamMemberList() {
            this.request(marketingPlatformApi.teamManagementMerchantTransferList, {}).then((res) => {
                if (res && res.length) {
                    res = res.map((item) => {
                        if (!item.lists || (item.lists && !item.lists.length)) {
                            item.disabled = true
                        }
                        // 过滤当前业务员
                        if (item.lists && item.lists.length) {
                            item.lists = item.lists.filter((subItem) => {
                                let person_id = this.currentData.person_id
                                if (subItem.id != person_id) {
                                    return subItem
                                }
                            })
                        }
                        return item
                    })
                    this.transferMemberList = res
                }
            })
        },
        // 已创建店铺
        getMerchantStoreList() {
            let params = {
                merId: this.currentData.mer_id,
            }
            this.request(marketingPlatformApi.getMerchantStoreList, params).then((res) => {
                if (res && res.length) {
                    this.storeList = res
                }
            })
        },
    },
}
</script>

<style lang="less" scoped>
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
    .text-wrap {
        white-space: pre-wrap;
        word-break: break-all;
        word-wrap: break-word;
    }
    .text-nowrap {
        white-space: nowrap;
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
.store {
    margin-bottom: 20px;
    padding: 20px 0;
    border-bottom: 1px solid #f1f1f1;
}
.store:last-child {
    border-bottom: none;
}
</style>
