<template>
  <div class="mt-10 mb-20 mh-full" @click=";(act_price_visible = false), (act_stock_num_visible = false)">
    <a-form-model
      v-bind="{
        labelCol: { span: 4 },
        wrapperCol: { span: 10 }
      }"
      :model="formData"
      :rules="rules"
      ref="form"
    >
      <a-card title="基本信息" :bordered="false">
        <a-form-model-item label="活动时间" required>
          <a-form-model-item :style="{ display: 'inline-block' }" prop="start_time" ref="startTime" :autoLink="false" >
            <a-date-picker
              :disabled="formData.status == 2 || formData.status == 1 ? true : false"
              v-model="start_time"
              show-time
              format="YYYY-MM-DD HH:mm:ss"
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
              show-time
              format="YYYY-MM-DD HH:mm:ss"
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
        <a-form-model-item label="拼团有效时间" prop="affect_time" help="邀请好友参与拼团有效时间">
          <a-row type="flex">
            <a-col :span="8">
              <a-select
                :disabled="formData.status == 2 ? true : false"
                style="width: 80%;"
                placeholder="请选择"
                :value="affect_time.day || affect_time.day === 0 ? affect_time.day : '请选择'"
                @change="affectTimeChange($event, 'day')"
                :getPopupContainer="
                  triggerNode => {
                    return triggerNode.parentNode
                  }
                "
              >
                <a-select-option v-for="(dayItem, dayIndex) in dayOptions" :key="dayItem" :value="dayIndex">
                  {{ dayIndex }}
                </a-select-option>
              </a-select>
              <span class="ml-10">天</span>
            </a-col>
            <a-col :span="8">
              <a-select
                :disabled="formData.status == 2 ? true : false"
                style="width: 80%;"
                placeholder="请选择"
                :value="affect_time.hours || affect_time.hours === 0 ? affect_time.hours : '请选择'"
                @change="affectTimeChange($event, 'hours')"
                :getPopupContainer="
                  triggerNode => {
                    return triggerNode.parentNode
                  }
                "
              >
                <a-select-option v-for="(hoursItem, hoursIndex) in 25" :key="hoursItem" :value="hoursIndex">
                  {{ hoursIndex > 9 ? hoursIndex : '0' + hoursIndex }}
                </a-select-option>
              </a-select>
              <span class="ml-10">时</span>
            </a-col>
            <a-col :span="8">
              <a-select
                :disabled="formData.status == 2 ? true : false"
                style="width: 80%;"
                placeholder="请选择"
                :value="affect_time.minutes || affect_time.minutes === 0 ? affect_time.minutes : '请选择'"
                @change="affectTimeChange($event, 'minutes')"
                :getPopupContainer="
                  triggerNode => {
                    return triggerNode.parentNode
                  }
                "
              >
                <a-select-option v-for="(minItem, minIndex) in 61" :key="minItem" :value="minIndex">
                  {{ minIndex > 9 ? minIndex : '0' + minIndex }}
                </a-select-option>
              </a-select>
              <span class="ml-10">分</span>
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item label="拼团人数" prop="complete_num">
          <a-input-number
            style="width: 180px;"
            :min="2"
            :max="100"
            v-model="formData.complete_num"
            placeholder="请输入2-100人"
          />
        </a-form-model-item>
        <a-form-model-item label="模拟参团" prop="is_open_group" help="模拟参与用户拼团，提高成交量">
          <a-switch
            checked-children="开"
            un-checked-children="关"
            default-checked
            v-model="formData.is_open_group"
            @click="openGroupChange"
          />
        </a-form-model-item>
        <a-form-model-item label="" :wrapper-col="{ span: 18, offset: 4 }" v-show="formData.is_open_group">
          <a-radio-group v-model="simulate_group_radio" style="width: 100%;" @change="machineIntoCheck">
            <a-row type="flex" align="middle">
              <a-col :span="6">
                <a-radio :value="1"> 所有未拼成的团 </a-radio>
              </a-col>
              <a-col :span="18">
                <div class="flex align-center">
                  <span class="mr-10">用户开团后</span>
                  <a-form-model-item class="simulate-group-num" label="" prop="all_machine_into_time">
                    <a-select
                      style="width:140px;"
                      placeholder="请选择"
                      :value="
                        all_noGroup_time.hours || all_noGroup_time.hours === 0 ? all_noGroup_time.hours : '请选择'
                      "
                      @change="machineIntoTime($event, 'hours', 1)"
                      :getPopupContainer="
                        triggerNode => {
                          return triggerNode.parentNode
                        }
                      "
                    >
                      <a-select-option v-for="(hoursItem, hoursIndex) in 25" :key="hoursItem" :value="hoursIndex">
                        {{ hoursIndex > 9 ? hoursIndex : '0' + hoursIndex }}
                      </a-select-option>
                    </a-select>
                    <span class="ml-10 mr-10">时</span>
                    <a-select
                      style="width:140px;"
                      placeholder="请选择"
                      :value="
                        all_noGroup_time.minutes || all_noGroup_time.minutes === 0 ? all_noGroup_time.minutes : '请选择'
                      "
                      @change="machineIntoTime($event, 'minutes', 1)"
                      :getPopupContainer="
                        triggerNode => {
                          return triggerNode.parentNode
                        }
                      "
                    >
                      <a-select-option v-for="(minItem, minIndex) in 61" :key="minItem" :value="minIndex">
                        {{ minIndex > 9 ? minIndex : '0' + minIndex }}
                      </a-select-option>
                    </a-select>
                    <span class="ml-10">分</span>
                    <span class="ml-10">进行模拟拼团</span>
                  </a-form-model-item>
                </div>
              </a-col>
            </a-row>
            <a-row type="flex" align="middle" class="mt-10">
              <a-col :span="6" class="flex align-center">
                <a-form-model-item class="simulate-group-num" label="" prop="simulate_group_num">
                  <a-radio :value="2">参团人数大于等于</a-radio>
                  <a-input-number :min="0" v-model="formData.simulate_group_num" />
                  <span class="ml-10">的团</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="18">
                <div class="flex align-center">
                  <span class="mr-10">用户开团后</span>
                  <a-form-model-item class="simulate-group-num" label="" prop="machine_into_time">
                    <a-select
                      style="width:140px;"
                      placeholder="请选择"
                      :value="
                        simulate_group_time.hours || simulate_group_time.hours === 0
                          ? simulate_group_time.hours
                          : 0
                      "
                      @change="machineIntoTime($event, 'hours', 2)"
                      :getPopupContainer="
                        triggerNode => {
                          return triggerNode.parentNode
                        }
                      "
                    >
                      <a-select-option v-for="(hoursItem, hoursIndex) in 25" :key="hoursItem" :value="hoursIndex">
                        {{ hoursIndex > 9 ? hoursIndex : '0' + hoursIndex }}
                      </a-select-option>
                    </a-select>
                    <span class="ml-10 mr-10">时</span>
                    <a-select
                      style="width:140px;"
                      placeholder="请选择"
                      :value="
                        simulate_group_time.minutes || simulate_group_time.minutes === 0
                          ? simulate_group_time.minutes
                          : 0
                      "
                      @change="machineIntoTime($event, 'minutes', 2)"
                      :getPopupContainer="
                        triggerNode => {
                          return triggerNode.parentNode
                        }
                      "
                    >
                      <a-select-option v-for="(minItem, minIndex) in 61" :key="minItem" :value="minIndex">
                        {{ minIndex > 9 ? minIndex : '0' + minIndex }}
                      </a-select-option>
                    </a-select>
                    <span class="ml-10">分</span>
                    <span class="ml-10">进行模拟拼团</span>
                  </a-form-model-item>
                </div>
              </a-col>
            </a-row>
          </a-radio-group>
        </a-form-model-item>
      </a-card>
      <a-card style="margin-top: 10px" title="优惠信息" :bordered="false">
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
        <a-form-model-item label="限购" prop="limit_num" help="0代表不限购，请输入0~999正整数">
          <span class="mr-10">每人限购</span>
          <a-input-number :min="0" :max="999" v-model="formData.limit_num" />
          <span class="ml-10">单</span>
        </a-form-model-item>
      </a-card>
      <a-card style="margin-top: 10px" title="商品信息" :bordered="false">
        <a-form-model-item label="活动商品" prop="goods_info">
          <a-button @click="addProduct()" type="primary"> 添加商品 </a-button>
          <template v-if="goodsList.length">
            <span @click.stop="">
              <a-popconfirm
                placement="top"
                ok-text="确认"
                cancel-text="取消"
                :visible="act_price_visible"
                @cancel=";(act_price = ''), (act_price_visible = false)"
                @confirm.stop="batchSet($event, 'act_price')"
                :getPopupContainer="
                  triggerNode => {
                    return triggerNode.parentNode
                  }
                "
              >
                <template slot="title">
                  <a-input-number v-model="act_price" suffix="元" prefix="" />
                </template>
                <a-button
                  class="ml-20"
                  @click.stop=";(act_price_visible = !act_price_visible), (act_stock_num_visible = false),act_price = ''"
                >
                  设置拼团价
                </a-button>
              </a-popconfirm>
            </span>
            <span @click.stop="">
              <a-popconfirm
                placement="top"
                ok-text="确认"
                cancel-text="取消"
                :visible="act_stock_num_visible"
                @cancel.stop=";(act_stock_num = ''), (act_stock_num_visible = false)"
                @confirm.stop="batchSet($event, 'act_stock_num')"
                :getPopupContainer="
                  triggerNode => {
                    return triggerNode.parentNode
                  }
                "
              >
                <template slot="title">
                  <a-input-number v-model="act_stock_num" />
                </template>
                <a-button
                  class="ml-20"
                  @click.stop=";(act_stock_num_visible = !act_stock_num_visible), (act_price_visible = false),act_stock_num = ''"
                >
                  设置活动库存
                </a-button>
              </a-popconfirm>
            </span>
          </template>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 20, offset: 4 }">
          <a-table
            v-if="goodsList && goodsList.length"
            :columns="columns"
            :data-source="goodsList"
            rowKey="goods_id"
            class="mt-20"
            :childrenColumnName="'children'"
            :defaultExpandAllRows="true"
            :scroll="{ x: false }"
            :pagination="false"
          >
            <span slot="name" slot-scope="text, record">
              <a-avatar shape="square" :size="64" :src="record.image" />
              <span class="ml-10 name">{{ text }}</span>
            </span>
            <span slot="skuStr" slot-scope="text, record">
              <span v-if="record.sku_info && record.goods_type=='sku'">
                多规格
              </span>
              <span v-else>
                {{ text ? text : '----' }}
              </span>
            </span>
            <span slot="actStockNumTitle">
              活动库存
              <a-tooltip trigger="hover">
                <template slot="title">设置每个sku的活动库存，活动库存不能大于当前库存，-1代表无限量库存</template>
                <a-icon class="ml-10" type="question-circle" />
              </a-tooltip>
            </span>
            <span slot="actStockNum" slot-scope="text, record">
              <span v-if="record.sku_info && record.sku_info.length && record.sku_info.length > 1">
                ----
              </span>
              <span v-else>
                <a-form-item style="margin: -5px 0" prop="act_stock_num">
                  <!-- -1不限库存 -->
                  <a-input-number
                    v-if="record.stock_num == -1"
                    :min="-1"
                    v-model="record.act_stock_num"
                    @change="handleChange(record.act_stock_num, record, 'act_stock_num')"
                  />
                  <a-input-number
                    v-else
                    :max="record.stock_num - 0"
                    :min="0"
                    v-model="record.act_stock_num"
                    @change="handleChange(record.act_stock_num, record, 'act_stock_num')"
                  />
                </a-form-item>
              </span>
            </span>
            <span slot="price" slot-scope="text, record" class="cr-red">
              <span v-if="record.sku_info && record.goods_type=='sku'">
                ￥{{ record.min_price }} ~ ￥{{ record.max_price }}
              </span>
              <span v-else> ￥{{ text }} </span>
            </span>
            <span slot="actPriceTitle">
              拼团价
              <a-tooltip trigger="hover">
                <template slot="title">设置每个商品的拼团价，拼团价不可大于原价格</template>
                <a-icon class="ml-10" type="question-circle" />
              </a-tooltip>
            </span>
            <span slot="actPrice" slot-scope="text, record">
              <span v-if="record.sku_info && record.sku_info.length && record.sku_info.length > 1">
                ----
              </span>
              <span v-else>
                <a-form-item style="margin: -5px 0" prop="act_price">
                  <a-input-number
                    :min="0"
                    :max="record.price - 0"
                    v-model="record.act_price"
                    @change="handleChange(record.act_price, record, 'act_price')"
                  />
                </a-form-item>
              </span>
            </span>
            <span slot="action" slot-scope="text, record">
              <a
                v-if="!record.sku_id"
                class="ml-10 inline-block"
                @click="removeGoods(record)">删除</a>
            </span>
          </a-table>

          <div v-if="dataSource.length" class="pagination-wrap">
            <a-pagination
              size="middle"
              v-model="current"
              :pageSize="pageSize"
              @change="pageNumberChange"
              @showSizeChange="sizeChange"
              :pageSizeOptions="sizeList"
              :total="total"
              showSizeChanger
              showQuickJumper
            />
          </div>
        </a-form-model-item>
        <a-form-model-item
          label="团长价"
          prop="team_discount_price"
          help="仅用于开团的用户，在拼团价的基础上再次优惠的金额，未填写或填写为0代表未开启团长价"
        >
          <span class="mr-10">优惠</span>
          <a-input-number :min="0" :max="min_act_price-0"  v-model="formData.team_discount_price" />
        </a-form-model-item>
      </a-card>
      <!-- 失效不显示保存 -->
      <a-form-model-item :wrapper-col="{ span: 16, offset: 2 }" v-if="formData.status != 2">
        <div class="mt-20 mb-20">
          <a-button type="primary" @click="saveData()"> 保存 </a-button>
        </div>
      </a-form-model-item>
    </a-form-model>
    <!-- group  shipping type="radio"-->
    <select-goods
      ref="selectGoods"
      :storeId="store_id"
      source="group"
      type="radio"
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
import { watchMixin } from '@/utils/mixin'
export default {
  name: 'GroupEdit',
  mixins: [watchMixin],
  components: { SelectGoods },
  data() {
    return {
      store_id: '', // 店铺id
      id: '', // 活动id
      // 表单数据
      formData: {
        start_time: '', // 活动开始时间
        end_time: '', // 活动结束时间
        complete_num: '', // 拼团人数
        is_open_group: true, // 是否开启模拟参团
        simulate_group_num: '', // 机器人参与人数大于等于几人的团；若为空，机器人则参与所有未拼成的团
        machine_into_time: '', // 机器人介入成团时间 单位分钟
        all_machine_into_time: '', // 所有未拼团机器人介入成团时间 单位分钟
        limit_num: 0, // 每人限购数
        is_discount_share: 1, // 是否优惠同享 1开启 2关闭
        share_discount: [],
        team_discount_price: 0, // 团长价
        affect_time: '', // 拼团有效时间
        goods_info: ''
      },
      simulate_group_radio: 1, // 1 所有未拼成的团 2 机器人参与人数大于等于几人的团
      all_machine_into_time: '', // 所有未拼成的团介入成团时间
      machine_into_time: '', // 机器人参与人数大于等于几人的团介入成团时间
      // 表单校验规则
      rules: {
        start_time: [{ required: true, message: '请选择活动开始时间', trigger: ['blur', 'change'] }],
        end_time: [{ required: true, message: '请选择活动结束时间', trigger: ['blur', 'change'] }],
        complete_num: [{ required: true, message: '请输入拼团人数', trigger: ['blur', 'change'] }],
        is_discount_share: [{ required: true, message: '请选择优惠是否同享', trigger: ['blur', 'change'] }],
        affect_time: [{ required: true, message: '请选择拼团有效时间', trigger: ['blur', 'change'] }],
        act_stock_num: [{ required: true, message: '请输入商品活动库存', trigger: ['blur', 'change']}],
        act_price: [{ required: true, message: '请输入商品拼团价', trigger: ['blur', 'change'] }],
        is_open_group: [{ required: true, message: '', trigger: ['blur', 'change'] }],
        goods_info: [{ required: true, message: '请添加活动商品', trigger: ['blur', 'change'] }]
      },
      columns: [
        {
          title: '商品信息',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '规格',
          dataIndex: 'sku_str',
          scopedSlots: { customRender: 'skuStr' }
        },
        {
          title: '当前库存',
          dataIndex: 'stock_num',
          scopedSlots: { customRender: 'stockNum' }
        },
        {
          dataIndex: 'act_stock_num',
          key: 'act_stock_num',
          slots: { title: 'actStockNumTitle' },
          scopedSlots: { customRender: 'actStockNum' }
        },
        {
          title: '原价格',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' }
        },
        {
          dataIndex: 'act_price',
          key: 'act_price',
          slots: { title: 'actPriceTitle' },
          scopedSlots: { customRender: 'actPrice' }
        },
        {
          title: '操作',
          dataIndex: 'goods_id',
          width: '100px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      goodsList: [],
      act_price: '', // 批量设置拼团价
      act_stock_num: '', // 批量设置活动库存
      min_act_price:0,//拼团活动最小价格 用于对团长优惠价的校验
      affect_time: {
        day: '',
        hours: '',
        minutes: ''
      },
      all_noGroup_time: {
        // 所有未拼成的团
        hours: '',
        minutes: ''
      },
      simulate_group_time: {
        // 参团人数大于的团
        hours: '',
        minutes: ''
      },
      act_price_visible: false, // 批量设置拼团价弹框显隐
      act_stock_num_visible: false, // 批量设置活动库存弹框显隐
      sizeList: ['5', '10', '20', '30'], //一页能显示条数
      pageSize: 10, //当前页显示多少条
      current: 1, //当前页
      total: 0, //总条数
      dataSource: [],
      showSource: [],
      start_time: null,
      end_time: null
    }
  },
  watch: {
    '$route.path' (val) {
      if (val == '/merchant/merchant.mall/editGroup') {
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
    }
  },
  computed: {
    dayOptions() {
      let dayVal = 7
      // 获取时间差
      if (this.start_time && this.end_time) {
        let t1 = moment(this.start_time)
        let t2 = moment(this.end_time)
        let dura = t2.format('x') - t1.format('x')
        let tempTime = moment.duration(dura)
        dayVal = tempTime.days() + 1 > 6 ? 7 : tempTime.days() + 2
      }
      let day = this.affect_time.day
      if (day && day > dayVal) {
        this.$set(this.affect_time, 'day', '')
      }
      return dayVal
    }
  },
  created() {
    this.store_id = this.$route.query.store_id
    this.resetForm()
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getFormData()
    }
  },
  mounted() {
    console.log(this.$route.query.id,'id---mounted')
  },
  methods: {
    moment,
    disabledStartDate(current) {
      if (!this.$route.query.id) {
        return current && current < moment().subtract(1, 'days')
      } else {
        return false
      }
    },
    disabledEndDate(endValue) {
      const startValue = this.start_time
      if(!startValue){
        return endValue && endValue < moment().subtract(1, 'days')
      }else{
        return startValue.valueOf() >= endValue.valueOf()
      }
    },
    onDateStartChange(start_time_moment, start_time) {
      this.$set(this.formData, 'start_time', start_time)
      this.$refs.startTime.onFieldChange()
    },
    onDateEndChange(end_time_moment, end_time) {
      const startValue = moment(this.formData.start_time).valueOf()
      const endValue = moment(end_time).valueOf()
      if (endValue < startValue) {
        this.$message.error('活动结束时间必须大于活动开始时间！')
        return
      }
      this.$set(this.formData, 'end_time', end_time)
      this.$refs.endTime.onFieldChange()
    },
    // 表单信息
    getFormData() {
      this.request(mallMerchantApi.getGroupInfo, { id: this.id }).then(res => {
        console.log('res-----------1', res)
        this.start_time = moment(res.start_time)
        this.end_time = moment(res.end_time)
        if (res.is_discount_share == 1) {
          res.share_discount = []
          if (res.discount_card == 1) {
            res.share_discount.push('1')
          }
          if (res.discount_coupon == 1) {
            res.share_discount.push('2')
          }
        }
        // 拼团有效时间
        if (res.affect_time) {
          this.affect_time = this.timeStamp(res.affect_time)
          console.log(this.affect_time, 'this.affect_time')
        }

        // 模拟参团是否开启
        if (res.is_open_group && res.is_open_group == 1) {
          res.is_open_group = true
        } else {
          res.is_open_group = false
        }

        // 模拟参团介入时间
        if (res.simulate_group_num && res.simulate_group_num != 0) {
          this.simulate_group_time = this.timeStamp(res.machine_into_time)
          this.machine_into_time = res.machine_into_time
          this.simulate_group_radio = 2
        } else {
          this.all_noGroup_time = this.timeStamp(res.machine_into_time)
          this.all_machine_into_time = res.machine_into_time
          this.simulate_group_radio = 1
        }

        console.log(this.all_machine_into_time, 'this.all_machine_into_time')

        this.$set(this, 'formData', res)
        console.log(this.formData)
        let goodsList = res.goods_info || []
        this.goodsList = goodsList.length
          ? goodsList.map(item => {
              item.type = 'group'

            //   多规格
              if (item.sku_info && item.sku_info.length && item.sku_info.length > 1) {
                  item.children = []
                    item.sku_info.forEach(item_sku => {
                    item_sku.name = item.name
                    item_sku.image = item.image
                    if (!item_sku.act_stock_num) {
                        item_sku.act_stock_num = 0
                    }
                    if (!item_sku.act_price) {
                        item_sku.act_price = 0
                    }
                    if(this.min_act_price==0){
                        this.min_act_price=item_sku.act_price
                    }else if(this.min_act_price>item_sku.act_price){
                        this.min_act_price=item_sku.act_price
                    }
                    item.children.push(item_sku)
                    })
              }

            //   单规格
              if (item.sku_info && item.sku_info.length && item.sku_info.length == 1) {
                  let sku_info = item.sku_info[0]
                  for (let k in sku_info) {
                      item[k] = sku_info[k]
                  }
                  if(this.min_act_price==0){
                    this.min_act_price=item.act_price
                  }else if(this.min_act_price>item.act_price){
                    this.min_act_price=item.act_price
                  }
              }

            //   无规格
              if (item.sku_info && !item.sku_info.length) {
                // item.act_stock_num = 0
                // item.act_price = 0
                item.sku_info = ''
              }
              return item
            })
          : []
            console.log(this.goodsList,'this.goodsList')
        this.dataSource = this.goodsList && this.goodsList.length ? this.goodsList[0].sku_info || [] : []
        this.dataSourceChange()
      })
    },
    //分页页数的改变
    pageNumberChange(current, size) {
      this.current = current
      this.pageSize = size
      this.showSource = this.getShowSource()
      console.log(this.showSource, 'this.showSource')
      this.goodsList = this.goodsList.filter(item => {
        item.sku_info = this.showSource
        return item
      })
      console.log(this.goodsList, 'this.goodsList---goodsList---showSource')
    },
    //  分页显示条数的变化
    sizeChange(current, size) {
      this.current = current
      this.pageSize = size
      this.showSource = this.getShowSource()
      this.goodsList = this.goodsList.filter(item => {
        item.sku_info = this.showSource
        return item
      })
    },
    //实现分页效果
    getShowSource() {
      var keyValue = 0
      var data = this.dataSource //后端返回的全部数据
      for (var i = 0; i < data.length; i++) {
        keyValue = keyValue + 1
        let key = { key: keyValue }
        data[i] = Object.assign(data[i], key)
      }
      var start = this.pageSize * this.current - this.pageSize
      var end = this.pageSize * this.current
      return data.slice(start, end)
    },
    // 时间转化
    timeStamp(second_time) {
      let day = Math.floor(second_time / (24 * 3600))
      let hours = Math.floor((second_time - day * 24 * 3600) / 3600)
      let minutes = Math.floor((second_time - day * 24 * 3600 - hours * 3600) / 60)
      return {
        day,
        hours,
        minutes
      }
    },
    // 添加商品
    addProduct() {
      let { activeTime, message } = this.activeTimeCheck()
      if (!activeTime && message) {
        this.$message.error(message)
        return
      }
      this.$refs.selectGoods.openDialog()
    },
    // 活动时间校验
    activeTimeCheck() {
      let activeTime = true,
        message = ''
      if (!this.start_time && !this.end_time) {
        message = '请先选择活动的开始时间和结束时间！'
        activeTime = false
      } else if (!this.start_time) {
        message = '请先选择活动的开始时间！'
        activeTime = false
      } else if (!this.end_time) {
        message = '请先选择活动的结束时间！'
        activeTime = false
      }
      return {
        activeTime,
        message
      }
    },
    // 选择商品回调
    selecrGoodsSubmit(e) {
      console.log(e, 'e-----selecrGoodsSubmit-----选择商品回调')
      e.goods = e.goods.map(item => {
        item.type = 'group'

        // 多规格
        if (item.sku_info && item.sku_info.length && item.sku_info.length > 1) {
            item.children = []
          item.sku_info.forEach(item_sku => {
            item_sku.goods_id = item.goods_id + '_' + item_sku.sku_id
            item_sku.name = item.name
            item_sku.image = item.image
            if (!item_sku.act_stock_num) {
              item_sku.act_stock_num = 0
            }
            if (!item_sku.act_price) {
              item_sku.act_price = 0
            }
            item.children.push(item_sku)
          })
        }

        // 单规格
        if (item.sku_info && item.sku_info.length && item.sku_info.length == 1) {
            let sku_info = item.sku_info[0]
            for (let k in sku_info) {
                item[k] = sku_info[k]
            }
        }

        // 无规格
        if (item.sku_info && !item.sku_info.length) {
          item.act_stock_num = 0
          item.act_price = 0
          item.sku_info = ''
        }
        return item
      })
      this.goodsList = e.goods
      this.$set(this.formData, 'goods_info', this.goodsList.length ? this.goodsList[0] : '')
      console.log(this.goodsList, 'this.goodsList')
      if (this.goodsList.length) {
        this.$refs.form.clearValidate(['goods_info'])
      }
      this.dataSource = this.goodsList && this.goodsList.length ? this.goodsList[0].sku_info || [] : []
      this.dataSourceChange()
    },
    dataSourceChange() {
      this.total = this.dataSource.length
      this.current = 1
      this.pageSize = 10
      this.pageNumberChange(this.current, this.pageSize)
    },
    // 删除商品
    removeGoods(record) {
      if (record.sku_id) {
        this.goodsList.forEach(item => {
          if (item.sku_info && item.sku_info.length) {
            item.sku_info.forEach((sku_item, sku_index) => {
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
          this.dataSource = []
          this.dataSourceChange()
        }
      }

      if (this.dataSource.length) {
        this.dataSource.forEach((item, index) => {
          if (item.sku_id == record.sku_id) {
            this.dataSource.splice(index, 1)
            this.dataSourceChange()
          }
        })
      }
    },
    resetForm() {
      this.formData = this.$options.data().formData
      this.affect_time = this.$options.data().affect_time
      this.all_noGroup_time = this.$options.data().all_noGroup_time
      this.simulate_group_time = this.$options.data().simulate_group_time
      this.start_time = this.$options.data().start_time
      this.end_time = this.$options.data().end_time
      this.goodsList = []
      this.$forceUpdate()
    },
    // 拼团价 || 活动库存设置
    handleChange(text, record, type) {
      this.goodsList = this.goodsList.map(item => {
        if (!record.sku_str || (record.sku_info && record.sku_info.length == 1)) {

          if (record.sku_info && record.sku_info.length == 1 && record.sku_id == record.sku_info[0].sku_id) {
              record.sku_info[0][type] = text
          } else {
              if (record.goods_id == item.goods_id) {
                item[type] = text
            }
            this[type] = text
          }
        } else {
          if (record.sku_id == item.sku_id) {
            item[type] = text
          }
          if (this.min_act_price == 0) {
            this[type] = text
          } else if (this[type] > text) {
            this[type] = text
          }
        }

        if (!item.children && item.sku_info) {
            item.sku_info.forEach((sku_item) => {
                for (let k in sku_item) {
                    sku_item[k] = item[k]
                }
            })
        }

        if (type == 'act_price') {
            // 多规格团长最高价计算
            if (item.children && item.children.length) {
                this.min_act_price = item.sku_info.map(item => item.act_price).sort((a,b) => {
                    return a-b
                })[0] || 0
            } else {
                // 单规格团长最高价计算
                this.min_act_price = item.act_price || 0
            }
        }

        return item
      })
    },
    // 批量设置拼团价 || 活动库存
    batchSet(e, type) {
      let min_price = 0
      this.goodsList.forEach(item => {
        if (!item.sku_info) {
          min_price = item.price
        } else if (item.sku_info && item.sku_info.length) {
          min_price = item.min_price
        }
      })
      if (type == 'act_price' && Number(this.act_price) > Number(min_price)) {
        this.$message.error('拼团价不能大于原价格')
        this.act_price_visible = true
        return
      } else {
        this.act_price_visible = false
        this.act_stock_num_visible = false
      }

      let stock_num = 0
      this.goodsList.forEach(item => {
        if (!item.sku_info) {
          stock_num = item.stock_num
        } else if (item.sku_info && item.sku_info.length) {
          stock_num = Math.min(...item.sku_info.map(item => item.stock_num))
        }
      })
      if(type=='act_stock_num'){
        this.goodsList.forEach(item => {
          if (!item.sku_info) {
           //单规格直接判断库存
            if(Number(this.act_stock_num) > Number(stock_num) && Number(stock_num) != -1){
              this.$message.error('活动库存不能大于当前库存')
              this.act_stock_num_visible = true
              return
            }
          } else if (item.sku_info && item.sku_info.length) {
            //多规格根据sku判断
            try{
              item.sku_info.forEach(sku=>{
                if(Number(sku.stock_num) <Number(this.act_stock_num) && Number(sku.stock_num) != -1){
                  this.$message.error('活动库存不能大于当前库存')
                  this.act_stock_num_visible = true
                  throw Error()
                }
              })
            }catch(err){

            }
          }
        })
      } else if (type == 'act_stock_num' && Number(this.act_stock_num) == 0){
        this.$message.error('活动库存不能设置为0')
        this.act_stock_num_visible = true
        return
      } else {
        this.act_price_visible = false
        this.act_stock_num_visible = false
      }

      this.goodsList = this.goodsList.map(item => {
        if (!item.sku_info || (item.sku_info && item.sku_info.length == 1)) {
          item[type] = this[type]
        } else if (item.sku_info && item.sku_info.length) {
          item.sku_info = item.sku_info.map(sku_item => {
            if (type == 'act_price') {
              sku_item.act_price = this.act_price
              this.min_act_price = this.act_price
            }
            if (type == 'act_stock_num') {
              sku_item.act_stock_num = this.act_stock_num
            }
            return sku_item
          })
        }
        return item
      })

      if (this.dataSource.length) {
        this.dataSource = this.dataSource.map(item => {
          if (type == 'act_price') {
            item.act_price = this.act_price
          }
          if (type == 'act_stock_num') {
            item.act_stock_num = this.act_stock_num
          }
          return item
        })
      }
      if (type == 'act_price') {
        this.act_price = ''
      } else if (type == 'act_stock_num') {
        this.act_stock_num = ''
      }
    },
    // 拼团有效时间
    affectTimeChange(e, type) {
      this.$set(this.affect_time, type, e)
      // 拼团有效时间校验
      let { day = 0, hours = 0, minutes = 0 } = this.affect_time
      let affect_time = Number(day) * 24 * 60 * 60 + Number(hours) * 60 * 60 + Number(minutes) * 60
      this.$set(this.formData, 'affect_time', affect_time)
      if (affect_time) {
        this.$refs.form.clearValidate(['affect_time'])
      }
    },
    // 模拟参团时间
    machineIntoTime(e, type, radio) {
      if (radio == 1) {
        this.$set(this.all_noGroup_time, type, e)
        this.all_machine_into_time =
          Number(this.all_noGroup_time.hours) * 60 * 60 + Number(this.all_noGroup_time.minutes) * 60
        this.$set(this.formData, 'all_machine_into_time', this.all_machine_into_time)
      } else {
        this.$set(this.simulate_group_time, type, e)
        this.machine_into_time =
          Number(this.simulate_group_time.hours) * 60 * 60 + Number(this.simulate_group_time.minutes) * 60
        this.$set(this.formData, 'machine_into_time', this.machine_into_time)
      }
    },
    // 模拟参团change
    openGroupChange() {
      if (!this.formData.is_open_group) {
        this.all_noGroup_time = this.$options.data().all_noGroup_time
        this.simulate_group_time = this.$options.data().simulate_group_time
        this.all_machine_into_time = this.$options.data().all_machine_into_time
        this.machine_into_time = this.$options.data().machine_into_time
      }
    },
    // 模拟参团校验
    machineIntoCheck() {
      this.$refs.form.clearValidate()
      let val = this.simulate_group_radio
      console.log(this.all_machine_into_time, 'this.all_machine_into_time---1')
      console.log(val, 'simulate_group_radio')
      if (this.formData.is_open_group) {
        if (val == 1) {
          // 所有未拼成的团
          if (this.rules.simulate_group_num) {
            this.$delete(this.rules, 'simulate_group_num')
          }
          if (this.rules.machine_into_time) {
            this.$delete(this.rules, 'machine_into_time')
          }
          if (!this.all_machine_into_time) {
            let rules = [{ required: true, message: '请选择模拟参团介入时间', trigger: ['blur', 'change'] }]
            this.$set(this.rules, 'all_machine_into_time', rules)
          } else {
            this.$delete(this.rules, 'all_machine_into_time')
          }
          this.formData.simulate_group_num = 0;
        } else {
          // 部分参团
          if (this.rules.all_machine_into_time) {
            this.$delete(this.rules, 'all_machine_into_time')
          }
          if (!this.formData.simulate_group_num) {
            let rulesNum = [{ required: true, message: '请输入模拟参团团数', trigger: ['blur', 'change'] }]
            this.$set(this.rules, 'simulate_group_num', rulesNum)
          }
          if (!this.formData.machine_into_time) {
            let rules = [{ required: true, message: '请选择模拟参团介入时间', trigger: ['blur', 'change'] }]
            this.$set(this.rules, 'machine_into_time', rules)
          }
        }
      } else {
        // 所有未拼成的团
        if (this.rules.simulate_group_num) {
          this.$delete(this.rules, 'simulate_group_num')
        }
        if (this.rules.machine_into_time) {
          this.$delete(this.rules, 'machine_into_time')
        }
        // 部分参团
        if (this.rules.all_machine_into_time) {
          this.$delete(this.rules, 'all_machine_into_time')
        }
      }
    },
    // 提交表单
    saveData() {
      this.machineIntoCheck()
      console.log(this.all_machine_into_time, 'all_machine_into_time ')
      console.log(this.formData, 'this.formData')
      let { activeTime, message } = this.activeTimeCheck()
      if (!activeTime && message) {
        this.$message.error(message)
        return
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(this.goodsList, 'this.goodsList')
          let formData = this.formData
          // 优惠同享校验
          if (this.affect_time.day == 0 && this.affect_time.hours == 0 && this.affect_time.minutes == 0) {
            this.$message.error('拼团有效时间不能都为0')
            return
          }
          if (formData.is_discount_share == 1 && formData.share_discount.length == 0) {
            this.$message.error('请选择优惠同享类型')
            return
          }

          if (this.goodsList.length == 0) {
            this.$message.error('请选择活动商品')
            return
          }

          // 活动库存校验
          let actStockNumCheck =
            JSON.parse(JSON.stringify(this.goodsList)).filter(item => {
              if (!item.sku_info || (item.sku_info && !item.sku_info.length)) {
                if (item.act_stock_num && Number(item.act_stock_num) > Number(item.stock_num) && item.stock_num != -1) {
                  return item
                }
              } else if (item.sku_info && item.sku_info.length) {
                item.sku_info = this.dataSource.filter(sku_item => {
                  if (
                    sku_item.act_stock_num &&
                    Number(sku_item.act_stock_num) > Number(sku_item.stock_num) &&
                    sku_item.stock_num != -1
                  ) {
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

          // 拼团价校验
          let actPricecheck =
            JSON.parse(JSON.stringify(this.goodsList)).filter(item => {
              if (!item.sku_info || (item.sku_info && !item.sku_info.length)) {
                if (
                  (item.act_price == null || item.act_price == undefined || item.act_price == '') &&
                  item.act_price != 0
                ) {
                  return item
                }
              } else if (item.sku_info && item.sku_info.length) {
                item.sku_info = this.dataSource.filter(sku_item => {
                  if (
                    (sku_item.act_price == null || sku_item.act_price == undefined || sku_item.act_price == '') &&
                    sku_item.act_price != 0
                  ) {
                    return sku_item
                  }
                })
                if (item.sku_info.length) {
                  return item
                }
              }
            }) || []
          if (actPricecheck.length) {
            this.$message.error('请设置商品的拼团价')
            return
          }

          // 团长价校验
          if (formData.team_discount_price && this.goodsList.length) {
            let sku_info = this.dataSource || []
            if (sku_info.length) {
              let act_price = Math.min(...sku_info.map(item => item.act_price - 0))
              if (Number(formData.team_discount_price) > Number(act_price)) {
                this.$message.error('团长价不能大于拼团价')
                return
              }
            } else {
              if (Number(formData.team_discount_price) > Number(this.goodsList[0].act_price)) {
                this.$message.error('团长价不能大于拼团价')
                return
              }
            }
          }

          // 校验库存不能为0
          if(this.dataSource.length) {
            for(let i in this.dataSource) {
              if(this.dataSource[i].act_stock_num == 0) {
                this.$message.error('库存不能为0')
                return
              }
            }
          }

          if (formData.is_discount_share == 1) {
            formData.discount_card = 0
            formData.discount_coupon = 0
            formData.share_discount.forEach(item => {
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
          if (this.goodsList.length || formData.goods_info) {
            formData.goods_info = this.goodsList.length ? this.goodsList[0] : ''
            formData.goods_info['sku_info'] = this.dataSource || []
          }

          let params = {
            id: this.id,
            store_id: this.store_id,
            start_time: formData.start_time,
            end_time: formData.end_time,
            affect_time: formData.affect_time,
            complete_num: formData.complete_num,
            limit_num: formData.limit_num,
            is_open_group: formData.is_open_group ? 1 : 0,
            machine_into_time: this.simulate_group_radio == 1 ? this.all_machine_into_time : this.machine_into_time,
            simulate_group_num: formData.simulate_group_num,
            team_discount_price: formData.team_discount_price,
            is_discount_share: formData.is_discount_share,
            discount_card: formData.discount_card,
            discount_coupon: formData.discount_coupon,
            goods_info: formData.goods_info
          }

          console.log(params, 'params')
          this.request(mallMerchantApi.groupAdd, params)
            .then(res => {
              this.resetForm()

              this.$message.success('提交成功！')
              this.$router.push({ path: '/merchant/merchant.mall/groupList', query: { store_id: this.store_id } })
              sessionStorage.setItem('groupEdit', 1)
            })
            .catch(err => {
              this.dataSourceChange()
            })
        } else {
          console.log('error submit!!', this.formData)
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
.name {
  display: inline-block;
  max-width: 200px;
  white-space: wrap;
  word-break: break-all;
}
.simulate-group-num.ant-form-item {
  margin-bottom: 0;
}
.pagination-wrap {
  margin-top: 10px;
  width: 100%;
  text-align: right;
}
</style>
