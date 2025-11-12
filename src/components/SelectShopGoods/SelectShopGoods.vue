/**
*******************
*   @author Liz
*   @date 2020-08-12
*   @description 选择外卖商品弹窗
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
          :selectedKeys="selectedSort"
          @openChange="onOpenChange"
          @select="onSelect"
        >
          <!-- 一级菜单（但是有多级菜单） -->
          <template v-for="menu of sortList">
            <a-sub-menu v-if="menu.son_list && menu.son_list.length" :key="menu.sort_id">
              <span slot="title">
                <span>{{ menu.sort_name }}</span>
              </span>
              <template v-if="menu.son_list && menu.son_list.length">
                <template v-for="sMenu of menu.son_list">
                  <!-- 三级菜单-->
                  <template v-if="sMenu.son_list && sMenu.son_list.length">
                    <a-sub-menu :key="sMenu.sort_id" :title="sMenu.sort_name">
                      <a-menu-item v-for="tMenu of sMenu.son_list" :key="tMenu.sort_id">{{
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
            v-model="keywords"
            class="search"
            @change="onSearchChange"
            @search="onSearch"
          />
        </div>
        <div class="bottom">
          <!-- 商品列表 -->
          <a-table
            :row-selection="rowSelection"
            :columns="columns"
            :data-source="tableList"
            rowKey="goods_id"
            :scroll="{ y: 500 }"
            :pagination="tableList.length ? true : false"
          >
            <span slot="name" slot-scope="text, record">
              <div class="product-info">
                <div>
                  <img :src="record.image_url" />
                </div>
                <div>{{ text }}</div>
              </div>
            </span>
            <span slot="price" slot-scope="text, record">
              <span>{{ text }}</span>
              <span style="margin-left: 10px">{{ record.has_spec == '1' ? '（' + L('多规格') + '）' : '' }}</span>
            </span>
            <span slot="selected" slot-scope="text">
              <span v-if="text == '1'" class="cr-blue">{{ L('已添加过') }}</span>
            </span>
          </a-table>
          <!-- <a-pagination
            class="pagination"
            :defaultCurrent="1"
            :current="currentPage"
            :total="tableList.length"
            @change="onPageChange"
          />-->
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import shopMerchantApi from '@/api/shop/merchant'
export default {
  name: 'SelectShopGoods',
  props: {
    // 打开弹框
    visible: {
      type: Boolean,
      default: false,
    },
    // 商品id
    storeId: {
      type: [String, Number],
      default: '0',
    },
    // 来源
    source: {
      type: String,
      default: 'foodshop_goods_library',
    },
    // 单选、多选
    type: {
      type: String,
      default: 'checkbox',
    },
  },
  data() {
    return {
      dialogVisible: false,
      rootSubmenuKeys: [], //1级菜单
      openKeys: [], //展开的菜单id集合
      columns: [
        {
          title: '商品',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '价格',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' },
        },
        {
          title: '',
          dataIndex: 'selected',
          width: 100,
          scopedSlots: { customRender: 'selected' },
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
    }
  },
  computed: {
    // 表格选择操作
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        type: this.type,
        onChange: this.onChange,
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.selected == '1',
          },
        }),
      }
    },
  },
  watch: {
    visible(newVal, oldVal) {
      this.dialogVisible = newVal
      if (newVal) {
        this.init()
        this.getSortList()
      }
    },
  },
  mounted() {
    this.dialogVisible = this.visible
  },
  methods: {
    // 初始化数据
    init() {
      this.rootSubmenuKeys = []
      this.openKeys = []
      this.selectedSort = []
      this.tableList = []
      this.keywords = ''
      this.currentPage = 1
    },

    // 获取左侧分列列表
    getSortList() {
      this.request(shopMerchantApi.sortList, { store_id: this.storeId }).then((res) => {
        this.sortList = res
        if (this.sortList.length) {
          this.handleDefaultSelect()
        }
      })
    },

    // 默认选中第一个
    handleDefaultSelect() {
      this.init()
      this.sortList.forEach((item, index) => {
        // 一级菜单
        this.rootSubmenuKeys.push(item.sort_id)
        if (item.son_list && item.son_list.length) {
          if (index == 0) {
            this.openKeys.push(item.sort_id)
          }
          // 二级菜单
          const sMenu = item.son_list
          sMenu.forEach((s, index2) => {
            if (s.son_list && s.son_list.length) {
              if (index2 == 0) {
                this.openKeys.push(s.sort_id)
              }
              // 三级菜单
              const tMenu = s.son_list
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
      this.selectedSort.push(this.menuId)
      this.getGoodsList()
    },

    // 选中菜单
    onSelect(e) {
      const { key } = e
      this.selectedSort = [key]
      this.menuId = key
      this.currentPage = 1
      this.getGoodsList()
    },

    // 获取商品列表
    getGoodsList() {
      this.tableList = []
      let params = {
        store_id: this.storeId,
        name: this.keywords,
        source: this.source,
      }
      if (this.menuId) {
        params.sort_id = this.menuId
      }
      this.request(shopMerchantApi.goodsList, params).then((res) => {
        this.tableList = res.list
        if (this.tableList.length) {
          this.handleList()
        }
      })
    },

    // 处理table数据
    handleList() {
      this.hasSelected = []
      if (this.type == 'checkbox') {
        this.tableList.forEach((item) => {
          if (item.selected) {
            this.hasSelected.push(item.goods_id)
          }
        })
        this.selectedRowKeys = this.hasSelected
      }
    },
    // 点击确认
    handleOk() {
      const { selectedRowKeys, hasSelected } = this
      let ids = []
      if (selectedRowKeys.length) {
        ids = selectedRowKeys.concat(hasSelected).filter(function (v, i, arr) {
          return arr.indexOf(v) === arr.lastIndexOf(v)
        })
      }
      if (ids.length) {
        this.$emit('onSubmit', { ids: ids.toString() })
        this.init()
      } else {
        this.$message.warning(this.L('请先选择商品哦~'))
      }
    },
    handleCancel() {
      this.init()
      this.dialogVisible = false
      this.$emit('update:visible', this.dialogVisible)
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
      if (this.menuId) {
        this.oldMenuId = this.menuId
      }
      this.menuId = ''
      this.openKeys = []
      this.selectedSort = []
      this.getGoodsList()
    },
    onSearchChange(e) {
      if (this.keywords || !this.oldMenuId) {
        this.onSearch(this.keywords)
      } else {
        this.menuId = this.oldMenuId
        this.selectedSort = [this.menuId]
      }
    },
    // 选择商品
    onChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
  },
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
</style>