<template>
  <div class="diningTable_wrapper">
    <div class="left_wrapper">
      <div class="headertop_content">
        <div class="info" v-if="LEFT_CONTENT_STATES != 0 && selectOrderID">
          <div class="toBackbar_container">
            <div class="leftbackBtn" v-if="showBackbtn" @click="backPage()">
              <div class="iconbox"><img src="../../../../../assets/storestaff/giback.png" alt="" /></div>
              <div class="bactext">{{ L('返回已点菜单') }}</div>
            </div>
          </div>
          <div class="pagetitle">{{ leftTitle }}</div>
        </div>
      </div>
      <div class="headerbottom_content">
        <div class="white_info_wrapper">
          <div class="info" v-if="LEFT_CONTENT_STATES && selectOrderID">
            <shopCart
              ref="shopcart"
              v-if="LEFT_CONTENT_STATES == 1"
              :showReturnBtn="showReturnBtn"
              :frompage="frompage"
              @uploadMenu="uploadMenu"
            ></shopCart>
            <tableOrder
              v-if="LEFT_CONTENT_STATES == 2"
              ref="orderDetails"
              :nowselected="Number(selectOrderID)"
              @opendiners="opendiner"
              @printing="openprinting()"
              @openvipinfo="openvipinfo()"
              @changeSeat="changeSeat()"
            ></tableOrder>

            <waitingClean
              v-if="LEFT_CONTENT_STATES == 4"
              ref="waitingClean"
              :nowselected="Number(selectOrderID)"
              @opendiners="opendiner"
              @printing="openprinting()"
              @openvipinfo="openvipinfo()"
              @changeSeat="changeSeat()"
            ></waitingClean>
            <noBtn v-if="LEFT_CONTENT_STATES == 3" ref="cashDetail"></noBtn>
          </div>
          <div class="tips" v-else>{{ L('选中餐台，开始点餐') }}</div>
        </div>
      </div>
    </div>

    <!-- 内容主体 -->
    <div class="right_wrapper">
      <keep-alive :include="keepAlive">
        <router-view
          ref="sonRouter"
          @titleState="changeTitle"
          @backfromState="backfromState"
          @foodClick="foodClick"
          @returnbtn="returnbtn"
          @uploadLeft="uploadLeft"
        ></router-view>
      </keep-alive>
    </div>

    <!-- 更改就餐人数 -->
    <a-modal
      v-model="dinersModel"
      wrapClassName="borderradius"
      :footer="null"
      :title="null"
      :centered="true"
      width="31%"
      :maskClosable="false"
      :destroyOnClose="true"
      :closable="false"
      :bodyStyle="{ padding: 0 }"
    >
      <div class="alert_wrapper">
        <changeDishers
          :tableInfo="tableInfo"
          @changedinersNum="changedinersNum"
          @closemodel="closemodelfnc()"
        ></changeDishers>
      </div>
    </a-modal>

    <!-- 警告弹框 -->
    <a-modal
      v-model="warningShow"
      wrapClassName="borderradius"
      :footer="null"
      :title="null"
      :centered="true"
      width="30%"
      :maskClosable="false"
      :closable="false"
      :bodyStyle="{ padding: 0 }"
    >
      <div class="alert_wrapper"><warningModel @closemodel="closemodelfnc()"></warningModel></div>
    </a-modal>

    <!-- 打印 -->
    <a-modal
      v-model="printingShow"
      wrapClassName="borderradius"
      :footer="null"
      :title="null"
      :centered="true"
      width="27%"
      :maskClosable="false"
      :closable="false"
      :bodyStyle="{ padding: 0 }"
      :destroyOnClose="true"
    >
      <div class="alert_wrapper">
        <printingModel :orderId="Number(selectOrderID)" @closemodel="closemodelfnc()"></printingModel>
      </div>
    </a-modal>
  </div>
</template>

<script>
import shopCart from '../components/shopping_Cart.vue' //购物车
import noBtn from '../components/nobtnLeftContent.vue' //结算页左侧内容
import tableOrder from '../components/tableOrder_detail.vue' //桌台订单详情
import waitingClean from '../components/waitingClean.vue' //桌台订单详情
import changeDishers from '../components/changeDiners.vue' //更改就餐人数
import printingModel from '../components/printingModel.vue' //打印弹框

export default {
  components: {
    shopCart,
    tableOrder,
    changeDishers,
    printingModel,
    noBtn,
    waitingClean,
  },
  props: {},
  data() {
    return {
      animateshow: false, //动画类名
      screenCurrent: 0, //筛选下标
      tableCurrent: 0, //筛选桌台
      payMethod: 'outline', //支付方式
      showReturnBtn: true,
      leftTitle: this.L('点菜单'),

      LEFT_CONTENT_STATES: 0, //左侧状态判断
      selectOrderID: '', //选中订单
      dinersModel: false, //更换桌台人数开关
      alldishesReturn: false, //全部退菜弹框开关
      changeSeatshow: false, //更换桌台弹框
      payMethodshow: false, //支付方式弹框
      printingShow: false, //打印弹框
      warningShow: false, //警告弹框
      cancelOrderbtn: true, //撤单按钮
      frompage: '', //订单来源
      showBackbtn: false,
      returnPage: 'dining',
      tableInfo: '',
      loadoperation: '',
      orderInfo: '', // 订单详情
    }
  },
  created() {
    this.$emit('getcurrent', 'diningTable')
    this.$store.commit('changeOrder', '')
    this.$store.commit('changeleftState', '')
  },
  watch: {
    '$store.state.storestaff.nowOrderId'(nval, oval) {
      // 有新的订单进来了新的订单id = nval
      this.selectOrderID = nval
    },
    '$store.state.storestaff.LEFT_CONTENT_STATES'(nval, oval) {
      // 判断左侧是购物车还是详情 当前左侧的内容,1是购物车,2是详情,3是结算页，4是清台 nval
      this.LEFT_CONTENT_STATES = nval
    },
  },
  computed: {
    keepAlive() {
      return this.$store.getters.keepAlive
    },
  },
  mounted() {
    this.loadoperation = ''
  },
  methods: {
    // 弹框操作
    closemodelfnc() {
      this.dinersModel = false
      this.alldishesReturn = false
      this.changeSeatshow = false
      this.payConfim = false
      this.payMethodshow = false
      this.printingShow = false
      this.warningShow = false
    },

    opendiner(info) {
      this.tableInfo = info
      this.dinersModel = true
    },
    openprinting() {
      this.printingShow = true
    },
    openvipinfo() {
      this.vipinfoShow = true
    },
    changeSeat() {
      this.changeSeatshow = true
    },

    foodClick(e) {
      console.log('')
     // 菜单无规格无属性点击了 this.$store.state.storestaff.LEFT_CONTENT_STATES

      this.LEFT_CONTENT_STATES = this.$store.state.storestaff.LEFT_CONTENT_STATES
      this.$nextTick(() => {
        if (this.$refs.shopcart) {
          this.$refs.shopcart.watchmenu(e)
        }
      })
    },

    changedinersNum(e) {
      if (this.LEFT_CONTENT_STATES == '2') {
        this.$refs.orderDetails.getorderInfo()
      } else {
        this.$refs.waitingClean.getorderInfo()
      }
    },

    uploadLeft(obj) {
      // 菜单页刷新在点餐台主页改变左侧状态，更新订单id
      this.$store.commit('changeOrder', obj.id)
      this.$store.commit('changeleftState', obj.type)
      this.selectOrderID = this.$store.state.storestaff.nowOrderId
      this.LEFT_CONTENT_STATES = this.$store.state.storestaff.LEFT_CONTENT_STATES
      if (this.$refs.cashDetail) {
        this.$refs.cashDetail.getorderInfo()
      }
    },

    returnbtn(e) {
      this.showReturnBtn = e
      if (this.orderInfo && (this.orderInfo.status > 20 || this.orderInfo.status == 20)) {
        this.showReturnBtn = false
      }
    },

    changeTitle(e) {
      if (e.showstate == 'hide') {
        this.showBackbtn = false
      } else {
        this.showBackbtn = true
      }

      this.leftTitle = e.titleText ? this.L('加菜单') : this.L('点菜单')
      this.showReturnBtn = e.titleText ? false : true

      if (e.operation) {
        this.loadoperation = e.operation
      }
    },

    // 更新菜单
    uploadMenu(e) {
      this.orderInfo = e.order.order || ''
      if (this.$route.name == 'menu') {
        this.$refs.sonRouter.uplaodMenufc(e)
      }
    },

    backfromState(e) {
      if (e == 0) {
        this.frompage = 'order'
      } else {
        this.frompage = 'table'
      }
    },

    backPage() {
      if (this.loadoperation == 'changeLefttwo') {
        this.$store.commit('changeleftState', 2)
      } else if (this.loadoperation == 'changeLeftone') {
        this.$store.commit('changeleftState', 1)
      }
      this.$router.replace({ name: this.returnPage })
    },
  },
}
</script>

<style lang="less">
@rem: 192; //定义页面尺寸
.diningTable_wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  .left_wrapper {
    width: 635 / @rem * 1rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    .headertop_content {
      width: 100%;
      height: 12%;
      .info {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        .toBackbar_container {
          width: 100%;
          box-sizing: border-box;
          padding: 0 24 / @rem * 1rem;
          display: flex;
          .leftbackBtn {
            cursor: pointer;
            display: flex;
            align-items: center;
            margin-bottom: 20 / @rem * 1rem;
            .iconbox {
              width: 12 / @rem * 1rem;
              height: 12 / @rem * 1rem;
              display: flex;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .bactext {
              margin-left: 10 / @rem * 1rem;
              font-size: 20 / @rem * 1rem;
              font-weight: 500;
              color: #ababa1;
            }
          }
        }
        .pagetitle {
          font-size: 30 / @rem * 1rem;
          font-weight: bold;
          color: #ffffff;
          margin-bottom: 20 / @rem * 1rem;
          padding-left: 20 / @rem * 1rem;
        }
      }
    }
    .headerbottom_content {
      width: 100%;
      height: 86%;
      box-sizing: border-box;
      padding-left: 20 / @rem * 1rem;
      display: flex;
      flex-direction: column;
      .white_info_wrapper {
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        border-radius: 10 / @rem * 1rem;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        .info {
          width: 100%;
          height: 100%;
        }
        .tips {
          font-size: 30 / @rem * 1rem;
          color: #999999;
        }
      }
    }
  }
  .right_wrapper {
    width: calc(100% - 635 / @rem * 1rem);
    height: 100%;
    box-sizing: border-box;
    padding: 0 20 / @rem * 1rem;
  }
}

.borderradius {
  /deep/.ant-modal-content {
    border-radius: 10 / @rem * 1rem;
    overflow: hidden;
  }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
