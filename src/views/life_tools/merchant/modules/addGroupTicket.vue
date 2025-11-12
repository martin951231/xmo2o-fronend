<template>
    <div>
        <a-modal
                :visible="dialogVisible"
                :title="titleName"
                width="90%"
                @cancel="handleCancel"
                @ok="handleOk"
                destroyOnClose
        >
            <a-form-model layout="inline" :model="searchForm">
                <a-form-model-item label="搜索">
                    <a-input v-model="searchForm.search_keyword" placeholder="门票名称"></a-input>
                </a-form-model-item>

                <a-form-model-item>
                    <a-button type="primary" @click="submitForm(true)" class="ml-20">搜索</a-button>
                </a-form-model-item>
            </a-form-model>
            <!-- 数据列表 -->
            <a-table class="mt-20" rowKey="ticket_id" :columns="columns" :data-source="datalist" :pagination="pagination" :row-selection="rowSelection" >
              <span slot="group_price" slot-scope="text,record">
                 <a-input-number style="width: 60px" :min="0" v-model="record.group_price" />
               </span>


                <span slot="max_num" slot-scope="text,record">
                 <a-input-number style="width: 60px" :min="1"  v-model="record.max_num"
                                 :default-value="text" />
               </span>
            </a-table>
        </a-modal>
    </div>
</template>

<script>
    import lifeToolsMerchantApi from "@/api/life_tools/merchant";
    let _this = null
    const columns = [
        {
            title: '门票名称',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '景区名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '原价',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '团体价',
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
    ];
    export default {
        name: "addGroupTicket",
        props: {
            // 单选、多选
            type: {
                type: String,
                default: 'checkbox',
            },
            // 已选择的列表
            selectedList: {
                type: Array,
                default: () => {
                    return []
                },
            },
        },
        data() {
            return {
                titleName:"选择门票",
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                datalist: [],
                columns,
                dialogVisible:false,
                selectedRowKeys: [],
                sList: [],
                //搜索框表单
                searchForm: {
                    search_type: 'title',
                    search_keyword: '',
                    source:'group',
                    tools_id:0,
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
        computed: {
            // 表格选择操作
            rowSelection() {
                    // spu goods
                    return {
                        //selectedRowKeys: this.selectedRowKeys,
                        type: this.type,
                        onSelect: this.onRowSelect,
                        onSelectAll: this.onSelectAll,
                        getCheckboxProps: (record) => ({
                            props: {
                                disabled: record.can_be_choose == 0,
                            },
                        }),
                    }
            },
        },
        created() {
            this.getDataList(false)
        },
        watch: {
            selectedList(val) {
                this.sList = JSON.parse(JSON.stringify(val))
            },
        },
        methods: {
            openDialog() {
                this.dialogVisible = true
                this.selectedRowKeys=[]
                this.sList = []
                this.getDataList(false)
            },
            // 获取table数据
            getDataList(is_search) {
                let params = {...this.searchForm}
                if (is_search === true) {
                    params.page = 1
                    this.$set(this.pagination, 'current', 1)
                } else {
                    this.selectedRowKeys=[]
                    this.sList = []
                    params.page = this.pagination.current
                    this.$set(this.pagination, 'current', this.pagination.current)
                }
                params.pageSize = this.pagination.pageSize
                this.request(lifeToolsMerchantApi.getLifeToolsTicket, params).then((res) => {
                    this.datalist = res.list
                    this.$set(this.pagination, 'total', res.count)
                })
            },
            // 选择商品
            onRowSelect(record, selected, selectedRows) {
                console.log(record,'record1111')
                console.log(selected,'selected1111')
                console.log(selectedRows,'------------dayinnselectedRows-------------')
                if (this.type == 'radio') {
                    this.sList = [record]
                    this.selectedRowKeys = [record.ticket_id]
                } else {
                    if (selected) {
                        this.sList.push(record)
                        this.selectedRowKeys.push(record.ticket_id)
                        console.log(this.sList, this.selectedRowKeys, '------------增加this.selectedRowKeys----------')
                    } else {
                        console.log(this.sList, this.selectedRowKeys, '------------this.selectedRowKeys----------')
                        this.sList.remove(record)
                        this.selectedRowKeys.remove(record.ticket_id)
                    }
                }
            },
            onSelectAll(selected, selectedRows, changeRows) {
                console.log(selectedRows,'onSelectAll1111')
                if (selected) {
                    changeRows.map((item) => {
                        this.selectedRowKeys.push(item.ticket_id)
                        this.sList.push(item)
                    })
                } else {
                    changeRows.map((item) => {
                        this.sList.remove(item)
                        this.selectedRowKeys.remove(item.ticket_id)
                    })
                }
            },
            // 提交搜索表单
            submitForm(is_search = false) {
                this.getDataList(is_search)
            },
            // 页码变化
            onPageChange(page, pageSize) {
                this.$set(this.pagination, 'current', page)
                this.getDataList(false)
            },
            onPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
                this.getDataList(false)
            },
            // 点击确认
            handleOk() {
                const { selectedRowKeys, sList } = this
                if (sList.length) {
                    this.$emit('submit', { ids: selectedRowKeys, goods: sList })
                    this.handleCancel()
                } else {
                    this.$message.error('请选择商品')
                }
            },
            handleCancel() {
                // this.init()
                this.searchForm.search_keyword=""
                this.selectedRowKeys=[]
                this.sList = []
                this.dialogVisible = false
            },
        }
    }
    Array.prototype.remove = function (val) {
        var index = this.indexOf(val)
        var index2 = -1
        if (index > -1) {
            this.splice(index, 1)
            return
        }
        this.map((item, i) => {
            if (item.ticket_id == val.ticket_id) {
                index2 = i
            }
        })
        if (index2 > -1) {
            this.splice(index2, 1)
        }
    }
</script>

<style scoped>

</style>