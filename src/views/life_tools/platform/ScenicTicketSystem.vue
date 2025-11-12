<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <!-- 图表的展示 -->
    <a-row :gutter="24" style="margin-top: 30px">
      <a-col :sm="24" :md="12" :xl="4" style="padding: 0">
        <chart-card title="订单总数" :total="getStatisticsList.count_order" style="border: 1px solid #bbb9b9">
          <template slot="action">
            <a-tooltip>
              <template slot="title">
                总订单-退款订单-待付款订单-已取消订单
              </template>
              <a-icon type="exclamation-circle" />
            </a-tooltip>
          </template>
          <template slot="footer">
            今日订单<span class="ml-5">{{ getStatisticsList.today_count_order }}</span></span>
          </template>
        </chart-card>
      </a-col>
       <a-col :xl="1" ></a-col>
      <a-col :sm="24" :md="12" :xl="4"  style="padding: 0">
        <chart-card title="订单总金额" :total="getStatisticsList.price_order" style="border: 1px solid #bbb9b9">
          <template slot="action">
            <a-tooltip>
              <template slot="title">
                总订单金额-退款金额-待付款金额-已取消金额
              </template>
              <a-icon type="exclamation-circle" />
            </a-tooltip>
          </template>
          <template slot="footer">
            今日金额<span class="ml-5">{{ getStatisticsList.today_price_order }}</span></span>
          </template>
        </chart-card>
      </a-col>
       <a-col :xl="1" ></a-col>
      <a-col :sm="24" :md="12" :xl="4" style="padding: 0">
        <chart-card title="退款总金额" :total="getStatisticsList.price_back_order" style="border: 1px solid #bbb9b9">
          <template slot="action">
            <a-tooltip>
              <template slot="title">
                不包含退款中金额
              </template>
              <a-icon type="exclamation-circle" />
            </a-tooltip>
          </template>
          <template slot="footer">
            今日退款<span class="ml-5">{{ getStatisticsList.today_price_back_order }}</span></span>
          </template>
        </chart-card>
      </a-col>
       <a-col :xl="1" ></a-col>
      <a-col :sm="24" :md="12" :xl="4" style="padding: 0" v-if="systemType ==='scenic'">
        <chart-card title="现金总金额" :total="getStatisticsList.cash_order" style="border: 1px solid #bbb9b9">
          <template slot="action">
            <a-tooltip>
              <template slot="title">
                现金总金额
              </template>
              <a-icon type="exclamation-circle" />
            </a-tooltip>
          </template>
          <template slot="footer">
            今日现金支付<span class="ml-5">{{ getStatisticsList.today_cash_order }}</span>
          </template>
        </chart-card>
      </a-col>
       <a-col :xl="1" ></a-col>
      <a-col :sm="24" :md="12" :xl="4" style="padding: 0" v-if="systemType ==='scenic'">
        <chart-card title="票付通总金额" :total="getStatisticsList.pft_order_price" style="border: 1px solid #bbb9b9">
          <template slot="action">
            <a-tooltip>
              <template slot="title">
                票付通总金额
              </template>
              <a-icon type="exclamation-circle" />
            </a-tooltip>
          </template>
          <template slot="footer">
            今日票付通金额<span class="ml-5">{{ getStatisticsList.today_pft_order_price }}</span>
          </template>
        </chart-card>
      </a-col>
    </a-row><br>

    <!-- tabs标签页切换 -->
    <div v-if="systemType == 'scenic'">
      <a-tabs v-model="tabsKey" @change="callback" size="large">
      <a-tab-pane v-for="item in tabsScenic" :key="item.id" :tab="item.title"></a-tab-pane>
    </a-tabs>
    </div>
    <!-- tabs标签页切换 -->
    <div v-if="systemType == 'sports'">
      <a-tabs v-model="tabsKey" @change="callback" size="large">
      <a-tab-pane v-for="item in tabsSports" :key="item.id" :tab="item.title"></a-tab-pane>
    </a-tabs>
    </div>
    <!-- 表格的展示与搜索 -->
    <a-row style="margin-top:15px;">
      <a-col :span="24">
        <a-input-group compact>

          <div v-if="tabsKey != 1">
            <label style="line-height: 30px;">下单日期：</label>
            <a-range-picker @change="selectTableDate" />
          </div>
          <div v-if="tabsKey ==1">
            <label style="line-height: 30px;">日期：</label>
            <a-select :defaultValue="queryParams.time_type" style="width: 130px;" @change="(e)=>{queryParams.time_type = e;}">
            <a-select-option v-for="(item,index) in order_date_type" :key="item.key">
              {{ item.value }}
            </a-select-option>
            </a-select>
            <a-range-picker @change="selectTableDate" />
          </div>

          <label style="line-height: 30px;margin-left: 10px;">状态：</label>
          <a-select v-if="tabsKey != 1" :value="queryParams.status" @change="verifyTypeChange" style="width: 100px;">
            <a-select-option v-for="(item,index) in verifyType" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
          <a-select v-if="tabsKey == 1" :value="queryParams.status" @change="verifyTypeChange" style="width: 130px;">
            <a-select-option v-for="(item,index) in secondary_verifyType" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
          

          <label v-if="tabsKey != 1" style="line-height: 30px;margin-left: 10px;">类型：</label>
          <a-select v-if="tabsKey != 1" :value="queryParams.ticket_type" @change="typeChange" style="width: 150px;">
            <a-select-option v-for="(item,index) in typeList" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>

          <label v-if="tabsKey != 1" style="line-height: 30px;margin-left: 10px;">支付方式：</label>
          <a-select v-if="tabsKey != 1" :value="queryParams.pay_type" @change="cancelTypeChange" style="width: 100px;">
            <a-select-option v-for="(item,index) in payTypeList" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>

          <!-- 订单号搜索 -->
          <a-select v-if="tabsKey != 1" :value="queryParams.search_type" @change="selectSearchBy" style="width: 150px; margin-left:20px;">
            <a-select-option v-for="(item,index) in searchBy" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
          <a-select v-if="tabsKey == 1" :value="queryParams.search_type" @change="selectSearchBy" style="width: 150px; margin-left:20px;">
            <a-select-option v-for="(item,index) in secondary_searchBy" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>

          <a-input
            style="width: 220px"
            :placeholder="'请输入'+searchTablePla"
            :value="queryParams.keywords"
            @change="keywordsChange" />

          <a-button type="primary" @click="searchTableBtn" style="margin-left: 10px;">搜索</a-button>
          <a-dropdown style="width: 80px;margin-left: 10px;float: right;">
            <a-menu slot="overlay" @click="onTableExport">
              <a-menu-item :key="index" v-for="(item, index) in exportPeriod">{{ item.value }}</a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px" type="primary"> 导出</a-button>
          </a-dropdown>
        </a-input-group>
      </a-col>
    </a-row><br>
    <a-table
      v-if="tabsKey == 0"
      style="background: #ffffff"
      :columns="columns"
      rowKey="order_id"
      :data-source="dataList"
      @change="changePage"
      :pagination="pagination">

      <!-- 操作 -->
      <span slot="operation" slot-scope="text, record" >
        <a-button type="link" @click="onDetail(record)">
          详情
        </a-button>
      </span>

    </a-table>
    <a-table
      v-if="tabsKey == 1"
      style="background: #ffffff"
      :columns="columns_secondaryCard"
      rowKey="order_id"
      :data-source="dataList"
      @change="changePage"
      :pagination="pagination">
      <span slot="tools_title" slot-scope="text, record">
            <a-tooltip trigger="hover">
              <template slot="title">{{ text }}</template>
                {{ record.tools_sub_title?record.tools_sub_title: record.tools_title}}
            </a-tooltip>
        </span>
        <span slot="numTitle">
        数量
        <a-tooltip trigger="hover">
          <template slot="title">订单总数量：{{ all_num }}</template>
          <a-icon class="ml-10" type="question-circle" />
        </a-tooltip>
      </span>
            <span slot="priceTitle">
        总价
        <a-tooltip trigger="hover">
          <template slot="title">订单总金额：{{ all_price }}</template>
          <a-icon class="ml-10" type="question-circle" />
        </a-tooltip>
      </span>
      <!-- 操作 -->
      <span slot="operation" slot-scope="text, record" >
        <a-button type="link" @click="onDetail(record)">
          详情
        </a-button>
      </span>

    </a-table>
    <export-add ref="ExportAddModal" :exportUrl="exportUrl" :queryParam="statisticsExportParams" />

    <ticket-service-detail @agree="agree" :type="tabsKey == 0?1:2" :showModal="showModal" :modalDetail="modalDetail" @handleCancel="handleCancel" @handleOk="handleOk"></ticket-service-detail>
  </div>
</template>

<script>
    import lifeToolsPlatformApi from '@/api/life_tools/platform/index'
    import ExportAdd from '@/views/common/export/ExportAdd.vue'
    import { ChartCard, MiniArea } from '@/components'
    import ticketServiceDetail from './modules/ticketServiceDetail'
import clearVue from '../../foodshop/storestaff/cashier/cashier_routes/clear.vue'
    export default {
        components: {
          ExportAdd,
          ChartCard,
          MiniArea,
          ticketServiceDetail
        },
        data () {
            return {
              timer: null,
              systemType: 'scenic', // 系统的类型
              showModal: false, // 控制弹窗的显隐
              modalDetail: {}, // 弹窗的详情

              // 图表的数据
              chartsMoney: [{ x: '2022-02-05', y: 10 }, { x: '2022-02-06', y: 20 }, { x: '2022-02-07', y: 40 }, { x: '2022-02-08', y: 30 }, { x: '2022-02-09', y: 10 }],
              // 导出的周期
              exportPeriod: [
                {
                  key: 0,
                  value: '按日导出'
                },
                {
                  key: 1,
                  value: '按月导出'
                },
                {
                  key: 2,
                  value: '按年导出'
                },
                {
                  key: 3,
                  value: '导出订单'
                }

              ],
              order_date_type: [
                {
                  key: 1,
                  value: '下单时间'
                },
                {
                  key: 2,
                  value: '过期时间'
                },
              ],
              exportUrl: lifeToolsPlatformApi.ticketSystemExport, // 导出的地址

              // 列表的输入数据
              queryParams: {
                type: 'scenic',
                  search_type: 1, // 选择的订单号
                  keywords: '', // 输入的订单号
                  start_date: '', // 开始时间
                  end_date: '', // 结束时间
                  status: -1, // 状态
                  pay_type: 'all', // 核销类型
                  ticket_type: 0 // 票的类型

              },
              statisticsExportParams: {}, // 统计导出参数
                // 图表的搜索对象
                chartsParams: {
                    start_date: '',
                    end_date: ''
                },
                getStatisticsList: {
                  'all_count': 100, // 充值总笔数
                  'today_count': 120, // 今日笔数
                  'all_money': 130, // 充值总金额
                  'today_money': 120, // 今日金额
                  'all_user': 133, // 充值总人数
                  'today_user': 12, // 今日人数
                  'all_refund': 34, // 退款总金额
                  'today_refund': 5464 // 今日退款金额
                }, // 统计数据展示

                searchBy: [
                  {
                    key: 1,
                    value: '订单号'
                  },
                  {
                    key: 2,
                    value: '景区|场馆|课程名'
                  },
                  {
                    key: 3,
                    value: '门票名称'
                  },
                  {
                      key: 4,
                      value: '手机号'
                  },
                  {
                      key: 5,
                      value: '用户昵称'
                  }
                ],
                secondary_searchBy: [
                  {
                    key: 1,
                    value: '订单号'
                  },
                  {
                    key: 2,
                    value: '昵称'
                  },
                  {
                    key: 3,
                    value: '手机号'
                  },
                  {
                      key: 4,
                      value: '次卡名称'
                  },
                  {
                      key: 5,
                      value: '景区名称'
                  }
                ],
                searchTablePla: '', // 订单号的描述

                // 状态的选择列表
                verifyType: [
                    {
                        key: -1,
                        value: '全部'
                    },
                    {
                        key: 10,
                        value: '待付款'
                    },
                    {
                        key: 20,
                        value: '待核销'
                    },
                    {
                        key: 30,
                        value: '已核销'
                    },
                    {
                        key: 50,
                        value: '已退款'
                    },
                    {
                        key: 70,
                        value: '已过期'
                    },
                    {
                        key: 60,
                        value: '已取消'
                    },
                    {
                        key: 45,
                        value: '售后中'
                    }
                ],
                secondary_verifyType: [
                  {
                        key: -1,
                        value: '全部'
                    },
                    {
                        key: 10,
                        value: '未支付'
                    },
                    {
                        key: 20,
                        value: '已支付'
                    },
                    {
                        key: 30,
                        value: '已核销'
                    },
                    {
                        key: 40,
                        value: '已完成'
                    },
                    {
                        key: 50,
                        value: '退款申请中'
                    },
                    {
                        key: 51,
                        value: '已退款'
                    },
                     {
                        key: 60,
                        value: '未付款已过期'
                    },
                    {
                        key: 70,
                        value: '已付款已过期'
                    }
                ],
                // 核销类型的列表
                payTypeList: [
                  {
                    key: 'all',
                    value: '全部'
                  },
                  {
                    key: 'wechat',
                    value: '微信'
                  },
                  {
                    key: 'alipay',
                    value: '支付宝'
                  },
                  {
                    key: 'offline',
                    value: '现金支付'
                  },
                  {
                    key: 'balance',
                    value: '余额支付'
                  }
                ],

                // 查询类型
                typeList: [
                  {
                    key: 0,
                    value: '全部'
                  },
                  {
                    key: 1,
                    value: '团体票'
                  },
                  {
                    key: 2,
                    value: '普通门票'
                  },
                  {
                    key: 3,
                    value: '票付通门票'
                  }
                ],

                // 类型
                dataList: [],
                pagination: {
                    pageSize: 10,
                    total: 0,
                    current: 1,
                    page: 1
                },
                columns: [{
                        title: this.L('订单号'),
                        dataIndex: 'orderid'
                    },
                    {
                        title: this.L('景区名称'),
                        dataIndex: 'title'
                    },
                    {
                        title: this.L('门票名称'),
                        dataIndex: 'ticket_title'
                    },
                    {
                        title: this.L('数量'),
                        dataIndex: 'num'
                    },
                    {
                        title: this.L('总价'),
                        dataIndex: 'total_price'
                    },
                    {
                        title: this.L('类型'),
                        dataIndex: 'ticket_type'
                    },
                    {
                        title: this.L('用户昵称'),
                        dataIndex: 'nickname'
                    },
                    {
                        title: this.L('手机号'),
                        dataIndex: 'phone'
                    },
                    {
                        title: this.L('购买平台'),
                        dataIndex: 'buy_type'
                    },
                    {
                        title: this.L('下单时间'),
                        dataIndex: 'add_time_text'
                    },
                    {
                        title: this.L('支付方式'),
                        dataIndex: 'pay_type_text'
                    },
                    {
                        title: this.L('状态'),
                        dataIndex: 'order_status_text'
                    },
                    {
                        title: this.L('操作'),
                        dataIndex: 'operation',
                         scopedSlots: {
                            customRender: 'operation'
                        }
                    }
                ],
                tabsScenic: [{id: 0,title:'景区门票'},{id: 1,title:'景区次卡'}],
                tabsSports: [{id: 0,title:'体育门票'},{id: 1,title:'体育次卡'}],
                tabsKey: 0,
                columns_secondaryCard:[
                {
                    title: '订单号',
                    dataIndex: 'orderid',
                    key: 'orderid',
                },
                {
                    title: '次卡名称',
                    dataIndex: 'card_title',
                    key: 'card_title',
                },
                {
                    title: '景区名称',
                    dataIndex: 'tools_title',
                    key: 'tools_title',
                    scopedSlots: { customRender: 'tools_title' },
                },
                {
                    title: '用户昵称',
                    dataIndex: 'nickname',
                    key: 'nickname',
                },
                {
                    title: '用户手机号',
                    dataIndex: 'phone',
                    key: 'phone',
                },
                {
                    dataIndex: 'num',
                    slots: { title: 'numTitle' },
                    key: 'num',
                },
                {
                    dataIndex: 'total_price',
                    slots: { title: 'priceTitle' },
                    key: 'total_price',
                },
                {
                    title: '订单状态',
                    dataIndex: 'order_status_val',
                    key: 'order_status_val',
                },
                {
                    title: '过期时间',
                    dataIndex: 'out_time',
                    key: 'out_time',
                },
                {
                    title: '下单时间',
                    dataIndex: 'add_time',
                    key: 'add_time',
                },
                {
                    title: '操作',
                    key: 'operation',
                    scopedSlots: { customRender: 'operation' },
                }
            ],
            all_num: 0,
            all_price: 0
          }
        },
        created () {
            
        },
        watch: {
          $route: {
            handler (to, from) {
              const paramsRrouter = to.path
              this.tabsKey = 0;
              if (paramsRrouter.indexOf('scenic') != -1) {
                console.log('-------------scenic--------')
                this.systemType = 'scenic'
                // 查询类型
                this.typeList = [
                  {
                    key: 0,
                    value: '全部'
                  },
                  {
                    key: 1, 
                    value: '团体票'
                  },
                  {
                    key: 2,
                    value: '普通门票'
                  },
                  {
                    key: 3,
                    value: '票付通门票'
                  }
                ]
                this.searchBy = [
                  {
                    key: 1,
                    value: '订单号'
                  },
                  {
                    key: 2,
                    value: '景区'
                  },
                  {
                    key: 3,
                    value: '门票名称'
                  },
                  {
                      key: 4,
                      value: '手机号'
                  },
                  {
                      key: 5,
                      value: '用户昵称'
                  }
                ]
                this.columns.map((val, index) => {
                  if (val.dataIndex === 'title') {
                    this.columns[index].title = this.L('景区名称')
                  }
                })
                this.queryParams = {
                  type: 'scenic',
                  search_type: 1, // 选择的订单号
                  keywords: '', // 输入的订单号
                  start_date: '', // 开始时间
                  end_date: '', // 结束时间
                  status: -1, // 状态
                  pay_type: 'all', // 核销类型
                  ticket_type: 0 // 票的类型

                }
              }
              if (paramsRrouter.indexOf('sports') != -1) {
                console.log('-------------sports--------')
                this.systemType = 'sports'
                this.typeList = [
                  {
                    key: 'sports',
                    value: '全部'
                  },
                  {
                    key: 'stadium',
                    value: '体育馆'
                  },
                  {
                    key: 'course',
                    value: '课程'
                  }
                ]
                this.searchBy = [
                  {
                    key: 1,
                    value: '订单号'
                  },
                  {
                    key: 2,
                    value: '场馆|课程名'
                  },
                  {
                    key: 3,
                    value: '门票名称'
                  },
                  {
                      key: 4,
                      value: '手机号'
                  },
                  {
                      key: 5,
                      value: '用户昵称'
                  }
                ]
                this.columns.map((val, index) => {
                  if (val.dataIndex === 'title') {
                    this.columns[index].title = this.L('场馆/课程名称')
                  }
                })
                this.queryParams = {
                  type: 'sports',
                  search_type: 1, // 选择的订单号
                  keywords: '', // 输入的订单号
                  start_date: '', // 开始时间
                  end_date: '', // 结束时间
                  status: -1, // 状态
                  pay_type: 'all', // 核销类型
                  ticket_type: 'sports' // 票的类型

                }
              }
              this.getData()
              this.getStatistics()
            },
            immediate: true
          }
        },
        beforeRouteLeave (to, from, next) {
          this.getTimer()
          next()
        },
        methods: {
          //tabs标签页切换
          callback(e){
            console.log(e);
            if(e == 1){
              this.queryParams.time_type = 1
            }else{
              delete this.queryParams.time_type
            }
            this.getData();
          },
          // 点击列表详情
          onDetail (item) {
            console.log(item, '--------打印item--------------')
            const params = {
              order_id: item.order_id
            }
            let url = lifeToolsPlatformApi.getOrderDetail
                if(this.tabsKey == 1){
                  url = lifeToolsPlatformApi.getCardOrderDetail
                }
            this.request(url, params).then((res) => {
              console.log(res, '------打印列表详情----------')
              this.modalDetail = res
            })

            this.showModal = true
          },
          //点击次卡退款
          agree(e){
            this.request(lifeToolsPlatformApi.CardOrderBack, {order_id: e}).then((res) => {
               this.showModal = false
                this.$message.success('退款成功')
                this.getData()
            })
          },
          // 点击取消弹窗
          handleCancel () {
            this.showModal = false
          },
          // 点击确认弹窗
          handleOk (e, value, mer_id) {
            if (e == 'verification') {
              // 点击核销
              const params = {
                code: value.code,
                mer_id
              }
              this.request(lifeToolsPlatformApi.orderVerification, params).then((res) => {
                this.showModal = false
                this.$message.success('核销成功')
                this.getData()
              })
            } else {
              // 点击退款
              const params = {
                detail_id: value.detail_id,
                reason: '退款'
              }
              this.request(lifeToolsPlatformApi.orderBack, params).then((res) => {
                this.showModal = false
                this.$message.success('退款成功')
                this.getData()
              })
            }
          },

          // 获取数据统计
          getStatistics () {
            var params = {}
            if (this.systemType === 'scenic') {
              params.type = 'scenic'
            } else {
              params.type = 'sports'
            }
            this.request(lifeToolsPlatformApi.getAtatisticsInfo, params).then((res) => {
              this.getStatisticsList = res // 数据统计数据
              this.getTimer()
            })
          },

          getTimer () {
            if (this.timer) {
                clearTimeout(this.timer)
                this.timer = null
              }
              this.timer = setTimeout(() => {
                this.getStatistics()
                this.getData()
              }, 10000)
          },

            keywordsChange (e) {
                this.queryParams.keywords = e.target.value
            },

            // 获取表格列表数据
            getData () {
                this.queryParams.pageSize = this.pagination.pageSize
                this.queryParams.page = this.pagination.current
                let url = lifeToolsPlatformApi.orderList
                if(this.tabsKey == 1){
                  url = lifeToolsPlatformApi.getCardOrderList
                }
                this.request(url, this.queryParams).then((res) => {
                    this.pagination.total = res.total
                    console.log(res, '------------表格列表数据-----------------')
                    this.dataList = res.data
                    if(this.tabsKey == 1){
                      this.all_num   = res.all_num
                      this.all_price = res.all_price
                    }
                    this.getTimer()
                })
            },
            changePage (page, pageSize) {
                this.pagination.current = page.current
                this.getData()
            },

            // 图表选择日期
            selectChartsDate (value, dateString) {
                this.chartsParams.start_date = dateString[0]
                this.chartsParams.end_date = dateString[1]
            },
            // 表格的选择日期
            selectTableDate (value, dateString) {
                this.queryParams.start_date = dateString[0]
                this.queryParams.end_date = dateString[1]
            },

            // 点击图表的搜索
            searchChartsBtn () {
                console.log('点击图表搜索')
                this.getStatistics()
            },
            // 点击表格的搜索
            searchTableBtn () {
                console.log('点击表格搜索', this.queryParams)
                this.getData()
            },

            // 点击表格的导出
            onTableExport (e) {
                console.log('点击图表导出', e, this.queryParams)
                const params = { ...this.queryParams, export_type: e.key }
                // this.statisticsExportParams = params
                // this.exportUrl = lifeToolsPlatformApi.ticketSystemExport
                // console.log(params)
                // this.$nextTick(() => {
                //   this.$refs.ExportAddModal.exports()
                // })
                if(this.tabsKey == 0 ){
                  this.request(lifeToolsPlatformApi.ticketSystemExport, params).then((res) => {
                  console.log(res, '-----------导出列表数据----------')
                  window.location.href = `${res.file_url}`
                })
                }else{
                  this.request(lifeToolsPlatformApi.cardSystemExport, params).then((res) => {
                  window.location.href = `${res.file_url}`
                })
                }
                
            },

            selectSearchBy (val) {
                console.log(val)
                this.queryParams.search_type = val
                this.searchBy.map(value => {
                    if (val === value.key) {
                      if (val === 0) {
                        this.searchTablePla = ''
                      } else {
                        this.searchTablePla = value.value
                      }
                    }
                })
            },

            // 核销类型
            cancelTypeChange (val) {
                console.log(val)
                this.queryParams.pay_type = val
            },

            // 类型
            typeChange (val) {
              console.log(val)
                this.queryParams.ticket_type = val
                if (this.systemType === 'sports') {
                  this.queryParams.type = val
                }
            },

            // 状态
            verifyTypeChange (val) {
              console.log(val)
                this.queryParams.status = val
            }

        }
    }
</script>

<style>
    .card_tab {
        text-align: center;
        width: 140px;
        float: left;
        margin: 0 0 20px 0;
    }

    .card_tab span {
        color: #000000;
        font-size: 15px;
        padding: 7px 10px;
    }

    .card_tab span.on {
        color: #1890ff;
        border-bottom: 2px solid #1890ffcc;
    }
</style>
