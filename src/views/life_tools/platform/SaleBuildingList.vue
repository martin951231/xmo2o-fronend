<template>
    <div style="margin-top: 20px;padding:20px;background-color: #fff;">
        <a-tabs v-model="tabsKey" @change="onTabsChange">
            <a-tab-pane :key="0" tab="楼盘列表">
                <a-form-model layout="inline" :model="searchForm">
                    <a-form-model-item>
                        <a-button type="primary" @click="addBuild()">新建楼盘</a-button>
                    </a-form-model-item>
                </a-form-model>
                <br />
                <a-table :columns="columns" :data-source="datalist" row-key="houses_id" :pagination="pagination" bordered>
                    <template slot="status" slot-scope="text, record">
                        <a-button type="link" @click="editBuildPic(record.houses_id )">编辑户型图</a-button>
                    </template>
                    <template slot="building_management" slot-scope="text, record">
                        <a-button type="link" @click="buildingManagement(record)">楼栋管理</a-button>
                    </template>

                    <template slot="action" slot-scope="text, record">
                        <a-button type="link" @click="editBuild(record.houses_id)">编辑</a-button>
                        <a-button type="link" @click="delBuild(record.houses_id )">删除</a-button>
                    </template>
                </a-table>
            </a-tab-pane>
            <a-tab-pane :key="1" tab="游览数据">
                <a-form-model layout="inline" :model="searchForm">
                    <a-form-model-item>
                        <a-select v-model="form.search_type" style="width: 120px">
                            <a-select-option :value="1">{{L('昵称')}}</a-select-option>
                            <a-select-option :value="2">{{L('手机号')}}</a-select-option>
                            <a-select-option :value="3">{{L('访问次数')}}</a-select-option>
                        </a-select>
                        <a-input-search style="width: 250px" :placeholder="L(form.search_type==3?'请输入最低访问次数':'请输入 ')" enter-button @search="onSearch" v-model="form.keywords" />
                    </a-form-model-item>
                    <a-form-model-item :label="L('最新访问途径')">
                        <a-select v-model="form.visit_type" style="width: 120px">
                            <a-select-option value="all">{{L('全部')}}</a-select-option>
                            <a-select-option value="scan">{{L('扫码进入')}}</a-select-option>
                            <a-select-option value="wechat">{{L('微信分享')}}</a-select-option>
                            <a-select-option value="normal">{{L('普通进入')}}</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item :label="L('最新访问日期')">
                        <a-range-picker @change="onDatePickerChange" />
                    </a-form-model-item>
                </a-form-model>
                <br />
                <a-table :columns="tourColumns" :data-source="tourData" row-key="id" :pagination="tourPagination"></a-table>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
import lifePlatformApi from '@/api/life_tools/platform/index'
const columns = [
    {
        title: '楼盘名称',
        dataIndex: 'title',
        scopedSlots: { customRender: 'title' },
        width: 200,
        align: 'center',
    },
    {
        title: '建筑面积',
        dataIndex: 'acreage',
        scopedSlots: { customRender: 'acreage' },
        width: 200,
        align: 'center',
    },
    {
        title: '价格',
        dataIndex: 'price',
        scopedSlots: { customRender: 'price' },
        width: 200,
        align: 'center',
    },
    {
        title: '户型图',
        dataIndex: 'status',
        scopedSlots: { customRender: 'status' },
        width: 200,
        align: 'center',
    },
    {
        title: '楼栋管理',
        dataIndex: 'building_management',
        scopedSlots: { customRender: 'building_management' },
        width: 200,
        align: 'center',
    },
    {
        title: '操作',
        dataIndex: 'action',
        scopedSlots: { customRender: 'action' },
        width: 200,
        align: 'center',
    },
]
export default {
    name: 'SaleBuildingList',
    data() {
        return {
            activity_id: 0,
            allLeader: 0,
            allRate: 0,
            price_rate_show: false,
            leader_spread_rate_show: false,
            leader_spread_rate: 0,
            mer_goods_id: 0,
            price_rate_start: 0,
            price_rate_end: 0,
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            datalist: [],
            search_tab_name: '商城',
            columns,
            goodsList: [],
            goodsAllList: [],
            //搜索框表单
            searchForm: {
                keyword: '',
                goods_type: 'mall',
                search_type: 1,
            },
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            tourPagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            tabsKey: 0,
            form: {
                keywords: '',
                start_time: '',
                end_time: '',
                page: 1,
                pageSize: 10,
                search_type: 1,//1-昵称，2-手机号，3-访问次数
                visit_type: 'all',//normal-普通，scan-扫码，wechat-微信
            },
            tourColumns: [
                {
                    title: this.L('昵称'),
                    dataIndex: 'nickname',
                },
                {
                    title: this.L('手机号'),
                    dataIndex: 'phone',
                },
                {
                    title: this.L('最新访问途径'),
                    dataIndex: 'visit_type',
                },
                {
                    title: this.L('最新访问楼盘'),
                    dataIndex: 'title',
                },
                {
                    title: this.L('访问次数'),
                    dataIndex: 'views',
                },
                {
                    title: this.L('最新访问日期'),
                    dataIndex: 'last_time',
                },
            ],
            tourData: [],
        }
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    created() {
        this.getDataList(false)
    },
    methods: {
        editBuildPic(id) {
            this.$router.push({
                path: '/life_tools/platform.LifeTools/saleBuildingFloorPlanList',
                query: { houses_id: id },
            })
        },
        addBuild() {
            this.$router.push({ path: '/life_tools/platform.LifeTools/saleBuildingEdit', query: { houses_id: 0 } })
        },
        editBuild(houses_id) {
            this.$router.push({
                path: '/life_tools/platform.LifeTools/saleBuildingEdit',
                query: { houses_id: houses_id },
            })
        },
        //楼栋管理
        buildingManagement(item) {
            this.$router.push({
                path: '/life_tools/platform.LifeTools/saleBuildingManagement',
                query: { house_id: item.houses_id },
            })
        },
        delBuild(houses_id) {
            this.$confirm({
                title: '是否确定删除?',
                centered: true,
                onOk: () => {
                    this.request(lifePlatformApi.updateHousesFloorStatus, { houses_id: houses_id, is_del: 1 }).then(
                        (res) => {
                            this.getDataList(false)
                        }
                    )
                },
                onCancel() {},
            })
        },
        // 设置上下架
        setGoodsStatus(activity_id, status) {
            let params = { ...this.searchForm }
            params.activity_id = activity_id
            if (status) {
                params.status = 1
            } else {
                params.status = 0
            }
            this.request(lifePlatformApi.updateSportsActivityStatus, params).then((res) => {
                this.datalist = res.data
                this.$set(this.pagination, 'total', res.total)
                this.getDataList(false)
            })
        },
        // 获取table数据
        getDataList(is_search) {
            let params = {}
            if (is_search === true) {
                params.page = 1
                this.$set(this.pagination, 'current', 1)
            } else {
                params.page = this.pagination.current
                this.$set(this.pagination, 'current', this.pagination.current)
            }
            params.pageSize = this.pagination.pageSize
            this.request(lifePlatformApi.getHousesFloorList, params).then((res) => {
                this.datalist = res.list
                this.pagination.total = res.total
            })
        },
        onTabsChange(e) {
            this.onSearch();
        },
        onSearch() {
           if (this.tabsKey == 0) {
                this.getDataList(true)
            } else {
                this.getTourData(true)
            }
        },
        onDatePickerChange(date, dateString) {
            this.form.start_time = dateString[0]
            this.form.end_time = dateString[1]
            this.getTourData(true)
        },
        //获取浏览数据
        getTourData(is_search) {
            if (is_search === true) {
                this.$set(this.tourPagination, 'current', 1)
            }
            this.form.page = this.tourPagination.current
            this.form.pageSize = this.tourPagination.pageSize
            this.request(lifePlatformApi.houseVisitLogGetList, this.form).then((res) => {
                this.tourData = res.data
                this.tourPagination.total = res.total
            })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            if (this.tabsKey == 0) {
                this.$set(this.pagination, 'current', page)
                this.getDataList()
            } else {
                this.$set(this.tourPagination, 'current', page)
                this.getTourData()
            }
        },
        onPageSizeChange(page, pageSize) {
            if (this.tabsKey == 0) {
                this.$set(this.pagination, 'pageSize', pageSize)
                this.getDataList()
            } else {
                this.$set(this.tourPagination, 'pageSize', pageSize)
                this.getTourData()
            }
        },
    },
}
</script>

<style scoped>
</style>