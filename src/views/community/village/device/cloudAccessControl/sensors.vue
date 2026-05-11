<template>
  <div class="cloud-access-page">
    <a-card :bordered="false">
      <div class="page-header">
        <div>
          <div class="page-title">门禁感应器管理</div>
          <div class="page-desc">维护感应器编码和关联编号，并查看白名单已下发到哪些控制器。</div>
        </div>
        <a-button type="primary" icon="plus" @click="openModal()">
          添加感应器
        </a-button>
      </div>

      <div class="filter-wrap">
        <a-form-model layout="inline" :model="searchForm">
          <a-form-model-item label="感应器编码">
            <a-input
              v-model="searchForm.code"
              allow-clear
              placeholder="请输入感应器编码"
              @keyup.enter.native="handleSearch"
            />
          </a-form-model-item>
          <a-form-model-item label="关联编号">
            <a-input
              v-model="searchForm.parking_num"
              allow-clear
              placeholder="请输入关联编号"
              @keyup.enter.native="handleSearch"
            />
          </a-form-model-item>
          <a-form-model-item label="启用状态">
            <a-select v-model="searchForm.enable" allow-clear placeholder="请选择状态" style="width: 140px">
              <a-select-option :value="1">启用</a-select-option>
              <a-select-option :value="0">禁用</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="是否绑定业主">
            <a-select v-model="searchForm.is_bind_owner" allow-clear placeholder="请选择" style="width: 150px">
              <a-select-option :value="1">已绑定</a-select-option>
              <a-select-option :value="0">未绑定</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
            <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
            <a-button style="margin-left: 8px" icon="download" :loading="exporting" @click="handleExport">
              导出
            </a-button>
            <a-upload
              accept=".xlsx,.xls,.csv,.txt"
              name="file"
              :action="importAction"
              :data="importData"
              :headers="importHeaders"
              :showUploadList="false"
              :before-upload="beforeImportSensors"
              @change="handleImportChange"
            >
              <a-button style="margin-left: 8px" icon="upload" :loading="importing">导入</a-button>
            </a-upload>
            <a-button style="margin-left: 8px" icon="download" @click="handleDownloadTemplate">导出模板</a-button>
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
          <a-tag :color="Number(text) === 1 ? 'green' : '#8c8c8c'">
            {{ Number(text) === 1 ? '启用' : '禁用' }}
          </a-tag>
        </template>
        <template slot="whitelistStatus" slot-scope="text, record">
          <a-tag :color="Number(text) === 1 ? 'green' : 'orange'">
            {{ Number(text) === 1 ? '已全部下发' : '待下发' }}
          </a-tag>
          <span class="progress-text">{{ record.whitelist_progress || '0/0' }}</span>
        </template>
        <template slot="whitelistDevices" slot-scope="text, record">
          <div class="device-delivery-cell">
            <div v-if="record.whitelist_device_list && record.whitelist_device_list.length" class="device-tags">
              <a-tag
                v-for="item in record.whitelist_device_list"
                :key="item.device_id"
                color="blue"
                class="device-tag"
              >
                {{ item.label }}
              </a-tag>
            </div>
            <span v-else class="device-empty">暂无</span>
          </div>
        </template>
        <template slot="ownerBind" slot-scope="text">
          {{ text || '未绑定' }}
        </template>
        <template slot="action" slot-scope="text, record">
          <a @click="openModal(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除该感应器吗？" ok-text="确认" cancel-text="取消" @confirm="handleDelete(record)">
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
        <a-form-model-item label="感应器编码" prop="code">
          <a-input v-model="formData.code" :max-length="50" placeholder="请输入感应器编码" />
        </a-form-model-item>
        <a-form-model-item label="关联编号" prop="parking_num">
          <a-input v-model="formData.parking_num" :max-length="50" placeholder="请输入关联编号" />
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
import Vue from 'vue'
import villageDeviceApi from '@/api/community/village/device'
import { getSystemName } from '@/utils/util'

const defaultSearchForm = () => ({
  code: '',
  parking_num: '',
  enable: undefined,
  is_bind_owner: undefined
})

const defaultFormData = () => ({
  id: 0,
  code: '',
  parking_num: '',
  enable: 1
})

export default {
  name: 'CloudAccessSensorsList',
  data () {
    return {
      loading: false,
      submitting: false,
      exporting: false,
      importing: false,
      importAction: '/v20/public/index.php' + villageDeviceApi.accessSensorsImport,
      importData: {
        system_type: 'village',
        enable: 0
      },
      importHeaders: {},
      crcTableCache: null,
      modalVisible: false,
      modalTitle: '添加感应器',
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
        { title: '感应器编码', dataIndex: 'code', key: 'code', width: 220 },
        { title: '关联编号', dataIndex: 'parking_num', key: 'parking_num', width: 180 },
        { title: '启用状态', dataIndex: 'enable', key: 'enable', width: 120, scopedSlots: { customRender: 'enable' } },
        { title: '是否绑定业主', dataIndex: 'owner_bind_text', key: 'owner_bind_text', width: 160, scopedSlots: { customRender: 'ownerBind' } },
        { title: '下发状态', dataIndex: 'is_add_to_whitelist', key: 'is_add_to_whitelist', width: 180, scopedSlots: { customRender: 'whitelistStatus' } },
        { title: '已下发控制器', dataIndex: 'whitelist_device_names', key: 'whitelist_device_names', scopedSlots: { customRender: 'whitelistDevices' } },
        { title: '添加时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
        { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 180 },
        { title: '操作', key: 'action', width: 160, scopedSlots: { customRender: 'action' } }
      ],
      rules: {
        code: [
          { required: true, message: '请输入感应器编码', trigger: 'blur' }
        ],
        parking_num: [
          { required: true, message: '请输入关联编号', trigger: 'blur' }
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
    this.importData.system_type = sysName
    this.importHeaders = {
      ticket: Vue.ls.get(this.tokenName) || ''
    }
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
      this.request(villageDeviceApi.accessSensorsIndex, params)
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
      this.modalTitle = record && record.id ? '编辑感应器' : '添加感应器'
      this.formData = record
        ? {
            id: Number(record.id),
            code: record.code || '',
            parking_num: record.parking_num || '',
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
        const api = this.formData.id ? villageDeviceApi.accessSensorsEdit : villageDeviceApi.accessSensorsAdd
        this.request(api, {
          ...this.formData,
          tokenName: this.tokenName
        })
          .then(() => {
            this.$message.success(this.formData.id ? '感应器更新成功' : '感应器添加成功')
            this.closeModal()
            this.fetchList()
          })
          .finally(() => {
            this.submitting = false
          })
      })
    },
    handleDelete (record) {
      this.request(villageDeviceApi.accessSensorsDelete, {
        id: record.id,
        tokenName: this.tokenName
      }).then(() => {
        this.$message.success('感应器删除成功')
        if (this.tableData.length === 1 && this.pagination.current > 1) {
          this.pagination.current -= 1
        }
        this.fetchList()
      })
    },
    beforeImportSensors (file) {
      if (this.importing) {
        this.$message.warning('正在导入，请稍后')
        return false
      }
      const fileName = file.name || ''
      if (!/\.(xlsx|xls|csv|txt)$/i.test(fileName)) {
        this.$message.warning('请上传 Excel 或 CSV 文件')
        return false
      }
      this.importHeaders = {
        ticket: Vue.ls.get(this.tokenName) || ''
      }
      this.importData = {
        system_type: getSystemName(this.tokenName) || 'village',
        enable: 0
      }
      this.importing = true
      return true
    },
    handleImportChange (info) {
      if (info.file.status === 'uploading') {
        this.importing = true
        return
      }
      if (info.file.status === 'done') {
        this.importing = false
        const response = info.file.response || {}
        if (this.isImportSuccess(response)) {
          const data = response.data || {}
          const count = data.success_count || data.count
          const failCount = Number(data.fail_count || 0)
          const message = count ? `成功导入 ${count} 条感应器` : '导入成功'
          this.$message.success(failCount ? `${message}，跳过 ${failCount} 条` : message)
          this.pagination.current = 1
          this.fetchList()
        } else {
          this.$message.error(response.msg || response.message || '导入失败')
        }
      } else if (info.file.status === 'error') {
        this.importing = false
        this.$message.error('上传失败')
      }
    },
    isImportSuccess (response) {
      return response.status === 1000 || response.err_code === 0 || response.error === 0 || response.code === 0
    },
    handleDownloadTemplate () {
      const headers = ['序号', '表面码', 'EPC', 'TID', 'code']
      const rows = [
        headers,
        ['', '', '', '', '']
      ]
      const blob = this.createXlsxBlob(rows)
      this.downloadBlob(blob, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', `门禁感应器导入模板_${this.formatExportTime()}.xlsx`)
    },
    createXlsxBlob (rows) {
      const sheetRows = rows.map((row, rowIndex) => {
        const cells = row.map((cell, cellIndex) => {
          const ref = `${this.indexToColumn(cellIndex + 1)}${rowIndex + 1}`
          return `<c r="${ref}" t="inlineStr"><is><t>${this.escapeHtml(cell)}</t></is></c>`
        }).join('')
        return `<row r="${rowIndex + 1}">${cells}</row>`
      }).join('')
      const entries = {
        '[Content_Types].xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>',
        '_rels/.rels': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
        'xl/workbook.xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets></workbook>',
        'xl/_rels/workbook.xml.rels': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>',
        'xl/worksheets/sheet1.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheetRows}</sheetData></worksheet>`
      }
      return new Blob([this.createStoredZip(entries)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    },
    createStoredZip (entries) {
      const encoder = new TextEncoder()
      const localParts = []
      const centralParts = []
      let offset = 0
      Object.keys(entries).forEach(name => {
        const nameBytes = encoder.encode(name)
        const data = encoder.encode(entries[name])
        const crc = this.crc32(data)
        const localHeader = this.zipHeader([0x50, 0x4b, 0x03, 0x04], [
          [20, 2], [0, 2], [0, 2], [0, 2], [0, 2], [crc, 4], [data.length, 4], [data.length, 4], [nameBytes.length, 2], [0, 2]
        ])
        localParts.push(localHeader, nameBytes, data)
        const centralHeader = this.zipHeader([0x50, 0x4b, 0x01, 0x02], [
          [20, 2], [20, 2], [0, 2], [0, 2], [0, 2], [0, 2], [crc, 4], [data.length, 4], [data.length, 4], [nameBytes.length, 2], [0, 2], [0, 2], [0, 2], [0, 2], [0, 4], [offset, 4]
        ])
        centralParts.push(centralHeader, nameBytes)
        offset += localHeader.length + nameBytes.length + data.length
      })
      const centralOffset = offset
      const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0)
      const end = this.zipHeader([0x50, 0x4b, 0x05, 0x06], [
        [0, 2], [0, 2], [Object.keys(entries).length, 2], [Object.keys(entries).length, 2], [centralSize, 4], [centralOffset, 4], [0, 2]
      ])
      const size = localParts.reduce((sum, part) => sum + part.length, 0) + centralSize + end.length
      const output = new Uint8Array(size)
      let cursor = 0
      localParts.concat(centralParts, [end]).forEach(part => {
        output.set(part, cursor)
        cursor += part.length
      })
      return output
    },
    zipHeader (signature, fields) {
      const length = signature.length + fields.reduce((sum, field) => sum + field[1], 0)
      const bytes = new Uint8Array(length)
      bytes.set(signature, 0)
      const view = new DataView(bytes.buffer)
      let offset = signature.length
      fields.forEach(field => {
        if (field[1] === 2) {
          view.setUint16(offset, field[0], true)
        } else {
          view.setUint32(offset, field[0], true)
        }
        offset += field[1]
      })
      return bytes
    },
    crc32 (data) {
      let crc = -1
      for (let i = 0; i < data.length; i += 1) {
        crc = (crc >>> 8) ^ this.crcTable()[(crc ^ data[i]) & 0xff]
      }
      return (crc ^ -1) >>> 0
    },
    crcTable () {
      if (this.crcTableCache) {
        return this.crcTableCache
      }
      this.crcTableCache = Array.from({ length: 256 }, (item, index) => {
        let crc = index
        for (let i = 0; i < 8; i += 1) {
          crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1
        }
        return crc >>> 0
      })
      return this.crcTableCache
    },
    indexToColumn (index) {
      let column = ''
      while (index > 0) {
        const mod = (index - 1) % 26
        column = String.fromCharCode(65 + mod) + column
        index = Math.floor((index - mod) / 26)
      }
      return column
    },
    async handleExport () {
      this.exporting = true
      try {
        const exportList = await this.fetchExportList()
        if (!exportList.length) {
          this.$message.warning('暂无可导出的数据')
          return
        }
        const headers = ['感应器编码', '关联编号', '是否绑定业主', '下发状态', '下发进度', '已下发控制器']
        const rows = exportList.map(item => [
          item.code || '',
          item.parking_num || '',
          item.owner_bind_text || '未绑定',
          Number(item.is_add_to_whitelist) === 1 ? '已全部下发' : '待下发',
          item.whitelist_progress || '',
          item.whitelist_device_names || ''
        ])
        this.downloadCsv(headers, rows)
        this.$message.success(`成功导出 ${exportList.length} 条数据`)
      } finally {
        this.exporting = false
      }
    },
    async fetchExportList () {
      const pageSize = 200
      let page = 1
      let total = 0
      const exportList = []
      while (true) {
        const res = await this.request(villageDeviceApi.accessSensorsIndex, {
          page,
          pageSize,
          tokenName: this.tokenName,
          ...this.searchForm
        })
        const list = res.list || []
        if (page === 1) {
          total = Number(res.count || list.length)
        }
        exportList.push(...list)
        if (!list.length || list.length < pageSize || exportList.length >= total) {
          break
        }
        page += 1
      }
      return exportList
    },
    downloadCsv (headers, rows) {
      const csvText = '\uFEFF' + [headers, ...rows]
        .map(row => row.map(this.escapeCsvValue).join(','))
        .join('\r\n')
      this.downloadBlob(csvText, 'text/csv;charset=utf-8;', `门禁感应器导出_${this.formatExportTime()}.csv`)
    },
    downloadBlob (content, type, fileName) {
      const blob = content instanceof Blob ? content : new Blob([content], { type })
      const url = window.URL.createObjectURL(blob)
      const downloadLink = document.createElement('a')
      downloadLink.href = url
      downloadLink.download = fileName
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      window.URL.revokeObjectURL(url)
    },
    escapeCsvValue (value) {
      return `"${String(value == null ? '' : value).replace(/"/g, '""')}"`
    },
    escapeHtml (value) {
      return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
    },
    formatExportTime () {
      const date = new Date()
      const year = date.getFullYear()
      const month = `${date.getMonth() + 1}`.padStart(2, '0')
      const day = `${date.getDate()}`.padStart(2, '0')
      const hour = `${date.getHours()}`.padStart(2, '0')
      const minute = `${date.getMinutes()}`.padStart(2, '0')
      const second = `${date.getSeconds()}`.padStart(2, '0')
      return `${year}${month}${day}${hour}${minute}${second}`
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

.progress-text {
  margin-left: 8px;
  color: #8c8c8c;
}

.device-delivery-cell {
  min-height: 32px;
}

.device-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.device-tag {
  margin-right: 0;
}

.device-empty {
  color: #bfbfbf;
}

/deep/ .ant-form-item {
  margin-bottom: 16px;
}
</style>
