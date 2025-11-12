<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <div class="cout-fee-list-box">
      <a-collapse accordion>
        <a-collapse-panel key="1" header="相关说明">
          <div class="count-fee-list-tip-box">
              <a-alert message="" type="info">
             <div slot="description">
                 <div>1、统计订单计费时间段在当年之前（即在{{tips_year_v}}年1月1日之前）的订单相关数据统计</div>
                 <div>2、期初欠费房间数=欠费账单的账单计费时间有在本年1月1号前部分的未缴账单和账单计费时间有在本年1月1号前部分且在今年缴费的订单所包含的房间</div>
                 <div>3、追缴房间数=账单计费时间有在本年1月1号前部分且这些订单都在今年全部缴清的订单所包含的房间数</div>
                 <div>4、追缴率（房间）=追缴房间数/期初欠费房间数</div>
                 <div>5、期初陈欠费=欠费账单的账单计费时间有在本年1月1号前部分的未缴账单和账单计费时间有在本年1月1号前部分且在今年缴费的订单所含在本年1月1号前部分的合计金额</div>
                 <div>6、本年追缴金额=账单计费时间有在本年1月1号前部分且在今年缴费的订单所含在本年1月1号前部分的金额合计金额</div>
                 <div>7、优惠金额=账单计费时间有在本年1月1号前部分且在今年缴费的订单的优惠的合计金额</div>
                 <div>8、本年追缴率 =（本年追缴金额+优惠金额）/期初陈欠费</div>
              </div>
              </a-alert>
          </div>
        </a-collapse-panel>
      </a-collapse>
        <div class="search-box">
          <a-row  style="display: flex; flex-wrap: wrap;margin-top: 20px;margin-bottom: 10px;">
                  <a-col :span="6" style="padding-left: 5px; padding-right: 1px;">
                    <label style="margin-top: 5px;">选择楼栋管家：</label>
                    <a-select  style="width: 280px" placeholder="请选择楼栋管家" v-model="search.wids" mode="multiple" @change="handleSelectChange">
                      <a-select-option  v-for="(item,index) in singleheeper_list" :value="item.wid" :key="item.wid" >
                        {{item.title_name}}
                      </a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :span="6" style="padding-left: 5px; padding-right: 1px;">
                    <label style="margin-top: 5px;">选择楼栋：</label>
                    <a-select  style="width: 280px" placeholder="请选择楼栋" v-model="search.single_ids" mode="multiple" >
                      <a-select-option  v-for="(item1,index1) in singleList" :value="item1.single_id" :key="item1.single_id" >
                        {{item1.single_name}}
                      </a-select-option>
                    </a-select>
                  </a-col>
                  <!--
                <a-col :md="5"  style="padding-left: 5px;padding-right: 1px;">
                     <label style="margin-top: 5px;">选择年份：</label>
                    <a-select placeholder="请选择年份" style="width: 160px" v-model="search.year_v" >
                        <a-select-option  :value="yearV-yindex" v-for="yindex of yearLen" :key="yearV-yindex">{{ yearV-yindex }}年</a-select-option>
                    </a-select>
                    
                </a-col>
                -->
                
                <a-col :md="2"  style="width: 90px;padding-left: 1px;">
                  <a-button type="primary" icon="search" @click="getVillageRoomFeeRateList()">
                    查询
                  </a-button>
                </a-col>
                <a-col :md="2"  style="width: 100px;padding-left: 1px; margin-left: 20px;">
                    <a-button type="primary" @click="$refs.roomRateSummaryRecord.showRateSummaryRecord({rate_type:1,xtype:0})" >历史快照</a-button>
                </a-col>
            </a-row>
        </div>
        <a-card :bordered="false">
          <a-table :columns="columns" :data-source="list"
                  :pagination="false">
          </a-table>

        </a-card>

    </div>
     <roomRateSummaryRecord ref="roomRateSummaryRecord" />
  </div>
</template>
<script>
  import moment from 'moment';
  import villageApi from '@/api/community/village'
  import roomRateSummaryRecord from './components/roomRateSummaryRecord.vue'
  import Vue from "vue";
  import {setCookie} from "@/utils/util";
  import store from '@/store';
  const columns = [
    {
      title: '费用名称',
      dataIndex: 'order_type_name',
      key: 'order_type_name',
    },

    {
      title: '期初欠费房间数',
      dataIndex: 'qc_no_paid_rooms',
      key: 'qc_no_paid_rooms',
    },
    {
      title: '追缴房间数',
      dataIndex: 'qc_paid_rooms',
      key: 'qc_paid_rooms',
    },
    {
      title: '追缴率（房间）',
      dataIndex: 'v_room_rate',
      key: 'v_room_rate',
    },
    {
      title: '期初陈欠金额',
      dataIndex: 'qc_no_pay_money',
      key: 'qc_no_pay_money',
    },
    {
      title: '本年追缴金额',
      dataIndex: 'qc_order_money',
      key: 'qc_order_money',

    },
    {
      title: '追缴优惠金额',
      dataIndex: 'qc_paid_discount',
      key: 'qc_paid_discount',
    },
    {
      title: '本年追缴率',
      dataIndex: 'v_money_rate',
      key: 'v_money_rate',
    },

  ];
  export default {
    name: 'houseRoomUnpaidRateList',
    components: {
        roomRateSummaryRecord
    },
    data() {
      return {
        list:[],
        id:0,
        columns,
        search: {year_v:moment().format('YYYY')*1,w_singles:[],wids:[],single_ids:[]},
        tips_year_v:moment().format('YYYY')*1,
        singleheeper_list: [],
        exportFeeVisible:false,
        loading:false,
        yearV:moment().format('YYYY')*1+3,
        yearLen:100,
        singleList:[],
      };
    },
    mounted(){
      this.getVillageRoomFeeRateList()
      this.getVillageSingleKeepers()
    },
    methods: {
      getVillageRoomFeeRateList() {
          this.search.is_split=1;
          this.request(villageApi.getVillageRoomUnPayRateList, this.search)
            .then((res) => {
              this.list = res.list;
            }).catch((error) => {
                  
          });
      },
      getVillageSingleKeepers(){
         this.search.w_singles=[];
         this.singleheeper_list=[];
         this.singleList=[];
         this.search.wids=[];
         this.search.single_ids=[];
        this.request('/community/village_api.TransactionSummary/getVillageKeepersList', {})
              .then((res) => {
                this.singleheeper_list = res.list
        }).catch((error) => {
                  
          }); 
      },
      handleSelectChange(){
          this.search.single_ids=[];
          this.singleList=[];
          if(this.search.wids.length<1){
               return true;
          }
          this.request('/community/village_api.TransactionSummary/getVillageSingleListByWid', {wids:this.search.wids})
                .then((res) => {
                  this.singleList= res.list
          }).catch((error) => {
                    
        }); 
      },
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