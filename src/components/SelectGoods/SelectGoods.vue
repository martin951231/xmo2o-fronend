/**
*******************
*   @author Liz
*   @date 2020-08-11
*   @description 选择商品弹窗
*******************
*/
<template>
  <a-modal
    :title="L('选择商品')"
    width="800"
    centered
    :visible="dialogVisible"
    @ok="handleOk"
    @cancel="handleCancel"
    class="dialog"
    :destroyOnClose="true"
  >
    <div class="select-goods">
      <div class="left scrollbar">
        <a-menu
          mode="inline"
          :open-keys="openKeys"
          :selectedKeys="defaultSelectedKey"
          @openChange="onOpenChange"
          @select="onSelect"
        >
          <!-- 一级菜单（但是有多级菜单） -->
          <template v-for="menu of menuList">
            <a-sub-menu v-if="menu.children && menu.children.length" :key="menu.sort_id">
              <span slot="title">
                <span>{{ menu.sort_name }}</span>
              </span>
              <template v-if="menu.children && menu.children.length">
                <template v-for="sMenu of menu.children">
                  <!-- 三级菜单-->
                  <template v-if="sMenu.children && sMenu.children.length">
                    <a-sub-menu :key="sMenu.sort_id" :title="sMenu.sort_name">
                      <a-menu-item v-for="tMenu of sMenu.children" :key="tMenu.sort_id">{{
                        tMenu.sort_name
                      }}</a-menu-item>
                    </a-sub-menu>
                  </template>
                  <!-- 二级菜单 -->
                  <template v-else>
                    <a-menu-item :key="sMenu.sort_id">{{ sMenu.sort_name }}</a-menu-item>
                  </template>
                </template>
              </template>
            </a-sub-menu>
            <!-- 只有一级菜单 -->
            <a-menu-item v-else :key="menu.sort_id">{{ menu.sort_name }}</a-menu-item>
          </template>
        </a-menu>
      </div>
      <div class="right">
        <div class="top">
          <!-- 搜索栏 -->
          <a-input-search
            :placeholder="L('商品名称')"
            class="search"
            v-model="keywords"
            @search="onSearch"
            @change="onSearchChange"
          />
        </div>
        <div class="bottom">
          <!-- 商品列表 -->
          <a-table
            :row-selection="rowSelection"
            :columns="columns"
            :data-source="list"
            rowKey="goods_id"
            :scroll="{ y: 500 }"
          >
            <span slot="name" slot-scope="text, record">
              <div class="product-info">
                <div>
                  <img :src="record.image" />
                </div>
                <div style="margin-left: 10px">
                  <p class="product-name">{{ text }}</p>
                  <!-- <p>{{ record.code }}</p> -->
                </div>
              </div>
            </span>
          </a-table>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'SelectGoods',
  props: {
    // 打开弹框
    visible: {
      type: Boolean,
      default: false,
    },
    // 菜单列表
    menuList: {
      type: Array,
      default: () => {
        return []
      },
    },
    // table list
    list: {
      type: Array,
      default: () => {
        return []
      },
    },
    selectedList: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      rootSubmenuKeys: [], //1级菜单
      openKeys: [], //展开的菜单id集合
      columns: [
        {
          title: this.L('商品'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: this.L('价格'),
          dataIndex: 'price',
        },
        // {
        //   title: '备注',
        //   dataIndex: 'remark',
        // },
      ],
      menuId: 0,
      selectedRowKeys: [],
      selectedRows: [],
      defaultSelectedKey: [],
      keywords: '',
      sList: [],
    }
  },
  computed: {
    // 表格选择操作
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onSelect: this.onRowSelect,
        onSelectAll: this.onSelectAll,
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.can_be_choose == 0, // 团购套餐分组，菜品不可重复添加
          },
        }),
      }
    },
  },
  watch: {
    visible(newVal, oldVal) {
      this.dialogVisible = newVal
      if (newVal) {
        this.handleMenuList()
        this.handleList()
      }
    },
    menuList() {
      this.handleMenuList()
    },
    list() {
      this.handleList()
    },
    selectedList(val) {
      this.sList = JSON.parse(JSON.stringify(val))
    },
  },
  mounted() {
    this.dialogVisible = this.visible
    this.handleMenuList()
    this.handleList()
    this.sList = JSON.parse(JSON.stringify(this.selectedList))
  },
  methods: {
    // 初始化数据
    init() {
      this.rootSubmenuKeys = []
      this.openKeys = []
      this.defaultSelectedKey = []
      this.keywords = ''
      this.currentPage = 1
    },
    // 列表处理
    handleMenuList() {
      this.init()
      this.menuList.forEach((item, index) => {
        // 一级菜单
        this.rootSubmenuKeys.push(item.sort_id)
        if (item.children && item.children.length) {
          if (index == 0) {
            this.openKeys.push(item.sort_id)
          }
          // 二级菜单
          const sMenu = item.children
          sMenu.forEach((s, index2) => {
            if (s.children && s.children.length) {
              if (index2 == 0) {
                this.openKeys.push(s.sort_id)
              }
              // 三级菜单
              const tMenu = s.children
              tMenu.forEach((t, index3) => {
                // 第一个菜单是三级菜单 默认选中第一个三级菜单
                if (index == 0 && index2 == 0 && index3 == 0) {
                  this.menuId = t.sort_id
                }
              })
            } else if (index == 0 && index2 == 0) {
              // 1级菜单的第1个二级菜单且没有下级菜单了直接选中
              this.menuId = s.sort_id
            }
          })
        } else if (index == 0) {
          // 第一个是一级菜单直接选中
          this.menuId = item.sort_id
        }
      })
      this.defaultSelectedKey.push(this.menuId)
      this.onSelect({ key: this.menuId })
    },
    // 处理table数据
    handleList() {
      // console.log('-----------1', this.sList)
      this.selectedRowKeys = []
      if (this.sList.length) {
        this.sList.forEach((item) => {
          this.selectedRowKeys.push(item.goods_id)
        })
      }
      this.selectedRows = this.sList
    },
    // 点击确认
    handleOk() {
      const { selectedRowKeys, sList } = this
      if (sList.length) {
        this.$emit('submit', { ids: selectedRowKeys, goods: sList })
      } else {
        this.$message.error(this.L('请选择商品'))
      }
    },
    handleCancel() {
      this.init()
      this.dialogVisible = false
      this.$emit('update:visible', this.dialogVisible)
    },
    // 选中菜单
    onSelect(e) {
      const { key } = e
      console.log('menu id selected:', key)
      this.menuId = key
      this.defaultSelectedKey = [key]
      this.$emit('onMenuSelect', { id: key })
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
    // 搜索
    onSearch(value) {
      if (this.keywords) {
        this.menuId = ''
        this.openKeys = []
        this.defaultSelectedKey = []
        this.$emit('onSearch', { id: this.menuId, keywords: value })
      } else {
        this.$message.warning(this.L('请输入商品名称！'))
      }
    },
    onSearchChange(e) {
      // console.log('-------2', this.keywords)
      if (this.keywords) {
        this.onSearch(this.keywords)
      } else {
        this.handleMenuList()
      }
    },
    // 选择商品
    onRowSelect(record, selected, selectedRows) {
      // console.log('----------record', record)
      // console.log('----------selected', selected)
      // console.log('----------selectedRows', selectedRows)
      if (selected) {
        this.sList.push(record)
        this.selectedRowKeys.push(record.goods_id)
      } else {
        this.sList.remove(record)
        this.selectedRowKeys.remove(record.goods_id)
      }
      // console.log('----------sList', this.sList)
      // console.log('----------selectedRowKeys', this.selectedRowKeys)
    },
    onSelectAll(selected, selectedRows, changeRows) {
      // console.log('----------selected', selected)
      // console.log('----------selectedRows', selectedRows)
      // console.log('----------changeRows', changeRows)
      if (selected) {
        changeRows.map((item) => {
          this.selectedRowKeys.push(item.goods_id)
          this.sList.push(item)
        })
      } else {
        changeRows.map((item) => {
          this.sList.remove(item)
          this.selectedRowKeys.remove(item.goods_id)
        })
      }
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
    height: 650px;
    border-right: 1px solid #eeeeee;
  }
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    .top {
      height: 50px;
      border-bottom: 1px solid #eeeeee;
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
        div {
          float: left;
        }
        .product-name {
          font-weight: 600;
          font-size: 16px;
        }
      }
    }
  }
}
// 自定义滚动条
.scrollbar {
  overflow-y: auto;
}
.scrollbar::-webkit-scrollbar {
  width: 6px;
  background-color: rgba(217, 217, 217, 0.3);
}
.scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(217, 217, 217, 0.3);
  border-radius: 6px;
}
.scrollbar::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(217, 217, 217, 0.3);
  background-color: #fff;
}
.select-goods .right .bottom .product-info img {
  width: 80px;
  height: 80px;
  margin-right: 15px;
}
</style>