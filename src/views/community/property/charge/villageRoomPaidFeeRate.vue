<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <div class="cout-fee-list-box">
      <a-collapse accordion>
        <a-collapse-panel key="1" header="相关说明">
          <div class="count-fee-list-tip-box">
              <a-alert message="" type="info">
             <div slot="description">
                 <div>1、选择年份，如果是{{tips_year_v}}，则统计房间的 【入住日期】（入住日期必须有值） 在 {{tips_year_v}}年1月1日之前的房间的相关数据 </div>
                 <div>2、统计的目标订单，如果年份是{{tips_year_v}}，则统计订单计费时间段在{{tips_year_v}}年1月1日到{{tips_year_v}}年12月31日之间的订单相关数据 </div>
              </div>
              </a-alert>
          </div>
        </a-collapse-panel>
      </a-collapse>
        <div class="search-box">
          <a-row  style="display: flex; flex-wrap: wrap;margin-top: 20px;margin-bottom: 10px;">
                  <a-col :span="6" style="padding-left: 5px; padding-right: 1px;width:370px;">
                    <label style="margin-top: 5px;">请选择小区：</label>
                    <a-select style="width: 280px;" placeholder="请选择小区" mode="multiple" v-model="search.village_ids" @change="handleVillageChange">
                      <a-select-option  v-for="(item,index) in villageList" :value="item.village_id" :key="item.village_id" >
                        {{item.village_name}}
                      </a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :span="6" style="padding-left: 5px; padding-right: 1px;width:380px;">
                    <label style="margin-top: 5px;">选择楼栋管家：</label>
                    <a-select  style="width: 270px" placeholder="请选择楼栋管家" v-model="search.wids" mode="multiple" @change="handleSelect3Change">
                      <a-select-option  v-for="(item,index) in singleheeper_list" :value="item.wid" :key="item.wid" >
                        {{item.title_name}}
                      </a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :span="6" style="padding-left: 5px; padding-right: 1px;width:370px;">
                    <label style="margin-top: 5px;">选择楼栋：</label>
                    <a-select  style="width: 280px" placeholder="请选择楼栋" v-model="search.single_ids" mode="multiple" >
                      <a-select-option  v-for="(item1,index1) in singleList" :value="item1.single_id" :key="item1.single_id" >
                        {{item1.single_name}}
                      </a-select-option>
                    </a-select>
                  </a-col>
                <a-col :md="5"  style="padding-left: 5px;padding-right: 1px;width:260px;">
                     <label style="margin-top: 5px;">选择年份：</label>
                    <a-select placeholder="请选择年份" style="width: 160px" v-model="search.year_v" >
                        <a-select-option  :value="yearV-yindex" v-for="yindex of yearLen" :key="yearV-yindex">{{ yearV-yindex }}年</a-select-option>
                    </a-select>
                    
                </a-col>
                
                <a-col :md="2"  style="width: 90px;padding-left: 1px;">
                  <a-button type="primary" icon="search" @click="getFeeRateList()">
                    查询
                  </a-button>
                </a-col>
                <a-col :md="2"  style="width: 90px;padding-left: 1px; margin-left: 20px;">
                    <a-button type="primary" @click="$refs.roomRateSummaryRecord.showRateSummaryRecord({rate_type:0,xtype:1})" >历史快照</a-button>
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
  import newChargeApi from '@/api/community/property/packages';
  import roomRateSummaryRecord from './roomRateSummaryRecord.vue'
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
      title: '已缴房间数',
      dataIndex: 'have_paid_rooms',
      key: 'have_paid_rooms',
    },
    {
      title: '未缴房间数',
      dataIndex: 'no_paid_rooms',
      key: 'no_paid_rooms',
    },
    {
      title: '房间数',
      dataIndex: 'all_rooms',
      key: 'all_rooms',
    },
    {
      title: '房间收费率',
      dataIndex: 'v_room_rate',
      key: 'v_room_rate',
    },
    {
      title: '已缴金额',
      dataIndex: 'have_paid_money',
      key: 'have_paid_money',
    },
    {
      title: '优惠金额',
      dataIndex: 'discount_money',
      key: 'discount_money',
    },
    {
      title: '账单金额',
      dataIndex: 'order_money',
      key: 'order_money',

    },
    {
      title: '金额收费率',
      dataIndex: 'v_money_rate',
      key: 'v_money_rate',
    },
  ];
  export default {
    name: 'villageRoomFeeRate',
    components: {
        roomRateSummaryRecord
    },
    data() {
      return {
        list:[],
        id:0,
        columns,
        search: {year_v:moment().format('YYYY')*1,village_ids:[],w_singles:[],wids:[],single_ids:[]},
        tips_year_v:moment().format('YYYY')*1,
        singleheeper_list: [],
        exportFeeVisible:false,
        loading:false,
        villageList:[],
        yearV:moment().format('YYYY')*1+3,
        yearLen:100,
        singleList:[],
      };
    },
    mounted(){
      this.getFeeRateList()
      this.getPropertyVillageList()
    },
    methods: {
      getFeeRateList() {
          this.request(newChargeApi.getRoomFeeRateList, this.search)
            .then((res) => {
              this.list = res.list;
            }).catch((error) => {
                  
          });
      },
      getPropertyVillageList(){
          this.request(newChargeApi.getPropertyVillageList)
            .then((res) => {
              this.villageList = res.list;
            }).catch((error) => {
                  
          });
      },
      
      handleVillageChange(){
         this.search.w_singles=[];
         this.singleList=[];
         this.search.wids=[];
         this.search.single_ids=[];
        if(this.search.village_ids.length>0){
            let postArr={village_ids:this.search.village_ids}
            this.request('/community/property_api.PropertyWorker/getVillageKeepersList', postArr)
              .then((res) => {
                this.singleheeper_list = res.list
              }).catch((error) => {
           
              })
        }else{
            this.singleheeper_list=[]; 
        }
      },
      handleSelect3Change(){
          
          this.search.single_ids=[];
          if(this.search.village_ids.length<1){
              this.search.wids=[];
              this.singleList=[];
              return true;
          }
          let postArr={village_ids:this.search.village_ids,wids:this.search.wids}
          this.request('/community/property_api.PropertyWorker/getVillageSingleListByWid', postArr)
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