<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <div class="cout-fee-list-box">
      <a-collapse accordion>
        <a-collapse-panel key="1" header="相关说明">
          <div class="count-fee-list-tip-box">
              <a-alert message="" type="info">
                <div slot="description" v-if="$store.getters.config">
                  <div>以下展示的是物业下对应{{$store.getters.config.house_name}}所有相关账单统计（不包含作废的账单）；</div>
                  <div>1、【应收费用】：未支付的账单应收总金额统计（不包含作废的账单）；</div>
                  <div>2、【已收费用】：已经支付的账单实际用户支付金额统计（不包含已经退款的，不包含作废的账单）；</div>
                  <div>3、【查看详情】：点击可直接跳转对应{{$store.getters.config.house_name}}查看应收账单相关信息；</div>
                  <div>4、【应收费用】：点击可直接跳转对应{{$store.getters.config.house_name}}查看应收账单相关信息；</div>
                  <div>5、【已收缴费总金额/已收实际到账金额】：点击可直接跳转对应{{$store.getters.config.house_name}}查看已缴账单相关信息；</div>
                  <div>6、【账单生成时间筛选：】：是应收账单的[账单生成时间筛选]只影响[应收费用]结果；</div>
                  <div>7、【支付时间筛选/计费时间筛选：】：是已缴账单的[支付时间筛选/计费时间筛选]影响[已收缴费总金额+已收实际到账金额]结果；</div>
                  <div>8、【收费项目：】：是应收费用+已缴账单的[收费项目]影响[应收费用+已收缴费总金额+已收实际到账金额]结果；</div>
                </div>
              </a-alert>
          </div>
        </a-collapse-panel>
      </a-collapse>
        <div class="search-box">
          <a-row  style="display: flex; flex-wrap: wrap;">
            <a-col :md="8" :sm="20" style="width: 340px; display: flex; margin-top: 15px;">
              <label style="margin-top: 5px;">账单生成时间筛选：</label>
              <a-range-picker style="width: 200px" :allowClear="true" @change="dateOnChangeProduct" v-model="search.productDateData" />
            </a-col>
            
            <a-col :md="8" :sm="24" class="suggestions_col" style="width: 320px; display: flex; margin-top: 15px;">
              <label style="margin-top: 5px;">支付时间筛选：</label>
              <a-range-picker @change="dateOnChangePay" :allowClear="true" v-model="search.payDateData" style="width: 200px;" />
            </a-col>

            <a-col :md="8" :sm="24" class="suggestions_col" style="width: 410px; display: flex; margin-top: 15px;">
              <label style="margin-top: 5px;">计费时间筛选：</label>
                  <span>
                    <a-date-picker
                      style="width: 140px;"
                      @change="serviceStartTimeChange"
                      format="YYYY-MM-DD"
                      placeholder="计费开始时间"
                      @openChange="handleServiceStartOpenChange"
                    /> ~
                     <a-date-picker
                      style="width: 140px;"
                      @change="serviceEndTimeChange"
                      format="YYYY-MM-DD"
                      placeholder="计费结束时间"
                      :open="endServiceOpen"
                      @openChange="handleServiceEndOpenChange"
                    />
                  </span>
            </a-col>
            </a-row>
            <a-row  style="display: flex; flex-wrap: wrap;">
            <a-col :md="8" :sm="24" class="suggestions_col" style="width: 360px; display: flex; margin-top: 15px;">
                <label style="margin-top: 5px;">收费项目：</label>
                <a-select  style="width:280px;" mode="multiple" placeholder="请选择项目" v-model="search.project_id"  @change="projectItemChange">

                  <a-select-option :value="item1.id" v-for="(item1,index1) in project_list" :key="index1">
                    {{ item1.name }}
                  </a-select-option>
                </a-select>
            </a-col>
            <a-col :md="2" :sm="24" style="width: 90px; margin-top: 15px;padding-left: 1px;">
              <a-button type="primary" icon="search" @click="searchCountFeeList()">
                查询
              </a-button>
            </a-col>
            <a-col :md="2" :sm="24" style="width: 90px; margin-top: 15px;padding-left: 10px;">
                   <a-button type="primary" @click="excelFeeExportData()">Excel导出</a-button>
            </a-col>
          </a-row>
        </div>
        <a-card :bordered="false">
          <a-table :columns="columns" :data-source="list"
                  :pagination="false">
                  
            <span slot="total_money" slot-scope="text, record">
              <a @click="goTo(record.village_id)">{{record.total_money}}</a>
            </span>
            <span slot="total_pay_money" slot-scope="text, record">
              <a @click="goToPayMoney(record.village_id)">{{record.total_pay_money}}</a>
            </span>
            <span slot="pay_money" slot-scope="text, record">
              <a @click="goToPayMoney(record.village_id)">{{record.pay_money}}</a>
            </span>
          </a-table>

        </a-card>
        <a-modal
          title="导出提示"
          :width="450"
          :visible="exportFeeVisible"
          :maskClosable="false"
          :loading="loading"
          :footer="null"
          :closable="false"
          :centered="true"
          >
            <div style="padding: 15px;color: black;font-size: 16px;">
                正在为您导出数据，你稍等 . . .
            </div>
        </a-modal>
    </div>
  </div>
</template>
<script>
  import newChargeApi from '@/api/community/property/packages';
  import receivableOrderList from '@/views/community/village/charge/cashier/receivableOrderList.vue';
  import Vue from "vue";
  import {setCookie} from "@/utils/util";
	import store from '@/store';
  const columns = [
    {
      title: store.getters.config.house_name+'名称',
      dataIndex: 'village_name',
      key: 'village_name',
    },
    {
      title: '欠收费用',
      dataIndex: 'total_money',
      key: 'total_money',
      scopedSlots: { customRender: 'total_money' },
    },
    {
      title: '已收缴费总金额',
      dataIndex: 'total_pay_money',
      key: 'total_pay_money',
      scopedSlots: { customRender: 'total_pay_money' },
    },
    {
      title: '已收实际到账金额',
      dataIndex: 'pay_money',
      key: 'pay_money',
      scopedSlots: { customRender: 'pay_money' },
    },
    {
      title: '收费率',
      dataIndex: 'fee_rate',
      key: 'fee_rate',
    },
  ];
  export default {
    name: 'countFeeList',
    components: {
    },
    data() {
      return {
        list:[],
        id:0,
        columns,
        search: {},
        endServiceOpen:false,
        project_list: [],
        exportFeeVisible:false,
        loading:false,
      };
    },
    mounted(){
      this.getCountFeeList()
      this.getChargeProjectList()
    },
    methods: {
      searchCountFeeList() {
        this.getCountFeeList()
      },
      getChargeProjectList () {
          this.request(newChargeApi.propertyChargeProjectList, {type:'selectdata'})
            .then((res) => {
              this.project_list = res.list
            })
      },
      projectItemChange(v_id){

      },
      serviceStartTimeChange(date,dateString){

          this.search.service_start_time=dateString;
      },
      serviceEndTimeChange(date,dateString){

          this.search.service_end_time=dateString;
      },
      handleServiceStartOpenChange(open) {
        if (!open) {
          this.endServiceOpen = true;
        }
      },
      handleServiceEndOpenChange(open) {
        this.endServiceOpen = open;
      },
      dateOnChangeProduct(date, dateString) {
          this.search.productDate = dateString

      },
      dateOnChangePay(date, dateString) {
          this.search.payDate = dateString

      },
      getCountFeeList() {
          this.search.optxtype='';
          this.request(newChargeApi.getCountFeeList, this.search)
            .then((res) => {
              console.log('res', res);
              this.list = res;
            })
      },
      // 导出Excel
      excelFeeExportData () {
          this.exportFeeVisible=true;
          this.loading = true;
          let postArr=this.search;
          postArr.optxtype='excelFeeExport';
          this.request(newChargeApi.getCountFeeList, postArr).then((res) => {
                  console.log('res', res)
                  if(res && res.url){
                      window.location.href = res.url
                  }
                  this.loading = false
                  this.exportFeeVisible = false;
              }).catch((error) => {
              this.loading = false
              this.exportFeeVisible = false;
          })
      },
      goTo(village_id) {
        this.request(newChargeApi.villageLogin,{village_id:village_id})
          .then((res) => {
            console.log('res', res);
           if (res.ticket != ''){
             console.log('ticket', res.ticket);
             Vue.ls.set('village_access_token', res.ticket, null) // vue.ls存储到localstorage,持久化存储
             setCookie('village_access_token', res.ticket, null) // 存入到cookie中
             //直接跳转
             let url = location.protocol + '//' + location.host + '/v20/public/platform/#/village/village.charge.cashier/receivableOrderList';
             let has = 0;
             if (this.search.productDate && this.search.productDate[0] && this.search.productDate[1]) {
                url += "?productStart="+this.search.productDate[0]+"&productEnd="+this.search.productDate[1];
                has = 1;
             }
             if (this.search.project_id && this.search.project_id[0]) {
                let projectString = this.search.project_id.join(',');
                if (has != 1) {
                  url += "?projectString=" + projectString;
                } else {
                  url += "&projectString=" + projectString;
                }
             }
             console.log('url', url);
             window.open(url)
           }
          })
      },
      goToPayMoney(village_id) {
        this.request(newChargeApi.villageLogin,{village_id:village_id})
          .then((res) => {
           if (res.ticket != ''){
             Vue.ls.set('village_access_token', res.ticket, null) // vue.ls存储到localstorage,持久化存储
             setCookie('village_access_token', res.ticket, null) // 存入到cookie中
             //直接跳转
             let url = location.protocol + '//' + location.host + '/v20/public/platform/#/village/village.charge.cashier/payableOrderList';
             let has = 0;
             if (this.search.payDate && this.search.payDate[0] && this.search.payDate[1]) {
                url += "?payStart="+this.search.payDate[0]+"&payEnd="+this.search.payDate[1];
                has = 1;
             }
             if (this.search.service_start_time) {
                if (has != 1) {
                  url += "?serviceStart="+this.search.service_start_time;
                } else {
                  url += "&serviceStart="+this.search.service_start_time;
                }
                has = 1;
             }
             if (this.search.service_end_time) {
                if (has != 1) {
                  url += "?serviceEnd="+this.search.service_end_time;
                } else {
                  url += "&serviceEnd="+this.search.service_end_time;
                }
                has = 1;
             }
             if (this.search.project_id && this.search.project_id[0]) {
                let projectString = this.search.project_id.join(',');
                if (has != 1) {
                  url += "?projectString=" + projectString;
                } else {
                  url += "&projectString=" + projectString;
                }
             }
             window.open(url)
           }
          })
      }
    },
  };
</script>
<style scoped>

  .cout-fee-list-box {
    margin: 10px 20px 10px 20px;
    background-color: white;
  }
  .cout-fee-list-box .search-box {
    padding: 0px 10px 10px 10px;
    border: 1px solid #e4dfdf;
    border-top: none;
  }
  .txt-green {
    color: #0fb70f;
  }

  .txt-red {
    color: red;
  }

  .table-operator{
    margin-bottom: 10px;
  }

  .count-fee-list-tip-box {
    padding:0px 4px;
  }
</style>