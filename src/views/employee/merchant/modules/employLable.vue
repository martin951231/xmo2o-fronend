<template>
    <a-modal
        :visible="visible"
        title="身份标签列表"
        width="40%"
        @cancel="handleCancel"
        @ok="handleOk"
    >
        <div style="padding:20px;background-color: #fff;">
            <a-form-model layout="inline" :model="searchForm">
                <a-form-model-item>
                    <a-button type="primary" class="ml-20" @click="handleAdd">添加</a-button>
                </a-form-model-item>
            </a-form-model>
            <a-table rowKey="id" :columns="columns" :data-source="datalist" :pagination="pagination" bordered>
                <template slot="name" slot-scope="text,record">
                    <a-input
                        :default-value="text"
                        class="sort-input"
                        v-model="record.name"
                        @blur="handleNameChange($event,text,record)"/>
                </template>
              <span slot="action" slot-scope="text, record">
                 <a @click="showBindStore(record.id, record.bind_store_id, record.name)" >绑定店铺</a>&nbsp;
                  <a-popconfirm title="确认删除？" ok-text="确定" cancel-text="取消" @confirm="handleDel(record.id)">
                     <a href="#">删除</a>
                  </a-popconfirm>
              </span>
            </a-table>
            <!-- 添加 -->
            <a-modal
                title="添加身份标签"
                :visible="addVisible"
                @cancel="setCancel"
                width="500px"
            >
                <template slot="footer">
                    <a-button key="back" @click="setCancel">
                        取消
                    </a-button>
                    <a-button key="submit" type="primary" @click="addOk">
                        确定
                    </a-button>
                </template>
                <a-form-model layout="horizontal" :model="addForm" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-form-model-item label="身份名称">
                        <a-input v-model="addForm.name" placeholder="身份名称"></a-input>
                    </a-form-model-item>
                </a-form-model>
            </a-modal>
            <a-modal
                title="绑定店铺"
                :visible="bindStoreVisible"
                @cancel="bindStoreCancel"
                width="500px"
            >
                <template slot="footer">
                    <a-button key="back" @click="bindStoreCancel">
                        取消
                    </a-button>
                    <a-button type="primary" @click="bindStoreOk">
                        确定
                    </a-button>
                </template>
                <a-form-model layout="horizontal" :model="addForm" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-form-model-item label="身份名称">
                        <a-input v-model="bindStoreForm.name" placeholder="身份名称" disabled></a-input>
                    </a-form-model-item>

                    <a-form-item label="店铺列表">

                    <a-checkbox-group v-model="bindStoreForm.store_ids">
                        <a-row>
                            <a-col :span="24" style="line-height: 40px;">
                                <a-checkbox :value="index" @change="ckeckBindStore" v-for="(item,index) in storeList">
                                    {{item}}
                                </a-checkbox>
                            </a-col>
                        </a-row>
                    </a-checkbox-group> 
                </a-form-item>
                </a-form-model>
            </a-modal>
        </div>
    </a-modal>
</template>
<script>

import lifeMerchantApi from '@/api/employee/merchant/index'

const columns = [
    {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '身份名称',
        dataIndex: 'name',
        key: 'name',
        scopedSlots: {customRender: 'name'},
    },
    {
        title: '操作',
        key: 'action',
        scopedSlots: {customRender: 'action'},
    },
];

export default {
    props: {
        visible: Boolean,
        title: String,
        scanId: null
    },
    data() {
        return {
            datalist: [],
            dateRange: [],
            storeList: [],
            selectStoreList: [],
            addVisible: false,
            bindStoreVisible: false,
            addForm: {
                name: '',
            },
            bindStoreForm:{
                label_id: 0,
                name: '',
                store_ids: []
            },
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            columns,
            //搜索框表单
            searchForm: {
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
    created() {
        this.getDataList(false);
        this.getStoreList();
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
            this.request(lifeMerchantApi.employLableList, params).then((res) => {
                this.datalist = res.data
                this.$set(this.pagination, 'total', res.total)
            })
        },
        //获取店铺列表
        getStoreList(){
            this.request(lifeMerchantApi.getStoreList).then((res) => {
                this.storeList = res
            })
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
        handleOk() {
            this.$emit('handleCancel')
        },
        handleCancel() {
            this.$emit('handleCancel')
        },
        handleNameChange(e, val, record) {
            let params = {
                id: record.id,
                name: val
            }
            this.request(lifeMerchantApi.employLableAddOrEdit, params).then((data) => {
                this.getDataList()
            })
        },
        handleAdd() {
            this.addVisible = true
        },
        setCancel() {
            this.$set(this.addForm, 'name', '')
            this.addVisible = false;
        },
        addOk() {
            if (this.addForm.name == '') {
                this.$message.error("身份名称必填");
                return false;
            }
            this.request(lifeMerchantApi.employLableAddOrEdit, this.addForm, 'POST').then((res) => {
                this.$message.success('添加成功!', 1);
                setTimeout(() => {
                    this.setCancel()
                    this.getDataList()
                },1000)
            })
        },
        handleDel(id) {
            this.request(lifeMerchantApi.employLableDel, {id: id}, 'POST').then((res) => {
                this.$message.success('删除成功!', 1);
                this.getDataList()
            })
        },
        bindStoreOk(){
            this.request(lifeMerchantApi.lableBindStore, this.bindStoreForm).then((data) => {
                this.$message.success('操作成功');
                this.bindStoreForm.label_id = 0;
                this.bindStoreForm.store_ids = [];
                this.bindStoreVisible = false;
                this.getDataList()
            })
        },
        bindStoreCancel() {
            this.bindStoreForm.label_id = 0;
            this.bindStoreForm.store_ids = [];
            this.bindStoreVisible = false;
        },
        showBindStore(id, bind_store_id, name){
            this.bindStoreVisible = true;
            this.bindStoreForm.label_id = id;
            this.bindStoreForm.store_ids = bind_store_id;
            this.bindStoreForm.name = name;
        },
        ckeckBindStore(e){
            let value = parseInt(e.target.value);
            let sub = this.bindStoreForm.store_ids.indexOf(value);
            if(e.target.checked && sub === -1){ 
                this.bindStoreForm.store_ids.push(value); 
            }
            if(!e.target.checked && sub !== -1){ 
                this.bindStoreForm.store_ids.splice(sub, 1);
            }
        }
    },
};
</script>