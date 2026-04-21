<template>
  <div class="cloud-access-page">
    <a-card :bordered="false">
      <div class="page-header">
        <div>
          <div class="page-title">门禁设备管理</div>
          <div class="page-desc">维护门禁设备基础信息，供感应器授权和出入记录关联使用。</div>
        </div>
        <a-button type="primary" icon="plus" @click="openModal()">
          添加设备
        </a-button>
      </div>

      <div class="filter-wrap">
        <a-form-model layout="inline" :model="searchForm">
          <a-form-model-item label="设备序列号">
            <a-input
              v-model="searchForm.serial_num"
              allow-clear
              placeholder="请输入设备序列号"
              @keyup.enter.native="handleSearch"
            />
          </a-form-model-item>
          <a-form-model-item label="设备位置">
            <a-input
              v-model="searchForm.address"
              allow-clear
              placeholder="请输入设备位置"
              @keyup.enter.native="handleSearch"
            />
          </a-form-model-item>
          <a-form-model-item label="启用状态">
            <a-select v-model="searchForm.enable" allow-clear placeholder="请选择状态" style="width: 140px">
              <a-select-option :value="1">启用</a-select-option>
              <a-select-option :value="0">禁用</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
            <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </div>

      <a-table
        row-key="id"
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="enable" slot-scope="text">
          <a-tag :color="Number(text) === 1 ? 'green' : 'default'">
            {{ Number(text) === 1 ? '启用' : '禁用' }}
          </a-tag>
        </template>
        <template slot="action" slot-scope="text, record">
          <a @click="openModal(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除该设备吗？" ok-text="确认" cancel-text="取消" @confirm="handleDelete(record)">
            <a class="action-danger">删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>

    <a-modal
      :title="modalTitle"
      :visible="modalVisible"
      :confirm-loading="submitting"
      destroy-on-close
      width="640px"
      @ok="handleSubmit"
      @cancel="closeModal"
    >
      <a-form-model
        ref="formRef"
        :model="formData"
        :rules="rules"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 17 }"
      >
        <a-form-model-item label="设备序列号" prop="serial_num">
          <a-input v-model="formData.serial_num" :max-length="10" placeholder="请输入设备序列号" />
        </a-form-model-item>
        <a-form-model-item label="设备位置" prop="address">
          <a-input v-model="formData.address" :max-length="255" placeholder="请输入设备位置" />
        </a-form-model-item>
        <a-form-model-item label="启用状态" prop="enable">
          <a-radio-group v-model="formData.enable">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">禁用</a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import villageDeviceApi from '@/api/community/village/device'
import { getSystemName } from '@/utils/util'

const defaultSearchForm = () => ({
  serial_num: '',
  address: '',
  enable: undefined
})

const defaultFormData = () => ({
  id: 0,
  serial_num: '',
  address: '',
  enable: 1
})

export default {
  name: 'CloudAccessDeviceList',
  data () {
    return {
      loading: false,
      submitting: false,
      modalVisible: false,
      modalTitle: '添加设备',
      tokenName: 'village_access_token',
      searchForm: defaultSearchForm(),
      formData: defaultFormData(),
      tableData: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: total => `共 ${total} 条`
      },
      columns: [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 90 },
        { title: '设备序列号', dataIndex: 'serial_num', key: 'serial_num', width: 160 },
        { title: '设备位置', dataIndex: 'address', key: 'address' },
        { title: '启用状态', dataIndex: 'enable', key: 'enable', width: 120, scopedSlots: { customRender: 'enable' } },
        { title: '添加时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
        { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 180 },
        { title: '操作', key: 'action', width: 160, scopedSlots: { customRender: 'action' } }
      ],
      rules: {
        serial_num: [
          { required: true, message: '请输入设备序列号', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入设备位置', trigger: 'blur' }
        ],
        enable: [
          { required: true, message: '请选择启用状态', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    const sysName = getSystemName(location.hash) || 'village'
    this.tokenName = sysName + '_access_token'
    this.fetchList()
  },
  methods: {
    fetchList () {
      this.loading = true
      const params = {
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        tokenName: this.tokenName,
        ...this.searchForm
      }
      this.request(villageDeviceApi.accessDeviceIndex, params)
        .then((res) => {
          this.tableData = res.list || []
          this.pagination.total = Number(res.count || 0)
          this.pagination.pageSize = Number(res.pageSize || this.pagination.pageSize)
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleSearch () {
      this.pagination.current = 1
      this.fetchList()
    },
    handleReset () {
      this.searchForm = defaultSearchForm()
      this.pagination.current = 1
      this.fetchList()
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.fetchList()
    },
    openModal (record) {
      this.modalVisible = true
      this.modalTitle = record && record.id ? '编辑设备' : '添加设备'
      this.formData = record
        ? {
            id: Number(record.id),
            serial_num: record.serial_num || '',
            address: record.address || '',
            enable: Number(record.enable)
          }
        : defaultFormData()
      this.$nextTick(() => {
        if (this.$refs.formRef) {
          this.$refs.formRef.clearValidate()
        }
      })
    },
    closeModal () {
      this.modalVisible = false
      this.formData = defaultFormData()
    },
    handleSubmit () {
      this.$refs.formRef.validate((valid) => {
        if (!valid) {
          return false
        }
        this.submitting = true
        const api = this.formData.id ? villageDeviceApi.accessDeviceEdit : villageDeviceApi.accessDeviceAdd
        this.request(api, {
          ...this.formData,
          tokenName: this.tokenName
        })
          .then(() => {
            this.$message.success(this.formData.id ? '设备更新成功' : '设备添加成功')
            this.closeModal()
            this.fetchList()
          })
          .finally(() => {
            this.submitting = false
          })
      })
    },
    handleDelete (record) {
      this.request(villageDeviceApi.accessDeviceDelete, {
        id: record.id,
        tokenName: this.tokenName
      }).then(() => {
        this.$message.success('设备删除成功')
        if (this.tableData.length === 1 && this.pagination.current > 1) {
          this.pagination.current -= 1
        }
        this.fetchList()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.cloud-access-page {
  padding: 16px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-title {
  color: #1f2329;
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
}

.page-desc {
  margin-top: 4px;
  color: #8c8c8c;
  line-height: 22px;
}

.filter-wrap {
  padding: 16px 16px 0;
  margin-bottom: 16px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}

.action-danger {
  color: #ff4d4f;
}

/deep/ .ant-form-item {
  margin-bottom: 16px;
}
</style>
