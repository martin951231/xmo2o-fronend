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
                <a-form-model-item label="标题">
                    <a-input v-model="searchForm.title" placeholder="标题"></a-input>
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
    import lifeToolsPlatformApi from "@/api/life_tools/platform";
    const columns = [
        {
            title: 'ID',
            dataIndex: 'goods_id',
            key: 'goods_id',
        },
        {
            title: '名称',
            dataIndex: 'goods_name',
            key: 'goods_name',
        },
        {
            title: '商家名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '售价',
            dataIndex: 'goods_price',
            key: 'goods_price',
        },
    ];
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
    };
    export default {
        name: "SelectRecGoods",
        data() {
            return {
                titleName:"选择景区",
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
                ewmVisible: false,
                setVisible: false,
                ewm: '',
                ewmName: '',
                configForm: {
                    scan_money_desc: '',
                    scan_score_desc: '',
                    scan_timeout: '3'
                },
                //搜索框表单
                searchForm: {
                    goods_type: '',
                    title: '', // 搜索名称
                    recommend_id:0
                },
                selectedRowKeys: [],
                selectedRows: [],
                cat_id: '',
                pagination: {
                    current: 1,
                    total: 0,
                    pageSize: 5,
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
            openDialog(key,id) {
                this.dialogVisible = true
                this.searchForm.goods_type=key
                if(key=='ticket'){
                    this.titleName='选择景区'
                }else if(key=='sport'){
                    this.titleName='选择体育'
                }else if(key=='shop'){
                    this.titleName='选择快店商品'
                }else{
                    this.titleName='选择商城商品'
                }
                this.searchForm.recommend_id=id
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
                this.request(lifeToolsPlatformApi.getGoodsList, params).then((res) => {
                    this.datalist = res.list
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
                    this.request(lifeToolsPlatformApi.addRecGoods, {
                        selectedRowKeys: this.selectedRowKeys,
                        goods_type:this.searchForm.goods_type,
                        recommend_id:this.searchForm.recommend_id
                    }).then(res => {
                        this.$message.success('添加成功')
                        if(this.searchForm.goods_type=='ticket'){
                            this.$emit('getTable')
                        }else if(this.searchForm.goods_type=='sport'){
                            this.$emit('getTable')
                        }else if(this.searchForm.goods_type=='shop'){
                            this.$emit('getTable')
                        }else{
                            this.$emit('getTable')
                        }
                    })
                    this.handleCancel()
                } else {
                    this.$message.error('请选择')
                }
            },
            handleCancel() {
                this.searchForm = {
                    title: '', // 搜索名称
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