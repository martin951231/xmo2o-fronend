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
      <a-card title="基本信息" :bordered="false">
        <a-form-model-item label="活动名称" prop="name">
          <a-input v-model="formData.name" placeholder="请输入活动名称" :disabled="formData.status == 2 ? true : false"/>
        </a-form-model-item>
        <a-form-model-item label="活动预告设置" prop="is_discount_share">
          <a-radio-group v-model="formData.notice_type">
            <a-radio :value="1"> 不进行活动预告</a-radio>
            <a-radio :value="2"> 进行活动预告</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 8, offset: 4 }"  help="最多填写240小时,填写’0‘代表不进行活动预告" v-if="formData.notice_type == 2">
          <span class="mr-10">活动开始前</span>
          <a-input-number :min="0" :max="240" v-model="formData.notice_time"/>
          <span class="ml-10">小时进行活动预告</span>
        </a-form-model-item>
      </a-card>
      <a-card style="margin-top: 10px" title="优惠信息" :bordered="false">
        <a-form-model-item label="活动时间" help="活动将按照指定周期自动生效" prop="time_type">
          <a-radio-group v-model="formData.time_type" @change="changeTimeType">
            <a-radio :value="1"> 固定时间</a-radio>
            <a-radio :value="2"> 按周期</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="起止日期">
          <a-form-model-item :style="{ display: 'inline-block' }" prop="start_time" ref="startTime" :autoLink="false">
            <a-date-picker
              :disabled="formData.status == 2 || formData.status == 1 ? true : false"
              v-model="start_time"
              :show-time="showTime"
              :format="dateFormat"
              :disabled-date="disabledStartDate"
              placeholder="请选择活动开始时间"
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
          <a-form-model-item prop="end_time" :style="{ display: 'inline-block' }" ref="endTime" :autoLink="false">
            <a-date-picker
              :disabled="formData.status == 2 ? true : false"
              v-model="end_time"
              :show-time="showTime"
              :format="dateFormat"
              :disabled-date="disabledEndDate"
              placeholder="请选择活动结束时间"
              @change="onDateEndChange"
              :getCalendarContainer="
              triggerNode => {
                  return triggerNode.parentNode
              }
            "
            />
          </a-form-model-item>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 8, offset: 4 }" v-if="formData.time_type == 2">
          <a-radio-group v-model="formData.cycle_type" @change="cycleTypeChange">
            <a-radio :value="1"> 每日</a-radio>
            <a-radio :value="2"> 每周</a-radio>
            <a-radio :value="3"> 每月</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 8, offset: 4 }"
                           v-if="formData.time_type == 2 && formData.cycle_type == 2">
          <a-checkbox-group v-model="formData.cycle_date">
            <a-checkbox value="1"> 周一</a-checkbox>
            <a-checkbox value="2"> 周二</a-checkbox>
            <a-checkbox value="3"> 周三</a-checkbox>
            <a-checkbox value="4"> 周四</a-checkbox>
            <a-checkbox value="5"> 周五</a-checkbox>
            <a-checkbox value="6"> 周六</a-checkbox>
            <a-checkbox value="0"> 周日</a-checkbox>
          </a-checkbox-group>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 8, offset: 4 }"
                           v-if="formData.time_type == 2 && formData.cycle_type == 3">
          <a-input-number v-model="formData.cycle_date" :min="0" :max="30"/>号
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 8, offset: 4 }"
                           v-if="formData.time_type == 2">
          <a-time-picker
            :default-value="moment(formData.cycle_start_time, 'HH:mm')"
            format="HH:mm"
            @change="onCycleStimeeRangeChange"
            :getPopupContainer="
              triggerNode => {
                  return triggerNode.parentNode
              }"
          />
          <span>-</span>
          <a-time-picker
            :default-value="moment(formData.cycle_end_time, 'HH:mm')"
            format="HH:mm"
            @change="onCycleEtimeeRangeChange"
            :getPopupContainer="
              triggerNode => {
                  return triggerNode.parentNode
              }"
          />
        </a-form-model-item>
<!--        <a-form-model-item label="抹零" prop="remove_type">-->
<!--          <a-radio-group v-model="formData.remove_type">-->
<!--            <a-radio :value="1"> 抹去角和分</a-radio>-->
<!--            <a-radio :value="2"> 抹去分</a-radio>-->
<!--          </a-radio-group>-->
<!--        </a-form-model-item>-->
        <a-form-model-item label="限购" prop="buy_limit" help="0代表不限购，请输入0~999正整数">
          <span class="mr-10">每人最多可参与</span>
          <a-input-number :min="0" :max="999" v-model="formData.buy_limit"/>
          <span class="ml-10">次</span>
        </a-form-model-item>
        <a-form-model-item label="优惠是否同享" prop="is_discount_share">
          <a-radio-group v-model="formData.is_discount_share">
            <a-radio :value="1"> 是</a-radio>
            <a-radio :value="2"> 否</a-radio>
          </a-radio-group>
          <div v-if="formData.is_discount_share == 1">
            <a-checkbox-group v-model="formData.share_discount">
              <a-checkbox value="1"> 商家会员卡</a-checkbox>
              <a-checkbox value="2"> 商家优惠券</a-checkbox>
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
                    :visible="reduce_money_visible"
                    @cancel="reduce_money = '',reduce_money_visible = false"
                    @confirm="batchSet($event,'reduce_money')"
                    :getPopupContainer="
                      triggerNode => {
                        return triggerNode.parentNode
                      }
                    ">
                    <template slot="title">
                      <a-input-number
                        v-model="reduce_money"
                        :min="0"
                        suffix="元"
                        prefix=""/>
                    </template>
                    <a-button
                      class="ml-20"
                      @click="reduce_money_visible = !reduce_money_visible, discount_rate_visible = false">
                      批量设置减少金额
                    </a-button>
                  </a-popconfirm>
                  <a-popconfirm
                    placement="top"
                    ok-text="确认"
                    cancel-text="取消"
                    :visible="discount_rate_visible"
                    @cancel="discount_rate = '',discount_rate_visible = false"
                    @confirm="batchSet($event,'discount_rate')"
                    :getPopupContainer="
                      triggerNode => {
                        return triggerNode.parentNode
                      }
                    ">
                    <template slot="title">
                      <a-input-number 
                        v-model="discount_rate"
                        :min="0"
                        suffix="元"
                        prefix=""/>
                    </template>
                    <a-button
                      class="ml-20"
                      @click="discount_rate_visible = !discount_rate_visible, reduce_money_visible = false">
                      批量设置折扣比例
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
                  <span slot="actStockNumTitle">
                      活动库存
                      <a-tooltip trigger="hover">
                          <template slot="title">设置每个sku的活动库存</template>
                          <a-icon class="ml-10" type="question-circle" />
                      </a-tooltip>
                  </span>
                  <span slot="actStockNum" slot-scope="text,record">
                      <span v-if="record.sku_info && record.sku_info.length">
                          ----
                      </span>
                      <span v-else>
                          <a-form-item style="margin: -5px 0" prop="act_stock_num">
                              <!-- -1不限库存 -->
                              <a-input-number
                                  v-if="record.act_stock_num == -1"
                                  :min="-1"
                                  v-model="record.act_stock_num"
                                  @change="handleChange(record.act_stock_num, record, 'act_stock_num')"
                                  />
                              <a-input-number
                                  v-else
                                  :min="0"
                                  :max="record.act_stock_num - 0"
                                  v-model="record.act_stock_num"
                                  @change="handleChange(record.act_stock_num, record, 'act_stock_num')"
                                  />
                          </a-form-item>
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
                  <span slot="reduceMoneyTitle">
                      减少金额
                      <a-tooltip trigger="“hover">
                          <template slot="title">设置每个sku的减少金额</template>
                          <a-icon class="ml-10" type="question-circle" />
                      </a-tooltip>
                  </span>
                  <span slot="reduceMoney" slot-scope="text,record">
                      <span v-if="record.sku_info && record.sku_info.length">
                          ----
                      </span>
                      <span v-else>
                          <a-form-item style="margin: -5px 0">
                              <a-input-number
                                :min="0"
                                :max="record.price - 0"
                                v-model="record.reduce_money"
                                @change="handleChange(record.reduce_money, record, 'reduce_money')"
                              />
                          </a-form-item>
                      </span>
                  </span>
                  <span slot="discountRateTitle">
                        折扣比例
                        <a-tooltip trigger="“hover">
                            <template slot="title">设置每个sku的折扣比列（范围0-10）</template>
                            <a-icon class="ml-10" type="question-circle" />
                        </a-tooltip>
                    </span>
                  <span slot="discountRate" slot-scope="text,record">
                        <span v-if="record.sku_info && record.sku_info.length">
                            ----
                        </span>
                        <span v-else>
                            <a-form-item style="margin: -5px 0">
                                <a-input-number
                                  :min="0"
                                  :max="10"
                                  v-model="record.discount_rate"
                                  @change="handleChange(record.discount_rate, record, 'discount_rate')"
                                />
                            </a-form-item>
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
          <a-button type="primary" @click="saveData()"> 保存</a-button>
        </div>
      </a-form-model-item>
    </a-form-model>
    <!-- group  shipping type="radio"-->
    <select-goods
      ref="selectGoods"
      :storeId="store_id"
      source="limited"
      :startTime="formData.start_time"
      :endTime="formData.end_time"
      @submit="selecrGoodsSubmit"
      :selectedList="goodsList"
    />
  </div>
</template>
<script>
import mallMerchantApi from '@/api/mall/merchant/index'
import moment from 'moment'
import SelectGoods from './modules/SelectGoods'
import {getNowFormatDate} from '@/utils/util'
import { watchMixin } from '@/utils/mixin'
export default {
  name: 'LimitedEdit',
  mixins: [watchMixin],
  components: {SelectGoods},
  data() {
    return {
      store_id: '', // 店铺id
      id: '', // 活动id
      addGoodsModalVisible: false,
      // 表单数据
      formData: {
        name: '',
        start_time: '',
        end_time: '',
        time_type: 1,
        cycle_type: 1,
        cycle_date: [],
        cycle_start_time: '00:00',
        cycle_end_time: '00:00',
        remove_type: 1,
        buy_limit: 0,
        is_discount_share: 1,
        share_discount: ['1','2'],
        goods_info:'',
        notice_type:1,
        notice_time:'',
      },
      // 表单校验规则
      rules: {
        name: [{required: true, message: '请输入活动名称', trigger: 'blur'}],
        start_time: [{ required: true, message: '请选择活动开始时间', trigger: ['blur', 'change'] }],
        end_time: [{ required: true, message: '请选择活动结束时间', trigger: ['blur', 'change'] }],
        time_type: [{required: true, message: '请选择秒杀活动时间', trigger: 'blur'}],
        // remove_type: [{required: true, message: '请选择抹零', trigger: 'blur'}],
        buy_limit: [{required: true, message: '请选择限购数量', trigger: 'blur'}],
        is_discount_share: [{required: true, message: '请选择优惠是否同享', trigger: 'blur'}],
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
              title: '当前库存',
              dataIndex: 'stock_num',
              scopedSlots: { customRender: 'stockNum' },
          },
          {
              dataIndex: 'act_stock_num',
              key: 'act_stock_num',
              slots: { title: 'actStockNumTitle' },
              scopedSlots: { customRender: 'actStockNum' },
          },
          {
              title: '原价格',
              dataIndex: 'price',
              scopedSlots: { customRender: 'price' },
          },
          {
              dataIndex: 'reduce_money',
              key: 'reduce_money',
              slots: { title: 'reduceMoneyTitle' },
              scopedSlots: { customRender: 'reduceMoney' },
          },
          {
            dataIndex: 'discount_rate',
            key: 'discount_rate',
            slots: { title: 'discountRateTitle' },
            scopedSlots: { customRender: 'discountRate' },
          },
          {
            title: '活动价',
            dataIndex: 'act_price',
            scopedSlots: { customRender: 'act_price' },
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
      reduce_money: '', // 批量设置减少金额
      discount_rate: '', // 批量设置折扣比例
      reduce_money_visible: false, // 批量设置减少金额弹框显隐
      discount_rate_visible: false, // 批量设置折扣比例弹框显隐
      start_time: null,
      end_time: null,
      showTime: { format: 'HH:mm' },
      dateFormat:'YYYY-MM-DD HH:mm'
    }
  },
  watch: {
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
    //开始日期选择器设置禁止选择时间
    disabledStartDate(current) {
      return current < moment().add(-1, 'd');//今天之前的年月日不可选，包括今天
    },
    //结束日期选择器设置禁止选择时间
    disabledEndDate(endValue) {
      const startValue = this.start_time
      if (!startValue) {
        return endValue < moment().add(-1, 'd');
      } else{
        return startValue.valueOf() >= endValue.valueOf()
      }
    },
    // 监听活动开始日期选择变化
    onDateStartChange(start_time_moment, start_time) {
      this.$set(this.formData, 'start_time', start_time)
      this.$refs.startTime.onFieldChange()
    },
    // 监听活动结束日期选择变化
    onDateEndChange(end_time_moment, end_time) {
      const startValue = moment(this.formData.start_time).valueOf()
      const endValue = moment(end_time).valueOf()
      console.log('1-----------活动结束时间选择')
      console.log(startValue)
      console.log(endValue)
      if (endValue <= startValue) {
        this.$message.error('活动结束时间必须大于活动开始时间！')
        return
      }
      this.$set(this.formData, 'end_time', end_time)
      this.$refs.endTime.onFieldChange()
    },
    changeTimeType(e) {
      if (e.target.value == 1) {
        this.showTime = { format: 'HH:mm' }
        this.dateFormat = 'YYYY-MM-DD HH:mm'
      } else {
        this.showTime = false
        this.dateFormat = 'YYYY-MM-DD'
      }
    },
    // 表单信息
    getFormData() {
      this.request(mallMerchantApi.getLimitedInfo, {id: this.id}).then((res) => {
        this.start_time = moment(res.start_time)
        this.end_time = moment(res.end_time)
        if (res.time_type == 1) {
          this.showTime = { format: 'HH:mm' }
          this.dateFormat = 'YYYY-MM-DD HH:mm'
        } else {
          this.showTime = false
          this.dateFormat = 'YYYY-MM-DD'
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
        if(res.time_type == 2 && res.cycle_type == 2) {
          res.cycle_date = res.cycle_date.split(',')
        }

        this.$set(this, 'formData', res)
        let goodsList = res.goods_info || []
        this.goodsList = goodsList.length?goodsList.map((item) => {
          if (item.sku_info && item.sku_info.length) {
            item.sku_info.forEach((item_sku) => {
              item_sku.name = item.name
             // item_sku.image = item.image
              item_sku.goods_id = item.goods_id + '_' + item_sku.sku_id
            })
          }
          if (item.sku_info && !item.sku_info.length) {
            item.act_stock_num = 0
            item.act_price = 0
            item.sku_info = ''
          }
          return item
        }):[]
      })
    },
    cycleTypeChange() {
      // 更新表单数据
      if (this.formData.cycle_type == 2) {
        this.$set(this.formData, 'cycle_date', [])
      } else {
        this.$set(this.formData, 'cycle_date', '')
      }
    },
    // 监听按周期开始日期选择变化
    onCycleStimeeRangeChange(date, dateString) {
      // 更新表单数据
      this.$set(this.formData, 'cycle_start_time', dateString)
    },
    // 监听按周期结束日期选择变化
    onCycleEtimeeRangeChange(date, dateString) {
      // 更新表单数据
      this.$set(this.formData, 'cycle_end_time', dateString)
    },
    //活动库存  减少金额  折扣比例设置
    handleChange(text,record,type) {
      this.goodsList = this.goodsList.map(item => {
        if (!item.sku_info) {
          item[type] = this[type]
        } else if (item.sku_info && item.sku_info.length) {
          item.sku_info = item.sku_info.map(sku_item => {
            if (record.sku_id == sku_item.sku_id) {
              if (type == 'act_stock_num') {
                sku_item.act_stock_num = text
              } else if (type == 'reduce_money') {//减少金额,计算折扣比例
                sku_item.act_price = Math.round((sku_item.price - text + Number.EPSILON) * 100) / 100
                sku_item.reduce_money = Math.round((text + Number.EPSILON) * 100) / 100
                let discount = ((1-text / sku_item.price) * 10).toFixed(2)
                discount = discount > 0 ? discount : 0.01
                let discount_rate = sku_item.price > 0 ?  discount  : 0
                sku_item.discount_rate = discount_rate
              } else if (type == 'discount_rate') {//折扣比例,计算减少金额
                sku_item.discount_rate = text
                let reduce_money = (1 - text / 10) * sku_item.price
                sku_item.reduce_money = Math.round((reduce_money + Number.EPSILON) * 100) / 100
                sku_item.act_price = Math.round((sku_item.price - sku_item.reduce_money + Number.EPSILON) * 100) / 100 
              }
            }
            return sku_item
          })
        }
        return item
      })
    },
    // 批量设置减少金额 || 折扣比例
    batchSet(e, type) {
      let min_price = 0
      this.goodsList.forEach(item => {
        if (item.goods_type == 'spu') {
          min_price = item.price
        } else {
          min_price = item.min_price
        }
      })

      if (type == 'reduce_money' && (Number(this.reduce_money) > Number(min_price))) {
        this.$message.error('批量设置减少金额不能大于原价格')
        return
      } else {
        this.reduce_money_visible = false
        this.discount_rate_visible = false
      }

      if (type == 'discount_rate' && (Number(this.discount_rate) > 10)) {
        this.$message.error('批量设置折扣比例不能大于10')
        return
      } else {
        this.reduce_money_visible = false
        this.discount_rate_visible = false
      }

      this.goodsList = this.goodsList.map(item => {
        if (!item.sku_info) {
          item[type] = this[type]
        } else if (item.sku_info && item.sku_info.length) {
          item.sku_info = item.sku_info.map(sku_item => {
            if (type == 'reduce_money') {//减少金额,计算折扣比例
              sku_item.act_price = Math.round((sku_item.price - this.reduce_money + Number.EPSILON) * 100) / 100
              sku_item.reduce_money = Math.round((this.reduce_money + Number.EPSILON) * 100) / 100
              let discount_rate = sku_item.price > 0 ? ((this.reduce_money / sku_item.price) * 10).toFixed(2) : 0
              sku_item.discount_rate = 10 - discount_rate
            } else {//折扣比例,计算减少金额
              sku_item.discount_rate = this.discount_rate
              let reduce_money = (1 - sku_item.discount_rate/10) * sku_item.price
              sku_item.reduce_money = Math.round((reduce_money + Number.EPSILON) * 100) / 100
              sku_item.act_price = Math.round((sku_item.price - sku_item.reduce_money + Number.EPSILON) * 100) / 100 
            }
            return sku_item
          })
        }
        return item
      })

      if (type == 'reduce_money') {
        this.reduce_money = ''
      } else if (type == 'discount_rate') {
        this.discount_rate = ''
      }
    },
    // 添加商品
    addProduct() {
      if (!this.start_time || !this.end_time) {
        this.$message.error('请先选择活动起止日期！')
        return
      }
      this.$refs.selectGoods.openDialog()
    },
    // 选择商品回调
    selecrGoodsSubmit(e) {
        console.log(e,'e-----selecrGoodsSubmit-----选择商品回调')
        e.goods = e.goods.map((item) => {
            item.type = 'limited'
            if (item.sku_info && item.sku_info.length) {
                item.sku_info.forEach((item_sku) => {
                    item_sku.goods_id = item.goods_id + '_' + item_sku.sku_id
                    item_sku.name = item.name
                    //item_sku.image = item.image
                    //活动库存
                    if (!item_sku.act_stock_num) {
                        item_sku.act_stock_num = item_sku.stock_num
                    }
                    //活动价格
                    if (!item_sku.act_price) {
                        item_sku.act_price = 0
                    }
                    //活动折扣
                    if (!item_sku.discount_rate) {
                        item_sku.discount_rate = 0
                    }
                    //减少金额
                    if (!item_sku.reduce_money) {
                        item_sku.reduce_money = 0
                    }
                })
            }
            if (item.sku_info && !item.sku_info.length) {
                item.act_stock_num = 0
                item.act_price = 0
                item.sku_info = ''
            }
            return item
        })
        this.goodsList = e.goods
        this.$set(this.formData, 'goods_info', this.goodsList.length?this.goodsList[0]:'')
        console.log(this.goodsList,'this.goodsList')
    },
    // 监听table多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
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
      this.formData = this.$options.data().formData
      this.start_time = this.$options.data().start_time
      this.end_time = this.$options.data().end_time
      this.goodsList = []
      this.$forceUpdate()
    },
    // 提交表单
    saveData() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let formData = {}
          for (let k in this.formData) {
            formData[k] = this.formData[k]
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
 
          if (!formData.start_time || !formData.end_time) {
            this.$message.error('请先选择活动起止日期！')
            return
          }

          if (formData.time_type == 1) {//固定时间
            let sime = moment(formData.start_time).valueOf()
            let etime = moment(formData.end_time).valueOf()
            if (etime <= sime) {
              this.$message.error('活动结束时间必须大于活动开始时间！')
              return
            }
          } else {// 按周期
            /*let current_date = getNowFormatDate()
            let cycle_stime = current_date + ' ' + formData.cycle_start_time
            let cycle_etime = current_date + ' ' + formData.cycle_end_time
            let s_time = ((new Date(Date.parse(cycle_stime.replace(/-/g, "/")))).getTime()) / 1000
            let e_time = ((new Date(Date.parse(cycle_etime.replace(/-/g, "/")))).getTime()) / 1000
            if (e_time <= s_time) {
              this.$message.error('周期结束时间必须大于活动开始时间！')
              return
            }*/
              let sime = moment(formData.start_time).valueOf()
              let etime = moment(formData.end_time).valueOf()
              if (etime <= sime) {
                  this.$message.error('周期结束时间必须大于活动开始时间！')
                  return
              }
          }
          if (formData.cycle_type == 2) {
            if(!formData.cycle_date.length){
              this.$message.error('请选择每周周期')
              return
            }else {
              formData.cycle_date = formData.cycle_date.toString()
            }
          }
          if (formData.cycle_type == 3 && !formData.cycle_date) {
            this.$message.error('请填写每月周期')
            return
          }
          if (this.goodsList.length) {
            formData.goods_sku = JSON.stringify(this.goodsList)
          }else {
            this.$message.error('请选择活动商品')
            return
          }

          // 活动库存校验
          let actStockNumCheck = JSON.parse(JSON.stringify(this.goodsList)).filter(item => {
            if (!item.sku_info || (item.sku_info && !item.sku_info.length)) {
              if (item.act_stock_num && Number(item.act_stock_num) > Number(item.stock_num) && item.stock_num != -1) {
                return item
              }
            } else if (item.sku_info && item.sku_info.length) {
              item.sku_info = item.sku_info.filter(sku_item => {
                if (sku_item.act_stock_num && Number(sku_item.act_stock_num) > Number(sku_item.stock_num) && sku_item.stock_num != -1) {
                  return sku_item
                }
              })
              if (item.sku_info.length) {
                return item
              }
            }
          }) || []
          if (actStockNumCheck.length) {
            this.$message.error('商品活动库存不能大于当前库存')
            return
          }

          // 减少金额或折扣校验
          let actPricecheck = JSON.parse(JSON.stringify(this.goodsList)).filter(item => {
            if (!item.sku_info || (item.sku_info && !item.sku_info.length)) {
              if (item.reduce_money == null || item.reduce_money == undefined || item.reduce_money == 0) {
                return item
              }

              if (item.discount_rate == null || item.discount_rate == undefined || item.discount_rate == 0) {
                return item
              }
            } else if (item.sku_info && item.sku_info.length) {
              item.sku_info = item.sku_info.filter(sku_item => {
                if (sku_item.reduce_money == null || sku_item.reduce_money == undefined || sku_item.reduce_money == 0) {
                  return item
                }

                if (sku_item.discount_rate == null || sku_item.discount_rate == undefined || sku_item.discount_rate == 0) {
                  return item
                }
              })
              if (item.sku_info.length) {
                return item
              }
            }
          }) || []
          if (actPricecheck.length) {
            this.$message.error('请设置商品的减少金额或折扣')
            return
          }
          
          console.log(formData)
          delete formData.share_discount
          delete formData.goods_info
          this.request(mallMerchantApi.updateLimited, formData).then((res) => {
            this.resetForm()
            if (this.id) {
              this.getFormData()
            }
            this.$message.success('提交成功！')
            this.$router.push({path: '/merchant/merchant.mall/limitedList', query: {store_id: this.store_id}})
            sessionStorage.setItem('limitedEdit', 1)
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