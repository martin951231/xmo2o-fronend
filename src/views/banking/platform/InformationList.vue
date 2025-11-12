<template>
    <div style="margin-top: 20px;padding:20px;background-color: #fff;">
        <a-form-model layout="inline" :model="searchForm">
            <a-form-model-item label="搜索">
                <a-input v-model="searchForm.name" placeholder="请输入标题"></a-input>
            </a-form-model-item>
            <a-form-model-item>
                <a-button type="primary" @click="submitForm(true)" class="ml-20">搜索</a-button>
<!--                <a-button @click="resetForm()" class="ml-20">重置</a-button>-->
                <a-button type="primary" class="ml-20" @click="handleAdd">添加资讯</a-button>
            </a-form-model-item>
        </a-form-model>
        <a-table rowKey="pigcms_id" style="padding-top: 10px;" :columns="columns" :data-source="datalist" :pagination="pagination">
            
              <span slot="banking_title" slot-scope="text">
                <a-tooltip placement="top" :title="text">
                  <label class="banking_title text-els">{{text}}</label>
                </a-tooltip>
              </span>
              <span slot="action" slot-scope="text, record">
                <a @click="() => handleEdit(record.pigcms_id)">编辑</a>
                <a-divider type="vertical" />
                <a @click="() => handleDel(record.pigcms_id)">删除</a>
            </span>
        </a-table>
        <!-- 添加/编辑 -->
        <editInformation
            v-if="currentBtn.props === 'editScan'"
            :visible="editVisible"
            :title="currentBtn.title"
            @getDataList="getDataList"
            @handleCancel="editVisible = false"
            :formData="currentBtn.data"
        ></editInformation>
    </div>
</template>
<script>

import bankingPlatformApi from "@/api/banking/platform/index";
import editInformation from '@/views/banking/platform/modules/editInformation'
import moment from 'moment'

const columns = [
    {
        title: '编号',
        dataIndex: 'pigcms_id',
        key: 'pigcms_id',
    },
    {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        scopedSlots: { customRender: 'banking_title' },
    },
    {
        title: '显示时间',
        dataIndex: 'show_time',
        key: 'show_time',
    },
    {
        title: '浏览量',
        dataIndex: 'view_count',
        key: 'view_count',
    },
    {
        title: '添加时间',
        dataIndex: 'add_time',
        key: 'add_time',
    },
    {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' },
    },
];

export default {
    components: {
        editInformation
    },
    data() {
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            datalist: [],
            columns,
            editVisible: false, //编辑
            currentBtn: '', // 当前点击的操作按钮
            //搜索框表单
            searchForm: {
                name: '', // 搜索名称
                status: -1,//上下架
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
        this.getDataList(false)
    },
    methods: {
        moment,
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
            this.request(bankingPlatformApi.getInformationList, params).then((res) => {
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
        handleAdd() {
            this.currentBtn = {
                'props': 'editScan',
                'title': '添加资讯',
                'data': {
                    title: '',
                    image: '',
                    show_type: '1',
                    start_time: null,
                    end_time: null,
                    content: ''
                }
            }
            this.editVisible = true
        },
        handleDel(id) {
            
            this.$confirm({
                title: '确认要删除该项?',
                centered: true,
                okText:'确定',
                cancelText:'取消',
                onOk: () => {
                    this.request(bankingPlatformApi.delInformation, {id: id}, 'GET').then((res) => {
                        this.$message.success('操作成功!');
                        setTimeout(() => {
                            this.getDataList()
                        },1000)
                    })
                },
                onCancel() {},
            })
           
        },
        handleEdit(id) {
            this.request(bankingPlatformApi.getInformationData, {id: id}, 'GET').then((res) => {
                this.currentBtn = {
                    'props': 'editScan',
                    'title': '编辑资讯',
                    'data': res
                }
                this.editVisible = true
            })
        },
        setCancel() {
            this.setVisible = false;
        },
        setOk() {
            this.submitConfig()
        },
    },
};
</script>
<style lang="less" scoped>
.banking_title {
  max-width: 100px;
  display: inline-block;
  cursor: pointer;
}
</style>