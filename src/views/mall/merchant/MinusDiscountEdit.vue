<script src="../../../components/MultiTab/setMenuTitle.js"></script>
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
        <a-form-model-item label="活动时间">
          <a-form-model-item :style="{ display: 'inline-block' }" prop="start_time" ref="startTime" :autoLink="false">
            <a-date-picker
              :disabled="formData.status == 2 || formData.status == 1 ? true : false"
              v-model="start_time"
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
        <a-form-model-item label="活动类型" prop="is_discount">
          <a-radio-group v-model="formData.is_discount" @change="isDiscountChange">
            <a-radio :value="0"> 满减</a-radio>
            <a-radio :value="1"> 满折</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <div v-for="(rule_item,rule_index) in formData.rule" :key="rule_item.key">
          <a-form-model-item
            label="优惠条件"
            :wrapper-col="{ span: 18 }"
            :prop="'rule.' + rule_index + '.level_money'"
            :rules="rule_detail_rules"
            style="margin-bottom: 0"
          >
            <div>
              <span class="mr-10">满足</span>
              <a-input-number :min="0" v-model="rule_item.level_money"/>
              <span class="mr-10">元</span>
              <span class="ml-10">{{ formData.is_discount == 0 ? '优惠' : '折扣' }}</span>
              <a-input-number :min="0" v-model="rule_item.level_discount"/>
              <span class="ml-10">{{ formData.is_discount == 0 ? '元' : '折' }}</span>
              <a-button type="link" v-show="rule_index == 0" @click="addRuleDetail()">添加一级</a-button>
              <a-button type="link" v-show="rule_index != 0" @click="delRuleDetail(rule_index)">删除</a-button>
            </div>
          </a-form-model-item>
        </div>


        <a-form-model-item label="限购" prop="max_num" help="0代表不限购，请输入0~999正整数">
          <span class="mr-10">每人最多可参与</span>
          <a-input-number :min="0" :max="999" v-model="formData.max_num"/>
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
          </a-table>
        </a-form-model-item>
      </a-card>
      <a-form-model-item :wrapper-col="{ span: 16, offset: 2 }" v-if="formData.status != 2">
        <div class="mt-20 mb-20">
          <a-button type="primary" @click="saveData()"> 保存</a-button>
        </div>
      </a-form-model-item>
    </a-form-model>
    <select-goods
      ref="selectGoods"
      :storeId="store_id"
      source="minus_discount"
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
import {compare} from '@/utils/util'
import { watchMixin } from '@/utils/mixin'

export default {
  name: 'MinusDiscountEdit',
  mixins: [watchMixin],
  components: {SelectGoods},
  data() {
    return {
      store_id: '', // 店铺id
      id: '', // 活动id
      addGoodsModalVisible: false,
      pagination: {
        total: 0,
        pageSize: 10, //每页中显示10条数据
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共 ${total} 条记录`, //分页中显示总的数据
      },
      // source: 'minus_discount',
      // 表单数据
      formData: {
        name: '',
        start_time: '',
        end_time: '',
        is_discount: 0,
        max_num: 0,
        is_discount_share: 1,
        share_discount: ['1','2'],
        act_type: 1,
        rule: [
          // 优惠档次
          {
            level_sort: 1,
            level_money: '',
            level_discount: '',
          },
        ],
      },
      // 表单校验规则
      rules: {
        name: [{required: true, message: '请输入活动名称', trigger: 'blur'}],
        start_time: [{ required: true, message: '请选择活动开始时间', trigger: ['blur', 'change'] }],
        end_time: [{ required: true, message: '请选择活动结束时间', trigger: ['blur', 'change'] }],
        nums: [{required: true, message: '请选择满包邮条件', trigger: 'blur'}],
        max_num: [{required: true, message: '请选择限购数量', trigger: 'blur'}],
        is_discount_share: [{required: true, message: '请选择优惠是否同享', trigger: 'blur'}],
        act_type: [{required: true, message: '请选择活动商品', trigger: 'blur'}],
      },
      columns: [
        {
          title: '商品信息',
          dataIndex: 'name',
          scopedSlots: {customRender: 'name'},
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
      rule_detail_rules: [
        {
          required: true,
          message: '请输入优惠条件',
          trigger: 'blur',
        },
      ],
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
      if (endValue < startValue) {
        this.$message.error('活动结束时间必须大于活动开始时间！')
        return
      }
      this.$set(this.formData, 'end_time', end_time)
      this.$refs.endTime.onFieldChange()
    },
    // 表单信息
    getFormData() {
      this.request(mallMerchantApi.getMinusDiscountInfo, {id: this.id}).then((res) => {
        console.log(res)
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
    // 添加商品
    addProduct() {
      if (!this.start_time || !this.end_time) {
        this.$message.error('请先选择活动时间！')
        return
      }
      this.$refs.selectGoods.openDialog()
    },
    // 选择商品回调
    selecrGoodsSubmit(e) {
      console.log(e)
      this.goodsList = e.goods
      this.$set(this.pagination, 'total', this.goodsList.length)
    },
    // 活动类型change
    isDiscountChange() {
      this.formData.rule = [
        // 优惠档次
        {
          level_sort: 1,
          level_money: '',
          level_discount: '',
        },
      ]
    },
    // 监听table多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 删除商品
    removeGoods(id) {
      if(id) {
        for (var i = 0; i < this.goodsList.length; i++) {
          if (this.goodsList[i].goods_id == id) {
            this.goodsList.splice(i, 1)
            this.selectedRowKeys.forEach((item,index) => {
              if(item == id) {
                this.selectedRowKeys.splice(index,1)
              }
            })
            console.log(this.selectedRowKeys)
            return
          }
        }
      }else {
        this.selectedRowKeys.forEach((id,i1)=> {
          this.goodsList.forEach((goods,i2) =>{
            if(goods.goods_id == id) {
              this.goodsList.splice(i2, 1)
            }
          })
        })
        this.selectedRowKeys = []
        console.log(this.selectedRowKeys)
      }
    },
    resetForm() {
      this.formData = this.$options.data().formData
      this.start_time = this.$options.data().start_time
      this.end_time = this.$options.data().end_time
      this.goodsList = []
      this.$forceUpdate()
    },
    // 添加一级
    addRuleDetail() {
      if (this.formData.rule.length == 5) {
        this.$message.error('最多可添加5级')
        return
      }
      let level_sort =
        this.formData.rule[this.formData.rule.length - 1] &&
        this.formData.rule[this.formData.rule.length - 1].level_sort
          ? this.formData.rule[this.formData.rule.length - 1].level_sort + 1
          : 1
      let arr = {
        level_sort: level_sort,
        level_money: '',
        level_discount: '',
      }
      this.formData.rule.push(arr)
    },
    // 删除一级
    delRuleDetail(index) {
      // this.currentLevel = index - 1 ? index - 1 : 0
      this.formData.rule.splice(index, 1)
    },
    // 提交表单
    saveData() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let formData = {}
          for (let k in this.formData) {
            formData[k] = this.formData[k]
          }

          try {
            if (formData.rule && formData.rule.length) {
              formData.rule.forEach((item) => {
                if (item.level_money == '') {
                  throw "请输入优惠条件"
                }

                if (formData.is_discount == 0 && item.level_discount == '') {
                  throw "请输入优惠条件"
                } else if (formData.is_discount == 1 && item.level_discount == '') {
                  throw "请输入优惠条件"
                }

                if (formData.is_discount == 0 && item.level_money < item.level_discount) {
                  throw "优惠金额不能大于满足金额"
                }

                if (formData.is_discount == 1 && item.level_discount > 100) {
                  throw "折扣范围0-100之间"
                }
              })
            } else {
              throw "请输入优惠条件";
            }
          } catch (e) {
            this.$message.error(e)
            return
          }

          //校验满足金额是否递增
          let temp_rule = []
          formData.rule.forEach(k => {
            let arr = {
              level_sort: k.level_sort,
              level_money: k.level_money,
              level_discount: k.level_discount,
            }
            temp_rule.push(arr)
          })
          let temp_level_money = temp_rule.sort(compare('level_money', 1))
          try {
            temp_level_money.forEach((item, index) => {
              if (index + 1 != item.level_sort) {
                throw "满足金额层级应为递增"
              }
            })
          } catch (e) {
            this.$message.error(e)
            return
          }

          if (formData.is_discount == 0) {
            //校验优惠金额是否递增
            let temp_level_discount = temp_rule.sort(compare('level_discount', 1))
            try {
              temp_level_discount.forEach((item, index) => {
                if (index + 1 != item.level_sort) {
                  throw "优惠金额层级应为递增"
                }
              })
            } catch (e) {
              this.$message.error(e)
              return
            }
          } else {
            //校验优惠折扣是否递增
            let temp_level_discount = temp_rule.sort(compare('level_discount', 2))
            try {
              temp_level_discount.forEach((item, index) => {
                if (index + 1 != item.level_sort) {
                  throw "优惠折扣层级应为递减"
                }
              })
            } catch (e) {
              this.$message.error(e)
              return
            }
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

          if (formData.rule) {
            formData.rule = JSON.stringify(formData.rule)
          }

          if (formData.act_type == 0 && !this.goodsList.length) {
            this.$message.error('请选择活动商品')
            return
          }
          formData.goods_ids = []
          if (formData.act_type == 0 && this.goodsList.length) {
            this.goodsList.forEach((item) => {
              formData.goods_ids.push(item.goods_id)
            })
          }
          formData.goods_ids = formData.goods_ids.toString()

          delete formData.share_discount
          this.request(mallMerchantApi.updateMinusDiscount, formData).then((res) => {
            this.resetForm();
            this.$message.success('提交成功！')
            this.$router.push({path: '/merchant/merchant.mall/minusDiscountList', query: {store_id: this.store_id}})
            sessionStorage.setItem('minusDiscountEdit', 1)
          })
        } else {
          console.log('error submit!!', this.formData)
          return false
        }
      })
    },
  }
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