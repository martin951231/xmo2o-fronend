<template>
  <div class="shopping_Cart">
    <div class="cart_left_wrapper">
      <div class="orderTotal_info">
        <div class="info_container">
          <div class="left_infoContent">
            <div class="table_orderTime">
              <div class="table">{{ L('桌号') }}：{{ TABLE_INFO.table_name }}</div>
              <div class="underbox">{{ L('下单时间') }}：{{ ORDER_INFO.create_time_str }}</div>
            </div>
            <div class="table_orderTime">
              <div class="table">{{ L('就餐人数') }}：{{ ORDER_INFO.book_num }}</div>
              <div class="underbox">{{ L('店员') }}：{{ staffname }}</div>
            </div>
          </div>
          <div class="right_iconbox" @click="openmodels('opendiners')">
            <img src="../../../../../assets/storestaff/edit.png" alt="" />
          </div>
        </div>
      </div>
      <div class="slider_cart_wrapper">
        <div class="slider_cart_container">
          <div class="order_List">
            <div
              class="pay_times_wrapper"
              v-for="(timesitems, timesindex) in ORDER_INFO.goods_detail"
              :key="timesindex"
            >
              <div class="order_timers_list" v-for="(items, index) in timesitems.goods_combine" :key="index">
                <div class="order_timers_title_info">
                  <div class="lefttitleText">{{ items.number_str }}</div>
                  <div class="flex align-center">
                    <div class="rightstate">{{ items.status_str }}</div>
                    <div
                      class="show-unlock"
                      v-if="items.show_unlock && items.show_unlock != 0"
                      @click="deblockingOpt(items.number)"
                    >
                      {{ L('解锁') }}
                    </div>
                  </div>
                </div>
                <div
                  class="order_items"
                  v-for="(itm, idx) in items.goods"
                  :key="idx"
                  :class="nowselectFoodID == itm.id ? 'selected_item' : ''"
                  @click="selectFood(timesindex, index, idx)"
                >
                  <orderGoodsItem :goods="itm" :pageType="'order'"></orderGoodsItem>
                </div>

                <div v-if="items.refund_goods">
                  <div
                    class="order_items"
                    v-for="(itm, idx) in items.refund_goods"
                    :key="idx"
                    style="position: relative"
                  >
                    <orderGoodsItem :goods="itm" :refund_goods="true"></orderGoodsItem>
                  </div>
                </div>
              </div>
              <div class="book_price" v-if="timesitems.book_money > 0">
                {{ L('订金已抵扣') }}{{ L('￥') }}{{ timesitems.book_money }}
              </div>
              <div class="order_price_info">
                <div class="priceInfo_content" v-if="timesitems.pay_price">
                  <div class="discount_money">{{ L('优惠') }}{{ L('￥') }}{{ timesitems.discount_price }}</div>
                  <div class="actual_payment">
                    {{ L('实付') }}
                    <span>{{ L('￥') }}{{ timesitems.pay_price }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom_total_info_wrapper">
        <div class="bottom_content">
          <div class="topprice_content">
            <div class="total_price_box">
              <span class="total_count">{{ L('共X1项', { X1: ORDER_INFO.goods_num }) }}</span>
              <span>{{ L('￥') }}</span>
              {{ ORDER_INFO.goods_total_price }}
            </div>
          </div>
          <div class="btn_container">
            <div class="btn_items addorder" @click="addmoreGoods()">
              <div class="iconbox"><img src="../../../../../assets/storestaff/addbt.png" alt="" /></div>
              <div class="icontent">{{ L('加菜') }}</div>
            </div>
            <div class="btn_items checkout_btn" @click="gosettlement()">
              <div class="iconbox"><img src="../../../../../assets/storestaff/checkout.png" alt="" /></div>
              <div class="icontent">{{ L('结账') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="cart_right_wrapper">
      <div class="food_operation">
        <div class="change_table">
          <div class="change_table_btn package_verification_btn" @click="showModal = true">
            <div class="btn_style">{{ L('团购核销') }}</div>
          </div>
        </div>
        <div class="return_dishes" @click="openmodels('returndish')">
          <div class="return_dishes_btn">{{ L('退菜') }}</div>
        </div>
        <div class="printing">
          <div class="prinTing_btn" @click="openmodels('printing')">{{ L('打印') }}</div>
        </div>
        <div class="change_table">
          <div class="change_table_btn" @click="openmodels('changeSeat')">
            <div class="btn_style">{{ L('更换桌台') }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 退菜 -->
    <a-modal
      v-model="returnFoodShow"
      :footer="null"
      :title="null"
      width="32%"
      :maskClosable="false"
      :closable="false"
      :centered="true"
      :bodyStyle="{ padding: 0 }"
      :destroyOnClose="true"
    >
      <div class="alert_wrapper">
        <returnFood @returnSuccess="cfmreturn" :goodsInfo="nowselectFoodinfo" @closemodel="closemodel"></returnFood>
      </div>
    </a-modal>

    <!-- 更换桌台弹框 -->
    <a-modal
      v-model="changeSeatshow"
      wrapClassName="borderradius"
      :footer="null"
      :title="null"
      :centered="true"
      width="60%"
      :maskClosable="false"
      :closable="false"
      :bodyStyle="{ padding: 0 }"
      :destroyOnClose="true"
    >
      <div class="alert_wrapper">
        <changeSeatsModel
          @uploadfnc="getorderInfo"
          :nowtableId="Number(TABLE_INFO.id)"
          :orderId="Number(ORDER_INFO.order_id)"
          @closemodel="closemodel()"
        ></changeSeatsModel>
      </div>
    </a-modal>

    <!-- 团购核销 -->
    <packageVerification
      :showModal="showModal"
      :ORDER_ID="ORDER_INFO.order_id"
      :verificPackageList="PAGE_INFO.verificPackageList"
      @closemodel="showModal = false"
      @updateVerificPackageList="getorderInfo"
    ></packageVerification>
  </div>
</template>

<script>
import returnFood from './returnFoodModel.vue'
import changeSeatsModel from './changeSeatsModel.vue'
import packageVerification from '@/views/foodshop/storestaff/cashier/components/packageVerification'
import orderGoodsItem from '@/views/foodshop/storestaff/cashier/components/orderGoodsItem'
import Vue from 'vue'
export default {
  props: {
    nowselected: Number,
  },
  components: {
    returnFood,
    changeSeatsModel,
    packageVerification,
    orderGoodsItem,
  },
  data() {
    return {
      staffname: '', //店员姓名
      // 购物车选中
      nowselectOrderID: '', //当前选中的订单id
      nowselectFoodID: '', //当前选中的食物id
      nowselectFoodinfo: '', //当前选中的食物信息
      share_table_type: '', //桌台选择状态

      TABLE_INFO: {}, //桌台数据
      ORDER_INFO: {}, //订单数据
      PAGE_INFO: {}, //购物车接口数据

      returnFoodShow: false, //退菜弹框
      changeSeatshow: false, //换桌弹框

      //  套餐是否可退菜
      nowselect_is_package_goods: false, // 是否为套餐商品
      nowselect_isRefundPackageGoods: true, // true 能退 false 不能退
      showModal: false, // 团购核销弹框显隐
    }
  },
  created() {
    this.staffname = Vue.ls.get('storestaff_page_info').staff_name
    this.getorderInfo()
  },
  watch: {
    nowselected(nval, oval) {
      if (nval) {
        this.nowselectFoodID = ''
        this.nowselectFoodinfo = ''
        this.getorderInfo()
      }
    },
  },
  methods: {
    // 获取订单信息
    getorderInfo() {
      this.request('/foodshop/storestaff.order/orderDetail', { order_id: this.nowselected }).then((res) => {
        this.PAGE_INFO = res
        this.TABLE_INFO = res.table_info
        this.ORDER_INFO = res.order
        this.initData()
      })
    },

    // 初始化数据
    initData() {
      this.ORDER_INFO.goods_detail.map((items) => {
        if (items.goods_combine) {
          items.goods_combine.map((itm) => {
            if (itm.goods) {
              itm.goods.map((it) => {
                if (it.id == this.nowselectFoodID) {
                  it.is_selected = true
                  this.nowselectFoodID = it.id
                  this.nowselectFoodinfo = it
                } else {
                  it.is_selected = false
                }
              })
              var state = itm.goods.some((itms) => {
                return itms.id == this.nowselectFoodID
              })

              if (!state) {
                this.nowselectFoodID = ''
                this.nowselectFoodinfo = ''
              }
              console.log(state)
            }
          })
        }
      })

      if (this.ORDER_INFO.go_pay_num < 1) {
        this.$store.commit('changeleftState', 4)
        this.$bus.$emit('uploadtable', { refush: true })
      } else {
        this.$store.commit('changeleftState', 2)
      }
    },
    // 点击已点菜品
    selectFood(a, b, c) {
      this.ORDER_INFO.goods_detail.forEach((items, index) => {
        if (a == index) {
          items.goods_combine.forEach((itm, idx) => {
            if (b == idx) {
              itm.goods.forEach((it, id) => {
                if (c == id) {
                  // 套餐
                  this.nowselect_is_package_goods = it.is_package_goods || false
                  this.nowselect_isRefundPackageGoods = it.isRefundPackageGoods || false
                  if (this.nowselectFoodID == it.id) {
                    this.nowselectFoodID = ''
                    this.nowselectFoodinfo = {}
                  } else {
                    console.log(this.nowselectFoodID, 'nowselectFoodID')
                    this.nowselectFoodID = it.id
                    this.nowselectFoodinfo = it
                  }
                }
              })
            }
          })
        }
        this.$set(this.ORDER_INFO.goods_detail, index, items)
      })
    },

    addmoreGoods() {
      this.$store.commit('changeleftState', 1)
      this.$router.push({ name: 'menu', query: { orderId: this.nowselected, formState: 'addfood' } })
    },

    //打开弹框
    openmodels(type) {
      if (type == 'opendiners') {
        this.$emit(type, this.PAGE_INFO)
      } else if (type == 'changeSeat') {
        this.changeSeatshow = true
      } else if (type == 'returndish') {
        if (this.nowselectFoodID) {
          // 已核销套餐不可退
          if (this.nowselect_is_package_goods && !this.nowselect_isRefundPackageGoods) {
            this.returnFoodShow = false
            this.$warning({
              title: this.L('提示'),
              centered: true,
              content: this.L('该套餐已全部核销，不能退菜~'),
            })
          } else {
            this.returnFoodShow = true
          }
        } else {
          this.$warning({
            title: this.L('提示'),
            centered: true,
            content: this.L('您还未选中菜品~'),
          })
        }
      } else if (type == 'printing') {
        this.$emit(type)
      }
    },

    cfmreturn() {
      this.getorderInfo()
      this.closemodel()
    },
    closemodel() {
      this.returnFoodShow = false
      this.changeSeatshow = false
    },

    gosettlement() {
      this.$store.commit('changeleftState', 3)
      this.$router.push({ name: 'settlement_order', query: { orderId: this.nowselected } })
    },

    // 解锁
    deblockingOpt(order_num) {
      this.request('/foodshop/storestaff.order/deblocking', { order_id: this.nowselected, order_num: order_num }).then(
        (res) => {
          this.getorderInfo()
        }
      )
    },
  },
}
</script>

<style lang="less" scoped>
@rem: 192; //定义页面尺寸
.shopping_Cart {
  width: 100%;
  height: 100%;
  background-color: #f7f7f7;
  display: flex;
  box-sizing: border-box;
  user-select: none;
  .cart_left_wrapper {
    width: 84%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .orderTotal_info {
      width: 100%;
      height: 11%;
      box-sizing: border-box;
      padding: 0 24 / @rem * 1rem;
      .info_container {
        width: 100%;
        height: 100%;
        border-bottom: 1px solid #eaeaea;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .right_iconbox {
          cursor: pointer;
          width: 25 / @rem * 1rem;
          height: 25 / @rem * 1rem;
          display: flex;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .left_infoContent {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 420 / @rem * 1rem;
          padding-right: 10 / @rem * 1rem;
          .table_orderTime {
            max-width: 50%;
            font-size: 18 / @rem * 1rem;
            color: #666666;
            .underbox {
              // white-space: nowrap;
              margin-top: 20 / @rem * 1rem;
            }
          }
        }
      }
    }
    .slider_cart_wrapper {
      width: 100%;
      height: 74%;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      position: relative;
      .slider_cart_container {
        position: absolute;
        width: 100%;
        display: flex;
        .order_List {
          width: 100%;
          display: flex;
          flex-direction: column;
          .pay_times_wrapper {
            width: 100%;
            display: flex;
            flex-direction: column;
            .order_timers_list {
              width: 100%;
              display: flex;
              flex-direction: column;
              .order_timers_title_info {
                width: 100%;
                height: 50 / @rem * 1rem;
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                box-sizing: border-box;
                padding: 0 24 / @rem * 1rem;
                .flex {
                  display: flex;
                }
                .align-center {
                  align-items: center;
                }
                .lefttitleText {
                  width: 140 / @rem * 1rem;
                  height: 30 / @rem * 1rem;
                  font-size: 16 / @rem * 1rem;
                  text-align: center;
                  line-height: 30 / @rem * 1rem;
                  // padding:  7/ @rem * 1rem 14/ @rem * 1rem;
                  font-weight: 500;
                  color: #ffffff;
                  background: #00cbb3;
                  border-radius: 15 / @rem * 1rem;
                }
                .rightstate {
                  font-size: 20 / @rem * 1rem;
                  font-weight: bold;
                  color: #ff3333;
                }
                .show-unlock {
                  width: 60 / @rem * 1rem;
                  height: 27 / @rem * 1rem;
                  border: 2 / @rem * 1rem solid #ff3333;
                  border-radius: 14 / @rem * 1rem;
                  margin-left: 5 / @rem * 1rem;
                  margin-right: 5 / @rem * 1rem;
                  color: #ff3333;
                  vertical-align: middle;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
              }
              .order_items {
                width: 100%;
                padding: 0 24 / @rem * 1rem;
              }

              .selected_item {
                background-color: #ededf0;
                .items_content {
                  .mainCourse_info {
                    .foodname_count {
                      .foode_name {
                        color: #ff8d00;
                      }
                      .count {
                        color: #ff8d00;
                      }
                    }
                    .food_totalprice {
                      color: #ff8d00;
                    }
                  }
                }
              }
            }
            .book_price {
              width: 100%;
              height: 50 / @rem * 1rem;
              padding: 0 24 / @rem * 1rem;
              font-size: 20 / @rem * 1rem;
              font-weight: 500;
              color: #666666;
              display: flex;
              align-items: flex-end;
              justify-content: flex-end;
            }
            .order_price_info {
              width: 100%;
              height: 75 / @rem * 1rem;
              padding: 0 24 / @rem * 1rem;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              .priceInfo_content {
                display: flex;
                align-items: center;
                .discount_money {
                  font-size: 20 / @rem * 1rem;
                  font-weight: 500;
                  color: #666666;
                  margin-right: 30 / @rem * 1rem;
                }
                .actual_payment {
                  font-size: 20 / @rem * 1rem;
                  font-weight: 500;
                  color: #333333;
                  display: flex;
                  align-items: center;
                  span {
                    font-size: 26 / @rem * 1rem;
                    font-family: PingFang SC;
                    font-weight: bold;
                    color: #ff3333;
                  }
                }
              }
            }
          }
        }
      }
    }
    .slider_cart_wrapper::-webkit-scrollbar {
      width: 0px;
    }

    .bottom_total_info_wrapper {
      width: 520 / @rem * 1rem;
      height: 15%;
      background-color: #ffffff;
      .bottom_content {
        width: 100%;
        padding: 0 17 / @rem * 1rem;
        box-sizing: border-box;
        .topprice_content {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          .total_price_box {
            margin-top: 15 / @rem * 1rem;
            display: flex;
            align-items: flex-end;
            font-size: 36 / @rem * 1rem;
            line-height: 36 / @rem * 1rem;
            font-weight: bold;
            color: #ff3333;
            span {
              font-size: 28 / @rem * 1rem;
              line-height: 28 / @rem * 1rem;
            }
            .total_count {
              font-size: 20 / @rem * 1rem;
              font-weight: 500;
              color: #333333;
              line-height: 28 / @rem * 1rem;
            }
          }
        }
        .btn_container {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-around;
          margin-top: 10 / @rem * 1rem;
          .btn_items {
            width: 150 / @rem * 1rem;
            height: 60 / @rem * 1rem;
            background-color: #00cbb3;
            border-radius: 10 / @rem * 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            .iconbox {
              width: 30 / @rem * 1rem;
              height: 30 / @rem * 1rem;
              display: flex;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .icontent {
              font-size: 22 / @rem * 1rem;
              font-weight: bold;
              color: #ffffff;
              margin-left: 10 / @rem * 1rem;
            }
          }
          .addorder {
            background-color: #00cbb3;
          }
          .vipbtn {
            background-color: #fe9900;
          }
          .checkout_btn {
            background-color: #ff6d5f;
          }
        }
      }
    }
  }
  .cart_right_wrapper {
    width: 16%;
    height: 100%;
    background-color: #ffffff;
    padding: 0 8 / @rem * 1rem;
    box-sizing: border-box;
    border-left: 1px solid #eaeaea;
    .food_operation {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      .return_dishes {
        width: 100%;
        margin-top: 10 / @rem * 1rem;
        .return_dishes_btn {
          width: 100%;
          height: 75 / @rem * 1rem;
          border-radius: 10 / @rem * 1rem;
          border: solid 2 / @rem * 1rem #ff6333;
          text-align: center;
          line-height: 75 / @rem * 1rem;
          font-size: 24 / @rem * 1rem;
          font-weight: 500;
          color: #ff6333;
          cursor: pointer;
        }
      }

      .printing {
        width: 100%;
        margin-top: 10 / @rem * 1rem;
        .prinTing_btn {
          width: 100%;
          height: 75 / @rem * 1rem;
          border-radius: 10 / @rem * 1rem;
          border: solid 2 / @rem * 1rem #2b91f9;
          text-align: center;
          line-height: 75 / @rem * 1rem;
          font-size: 24 / @rem * 1rem;
          font-weight: 500;
          color: #2b91f9;
          cursor: pointer;
        }
      }

      .change_table {
        width: 100%;
        margin-top: 10 / @rem * 1rem;
        .change_table_btn {
          width: 100%;
          height: 100 / @rem * 1rem;
          border-radius: 10 / @rem * 1rem;
          border: solid 2 / @rem * 1rem #fe9c00;
          text-align: center;
          font-size: 24 / @rem * 1rem;
          font-weight: 500;
          color: #fe9c00;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          .btn_style {
            width: 50 / @rem * 1rem;
          }
        }
        .change_table_btn.package_verification_btn {
          border-color: #25b7aa;
          color: #25b7aa;
        }
      }

      .clean_up {
        width: 100%;
        margin-top: 20 / @rem * 1rem;
        .clean_up_btn {
          width: 100%;
          height: 100 / @rem * 1rem;
          border-radius: 10 / @rem * 1rem;
          text-align: center;
          background-color: #fe9c00;
          line-height: 100 / @rem * 1rem;
          font-size: 24 / @rem * 1rem;
          font-weight: 500;
          color: #ffffff;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
