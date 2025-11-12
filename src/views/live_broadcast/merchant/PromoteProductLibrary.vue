<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-row type="flex">
            <a-button class="mr-10" type="primary" @click="addGoods">{{L('添加商品')}}</a-button>
            <a-input-search v-model="formData.keyword" :placeholder="L('请输入商品名称')" style="width: 300px" enter-button @search="onSearch" />
        </a-row>
        <div class="mt-10">
            <a-table :columns="columns" :data-source="goodList" :pagination="pagination" rowKey="id">
                <span slot="action" slot-scope="text, record">
                    <a class="mr-10" @click="editRebate(record)">{{L('更改返佣')}}</a>
                    <a style="color: red" @click="deleteGoods(record)">{{L('移除')}}</a>
                </span>
            </a-table>
        </div>
        <a-modal v-model="visible" :title="title" @ok="handleOk">
            <div>
                <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-form-model-item :label="L('返佣比例')">
                        <a-input-number :min="0" :formatter="value => `${value}%`" :parser="value => value.replace('%', '')" v-model="percent" />
                        <div style="color: red">{{L('*设置-1则读取平台配置返佣比例')}}</div>
                    </a-form-model-item>
                </a-form-model>
            </div>
        </a-modal>
        <!-- 商品库 -->
        <goods-library ref="goodsLibrary" modalWidth="900px" @addSuccess="addSuccess" />
    </div>
</template>
<script>
import GoodsLibrary from '../modules/GoodsLibrary'
import liveBroadcastMerchantApi from '@/api/live_broadcast/merchant/index.js'
export default {
    data() {
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            formData: {
                page: 1,
                pageSize: 10,
                keyword: '',
            },
            business_type: '', //业务类型 village_group=社区团购，group团购 mall=商城，shop外卖
            columns: [],
            goodList: [],
            goodItem: null,
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            visible: false,
            title: '',
            percent: 0, //佣金比例
        }
    },
    components: { GoodsLibrary },
    created() {
        if (this.$route.path.indexOf('business_type') != -1) {
            this.business_type = this.$route.path.slice(this.$route.path.indexOf('=') + 1)
        }
        if (this.business_type == 'village_group') {
            this.columns = [
                {
                    title: this.L('商品名称'),
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: this.L('价格'),
                    dataIndex: 'price',
                    key: 'price',
                },
                {
                    title: this.L('返佣比例'),
                    key: 'percent_txt',
                    dataIndex: 'percent_txt',
                },
                {
                    title: this.L('添加时间'),
                    key: 'create_time',
                    dataIndex: 'create_time',
                },
                {
                    title: this.L('操作'),
                    key: 'action',
                    scopedSlots: { customRender: 'action' },
                },
            ]
        }
        this.onSearch()
    },

    methods: {
        addSuccess() {
            this.$message.success(this.L('添加成功！'))
            this.onSearch()
        },
        //添加商品
        addGoods() {
            this.$nextTick(() => {
                this.$refs.goodsLibrary.initTableColumns(this.business_type)
                this.$refs.goodsLibrary.onSearch(this.business_type)
                this.$refs.goodsLibrary.visible = true
            })
        },
        onSearch() {
            this.pagination.current = 1
            this.getGoodList()
        },
        getGoodList() {
            this.formData.page = this.pagination.current
            this.formData.pageSize = this.pagination.pageSize
            this.formData.goods_type = this.business_type
            this.request(liveBroadcastMerchantApi.liveShowGoodsList, this.formData).then((res) => {
                this.goodList = res.data
                this.$set(this.pagination, 'total', res.total)
            })
        },
        //更改返佣
        editRebate(item) {
            this.title = this.L('修改返佣比例')
            this.visible = true
            this.percent = item.percent || 0
            this.goodItem = item
        },
        //删除商品
        deleteGoods(item) {
            this.goodItem = item
            this.$confirm({
                title: this.L('确定要删除这条数据吗？不可恢复。'),
                okText: this.L('确定'),
                okType: 'danger',
                cancelText: this.L('取消'),
                onOk: () => {
                    let params = {
                        goods_type: this.formData.goods_type,
                        id: this.goodItem.id,
                    }
                    this.request(liveBroadcastMerchantApi.delLiveShowGoods, params).then((res) => {
                        this.visible = false
                        this.$message.success(this.L('删除成功！'))
                        this.onSearch()
                    })
                },
            })
        },
        //确定修改商品佣金比例
        handleOk() {
            let params = {
                goods_type: this.formData.goods_type,
                id: this.goodItem.id,
                percent: this.percent,
            }
            this.request(liveBroadcastMerchantApi.changeLiveShowPercent, params).then((res) => {
                this.visible = false
                this.$message.success(this.L('修改成功！'))
                this.getGoodList()
            })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getGoodList()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.getGoodList()
        },
    },
}
</script>
<style lang="less" scoped>
</style>