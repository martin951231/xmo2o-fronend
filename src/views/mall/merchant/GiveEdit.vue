<template>
  <div class="mt-10 mb-20 mh-full">
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
        <a-form-model-item label="活动名称" prop="name">
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
        <a-form-model-item label="活动类型" prop="full_type">
          <a-radio-group v-model="formData.full_type" @change="fullTypeChange">
            <a-radio :value="1"> 满N元 </a-radio>
            <a-radio :value="2"> 满N件 </a-radio>
          </a-radio-group>
        </a-form-model-item>

        <a-form-model-item label="活动商品" prop="act_type">
          <a-radio-group v-model="formData.act_type">
            <a-radio :value="1"> 全店商品参与 </a-radio>
            <a-radio :value="0"> 部分商品参与 </a-radio>
          </a-radio-group>
        </a-form-model-item>

        <a-form-model-item v-if="formData.act_type == 0" :wrapper-col="{ span: 18, offset: 4 }">
          <a-button @click="addProduct()" type="primary"> 添加商品 </a-button>
          <a-button v-if="selectGoods.length" class="ml-20" type="danger" @click="removeGoods()">
            删除 {{ selectGoods.length }} 项
          </a-button>
          <a-table
            v-show="goodsList.length"
            :row-selection="{ selectedRowKeys: selectGoods, onChange: goodsSelectChange }"
            :columns="columns"
            :data-source="goodsList"
            :pagination="pagination"
            rowKey="goods_id"
            class="mt-20"
          >
            <span slot="name" slot-scope="text, record">
              <div class="product-info">
                <div v-if="record.image_url"><img :src="record.image_url" /></div>
                <div>{{ text }}</div>
              </div>
            </span>
            <span slot="price" slot-scope="text, record" class="cr-red">
              <span v-if="record.goods_type.toLowerCase() == 'sku'">
                ￥{{ record.min_price }} ~ ￥{{ record.max_price }}
              </span>
              <span v-if="record.goods_type.toLowerCase() == 'spu'">
                ￥{{ record.price }}
              </span>
            </span>
            <span slot="action" slot-scope="text">
              <a class="ml-10 inline-block" @click="removeGoods(text)">删除</a>
            </span>
          </a-table>
        </a-form-model-item>
        <div v-for="(gift_item, gift_index) in formData.gift_detail" :key="gift_item.key">
          <a-form-model-item
            label="优惠条件"
            :wrapper-col="{ span: 18 }"
            :prop="'gift_detail.' + gift_index + '.level_money'"
            style="margin-bottom: 0"
          >
            <div>
              <span class="mr-10">满</span>
              <a-input-number :min="0" v-model="gift_item.level_money" />
              <span class="ml-10">{{ formData.full_type == 1 ? '元' : '件' }}</span>
              <a-button type="link" v-show="gift_index == 0" @click="addGiftDetail()">添加一级</a-button>
              <a-button type="link" v-show="gift_index != 0" @click="delGiftDetail(gift_index)">删除</a-button>
            </div>
          </a-form-model-item>
          <a-form-model-item label="" :wrapper-col="{ span: 18, offset: 4 }">
            <a-button @click="addGiveProduct(gift_index)" type="primary"> 添加赠品 </a-button>
            <a-table
              v-show="gift_item.goods && gift_item.goods.length"
              :columns="giftGoodsColumns"
              :data-source="gift_item.goods"
              :pagination="false"
              rowKey="sku_id"
              class="mt-20"
            >
              <span slot="name" slot-scope="text, record">
                <div class="product-info">
                  <div v-if="record.image_url"><img :src="record.image_url" /></div>
                  <div>{{ text }}</div>
                </div>
              </span>
              <span slot="price" slot-scope="text, record" class="cr-red">
                <span>￥{{ record.price }}</span>
              </span>
              <span slot="stockNumTitle">
                当前库存
                <a-tooltip trigger="hover">
                  <template slot="title">该商品当前实际剩余库存</template>
                  <a-icon class="ml-10" type="question-circle" />
                </a-tooltip>
              </span>
              <div v-if="id">
                 <span slot="stockNum" slot-scope="text, record">
                  <span>{{ record.stock_num}}</span>
                 </span>
              </div>
              <div v-else>
                <span slot="stockNum" slot-scope="text, record">
                  <span>{{ record.act_stock_num==0?record.stock_num+record.act_stock_num:record.stock_num}}</span>
                 </span>
              </div>
              <span slot="actStockNumTitle">
                活动库存
                <a-tooltip trigger="hover">
                  <template slot="title">该赠品在活动期间内最多可赠送的库存</template>
                  <a-icon class="ml-10" type="question-circle" />
                </a-tooltip>
              </span>

              <a-form-item
                slot="actStockNum"
                slot-scope="text, record"
                style="margin: -5px 0"
                :validate-status="record.act_stock_num == 0 && formData.status != 2  ? 'error' : ''"
                :help="record.act_stock_num == 0 && formData.status != 2 ? '活动库存不能为0' : ''"
              >
                <div v-if="id">
                  <a-input-number
                          :min="record.stock_num == -1 ? -1 : 0"
                          :max="record.stock_num == -1?Infinity:record.stock_num"
                          v-model="record.act_stock_num"
                          @change="giftHandleChange(record.act_stock_num, record, 'stock_num')"
                  />
                </div>
                <div v-else>
                  <a-input-number
                          :min="record.stock_num == -1 ? -1 : 0"
                          :max="record.stock_num == -1?Infinity:record.stock_num"
                          v-model="record.stock_num1"
                          @change="giftHandleChange(record.stock_num1, record, 'act_stock_num')"
                  />
                </div>
                <!-- -1 不限库存 -->
              </a-form-item>
              <span slot="giftNumTitle">
                赠送数量
                <a-tooltip trigger="hover">
                  <template slot="title">每次满足优惠条件赠送该商品数量</template>
                  <a-icon class="ml-10" type="question-circle" />
                </a-tooltip>
              </span>

              <a-form-item slot="giftNum" slot-scope="text, record" style="margin: -5px 0">
                <a-input-number
                  :min="1"
                  :max="record.stock_num == -1 ? Infinity : record.act_stock_num"
                  v-model="record.gift_num"
                  @change="giftHandleChange(record.act_stock_num, record, 'gift_num')"
                />
              </a-form-item>

              <span slot="action" slot-scope="text, record">
                <a class="ml-10 inline-block" @click="removeGiftGoods(gift_index, record)">删除</a>
              </span>
            </a-table>
          </a-form-model-item>
        </div>

        <a-form-model-item label="限购" prop="join_max_num" help="0代表不限购，请输入0~999正整数">
          <span class="mr-10">每人最多可参与</span>
          <a-input-number :min="0" :max="999" v-model="formData.join_max_num" />
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
      <a-form-model-item :wrapper-col="{ span: 16, offset: 2 }" v-if="formData.status != 2">
        <div class="mt-20 mb-20">
          <a-button type="primary" @click="saveData()"> 保存 </a-button>
        </div>
      </a-form-model-item>
    </a-form-model>
    <select-goods
      ref="selectGoods"
      :storeId="store_id"
      :source="source"
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
  name: 'GiveEdit',
  mixins: [watchMixin],
  components: { SelectGoods },
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
        showTotal: total => `共 ${total} 条记录` //分页中显示总的数据
      },
      source: 'give',
      // 表单数据
      formData: {
        name: '',
        start_time: '',
        end_time: '',
        full_type: 1,
        nums: 0,
        join_max_num: 0,
        is_discount_share: 1,
        share_discount: [],
        act_type: 1,
        gift_detail: [
          // 赠品
          {
            level_sort: 1,
            level_money: 0,
            goods: []
          }
        ]
      },
      // 表单校验规则
      rules: {
        name: [{ required: true, message: '请输入活动名称', trigger: ['blur', 'change'] }],
        start_time: [{ required: true, message: '请选择活动开始时间', trigger: ['blur', 'change'] }],
        end_time: [{ required: true, message: '请选择活动结束时间', trigger: ['blur', 'change'] }],
        full_type: [{ required: true, message: '请选择活动类型', trigger: ['blur', 'change'] }],
        nums: [{ required: true, message: '请选择满包邮条件', trigger: ['blur', 'change'] }],
        join_max_num: [{ required: true, message: '请选择限购数量', trigger: ['blur', 'change'] }],
        is_discount_share: [{ required: true, message: '请选择优惠是否同享', trigger: ['blur', 'change'] }],
        act_type: [{ required: true, message: '请选择活动商品', trigger: ['blur', 'change'] }]
      },
      columns: [
        {
          title: '商品信息',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '价格',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '当前库存',
          dataIndex: 'stock_num'
        },
        {
          title: '操作',
          dataIndex: 'goods_id',
          width: '100px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      goodsList: [],
      selectGoods: [],
      giftGoodsColumns: [
        {
          title: '商品信息',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '规格',
          dataIndex: 'sku_str',
          scopedSlots: { customRender: 'sku_str' }
        },
        {
          title: '价格',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' }
        },
        {
          dataIndex: 'stock_num',
          slots: { title: 'stockNumTitle' },
          scopedSlots: { customRender: 'stockNum' }
        },
        {
          dataIndex: 'act_stock_num',
          key: 'act_stock_num',
          slots: { title: 'actStockNumTitle' },
          scopedSlots: { customRender: 'actStockNum' }
        },
        {
          dataIndex: 'gift_num',
          key: 'gift_num',
          slots: { title: 'giftNumTitle' },
          scopedSlots: { customRender: 'giftNum' }
        },
        {
          title: '操作',
          dataIndex: 'goods_id',
          width: '100px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      currentLevel: 0, // 当前操作的级别赠品index
      start_time: null,
      end_time: null
    }
  },
  watch: {
    '$route.path' (val) {
      if (val == '/merchant/merchant.mall/EditGive') {
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
      this.request(mallMerchantApi.getGiveInfo, { id: this.id }).then(res => {
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
        this.goodsList = res.goods_sku || []
        this.$set(this, 'formData', res)
      })
    },
    // 添加商品
    addProduct() {
      let { activeTime, message } = this.activeTimeCheck()
      if (!activeTime && message) {
        this.$message.error(message)
        return
      }
      this.source = 'give'
      this.$nextTick(() => {
        this.$forceUpdate()
        this.$refs.selectGoods.openDialog()
      })
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
      console.log('e', e)
      if (this.source == 'give') {
        this.goodsList = e.goods || []
        this.$set(this.pagination, 'total', this.goodsList.length)
      } else {
        if (e.goods && e.goods.length) {
          e.goods = e.goods
            .map(item => {
              if (item && item.sku_info && item.sku_info.length) {
                item.sku_info.forEach(item_sku => {
                  item_sku.name = item.name
                  item_sku.goods_id = item.goods_id
                  item_sku.image = item.image
                  if (!item_sku.act_stock_num) {
                    item_sku.act_stock_num = item.stock_num
                  }
                  if (!item_sku.gift_num) {
                    item_sku.gift_num = 1
                  }
                })
              }
              return item.sku_info
            })
            .reduce((pre, cur) => {
              return pre.concat(cur)
            }, [])
        }
        console.log(e.goods, 'e.goods')
        let current_gift_detail = this.formData.gift_detail[this.currentLevel]['goods']
        let sku_id = []
        current_gift_detail.map((item)=>{
          sku_id.push(item.sku_id)
        })
        e.goods.map((itm)=>{
          if (sku_id.indexOf (itm.sku_id) == -1) {
            let sku_goods = {
              goods_id: itm.goods_id,
              sku_id: itm.sku_id,
              act_stock_num: itm.act_stock_num,
              gift_num: 1,
              sale_num:itm.sale_num,
              name: itm.name,
              sku_str: itm.sku_str,
              price: itm.price,
              stock_num: itm.stock_num,
            }
            current_gift_detail.push(sku_goods)
          }
        })
        this.formData.gift_detail[this.currentLevel]['goods'] = current_gift_detail
        this.$set(this.formData, 'gift_detail', this.formData.gift_detail)
      }
    },
    // 商品table选择
    goodsSelectChange(selectedRowKeys) {
      this.selectGoods = selectedRowKeys
    },
    // 活动类型change
    fullTypeChange() {
      if (this.formData.full_type == 2) {
        let rules = {
          required: true,
          pattern: /^[+]{0,1}(\d+)$/,
          message: '请输入正确的优惠条件',
          trigger: 'blur'
        }
        this.gift_detail_rules.push(rules)
      } else {
        this.gift_detail_rules = this.gift_detail_rules.filter(item => !item.pattern)
      }
      this.$set(this.formData, 'act_type', this.$options.data().formData['act_type'])
      this.goodsList = []
      this.selectGoods = []
      this.$set(this.formData, 'gift_detail', this.$options.data().formData['gift_detail'])
      console.log(this.gift_detail_rules, 'this.gift_detail_rules')
    },
    // 删除商品
    removeGoods(id) {
      if (id) {
        for (var i = 0; i < this.goodsList.length; i++) {
          if (this.goodsList[i].goods_id === id) {
            this.goodsList.splice(i, 1)
          }
        }
        if (this.selectGoods.length) {
          for (var i = 0; i < this.selectGoods.length; i++) {
            if (id === this.selectGoods[i]) {
              this.selectGoods.splice(i, 1)
            }
          }
        }
      } else {
        this.selectGoods.forEach((id,i1)=> {
          this.goodsList.forEach((goods,i2) =>{
            if(goods.goods_id == id) {
               this.goodsList.splice(i2, 1)
            }
          })
        })
        this.selectGoods = []
      }
    },
    resetForm() {
      this.formData = this.$options.data().formData
      this.start_time = this.$options.data().start_time
      this.end_time = this.$options.data().end_time
      this.goodsList = []
      this.$forceUpdate()
    },
    // 添加赠品
    addGiveProduct(index) {
      let { activeTime, message } = this.activeTimeCheck()
      if (!activeTime && message) {
        this.$message.error(message)
        return
      }
      if (!this.goodsList.length && this.formData.act_type == 0) {
        this.$message.error('请选择参与活动的商品')
        return
      }
      this.currentLevel = index
      this.source = 'give_gift'
      this.$nextTick(() => {
        this.$forceUpdate()
        this.$refs.selectGoods.openDialog()
      })
    },
    // 添加一级
    addGiftDetail() {
      if (this.formData.gift_detail.length == 5) {
        this.$message.error('最多可添加5级')
        return
      }
      if (!this.formData.gift_detail[this.currentLevel]['goods'].length) {
        this.$message.error('请选择参与活动的赠品')
        return
      }
      let level_sort =
        this.formData.gift_detail[this.formData.gift_detail.length - 1] &&
        this.formData.gift_detail[this.formData.gift_detail.length - 1].level_sort
          ? this.formData.gift_detail[this.formData.gift_detail.length - 1].level_sort + 1
          : 1
      let arr = {
        level_sort: level_sort,
        level_money: 0,
        goods: []
      }
      this.formData.gift_detail.push(arr)
    },
    // 删除一级
    delGiftDetail(index) {
      this.currentLevel = index - 1 ? index - 1 : 0
      this.formData.gift_detail.splice(index, 1)
    },
    // 赠品活动库存修改
    giftHandleChange(value, record, key) {
      console.log("record",record)
      let sku_id = record.sku_id,
        gift_detail = this.formData.gift_detail,
        newData = ''
      gift_detail.forEach(item => {
        if (item.goods && item.goods.length) {
          item.goods.forEach(goods_item => {
            if (goods_item.sku_id == sku_id) {
              newData = item
            }
          })
        }
      })
      console.log('newData', newData)
      if (newData) {
        if (key == 'act_stock_num') {
          if (record[key] > record['act_stock_num'] && record['stock_num'] != -1) {
            value = record['stock_num']
            console.log(value,"chaochu")
            //this.$message.error('商品活动库存超出当前库存')
         }
         /* else{
            record['stock_num']=value
          }*/
        }

        if (key == 'stock_num') {
          if (record[key] < record['act_stock_num'] && record['stock_num'] != -1) {
            value = record['stock_num']
            console.log(value,"chaochu")
            //this.$message.error('商品活动库存超出当前库存')
          }
        }
     }
      this.formData.gift_detail = this.formData.gift_detail.filter(item => {
        if (item.goods_id == record.goods_id) {
          item.goods = item.goods.filter(goods_item => {
            if (goods_item.sku_id == sku_id) {
              goods_item = newData
            }
            return goods_item
          })
        }
        return item
      })
    },
    // 删除赠品
    removeGiftGoods(gift_index, record) {
      let goods = this.formData.gift_detail[gift_index]['goods'] || []
      if (goods.length) {
        goods.forEach((item, index) => {
          if (item.sku_id == record.sku_id) {
            goods.splice(index, 1)
          }
        })
      }
      this.formData.gift_detail[gift_index]['goods'] = goods
      this.$nextTick(() => {
        this.$set(this.formData, 'gift_detail', this.formData.gift_detail)
      })
    },
    // 提交表单
    saveData() {
      let { activeTime, message } = this.activeTimeCheck()
      if (!activeTime && message) {
        this.$message.error(message)
        return
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          let formData = this.formData

          if (formData.gift_detail && formData.gift_detail.length) {
            let goods_check = false,
              act_stock_num_check = false,
              gift_num_check = false
            formData.gift_detail.forEach(item => {
              if (!item.goods.length) {
                goods_check = true
              }

              if (item.goods && item.goods.length) {
                item.goods.forEach(goods_item => {
                  if (!goods_item.act_stock_num || goods_item.act_stock_num == 0) {
                    act_stock_num_check = true
                  }
                  if (!goods_item.gift_num) {
                    gift_num_check = true
                  }
                })
              }
            })
            if (goods_check) {
              this.$message.error('请选择赠送商品')
              return
            }
            if (act_stock_num_check) {
              this.$message.error('赠品活动库存不能为空或0')
              return
            }
            if (gift_num_check) {
              this.$message.error('赠品数量不能为空')
              return
            }

            if (formData.is_discount_share == 1 && formData.share_discount.length == 0) {
              this.$message.error('请选择优惠同享类型')
              return
            }
            // 优惠条件校验
            let levelMoney = false
            for (let i = 0; i < formData.gift_detail.length; i++) {
              if (formData.gift_detail[i + 1] && (Number(formData.gift_detail[i + 1].level_money) <= Number(formData.gift_detail[i].level_money)) || formData.gift_detail[i].level_money<=0) {
                levelMoney = true
                break
              }
            }
            if (levelMoney) {
              this.$message.error('优惠条件不符合，请重新输入')
              return
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
          if(!this.goodsList.length && formData.act_type === 0 ){
            this.$message.error('请选择满赠活动商品')
            return
          }
          if (this.goodsList.length) {
            formData.goods_sku = JSON.stringify(this.goodsList)
          } else {
            formData.goods_sku = ''
          }
          console.log('formData', formData)
          let params = {}
          for (let k in formData) {
            if (k != 'share_discount' && k != 'time') {
              params[k] = formData[k]
            }
            if (formData.gift_detail.length && k == 'gift_detail') {
              params[k] = JSON.stringify(formData.gift_detail)
            }
          }
          if (formData.act_type == 1) {
            params.goods_sku = ''
          }
          this.request(mallMerchantApi.giveAdd, params).then(res => {
            if (!this.id) {
              this.resetForm()
            }
            this.$router.push({
              path: '/merchant/merchant.mall/giveList',
              query: { store_id: this.store_id }
            })
            this.$message.success('提交成功！')
            sessionStorage.setItem('giveEdit', 1)
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
<style scoped lang="less">
.select-goods {
  width: 1000px;
  display: flex;
  .left {
    width: 200px;
    height: 700px;
    border-right: 1px solid #eeeeee;
  }
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    .top {
      height: 50px;
      border-bottom: 1px solid #eeeeee;
      .search {
        width: 200px;
        float: right;
        margin-right: 10px;
      }
    }
    .bottom {
      flex: 1;
      padding: 10px;
      .product-info {
        display: flex;
        align-items: center;
        img {
          width: 80px;
          height: 80px;
          margin-right: 15px;
        }
      }
      .pagination {
        float: right;
        margin-top: 10px;
      }
    }
  }
}
</style>
