<template>
  <div id="components-layout-demo-basic">
    <a-layout>
      <a-layout-header style="padding: 0 20px; background: #fff">
        <div class="ant-pro-page-header-wrap-children-content" style="margin: 24px 0 0; display: inline-block">
          <div class="message-suggestions-list-box">
            <a-tabs :default-active-key="0" v-model="queryParam.order_status" @change="statusChange" :tabBarGutter="0">
              <a-tab-pane :key="i" :tab="item" v-for="(item, i) in tabColumn"></a-tab-pane>
            </a-tabs>
            <div style="display: inline-block" class="search-input">
              <a-input-search
                v-model="queryParam.name"
                :placeholder="L('输入商品名')"
                style="width: 200px"
                @change="onSearch"
              />
              <!--               <a-tag  @click="sellStatistics" style="border: none;font-size: 14px;background: #fff;"><a-icon type="bar-chart"/> 商品销售统计</a-tag>-->
            </div>
          </div>
        </div>
      </a-layout-header>
      <a-layout style="padding: 0 20px; background: #fff">
        <a-layout-sider>
          <template v-if="sortList.length">
            <div class="cat-list scroll_content br-f1">
              <drag-box
                v-if="sortList.length"
                :list="sortList"
                :select="queryParam.sort_id"
                @handleChange="handleDragDataChange"
              />
            </div>
            <div class="add-new-cat" :style="'top:' + (this.clientHeight - 235) + 'px'">
              <span class="add-sort" @click="$refs.editSortModal.add(queryParam.store_id)">{{ L('新建分类') }}</span>
            </div>
          </template>
          <template v-else-if="sortList.length == 0 && !sortLoading">
            <div class="cat-list scroll_content br-f1">
              <div class="text-center cr-99 mt-10">{{ L('暂无分类') }}</div>
            </div>
            <div class="add-new-cat" :style="'top:100px'">
              <span class="add-sort" @click="$refs.editSortModal.add(queryParam.store_id)">{{ L('新建分类') }}</span>
            </div>
          </template>
        </a-layout-sider>
        <a-layout-content>
          <div class="edit-content">
            <a-button-group>
              <a-button @click="bathEditGoods(1)">{{ L('沽清') }}</a-button>
              <a-button @click="bathEditGoods(2)">{{ L('置满') }}</a-button>
              <a-button @click="bathEditGoods(3)">{{ L('修改库存') }}</a-button>
              <a-button @click="bathEditGoods(4)">{{ L('上架') }}</a-button>
            </a-button-group>
            <a-dropdown-button @click="bathEditGoods(5)">
              {{ L('下架') }}
              <a-menu slot="overlay">
                <a-menu-item key="1" @click="bathEditGoods(6)">
                  <a-button type="link">{{ L('删除') }} </a-button>
                </a-menu-item>
                <a-menu-item key="2">
                  <a-button type="link" @click="bathEditGoods(7)">{{ L('修改分类') }}</a-button>
                </a-menu-item>
              </a-menu>
            </a-dropdown-button>
            <a-button type="primary" @click="addGoods()" class="add-goods">{{ L('新建商品') }}</a-button>
            <a-button @click="clickbathAddGoods()">{{ L('批量新建商品') }}</a-button>
          </div>
          <div>
            <span style="margin-left: 8px">
              <template v-if="hasSelected">{{ `Selected ${selectedRowKeys.length} items` }}</template>
            </span>
          </div>
          <a-table
            :columns="columns"
            :data-source="goodsList"
            :pagination="false"
            :disabled="!hasSelected"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            @change="tableChange"
            rowKey="pigcms_id"
            :scroll="{ y: this.clientHeight - 330 }"
            :loading="loading"
          >
            <span slot="name" slot-scope="text, record">
              <div class="right-c">
                <div class="img-wrap">
                  <a-popover placement="right">
                    <template slot="content">
                      <img class="goods-image-big" :src="record.product_image" />
                    </template>
                    <img class="goods-image" :src="record.product_image" />
                  </a-popover>
                  <div class="yxj" v-if="record.status == 0">{{ L('已下架') }}</div>
                </div>
                <div>
                  <div style="padding-right: 16px">{{ text }}</div>
                  <div style="color: #8e8585; font-size: 8px; margin-top: 3px">
                    {{ L('已售') }}：{{ record.sell_count }}
                  </div>
                </div>
              </div>
            </span>
            <span slot="price" slot-scope="text, record">
              <div>
                <div>
                  <span v-if="record.spec_value">{{ L('￥') }}{{ record.min_price }} {{ L('起') }}</span>
                  <span v-else>{{ L('￥') }}{{ text }}</span>
                  <a-icon
                    v-if="record.spec_value"
                    type="form"
                    style="margin-left: 4px; color: #1890ff"
                    @click="$refs.editSpecPriceModal.edit(record.goods_id)"
                  />
                  <a-icon
                    v-else
                    type="form"
                    style="margin-left: 4px; color: #1890ff"
                    @click="$refs.editPriceModal.edit(record.pigcms_id, text)"
                  />
                </div>
              </div>
            </span>
            <span slot="spec_stock" slot-scope="text, record">
              <span v-if="record.spec_value">{{ L('多规格') }}</span>
              <span v-else>
                <span v-if="record.spec_stock_type == 1">{{ record.stock_num == -1?L('无限'): record.stock_num }}</span>
                <span v-else>{{ text == -1?L('无限'):text }}</span>
              </span>
              <!-- <span v-else-if="text == '-1'">{{ L('无限') }}</span>
              <span v-else>{{ text }}</span> -->
              <a-icon
                v-if="record.spec_value"
                type="form"
                style="margin-left: 4px; color: #1890ff"
                @click="$refs.editSpecStockModal.edit(record.goods_id)"
              />
              <a-icon
                v-else
                type="form"
                style="margin-left: 4px; color: #1890ff"
                @click="$refs.editStockModal.edit(record.pigcms_id, text, record.spec_original_stock, record)"
              />
            </span>
            <template v-for="col in ['sort']" slot="sort" slot-scope="text, record">
              <div :key="col">
                <a-input
                  v-if="record.editable"
                  style="margin: -5px 2px; width: 56px"
                  :value="text"
                  @change="(e) => handleChangeSort(e.target.value, record.pigcms_id, col)"
                />
                <template v-else>{{ text }}</template>
                <span class="editable-row-operations">
                  <span v-if="record.editable">
                    <a @click="() => saveSort(record.pigcms_id)">{{ L('保存') }}</a>
                    <a-divider type="vertical" />
                    <a @click="() => cancelSort(record.pigcms_id, record.sort, col)">{{ L('取消') }}</a>
                  </span>
                  <span v-else>
                    <a
                      :disabled="editingKey !== ''"
                      @click="() => editSort(record.pigcms_id, record.sort)"
                      style="margin-left: 4px"
                      >{{ L('编辑') }}</a
                    >
                  </span>
                </span>
              </div>
            </template>
            <span slot="action" slot-scope="text, record">
              <a @click="$refs.editGoodsModal.edit(queryParam.store_id, record.spec_sort_id, record.goods_id)">{{
                L('编辑')
              }}</a>
              <a-divider type="vertical" />
              <a @click="editStatus(record.pigcms_id)" :style="record.status ? 'color: #747b8b' : ''">{{
                record.status ? L('下架') : L('上架')
              }}</a>
              <a-divider type="vertical" />
              <a-popconfirm
                class="ant-dropdown-link"
                :title="L('确认删除?')"
                :ok-text="L('确定')"
                :cancel-text="L('取消')"
                @confirm="deleteGoods(record.pigcms_id)"
                @cancel="cancel"
              >
                <a href="#" style="color: #747b8b">{{ L('删除') }}</a>
              </a-popconfirm>
            </span>
          </a-table>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <edit-sort ref="editSortModal" @handleUpdate="handleUpdate" />
    <edit-bath-stock ref="editBathStockModal" @handleGoodsUpdate="handleGoodsUpdate" />
    <edit-goods-sort ref="editGoodsSortModal" @handleGoodsUpdate="handleGoodsUpdate" />
    <edit-goods ref="editGoodsModal" @handleGoodsUpdate="handleGoodsUpdate" />
    <edit-price ref="editPriceModal" @handleGoodsUpdate="handleGoodsUpdate" />
    <edit-spec-price ref="editSpecPriceModal" @handleGoodsUpdate="handleGoodsUpdate" />
    <edit-stock ref="editStockModal" @handleGoodsUpdate="handleGoodsUpdate" />
    <edit-spec-stock ref="editSpecStockModal" @handleGoodsUpdate="handleGoodsUpdate" />
    <select-shop-goods
      :visible.sync="selectGoodsVisible"
      :storeId="queryParam.store_id"
      source="foodshop_goods_library"
      :type="goodsSelectType"
      @onSubmit="onGoodsSelect"
    />
  </div>
</template>

<script>
import DragBox from '@/components/DragBox/DragBox'
import EditSort from '../modules/merchant/EditSort.vue'
import EditBathStock from '../modules/merchant/goods/EditBathStock.vue'
import EditGoodsSort from '../modules/merchant/goods/EditGoodsSort.vue'
import EditPrice from '../modules/merchant/goods/EditPrice.vue'
import EditSpecPrice from '../modules/merchant/goods/EditSpecPrice.vue'
import EditStock from '../modules/merchant/goods/EditStock.vue'
import EditSpecStock from '../modules/merchant/goods/EditSpecStock.vue'
import EditGoods from '../modules/merchant/goods/EditGoods.vue'
import foodshopMerchantApi from '@/api/foodshop/merchant'
import foodshopPlatformApi from '@/api/foodshop/platform'
import SelectShopGoods from '@/components/SelectShopGoods/SelectShopGoods'

const data = []
const sortList = []
const selectedRowKeys = []
export default {
  name: 'goodsList',
  components: {
    DragBox,
    EditSort,
    EditBathStock,
    EditGoodsSort,
    EditSpecPrice,
    EditPrice,
    EditStock,
    EditSpecStock,
    EditGoods,
    SelectShopGoods,
  },
  data() {
    this.cacheData = data.map((item) => ({
      ...item,
    }))
    return {
      form: this.$form.createForm(this),
      id: 1,
      timeTab: '',
      detail: {}, //订单详情
      // 查询参数
      queryParam: {
        order_status: 0,
        store_id: 0,
        sort_id: 0,
      },
      // 表头
      columns: [
        {
          title: this.L('商品名称'),
          dataIndex: 'name',
          width: '35%',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: this.L('价格'),
          dataIndex: 'price',
          width: '12%',
          scopedSlots: { customRender: 'price' },
        },
        {
          title: this.L('当前库存'),
          width: '12%',
          dataIndex: 'spec_stock',
          scopedSlots: { customRender: 'spec_stock' },
        },
        {
          title: this.L('排序'),
          dataIndex: 'sort',
          width: '12%',
          scopedSlots: { customRender: 'sort' },
        },
        {
          title: this.L('操作'),
          dataIndex: 'action',
          width: '12%',
          scopedSlots: {
            customRender: 'action',
          },
        },
      ],
      data,
      selectedRowKeys,
      sortList,
      goodsList: [],
      tabColumn: [this.L('全部商品(0)'), this.L('售卖中(0)'), this.L('已下架(0)'), this.L('已售完(0)')],
      type: '',
      sortSelect: true,
      baseUrl: '/v20/public/platform/#',
      editingKey: '',
      selectGoodsVisible: false,
      goodsSelectType: 'checkbox',
      clientHeight: 0,
      oldSort: 0,
      loading: false,
      sortLoading: false,
    }
  },
  watch: {
    $route: {
      handler() {
        this.queryParam.store_id = this.$route.query.store_id
        this.queryParam.sort_id = 0
        this.getSortList()
      },
      deep: true,
    },
  },
  created() {
    console.log(this.$route.query.store_id)
  },
  filters: {},
  mounted() {
    this.clientHeight = window.document.body.clientHeight
    window.onresize = () => {
      this.clientHeight = window.document.body.clientHeight
    }
    // 店铺id
    this.queryParam.store_id = this.$route.query.store_id
    console.log('queryParam', this.queryParam)
    this.getSortList()
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
  },
  methods: {
    getSortList(changeTab = true) {
      console.log('222', this.queryParam)
      this.sortLoading = true
      this.sortList = []
      this.request(foodshopMerchantApi.sortList, this.queryParam).then((res) => {
        this.sortLoading = false
        this.sortList = res
        console.log('sort_id', this.queryParam.sort_id)
        if (this.queryParam.sort_id == 0) {
          if (res.length > 0) {
            this.queryParam.sort_id = res[0].id
            this.getGoodsList()
          } else if (changeTab) {
            this.tabColumn = [this.L('全部商品(0)'), this.L('售卖中(0)'), this.L('已下架(0)'), this.L('已售完(0)')]
          }
        }
      })
    },
    // 获得商品列表
    getGoodsList(changeTab = true) {
      console.log('11111', this.queryParam)
      // this.goodsList = []
      this.loading = true
      this.request(foodshopMerchantApi.goodsList, this.queryParam).then((res) => {
        this.goodsList = res.list
        if (changeTab) {
          this.tabColumn = res.tabs
        }
        this.loading = false
      })
    },
    // 切换状态
    statusChange(key) {
      // this.$set(this.queryParam, 'order_status', key)
      this.sortSelect = true
      this.queryParam.name = ''
      this.getSortList(false)
      this.getGoodsList(false)
    },
    // 表格中变动
    tableChange(e) {},
    // 左侧分类拖拽
    handleDragDataChange(val) {
      console.log('edit', val)
      if (val.type == 'drag') {
        // 拖拽
        this.request(foodshopMerchantApi.changeSort, { sort_list: val.data }).then((res) => {
          console.log(res)
          this.$message.success(this.L('排序成功！'))
        })
      } else if (val.type == 'edit') {
        // 编辑
        this.$refs.editSortModal.edit(this.queryParam.store_id, val.data.id)
      } else if (val.type == 'click') {
        // 点击
        this.queryParam.sort_id = val.data.id
        this.queryParam.name = ''
        this.getGoodsList(false)
      }
    },
    // 添加编辑删除回调
    handleUpdate() {
      this.getSortList()
    },
    // 修改商品信息
    handleGoodsUpdate(val) {
      console.log(val)
      this.getGoodsList()
      this.selectedRowKeys = []
      if (this.type == 7 || val) {
        this.getSortList()
      }
    },
    // 单个添加商品
    addGoods() {
      if (this.sortList.length == 0) {
        this.$message.error(this.L('请先添加分类'))
        return false
      }
      this.$refs.editGoodsModal.add(this.queryParam.store_id, this.queryParam.sort_id)
    },
    // 批量添加商品
    clickbathAddGoods() {
      if (this.sortList.length == 0) {
        this.$message.error(this.L('请先添加分类'))
        return false
      }
      this.selectGoodsVisible = true
    },
    // 批量添加商品
    bathAddGoods(goodsIds) {
      const param = {
        goods_id: goodsIds,
        store_id: this.queryParam.store_id,
        sort_id: this.queryParam.sort_id,
      }
      this.request(foodshopMerchantApi.addGoods, param).then((res) => {
        this.$message.success(res.msg)
        this.selectedRowKeys = []
        this.getSortList()
        this.getGoodsList()
      })
    },
    // 选择商品回调
    onGoodsSelect(e) {
      this.selectGoodsVisible = false
      if (e.ids) {
        // 批量新增商品
        this.bathAddGoods(e.ids)
      }
    },
    // 批量编辑
    bathEditGoods(type) {
      this.type = type
      const param = {
        pigcms_id: this.selectedRowKeys,
        store_id: this.queryParam.store_id,
        type: type,
      }

      if (param.pigcms_id.length <= 0) {
        this.$message.success(this.L('请选择商品'))
        return
      }

      if (type == 3) {
        // 修改库存
        this.$refs.editBathStockModal.edit(this.queryParam.store_id, this.selectedRowKeys)
      } else if (type == 7) {
        // 修改分类
        this.$refs.editGoodsSortModal.edit(this.queryParam.store_id, this.selectedRowKeys)
      } else if (type == 6) {
        // 删除
        var _this = this
        this.$confirm({
          title: this.L('确定删除选中商品？'),
          content: '',
          okText: this.L('确定'),
          okType: 'danger',
          cancelText: this.L('取消'),
          centered: true,
          onOk() {
            _this.request(foodshopMerchantApi.editGoodsBatch, param).then((res) => {
              _this.$message.success(this.L('删除成功'))
              _this.selectedRowKeys = []
              _this.getGoodsList()
            })
          },
        })
      } else {
        this.request(foodshopMerchantApi.editGoodsBatch, param).then((res) => {
          this.$message.success(res.msg)
          this.selectedRowKeys = []
          this.getGoodsList()
        })
      }
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 删除商品
    deleteGoods(pigcms_id) {
      this.request(foodshopMerchantApi.goodsDel, { pigcms_id: pigcms_id, store_id: this.queryParam.store_id })
        .then((res) => {
          this.$message.success(res.msg)
          this.getGoodsList()
          this.getSortList()
        })
        .catch((error) => {
          this.confirmLoading = false
        })
    },
    // 单个商品上下架
    editStatus(pigcms_id) {
      this.request(foodshopMerchantApi.changeStatus, { pigcms_id: pigcms_id, store_id: this.queryParam.store_id })
        .then((res) => {
          this.$message.success(res.msg)
          this.getGoodsList()
        })
        .catch((error) => {
          this.confirmLoading = false
        })
    },
    cancel() {},
    onSearch() {
      if (this.queryParam.name) {
        this.queryParam.sort_id = '0'
        this.queryParam.order_status = 0
        console.log('queryParam', this.queryParam)
        this.sortSelect = false
        this.getGoodsList()
      } else {
        this.sortSelect = true
        this.getSortList()
      }
    },
    sellStatistics() {
      console.log(this.baseUrl + '/merchant/merchant.iframe/menu_147')
      location.href = this.baseUrl + '/merchant/merchant.iframe/menu_147'
    },
    // 编辑排序
    handleChangeSort(value, pigcms_id, column) {
      const newData = [...this.goodsList]
      const target = newData.filter((item) => pigcms_id === item.pigcms_id)[0]
      if (target) {
        target[column] = value
        this.goodsList = newData
      }
    },
    // 编辑排序
    editSort(pigcms_id, sort) {
      const newData = [...this.goodsList]
      const target = newData.filter((item) => pigcms_id === item.pigcms_id)[0]
      this.editingKey = pigcms_id
      this.oldSort = sort
      if (target) {
        target.editable = true
        this.goodsList = newData
      }
    },
    // 保存排序
    saveSort(pigcms_id) {
      const newData = [...this.goodsList]
      const newCacheData = [...this.cacheData]
      const target = newData.filter((item) => pigcms_id === item.pigcms_id)[0]
      const targetCache = newCacheData.filter((item) => pigcms_id === item.pigcms_id)[0]
      if (target) {
        delete target.editable
        this.goodsList = newData
        Object.assign(target, this.cacheData.filter((item) => pigcms_id === item.pigcms_id)[0])
        this.cacheData = newCacheData
      }
      this.request(foodshopMerchantApi.editSingleGoods, {
        type: 1,
        pigcms_id: target.pigcms_id,
        sort: target.sort,
      }).then((res) => {
        this.getGoodsList()
      })
      this.editingKey = ''
    },
    // 取消排序
    cancelSort(pigcms_id, sort, column) {
      console.log(sort)
      const newData = [...this.goodsList]
      const target = newData.filter((item) => pigcms_id === item.pigcms_id)[0]
      this.editingKey = ''
      if (target) {
        console.log(this.oldSort)
        target[column] = this.oldSort
        this.oldSort = 0
        Object.assign(target, this.cacheData.filter((item) => pigcms_id === item.pigcms_id)[0])
        delete target.editable
        this.goodsList = newData
      }
    },
  },
}
</script>
<style scoped>
.detail-content >>> .ant-drawer-body {
  padding: 0;
}
.add-sort {
  color: #1890ff;
  border: 1px solid #1890ff;
  border-radius: 12px;
  padding: 2px 18px;
  background-color: #1890ff21;
  cursor: pointer;
}

#components-layout-demo-basic {
  text-align: left;
  background: #ffffff;
  height: 100%;
}

#components-layout-demo-basic .ant-layout {
  height: 100%;
}

#components-layout-demo-basic .ant-layout-header,
#components-layout-demo-basic .ant-layout-footer {
  background: #ffffff;
  color: #fff;
  height: 80px;
}

#components-layout-demo-basic .ant-layout-sider {
  background: #ffffff;
  color: #fff;
}

#components-layout-demo-basic .ant-layout-content {
  background: #ffffff;
  color: #fff;
  min-height: 120px;
  line-height: 120px;
  padding-left: 20px;
}

#components-layout-demo-basic > .ant-layout {
  margin-bottom: 48px;
}

#components-layout-demo-basic > .ant-layout:last-child {
  margin: 0;
}
#components-layout-demo-basic .add-goods {
  margin: 0 20px;
}
#components-layout-demo-basic >>> .ant-btn-group {
  line-height: 80px;
}
#components-layout-demo-basic .edit-content {
  float: right;
  /* margin-right: 60px; */
}
#components-layout-demo-basic >>> .ant-tabs {
  display: inline-block;
}
#components-layout-demo-basic >>> .ant-layout-content {
  line-height: 70px;
}
.ant-pro-page-header-wrap-children-content,
.ant-pro-page-header-wrap-children-content >>> .ant-tabs {
  width: 100%;
}
.message-suggestions-list-box {
  position: relative;
}
.search-input {
  position: absolute;
  right: 0;
  bottom: 36px;
}
.right-c {
  display: flex;
}
.goods-image {
  width: 48px;
  margin-right: 5px;
  height: 48px;
  border-radius: 4px;
}
.img-wrap {
  position: relative;
}
.yxj {
  position: absolute;
  top: 0;
  left: 0;
  width: 48px;
  height: 48px;
  line-height: 48px;
  font-size: 12px;
  text-align: center;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
}
.cat-list {
  position: absolute;
  width: 100%;
  left: 0;
  top: 20px;
  bottom: 90px;
  overflow-y: scroll;
}
.add-new-cat {
  position: absolute;
  text-align: center;
  width: 100%;
  left: 0;
  height: 50px;
}
</style>
