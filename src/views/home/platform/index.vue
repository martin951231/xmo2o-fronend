<template>
  <div class="container">
      <!-- 悬浮球 -->
      
          <a-icon ref="breathing_lamp"
          class="breathing_lamp"
          @click="closeOld()"
          v-if="isShow" type="exclamation-circle" theme="twoTone" :style="{ fontSize: '60px', color: '#08c' }"/>

<!--      <div id="buttonComBination" v-show="show3" class="collapseTransiton">-->
<!--          <el-collapse-transition>-->
<!--              <div class="transitionBoxs" :style="{left: left - 20+  'px', top: top + 30+ 'px'}">-->
<!--                  <div class="transition-box">返回</div>-->
<!--                  <div class="transition-box">编辑</div>-->
<!--                  <div class="transition-box">下一步</div>-->
<!--              </div>-->
<!--          </el-collapse-transition>-->
<!--          &lt;!&ndash; <buttonComBination></buttonComBination> &ndash;&gt;-->
<!--      </div>-->
    <div class="loading" v-if="isLoading">
      <a-spin size="large" />
    </div>
    <div v-else>
      <!-- 信息完善模块 -->
      <a-card
        class="margin-top-10 section-1"
        :bordered="false"
        v-if="
          mainBasicData &&
          Number(mainBasicData.speed_progress) < 100 &&
          mainBasicData.help_list &&
          mainBasicData.help_list.length
        "
      >
        <section class="flex-title">
          <div>
            <a-icon v-if="settingFinished" type="check-circle" theme="filled" class="color-green" />
            <a-icon v-else type="warning" theme="filled" class="color-red" />
            <span class="desc emphasize">{{ mainBasicData.description }}</span>
            <div class="progress">
              <span>进度：</span>
              <a-progress
                style="max-width: 180px; display: inline-block"
                :strokeColor="strokeColor"
                :percent="Number(mainBasicData.speed_progress)"
                size="small"
              />
            </div>
          </div>

          <div class="pointer" style="width: 100px" v-if="mainBasicData.help_list" @click="basicDataFold">
            <div v-if="showBasicData"><span class="desc">收起</span><a-icon type="up" /></div>
            <div v-else><span class="desc">展开</span><a-icon type="down" /></div>
          </div>
        </section>
        <transition name="sub-comments">
          <section class="settings" v-if="mainBasicData.help_list && showBasicData">
            <div v-for="(type, i1) of mainBasicData.help_list" :key="i1">
              <div class="name">{{ type.cat_name }}</div>
              <div class="content" v-if="type.item_list && type.item_list.length">
                <div class="item" v-for="(item, i2) of type.item_list" :key="i2">
                  <div class="col-1">
                    <a-icon v-if="item.level == 'warn'" class="icon color-red" type="exclamation-circle" />
                    <a-icon v-if="item.level == 'recommend'" class="icon color-blue" type="info-circle" />
                    <a-icon v-if="item.level == 'safe'" class="icon color-green" type="check-circle" />
                    <span class="item-title">{{ item.title }} </span>
                    <span v-if="item.link_url" @click="goUrl(item.link_type, item.link_url)" class="color-blue pointer jiaocheng no-wrap"
                      >{{ item.link_type == 'new_blank' ? '教程' : '前往' }}>></span
                    >
                  </div>
                  <div class="item-desc">
                    {{ item.info }}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </transition>
      </a-card>

      <!-- 实时概况 -->
      <a-card
        class="section-2"
        :class="mainBasicData.help_list && mainBasicData.help_list.length ? 'section' : 'margin-top-10'"
        :bordered="false"
        v-if="mainBasicData && mainBasicData.statistics_data"
      >
        <div class="flex-title">
          <div class="emphasize">实时概况</div>
          <div class="right">
            <span class="mr-10 cr-66">更新时间：{{ mainBasicData.statistics_data.now_time }}</span>
            <div class="cr-66">
              <span
                @click="goUrl(mainBasicData.statistics_data.link_type, mainBasicData.statistics_data.statistics_url)"
                class="color-blue pointer"
                >更多数据
              </span>
              <a-tooltip placement="bottomLeft" arrowPointAtCenter>
                <template slot="title">
                  <div class="tooltip">
                    <div class="col">
                      <span class="title">实收总额/总订单数：</span>
                      <span class="desc">统计时间内，订单实付总金额与总订单数，含自有支付与退款订单</span>
                    </div>
                    <div class="col">
                      <span class="title">总用户数/今日新增用户数：</span>
                      <span class="desc"> 统计时间内，平台注册用户总数与今日新增注册用户数，含未绑定手机号的用户</span>
                    </div>
                    <div class="col">
                      <span class="title"> 平台抽成总金额/今日抽成总金额：</span>
                      <span class="desc">统计时间内，平台总抽成金额与今日抽成金额，含自有支付与退款订单的抽成金额</span>
                    </div>
                    <div class="col">
                      <span class="title"> 充值总额/总订单数：</span>
                      <span class="desc"> 统计时间内，用户的平台余额在线充值总额/充值总订单数，不含线下充值金额</span>
                    </div>
                  </div>
                </template>
                <a-icon class="ml-10" type="info-circle" />
              </a-tooltip>
            </div>
          </div>
        </div>
        <div v-if="!statisticsList.length" class="no-data">暂无实时数据</div>
      </a-card>
      <div style="margin-top: 10px" v-if="mainBasicData && statisticsList.length">
        <a-row :gutter="24">
          <a-col :sm="24" :md="12" :xl="6" v-if="statisticsList.length > 0">
            <chart-card
              :title="statisticsList[0].cat_name"
              currency="￥"
              :decimals="2"
              :total="statisticsList[0].total_money"
            >
              <div>
                <trend :flag="statisticsList[0].week_percent_type" style="margin-right: 16px">
                  <span slot="term">周同比</span>
                  {{ statisticsList[0].week_percent + '%' }}
                </trend>
                <trend :flag="statisticsList[0].today_percent_type">
                  <span slot="term">日同比</span>
                  {{ statisticsList[0].today_percent + '%' }}
                </trend>
              </div>
              <template slot="footer"
                >今日总订单数<span class="ml-5">{{ statisticsList[0].total_count }}</span></template
              >
            </chart-card>
          </a-col>
          <a-col :sm="24" :md="12" :xl="6" v-if="statisticsList.length > 1">
            <chart-card :title="statisticsList[1].cat_name" :total="statisticsList[1].total_count">
              <div>
                <mini-area :data="statisticsList[1].list" />
              </div>
              <template slot="footer">
                <trend :flag="statisticsList[1].today_percent_type">
                  <span slot="term">日同比</span>
                  {{ statisticsList[1].today_percent + '%' }}
                </trend>
              </template>
            </chart-card>
          </a-col>
          <a-col :sm="24" :md="12" :xl="6" v-if="statisticsList.length > 2">
            <chart-card
              :title="statisticsList[2].cat_name"
              currency="￥"
              :decimals="2"
              :total="statisticsList[2].total_money"
            >
              <div>
                <mini-bar :data="statisticsList[2].list" />
              </div>
              <template slot="footer">
                <trend :flag="statisticsList[2].today_percent_type">
                  <span slot="term">日同比</span>
                  {{ statisticsList[2].today_percent + '%' }}
                </trend>
              </template>
            </chart-card>
          </a-col>
          <a-col :sm="24" :md="12" :xl="6" v-if="statisticsList.length > 3">
            <chart-card
              :title="statisticsList[3].cat_name"
              currency="￥"
              :decimals="2"
              :total="statisticsList[3].total_money"
            >
              <div>
                <mini-area :data="statisticsList[3].list" />
              </div>
              <template slot="footer">
                充值订单数<span class="ml-5">{{ statisticsList[3].total_count }}</span>
              </template>
            </chart-card>
          </a-col>
        </a-row>
      </div>

      <!-- 销售额、订单量统计数据 -->
      <a-card class="section section-3" :bordered="false">
        <div>
          <a-tabs
            default-active-key="sales_money"
            size="large"
            :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }"
            @change="middleTabChange"
          >
            <div slot="tabBarExtraContent">
              <div>
                <span
                  @click="changeMiddleTime('month')"
                  :class="middleTimeType == 'month' ? 'color-blue' : ''"
                  class="pointer"
                  >本月</span
                >
                <span
                  @click="changeMiddleTime('week')"
                  :class="middleTimeType == 'week' ? 'color-blue' : ''"
                  class="pointer ml-20"
                  >本周</span
                >
                <span
                  @click="changeMiddleTime('year')"
                  :class="middleTimeType == 'year' ? 'color-blue' : ''"
                  class="pointer ml-20"
                  >本年</span
                >
              </div>
            </div>
            <a-tab-pane loading="true" tab="销售额" key="sales_money">
              <a-row>
                <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                  <bar v-if="barData.length" :data="barData" title="销售额排行" />
                  <div v-else class="no-data">暂无销售额统计数据</div>
                </a-col>
                <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                  <rank-list v-if="rankList.length" title="商家销售额排行榜（元）" :list="rankList" />
                  <div v-else class="no-data">暂无销售排行数据</div>
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane tab="订单量" key="order_count">
              <a-row>
                <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                  <bar v-if="barData.length" :data="barData" title="订单量排行" />
                  <div v-else class="no-data">暂无订单统计数据</div>
                </a-col>
                <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                  <rank-list v-if="rankList.length" title="商家销售订单量排行榜（笔）" :list="rankList" />
                  <div v-else class="no-data">暂无订单排行数据</div>
                </a-col>
              </a-row>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-card>

      <!-- 待办事项 -->
      <a-card class="section section-4" :bordered="false">
        <div class="emphasize">待办事项</div>
        <div v-if="todoList.length" class="todo-list">
          <a-row :gutter="24">
            <a-col
              class="col"
              :xl="4"
              :lg="12"
              :md="12"
              :sm="24"
              :xs="24"
              v-for="(item, index) of todoList"
              :key="index"
              @click="goUrl(item.link_type, item.link_url)"
            >
              <div class="name">{{ item.name }}</div>
              <div class="count">{{ item.count }}</div>
            </a-col>
          </a-row>
        </div>
        <div v-else class="no-data">暂无数据</div>
      </a-card>

      <!-- 常用功能 -->
      <a-card class="section section-5" :bordered="false">
        <div class="flex-title">
          <div class="emphasize">常用功能</div>
          <a-button @click="editMenu" type="primary"> 编辑 </a-button>
        </div>
        <div v-if="menuList.length" class="menu-list">
          <div class="col" v-for="(item, index) of menuList" :key="index" @click="goUrl(item.link_type, item.link_url)">
            <div class="icon">
              <img :src="item.image" />
            </div>
            <div class="name no-wrap">{{ item.plugin_name }}</div>
          </div>
        </div>
        <div v-else class="no-data">暂未添加常用功能，点击右上角编辑即可添加哦~</div>
      </a-card>
    </div>
    <!-- 编辑常用功能 -->
    <add-menu ref="addMenu" :selected-list="menuList" :all-list="allMenuList" @ok="editMenuSuccess"></add-menu>
  </div>
</template>
<script>
import indexPlatformApi from '@/api/common/platform/index'
import AddMenu from './modules/AddMenu'
import { ChartCard, MiniArea, MiniBar, RankList, Bar, Trend, NumberInfo, MiniSmoothArea } from '@/components'
import qaApi from "@/api/qa";
let timer_10 = null
let timer_60 = null
export default {
  name: 'PlatformIndex',
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    RankList,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea,
    AddMenu,
  },
  data() {
    return {
      isShow: 0,
      mainBasicData: null,
      showBasicData: false,
      strokeColor: '#F22735',
      statisticsList: [],
      middleDataType: 'sales_money', // 统计类型 sales_money- 销售额 order_count-订单量
      middleTimeType: 'week', // 统计时间类型 week-本周 month-本月 year-本年
      isLoading: false,
      barData: [],
      rankList: [],
      todoList: [],
      menuList: [], // 常用功能列表
      allMenuList: [],
    }
  },
  computed: {
    //   配置是否已完成
    settingFinished() {
      if (Number(this.mainBasicData.speed_progress) == 100) {
        return true
      }
      return false
    },
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.clearTimer()
  },
  beforeRouteEnter(to, from, next) {
    // 进入路由重新开启定时器
    next((vm) => {
      if (!timer_10 || !timer_60) {
        vm.getNowData()
      }
    })
  },
  beforeRouteLeave(to, from, next) {
    // 离开路由则终止定时器
    if (this.clearTimer()) {
      next()
    }
    next()
  },
  methods: {
    // 初始化
    init() {
      this.getMainBasicData(true)
      this.getMiddleStatisticsData()
      this.getBacklog()
      this.getHotMenu()
      this.getCloseOldShow()
    },
    // 定时刷新数据
    getNowData() {
      if (timer_10) {
        clearInterval(timer_10)
      }
      if (timer_60) {
        clearInterval(timer_60)
      }
      timer_10 = setInterval(() => {
        this.getMainBasicData()
      }, 10000)
      timer_60 = setInterval(() => {
        this.getBacklog()
      }, 600000)
    },
    clearTimer() {
      clearInterval(timer_10)
      clearInterval(timer_60)
      timer_10 = null
      timer_60 = null
      return true
    },
    // 首页重要配置提示
    getMainBasicData(showLoading = false) {
      this.isLoading = showLoading
      this.request(indexPlatformApi.getMainBasicData).then((data) => {
        const speed_progress = Number(data.speed_progress)
        if (speed_progress < 50 && showLoading) {
          this.showBasicData = true
        }
        if (speed_progress < 30) {
          this.strokeColor = '#F22735'
        } else if (speed_progress < 70) {
          this.strokeColor = '#2593FC'
        } else {
          this.strokeColor = '#57C22D'
        }
        this.mainBasicData = data
        if (
          data &&
          data.statistics_data &&
          data.statistics_data.statistics_list &&
          data.statistics_data.statistics_list.length
        ) {
          this.statisticsList = data.statistics_data.statistics_list.map((item) => {
            // 周同比
            if (item.week_percent_type == 1) {
              item.week_percent_type = 'up'
            } else if (item.week_percent_type == -1) {
              item.week_percent_type = 'down'
            } else {
              item.week_percent_type = ''
            }
            // 日同比
            if (item.today_percent_type == 1) {
              item.today_percent_type = 'up'
            } else if (item.today_percent_type == -1) {
              item.today_percent_type = 'down'
            } else {
              item.today_percent_type = ''
            }
            if (item.list) {
              item.list = this.transformChartData(item.list)
            }
            return item
          })
          this.isLoading = false
        }
      })
    },
    // 统计数据显示
    getMiddleStatisticsData() {
      this.request(indexPlatformApi.getMiddleStatisticsData, {
        type: this.middleDataType,
        time_type: this.middleTimeType,
      }).then((data) => {
        if (data) {
          if (data.statistics_list && data.statistics_list.length) {
            this.barData = this.transformChartData(data.statistics_list)
          }
          if (data.mer_list && data.mer_list.length) {
            this.rankList = data.mer_list
          }
        }
      })
    },
    // 待办事项
    getBacklog() {
      this.request(indexPlatformApi.getBacklog).then((data) => {
        if (data && data.list && data.list.length) {
          this.todoList = data.list
        }
      })
    },
    // 常用功能
    getHotMenu() {
      this.request(indexPlatformApi.getHotMenu).then((data) => {
        if (data && data.list && data.list.length) {
          this.menuList = data.list
        }
      })
    },

    transformChartData(list) {
      if (list && list.length) {
        return list.map((item) => {
          return {
            x: item.title,
            y: Number(item.value),
          }
        })
      }
      return []
    },
    editMenu() {
      this.$refs.addMenu.openDialog()
    },
    editMenuSuccess() {
      this.getHotMenu()
    },
    // 监听中间统计数据tab和日期切换
    middleTabChange(key) {
      this.middleDataType = key
      this.getMiddleStatisticsData()
    },
    changeMiddleTime(type) {
      this.middleTimeType = type
      this.getMiddleStatisticsData()
    },
    // 跳转链接 new_blank-（打开新页面）new_tab- 打开新标签
    goUrl(type, url) {
      if (type == 'new_blank') {
        window.open(url)
      }
      if (type == 'new_tab') {
        if (url.indexOf('#') != -1) {
          url = url.split('#')[1]
        }
        this.$router.push(url)
      }
    },
    // 展开配置选项
    basicDataFold() {
      this.showBasicData = !this.showBasicData
    },
      //是否展示删除老版业务提示
      getCloseOldShow(){
          this.request(indexPlatformApi.closeOldShow).then((data) => {
              this.isShow = data.isShow
          })
      },
      //删除老版商城和餐饮
      closeOld() {
          var title = '';
          var content = '';
          title = '温馨提示';
          content = '您好，旧版餐饮和商城已经停止维护，为了更好的用户体验，欢迎大家使用新版商城和餐饮，如需关闭旧版餐饮和商城，请点击“我已知晓，永久关闭”';
          var that = this;
          var second = 30;
          const modal=this.$confirm({
              title: title,
              content: content,
              okText: '倒计时'+second+'s）',
              // okText: '永久关闭（'+second+'s）',
              okType: 'primary',
              cancelText: '我再想想',
              okButtonProps: {
                  props: { disabled: true },
              },
              onOk() {
                  that.request(indexPlatformApi.closeOld).then((res) => {
                      that.$message.success(that.L('关闭成功'))
                      that.isShow=0;
                  })
              },
              onCancel() {
              },
          });
          let i = second;
          let t = setInterval(function(){
              modal.update({
                okText: i > 0 ? '倒计时（' + i + 's）' : '我已知晓，永久关闭'
              })
              if(i===0){
                  clearInterval(t);
                  modal.update({
                      okButtonProps: {
                          props: { disabled: false },
                      }
                  })
              }
              i--;
          },1000);
          // 更新状态
      },
  },
}
</script>
<style lang="less" scoped>
    .transitionBoxs {
        min-height: 100px;
        position: fixed;
        z-index: 1024;
        top: 57%;
        right: 5%;
        border: 1px;
        margin-top: 5%;
    }
    .transition-box {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        height: 30px;
        border-radius: 4px;
        background-color: #409eff;
        color: #fff;
        padding: 10px 10px;
        box-sizing: border-box;
        width: 80px;
    }
    // 悬浮球位置
    .breathing_lamp {
        border-radius: 50%;
        width: 60px;
        height: 60px;
        padding: 15px;
        position: fixed;
        top: 85%;
        right: 5%;
        z-index: 1024;
    }
.container {
  padding: 0 0 40px 0;
  line-height: 30px;
  vertical-align: middle;
  .section-1 {
    .desc {
      margin: 0 10px;
    }
    .progress {
      width: 250px;
      display: inline-block;
      margin-left: 10px;
    }
    .settings {
      margin-top: 20px;
      padding-bottom: 20px;
      .name {
        color: #333333;
        font-size: 16px;
        margin-top: 30px;
        // margin-bottom: 5px;
      }
      .content {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        line-height: 24px;
        vertical-align: middle;
        flex-wrap: wrap;
        .item {
          width: 25%;
          padding: 10px 0 0 0;
          box-sizing: border-box;
          .col-1 {
            display: flex;
            align-items: flex-start;
            width: 100%;
            // justify-content: space-between;
            .icon {
              max-width: 24px;
              min-width: 24px;
              height: 24px;
              display: flex;
              align-items: center;
            }
            .item-title {
              color: #333333;
              // flex: 1;
            }
            .jiaocheng {
              min-width: 60px;
              max-width: 60px;
              text-align: right;
            }
          }

          .item-desc {
            font-size: 12px;
            margin-left: 24px;
            color: #777777;
          }
        }
      }
    }
  }
  .section-2 {
    .right {
      display: flex;
    }
  }
  .section-4 {
    .todo-list {
      .col {
        margin-top: 20px;
        padding: 0 10px;
        cursor: pointer;
        line-height: 30px;
        vertical-align: middle;
        .name {
          color: #999999;
          font-size: 14px;
        }
        .count {
          color: #1890ff;
          font-size: 24px;
          font-weight: bold;
          margin-top: 4px;
        }
      }
    }
  }
  .section-5 {
    .menu-list {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
      .col {
        width: 16%;
        margin-top: 20px;
        padding: 10px;
        box-sizing: border-box;
        cursor: pointer;
        line-height: 30px;
        vertical-align: middle;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        .icon {
          width: 40px;
          height: 40px;
          background-color: #f4f4f4;
          border-radius: 2px;
          img {
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
        }
      }
    }
  }
}
.color-red {
  color: red;
}
.color-green {
  color: green;
}
.color-blue {
  color: #1890ff;
}
.pointer {
  cursor: pointer;
}
.emphasize {
  font-weight: bold;
  color: #333333;
  font-size: 16px;
}
.flex-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 30px;
  vertical-align: middle;
}
.section {
  margin-top: 20px;
}
.margin-top-10 {
  margin-top: 10px;
}
.loading {
  text-align: center;
  padding: 100px;
}
.no-data {
  color: #999999;
  margin-top: 20px;
  text-align: center;
}
.tooltip {
  padding: 0 10px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  .col {
    margin: 8px 0;
    .title {
      font-size: 15px;
      color: rgba(255, 255, 255, 1);
      font-weight: bold;
    }
  }
}

.sub-comments-leave-active,
.sub-comments-enter-active {
  transition: all 0.2s;
}
.sub-comments-enter,
.sub-comments-leave-to {
  max-height: 0;
  opacity: 0;
}
.sub-comments-enter-to,
.sub-comments-leave {
  max-height: 1000px;
  opacity: 1;
}
</style>