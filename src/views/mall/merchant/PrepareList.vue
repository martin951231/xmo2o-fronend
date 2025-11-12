/**
* 预售列表
* @author 钱大双
* @date 2020-10-26
*/
<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10 mh-full">
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
      <a-form-model-item label="活动时间">
        <a-range-picker
          :ranges="{
            今日: [moment(), moment()],
            近7天: [moment().subtract(7, 'days'), moment()],
            近15天: [moment().subtract(15, 'days'), moment()],
            近30天: [moment().subtract(30, 'days'), moment()],
          }"
          :value="searchForm.time"
          format="YYYY-MM-DD"
          @change="onDateRangeChange"
        />
      </a-form-model-item>
    </a-form-model>
    <div class="mt-20">
      <a-button type="primary" @click="createActivity()"> 新建活动</a-button>
      <a-button type="primary" @click="submitForm(true)" class="ml-20"> 查询</a-button>
      <a-button @click="resetForm()" class="ml-20"> 重置</a-button>
    </div>
    <!-- 数据列表 -->
    <a-table class="mt-20" rowKey="id" :columns="columns" :data-source="dataList" :pagination="pagination">
      <!-- 开始结束日期 -->
      <span slot="activityTime" slot-scope="text, record"> {{ text }} ~ {{ record.bargain_end_time }} </span>
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
        <a class="ml-10 inline-block" @click="removeActivity(text)" v-if="record.status == 2">删除</a>
      </span>
    </a-table>
  </div>
</template>
<script>
import moment from 'moment'
import mallMerchantApi from '@/api/mall/merchant/index'

export default {
  name: 'PrepareList',
  data() {
    return {
      store_id: '', // 店铺id
      //   搜索框表单
      searchForm: {
        goods_name: '', // 商品名称
        time: [],
        start_time: '', // 活动开始时间
        end_time: '', // 活动结束时间
        status: 3, // 营销状态（0未开始 1进行中 2已失效 3全部活动）
        page: 1, //默认第一页
        pageSize: 10,
      },
      //分页
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageSizeChange,
        showTotal: (total) => `共 ${total} 个活动`,
      },
      //   table表格头部
      columns: [
        {
          title: '商品名称',
          dataIndex: 'goods_name',
          key: 'goods_name',
        },
        {
          title: '定金支付时间',
          dataIndex: 'bargain_start_time',
          key: 'bargain_start_time',
          scopedSlots: { customRender: 'activityTime' },
        },
        {
          title: '定金支付单数',
          dataIndex: 'bargain_sale_num',
          key: 'bargain_sale_num',
        },
        {
          title: '尾款支付单数',
          dataIndex: 'rest_sale_num',
          key: 'rest_sale_num',
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
      dataList: [
        {
          id: 1, //id
          goods_name: '预售活动', //商品名称
          bargain_start_time: '', //定金支付时间
          bargain_end_time: '', //定金结束时间
          bargain_sale_num: 10, //定金支付单数
          rest_sale_num: 10, //尾款支付单数
          real_income: 100, //实收金额
          status: 2, //活动状态（0未开始 1进行中 2已失效）
        },
      ],
    }
  },
  watch: {
    '$route.query.store_id'(val) {
      console.log(this.$route.path)
      if ('/merchant/merchant.mall/prepareList' == this.$route.path && val) {
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
    let prepareEdit = sessionStorage.getItem('prepareEdit') || ''
    if (prepareEdit && prepareEdit == 1) {
      this.store_id = this.$route.query.store_id
      this.$set(this.pagination, 'current', 1)
      this.$set(this.pagination, 'pageSize', 10)
      this.$set(this.pagination, 'total', 0)
      this.getDataList({ store_id: this.store_id })
      sessionStorage.removeItem('prepareEdit')
    }
  },
  methods: {
    moment,
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
      this.request(mallMerchantApi.getPrepareList, params).then((res) => {
        this.dataList = res.list
        this.$set(this.pagination, 'total', res.count)
      })
    },
    // 监听日期选择变化
    onDateRangeChange(date, dateString) {
      // 更新搜索框表单数据
      this.$set(this.searchForm, 'time', [date[0], date[1]])
      this.$set(this.searchForm, 'start_time', dateString[0])
      this.$set(this.searchForm, 'end_time', dateString[1])
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
      this.$set(this, 'searchForm', { goods_name: '', start_time: '', end_time: '', status: 3, time: [] })
      this.$set(this.pagination, 'current', 1)
      this.getDataList({ store_id: this.store_id })
    },
    // 新建活动
    createActivity() {
      this.$router.push({ path: '/merchant/merchant.mall/editPrepare', query: { store_id: this.store_id } })
    },
    // 编辑活动
    editActivity(id, status) {
      if (status == 2) {
        this.$router.push({
          path: '/merchant/merchant.mall/EditPrepareLook',
          query: { store_id: this.store_id, id: id },
        })
      } else {
        this.$router.push({ path: '/merchant/merchant.mall/EditPrepare', query: { store_id: this.store_id, id: id } })
      }
    },
    // 编辑活动状态
    changeActivityState(id) {
      this.$confirm({
        title: '是否将活动失效，失效的活动将无法恢复！',
        centered: true,
        onOk: () => {
          this.request(mallMerchantApi.prepareChangeState, { id }).then((res) => {
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
          this.request(mallMerchantApi.removePrepare, { id }).then((res) => {
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
</style>