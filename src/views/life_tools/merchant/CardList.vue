<template>
    <div style="margin-top: 20px; padding: 20px; background-color: #fff">
        <a-form-model layout="inline" :model="searchForm">
            <a-form-model-item label="搜索">
                <a-select v-model="searchForm.search_type" style="width: 150px">
                    <a-select-option :value="1">次卡名称</a-select-option>
                    <a-select-option :value="2">景区名称</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="">
                <a-input v-model="searchForm.keyword" placeholder="关键词"></a-input>
            </a-form-model-item>
            <a-form-model-item label="次卡类型">
                <a-select v-model="searchForm.type" style="width: 150px" :options="searchTypeOptions"> </a-select>
            </a-form-model-item>
            <a-form-model-item>
                <a-button type="primary" @click="submitForm(true)" class="ml-20">搜索</a-button>
                <a-button @click="resetForm()" class="ml-20">重置</a-button>
                <a-button type="primary" class="ml-20" @click="handleAdd()">添加</a-button>
            </a-form-model-item> </a-form-model
        ><br />
        <a-table rowKey="pigcms_id" :columns="columns" :data-source="datalist" :pagination="pagination" bordered>
            <span slot="action" slot-scope="text, record">
                <a @click="() => handleEdit(record.pigcms_id)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm
                    title="确认删除吗?"
                    ok-text="确认"
                    cancel-text="取消"
                    @confirm="handleDel(record.pigcms_id)"
                >
                    <a>删除</a>
                </a-popconfirm>
            </span>
        </a-table>
        <!-- 编辑 -->
        <cardEdit
            v-if="currentBtn.props === 'cardEdit'"
            :visible="editVisible"
            :title="currentBtn.title"
            @getDataList="getDataList"
            @handleCancel="editVisible = false"
            :detail="currentBtn.data"
            :isEdit="currentBtn.isEdit"
            :toolsList="currentBtn.toolsList"
        ></cardEdit>
    </div>
</template>
<script>
import lifeToolsMerchantApi from '@/api/life_tools/merchant'
import cardEdit from '@/views/life_tools/merchant/modules/cardEdit'
import moment from 'moment'

const columns = [
    {
        title: '次卡名称',
        dataIndex: 'title',
        key: 'title',
    },
    // {
    //   title: '订单类型',
    //   dataIndex: 'type',
    //   key: 'type',
    // },
    {
        title: '现价',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: '原价',
        dataIndex: 'old_price',
        key: 'old_price',
    },
    {
        title: '有效期',
        dataIndex: 'term_num_val',
        key: 'term_num_val',
    },
    {
        title: '次卡类型',
        dataIndex: 'type_txt'
    },
    {
        title: '创建时间',
        dataIndex: 'add_time',
        key: 'add_time',
    },
    {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' },
    },
]
export default {
    components: { cardEdit },
    data() {
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            datalist: [],
            columns,
            editVisible: false, //编辑
            currentBtn: {}, // 当前点击的操作按钮
            //搜索框表单
            searchForm: {
                search_type: 1,
                keyword: '',
                type: 'all',
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
            // 次卡搜索类型
            searchTypeOptions: [
                {
                    value: 'all',
                    label: '全部',
                },
                // {
                //     value: 'sports',
                //     label: '体育',
                // },
                {
                    value: 'scenic',
                    label: '景区',
                },
            ],
        }
    },
    created() {
        this.getDataList(false)
    },
    methods: {
        moment,
        // 获取table数据
        getDataList(is_search) {
            let params = { ...this.searchForm }
            if (is_search === true) {
                params.page = 1
                this.$set(this.pagination, 'current', 1)
            } else {
                params.page = this.pagination.current
                this.$set(this.pagination, 'current', this.pagination.current)
            }
            params.pageSize = this.pagination.pageSize
            this.request(lifeToolsMerchantApi.getToolsCardList, params).then((res) => {
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
            this.$set(this, 'searchForm', {
                search_type: 1,
                keyword: '',
                type: 'all',
            })
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
        handleEdit(pigcms_id) {
            this.request(lifeToolsMerchantApi.getToolsCardEdit, { pigcms_id: pigcms_id }, 'GET').then((res) => {
                this.currentBtn = {
                    props: 'cardEdit',
                    title: '编辑次卡',
                    data: res,
                    isEdit: true,
                }
                this.editVisible = true
            })
        },
        handleAdd() {
            this.currentBtn = {
                props: 'cardEdit',
                title: '添加次卡',
                isEdit: false,
            }
            this.editVisible = true
        },
        handleDel(pigcms_id) {
            this.request(lifeToolsMerchantApi.delToolsCard, { pigcms_id: pigcms_id }, 'GET').then((res) => {
                this.$message.success('操作成功!', 1, () => {
                    this.getDataList()
                })
            })
        },
    },
}
</script>