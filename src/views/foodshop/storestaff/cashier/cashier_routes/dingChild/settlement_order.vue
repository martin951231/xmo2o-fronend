<template>
  <div class="foodDetails_wrapper">
    <div class="header_info_container">
      <div class="pagetitle">{{ L('结账单') }}</div>
      <div class="cancel_checkout_btn" @click="backfnc()">{{ L('取消结账') }}</div>
    </div>

    <div class="body_cashier_container">
      <div class="details_container">
        <div class="orderinfo_wrapper">
          <div class="left_order_content">
            <div class="order_info_container" v-if="!showDiscountsPage">
              <div class="toporder_info">
                <div class="ordertitle">
                  <div>{{ L('订单详情') }}</div>
                </div>
                <div class="order_price_info">
                  <div class="order_number key_valuebox">
                    <div class="leftkey">{{ L('订单编号') }}</div>
                    <div class="rightvalue">{{ pageInfo.real_orderid }}</div>
                  </div>
                  <div class="order_number key_valuebox">
                    <div class="leftkey">{{ L('订单总价') }}</div>
                    <div class="rightvalue">
                      <span class="rmb">￥</span>
                      <span class="price">{{ pageInfo.price }}</span>
                    </div>
                  </div>
                  <div class="order_number key_valuebox">
                    <div class="leftkey">{{ L('不可优惠金额') }}</div>
                    <div class="rightvalue">
                      <span class="rmb">￥</span>
                      <span class="price">{{ cantdisc }}</span>
                      <span class="redfont" style="cursor: pointer" @click="chagemoneymodel('cantdisc')">{{
                        L('修改金额')
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="discount_info_content">
                <div class="discount_sliderwrapper">
                  <div class="discount_slider_container">
                    <div class="discount_form">
                      <!-- 团购券 -->
                      <div class="package_verification key_valuebox">
                        <div class="leftkey">{{ L('团购券') }}</div>
                        <div class="rightvalue" @click="showModal = true">
                          <div class="verificMoney" v-if="verificMoney && verificMoney != 0">
                            <span>{{ L('￥') }}</span>
                            <span>{{ verificMoney }}</span>
                          </div>
                          <div class="verificStatus">
                            <span>{{ verificStatus ? L('待核销') : L('已核销') }}</span>
                            <a-icon type="right" />
                          </div>
                        </div>
                      </div>
                      <div class="disc_list_wrapper">
                        <div class="key_valuebox" v-for="(items, index) in pageInfo.discount_list" :key="index">
                          <div class="leftkey">
                            <div class="reducediv" v-if="items.type == 'system_minus' || items.type == 'minus'">
                              {{ L('减') }}
                            </div>
                            <div
                              class="reducediv"
                              v-else-if="(items.type = 'plat_discount' || items.type == 'merchant_discount')"
                            >
                              {{ L('折') }}
                            </div>
                            <div class="reducediv" v-else-if="(items.type = 'plat_newuser_discount')">
                              {{ L('折') }}
                            </div>
                            <!-- <div class="reducediv" v-else="items.type=='newuser' || items.type=='system_newuser'">折</div> -->
                            <div class="keybox">{{ items.value }}</div>
                          </div>
                          <div class="rightvalue">
                            <div class="moneyinfo">-￥{{ items.minus }}</div>
                          </div>
                        </div>
                      </div>
                      <div class="merchants_vip key_valuebox">
                        <div class="leftkey">{{ L('商家会员卡折扣') }}</div>
                        <div class="rightvalue">
                          <div class="merchants_vip_info" v-if="Number(pageInfo.merchant_discount) == 0">
                            {{ L('无折扣') }}
                          </div>
                          <div class="merchants_vip_info" v-else>{{ pageInfo.merchant_discount }}{{ L('折') }}</div>
                        </div>
                      </div>
                      <div class="merchants_coupon key_valuebox" v-if="vipinfo.uid" @click="getcouponList('merchant')">
                        <div class="leftkey">{{ L('商家优惠券') }}</div>
                        <div class="rightvalue">
                          <div class="haveicon">
                            <div class="copupon" style="color: #f02e06" v-if="pageInfo.mer_coupon.had_id">
                              {{ pageInfo.mer_coupon.discount_desc }}
                            </div>
                            <div class="copupon" v-else>
                              {{ pageInfo.has_merchant_coupon ? L('不使用优惠券') : L('无可用优惠券') }}
                            </div>
                            <div class="gorighticon">
                              <img src="../../../../../../assets/storestaff/enter.png" alt="" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="platform_coupon key_valuebox" v-if="vipinfo.uid" @click="getcouponList('system')">
                        <div class="leftkey">{{ L('平台优惠券') }}</div>
                        <div class="rightvalue">
                          <div class="haveicon">
                            <div class="copupon" style="color: #f02e06" v-if="pageInfo.system_coupon.had_id">
                              {{ pageInfo.system_coupon.discount_desc }}
                            </div>
                            <div class="copupon" v-else>
                              {{ pageInfo.has_system_coupon ? L('不使用优惠券') : L('无可用优惠券') }}
                            </div>
                            <div class="gorighticon">
                              <img src="../../../../../../assets/storestaff/enter.png" alt="" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="platform_deduction key_valuebox">
                        <div class="leftkey">{{ L('平台积分抵扣') }}</div>
                        <div class="rightvalue">
                          <div class="deduction_info">
                            {{ L('本单可使用积分') }}
                            <span class="redfont">{{ pageInfo.system_score }} 个</span>
                            ,{{ L('可抵扣金额') }}
                            <span class="rmb">{{ L('￥') }}</span>
                            <span class="redfont">{{ pageInfo.system_score_money }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="platform_deduction key_valuebox" v-if="pageInfo.book_money > 0">
                        <div class="leftkey">{{ L('订金抵扣') }}</div>
                        <div class="rightvalue">
                          <div class="deduction_info">
                            <span class="reduce">-</span>
                            <span class="rmb">{{ L('￥') }}</span>
                            <span class="redfont">{{ pageInfo.book_money }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="internalCard_box" v-if="internalCardInfo">
                        <div class="key_valuebox" v-for="(item,index) in internalCardInfo.internal_card_ids" :key="index">
                          <div class="leftkey">
                            {{ L('一卡通卡号') }}
                            <div class="num">{{item.card_id}}</div>
                          </div>
                          <div class="leftkey">
                            {{ L('当前余额') }}
                            <div class="num">{{ L('￥') }}{{item.balance_money}}</div>
                          </div>
                          <div class="leftkey">
                            {{ L('可用余额') }}
                            <div class="num">{{ L('￥') + item.use_money}}</div>
                          </div>
                        </div>
                      </div>
                      <div class="need_pay key_valuebox">
                        <div class="leftkey">{{ L('应付金额') }}</div>
                        <div class="rightvalue">
                          <div class="priceInfo">
                            <span class="rmb">￥</span>
                            <span class="price">{{ Number(pageInfo.needpay_price).toFixed(2) }}</span>
                            <span class="redfont" style="cursor: pointer" @click="chagemoneymodel('needpay')">{{
                              L('修改金额')
                            }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bottom_vip_info">
                  <div class="vip_card_number internal_card" @click="openinternalCardModel" v-if="system_config && system_config.internal_membership_card == 1">
                    <div class="texttips">{{ L('一卡通') }}</div>
                    <div class="vip_card_number_info" style="color: #ef2e05" v-if="internalCardInfo">
                      <span style="margin-left: 5px; cursor: pointer">{{ L('换卡') }}</span>
                    </div>
                    <div class="vip_card_number_info" v-else>
                      <span style="cursor: pointer">{{ L('点击登录') }}</span>
                    </div>
                  </div>
                  <div class="vip_card_number" @click="openmodel()">
                    <div class="texttips">{{ L('会员卡号') }}</div>
                    <div class="vip_card_number_info" style="color: #ef2e05" v-if="vipinfo.id">
                      {{ vipinfo.id }}
                      <span style="margin-left: 5px; cursor: pointer">{{ L('修改会员') }}</span>
                    </div>
                    <div class="vip_card_number_info" v-else>
                      {{ L('未登录会员') }}
                      <span style="cursor: pointer">{{ L('点击登录') }}</span>
                    </div>
                  </div>
                  <div class="current_balance">
                    <div class="texttips">{{ L('当前余额') }}</div>
                    <div class="balance_info" v-if="vipinfo.id">
                      <span>￥</span>
                      {{ vipinfo.card_money }}
                    </div>
                    <div class="novip" v-else>{{ L('会员未登录') }}</div>
                  </div>
                  <div class="available_amount">
                    <div class="texttips">{{ L('可用金额') }}</div>
                    <div class="amount_info" v-if="vipinfo.id">
                      <span class="rmb">￥</span>
                      {{ vipcanusemoney }}
                      <span class="modify" @click="chagemoneymodel('vipchg')">{{ L('修改金额') }}</span>
                    </div>
                    <div class="novip" v-else>{{ L('会员未登录') }}</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 优惠券 -->
            <div class="discounts_page_container" v-else>
              <div class="toporder_info">
                <div class="baclbtn" @click="goback()">
                  <img src="../../../../../../assets/storestaff/arrow.png" alt="" />
                  <div class="bktext">{{ L('返回') }}</div>
                </div>
                <div class="ordertitle">
                  <div>{{ L('订单详情') }}</div>
                </div>
                <div class="emptybox"></div>
              </div>
              <div class="slider_discounts_list">
                <div class="discounts_content" v-if="discList.length > 0">
                  <div class="discountList_box">
                    <div class="discount_items" v-for="(items, index) in discList" :key="index">
                      <div class="leftvalueinfo">
                        <div class="currency">￥</div>
                        <div class="numstyle" v-for="(itm, idx) in items.discountList" :key="idx">
                          {{ idx == '0' ? itm : '.' + itm }}
                        </div>
                      </div>

                      <div class="right_coupon">
                        <div class="couponinfo">
                          <div class="coupontitle">{{ items.discount_des }}</div>
                          <div class="coupontime">{{ L('有效期至X1', { X1: items.end_time }) }}</div>
                        </div>

                        <div class="right_selectedbox" @click="usecoupon(items)">
                          <div class="selected" v-if="items.is_selected">
                            <img src="../../../../../../assets/storestaff/checked.png" alt="" />
                          </div>
                          <div class="selected" v-else><div class="noselect"></div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="emptydisc" v-else>
                  <img src="../../../../../../assets/storestaff/nocoupon.png" alt="" />
                  <div class="texttips">{{ L('您当前没有优惠券哦') }}~</div>
                </div>
              </div>
              <div class="nodiscounts">
                <div v-if="discList.length > 0" class="noselect_btn" @click="clearcouponId()">
                  {{ L('不使用优惠券') }}
                </div>
              </div>
            </div>
          </div>
          <div class="right_btn_content">
            <div class="needpay_info">
              <div class="border_box">
                <div class="texttips">{{ L('还需支付') }}</div>
                <div class="price_info">
                  <span>{{ L('￥') }}</span>{{goPayMoney}}
                </div>
              </div>

              <div
                class="btn_content"
                v-if="
                  pageInfo.pay_type && goPayMoney"
              >
                <div
                  class="border_btnstyle offlinePay_btn"
                  @click="choosepayMode('offline')"
                  :class="nowpayMethod == 'offline' ? 'offlinebordershow' : ''"
                  v-if="pageInfo.pay_type.offline"
                >
                  <div class="btnstyle">
                    <div class="iconbox"><img src="../../../../../../assets/storestaff/offline.png" alt="" /></div>
                    <div class="btn_text">{{ L('线下支付') }}</div>
                  </div>
                </div>

                <div
                  class="border_btnstyle onlinePay_btn"
                  @click="choosepayMode('online')"
                  :class="nowpayMethod == 'online' ? 'onlineshow' : ''"
                  v-if="pageInfo.pay_type.online"
                >
                  <!-- onlineshow -->
                  <div class="btnstyle">
                    <div class="iconbox"><img src="../../../../../../assets/storestaff/online.png" alt="" /></div>
                    <div class="btn_text">{{ L('在线支付') }}</div>
                  </div>
                </div>

                <div
                  class="border_btnstyle platformPay_btn"
                  @click="choosepayMode('balance')"
                  :class="nowpayMethod == 'balance' ? 'platformshow' : ''"
                  v-if="pageInfo.pay_type.balance"
                >
                  <!-- platformshow -->
                  <div class="btnstyle">
                    <div class="iconbox"><img src="../../../../../../assets/storestaff/platformpay.png" alt="" /></div>
                    <div class="btn_text">{{ L('平台余额支付') }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bbiigg_cfmbtn" @click="confrimPay()">{{ L('确认结账') }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改金额 -->
    <a-modal
      v-model="changemoneyShow"
      wrapClassName="borderradius"
      :footer="null"
      :title="null"
      :centered="true"
      width="30%"
      :destroyOnClose="true"
      :maskClosable="false"
      :closable="false"
      :bodyStyle="{ padding: 0 }"
    >
      <div class="alert_wrapper">
        <changeModel
          :modelInfo="pageInfo"
          :nowvipMoney="Number(vipcanusemoney)"
          :type="changeType"
          @saveMoneynum="saveMoneynum"
          @closemodel="closemodelfnc()"
        ></changeModel>
      </div>
    </a-modal>

    <!-- 会员信息查询 -->
    <a-modal
      v-model="vipinfoShow"
      wrapClassName="borderradius"
      :footer="null"
      :title="null"
      :centered="true"
      width="43%"
      :maskClosable="false"
      :closable="false"
      :bodyStyle="{ padding: 0 }"
      destroyOnClose
    >
      <div class="alert_wrapper">
        <vipInfoModel ref="vipInfoModel" :loginInfo="vipinfo" @saveuid="saveuid" @closemodel="closemodelfnc()" @saveInternalCard="saveInternalCard"></vipInfoModel>
      </div>
    </a-modal>

    <!-- 支付方式弹框 -->
    <a-modal
      v-model="payMethodshow"
      wrapClassName="borderradius"
      :footer="null"
      :title="null"
      :centered="true"
      :width="nowpayMethod == 'offline' ? '30%' : '38%'"
      :maskClosable="false"
      :closable="false"
      :destroyOnClose="true"
      :bodyStyle="{ padding: 0 }"
    >
      <div class="alert_wrapper">
        <payModel
          :modelInfo="pageInfo"
          :vipMoney="Number(vipcanusemoney)"
          :paymodeInfo="nowpayMethod"
          @comfirmOrder="comfirmPayOrder"
          @closemodel="closemodelfnc()"
        ></payModel>
      </div>
    </a-modal>

    <!-- 支付完成 -->
    <a-modal
      v-model="payConfim"
      wrapClassName="borderradius"
      :footer="null"
      :title="null"
      :centered="true"
      width="30%"
      :maskClosable="false"
      :closable="false"
      :bodyStyle="{ padding: 0 }"
    >
      <div class="alert_wrapper">
        <payConfim
          :frompage="frompage"
          :price="Number(pageInfo.needpay_price)"
          @closemodel="closemodelfnc()"
        ></payConfim>
      </div>
    </a-modal>

    <!-- 团购核销 -->
    <packageVerification
      :showModal="showModal"
      :ORDER_ID="ORDER_ID"
      :verificPackageList="verificPackageList"
      @closemodel="showModal = false"
      @updateVerificPackageList="updateVerificPackageList"
    ></packageVerification>
  </div>
</template>

<script>
import payConfim from '../../components/payConfirm_alert.vue' //支付完成弹框
import payModel from '../../components/payModel.vue' //支付方式弹框
import vipInfoModel from '../../components/vipInfoModel.vue' //会员信息
import changeModel from '../../components/changeMoney.vue' //会员信息
import packageVerification from '@/views/foodshop/storestaff/cashier/components/packageVerification'

export default {
  components: {
    vipInfoModel,
    payModel,
    payConfim,
    changeModel,
    packageVerification,
  },
  data() {
    return {
      ORDER_ID: '',
      pageInfo: '',
      vipinfo: {},
      vipcanusemoney: '',
      nowtype: '',
      mercouponId: -1,
      syscouponId: -1,
      iselectStatus: true,
      vipinfoShow: false, //vip信息开关
      showDiscountsPage: false,
      discList: [],

      changemoneyShow: false, //修改金额弹框开关
      cantdisc: 0, //不可优惠金额
      changeType: '',

      payConfim: false, //支付完成弹框
      payMethodshow: false, //支付弹框
      nowpayMethod: '', //当前支付的方式
      frompage: 1,
      payShake: true, //防止多次支付
      orderpolling: '',

      showModal: false, //  团购核销 弹框
      verificStatus: true, //true:去核销，false：去核销按钮可不点击
      verificMoney: 0, //已核销金额
      verificPackageList: [
        {
          package_name: '123', //套餐名称
        },
        {
          package_name: this.L('188套餐'), //套餐名称
        },
      ], //已核销套餐列表
      internalCardInfo: null,//一卡通数据
      ecard_pay_money: 0, //一卡通可抵扣的金额
      ecard_phone: '',//一卡通手机号
      goPayMoney: 0, //实际支付的金额
      system_config: null,
    }
  },
  created() {
    this.system_config = this.$getCache('system_config')
    if (Number(this.$route.query.otherpage) > -1) {
      this.$bus.$emit('changecurrent', this.$route.query.otherpage)
      this.frompage = Number(this.$route.query.otherpage)
    } else {
      this.frompage = 1
      this.$emit('titleState', { showstate: 'show', operation: 'changeLefttwo' })
    }
    this.ORDER_ID = this.$route.query.orderId
    this.$emit('uploadLeft', { id: this.$route.query.orderId, type: 3 })
  },
  mounted() {
    this.getPageInfo('firstTime')
  },
  methods: {
    selectitems() {
      this.iselectStatus = !this.iselectStatus
    },
    getPageInfo(type) {
      var rqstData = {}
      rqstData.order_id = this.ORDER_ID
      rqstData.uid = this.vipinfo.uid
      if (this.syscouponId != -1) {
        rqstData.use_sys_coupon = this.syscouponId
      }
      console.log(Number(this.mercouponId))
      if (this.mercouponId != -1) {
        console.log(123)
        rqstData.use_mer_coupon = this.mercouponId
      }
      rqstData.merchant_coupon_id = this.mercouponId
      rqstData.system_coupon_id = this.syscouponId
      rqstData.no_discount_money = this.cantdisc
      this.request('/foodshop/storestaff.order/cashDetail', rqstData).then((res) => {
        console.log(res, '-----------------------订单详情信息--------------------')
        this.pageInfo = res
        this.pageInfo.needpay_price = this.pageInfo.pay_price
        if (this.pageInfo.mer_coupon.had_id) {
          this.mercouponId = this.pageInfo.mer_coupon.had_id
        }
        if (this.pageInfo.system_coupon.had_id) {
          this.syscouponId = this.pageInfo.system_coupon.had_id
        }
        if (this.vipinfo.card_money > this.pageInfo.needpay_price) {
          this.vipcanusemoney = this.pageInfo.needpay_price
        } else {
          this.vipcanusemoney = this.vipinfo.card_money
        }
        this.verificPackageList = res.verificPackageList || []
        this.verificMoney = res.verificMoney || 0
        this.verificStatus = res.verificStatus || true

        this.updateMoney();
      })
    },

    // 优惠券相关

    getcouponList(type) {
      this.showDiscountsPage = true
      this.nowtype = type
      this.request('/storestaff/storestaff.coupon/couponList', {
        type: type,
        business: 'meal',
        money: type=='system'?this.pageInfo.needpay_price: this.pageInfo.goods_total_price?this.pageInfo.goods_total_price:this.pageInfo.needpay_price,
        uid: this.vipinfo.uid,
        has_merchant_discount : this.pageInfo.merchant_discount > 0 ? 1 : 0
      }).then((res) => {
        console.log(res, '-----------------------获取优惠券列表--------------------')
        this.discList = res
        this.discList.map((items) => {
          if (this.nowtype == 'merchant') {
            if (items.had_id == this.mercouponId) {
              items.is_selected = true
            } else {
              items.is_selected = false
            }
          } else {
            if (items.had_id == this.syscouponId) {
              items.is_selected = true
            } else {
              items.is_selected = false
            }
          }
          items.amount = []
          if (items.discount.indexOf('.') < 0) {
            items.discount += '.00'
          }
          items.discountList = items.discount.split('.')
          // items.discount.
        })
      })
    },

    usecoupon(info) {
      this.discList.forEach((items, index) => {
        if (items.had_id == info.had_id) {
          items.is_selected = true
          if (this.nowtype == 'merchant') {
            this.mercouponId = items.had_id
          } else {
            this.syscouponId = items.had_id
          }
        } else {
          items.is_selected = false
        }
        this.$set(this.discList, index, items)
      })

      this.$nextTick(() => {
        this.showDiscountsPage = false
        this.getPageInfo()
      })
    },

    clearcouponId() {
      if (this.nowtype == 'merchant') {
        this.mercouponId = 0
      } else {
        this.syscouponId = 0
      }
      this.showDiscountsPage = false
      this.getPageInfo()
    },

    goback() {
      this.showDiscountsPage = false
    },

    // 会员信息相关
    openmodel() {
      //打开弹框
      this.vipinfoShow = true
      this.$nextTick(()=>{
        this.$refs.vipInfoModel.updateModelData('membership')
      })
    },
    //一卡通信息相关
    openinternalCardModel(){
      this.vipinfoShow = true
      this.$nextTick(()=>{
        this.$refs.vipInfoModel.updateModelData('internalCard',this.internalCardInfo)
      })
    },
    closemodelfnc() {
      //关闭弹框
      this.vipinfoShow = false
      this.payMethodshow = false
      this.changemoneyShow = false
    },
    saveuid(e) {
      console.log(e)
      this.mercouponId = -1
      this.syscouponId = -1
      this.vipinfo = e
      this.getPageInfo()
    },

    saveInternalCard(e){
      this.internalCardInfo = e
      this.updateMoney();
    },

    //修改价格弹框
    chagemoneymodel(type) {
      this.changemoneyShow = true
      this.changeType = type
    },

    saveMoneynum(obj) {
      // 判断输入的金额是否符合条件
      if (obj.type == 'cantdisc') {
        console.log(this.pageInfo.price)
        if (Number(this.pageInfo.price) < obj.numinfo) {
          this.$message.error(this.L('不可优惠金额不能高于总价！'))
        } else {
          this.cantdisc = obj.numinfo
          this.getPageInfo()
          this.closemodelfnc()
        }
      } else if (obj.type == 'needpay') {
        this.pageInfo.needpay_price = obj.numinfo
        if (this.vipinfo.card_money > this.pageInfo.needpay_price) {
          this.vipcanusemoney = this.pageInfo.needpay_price
        } else {
          this.vipcanusemoney = this.vipinfo.card_money
        }
        this.closemodelfnc()
      } else {
        console.log(obj.numinfo)
        console.log(this.pageInfo.needpay_price)
        if (this.vipinfo.card_money < obj.numinfo) {
          this.$message.error(this.L('会员卡余额不足！'))
        } else {
          if (Number(obj.numinfo) > Number(this.pageInfo.needpay_price)) {
            this.$message.error(this.L('会员卡抵扣金额不能高于应付金额'))
          } else {
            this.vipcanusemoney = obj.numinfo
            this.closemodelfnc()
          }
        }
      }
      this.updateMoney();
    },

    //支付相关
    choosepayMode(type) {
      this.nowpayMethod = type
    },
    confrimPay() {
      if (this.goPayMoney > 0) {
        if (this.nowpayMethod) {
          console.log(this.nowpayMethod)
          this.payMethodshow = true
        } else {
          this.$message.warning(this.L('您还未选择支付方式~'))
        }
      } else {
        var info = {}
        info.authCode = ''
        info.code = ''
        info.phone = ''
        info.type = 'offline'
        this.comfirmPayOrder(info)
      }
    },

    comfirmPayOrder(info) {
      console.log(info)
      if (this.payShake) {
        const key = 'pay'
        this.$message.loading({ content: this.L('支付中') + '...', duration: 0, key })
        this.payShake = false
        let params = {
          order_id: this.ORDER_ID,
          merchant_coupon_id: this.mercouponId,
          system_coupon_id: this.syscouponId,
          use_sys_coupon: this.syscouponId ? 1 : 0,
          use_mer_coupon: this.mercouponId ? 1 : 0,
          use_change_money: this.pageInfo.pay_price == this.pageInfo.needpay_price ? 0 : 1,
          uid: this.vipinfo.uid ? this.vipinfo.uid : '',
          change_money: this.pageInfo.needpay_price,
          no_discount_money: this.cantdisc,
          card_money: this.vipcanusemoney,
          pay_type: info.type,
          system_score: this.pageInfo.system_score,
          system_score_money: this.pageInfo.system_score_money,
          pay_money: this.goPayMoney,
          offline_pay_type: info.type == 'offline' ? info.offline_pay_type : '',
          sms_code: info.code,
          phone: info.phone,
          auth_code: info.authCode,
        }
        //一卡通支付参数
        if(this.ecard_pay_money > 0 && this.ecard_phone){
          params.ecard_pay_money = this.ecard_pay_money;
          params.ecard_phone = this.ecard_phone;
        }
        this.request('/foodshop/storestaff.order/goPay',params)
          .then((res) => {
            console.log(res)
            this.payShake = true
            if (res.status == 1) {
              this.payMethodshow = false
              this.payConfim = true
              this.$message.success({ content: this.L('支付成功') + '!', key })
            } else if (res.status == 2) {
              this.searchpayResult(res)
            } else {
              this.$message.destroy()
            }
          })
          .catch((err) => {
            this.$message.destroy()
            console.log(err)
            this.payShake = true
          })
      }
    },

    // 查询支付结果轮询
    searchpayResult(info) {
      console.log(info)
      const key = 'pay'
      this.request('/foodshop/storestaff.Order/orderPayLog', {
        pay_order_id: info.pay_order_id,
        order_no: info.order_no,
        pay_type: info.pay_type,
      })
        .then((res) => {
          console.log(res)
          if (res.status == 1) {
            this.payMethodshow = false
            this.payConfim = true
            this.$message.success({ content: this.L('支付成功') + '!', key })
          } else if (res.status == 2) {
            setTimeout(() => {
              this.searchpayResult(info)
            }, 1500)
          } else {
            this.$message.error({ content: this.L('支付失败') + '!', key })
          }
        })
        .catch((res) => {
          clearInterval(this.orderpolling)
          this.$message.destroy()
          console.log(err)
          this.payShake = true
        })
    },

    backfnc() {
      this.$store.commit('changeleftState', 2)
      this.$router.go(-1)
    },

    updateVerificPackageList() {
      this.getPageInfo()
      this.$emit('uploadLeft', { id: this.$route.query.orderId, type: 3 })
    },
    //更新需要支付的价格
    updateMoney(){
      //实际支付价格（包含会员抵扣金额）
      this.goPayMoney = this.vipcanusemoney? Number(this.pageInfo.needpay_price - this.vipcanusemoney).toFixed(2): Number(this.pageInfo.needpay_price).toFixed(2)
      let price = this.goPayMoney;
      // 一卡通逻辑
      this.ecard_pay_money = 0;//一卡通需要支付的钱
      //处理一卡通支付的逻辑
      if(this.internalCardInfo){
        //一卡通支付的手机号
        this.ecard_phone = this.internalCardInfo.keyword;
        this.internalCardInfo.internal_card_ids = this.internalCardInfo.internal_card_ids.map(v=>{
          v.balance_money = Number(v.balance_money)
          if(price > 0){
            if(v.balance_money >= price){
              v.use_money = price //一卡通能余额完全支付的钱
              price = (parseFloat(price) - parseFloat(v.use_money)).toFixed(2) //实际支付的钱减去一卡通抵扣的钱
            }else if(v.balance_money < price){
              v.use_money = v.balance_money//一卡通余额只能支付部分的钱
              price = (parseFloat(price) - parseFloat(v.use_money)).toFixed(2) //实际支付的钱减去一卡通抵扣的钱
            }
          }else{
            //如果实际支付的钱为0元，则使用一卡通余额
            v.use_money = 0;
          }
          //获取一卡通可抵扣的钱
          this.ecard_pay_money = Number((parseFloat(this.ecard_pay_money) + parseFloat(v.use_money)).toFixed(2))
          return v
        })
      }

      //实际支付的钱减去一卡通抵扣的钱
      this.goPayMoney = Number((parseFloat(this.goPayMoney) - parseFloat(this.ecard_pay_money)).toFixed(2))
    },
  },
}
</script>

<style scoped lang="less">
@rem: 192; //定义页面尺寸
.foodDetails_wrapper {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  user-select: none;
  .header_info_container {
    width: 100%;
    height: 12%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    box-sizing: border-box;
    .pagetitle {
      font-size: 30 / @rem * 1rem;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 20 / @rem * 1rem;
    }
    .cancel_checkout_btn {
      width: 261 / @rem * 1rem;
      height: 74 / @rem * 1rem;
      background-color: rgba(256, 256, 256, 0.2);
      border-radius: 10 / @rem * 1rem;
      font-size: 30 / @rem * 1rem;
      font-weight: 500;
      color: #ffffff;
      line-height: 74 / @rem * 1rem;
      text-align: center;
      cursor: pointer;
      margin-bottom: 15 / @rem * 1rem;
    }
  }
  .body_cashier_container {
    width: 100%;
    height: 86%;
    display: flex;
    overflow: hidden;
    .details_container {
      width: 100%;
      height: 100%;
      background-color: #f3f5f7;
      border-radius: 10 / @rem * 1rem;
      box-sizing: border-box;
      padding: 30 / @rem * 1rem 20 / @rem * 1rem 40 / @rem * 1rem 20 / @rem * 1rem;
      .orderinfo_wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        .left_order_content {
          width: 820 / @rem * 1rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .order_info_container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            .toporder_info {
              width: 100%;
              height: 30%;
              .ordertitle {
                width: 100%;
                height: 25%;
                background: #e7eaed;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24 / @rem * 1rem;
                font-weight: bold;
                color: #666666;
              }
              .order_price_info {
                width: 100%;
                height: 75%;
                background-color: #ffffff;
                padding: 0 20 / @rem * 1rem;
                box-sizing: border-box;
                .key_valuebox {
                  width: 100%;
                  height: 33.333333%;
                  border-bottom: 1 / @rem * 1rem solid #f0f0f0;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  .leftkey {
                    font-size: 22 / @rem * 1rem;
                    font-weight: 500;
                    color: #666666;
                  }
                  .rightvalue {
                    font-size: 24 / @rem * 1rem;
                    font-weight: 500;
                    color: #666666;
                    .rmb {
                      font-size: 22 / @rem * 1rem;
                      font-weight: bold;
                      color: #f02e06;
                    }
                    .price {
                      font-size: 24 / @rem * 1rem;
                      font-weight: bold;
                      color: #f02e06;
                    }
                    .redfont {
                      font-size: 20 / @rem * 1rem;
                      font-weight: 500;
                      margin-left: 10 / @rem * 1rem;
                      color: #f02e06;
                    }
                  }
                }
              }
            }

            .discount_info_content {
              width: 100%;
              height: 70%;
              padding: 0 20 / @rem * 1rem;
              box-sizing: border-box;
              margin-top: 10 / @rem * 1rem;
              background-color: #ffffff;
              display: flex;
              flex-direction: column;
              .discount_sliderwrapper {
                width: 100%;
                height: 74%;
                display: flex;
                box-sizing: border-box;
                overflow-x: hidden;
                overflow-y: scroll;
                position: relative;
                .discount_slider_container {
                  width: 100%;
                  display: flex;
                  position: absolute;
                  .discount_form {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    // padding: 0 20 / @rem * 1rem;
                    .package_verification {
                      .rightvalue {
                        display: flex;
                        align-items: center;
                        font-size: 24 / @rem * 1rem;
                        cursor: pointer;
                        .verificMoney {
                          color: #f02e06;
                        }
                        .verificStatus {
                          display: flex;
                          align-items: center;
                          span {
                            margin: 0 4px;
                            color: #f02e06;
                            font-size: 20 / @rem * 1rem;
                          }
                        }
                      }
                    }
                    .key_valuebox {
                      width: 100%;
                      height: 70 / @rem * 1rem;
                      border-bottom: 1 / @rem * 1rem solid #f0f0f0;
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      .leftkey {
                        font-size: 22 / @rem * 1rem;
                        font-weight: 500;
                        color: #666666;
                      }
                      .rightvalue {
                        display: flex;
                        align-items: center;
                        .discount_val {
                          font-size: 24 / @rem * 1rem;
                          font-weight: bold;
                          color: #f02e06;
                        }
                        .discount_num {
                          font-size: 20 / @rem * 1rem;
                          font-weight: 500;
                          color: #f02e06;
                          margin-left: 5 / @rem * 1rem;
                        }
                        .merchants_vip_info {
                          font-size: 24 / @rem * 1rem;
                          font-weight: 500;
                          color: #f02e06;
                        }
                        .noselect {
                          width: 26 / @rem * 1rem;
                          height: 26 / @rem * 1rem;
                          border-radius: 50%;
                          border: 1 / @rem * 1rem solid #bbbbbb;
                        }
                        .select_box {
                          width: 26 / @rem * 1rem;
                          height: 26 / @rem * 1rem;
                          margin-left: 15 / @rem * 1rem;
                          display: flex;
                          img {
                            width: 100%;
                            height: 100%;
                          }
                        }
                        .haveicon {
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          cursor: pointer;
                          .copupon {
                            font-size: 24 / @rem * 1rem;
                            font-weight: 500;
                            color: #ababab;
                          }
                          .gorighticon {
                            width: 25 / @rem * 1rem;
                            height: 25 / @rem * 1rem;
                            display: flex;
                            img {
                              width: 100%;
                              height: 100%;
                            }
                          }
                        }

                        .deduction_info {
                          font-size: 24 / @rem * 1rem;
                          font-weight: 500;
                          color: #343434;
                          .redfont {
                            color: #f02e06;
                          }
                          .rmb {
                            font-size: 21 / @rem * 1rem;
                            color: #f02e06;
                          }
                          .reduce {
                            color: #f02e06;
                            font-size: 24 / @rem * 1rem;
                          }
                        }

                        .priceInfo {
                          .rmb {
                            font-size: 22 / @rem * 1rem;
                            font-weight: bold;
                            color: #f02e06;
                          }
                          .price {
                            font-size: 24 / @rem * 1rem;
                            font-weight: bold;
                            color: #f02e06;
                          }
                          .redfont {
                            font-size: 20 / @rem * 1rem;
                            font-weight: 500;
                            margin-left: 10 / @rem * 1rem;
                            color: #f02e06;
                          }
                        }
                      }
                    }

                    .disc_list_wrapper {
                      display: flex;
                      flex-direction: column;
                      width: 100%;
                      .key_valuebox {
                        .leftkey {
                          display: flex;
                          align-items: center;
                          .reducediv {
                            width: 24 / @rem * 1rem;
                            height: 24 / @rem * 1rem;
                            font-size: 20 / @rem * 1rem;
                            border-radius: 4 / @rem * 1rem;
                            background-color: #ff865f;
                            color: #ffffff;
                            line-height: 24 / @rem * 1rem;
                            text-align: center;
                            border-radius: 5 / @rem * 1rem;
                            margin-right: 10 / @rem * 1rem;
                          }
                        }
                        .rightvalue {
                          .moneyinfo {
                            font-size: 20 / @rem * 1rem;
                            color: #f02e06;
                          }
                        }
                      }
                    }
                    .internalCard_box{
                      .key_valuebox{
                        .leftkey{
                          // flex: 1;
                          .num{
                            color: #f02e06;
                            font-size: 20 / @rem * 1rem;
                            text-align: center;
                          }
                        }
                      }
                    }
                  }
                }
              }
              .discount_sliderwrapper::-webkit-scrollbar {
                width: 0;
              }
              .bottom_vip_info {
                width: 100%;
                height: 26%;
                display: flex;
                align-items: center;
                .vip_card_number {
                  flex: 1;
                  display: flex;
                  flex-direction: column;
                  text-align: center;
                  .texttips {
                    font-size: 22 / @rem * 1rem;
                    font-weight: 500;
                    color: #666666;
                  }
                  .vip_card_number_info {
                    font-size: 20 / @rem * 1rem;
                    font-weight: 500;
                    color: #333333;
                    line-height: 34 / @rem * 1rem;
                    span {
                      font-size: 16 / @rem * 1rem;
                      color: #f02e06;
                    }
                  }
                }
                .current_balance {
                  flex: 1;
                  display: flex;
                  align-items: center;
                  flex-direction: column;
                  position: relative;
                  margin-left: 30 / @rem * 1rem;
                  .texttips {
                    font-size: 22 / @rem * 1rem;
                    font-weight: 500;
                    color: #666666;
                  }
                  .balance_info {
                    font-size: 20 / @rem * 1rem;
                    font-weight: bold;
                    color: #ef2e05;
                    line-height: 34 / @rem * 1rem;
                    span {
                      font-size: 21 / @rem * 1rem;
                    }
                  }
                }
                .current_balance::after {
                  position: absolute;
                  content: '';
                  display: block;
                  height: 50 / @rem * 1rem;
                  border-left: 1 / @rem * 1rem solid #d4d9dc;
                  left: 0;
                  top: 0;
                }
                .current_balance::before {
                  position: absolute;
                  content: '';
                  display: block;
                  height: 50 / @rem * 1rem;
                  border-left: 1 / @rem * 1rem solid #d4d9dc;
                  right: 0;
                  top: 0;
                }

                // 一卡通
                .internal_card{
                  min-width: 130 / @rem * 1rem;
                  flex: unset;
                  margin-right: 30 / @rem * 1rem;
                  position: relative;
                  padding: 0 30 / @rem * 1rem 0 0;
                  &::after{
                    position: absolute;
                    content: '';
                    display: block;
                    height: 50 / @rem * 1rem;
                    border-right: 1 / @rem * 1rem solid #d4d9dc;
                    right: 0;
                    top: 2px;
                  }
                }

                .available_amount {
                  margin-left: 30 / @rem * 1rem;
                  display: flex;
                  flex-direction: column;
                  flex: 1;
                  text-align: center;
                  .texttips {
                    font-size: 22 / @rem * 1rem;
                    font-weight: 500;
                    color: #666666;
                  }
                  .amount_info {
                    font-size: 20 / @rem * 1rem;
                    font-weight: bold;
                    color: #ef2e05;
                    line-height: 34 / @rem * 1rem;
                    .rmb {
                      font-size: 22 / @rem * 1rem;
                      font-weight: bold;
                      color: #ef2e05;
                    }
                    .modify {
                      font-size: 16 / @rem * 1rem;
                      font-weight: 500;
                      color: #ef2e05;
                    }
                  }
                }
                .novip {
                  font-size: 20 / @rem * 1rem;
                  font-weight: 500;
                  color: #666666;
                }
              }
            }
          }

          .discounts_page_container {
            width: 100%;
            height: 100%;
            background-color: #ffffff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            .toporder_info {
              width: 100%;
              height: 9%;
              display: flex;
              align-items: center;
              justify-content: space-between;
              background: #e7eaed;
              box-sizing: border-box;
              padding: 0 30 / @rem * 1rem;
              .baclbtn {
                display: flex;
                align-items: center;
                cursor: pointer;
                img {
                  width: 9 / @rem * 1rem;
                  height: 16 / @rem * 1rem;
                  margin-right: 10 / @rem * 1rem;
                }
                .bktext {
                  font-size: 18 / @rem * 1rem;
                  color: #666666;
                  font-weight: 500;
                }
              }
              .ordertitle {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24 / @rem * 1rem;
                font-weight: bold;
                color: #666666;
              }
              .emptybox {
                width: 55 / @rem * 1rem;
              }
            }

            .slider_discounts_list {
              width: 100%;
              height: 76%;
              overflow-x: scroll;
              position: relative;
              .discounts_content {
                position: absolute;
                display: flex;
                align-items: center;
                flex-direction: column;
                width: 100%;
                .discountList_box {
                  width: 100%;
                  padding: 30 / @rem * 1rem;
                  display: flex;
                  align-items: center;
                  flex-direction: column;
                  .discount_items {
                    width: 660 / @rem * 1rem;
                    height: 150 / @rem * 1rem;
                    display: flex;
                    align-items: center;
                    margin-bottom: 15 / @rem * 1rem;
                    background: url(../../../../../../assets/storestaff/discounts.png) no-repeat;
                    background-size: 100% 100%;
                    .leftvalueinfo {
                      display: flex;
                      width: 190 / @rem * 1rem;
                      height: 60 / @rem * 1rem;
                      margin-bottom: 15 / @rem * 1rem;
                      align-items: flex-end;
                      justify-content: center;
                      font-weight: bold;
                      color: #ffffff;
                      .currency {
                        font-size: 26 / @rem * 1rem;
                        line-height: 30 / @rem * 1rem;
                      }
                      div:nth-child(2) {
                        line-height: 55 / @rem * 1rem;
                        font-size: 60 / @rem * 1rem;
                      }
                      div:last-child {
                        font-size: 33 / @rem * 1rem;
                        line-height: 33 / @rem * 1rem;
                      }
                    }
                    .right_coupon {
                      width: 470 / @rem * 1rem;
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      box-sizing: border-box;
                      padding: 0 35 / @rem * 1rem;
                      .couponinfo {
                        .coupontitle {
                          font-size: 28 / @rem * 1rem;
                          font-weight: bold;
                          color: #333333;
                        }
                        .coupontime {
                          font-size: 22 / @rem * 1rem;
                          font-weight: 500;
                          color: #878787;
                          margin-top: 20 / @rem * 1rem;
                        }
                      }
                      .right_selectedbox {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        .selected {
                          width: 40 / @rem * 1rem;
                          height: 40 / @rem * 1rem;
                          display: flex;
                          align-items: center;
                          overflow: hidden;
                          img {
                            width: 100%;
                            height: 100%;
                          }
                          .noselect {
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                            border: 1 / @rem * 1rem solid #d5d5d5;
                          }
                        }
                      }
                    }
                  }
                }
              }
              .emptydisc {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                img {
                  width: 253 / @rem * 1rem;
                  height: 194 / @rem * 1rem;
                }
                .texttips {
                  font-size: 20 / @rem * 1rem;
                  font-weight: 500;
                  color: #6a6a6a;
                  margin-top: 30 / @rem * 1rem;
                }
              }
            }

            .slider_discounts_list::-webkit-scrollbar {
              width: 0;
            }

            .nodiscounts {
              width: 100%;
              height: 15%;
              display: flex;
              align-items: center;
              justify-content: center;
              .noselect_btn {
                width: 658 / @rem * 1rem;
                height: 70 / @rem * 1rem;
                line-height: 70 / @rem * 1rem;
                background: #3bcfb6;
                border-radius: 10 / @rem * 1rem;
                text-align: center;
                font-size: 24 / @rem * 1rem;
                font-weight: bold;
                color: #ffffff;
              }
            }
          }
        }

        .right_btn_content {
          width: 260 / @rem * 1rem;
          height: 100%;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: space-between;
          .needpay_info {
            width: 100%;
            box-sizing: border-box;
            padding: 0 16 / @rem * 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            .border_box {
              width: 100%;
              height: 200 / @rem * 1rem;
              border-bottom: 1 / @rem * 1rem solid #f1f1f1;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              .texttips {
                font-size: 24 / @rem * 1rem;
                font-weight: 500;
                color: #666666;
              }
              .price_info {
                font-size: 36 / @rem * 1rem;
                font-weight: 800;
                color: #f02e06;
                span {
                  font-size: 33 / @rem * 1rem;
                }
              }
            }

            .btn_content {
              margin-top: 50 / @rem * 1rem;
              display: flex;
              flex-direction: column;
              align-items: center;
              .border_btnstyle {
                cursor: pointer;
                width: 210 / @rem * 1rem;
                height: 95 / @rem * 1rem;
                border-radius: 10 / @rem * 1rem;
                border: solid 4 / @rem * 1rem transparent;
                display: flex;
                justify-content: center;
                .btnstyle {
                  width: 190 / @rem * 1rem;
                  height: 70 / @rem * 1rem;
                  background-color: transparent;
                  border-radius: 10 / @rem * 1rem;
                  box-shadow: 0 / @rem * 1rem 5 / @rem * 1rem 2 / @rem * 1rem 0 / @rem * 1rem transparent;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-top: 6 / @rem * 1rem;
                  .iconbox {
                    margin-right: 6 / @rem * 1rem;
                    display: flex;
                    img {
                      width: 100%;
                      height: 100%;
                    }
                  }
                  .btn_text {
                    font-size: 20 / @rem * 1rem;
                    font-weight: bold;
                    color: #ffffff;
                  }
                }
              }

              .offlinePay_btn {
                .btnstyle {
                  background-color: #fb7392;
                  box-shadow: 0 / @rem * 1rem 5 / @rem * 1rem 2 / @rem * 1rem 0 / @rem * 1rem #e15a79;
                  .iconbox {
                    width: 30 / @rem * 1rem;
                    height: 30 / @rem * 1rem;
                  }
                }
              }
              .offlinebordershow {
                border: solid 4 / @rem * 1rem #fb7392;
              }

              .onlinePay_btn {
                .btnstyle {
                  background-color: #5478f2;
                  box-shadow: 0 / @rem * 1rem 5 / @rem * 1rem 2 / @rem * 1rem 0 / @rem * 1rem #3960e4;
                  .iconbox {
                    width: 43 / @rem * 1rem;
                    height: 32 / @rem * 1rem;
                  }
                }
              }
              .onlineshow {
                border: solid 4 / @rem * 1rem #5478f2;
              }

              .platformPay_btn {
                .btnstyle {
                  background-color: #ffae00;
                  box-shadow: 0 / @rem * 1rem 5 / @rem * 1rem 2 / @rem * 1rem 0 / @rem * 1rem #d69405;
                  .iconbox {
                    width: 28 / @rem * 1rem;
                    height: 30 / @rem * 1rem;
                  }
                }
              }
              .platformshow {
                border: solid 4 / @rem * 1rem #ffae00;
              }
            }
          }

          .bbiigg_cfmbtn {
            width: 261 / @rem * 1rem;
            height: 160 / @rem * 1rem;
            line-height: 160 / @rem * 1rem;
            font-size: 30 / @rem * 1rem;
            font-weight: bold;
            color: #ffffff;
            text-align: center;
            background: #ff6e60;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
