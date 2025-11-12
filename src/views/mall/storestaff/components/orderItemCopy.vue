<template>
  <div class="order-item-wrap">
    <a-row type="flex" justify="space-between" class="order-item-header">
        <a-col :span="20" style="padding-top: 5px;">
            <div class="text-wrap">
                <span class="mr-30">订单编号：{{ order.order_no }}</span>
                <span class="mr-30">下单时间：{{ order.create_time }}</span>
                <span class="mr-30">订单类型：{{ order.order_type_txt }}</span>
            </div>
            <div class="text-wrap" style="margin-top: 10px;" v-if="order.status != 0">
                <span class="mr-30">付款方式：{{ order.pay_type }}</span>
                <span v-if="order.verify_text">核销方式：{{ order.verify_text }}</span>
            </div>
        </a-col>
        <a-col :span="3" style="display: flex;flex-direction: column;align-items: center;padding-left: 30px;">
            <a-button type="link" @click="orderPrintTicket" :disabled="btnDisabled && currentBtn.props == 'order_print_ticket'">补打小票</a-button>
            <a-button type="link" @click="orderDetail"> 查看详情</a-button>
        </a-col>
    </a-row>
    <a-row type="flex" justify="space-between" class="order-item-content">
      <a-col :span="10">
        <div v-if="order.order_type=='periodic'" class="goods-wrap">
          <div v-for="(goodsItem, goodsIndex) in goods" :key="goodsIndex" class="goods-item">
            <a-row
              type="flex"
              justify="space-between"
              align="middle"
              class="pt-20 pb-20 order-item-content-goods"
            >
              <a-col :span="9" v-if=" order.periodic_info && order.periodic_info.length">
                <div class="flex align-center">
                  <a-avatar shape="square" :size="64" :src="goodsItem.image"/>
                  <div class="flex flex-column pl-10 pr-10 flex-1 sx-hidden">
                    <span class="goods-name flex-1">{{ goodsItem.goods_name }}</span>
                    <span v-show="goodsItem.sku_info">{{ goodsItem.sku_info }}</span>
                  </div>
                </div>
              </a-col>
              <a-col :span="12" v-else>
                <div class="flex align-center">
                  <a-avatar shape="square" :size="64" :src="goodsItem.image"/>
                  <div class="flex flex-column pl-10 pr-10 flex-1 sx-hidden">
                    <span class="goods-name flex-1">{{ goodsItem.goods_name }}</span>
                    <span v-show="goodsItem.sku_info">{{ goodsItem.sku_info }}</span>
                  </div>
                </div>
              </a-col>
              <a-col :span="6" class="text-center">{{ currency }}{{ goodsItem.price }}</a-col>
              <a-col :span="6" class="text-center goods-num" v-if=" order.periodic_info && order.periodic_info.length">
                <span>共{{ order.periodic_info[0].periodic_count }}期</span>
                <a-divider type="vertical"></a-divider>
                <span>共{{ order.periodic_info[0].periodic_count * order.total_num }}件</span>
              </a-col>
              <a-col :span="6" class="text-center goods-num" v-else-if="order.status >=60 && order.status<80">
                {{goodsItem.num}}
              </a-col>
              <a-col :span="6" v-else>
                <a-row>
                  <span>共{{ order.periodic_num }}期</span>
                  <a-divider type="vertical"></a-divider>
                  <span>共{{ order.periodic_num * order.total_num }}件</span>
                </a-row>
                <a-row>
                  暂未到下期发货时间
                </a-row>
              </a-col>
              <a-col :span="3" class="text-center goods-num" @click="changeIcon">
                <a-icon :type="icon_type" :hidden="!order.periodic_info || (order.periodic_info && !order.periodic_info.length)"/>
              </a-col>
            </a-row>
          </div>
          <div v-if="order.periodic_info.length && icon_type=='down-circle'"
               v-for="(periodicItem, periodicIndex) in order.periodic_info" :key="periodicItem.purchase_order_id" class="goods-item">
            <a-row
              type="flex"
              justify="space-between"
              align="middle"
              class="pt-20 pb-20 order-item-content-goods_periodic"
            >
              <a-col :span="6">
                <a-tag color="#f50">第{{periodicItem.current_periodic}}期</a-tag>
              </a-col>
              <a-col :span="3">
                <span>数量X{{order.total_num}}</span>
              </a-col>
              <a-col :span="10">
                <span>{{periodicItem.is_complete_txt}}</span>
                <a-divider type="vertical"></a-divider>
                <span>期望送达时间：{{periodicItem.periodic_date}}</span>
              </a-col>
              <a-col :span="5">
                <div class="content-item">
                  <span v-for="item in periodicBtnListArr[periodicIndex]" :key="item.props">
                    <a-button type="link" v-if="item.show == 1" @click="btnOpt(item,periodicItem)"
                              :style="{ color: item.color }">
                      {{ item.label }}
                    </a-button>
                  </span>
                </div>
              </a-col>
            </a-row>
          </div>
        </div>
        <div v-else class="goods-wrap">
          <div v-for="(goodsItem, goodsIndex) in goods" :key="goodsIndex" class="goods-item" v-show="goodsItem.show">
            <a-row
              type="flex"
              justify="space-between"
              align="middle"
              class="pt-20 pb-20 order-item-content-goods"
              :class="(goodsIndex != 1 && fold && goods.length > 1) || (goodsIndex != goods.length - 1 && !fold) ? 'border-bottom': ''">
              <a-col :span="12">
                <div class="flex align-center">
                  <a-avatar shape="square" :size="64" :src="goodsItem.image"/>
                  <div class="flex flex-column pl-10 pr-10 flex-1 sx-hidden">
                    <span class="goods-name flex-1">{{ goodsItem.goods_name }}</span>
                    <span v-show="goodsItem.sku_info">{{ goodsItem.sku_info }}</span>
                    <span v-if="goodsItem.is_gift==1">
                      <a-tag color="#108ee9">赠品</a-tag>
                    </span>
                    <span v-if="goodsItem.refund_desc">
                      <a-tag v-for="(refund_desc,descIndex) in goodsItem.refund_desc" :key="descIndex" color="red">{{refund_desc}}</a-tag>
                    </span>
                  </div>
                </div>
              </a-col>
              <a-col :span="6" class="text-center">{{ currency }}{{ goodsItem.price }}</a-col>
              <a-col :span="6" class="text-center goods-num" style="display: flex;flex-direction: column;">
                <span>{{ goodsItem.num }}</span>
                <span v-show="goods.length > 2 && goodsIndex == 1 && fold" class="fold-btn">
                  <a-button key="unfold" @click="foldMenu('unfold')" type="link"> 展开<a-icon type="down"/> </a-button>
                </span>
                <span v-show="goodsIndex == goods.length - 1 && !fold" class="fold-btn">
                  <a-button key="fold" @click="foldMenu('fold')" type="link"> 收起<a-icon type="up"/> </a-button>
                </span>
              </a-col>
            </a-row>
          </div>
        </div>
      </a-col>
      <a-col :span="14">
        <a-row type="flex" justify="space-between" class="height-inherit">
          <a-col :span="4">
            <div class="content-item text-wrap" style="height: 50%;">
              <span>{{ order.username }}</span>
              <span>{{ order.phone }}</span>
              
            </div>
            <div class="content-item text-wrap" style="height: 50%;border-top: 1px solid #e8e8e8;">
                {{ order.store_name }}
              </div>
          </a-col>
          <a-col :span="4">
            <div class="content-item">
              <span>{{ order.address }}</span>
            </div>
          </a-col>
          <a-col :span="4">
            <div class="content-item">
              <span v-if="order.periodic_count && order.order_type == 'periodic'">
                <span> 共计 {{ order.periodic_count }} 期 </span>
                <span v-if="order.refund_count_periodic">
                  退款
                  <span class="cr-red">
                    {{ order.refund_count_periodic }}
                  </span>
                  期
                </span>
              </span>
              <span>商品总价：{{ currency }}{{ order.money_total }}</span>
              <span v-if="order.discount_total" class="popover">
                <a-popover
                  v-model="discountTotalVisible"
                  title=""
                  trigger="click"
                  :getPopupContainer="
                    triggerNode => {
                      return triggerNode.parentNode;
                    }
                  ">
                  <span slot="content">
                    <a-list item-layout="horizontal" :data-source="discountList">
                      <a-list-item
                        slot="renderItem"
                        slot-scope="item"
                        v-if="item.value && item.value != 0"
                        class="flex"
                      >
                        <a-badge :color="'red'" :text="`${item.label}：-${currency}${item.value}`"> </a-badge>
                      </a-list-item>
                    </a-list>
                  </span>
                  <span
                    @click="discountTotalVisible = !discountTotalVisible"
                    class="pointer"
                    v-if="order.discount_total && order.discount_total != 0">
                    总优惠
                    <a-icon type="exclamation-circle"/>
                    ：
                    <span>-{{ currency }}{{ order.discount_total }}</span>
                  </span>
                </a-popover>
              </span>
              <span v-if="order.money_freight && order.money_freight != 0">
                运费：+{{ currency }}{{ order.money_freight }}
              </span>
              <span v-if="order.bargain_price && order.bargain_price != 0 && order.order_type == 'prepare'">
                定金{{ currency }}{{ order.bargain_price }}
                <span v-if="order.deduct_price && order.deduct_price != 0">
                  抵{{ currency }}{{ order.deduct_price }}
                </span>
              </span>
              <span
                class="cr-red"
                v-if="order.status &&order.bargain_price && order.bargain_price != 0 && order.order_type == 'prepare'"
              >
                已支付定金：{{ currency }}{{ order.real_bargain_price }}
              </span>
              <span class="fw-bold popconfirm">
                <span class="cr-black" v-if="order.status==0">待付款：<span class="cr-red">{{ currency }}{{ order.real_bargain_price }}</span></span>
                <span class="cr-black" v-if="order.status==1">尾款待付款：<span class="cr-red">{{ currency }}{{ order.rest_price }}</span></span>
                <span class="cr-black" v-if="order.status>=10">实付款：<span class="cr-red">{{ currency }}{{ order.money_real }}</span></span>

                <a-popconfirm
                  ok-text="确认"
                  cancel-text="取消"
                  :visible="moneyRealVisible"
                  @confirm="clerkDiscountConfoirm"
                  @cancel=";(after_money = ''), (moneyRealVisible = false)"
                  :getPopupContainer="
                    triggerNode => {
                      return triggerNode.parentNode;
                    }
                  "
                >
                  <template slot="title">
                    <p>确认修改待付款金额？</p>
                    <p>
                      <a-input-number
                        v-model="after_money"
                        placeholder="请输入"
                        :min="0"
                        style="width: 100%;"
                      ></a-input-number>
                    </p>
                  </template>
                  <a-icon
                    type="form"
                    v-if="order.status == 0 && order.clerk_modify==1"
                    @click="moneyRealVisible = !moneyRealVisible"
                    class="ml-5"
                  />
                </a-popconfirm>
              </span>
              <span
                v-if=" (order.status >= 60 && order.status <80) && ((order.refund_money_periodic && order.refund_money_periodic != 0) ||(order.refund_money && order.refund_money != 0)) && order.is_all == 1 "
                class="cr-red">
                退款金额：{{ currency}}{{ order.order_type == 'periodic' ? order.refund_money_periodic : order.refund_money }}
              </span>
              <span
                v-if=" (order.status >= 60 && order.status <80) && ((order.refund_money_periodic && order.refund_money_periodic != 0) ||(order.refund_money && order.refund_money != 0)) && order.is_all == 0 "
                class="cr-red">
                部分退款金额：{{ currency}}{{ order.order_type == 'periodic' ? order.refund_money_periodic : order.refund_money }}
              </span>
            </div>
          </a-col>
          <a-col :span="4">
            <div class="content-item">
              <span>{{ order.express_style_txt }}</span>
              <span
                v-if="order.express_style == 1 && order.order_type != 'periodic'">期望送达时间：{{ order.current_time }}</span>
            </div>
          </a-col>
          <a-col :span="4">
            <div class="content-item">
              <span>
                <span>{{ order.status_txt || '---' }}</span>
              </span>
              <span v-if="order.express_current_time" class="cr-red">
                {{ moment(order.express_current_time).format('YYYY.MM.DD') }}送达
              </span>
              <span v-if="order.status == 10 && order.send_time && order.order_type=='prepare'" class="cr-red">
                发货时间：{{ moment(order.send_time).format('YYYY.MM.DD') }}
              </span>
            </div>
          </a-col>

          <a-col :span="4">
            <div class="content-item"
                 v-if="isHasBtn || (order.goods_activity_type == 'periodic' && order.status >= 60 && order.status <80)">
              <span v-for="item in btnList" :key="item.props">
                <a-button type="link" v-if="item.show == 1" @click="btnOpt(item)" :style="{ color: item.color }" :disabled="btnDisabled && currentBtn.props == item.props">
                  {{ item.label }}
                </a-button>
              </span>
            </div>
            <div class="content-item" v-else>---</div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row class="clerk_remark" v-if="order.clerk_remark && order.clerk_remark != ''">
        店员备注：{{ order.clerk_remark }}
    </a-row>

    <!-- 弹框 查看物流 快递发货 拒绝退款原因-->
    <!-- 快递发货 -->
    <deliverGoods
      v-if="currentBtn.props == 'express_btn'"
      :visible="deliverGoodsVisible"
      :title="currentBtn.title"
      @handleCancel="deliverGoodsVisible = false,currentBtn = ''"
      :order="order"
      :nowPeriodicItem="nowPeriodicItem"
      :fh_type="1"
      @updateList="updateList"
      pageType="storestaff"
    ></deliverGoods>
    <!-- 查看物流 -->
    <logistics
      v-if="currentBtn.props == 'trajectory_btn' || currentBtn.props == 'logistics_btn'"
      :visible="logisticsVisible"
      :title="currentBtn.title"
      @handleCancel="logisticsVisible = false,currentBtn = ''"
      :order="order"
      :nowPeriodicItem="nowPeriodicItem"
      pageType="storestaff"
    ></logistics>
    <!-- 拒绝退款原因 -->
    <refuseRefundCopy
      v-if="currentBtn.props == 'refuse_refund_btn'"
      :visible="refuseRefundVisible"
      :title="currentBtn.title"
      @handleCancel="refuseRefundVisible = false,currentBtn = ''"
      :order="order"
      :nowPeriodicItem="nowPeriodicItem"
      @updateList="updateList"
    ></refuseRefundCopy>
    <!-- 选择配送方式 -->
    <a-modal
      :title="L('选择配送方式')"
      v-model="choose_delivery_method_visible"
      centered
      width="400px"
      :footer="null"
    >
      <div class="delivery-method">
        <div class="item" @click="deliveryMethodActions('express_delivery')">
          <div><icon-font type="iconkuaidi" /></div>
          <div class="title">{{L('快递发货')}}</div>
        </div>
        <div class="item" @click="deliveryMethodActions('rider_delivery')">
          <div><icon-font type="iconqishou" /></div>
          <div class="title">{{L('骑手配送')}}</div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import moment from 'moment'
  import mallStorestaffApi from '@/api/mall/storestaff/index'
  import deliverGoods from '@/views/mall/modules/deliverGoods'
  import logistics from '@/views/mall/modules/logistics'
  import refuseRefundCopy from '@/views/mall/storestaff/components/refuseRefundCopy'
  import IconFont from '@/utils/icon.js'
  export default {
    props: {
      order: Object,
      tabStatus: [Number, String]
    },
    components: {
        deliverGoods,
      logistics,
      refuseRefundCopy,
      IconFont
    },
    data() {
      return {
        fold: true,
        discountTotalVisible: false, // 优惠弹框显隐
        goods: [],
        discountList: [
          {
            label: '平台优惠券优惠金额',
            value: '',
            props: 'discount_system_coupon'
          },
          {
            label: '商家优惠券优惠金额',
            value: '',
            props: 'discount_merchant_coupon'
          },
          {
            label: '商家会员卡优惠金额',
            value: '',
            props: 'discount_merchant_card'
          },
          {
            label: '平台会员等级优惠金额',
            value: '',
            props: 'discount_system_level'
          },
          {
            label: '店员优惠金额',
            value: '',
            props: 'discount_clerk_money'
          },
          {
            label: '参加活动优惠金额',
            value: '',
            props: 'discount_act_money'
          }
        ],
        // 操作按钮
        btnList: [
          {
            label: '接单',
            props: 'take_btn',
            show: '0',
            action: '',
            tips: '是否确定接单？',
            success: '接单成功',
            api: 'orderTaking',
            color: '#1890ff'
          },
          {
            label: '骑手配送',
            props: 'hoseman_btn',
            show: '0',
            action: '',
            tips: '是否确定骑手配送？',
            success: '订单已转至骑手配送！',
            api: 'deliverGoodsByHouseman',
            color: '#1890ff'
          },
          {
            label: '店员核销',
            props: 'clerk_btn',
            show: '0',
            action: 'confirm',
            tips: '是否确定核销？',
            success: '该订单已核销',
            api: 'staffVerify',
            color: '#1890ff'
          },
          {
            label: '快递发货',
            props: 'express_btn',
            show: '0',
            action: 'modal',
            title: '发货',
            color: '#1890ff'
          },
          {
            label: '查看物流',
            props: 'logistics_btn',
            show: '0',
            action: 'modal',
            title: '查看物流',
            color: '#1890ff'
          },
          {
            label: '顺延配送',
            props: 'postpone_btn',
            show: '0',
            action: 'confirm',
            tips: '是否确定顺延配送？',
            success: '该订单已顺延配送',
            api: 'postponeDelivery',
            color: 'rgb(250, 173, 20)'
          },
          {
            label: '骑手轨迹',
            props: 'trajectory_btn',
            show: '0',
            action: 'modal',
            title: '骑手轨迹',
            color: '#1890ff'
          },
          {
            label: '同意退款',
            props: 'agree_refund_btn',
            show: '0',
            action: 'confirm',
            tips: '是否确定同意退款？',
            success: '同意退款成功',
            api: 'agreeRefund',
            color: '#1890ff'
          },
          {
            label: '拒绝退款',
            props: 'refuse_refund_btn',
            show: '0',
            action: 'modal',
            title: '拒绝退款',
            color: 'rgb(250, 173, 20)'
          },
          {
            label: '选择配送方式',
            props: 'choose_delivery_method',
            show: '0',
            action: 'modal',
            title: '选择配送方式',
            color: '#1890ff'
          },
        ],
        // 当前点击的操作按钮
        currentBtn: '',
        deliverGoodsVisible: false, // 快递发货
        logisticsVisible: false, // 查看物流
        refuseRefundVisible: false, // 拒绝退款
        moneyRealVisible: false, // 实付款修改
        after_money: '', // 实付款修改后的价格
        isHasBtn: 0,
        isHasPeriodicBtn: [],
        periodicBtnListArr: [],
        currency: '￥',
        icon_type: 'right-circle',
        nowPeriodicItem: [],
        btnDisabled: false,
        choose_delivery_method_visible: false,
      }
    },
    watch: {
      order() {
        this.initGoods()
        this.initDiscountList()
        this.initBtnList()
        this.initPeriodicBtnList()
      }
    },
    mounted() {
      this.initGoods()
      this.initDiscountList()
      this.initBtnList()
      this.initPeriodicBtnList()
    },
    methods: {
      moment,
      // 展开收起
      foldMenu(type) {
        if (type == 'unfold') {
          this.fold = false
          this.goods = this.goods.map((item, index) => {
            item.show = true
            return item
          })
        } else {
          this.fold = true
          this.initGoods()
        }
      },
      // 商品
      initGoods() {
        this.goods = this.order && this.order.children ? this.order.children : []
        if (this.goods.length) {
          this.goods = this.goods.map((item, index) => {
            if (index > 1) {
              item.show = false
            } else {
              item.show = true
            }
            return item
          })
        }
      },
      // 优惠
      initDiscountList() {
        this.discountList = this.discountList.map(item => {
          if (this.order) {
            item.value = this.order[item.props]
          }
          return item
        })
      },
      initBtnList() {
        //普通订单的按钮
        this.btnList = this.btnList.map(item => {
          item.show = this.order.button[item.props]
          // 已退款 不显示查看物流
          if ((this.order.status == 70 && (item.props == 'logistics_btn' || item.props == 'trajectory_btn')) || (this.order.status < 60 && this.order.goods_activity_type == 'periodic')) {
            item.show = 0
          }
          return item
        })
        this.isHasBtn = this.btnList.filter(item => item.show == 1).length
      },
      initPeriodicBtnList() {
        //周期购订单的按钮
        if (this.order.periodic_info) {
          for (let i = 0; i < this.order.periodic_info.length; i++) {
            let periodicBtnList = [
              {
                label: '接单',
                props: 'take_btn',
                show: '0',
                action: '',
                tips: '是否确定接单？',
                success: '接单成功',
                api: 'orderTaking',
                color: '#1890ff'
              },
              {
                label: '骑手配送',
                props: 'hoseman_btn',
                show: '0',
                action: '',
                tips: '是否确定骑手配送？',
                success: '订单已转至骑手配送！',
                api: 'deliverGoodsByHouseman',
                color: '#1890ff'
              },
              {
                label: '店员核销',
                props: 'clerk_btn',
                show: '0',
                action: 'confirm',
                tips: '是否确定核销？',
                success: '该订单已核销',
                api: 'staffVerify',
                color: '#1890ff'
              },
              {
                label: '快递发货',
                props: 'express_btn',
                show: '0',
                action: 'modal',
                title: '发货',
                color: '#1890ff'
              },
              {
                label: '查看物流',
                props: 'logistics_btn',
                show: '0',
                action: 'modal',
                title: '查看物流',
                color: '#1890ff'
              },
              {
                label: '顺延配送',
                props: 'postpone_btn',
                show: '0',
                action: 'confirm',
                tips: '是否确定顺延配送？',
                success: '该订单已顺延配送',
                api: 'postponeDelivery',
                color: 'rgb(250, 173, 20)'
              },
              {
                label: '骑手轨迹',
                props: 'trajectory_btn',
                show: '0',
                action: 'modal',
                title: '骑手轨迹',
                color: '#1890ff'
              },
              {
                label: '同意退款',
                props: 'agree_refund_btn',
                show: '0',
                action: 'confirm',
                tips: '是否确定同意退款？',
                success: '同意退款成功',
                api: 'agreeRefund',
                color: '#1890ff'
              },
              {
                label: '拒绝退款',
                props: 'refuse_refund_btn',
                show: '0',
                action: 'modal',
                title: '拒绝退款',
                color: 'rgb(250, 173, 20)'
              }
            ]
            this.periodicBtnListArr[i] = periodicBtnList.map(item => {
              item.show = this.order.periodic_info[i].button[item.props]
              return item
            })
          }
        }
      },
      // 各种操作
      btnOpt(item, periodicItem = {}) {
        this.currentBtn = JSON.parse(JSON.stringify(item))
        let {api = '', success = '', tips = '', action = '', props = ''} = this.currentBtn
        if (!action) {
          if (api) {
            this.btnRequest(this.order, this.currentBtn, periodicItem)
          }
        }
        if (action == 'confirm') {
          this.$confirm({
            title: tips ? tips : '提醒',
            content: '',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
              if (api) {
                this.btnRequest(this.order, this.currentBtn, periodicItem)
              }
            },
            onCancel: () => {
              this.currentBtn = ''
            },
            class: 'test'
          })
        }
        if (action == 'modal') {
          if (props == 'express_btn') {
            this.deliverGoodsVisible = true
          } else if (props == 'trajectory_btn' || props == 'logistics_btn') {
            this.logisticsVisible = true
          } else if (props == 'refuse_refund_btn') {
            this.refuseRefundVisible = true
          }else if (props == 'choose_delivery_method') {
            //选择配送方式
            this.choose_delivery_method_visible = true;
          }
          this.nowPeriodicItem = periodicItem
        }
      }
      ,
      btnRequest(order, currentBtn, periodicItem = []) {
        this.btnDisabled = true
        let {api = '', success = '', tips = '', action = '', props = ''} = this.currentBtn
        let {order_id, refund_id, is_all, order_type, status} = order
        let params = {
          order_id: order_id
        }
        // 顺延配送 || 手动接单 || 同意退款 || 骑手配送
        let periodicIdArr = ['postpone_btn', 'take_btn', 'agree_refund_btn', 'hoseman_btn']
        if (order_type == 'periodic' && periodicIdArr.indexOf(props) != -1) {
          params.periodic_order_id = periodicItem.purchase_order_id
          params.current_periodic = periodicItem.current_periodic
          params.periodic_count = periodicItem.periodic_count
        }
        if (status >= 60 && status < 70 && periodicIdArr.indexOf(props) != -1) {
          params.refund_id = refund_id
          params.is_all = is_all
        }
        
        this.request(mallStorestaffApi[api], params).then(data => {
          this.$message.success(success)
          // 更新订单列表
          this.updateList()
          this.btnDisabled = false
        }).catch(err => {
            this.btnDisabled = false
        })
      },
      // 实付款修改
      clerkDiscountConfoirm() {
        let emptyCheckArr = ['', null, undefined, 'null', 'undefined']
        if (emptyCheckArr.indexOf(this.after_money) != -1) {
          this.$message.error('请输入修改后的金额')
          return
        }
        let params = {
          order_id: this.order.order_id,
          before_money: this.order.money_real,
          after_money: this.after_money
        }
        this.request(mallStorestaffApi.clerkDiscount, params).then(data => {
          this.$message.success('修改成功')
          this.after_money = ''
          this.moneyRealVisible = false
          // 更新单独数据
          this.updateItem(this.order.order_id)
        })
      },
      // 更新订单列表
      updateList() {
        this.$emit('getOrderList')
      },
      // 更新单独数据
      updateItem(order_id) {
        this.$emit('updateItem', {
          order_id
        })
      },
      // 查看详情
      orderDetail() {
        let {order_id = '', periodic_order_id = '', order_type, refund_id = ''} = this.order
        let query = {
          order_id: order_id,
          tabStatus: this.tabStatus
        }
        if (periodic_order_id && order_type == 'periodic') {
          query.periodic_order_id = periodic_order_id
        }
        if (refund_id) {
          query.refund_id = refund_id
        }
        let routeData = this.$router.resolve({path: '/storestaff/storestaff.mall/mall/orderDetailCopy', query})
        window.open(routeData.href, '_blank');
      },
      changeIcon() {
        this.icon_type = this.icon_type == "down-circle" ? "right-circle" : "down-circle"
      },
    //   补打小票
    orderPrintTicket() {
        if(!this.currentBtn) {
            this.currentBtn = {}
        }
        this.$set(this.currentBtn,'props','order_print_ticket')
        
        let params = {
          order_id: this.order.order_id
        }
        this.btnDisabled = true
        this.request(mallStorestaffApi.orderPrintTicket, params).then(data => {
          this.$message.success('打印成功')
          this.btnDisabled = false
        }).catch(() => {
            this.btnDisabled = false
        })
    },
    //选择配送方式
    deliveryMethodActions(type){
      this.$confirm({
        title: type == 'express_delivery'?'确定选择快递发货吗？': '确定选择骑手配送吗？',
        centered: true,
        onOk:()=> {
          let  params = {
            order_id: this.order.order_id,
            express_style: type == 'express_delivery'?2:1,
          }
          this.request(mallStorestaffApi.changeDeliveryType, params).then(res => {
            // 更新单独数据
            this.updateItem(this.order.order_id)
            if(type == 'express_delivery'){
              this.currentBtn = {
                label: '快递发货',
                props: 'express_btn',
                show: '0',
                action: 'modal',
                title: '发货',
                color: '#1890ff'
              }
              this.deliverGoodsVisible = true;
            }else{
            }
            this.choose_delivery_method_visible = false
          })
        },
      });
    },
    }
  }
</script>

<style scoped>
  .order-item-wrap {
    margin-top: 10px;
    width: 100%;
    border: 1px solid #e8e8e8;
    box-sizing: border-box;
    font-weight: normal;
    font-size: 14px;
    line-height: 1.5;
  }

  .order-item-header {
    border-bottom: 1px solid #e8e8e8;
    padding: 8px 0 8px 24px;
    background: #fafafa;
  }

  /* .order-item-content {
        padding: 8px 0;
    } */
  .order-item-content-goods {
    width: 100%;
    height: 100%;
    padding-left: 24px;
    box-sizing: border-box;
  }

  .order-item-content-goods_periodic {
    width: 100%;
    height: 100%;
    padding: 0 0 0 24px;
    box-sizing: border-box;
  }

  .border-bottom {
    border-bottom: 1px solid #e8e8e8;
  }

  .border-left {
    border-left: 1px solid #e8e8e8;
  }

  .goods-name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: keep-all;
  }

  .height-inherit {
    height: 100%;
  }

  .content-item {
    padding: 10px;
    height: 100%;
    border-left: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    box-sizing: border-box;
    white-space: wrap;
    word-break: break-all;
    word-wrap: break-word;
  }

  .content-item span {
    line-height: 26px;
  }

  .goods-num {
    position: relative;
  }

  .fold-btn {
    position: absolute;
    top: 150%;
    right: 8px;
    transform: translate(0, -50%);
  }

  .fold-btn >>> .ant-btn {
    padding: 0;
  }

  .goods-wrap {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .goods-item {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .ml-5 {
    margin-left: 5px;
  }

  .popconfirm >>> .ant-popover-inner-content {
    min-width: 200px;
    box-sizing: border-box;
  }

  .popover >>> .ant-popover-content {
    min-width: 240px;
    box-sizing: border-box;
  }
  .clerk_remark {
    word-break: break-word;
    text-align: left;
    padding: 5px 10px;
    background: #fffaeb;
    color: #f90;
    border-top: 1px solid #e8e8e8;
}
.mr-30 {
    margin-right: 30px;
}
.delivery-method >>> .anticon {
  font-size: 50px;
}
.delivery-method{
  display: flex;
}
.delivery-method .item{
  flex: 1;
  text-align: center;
  cursor: pointer;
}
.delivery-method .item .title{
  border: 1px solid #666;
  color: #666;
  display: inline-block;
  padding: 2px 6px;
  margin-top: 10px;
  border-radius: 4px;
}
</style>
