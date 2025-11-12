<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <!-- 搜索栏 -->
        <a-form-model layout="inline" :model="searchForm">
            <a-form-model-item label="活动名称">
                <a-input v-model="searchForm.name" placeholder="请输入活动名称" />
            </a-form-model-item>
            <a-form-model-item label="活动状态">
                <a-select v-model="searchForm.status" placeholder="请选择活动状态" style="width: 100px">
                    <a-select-option :value="3"> 全部活动 </a-select-option>
                    <a-select-option value="0"> 未开始 </a-select-option>
                    <a-select-option value="1"> 进行中 </a-select-option>
                    <a-select-option value="2"> 已失效 </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="活动时间">
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
                />
            </a-form-model-item>
        </a-form-model>
        <div class="mt-20">
            <a-button type="primary" @click="createActivity()"> 新建活动 </a-button>
            <a-button type="primary" @click="submitForm(true)" class="ml-20"> 查询 </a-button>
            <a-button @click="resetForm()" class="ml-20"> 重置 </a-button>
        </div>
        <!-- 数据列表 -->
        <a-table class="mt-20" rowKey="id" :columns="columns" :data-source="dataList" :pagination="pagination">
            <!-- 自定义table部分标题 -->
<!--            <span slot="payPeopleTitle">-->
<!--        支付人数-->
<!--        <a-tooltip trigger="“hover">-->
<!--          <template slot="title">该活动支付人数，若一个用户支付多次，支付人数依然算作一次 </template>-->
<!--          <a-icon class="ml-10" type="question-circle" />-->
<!--        </a-tooltip>-->
<!--      </span>-->
<!--            <span slot="payNumTitle">-->
<!--        支付单数-->
<!--        <a-tooltip trigger="hover">-->
<!--          <template slot="title">该活动支付单数，若一个用户支付多次，支付人数依然算多次 </template>-->
<!--          <a-icon class="ml-10" type="question-circle" />-->
<!--        </a-tooltip>-->
<!--      </span>-->
            <!-- 开始结束日期 -->
            <span slot="activityTime" slot-scope="text, record"> {{ text }} ~ {{ record.end_time }} </span>
            <!-- 状态 -->
            <span slot="status" slot-scope="text">
        <a-badge v-if="text == 1" status="success" text="进行中" />
        <a-badge v-if="text == 2" status="default" text="已失效" />
        <a-badge v-if="text == 0" status="warning" text="未开始" />
      </span>
            <!-- 操作栏 -->
            <span slot="action" slot-scope="text, record">
        <a class="inline-block" @click="editActivity(text, record.status)">{{
          record.status != 2 ? '编辑' : '查看'
        }}</a>
        <a v-if="record.status != 2" @click="changeActivityState(text)" class="ml-10 inline-block">失效</a>
        <a class="ml-10 inline-block" v-if="record.status == 2" @click="removeActivity(text)">删除</a>
      </span>
        </a-table>
    </div>
</template>

<script>
    import moment from 'moment'
    import mallMerchantApi from '@/api/life_tools/merchant/index'
    export default {
        name: "ScenicToolsLimitList",
        data() {
            return {
                //   搜索框表单
                searchForm: {
                    name: '', // 店铺名称
                    time: [],
                    start_time: '', // 活动开始时间
                    end_time: '', // 活动结束时间
                    status: 3, // 营销状态（0未开始 1进行中 2已失效 3全部活动）
                },
                //   table表格头部
                columns: [
                    {
                        title: '活动名称',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        title: '活动时间',
                        dataIndex: 'start_time',
                        key: 'start_time',
                        scopedSlots: { customRender: 'activityTime' },
                    },
                    // {
                    //     dataIndex: 'pay_order_people',
                    //     key: 'pay_order_people',
                    //     slots: { title: 'payPeopleTitle' },
                    //     width: '120px',
                    // },
                    // {
                    //     dataIndex: 'pay_order_num',
                    //     key: 'pay_order_num',
                    //     slots: { title: 'payNumTitle' },
                    //     width: '120px',
                    // },
                    // {
                    //     title: '实收金额',
                    //     dataIndex: 'real_income',
                    //     key: 'real_income',
                    // },
                    {
                        title: '活动状态',
                        dataIndex: 'status',
                        key: 'status',
                        scopedSlots: { customRender: 'status' },
                        width: '120px',
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
                pagination: {
                    current: 1,
                    total: 0,
                    pageSize: 10,
                    showSizeChanger: true,
                    onChange: this.onPageChange,
                    onShowSizeChange: this.onPageSizeChange,
                    showTotal: (total) => `共 ${total} 个活动`,
                },
            }
        },
        created() {
            this.getDataList({})
        },
        activated() {
            //   添加活动后更新订单列表
            let limitedEdit = sessionStorage.getItem('limitedEdit') || ''
            if (limitedEdit && limitedEdit == 1) {
                this.$set(this.pagination, 'current', 1)
                this.$set(this.pagination, 'pageSize', 10)
                this.$set(this.pagination, 'total', 0)
                this.getDataList({})
                sessionStorage.removeItem('limitedEdit')
            }
        },
        methods: {
            moment,
            // 获取table数据
            getDataList(params) {
                if (params.is_search && params.is_search == true) {
                    this.$set(this.pagination, 'current', 1)
                } else {
                    this.$set(this.pagination, 'current', this.pagination.current)
                }
                this.request(mallMerchantApi.getSportsSecondsKillList, params).then((res) => {
                    this.dataList = res.list
                    this.$set(this.pagination, 'total', res.count)
                })
            },
            // 监听日期选择变化
            onDateRangeChange(date, dateString) {
                // 更新搜索框表单数据
                this.$set(this.searchForm, 'time', [date[0], date[1]])
                this.$set(this.searchForm, 'start_time', dateString[0])
                this.$set(this.searchForm, 'end_time', dateString[1])
            },
            // 提交搜索表单
            submitForm(is_search = false) {
                let params = { ...this.searchForm }
                delete params.time
                params.is_search = is_search
                this.getDataList(params)
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
            // 重置表单
            resetForm() {
                this.$set(this, 'searchForm', { name: '', start_time: '', end_time: '', status: 3, time: [] })
                this.$set(this.pagination, 'current', 1)
                this.getDataList({})
            },
            // 新建活动
            createActivity() {
                this.$router.push({ path: '/merchant/merchant.life_tools/SportsSecondsKillActEdit', query: {} })
            },
            // 编辑活动
            editActivity(id, status) {
                if (status == 2) {
                    this.$router.push({ path: '/merchant/merchant.life_tools/SportsSecondsKillActLook', query: { id } })
                } else {
                    this.$router.push({ path: '/merchant/merchant.life_tools/SportsSecondsKillActEdit', query: { id } })
                }
            },
            // 失效
            changeActivityState(id) {
                this.$confirm({
                    title: '是否将活动失效，失效的活动将无法恢复！',
                    centered: true,
                    onOk: () => {
                        this.request(mallMerchantApi.ChangeSportsSecondsKill, { id }).then((res) => {
                            this.$message.success('操作成功！')
                            this.submitForm()
                        })
                    },
                    onCancel() {},
                })
            },
            // 删除活动
            removeActivity(id) {
                this.$confirm({
                    title: '是否确定删除该活动?',
                    centered: true,
                    onOk: () => {
                        this.request(mallMerchantApi.delSportsSecondsKill, { id }).then((res) => {
                            this.$message.success('操作成功！')
                            this.submitForm()
                        })
                    },
                    onCancel() {},
                })
            },
        },
    }
</script>

<style scoped>

</style>