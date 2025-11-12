<template>
  <div class="cashier">
    <div class="nav_container">
      <!-- 导航 -->
      <div class="navcontent">
        <div
          v-for="(items, index) in navList"
          :key="index"
          class="nav_items_wrapper"
          :class="currentindex == items.path ? 'item_active' : ''"
          @click="goroute(index, items.path)"
        >
          <div class="items_icon">
            <IconFont :type="items.icon" />
          </div>
          <div class="items_name">{{ items.name }}</div>
        </div>
      </div>
      <!-- 日期 -->
      <div class="dateinfo_container">
        <div class="timebox">
          <span class="hour" v-html="dateshow.hour"></span>
          <span class="m">:</span>
          <span class="minutes" v-html="dateshow.minutes"></span>
        </div>
        <div class="datebox"><span v-html="dateshow.todate"></span></div>
        <div class="weekendbox" v-html="dateshow.weekend"></div>
        <div class="backbtn iconfont" @click="backfnc()"><a-icon type="rollback" />{{ L('返回') }}</div>
      </div>
    </div>
    <!-- 页面路由 -->
    <div class="content_wrapper"><router-view @getcurrent="changecurrent" :refresh="refresh"></router-view></div>
  </div>
</template>

<script>
import Vue from 'vue'   
import Rem from '../../../../utils/rem.js'
Rem.getrem()
import IconFont from '@/utils/icon'
import {orderNotice,clearNotice} from '@/utils/storestaff'
export default {
  props: {},
  components: { IconFont },
  data() {
    return {
      currentindex: 0,
      navList: [
        {
          icon: 'icondingdan1',
          name: this.L('订单处理'),
          path: 'order',
        },
        {
          icon: 'iconcanyin1',
          name: this.L('桌台管理'),
          path: 'diningTable',
        },
        {
          icon: 'iconpaiduijiaohao_xianxing',
          name: this.L('排号列表'),
          path: 'queueList',
        },
        {
          icon: 'iconyunicon_qingli',
          name: this.L('沽清'),
          path: 'clear',
        },
        {
          icon: 'iconchaxun',
          name: this.L('订单查询'),
          path: 'query',
        },
        {
          icon: 'iconyudiancan0101',
          name: this.L('快速点单'),
          path: 'orderQuickly',
        },
      ],
      dateshow: {
        hour: '',
        minutes: '',
        todate: '',
        weekend: '',
      },
      refresh: 0,
    }
  },
  created() {
    setInterval(() => {
      this.getdateToday()
    }, 1000)

    this.$bus.$on('changecurrent', (e) => {
      this.changecurrent(e)
    })

    // this.staffname = Vue.ls.get('storestaff_page_info');
    if (!Vue.ls.get('storestaff_page_info')) {
      this.$router.replace({ name: 'storestaffLogin' })
    }
     orderNotice('dining')
  },
  mounted() {},
  methods: {
    goroute(idx, path) {
      this.refresh++
      this.currentindex = path
      if (path == 'diningTable') {
        this.$store.commit('changeOrder', '')
        this.$store.commit('changeTable', '')
        this.$store.commit('changeleftState', '')
        this.$store.commit('changenowSelectgooodsNum', '')
      }
      if (path == 'orderQuickly') {
        this.$router.replace({ name: path, query: { clean: true } })
      } else {
        this.$router.replace({ name: path })
      }
    },

    changecurrent(e) {
      this.currentindex = e
    },

    backfnc() {
      this.$router.replace('/storestaff/storestaff.index/index')
    },

    //获取当前时间
    getdateToday() {
      var today = new Date()
      var hour = today.getHours()
      var minute = today.getMinutes()
      var year = today.getFullYear()
      var month = today.getMonth() + 1
      var date = today.getDate()
      var day = today.getDay()
      if (hour < 10) {
        hour = '0' + hour
      }
      if (minute < 10) {
        minute = '0' + minute
      }
      switch (day) {
        case 0:
          this.dateshow.weekend = this.L('星期日')
          break
        case 1:
          this.dateshow.weekend = this.L('星期一')
          break
        case 2:
          this.dateshow.weekend = this.L('星期二')
          break
        case 3:
          this.dateshow.weekend = this.L('星期三')
          break
        case 4:
          this.dateshow.weekend = this.L('星期四')
          break
        case 5:
          this.dateshow.weekend = this.L('星期五')
          break
        case 6:
          this.dateshow.weekend = this.L('星期六')
          break
      }
      this.$nextTick(() => {
        if (this.dateshow.hour != hour) {
          this.dateshow.hour = hour
        }
        if (this.dateshow.minutes != minute) {
          this.dateshow.minutes = minute
        }
        if (this.dateshow.todate != year + '/' + month + '/' + date) {
          this.dateshow.todate = year + '/' + month + '/' + date
        }
      })
    },
  },
}
</script>

<style lang="less">
@rem: 192; //定义页面尺寸
.cashier {
  width: 100%;
  height: auto;
  min-height: 100vh;
  display: flex;
  background-color: #2e2e2e;
  box-sizing: border-box;
  .nav_container {
    min-width: 5.2%;
    width: 5.2%;
    height: auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    .navcontent {
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: space-between;
      .nav_items_wrapper {
        width: 100%;
        height: 140 / @rem * 1rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        flex-direction: column;
        border-bottom: 1px solid rgba(165, 171, 201, 0.1);
        justify-content: center;
        user-select: none;
        cursor: pointer;
        .items_icon {
          color: #c6c6c6;
          opacity: 0.8;
          font-size: 28 / @rem * 1rem;
        }
        .items_name {
          width: 48 / @rem * 1rem;
          text-align: center;
          // height: 45 / @rem * 1rem;
          box-sizing: border-box;
          color: #c6c6c6;
          text-align: center;
          // position: relative;
          opacity: 0.8;
          font-size: 20 / @rem * 1rem;
          // transform: scale(0.5);
        }
      }
      .item_active {
        .items_icon {
          color: #18c6b6;
        }
        .items_name {
          color: #18c6b6;
        }
      }
    }

    .dateinfo_container {
      display: flex;
      width: 100%;
      flex-direction: column;
      box-sizing: border-box;
      // padding: 0 9 / @rem * 1rem;
      align-items: center;
      .timebox {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: 28 / @rem * 1rem;
        letter-spacing: 0px;
        color: #c6c6c6;
        .m {
          display: block;
          margin: 0 3 / @rem * 1rem;
        }
      }
      .datebox {
        width: 100%;
        height: 20 / @rem * 1rem;
        position: relative;
        margin-top: 10 / @rem * 1rem;
        display: flex;
        align-items: center;
        span {
          width: 200%;
          height: 200%;
          position: absolute;
          left: -50%;
          top: -50%;
          transform: scale(0.5);
          text-align: center;
          font-size: 36 / @rem * 1rem;
          letter-spacing: 0px;
          color: #c6c6c6;
        }
      }
      .weekendbox {
        width: 100%;
        text-align: center;
        font-size: 18 / @rem * 1rem;
        letter-spacing: 0px;
        color: #c6c6c6;
        margin-top: 10 / @rem * 1rem;
      }
      .backbtn {
        width: 100%;
        padding: 15 / @rem * 1rem;
        border-top: 1px solid rgba(165, 171, 201, 0.1);
        cursor: pointer;
        text-align: center;
        font-size: 20 / @rem * 1rem;
        letter-spacing: 0px;
        color: #c6c6c6;
        margin-top: 30 / @rem * 1rem;
      }
    }
  }
  .content_wrapper {
    width: 94.8%;
    height: auto;
    min-height: 100vh;
    background: url(../../../../assets/storestaff/cashinerback.png);
    background-size: 100% 100%;
    box-sizing: border-box;
  }
}

.rotatecls {
  animation: turn 0.5s linear infinite;
}
@keyframes turn {
  0% {
    -webkit-transform: rotate(0deg);
  }
  25% {
    -webkit-transform: rotate(90deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
  }
  75% {
    -webkit-transform: rotate(270deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
</style>
