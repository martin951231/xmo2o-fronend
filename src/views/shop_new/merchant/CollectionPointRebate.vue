<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <a-row type="flex" class="title">
      <a-col
        ><span class="mr-20">{{ L('集点返券') }}</span></a-col
      >
      <a-col>{{ L('通过优惠券吸引客户多下单') }}</a-col>
    </a-row>
    <a-row type="flex" class="mb-10">
      <a-button type="primary" @click="addPreferential">{{ L('新建优惠') }}</a-button>
    </a-row>
    <a-row type="flex" class="mb-10" v-if="trip">
      <div class="card">
        <p>
          {{
            L(
              '1. 活动状态分为进行中、已过期（过了活动时间）、未开始（未到开始时间）、未使用（符合活动时间但是没有设置为使用状态）、已失效（手动设置为失效）。'
            )
          }}
        </p>
        <p>{{ L('2. 一个店铺只允许有一个活动进行中') }}</p>
        <div class="end" @click="closeTrip"><a-icon type="close" /></div>
      </div>
    </a-row>
    <a-table :columns="columns" rowKey="id" :data-source="dataList" :pagination="pagination">
      <span slot="status" slot-scope="text, record">
        <span>{{ record.status_txt }}</span>
      </span>
      <span slot="goods_name" slot-scope="text, record">
        <a-tag color="blue" v-for="(item, index) in record.goods_name.split(',')" :key="index"> {{ item }} </a-tag>
      </span>
      <!-- 操作栏 -->
      <span slot="action" slot-scope="text, record">
        <a-popconfirm title="确定操作吗?" ok-text="是" cancel-text="否" @confirm="setLose(record)">
          <a class="inline-block" style="margin-right: 10px">{{
            record.status == 1 ? L('设为失效') : L('设为使用')
          }}</a>
        </a-popconfirm>
        <a class="inline-block" @click="editTicket(record)" style="margin-right: 10px">{{ L('编辑') }}</a>
        <a-popconfirm
          title="确定删除吗?"
          ok-text="是"
          cancel-text="否"
          @confirm="deleltTicket(record)"
          v-if="record.status == 0"
        >
          <a class="inline-block" style="color: red; margin-right: 10px">{{ L('删除') }}</a>
        </a-popconfirm>
      </span>
    </a-table>
    <a-modal :title="titles" v-model="addVisible" @ok="handleOk" destroyOnClose width="50%" :centered="true">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="活动名称" prop="name">
          <a-input v-model="form.name" placeholder="请输入活动名称" />
        </a-form-model-item>

        <a-form-model-item label="活动时间" :required="true" :label-col="labelCol" :wrapper-col="{ span: 15 }">
          <a-date-picker
            v-model="form.start_time"
            :disabled-date="disabledStartDate"
            show-time
            :format="dateFormat"
            placeholder="开始时间"
            @openChange="handleStartOpenChange"
            :disabled="modelType == 'edit'?true:false"
          />
          <a-date-picker
            v-model="form.end_time"
            :disabled-date="disabledEndDate"
            show-time
            :format="dateFormat"
            placeholder="结束时间"
            :open="endOpen"
            @openChange="handleEndOpenChange"
            :disabled="modelType == 'edit'?true:false"
          />
          <span class="ml-20 color-1">{{ L('开始时间最早当天') }}</span>
        </a-form-model-item>

        <a-form-model-item label="购买后多少天重置集点">
          <a-input-number :min="0" v-model="form.reset_day" :disabled="modelType == 'edit'?true:false"/>
          <span class="ml-20 color-1">{{ L('输入0不重置') }}</span>
        </a-form-model-item>

        <a-form-model-item label="集满多少单获得优惠券">
          <a-input-number :min="1" :max="10" v-model="form.total_order" />
          <span class="ml-20 color-1">{{ L('最多不能超过10单') }}</span>
        </a-form-model-item>

        <a-form-model-item label="选择优惠券" prop="coupon_id">
          <a-select v-model="form.coupon_id">
            <a-select-option :value="item.coupon_id" v-for="item in couponList" :key="item.coupon_id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="规则" prop="note">
          <a-textarea v-model="form.note" placeholder="请输入" :auto-size="{ minRows: 3, maxRows: 6 }" />
        </a-form-model-item>

        <a-form-model-item label="活动商品" required>
          <a-button type="primary" @click="addCommodity">{{ L('添加集点返券商品') }}</a-button>
        </a-form-model-item>
      </a-form-model>

      <a-table :columns="commodityColumns" rowKey="goods_id" :data-source="commodityList">
        <!-- 操作栏 -->
        <span slot="action" slot-scope="text, record">
          <a class="inline-block" style="color: red" @click="deleltCommodity(record)">{{ L('删除') }}</a>
        </span>
      </a-table>
    </a-modal>
    <a-modal
      :title="'商品列表'"
      v-model="addCommodityVisible"
      @ok="commodityOk"
      destroyOnClose
      width="60%"
      :centered="true"
    >
      <a-row type="flex">
        <a-input style="width: 300px" v-model="goodQueryParams.keywords" placeholder="请输入商品名称" />
        <a-button type="primary" @click="search('shop')" class="ml-20">{{ L('搜索') }}</a-button>
      </a-row>
      <a-table
        class="commodity"
        :columns="addCommodityColumns"
        rowKey="goods_id"
        :data-source="addCommodityList"
        :pagination="addCommodityPagination"
        :rowSelection="{
          hideDefaultSelections: true,
          selectedRowKeys: selectedRowKeys,
          onChange: onAddCommodityChange,
          onSelect: onAddCommoditySelect,
        }"
      >
        <!-- 规格 -->
        <span slot="is_sku" slot-scope="text, record">
          <span>{{ record.is_sku == 0 ? L('单规格') : L('多规格') }}</span>
        </span></a-table
      >
    </a-modal>
  </div>
</template>
<script>
import shopNewMerchantApi from '@/api/shop_new/merchant'
import moment from 'moment'
export default {
  data() {
    return {
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      //table表格头部
      columns: [
        {
          title: this.L('编号'),
          dataIndex: 'id',
        },
        {
          title: this.L('活动名称'),
          dataIndex: 'name',
        },
        {
          title: this.L('活动时间'),
          dataIndex: 'activy_time',
        },
        {
          title: this.L('活动商品'),
          dataIndex: 'goods_name',
          scopedSlots: { customRender: 'goods_name' },
        },
        {
          title: this.L('状态'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: this.L('操作'),
          scopedSlots: { customRender: 'action' },
        },
      ],
      commodityColumns: [
        {
          title: this.L('商品名称'),
          dataIndex: 'name',
        },
        {
          title: this.L('原价'),
          dataIndex: 'old_price',
        },
        {
          title: this.L('原库存'),
          dataIndex: 'stock_num',
          scopedSlots: { customRender: 'stock_num' },
        },
        {
          title: this.L('操作'),
          width: 150,
          scopedSlots: { customRender: 'action' },
        },
      ],
      addCommodityColumns: [
        {
          title: this.L('商品名称'),
          dataIndex: 'name',
        },
        {
          title: this.L('售价'),
          dataIndex: 'old_price',
        },
        {
          title: this.L('库存'),
          dataIndex: 'stock_num',
          scopedSlots: { customRender: 'stock_num' },
        },
        {
          title: this.L('是否是多规格商品'),
          dataIndex: 'is_sku',
          scopedSlots: { customRender: 'is_sku' },
        },
      ],
      queryParams: {
        page: 0,
        pageSize: 10,
        store_id: 0,
      },
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        onChange: this.onPageChange,
      },
      goodQueryParams: {
        page: 0,
        pageSize: 10,
        store_id: 0,
        keywords: '',
      },
      addCommodityPagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        onChange: this.onAddCommodityPageChange,
      },
      dataList: [],
      commodityList: [], //添加的暂存换购商品
      addCommodityList: [], //换购商品列表
      selectedRowKeys: [], //添加换购商品的key
      titles: '新建',
      addVisible: false,
      addCommodityVisible: false,
      form: {
        name: '', //活动名称
        start_time: null, //开始时间
        end_time: null, //结束时间
        note: '', //规则
        coupon_id: '', //优惠券id
        goods_ids: [], //商品id数组
        total_order: 1, //集满多少单获得优惠券
        reset_day: 0, //购买后多少天重置集点
      },
      rules: {
        name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        coupon_id: [{ required: true, message: '请选择优惠券', trigger: 'blur' }],
        note: [{ required: true, message: '请填写规则', trigger: 'blur' }],
      },
      labelCol: { span: 5 },
      wrapperCol: { span: 13 },
      itemData: null,
      modelType: 'add',
      couponList: [],
      goodsList: [],
      endOpen: false,
      trip: true,
    }
  },
  created() {
    this.queryParams.store_id = this.$route.query.store_id
    this.goodQueryParams.store_id = this.$route.query.store_id
    this.getDataList()
    this.getCouponList()
  },
  methods: {
    moment,
    getDataList() {
      this.queryParams.page = this.pagination.current
      this.queryParams.pageSize = this.pagination.pageSize
      this.request(shopNewMerchantApi.getRebateList, this.queryParams).then((res) => {
        this.dataList = res.data
        this.$set(this.pagination, 'total', res.total)
      })
    },
    //获取优惠券列表
    getCouponList() {
      this.request(shopNewMerchantApi.getRebateCouponList, { store_id: this.queryParams.store_id }).then((res) => {
        this.couponList = res
      })
    },
    //获取列表详情
    getDataListDetail() {
      let params = {
        store_id: this.queryParams.store_id,
        id: this.itemData ? this.itemData.id : '',
      }
      this.request(shopNewMerchantApi.rebateShowDetail, params).then((res) => {
        this.form = res
        this.commodityList = res.ready_goods_list
        this.goodsList = res.ready_goods_list
        this.selectedRowKeys = res.goods_ids.map((v) => {
          return parseInt(v)
        })
        this.addVisible = true
      })
    },
    //获取换购商品
    getGoodsList() {
      this.goodQueryParams.page = this.addCommodityPagination.current
      this.goodQueryParams.pageSize = this.addCommodityPagination.pageSize
      this.request(shopNewMerchantApi.getGoodsList, this.goodQueryParams).then((res) => {
        this.addCommodityList = res.data
        this.$set(this.addCommodityPagination, 'total', res.total)
      })
    },
    search(type) {
      if (type == 'shop') {
        this.getGoodsList()
      }
    },
    //新建优惠
    addPreferential() {
      this.modelType = 'add'
      this.titles = '新建'
      this.addVisible = true
      this.itemData = null
      this.commodityList = []
      this.goodsList = []
      this.selectedRowKeys = []
      this.form = {
        name: '', //活动名称
        start_time: null, //开始时间
        end_time: null, //结束时间
        note: '', //规则
        coupon_id: '', //优惠券id
        goods_ids: [], //商品id数组
        total_order: 1, //集满多少单获得优惠券
        reset_day: 0, //购买后多少天重置集点
        store_id: this.$route.query.store_id,
      }
    },
    //设置为失效
    setLose(item) {
      let params = {
        store_id: this.queryParams.store_id,
        id: item.id,
        status: item.status == 0 ? 1 : 0,
      }
      this.request(shopNewMerchantApi.changeRebateStatus, params).then((res) => {
        this.$message.success('修改状态成功')
        this.getDataList()
      })
    },
    //编辑
    editTicket(item) {
      this.itemData = item
      this.modelType = 'edit'
      this.titles = '编辑'
      this.commodityList = []
      this.goodsList = []
      this.selectedRowKeys = []
      this.getDataListDetail()
    },
    //删除
    deleltTicket(item) {
      this.itemData = item
      let params = {
        store_id: this.queryParams.store_id,
        id: item.id,
      }
      this.request(shopNewMerchantApi.deleteRebate, params).then((res) => {
        this.$message.success('删除成功')
        this.getDataList()
      })
    },
    //删除添加暂存的商品
    deleltCommodity(item) {
      this.commodityList = this.commodityList.filter((v) => v.goods_id != item.goods_id)
      this.goodsList = this.goodsList.filter((v) => v.goods_id != item.goods_id)
      this.selectedRowKeys = this.selectedRowKeys.filter((v) => v != item.goods_id)
    },
    //新增或编辑确定事件
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.form.start_time == null || this.form.end_time == null) {
            this.$message.warning('请选择活动时间')
            return
          }
          this.form.goods_ids = this.selectedRowKeys
          this.form.start_time = this.moment(this.form.start_time).format(this.dateFormat)
          this.form.end_time = this.moment(this.form.end_time).format(this.dateFormat)
          if (this.modelType == 'add') {
            this.form.store_id = this.$route.query.store_id
            this.request(shopNewMerchantApi.addRebate, this.form).then((res) => {
              this.$message.success('添加成功')
              this.addVisible = false
              this.getDataList()
            })
          } else {
            let params = {
              id: this.itemData.id,
              store_id: this.$route.query.store_id,
              ...this.form,
            }
            this.request(shopNewMerchantApi.editRebate, params).then((res) => {
              this.$message.success('编辑成功')
              this.addVisible = false
              this.getDataList()
            })
          }
        } else {
          return false
        }
      })
    },
    //添加换购商品确定事件
    commodityOk() {
      this.form.goods_ids = this.selectedRowKeys
      this.commodityList = this.goodsList
      this.addCommodityVisible = false
    },
    //添加换购商品
    addCommodity() {
      this.addCommodityVisible = true
      this.addCommodityPagination.current = 1
      this.goodQueryParams.keywords = ''
      this.getGoodsList()
    },

    //列表单选多选
    onAddCommodityChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    onAddCommoditySelect(selected, selectedRows, changeRows) {
      if (selectedRows) {
        this.goodsList.push(selected)
      } else {
        this.goodsList = this.goodsList.filter((v) => v.goods_id != selected.goods_id)
      }
    },
    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.getDataList()
    },
    //添加商品表格change事件
    onAddCommodityPageChange(page, pageSize) {
      this.$set(this.addCommodityPagination, 'current', page)
      this.getGoodsList()
    },
    disabledStartDate(startValue) {
      // const endValue = this.endValue
      // if (!startValue || !endValue) {
      //   return false
      // }
      // return startValue.valueOf() > endValue.valueOf()
      // 只能选择今天之后的日期,今天不可选~
      // return current && current < moment().endOf('day')
      // 不可以选择之前的日期,今天包括之后可以选，控制大于小于来实现选择之前的日期还是之后的日期
      return startValue < moment().subtract(1, 'day')
    },
    disabledEndDate(endValue) {
      // const startValue = this.startValue
      // if (!endValue || !startValue) {
      //   return false
      // }
      // return startValue.valueOf() >= endValue.valueOf()
      return endValue < moment().subtract(1, 'day')
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open
    },
    closeTrip() {
      this.trip = false
    },
  },
}
</script>
<style lang="less" scoped>
.title {
  align-items: center;
  margin-bottom: 10px;
  span {
    font-weight: bold;
    font-size: 18px;
    color: #333;
  }
}
.card {
  width: 100%;
  background-color: #d9edf7;
  border-color: #bce8f1;
  color: #31708f;
  border-radius: 6px;
  padding: 10px;
  padding-bottom: 0;
  position: relative;
  .end {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }
}
.color-1 {
  color: #979797;
}
/deep/ .commodity {
  margin-top: 20px;
  .ant-table-column-title {
    .ant-table-selection {
      display: none !important;
    }
  }
}
</style>