<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10 mh-full">
    <!-- 搜索栏 -->
    <a-form-model layout="inline" :model="searchForm">
      <a-form-model-item label="活动名称">
        <a-input v-model="searchForm.name" placeholder="请输入活动名称" />
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
            近7天: [moment(), moment().add(7, 'days')],
            近15天: [moment(), moment().add(15, 'days')],
            近30天: [moment(), moment().add(30, 'days')],
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
    <a-table class="mt-20" rowKey="id" :columns="columns" :data-source="dataList" :pagination="pagination" >
      <!-- 活动详情 -->
      <span slot="level_detail_desc" slot-scope="text, record">
        <a-popover placement="topLeft">
          <template slot="content">
            <div class="level-detail">
              <div v-for="(item, index) in record.rule" :key="item.level_sort">
                <p class="fw-bold">
                  <a-badge status="success" />{{
                    `满足 ${item.level_money}元 ${record.is_discount == 0 ? '优惠' : '折扣'} ${item.level_discount} ${
                      record.is_discount == 0 ? '元' : '折'
                    }`
                  }}
                </p>
                <a-divider v-show="index != record.rule.length - 1" />
              </div>
            </div>
          </template>
          <span>{{ text }}</span>
        </a-popover>
      </span>
      <span slot="payPeopleTitle">
        支付人数
        <a-tooltip trigger="“hover">
          <template slot="title">该活动支付人数，若一个用户支付多次，支付人数依然算作一次 </template>
          <a-icon class="ml-10" type="question-circle" />
        </a-tooltip>
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
import moment from 'moment'
import mallMerchantApi from '@/api/mall/merchant/index'

export default {
  name: 'MinusDiscountList',
  data() {
    return {
      store_id: '', // 店铺id
      // 搜索框表单
      searchForm: {
        name: '', // 店铺名称
        time: [],
        start_time: '', // 活动开始时间
        end_time: '', // 活动结束时间
        status: 3, // 营销状态（0未开始 1进行中 2已失效 -1全部活动）
      },
      // table表格头部
      columns: [
        {
          title: '活动名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '活动时间',
          dataIndex: 'start_time',
          key: 'start_time',
          scopedSlots: { customRender: 'activityTime' },
        },
        {
          title: '活动详情',
          dataIndex: 'level_detail_desc',
          key: 'level_detail_desc',
          scopedSlots: { customRender: 'level_detail_desc' },
          ellipsis: true,
        },
        {
          dataIndex: 'pay_order_people',
          key: 'pay_order_people',
          slots: { title: 'payPeopleTitle' },
          width: '120px',
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
          onChange: this.onPageChange,
          onShowSizeChange: this.onPageSizeChange,
      }
    }
  },
  watch: {
    '$route.query.store_id'(val) {
      console.log(this.$route.path)
      if ('/merchant/merchant.mall/minusDiscountList' == this.$route.path && val) {
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
    let minusDiscountEdit = sessionStorage.getItem('minusDiscountEdit') || ''
    if (minusDiscountEdit && minusDiscountEdit == 1) {
      this.store_id = this.$route.query.store_id
      this.$set(this.pagination, 'current', 1)
      this.getDataList({ store_id: this.store_id })
      sessionStorage.removeItem('minusDiscountEdit')
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
      this.request(mallMerchantApi.getMinusDiscountList, params).then((res) => {
        if (res.list.length) {
          res.list.forEach((item) => {
            item.level_detail_desc = ''
            if (item.rule && item.rule.length) {
              let level_money = item.rule[0].level_money || ''
              let level_discount = item.rule[0].level_discount || ''
              let unit = item.is_discount == 0 ? '优惠' : '折扣'
              let unit_2 = item.is_discount == 0 ? '元' : '折'
              if (level_money) {
                item.level_detail_desc = `满足 ${level_money}元 ${unit} ${level_discount} ${unit_2}`
              }
            }
          })
        }
        this.dataList = res.list || []
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
    // 重置表单
    resetForm() {
      this.searchForm = this.$options.data().searchForm
      this.getDataList({ store_id: this.store_id })
    },
    // 新建活动
    createActivity() {
      this.$router.push({
        path: '/merchant/merchant.mall/editMinusDiscount',
        query: {
          store_id: this.store_id,
        },
      })
    },
    // 编辑活动
    editActivity(id, status) {
      if (status == 2) {
        this.$router.push({
          path: '/merchant/merchant.mall/EditMinusDiscountLook',
          query: { store_id: this.store_id, id: id },
        })
      } else {
        this.$router.push({ path: '/merchant/merchant.mall/editMinusDiscount', query: { store_id: this.store_id, id } })
      }
    },
    // 失效
    changeActivityState(id) {
      this.$confirm({
        title: '是否将活动失效，失效的活动将无法恢复！',
        centered: true,
        onOk: () => {
          this.request(mallMerchantApi.minusDiscountChangeState, { id }).then((res) => {
            this.$message.success('操作成功！')
            this.submitForm()
          })
        },
        onCancel() {},
      })
    },
    // 删除活动
    removeActivity(id, status) {
      this.$confirm({
        title: '是否确定删除该活动?',
        centered: true,
        onOk: () => {
          let params = {
            id,
            is_del: 1,
          }
          this.request(mallMerchantApi.removeMinusDiscount, params).then((res) => {
            this.$message.success('操作成功！')
            this.submitForm()
          })
        },
        onCancel() {},
      })
    },
    // 页码变化
    onPageChange(page, pageSize) {
        this.$set(this.pagination, 'current', page)
        this.getDataList({ store_id: this.store_id })
    },
    onPageSizeChange(page, pageSize) {
        this.$set(this.pagination, 'pageSize', pageSize)
        this.getDataList({ store_id: this.store_id })
    },
  },
}
</script>
<style scoped>
.level-detail {
  width: 340px;
  max-height: 500px;
  overflow-y: auto;
}
</style>