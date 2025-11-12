<template>
    <a-modal v-model="visible" :title="title" @ok="handleOk" :width="modalWidth">
        <div>
            <a-row type="flex">
                <a-input-search v-model="formData.keyword" :placeholder="L('请输入商品名称')" style="width: 300px" enter-button @search="onSearch" />
            </a-row>
            <div class="mt-10">
                <a-table :columns="columns" :data-source="goodList" :pagination="pagination" :row-selection="rowSelection" rowKey="goods_id"></a-table>
            </div>
        </div>
    </a-modal>
</template>
<script>
import liveBroadcastMerchantApi from '@/api/live_broadcast/merchant/index.js'
export default {
    props: {
        modalWidth: {
            type: String,
            default: () => {
                return '50%'
            },
        },
    },
    computed: {
        // 表格选择操作
        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onSelect: this.onRowSelect,
                onSelectAll: this.onSelectAll,
                getCheckboxProps: (record) => ({
                    props: {
                        disabled: record.live_goods ? true : false,
                    },
                }),
            }
        },
    },
    data() {
        return {
            formData: {
                page: 1,
                pageSize: 10,
                keyword: '',
            },
            columns: [],
            goodList: [],
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
            title: this.L('商品库'),
            selectedRowKeys: [], //选中的id
            selectGoodsList: [], //选中的商品
            goods_type: '',
        }
    },
    created() {},

    methods: {
        //设置表格标题头列表
        initTableColumns(type) {
            this.selectedRowKeys = []
            this.selectGoodsList = []
            this.formData.keyword = ''
            this.goods_type = type
            //社区团购
            if (type == 'village_group') {
                this.title = this.L('社区团购商品库')
                this.columns = [
                    {
                        title: this.L('名称'),
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        title: this.L('最后修改时间'),
                        dataIndex: 'last_time',
                        key: 'last_time',
                    },
                ]
            }
        },
        onSearch() {
            this.pagination.current = 1
            this.getGoodList()
        },
        getGoodList(type) {
            this.formData.page = this.pagination.current
            this.formData.pageSize = this.pagination.pageSize
            this.formData.goods_type = this.goods_type
            this.request(liveBroadcastMerchantApi.selectGoodsList, this.formData).then((res) => {
                this.goodList = res.data
                this.$set(this.pagination, 'total', res.total)
            })
        },
        //确定添加商品
        handleOk() {
            if (this.selectedRowKeys.length == 0) {
                this.$message.info(this.L('请选择商品！'))
                return
            }
            this.request(liveBroadcastMerchantApi.addLiveShowGoods, {
                selected: this.selectedRowKeys.join(','),
                goods_type: this.goods_type,
            }).then((res) => {
                this.visible = false
                this.selectedRowKeys = []
                this.selectGoodsList = []
                this.$emit('addSuccess')
            })
        },
        //单选操作
        onRowSelect(record, selected, selectedRows) {
            if (selected) {
                this.selectGoodsList.push(record)
                this.selectedRowKeys.push(record.goods_id)
            } else if (this.selectedRowKeys.length) {
                let index = this.selectedRowKeys.findIndex((item) => item == record.goods_id)
                index != -1 && this.$delete(this.selectedRowKeys, index)
                index != -1 && this.$delete(this.selectGoodsList, index)
            }
        },
        //全选操作
        onSelectAll(selected, selectedRows, changeRows) {
            let ids = changeRows.map((item) => item.goods_id)
            if (selected) {
                this.selectedRowKeys = this.selectedRowKeys.concat(ids)
                this.selectGoodsList = this.selectGoodsList.concat(changeRows)
            } else {
                this.selectedRowKeys = this.selectedRowKeys.concat(ids).filter((item) => !ids.includes(item))
                this.selectGoodsList = this.selectGoodsList
                    .concat(changeRows)
                    .filter((item) => !ids.includes(item.goods_id))
            }
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