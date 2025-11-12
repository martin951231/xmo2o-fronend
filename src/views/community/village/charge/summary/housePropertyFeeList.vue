<template>
    <div class="fee-summary-list-box">
      <a-collapse accordion  style="display: none;">
        <a-collapse-panel key="1" header="相关说明">
          <div class="fee-summary-list-tip-box">
              <a-alert message="" type="info" style="display: none;">
                <div slot="description">
                  <div>1、【合计应收费用】：已经付款和还没有付款的总的应收费用；</div>
                  <div>2、【免收费用】：是指在给{{$store.getters.config.room_name}}/业主生成欠费账单时，所有优惠的金额
                        <div style="margin-left:77px;">场景：<br/>
                        1、对{{$store.getters.config.room_name}}生成的账单未进行修改；<br/>
                        2、对{{$store.getters.config.room_name}}生成的账单进行修改（且修改的费用小于应收费用）；<br/>
                        3、对{{$store.getters.config.room_name}}生成的账单进行修改（且修改的费用大于应收费用）；<br/>
                        </div>
                    </div>
                  <div>3、【已收费用】：已收费用是统计用户实际支付的金额费用
                        <div style="margin-left:77px;">场景<br/>
                        1、对{{$store.getters.config.room_name}}生成的账单未进行修改；<br/>
                        2、对{{$store.getters.config.room_name}}生成的账单进行修改（且修改的费用小于应收费用）；<br/>
                        3、对{{$store.getters.config.room_name}}生成的账单进行修改（且修改的费用大于应收费用）；</div>
                    </div>
                  <div>4、【应收费用】：还没有付款的待缴账单金额；</div>
                 <div> 5、【缴费率】：【已收费用】除以【应收费用-免收费用】的物业费，再乘以100%，就是物业费缴费率，不考虑退款；</div>
                </div>
              </a-alert>
          </div>
        </a-collapse-panel>
      </a-collapse>

        <div class="search-box">
            <a-row :gutter="48">
                <a-col :md="4" :sm="24" style="padding-right:0px;">
                  <label style="margin-top: 5px;">收费类别：</label>
                  <a-select v-model="search.charge_type" style="width: 160px"  @change="handleChargeTypeChange" placeholder="请选择收费类别">
                    <a-select-option v-for="item in chargeType" :key="item.key">{{ item.value }}</a-select-option>
                  </a-select>
                </a-col>
              <a-col :md="5" :sm="24" style="padding-right: 1px;padding-left: 10px;">
                  <label style="margin-top: 5px;">收费项目：</label>
                  <a-select v-model="search.charge_project_id" style="width: 210px" placeholder="请选择收费项目">
                    <a-select-option v-for="itemp in chargeProject" :key="itemp.id">{{ itemp.name }}</a-select-option>
                  </a-select>
              </a-col>
              <a-col :md="4" :sm="12" style="padding-left: 1px;padding-right: 2px">
                  <label style="margin-top: 5px;">收费标准：</label>
                <a-input style="width: 170px" placeholder="请输入收费标准名称" v-model="search.rule_name"/>
              </a-col>
              <a-col :md="8" :sm="24"  style="padding-left: 1px;padding-right: 1px;width: 490px">
                <label style="margin-top: 5px;">计费时间：</label>
                <a-select placeholder="请选择账单计费时间" style="width: 150px" v-model="search.order_service_type" @change="changeOrderServiceType">
                    <a-select-option value="0">计费开始结束时间</a-select-option>
                    <a-select-option value="1">计费开始时间</a-select-option>
                    <a-select-option value="2">计费结束时间</a-select-option>
                </a-select>
                <a-range-picker @change="dateOnChange" :allowClear='true'  v-model="search_data" style="width: 260px">
                  <a-icon slot="suffixIcon" type="calendar" />
                </a-range-picker>
              </a-col>
                <a-col :md="6" :sm="24" style="padding-left: 20px;padding-right: 1px;width: 90px;">
                    <a-button type="primary" icon="search" @click="searchList()">
                        查询
                    </a-button>
                </a-col>
                <a-col :md="6" :sm="24" style="padding-left: 10px;padding-right: 1px;width: 90px;">
                    <a-button class="ml-20" icon="refresh" @click="resetList"> 重置</a-button>
                </a-col>
            </a-row>
        </div>
        <div class="fee-summary-page-summary-box">
            <a-row type="flex" justify="start">
              <a-col :span="4">
                <span class="page-title-box">
                  总收应收费用：
                </span>
                <span class="page-number-box">
                  <span class="pageRmbSymbol">¥</span>{{pageSummaryInfo['summaryTotalMoney']}}
                </span>
              </a-col>
              <a-col :span="4">
                <span class="page-title-box">
                  免收费用：
                </span>
                <span class="page-number-box">
                  <span class="pageRmbSymbol">¥</span>{{pageSummaryInfo['discountTotalMoney']}}
                </span>
              </a-col>
              <a-col :span="4">
                <span class="page-title-box">
                  已收费用：
                </span>
                <span class="page-number-box">
                  <span class="pageRmbSymbol">¥</span>{{pageSummaryInfo['summaryPayMoney']}}
                </span>
              </a-col>
              <a-col :span="4">
                <span class="page-title-box">
                  应收费用：
                </span>
                <span class="page-number-box">
                  {{pageSummaryInfo['noPayTotalMoney']}}
                </span>
              </a-col>
              <a-col :span="4">
                <span class="page-title-box">
                  缴费率：
                </span>
                <span class="page-number-box">
                  {{pageSummaryInfo['moneyTotalRate']}}
                </span>
              </a-col>
            </a-row>
        </div>
        <a-table
                :columns="columns"
                :data-source="data"
                class="components-table-demo-nested"
                :pagination="pagination"
                @change='table_change'
                :row-key="record => record.order_id"
                :loading="loading"
                bordered
        >
        </a-table>
    </div>
</template>
<script>
    import villageApi from '@/api/community/village'
    const columns = [
        { title: '收费类别',  dataIndex: 'order_name', key: 'order_name'},
        { title: '收费项目', dataIndex: 'project_name', key: 'project_name' },
        { title: '收费标准', dataIndex: 'rule_name', key: 'rule_name'},
        {title: '总收应收费用', dataIndex: 'summaryTotalMoney', key: 'summaryTotalMoney' },
        { title: '免收费用',  dataIndex: 'discountTotalMoney', key: 'discountTotalMoney'},
        { title: '已收费用',  dataIndex: 'summaryPayMoney', key: 'summaryPayMoney'},
        { title: '应收费用',  dataIndex: 'noPayTotalMoney', key: 'noPayTotalMoney'},
        { title: '缴费率',  dataIndex: 'summaryMoneyRate', key: 'summaryMoneyRate'},
    ];
    const data = [];
    export default {
        name: 'HousePropertyFeeSummary',
        data() {
            return {
                pagination: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    showSizeChanger: false, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
              search: {charge_type:'',charge_project_id:'',rule_name:'',order_service_type:'0'},
              form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
                page: 1,
              chargeType: [],
              chargeProject:[],
              search_data:null,
              summaryInfo:{},
              pageSummaryInfo: {},
            };
        },
        mounted () {
          this.getList()
          this.getChargeTypeList()
        },
        methods: {
            onTableChange(page,pageSize){
                this.page = page
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.getList()
                console.log('onTableChange==>', page, pageSize)
            },
          // 获取列表信息
          getList() {
              this.loading = true;
              this.search['page'] = this.page;
              this.search['limit'] = this.pagination.pageSize;
              this.request(villageApi.getSummaryByRuleList, this.search)
                  .then((res) => {
                      this.pagination.total = res.count ? res.count : 0
                      this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                      this.data = res.list
                      this.summaryInfo = res.summaryInfo
                      this.pageSummaryInfo = res.pageSummaryInfo
                      this.loading = false
                  })
          },
          // 表格中变动  这里只针对页面页数切换
          table_change(e) {
              console.log('e', e)
              if (e.current && e.current>0) {
                this.pagination.current = e.current;
                  this.page = e.current;
                  this.getList()
              }
          },
          // 日期切换，重新赋值
          dateOnChange(date, dateString) {
            this.search.date = dateString;
          },
          // 进行搜索
          searchList() {
              console.log('search', this.search);
            this.page=1;
            let val = {
              current: 1,
            }
            this.table_change(val)
          },
          getChargeTypeList(){
              this.request(villageApi.getChargeTypeList).then(res => {
                if (res) {
                    this.chargeType=res;
                }
              });
          },
          handleChargeTypeChange(value){
              this.search.charge_project_id = '请选择收费项目'
              this.request(villageApi.getChargeProjectByTypeList,{charge_type_key:value}).then(res => {
                if (res) {
                    this.chargeProject=res;
                }
              });
          },
         changeOrderServiceType(typeV){
             this.search_data = null;
             this.search.date=[];
         },
          // 进行重置
          resetList() {
              this.search = {charge_type:'',charge_project_id:'',rule_name:'',order_service_type:'0'};
              this.search_data = null;
              this.getList()
          }
        }
    };
</script>
<style lang="less" scoped>
    .fee-summary-list-box {
        margin: 30px 20px;
        background-color: white;
    }
    .fee-summary-list-box .search-box {
        padding: 20px 20px 0;
    }
    .fee-summary-list-box .add-box {
        padding: 20px 20px 0;
    }
    .fee-summary-list-box .components-table-demo-nested {
        padding: 20px;
    }
    .fee-summary-list-box .message_box {
        padding: 20px;
    }
    .lbsf{
        float: right;margin-right: 24px;
    }
    .padding-tp10{
      padding-top: 15px;
      padding-bottom: 15px;
    }
    .fee-summary-list-tip-box {
      padding:0px 4px;
    }
    .fee-summary-list-summary-box {
      color: white;
      margin: 10px 0;
      padding-left: 20px;
    }
    .fee-summary-list-summary-box .ant-col.ant-col-4 {
      border-radius: 5px;
      padding: 10px;
    }
    .fee-summary-list-summary-box .title-box {
      font-size: 10px;
    }
    .fee-summary-list-summary-box .summary_number-box{
      font-size: 22px;
      text-align: center;
      font-weight: 600;
      padding: 18px 0;
    }
    .fee-summary-page-summary-box {
      margin-top: 20px;
      padding-left: 20px;
    }
    .fee-summary-page-summary-box .page-title-box {
      font-size: 12px;
      font-weight: 600;
    }
    .fee-summary-page-summary-box .page-number-box {
      font-size: 16px;
      font-weight: 600;
    }
</style>