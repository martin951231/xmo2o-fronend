<template>
  <div class="order-item" v-if="order">
    <div class="order-card b-f1" :class="index == 0 ? '' : 'mt-20'">
      <!-- header -->
      <div
        class="order-header flex justify-between align-center bg-f4 pt-10 pl-10 pr-10 pb-10"
        style="background: #2db7f510"
      >
        <div class="flex-1">
          <span class="cr-primary fw-bold fs-18 mr-10" v-show="order.fetch_number && order.order_from == '4'">{{
            order.fetch_number
          }}</span>
          <span v-if="order.book_time_txt">{{ order.book_time_txt }}</span>
        </div>
        <div>
          <a-tag
            color="red"
            v-if="order.order_status == '3' || order.order_status == '4' || order.order_status == '6'"
            >{{ order.order_status_txt }}</a-tag
          >
          <a-tag color="blue" v-else>{{ order.order_status_txt }}</a-tag>
          <a-tag color="blue">{{ order.order_from_txt }}</a-tag>
        </div>
      </div>
      <!-- content -->
      <div class="mt-10 ml-20 mr-20 mb-10">
        <!-- 订餐人信息 -->
        <div class="bb-f1 flex align-start pt-20 pb-20 lh-30">
          <div class="w-60">
            <a-icon type="user" style="font-size: 16px; color: #999; line-height: 30px; vertical-align: middle" />
          </div>
          <div class="flex-1">
            <span class="cr-black fw-bold mr-10 fs-16">{{ order.name || '--' }}</span>
            <template v-if="order.order_from == '0'">
              <a-icon
                v-if="order.sex == 1"
                key="man"
                class="mr-10"
                style="font-size: 14px; color: #2db7f5"
                type="man"
              />
              <a-icon
                v-if="order.sex == 2"
                key="woman"
                class="mr-10"
                style="font-size: 14px; color: #f50f50"
                type="woman"
              />
            </template>

            <!-- <span v-if="showPhone" key="show-phone" class="cr-primary ml-10 mr-10">{{
              order.phone || '暂无手机号信息'
            }}</span>
            <span v-else key="not-show-phone" class="cr-primary ml-10 mr-10 pointer" @click="checkPhoneNumber"
              >查看手机号</span
            > -->
            <template v-if="order.order_from != 2">
              <!-- 店员端线下开台不需要展示有没有领取会员卡和近多少天多少次下单 -->
              <!-- <span class="ml-10 mr-10 cr-99">·</span> -->
              <span v-if="order.hasMerchantCard == '1'" class="cr-99" key="is-vip">{{ L('已领会员卡') }}</span>
              <span v-else key="no-vip" class="cr-99">{{ L('未领会员卡') }}</span>
              <template v-if="order.order_count">
                <span class="ml-10 mr-10 cr-99">·</span>
                <span class="cr-99">{{ order.order_count }}</span>
              </template>
            </template>
          </div>
        </div>
        <!-- 桌台等信息 -->
        <div class="bb-f1 flex align-start pt-20 pb-20 lh-30">
          <div class="w-60">
            <a-icon type="file-done" style="font-size: 16px; color: #999; line-height: 30px; vertical-align: middle" />
          </div>
          <div class="flex-1">
            <div>
              <span class="mr-10">{{ L('就餐人数') }}：</span>
              <span v-if="order.book_num">{{ L('X1人', { X1: order.book_num }) }} </span>
              <span v-else>--</span>
            </div>
            <div v-if="tableInfo">
              <span class="mr-10">{{ L('就餐桌台') }}：</span>
              <span v-if="order.table_info.table_type_name">{{ order.table_info.table_type_name }}</span>
              <span v-if="order.table_info.table_name">-{{ order.table_info.table_name }}</span>
              <span v-if="!order.table_info.table_type_name && !order.table_info.table_name">--</span>
            </div>
            <div v-if="order.phone">
              <span class="mr-10">{{ L('预约手机号') }}：</span>
              <span>{{ order.phone }}</span>
            </div>
            <div v-if="order.user_phone">
              <span class="mr-10">{{ L('注册手机号') }}：</span>
              <span>{{ order.user_phone }}</span>
            </div>
            <div v-if="order.note">
              <span class="mr-10">{{ L('订单备注') }}：</span>
              <span>{{ order.note }}</span>
            </div>
          </div>
        </div>
        <!-- 菜单信息 -->
        <div class="bb-f1 flex align-start pt-20 pb-20 lh-30">
          <div class="w-60">
            <a-icon type="appstore" style="font-size: 16px; color: #999; line-height: 30px; vertical-align: middle" />
          </div>
          <div class="flex-1">
            <div class="flex justify-between">
              <div class="fw-bold">
                <span class="mr-10">{{ order.goods_num }}</span>
                <span>{{ L('件商品') }}</span>
              </div>
              <div class="pointer cr-blue">
                <div v-if="fold" key="unfold" @click="foldMenu">
                  {{ L('展开') }}
                  <a-icon type="down" />
                </div>
                <div v-else key="fold" @click="foldMenu">
                  {{ L('收起') }}
                  <a-icon type="up" />
                </div>
              </div>
            </div>
            <!-- 商品 -->
            <div v-if="order.goods_detail && order.goods_detail.length && !fold" class="mt-10">
              <div
                v-for="(goodsDetail, detailIndex) of order.goods_detail"
                :key="'goods_detail_' + detailIndex"
                class="b-f1 pl-20 pr-20 pt-20 pb-20 mt-10 br-10"
              >
                <div v-if="goodsDetail.goods_combine && goodsDetail.goods_combine.length">
                  <div
                    v-for="(goodsCombine, combineIndex) of goodsDetail.goods_combine"
                    :key="'goods_combine_' + combineIndex"
                  >
                    <!-- 第几次下单-->
                    <div v-if="order.show_order_num == 1">
                      <a-tag color="green">{{ goodsCombine.number_str }}</a-tag>
                    </div>
                    <!-- 已点 -->
                    <div v-if="goodsCombine.goods && goodsCombine.goods.length">
                      <div v-for="(goods, goodsIndex) of goodsCombine.goods" :key="'goods_' + goodsIndex" class="lh-30">
                        <div class="flex">
                          <div class="flex-1 fw-bold">
                            <a-tag v-if="order.is_staff == '1'" color="purple">{{ L('由服务员加菜') }}</a-tag>
                            <a-tag v-if="order.is_must == '1'" color="orange">{{ L('必点菜') }}</a-tag>
                            {{ goods.name }}
                          </div>
                          <div class="w-100 text-right">x{{ goods.num }}</div>
                          <div class="w-100 text-right">{{ L('￥') }}{{ goods.total_price }}</div>
                        </div>
                        <div v-if="goods.spec" class="ml-10 cr-66 fw-light">{{ L('规格') }}：{{ goods.spec }}</div>
                        <div
                          v-if="goods.sub_list && goods.sub_list.length"
                          class="ml-10 cr-66 fw-light flex flex-start"
                        >
                          <div>{{ goods.is_package_goods ? L('菜品') : L('辅菜') }}：</div>
                          <div class="flex-1">
                            <div
                              v-for="(sub, subIndex) of goods.sub_list"
                              :key="'sub_goods_' + subIndex"
                              class="flex align-center justify-around"
                            >
                              <span class="flex-1">
                                <span>{{ sub.name }}</span>
                                <span v-show="sub.spec">（{{ sub.spec }}）</span>
                              </span>
                              <span class="w-100 text-right">x{{ sub.num }}</span>
                              <span class="w-100 text-right">{{ L('￥') }}{{ sub.price }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- 退菜  -->
                    <div v-if="goodsCombine.refund_goods && goodsCombine.refund_goods.length">
                      <div
                        v-for="(goods, goodsIndex) of goodsCombine.refund_goods"
                        :key="'refund_goods_' + goodsIndex"
                        class="lh-30"
                      >
                        <div class="flex">
                          <div class="flex-1 fw-bold">
                            <a-tag color="red">{{ L('退') }}</a-tag>
                            {{ goods.name }}
                          </div>
                          <div class="w-100 text-right">x{{ goods.num }}</div>
                          <div class="w-100 text-right">{{ L('￥') }}{{ goods.total_price }}</div>
                        </div>
                        <div v-if="goods.spec" class="ml-10 cr-66 fw-light">{{ goods.spec }}</div>
                        <div v-if="goods.spec_sub" class="ml-10 cr-66 fw-light">{{ goods.spec_sub }}</div>
                      </div>
                    </div>
                    <div v-if="goodsCombine.goods_note">{{ L('备注') }}：{{ goodsCombine.goods_note }}</div>
                  </div>
                </div>
                <!-- 小计 -->
                <div v-if="goodsDetail.pay_price && order.show_order_num == 1" class="bt-f1 mt-10 pt-10">
                  <div v-if="goodsDetail.discount_detail && goodsDetail.discount_detail.length">
                    <div
                      v-for="(discount, index) of goodsDetail.discount_detail"
                      :key="'discount_1_' + index"
                      class="flex justify-between align-center"
                    >
                      <div>{{ discount.value }}</div>
                      <div class="cr-red fs-16">-{{ L('￥') }}{{ discount.minus }}</div>
                    </div>
                  </div>
                  <div v-if="goodsDetail.coupon_list && goodsDetail.coupon_list.length">
                    <div
                      v-for="(discount, index) of goodsDetail.coupon_list"
                      :key="'discount_2_' + index"
                      class="flex justify-between align-center"
                    >
                      <div>{{ discount.value }}</div>
                      <div class="cr-redfs-16">-{{ L('￥') }}{{ discount.minus }}</div>
                    </div>
                  </div>
                  <div v-if="goodsDetail.merchant_discount != 0 && goodsDetail.merchant_discount != 10">
                    <div class="flex justify-between align-center">
                      <div>{{ L('会员卡折扣') }}</div>
                      <div class="cr-red fs-16">-{{ L('￥') }}{{ goodsDetail.merchant_discount_money }}</div>
                    </div>
                  </div>
                  <div v-if="goodsDetail.system_score_money != 0 && goodsDetail.system_score_money != 0.0">
                    <div class="flex justify-between align-center">
                      <div>{{ L('积分抵扣金额') }}</div>
                      <div class="cr-red fs-16">-{{ L('￥') }}{{ goodsDetail.system_score_money }}</div>
                    </div>
                  </div>
                  <div v-if="goodsDetail.book_money && goodsDetail.book_money != 0 && goodsDetail.book_money != 0.0">
                    <div class="flex justify-between align-center">
                      <div>{{ L('订金抵扣金额') }}</div>
                      <div class="cr-red fs-16">-{{ L('￥') }}{{ goodsDetail.book_money }}</div>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between align-center">
                      <div>{{ L('支付总额') }}</div>
                      <div class="cr-blue fs-16">{{ L('￥') }}{{ goodsDetail.pay_price }}</div>
                    </div>
                  </div>
                </div>
                <div v-else class="bt-f1 mt-10 pt-10">
                  <div class="text-right">
                    {{ L('合计X1份', { X1: goodsDetail.count }) }}，
                    <span class="cr-red">{{ L('￥') }}{{ goodsDetail.total_price }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 总计 -->
        <div class="flex align-start pt-20 pb-20 lh-30">
          <div class="w-60">
            <a-icon type="pay-circle" style="font-size: 16px; color: #999; line-height: 30px; vertical-align: middle" />
          </div>
          <div class="flex-1 fw-bold">
            <div class="flex justify-between align-center">
              <span>{{ L('商品总额') }}</span>
              <span class="cr-blue fs-18">{{ L('￥') }}{{ order.goods_total_price }}</span>
            </div>
            <div class="flex justify-between align-center" v-if="order.book_price != 0 && order.book_price != 0.0">
              <span>{{ L('订金金额') }}</span>
              <span class="cr-99">
                {{ L('已支付') }}
                <span class="cr-blue fs-18">{{ L('￥') }}{{ order.book_price }}</span>
              </span>
            </div>
            <div class="flex justify-between align-center" v-if="order.pay_price != 0 && order.pay_price != 0.0">
              <span>{{ L('支付总额') }}</span>
              <span class="cr-blue fs-18">{{ L('￥') }}{{ order.pay_price }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- footer -->
      <div class="pl-10 pr-10 pt-10 pb-10 bt-f1">
        <div class="flex justify-between aligin-center">
          <div class="mr-10">
            <div>{{ L('下单时间') }}：{{ order.create_time || '--' }}</div>
            <div>{{ L('订单编号') }}：{{ order.real_orderid || '--' }}</div>
          </div>
          <div class="flex align-center flex-wrap" v-if="!buttons">
            <a-button
              v-if="order.button.cancel_btn == '1'"
              @click="btnClick(CANCEL)"
              class="mr-10 mt-10"
              icon="close-circle"
              >{{ CANCEL.text }}</a-button
            >
            <a-button @click="btnClick(REMARK)" class="mr-10 mt-10" icon="align-center">{{ REMARK.text }}</a-button>
            <a-button
              v-if="order.button.print_btn == '1'"
              @click="btnClick(PRINT)"
              class="mr-10 mt-10"
              icon="printer"
              >{{ PRINT.text }}</a-button
            >
            <a-button
              v-if="order.button.change_goods_btn == '1'"
              @click="btnClick(MENU)"
              class="mr-10 mt-10"
              icon="schedule"
              type="primary"
              >{{ MENU.text }}</a-button
            >

            <a-button
              v-if="order.button.take_btn == '1'"
              @click="btnClick(ACCEPT)"
              class="mr-10 mt-10"
              icon="check-circle"
              type="primary"
              >{{ ACCEPT.text }}</a-button
            >
            <a-button
              v-if="order.button.take_seat_btn == '1'"
              @click="btnClick(CONFIRM)"
              class="mr-10 mt-10"
              icon="shop"
              type="primary"
              >{{ CONFIRM.text }}</a-button
            >
            <a-button
              v-if="order.button.cash_btn == '1'"
              @click="btnClick(SETTLEMENT)"
              class="mr-10 mt-10"
              icon="wallet"
              type="primary"
              >{{ SETTLEMENT.text }}</a-button
            >
            <a-button
              v-if="order.button.clear_btn == '1'"
              @click="btnClick(CLEAR)"
              class="mr-10 mt-10"
              type="primary"
              icon="highlight"
            >
              <!-- <a-icon type="highlight" :rotate="150" />  -->
              {{ CLEAR.text }}</a-button
            >
          </div>
        </div>
      </div>
    </div>
    <a-modal
      v-model="modalVisiable"
      :title="modalTitle"
      @ok="handleOk"
      @cancel="handleCancel"
      centered
      :width="modalWidth"
      destroyOnClose
    >
      <div>
        <div v-if="modalType == REMARK.type">
          <a-textarea v-model="remark" :placeholder="L('请输入备注信息，字数限制5-50个字')" :rows="5" :maxLength="50" />
        </div>
        <div v-if="modalType == CANCEL.type">
          <a-radio-group v-model="cancelReason" @change="onReasonChange">
            <a-radio class="cancel-reason" v-for="item of cancelReasonList" :key="item.key" :value="item.key">{{
              item.value
            }}</a-radio>
          </a-radio-group>
        </div>
        <div v-if="modalType == PRINT.type" class="print">
          <a-checkbox-group
            v-model="checkedList"
            :options="plainOptions"
            @change="onPrintTypeChange"
          ></a-checkbox-group>
          <br />
          <div class="mt-20 pt-10 bt-f1">
            <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onPrintCheckAllChange">{{
              L('全选')
            }}</a-checkbox>
          </div>
        </div>
        <div v-if="modalType == CONFIRM.type"><change-seats @changeSeat="changeSeatSuccess" :showTitle="false" /></div>
        <!-- 修改就餐人数 -->
        <div v-if="modalType == 'change_num'">
          <span class="mr-20">{{ L('请输入就餐人数') }}：</span>
          <a-input-number style="width: 200px" v-model="dinnerNum" :min="1" />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { isEmpty, switchLang as L } from '@/utils/util.js'
import ChangeSeats from './changeSeatsModel'
let checkList = []
let checked = ['customer_account', 'menu', 'pre_account', 'bill_account']
export default {
  props: {
    order: Object,
    index: Number,
  },
  components: {
    ChangeSeats,
  },
  data() {
    return {
      // 静态变量 弹框和按钮类型
      REMARK, //备注
      MENU, //点菜
      CANCEL, // 取消订单
      ACCEPT, //接单
      CONFIRM, // 确认到店
      PRINT, // 打印
      SETTLEMENT, // 结算
      CLEAR, // 清台
      // 查看手机号
      showPhone: false,
      // 是否折叠商品信息
      fold: true,
      // 弹框
      modalVisiable: false,
      modalTitle: '',
      modalType: '',
      // 备注内容
      remark: '',
      // 取消订单
      canRefund: 0, // 是否可以退订金
      cancelReasonList: [
        {
          key: 0,
          value: this.L('菜品质量不满意'),
        },
        {
          key: 1,
          value: this.L('餐厅服务不好'),
        },
        {
          key: 2,
          value: this.L('和客人协商后撤单'),
        },
        {
          key: 3,
          value: this.L('餐厅无法满足要求'),
        },
        {
          key: 4,
          value: this.L('其他'),
        },
      ],
      cancelReason: '',
      cancelReasonTxt: '',
      // 打印
      indeterminate: false,
      checkAll: true,
      checkedList: checked,
      plainOptions: checkList,
      modalWidth: 500,
      showFooter: true,
      // 换桌台
      tableId: '',
      // 就餐人数
      dinnerNum: 1,
    }
  },
  computed: {
    tableInfo() {
      if (this.order) {
        return isEmpty(this.order.tableInfo)
      } else {
        return false
      }
    },
    buttons() {
      if (this.order) {
        return isEmpty(this.order.button)
      } else {
        return false
      }
    },
  },
  watch: {
    order() {
      this.orderChange()
    },
  },
  created() {
    this.plainOptions = [
      { label: this.L('打印客看单'), value: 'customer_account' },
      { label: this.L('打印后厨单'), value: 'menu' },
      { label: this.L('打印预结单'), value: 'pre_account' },
      { label: this.L('打印结账单'), value: 'bill_account' },
    ]
  },
  mounted() {
    this.orderChange()
  },
  methods: {
    orderChange() {
      const { order, plainOptions } = this
      this.remark = order.note
      if (order.book_num) {
        this.dinnerNum = order.book_num
      }
    },
    checkPhoneNumber() {
      this.showPhone = true
    },
    foldMenu() {
      this.fold = !this.fold
    },
    // 底部操作按钮点击
    btnClick(TYPE) {
      console.log(TYPE)
      if (TYPE.action == 'route') {
        this.$store.commit('changeOrder', this.order.order_id)
        if (this.order.table_id) {
          this.$store.commit('changeTable', this.order.table_id)
        }
        console.log(this.order)
        if (TYPE == MENU && this.order.order_status == 3) {
          if (this.order.order_from == 4) {
            this.$router.push({
              path: TYPE.path,
              query: { orderId: this.order.order_id, formState: 'addfood', otherpage: 0 },
            })
          } else {
            this.$router.push({ path: TYPE.path, query: { orderId: this.order.order_id, formState: 'addfood' } })
          }
        } else {
          if (this.order.order_from == 4) {
            this.$router.push({ path: TYPE.path, query: { orderId: this.order.order_id, otherpage: 0 } })
          } else {
            this.$router.push({ path: TYPE.path, query: { orderId: this.order.order_id } })
          }
        }
      }
      if (TYPE.action == 'modal') {
        this.modalVisiable = true
        this.modalType = TYPE.type
        this.modalTitle = TYPE.title
        if (TYPE == CONFIRM) {
          this.modalWidth = '60%'
          this.showFooter = false
        } else {
          this.modalWidth = 500
          this.showFooter = true
          if (TYPE == PRINT) {
            if (this.order.is_self_take) {
              checkList = [{ label: this.L('打印结账单'), value: 'bill_account' }]
              checked = ['bill_account']
            } else if (this.order.order_from == '5') {
              checkList = [
                { label: this.L('打印后厨单'), value: 'menu' },
                { label: this.L('打印结账单'), value: 'bill_account' },
              ]
              checked = ['menu', 'bill_account']
            } else {
              checkList = [
                { label: this.L('打印客看单'), value: 'customer_account' },
                { label: this.L('打印后厨单'), value: 'menu' },
                { label: this.L('打印预结单'), value: 'pre_account' },
                { label: this.L('打印结账单'), value: 'bill_account' },
              ]
              checked = ['customer_account', 'menu', 'pre_account', 'bill_account']
            }
            this.checkedList = checked
            this.plainOptions = checkList
          }
        }
      }
      if (TYPE.action == 'confirm') {
        if (TYPE == CANCEL) {
          this.getCancelInfo()
        }
        if (TYPE == ACCEPT) {
          this.changeOrderStatus(TYPE)
        }
        if (TYPE == CLEAR) {
          this.clearTable()
        }
      }
    },
    // 关闭弹层-确认
    handleOk() {
      switch (this.modalType) {
        case REMARK.type:
          this.addNotes()
          break
        case CANCEL.type:
          this.changeCancelReason()
          break
        case CONFIRM.type:
          this.changeDinnerNum()
          break
        case 'change_num':
          if (this.dinnerNum) {
            this.changeOrderStatus(CONFIRM)
          } else {
            this.$message.warning(this.L('请输入就餐人数'))
          }
          break
        case PRINT.type:
          this.printOrder()
          break
        default:
          this.handleCancel()
          // this.refreshList()
          break
      }
    },
    // 关闭弹层-取消
    handleCancel() {
      if (this.modalType == CANCEL.type) {
        this.refreshList()
      }
      this.modalVisiable = false
      this.modalType = ''
      this.modalTitle = ''
      this.tableId = 0
      this.checkAll = true
      this.indeterminate = false
      this.checkedList = checked
    },
    // 更新列表
    refreshList() {
      this.$emit('change', { type: 'refresh' })
    },
    // 添加备注
    addNotes() {
      const params = {
        order_id: this.order.order_id,
        type: 1,
        note: this.remark,
      }
      this.request('/foodshop/storestaff.order/editNote', params).then((res) => {
        this.$message.success(res.msg || this.L('添加备注成功'))
        this.handleCancel()
        this.refreshList()
      })
    },
    // 取消订单
    getCancelInfo() {
      this.request('/foodshop/storestaff.order/checkBookMoneyRefund', { order_id: this.order.order_id }).then((res) => {
        this.canRefund = res.can_refund
        const modal = this.$confirm({
          title: this.L('确认取消订单') + '？',
          content: CANCEL.tips,
          centered: true,
          onOk: () => {
            this.request('/foodshop/storestaff.order/cancelOrder', {
              order_id: this.order.order_id,
              can_refund: res.can_refund,
            }).then((data) => {
              this.$message.success(data.msg || this.L('订单取消成功'))
              modal.destroy()
              this.modalVisiable = true
              this.modalType = CANCEL.type
              this.modalTitle = CANCEL.title
            })
          },
        })
      })
    },
    onReasonChange(value) {
      this.cancelReasonTxt = this.cancelReasonList[this.cancelReason].value
    },
    changeCancelReason() {
      if (this.cancelReasonTxt) {
        this.request('/foodshop/storestaff.order/editCancelReason', {
          order_id: this.order.order_id,
          cancel_reason: this.cancelReasonTxt,
        }).then((res) => {
          this.handleCancel()
          this.$message.success(res.msg || this.L('修改取消订单原因成功'))
          this.refreshList()
        })
      } else {
        this.handleCancel()
        this.refreshList()
      }
    },
    // 清台
    clearTable() {
      const modal = this.$confirm({
        title: CLEAR.tips,
        centered: true,
        onOk: () => {
          this.request('/foodshop/storestaff.order/completeOrder', {
            order_id: this.order.order_id,
          }).then((data) => {
            this.$message.success(data.msg || this.L('清台成功'))
            modal.destroy()
            this.handleCancel()
            this.refreshList()
          })
        },
      })
    },
    //  修改订单状态
    changeOrderStatus(TYPE) {
      let params = { order_id: this.order.order_id }
      if (TYPE == ACCEPT) {
        // 接单
        params.status = 4
        this.request('/foodshop/storestaff.order/editOrderStatus', params).then((res) => {
          this.$message.success(res.msg || this.L('操作成功'))
          this.refreshList()
        })
      } else if (TYPE == CONFIRM) {
        this.request('/foodshop/storestaff.order/changePeopleNum', {
          order_id: this.order.order_id,
          number: this.dinnerNum,
        }).then((res) => {
          // 确认到店
          params.status = 21
          params.table_id = this.tableId
          this.request('/foodshop/storestaff.order/editOrderStatus', params).then((res) => {
            this.tableId = 0
            this.$message.success(res.msg || this.L('操作成功'))
            this.refreshList()
          })
        })
      }
    },
    // 更换桌台
    changeSeatSuccess(e) {
      this.tableId = e.tableId
    },
    changeDinnerNum() {
      if (this.tableId) {
        this.modalWidth = 500
        this.modalType = 'change_num'
        this.modalTitle = this.L('就餐人数')
      } else {
        this.$message.warning(this.L('请先选择桌台！'))
      }
    },
    // 打印订单
    onPrintTypeChange(checkedList) {
      this.indeterminate = !!checkedList.length && checkedList.length < this.plainOptions.length
      this.checkAll = checkedList.length === this.plainOptions.length
    },
    onPrintCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked ? checked : [],
        indeterminate: false,
        checkAll: e.target.checked,
      })
    },
    printOrder() {
      if (this.checkedList.length) {
        this.request('/foodshop/storestaff.print/printOrder', {
          order_id: this.order.order_id,
          type: this.checkedList,
        }).then((res) => {
          this.handleCancel()
          this.$message.success(res.msg || this.L('打印成功'))
        })
      } else {
        this.$message.warning(this.L('请选择打印类型'))
      }
    },
  },
}
const REMARK = {
  type: 'remark',
  title: L('添加备注信息'),
  text: L('备注'),
  action: 'modal',
}
const MENU = {
  type: 'menu',
  title: L('点菜'),
  action: 'route',
  text: L('点菜'),
  path: '/storestaff/storestaff.cashier/cashier/diningTable/menu',
}
const CANCEL = {
  type: 'cancel_order',
  title: L('请选择取消订单原因'),
  text: L('取消订单'),
  action: 'confirm',
  tips: L('确定取消订单之前，请及时联系顾客哦') + '！',
}
const ACCEPT = {
  type: 'accept_order',
  title: L('接单'),
  text: L('接单'),
  action: 'confirm',
  tips: '',
}
const CLEAR = {
  type: 'clear_table',
  title: L('清台'),
  text: L('清台'),
  action: 'confirm',
  tips: L('是否确定清台') + '？',
}
const CONFIRM = {
  type: 'confirm_order',
  title: L('选择桌台'),
  text: L('确认到店'),
  action: 'modal',
  tips: '',
}
const DETAIL = { type: 'order_detail', title: L('订单详情'), text: L('订单详情'), action: 'confirm', tips: '' }
const PRINT = {
  type: 'print_order',
  title: L('请选择打印类型'),
  text: L('打印'),
  action: 'modal',
}
const SETTLEMENT = {
  type: 'settlement',
  title: L('结算'),
  action: 'route',
  text: L('结算'),
  path: '/storestaff/storestaff.cashier/cashier/diningTable/settlement_order',
}
</script>

<style lang="less" scoped>
.print /deep/ .ant-checkbox-group {
  width: 200px;
}
.print /deep/ .ant-checkbox-group-item {
  margin-bottom: 8px;
}
.order-card {
  background: #ffffff;
  border-radius: 10px;
}
.cancel-reason {
  display: block;
  margin-top: 10px;
}
</style>
