<template>
    <a-modal
            :title=titleName
            width="65%"
            centered
            :visible="dialogVisible"
            @ok="handleOk"
            @cancel="handleCancel"
            class="dialog"
            :destroyOnClose="true"
    >
        <div style="margin-top: 5px;padding:10px;background-color: #fff;">
            <a-form-model layout="inline" :model="searchForm">
                <a-form-model-item label="搜索">
                    <a-select
                        v-model="searchForm.search_type"
                        style="width:100px;"
                    >
                        <a-select-option value="3">商品名称</a-select-option>
                        <a-select-option value="1">商家名称</a-select-option>
                        <a-select-option value="2">店铺名称</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="">
                    <a-input v-model="searchForm.keyword" placeholder="关键词"></a-input>
                </a-form-model-item>
                <a-form-model-item>
                    <a-button type="primary" @click="submitForm(true)" class="ml-20">搜索</a-button>
                </a-form-model-item>
            </a-form-model>
            <a-table
                    rowKey="goods_id"
                    :columns="columns"
                    :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                    :data-source="datalist"
                    :pagination="pagination"
                    bordered
            >
            </a-table>
        </div>
    </a-modal>
</template>

<script>
  import employeePlatformApi from "@/api/employee/platform";
    const columns = [
        {
            title: '商品名称',
            dataIndex: 'goods_name',
            key: 'goods_name',
        },
        {
            title: '商家名称',
            dataIndex: 'mer_name',
            key: 'mer_name',
        },
        {
            title: '店铺名称',
            dataIndex: 'store_name',
            key: 'store_name',
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '可见员工身份标签',
            dataIndex: 'employee_lables',
            key: 'employee_lables',
        },
    ];
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
    };
    export default {
        name: "SelectShopGoods",
        data() {
            return {
                titleName:"选择商品",
                dialogVisible: false,
                rowSelection,
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                datalist: [],
                columns,
                addVisible: false, //添加
                editVisible: false, //编辑
                recordVisible: false, //记录
                currentBtn: '', // 当前点击的操作按钮
                setVisible: false,
                activity_id: 0,
                //搜索框表单
                searchForm: {
                    search_type: '3',
                    activity_id: 0,
                    keyword: '', // 搜索名称
                },
                selectedRowKeys: [],
                selectedRows: [],
                cat_id: '',
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
        methods: {
            onSelectChange(selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys;
                this.selectedRows = selectedRows;
                console.log(selectedRowKeys,"selectedRowKeys==selectedRowKeys");
                console.log(selectedRows,"selectedRows==selectedRows");
            },
            openDialog(activity_id) {
                console.log(1111,activity_id)
                this.dialogVisible = true
                this.activity_id = activity_id
                this.$set(this.searchForm, 'activity_id', activity_id)
                console.log(1111,this.searchForm)
                this.getDataList()
            },
            // 获取table数据
            getDataList(is_search) {
                let params = {...this.searchForm}
                if (is_search === true) {
                    params.page = 1
                    params.keyWords=this.searchForm.title
                    this.$set(this.pagination, 'current', 1)
                } else {
                    params.page = this.pagination.current
                    this.$set(this.pagination, 'current', this.pagination.current)
                }
                params.pageSize = this.pagination.pageSize
                console.log(1111,params)
                this.request(employeePlatformApi.getShopGoodsList, params).then((res) => {
                    this.datalist = res.data
                    this.$set(this.pagination, 'total', res.total)
                })
            },
            // 提交搜索表单
            submitForm(is_search = false) {
                this.getDataList(is_search)
            },
            // 重置表单
            resetForm() {
                this.$set(this, 'searchForm', {name: '', status: -1})
                this.$set(this.pagination, 'current', 1)
                this.getDataList()
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
            confirm(id, status) {
                this.onChange(id, status)
            },
            setCancel() {
                this.setVisible = false;
            },
            // 点击确认
            handleOk() {
                if (this.selectedRowKeys.length) {
                    this.request(employeePlatformApi.addActivityShopGoods, {
                        goods_ids: this.selectedRowKeys,
                        activity_id: this.activity_id
                    }).then(res => {
                        this.$message.success('添加成功')
                        this.$emit('getTable')
                    })
                    this.handleCancel()
                } else {
                    this.$message.error('请选择')
                }
            },
            handleCancel() {
                this.searchForm = {
                    search_type: '1',
                    activity_id: 0,
                    keyword: '', // 搜索名称
                }
                this.selectedRowKeys = [];
                this.selectedRows    = [];
                this.dialogVisible   = false
            },
        },
    }
</script>

<style scoped>

</style>