<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10 mh-full">
    <!-- 搜索栏 -->
    <a-form-model layout="inline" :model="searchForm">
      <a-form-model-item label="活动名称">
        <a-input v-model="searchForm.name" placeholder="请输入活动名称" />
      </a-form-model-item>
      <a-form-model-item label="活动状态">
        <a-select v-model="searchForm.status" placeholder="请选择活动状态" style="width: 100px">
          <a-select-option :value="3"> 全部活动 </a-select-option>
          <a-select-option value="0"> 未开始 </a-select-option>
          <a-select-option value="1"> 进行中 </a-select-option>
          <a-select-option value="2"> 已失效 </a-select-option>
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
          :getCalendarContainer="
            (triggerNode) => {
              return triggerNode.parentNode
            }
          "
        />
      </a-form-model-item>
    </a-form-model>
    <div class="mt-20">
      <a-button type="primary" @click="createActivity()"> 新建活动 </a-button>
      <a-button type="primary" @click="submitForm()" class="ml-20"> 查询 </a-button>
      <a-button @click="resetForm()" class="ml-20"> 重置 </a-button>
    </div>
    <!-- 数据列表 -->
    <a-table class="mt-20" rowKey="id" :columns="columns" :data-source="dataList" :pagination="pagination">
      <!-- 活动详情 -->
      <span slot="level_detail_desc" slot-scope="text, record">
        <a-popover placement="topLeft">
          <template slot="content">
            <div class="level-detail">
              <div v-for="(item, index) in record.level_detail" :key="item.level_sort">
                <p class="fw-bold">
                  <a-badge status="success" />{{ `满 ${item.level_money}${record.full_type == 1 ? '元' : '件'} 赠` }}
                </p>
                <p v-for="itemSub in item.goods" :key="itemSub.sku_id" class="pl-10 pr-10">
                  <span>{{ itemSub.name }}</span>
                  <span v-show="itemSub.sku_str" class="ml-10">{{ itemSub.sku_str }}</span>
                  <span v-show="itemSub.gift_num" class="ml-10">x{{ itemSub.gift_num }}</span>
                </p>
                <a-divider v-show="index != record.level_detail.length - 1" />
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
        <a class="ml-10 inline-block" @click="changeActivityState(text)" v-if="record.status != 2">失效</a>
        <a class="ml-10 inline-block" v-if="record.status == 2" @click="removeActivity(text, record.status)">删除</a>
      </span>
    </a-table>
  </div>
</template>
<script>
import moment from 'moment'
import mallMerchantApi from '@/api/mall/merchant/index'
export default {
  name: 'GiveList',
  data() {
    return {
      store_id: '', // 店铺id
      // 搜索框表单
      searchForm: {
        name: '', // 店铺名称
        time: [],
        start_time: '', // 活动开始时间
        end_time: '', // 活动结束时间
        status: 3, // 营销状态（0未开始 1进行中 2已失效 3全部活动）
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
      dataList: [
        {
          id: 1, //id
          name: '满赠活动', //活动名称
          start_time: '2020-11-11 00:00:00', //活动开始时间
          end_time: '2020-11-11 23:59:59', //活动结束时间
          pay_order_people: 10, //支付人数
          pay_order_num: 10, //支付单数
          real_income: 100, //实收金额
          status: 2, //活动状态（0未开始 1进行中 2已失效）
          level_detail: [
            {
              id: 1,
              level_sort: 1,
              level_money: '50.00',
              googs: [
                {
                  goods_id: 1,
                  name: '华为P40',
                },
              ],
            },
            {
              id: 2,
              level_sort: 2,
              level_money: '100.00',
              googs: [
                {
                  goods_id: 1,
                  name: '华为P40',
                },
              ],
            },
            {
              id: 3,
              level_sort: 3,
              level_money: '150.00',
              googs: [
                {
                  goods_id: 1,
                  name: '华为P40',
                },
              ],
            },
            {
              id: 4,
              level_sort: 4,
              level_money: '200.00',
              googs: [
                {
                  goods_id: 1,
                  name: '华为P40',
                },
              ],
            },
            {
              id: 5,
              level_sort: 5,
              level_money: '250.00',
              googs: [
                {
                  goods_id: 1,
                  name: '华为P40',
                },
              ],
            },
          ],
        },
      ],
    }
  },
  watch: {
    '$route.query.store_id'(val) {
      console.log(this.$route.path)
      if ('/merchant/merchant.mall/giveList' == this.$route.path && val) {
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
    let giveEdit = sessionStorage.getItem('giveEdit') || ''
    if (giveEdit && giveEdit == 1) {
      this.store_id = this.$route.query.store_id
      this.getDataList({ store_id: this.store_id })
      sessionStorage.removeItem('giveEdit')
    }
  },
  methods: {
    moment,
    // 获取table数据
    getDataList(params) {
      this.request(mallMerchantApi.getGiveList, params).then((res) => {
        if (res.list.length) {
          this.$set(this.pagination, 'total', res.count)
          res.list.forEach((item) => {
            item.level_detail_desc = ''
            if (
              item.level_detail &&
              item.level_detail.length &&
              item.level_detail[0].goods &&
              item.level_detail[0].goods.length
            ) {
              let level_money = item.level_detail[0].level_money || ''
              let { name = '', gift_num = 0 } = item.level_detail[0].goods[0] || ''
              let unit = item.full_type == 1 ? '元' : '件'
              if (level_money && name && gift_num) {
                item.level_detail_desc = `满 ${level_money}${unit} 赠${name}  数量x${gift_num}`
              }
            }
          })
        }
        this.dataList = res.list || []
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
    submitForm() {
      let params = { store_id: this.store_id, ...this.searchForm }
      delete params.time
      console.log(params)
      this.getDataList(params)
    },
    // 重置表单
    resetForm() {
      this.searchForm = this.$options.data().searchForm
      this.getDataList({ store_id: this.store_id })
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
    // 新建活动
    createActivity() {
      this.$router.push({
        path: '/merchant/merchant.mall/EditGive',
        query: {
          store_id: this.store_id,
        },
      })
    },
    // 编辑活动
    editActivity(id, status) {
      if (status == 2) {
        this.$router.push({ path: '/merchant/merchant.mall/EditGiveLook', query: { store_id: this.store_id, id: id } })
      } else {
        this.$router.push({ path: '/merchant/merchant.mall/EditGive', query: { store_id: this.store_id, id } })
      }
    },
    // 失效
    changeActivityState(id) {
      this.$confirm({
        title: '是否将活动失效，失效的活动将无法恢复！',
        centered: true,
        onOk: () => {
          this.request(mallMerchantApi.giveChangeState, { id }).then((res) => {
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
          this.request(mallMerchantApi.giveDel, params).then((res) => {
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
<style scoped>
.level-detail {
  width: 340px;
  max-height: 500px;
  overflow-y: auto;
}
</style>