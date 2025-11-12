<template>
  <div class="mt-20 ml-10 mr-10 mb-20">
    <a-card :bordered="false" :bodyStyle="{ background: '#F7F7F7' }">
      <div slot="title" class="fw-bold fs-20">{{ title }}</div>
      <a-row type="flex">
        <a-col :span="16" class="flex" style="display: flex; flex-direction: column">
          <a-card :bordered="false" :class="`mr-20 ${type == 'meal' && detail.remark ? '' : 'flex-1'}`">
            <a-row type="flex">
              <a-col class="mr-20"><a-avatar shape="square" :size="150" :src="icon" /></a-col>
              <a-col style="width: calc(100% - 170px)">
                <a-row
                  ><a-col class="fs-24 cr-33 fw-bold">{{ detail.name }}</a-col></a-row
                >
                <div class="mt-20 fs-18 cr-66 store-detail" v-if="type == 'meal'">
                  <span>套餐内容：</span>
                  <span class="type-name cr-00" v-for="(store, index) in detail.store_detail" :key="index">
                    <span class="cr-primary">{{ store.num }}个</span><span>{{ store.type_name }}店铺</span
                    ><span class="plus">+</span>
                  </span>
                </div>
                <div class="mt-20 flex align-center">
                  <span class="fs-18 cr-66">价格：</span>
                  <span class="cr-primary fs-30">{{ currency + detail.year_price }}/年</span>
                </div>
                <a-row>
                  <a-col class="flex">
                    <span class="mt-20 fs-18 cr-66 flex-shink">服务周期：</span>
                    <a-radio-group v-model="year">
                      <a-radio-button
                        class="relative mr-30 mt-20 year"
                        :value="item.years"
                        v-for="item in detail.service_cycle"
                        :key="item.years"
                        >{{ item.label
                        }}<span class="discount-icon" v-if="item.discount">{{ item.discount }}</span></a-radio-button
                      >
                    </a-radio-group>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-card>
          <a-card :bordered="false" class="mt-20 mr-20 flex-1" v-if="type == 'meal' && detail.remark">
            <div class="flex fs-18">
              <span class="cr-66 flex-shink">详情描述：</span>
              <span>{{ detail.remark }}</span>
            </div>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card :bordered="false">
            <div class="fs-20 cr-33 fw-bold">{{selectTitle}}</div>
            <div class="flex align-center mt-20">
              <a-icon
                type="minus-circle"
                :class="`fs-30 cr-99 mr-10 ${num > 1 ? 'cr-primary' : ''}`"
                @click="num > 1 ? (num = num - 1) : ''"
              />
              <a-button class="inputNumber">{{ num }}</a-button>
              <a-icon type="plus-circle" class="fs-30 ml-10 cr-primary" @click="num = num + 1" />
            </div>
            <a-divider />
            <div class="fs-20 cr-33 fw-bold">店铺总数量</div>
            <div class="fs-30 cr-primary fw-bold mt-20">{{ store_num }}个</div>
            <a-divider />
            <div class="fs-20 cr-33 fw-bold mb-10">支付方式</div>
            <div>
              <a-radio-group v-model="pay_check">
                <a-radio :style="radioStyle" :value="index" v-for="(item, index) in payTypeList" :key="item.value">
                  {{ item.label }}
                  <span v-show="item.value == 'balance'"
                    ><span class="cr-red">{{ currency + merchantMoney }}</span>
                    <span class="cr-99" v-show="!can_balance_pay"> (余额不足）</span></span
                  >
                </a-radio>
              </a-radio-group>
            </div>
            <a-divider />
            <div class="fs-20 cr-primary text-right">已优惠{{ currency + discount_money }}</div>
            <div class="fs-40 cr-33 text-right fw-bold">{{ currency + pay_money }}</div>
            <div><a-button class="buy-btn" type="primary" @click="goPay">立即购买</a-button></div>
          </a-card>
        </a-col>
      </a-row>
    </a-card>

    <a-modal
      v-model="wxPayModalVisible"
      :title="pay_type"
      :width="700"
      centered
      destroyOnClose
      @ok="handleOK"
      @cancel="handleCancel"
      cancelText="关闭"
      okText="支付已完成"
      class="modal"
      style="text-aligin: center"
    >
      <div class="tips">{{ pay_tip }}</div>
      <div class="qrcode text-center">
        <a-avatar shape="square" :size="400" :src="payCode" />
      </div>
    </a-modal>
  </div>
</template>

<script>
const mealIcon = require('@/assets/merchant/meal_big.png')
const classifyIcon = require('@/assets/merchant/classify_big.png')
import marketingMerchantApi from '@/api/new_marketing/merchant/index'
export default {
  data() {
    return {
      radioStyle: {
        display: 'block',
        height: '40px',
        lineHeight: '40px',
        fontSize: '18px',
      },
      title: '店铺分类详情',
      type: 'classify', // clssify 店铺分类详情 meal套餐详情
      icon: classifyIcon,
      year: 1, // 选择周期
      num: 1,
      pay_check: 0, // 支付方式

      wxPayModalVisible: false,

      id: '',
      detail: {}, // 详情
      currency: '¥',
      merchantMoney: 0, // 商家余额
      discount_money: 0, // 优惠金额
      pay_money: 0, // 总价
      payTypeList: [], // 支付方式列表
      payCode: '',
      pay_type: '', // 显示的支付名称
      pay_tip: '', // 支付提示
      payTimer: '',
      selectTitle: ''
    }
  },
  watch: {
    $route: {
      handler: function (val) {
        console.log('监听路由', val)
      },
    },
    '$route.query.id': {
      immediate: true,
      handler: function (newVal, oldVal) {
        if (newVal != undefined) {
          this.init()
        }
      },
    },
    year: function (val) {
      // console.log('周期变化', val)
      this.getPrice()
    },
    num: function (val) {
      // console.log('数量变化', val)
      this.getPrice()
    },
    pay_check: function (val) {
      const item = this.payTypeList[this.pay_check]
      this.pay_type = item.label
      switch (item.value) {
        case 'weixin':
          this.pay_tip = '请使用微信扫描二维码进行支付'
          break
        case 'alipay':
          this.pay_tip = '请使用支付宝扫描二维码进行支付'
          break
      }
    },
  },
  computed: {
    // 店铺总数量
    store_num: function () {
      let storeNum = this.num
      if (this.type == 'meal') {
        storeNum = this.num * this.detail.all_num
      }
      return storeNum
    },
    // 商家余额是否足够支付
    can_balance_pay: function () {
      const { merchantMoney, pay_money } = this
      if (merchantMoney < pay_money) {
        return false
      }
      return true
    },
  },
  beforeRouteLeave(to, from, next) {
    console.log('路由守卫 leave')
    clearInterval(this.payTimer)
    next()
  },
  methods: {
    init() {
      this.year = 1
      this.num = 1
      console.log('初始化页面', this.data)
      this.id = this.$route.query.id
      this.type = this.$route.query.type
      if (this.type == 'meal') {
        this.title = '套餐详情'
        this.icon = mealIcon
        this.getDetail('getMealDetail')
        this.selectTitle = '选择套餐数量'
      } else {
        this.title = '店铺分类详情'
        this.icon = classifyIcon
        this.getDetail('getClassifyDetail')
         this.selectTitle = '选择店铺数量'
      }
    },
    goPay() {
      const { pay_check, payTypeList } = this
      if (payTypeList[pay_check].value == 'balance') {
        if (!this.can_balance_pay) {
          this.$message.error('商家余额不足，请使用其他支付方式！', 1)
        } else {
          this.$confirm({
            title: '确定使用商家余额支付吗?',
            content: '',
            onOk: () => {
              this.checkOrder()
            },
            onCancel() {
              console.log('Cancel');
            },
          });
        }
      } else {
        this.checkOrder()
      }
      
    },
    handleCancel() {
      clearInterval(this.payTimer)
      this.wxPayModalVisible = false
    },
    handleOK() {
      clearInterval(this.payTimer)
      this.$multiTab.closeCurrentPage()
      this.wxPayModalVisible = false
      setTimeout(() => {
        this.$router.push({ path: '/new_marketing/merchant/storeUseDetail' })
      }, 200)
    },

    // 获取详情
    getDetail(api) {
      this.request(marketingMerchantApi[api], { id: this.id }).then((res) => {
        console.log('详情', res)
        this.currency = res.currency
        this.detail = res.data
        this.merchantMoney = res.money * 1
        this.getPrice()
        this.getPayType()
      })
    },
    // 获取支付价格
    getPrice() {
      const { id, year, num, type } = this

      let params = {
        id,
        year,
        num,
        type: type == 'meal' ? 1 : 2,
      }
      this.request(marketingMerchantApi.getPrice, params).then((res) => {
        // console.log('价格', res)
        this.discount_money = res.discount * 1
        this.pay_money = res.pay * 1
      })
    },
    // 获取支付方式
    getPayType() {
      this.request(marketingMerchantApi.getPayType).then((res) => {
        // console.log('支付方式', res)
        this.payTypeList = res
      })
    },

    checkOrder() {
      const { pay_check, type, id, pay_money, discount_money, year, store_num, num } = this
      let params = { pay_check, type, id, pay_money, discount_money, year, store_num, num }
      params.pay_check = this.payTypeList[pay_check].value
      params.type = type == 'meal' ? 1 : 2
      this.request(marketingMerchantApi.checkOrder, params).then((res) => {
        console.log('支付详情', res)
        if (res.pay_ok == 1) {
          // 商家余额支付 成功
          this.$multiTab.closeCurrentPage()
          this.$router.push({ path: '/new_marketing/merchant/storeUseDetail' })
          return
        }
        this.checkPayOk(res.orderid, res.pay_ok)
        if (res.pay_ok == 2) {
          // 微信支付
          this.payCode = res.info
          this.wxPayModalVisible = true
          return
        }
        if (res.pay_ok == 3) {
          this.$confirm({
            title: '支付状态确认',
            content: '',
            okText: '支付已完成',
            cancelText: '关闭',
            onOk: () => {
              this.handleOK()
            },
            onCancel: () => {
              clearInterval(this.payTimer)
            },
          })
          // 支付宝支付
          window.open(res.info)
          return
        }
      })
    },

    checkPayOk(orderid, type) {
      this.payTimer = setInterval(() => {
        this.request(marketingMerchantApi.checkOrderPayOk, { orderid }).then((res) => {
          if (res.paid == 1) {
            clearInterval(this.payTimer)
            this.handleOK()
          }
        })
      }, 1000)
    },
  },
}
</script>

<style scoped>
.year {
  width: 90px;
  text-align: center;
}
.mr-20 {
  margin-right: 20px;
}
.mr-30 {
  margin-right: 30px;
}
.mt-20 {
  margin-top: 20px;
}
.fs-40 {
  font-size: 40px;
}
.fs-24 {
  font-size: 24px;
}
.fs-30 {
  font-size: 30px;
}
.fs-20 {
  font-size: 20px;
}
.fs-30 {
  font-size: 30px;
}
.cr-99 {
  color: #999;
}
.cr-33 {
  color: #333;
}
.cr-primary {
  color: #1890ff;
}

.flex-shink {
  flex-shrink: 0;
}
.flex-1 {
  flex: 1;
}
.discount-icon {
  position: absolute;
  top: -6px;
  right: -15px;
  background: #1890ff;
  color: #fff;
  font-size: 12px;
  line-height: 1;
  width: 35px;
  text-align: center;
  border-radius: 10px;
  padding: 2px 0;
}
.inputNumber {
  height: 46px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  width: 120px;
  border: 2px solid #1890ff;
  border-radius: 4px;
  color: #1890ff;
}
.buy-btn {
  width: 100%;
  font-size: 24px;
  height: 50px;
  margin-top: 10px;
}

.modal .tips {
  line-height: 40px;
  vertical-align: middle;
  text-align: center;
  font-size: 18px;
  color: #333333;
  font-weight: bold;
}
.store-detail .type-name:last-child .plus {
  display: none;
}
</style>