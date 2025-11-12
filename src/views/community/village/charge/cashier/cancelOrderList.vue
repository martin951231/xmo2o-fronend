<template>
  <div class="message-suggestions-list-box">
    <a-collapse accordion>
      <a-collapse-panel key="1" header="操作说明">
        <p>
          针对账单生成错误或计算错误的【应收账单】，物业可一键作废掉账单，重新按照调整过的收费标准生成账单，所有的【作废账单】都可在对应的作废账单汇总中查询，方便物业统计查看。
        </p>
      </a-collapse-panel>
    </a-collapse>
    <div class="search-box">
      <a-row :gutter="48">
        <a-col :md="8" :sm="24" style="padding-right:0px;width: 16.7% ">
          <label style="margin-top: 5px;">{{$store.getters.config.room_name}}：</label>
          <a-cascader
            class="cascader_style margin_left_10"
            style="width: 80%"
            :options="options"
            :load-data="loadDataFunc"
            :placeholder="'请选择'+$store.getters.config.room_name"
            change-on-select
            @change="setVisionsFunc"
            v-model="search.vacancy"/>
        </a-col>
        <a-col :md="8" :sm="24" style="width: 250px;padding-right: 1px">
          <a-input-group compact>
            <label style="margin-top: 5px;">车位号：</label> <a-input style="width: 150px" placeholder="请输入车位号" v-model="search.position_num"/>
          </a-input-group>
        </a-col>
        <a-col :md="8" :sm="24" style="padding-left: 5px; padding-right: 5px;width: 280px;">
          <label style="margin-top: 5px;">所属车库：</label>
          <a-select default-value="0" style="width: 200px" placeholder="请选择车库" v-model="search.garage_id">
            <a-select-option value="0">
              全部
            </a-select-option>
            <a-select-option :value="item.garage_id" v-for="(item,index) in garage_list" :key="index">
              {{ item.garage_num }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24" style="padding-left: 5px; padding-right: 5px;width: 280px;">
          <label style="margin-top: 5px;">收费项目：</label>
          <a-select default-value="0" style="width: 200px" placeholder="请选择项目" v-model="search.project_id"  @change="projectItemChange">
            <a-select-option value="0">
              全部
            </a-select-option>
            <a-select-option :value="item1.id" v-for="(item1,index1) in project_list" :key="index1">
              {{ item1.name }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24" style="padding-left: 5px; padding-right: 5px;width: 280px;">
          <label style="margin-top: 5px;">收费标准：</label>
          <a-select default-value="0" style="width: 200px" placeholder="请选择收费标准" v-model="search.rule_id">
            <a-select-option value="0">
              全部
            </a-select-option>
            <a-select-option :value="item2.id" v-for="(item2,index2) in project_rule_list" :key="index2">
              {{ item2.charge_name }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24" style="width: 250px;padding-right: 5px;padding-left: 5px">
          <a-input-group compact>
            <a-select placeholder="请选择筛选项" style="width: 80px" default-value="name" v-model="search.key_val" @change="keyChange">
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
      </a-row>
      <a-row>
        <a-col :md="8" :sm="24" style="padding-left: 0;padding-right: 5px;width: 420px;margin-top: 15px">
          <label style="margin-top: 5px;">作废时间筛选：</label>
          <a-range-picker @change="dateOnChange" :allowClear="true" v-model="search_data" style="width: 310px">
            <a-icon slot="suffixIcon" type="calendar" />
          </a-range-picker>
        </a-col>
        <a-col :md="8" :sm="24"  style="width: 530px;padding-left:20px; margin-top: 15px;">
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
        <a-col :md="2" :sm="24" class="padding-tp10" style="padding-left: 25px;padding-right: 1px;width: 300px;">
          <a-button type="primary" icon="search" @click="searchList()">
            查询
          </a-button>
           <a-button type="primary" @click="exportDiscardOrderData()" style="margin-left: 20px;">Excel导出</a-button>
        </a-col>
      </a-row>

    </div>
    <a-table
      :columns="columns"
      :data-source="data"
      class="components-table-demo-nested"
      :pagination="pagination"
      @change="table_change"
      :loading="loading"
    >
    </a-table>
    <span style="margin-left: 35px;position: relative;top: -65px;color: red;font-size: 18px;">合计金额：{{ cancel_total_money }}</span>
    <a-modal title="请稍等,正在为您导出数据..." :visible="export_tips_visible" :closable="false" :mask-closable="false" :footer="null"
        :width="550">
        <div>
            <a-spin size="large" />
            <span style=" margin-left: 25px;">导出数据中,请耐心等待,数量越多时间越长。</span>
            <p style="margin: 15px;">若长时间未成功导出，建议调整筛选条件减少导出数量，然后分多次导出。</p>
        </div>
    </a-modal>
  </div>
</template>
<script>
    import villageApi from '@/api/community/village'
    import { Collapse } from 'ant-design-vue'
	import store from '@/store';
    const columns = [
        { title: store.getters.config.room_name+'号/车位号', dataIndex: 'numbers', key: 'numbers' },
        { title: '收费项目名称', dataIndex: 'project_name', key: 'project_name' },
        { title: '所属收费科目', dataIndex: 'charge_number_name', key: 'charge_number_name' },
        { title: '应收金额', dataIndex: 'total_money', key: 'total_money' },
        { title: '业主名', dataIndex: 'user_name', key: 'user_name' ,width: 100},
        { title: '电话', dataIndex: 'user_phone', key: 'user_phone' },
        { title: '计费开始时间', dataIndex: 'service_start_time', key: 'service_start_time' },
        { title: '计费结束时间', dataIndex: 'service_end_time', key: 'service_end_time' },
        { title: '上次读数', dataIndex: 'last_ammeter', key: 'last_ammeter' },
        { title: '本次读数', dataIndex: 'now_ammeter', key: 'now_ammeter' },
        { title: '账单作废时间', dataIndex: 'updateTime', key: 'updateTime' },
        { title: '作废原因', dataIndex: 'discard_reason', key: 'discard_reason',width: 220},
        { title: '操作人', dataIndex: 'role_name', key: 'role_name',width:120 }
    ]
    const data = []
    export default {
        name: 'CancelOrderList',
        filters: {

        },
        components: {
            'a-collapse': Collapse,
            'a-collapse-panel': Collapse.Panel
        },
        data () {
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
                },
              search: { keyword: '', key_val: 'name', key_val1: 'paytime', garage_id: '0', pay_type: '0', project_id: '0', page: 1,service_start_time:'',service_end_time:'',rule_id:'0' },
              form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
              key_name: '请输入姓名',
                page: 1,
              options: [],
              garage_list: [],
              project_list: [],
              project_rule_list:[],
              search_data: null,
              endServiceOpen:false,
              cancel_total_money:0,
              export_tips_visible:false,
              excelExportOutFileUrl:'',
              export_out_id:0,
              setTimeoutS:null,
            }
        },
        activated () {
          this.getList()
          this.getSingleListByVillage()
          this.getGarageList()
          this.getProjectList()
          this.getProjectRuleList()
        },
        methods: {
            // 获取列表信息
            getList () {
                this.loading = true
                this.search['page'] = this.page
                this.search['limit'] = this.pagination.pageSize
                this.request(villageApi.CancelOrderList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.loading = false
                        if(res.cancel_total_money!=undefined){
                            this.cancel_total_money=res.cancel_total_money;
                        }
                         this.excelExportOutFileUrl=res.excelExportOutFileUrl;
                    })
            },
            onTableChange(page,pageSize){
                this.page = page
                this.pagination.current = page
                this.pagination.pageSize = pageSize
            },
          keyChange (val) {
            if (val == 'name') {
              this.key_name = '请输入姓名'
            }
            if (val == 'phone') {
              this.key_name = '请输入电话'
            }
          },
            // 添加
            addActive (val) {
                this.getList()
            },
            // 编辑
            editActive (val) {
                this.getList()
            },

            // 表格中变动  这里只针对页面页数切换
            table_change (e) {
                console.log('e', e)
                if (e.current && e.current > 0) {
                  this.pagination.current = e.current
                    this.page = e.current
                    this.getList()
                }
            },
          getGarageList () {
            this.request(villageApi.garageList)
              .then((res) => {
                console.log('garage_list', res)
                this.garage_list = res
              })
              .catch((error) => {
                this.loading = false
              })
          },
          getProjectList () {
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
          // 日期切换，重新赋值
          dateOnChange (date, dateString) {
            this.search.date = dateString
            console.log('search', this.search)
          },
            // 进行搜索
            searchList () {
                console.log('search', this.search)
              this.page = 1
              const val = {
                current: 1,
                pageSize: 10,
                total: 10
              }
              console.log('searchList')
              this.table_change(val)
               // this.getList()
            },
            // 导出弹出层
            exportDiscardOrderData () {
                this.export_tips_visible=true;
                this.loading = true

                this.request('/community/village_api.Cashier/exportDiscardOrders', this.search).then((res) => {
                        this.export_out_id = res.export_id
                        this.excelExportOutFileUrl= this.excelExportOutFileUrl + '&id=' + res.export_id
                        console.log('excelExportOutFileUrl',this.excelExportOutFileUrl)
                        this.CheckExportOutStatus();
                    }).catch((error) => {
                    this.loading = false
                })
            },
             CheckExportOutStatus () {
                let excelExportOutFileUrlCheck = this.excelExportOutFileUrl + '&ajax=village_ajax'
                console.log('excelExportOutFileUrlCheck',this.excelExportOutFileUrlCheck)
                this.request(excelExportOutFileUrlCheck, {
                        tokenName: 'village_access_token',
                        ajax: 'village_ajax'
                    })
                    .then((res) => {
                        console.log('exportOutStatus',res)
                        if (res.error_code == 0) {
                            clearTimeout(this.setTimeoutS)
                            this.setTimeoutS = null
                            window.location.href = this.excelExportOutFileUrl;
                            this.export_tips_visible = false;
                            this.loading = false
                            return false;
                        } else if(res.error_code == 404){
                             this.export_tips_visible = false;
                             this.loading = false
                            clearTimeout(this.setTimeoutS)
                            this.setTimeoutS = null
                            this.$message.error(res.error_msg)
                            return false
                        }else {
                            this.setTimeoutS = setTimeout(this.CheckExportOutStatus, 2000);
                        }
                    }).catch((error) => {
                        this.$message.error('出错了，请刷新页面重试！')
                        this.export_tips_visible = false;
                        this.loading = false
                    })
            },
          // 楼栋号
          getSingleListByVillage () {
            this.request(villageApi.getSingleListByVillage).then(res => {
              console.log('+++++++Single', res)
              if (res) {
                const array = []
                res.map(pro => {
                  array.push({
                    label: pro.name,
                    value: pro.id,
                    isLeaf: false
                  })
                })
                this.options = array
              }
            })
          },
          // 单元楼
          getFloorList (id) {
            return new Promise(resolve => {
              this.request(villageApi.getFloorList, {
                pid: id
              }).then(res => {
                console.log('+++++++Single', res)
                console.log('resolve', resolve)
                resolve(res)
              })
            })
          },
          // 楼层
          getLayerList (id) {
            return new Promise(resolve => {
              this.request(villageApi.getLayerList, {
                pid: id
              }).then(res => {
                console.log('+++++++Single', res)
                if (res) {
                  resolve(res)
                }
              })
            })
          },
          // 房间
          getVacancyList (id) {
            return new Promise(resolve => {
              this.request(villageApi.getVacancyList, {
                pid: id
              }).then(res => {
                console.log('+++++++Single', res)
                if (res) {
                  resolve(res)
                }
              })
            })
          },
          async loadDataFunc (selectedOptions) {
            const targetOption = selectedOptions[selectedOptions.length - 1]
            targetOption.loading = true
            setTimeout(function () {
              targetOption.loading = false
            }, 100)
          },
          // 处理加载漏洞单元（选择、编辑时可用）
          async setVisionsFunc (selectedOptions) {
            if (selectedOptions.length === 1) {
              const options_temp = [...this.options]
              const res = await this.getFloorList(selectedOptions[0])
              console.log('res', res)
              const children = []
              res.map(pro => {
                children.push({
                  label: pro.name,
                  value: pro.id,
                  isLeaf: false
                })
                options_temp['children'] = children
                return true
              })
              options_temp.find(_ => _.value === selectedOptions[0])['children'] = children
              this.options = options_temp
            } else if (selectedOptions.length === 2) {
              const apps = await this.getLayerList(selectedOptions[1])
              const options_temp = [...this.options]
              // const apps = await getDirectoryApp(selectedOptions[1]);
              const children = []
              apps.map(pro => {
                children.push({
                  label: pro.name,
                  value: pro.id,
                  isLeaf: false
                })
                return true
              })
              const product = options_temp.find(_ => _.value === selectedOptions[0])
              product.children.find(_ => _.value === selectedOptions[1])['children'] = children
              this.options = options_temp
            } else if (selectedOptions.length === 3) {
              const apps = await this.getVacancyList(selectedOptions[2])
              const options_temp = [...this.options]
              // const apps = await getDirectoryApp(selectedOptions[1]);
              const children = []
              apps.map(pro => {
                children.push({
                  label: pro.name,
                  value: pro.id,
                  isLeaf: true
                })
                return true
              })
              const product = options_temp.find(_ => _.value === selectedOptions[0])
              const product_1 = product.children.find(_ => _.value === selectedOptions[1])
              product_1.children.find(_ => _.value === selectedOptions[2])['children'] = children
              this.options = options_temp
              console.log('_this.options', this.options)
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
            resetList () {
                this.search = { keyword: '', page: 1 }
                this.getList()
            }

        }
    }
</script>
<style lang="less" scoped>
    .message-suggestions-list-box {
        margin: 30px 20px;
        background-color: white;
    }
    .message-suggestions-list-box .search-box {
        padding: 20px 20px 0;
      border: 1px solid #e4dfdf;
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
