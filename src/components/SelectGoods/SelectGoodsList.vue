/**
*******************
*   @author 衡婷妹
*   @date 2020-12-23
*   @description 选择商品弹窗 没有左侧菜单
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
    :bodyStyle="{ height: '700px' }"
  >
    <div class="select-goods">
      <div class="right">
        <div class="top">
          <!-- 搜索栏 -->
          <a-input-search
            placeholder="支持商品/店铺/商家名称/商品ID搜索"
            class="search right"
            v-model="keywords"
            @search="onSearch"
            @change="onSearchChange"
          />
        </div>
        <div class="bottom">
          <!-- 商品列表 -->
          <a-table
            :row-selection="rowSelection"
            :pagination="pagination"
            :columns="columns"
            @change="tableChange"
            :data-source="list"
            rowKey="goods_id"
            :scroll="{ y: 500 }"
          >
            <span slot="name" slot-scope="text, record">
              <div class="product-info flex align-center">
                <div>
                  <div class="img-wrap">
                    <a-popover placement="right">
                      <template slot="content">
                        <!-- <img class="goods-image-big" :src="record.image" /> -->
                      </template>
                      <img class="goods-image" :src="record.image" />
                    </a-popover>
                    <div class="yxj" v-if="record.goods_status == 0">已下架</div>
                  </div>
                </div>
                <div style="margin-left: 10px">
                  <p class="product-name">{{ text }}</p>
                  <!-- <p>{{ record.code }}</p> -->
                </div>
              </div>
            </span>
            <span slot="price" slot-scope="text, record">
              <div v-if="record.is_spec">
                <div class="red">
                  ￥{{ record.mini_price }}{{ record.mini_price != record.max_price ? '-' + record.max_price : '' }}
                </div>
                <div class="red">
                  {{ record.mini_discount }}折{{
                    record.mini_discount != record.max_discount ? '-' + record.max_discount + '折' : ''
                  }}
                </div>
              </div>
              <div v-if="!record.is_spec">
                <div class="red">￥{{ text }}</div>
                <div class="red">{{ record.discount }}折</div>
              </div>
            </span>
            <span slot="merchant_name" slot-scope="text, record"> {{ text }}/{{ record.store_name }} </span>
            <span slot="end_date" slot-scope="text, record"> {{ text }} {{ record.end_time }} </span>
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
    total: {
      type: [Number, String],
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
          title: '商品名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '优惠价',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' },
        },
        {
          title: '所属商家/店铺',
          dataIndex: 'merchant_name',
          scopedSlots: { customRender: 'merchant_name' },
        },
        {
          title: '活动截止时间',
          dataIndex: 'end_date',
          scopedSlots: { customRender: 'end_date' },
        },
      ],
      pagination: {
        pageSize: 10,
        total: 1,
        'show-total': (total) => `共 ${total} 条记录`,
      },
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
            disabled: record.selected === true,
          },
        }),
      }
    },
  },
  watch: {
    visible(newVal, oldVal) {
      this.dialogVisible = newVal
      if (newVal) {
        this.handleList()
      }
    },
    list() {
      this.handleList()
    },
    selectedList(val) {
      this.sList = JSON.parse(JSON.stringify(val))
    },
    total(val) {
      console.log('total', this.total)
      this.$set(this.pagination, 'total', this.total)
    },
  },
  mounted() {
    this.dialogVisible = this.visible
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
    // 处理table数据
    handleList() {
      // console.log('-----------1', this.sList)
      this.selectedRowKeys = []
      if (this.sList.length) {
        this.sList.forEach((item) => {
          item.selected = true
          this.selectedRowKeys.push(item.goods_id)
        })
      }

      if (this.list.length && this.selectedList.length) {
        this.list.forEach((item) => {
          let select = false
          this.selectedList.forEach((sItem) => {
            if (sItem.goods_id == item.goods_id) {
              select = true
            }
          })
          item.selected = select
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
      this.$emit('onSearch', { id: this.menuId, keywords: '', page: 1 })
    },
    // 搜索
    onSearch(value) {
      this.menuId = ''
      this.openKeys = []
      this.defaultSelectedKey = []
      this.$emit('onSearch', { id: this.menuId, keywords: value })
    },
    onSearchChange(e) {
      // console.log('-------2', this.keywords)
      this.onSearch(this.keywords)
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
    // 表格中变动
    tableChange(e) {
      if (e.current && e.current > 0) {
        this.$emit('onSearch', { id: this.menuId, keywords: this.keywords, page: e.current })
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
        width: 300px;
        // float: right;
        margin-right: 10px;
      }
    }
    .bottom {
      flex: 1;
      padding: 10px;
      .product-info {
        .product-name {
          font-weight: 600;
          font-size: 16px;
          white-space: pre-wrap;
          word-break: break-all;
          word-wrap: break-word;
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
.red {
  color: red;
}

.goods-image {
  width: 80px;
  margin-right: 5px;
  height: 80px;
  border-radius: 4px;
}
.img-wrap {
  position: relative;
}
.yxj {
  position: absolute;
  top: 0;
  left: 0;
  width: 80px;
  height: 80px;
  line-height: 80px;
  font-size: 12px;
  text-align: center;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
}
</style>