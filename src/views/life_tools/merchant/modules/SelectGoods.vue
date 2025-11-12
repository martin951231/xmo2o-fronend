/**
*******************
*   @description 选择景区门票弹窗
*******************
*/
<template>
  <a-modal
    :title="titleName"
    width="800"
    centered
    :visible="dialogVisible"
    @ok="handleOk"
    @cancel="handleCancel"
    class="dialog"
    :destroyOnClose="true"
  >
    <div class="select-goods">
      <div class="left scroll_content" v-show="!keywords">
        <a-menu
          mode="inline"
          :open-keys="openKeys"
          :selectedKeys="selectedSort"
          @openChange="onOpenChange"
          @select="onSelect"
        >
          <!-- 一级菜单（但是有多级菜单） -->
          <template v-for="menu of sortList">
            <a-sub-menu v-if="menu.children && menu.children.length" :key="menu.id">
              <span slot="title">
                <span>{{ menu.name }}</span>
              </span>
              <template v-if="menu.children && menu.children.length">
                <a-menu-item v-for="sMenu of menu.children" :key="sMenu.id">{{ sMenu.name }}</a-menu-item>
              </template>
            </a-sub-menu>
            <!-- 只有一级菜单 -->
            <a-menu-item v-else :key="menu.id">{{ menu.name }}</a-menu-item>
          </template>
        </a-menu>
      </div>
      <div class="right">
        <div class="top">
          <!-- 返回 -->
          <a-icon v-if="keywords" type="left" class="fs-16 pointer" @click="backToSort()" />
          <!-- 搜索栏 -->
          <a-input-search
            :placeholder="source == 'sport'?'场馆名称':'景区名称'"
            v-model="keywords"
            class="search"
            @change="getGoodsList"
            @search="getGoodsList"
            allow-clear
          />
        </div>
        <div class="bottom">
          <!-- 商品列表 -->
          <a-table
            key="spu_table"
            :row-selection="rowSelection"
            :columns="columns"
            :data-source="tableList"
            rowKey="ticket_id"
            :scroll="{ y: 500 }"
            :pagination="tableList.length ? pagination : false"
          >
            <span slot="ticket_title" slot-scope="text, record">
              <div class="product-info">
                <div>
                  <img :src="record.image" />
                </div>
                <div>{{ record.title }}</div>
              </div>
            </span>
            <span slot="price" slot-scope="text, record">
              <span key="spu_goods">￥{{ record.price }}</span>
            </span>
              <span slot="current_stock" slot-scope="text">
              {{ text == -1 ? '无限量' :  text}}
            </span>
          </a-table>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import mallMerchantApi from '@/api/life_tools/merchant/index'
let _this = null
export default {
  name: 'SelectShopGoods',
  props: {
    // 来源
    source: {
      type: String,
      default: 'shipping',
    },
    // 标签
    targeTage: {
      type: Array,
      default: () => {
        return []
      },
    },
    // 选择约战方式
    group_type: {
      type: Array,
      default: () => {
        return []
      },
    },
    // 单选、多选
    type: {
      type: String,
      default: 'checkbox',
    },
    // 开始时间
    startTime: String,
    // 结束时间
    endTime: String,
    // 已选择的列表
    selectedList: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      titleName:"选择景区门票",
      dialogVisible: false,
      start_time: 0,
      end_time: 0,
      rootSubmenuKeys: [], //1级菜单
      openKeys: [], //展开的菜单id集合
      columns: [
        {
          title: '门票信息',
          dataIndex: 'ticket_title',
          scopedSlots: { customRender: 'ticket_title' },
          width: '300px',
        },
        {
          title: '价格',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' },
          width: '200px',
        },
        {
          title: '当前库存',
          dataIndex: 'stock_num',
          scopedSlots: { customRender: 'current_stock' },
        },
      ],
      menuId: 0,
      hasSelected: [],
      selectedRowKeys: [],
      selectedSort: [],
      sortList: [],
      keywords: '',
      tableList: [],
      oldMenuId: '',
      sList: [],
      isSku: false,
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        onChange: (page, pageSize) => _this.onPageChange(page, pageSize),
      },
    }
  },
  computed: {
    // 表格选择操作
    rowSelection() {
      if (!this.isSku) {
        // spu goods
        return {
          selectedRowKeys: this.selectedRowKeys,
          type: this.type,
          onSelect: this.onRowSelect,
          onSelectAll: this.onSelectAll,
          // onChange: this.onChange,
          getCheckboxProps: (record) => ({
            props: {
              disabled: record.can_be_choose == 0,
            },
          }),
        }
      } else {
        return null
      }
    },
  },
  created() {
    _this = this
  },
  watch: {
    selectedList(val) {
      this.sList = JSON.parse(JSON.stringify(val))
      if(this.source=='sport'){
        this.titleName="选择场馆门票"
      }
    },
  },
  methods: {
    openDialog() {
      this.dialogVisible = true
      this.sList = JSON.parse(JSON.stringify(this.selectedList))

      console.log(this.selectedList,'selectedList')
      this.getSortList()
    },
    // 初始化数据
    init() {
      this.rootSubmenuKeys = []
      this.openKeys = []
      this.selectedSort = []
      this.tableList = []
      this.keywords = ''
      this.start_time = new Date(this.startTime).getTime() / 1000
      this.end_time = new Date(this.endTime).getTime() / 1000
      this.pagination = this.$options.data().pagination
    },

    // 获取左侧分列列表
    getSortList() {
      this.request(mallMerchantApi.getMerchantSort,{source:this.source}).then((res) => {
        if (res.list && res.list.length) {
          this.sortList = res.list
          this.handleDefaultSelect()
        }
      })
    },

    // 默认选中第一个
    handleDefaultSelect() {
      this.init()
      this.sortList.forEach((item, index) => {
        // 一级菜单
        this.rootSubmenuKeys.push(item.id)
        if (item.children && item.children.length) {
          if (index == 0) {
            this.openKeys.push(item.id)
          }
          // 二级菜单
          const sMenu = item.children
          sMenu.forEach((s, index2) => {
            if (s.children && s.children.length) {
              if (index2 == 0) {
                this.openKeys.push(s.id)
              }
              // 三级菜单
            } else if (index == 0 && index2 == 0) {
              // 1级菜单的第1个二级菜单且没有下级菜单了直接选中
              this.menuId = s.id
            }
          })
        } else if (index == 0) {
          // 第一个是一级菜单直接选中
          this.menuId = item.id
        }
      })
      this.selectedSort.push(this.menuId)
      this.getGoodsList()
    },

    // 选中菜单
    onSelect(e) {
      const { key } = e
      this.selectedSort = [key]
      this.menuId = key
      this.$set(this.pagination, 'current', 1)
      this.getGoodsList()
    },

    // 获取商品列表
    getGoodsList() {
      this.tableList = []
      let params = {
        keyword: this.keywords,
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        source:this.source,
        targeTage:this.targeTage,
        group_type:this.group_type
      }
      if (!this.keywords) {
        params.tools_id = this.menuId
      }
      this.request(mallMerchantApi.getLifeToolsTicket, params).then((res) => {
        if (res.list && res.list.length) {
          this.tableList = JSON.parse(JSON.stringify(res.list))
          this.$set(this.pagination, 'total', res.count)
          this.handleList()
        }
      })
    },
    // 处理table数据
    handleList() {
        this.selectedRowKeys = []
        if (this.sList.length) {
          if (this.type == 'radio') {
            if (this.sList.length > 1) {
              this.sList = [this.sList[0]]
            }
            this.selectedRowKeys = [this.sList[0].ticket_id]
          } else {
            this.sList.forEach((item) => {
              this.selectedRowKeys.push(item.ticket_id)
            })
          }
        }
        this.selectedRows = this.sList
    },
    // 点击确认
    handleOk() {
      const { selectedRowKeys, sList } = this
        if (sList.length) {
          this.$emit('submit', { ids: selectedRowKeys, goods: sList })
          this.handleCancel()
        } else {
          this.$message.error('请选择商品')
        }
    },
    handleCancel() {
      // this.init()
      this.dialogVisible = false
    },

    // 展开菜单
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find((key) => this.openKeys.indexOf(key) === -1)
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys
      } else {
        this.openKeys.push(latestOpenKey)
      }
    },
    // 退出搜索
    backToSort() {
      this.keywords = ''
      this.getGoodsList()
    },
    // 选择商品
    onRowSelect(record, selected, selectedRows) {
      if (this.type == 'radio') {
        this.sList = [record]
        this.selectedRowKeys = [record.ticket_id]
      } else {
        if (selected) {
          this.sList.push(record)
          this.selectedRowKeys.push(record.ticket_id)
        } else {
          this.sList.remove(record)
          this.selectedRowKeys.remove(record.ticket_id)
        }
      }
    },
    onSelectAll(selected, selectedRows, changeRows) {
      if (selected) {
        changeRows.map((item) => {
          this.selectedRowKeys.push(item.ticket_id)
          this.sList.push(item)
        })
      } else {
        changeRows.map((item) => {
          this.sList.remove(item)
          this.selectedRowKeys.remove(item.ticket_id)
        })
      }
    },
    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.getGoodsList()
    },
  },
}
Array.prototype.remove = function (val) {
  var index = this.indexOf(val)
  var index2 = -1
  if (index > -1) {
    this.splice(index, 1)
    return
  }
  this.map((item, i) => {
    if (item.goods_id == val.goods_id) {
      index2 = i
    }
  })
  if (index2 > -1) {
    this.splice(index2, 1)
  }
}
</script>

<style scoped lang="less">
.select-goods {
  width: 1000px;
  display: flex;
  .left {
    width: 200px;
    height: 700px;
    border-right: 1px solid #eeeeee;
    overflow: scroll;
  }
  .right {
    flex: 1;
    height: 700px;
    display: flex;
    flex-direction: column;
    .top {
      height: 50px;
      border-bottom: 1px solid #eeeeee;
      line-height: 50px;
      vertical-align: middle;
      .search {
        width: 200px;
        float: right;
        margin-right: 10px;
      }
    }
    .bottom {
      flex: 1;
      padding: 10px;
      .product-info {
        display: flex;
        align-items: center;
        img {
          width: 80px;
          height: 80px;
          margin-right: 15px;
        }
      }
      .pagination {
        float: right;
        margin-top: 10px;
      }
    }
  }
}
</style>