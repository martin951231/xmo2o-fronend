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
           <a-input v-model="formData.type" v-show="false"/>
          <a-input v-model="formData.name" placeholder="请输入活动名称" />
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
      </a-card>
      <a-card style="margin-top: 10px" title="优惠信息" :bordered="false">
        <a-form-model-item label="活动规则" prop="nums" help="参与活动的商品单价最低不可低于【活动价/活动件数】的平均价。比如，后台设置【99元任选3件】，则参与此活动的单个商品单价最低不可小于【99/3=33元】">
          <span class="mr-10">满(元)</span>
          <a-input-number :min="0" v-model="formData.money" />
          <span class="mr-10">任选(件)</span>
          <a-input-number :min="0" v-model="formData.nums" />
        </a-form-model-item>
        <a-form-model-item label="限购" prop="buy_limit" help="0代表不限购，请输入0~999正整数">
          <span class="mr-10">每人最多可参与</span>
          <a-input-number :min="0" :max="999" v-model="formData.buy_limit" />
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
        <a-form-model-item v-if="formData.act_type == 0" :wrapper-col="{ span: 20, offset: 4 }">
          <a-button @click="addProduct()" type="primary"> 添加商品 </a-button>
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
                  <img :src="record.image" />
                </div>
                <div>{{ text }}</div>
              </div>
            </span>
            <span slot="price" slot-scope="text, record" class="cr-red">
              <span v-if="record.goods_type=='sku'">￥{{ record.min_price }} ~ ￥{{ record.max_price }}</span>
              <span v-else>￥{{record.price}}</span>
            </span>
            <span slot="action" slot-scope="text">
              <a class="ml-10 inline-block" @click="removeGoods(text)">删除</a>
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
    <!-- group  shipping type="radio"-->
    <select-goods
            ref="selectGoods"
            :storeId="store_id"
            source="reached"
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
    name: 'ReachedEdit',
    mixins: [watchMixin],
    components: { SelectGoods },
    data: function () {
      return {
        store_id: '', // 店铺id
        id: '', // 活动id
        addGoodsModalVisible: false,
        // 表单数据
        formData: {
          type: 'reached',
          name: '',
          time: [],
          start_time: '',
          end_time: '',
          money: '',
          full_type: 1,
          nums: 0,
          buy_limit: 0,
          is_discount_share: 2,
          is_discoubuy_nt_share: 2,
          share_discount: [],
          act_type: 0,
          is_discoubuy_share: 0
        },
        // 表单校验规则
        rules: {
          name: [{required: true, message: '请输入活动名称', trigger: 'blur'}],
          time: [{required: true, message: '请选择活动时间', trigger: 'blur'}],
          full_type: [{required: true, message: '请选择优惠条件', trigger: 'blur'}],
          money: [{required: true, message: '请输入满多少元', trigger: 'blur'}],
          nums: [{required: true, message: '请输入满多少件', trigger: 'blur'}],
          buy_limit: [{required: true, message: '请选择限购数量', trigger: 'blur'}],
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
      '$route.path' (val) {
        if (val == '/merchant/merchant.mall/editReached') {
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
      disabledDate(current) {
        // Can not select days before today and today
        return current < moment().endOf('day').subtract(1, 'days')
      },
      getFormData() {
        console.log(this.id);
        this.request(mallMerchantApi.getReachedInfo, { id: this.id }).then((res) => {
          console.log(res)
          this.start_time = moment(res.start_time)
          this.end_time = moment(res.end_time)
          res.time = [moment(res.start_time), moment(res.end_time)]
          if (res.is_discount_share == 1) {
            res.share_discount = []
            if (res.discount_card == 1) {
              res.share_discount.push('1')
            }
            if (res.discount_coupon == 1) {
              res.share_discount.push('2')
            }
          } else {
            res.share_discount = []
          }
          this.$set(this, 'formData', res)
          console.log(this.formData);
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
        if (endValue < startValue) {
          this.$message.error('活动结束时间必须大于活动开始时间！')
          return
        }
        this.$set(this.formData, 'end_time', end_time)
        this.$refs.endTime.onFieldChange()
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
        console.log(e)
        this.goodsList = e.goods
      },
      // 监听table多选
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },
      // 删除商品
      removeGoods(id) {
        for (var i = 0; i < this.goodsList.length; i++) {
          if (this.goodsList[i].goods_id === id) {
            this.goodsList.splice(i, 1)
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
        console.log(this.formData);
        this.$refs.form.validate((valid) => {
          if (valid) {
            let formData = this.formData
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
            if (this.id) {
              formData.id = this.id
            }
            if (this.goodsList.length || formData.goods_info) {
              formData.goods_info = JSON.stringify(this.goodsList)
            }
            formData.is_discoubuy_nt_share = formData.is_discoubuy_share
            delete formData.share_discount
            delete formData.time
            console.log(formData)
            this.request(mallMerchantApi.updateReachedList, formData).then((res) => {
              this.resetForm()
              if (this.id) {
                this.getFormData()
              }
              this.$message.success('提交成功！');
              this.$router.push({ path: '/merchant/merchant.mall/reachedList', query: { store_id: this.store_id } })
              sessionStorage.setItem('ReachedEdit', 1)
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