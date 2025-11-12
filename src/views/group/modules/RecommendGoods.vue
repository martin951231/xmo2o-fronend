<template>
    <a-modal :title="title" width="1200px" v-model="visible" :confirm-loading="confirmLoading" :footer="null">
        <div class="modal-box">
            <div class="mb-20">
                <a-button type="primary" @click="addGoods">{{'添加商品'}}</a-button>
            </div>

            <a-table rowKey="group_id" :columns="columns" :data-source="tableData" @change="tableChange">
                <span slot="name" slot-scope="text, record">
                    <div class="product-info">
                        <BeautifulImage :src="record.pic" width="60px" height="60px" radius="4px" visible hover viewerStyle="2" />
                        <p class="ml-10">{{ text }}</p>
                    </div>
                </span>
                <span slot="sort" slot-scope="text, record">
                    <a-input-number :min="0" :defaultValue="record.sort" @blur="handleSortChange($event,record.id)" />
                </span>
                <span slot="action" slot-scope="text, record,index">
                    <a @click="deleteItem(record,index)">{{'删除'}}</a>
                </span>
            </a-table>
        </div>
        <select-goods
            :visible.sync="selectGoodsVisible"
            :menuList="goodsSortList"
            :list="selectGoodsList"
            :selectType="2"
            :isLeftMenu="isLeftMenu"
            :selectedList="selectedGoodsDetailList"
            @submit="onGoodsSelect"
            @onMenuSelect="onMenuSelect"
            @onSearch="goodsOnSearch"
            :isMerIdSelect="false"
        />
    </a-modal>
</template>
<script>
import GroupPlatformApi from '@/api/group/platform'
import SelectGoods from './SelectGoods'
import BeautifulImage from '@/components/BeautifulImage/BeautifulImage'
export default {
    props: {
        group_activity_recommendations: {
            type: [String, Number],
            default: () => {
                return '0'
            },
        },
    },
    data() {
        return {
            pagination: {
                pageSize: 10,
                total: 10,
                showSizeChanger: true,
                'show-total': (total) => `共 ${total} 条记录`,
            },
            custom_id: '',
            queryParam: {
                sort_id: '', //分类id
                keywords: '',
                status: 1,
            },
            visible: false,
            confirmLoading: false,
            title: '',
            selectGoodsVisible: false,
            tableData: [],
            columns: [
                {
                    title: this.L('商品信息'),
                    dataIndex: 'name',
                    scopedSlots: { customRender: 'name' },
                },
                {
                    title: this.L('商家名称'),
                    dataIndex: 'merchant_name',
                    key: 'merchant_name',
                },
                {
                    title: this.L('价格'),
                    dataIndex: 'price',
                    key: 'price',
                },
                {
                    title: this.L('库存'),
                    dataIndex: 'nums',
                    key: 'nums',
                },
                {
                    title: this.L('排序'),
                    dataIndex: 'sort',
                    key: 'sort',
                    scopedSlots: { customRender: 'sort' },
                },
                {
                    title: this.L('操作'),
                    key: 'action',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            goodsSortList: [], //分类列表
            selectGoodsList: [], //商品列表
            selectedGoodsDetailList: [],
            isLeftMenu: false,
        }
    },
    components: { SelectGoods, BeautifulImage },
    methods: {
        open(title = this.L('关联商品列表')) {
            this.title = title
            if (this.queryParam.sort_id == 0) {
                this.isLeftMenu = true
                this.getCategoryListAll()
            } else {
                this.isLeftMenu = false
            }
            this.getGroupGoodsList()
            this.visible = true
        },
        //添加商品
        addGoods() {
            this.selectedGoodsDetailList = [];
            this.selectGoodsVisible = true
        },
        getCategoryListAll() {
            this.request(GroupPlatformApi.getCategoryTree, { cat_id: this.sort_id }).then((res) => {
                this.goodsSortList = res
            })
        },
        //获取团购所有商品列表
        getSelectGoodsList() {
            let params = {
                ...this.queryParam,
                custom_id: this.custom_id,
            }
            this.request(GroupPlatformApi.getGroupGoodsList, params).then((res) => {
                this.selectGoodsList = res.list
            })
        },
        // 选择商品回调
        onGoodsSelect(e) {
            this.request(GroupPlatformApi.addGoodsCustomGroup, { custom_id: this.custom_id, goods_arr: e.ids }).then(
                (res) => {
                    this.$message.success('添加商品成功！')
                    this.selectGoodsVisible = false
                    this.getGroupGoodsList()
                }
            )
        },
        // 选择商品分类
        onMenuSelect(e) {
            if (this.isLeftMenu) {
                this.queryParam.sort_id = e.id
            }
            this.queryParam.keywords = ''
            this.getSelectGoodsList()
        },
        // 搜索商品回调
        goodsOnSearch(e) {
            if (this.isLeftMenu) {
                this.queryParam.sort_id = e.id
            }
            this.queryParam.keywords = e.keywords
            this.getSelectGoodsList()
        },
        //获取团购推荐商品列表
        getGroupGoodsList() {
            let params = {
                custom_id: this.custom_id,
                group_activity_recommendations: this.group_activity_recommendations,
                page: this.pagination.page,
                pageSize: this.pagination.pageSize,
            }
            this.request(GroupPlatformApi.getRenovationCustomStoreSortList, params).then((res) => {
                this.tableData = res.data
                this.pagination.total = res.total
            })
        },
        deleteItem(item, index) {
            this.$confirm({
                title: `是否确定删除该商品吗?`,
                centered: true,
                onOk: () => {
                    this.request(GroupPlatformApi.delGoodsCustomGroup, {
                        custom_id: this.custom_id,
                        id: item.id,
                    }).then((res) => {
                        this.$message.success('操作成功！')
                        this.$delete(this.tableData, index)
                    })
                },
                onCancel() {},
            })
        },
        // 设置排序
        handleSortChange(event, id) {
            this.request(GroupPlatformApi.changeGoodsCustomSort, {
                id: id,
                sort: event.target._value,
            }).then((res) => {
                this.$message.success('操作成功！')
                this.getGroupGoodsList()
            })
        },
        // 表格中变动  这里只针对页面页数切换
        tableChange(e) {
            // 分页
            this.queryParam['pageSize'] = e.pageSize
            this.queryParam['page'] = e.current
            this.getGroupGoodsList()
        },
    },
}
</script>
<style lang="less" scoped>
.product-info {
    display: flex;
    align-items: center;
}
.modal-box {
    height: 70vh;
    overflow-y: auto;
}
</style>