<template>
  <div style="background-color: white;">
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="预交金订单">
        <div class="order-list-box">
          <div class="search-box">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24" style="padding-left: 24px;padding-right: 1px;width: 140px;">
                <a-select default-value="0" style="width: 105px" placeholder="请选择省" @change="handleChange"
                          v-model="search.province">
                  <a-select-option value="0">
                    全部省
                  </a-select-option>
                  <a-select-option :value="item1.area_id" v-for="(item1,index1) in province_list" :key="index1">
                    {{item1.area_name}}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 128px;">
                <a-select default-value="0" style="width: 115px" placeholder="请选择市" @change="handleChange1"
                          v-model="search.city">
                  <a-select-option value="0">
                    全部市
                  </a-select-option>
                  <a-select-option :value="item2.id" v-for="(item2,index2) in city_list" :key="index2">
                    {{item2.name}}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 128px;">
                <a-select default-value="0" style="width: 115px" placeholder="请选择区" @change="handleChange2"
                          v-model="search.area">
                  <a-select-option value="0">
                    全部区
                  </a-select-option>
                  <a-select-option :value="item3.id" v-for="(item3,index3) in area_list" :key="index3">
                    {{item3.name}}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 128px;">
                <a-select default-value="0" style="width: 117px" placeholder="请选择街道" @change="handleChange3"
                          v-model="search.street">
                  <a-select-option value="0">
                    全部街道
                  </a-select-option>
                  <a-select-option :value="item4.id" v-for="(item4,index4) in street_list" :key="index4">
                    {{item4.name}}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 124px;">
                <a-select default-value="0" style="width: 117px" placeholder="请选择社区" @change="handleChange4"
                          v-model="search.community">
                  <a-select-option value="0">
                    全部社区
                  </a-select-option>
                  <a-select-option :value="item5.id" v-for="(item5,index5) in community_list" :key="index5">
                    {{item5.name}}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="8" :sm="24" style="padding-left: 5px;padding-right: 1px;width: 130px;">
                <a-select v-if="$store.getters.config" default-value="0" style="width: 116px" :placeholder="'请选择'+$store.getters.config.house_name" @change="handleChange5"
                          v-model="search.village">
                  <a-select-option value="0">
                    全部{{$store.getters.config.house_name}}
                  </a-select-option>
                  <a-select-option :value="item6.id" v-for="(item6,index6) in village_list" :key="index6">
                    {{item6.name}}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 128px;">
                <a-select v-if="$store.getters.config" default-value="0" style="width: 117px" :placeholder="'请选择'+$store.getters.config.single_name" @change="handleChange6"
                          v-model="search.single">
                  <a-select-option value="0">
                    全部{{$store.getters.config.single_name}}
                  </a-select-option>
                  <a-select-option :value="item7.id" v-for="(item7,index7) in single_list" :key="index7">
                    {{item7.name}}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 128px;">
                <a-select v-if="$store.getters.config" default-value="0" style="width: 117px" :placeholder="'请选择'+$store.getters.config.floor_name" @change="handleChange7"
                          v-model="search.floor">
                  <a-select-option value="0">
                    全部{{$store.getters.config.floor_name}}
                  </a-select-option>
                  <a-select-option :value="item8.id" v-for="(item8,index8) in floor_list" :key="index8">
                    {{item8.name}}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 128px;">
                <a-select default-value="0" style="width: 117px" placeholder="请选择楼层" @change="handleChange8"
                          v-model="search.layer">
                  <a-select-option value="0">
                    全部楼层
                  </a-select-option>
                  <a-select-option :value="item9.id" v-for="(item9,index9) in layer_list" :key="index9">
                    {{item9.name}}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 260px;">
                <a-select v-if="$store.getters.config" default-value="0" style="width: 117px" :placeholder="'请选择'+$store.getters.config.room_name" v-model="search.vacancy">
                  <a-select-option value="0">
                    全部{{$store.getters.config.room_name}}
                  </a-select-option>
                  <a-select-option :value="item10.id" v-for="(item10,index10) in vacancy_list" :key="index10">
                    {{item10.name}}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="8" :sm="24" style="width: 305px;padding-right: 1px;padding-top: 15px;">
                <a-input-group compact>
                  <a-select  placeholder="请选择筛选项" style="width: 130px" default-value="phone" v-model="search.key_val">
                    <a-select-option value="phone">
                      联系电话
                    </a-select-option>
                    <a-select-option value="nickname">
                      用户名
                    </a-select-option>
                    <a-select-option value="electric_name">
                      电表名称
                    </a-select-option>
                    <!-- <a-select-option value="payment_num">
                       缴费项名称
                     </a-select-option>-->
                  </a-select>
                  <a-input style="width: 150px" v-model="search.value"/>
                </a-input-group>
              </a-col>
              <a-col :md="3" :sm="24" style="padding-left: 15px;padding-right: 1px;padding-top: 15px;">
                <a-select placeholder="请选择支付方式" style="width: 100%"  v-model="search.pay_type">
                  <a-select-option value="alipay">支付宝</a-select-option>
                  <a-select-option value="wechat">微信</a-select-option>
                  <a-select-option value="unionpay">银联</a-select-option>
                  <a-select-option value="balance">余额抵扣</a-select-option>
                </a-select>
              </a-col>
              <a-col :md="5" :sm="24" style="padding-left: 15px;padding-right: 1px;padding-top: 15px;">
                <a-range-picker @change="dateOnChange" :allowClear='true'  v-model="search_data">
                  <a-icon slot="suffixIcon" type="calendar" />
                </a-range-picker>
              </a-col>
              <a-col :md="2" :sm="24" style="padding-top: 15px;">
                <a-button type="primary" icon="search" @click="searchList()">
                  查询
                </a-button>
              </a-col>
              <a-col :md="2" :sm="24" style="padding-left: 1px;padding-right: 1px;width: 6%;padding-top: 15px;">
                <a-button  @click="resetList()">重置</a-button>
              </a-col>
              <a-col :md="2" :sm="24" style="padding-left: 1px;padding-right: 1px;padding-top: 15px;">
                <a-button  style="color: #fff;background-color: #1890ff;border-color: #1890ff;" @click="print_data()">Excel导出</a-button>
              </a-col>
            </a-row>
          </div>
          <div style="padding: 18px 18px 0px">
            <span>
              缴费总金额：{{money}}元
            </span>
          </div>
          <a-table
            :columns="columns"
            :data-source="data"
            class="components-table-demo-nested"
            :pagination="pagination"
            @change='table_change'
          >
          </a-table>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="抄表扣费订单" force-render>
        <div class="order-list-box">
          <div class="search-box">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24" style="padding-left: 24px;padding-right: 1px;width: 140px;">
                <a-select default-value="0" style="width: 105px" placeholder="请选择省" @change="handleChange10"
                          v-model="search1.province">
                  <a-select-option value="0">
                    全部省
                  </a-select-option>
                  <a-select-option :value="item1.area_id" v-for="(item1,index1) in province_list" :key="index1">
                    {{item1.area_name}}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 128px;">
                <a-select default-value="0" style="width: 115px" placeholder="请选择市" @change="handleChange11"
                          v-model="search1.city">
                  <a-select-option value="0">
                    全部市
                  </a-select-option>
                  <a-select-option :value="item12.id" v-for="(item12,index12) in city_list1" :key="index12">
                    {{item12.name}}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 128px;">
                <a-select default-value="0" style="width: 115px" placeholder="请选择区" @change="handleChange12"
                          v-model="search1.area">
                  <a-select-option value="0">
                    全部区
                  </a-select-option>
                  <a-select-option :value="item13.id" v-for="(item13,index13) in area_list1" :key="index13">
                    {{item13.name}}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 128px;">
                <a-select default-value="0" style="width: 117px" placeholder="请选择街道" @change="handleChange13"
                          v-model="search1.street">
                  <a-select-option value="0">
                    全部街道
                  </a-select-option>
                  <a-select-option :value="item14.id" v-for="(item14,index14) in street_list1" :key="index14">
                    {{item14.name}}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 124px;">
                <a-select default-value="0" style="width: 117px" placeholder="请选择社区" @change="handleChange14"
                          v-model="search1.community">
                  <a-select-option value="0">
                    全部社区
                  </a-select-option>
                  <a-select-option :value="item15.id" v-for="(item15,index15) in community_list1" :key="index15">
                    {{item15.name}}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="8" :sm="24" style="padding-left: 5px;padding-right: 1px;width: 130px;">
                <a-select v-if="$store.getters.config" default-value="0" style="width: 116px" :placeholder="'请选择'+$store.getters.config.house_name" @change="handleChange15"
                          v-model="search1.village">
                  <a-select-option value="0">
                    全部{{$store.getters.config.house_name}}
                  </a-select-option>
                  <a-select-option :value="item16.id" v-for="(item16,index16) in village_list1" :key="index16">
                    {{item16.name}}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 128px;">
                <a-select v-if="$store.getters.config" default-value="0" style="width: 117px" :placeholder="'请选择'+$store.getters.config.single_name" @change="handleChange16"
                          v-model="search1.single">
                  <a-select-option value="0">
                    全部{{$store.getters.config.single_name}}
                  </a-select-option>
                  <a-select-option :value="item17.id" v-for="(item17,index17) in single_list1" :key="index17">
                    {{item17.name}}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 128px;">
                <a-select v-if="$store.getters.config" default-value="0" style="width: 117px" :placeholder="'请选择'+$store.getters.config.floor_name" @change="handleChange17"
                          v-model="search1.floor">
                  <a-select-option value="0">
                    全部{{$store.getters.config.floor_name}}
                  </a-select-option>
                  <a-select-option :value="item18.id" v-for="(item18,index18) in floor_list1" :key="index18">
                    {{item18.name}}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 128px;">
                <a-select default-value="0" style="width: 117px" placeholder="请选择楼层" @change="handleChange18"
                          v-model="search1.layer">
                  <a-select-option value="0">
                    全部楼层
                  </a-select-option>
                  <a-select-option :value="item19.id" v-for="(item19,index19) in layer_list1" :key="index19">
                    {{item19.name}}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 260px;">
                <a-select v-if="$store.getters.config" default-value="0" style="width: 117px" :placeholder="'请选择'+$store.getters.config.room_name" v-model="search1.vacancy">
                  <a-select-option value="0">
                    全部{{$store.getters.config.room_name}}
                  </a-select-option>
                  <a-select-option :value="item110.id" v-for="(item110,index110) in vacancy_list1" :key="index110">
                    {{item110.name}}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="8" :sm="24" style="width: 305px;padding-right: 1px;padding-top: 15px;">
                <a-input-group compact>
                  <a-select  placeholder="请选择筛选项" style="width: 130px" default-value="phone" v-model="search1.key_val">
                    <a-select-option value="phone">
                      联系电话
                    </a-select-option>
                    <a-select-option value="nickname">
                      用户名
                    </a-select-option>
                    <a-select-option value="electric_name">
                     电表名称
                    </a-select-option>
                    <!-- <a-select-option value="payment_num">
                       缴费项名称
                     </a-select-option>-->
                  </a-select>
                  <a-input style="width: 150px" v-model="search1.value"/>
                </a-input-group>
              </a-col>
              <a-col :md="5" :sm="24" style="padding-left: 15px;padding-right: 1px;padding-top: 15px;">
                <a-range-picker @change="dateOnChange1" :allowClear='true'  v-model="search_data1">
                  <a-icon slot="suffixIcon" type="calendar" />
                </a-range-picker>
              </a-col>
              <a-col :md="2" :sm="24" style="padding-top: 15px;">
                <a-button type="primary" icon="search" @click="searchList()">
                  查询
                </a-button>
              </a-col>
              <a-col :md="2" :sm="24" style="padding-left: 1px;padding-right: 1px;width: 6%;padding-top: 15px;">
                <a-button  @click="resetList1()">重置</a-button>
              </a-col>
              <a-col :md="2" :sm="24" style="padding-left: 1px;padding-right: 1px;padding-top: 15px;">
                <a-button  style="color: #fff;background-color: #1890ff;border-color: #1890ff;" @click="print_data1()">Excel导出</a-button>
              </a-col>
            </a-row>
          </div>
          <div style="padding: 18px 18px 0px">
            <span>
              缴费总金额：{{money1}}元
            </span>
          </div>
          <a-table
            :columns="columns1"
            :data-source="data1"
            class="components-table-demo-nested"
            :pagination="pagination1"
            @change='table_change1'
          >
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>



</template>
<script>
  import configHouseMeterApi from '@/api/community/houseMeter'
	import store from '@/store';
  const columns = [
    { title: '订单编号',  dataIndex: 'order_no', key: 'order_no'},
    { title: '支付单号',  dataIndex: 'paid_orderNo', key: 'paid_orderNo'},
    { title: '电表名称',  dataIndex: 'electric_name', key: 'electric_name'},
    { title: '缴费项',  dataIndex: 'payment_num', key: 'payment_num'},
    { title: '充值电量',  dataIndex: 'charge_num', key: 'charge_num'},
    { title: '缴费金额',  dataIndex: 'charge_price', key: 'charge_price'},
    { title: '支付方式',  dataIndex: 'pay_type', key: 'pay_type'},
    { title: '支付时间',  dataIndex: 'pay_time', key: 'pay_time'},
    { title: '余额支付金额',  dataIndex: 'current_system_balance', key: 'current_system_balance'},
    { title: '用户名',  dataIndex: 'nickname', key: 'nickname'},
    { title: '联系电话',  dataIndex: 'phone', key: 'phone'},
    { title: '所属'+store.getters.config.room_name,  dataIndex: 'village_address', key: 'village_address'},
  ];

  const columns1 = [
    { title: '订单编号',  dataIndex: 'order_no', key: 'order_no'},
    { title: '电表名称',  dataIndex: 'electric_name', key: 'electric_name'},
    { title: '缴费项',  dataIndex: 'payment_num', key: 'payment_num'},
    { title: '使用电量',  dataIndex: 'charge_num', key: 'charge_num'},
    { title: '扣费金额',  dataIndex: 'charge_price', key: 'charge_price'},
    { title: '扣费方式',  dataIndex: 'pay_type', key: 'pay_type'},
    { title: '扣费时间',  dataIndex: 'pay_time', key: 'pay_time'},
    { title: '用户名',  dataIndex: 'nickname', key: 'nickname'},
    { title: '联系电话',  dataIndex: 'phone', key: 'phone'},
    { title: '所属'+store.getters.config.room_name,  dataIndex: 'village_address', key: 'village_address'},
  ];

  export default {
    name: 'orderList',
    data() {
      return {
        key:1,
        data:[],
        data1:[],
        money:0,
        money1:0,
        reply_content: '',
        pagination: { pageSize: 10, total:10 },
        pagination1: { pageSize: 10, total:10 },
        search_data: [],
        search: { page: 1 },
        search_data1: [],
        search1: { page: 1 },
        form: this.$form.createForm(this),
        visible: false,
        columns,
        columns1,
        page: 1,
        page1: 1,
        province_list1: [],
        city_list1: [],
        area_list1: [],
        street_list1: [],
        community_list1: [],
        village_list1: [],
        single_list1: [],
        floor_list1: [],
        layer_list1: [],
        vacancy_list1: [],
        province_list: [],
        city_list: [],
        area_list: [],
        street_list: [],
        community_list: [],
        village_list: [],
        single_list: [],
        floor_list: [],
        layer_list: [],
        vacancy_list: [],
      };
    },
    activated () {
      this.getOrderList()
      this.getAreaList()
      this.getAreaList1()
    },
    methods: {
      // 获取列表信息
      getOrderList() {
        if (this.key==1){
          this.search['page'] = this.page;
          this.search.payment_type=this.key
          this.request(configHouseMeterApi.payorderList, this.search)
            .then((res) => {
              console.log('res',res)
                this.pagination.total = res.count ? res.count : 0
                this.pagination.pageSize = res.total_limit ? res.total_limit : 0
                this.data = res.list
                this.money=res.sum
            })
        }else{
          this.search1['page'] = this.page;
          this.search1.payment_type=this.key
          this.request(configHouseMeterApi.payorderList, this.search1)
            .then((res) => {
              console.log('res',res)
                this.pagination1.total = res.count ? res.count : 0
                this.pagination1.pageSize = res.total_limit ? res.total_limit : 0
                this.data1 = res.list
              this.money1=res.sum


            })
        }


      },
      print_data() {
        this.search['page'] = this.page;
        this.search.payment_type=this.key
        this.request(configHouseMeterApi.payorderPrint, this.search)
          .then((res) => {
            console.log('res',res)
            window.location.href=res.url;
          })
      },
      print_data1() {
        this.search1['page'] = this.page1;
        this.search1.payment_type=this.key
        this.request(configHouseMeterApi.payorderPrint, this.search1)
          .then((res) => {
            console.log('res',res)
            window.location.href=res.url;
          })
      },
      callback(key) {
        this.key=key
        this.getOrderList()
        console.log(key);
      },

      // 进行搜索
      searchList() {
        console.log('search', this.search);
        this.getOrderList()
      },
      // 进行重置
      resetList() {
        console.log('search', this.search);
        console.log('search_data', this.search_data);
        this.search = { 'key_val': 'phone', value: '', status: '', date: [], page: 1 }
        this.search_data = [];
        this.getOrderList()
      },
      // 进行重置
      resetList1() {
        console.log('search', this.search);
        console.log('search_data', this.search_data);
        this.search1 = { 'key_val': 'phone', value: '', status: '', date: [], page: 1 }
        this.search_data1 = [];
        this.getOrderList()
      },
      // 表格中变动  这里只针对页面页数切换
      table_change(e) {
        console.log('e', e)
        if (e.current && e.current>0) {
          this.page = e.current;
          this.getOrderList()
        }
      },
      // 表格中变动  这里只针对页面页数切换
      table_change1(e) {
        console.log('e', e)
        if (e.current && e.current>0) {
          this.page = e.current;
          this.getOrderList()
        }
      },

      // 日期切换，重新赋值
      dateOnChange(date, dateString) {
        this.search.date = dateString;
        console.log('search', this.search);
      },
      // 日期切换，重新赋值
      dateOnChange1(date, dateString) {
        this.search1.date = dateString;
        console.log('search', this.search);
      },
      // 获取省市区等信息
      getAreaList() {
        this.request(configHouseMeterApi.getAreasList,{'pid':0,'type':1})
          .then((res) => {
            this.province_list = res
          })
          .catch((error) => {
            this.confirmLoading = false
          })
      },

      handleChange(value) {
        this.request(configHouseMeterApi.getAreasList,{'pid':value,'type':2})
          .then((res) => {
            this.city_list = res
          })
          .catch((error) => {
            this.confirmLoading = false
          })

      },
      handleChange1(value) {
        this.request(configHouseMeterApi.getAreasList,{'pid':value,'type':3})
          .then((res) => {
            this.area_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })


      },
      handleChange2(value) {

        this.request(configHouseMeterApi.getCommunityList,{'pid':value,'type':0})
          .then((res) => {
            this.street_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })

      },
      handleChange3(value) {


        this.request(configHouseMeterApi.getCommunityList,{'pid':value,'type':1})
          .then((res) => {
            this.community_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })

      },
      handleChange4(value) {

        this.request(configHouseMeterApi.getVillageList,{'pid':value,'type':2})
          .then((res) => {
            this.village_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })


      },
      handleChange5(value) {

        this.request(configHouseMeterApi.getSingleList,{'pid':value})
          .then((res) => {
            this.single_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })


      },
      handleChange6(value) {

        this.request(configHouseMeterApi.getFloorList,{'pid':value})
          .then((res) => {
            this.floor_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })

      },
      handleChange7(value) {

        this.request(configHouseMeterApi.getLayerList,{'pid':value})
          .then((res) => {
            this.layer_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })

      },
      handleChange8(value) {
        this.request(configHouseMeterApi.getVacancyList,{'pid':value})
          .then((res) => {
            this.vacancy_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })

      },
      // 获取省市区等信息
      getAreaList1() {
        this.request(configHouseMeterApi.getAreasList,{'pid':0,'type':1})
          .then((res) => {
            this.province_list1 = res
          })
          .catch((error) => {
            this.confirmLoading = false
          })
      },

      handleChange10(value) {
        this.request(configHouseMeterApi.getAreasList,{'pid':value,'type':2})
          .then((res) => {
            this.city_list1 = res
          })
          .catch((error) => {
            this.confirmLoading = false
          })

      },
      handleChange11(value) {
        this.request(configHouseMeterApi.getAreasList,{'pid':value,'type':3})
          .then((res) => {
            this.area_list1 = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })


      },
      handleChange12(value) {

        this.request(configHouseMeterApi.getCommunityList,{'pid':value,'type':0})
          .then((res) => {
            this.street_list1 = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })

      },
      handleChange13(value) {


        this.request(configHouseMeterApi.getCommunityList,{'pid':value,'type':1})
          .then((res) => {
            this.community_list1 = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })

      },
      handleChange14(value) {

        this.request(configHouseMeterApi.getVillageList,{'pid':value,'type':2})
          .then((res) => {
            this.village_list1 = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })


      },
      handleChange15(value) {

        this.request(configHouseMeterApi.getSingleList,{'pid':value})
          .then((res) => {
            this.single_list1 = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })


      },
      handleChange16(value) {

        this.request(configHouseMeterApi.getFloorList,{'pid':value})
          .then((res) => {
            this.floor_list1 = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })

      },
      handleChange17(value) {

        this.request(configHouseMeterApi.getLayerList,{'pid':value})
          .then((res) => {
            this.layer_list1 = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })

      },
      handleChange18(value) {
        this.request(configHouseMeterApi.getVacancyList,{'pid':value})
          .then((res) => {
            this.vacancy_list1 = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })

      },

    }
  };
</script>

<style lang="less" scoped>
  .order-list-box {
    background-color: white;
  }
  .order-list-box .search-box {
    padding: 20px 20px 0;
  }
  .order-list-box .add-box {
    padding: 20px 20px 0;
  }
  .order-list-box .components-table-demo-nested {
    padding: 20px;
  }
  .order-list-box .message_box {
    padding: 20px;
  }
  .ant-col-md-2 {
    width: 8.333333333%;
  }
</style>