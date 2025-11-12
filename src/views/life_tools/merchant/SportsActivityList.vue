<template>
    <div style="margin-top: 20px;padding:20px;background-color: #fff;">
        <a-tabs default-active-key="loans">
            <a-tab-pane key="loans" tab="约战列表">
            </a-tab-pane>
        </a-tabs>
        <a-form-model layout="inline" :model="searchForm">
            <a-form-model-item label="">
                <a-input v-model="searchForm.keyword" placeholder="搜索标题/描述/电话/地址/标签"></a-input>
            </a-form-model-item>

            <a-form-model-item>
                <a-button type="primary" @click="submitForm(true)">搜索</a-button>
            </a-form-model-item>

            <a-form-model-item>
                <a-button type="primary" @click="addActivity()">添加约战</a-button>
            </a-form-model-item>
        </a-form-model><br>
        <a-table rowKey="activity_id" :columns="columns" :data-source="datalist" :pagination="pagination" bordered>

            <template slot="num" slot-scope="text">
                <template v-for="tag in text">
                    <a-tag :key="tag" :closable="false">
                        {{ tag + '人' }}
                    </a-tag>
                </template>
            </template>

            <template slot="status" slot-scope="text, record">
                <a-switch
                        checked-children="是"
                        un-checked-children="否"
                        :default-checked="text == 1 ? true : false"
                        @change="setGoodsStatus(record.activity_id, $event)"
                />
            </template>

            <template slot="action" slot-scope="text, record">
                <a-button type="link" @click="editActivity(record.activity_id)">编辑</a-button>
                <a-button type="link" @click="delGoods(record.activity_id )">删除</a-button>
            </template>
        </a-table>
    </div>
</template>

<script>
    import lifeMerchantApi from '@/api/life_tools/merchant/index'
    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            scopedSlots: { customRender: 'title' },
            width:200,
            align:'center',
        },
        {
            title: '适用体育馆/门票套餐',
            dataIndex: 'stadium_package',
            scopedSlots: { customRender: 'stadium_package' },
            width:200,
            align:'center',
        },
        {
            title: '约战人数',
            dataIndex: 'num',
            scopedSlots: { customRender: 'num' },
            width:200,
            align:'center',
        },
        {
            title: '约战方式',
            dataIndex: 'group_type',
            scopedSlots: { customRender: 'group_type' },
            width:200,
            align:'center',
        },
        {
            title: '是否启用',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
            width:200,
            align:'center',
        },
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
            width:200,
            align:'center',
        }
    ];

    export default {
        name: "SportsActivityList",
        data() {
            return {
                activity_id:0,
                allLeader:0,
                allRate:0,
                price_rate_show:false,
                leader_spread_rate_show:false,
                leader_spread_rate:0,
                mer_goods_id:0,
                price_rate_start:0,
                price_rate_end:0,
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                datalist: [],
                search_tab_name:"商城",
                columns,
                goodsList: [],
                goodsAllList:[],
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
            };
        },
        mounted() {
            this.getDataList(false)
        },
        activated() {
            this.getDataList(false)
        },
        created() {
            this.getDataList(false)
        },
        methods: {
            // 选择商品回调
            selecrGoodsSubmit(e) {
                e.goods = e.goods.map((item) => {
                    item.goods_type = this.searchForm.goods_type
                    return item
                })
                this.request(lifeMerchantApi.addGoods, {goods:e.goods}).then((res) => {
                    this.getDataList(false)
                })
            },
            addActivity(){
                this.$router.push({path: '/merchant/merchant.life_tools/sportsActivityEdit', query: {activity_id: 0}})
            },
            editActivity(activity_id){
                this.$router.push({path: '/merchant/merchant.life_tools/sportsActivityEdit', query: {activity_id: activity_id}})
            },
            delGoods(activity_id){
                this.$confirm({
                    title: '是否确定删除?',
                    centered: true,
                    onOk: () => {
                        this.request(lifeMerchantApi.updateSportsActivityStatus, {activity_id:activity_id,is_del:1}).then((res) => {
                            this.getDataList(false)
                        })
                    },
                    onCancel() {},
                })
            },
            // 设置上下架
            setGoodsStatus(activity_id, status) {
                let params = {...this.searchForm}
                params.activity_id=activity_id
                if(status){
                    params.status=1
                }else{
                    params.status=0
                }
                this.request(lifeMerchantApi.updateSportsActivityStatus, params).then((res) => {
                    this.datalist = res.data
                    this.$set(this.pagination, 'total', res.total)
                    this.getDataList(false)
                })
            },
            // 获取table数据
            getDataList(is_search) {
                let params = {...this.searchForm}
                if (is_search === true) {
                    params.page = 1
                    this.$set(this.pagination, 'current', 1)
                } else {
                    params.page = this.pagination.current
                    this.$set(this.pagination, 'current', this.pagination.current)
                }
                params.pageSize = this.pagination.pageSize
                this.request(lifeMerchantApi.getSportsActivityList, params).then((res) => {
                    this.datalist = res.data
                    this.$set(this.pagination, 'total', res.total)
                })
            },
            // 提交搜索表单
            submitForm(is_search = false) {
                this.getDataList(is_search)
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
        },
    }
</script>

<style scoped>
</style>
