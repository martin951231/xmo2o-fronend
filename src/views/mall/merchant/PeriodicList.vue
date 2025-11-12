/**
* 周期购列表
* @author 钱大双
* @date 2020-10-30
*/
<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <!-- 搜索栏 -->
    <a-form-model layout="inline" :model="searchForm">
      <a-form-model-item label="商品名称">
        <a-input v-model="searchForm.goods_name" placeholder="请输入商品名称" />
      </a-form-model-item>
      <a-form-model-item label="活动状态">
        <a-select v-model="searchForm.status" placeholder="请选择活动状态" style="width: 100px">
          <a-select-option :value="3"> 全部活动</a-select-option>
          <a-select-option value="0"> 未开始</a-select-option>
          <a-select-option value="1"> 进行中</a-select-option>
          <a-select-option value="2"> 已失效</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
    <div class="mt-20">
      <a-button type="primary" @click="createActivity()"> 新建活动</a-button>
      <a-button type="primary" @click="submitForm(true)" class="ml-20"> 查询</a-button>
      <a-button @click="resetForm()" class="ml-20"> 重置</a-button>
    </div>
    <!-- 数据列表 -->
    <a-table class="mt-20" rowKey="id" :columns="columns" :data-source="dataList" :pagination="pagination">
      <span slot="goods_name" slot-scope="text, record">
        <div class="product-info">
          <div>
            <img :src="record.image" />
          </div>
          <div>{{ text }}</div>
        </div>
      </span>
      <span slot="periodic_count" slot-scope="text, record">
        <div>每{{ record.periodic_type == 1 ? '日' : record.periodic_type == 2 ? '周' : '月' }}一期 共{{ text }}期</div>
      </span>
      <span slot="payNumTitle">
        支付单数
        <a-tooltip trigger="“hover">
          <template slot="title">该活动支付单数，若一个用户支付多次，支付人数依然算多次 </template>
          <a-icon class="ml-10" type="question-circle" />
        </a-tooltip>
      </span>
      <!-- 开始结束日期 -->
      <span slot="activityTime" slot-scope="text, record"> {{ text }} ~ {{ record.end_time }} </span>
      <!-- 状态 -->
      <span slot="status" slot-scope="text">
        <a-badge v-if="text == 1" status="success" text="进行中" />
        <a-badge v-if="text == 2" status="default" text="已失效" />
        <a-badge v-if="text == 0" status="warning" text="未开始" />
      </span>
      <!-- 操作栏 -->
      <span slot="action" slot-scope="text, record">
        <a class="inline-block" @click="editActivity(text, record.status)">{{
          record.status != 2 ? '编辑' : '查看'
        }}</a>
        <a v-if="record.status != 2" @click="changeActivityState(text)" class="ml-10 inline-block">失效</a>
        <a class="ml-10 inline-block" v-if="record.status == 2" @click="removeActivity(text)">删除</a>
      </span>
    </a-table>
  </div>
</template>
<script>
import mallMerchantApi from '@/api/mall/merchant/index'

export default {
  name: 'PeriodicList',
  data() {
    return {
      store_id: '', // 店铺id
      //   搜索框表单
      searchForm: {
        goods_name: '', // 商品名称
        status: 3, // 营销状态（0未开始 1进行中 2已失效 3全部活动）
      },
      //   table表格头部
      columns: [
        {
          title: '商品信息',
          dataIndex: 'goods_name',
          scopedSlots: { customRender: 'goods_name' },
          width: '300px',
        },
        {
          title: '周期',
          dataIndex: 'periodic_count',
          scopedSlots: { customRender: 'periodic_count' },
        },
        {
          title: '延期期数',
          dataIndex: 'delay_limit',
          key: 'delay_limit',
        },
        {
          dataIndex: 'pay_order_num',
          key: 'pay_order_num',
          slots: { title: 'payNumTitle' },
          width: '120px',
        },
        {
          title: '实收金额',
          dataIndex: 'real_income',
          key: 'real_income',
        },
        {
          title: '活动状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
          width: '120px',
        },
        {
          title: '操作',
          dataIndex: 'id',
          key: 'id',
          scopedSlots: { customRender: 'action' },
        },
      ],
      //   列表数据
      dataList: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageSizeChange,
        showTotal: (total) => `共 ${total} 个活动`,
      },
    }
  },
  watch: {
    '$route.query.store_id'(val) {
      console.log(this.$route.path)
      if ('/merchant/merchant.mall/periodicList' == this.$route.path && val) {
        this.store_id = val
        this.getDataList({ store_id: val })
      }
    },
  },
  created() {
    this.store_id = this.$route.query.store_id
    this.getDataList({ store_id: this.store_id })
  },
  activated() {
    //   添加活动后更新订单列表
    let periodicEdit = sessionStorage.getItem('periodicEdit') || ''
    if (periodicEdit && periodicEdit == 1) {
      this.store_id = this.$route.query.store_id
      this.$set(this.pagination, 'current', 1)
      this.$set(this.pagination, 'pageSize', 10)
      this.$set(this.pagination, 'total', 0)
      this.getDataList({ store_id: this.store_id })
      sessionStorage.removeItem('periodicEdit')
    }
  },
  methods: {
    // 获取table数据
    getDataList(params) {
      if (params.is_search && params.is_search == true) {
        params.page = 1
        this.$set(this.pagination, 'current', 1)
      } else {
        params.page = this.pagination.current
        this.$set(this.pagination, 'current', this.pagination.current)
      }
      params.pageSize = this.pagination.pageSize
      this.request(mallMerchantApi.getPeriodicList, params).then((res) => {
        console.log(res)
        this.dataList = res.list
        this.$set(this.pagination, 'total', res.count)
      })
    },
    // 提交搜索表单
    submitForm(is_search = false) {
      let params = { store_id: this.store_id, ...this.searchForm }
      delete params.time
      params.is_search = is_search
      console.log(params)
      this.getDataList(params)
    },
    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.submitForm()
    },
    onPageSizeChange(page, pageSize) {
      this.$set(this.pagination, 'pageSize', pageSize)
      this.submitForm()
    },
    // 重置表单
    resetForm() {
      this.$set(this, 'searchForm', { name: '', start_time: '', end_time: '', status: 3, time: [] })
      this.$set(this.pagination, 'current', 1)
      this.getDataList({ store_id: this.store_id })
    },
    // 新建活动
    createActivity() {
      this.$router.push({ path: '/merchant/merchant.mall/editPeriodic', query: { store_id: this.store_id } })
    },
    // 编辑活动
    editActivity(id, status) {
      if (status == 2) {
        this.$router.push({
          path: '/merchant/merchant.mall/EditPeriodicLook',
          query: { store_id: this.store_id, id: id },
        })
      } else {
        this.$router.push({ path: '/merchant/merchant.mall/EditPeriodic', query: { store_id: this.store_id, id } })
      }
    },
    // 失效
    changeActivityState(id) {
      this.$confirm({
        title: '是否将活动失效，失效的活动将无法恢复！',
        centered: true,
        onOk: () => {
          this.request(mallMerchantApi.periodicChangeState, { id }).then((res) => {
            this.$message.success('操作成功！')
            this.submitForm()
          })
        },
        onCancel() {},
      })
    },
    // 删除活动
    removeActivity(id) {
      this.$confirm({
        title: '是否确定删除该活动?',
        centered: true,
        onOk: () => {
          this.request(mallMerchantApi.removePeriodic, { id }).then((res) => {
            this.$message.success('操作成功！')
            this.submitForm()
          })
        },
        onCancel() {},
      })
    },
  },
}
</script>
<style scoped lang="less">
.product-info {
  display: flex;
  align-items: center;
  img {
    width: 80px;
    height: 80px;
    margin-right: 15px;
  }
}
</style>