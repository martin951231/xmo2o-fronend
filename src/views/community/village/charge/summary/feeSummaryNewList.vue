<template>
    <div class="fee-summary-list-box">
      <a-collapse accordion>
        <a-collapse-panel key="1" header="相关说明">
          <div class="fee-summary-list-tip-box">
              <a-alert message="" type="info">
                <div slot="description">
                  <div>以下所有统计数据均只统计已经支付过的账单（包含退款，不包含作废的账单）；</div>
                  <div>1、【应收费用】：已经支付的账单应收金额统计（包含已经退款的，不包含作废的账单）；</div>
                  <div>2、【实收费用】：已经支付的账单实际用户支付金额统计（包含已经退款的，不包含作废的账单）；</div>
                  <div>3、【退款费用】：已经支付的账单退款金额统计；</div>
                  <div>4、【缴费率】：【实收费用】除以【应收费用】的物业费，再乘以100%，就是物业费缴费率，不考虑退款；</div>
                  <div>5、日期筛选：按已支付的时间计算；</div>
                  <div>6、搜索条件上的统计是包含所有已经支付的且未作废的账单，不受搜索条件影响；</div>
                  <div>7、搜索条件下的统计是按照房屋进行整合显示,展示的姓名和手机号是以取到的缴费记录中的姓名手机号为准；</div>
                  <div>8、搜索条件下的统计可按条件筛选，根据查询变更；</div>
                </div>
              </a-alert>
          </div>
        </a-collapse-panel>
      </a-collapse>
        <div class="fee-summary-list-summary-box">
           <a-row type="flex" justify="space-between" align="bottom">
            <a-col :span="4" style="background-color: #3399cc;">
              <div class="title-box">
                应收费用
              </div>
              <div class="summary_number-box">
                <span class="rmbSymbol">¥</span>{{summaryInfo['summaryTotalMoney']}}
              </div>
            </a-col>
            <a-col :span="4" style="background-color: #1890ff;">
              <div class="title-box">
                实收费用
              </div>
              <div class="summary_number-box">
                <span class="rmbSymbol">¥</span>{{summaryInfo['summaryPayMoney']}}
              </div>
            </a-col>
            <a-col :span="4" style="background-color: #ff9900;">
              <div class="title-box">
                退款费用
              </div>
              <div class="summary_number-box">
                <span class="rmbSymbol">¥</span>{{summaryInfo['summaryRefundMoney']}}
              </div>
            </a-col>
            <a-col :span="4" style="background-color: #975fe4;">
              <div class="title-box">
                缴费率
              </div>
              <div class="summary_number-box">
                {{summaryInfo['summaryMoneyRate']}}
              </div>
            </a-col>
            <a-col :span="4">
            </a-col>
          </a-row>
        </div>
        <div class="search-box">
            <a-row :gutter="48">
                <a-col :md="8" :sm="24" style="padding-right:0px;width:330px ">
                  <label style="margin-top: 5px;">{{$store.getters.config.room_name}}：</label>
                  <a-cascader class="cascader_style margin_left_10" style="width: 260px;" :options="options" :load-data="loadDataFunc"
                              :placeholder="'请选择'+$store.getters.config.room_name" change-on-select @change="setVisionsFunc" v-model="search.vacancy"/>
                </a-col>
              <a-col :md="8" :sm="24" style="width: 250px;padding-right: 1px">
                <a-input-group compact>
                  <label style="margin-top: 5px;">业主：</label> <a-input style="width: 150px" placeholder="请输入业主姓名" v-model="search.name"/>
                </a-input-group>
              </a-col>
              <a-col :md="8" :sm="24" style="width: 250px;padding-right: 1px">
                <a-input-group compact>
                  <label style="margin-top: 5px;">手机号：</label> <a-input style="width: 150px" placeholder="请输入手机号" v-model="search.phone"/>
                </a-input-group>
              </a-col>
              <a-col :md="8" :sm="24"  style="padding-left: 0px;padding-right: 1px;width: 425px">
                <label style="margin-top: 5px;">支付时间筛选：</label>
                <a-range-picker @change="dateOnChange" :allowClear='true'  v-model="search_data" style="width: 325px">
                  <a-icon slot="suffixIcon" type="calendar" />
                </a-range-picker>
              </a-col>
              <a-col :md="8" :sm="24"  style="width: 530px;padding-left:20px; margin-top: 15px;">
                <label style="margin-top: 5px;">计费时间筛选：</label>
                        <span>
                          <a-date-picker
                            v-model="service_start_time"
                            :disabled-date="disabledServiceStartDate"
                            @change="serviceStartTimeChange"
                            format="YYYY-MM-DD"
                            placeholder="计费开始时间"
                            @openChange="handleServiceStartOpenChange"
                          /> ~
                           <a-date-picker
                            v-model="service_end_time"
                            @change="serviceEndTimeChange"
                            :disabled-date="disabledServiceEndDate"
                            format="YYYY-MM-DD"
                            placeholder="计费结束时间"
                            :open="endServiceOpen"
                            @openChange="handleServiceEndOpenChange"
                          />
                        </span>
              </a-col>
                <a-col :md="8" :sm="24" style="padding-left: 25px;padding-right: 1px;width: 90px; margin-top: 15px;">
                    <a-button type="primary" icon="search" @click="searchList()">
                        查询
                    </a-button>
                </a-col>
                <a-col :md="8" :sm="24" style="padding-left: 25px;padding-right: 1px;width: 90px; margin-top: 15px;">
                    <a-button class="ml-20" icon="refresh" @click="resetList"> 重置</a-button>
                </a-col>
            </a-row>
        </div>
        <div class="fee-summary-page-summary-box">
            <a-row type="flex" justify="start">
              <a-col :span="4">
                <span class="page-title-box">
                  应收费用：
                </span>
                <span class="page-number-box">
                  <span class="pageRmbSymbol">¥</span>{{pageSummaryInfo['summaryTotalMoney']}}
                </span>
              </a-col>
              <a-col :span="4">
                <span class="page-title-box">
                  实收费用：
                </span>
                <span class="page-number-box">
                  <span class="pageRmbSymbol">¥</span>{{pageSummaryInfo['summaryPayMoney']}}
                </span>
              </a-col>
              <a-col :span="4">
                <span class="page-title-box">
                  退款费用：
                </span>
                <span class="page-number-box">
                  <span class="pageRmbSymbol">¥</span>{{pageSummaryInfo['summaryRefundMoney']}}
                </span>
              </a-col>
              <a-col :span="4">
                <span class="page-title-box">
                  缴费率：
                </span>
                <span class="page-number-box">
                  {{pageSummaryInfo['summaryMoneyRate']}}
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
                :loading="loading"
                :row-key="record => record.order_id"
                bordered
        >
        </a-table>
    </div>
</template>
<script>
    import villageApi from '@/api/community/village'
	import store from '@/store';
    const columns = [
        { title: store.getters.config.room_name+'号',  dataIndex: 'address', key: 'address'},
        { title: '业主', dataIndex: 'name', key: 'name' },
        { title: '手机号', dataIndex: 'phone', key: 'phone',},
        {title: '应收费用', dataIndex: 'summaryTotalMoney', key: 'summaryTotalMoney' },
        { title: '实收费用',  dataIndex: 'summaryPayMoney', key: 'summaryPayMoney'},
        { title: '退款费用',  dataIndex: 'summaryRefundMoney', key: 'summaryRefundMoney'},
      { title: '实际费用',  dataIndex: 'summaryActualMoney', key: 'summaryActualMoney'},
        { title: '缴费率',  dataIndex: 'summaryMoneyRate', key: 'summaryMoneyRate'},
    ];
    const data = [];
    export default {
        name: 'feeSummaryNewList',
        data() {
            return {
                reply_content: '',
                pagination: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    showTotal: total => `共 ${total} 条`, // 显示总数
                },
              search: { name: '',phone:'',service_start_time:'',service_end_time:''},
              form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
              key_name:'请输入姓名',
                page: 1,
              options: [],
              garage_list:[],
              project_list:[],
              search_data:null,
              summaryInfo:{},
              pageSummaryInfo: {},
              endServiceOpen:false,
              service_start_time:null,
              service_end_time:null,
            };
        },
        mounted () {
          this.getList()
          this.getSingleListByVillage()
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
              this.request(villageApi.feeSummaryList, this.search)
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
            console.log('search', this.search);
          },
          // 进行搜索
          searchList() {
              console.log('search', this.search);
            this.page=1;
            let val = {
              current: 1,
            }
            console.log('searchList')
            this.table_change(val)
          },
          // 楼栋号
          getSingleListByVillage() {
            this.request(villageApi.getSingleListByVillage).then(res => {
              console.log('+++++++Single', res)
              if (res) {
                let array = []
                res.map(pro => {
                  array.push({
                    label: pro.name,
                    value: pro.id,
                    isLeaf: false
                  });
                });
                this.options = array
              }
            });
          },
          // 单元楼
          getFloorList(id) {
            return new Promise(resolve => {
              this.request(villageApi.getFloorList, {
                pid: id
              }).then(res => {
                console.log('+++++++Single', res)
                console.log("resolve", resolve)
                resolve(res);
              });
            });
          },
          // 楼层
          getLayerList(id) {
            return new Promise(resolve => {
              this.request(villageApi.getLayerList, {
                pid: id
              }).then(res => {
                console.log('+++++++Single', res)
                if (res) {
                  resolve(res);
                }
              });
            })
          },
          // 房间
          getVacancyList(id) {
            return new Promise(resolve => {
              this.request(villageApi.getVacancyList, {
                pid: id
              }).then(res => {
                console.log('+++++++Single', res)
                if (res) {
                  resolve(res);
                }
              });
            })
          },
          async loadDataFunc(selectedOptions) {
            const targetOption = selectedOptions[selectedOptions.length - 1];
            targetOption.loading = true;
            setTimeout(function() {
              targetOption.loading = false;
            }, 100)
          },
          // 处理加载漏洞单元（选择、编辑时可用）
          async setVisionsFunc(selectedOptions) {
            if (selectedOptions.length === 1) {
              const options_temp = [...this.options];
              const res = await this.getFloorList(selectedOptions[0]);
              console.log("res", res)
              const children = [];
              res.map(pro => {
                children.push({
                  label: pro.name,
                  value: pro.id,
                  isLeaf: false
                });
                options_temp['children'] = children
                return true;
              });
              options_temp.find(_ => _.value === selectedOptions[0])['children'] = children;
              this.options = options_temp
            } else if (selectedOptions.length === 2) {
              const apps = await this.getLayerList(selectedOptions[1]);
              const options_temp = [...this.options];
              // const apps = await getDirectoryApp(selectedOptions[1]);
              const children = [];
              apps.map(pro => {
                children.push({
                  label: pro.name,
                  value: pro.id,
                  isLeaf: false
                });
                return true;
              });
              const product = options_temp.find(_ => _.value === selectedOptions[0]);
              product.children.find(_ => _.value === selectedOptions[1])['children'] = children;
              this.options = options_temp
            } else if (selectedOptions.length === 3) {
              const apps = await this.getVacancyList(selectedOptions[2]);
              const options_temp = [...this.options];
              // const apps = await getDirectoryApp(selectedOptions[1]);
              const children = [];
              apps.map(pro => {
                children.push({
                  label: pro.name,
                  value: pro.id,
                  isLeaf: true
                });
                return true;
              });
              const product = options_temp.find(_ => _.value === selectedOptions[0]);
              const product_1 = product.children.find(_ => _.value === selectedOptions[1])
              product_1.children.find(_ => _.value === selectedOptions[2])['children'] = children;
              this.options = options_temp
              console.log("_this.options", this.options)
            }
          },
          disabledServiceStartDate(startValue) {
            const endValue = this.search.service_end_time;
            if (!startValue || !endValue) {
              return false;
            }
            return startValue.valueOf() > endValue.valueOf();
          },
          serviceStartTimeChange(date,dateString){
              console.log('serviceStartTime',dateString);
              this.search.service_start_time=dateString;
          },
          disabledServiceEndDate(endValue) {
            const startValue = this.search.service_start_time;
            if (!endValue || !startValue) {
              return false;
            }
            return startValue.valueOf() >= endValue.valueOf();
          },
          serviceEndTimeChange(date,dateString){
              console.log('serviceEndTime',dateString);
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
          // 进行重置
          resetList() {
              this.search = { name: '',phone:'',service_start_time:'',service_end_time:''};
              this.search_data = null;
              this.service_start_time=null;
              this.service_end_time=null;
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