<template>
  <div id="components-layout-demo-basic">
    <a-card :bordered="false">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px">
        <div>只可选择进行中的限时优惠商品，如果商品限时优惠已过期则不展示在前端</div>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <div style="margin-right: 20px">
            <a-button type="primary" @click="selectGoodsClick"><a-icon type="plus" />关联商品 </a-button>
            <a-popconfirm
              class="ant-dropdown-link"
              title="确认删除?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="deleteGoods()"
              @cancel="cancel"
            >
              <a-button v-if="selectedGoodsDetailList.length" style="margin-left: 20px">删除</a-button>
            </a-popconfirm>
          </div>
          <div>
            <a-input-search
              style="width: 200px"
              placeholder="输入商品/商家/店铺名称"
              v-model="keywords"
              @search="onSearch"
              @change="onSearchChange"
            />
          </div>
        </div>
      </div>
      <a-table
        :columns="columns"
        :data-source="selectedGoodsDetailList"
        :pagination="pagination"
        @change="tableChange"
        rowKey="id"
        :row-selection="{ selectedRowKeys: selectedGoodsList, onChange: onSelectChange }"
        :scroll="{ y: this.clientHeight - 330 }"
        :loading="loading"
      >
        <router-link
          :to="{ path: '/common/platform.viewpage/ShopSeckillCategoryGoods', query: { cat_id: record.cat_id } }"
          slot="goods_count"
          slot-scope="text, record"
        >
          {{ text }}个
          <a-button>去管理</a-button>
        </router-link>
        <span slot="stock" slot-scope="text, record">
          <div v-if="record.is_spec">多规格</div>
          <div v-if="!record.is_spec">{{ text == '-1' ? '无限' : text }}</div>
        </span>
        <span slot="end_date" slot-scope="text, record">
          {{ text }} {{ record.end_time }}
          <span class="red" v-if="record.over_time">已过期</span>
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
        <span slot="product_price" slot-scope="text, record">
          <div v-if="record.is_spec">
            <div>￥{{ record.product_price_min }}{{ record.product_price_min != text ? '-' + text : '' }}</div>
          </div>
          <div v-if="!record.is_spec">
            <div>￥{{ text }}</div>
          </div>
        </span>
        <span slot="status" slot-scope="text, record">
          <span v-if="record.goods_status == 0" style="display: inline-block; color: red"> 下架 </span>
          <span v-if="record.goods_status == 1" style="display: inline-block"> 上架 </span>
        </span>
        <template v-for="col in ['sort']" :slot="col" slot-scope="text, record">
          <div :key="col">
            <a-tooltip
              v-if="record.editable"
              :trigger="['focus']"
              placement="topLeft"
              overlay-class-name="numeric-input"
            >
              <template slot="title">值越大，商品排序越靠前</template>
              <a-input-number
                style="margin: -5px 2px; width: 100px"
                :value="text"
                @change="(val) => handleChangeSort(val, record.id, col)"
              />
            </a-tooltip>
            <template v-else>
              {{ text }}
            </template>
            <span class="editable-row-operations">
              <span v-if="record.editable">
                <a @click="() => save(record.id)">保存</a>
                <a-divider type="vertical" />
                <a @click="() => cancel(record.id)">取消</a>
              </span>
              <span v-else>
                <a :disabled="editingKey !== ''" @click="() => edit(record.id)">编辑</a>
              </span>
            </span>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a-popconfirm
            class="ant-dropdown-link"
            title="确认删除?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="deleteGoods(record.id)"
            @cancel="cancel"
          >
            <a-button type="link" style="margin-left: -30px">删除</a-button>
          </a-popconfirm>
        </span>
      </a-table>
    </a-card>
    <select-goods-list
      ref="selectGoodsListModal"
      :visible.sync="selectGoodsVisible"
      :list="selectGoodsList"
      :total="goodsTotal"
      :selectedList="selectedGoodsDetailListAll"
      @submit="onGoodsSelect"
      @onSearch="goodsOnSearch"
    />
  </div>
</template>

<script>
import viewpagePlatformApi from '@/api/common/platform/viewpage'
import shopPlatformApi from '@/api/shop/platform/index'
import ShopSeckillCategoryEdit from './ShopSeckillCategoryEdit'
import SelectGoodsList from '@/components/SelectGoods/SelectGoodsList'

const data = []
const sortList = []
const selectedRowKeys = []
export default {
  name: 'goodsList',
  components: { SelectGoodsList },
  data() {
    this.cacheData = data.map((item) => ({
      ...item,
    }))
    return {
      selectGoodsVisible: false,
      selectGoodsList: [],
      selectedGoodsDetailList: [],
      selectedGoodsDetailListAll: [],
      selectedGoodsList: [],
      keywords: '',
      editingKey: '',
      form: this.$form.createForm(this),
      pagination: {
        pageSize: 10,
        total: 1,
        'show-total': (total) => `共 ${total} 条记录`,
      },
      goodsTotal: 1,
      detail: {}, //订单详情
      // 查询参数
      queryParam: {
        page: 1,
      },
      // 查询参数
      queryParamShop: {
        page: 1,
      },
      cat_id: 0,
      // 表头
      columns: [
        {
          title: '商品名称',
          dataIndex: 'name',
          width: '12%',
        },
        {
          title: '商家名称',
          dataIndex: 'merchant_name',
          width: '8%',
        },
        {
          title: '店铺名称',
          dataIndex: 'store_name',
          width: '8%',
        },
        {
          title: '原价',
          dataIndex: 'product_price',
          scopedSlots: { customRender: 'product_price' },
          width: '10%',
        },
        {
          title: '优惠价',
          dataIndex: 'price',
          width: '8%',
          scopedSlots: { customRender: 'price' },
        },
        {
          title: '当前库存',
          dataIndex: 'stock',
          width: '6%',
          scopedSlots: { customRender: 'stock' },
        },
        {
          title: '活动截止时间',
          width: '15%',
          dataIndex: 'end_date',
          scopedSlots: { customRender: 'end_date' },
        },
        {
          title: '商品状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '排序',
          dataIndex: 'sort',
          width: '15%',
          scopedSlots: { customRender: 'sort' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: {
            customRender: 'action',
          },
        },
      ],
      data,
      godosList: [],
      clientHeight: 0,
      oldSort: 0,
      loading: false,
    }
  },
  watch: {
    $route: {
      handler(val) {
        if (val && val.fullPath.indexOf('ShopSeckillCategoryGoods') != -1) {
          console.log('watch=========', val)
          this.queryParam.cat_id = val.query.cat_id
          this.queryParam.keywords = ''
          this.keywords = ''
          this.queryParam.page = '1'
          this.pagination.current = 1
          this.getCategoryGoodsList()
          this.queryParamShop.keywords = ''
          this.queryParamShop.page = '1'
          this.getShopGoodsList()
          this.getCategoryGoodsListAll()
        }
      },
    },
  },
  created() {
    console.log(this.$route.query.store_id)
  },
  filters: {},
  mounted() {
    this.queryParam.cat_id = this.$route.query.cat_id
    this.clientHeight = window.document.body.clientHeight
    window.onresize = () => {
      this.clientHeight = window.document.body.clientHeight
    }
    this.getCategoryGoodsList()
    this.getShopGoodsList()
    this.getCategoryGoodsListAll()
    console.log('mounted=========')
  },
  computed: {
    hasSelected() {},
  },
  methods: {
    // 获得商品列表
    getCategoryGoodsList(changeTab = true) {
      this.loading = true
      this.request(viewpagePlatformApi.getCategoryGoodsList, this.queryParam).then((res) => {
        this.selectedGoodsDetailList = res.list
        this.pagination.total = res.total ? res.total : 0
        this.loading = false
      })
    },
    // 获得商品列表
    getCategoryGoodsListAll() {
      let queryParam = this.queryParam
      queryParam.page = 1
      queryParam.pageSize = 1000000
      this.request(viewpagePlatformApi.getCategoryGoodsList, queryParam).then((res) => {
        this.selectedGoodsDetailListAll = res.list
      })
    },
    // 获得商品列表
    getShopGoodsList() {
      this.request(shopPlatformApi.getSeckillGoodsList, this.queryParamShop).then((res) => {
        this.selectGoodsList = res.list
        this.goodsTotal = res.total
      })
    },
    // 点击选择商品弹窗
    selectGoodsClick() {
      this.selectGoodsVisible = true
    },
    // 选择商品回调
    onGoodsSelect(e) {
      this.selectGoodsVisible = false
      if (e.ids.length > 0) {
        // 保存商品信息
        this.request(viewpagePlatformApi.addCategoryGoods, { goods_ids: e.ids, cat_id: this.queryParam.cat_id }).then(
          (res) => {
            if (res.status == 1) {
              this.$message.error('请选择商品')
              return false
            } else {
              this.getCategoryGoodsList()
              this.getCategoryGoodsListAll()

              this.queryParamShop.page = e.page || 1
              this.getShopGoodsList()
            }
          }
        )
      }
    },
    // 搜索商品回调
    goodsOnSearch(e) {
      this.queryParamShop.keywords = e.keywords
      this.queryParamShop.page = e.page || 1
      this.getShopGoodsList()
    },
    // 表格中变动
    tableChange(e) {
      console.log(e, 'tableChange--------------')
      console.log(this.queryParam['page'], 'page--------------')
      if (e.current && e.current > 0 && this.queryParam['page'] != e.current) {
        this.queryParam['page'] = e.current
        this.getCategoryGoodsList()
      }
    },

    // 选择商品
    onSelectChange(selectedRowKeys) {
      this.selectedGoodsList = selectedRowKeys
    },
    deleteGoods(id) {
      if (id) {
        var id = [id]
      } else {
        var id = this.selectedGoodsList
      }
      if (id.length == 0) {
        this.$message.error('请选择商品')
        return
      }
      this.request(viewpagePlatformApi.delCategoryGoods, { goods_ids: id, cat_id: this.queryParam.cat_id })
        .then((res) => {
          this.$message.success('删除成功')
          this.getCategoryGoodsList()
          this.getCategoryGoodsListAll()
          this.selectedGoodsList = []
        })
        .catch((error) => {
          this.confirmLoading = false
        })
    },
    cancel() {},
    // 搜索
    onSearch(value) {
      this.queryParam.keywords = value
      this.queryParam.page = 1
      this.getCategoryGoodsList()
    },
    onSearchChange(e) {
      this.queryParam.keywords = this.keywords
      this.queryParam.page = 1
      this.getCategoryGoodsList()
    },
    // 编辑排序
    handleChangeSort(value, id, column) {
      const newData = [...this.selectedGoodsDetailList]
      const target = newData.filter((item) => id === item.id)[0]
      if (target) {
        target[column] = value
        this.selectedGoodsDetailList = newData
      }
    },
    //编辑排序
    edit(id) {
      const newData = [...this.selectedGoodsDetailList]
      const target = newData.filter((item) => id === item.id)[0]
      this.editingKey = id
      if (target) {
        target.editable = true
        this.selectedGoodsDetailList = newData
      }
    },
    //保存排序
    save(id) {
      const newData = [...this.selectedGoodsDetailList]
      const newCacheData = [...this.cacheData]
      const target = newData.filter((item) => id === item.id)[0]
      const targetCache = newCacheData.filter((item) => id === item.id)[0]
      if (target) {
        delete target.editable
        this.selectedGoodsDetailList = newData
        // Object.assign(targetCache, target);
        Object.assign(target, this.cacheData.filter((item) => id === item.id)[0])
        this.cacheData = newCacheData
      }
      console.log(target)
      this.request(viewpagePlatformApi.editCategoryGoodsSort, { id: target.id, sort: target.sort }).then((res) => {
        this.getCategoryGoodsList()
      })
      this.editingKey = ''
    },
    //取消排序
    cancel(id) {
      const newData = [...this.selectedGoodsDetailList]
      const target = newData.filter((item) => id === item.id)[0]
      this.editingKey = ''
      if (target) {
        Object.assign(target, this.cacheData.filter((item) => id === item.id)[0])
        delete target.editable
        this.selectedGoodsDetailList = newData
      }
      this.getCategoryGoodsList()
    },
  },
}
</script>
<style scoped>
.detail-content >>> .ant-drawer-body {
  padding: 0;
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
.red {
  color: red;
}
</style>
