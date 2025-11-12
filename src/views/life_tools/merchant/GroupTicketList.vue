<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <!-- 搜索栏 -->
        <a-form-model layout="inline" :model="searchForm">
            <a-form-model-item label="搜索">
                <a-select
                        v-model="searchForm.search_type"
                        style="width:100px;"
                >
                    <a-select-option :value="'title'">景区名称</a-select-option>
                    <a-select-option :value="'ticket_title'">套餐名称</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="">
                <a-input v-model="searchForm.search_keyword" placeholder="关键词"></a-input>
            </a-form-model-item>

            <a-form-model-item>
                <a-button type="primary" @click="submitForm(true)" class="ml-20">搜索</a-button>
                <a-button @click="addForm()" type="primary" class="ml-20">添加</a-button>
            </a-form-model-item>
        </a-form-model>
        <!-- 数据列表 -->
        <a-table class="mt-20" rowKey="id" :columns="columns" :data-source="datalist" :pagination="pagination">
              <span slot="group_price" slot-scope="text,record">
                 <a-input-number style="width: 60px" :min="0" @blur="changeGroupPriceSort($event, record.id)"
                                 :default-value="text" />
               </span>

               <span slot="max_num" slot-scope="text,record">
                 <a-input-number style="width: 60px" :min="1" @blur="changeMaxNumSort($event, record.id)"
                                 :default-value="text" />
               </span>

              <span slot="action" slot-scope="text, record">
                <a @click="() => handleDelete(record.id)">删除</a>
              </span>
        </a-table>
        <add-group-ticket ref="addGroupGoods" @submit="selecrGoodsSubmit"
                          :selectedList="goodsList">

        </add-group-ticket>
    </div>
</template>

<script>
    import lifeToolsMerchantApi from "@/api/life_tools/merchant";
    import AddGroupTicket from "./modules/addGroupTicket";
    const columns = [
        {
            title: '景区名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '套餐名称',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '原价',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '团体票价',
            dataIndex: 'group_price',
            key: 'group_price',
            scopedSlots: {
                customRender: 'group_price'
            },
        },
        {
            title: '限购',
            dataIndex: 'max_num',
            key: 'max_num',
            scopedSlots: {
                customRender: 'max_num'
            },
        },
        {
            title: '操作',
            key: 'action',
            scopedSlots: { customRender: 'action' },
        },
    ];
    export default {
        name: "GroupTicketList",
        components: {AddGroupTicket},
        data() {
            return {
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                datalist: [],
                goodsList: [],
                columns,
                //搜索框表单
                searchForm: {
                    search_type: 'title',
                    search_keyword: '',
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
            }
        },
        created() {
            this.getDataList(false)
        },
        methods: {
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
                this.request(lifeToolsMerchantApi.getGroupTicketList, params).then((res) => {
                    this.datalist = res.data
                    this.$set(this.pagination, 'total', res.total)
                })
            },
            // 改变排序
            changeGroupPriceSort(e, id) {
                const group_price = e.currentTarget.value
                let params = {}
                params.id=id
                params.type='group_price'
                params.group_price=group_price
                this.request(lifeToolsMerchantApi.editGroupTicket, params).then((res) => {
                    this.getDataList(false)
                })
            },
            // 改变排序
            changeMaxNumSort(e, id) {
                const max_num = e.currentTarget.value
                let params = {}
                params.id=id
                params.type='max_num'
                params.max_num=max_num
                this.request(lifeToolsMerchantApi.editGroupTicket, params).then((res) => {
                    this.getDataList(false)
                })
            },
            // 提交搜索表单
            submitForm(is_search = false) {
                this.getDataList(is_search)
            },
            addForm(){
                this.$refs.addGroupGoods.openDialog()
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
            handleDelete(id) {
                this.$confirm({
                    title: '是否确定删除?',
                    centered: true,
                    onOk: () => {
                        this.request(lifeToolsMerchantApi.delGroupTicket, {id: id}).then((res) => {
                            this.getDataList(false)
                        })
                    },
                    onCancel() {},
                })
            },
            // 选择商品回调
            selecrGoodsSubmit(e) {
                console.log(e,'e-----selecrGoodsSubmit-----选择商品回调')
                e.goods = e.goods.map((item) => {
                    item.tools_id = item.tools_id
                    item.ticket_id = item.ticket_id
                    item.max_num=item.max_num
                    item.group_price=item.group_price
                    return item
                })
                this.goodsList = e.goods
                this.request(lifeToolsMerchantApi.addGroupTicket, {seleted_ticket_list:this.goodsList}).then((res) => {
                    this.getDataList(false)
                })
            },
        }
    }
</script>

<style scoped>

</style>