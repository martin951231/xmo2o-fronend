<template>
  <div class="shopping_Cart">
    <div class="cart_left_wrapper">
      <div class="orderTotal_info">
        <div class="info_container">
          <div class="left_infoContent">
            <div class="table_orderTime">
              <div class="table" v-if="TABLE_INFO.table_name">{{ L('桌号') }}：{{ TABLE_INFO.table_name }}</div>
              <div class="underbox" v-if="ORDER_INFO.create_time_str">
                {{ L('下单时间') }}：{{ ORDER_INFO.create_time_str }}
              </div>
            </div>
            <div class="table_orderTime">
              <div class="table" v-if="TABLE_INFO.table_name">{{ L('就餐人数') }}：{{ ORDER_INFO.book_num }}</div>
              <div class="underbox">{{ L('店员') }}：{{ staffname }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="slider_cart_wrapper">
        <div class="slider_cart_container">
          <div class="order_List">
            <div
              class="order_items"
              v-for="(items, index) in PAGE_INFO.goods_list"
              :key="index"
              :class="items.is_selected ? 'selected_item' : ''"
              @click="selectFood(index)"
            >
              <orderGoodsItem :goods="items"></orderGoodsItem>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom_tatol_info_wrapper">
        <div class="tatol_info_container">
          <div class="order_food_info">
            <div class="order_tatol_num">{{ L('已加菜X1项', { X1: PAGE_INFO.num }) }}</div>
            <div class="order_tatol_price">
              <span>{{ L('￥') }}</span>
              {{ PAGE_INFO.total_price }}
            </div>
          </div>
          <div class="confirmOrder_btn" :class="canshow ? 'cantOrder' : ''" @click="confirmOrder()">
            {{ L('确定下单') }}
          </div>
        </div>
      </div>
    </div>
    <div class="cart_right_wrapper">
      <div class="food_operation">
        <div class="change_num" v-if="nowSelectgooods">
          <div class="reduce_icon" @click="reduceFoodcount()"><a-icon type="minus" /></div>
          <div class="countnum">{{ nowSelectgooods.num }}</div>
          <div class="add_icon" @click="addFoodcount()"><a-icon type="plus" /></div>
        </div>
        <div class="cancel_order">
          <div class="cancel_order_btn" @click="cancelOrder()" v-if="showReturnBtn">{{ L('撤单') }}</div>
        </div>
        <div class="clean_up">
          <div class="clean_up_btn" :class="canshow ? 'cantOrder' : ''" @click="clearallgoods()">{{ L('清空') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import orderGoodsItem from '@/views/foodshop/storestaff/cashier/components/orderGoodsItem'
export default {
  props: {
    showReturnBtn: Boolean,
    frompage: String,
  },
  components: {
    orderGoodsItem,
  },
  data() {
    return {
      // 购物车选中
      ORDER_ID: '', //订单id
      TABLE_INFO: '', //桌台数据
      ORDER_INFO: '', //订单数据
      PAGE_INFO: '', //购物车接口数据
      canshow: true,
      staffname: '',
      currentfoodnumber: 1,

      nowSelectgooods: '', //当前点击的商品
      nowSelectgooodsNum: '',
      buffer: true,
      // 控制快速点击，上一次加购物车还没完成又再次添加
      watchmenuNum: 0
    }
  },
  destroyed() {
    this.$bus.$off('updatacart')
  },
  created() {
    this.ORDER_ID = this.$store.state.storestaff.nowOrderId
    this.staffname = Vue.ls.get('storestaff_page_info').staff_name
    this.getShopcartInfo()
  },
  watch: {
    '$store.state.storestaff.nowOrderId'(nval, oval) {
      this.getShopcartInfo()
    },
    '$store.state.storestaff.nowSelectgooodsNum'(nval, oval) {
      this.nowSelectgooodsNum = nval
    },
  },
  methods: {
    // 获取购物车信息
    getShopcartInfo() {
      this.request('/foodshop/storestaff.order/cartDetail', { order_id: this.$store.state.storestaff.nowOrderId }).then(
        (res) => {
          this.PAGE_INFO = res
          this.TABLE_INFO = res.table_info
          this.ORDER_INFO = res.order.order
          this.$emit('uploadMenu', this.PAGE_INFO)
          if (res.goods_list.length > 0) {
            this.canshow = false
          } else {
            this.canshow = true
          }
          this.initData()
        }
      ).finally(() => {
        this.watchmenuNum = 0
        this.buffer = true
      })
    },

    // 初始化数据
    initData() {
      if (this.PAGE_INFO.goods_list.length > 0) {
        this.PAGE_INFO.goods_list.map((items, index) => {
          if (this.$store.state.storestaff.nowSelectgooodsNum == items.uniqueness_number) {
            items.is_selected = true
            this.nowSelectgooods = items
            this.nowSelectgooodsNum = items.uniqueness_number
          } else {
            items.is_selected = false
          }
          this.$set(this.PAGE_INFO.goods_list, index, items)
        })
        var ishas = this.PAGE_INFO.goods_list.some((itm) => {
          return itm.uniqueness_number == this.nowSelectgooods.uniqueness_number
        })
        if (!ishas) {
          this.nowSelectgooods = ''
          this.nowSelectgooodsNum = ''
          this.$store.commit('changenowSelectgooodsNum', '')
        }
      } else {
        this.nowSelectgooods = ''
        this.nowSelectgooodsNum = ''
        this.$store.commit('changenowSelectgooodsNum', '')
      }
    },

    // 点击已点菜品
    selectFood(idx) {
      this.PAGE_INFO.goods_list.forEach((items, index) => {
        if (idx == index) {
          items.is_selected = true
          if (items.is_selected) {
            this.nowSelectgooods = items
            this.$store.commit('changenowSelectgooodsNum', items.uniqueness_number)
          }
        } else {
          items.is_selected = false
        }
        this.$set(this.PAGE_INFO.goods_list, index, items)
      })
      this.$forceUpdate()
    },

    //监听菜单加菜{
    watchmenu(foodinfo) {
        if(this.watchmenuNum) return
        this.watchmenuNum++
      if (this.nowSelectgooodsNum) {
        var ishas = this.PAGE_INFO.goods_list.some((itm) => {
          return itm.uniqueness_number == this.nowSelectgooodsNum
        })
        if (ishas) {
          this.PAGE_INFO.goods_list.forEach((item, index) => {
            if (item.uniqueness_number == this.nowSelectgooodsNum) {
              this.nowSelectgooods = item
              item.is_selected = true
              this.addFoodcount()
            } else {
              item.is_selected = false
            }
            this.$set(this.PAGE_INFO.goods_list, index, item)
          })
        } else {
          this.request('/foodshop/storestaff.order/addCart', {
            order_id: this.$store.state.storestaff.nowOrderId,
            product: foodinfo.length ? foodinfo : [foodinfo],
            number: foodinfo.mini_num == 0 ? '1' : foodinfo.mini_num,
            operate_type: 0,
          }).then((res) => {
            if (res.status == 0) {
              this.$message.error(res.msg)
            }
            this.getShopcartInfo()
          })
        }
      }
    },

    // 菜品数量操作
    reduceFoodcount() {
      if (this.buffer) {
        this.buffer = false
        if (this.nowSelectgooods.num > this.nowSelectgooods.mini_num) {
          var reduceCounts = 1
        } else {
          var reduceCounts = this.nowSelectgooods.mini_num || 1
        }
        this.request('/foodshop/storestaff.order/addCart', {
          order_id: this.$store.state.storestaff.nowOrderId,
          uniqueness_number: this.nowSelectgooods.uniqueness_number,
          number: reduceCounts,
          operate_type: 1,
          product: [],
        }).then((res) => {
          this.getShopcartInfo()
        }).catch(() => {
            this.buffer = true
        })
      }
    },

    addFoodcount() {
      if (this.buffer) {
        this.buffer = false
        if (this.nowSelectgooods.num < this.nowSelectgooods.mini_num) {
          var reduceCounts = this.nowSelectgooods.mini_num
        } else {
          var reduceCounts = 1
        }
        this.request('/foodshop/storestaff.order/addCart', {
          order_id: this.$store.state.storestaff.nowOrderId,
          uniqueness_number: this.nowSelectgooods.uniqueness_number,
          number: reduceCounts,
          product: [],
          operate_type: 0,
        }).then((res) => {
          this.getShopcartInfo()
          if (res.status == 0) {
            this.$message.error(res.msg)
          }
        }).catch(() => {
            this.buffer = true
        })
      }
    },

    // 清空购物车
    clearallgoods() {
      this.$confirm({
        title: this.L('提示'),
        content: this.L('确定要清空购物车吗') + '？',
        okText: this.L('确认'),
        centered: true,
        cancelText: this.L('取消'),
        onOk: () => {
          this.request('/foodshop/storestaff.order/clearCart', {
            order_id: this.$store.state.storestaff.nowOrderId,
          }).then((res) => {
            this.$store.commit('changenowSelectgooodsNum', '')
            this.nowSelectgooods = ''
            this.getShopcartInfo()
          })
        },
      })
    },

    // 撤单
    cancelOrder() {
      this.$confirm({
        title: this.L('提示'),
        content: this.L('是否取消订单') + '？',
        okText: this.L('确认'),
        centered: true,
        cancelText: this.L('取消'),
        onOk: () => {
          this.request('/foodshop/storestaff.order/cancelOrder', {
            order_id: this.$store.state.storestaff.nowOrderId,
          }).then((res) => {
            this.$router.go(-1)
            this.$store.commit('changeleftState', '')
            this.$store.commit('changenowSelectgooodsNum', '')
            this.nowSelectgooods = ''
          })
        },
      })
    },

    confirmOrder() {
      this.request('/foodshop/storestaff.order/saveCart', {
        order_id: this.$store.state.storestaff.nowOrderId,
      }).then((res) => {
        if (this.frompage == 'order') {
          this.$router.replace({ name: 'order' })
          this.$store.commit('changeorderPageState', 'nomarlCode')
        } else {
          this.$store.commit('changeleftState', 2)
          this.$router.replace({ name: 'dining' })
        }
      })
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
            font-size: 18 / @rem * 1rem;
            line-height: 18 / @rem * 1rem;
            color: #666666;
            .underbox {
              white-space: nowrap;
              margin-top: 20 / @rem * 1rem;
            }
          }
        }
      }
    }
    .slider_cart_wrapper {
      width: 100%;
      height: 75%;
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
      }
    }
    .slider_cart_wrapper::-webkit-scrollbar {
      width: 0px;
    }

    .bottom_tatol_info_wrapper {
      width: 520 / @rem * 1rem;
      height: 14%;
      background-color: #ffffff;
      .tatol_info_container {
        width: 100%;
        height: 100%;
        padding: 0 20 / @rem * 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        white-space: nowrap;
        .order_food_info {
          display: flex;
          align-items: flex-end;
          font-size: 20 / @rem * 1rem;
          font-weight: 500;
          line-height: 36 / @rem * 1rem;
          color: #666666;
          .order_tatol_price {
            color: rgba(102, 102, 102, 1);
            font-size: 36 / @rem * 1rem;
            line-height: 40 / @rem * 1rem;
            font-weight: bold;
            color: #ff3333;
            text-align: center;
            display: flex;
            align-items: flex-end;
            span {
              font-size: 28 / @rem * 1rem;
              line-height: 36 / @rem * 1rem;
            }
          }
        }
        .confirmOrder_btn {
          width: 210 / @rem * 1rem;
          height: 75 / @rem * 1rem;
          background-color: #18c6b6;
          border-radius: 10 / @rem * 1rem;
          font-size: 30 / @rem * 1rem;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
          line-height: 75 / @rem * 1rem;
          text-align: center;
        }

        .cantOrder {
          pointer-events: none;
          background-color: #dcdcdc;
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
      .change_num {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .reduce_icon {
          width: 50 / @rem * 1rem;
          height: 50 / @rem * 1rem;
          border: solid 2 / @rem * 1rem #f2f2f2;
          color: #999;
          font-size: 26 / @rem * 1rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          cursor: pointer;
        }
        .countnum {
          font-size: 25 / @rem * 1rem;
          font-weight: bold;
          color: #18c6b6;
          line-height: 25 / @rem * 1rem;
          margin: 25 / @rem * 1rem 0;
        }
        .add_icon {
          width: 50 / @rem * 1rem;
          height: 50 / @rem * 1rem;
          border: solid 2 / @rem * 1rem #18c6b6;
          color: #18c6b6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          cursor: pointer;
          font-size: 26 / @rem * 1rem;
        }
      }
      .cancel_order {
        width: 100%;
        margin-top: 100 / @rem * 1rem;
        .cancel_order_btn {
          width: 100%;
          height: 75 / @rem * 1rem;
          border-radius: 10 / @rem * 1rem;
          border: solid 1 / @rem * 1rem #dddddd;
          text-align: center;
          line-height: 75 / @rem * 1rem;
          font-size: 24 / @rem * 1rem;
          font-weight: 500;
          color: #999999;
          cursor: pointer;
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
        .cantOrder {
          pointer-events: none;
          background-color: #dcdcdc;
        }
      }
    }
  }
}
</style>
