<template>
  <div class="package-bill-list-box">
    <div class="search-box">
        <a-row :gutter="48">
          <a-col :md="7" :sm="24">
              <a-input-group compact>
                <div style="width: 20%;line-height: 32px;">
                套餐标题：
                </div>
                <a-input style="width: 60%" v-model="search.title"/>
            </a-input-group>
          </a-col>
          <a-col :md="7" :sm="24">
              <a-input-group compact>
                <a-select style="width: 30%" default-value="1" v-model="search.type">
                  <a-select-option value="1">
                    物业名称
                  </a-select-option>
                  <a-select-option value="2">
                    物业联系方式
                  </a-select-option>
                </a-select>
                <a-input style="width: 70%" v-model="search.matter"/>
            </a-input-group>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-range-picker @change="dateOnChange" :allowClear='true'  v-model="search_data">
              <a-icon slot="suffixIcon" type="calendar" />
            </a-range-picker>
          </a-col>
          <a-col :md="2" :sm="24">
            <a-button type="primary" icon="search" @click="searchList()">
              查询
            </a-button>
          </a-col>
          <a-col :md="2" :sm="24">
            <a-button  @click="resetList()">重置</a-button>
          </a-col>
        </a-row>
    </div>
    <a-table
      :columns="columns"
      :data-source="data" 
      class="components-table-demo-nested"
      :pagination="pagination"
      @change='table_change'
    >
      <a slot="action" slot-scope="text, record" @click="look(record)">订单详情</a>
    </a-table>
     <a-drawer
      title="套餐订单详情"
      :width="720"
      :visible="visible"
      :maskClosable='true'
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <a-form :form="form" layout="vertical" hide-required-mark class="message_box">
        <a-form-item>
          <a-row :gutter="24">
             <a-col :md="8" :sm="24">
                订单编号：
            </a-col>
             <a-col :md="16" :sm="24">
                {{detail.order_no}}
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-table
           :columns="package_columns"
            :data-source="package_data"
            :pagination="false"
            >
          </a-table>
        </a-form-item>
        <a-form-item>
          <a-row :gutter="24">
             <a-col :md="8" :sm="24">
                购买方物业名称：
            </a-col>
             <a-col :md="16" :sm="24">
                {{detail.property_name}}
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row :gutter="24">
             <a-col :md="8" :sm="24">
                购买方物业联系方式：
            </a-col>
             <a-col :md="16" :sm="24">
                {{detail.property_tel}}
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row :gutter="24">
             <a-col :md="8" :sm="24">
                支付金额：
            </a-col>
             <a-col :md="16" :sm="24">
                {{detail.pay_money}}
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row :gutter="24">
             <a-col :md="8" :sm="24">
                支付方式：
            </a-col>
             <a-col :md="16" :sm="24">
                {{detail.pay_type}}
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row :gutter="24">
             <a-col :md="8" :sm="24">
                交易流水：
            </a-col>
             <a-col :md="16" :sm="24">
                {{detail.transaction_no}}
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row :gutter="24">
             <a-col :md="8" :sm="24">
                支付时间：
            </a-col>
             <a-col :md="16" :sm="24">
                {{detail.pay_time}}
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row :gutter="24">
             <a-col :md="8" :sm="24">
                购买套餐周期（年/366天）：
            </a-col>
             <a-col :md="16" :sm="24">
                {{detail.package_period}}
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row :gutter="24">
             <a-col :md="8" :sm="24">
                套餐到期时间：
            </a-col>
             <a-col :md="16" :sm="24">
                {{detail.package_end_time}}
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button :style="{ marginRight: '8px' }" @click="onClose">
          取消
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import packageApi from '@/api/system/community/package';
import store from '@/store';
const columns = [
  { title: '套餐标题',  dataIndex: 'details_info.package_title', key: 'package_title'},
  { title: '购买方物业名称', dataIndex: 'property_name', key: 'property_name'},
  { title: '购买方物业联系方式', dataIndex: 'property_tel', key: 'property_tel' },
  { title: '支付金额', dataIndex: 'pay_money', key: 'pay_money' },
  { title: '支付时间', dataIndex: 'pay_time', key: 'pay_time'},
  { title: '套餐到期时间', dataIndex: 'package_end_time', key: 'package_end_time'},
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    scopedSlots: { customRender: 'action' },
  },
];
const package_columns = [
  { title: '套餐标题',  dataIndex: 'package_title', key: 'package_title_detail'},
  { title: '功能个数', dataIndex: 'num', key: 'num'},
  { title: '价格（元/年）', dataIndex: 'price', key: 'price' },
  { title: '所含'+store.getters.config.room_name, dataIndex: 'room_num', key: 'room_num' },
];

const data = [];
for (let i = 0; i < 1; i++) {
  data.push({
    key: i,
    name: `Edrward ${i}`,
    phone: `1835609356 ${i}`,
    content: `这是第 ${i} 位`,
    add_time_txt: `2020/5/27 10:${i}`,
    add_time_txt: `2020/5/27 10:${i}`,
    status_txt: `正常 ${i}`,
  });
}


export default {
  name: 'PackageBillList',
  filters: {
    statusFilter (type) {
      var statusMap = [
        'error',
        'error',
        'success'
      ]
      console.log('type21-', type)
      console.log('type2-', statusMap[type])
      return statusMap[type]
    }
  },
  data() {
    return {
      pagination: { pageSize: 10, total:10 },
      search_data: [],
      search: { 'type': '1', matter: '',title:'', status: '', start_time: '',end_time: '', page: 1 },
      form: this.$form.createForm(this),
      visible: false,
      data,
      columns,
      package_columns,
      page: 1,
      detail: {},
      package_data: []
    };
  },
  mounted () {
    this.getPackageBillList()
  },
  methods: {
    // 获取列表信息
    getPackageBillList() {
      this.search['page'] = this.page;
      let _this = this
      this.request(packageApi.packageOrderList, this.search)
        .then((res) => {
          console.log('res',res)
          _this.pagination.total = res.count ? res.count : 0
          _this.data = res.list
      })
    },
    // 获取详情
    getPackageBillDetail(order_id) {
      let _this = this
      this.request(packageApi.packageOrderInfo, { order_id: order_id})
        .then((res) => {
          console.log('res',res)
          _this.detail = res
          // _this.package_data.push(res.details_info);
          _this.package_data = [res.details_info];
      })
    },
    
    // 查看详情  触发右侧抽屉弹出
    look(e) {
      console.log('e', e)
      this.visible = true
      this.getPackageBillDetail(e.order_id)
    },
    // 表格中变动  这里只针对页面页数切换
    table_change(e) {
      console.log('e', e)
      if (e.current && e.current>0) {
        this.page = e.current;
        this.getPackageBillList()
      }
    },
    // 右侧弹出抽屉关闭
    onClose() {
      this.visible = false;
    },
    // 日期切换，重新赋值
    dateOnChange(date, dateString) {
      this.search.start_time = dateString[0];
      this.search.end_time = dateString[1];
    },
    // 进行搜索
    searchList() {
      console.log('search', this.search);
      this.getPackageBillList()
    },
    // 进行重置
    resetList() {
      console.log('search', this.search);
      console.log('search_data', this.search_data);
      this.search = { 'type': '1', matter: '',title:'', status: '', start_time: '',end_time: '', page: 1 }
      this.search_data = [];
      this.getPackageBillList()
    },
  }
};
</script>

<style lang="less" scoped>
  .package-bill-list-box {
    margin: 30px 20px;
    background-color: white;
  }
  .package-bill-list-box .search-box {
    padding: 20px 20px 0;
  }
  .package-bill-list-box .components-table-demo-nested {
    padding: 20px;
  }
  .package-bill-list-box .message_box {
    padding: 20px;
  }
</style>