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
            <a-sub-menu v-if="menu.children && menu.children.length" :key="menu.cat_id">
              <span slot="title">
                <span>{{ menu.cat_name }}</span>
              </span>
              <template v-if="menu.children && menu.children.length">
                <template v-for="sMenu of menu.children">
                  <!-- 三级菜单-->
                  <template v-if="sMenu.children && sMenu.children.length">
                    <a-sub-menu :key="sMenu.cat_id" :title="sMenu.cat_name">
                      <a-menu-item v-for="tMenu of sMenu.children" :key="tMenu.cat_id">{{ tMenu.cat_name }}
                      </a-menu-item>
                    </a-sub-menu>
                  </template>
                  <!-- 二级菜单 -->
                  <template v-else>
                    <a-menu-item :key="sMenu.cat_id">{{ sMenu.cat_name }}</a-menu-item>
                  </template>
                </template>
              </template>
            </a-sub-menu>
            <!-- 只有一级菜单 -->
            <a-menu-item v-else :key="menu.cat_id">{{ menu.cat_name }}</a-menu-item>
          </template>
        </a-menu>
      </div>
      <div class="right">
        <div class="top">
          <!-- 返回 -->
          <a-icon v-if="keywords" type="left" class="fs-16 pointer" @click="backToSort()"/>
          <!-- 搜索栏 -->
          <a-input-search
            placeholder="商品名称"
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
            v-if="isSku"
            key="sku_table"
            :row-selection="rowSelection"
            :columns="columns"
            :data-source="tableList"
            rowKey="goods_id"
            :scroll="{ y: 500 }"
            :pagination="tableList.length ? true : false"
          >
            <span slot="goods_name" slot-scope="text, record">
              <div class="product-info">
                <div>
                  <img :src="record.image"/>
                </div>
                <div>{{ text }}</div>
              </div>
            </span>
            <span slot="price" slot-scope="text, record">
              <span>￥{{ record.min_price }} ~ ￥{{ record.max_price }}</span>
            </span>
            <p
              v-if="isSku && record.sku_info && record.sku_info.length"
              slot="expandedRowRender"
              slot-scope="record"
              style="margin: 0"
            >
              <!-- <template v-if="type == 'checkbox'"> -->
              <span class="flex align-center mb-20 cr-99" v-for="item of record.sku_info" :key="item.sku_id">
                <a-checkbox
                  :default-checked="item.selected"
                  :disabled="item.can_be_choose == 0 || item.can_be_choose_2 == 0"
                  @change="onSkuGoodsSelect(item.sku_id, record, $event)"
                >
                </a-checkbox>
                <span class="ml-20 mr-20" style="width: 245px">{{ item.sku_str || '--' }}</span>
                <span style="width: 200px">￥{{ item.price }}</span>
                <span class="flex-1">{{ item.stock_num }}</span>
              </span>
            </p>
          </a-table>
          <a-table
            v-else
            key="spu_table"
            :row-selection="rowSelection"
            :columns="columns"
            :data-source="tableList"
            rowKey="goods_id"
            :scroll="{ y: 500 }"
            :pagination="tableList.length ? true : false"
          >
            <span slot="goods_name" slot-scope="text, record">
              <div class="product-info">
                <div>
                  <img :src="record.image"/>
                </div>
                <div>{{ text }}</div>
              </div>
            </span>
            <span slot="price" slot-scope="text, record">
               <span v-if="record.goods_type == 'sku'" key="sku_goods">￥{{ record.min_price }} ~ ￥{{ record.max_price }}</span>
              <span v-else key="spu_goods">￥{{ record.price }}</span>
            </span>
          </a-table>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
  import mallPlatformApi from '@/api/mall/platform/index'

  export default {
    name: 'SelectShopGoods',
    props: {
      type: {
        type: String,
        default: 'checkbox'
      },
      // 记录id
      recordId: {
        type: [String, Number],
        default: '',
      },
      // 来源
      source: {
        type: String,
        default: 'platform_six',  //六宫格=platform_six 猜你喜欢=platform_rec
      },
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
        dialogVisible: false,
        rootSubmenuKeys: [], //1级菜单
        openKeys: [], //展开的菜单id集合
        columns: [
          {
            title: '商品信息',
            dataIndex: 'goods_name',
            scopedSlots: {customRender: 'goods_name'},
            width: '300px',
          },
          {
            title: '价格',
            dataIndex: 'price',
            scopedSlots: {customRender: 'price'},
            width: '200px',
          },
          {
            title: '当前库存',
            dataIndex: 'stock_num',
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
                disabled: record.can_be_choose == 0 || record.can_be_choose_2 == 0,
              },
            }),
          }
        } else {
          // sku goods: bargain full-give limited group prepare
          return null
        }
      },
    },
    watch: {
      selectedList(val) {
        this.sList = JSON.parse(JSON.stringify(val))
      },
    },
    methods: {
      openDialog(record_id, title, cat_key) {
        this.rid = record_id
        this.title = title
        this.cat_key = cat_key
        this.dialogVisible = true
        if (this.selectedList) {
          this.selectedList.forEach(item => {
            if (item.id === record_id) {
              this.sList = JSON.parse(JSON.stringify(item.related_goods))
            }
          })
        }
        this.getSortList()
      },
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
        this.request(mallPlatformApi.goodsCategoryList).then((res) => {
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
          this.rootSubmenuKeys.push(item.cat_id)
          if (item.children && item.children.length) {
            if (index == 0) {
              this.openKeys.push(item.cat_id)
            }
            // 二级菜单
            const sMenu = item.children
            sMenu.forEach((s, index2) => {
              if (s.children && s.children.length) {
                if (index2 == 0) {
                  this.openKeys.push(s.cat_id)
                }
                // 三级菜单
                const tMenu = s.children
                tMenu.forEach((t, index3) => {
                  // 第一个菜单是三级菜单 默认选中第一个三级菜单
                  if (index == 0 && index2 == 0 && index3 == 0) {
                    this.menuId = t.cat_id
                  }
                })
              } else if (index == 0 && index2 == 0) {
                // 1级菜单的第1个二级菜单且没有下级菜单了直接选中
                this.menuId = s.cat_id
              }
            })
          } else if (index == 0) {
            // 第一个是一级菜单直接选中
            this.menuId = item.cat_id
          }
        })
        this.selectedSort.push(this.menuId)
        this.getGoodsList()
      },

      // 选中菜单
      onSelect(e) {
        const {key} = e
        this.selectedSort = [key]
        this.menuId = key
        this.currentPage = 1
        this.getGoodsList()
      },

      // 获取商品列表
      getGoodsList() {
        this.tableList = []
        let params = {
          keyword: this.keywords,
          source: this.source,
          record_id: this.rid,
        }
        this.isSkuGoods()
        if (!this.keywords) {
          params.cat_id = this.menuId
        }
        this.request(mallPlatformApi.getActGoods, params).then((res) => {
          if (res.list && res.list.length) {
            this.tableList = res.list
            this.handleList()
          }
        })
      },

      // 处理table数据
      handleList() {
        if (this.isSku) {
          if (this.sList.length) {
            if (this.type == 'radio' && this.sList.length > 1) {
              // 这种情况理应不存在
              this.sList = this.sList.splice(1)
              this.$message.warning('只能选择一个商品哦，已自动为您选择已选择列表中的第一个商品')
            }
            this.tableList.forEach((item) => {
              this.sList.forEach((item2) => {
                if (item2.goods_id == item.goods_id) {
                  if (item.sku_info.length == item2.sku_info.length) {
                    item.sku_info = item2.sku_info
                  } else {
                    item.sku_info.forEach((item3) => {
                      item2.sku_info.forEach((item4) => {
                        if (item4.sku_id == item3.sku_id) {
                          item3.selected = true
                          if (this.type == 'radio') {
                            item.defaultValue = item3.sku_id
                          }
                        }
                      })
                    })
                  }
                } else if (this.type == 'radio') {
                  item.sku_info.forEach((item3) => {
                    item3.can_be_choose_2 = 0
                  })
                }
              })
            })
          }
        } else {
          this.selectedRowKeys = []
          if (this.sList.length) {
            if (this.type == 'radio') {
              if (this.sList.length > 1) {
                this.sList = [this.sList[0]]
              }
              this.selectedRowKeys = [this.sList[0].goods_id]
            } else {
              this.sList.forEach((item) => {
                this.selectedRowKeys.push(item.goods_id)
              })
            }
          }
          this.selectedRows = this.sList
        }
      },
      // 点击确认
      handleOk() {
        const {selectedRowKeys, sList} = this
        if (this.isSku) {

        } else {
          if (sList.length) {
            this.request(mallPlatformApi.addRelatedGoods, {
              goods_ids: selectedRowKeys,
              id: this.rid,
              source: this.source
            }).then(res => {
              this.$message.success('添加成功')
              this.$emit('backDeal', this.cat_key, this.title)
            })
            this.handleCancel()
          } else {
            this.$message.error('请选择商品')
          }
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
          this.selectedRowKeys = [record.goods_id]
        } else {
          if (selected) {
            this.sList.push(record)
            this.selectedRowKeys.push(record.goods_id)
          } else {
            this.sList.remove(record)
            this.selectedRowKeys.remove(record.goods_id)
          }
        }
      },
      onSelectAll(selected, selectedRows, changeRows) {
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
      // 是否是sku商品
      isSkuGoods() {
        this.isSku = false
      },
      // 选择sku goods
      onSkuGoodsSelect(id, record, e) {
        const checked = e.target.checked
        console.log('------------this.sList', this.sList)
        if (checked) {
          let add = false
          if (this.sList.length) {
            this.sList.forEach((item) => {
              if (item.goods_id == record.goods_id) {
                record.sku_info.forEach((item2) => {
                  if (item2.sku_id == id) {
                    item2.selected = true
                  }
                })
                item.sku_info = record.sku_info
                add = true
              }
            })
          }
          if (!add) {
            record.sku_info.forEach((item) => {
              if (item.sku_id == id) {
                item.selected = true
              }
            })
            this.sList.push(record)
            if (this.type == 'radio' && this.sList.length == 1) {
              // 设置不可选
              this.tableList.forEach((t) => {
                if (t.goods_id != record.goods_id) {
                  t.sku_info.forEach((s) => {
                    s.can_be_choose_2 = 0
                  })
                }
              })
              this.$set(this, 'tableList', this.tableList)
            }
          }
        } else {
          let noAdd = true
          record.sku_info.forEach((item) => {
            if (item.sku_id == id) {
              item.selected = false
            }
            if (item.selected) {
              noAdd = false
            }
          })
          if (noAdd) {
            this.sList.remove(record)
            if (this.type == 'radio' && !this.sList.length) {
              // 设置可选
              this.tableList.forEach((t) => {
                if (t.goods_id != record.goods_id) {
                  t.sku_info.forEach((s) => {
                    s.can_be_choose_2 = 1
                  })
                }
              })
              this.$set(this, 'tableList', this.tableList)
            }
          }
        }
        this.$forceUpdate()
      },
      onRadioChange(record, e) {
        console.log('----------------', e.target.value)
        let add = false
        if (this.sList.length) {
          this.sList.forEach((item) => {
            if (item.goods_id == record.goods_id) {
              item.sku_info.forEach((item2) => {
                if (item2.sku_id == e.target.value) {
                  console.log('----------------add sku_id ', item2.sku_id)
                  item2.selected = true
                } else {
                  item2.selected = false
                }
              })
              add = true
            }
          })
        }
        console.log('----------------add', add)
        if (!add) {
          record.sku_info.forEach((item) => {
            if (item.sku_id == e.target.value) {
              item.selected = true
            } else {
              item.selected = false
            }
          })
          this.sList.push(record)
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