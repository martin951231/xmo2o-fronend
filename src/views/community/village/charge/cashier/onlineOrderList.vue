<template>
  <div class="message-suggestions-box-2">
    <a-collapse accordion>
      <a-collapse-panel key="1" header="操作说明">
        <p>
          第三方支付账单模块展示线上支付的已缴账单列表，可查看账单详情。<br/>
        </p>
      </a-collapse-panel>
    </a-collapse>
    <div class="search-box">
      <a-row :gutter="48">
        <a-col :md="8" :sm="24" style="padding-right:0px;width: 18.3% ">
          <label style="margin-top: 5px;">{{$store.getters.config.room_name}}：</label>
          <a-cascader
            class="cascader_style margin_left_10"
            :options="options"
            :load-data="loadDataFunc"
            :placeholder="'请选择'+$store.getters.config.room_name"
            change-on-select
            @change="setVisionsFunc"
            v-model="search.vacancy" />
        </a-col>
        <a-col :md="8" :sm="24" style="width: 220px;padding-right: 1px">
          <a-input-group compact>
            <label style="margin-top: 5px;">车位号：</label> <a-input style="width: 130px" placeholder="请输入车位号" v-model="search.position_num"/>
          </a-input-group>
        </a-col>
        <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 280px;">
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
        <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 260px;">
          <label style="margin-top: 5px;">收费项目：</label>
          <a-select default-value="0" style="width: 180px" placeholder="请选择项目" v-model="search.project_id"  @change="projectItemChange">
            <a-select-option value="0">
              全部
            </a-select-option>
            <a-select-option :value="item1.id" v-for="(item1,index1) in project_list" :key="index1">
              {{ item1.name }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 260px;">
          <label style="margin-top: 5px;">收费标准：</label>
          <a-select default-value="0" style="width: 180px" placeholder="请选择收费标准" v-model="search.rule_id">
            <a-select-option value="0">
              全部
            </a-select-option>
            <a-select-option :value="item2.id" v-for="(item2,index2) in project_rule_list" :key="index2">
              {{ item2.charge_name }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24" style="width: 250px;padding-right: 1px;padding-left: 1px">
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
      <a-row class="padding-tp10">
        <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 5px;width: 250px;">
          <label style="margin-top: 5px;">支付方式：</label>
          <a-select placeholder="请选择支付方式" style="width: 170px" v-model="search.pay_type">
            <a-select-option value="0">全部</a-select-option>
            <a-select-option :value="item2.id" v-for="(item2,index2) in pay_type_list" :key="index2">
              {{ item2.name }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24" style="padding-left: 5px;padding-right: 1px;width: 470px">
          <label style="margin-top: 5px;">时间筛选：</label>
          <a-range-picker @change="dateOnChange" :allowClear="true" v-model="search.data" style="width: 325px">
            <a-icon slot="suffixIcon" type="calendar" />
          </a-range-picker>
        </a-col>
        <a-col :md="2" :sm="24" style="padding-left: 0px;padding-right: 1px;width: 90px;">
          <a-button type="primary" icon="search" @click="searchList()">
            查询
          </a-button>
        </a-col>
        <a-col :md="2" :sm="24" v-if="role_export==1">
          <a-button type="primary" @click="printList()">Excel导出</a-button>
        </a-col>
      </a-row>

    </div>
    <!--<div style="margin-top: 15px;margin-left: 20px;">总合计：{{ sumMoney }}元</div>-->
    <a-table
      :columns="columns"
      :data-source="data"
      class="components-table-demo-nested"
      :pagination="pagination"
      @change="table_change"
      :loading="loading" >
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.OrderModel.add(record.order_id)">详情</a>
      </span>

    </a-table>
    <span style="margin-left: 35px;position: relative;top: -65px;color: red;font-size: 18px;">合计金额：{{ total_pay_money }}</span>
    <payable-order-info ref="OrderModel" />
  </div>
</template>
<script>
    import villageApi from '@/api/community/village'
    import PayableOrderInfo from '@/views/community/village/charge/cashier/payableOrderInfo'
    import { Collapse } from 'ant-design-vue'
	import store from '@/store';
    const columns = [
        { title: '订单编号', dataIndex: 'order_id', key: 'order_id' },
        { title: '支付单号', dataIndex: 'order_no', key: 'order_no' },
        { title: store.getters.config.room_name+'号/车位号', dataIndex: 'numbers', key: 'numbers' },
        { title: '缴费人', dataIndex: 'pay_bind_name', key: 'pay_bind_name' },
        { title: '电话', dataIndex: 'pay_bind_phone', key: 'pay_bind_phone' },
        { title: '收费项目名称', dataIndex: 'project_name', key: 'project_name' },
        { title: '实际缴费金额', dataIndex: 'pay_money', key: 'pay_money' },
        { title: '支付方式', dataIndex: 'pay_type', key: 'pay_type' },
        { title: '支付时间', dataIndex: 'pay_time', key: 'pay_time' },
        { title: '操作', key: 'action', dataIndex: '', scopedSlots: { customRender: 'action' } }
    ]
    const data = []
    export default {
        name: 'OnlineOrderList',
        filters: {

        },
        components: {
          PayableOrderInfo,
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
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
              search: { keyword: '', key_val: 'name', key_val1: 'paytime', garage_id: '0', pay_type: '0', project_id: '0', page: 1 ,rule_id:'0'},
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
              sumMoney: 0,
              key_name: '请输入姓名',
              options: [],
              garage_list: [],
              project_list: [],
              project_rule_list:[],
              pay_type_list: [],
              search_data: '',
              page: 1,
              role_export:0,
              total_pay_money:0,
            }
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
            getList () {
                this.loading = true
                this.search['page'] = this.page
                this.search['limit'] = this.pagination.pageSize
                this.request(villageApi.onlineOrderList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.sumMoney = res.sumMoney
                        if(res.total_pay_money!=undefined){
                            this.total_pay_money=res.total_pay_money;
                        }
                        if(res.role_export!=undefined){
                            this.role_export=res.role_export;
                        }else{
                            this.role_export=1;
                        }
                        this.loading = false
                    })
            },
          keyChange (val) {
              if (val == 'name') {
                this.key_name = '请输入姓名'
              }
            if (val == 'phone') {
              this.key_name = '请输入电话'
            }
          },
          payTypeList () {
            this.request(villageApi.payTypeList, {
              type: 1
            }).then((res) => {
                console.log('pay_type_list', res)
                this.pay_type_list = res
              })
              .catch((error) => {
                this.loading = false
              })
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
             //   this.getList()
            },
          // 导出
          printList () {
            this.loading = true
            this.request(villageApi.printOnlineOrderList, this.search)
              .then((res) => {
                console.log('list', res.list)
                window.location.href = res.url
                this.loading = false
              })
          }
        }
    }
</script>
<style lang="less" scoped>
    .message-suggestions-box-2 {
        margin: 30px 20px;
        background-color: white;
    }
    .message-suggestions-box-2 .search-box {
        padding: 20px 20px 0;
      border: 1px solid #e4dfdf;
    }
    .message-suggestions-box-2 .add-box {
        padding: 20px 20px 0;
    }
    .message-suggestions-box-2 .components-table-demo-nested {
        padding: 20px;
    }
    .message-suggestions-box-2 .message_box {
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
