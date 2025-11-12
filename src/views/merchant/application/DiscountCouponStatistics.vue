<template>
  <div class="mt-20 ml-10 mr-10 mb-20 bg-ff pt-10 pb-10 pl-10 pr-10" style="padding: 20px; overflow: hidden">
    <a-row type="flex">
      <a-row type="flex" class="mb-20">
        <a-col style="display: flex" class="mr-20">
          <span class="nowrap">{{ L('搜索') }}：</span>
          <a-select style="width: 100px" v-model="searchParams.search_type">
            <a-select-option v-for="item in searchSelectOption" :value="item.value" :key="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
          <a-input style="width: 60%" v-model="searchParams.keywords" :placeholder="L('请输入')" />
        </a-col>
        <a-col class="mr-20">
          <span>{{ L('日期') }}：</span>
          <a-select style="width: 100px" v-model="searchParams.date_type">
            <a-select-option :value="1">{{ L('领取时间') }}</a-select-option>
          </a-select>
          <a-range-picker
            :value="[
              searchParams.start_date ? moment(searchParams.start_date, 'YYYY-MM-DD') : null,
              searchParams.end_date ? moment(searchParams.end_date, 'YYYY-MM-DD') : null,
            ]"
            @change="timeOnChange"
          />
        </a-col>
      </a-row>
      <a-col>
        <a-button type="primary" class="mr-20" @click="search"> {{ L('搜索') }} </a-button>
        <a-button class="mr-20" @click="resetSearch"> {{ L('重置') }} </a-button>
        <a-button type="primary" @click="exportCard"> <a-icon type="download" /> {{ L('导出') }} </a-button>
      </a-col>
    </a-row>
    <div class="card-box">
      <div class="card-list"  v-for="(item, index) in cardList" :key="index">
        <div class="card-item">
          <div class="title">
            <span>{{ item.all_txt }}</span>
            <a-tooltip placement="right" v-if="item.note">
              <template slot="title">
                <span>{{ item.note }}</span>
              </template>
              <a-icon type="info-circle" />
            </a-tooltip>
          </div>
          <div class="price">
            <a-statistic :value="item.all_money" valueStyle="font-size:28px;" />
          </div>
          <div class="percentage">
            <div>
              {{ L('周同比') }}
              <a-icon type="caret-down" style="color: red; margin: 0 6px" v-if="item.week_data < 0" />
              <a-icon type="caret-up" style="color: #5ac725; margin: 0 6px" v-if="item.week_data >= 0" />{{
                item.week_data
              }}
              ％
            </div>
            <div>
              {{ L('日环比') }}
              <a-icon type="caret-down" style="color: red; margin: 0 6px" v-if="item.day_data < 0" />
              <a-icon type="caret-up" style="color: #5ac725; margin: 0 6px" v-if="item.day_data >= 0" />{{
                item.day_data
              }}
              ％
            </div>
          </div>
          <div class="info">
            {{ item.day_txt }} <span style="margin-left: 10px" v-if="item.day_per_type == 1">¥</span>
            {{ item.day_per }}
          </div>
        </div>
      </div>
    </div>
    <!-- 表格区域 -->
    <div class="table-box">
      <a-table class="mt-20" rowKey="id" :columns="columns" :data-source="list" :pagination="pagination"> </a-table>
    </div>
  </div>
</template>
  
  <script>
import Vue from 'vue'
import moment from 'moment'
import { statistic } from 'ant-design-vue'
Vue.use(statistic)
import MerchantApi from '@/api/merchant/application/index'
export default {
  data() {
    return {
      searchSelectOption: [
        {
          value: 1,
          label: '用户名称',
        },
        {
          value: 2,
          label: '手机号',
        },
      ],
      searchParams: {
        search_type: 1,
        start_date: '',
        end_date: '',
        page: 1,
        pageSize: 10,
        keywords: '',
        date_type: 1,
      },
      columns: [
        {
          title: this.L('领取id'),
          dataIndex: 'id',
        },
        {
          title: this.L('用户名称'),
          dataIndex: 'nickname',
        },
        {
          title: this.L('手机号'),
          dataIndex: 'phone',
        },
        {
          title: this.L('优惠券金额'),
          dataIndex: 'discount',
        },
        {
          title: this.L('数量'),
          dataIndex: 'num',
        },
        {
          title: this.L('优惠买单金额'),
          dataIndex: 'order_money',
        },
        {
          title: this.L('状态'),
          dataIndex: 'status_txt',
          scopedSlots: {
            customRender: 'status_txt',
          },
        },
        {
          title: this.L('领取时间'),
          dataIndex: 'receive_time',
        },
      ],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageSizeChange,
        showTotal: (total) => `共 ${total} 条记录`,
      },
      list: [],
      cardList: [],
    }
  },
  created() {
    this.getList()
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy()
    next()
  },
  methods: {
    moment,
    getList() {
      this.searchParams.page = this.pagination.current
      this.searchParams.pageSize = this.pagination.pageSize
      this.request(MerchantApi.getBuyOrderGiveCouponList, this.searchParams).then((res) => {
        this.list = res.data
        this.cardList = res.statistics_list
        this.$set(this.pagination, 'total', res.total)
      })
    },
    timeOnChange(date, dateString) {
      this.searchParams.start_date = dateString[0]
      this.searchParams.end_date = dateString[1]
    },
    //重置
    resetSearch() {
      this.searchParams.search_type = 1
      this.searchParams.start_date = ''
      this.searchParams.end_date = ''
      this.searchParams.keywords = ''
      this.searchParams.page = 1
      this.searchParams.date_type = 1
      this.getList()
    },
    //搜索
    search() {
      this.pagination.page = 1
      this.getList()
    },
    //导出
    exportCard() {
      this.request(MerchantApi.buyOrderGiveCouponExport, this.searchParams).then((res) => {
        if (res.file_url) {
          window.open(res.file_url)
        }
      })
    },

    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.getList()
    },
    onPageSizeChange(page, pageSize) {
      this.$set(this.pagination, 'pageSize', pageSize)
      this.getList()
    },
  },
}
</script>
  
  <style lang="less" scoped>
.card-box {
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  .card-list{
    width: 25%;
  }
  .card-item {
    border: 1px solid #eee;
    width: 80%;
    padding: 15px;
    min-width: 200px;
    margin: 0 auto;
    margin-bottom: 20px;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .price {
      font-weight: bold;
      margin-top: 5px;
    }
    .percentage {
      display: flex;
      justify-content: space-between;
      margin: 18px 0;
    }
    .info {
      border-top: 1px solid #eee;
      padding-top: 10px;
    }
  }
}
.table-box {
  margin-top: 30px;
}
.nowrap {
  display: flex;
  align-items: center;
  white-space: nowrap;
}
</style>