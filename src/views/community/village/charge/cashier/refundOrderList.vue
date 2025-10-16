<template>
    <div class="message-suggestions-list-box">
        <a-collapse accordion>
            <a-collapse-panel key="1" header="操作说明">
                <p>
                    目前支持两种退款模式:<br/>
                    1、是仅退款，不还原账单，即仅退款给用户，账单服务时间不变，该方式可多次进行退款；<br/>
                    2、是退款且还原账单，即仅退款一次，退款成功后，账单服务时间对应还原至账单缴费前时间。<br/>
                    所有退款均原路退回。<br/>
                </p>
            </a-collapse-panel>
        </a-collapse>
      <div class="search-box" >
        <a-row :gutter="30" justify="start">
          <a-col :md="4" style="display: flex;flex-direction: row;">
            <p style="margin-top: 5px;width: 70px !important;">{{$store.getters.config.room_name}}：</p>
            <a-cascader class="cascader_style margin_left_10" :options="options" :load-data="loadDataFunc"
                        :placeholder="'请选择'+$store.getters.config.room_name" change-on-select @change="setVisionsFunc"  v-model="search.vacancy"/>
          </a-col>
          <a-col :md="4"  style="width: 230px">
            <a-input-group compact>
              <label style="margin-top: 5px;">车位号：</label> <a-input style="width: 130px" placeholder="请输入车位号" v-model="search.position_num"/>
            </a-input-group>
          </a-col>
          <a-col :md="5" style="width: 300px;">
            <label style="margin-top: 5px;">所属车库：</label>
            <a-select default-value="0" style="width: 200px" placeholder="请选择车库" v-model="search.garage_id">
              <a-select-option value="0">
                全部
              </a-select-option>
              <a-select-option :value="item.garage_id" v-for="(item,index) in garage_list" :key="index">
                {{item.garage_num}}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :md="4" >
            <label style="margin-top: 5px;">收费项目：</label>
            <a-select default-value="0" style="width: 150px" placeholder="请选择项目" v-model="search.project_id"  @change="projectItemChange">
              <a-select-option value="0">
                全部
              </a-select-option>
              <a-select-option :value="item1.id" v-for="(item1,index1) in project_list" :key="index1">
                {{item1.name}}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :md="4" >
            <label style="margin-top: 5px;">收费标准：</label>
            <a-select default-value="0" style="width: 150px" placeholder="请选择收费标准" v-model="search.rule_id">
              <a-select-option value="0">
                全部
              </a-select-option>
            <a-select-option :value="item2.id" v-for="(item2,index2) in project_rule_list" :key="index2">
              {{ item2.charge_name }}
            </a-select-option>
            </a-select>
          </a-col>
          <a-col :md="4" style="width: 220px">
            <label style="margin-top: 5px;">账单状态：</label>
            <a-select placeholder="请选择账单状态" style="width: 120px"  v-model="search.order_type">
              <a-select-option value="0">全部</a-select-option>
              <a-select-option value="2">部分退款</a-select-option>
              <a-select-option value="1">已退款</a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <a-row :gutter="24" justify="start"  style="margin-top: 10px;">
            <a-col :md="4"  >
              <a-input-group compact>
                <a-select  placeholder="请选择筛选项" style="width: 80px" default-value="name" v-model="search.key_val" @change="keyChange">
                  <a-select-option value="name">
                    姓名
                  </a-select-option>
                  <a-select-option value="phone">
                    电话
                  </a-select-option>
            
                </a-select>
                <a-input style="width: 150px" :placeholder="key_name" v-model="search.value"/>
              </a-input-group>
            </a-col>
        
            <a-col :md="5"  >
              <label style="margin-top: 5px;">支付方式：</label>
              <a-select placeholder="请选择支付方式" style="width: 180px" default-value="0" v-model="search.pay_type">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option :value="item2.id" v-for="(item2,index2) in pay_type_list" :key="index2">
                  {{item2.name}}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :md="6">
             <!-- <label style="margin-top: 5px;">时间筛选：</label>-->
              <a-select  placeholder="请选择筛选项" style="width: 100px" default-value="paytime" v-model="search.key_val1">
                <a-select-option value="paytime">
                  支付时间
                </a-select-option>
                <a-select-option value="refundtime">
                  退款时间
                </a-select-option>
            
              </a-select>
              <a-range-picker @change="dateOnChange" :allowClear='true'  v-model="search.data" style="width: 250px">
                <a-icon slot="suffixIcon" type="calendar" />
              </a-range-picker>
            </a-col>
            <a-col :md="8" style="width: 530px;padding-left:20px;">
              <label style="margin-top: 5px;">计费时间筛选：</label>
                      <span>
                        <a-date-picker
                         
                          :disabled-date="disabledServiceStartDate"
                          @change="serviceStartTimeChange"
                          format="YYYY-MM-DD"
                          placeholder="计费开始时间"
                          @openChange="handleServiceStartOpenChange"
                        /> ~
                         <a-date-picker
                     
                          @change="serviceEndTimeChange"
                          :disabled-date="disabledServiceEndDate"
                          format="YYYY-MM-DD"
                          placeholder="计费结束时间"
                          :open="endServiceOpen"
                          @openChange="handleServiceEndOpenChange"
                        />
                      </span>
            </a-col>

        </a-row> 
        <a-row :gutter="24" justify="start"  style="margin-top: 15px;">
            <a-col :md="6">
              <a-button type="primary" icon="search" @click="searchList()">
                查询
              </a-button>
              <a-button  type="primary" @click="exportListDatas()" style="margin-left: 20px;" v-if="role_export==1">Excel导出</a-button>
               <a-button type="primary" @click="$refs.PrintModel.add(0,0,3,3)" style="margin-left: 20px;">设置打印模板</a-button>
            </a-col>
        </a-row> 
      </div>
        <a-table
                :columns="columns"
                :data-source="data"
                class="components-table-demo-nested"
                :pagination="pagination"
                @change='table_change'
                :loading="loading"  >
      <span slot="action" slot-scope="text, record">
          <a @click="$refs.OrderModel.add(record.order_id)">详情</a>
          <a-divider type="vertical" v-if="!record.is_button" />
          <a   v-if="!record.is_button" @click="checkSetParint(1,record.order_id,record.pigcms_id)">打印</a>
        </span>

        </a-table>
         <span style="margin-left: 35px;position: relative;top: -65px;color: red;font-size: 18px;">合计金额：{{ total_refund_money }}</span>
      <payable-order-info ref="OrderModel" />
      <get-print-template ref="PrintModel" @ok="printBut"/>
      <print-order ref="PrintOrderModel"/>
    </div>
</template>
<script>
    import villageApi from '@/api/community/village'
    import PayableOrderInfo from "@/views/community/village/charge/cashier/payableOrderInfo";
    import { Collapse } from 'ant-design-vue';
    import GetPrintTemplate from '@/views/community/village/charge/cashier/getPrintTemplate';
    import PrintOrder from '@/views/community/village/charge/cashier/printOrder.vue';
	import store from '@/store';
    const columns = [
        { title: store.getters.config.room_name+'号/车位号', dataIndex: 'numbers', key: 'numbers',},
        {title: '缴费人', dataIndex: 'pay_bind_name', key: 'pay_bind_name' },
        { title: '电话',  dataIndex: 'pay_bind_phone', key: 'pay_bind_phone'},
        { title: '收费项目名称',  dataIndex: 'project_name', key: 'project_name'},
        { title: '实际缴费金额',  dataIndex: 'pay_money', key: 'pay_money'},
        { title: '退款金额',  dataIndex: 'refund_money', key: 'refund_money'},
        { title: '支付方式',  dataIndex: 'pay_type', key: 'pay_type'},
        { title: '支付时间',  dataIndex: 'pay_time', key: 'pay_time'},
        { title: '退款时间',  dataIndex: 'updateTime', key: 'updateTime'},
        { title: '开票状态',  dataIndex: 'record_status', key: 'record_status'},
        { title: '账单状态',  dataIndex: 'order_status', key: 'order_status'},
        { title: '操作', key: 'action', dataIndex: '', scopedSlots: {customRender: 'action'}},
    ];
    const data = [];
    export default {
        name: 'refundOrderList',
        filters: {

        },
        components:{
          PayableOrderInfo,
            'a-collapse':Collapse,
            'a-collapse-panel':Collapse.Panel,
            GetPrintTemplate,
            PrintOrder,
        },
        data() {
            return {
                reply_content: '',
                pagination: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                search: { keyword: '',key_val:'name',key_val1:'paytime',garage_id:'0',pay_type:'0',project_id:'0', page: 1 ,service_start_time:'',service_end_time:'',rule_id:'0' },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
              key_name:'请输入姓名',
                columns,
              options: [],
              garage_list:[],
              project_list:[],
               project_rule_list:[],
              pay_type_list:[],
              search_data:'',
              page: 1,
              role_export:0,
              endServiceOpen:false,
              total_refund_money:0,
            };
        },
        activated () {
          this.getList()
          this.getSingleListByVillage()
          this.getProjectList()
          this.getGarageList()
          this.payTypeList()
          this.getProjectRuleList()
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
                this.request(villageApi.refundOrderList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        if(res.role_export!=undefined){
                            this.role_export=res.role_export;
                        }else{
                            this.role_export=1;
                        }
                        if(res.total_refund_money!=undefined){
                            this.total_refund_money=res.total_refund_money;
                        }
                        this.loading = false
                    })
            },
            // 导出
            exportListDatas() {
                this.loading = true;
                this.request(villageApi.exportRefundOrderList, this.search)
                  .then((res) => {
                    window.location.href=res.url;
                    this.loading = false
                  })
              },
          payTypeList(){
            this.request(villageApi.payTypeList)
              .then((res) => {
                console.log('pay_type_list',res)
                this.pay_type_list = res
              })
              .catch((error) => {
                this.loading = false
              })

          },
          // 打印按钮
          printBut () {
            this.table_change({
              current: 1,
            })
          },
          // 校验是否设置打印模板 可直接打印
          checkSetParint (type, order_id = 0, pigcms_id = 0, choice_ids = []) {
            const that = this; const arr_num = 0
            if (type == 2) { // 批量打印判断
              if (choice_ids.length < 1) {
                that.$message.error('请勾选账单')
                return false
              }
              if ((this.arrUnique(choice_ids, 'room_id').length) > 1) {
                that.$message.error('当前仅支持同一个'+store.getters.config.room_name+'进行批量打印已缴账单')
                return false
              }
              if ((this.arrUnique(choice_ids, 'pigcms_id').length) > 1) {
                that.$message.error('当前仅支持同一个缴费人进行批量打印已缴账单')
                return false
              }
              if (choice_ids.length > 50) {
                that.$message.error('最多可选择50个账单打印，您当前选中' + choice_ids.length + '个')
                return false
              }
            }
            this.request(villageApi.checkSetPrint,
            {print_type:3}).then((res) => {
              if (res.template_id && res.template_id > 0) { // 设置指定打印模板
                this.$refs.PrintOrderModel.add(order_id, res.template_id, pigcms_id, choice_ids)
              } else { // 未设置打印模板
                if (type == 1) { // 单条打印
                 this.$refs.PrintModel.add(order_id, pigcms_id,3,3)
                } else { // 批量打印
                  this.$refs.PrintModel.batchPrint(choice_ids,3)
                }
              }
            })
          },
          keyChange(val){
            if (val=='name'){
              this.key_name='请输入姓名'
            }
            if (val=='phone'){
              this.key_name='请输入电话'
            }

          },
            // 添加
            addActive(val) {
                this.getList();
            },
            //编辑
            editActive(val){
                this.getList();
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

          getProjectList(){
            this.request(villageApi.ChargeProjectList,{type:'selectdata'})
              .then((res) => {
                this.project_list = res.list
              })
              .catch((error) => {
                this.loading = false
              })

          },
          projectItemChange(v_id){
              this.getProjectRuleList();
          },
          getProjectRuleList () {
            this.project_rule_list=[];
            this.search.rule_id='0';
            let postTmpData={charge_project_id:this.search.project_id,type:'selectdata'};
            this.request(villageApi.ChargeRuleList,postTmpData)
              .then((res) => {
                this.project_rule_list = res.list
                console.log(this.project_rule_list );
              })
              .catch((error) => {
                this.loading = false
              })
          },
          getGarageList(){
            this.request(villageApi.garageList)
              .then((res) => {
                console.log('garage_list',res)
                this.garage_list = res
              })
              .catch((error) => {
                this.loading = false
              })

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
                pageSize: 10,
                total: 10
              }
              console.log('searchList')
              this.table_change(val)
               // this.getList()
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
                this.search = {  keyword: '', page: 1 };
              let val = {
                current: 1,
                pageSize: 10,
                total: 10
              }
              console.log('searchList')
              this.table_change(val)
              //  this.getList()
            }
        }
    };
</script>
<style lang="less" scoped>
    .message-suggestions-list-box {
        margin: 30px 20px;
        background-color: white;
    }
    .message-suggestions-list-box .search-box {
        padding: 20px 20px;
        border: 1px solid #e4dfdf;
        border-top: 0px solid #e4dfdf;
    }
    label {
        width: 70px; 
    }
    .message-suggestions-list-box .add-box {
        padding: 20px 20px 0;
    }
    .message-suggestions-list-box .components-table-demo-nested {
        padding: 20px;
    }
    .message-suggestions-list-box .message_box {
        padding: 20px;
    }
    .lbsf{
        float: right;margin-right: 24px;
    }
    .padding-tp10{
      padding-top: 15px;
      padding-bottom: 15px;
    }
</style>