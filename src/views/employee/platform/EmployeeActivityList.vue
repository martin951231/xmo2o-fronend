<template>
    <div style="margin-top: 20px;padding:20px;background-color: #fff;">
        <a-form-model layout="inline" :model="searchForm">
            <a-form-model-item label="活动名称">
                <a-input v-model="searchForm.keyword" placeholder="关键词"></a-input>
            </a-form-model-item>
            <a-form-model-item>
                <a-button type="primary" @click="submitForm(true)" class="ml-20">搜索</a-button>
                <a-button @click="resetForm()" class="ml-20">重置</a-button>
                <a-button type="primary" class="ml-20" @click="handleAdd()">添加</a-button>
            </a-form-model-item>
        </a-form-model><br>
        <a-table rowKey="pigcms_id" :columns="columns" :data-source="datalist" :pagination="pagination" bordered>
            <span slot="ewm" slot-scope="text, record">
                <a @click="() => showEwm(record.ewm, record.url)">查看</a>
              </span>
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
        <ActivityEdit
            ref="activityEdit"
            v-if="currentBtn.props === 'ActivityEdit'"
            :visible="editVisible"
            :title="currentBtn.title"
            @getDataList="getDataList"
            @handleCancel="editVisible = false"
        ></ActivityEdit>
        <!-- 二维码 -->
        <a-modal
            title="二维码"
            :visible="ewmVisible"
            width="350px"
            @cancel="ewmCancel"
        >
            <template slot="footer">
                <a-button key="back" @click="ewmCancel">
                    关闭
                </a-button>
            </template>
            <img style="width: 120px; height: 120px;" :src="ewm" alt="image" />
            <br>链接：{{ewmurl}}
        </a-modal>
    </div>
</template>
<script>

import ActivityEdit from "@/views/employee/platform/modules/ActivityEdit";
import employeePlatformApi from "@/api/employee/platform";

const columns = [
    {
        title: '活动名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '活动页二维码',
        scopedSlots: { customRender: 'ewm' },
        key: 'ewm',
    },
    {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' },
    },
];

export default {
    components: {ActivityEdit},
    data() {
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            datalist: [],
            columns,
            editVisible: false, //编辑
            ewmVisible: false,
            ewm: '',
            ewmurl: '',
            currentBtn: {}, // 当前点击的操作按钮
            //搜索框表单
            searchForm: {
                keyword: '',
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
            this.request(employeePlatformApi.getActivityList, params).then((res) => {
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
                keyword: '',
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
            this.request(employeePlatformApi.getActivityEdit, {pigcms_id: pigcms_id}, 'GET').then((res) => {
                res.status_bool = res.status ? true : false
                this.currentBtn = {
                    'props': 'ActivityEdit',
                    'title': '编辑活动',
                    'data': res
                }
                this.editVisible = true
                setTimeout(()=>{
                    this.$refs.activityEdit.setFormData(this.currentBtn.data)
                },300)
            })
        },
        handleAdd() {
            this.currentBtn = {
                'props': 'ActivityEdit',
                'title': '添加活动',
                'data': {'name': '', 'pigcms_id': 0, status_bool:true}
            }
            this.editVisible = true
            setTimeout(()=>{
                    this.$refs.activityEdit.setFormData(this.currentBtn.data)
                },300)
        },
        handleDel(pigcms_id) {
            this.request(employeePlatformApi.delActivity, {pigcms_id: pigcms_id}, 'GET').then((res) => {
                this.$message.success('操作成功!', 1)
                setTimeout(() => {
                    this.getDataList()
                },1000)
            })
        },
        showEwm(ewm, url) {
            this.ewm = ewm
            this.ewmurl = url
            this.ewmVisible = true
        },
        ewmCancel() {
            this.ewmVisible = false;
        },
    },
};
</script>