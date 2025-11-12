<template>
  <div class="mt-10 mb-20 mh-full">
    <a-form-model
      v-bind="{
        labelCol: { span: 4 },
        wrapperCol: { span: 10 },
      }"
      :model="formData"
      :rules="rules"
      ref="form"
    >
      <a-card style="margin-top: 10px" title="优惠信息" :bordered="false">
        <a-form-model-item label="定金支付时间" required>
          <a-form-model-item :style="{ display: 'inline-block' }" prop="bargain_start_time" ref="bargainStartTime" :autoLink="false">
            <a-date-picker
              :disabled="formData.status == 2 || formData.status == 1 ? true : false"
              v-model="bargain_start_time"
              :show-time="{ format: 'HH:mm' }"
              format="YYYY-MM-DD HH:mm"
              :disabled-date="disabledStartDate"
              placeholder="请选择定金支付开始时间"
              @change="onDateStartChange"
              :getCalendarContainer="
                triggerNode => {
                    return triggerNode.parentNode
                }
              "
            />
          </a-form-model-item>
          <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
            -
          </span>
          <a-form-model-item prop="bargain_end_time" :style="{ display: 'inline-block' }" ref="bargainEndTime" :autoLink="false">
            <a-date-picker
              :disabled="formData.status == 2 ? true : false"
              v-model="bargain_end_time"
              :show-time="{ format: 'HH:mm' }"
              format="YYYY-MM-DD HH:mm"
              :disabled-date="disabledEndDate"
              placeholder="请选择定金支付结束时间"
              @change="onDateEndChange"
              :getCalendarContainer="
              triggerNode => {
                  return triggerNode.parentNode
              }
            "
            />
          </a-form-model-item>
        </a-form-model-item>
        <a-form-model-item label="尾款支付时间" :required="true">
          <a-radio-group v-model="formData.rest_type"  @change="onChange">
            <a-radio :value="0"> 固定时间 </a-radio>
            <a-radio :value="1"> 非固定时间 </a-radio>
          </a-radio-group>
          <div v-if="formData.rest_type == 0">
            <a-form-model-item :style="{ display: 'inline-block' }" prop="rest_start_time" ref="restStartTime" :autoLink="false">
              <a-date-picker
                :disabled="formData.status == 2 || formData.status == 1 ? true : false"
                v-model="rest_start_time"
                :show-time="{ format: 'HH:mm' }"
                format="YYYY-MM-DD HH:mm"
                :disabled-date="disabledRestStartDate"
                placeholder="请选择尾款支付开始时间"
                @change="onDateRestStartChange"
                :getCalendarContainer="
                triggerNode => {
                    return triggerNode.parentNode
                }
              "
              />
            </a-form-model-item>
            <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
            -
            </span>
            <a-form-model-item prop="rest_end_time" :style="{ display: 'inline-block' }" ref="restEndTime" :autoLink="false">
              <a-date-picker
                :disabled="formData.status == 2 ? true : false"
                v-model="rest_end_time"
                :show-time="{ format: 'HH:mm' }"
                format="YYYY-MM-DD HH:mm"
                :disabled-date="disabledRestEndDate"
                placeholder="请选择尾款支付结束时间"
                @change="onDateRestEndChange"
                :getCalendarContainer="
              triggerNode => {
                  return triggerNode.parentNode
              }
            "
              />
            </a-form-model-item>
          </div>
          <div v-if="formData.rest_type == 1">
            <span class="mr-10">定金支付后</span>
            <a-input-number v-model="formData.rest_start_time" :min="0"/>
            <span class="ml-10"> 时</span>
            <a-input-number v-model="formData.rest_end_time" :min="0" :max="59"/>
            <span class="ml-10">分内支付尾款</span>
          </div>
        </a-form-model-item>
        <a-form-model-item label="发货时间" :required="true">
          <a-radio-group v-model="formData.send_goods_type" @change="changeSendGoodsType">
            <a-radio :value="1"> 固定时间 </a-radio>
            <a-radio :value="2"> 非固定时间 </a-radio>
          </a-radio-group>
          <a-form-item v-if="formData.send_goods_type == 1">
            <a-date-picker
              v-model="send_goods_date"
              format="YYYY-MM-DD"
              :disabled-date="disabledDate"
              @change="onChangeSenDate"
              :getCalendarContainer="
                triggerNode => {
                    return triggerNode.parentNode
                }
              "
            />
          </a-form-item>
          <a-form-item v-if="formData.send_goods_type == 2">
              <span class="mr-10">尾款支付后</span>
              <a-input-number :min="0" v-model="formData.send_goods_days"/>
              <span class="ml-10">天发货</span>
          </a-form-item>
        </a-form-model-item>
        <a-form-model-item label="限购" prop="limit_num" help="0代表不限购，请输入0~999正整数">
          <span class="mr-10">每人最多可参与</span>
          <a-input-number :min="0" :max="999" v-model="formData.limit_num" />
          <span class="ml-10">次</span>
        </a-form-model-item>
        <a-form-model-item label="优惠是否同享" prop="is_discount_share">
          <a-radio-group v-model="formData.is_discount_share">
            <a-radio :value="1"> 是 </a-radio>
            <a-radio :value="2"> 否 </a-radio>
          </a-radio-group>
          <div v-if="formData.is_discount_share == 1">
            <a-checkbox-group v-model="formData.share_discount">
              <a-checkbox value="1"> 商家会员卡 </a-checkbox>
              <a-checkbox value="2"> 商家优惠券 </a-checkbox>
            </a-checkbox-group>
          </div>
        </a-form-model-item>
      </a-card>
      <a-card style="margin-top: 10px" title="商品信息" :bordered="false">
          <a-form-model-item label="活动商品" prop="goods_info">
              <a-button @click="addProduct()" type="primary"> 添加商品 </a-button>
              <template v-if="goodsList.length">
                  <a-popconfirm
                    placement="top"
                    ok-text="确认"
                    cancel-text="取消"
                    :visible="discount_price_visible"
                    @cancel="discount_price = '',discount_price_visible = false"
                    @confirm="batchSet($event,'discount_price')"
                    :getPopupContainer="
                      triggerNode => {
                        return triggerNode.parentNode
                      }
                    ">
                    <template slot="title">
                      <a-input-number
                        v-model="discount_price"
                        :min="0"
                        suffix="元"
                        prefix=""/>
                    </template>
                    <a-button
                      class="ml-20"
                      @click="discount_price_visible = !discount_price_visible, bargain_price_visible = false">
                      批量设置优惠价格
                    </a-button>
                  </a-popconfirm>
                  <a-popconfirm
                    placement="top"
                    ok-text="确认"
                    cancel-text="取消"
                    :visible="bargain_price_visible"
                    @cancel="bargain_price = '',bargain_price_visible = false"
                    @confirm="batchSet($event,'bargain_price')"
                    :getPopupContainer="
                      triggerNode => {
                        return triggerNode.parentNode
                      }
                    ">
                    <template slot="title">
                      <a-input-number
                        v-model="bargain_price"
                        :min="0"
                        suffix="元"
                        prefix=""/>
                    </template>
                    <a-button
                      class="ml-20"
                      @click="bargain_price_visible = !bargain_price_visible, discount_price_visible = false">
                      批量设置定金
                    </a-button>
                  </a-popconfirm>
              </template>
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 20, offset: 4 }">
              <a-table
                  v-show="goodsList.length"
                  :columns="columns"
                  :data-source="goodsList"
                  rowKey="goods_id"
                  class="mt-20"
                  :childrenColumnName="'sku_info'"
                  :defaultExpandAllRows="true"
                  :scroll="{ x: false }"
                  >
                  <span slot="name" slot-scope="text, record">
                      <a-avatar shape="square" :size="64" :src="record.image" />
                      <span class="ml-10 name">{{ text }}</span>
                  </span>
                  <span slot="skuStr" slot-scope="text,record">
                      <span v-if="record.sku_info && record.goods_type=='sku'">
                          多规格
                      </span>
                      <span v-else>
                          {{text?text:'----'}}
                      </span>
                  </span>
                  <span slot="price" slot-scope="text,record" class="cr-red">
                      <span v-if="record.sku_info && record.goods_type=='sku'">
                          ￥{{ record.min_price }} ~ ￥{{ record.max_price }}
                      </span>
                      <span v-else>
                          ￥{{ text }}
                      </span>
                  </span>
                  <span slot="discountPriceTitle">
                      优惠价格
                      <a-tooltip trigger="“hover">
                          <template slot="title">设置每个sku的优惠价格</template>
                          <a-icon class="ml-10" type="question-circle" />
                      </a-tooltip>
                  </span>
                  <span slot="discountPrice" slot-scope="text,record">
                        <span v-if="record.sku_info">
                            ----
                        </span>
                        <span v-else>
                            <a-form-item style="margin: -5px 0">
                                <a-input-number
                                  :min="0"
                                  :max="record.price - 0"
                                  v-model="record.discount_price"
                                  @blur="handleChange(record.discount_price, record, 'discount_price')"
                                />
                            </a-form-item>
                        </span>
                  </span>
                  <span slot="bargainPriceTitle">
                      定金
                      <a-tooltip trigger="“hover">
                          <template slot="title">设置每个sku的定金</template>
                          <a-icon class="ml-10" type="question-circle" />
                      </a-tooltip>
                  </span>
                  <span slot="bargainPrice" slot-scope="text,record">
                      <span v-if="record.sku_info">
                          ----
                      </span>
                      <span v-else>
                          <a-form-item style="margin: -5px 0">
                              <a-input-number
                                :min="0"
                                :max="record.price - 0"
                                v-model="record.bargain_price"
                                @blur="handleChange(record.bargain_price, record, 'bargain_price')"
                              />
                          </a-form-item>
                      </span>
                  </span>
                  <span slot="restPriceTitle">
                      尾款
                      <a-tooltip trigger="“hover">
                          <template slot="title">设置每个sku的尾款</template>
                          <a-icon class="ml-10" type="question-circle" />
                      </a-tooltip>
                  </span>
                  <span slot="restPrice" slot-scope="text,record">
                      <span v-if="record.sku_info">
                          ----
                      </span>
                      <span v-else>
                          {{ record.rest_price }}
                      </span>
                  </span>
                  <span slot="action" slot-scope="text,record">
                      <span v-if="record.sku_info">
                          <a class="ml-10 inline-block" @click="removeGoods(record)">删除</a>
                      </span>
                      <span v-else>
                          ----
                      </span>
                  </span>
              </a-table>
          </a-form-model-item>
      </a-card>
      <a-form-model-item :wrapper-col="{ span: 16, offset: 2 }" v-if="formData.status != 2">
        <div class="mt-20 mb-20">
          <a-button type="primary" @click="saveData()"> 保存 </a-button>
        </div>
      </a-form-model-item>
    </a-form-model>
    <!-- group  shipping-->
    <select-goods
      ref="selectGoods"
      type="radio"
      :storeId="store_id"
      source="prepare"
      :startTime="formData.bargain_start_time"
      :endTime="formData.bargain_end_time"
      @submit="selecrGoodsSubmit"
      :selectedList="goodsList"
    />
  </div>
</template>
<script>
import mallMerchantApi from '@/api/mall/merchant/index'
import moment from 'moment'
import SelectGoods from './modules/SelectGoods'
import { getNowFormatDate } from '@/utils/util'
import { watchMixin } from '@/utils/mixin'
export default {
  name: 'PrepareEdit',
  mixins: [watchMixin],
  components: { SelectGoods },
  data() {
    return {
      store_id: '', // 店铺id
      id: '', // 活动id
      addGoodsModalVisible: false,
      // 表单数据
      formData: {
        bargain_start_time: '',
        bargain_end_time: '',
        rest_type: 0,
        rest_start_time: '',
        rest_end_time: '',
        send_goods_type: 1,
        send_goods_days: '',
        send_goods_date: '',
        is_discount_share: 1,
        share_discount: ['1','2'],
        limit_num: 0,
      },
      // 表单校验规则
      rules: {
        time: [{ required: true, message: '请选择活动时间', trigger: 'blur' }],
        bargain_start_time: [{ required: true, message: '请选择定金支付开始时间', trigger: 'blur' }],
        bargain_end_time: [{ required: true, message: '请选择定金支付结束时间', trigger: 'blur' }],
        rest_start_time: [{ required: true, message: '请选择尾款支付开始时间', trigger: 'blur' }],
        rest_end_time: [{ required: true, message: '请选择尾款支付结束时间', trigger: 'blur' }],
        limit_num: [{ required: true, message: '请选择限购数量', trigger: 'blur' }],
        is_discount_share: [{ required: true, message: '请选择优惠是否同享', trigger: 'blur' }],
        goods_info: [{ required: true, message: '请添加活动商品', trigger: 'blur' }],
      },
      columns: [
        {
          title: '商品信息',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '规格',
          dataIndex: 'sku_str',
          scopedSlots: { customRender: 'skuStr' },
        },
        {
          title: '原价格',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' },
        },
        {
          title: '当前库存',
          dataIndex: 'stock_num',
        },
        {
          dataIndex: 'discount_price',
          key: 'discount_price',
          slots: { title: 'discountPriceTitle' },
          scopedSlots: { customRender: 'discountPrice' },
        },
        {
          dataIndex: 'bargain_price',
          key: 'bargain_price',
          slots: { title: 'bargainPriceTitle' },
          scopedSlots: { customRender: 'bargainPrice' },
        },
        {
          dataIndex: 'rest_price',
          key: 'rest_price',
          slots: { title: 'restPriceTitle' },
          scopedSlots: { customRender: 'restPrice' },
        },
        {
          title: '操作',
          dataIndex: 'goods_id',
          width: '100px',
          scopedSlots: { customRender: 'action' },
        },
      ],
      goodsList: [],
      selectedRowKeys: [],
      discount_price: '', // 批量设置优惠价格
      bargain_price: '', // 批量设置定金
      discount_price_visible: false, // 批量设置优惠价格弹框显隐
      bargain_price_visible: false, // 批量设置定金弹框显隐
      bargain_start_time: null,
      bargain_end_time: null,
      rest_start_time: null,
      rest_end_time: null,
      send_goods_date: null,
    }
  },
  watch: {
    '$route.path' (val) {
      if (val == '/merchant/merchant.mall/EditPrepare') {
        this.id = ''
        this.resetForm()
      }
    },
    '$route.query.store_id'(val) {
      if (val) {
        this.store_id = val
        this.resetForm()
      }
    },
    '$route.query.id'(val) {
      this.$nextTick(() => {
        if (this.activatedFlag) {
          if (val) {
            this.id = val
            this.resetForm()
            this.getFormData()
          } else {
            this.id = ''
            this.resetForm()
          }
        } else {
          this.id = ''
          this.resetForm()
        }
      })
    },
  },
  computed: {
    // 表格选择操作
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        type: 'checkbox',
        // onSelect: this.onRowSelect,
        // onSelectAll: this.onSelectAll,
        onChange: this.onSelectChange,
        getCheckboxProps: (record) => ({
          props: {},
        }),
      }
    },
  },
  created() {
    this.store_id = this.$route.query.store_id
    this.resetForm()
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getFormData()
    }
  },
  methods: {
    moment,
    disabledDate(current) {
      if (this.formData.rest_type == 0) {
        const endValue = this.rest_end_time // 尾款支付结束时间
        const bargainValue = this.bargain_end_time; // 定金结束支付时间
        if (!endValue) {
          return current.valueOf() < bargainValue.valueOf()+86400
        } else{
          return current.valueOf() < endValue.valueOf()+86400
        }
      } else {
        const bargainValue = this.bargain_end_time; // 定金结束支付时间
        return current.valueOf() < bargainValue.valueOf()+86400
      }

    },
    // 定金开始日期选择器设置禁止选择时间
    disabledStartDate(current) {
      return current < moment().add(-1, 'd')
    },
    // 定金结束日期选择器设置禁止选择时间
    disabledEndDate(endValue) {
      const startValue = this.bargain_start_time
      if (!startValue) {
        return endValue < moment().add(-1, 'd')
      } else{
        return startValue.valueOf() > endValue.valueOf()
      }
    },
    // 监听定金开始日期选择变化
    onDateStartChange(start_time_moment, start_time) {
      this.$set(this.formData, 'bargain_start_time', start_time)
      this.$refs.bargainStartTime.onFieldChange()
    },
    // 监听定金结束日期选择变化
    onDateEndChange(end_time_moment, end_time) {
      const startValue = moment(this.formData.bargain_start_time).valueOf()
      const endValue = moment(end_time).valueOf()
      if (endValue < startValue) {
        this.$message.error('定金支付结束时间必须大于定金支付开始时间！')
        return
      }
      this.$set(this.formData, 'bargain_end_time', end_time)
      this.$refs.bargainEndTime.onFieldChange()
    },
    // 尾款开始日期选择器设置禁止选择时间
    disabledRestStartDate(current) {
      const endValue = this.bargain_end_time
      if (!endValue) {
        return current < moment().add(-1, 'd')
      } else{
        return current.valueOf() < endValue.valueOf()
      }
    },
    // 尾款结束日期选择器设置禁止选择时间
    disabledRestEndDate(endValue) {
      const startValue = this.rest_start_time
      if (!startValue) {
        return endValue < moment().add(-1, 'd')
      } else{
        return startValue.valueOf() > endValue.valueOf()
      }
    },
    // 监听定金开始日期选择变化
    onDateRestStartChange(start_time_moment, start_time) {
      this.$set(this.formData, 'rest_start_time', start_time)
      this.$refs.restStartTime.onFieldChange()
    },
    // 监听定金结束日期选择变化
    onDateRestEndChange(end_time_moment, end_time) {
      const startValue = moment(this.formData.rest_start_time).valueOf()
      const endValue = moment(end_time).valueOf()
      if (endValue < startValue) {
        this.$message.error('尾款支付结束时间必须大于尾款支付开始时间！')
        return
      }
      this.$set(this.formData, 'rest_end_time', end_time)
      this.$refs.restEndTime.onFieldChange()
    },
    // 表单信息
    getFormData() {
      this.request(mallMerchantApi.getPrepareInfo, { id: this.id }).then((res) => {
        this.bargain_start_time = moment(res.bargain_start_time)
        this.bargain_end_time = moment(res.bargain_end_time)
        if (res.send_goods_date) {
          this.send_goods_date = moment(res.send_goods_date)
        } else {
          this.send_goods_date = null
        }

        if(res.rest_type == 0){
          this.rest_start_time = moment(res.rest_start_time)
          this.rest_end_time = moment(res.rest_end_time)
        }else{
          res.rest_start_time = res.rest_start_time /3600;//转换成小时
          res.rest_end_time = res.rest_end_time /60;//转换成分钟
        }
        if (res.is_discount_share == 1) {
          res.share_discount = []
          if (res.discount_card == 1) {
            res.share_discount.push('1')
          }
          if (res.discount_coupon == 1) {
            res.share_discount.push('2')
          }
        }
        this.$set(this, 'formData', res)
        // if (res.send_goods_date == '') {
        //   this.formData.send_goods_date = null
        // } else {
        //   this.formData.send_goods_date = moment(res.send_goods_date)
        // }
        let goodsList = res.goods_info || []
        this.goodsList = goodsList.length?goodsList.map((item) => {
          if (item.sku_info && item.sku_info.length) {
            item.sku_info.forEach((item_sku) => {
              item_sku.name = item.name
              item_sku.image = item.image
              item_sku.goods_id = item.goods_id + '_' + item_sku.sku_id
            })
          }
          return item
        }):[]
      })
    },
    // 监听日期选择变化
    onDateRangeChange(date, dateString) {
      // 更新表单数据
      this.$set(this.formData, 'time', [date[0], date[1]])
      this.$set(this.formData, 'start_time', dateString[0])
      this.$set(this.formData, 'end_time', dateString[1])
    },
    // 监听日期选择变化
    onBargainDateRangeChange(date, dateString) {
      // 更新表单数据
      this.$set(this.formData, 'bargain_time', [date[0], date[1]])
      this.$set(this.formData, 'bargain_start_time', dateString[0])
      this.$set(this.formData, 'bargain_end_time', dateString[1])
    },
    // 监听日期选择变化
    onRestDateRangeChange(date, dateString) {
      // 更新表单数据
      this.$set(this.formData, 'rest_time', [date[0], date[1]])
      this.$set(this.formData, 'rest_start_time', dateString[0])
      this.$set(this.formData, 'rest_end_time', dateString[1])
    },
    onChange(event){
      // 更新表单数据
      this.$set(this.formData, 'rest_start_time', '')
      this.$set(this.formData, 'rest_end_time', '')
    },
    changeSendGoodsType (e) {
      if (e.target.value == 1) {
        this.formData.send_goods_date = getNowFormatDate()
      } else {
        this.formData.send_goods_days = ''
      }
    },
    onChangeSenDate(start_time_moment, start_time) {
      this.$set(this.formData, 'send_goods_date', start_time)
    },
    // 添加商品
    addProduct() {
      if (!this.bargain_start_time || !this.bargain_end_time) {
        this.$message.error('请先选择定金支付时间！')
        return
      }
      this.$refs.selectGoods.openDialog()
    },
    // 选择商品回调
    selecrGoodsSubmit(e) {
      console.log(e,'e-----selecrGoodsSubmit-----选择商品回调')
        e.goods = e.goods.map((item) => {
            if (item.sku_info && item.sku_info.length) {
                item.sku_info.forEach((item_sku) => {
                  item_sku.name = item.name
                  item_sku.image = item.image
                  item_sku.goods_id = item.goods_id + '_' + item_sku.sku_id
                  //优惠价格
                  if (!item_sku.discount_price) {
                    item_sku.discount_price = ''
                  }
                  //定金
                  if (!item_sku.bargain_price) {
                    item_sku.bargain_price = ''
                  }
                  //尾款
                  if (!item_sku.rest_price) {
                    item_sku.rest_price = 0
                  }
              })
            }
            return item
        })
        this.goodsList = e.goods
        this.$set(this.formData, 'goods_info', this.goodsList.length?this.goodsList[0]:'')
        console.log(this.goodsList,'this.goodsList')

    },
    // 监听table多选
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 定金|||优惠金额设置
    handleChange(text,record,type) {
      this.goodsList = this.goodsList.map(item => {
        if (item.sku_info && item.sku_info.length) {
          item.sku_info = item.sku_info.map(sku_item => {
            sku_item.rest_price = Math.round((sku_item.price - sku_item.discount_price -  sku_item.bargain_price + Number.EPSILON) * 100) / 100
            if (sku_item.rest_price < 0) {
              if (type == 'discount_price') {
                sku_item.discount_price = 0
              } else {
                sku_item.bargain_price = 0
              }
              sku_item.rest_price = Math.round((sku_item.price - sku_item.discount_price -  sku_item.bargain_price + Number.EPSILON) * 100) / 100
            }
            return sku_item
          })
        }
        return item
      })
    },
    // 批量设置定金||优惠金额
    batchSet(e, type) {
      let min_price = 0
      this.goodsList.forEach(item => {
        if (item.goods_type == 'spu') {
          min_price = item.price
        } else {
          min_price = item.min_price
        }
      })

      if (type == 'discount_price' && (Number(this.discount_price) > Number(min_price))) {
        this.$message.error('批量设置优惠价格不能大于原价格')
        return
      } else {
        this.discount_price_visible = false
        this.bargain_price_visible = false
      }

      if (type == 'bargain_price' && (Number(this.bargain_price) > Number(min_price))) {
        this.$message.error('批量设置定金不能大于原价格')
        return
      } else {
        this.discount_price_visible = false
        this.bargain_price_visible = false
      }

      if ((Number(this.discount_price) + Number(this.bargain_price))  > Number(min_price)) {
        this.$message.error('批量设置优惠价格+批量设置定金大于原价格')
        return
      } else {
        this.discount_price_visible = false
        this.bargain_price_visible = false
      }


      this.goodsList = this.goodsList.map(item => {
        if (item.sku_info && item.sku_info.length) {
          item.sku_info = item.sku_info.map(sku_item => {
            if (type == 'discount_price') {
              sku_item[type] = this.discount_price
            } else if (type == 'bargain_price') {
              sku_item[type] = this.bargain_price
            }

            if (sku_item.rest_price < 0) {
              if (type == 'discount_price') {
                sku_item.discount_price = 0
              } else {
                sku_item.bargain_price = 0
              }
            }
            sku_item.rest_price = Math.round((sku_item.price - sku_item.discount_price -  sku_item.bargain_price + Number.EPSILON) * 100) / 100
            return sku_item
          })
        }
        return item
      })

      if (type == 'discount_price') {
        this.discount_price = ''
      } else if (type == 'bargain_price') {
        this.bargain_price = ''
      }
    },
    // 删除商品
    removeGoods(record) {
      if (record.sku_id) {
        this.goodsList.forEach(item => {
          if (item.sku_info && item.sku_info.length) {
            item.sku_info.forEach((sku_item,sku_index) => {
              if (sku_item.sku_id == record.sku_id) {
                item.sku_info.splice(sku_index, 1)
              }
            })
          }
        })
      } else {
        if (record.goods_id) {
          for (var i = 0; i < this.goodsList.length; i++) {
            if (this.goodsList[i].goods_id === record.goods_id) {
              this.goodsList.splice(i, 1)
            }
          }
        }
      }
    },
    resetForm() {
      this.$set(this, 'formData', {
        // bargain_time:[],
        bargain_start_time: '',
        bargain_end_time: '',
        rest_type: 0,
        // rest_time:[],
        rest_start_time:'',
        rest_end_time:'',
        send_goods_type: 1,
        send_goods_days:'',
        send_goods_date: getNowFormatDate(),
        is_discount_share: 1,
        share_discount: ['1','2'],
        limit_num: 0,
      })
      this.bargain_start_time = this.$options.data().bargain_start_time
      this.bargain_end_time = this.$options.data().bargain_end_time
      this.rest_start_time = this.$options.data().rest_start_time
      this.rest_end_time = this.$options.data().rest_end_time
      this.send_goods_date = this.$options.data().send_goods_date
      this.goodsList = []
      this.$forceUpdate()
    },
    // 提交表单
    saveData() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let formData = this.formData
          if (formData.send_goods_type == 1 && !formData.send_goods_date) {
            this.$message.error('请选择固定时间的发货日期！')
            return
          }

          if (moment(formData.bargain_end_time).valueOf() < moment(formData.bargain_start_time).valueOf()) {
            this.$message.error('定金支付结束时间必须大于定金支付开始时间！')
            return
          }
          if (formData.rest_type == 0){
            if (moment(formData.rest_start_time).valueOf() <= moment(formData.bargain_start_time).valueOf()) {
              this.$message.error('尾款支付开始时间应在定金支付开始时间之后')
              return
            }

            if (moment(formData.rest_end_time).valueOf() < moment(formData.rest_start_time).valueOf()) {
              this.$message.error('尾款支付结束时间必须大于尾款支付开始时间！')
              return
            }
          }
          if (formData.send_goods_type == 1){//发货时间：固定时间
            if(formData.rest_type == 0) {//尾款支付时间类型 0=固定时间 1=定金支付后
              var rest_endtime = moment(formData.rest_end_time).valueOf() / 1000
            } else {
              var rest_endtime = (moment(formData.bargain_end_time).valueOf() / 1000) + (formData.rest_start_time * 3600) + (formData.rest_end_time * 60)
            }
            var send_goodsdate = moment(formData.send_goods_date).valueOf() / 1000

            if (send_goodsdate <= rest_endtime) {
              this.$message.error('发货时间应在尾款支付结束时间之后')
              return
            }
          }

          if (formData.is_discount_share == 1 && formData.share_discount.length == 0) {
            this.$message.error('请选择优惠同享类型')
            return
          }
          if (this.goodsList.length == 0) {
            this.$message.error('请选择活动商品')
            return
          }
          if (formData.is_discount_share == 1) {
            formData.discount_card = 0
            formData.discount_coupon = 0
            formData.share_discount.forEach((item) => {
              if (item == 1) {
                formData.discount_card = 1
              } else if (item == 2) {
                formData.discount_coupon = 1
              }
            })
          }
          formData.store_id = this.store_id
          if (this.id) {
            formData.id = this.id
          }
         let goods_sku = [];
          for (var i = 0; i < this.goodsList[0].sku_info.length; i++) {
            if(this.goodsList[0].sku_info[i].bargain_price == '') {
              this.$message.error(this.goodsList[0].sku_info[i].sku_str+'定金必填')
              return
            }

            if (this.goodsList[0].sku_info[i].rest_price <= 0) {
              if (this.goodsList[0].sku_info[i].sku_str) {
                if (this.goodsList[0].sku_info[i].rest_price == 0) {
                  this.$message.error(this.goodsList[0].sku_info[i].sku_str+'尾款等于0,设置不合理')
                } else {
                  this.$message.error(this.goodsList[0].sku_info[i].sku_str+'尾款小于0,设置不合理')
                }
              } else {
                if (this.goodsList[0].sku_info[i].rest_price == 0) {
                  this.$message.error(this.goodsList[0].name+'尾款等于0,设置不合理')
                } else {
                  this.$message.error(this.goodsList[0].name+'尾款小于0,设置不合理')
                }
              }
              return
            }

            let sku = {
              goods_id:this.goodsList[0].goods_id,
              goods_name:this.goodsList[0].name,
              sku_id:this.goodsList[0].sku_info[i].sku_id,
              sku_str:this.goodsList[0].sku_info[i].sku_str,
              act_stock_num:this.goodsList[0].sku_info[i].stock_num,
              bargain_price:this.goodsList[0].sku_info[i].bargain_price,
              discount_price:this.goodsList[0].sku_info[i].discount_price,
              rest_price:this.goodsList[0].sku_info[i].rest_price,
            };
            goods_sku.push(sku)
          }

          if (goods_sku.length) {
            formData.goods_sku = JSON.stringify(goods_sku)
          }else{
            this.$message.error('请填写活动商品的定金等信息')
            return
          }

          delete formData.share_discount
          delete formData.goods_info
          if (formData.rest_type == 1){
            formData.rest_start_time = formData.rest_start_time * 3600;
            formData.rest_end_time = formData.rest_end_time * 60;
          }
          console.log(formData,"submit-----formData");
          this.request(mallMerchantApi.updatePrepare,formData).then((res) => {
             this.resetForm();
             this.$message.success('提交成功！')
             this.$router.push({path: '/merchant/merchant.mall/prepareList', query: {store_id: this.store_id}})
             sessionStorage.setItem('prepareEdit', 1)
          })
        } else {
          console.log('error submit!!', this.formData)
          return false
        }
      })
    },
  },
}
</script>
<style scoped lang="less">
.name {
  display: inline-block;
  max-width: 200px;
  white-space: wrap;
  word-break: break-all;
}
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