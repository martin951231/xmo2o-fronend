<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色ID">
              <a-input placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" default-value="0">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">启用</a-select-option>
                <a-select-option value="2">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary">查询</a-button>
              <a-button style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button type="primary" icon="plus" v-action:add >新建</a-button>
      <a-button type="danger" icon="minus" v-action:delete>删除</a-button>
    </div>
    <s-table
      rowKey="id"
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :rowSelection="options.rowSelection"
    >
      <span slot="action" slot-scope="text, record" class="table-action">
        <a v-action:edit @click="handleEdit(record)">编辑</a>
        <a v-action:delete>删除</a>
        <a v-action:enable v-if="record.status == 1" >禁用</a>
        <a v-action:enable v-else >启用</a>
      </span>
      <span slot="status" slot-scope="text">
        <a-tag v-if="text == 1" color="blue">启用</a-tag>
        <a-tag v-else color="red">禁用</a-tag>
      </span>
    </s-table>

    <role-modal ref="modal" @ok="handleOk"></role-modal>

  </a-card>
</template>

<script>
import { STable } from '@/components'
import RoleModal from './modules/RoleModal'
// import { getMenuList, getCheckedMenuList } from '../../../api/menu'

export default {
  name: 'TableList',
  components: {
    STable,
    RoleModal
  },
  data () {
    return {
      visible: false,
      form: null,
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '唯一识别码',
          dataIndex: 'id'
        },
        {
          title: '角色名称',
          dataIndex: 'name'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true
        }, {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return this.$http.get('/role', {
          params: Object.assign(parameter, this.queryParam)
        }).then(res => {
          return res.result
        })
      },

      selectedRowKeys: [],
      selectedRows: [],
      options: {
        rowSelection: {
          // selectedRowKeys: this.selectedRowKeys,
          // onChange: this.onSelectChange
        }
      },
      menuList: []
    }
  },
  mounted () {
    this.getMenu()
  },
  methods: {
    getMenu () {
      // getMenuList().then((res) => {
      //   this.menuList = res.result.data
      // })
    },
    handleEdit (record) {
      console.log(record.id)
      // getCheckedMenuList({ id: record.id }).then((res) => {
      //   const data = res.result.data
      //   this.$refs.modal.openModal({ menu: this.menuList, checked: data })
      // })
    },
    handleOk () {
      // 新增/修改 成功时，重载列表
      this.$refs.table.refresh()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  }
}
</script>
