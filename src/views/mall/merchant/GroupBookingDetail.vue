<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <!-- 搜索栏 -->
        <a-form-model layout="inline" :model="searchForm">
            <a-form-model-item label>
                <a-select v-model="searchForm.search_type" placeholder="请选择" style="width: 100px">
                    <a-select-option value="username">团长名称</a-select-option>
                    <a-select-option value="orderno">订单号</a-select-option>
                </a-select>
                <a-input v-model="searchForm.keywords" placeholder="请输入" style="width: 160px" />
            </a-form-model-item>
            <a-form-model-item label="拼团状态">
                <a-select v-model="searchForm.status" placeholder="请选择拼团状态" style="width: 100px">
                    <a-select-option :value="-1">全部拼团</a-select-option>
                    <a-select-option :value="0">拼团中</a-select-option>
                    <a-select-option :value="1">已成团</a-select-option>
                    <a-select-option :value="2">已解散</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="拼团时间">
                <a-range-picker
                    :ranges="{
                        今日: [moment(), moment()],
                        近7天: [moment(), moment().add(7, 'days')],
                        近15天: [moment(), moment().add(15, 'days')],
                        近30天: [moment(), moment().add(30, 'days')],
                    }"
                    :value="searchForm.time"
                    format="YYYY-MM-DD"
                    @change="onDateRangeChange"
                    :getCalendarContainer="
                        (triggerNode) => {
                            return triggerNode.parentNode
                        }
                    "
                />
            </a-form-model-item>
        </a-form-model>
        <div class="mt-20">
            <a-button type="primary" @click="submitForm()">查询</a-button>
            <a-button @click="resetForm()" class="ml-20">重置</a-button>
        </div>
        <!-- 数据列表 -->
        <a-table class="mt-20" rowKey="id" :columns="columns" :data-source="dataList" :pagination="pagination">
            <span slot="money" slot-scope="text, record">{{ record.money }}</span>
            <span slot="moneyScoreTitle">
                当前拼团总金额
                <a-tooltip trigger="hover">
                    <template slot="title">当前订单总金额</template>
                    <a-icon class="ml-10" type="question-circle" />
                </a-tooltip>
            </span>
            <!-- 商品信息 -->
            <span slot="nickname" slot-scope="text, record" class="flex align-center">
                <beautiful-image :src="record.avatar" width="50px" height="50px" shape visible hover viewerStyle="2" />
                <span class="ml-10">{{ record.nickname }}</span>
            </span>
            <!-- 活动时间 -->
            <span slot="activityTime" slot-scope="text, record">{{ text }} ~ {{ record.end_time }}</span>
            <!-- 状态 -->
            <span slot="status" slot-scope="text">
                <a-badge v-if="text == 0" status="success" text="进行中" />
                <a-badge v-if="text == 1" status="default" text="已成团" />
                <a-badge v-if="text == 2" status="warning" text="已解散" />
            </span>
            <!-- 操作栏 -->
            <span slot="action" slot-scope="text, record">
                <a v-if="record.status == 0" @click="simulateRobotClustering(record)">{{L('模拟机器人成团')}}</a>
                <span v-if="record.status == 0" class="ml-10 mr-10">|</span>
                <a @click="viewTeamMembers(record)">{{L('查看拼团成员')}}</a>
            </span>
        </a-table>

        <!-- 查看绑定团购 -->
        <a-drawer
            title="拼团成员"
            width="40%"
            :visible="teamMemberVisible"
            :body-style="{ paddingBottom: '80px' }"
            @close="hideTeamMembers"
        >
            <a-table class="mt-20" rowKey="id" :columns="teamMemberColumns" :data-source="teamMemberList" :pagination="teamMemberPagination">
                <!-- 操作栏 -->
                <span slot="action" slot-scope="text, record">
                    <a @click="viewOrder(record)" v-if="record.type == 0">{{L('查看订单')}}</a>
                </span>
            </a-table>
        </a-drawer>

        
    </div>
</template>
<script>
import moment from 'moment'
import mallMerchantApi from '@/api/mall/merchant/index'
import BeautifulImage from '@/components/BeautifulImage/BeautifulImage'
export default {
    name: 'GroupBookingDetail',
    components: { BeautifulImage },
    data() {
        return {
            active_id: '', // 活动id
            //   搜索框表单
            searchForm: {
                keywords: '', // 团长名称
                time: [],
                start_date: '', // 活动开始时间
                end_date: '', // 活动结束时间
                status: -1, // -1：全部，0-进行中，1-已完成，2-已解散
                search_type: 'username',
            },
            //   table表格头部
            columns: [
                {
                    title: '团长信息',
                    dataIndex: 'nickname',
                    key: 'nickname',
                    scopedSlots: { customRender: 'nickname' },
                },
                {
                    title: '订单号',
                    dataIndex: 'order_no',
                    key: 'order_no',
                },
                {
                    title: '拼团时间',
                    dataIndex: 'start_time',
                    key: 'start_time',
                    scopedSlots: { customRender: 'activityTime' },
                },
                {
                    title: '拼团人数',
                    dataIndex: 'complete_num',
                    key: 'complete_num',
                },
                {
                    title: '剩余人数',
                    dataIndex: 'left_num',
                    key: 'left_num',
                },
                {
                    dataIndex: 'money',
                    key: 'money',
                    slots: { title: 'moneyScoreTitle' },
                    scopedSlots: { customRender: 'money' },
                },
                {
                    title: '拼团状态',
                    dataIndex: 'status',
                    key: 'status',
                    scopedSlots: { customRender: 'status' },
                },
                {
                    title: '操作',
                    dataIndex: 'id',
                    key: 'id',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            teamMemberColumns: [
                {
                    title: '用户昵称',
                    dataIndex: 'user_name',
                    key: 'user_name',
                },
                {
                    title: '手机',
                    dataIndex: 'phone',
                    key: 'phone',
                },
                {
                    title: '参团时间',
                    dataIndex: 'add_time',
                    key: 'add_time',
                },
                {
                    title: '团员身份',
                    dataIndex: 'member_txt',
                    key: 'member_txt',
                },
                {
                    title: '操作',
                    dataIndex: 'id',
                    key: 'id',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            //   列表数据
            dataList: [],
            teamMemberList: [],
            dataItem: '',
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
            teamMemberPagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            teamMemberVisible: false,
        }
    },
    created() {
        this.active_id = this.$route.query.active_id
        this.getDataList({ active_id: this.active_id })
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    methods: {
        moment,
        // 获取table数据
        getDataList(params) {
            for (let k in this.searchForm) {
                if (k != 'time') {
                    params[k] = this.searchForm[k]
                }
            }
            params.page = this.pagination.current
            params.pageSize = this.pagination.pageSize
            this.request(mallMerchantApi.getGroupOrderList, params).then((res) => {
                this.dataList = res.data
                this.$set(this.pagination, 'total', res.total)
            })
        },
        // 监听日期选择变化
        onDateRangeChange(date, dateString) {
            // 更新搜索框表单数据
            this.$set(this.searchForm, 'time', [date[0], date[1]])
            this.$set(this.searchForm, 'start_date', dateString[0])
            this.$set(this.searchForm, 'end_date', dateString[1])
        },
        // 提交搜索表单
        submitForm() {
            let params = { active_id: this.active_id, ...this.searchForm }
            delete params.time
            this.getDataList(params)
        },
        // 页码变化
        onPageChange(page, pageSize) {
            if (this.teamMemberVisible) {
                this.$set(this.teamMemberPagination, 'current', page)
                this.getTeamMembers()
                return
            }
            this.$set(this.pagination, 'current', page)
            this.submitForm()
        },
        onPageSizeChange(page, pageSize) {
            if (this.teamMemberVisible) {
                this.$set(this.teamMemberPagination, 'pageSize', pageSize)
                this.getTeamMembers()
                return
            }
            this.$set(this.pagination, 'pageSize', pageSize)
            this.submitForm()
        },
        // 重置表单
        resetForm() {
            this.$set(this, 'searchForm', {
                keywords: '', // 团长名称
                time: [],
                start_date: '', // 活动开始时间
                end_date: '', // 活动结束时间
                status: -1, // -1：全部，0-进行中，1-已完成，2-已解散
                search_type: 'username',
            })
            this.$set(this.pagination, 'current', 1)
            this.getDataList({ active_id: this.active_id })
        },
        // 模拟机器人成团
        simulateRobotClustering(item) {
            this.$confirm({
                title: '确定模拟机器人成团吗?',
                centered: true,
                onOk: () => {
                    this.request(mallMerchantApi.joinRobot, { id: item.id }).then((res) => {
                        this.$message.success('操作成功！')
                        this.submitForm()
                    })
                },
                onCancel() {},
            })
        },
        //获取团成员列表
        getTeamMembers() {
            let params = {
                page: this.teamMemberPagination.current,
                pageSize: this.teamMemberPagination.pageSize,
                id: this.dataItem.id,
            }
            this.request(mallMerchantApi.getTeamUser, params).then((res) => {
                this.teamMemberList = res
                this.teamMemberVisible = true
            })
        },
        //查看团人员
        viewTeamMembers(item) {
            this.dataItem = item
            this.teamMemberPagination.current = 1
            this.getTeamMembers()
        },
        //隐藏团成员
        hideTeamMembers(){
            this.teamMemberVisible = !this.teamMemberVisible;
        },
        //查看订单
        viewOrder(item) {
            let { order_id = '', periodic_order_id = '', order_type, refund_id = '' } = item
            let query = {
                order_id: order_id,
            }
            if (periodic_order_id && order_type == 'periodic') {
                query.periodic_order_id = periodic_order_id
            }
            if (refund_id) {
                query.refund_id = refund_id
            }

            let routeData = this.$router.resolve({ path: '/merchant/merchant.mall/orderDetail', query })
            window.open(routeData.href, '_blank')
        },
    },
}
</script>
<style scoped lang="less"></style>
