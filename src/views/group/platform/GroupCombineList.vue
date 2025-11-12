<template>
  <div class="ant-pro-page-header-wrap-children-content mt-10">
    <a-card :bordered="false">
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="优惠组合">
          <a-card :bordered="false">
            <a-form layout="inline" class="form-content">
              <a-row :gutter="1">
                <a-col :md="4">
                  <a-form-item label="组合类型：">
                    <a-select style="width: 110px" default-value="queryParam.cat_id" v-model="queryParam.cat_id">
                      <a-select-option :value="item.cat_id" :key="item.cat_id" v-for="item in catArr">{{
                        item.cat_name
                      }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="10">
                  <a-form-item>
                    <a-select style="width: 110px" default-value="queryParam.time_type" v-model="queryParam.time_type">
                      <a-select-option value="start_time">开始时间</a-select-option>
                      <a-select-option value="end_time">结束时间</a-select-option>
                    </a-select>
                    <a-range-picker @change="dateOnChange" :allowClear="true" v-model="search_data">
                      <a-icon slot="suffixIcon" type="calendar" />
                    </a-range-picker>
                  </a-form-item>
                </a-col>
                <a-col :md="7">
                  <a-form-item label="手动搜索：">
                    <a-input
                      style="width: 235px"
                      allow-clear
                      v-model="queryParam.keyword"
                      placeholder="请输入优惠组合名称"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="3">
                  <a-button type="primary" icon="search" @click="searchBtn()" style="margin-right: 15px">查询</a-button>
                </a-col>
              </a-row>
            </a-form>
            <div class="message-suggestions-list-box">
              <div class="button-content">
                <router-link :to="{ path: '/group/platform.groupCombine/edit' }" slot="groupCombine">
                  <a-button type="primary">添加优惠组合</a-button>
                </router-link>
              </div>
              <a-table
                :columns="columns"
                :data-source="data"
                rowKey="combine_id"
                class="components-table-demo-nested"
                :pagination="pagination"
                @change="tableChange"
                style="min-height: 700px"
              >
                <span slot="detail_url" slot-scope="text">
                  <a @click="$refs.SeeH5QrcodeModal.showModal(text)" class="ant-btn-link pointer">查看二维码</a>
                </span>
                <span slot="start_time" slot-scope="text, record"> {{ text }}至{{ record.end_time }} </span>
                <span slot="can_use_day" slot-scope="text, record"> {{ text }}天 </span>
                <span slot="action" slot-scope="text, record">
                  <router-link
                    :to="{ path: '/group/platform.groupCombine/edit', query: { id: record.combine_id } }"
                    slot="groupCombine"
                  >
                    <a>编辑</a>
                  </router-link>
                  <span class="ml-10 mr-10">|</span>
                  <router-link
                    :to="{ path: '/group/platform.groupCombine/editRobot', query: { id: record.combine_id } }"
                    slot="groupCombine"
                  >
                    <a>机器人</a>
                  </router-link>
                  <span class="ml-10 mr-10">|</span>
                  <router-link
                    :to="{ path: '/group/platform.groupCombine/replyList', query: { id: record.combine_id } }"
                  >
                    <a>评论列表</a>
                  </router-link>
                </span>
              </a-table>
            </div>
          </a-card>
        </a-tab-pane>
        <a-tab-pane key="2" tab="优惠组合订单" force-render>
          <a-card :bordered="false">
            <a-form layout="inline" class="form-content">
              <a-row :gutter="3">
                <a-col :md="11">
                  <a-form-item>
                    <a-select
                      style="width: 110px"
                      default-value="orderQueryParam.time_type"
                      v-model="orderQueryParam.time_type"
                    >
                      <a-select-option value="add_time">下单时间</a-select-option>
                      <a-select-option value="pay_time">支付时间</a-select-option>
                    </a-select>
                    <a-range-picker @change="orderdateOnChange" :allowClear="true" v-model="search_data_order">
                      <a-icon slot="suffixIcon" type="calendar" />
                    </a-range-picker>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="10">
                  <a-form-item label="支付方式：">
                    <a-select
                      style="width: 200px"
                      default-value="orderQueryParam.pay_type"
                      v-model="orderQueryParam.pay_type"
                    >
                      <a-select-option :value="item.key" :key="item.key" v-for="item in payTypeArr">{{
                        item.name
                      }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="4" :span="8" :style="{ textAlign: 'right' }">
                  <a-button icon="download" @click="$refs.ExportAddModal.exports()">导出订单</a-button>
                </a-col>
              </a-row>
              <a-row :gutter="2">
                <a-col :md="11" :sm="12">
                  <a-form-item label="">
                    <a-input-group compact>
                      <a-select style="width: 110px" v-model="orderQueryParam.searchtype">
                        <a-select-option :value="item.key" :key="item.key" v-for="item in search_keyword">{{
                          item.value
                        }}</a-select-option>
                      </a-select>
                      <a-input style="width: 273px" allow-clear v-model="orderQueryParam.keyword" />
                    </a-input-group>
                  </a-form-item>
                </a-col>
                <a-col :md="3" :sm="12">
                  <a-button type="primary" icon="search" @click="searchOrderBtn()" style="margin-right: 15px"
                    >查询</a-button
                  >
                </a-col>
              </a-row>
            </a-form>
            <div class="message-suggestions-list-box">
              <a-table
                :columns="orderColumns"
                :data-source="orderList"
                rowKey="order_id"
                class="components-table-demo-nested"
                :pagination="orderPagination"
                @change="orderTableChange"
                style="min-height: 700px"
              >
                <span slot="combine_id" slot-scope="text, record">
                  优惠组合ID： {{ record.combine_id }} 优惠组合价： ￥{{ record.total_money }} 优惠组合名称：
                  {{ record.title }}
                </span>

                <span slot="add_time_str" slot-scope="text, record">
                  下单时间： {{ record.add_time_str }}
                  <span v-if="record.pay_time_str"> <br />付款时间： {{ record.pay_time_str }}</span>
                </span>

                <span slot="num" slot-scope="text, record">
                  数量： {{ record.num }} 总价： ￥{{ record.total_money }}
                </span>

                <span slot="phone" slot-scope="text, record">
                  用户名： {{ record.nickname }} <br />订单手机号： {{ record.phone }}
                </span>
                <span slot="action" slot-scope="text, record">
                  <a-button type="primary" @click="$refs.OrderDetailModal.show(record.order_id)">查看详情</a-button>
                </span>
              </a-table>
            </div>
          </a-card>
        </a-tab-pane>
      </a-tabs>
      <export-add ref="ExportAddModal" :exportUrl="exportUrl" :queryParam="orderQueryParam" />
      <see-h5-qrcode ref="SeeH5QrcodeModal" />
      <order-detail ref="OrderDetailModal" />
    </a-card>
  </div>
</template>

<script>
// import moment from 'moment'
import GroupPlatformApi from '@/api/group/platform'
import ExportAdd from '@/views/common/export/ExportAdd.vue'
import SeeH5Qrcode from '@/views/common/qrcode/SeeH5Qrcode.vue'
import OrderDetail from '../modules/OrderDetail.vue'
import path from '@/router/router-path'
import moment from 'moment'
import Vue from 'vue'
const data = []
export default {
  name: 'GroupCombineList',
  components: { ExportAdd, OrderDetail, SeeH5Qrcode },
  data() {
    return {
      catArr: [],
      treeData: [],
      exportUrl: GroupPlatformApi.exportCombineOrder,
      baseUrl: '/v20/public/platform/#',
      // 查询参数
      queryParam: {
        time_type: 'start_time',
        cat_id: '-1',
        start_time: '',
        end_time: '',
      },
      pagination: {
        pageSize: 10,
        total: 10,
        'show-total': (total) => `共 ${total} 条记录`,
        'show-quick-jumper': true,
      },
      editingKey: '',
      page: 1,
      // 表头
      columns: [
        {
          title: '编号',
          dataIndex: 'combine_id',
          width: '8%',
        },
        {
          title: '优惠组合名称',
          dataIndex: 'title',
          width: '15%',
        },
        {
          title: '优惠组合类型',
          dataIndex: 'cat_name',
          width: '12%',
        },
        {
          title: '查看二维码',
          dataIndex: 'detail_url',
          scopedSlots: {
            customRender: 'detail_url',
          },
          width: '10%',
        },
        {
          title: '销量',
          dataIndex: 'sell_count',
          width: '5%',
        },
        {
          title: '优惠组合活动时间',
          dataIndex: 'start_time',
          // sorter: true,
          width: '15%',
          scopedSlots: {
            customRender: 'start_time',
          },
        },
        {
          title: '优惠组合有效期',
          dataIndex: 'can_use_day',
          width: '12%',
          scopedSlots: {
            customRender: 'can_use_day',
          },
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: '5%',
          scopedSlots: {
            customRender: 'status',
          },
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '25%',
          scopedSlots: {
            customRender: 'action',
          },
        },
      ],
      data,
      search_data: [undefined, undefined],

      // 订单表头
      orderColumns: [
        {
          title: '订单编号',
          dataIndex: 'real_orderid',
          width: '15%',
        },
        {
          title: '优惠组合信息',
          dataIndex: 'combine_id',
          width: '15%',
          scopedSlots: {
            customRender: 'combine_id',
          },
        },
        {
          title: '订单信息',
          dataIndex: 'num',
          width: '15%',
          scopedSlots: {
            customRender: 'num',
          },
        },
        {
          title: '订单状态',
          dataIndex: 'status_str',
          width: '15%',
        },
        {
          title: '创建时间',
          dataIndex: 'add_time_str',
          // sorter: true,
          width: '15%',
          scopedSlots: {
            customRender: 'add_time_str',
          },
        },
        {
          title: '订单用户',
          dataIndex: 'phone',
          width: '15%',
          scopedSlots: {
            customRender: 'phone',
          },
        },
        {
          title: '订单有效期',
          dataIndex: 'can_use_end_time',
          width: '15%',
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '8%',
          scopedSlots: {
            customRender: 'action',
          },
        },
      ],
      payTypeArr: [], //支付方式
      orderList: [],
      orderQueryParam: {
        time_type: 'add_time',
        start_time: '',
        end_time: '',
        searchtype: 'real_orderid',
        pay_type: '-1',
      },
      orderPagination: {
        pageSize: 10,
        total: 10,
        'show-total': (total) => `共 ${total} 条记录`,
        'show-quick-jumper': true,
      },
      search_data_order: [undefined, undefined],
      search_keyword: [
        {
          key: 'real_orderid',
          value: '订单编号',
        },
        {
          key: 'title',
          value: '优惠组合名称',
        },
      ],
    }
  },
  created() {},
  activated() {
    this.getList()
    this.getCategoryList()
  },
  mounted() {
    this.getList()
    this.getCategoryList()
  },
  methods: {
    moment,
    // 获取列表信息
    getList() {
      this.queryParam['page'] = this.page
      this.request(GroupPlatformApi.groupCombineList, this.queryParam).then((res) => {
        this.data = res.list
        this.pagination.total = res.count
      })
    },
    // 获取订单列表信息
    getOrderList() {
      this.orderQueryParam['page'] = this.orderPage
      this.request(GroupPlatformApi.getGroupCombineOrderList, this.orderQueryParam).then((res) => {
        this.orderList = res.list
        this.orderPagination.total = res.count
      })
    },
    // 获取分类列表信息
    getCategoryList() {
      this.request(GroupPlatformApi.getGroupFirstCategorylist).then((res) => {
        var temp = {
          cat_id: '-1',
          cat_name: '全部',
        }
        var temp1 = {
          cat_id: '0',
          cat_name: '其他',
        }
        res.unshift(temp)
        res.push(temp1)
        this.catArr = res
        console.log(this.catArr, 'this.catArr')
      })
    },
    // 获取全部支付方式
    getpayMethodList() {
      this.request(GroupPlatformApi.getPayMethodList).then((res) => {
        var temp = {
          key: '',
          name: '余额支付',
        }
        res.unshift(temp)
        var temp = {
          key: '-1',
          name: '全部',
        }
        res.unshift(temp)
        this.payTypeArr = res
        console.log(this.payTypeArr, 'this.payTypeArr')
      })
    },
    // 查询
    searchBtn() {
      this.page = 1
      this.getList()
    },
    // 订单查询
    searchOrderBtn() {
      this.orderPage = 1
      this.getOrderList()
    },
    // 表格中变动  这里只针对页面页数切换
    tableChange(e, filters, sorter) {
      // 分页
      this.queryParam['pageSize'] = e.pageSize
      this.queryParam['page'] = e.current

      if (e.current && e.current > 0) {
        this.page = e.current
      }
      this.getList()
    },
    // 表格中变动  这里只针对页面页数切换
    orderTableChange(e, filters, sorter) {
      console.log(e, 'eeeeeee')
      // 分页
      this.orderQueryParam['pageSize'] = e.pageSize
      this.orderQueryParam['page'] = e.current

      if (e.current && e.current > 0) {
        this.orderPage = e.current
      }
      this.getOrderList()
    },
    // 日期切换，重新赋值
    dateOnChange(date, dateString) {
      this.queryParam.start_time = dateString[0]
      this.queryParam.end_time = dateString[1]
      // console.log('search_data', this.search_data)
    },
    // 日期切换，重新赋值
    orderdateOnChange(date, dateString) {
      this.orderQueryParam.start_time = dateString[0]
      this.orderQueryParam.end_time = dateString[1]
    },
    callback(value) {
      console.log(value, 'callback')
      if (value == '1') {
        this.getCategoryList()
        this.getList()
      } else {
        this.getOrderList()
        this.getpayMethodList()
      }
    },
  },
}
</script>
<style lang="less" scoped>
.edit-sort {
  display: none;
}
.form-content {
  margin-bottom: 16px;
}
.button-content {
  padding: 30px 10px;
}
</style>
