<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="菜单名称">
              <a-input v-model="queryParam.title" placeholder="请输入菜单名称"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="所属类型">
              <a-select v-model="queryParam.type" placeholder="请选择" default-value="0">
                <a-select-option value="1">菜单</a-select-option>
                <a-select-option value="2">按钮</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="路径">
                <a-input v-model="queryParam.path" placeholder="请输入路径"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="更新日期">
                <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入更新日期"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button v-action:query type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" v-action:add @click="$refs.createModal.add()">新建</a-button>
      <a-button type="danger" icon="minus" v-action:delete @click="showDeleteConfirm">删除</a-button>
    </div>
    <s-table
      ref="table"
      size="default"
      rowKey="key"
      :columns="columns"
      :data="loadData"
      :rowSelection="options.rowSelection"
      :showPagination="false"
    >
      <span slot="action" slot-scope="text, record" class="table-action">
        <template>
          <a  v-action:edit>编辑</a>
          <!--          <a-divider type="vertical" v-action:delete />-->
          <a @click="showDeleteConfirm(record)" v-action:delete>删除</a>
        </template>
      </span>
    </s-table>
    <create-form ref="createModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import CreateForm from './modules/CreateForm'
// import { getMenuList } from '@/api/menu'

export default {
  name: 'MenuList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
  },
  data () {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '菜单名称',
          dataIndex: 'title'
        },
        {
          title: '菜单路由',
          dataIndex: 'path'
        },
        {
          title: '所属类型',
          dataIndex: 'type',
          customRender: (text) => text == 1 ? '菜单' : '按钮'
        },
        {
          title: '描述',
          dataIndex: 'description'
        },
        {
          title: '排序',
          dataIndex: 'sort'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        // console.log('getMenuList.parameter', parameter)
        // return getMenuList(Object.assign(parameter, this.queryParam))
        //   .then(res => {
        //     return res.result
        //   })
      },
      selectedRowKeys: [],
      selectedRows: [],

      // custom table alert & rowSelection
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
    }
  },
  created () {
    this.tableOption()
    getMenuList({ t: new Date() })
  },
  methods: {
    tableOption () {
        this.options = {
          alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
              props: {
                disabled: record.no === 'No 2', // Column configuration not to be checked
                name: record.no
              }
            })
          }
        }
    },

    showDeleteConfirm (ids) {
      const _this = this
      this.$confirm({
        title: '确认删除菜单吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          _this.$message.success('删除成功')
        },
        onCancel () {
          _this.$message.info('取消删除')
        }
      })
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>

<style scoped>

</style>
