/**
*******************
*   @date 2020-08-11
*   @description 选择商品弹窗
*******************
*/
<template>
  <a-modal
    title="选择商品"
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
          <span class="tips"></span>

          <!-- 搜索栏 -->
          <a-input-search
            placeholder="组合名称"
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
            rowKey="combine_id"
            :scroll="{ y: 500 }"
          >
            <span slot="start_time" slot-scope="text, record"> {{ text }}至{{ record.end_time }} </span>
            <span slot="can_use_day" slot-scope="text"> {{ text }}天 </span>
            <span slot="selected" slot-scope="text, record">
              <div style="color: #1890ff" v-if="text">已选择</div>
            </span>
            <span slot="name" slot-scope="text, record">
              <div class="product-info">
                <div>
                  <img :src="record.image" />
                </div>
                <div style="margin-left: 10px">
                  <p class="product-name">{{ text }}</p>
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
          title: '优惠组合名称',
          dataIndex: 'title',
          scopedSlots: { customRender: 'title' },
        },
        {
          title: '优惠组合类型',
          dataIndex: 'cat_name',
        },
        {
          title: '优惠组合活动时间',
          dataIndex: 'start_time',
          // sorter: true,
          width: '15%',
          scopedSlots: {
            customRender: 'start_time',
          },
        },
        {
          title: '优惠组合有效期',
          dataIndex: 'can_use_day',
          width: '15%',
          scopedSlots: {
            customRender: 'can_use_day',
          },
        },
        {
          title: '状态',
          dataIndex: 'selected',
          scopedSlots: { customRender: 'selected' },
        },
      ],
      menuId: 0,
      selectedRowKeys: [],
      selectedRows: [],
      defaultSelectedKey: [],
      keywords: '',
      sList: [],
      merIdArr: [],
    }
  },
  computed: {
    // 表格选择操作
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onSelect: this.onRowSelect,
        onSelectAll: this.onSelectAll,
        hideDefaultSelections: true,
        getCheckboxProps: (record) => ({
          props: {
            // disabled: record.selected === true,
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
      console.log(this.menuList, ' this.menuList')
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
      console.log('-----------1', this.sList)
      this.selectedRowKeys = []
      this.merIdArr = []
      if (this.sList.length) {
        this.sList.forEach((item) => {
          this.selectedRowKeys.push(item.combine_id)
        })
      }
      if (this.list.length) {
        this.list.forEach((item, i) => {
          if (this.selectedRowKeys.indexOf(item.combine_id) != -1) {
            this.list[i].selected = 1
          } else {
            this.list[i].selected = 0
          }
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
        this.$message.error('请选择商品')
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
        this.$message.warning('请输入组合名称！')
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
      // console.log('----------selectedRowKeys', this.selectedRowKeys)
      // console.log('----------group_id', record.group_id)
      if (selected) {
        // console.log('11111111111111111111')
        this.sList.push(record)
        this.selectedRowKeys.push(record.combine_id)
      } else {
        // console.log('2222222222222222')
        if (this.selectedRowKeys.indexOf(record.combine_id) != -1) {
          this.merIdArr.remove(record.mer_id)
          this.sList.remove(record)
          this.selectedRowKeys.remove(record.combine_id)
        }
        // console.log('----------merIdArr', this.merIdArr)
        // console.log('----------mer_id', record.mer_id)
      }
      if (this.list.length) {
        this.list.forEach((item, i) => {
          if (this.selectedRowKeys.indexOf(item.combine_id) != -1) {
            this.list[i].selected = 1
          } else {
            this.list[i].selected = 0
          }
        })
      }
      // console.log('----------selectedRowKeys', this.selectedRowKeys)
      // console.log('----------sList', this.sList)
      // console.log('----------merIdArr', this.merIdArr)
    },
    onSelectAll(selected, selectedRows, changeRows) {
      // console.log('----------selected', selected)
      // console.log('----------selectedRows', selectedRows)
      // console.log('----------changeRows', changeRows)
      if (selected) {
        changeRows.map((item) => {
          // 验证商家id
          // if (this.merIdArr.indexOf(item.mer_id) != -1) {
          //   this.$message.error('该商家已选过一个商品')
          //   return false
          // }
          this.selectedRowKeys.push(item.combine_id)
          this.sList.push(item)
          // this.merIdArr.push(item.mer_id)
        })
      } else {
        changeRows.map((item) => {
          this.sList.remove(item)
          this.selectedRowKeys.remove(item.combine_id)
          // this.merIdArr.remove(item.mer_id)
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
    if (item.combine_id == val.combine_id) {
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      .search {
        width: 210px;
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
.tips {
  padding-left: 20px;
}
</style>