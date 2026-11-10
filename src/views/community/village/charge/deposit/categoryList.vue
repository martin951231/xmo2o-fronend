<template>
  <div class="deposit-category-page">
    <div class="toolbar">
      <a-button type="primary" @click="openEdit()">新增分类</a-button>
    </div>
    <a-table
      rowKey="id"
      :columns="columns"
      :data-source="list"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <span slot="status" slot-scope="text, record">
        <a-badge :status="record.status == 1 ? 'success' : 'default'" :text="record.status == 1 ? '启用' : '禁用'" />
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="openEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="toggleStatus(record)">{{ record.status == 1 ? '禁用' : '启用' }}</a>
        <a-divider type="vertical" />
        <a-popconfirm title="确定删除这个押金分类吗？" @confirm="deleteCate(record)">
          <a>删除</a>
        </a-popconfirm>
      </span>
    </a-table>

    <a-modal
      :title="form.id ? '编辑押金分类' : '新增押金分类'"
      :visible="visible"
      :confirm-loading="saving"
      @ok="submit"
      @cancel="visible = false"
    >
      <a-form-model :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
        <a-form-model-item label="分类名" required>
          <a-input v-model="form.cate_name" placeholder="请输入押金分类名" :maxLength="50" />
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-switch v-model="form.status" :checked-value="1" :un-checked-value="0" checked-children="启用" un-checked-children="禁用" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import villageApi from '@/api/community/village'

export default {
  name: 'HouseDepositCateIndex',
  data () {
    return {
      loading: false,
      saving: false,
      visible: false,
      list: [],
      form: {
        id: 0,
        cate_name: '',
        cate_key: '',
        status: 1
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        { title: 'ID', dataIndex: 'id', width: 90 },
        { title: '分类名', dataIndex: 'cate_name' },
        { title: '关键字', dataIndex: 'cate_key', width: 180 },
        { title: '状态', dataIndex: 'status', scopedSlots: { customRender: 'status' }, width: 120 },
        { title: '新增时间', dataIndex: 'add_time_text', width: 180 },
        { title: '修改时间', dataIndex: 'update_time_text', width: 180 },
        { title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: 180 }
      ]
    }
  },
  activated () {
    this.getList(1)
  },
  mounted () {
    this.getList(1)
  },
  methods: {
    getList (resetPage) {
      if (resetPage) {
        this.pagination.current = 1
      }
      this.loading = true
      this.request(villageApi.depositCategoryList, {
        page: this.pagination.current,
        page_size: this.pagination.pageSize
      }).then(res => {
        this.list = res.list || []
        this.pagination.total = Number(res.count || 0)
        this.pagination.pageSize = Number(res.total_limit || this.pagination.pageSize)
      }).finally(() => {
        this.loading = false
      })
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getList()
    },
    openEdit (record) {
      this.form = {
        id: record ? record.id : 0,
        cate_name: record ? record.cate_name : '',
        cate_key: record ? (record.cate_key || record.category_key || '') : '',
        status: record ? Number(record.status) : 1
      }
      this.visible = true
    },
    submit () {
      if (!this.form.cate_name || !this.form.cate_name.trim()) {
        this.$message.warning('请输入押金分类名')
        return
      }
      this.saving = true
      this.request(villageApi.depositCategorySave, this.form).then(() => {
        this.$message.success('保存成功')
        this.visible = false
        this.getList(!this.form.id)
      }).finally(() => {
        this.saving = false
      })
    },
    toggleStatus (record) {
      this.request(villageApi.depositCategoryStatus, {
        id: record.id,
        status: record.status == 1 ? 0 : 1
      }).then(() => {
        this.$message.success('操作成功')
        this.getList()
      })
    },
    deleteCate (record) {
      this.request(villageApi.depositCategoryDelete, { id: record.id }).then(() => {
        this.$message.success('删除成功')
        this.getList(1)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.deposit-category-page {
  margin: 24px;
  padding: 20px;
  background: #fff;
}

.toolbar {
  margin-bottom: 16px;
}
</style>
