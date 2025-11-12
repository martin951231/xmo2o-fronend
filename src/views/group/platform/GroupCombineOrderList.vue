<template>
  <div class="ant-pro-page-header-wrap-children-content" style="margin: 24px 0 0">
    <a-card :bordered="false">
      <a-card :bordered="false">
        <a-form layout="inline" class="form-content">
          <a-row :gutter="2">
            <a-col :md="4" :sm="10">
              <a-form-item label="组合类型：">
                <a-select style="width: 110px" default-value="queryParam.cat_id" v-model="queryParam.cat_id">
                  <a-select-option :value="item.cat_id" :key="item.cat_id" v-for="item in catArr">{{
                    item.cat_name
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="9" :sm="20">
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
            <a-col :md="6" :sm="12">
              <a-form-item label="手动搜索：">
                <a-input
                  style="width: 235px"
                  allow-clear
                  v-model="queryParam.keyword"
                  aria-placeholder="请输入优惠组合名称"
                />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="12">
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
            <span slot="start_time" slot-scope="text, record"> {{ text }}至{{ record.end_time }} </span>
            <span slot="can_use_day" slot-scope="text, record"> {{ text }}天 </span>
            <span slot="action" slot-scope="text, record">
              <router-link
                :to="{ path: '/group/platform.groupCombine/edit', query: { id: record.combine_id } }"
                slot="groupCombine"
              >
                <a-button type="primary">编辑</a-button>
              </router-link>
            </span>
          </a-table>
        </div>
      </a-card>
    </a-card>
  </div>
</template>

<script>
// import moment from 'moment'
import GroupPlatformApi from '@/api/group/platform'
import path from '@/router/router-path'
import moment from 'moment'
import Vue from 'vue'
const data = []
export default {
  name: 'StoreList',
  components: {},
  data() {
    this.cacheData = data.map((item) => ({ ...item }))
    return {
      catArr: [],
      treeData: [],
      baseUrl: '/v20/public/platform/#',
      // 查询参数
      queryParam: {
        time_type: 'start_time',
        cat_id: '-1',
      },
      pagination: {
        pageSize: 10,
        total: 10,
        'show-total': (total) => `共 ${total} 条记录`,
        'show-size-changer': true,
        'show-quick-jumper': true,
      },
      editingKey: '',
      page: 1,
      // 表头
      columns: [
        {
          title: '订单编号',
          dataIndex: 'order_id',
          width: '8%',
        },
        {
          title: '优惠组合信息',
          dataIndex: 'title',
          width: '15%',
          scopedSlots: {
            customRender: 'title',
          },
        },
        {
          title: '订单信息',
          dataIndex: 'order_info',
          width: '15%',
        },
        {
          title: '订单状态',
          dataIndex: 'status',
          width: '15%',
        },
        {
          title: '创建时间',
          dataIndex: 'start_time',
          // sorter: true,
          width: '15%',
          scopedSlots: {
            customRender: 'start_time',
          },
        },
        {
          title: '订单用户',
          dataIndex: 'can_use_day',
          width: '15%',
          scopedSlots: {
            customRender: 'can_use_day',
          },
        },
        {
          title: '订单有效期',
          dataIndex: 'can_use_day',
          width: '15%',
          scopedSlots: {
            customRender: 'can_use_day',
          },
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
      data,
      search_data: [],
    }
  },
  created() {
    //默认查询7天的订单数据
    this.search_data = ['', '']
    this.queryParam.start_time = ''
    this.queryParam.end_time = ''
  },
  activated() {
    this.getList()
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 获取列表信息
    getList() {
      this.queryParam['page'] = this.page
      this.request(GroupPlatformApi.getGroupCombineOrderList, this.queryParam).then((res) => {
        this.data = res.list
        this.pagination.total = res.count
      })
    },
    // 查询
    searchBtn() {
      this.page = 1
      this.getList()
    },
    // 表格中变动  这里只针对页面页数切换
    tableChange(e, filters, sorter) {
      // 分页
      this.queryParam['pageSize'] = e.pageSize

      if (e.current && e.current > 0) {
        this.page = e.current
      }
      this.getList()
    },
    // 日期切换，重新赋值
    dateOnChange(date, dateString) {
      this.queryParam.start_time = dateString[0]
      this.queryParam.end_time = dateString[1]
      // console.log('search_data', this.search_data)
    },
    callback(value) {
      console.log(value, 'callback')
      if (value == '1') {
        this.list()
      } else {
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
