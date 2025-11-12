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
        <a-form-model-item label="配送周期" prop="periodic_type">
          <a-radio-group v-model="formData.periodic_type" @change="periodicTypeChange">
            <a-radio :value="1"> 每日一期 </a-radio>
            <a-radio :value="2"> 每周一期 </a-radio>
            <a-radio :value="3"> 每月一期 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="送达日期" v-if="formData.periodic_type != 1" prop="periodic_date">
          <div v-if="formData.periodic_type == 2">
            <a-checkbox-group v-model="formData.periodic_date">
              <a-checkbox value="1"> 每周一 </a-checkbox>
              <a-checkbox value="2"> 每周二 </a-checkbox>
              <a-checkbox value="3"> 每周三 </a-checkbox>
              <a-checkbox value="4"> 每周四 </a-checkbox>
              <a-checkbox value="5"> 每周五 </a-checkbox>
              <a-checkbox value="6"> 每周六 </a-checkbox>
              <a-checkbox value="0"> 每周日 </a-checkbox>
            </a-checkbox-group>
          </div>
          <div v-if="formData.periodic_type == 3">
            <a-form-model-item help="请填写1-30之间正整数">
              <span class="ml-10">每月</span>
              <a-input-number :min="1" :max="30" v-model="formData.periodic_date"/>
              <span class="ml-10">号</span>
            </a-form-model-item>
          </div>
        </a-form-model-item>
        <a-form-model-item label="下单时间" prop="forward_hour">
          <span class="mr-10">买家需提前</span>
          <a-input-number :min="0" v-model="formData.forward_day" />
          <span class="ml-10"> 天 </span>
          <a-input-number :min="0"  v-model="formData.forward_hour" />
          <span class="ml-10">时下单支付，才能在最近的配送周期时间送达</span>
        </a-form-model-item>
        <a-form-model-item label="延期期数" prop="delay_limit">
          <a-input-number :min="0" v-model="formData.delay_limit" />
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
        <a-form-model-item label="配送期数" prop="periodic_count" help="请输入1~99正整数">
          <a-input-number :min="1" :max="99" v-model="formData.periodic_count" />
        </a-form-model-item>
        <a-form-model-item label="周期购是否包邮" prop="freight_type">
          <a-radio-group v-model="formData.freight_type">
            <a-radio :value="1"> 包邮 </a-radio>
            <a-radio :value="2"> 不包邮 </a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-card>
      <a-card style="margin-top: 10px" title="商品信息" :bordered="false">
        <a-form-model-item :wrapper-col="{ span: 20, offset: 4 }">
          <a-button @click="addProduct()" type="primary"> 添加商品 </a-button>
          <a-table
            v-show="goodsList.length"
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
              <span>￥{{ record.min_price }} ~ ￥{{ record.max_price }}</span>
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
    <!-- group  shipping-->
    <select-goods
      ref="selectGoods"
      type="radio"
      :storeId="store_id"
      source="periodic"
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
  name: 'PeriodicEdit',
  mixins: [watchMixin],
  components: { SelectGoods },
  data() {
    return {
      store_id: '', // 店铺id
      id: '', // 活动id
      addGoodsModalVisible: false,
      // 表单数据
      formData: {
        periodic_type: 1,
        periodic_date:'',
        buy_limit: 0,
        periodic_count:'',
        forward_day:'',
        forward_hour:'',
        is_discount_share: 1,
        freight_type:2,
        delay_limit:'',
        share_discount: ['1','2'],
      },
      // 表单校验规则
      rules: {
        periodic_type: [{ required: true, message: '请选择配送周期', trigger: 'blur' }],
        periodic_date: [{ required: true, message: '请选择送达日期', trigger: 'blur' }],
        forward_hour: [{ required: true, message: '请选择下单时间', trigger: 'blur' }],
        buy_limit: [{ required: true, message: '请选择限购数量', trigger: 'blur' }],
        periodic_count: [{ required: true, message: '请选择配送期数', trigger: 'blur' }],
        delay_limit: [{ required: true, message: '请选择延期数', trigger: 'blur' }],
        is_discount_share: [{ required: true, message: '请选择优惠是否同享', trigger: 'blur' }],
        freight_type: [{ required: true, message: '请选择周期购是否包邮', trigger: 'blur' }],
      },
      columns: [
        {
          title: '商品信息',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '价格',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' },
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
          scopedSlots: { customRender: 'action' },
        },
      ],
      goodsList: [],
      selectedRowKeys: [],
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
    // 表单信息
    getFormData() {
      this.request(mallMerchantApi.getPeriodicInfo, { id: this.id }).then((res) => {
        console.log(res)
        if (res.is_discount_share == 1) {
          res.share_discount = []
          if (res.discount_card == 1) {
            res.share_discount.push('1')
          }
          if (res.discount_coupon == 1) {
            res.share_discount.push('2')
          }
        }
        if (res.periodic_type == 2) {
          res.periodic_date = res.periodic_date.split(',')
        }
        this.$set(this, 'formData', res)
        if (res.forward_day == 0) {
          this.$set(this.formData, 'forward_day', '')
        }
        this.goodsList = res.goods_info
      })
    },
    // 添加商品
    addProduct() {
      this.$refs.selectGoods.openDialog()
    },
    // 选择商品回调
    selecrGoodsSubmit(e) {
      console.log(e)
      this.goodsList = e.goods
    },
    // 监听table多选
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
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
      this.$set(this, 'formData', {
        periodic_type: 1,
        periodic_date:'',
        buy_limit: 0,
        periodic_count:'',
        forward_day:'',
        forward_hour:'',
        is_discount_share: 1,
        freight_type:2,
        delay_limit:'',
        share_discount: ['1','2'],
      })
      this.goodsList = []
      this.$forceUpdate()
    },
    //配送周期change
    periodicTypeChange(){
      if(this.formData.periodic_type == 1){
        this.$set(this.formData, 'periodic_date', '')
      }else if(this.formData.periodic_type == 2){
        this.$set(this.formData, 'periodic_date', [])
      }else if(this.formData.periodic_type == 3){
        this.$set(this.formData, 'periodic_date', '')
      }
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

          
          if (this.goodsList.length) {
            formData.goods_id = this.goodsList[0].goods_id
            formData.goods_name = this.goodsList[0].name
          }


          if(formData.periodic_type == 2) {
            formData.periodic_date = formData.periodic_date.toString()
          }
          delete formData.share_discount
          this.request(mallMerchantApi.updatePeriodic, formData).then((res) => {
            this.resetForm()
            if (this.id) {
              this.getFormData()
            }
            this.$message.success('提交成功！')
            this.$router.push({path: '/merchant/merchant.mall/periodicList', query: {store_id: this.store_id}})
            sessionStorage.setItem('periodicEdit', 1)
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