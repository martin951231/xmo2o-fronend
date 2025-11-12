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
          <a-input v-model="formData.name" placeholder="请输入活动名称"/>
        </a-form-model-item>
        <a-form-model-item label="活动时间">
          <a-form-model-item :style="{ display: 'inline-block' }" prop="start_time" ref="startTime" :autoLink="false">
            <a-date-picker
              :disabled="formData.status == 2 || formData.status == 1 ? true : false"
              v-model="start_time"
              show-time
              format="YYYY-MM-DD"
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
              format="YYYY-MM-DD"
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
        <!--        <a-form-model-item label="活动时间" prop="time">-->
        <!--          <a-range-picker-->
        <!--            :ranges="{-->
        <!--              今日: [moment(), moment()],-->
        <!--              近7天: [moment(), moment().add(7, 'days')],-->
        <!--              近15天: [moment(), moment().add(15, 'days')],-->
        <!--              近30天: [moment(), moment().add(30, 'days')],-->
        <!--            }"-->
        <!--            :value="formData.time"-->
        <!--            format="YYYY-MM-DD"-->
        <!--            @change="onDateRangeChange"-->
        <!--            style="width: 100%"-->
        <!--          />-->
        <!--        </a-form-model-item>-->
      </a-card>
      <a-card style="margin-top: 10px" title="优惠信息" :bordered="false">
        <a-form-model-item label="优惠条件" prop="full_type">
          <a-radio-group v-model="formData.full_type" @change="handleFullTypeChange">
            <a-radio :value="1"> 满N件</a-radio>
            <a-radio :value="0"> 满N元</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="满足包邮条件" prop="nums">
          <span class="mr-10">满</span>
          <a-input-number :min="1" v-model="formData.nums"/>
          <span class="ml-10">{{ formData.full_type == 1 ? '件' : '元' }}</span>
        </a-form-model-item>
        <a-form-model-item label="限购" prop="join_max_num" help="0代表不限购，请输入0~999正整数">
          <span class="mr-10">每人最多可参与</span>
          <a-input-number :min="0" :max="999" v-model="formData.join_max_num"/>
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
        <a-form-model-item label="活动商品" prop="act_type">
          <a-radio-group v-model="formData.act_type">
            <a-radio :value="1"> 全店商品参与</a-radio>
            <a-radio :value="0"> 部分商品参与</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item v-if="formData.act_type == 0" :wrapper-col="{ span: 20, offset: 4 }">
          <a-button @click="addProduct()" type="primary"> 添加商品</a-button>
          <a-button v-if="selectedRowKeys.length" class="ml-20" type="danger" @click="removeGoods()">
            删除 {{ selectedRowKeys.length }} 项
          </a-button>

          <!--  -->
          <a-table
            v-show="goodsList.length"
            :row-selection="rowSelection"
            :columns="columns"
            :data-source="goodsList"
            rowKey="goods_id"
            class="mt-20"
            :scroll="{ x: false }"
          >
            <span slot="name" slot-scope="text, record">
              <div class="product-info">
                <div>
                  <img :src="record.image"/>
                </div>
                <div>{{ text }}</div>
              </div>
            </span>
            <span slot="price" slot-scope="text, record" class="cr-red">
              <span>￥{{ record.min_price }} ~ ￥{{ record.max_price }}</span>
            </span>
            <span slot="action" slot-scope="text">
              <a class="ml-10 inline-block" @click="removeGoods(text)">删除</a>
            </span>
            <!-- <p
              v-if="record.sku_info && record.sku_info.length"
              slot="expandedRowRender"
              slot-scope="record"
              style="margin: 0"
            >
              <span class="flex align-center mb-20 cr-99 sx-hidden" v-for="item of record.sku_info" :key="item.sku_id">
                <span style="width: 300px">{{ item.sku_str || '--' }}</span>
                <span style="width: 200px">￥{{ item.price }}</span>
                <span class="flex-1">{{ item.stock_num }}</span>
              </span>
            </p> -->
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
      source="shipping"
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
  import {watchMixin} from '@/utils/mixin'

  export default {
    name: 'ShippingEdit',
    mixins: [watchMixin],
    components: {SelectGoods},
    data() {
      return {
        store_id: '', // 店铺id
        id: '', // 活动id
        type:'',
        addGoodsModalVisible: false,
        // 表单数据
        formData: {
          name: '',
          time: [],
          start_time: '',
          end_time: '',
          full_type: 1,
          nums: 1,
          join_max_num: 0,
          is_discount_share: 1,
          share_discount: [],
          act_type: 1,
        },
        // 表单校验规则
        rules: {
          start_time: [{required: true, message: '请选择活动开始时间', trigger: ['blur', 'change']}],
          end_time: [{required: true, message: '请选择活动结束时间', trigger: ['blur', 'change']}],
          name: [{required: true, message: '请输入活动名称', trigger: 'blur'}],
          time: [{required: true, message: '请选择活动时间', trigger: 'blur'}],
          full_type: [{required: true, message: '请选择优惠条件', trigger: 'blur'}],
          nums: [{required: true, message: '请选择满包邮条件', trigger: 'blur'}],
          join_max_num: [{required: true, message: '请选择限购数量', trigger: 'blur'}],
          is_discount_share: [{required: true, message: '请选择优惠是否同享', trigger: 'blur'}],
          act_type: [{required: true, message: '请选择活动商品', trigger: 'blur'}],
        },
        columns: [
          {
            title: '商品信息',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'},
            width: '300px',
          },
          {
            title: '价格',
            dataIndex: 'price',
            scopedSlots: {customRender: 'price'},
            width: '200px',
          },
          {
            title: '当前库存',
            dataIndex: 'stock_num',
          },
          {
            title: '操作',
            dataIndex: 'goods_id',
            width: '100px',
            scopedSlots: {customRender: 'action'},
          },
        ],
        goodsList: [],
        selectedRowKeys: [],
        start_time: null,
        end_time: null,
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
              this.resetForm()
            }
          } else {
            this.resetForm()
          }
        })
      },
      '$route.query.type'(val) {
        if (val) {
          this.type = val
          this.resetForm()
        }
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
      // 表单信息
      getFormData() {
        this.request(mallMerchantApi.getShippingInfo, {id: this.id}).then((res) => {
          console.log(res)
          res.time = [moment(res.start_time), moment(res.end_time)]
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
          if (Number(res.num) < 1) {
            res.num = 1;
          }
          this.$set(this, 'formData', res)
          this.goodsList = res.goods_info
        })
      },
      // 监听日期选择变化
      onDateRangeChange(date, dateString) {
        // 更新表单数据
        this.$set(this.formData, 'time', [date[0], date[1]])
        this.$set(this.formData, 'start_time', dateString[0])
        this.$set(this.formData, 'end_time', dateString[1])
      },
      //开始日期选择器设置禁止选择时间
      disabledStartDate(current) {
        return current < moment().add(-1, 'd');//今天之前的年月日不可选，包括今天
      },
      //结束日期选择器设置禁止选择时间
      disabledEndDate(endValue) {
        const startValue = this.start_time
        if (!startValue) {
          return endValue < moment().add(-1, 'd');
        } else {
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
        if (endValue < startValue) {
          this.$message.error('活动结束时间必须大于活动开始时间！')
          return
        }
        this.$set(this.formData, 'end_time', end_time)
        this.$refs.endTime.onFieldChange()
      },
      // 添加商品
      addProduct() {
        let {activeTime, message} = this.activeTimeCheck()
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
        console.log(e)
        this.goodsList = e.goods
      },
      // 监听table多选
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },
      // 删除商品
      removeGoods(id) {
        if (id) {
          for (var i = 0; i < this.goodsList.length; i++) {
            if (this.goodsList[i].goods_id == id) {
              this.goodsList.splice(i, 1)
              this.selectedRowKeys.forEach((item, index) => {
                if (item == id) {
                  this.selectedRowKeys.splice(index, 1)
                }
              })
              console.log(this.selectedRowKeys)
              return
            }
          }
        } else {
          this.selectedRowKeys.forEach((id, i1) => {
            this.goodsList.forEach((goods, i2) => {
              if (goods.goods_id == id) {
                this.goodsList.splice(i2, 1)
              }
            })
          })
          this.selectedRowKeys = []
          console.log(this.selectedRowKeys)
        }

      },
      handleFullTypeChange(val) {
        this.$set(this.formData, 'nums', 0)
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
            let formData = JSON.parse(JSON.stringify(this.formData))
            if (formData.is_discount_share == 1 && formData.share_discount.length == 0) {
              this.$message.error('请选择优惠同享类型')
              return
            }
            if (formData.act_type == 0 && this.goodsList.length == 0) {
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
            if (this.type=='edit') {
              formData.id = this.id
            }
            if (this.goodsList.length || formData.goods_info) {
              formData.goods_info = JSON.stringify(this.goodsList)
            }
            delete formData.share_discount
            delete formData.time
            console.log(formData)
            this.request(mallMerchantApi.updateShipping, formData).then((res) => {
              this.resetForm()
              if (this.id) {
                this.getFormData()
              }
              this.$message.success('提交成功！')
              this.$router.push({path: '/merchant/merchant.mall/shippingList', query: {store_id: this.store_id}})
              sessionStorage.setItem('shippingEdit', 1)
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