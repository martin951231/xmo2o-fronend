<template>
  <div class="approval-type-page">
    <div class="search-box">
      <a-form layout="inline">
        <a-form-item label="业务类型">
          <a-input v-model="search.keyword" style="width: 220px" allowClear placeholder="请输入名称或标识" />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model="search.status" style="width: 120px">
            <a-select-option :value="-1">全部</a-select-option>
            <a-select-option :value="1">启用</a-select-option>
            <a-select-option :value="0">停用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="getList(true)">查询</a-button>
          <a-button style="margin-left: 8px" @click="resetSearch">重置</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-operator">
      <!-- <a-button type="primary" icon="plus" @click="openEdit()">新增业务类型</a-button> -->
      <a-button style="margin-left: 8px" icon="rollback" @click="goFlowList">返回审批流</a-button>
    </div>
    <a-table
      rowKey="id"
      :columns="columns"
      :data-source="list"
      :pagination="pagination"
      :loading="loading"
      @change="tableChange">
      <span slot="status" slot-scope="text">
        <a-tag :color="text == 1 ? 'green' : 'red'">{{ text == 1 ? '启用' : '停用' }}</a-tag>
      </span>
      <span slot="is_system" slot-scope="text">
        <a-tag :style="text == 1 ? systemSourceTagStyle : customSourceTagStyle">
          {{ text == 1 ? '系统内置' : '自定义' }}
        </a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="openEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm
          :title="record.status == 1 ? '确认停用该业务类型？' : '确认启用该业务类型？'"
          @confirm="changeStatus(record)">
          <a>{{ record.status == 1 ? '停用' : '启用' }}</a>
        </a-popconfirm>
      </span>
    </a-table>

    <a-modal
      :title="form.id ? '编辑业务类型' : '新增业务类型'"
      :visible="visible"
      :confirmLoading="saving"
      @ok="submit"
      @cancel="visible = false">
      <a-form-model ref="formRef" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
        <a-form-model-item label="类型名称" prop="type_name">
          <a-input v-model="form.type_name" placeholder="请输入类型名称" />
        </a-form-model-item>
        <a-form-model-item label="类型标识" prop="type_key">
          <a-input
            v-model.trim="form.type_key"
            :disabled="!!form.id && form.is_system == 1"
            placeholder="请输入押金分类关键字，例如 deposit_1" />
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-radio-group v-model="form.status">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">停用</a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import villageApi from '@/api/community/village'

const defaultForm = () => ({
    id: 0,
    type_name: '',
    type_key: '',
    is_system: 0,
    status: 1
})

export default {
    name: 'ApprovalBusinessType',
    data () {
        return {
            loading: false,
            saving: false,
            visible: false,
            list: [],
            form: defaultForm(),
            search: {
                keyword: '',
                status: -1,
                page: 1,
                page_size: 10
            },
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0
            },
            systemSourceTagStyle: {
                color: '#096dd9',
                backgroundColor: '#e6f7ff',
                borderColor: '#91d5ff'
            },
            customSourceTagStyle: {
                color: '#595959',
                backgroundColor: '#f0f2f5',
                borderColor: '#d9d9d9'
            },
            columns: [
                { title: '类型名称', dataIndex: 'type_name', key: 'type_name' },
                { title: '类型标识', dataIndex: 'type_key', key: 'type_key' },
                { title: '来源', dataIndex: 'is_system', key: 'is_system', width: 110, scopedSlots: { customRender: 'is_system' } },
                { title: '状态', dataIndex: 'status', key: 'status', width: 100, scopedSlots: { customRender: 'status' } },
                { title: '更新时间', dataIndex: 'update_time_text', key: 'update_time_text', width: 180 },
                { title: '操作', dataIndex: 'action', key: 'action', width: 160, scopedSlots: { customRender: 'action' } }
            ],
            rules: {
                type_name: [{ required: true, message: '请输入类型名称', trigger: 'blur' }],
                type_key: [
                    { required: true, message: '请输入类型标识', trigger: 'blur' },
                    { pattern: /^[a-z][a-z0-9_]*$/, message: '只能使用小写字母、数字、下划线，并以字母开头', trigger: 'blur' }
                ]
            }
        }
    },
    mounted () {
        this.getList(true)
    },
    methods: {
        getList (resetPage) {
            if (resetPage) {
                this.search.page = 1
                this.pagination.current = 1
            }
            this.loading = true
            this.request(villageApi.approvalBusinessTypeList, this.search).then(res => {
                this.list = res.list || []
                this.pagination.total = res.count || 0
                this.pagination.pageSize = res.page_size || this.search.page_size
            }).finally(() => {
                this.loading = false
            })
        },
        resetSearch () {
            this.search = {
                keyword: '',
                status: -1,
                page: 1,
                page_size: 10
            }
            this.getList(true)
        },
        tableChange (pagination) {
            this.search.page = pagination.current
            this.pagination.current = pagination.current
            this.getList(false)
        },
        openEdit (record) {
            this.form = record ? Object.assign(defaultForm(), record) : defaultForm()
            this.visible = true
            this.$nextTick(() => {
                this.$refs.formRef && this.$refs.formRef.clearValidate()
            })
        },
        submit () {
            this.$refs.formRef.validate(valid => {
                if (!valid) {
                    return
                }
                this.saving = true
                this.request(villageApi.approvalBusinessTypeSave, this.form).then(() => {
                    this.$message.success('保存成功')
                    this.visible = false
                    this.getList(false)
                }).finally(() => {
                    this.saving = false
                })
            })
        },
        changeStatus (record) {
            this.request(villageApi.approvalBusinessTypeStatus, {
                id: record.id,
                status: Number(record.status) === 1 ? 0 : 1
            }).then(() => {
                this.$message.success('操作成功')
                this.getList(false)
            })
        },
        goFlowList () {
            this.$router.push('/village/village.approvalflow/approvalflow_list')
        }
    }
}
</script>

<style scoped>
.approval-type-page .search-box {
    margin-bottom: 16px;
}
.approval-type-page .table-operator {
    margin-bottom: 16px;
}
</style>
