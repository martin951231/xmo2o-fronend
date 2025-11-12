<template>
  <div id="components-layout-demo-basic">
    <a-card>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px">
        <div>需给每个分类下添加限时秒杀商品后，前端才可正常显示</div>
        <div>
          <a-button type="primary" @click="$refs.shopSeckillCategoryEditModal.add()">
            <a-icon type="plus" />新建分类
          </a-button>
        </div>
      </div>
      <a-table
        :columns="columns"
        :data-source="categoryList"
        :pagination="pagination"
        @change="tableChange"
        rowKey="cat_id"
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
        <span slot="status" slot-scope="text, record">
          <a-badge color="green" text="开启" v-if="text == 1" />
          <a-badge color="grey" text="关闭" v-if="text == 0" />
        </span>
        <span slot="sort" slot-scope="text, record">
          {{ record.cat_id == 1 ? '默认展示第一排' : text }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.shopSeckillCategoryEditModal.edit(record.cat_id)" v-if="record.edit">编辑</a>
          <a href="#" style="color: #747b8b" v-if="!record.edit">编辑</a>
          <a-divider type="vertical" v-if="record.cat_id != 1" />
          <a-popconfirm
            class="ant-dropdown-link"
            title="确认删除?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="deleteCate(record.cat_id)"
            @cancel="cancel"
            v-if="record.cat_id != 1"
          >
            <a href="#" style="color: #747b8b">删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </a-card>
    <shop-seckill-category-edit ref="shopSeckillCategoryEditModal" @handleUpdate="handleUpdate" />
  </div>
</template>

<script>
import viewpagePlatformApi from '@/api/common/platform/viewpage'
import ShopSeckillCategoryEdit from './ShopSeckillCategoryEdit'

const data = []
const sortList = []
const selectedRowKeys = []
export default {
  name: 'goodsList',
  components: { ShopSeckillCategoryEdit },
  data() {
    this.cacheData = data.map((item) => ({
      ...item,
    }))
    return {
      form: this.$form.createForm(this),
      pagination: {
        pageSize: 10,
        total: 1,
        current: 1,
        'show-total': (total) => `共 ${total} 条记录`,
      },
      detail: {}, //订单详情
      // 查询参数
      queryParam: {
        page: 1,
      },
      // 表头
      columns: [
        {
          title: '分类名称',
          dataIndex: 'name',
          width: '15%',
        },
        {
          title: '排序值',
          dataIndex: 'sort',
          width: '12%',
          scopedSlots: { customRender: 'sort' },
        },
        {
          title: '涵盖城市',
          width: '18%',
          dataIndex: 'city_name',
        },
        {
          title: '包含商品',
          dataIndex: 'goods_count',
          width: '12%',
          scopedSlots: { customRender: 'goods_count' },
        },
        {
          title: '最后操作时间',
          dataIndex: 'update_time',
          width: '12%',
          scopedSlots: { customRender: 'update_time' },
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: '12%',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '12%',
          scopedSlots: {
            customRender: 'action',
          },
        },
      ],
      data,
      categoryList: [],
      clientHeight: 0,
      oldSort: 0,
      loading: false,
    }
  },
  created() {
    console.log(this.$route.query.store_id)
  },
  filters: {},
  beforeRouteLeave(to, from, next) {
    this.queryParam.page = '1'
    this.pagination.current = 1
    next()
  },
  mounted() {
    this.clientHeight = window.document.body.clientHeight
    window.onresize = () => {
      this.clientHeight = window.document.body.clientHeight
    }

    this.getCategoryList()
  },
  computed: {
    hasSelected() {},
  },
  methods: {
    // 获得分类列表
    getCategoryList(changeTab = true) {
      this.loading = true
      this.request(viewpagePlatformApi.getCategoryList, this.queryParam).then((res) => {
        this.categoryList = res.list
        this.pagination.total = res.total ? res.total : 0
        this.loading = false
      })
    },
    // 表格中变动
    tableChange(e) {
      if (e.current && e.current > 0) {
        this.queryParam['page'] = e.current
        this.$set(this.pagination, 'current', e.current)
        // this.pagination.current = e.current
        console.log(this.queryParam['page'], 'page')
        this.getCategoryList()
      }
    },
    // 单个添加商品
    addCategory() {
      if (this.sortList.length == 0) {
        this.$message.error('请先添加分类')
        return false
      }
      this.$refs.editGoodsModal.add(this.queryParam.store_id, this.queryParam.sort_id)
    },
    handleUpdate() {
      this.getCategoryList()
    },
    // 删除分类
    deleteCate(cat_id) {
      this.request(viewpagePlatformApi.delCategory, { cat_id: cat_id })
        .then((res) => {
          this.$message.success('删除成功')
          this.getCategoryList()
        })
        .catch((error) => {
          this.confirmLoading = false
        })
    },
    cancel() {},
  },
}
</script>
<style scoped>
</style>
