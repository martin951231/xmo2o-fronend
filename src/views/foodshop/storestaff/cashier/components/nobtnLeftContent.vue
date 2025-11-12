<template>
  <div class="shopping_Cart">
    <div class="cart_left_wrapper">
      <div class="orderTotal_info">
        <div class="info_container">
          <div class="left_infoContent">
            <div class="table_orderTime">
              <div class="table" v-if="TABLE_INFO.id">{{ L('桌号') }}：{{ TABLE_INFO.table_name }}</div>
              <div class="underbox">{{ L('下单时间') }}：{{ ORDER_INFO.create_time_str }}</div>
            </div>
            <div class="table_orderTime">
              <div class="table" v-if="TABLE_INFO.id">{{ L('就餐人数') }}：{{ ORDER_INFO.book_num }}</div>
              <div class="underbox">{{ L('店员') }}：{{ staffname }}</div>
            </div>
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
                <div class="order_timers_title_info" v-if="TABLE_INFO.id || ORDER_INFO.order_from == 4">
                  <div class="lefttitleText">{{ items.number_str }}</div>
                  <div class="rightstate">{{ items.status_str }}</div>
                </div>
                <div class="order_items" v-for="(itm, idx) in items.goods" :key="idx">
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
              <div class="book_price" v-if="timesitems.book_price > 0">
                {{ L('订金已抵扣') }}{{ L('￥') }}{{ timesitems.book_price }}
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
              <span class="total_count">{{ L('共X1项', { X1: ORDER_INFO.go_pay_num }) }}</span>
              <span>￥</span>
              {{ ORDER_INFO.goods_total_price }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import orderGoodsItem from '@/views/foodshop/storestaff/cashier/components/orderGoodsItem'
export default {
  components: {
    orderGoodsItem,
  },
  data() {
    return {
      // 购物车选中
      staffname: '',
      ORDER_ID: '', //订单id
      TABLE_INFO: {}, //桌台数据
      ORDER_INFO: {}, //订单数据
      PAGE_INFO: {}, //购物车接口数据
    }
  },
  created() {
    this.ORDER_ID = this.$store.state.storestaff.nowOrderId
    this.staffname = Vue.ls.get('storestaff_page_info').staff_name
    this.getorderInfo()
  },
  methods: {
    // 获取订单信息
    getorderInfo() {
      this.request('/foodshop/storestaff.order/orderDetail', { show_goods_detail: 1, order_id: this.ORDER_ID }).then(
        (res) => {
          this.PAGE_INFO = res
          this.TABLE_INFO = res.table_info
          this.ORDER_INFO = res.order
        }
      )
    },

    addmoreGoods() {
      this.$store.commit('changeleftState', 1)
      this.$router.push({ name: 'menu', query: { orderId: this.ORDER_ID } })
    },

    //打开弹框
    openmodels(type) {
      this.$emit(type)
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
    width: 100%;
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
          width: 480 / @rem * 1rem;
          padding-right: 10 / @rem * 1rem;
          .table_orderTime {
            font-size: 18 / @rem * 1rem;
            line-height: 24 / @rem * 1rem;
            color: #666666;
            .underbox {
              margin-top: 20 / @rem * 1rem;
            }
          }
        }
      }
    }
    .slider_cart_wrapper {
      width: 100%;
      height: 77%;
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
              }
              .order_items {
                width: 100%;
                padding: 0 24 / @rem * 1rem;
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
      width: 100%;
      height: 12%;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      .bottom_content {
        width: 100%;
        padding: 0 34 / @rem * 1rem;
        box-sizing: border-box;
        .topprice_content {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          .total_price_box {
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
          justify-content: space-between;
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
        margin-top: 15 / @rem * 1rem;
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
