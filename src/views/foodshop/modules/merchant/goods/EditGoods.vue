<template>
  <a-modal
    destroyOnClose
    :title="title"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    @ok="handleSubmit"
    :bodyStyle="{ 'max-height': '700px', 'overflow-y': 'auto' }"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :label="L('商品名称')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :help="L('餐饮商品数据来源于店铺商品库，请提前至综合店铺管理--商品库中进行管理商品')"
        >
          <a-input-group>
            <a-row :gutter="8">
              <a-col :span="14" v-if="detail.goods_id">
                <a-input
                  v-if="detail.goods_id"
                  v-decorator="[
                    'name',
                    { initialValue: detail.name, rules: [{ required: true, message: L('请选择商品！') }] },
                  ]"
                  :disabled="true"
                />
              </a-col>
              <a-col :span="8">
                <a-button type="dashed" style="color: #40a9ff" @click="clicAddGoods">
                  <a-icon type="plus" />{{ L('选择商品库商品') }}
                </a-button>
              </a-col>
            </a-row>
          </a-input-group>
        </a-form-item>
        <a-form-item :label="L('商品分类')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select style="width: 200px" v-decorator="['spec_sort_id', { initialValue: String(sort_id) }]">
            <a-select-option v-for="sort in sortList" :value="String(sort.sort_id)" :key="String(sort.sort_id)">{{
              sort.sort_name
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :label="L('商品简称')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :help="L('用于店员端点菜时快速搜索到该商品')"
        >
          <a-input style="width: 200px" v-decorator="['abbreviation', { initialValue: detail.abbreviation }]" />
        </a-form-item>
        <a-form-item :label="L('售卖价格')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            precision="2"
            step="0.01"
            style="width: 200px"
            v-decorator="[
              'price',
              { initialValue: detail.price, rules: [{ required: true, message: L('请输入价格！') }] },
            ]"
          />
        </a-form-item>
        <a-form-item
          :label="L('售卖库存')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :help="L('继承商品库商品库存后，如需修改商品库该商品的当前库存则可以到商品库中修改，规格的库存为独有库存')"
        >
          <a-radio-group
            v-decorator="['spec_stock_type', { initialValue: detail.spec_stock_type, rules: [{ required: true }] }]"
            name="spec_stock_type"
            @change="changeStockType"
          >
            <a-radio :value="1">{{ L('沿用商品库商品库存') }}</a-radio>
            <a-radio :value="0">{{ L('独有库存') }}</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          :label="L('当前库存/原始库存')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :help="
            showStockTip ? L('商品库里的该商品当前库存为【0】，不可继续售卖，请先补足商品库里的该商品当前库存') : ''
          "
        >
          <div class="stock-content">
            <span>
              <a-input-group compact>
                <a-input-number
                  style="width: 80px; border-right: 0"
                  v-decorator="[
                    'spec_stock',
                    {
                      initialValue: detail.spec_stock_type == 1 ? detail.stock_num : detail.spec_stock,
                      rules: [],
                    },
                  ]"
                  @change="stockNumChange"
                  :disabled="detail.spec_stock_type == 1 ? true : false"
                  :min="-1"
                />
                <a-input-number
                  style="width: 40px; border-left: 0; border-right: 0; pointer-events: none"
                  placeholder="/"
                  :disabled="detail.spec_stock_type == 1 ? true : false"
                  :min="-1"
                />
                <a-input-number
                  style="width: 80px; text-align: center; border-left: 0"
                  v-decorator="[
                    'spec_original_stock',
                    {
                      initialValue: detail.spec_stock_type == 1 ? detail.original_stock : detail.spec_original_stock,
                      rules: [],
                    },
                  ]"
                  :disabled="detail.spec_stock_type == 1 ? true : false"
                  :min="-1"
                />
              </a-input-group>
            </span>
            <span style v-if="detail.spec_stock_type == 0">
              <a-checkbox
                v-decorator="[
                  'stock_type',
                  { valuePropName: 'checked', initialValue: detail.stock_type != 0 ? true : false },
                ]"
              >
                {{ L('次日置满') }}
                <custom-tooltip :text="L('开启后，次日00:00自动置满库存')" />
              </a-checkbox>
            </span>
          </div>
        </a-form-item>
        <a-form-item :label="L('最小购买量')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="1"
            :max="50"
            v-decorator="[
              'min_num',
              { initialValue: detail.min_num, rules: [{ required: true, message: L('请输入1~50的整数！') }] },
            ]"
          />
          {{ detail.unit }}
        </a-form-item>
        <a-form-item
          :label="L('是否必点菜')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :help="L('一般用于餐具等，如果此商品有规格属性或者附属菜则必点菜功能失效')"
        >
          <a-switch
            :checked-children="L('是')"
            :un-checked-children="L('否')"
            v-decorator="['is_must', { initialValue: detail.is_must == 1 ? true : false, valuePropName: 'checked' }]"
          />
        </a-form-item>
        <a-form-item :label="L('是否只可店员下单')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch
            :checked-children="L('是')"
            :un-checked-children="L('否')"
            v-decorator="[
              'only_staff',
              { initialValue: detail.only_staff == 1 ? true : false, valuePropName: 'checked' },
            ]"
          />
        </a-form-item>
        <a-form-item :label="L('是否推荐')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch
            :checked-children="L('是')"
            :un-checked-children="L('否')"
            v-decorator="[
              'is_recommend',
              { initialValue: detail.is_recommend == 1 ? true : false, valuePropName: 'checked' },
            ]"
          />
        </a-form-item>
        <a-divider dashed v-if="detail.list && detail.list.length > 0" />

        <a-form-item
          :label="L('售卖规格')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="detail.list && detail.list.length > 0"
        >
          <a-table
            :columns="columns"
            :data-source="detail.list"
            class="components-table-demo-nested"
            :pagination="false"
            rowKey="index"
          >
            <span slot="price" slot-scope="text, record, ind">
              <a-form-item>
                <a-input type="hidden" v-model="index_arr[ind]" />
              </a-form-item>
              <a-form-item>
                <!-- <a-input style="width:50px" v-decorator="[`prices[${ind}]`, {initialValue:text}]" /> -->
                <a-input style="width: 60px" v-model="price_arr[ind]" />
              </a-form-item>
            </span>
            <span slot="stock_num" slot-scope="text, record, ind">
              <a-form-item></a-form-item>
              <a-form-item>
                <!-- <a-input
                  style="width:50px;"
                  v-decorator="[`stock_nums[${ind}]`, {initialValue:text}]"
                />-->
                <a-input-number style="width: 60px" v-model="stock_arr[ind]" :min="-1" />
              </a-form-item>
            </span>
          </a-table>
        </a-form-item>
        <a-divider dashed v-if="detail.list && detail.list.length > 0" />
        <a-form-item
          :label="L('售卖属性')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="detail.properties_list && detail.properties_list.length > 0"
        >
          <div v-for="item in detail.properties_list">
            {{ L('属性名称') }}：{{ item.name }}
            <div style="font-weight: bold; border-bottom: 1px solid #d9d9d9">{{ L('属性值') }}</div>
            <div v-for="item2 in item.val" style="border-bottom: 1px solid #f2f2f2">{{ item2 }}</div>
          </div>
        </a-form-item>
        <a-form-item
          :label="L('售卖附属菜')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="detail.subsidiary_piece && detail.subsidiary_piece.length > 0"
        >
          <div v-for="(subsidiary_item, index) in detail.subsidiary_piece">
            <div>
              {{ L('区块名称') }}：{{ subsidiary_item.name }} {{ L('设置区块总的最少购买数和最大购买数') }}：{{
                subsidiary_item.mininum
              }}
              ~
              {{ subsidiary_item.maxnum }}
            </div>
            <a-table
              :columns="columnsSub"
              :data-source="subsidiary_item.goods"
              class="components-table-demo-nested"
              :pagination="false"
              rowKey="index"
            >
              <span slot="product_price" slot-scope="text, record">
                <span v-if="record.has_spec">{{ L('多规格') }}</span>
                <span v-else>{{ text }}</span>
              </span>
            </a-table>
          </div>
        </a-form-item>
        <a-divider dashed v-if="detail.properties_list && detail.properties_list.length > 0" />

        <a-form-item :label="L('售卖时间')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            @change="onDataTypeChange"
            v-decorator="['all_date', { initialValue: detail.all_date, rules: [{ required: true }] }]"
            name="date_type"
          >
            <a-radio :value="1">{{ L('全时段售卖') }}</a-radio>
            <a-radio :value="0">{{ L('自定义时间') }}</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          :label="L('选择时间段')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          class="date-content"
          v-if="detail.all_date == 0"
        >
          <a-range-picker
            @change="dateOnChange"
            :allowClear="true"
            style="width: 320px"
            v-decorator="[
              'date_range',
              {
                initialValue:
                  detail.show_start_date == ''
                    ? null
                    : [moment(detail.show_start_date, dateFormat), moment(detail.show_end_date, dateFormat)],
              },
            ]"
          >
            <a-icon slot="suffixIcon" type="calendar" />
          </a-range-picker>
          <a-checkbox-group
            :options="weekList"
            @change="onWeekChange"
            v-decorator="['week', { initialValue: detail.week }]"
          />
        </a-form-item>
        <a-form-item :label="L('售卖时间段')" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="detail.all_date == 0">
          <a-radio-group
            @change="onTimeTypeChange"
            v-decorator="['all_time', { initialValue: detail.all_time, rules: [{ required: true }] }]"
            name="time_type"
          >
            <a-radio :value="1">{{ L('全时段售卖') }}</a-radio>
            <a-radio :value="0">{{ L('自定义时间') }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :label="L('选择时间段')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          class="date-content"
          v-if="detail.all_time == 0"
        >
          <a-time-picker
            :format="timeFormat"
            v-decorator="[
              'show_start_time',
              { initialValue: detail.show_start_time == '' ? null : moment(detail.show_start_time, timeFormat) },
            ]"
          />
          <span class="time_space">{{ L('至') }}</span>
          <a-time-picker
            :format="timeFormat"
            v-decorator="[
              'show_end_time',
              { initialValue: detail.show_end_time == '' ? null : moment(detail.show_end_time, timeFormat) },
            ]"
          />
          <br />
          <a-time-picker
            :format="timeFormat"
            v-decorator="[
              'show_start_time2',
              { initialValue: detail.show_start_time2 == '' ? null : moment(detail.show_start_time2, timeFormat) },
            ]"
          />
          <span class="time_space">{{ L('至') }}</span>
          <a-time-picker
            :format="timeFormat"
            v-decorator="[
              'show_end_time2',
              { initialValue: detail.show_end_time2 == '' ? null : moment(detail.show_end_time2, timeFormat) },
            ]"
          />
          <br />
          <a-time-picker
            :format="timeFormat"
            v-decorator="[
              'show_start_time3',
              { initialValue: detail.show_start_time3 == '' ? null : moment(detail.show_start_time3, timeFormat) },
            ]"
          />
          <span class="time_space">{{ L('至') }}</span>
          <a-time-picker
            :format="timeFormat"
            v-decorator="[
              'show_end_time3',
              { initialValue: detail.show_end_time3 == '' ? null : moment(detail.show_end_time3, timeFormat) },
            ]"
          />
        </a-form-item>

        <a-form-item :label="L('排序值')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="['sort', { initialValue: detail.sort }]" />
        </a-form-item>

        <a-form-item :label="L('状态')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch
            :checked-children="L('开启')"
            :un-checked-children="L('关闭')"
            v-decorator="['status', { initialValue: detail.status == 1 ? true : false, valuePropName: 'checked' }]"
          />
        </a-form-item> 
        
        <a-form-item :label="L('是否可用分类优惠')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch
            :checked-children="L('可用')"
            :un-checked-children="L('不可用')"
            v-decorator="['is_sort_discount', { initialValue: detail.is_sort_discount == 1 ? true : false, valuePropName: 'checked' }]"
          />
        </a-form-item> 
        <a-form-item :label="L('是否可用优惠')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch
            :checked-children="L('可用')"
            :un-checked-children="L('不可用')"
            v-decorator="['is_can_use_coupon', { initialValue: detail.is_can_use_coupon == 1 ? true : false, valuePropName: 'checked' }]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
    <select-shop-goods
      :visible.sync="selectGoodsVisible"
      :storeId="store_id"
      source="foodshop_goods_library"
      :type="goodsSelectType"
      @onSubmit="onGoodsSelect"
    />
  </a-modal>
</template>

<script>
import moment from 'moment'
import foodshopMerchantApi from '@/api/foodshop/merchant'
import shopMerchantApi from '@/api/shop/merchant'
import { dateToDateString } from '@/utils/util'
import SelectShopGoods from '@/components/SelectShopGoods/SelectShopGoods'
import CustomTooltip from '@/components/CustomTooltip/CustomTooltip'

export default {
  components: {
    SelectShopGoods,
    CustomTooltip,
  },
  data() {
    return {
      title: '新建商品',
      timeFormat: 'HH:mm:ss',
      dateFormat: 'YYYY-MM-DD',
      labelCol: {
        xs: {
          span: 12,
        },
        sm: {
          span: 6,
        },
      },
      wrapperCol: {
        xs: {
          span: 12,
        },
        sm: {
          span: 15,
        },
      },
      dateSelect: '', // 日期选择
      timeSelect: '', // 时间选择
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      categoryList: [],
      showMethod: [],
      detail: {
        sort_id: 0,
        store_id: this.$route.query.store_id,
        print_id: '',
        show_start_date: '',
        show_end_date: '',
        week: [
          this.L('星期日'),
          this.L('星期一'),
          this.L('星期二'),
          this.L('星期三'),
          this.L('星期四'),
          this.L('星期五'),
          this.L('星期六'),
        ],
        show_start_time: '',
        show_end_time: '',
        show_start_time2: '',
        show_end_time2: '',
        show_start_time3: '',
        show_end_time3: '',
        all_date: 1,
        all_time: 1,
        date_range: '',
        status: 1,
        spec_stock_type: 1,
        pigcms_id: 0,
        goods_id: 0,
        min_num: 1,
      },
      weekList: [
        this.L('星期日'),
        this.L('星期一'),
        this.L('星期二'),
        this.L('星期三'),
        this.L('星期四'),
        this.L('星期五'),
        this.L('星期六'),
      ],
      printList: [],
      sortList: [],
      shopGoods: null,
      goods_id: 0,
      sort_id: 0,
      store_id: 0,
      selectGoodsVisible: false,
      goodsSelectType: 'radio',
      columns: [],
      price_arr: [],
      stock_arr: [],
      index_arr: [],

      // 表头
      columnsBase: [
        {
          title: this.L('原价'),
          dataIndex: 'old_price',
        },
        {
          title: this.L('现价'),
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' },
        },
        {
          title: this.L('库存'),
          dataIndex: 'stock_num',
          scopedSlots: { customRender: 'stock_num' },
        },
      ],
      // 附属菜表头
      columnsSub: [
        {
          title: this.L('附属商品'),
          dataIndex: 'product_name',
        },
        {
          title: this.L('售价'),
          dataIndex: 'product_price',
          scopedSlots: { customRender: 'product_price' },
        },
        {
          title: this.L('最少可选数'),
          dataIndex: 'mini_num',
        },
        {
          title: this.L('最多可选数'),
          dataIndex: 'max_num',
        },
        {
          title: this.L('排序'),
          dataIndex: 'sort',
        },
      ],
      showStockTip: false,
    }
  },
  mounted() {},
  methods: {
    moment,
    add(storeId, sortId) {
      this.visible = true
      this.sort_id = sortId
      this.store_id = storeId
      this.title = this.L('新建商品')
      this.detail = {}
      this.detail = {
        sort_id: 0,
        store_id: this.$route.query.store_id,
        print_id: '',
        show_start_date: '',
        show_end_date: '',
        week: [
          this.L('星期日'),
          this.L('星期一'),
          this.L('星期二'),
          this.L('星期三'),
          this.L('星期四'),
          this.L('星期五'),
          this.L('星期六'),
        ],
        show_start_time: '',
        show_end_time: '',
        show_start_time2: '',
        show_end_time2: '',
        show_start_time3: '',
        show_end_time3: '',
        abbreviation: '',
        all_date: 1,
        all_time: 1,
        date_range: '',
        status: 1,
        spec_stock_type: 1,
        pigcms_id: 0,
        goods_id: 0,
        min_num: 1,
      }
      this.showStockTip = false
      // this.getStorePrintList()
      this.getSortList()
    },
    edit(storeId, sortId, goodsId) {
      this.visible = true
      this.sort_id = sortId
      console.log('sort_id', this.sort_id)
      this.store_id = storeId
      this.goods_id = goodsId
      this.detail.goods_id = this.goods_id

      this.title = this.L('编辑商品')

      // this.getStorePrintList()
      this.getSortList()
      this.getEditInfo()
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        console.log(errors)
        if (!errors) {
          values.store_id = this.store_id
          values.pigcms_id = this.detail.pigcms_id
          values.goods_id = this.detail.goods_id
          values.show_start_date = this.detail.show_start_date
          values.show_end_date = this.detail.show_end_date
          values.stock_type = values.stock_type ? 1 : 0
          values.prices = this.price_arr
          values.stock_nums = this.stock_arr
          values.indexs = this.index_arr
          values.all_date = this.detail.all_date

          // 格式化日期
          const type = {
            show_start_time: 'time',
            show_end_time: 'time',
            show_start_time2: 'time',
            show_end_time2: 'time',
            show_start_time3: 'time',
            show_end_time3: 'time',
          }
          dateToDateString(values, type)
          console.log(values)
          // return true
          if (!values.goods_id) {
            this.$message.error(this.L('请选择商品'))
            this.confirmLoading = false
            return true
          }
          this.request(foodshopMerchantApi.editGoods, values)
            .then((res) => {
              if (this.detail.pigcms_id) {
                this.$message.success(this.L('编辑成功'))
                // 调用父页面方法
                this.$emit('handleGoodsUpdate')
              } else {
                this.$message.success(this.L('添加成功'))
                // 调用父页面方法
                this.$emit('handleGoodsUpdate', 1)
              }
              setTimeout(() => {
                this.form = this.$form.createForm(this)
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok', values)
              }, 1500)
            })
            .catch((error) => {
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.form = this.$form.createForm(this)
    },
    // 获得商品详情
    getEditInfo() {
      this.request(foodshopMerchantApi.goodsDetail, {
        goods_id: this.detail.goods_id,
      }).then((res) => {
        this.detail = res
        console.log(
          (res.spec_stock_type == 1 && res.spec_stock == 0) || (res.spec_stock_type != 1 && res.stock_num == 0)
        )
        if (res.stock_num == 0) {
          this.showStockTip = true
        } else {
          this.showStockTip = false
        }
        console.log(this.index_arr, 'index_arr1')
        if (res.list.length) {
          this.price_arr = []
          this.stock_arr = []
          this.index_arr = []
          res.list.forEach((item) => {
            this.price_arr.push(item.price)
            this.stock_arr.push(item.stock_num)
            this.index_arr.push(item.index)
          })
        }
        // console.log(this.index_arr, 'index_arr2')
        this.createColumn(this.detail)
      })
    },
    // 获得打印机列表
    getStorePrintList() {
      this.request(foodshopMerchantApi.storePrintList, {
        store_id: this.store_id,
      }).then((res) => {
        this.printList = res.list
      })
    },
    // 获得分类列表
    getSortList() {
      this.request(foodshopMerchantApi.selectSortList, {
        store_id: this.store_id,
      }).then((res) => {
        this.sortList = res
      })
    },
    // 获得商品库商品详情
    getShopDetail() {
      this.request(shopMerchantApi.goodsDetail, {
        goods_id: this.goods_id,
      }).then((res) => {
        this.shopGoods = res
        this.shopDetail()
      })
    },
    createColumn(detail) {
      const specColumn = []
      if (detail.spec_list) {
        for (var i in detail.spec_list) {
          console.log(i)
          specColumn.push({
            title: detail.spec_list[i].name,
            dataIndex: 'spec_val_sid_' + detail.spec_list[i].id,
          })
        }
      }
      this.columns = specColumn.concat(this.columnsBase)
      console.log(this.columns)
    },

    // 选择商品
    clicAddGoods() {
      this.selectGoodsVisible = true
    },

    // 选择商品回调
    onGoodsSelect(e) {
      console.log(e)
      this.selectGoodsVisible = false
      if (e.ids) {
        this.goods_id = e.ids
        this.getShopDetail()
      }
    },
    // 渲染商品库信息
    shopDetail() {
      this.detail = {}

      this.detail = {
        spec_stock_type: 1,
        print_id: '',
        show_start_date: '',
        show_end_date: '',
        week: [
          this.L('星期日'),
          this.L('星期一'),
          this.L('星期二'),
          this.L('星期三'),
          this.L('星期四'),
          this.L('星期五'),
          this.L('星期六'),
        ],
        show_start_time: '',
        show_end_time: '',
        show_start_time2: '',
        show_end_time2: '',
        show_start_time3: '',
        show_end_time3: '',
        all_date: 1,
        all_time: 1,
        min_num: 1,
      }
      this.detail.goods_id = this.shopGoods.goods_id
      this.detail.name = this.shopGoods.name
      this.detail.price = this.shopGoods.price
      this.detail.stock_num = this.shopGoods.stock_num
      if (
        (this.shopGoods.spec_stock_type == 1 && this.shopGoods.spec_stock == 0) ||
        (this.shopGoods.spec_stock_type != 1 && this.shopGoods.stock_num == 0)
      ) {
        this.showStockTip = true
      } else {
        this.showStockTip = false
      }
      this.detail.original_stock = this.shopGoods.original_stock
      this.detail.spec_stock = this.shopGoods.stock_num
      this.detail.spec_original_stock = this.shopGoods.original_stock
      this.detail.list = this.shopGoods.list
      this.detail.properties_list = this.shopGoods.properties_list
      this.detail.subsidiary_piece = this.shopGoods.subsidiary_piece

      this.createColumn(this.shopGoods)
    },
    onDataTypeChange(val) {
      this.detail.all_date = val.target.value
    },
    dateOnChange(date, dateString) {
      this.detail.show_start_date = dateString[0]
      this.detail.show_end_date = dateString[1]
    },
    onWeekChange(e) {},
    onTimeTypeChange(val) {
      this.detail.all_time = val.target.value
    },
    changeStockType(val) {
      this.detail.spec_stock_type = val.target.value
    },
    // 取消删除
    cancel() {},
    stockNumChange(e) {
      if (e.data == 0) {
        this.showStockTip = true
      } else {
        this.showStockTip = false
      }
    },
  },
}
</script>

<style scoped>
.stock-content {
  display: flex;
  align-items: center;
}
.stock-content >>> .ant-checkbox-wrapper {
  position: relative;
  top: 2px;
  height: 32px;
  border: 1px solid #d9d9d9;
  padding-left: 14px;
  box-sizing: border-box;
  border-left: none;
  line-height: 32px;
}
.time_space {
  padding: 0 4px;
}
</style>
