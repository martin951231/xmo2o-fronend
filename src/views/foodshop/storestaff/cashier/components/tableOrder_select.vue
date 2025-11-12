<template>
  <div class="computer_model">
    <div class="title_content">
      <div class="border_box">
        <div class="leftemptyybox"></div>
        <div class="titletext">{{ L('开台') }}</div>
        <div class="closeicon" @click="closemodel()">
          <img src="../../../../../assets/storestaff/close.png" alt="" />
        </div>
      </div>
    </div>
    <div class="texttips">
      <span>{{ L('当前桌台有多个订单在进行中，请选择要处理的订单') }}</span>
    </div>
    <div class="order_wrapper">
      <div class="slider_content">
        <div class="order_list_container">
          <div class="order_item" v-for="(items, index) in orderList" :key="index" @click="checkOrder(items)">
            <div class="source_state">
              <div class="tipslabel online">
                <span>{{ items.order_from_txt }}</span>
              </div>
              <div class="orderstate dinging" v-if="items.table_order_status == 1">{{ L('就餐中') }}</div>
              <div class="orderstate ordering" v-else-if="items.table_order_status == 2">{{ L('点餐中') }}</div>
              <div class="orderstate clean" v-else-if="items.table_order_status == 3">{{ L('待清台') }}</div>
            </div>
            <div class="customerinfo">
              <div class="leftinfo">
                {{ L('会员') }}:
                {{ items.card_name || items.user_phone ? items.card_name + ' ' + items.user_phone : L('无') }}
              </div>
              <div class="righticon"><img src="../../../../../assets/storestaff/enter.png" alt="" /></div>
            </div>
            <div class="createTime">{{ L('开台时间') }}：{{ items.create_time }}</div>
            <div class="bookNum_price">
              <div class="bookNum">{{ L('就餐人数') }}：{{ items.book_num }}</div>
              <div class="orderprice">{{ L('￥') }}{{ items.total_price }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom_btn">
      <div class="btnbox" @click="opennewOrder()">{{ L('创建新的订单') }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tableinfos: Object,
  },
  data() {
    return {
      orderList: [],
    }
  },
  created() {
    if (this.tableinfos) {
      this.getOrderList(this.tableinfos.id)
    }
  },
  methods: {
    // 获取桌台订单列表
    getOrderList(id) {
      this.request('/foodshop/storestaff.foodshopStore/tableOrderList', { table_id: id }).then((res) => {
        this.orderList = res.list
        // this.screenFoodtype(this.tableCurrent)
      })
    },

    // 选择订单并赋值到vuex
    checkOrder(item) {
      if (item.table_order_status == 2) {
        this.$store.commit('changeOrder', item.order_id)
        this.$emit('changeLeftDetails', this.tableinfos.id)
        this.$store.commit('changeleftState', 1)
        this.$router.push({ name: 'menu', query: { orderId: item.order_id } })
        this.closemodel()
      } else if (item.table_order_status == 1) {
        this.$store.commit('changeOrder', item.order_id)
        this.$store.commit('changeleftState', 2)
        this.$emit('changeLeftDetails', this.tableinfos.id)
        this.closemodel()
      } else if (item.table_order_status == 3) {
        this.$store.commit('changeOrder', item.order_id)
        this.$store.commit('changeleftState', 4)
        this.$emit('changeLeftDetails', this.tableinfos.id)
        this.closemodel()
      }
      // this.$store.commit('changeOrder',item.order_id)
      // this.$emit('changeLeftDetails',this.tableinfos.id)
      // this.closemodel()
    },

    closemodel() {
      this.$emit('closemodel')
    },

    opennewOrder() {
      this.$emit('openNewTable', this.tableinfos)
    },
  },
}
</script>

<style scoped lang="less">
@rem: 192; //定义页面尺寸
.computer_model {
  width: 100%;
  height: 70%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  .title_content {
    width: 100%;
    box-sizing: border-box;
    padding: 0 20 / @rem * 1rem;
    .border_box {
      width: 100;
      height: 100 / @rem * 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 0 10 / @rem * 1rem;
      border-bottom: 1px solid #ededed;
      .closeicon {
        width: 26 / @rem * 1rem;
        height: 26 / @rem * 1rem;
        display: flex;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .leftemptyybox {
        width: 26 / @rem * 1rem;
        height: 26 / @rem * 1rem;
      }
      .titletext {
        font-size: 32 / @rem * 1rem;
        font-weight: normal;
        color: #222222;
      }
    }
  }
  .texttips {
    width: 100%;
    height: 70 / @rem * 1rem;
    // line-height: 70 / @rem * 1rem;
    color: #999999;
    position: relative;
    span {
      display: block;
      text-align: center;
      position: absolute;
      width: 200%;
      top: -50%;
      left: -50%;
      font-size: 40 / @rem * 1rem;
      line-height: 140 / @rem * 1rem;
      height: 140 / @rem * 1rem;
      transform: scale(0.5);
      white-space: nowrap;
    }
  }
  .order_wrapper {
    width: 100%;
    height: 610 / @rem * 1rem;
    box-sizing: border-box;
    padding: 0 30 / @rem * 1rem;
    .slider_content {
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
      .order_list_container {
        position: absolute;
        width: 100%;
        .order_item {
          width: 100%;
          height: 185 / @rem * 1rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          border-bottom: dashed 1px #eaeaea;
          margin-bottom: 30 / @rem * 1rem;
          .source_state {
            width: 100%;
            display: flex;
            align-items: center;
            .tipslabel {
              text-align: center;
              font-size: 18 / @rem * 1rem;
              border-radius: 4px;
              background-color: #40cb8b;
              padding: 6 / @rem * 1rem 7 / @rem * 1rem;
              color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .orderstate {
              font-size: 24 / @rem * 1rem;
              margin-left: 10 / @rem * 1rem;
            }
            .dinging {
              color: #40cb8b;
            }
            .ordering {
              color: #3ba1ff;
            }
            .clean {
              color: #fd5a5a;
            }
          }

          .customerinfo {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 15 / @rem * 1rem;
            .leftinfo {
              font-size: 26 / @rem * 1rem;
              color: #333333;
              line-height: 25 / @rem * 1rem;
            }
            .righticon {
              width: 30 / @rem * 1rem;
              height: 30 / @rem * 1rem;
              display: flex;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }

          .createTime {
            width: 100%;
            font-size: 22 / @rem * 1rem;
            line-height: 21 / @rem * 1rem;
            color: #888b95;
            margin-top: 20 / @rem * 1rem;
          }
          .bookNum_price {
            width: 100%;
            margin-top: 15 / @rem * 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .bookNum {
              font-size: 22 / @rem * 1rem;
              line-height: 21 / @rem * 1rem;
              color: #888b95;
            }
            .orderprice {
              font-size: 28 / @rem * 1rem;
              line-height: 22 / @rem * 1rem;
              color: #fd5959;
            }
          }
        }
      }
    }
    .slider_content::-webkit-scrollbar {
      width: 0;
    }
  }

  .bottom_btn {
    width: 100%;
    height: 100 / @rem * 1rem;
    box-sizing: border-box;
    padding: 0 225 / @rem * 1rem;
    display: flex;
    align-items: center;
    .btnbox {
      width: 100%;
      height: 60 / @rem * 1rem;
      background-color: #00cbb3;
      font-size: 24 / @rem * 1rem;
      line-height: 60 / @rem * 1rem;
      color: #ffffff;
      text-align: center;
      border-radius: 10 / @rem * 1rem;
    }
  }
}
</style>
