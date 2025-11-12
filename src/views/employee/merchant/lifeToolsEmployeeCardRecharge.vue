<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <!-- 头部tab切换 -->
    <a-row>
      <div class="card_tab">
        <router-link to="/merchant/merchant.life_tools/employee_card">
          <span>商家员工卡列表</span>
        </router-link>
      </div>
      <div class="card_tab">
        <router-link to="/merchant/merchant.life_tools/employeeCardConsume">
          <span>核销列表</span>
        </router-link>
      </div>
      <div class="card_tab">
        <span class="on">充值记录</span>
      </div>
      <div class="card_tab">
        <router-link to="/merchant/merchant.life_tools/employeeBillList">
          <span>财务报表</span>
        </router-link>
      </div>
      <div class="card_tab">
          <router-link to='/merchant/merchant.life_tools/employeeClearScoreList'>
              <span>积分清零记录</span>
          </router-link>
      </div>
    </a-row>

    <!-- 图表的搜索 -->
    <a-row style="margin-top:10px;">
      <a-col :span="24">
        <a-input-group compact>
          <label style="line-height: 30px;margin-left: 15px;">选择日期：</label>
          <a-range-picker @change="selectChartsDate" />
          <a-button type="primary" @click="searchChartsBtn" style="width: 80px;margin-left: 10px;">搜索</a-button>
          <a-dropdown style="width: 80px;margin-left: 10px;float: right;">
            <a-menu slot="overlay" @click="onChartsExport">
              <a-menu-item :key="index" v-for="(item, index) in exportPeriod">{{ item.value }}</a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px" type="primary"> 导出 </a-button>
          </a-dropdown>

        </a-input-group>
      </a-col>
    </a-row>
    <!-- 图表的展示 -->
    <a-row :gutter="24" style="margin-top: 30px">
      <a-col :sm="24" :md="12" :xl="6" >
        <chart-card title="充值总笔数" :total="getStatisticsList.all_count" style="border: 1px solid #bbb9b9">
          <template slot="action">
            <a-tooltip>
              <template slot="title">
                充值总笔数=充值笔数-退款笔数
              </template>
              <a-icon type="exclamation-circle" />
            </a-tooltip>
          </template>
          <!-- <div>
            <mini-area :data="chartsMoney" />
          </div> -->
          <template slot="footer">
            今日笔数<span class="ml-5">{{ getStatisticsList.today_count }}</span></span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" >
        <chart-card title="充值总金额" :total="getStatisticsList.all_money" style="border: 1px solid #bbb9b9">
          <template slot="action">
            <a-tooltip>
              <template slot="title">
                充值总金额=充值金额-退款金额
              </template>
              <a-icon type="exclamation-circle" />
            </a-tooltip>
          </template>
          <!-- <div>
            <mini-area :data="chartsMoney" />
          </div> -->
          <template slot="footer">
            今日充值金额<span class="ml-5">{{ getStatisticsList.today_money }}</span></span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6">
        <chart-card title="充值人数" :total="getStatisticsList.all_user" style="border: 1px solid #bbb9b9">
          <template slot="action">
            <a-tooltip>
              <template slot="title">
                充值人数
              </template>
              <a-icon type="exclamation-circle" />
            </a-tooltip>
          </template>
          <!-- <div>
            <mini-area :data="chartsMoney" />
          </div> -->
          <template slot="footer">
            今日充值人数<span class="ml-5">{{ getStatisticsList.today_user }}</span></span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" >
        <chart-card title="退款金额" :total="getStatisticsList.all_refund" style="border: 1px solid #bbb9b9">
          <template slot="action">
            <a-tooltip>
              <template slot="title">
                退款金额
              </template>
              <a-icon type="exclamation-circle" />
            </a-tooltip>
          </template>
          <!-- <div>
            <mini-area :data="chartsMoney" />
          </div> -->
          <template slot="footer">
            今日退款金额<span class="ml-5">{{ getStatisticsList.today_refund }}</span>
          </template>
        </chart-card>
      </a-col>
    </a-row><br>

    <!-- 表格的展示与搜索 -->
    <a-row style="margin-top:15px;">
      <a-col :span="24">
        <a-input-group compact>
          <a-select :value="queryParams.search_type" @change="selectSearchBy" style="width: 100px;">
            <a-select-option v-for="(item,index) in searchBy" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
          <a-input
            style="width: 220px"
            :placeholder="'请输入'+searchTablePla"
            :value="queryParams.keyword"
            @change="keywordsChange" />

          <label style="line-height: 30px;margin-left: 15px;">选择日期：</label>
          <a-range-picker @change="selectTableDate" />

          <label style="line-height: 30px;margin-left: 15px;">核销类型：</label>
          <a-select :value="queryParams.pay_type" @change="cancelTypeChange" style="width: 150px;">
            <a-select-option v-for="(item,index) in typeList" :key="item.key">
              {{ item.title }}
            </a-select-option>
          </a-select>

          <label style="line-height: 30px;margin-left: 15px;">状态：</label>
          <a-select :value="queryParams.status" @change="verifyTypeChange" style="width: 100px;">
            <a-select-option v-for="(item,index) in verifyType" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>

          <a-button type="primary" @click="searchTableBtn" style="width: 80px;margin-left: 10px;">搜索</a-button>
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
      style="background: #ffffff"
      :columns="columns"
      rowKey="order_id"
      :data-source="dataList"
      @change="changePage"
      :pagination="pagination">

      <!-- 操作 -->
        <span slot="operation" slot-scope="text, record" v-show="record.refund_btn == 1">
<!--        <a @click="onRefund(record)">退款</a>-->
        <a-popconfirm title="确认退款？" ok-text="确定" cancel-text="取消" @confirm="onRefund(record)">
           <a>退款</a>
        </a-popconfirm>
      </span>

    </a-table>
    <export-add ref="ExportAddModal" :exportUrl="exportUrl" :queryParam="statisticsExportParams" />
  </div>
</template>

<script>
    import lifeMerchantApi from '@/api/employee/merchant/index'
    import ExportAdd from '@/views/common/export/ExportAdd.vue'
    import { ChartCard, MiniArea } from '@/components'
    export default {
        components: {
          ExportAdd,
          ChartCard,
          MiniArea
        },
        data () {
            return {
              // 图表的数据
              chartsMoney: [{ x: '2022-02-05', y: 10 }, { x: '2022-02-06', y: 20 }, { x: '2022-02-07', y: 40 }, { x: '2022-02-08', y: 30 }, { x: '2022-02-09', y: 10 }],
              // 导出的周期
              exportPeriod: [
                {
                  key: 'day',
                  value: '按日导出'
                },
                {
                  key: 'month',
                  value: '按月导出'
                },
                {
                  key: 'year',
                  value: '按年导出'
                }
              ],
              exportUrl: lifeMerchantApi.dataRechargeStatisticsExport, // 导出的地址

              // 列表的输入数据
              queryParams: {
                  search_type: 1, // 选择的订单号
                  keyword: '', // 输入的订单号
                  start_time: '', // 开始时间
                  end_time: '', // 结束时间
                  status: 0, // 状态
                  pay_type: 0 // 核销类型

              },
              statisticsExportParams: {}, // 统计导出参数
                // 图表的搜索对象
                chartsParams: {
                    start_time: '',
                    end_time: ''
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

                searchBy: [{
                    key: 1,
                    value: '订单号'
                  },
                  {
                    key: 2,
                    value: '卡号'
                  },
                  {
                    key: 3,
                    value: '姓名'
                  },
                  {
                    key: 4,
                    value: '手机号'
                  },
                    {
                        key: 5,
                        value: '会员身份'
                    },
                    {
                        key: 6,
                        value: '部门'
                    },
                    {
                        key: 7,
                        value: '标签'
                    }
                ],
                searchTablePla: '订单号', // 订单号的描述

                // 状态的选择列表
                verifyType: [
                    {
                        key: 0,
                        value: '全部'
                    },
                    {
                        key: 20,
                        value: '已充值'
                    },
                    {
                        key: 40,
                        value: '退款'
                    }
                ],
                // 核销类型的列表
                typeList: [],
                dataList: [],
                pagination: {
                    pageSize: 10,
                    total: 0,
                    current: 1,
                    page: 1
                },
                columns: [{
                        title: this.L('订单号'),
                        dataIndex: 'real_orderid'
                    },
                    {
                        title: this.L('卡号'),
                        dataIndex: 'card_number'
                    },
                    {
                        title: this.L('姓名'),
                        dataIndex: 'nickname'
                    },
                    {
                        title: this.L('手机号'),
                        dataIndex: 'phone'
                    },
                    {
                        title: this.L('身份部门'),
                        dataIndex: 'id_de'
                    },
                    {
                        title: this.L('充值金额'),
                        dataIndex: 'total_price'
                    },
                    {
                        title: this.L('账户剩余金额'),
                        dataIndex: 'card_money'
                    },
                    {
                        title: this.L('充值方式'),
                        dataIndex: 'pay_type_val'
                    },
                    {
                        title: this.L('充值时间'),
                        dataIndex: 'pay_time'
                    },
                    {
                        title: this.L('状态'),
                        dataIndex: 'order_status_val'
                    },
                    {
                        title: this.L('操作'),
                        dataIndex: 'operation',
                         scopedSlots: {
                            customRender: 'operation',
                        },
                    }
                ]
            }
        },
        created () {
            this.getData()
            this.getStatistics()
            this.getpay()
        },
        methods: {
          // 获取数据统计
          getStatistics () {
            const params = this.chartsParams
            this.request(lifeMerchantApi.dataRechargeStatistics, params).then((res) => {
              console.log(res, '-----------获取数据统计------------')
              this.getStatisticsList = res // 数据统计数据
            })
          },
          // 获取支付方式
          getpay () {
            this.request(lifeMerchantApi.paymentMode).then((res) => {
              var _this = this
              this.typeList = []
              console.log(res, '-----------获取支付方式------------')
              Object.keys(res).forEach(function (val) {
                console.log(val, res[val])

                _this.typeList.push({
                  title: res[val],
                  key: val
                })
              })
              this.queryParams.pay_type = this.typeList[0].key
            })
          },

            keywordsChange (e) {
                this.queryParams.keyword = e.target.value
            },

            // 获取表格列表数据
            getData () {
                this.queryParams.pageSize = this.pagination.pageSize
                this.queryParams.page = this.pagination.current
                this.request(lifeMerchantApi.getOrderList, this.queryParams).then((res) => {
                    this.pagination.total = res.total
                    console.log(res, '------------表格列表数据-----------------')
                    this.dataList = res.data
                })
            },
            changePage (page, pageSize) {
                this.pagination.current = page.current
                this.getData()
            },

            // 图表选择日期
            selectChartsDate (value, dateString) {
                this.chartsParams.start_time = dateString[0]
                this.chartsParams.end_time = dateString[1]
            },
            // 表格的选择日期
            selectTableDate (value, dateString) {
                console.log(value, dateString)
                this.queryParams.start_time = dateString[0]
                this.queryParams.end_time = dateString[1]
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

            // 点击图表的导出
            onChartsExport (e) {
                // console.log('点击统计导出', e)
                const params = { ...this.chartsParams, export_type: this.exportPeriod[e.key].key }
                this.statisticsExportParams = params
                this.exportUrl = lifeMerchantApi.dataRechargeStatisticsExport
                console.log(this.statisticsExportParams, this.exportUrl, '12313123')
                
                this.$nextTick(() => {
                  this.$refs.ExportAddModal.exports()
                })
            },
            // 点击表格的导出
            onTableExport (e) {
                console.log('点击图表导出', e, this.queryParams)
                const params = { ...this.queryParams, export_type: this.exportPeriod[e.key].key }
                this.statisticsExportParams = params
                this.exportUrl = lifeMerchantApi.dataRechargeOrderExport
                console.log(params)
                this.$nextTick(() => {
                  this.$refs.ExportAddModal.exports()
                })
                // this.request(lifeMerchantApi.dataRechargeOrderExport, params).then((res) => {
                //   console.log(res, '-----------导出列表数据----------')
                // })

            },

            selectSearchBy (val) {
                console.log(val)
                this.queryParams.search_type = val
                this.searchBy.map(value => {
                    if (val === value.key) {
                        this.searchTablePla = value.value
                    }
                })
            },

            // 核销类型
            cancelTypeChange (val) {
                console.log(val)
                this.queryParams.pay_type = val
            },

            // 状态
            verifyTypeChange (val) {
              console.log(val)
                this.queryParams.status = val
            },

            // 点击退款
            onRefund (record) {
              console.log(record)
              if (Number(record.card_money >= record.total_price)) {
                const params = {
                  order_id: record.order_id
                }
                this.request(lifeMerchantApi.refundMoney, params).then((res) => {
                    this.$message.success('退款成功')
                    this.getData()
                })
              } else {
                this.$message.error('账户余额不足退款')
              }
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
