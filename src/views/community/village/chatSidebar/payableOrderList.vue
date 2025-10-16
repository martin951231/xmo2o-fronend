<template>
  <div class="message-suggestions-box-1">
    <a-collapse accordion>
      <a-collapse-panel key="1" header="操作说明">
          <p>1、查看当前业主的所有的已缴账单明细，并且可以操作退款及打印账单，每笔已缴账单详细记录展示各个信息，并且支持导出。</p>
          <div style="margin-bottom: 15px;">2、<strong>退款且还原账单举例：</strong>某个{{$store.getters.config.room_name}}分别缴纳了1月、2月、3月的物业费，物业服务到期时间为2022年3月31号，然后退了2月的那笔物业费，退款模式选择【退款且还原账单】<br/>
          退款后，物业服务到期时间变更为2022年2月28号，同时会生成一笔应交账单，账单信息与退掉的那笔账单一致，若生成的应交账单不符合当前的缴费情况，可以修改账单金额或作废账单
          </div>
          <div style="margin-bottom: 15px;">
          3、<strong>仅退款，不还原账单举例：</strong>某个{{$store.getters.config.room_name}}分别缴纳了1月、2月、3月的物业费，物业服务到期时间为2022年3月31号，然后3月开始物业费价格下调，退款模式选择【仅退款，不还原账单】，退款金额改为对应差价金额<br/>
          退款后，物业服务服务时间不变，账单依旧显示在已缴账单，状态显示为部分退款
           </div>
           <div style="margin-bottom: 15px;">
          4、一次性收费规则账单不没有计费开始时间和计费结束时间
          </div>
          <div >
          5、点击【设置打印模板】按钮=>选择打印模板后；会联动收银台打印模板功能，已缴账单列表点击打印按钮直接打印
          
        </div>
      </a-collapse-panel>
    </a-collapse>
    <div class="search-box">
      <a-row :gutter="48" class="suggestions_row">
        <a-col :md="8" :sm="24" class="suggestions_col" v-if="is_vacancy_show">
          <label style="margin-top: 5px;">{{$store.getters.config.room_name}}：</label>
          <a-cascader
            class="cascader_style margin_left_10"
            :options="options"
            :load-data="loadDataFunc"
            :placeholder="'请选择'+$store.getters.config.room_name"
            change-on-select
            @change="setVisionsFunc"
            v-model="search.vacancy"/>
        </a-col>
        <a-col :md="8" :sm="24" class="suggestions_col">
          <a-input-group compact>
            <label style="margin-top: 5px;">车位号：</label> <a-input style="width: 150px" placeholder="请输入车位号" v-model="search.position_num"/>
          </a-input-group>
        </a-col>
        <a-col :md="8" :sm="24" class="suggestions_col" style="width: 320px;">
          <label style="margin-top: 5px;">所属车库：</label>
          <a-select default-value="0" style="width: 190px" placeholder="请选择车库" v-model="search.garage_id">
            <a-select-option value="0">
              全部
            </a-select-option>
            <a-select-option :value="item.garage_id" v-for="(item,index) in garage_list" :key="index">
              {{ item.garage_num }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24" class="suggestions_col">
          <label style="margin-top: 5px;">收费项目：</label>
          <a-select default-value="0" style="width: 170px" placeholder="请选择项目" v-model="search.project_id">
            <a-select-option value="0">
              全部
            </a-select-option>
            <a-select-option :value="item1.id" v-for="(item1,index1) in project_list" :key="index1">
              {{ item1.name }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24" class="suggestions_col" v-if="is_vacancy_show">
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
        <a-col :md="8" :sm="24" class="suggestions_col">
          <label style="margin-top: 5px;">支付方式：</label>
          <a-select placeholder="请选择支付方式" style="width: 177px" v-model="search.pay_type">
            <a-select-option value="0">全部</a-select-option>
            <a-select-option :value="item2.id" v-for="(item2,index2) in pay_type_list" :key="index2">
              {{ item2.name }}
            </a-select-option>
            <!-- <a-select-option value="alipay">支付宝</a-select-option>
              <a-select-option value="wechat">微信</a-select-option>
              <a-select-option value="unionpay">银联</a-select-option>
              <a-select-option value="balance">余额抵扣</a-select-option>-->
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24" class="suggestions_col">
          <label style="margin-top: 5px;">开票状态：</label>
          <a-select placeholder="请选择开票状态" style="width: 158px" v-model="search.invoice_type">
            <a-select-option value="0">全部</a-select-option>
            <a-select-option value="1">已开票</a-select-option>
            <a-select-option value="2">未开票</a-select-option>
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24" class="suggestions_col">
          <label style="margin-top: 5px;">账单状态：</label>
          <a-select placeholder="请选择账单状态" style="width: 150px" v-model="search.order_type">
            <a-select-option value="0">全部</a-select-option>
            <a-select-option value="2">部分退款</a-select-option>
            <a-select-option value="1">正常</a-select-option>
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24" class="suggestions_col" style="width: 420px;">
          <label style="margin-top: 5px;">时间筛选：</label>
          <a-range-picker @change="dateOnChange" :allowClear="true" v-model="search.data" style="width: 270px;">
            <a-icon slot="suffixIcon" type="calendar" />
          </a-range-picker>
        </a-col>
        <a-col :md="2" :sm="24" class="suggestions_col_btn">
          <a-button type="primary" icon="search" @click="searchList()">
            查询
          </a-button>
        </a-col>
        <a-col :md="2" :sm="24" class="suggestions_col_btn">
          <a-button type="primary" @click="printList()" >Excel导出</a-button>
        </a-col>

        <a-col :md="2" :sm="24" class="suggestions_col_btn" style="width: 190px;">
          <a-button type="primary" @click="checkSetParint(2,0,0,choice_ids)">同一缴费人批量打印</a-button>
        </a-col>

        <a-col :md="2" :sm="24" class="suggestions_col_btn">
          <a-button type="primary" @click="$refs.PrintModel.add(0,0,2)">设置打印模板</a-button>
        </a-col>
      </a-row>

    </div>
    <a-table
      :columns="columns"
      :data-source="data"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      class="components-table-demo-nested"
      :pagination="pagination"
      @change="table_change"
      :loading="loading" >
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.OrderModel.add(record.order_id,record.check_apply_id)">详情</a>
        <a-divider type="vertical"/>
        <a v-if="!record.my_check_status || record.my_check_status==0" @click="$refs.RefundModel.add(record.order_id,record.pay_money,record.pay_type_way, [{title:$store.getters.config.room_name+'号/车位号',value:record.numbers},{title:'缴费人',value:record.pay_bind_name},{title:'电话',value:record.pay_bind_phone},{title:'收费项目名称',value:record.project_name}], record.order_type)">退款</a>
        <a v-if="record.my_check_status==3" style="color: #808080;">已审核</a>
        <a v-if="record.my_check_status==2" @click="$refs.checkRefundModel.add(record.order_id,record.order_apply_info,'order_refund')">需审核</a>
        <a-divider type="vertical"/>
        <a  :disabled="record.is_button" @click="checkSetParint(1,record.order_id,record.pigcms_id)">打印</a>
      </span>

    </a-table>
    <payable-order-info ref="OrderModel"/>
    <add-refund-info ref="RefundModel" @ok="bindOk"/>
    <check-refund-info ref="checkRefundModel" @ok="bindOk"/>
    <get-print-template ref="PrintModel" @ok="printBut"/>
    <print-order ref="PrintOrderModel"/>

    <a-modal
      :title="modalTitle"
      :width="600"
      :visible="visible"
      v-if="visible"
      :maskClosable="false"
      :confirmLoading="confirmLoading"
      @ok="excelExport"
      @cancel="handleCancel">

      <label style="margin-right: 10px;">导出模式：</label>
      <a-radio-group v-model="exportPattern">
        <a-radio :value="1">多行显示模式</a-radio>
        <a-radio :value="2">合并显示模式</a-radio>
      </a-radio-group>

    </a-modal>

  </div>

</template>
<script>
    import villageApi from '@/api/community/village'
    import PayableOrderInfo from '@/views/community/village/charge/cashier/payableOrderInfo'
    import AddRefundInfo from '@/views/community/village/charge/cashier/addRefundInfo'
    import GetPrintTemplate from '@/views/community/village/charge/cashier/getPrintTemplate'
    import checkRefundInfo from '@/views/community/village/charge/cashier/checkRefundInfo'
    import { Collapse } from 'ant-design-vue'
    import PrintOrder from '@/views/community/village/charge/cashier/printOrder.vue'

    const columns = [
      { title: store.getters.config.room_name+'号/车位号', dataIndex: 'numbers', key: 'numbers' },
      { title: '缴费人', dataIndex: 'pay_bind_name', key: 'pay_bind_name' },
      { title: '电话', dataIndex: 'pay_bind_phone', key: 'pay_bind_phone' },
      { title: '收费项目名称', dataIndex: 'project_name', key: 'project_name' },
      { title: '实际缴费金额', dataIndex: 'pay_money', key: 'pay_money' },
      { title: '支付方式', dataIndex: 'pay_type', key: 'pay_type' },
      { title: '支付时间', dataIndex: 'pay_time', key: 'pay_time' },
      { title: '开票状态', dataIndex: 'record_status', key: 'record_status' },
      { title: '账单状态', dataIndex: 'order_status', key: 'order_status' },
      { title: '计费开始时间', dataIndex: 'service_start_time', key: 'service_start_time' },
      { title: '计费结束时间', dataIndex: 'service_end_time', key: 'service_end_time' },
      { title: '账单生成时间', dataIndex: 'add_time', key: 'add_time' },
      { title: '审核状态', dataIndex: 'check_status_str', key: 'check_status_str' },
      { title: '操作', key: 'action', width: '170px', dataIndex: '', scopedSlots: { customRender: 'action' } }
    ]
	import store from '@/store';
    const data = []
    export default {
        name: 'PayableOrderList',
        filters: {

        },
        props:{
          pigcmsId: {
              type: Number,
              default: 0
          },
          villageId: {
              type: Number,
              default: 0
          } ,
          usernum: {
              type: String,
              default: ''
          },
          roomId: {
              type: Number,
              default: 0
          }
        },
        components: {
          GetPrintTemplate,
          AddRefundInfo,
          PayableOrderInfo,
            PrintOrder,
          checkRefundInfo,
            'a-collapse': Collapse,
            'a-collapse-panel': Collapse.Panel
        },
        data () {
            return {
              reply_content: '',
              pagination: { pageSize: 10, total: 10, current: 1 },
              search: { keyword: '', key_val: 'name', key_val1: 'paytime', garage_id: '0', pay_type: '0', project_id: '0', page: 1, pigcms_id: 0 },
              form: this.$form.createForm(this),
              visible: false,
              loading: false,
              key_name: '请输入姓名',
              data,
              columns,
              options: [],
              garage_list: [],
              project_list: [],
              pay_type_list: [],
              search_data: '',
              page: 1,
              selectedRowKeys: [],
              choice_ids: [],
              confirmLoading: false,
              exportPattern: 2,
              modalTitle:'Excel导出',
              is_vacancy_show:true,
              is_namephone_show:true,
            }
        },
      // beforeRouteEnter:(to,from,next)=>{
      //   next(vm=>{
      //     if(JSON.stringify(to.query) != "{}"){
      //       console.log('aaaaaa=============',to.query)
      //       vm.search.key_val='name';
      //       vm.search.value=to.query.name;
      //     }
      //   })
      // },
        activated () {

        },
        mounted() {
          console.log("pigcmsId======>", this.pigcmsId) 
          console.log("villageId======>", this.villageId)  
          console.log("usernum======>", this.usernum)
          if(this.pigcmsId>0){
              this.search.pigcms_id=this.pigcmsId;
              this.is_vacancy_show=false;
              this.is_namephone_show=false;
          }else{
              this.is_vacancy_show=true;
              this.is_namephone_show=true;
              this.search.pigcms_id=0;
          }
          if(this.roomId>0){
              this.search.room_id=this.roomId;
          }
          this.getList()
          this.getSingleListByVillage()
          this.getProjectList()
          this.getGarageList()
          this.payTypeList()
        },
        methods: {
          // 获取列表信息
          getList () {
                this.loading = true
                this.search['page'] = this.page
                this.request(villageApi.payableOrderList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                      console.log('list', res.list)
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
          bindOk () {
            this.getList()
          },
          getProjectList () {
            this.request(villageApi.ChargeProjectList)
              .then((res) => {
                this.project_list = res.list
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
          payTypeList () {
            this.request(villageApi.payTypeList)
              .then((res) => {
                console.log('pay_type_list', res)
                this.pay_type_list = res
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
            console.log('search1111', this.search)
          },
          // 表格中变动  这里只针对页面页数切换
          table_change (e) {
                console.log('table_change', e)
                if (e.current && e.current > 0) {
                    this.pagination.current = e.current
                    this.page = e.current
                    this.getList()
                    this.selectedRowKeys = []
                    this.choice_ids = []
                }
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
            },
          // 导出弹出层
          printList () {
              this.visible = true
            },

          // 打印按钮
          printBut () {
            this.table_change({
              current: 1,
              pageSize: 10,
              total: 10
            })
          },

          // 批量打印=>按钮
          onSelectChange (selectedRowKeys, selectedRows) {
            console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows)
            if (selectedRows) {
              const ids = []
              for (var i = 0; i < selectedRows.length; i++) {
                ids.push({
                  orderid: selectedRows[i]['order_id'],
                  pigcms_id: selectedRows[i]['pigcms_id'],
                  room_id: selectedRows[i]['room_id']
                })
              }
              this.choice_ids = ids
              console.log('choice_ids: ', this.choice_ids)
              this.selectedRowKeys = selectedRowKeys
            }
          },
            handleCancel () {
                this.visible = false
                this.exportType = 1
            },
            // 导出Excel
            excelExport () {
                this.loading = true
                this.search['exportPattern'] = this.exportPattern
                console.log(this.search)
                this.request(villageApi.printPayOrderList, this.search).then((res) => {
                        console.log('list', res.list)
                        window.location.href = res.url
                        this.loading = false
                        this.handleCancel()
                    }).catch((error) => {
                    this.loading = false
                    this.handleCancel()
                })
            },

          // 数组去重
          arrUnique (arr, ff = 'pigcms_id') {
            var arr1 = [] // 新建一个数组来存放arr中的值
            for (var i = 0, len = arr.length; i < len; i++) {
              if (arr1.indexOf(arr[i][ff]) === -1) {
                arr1.push(arr[i][ff])
              }
            }
            return arr1
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
                that.$message.error('当前仅支持同一个'+that.$store.getters.config.room_name+'进行批量打印已缴账单')
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
            this.request(villageApi.checkSetPrint).then((res) => {
              if (res.template_id && res.template_id > 0) { // 设置指定打印模板
                this.$refs.PrintOrderModel.add(order_id, res.template_id, pigcms_id, choice_ids)
              } else { // 未设置打印模板
                if (type == 1) { // 单条打印
                 this.$refs.PrintModel.add(order_id, pigcms_id)
                } else { // 批量打印
                  this.$refs.PrintModel.batchPrint(choice_ids)
                }
              }
            })
          }

        }
    }
</script>
<style lang="less" scoped>
    .message-suggestions-box-1 {
        background-color: white;
    }
    .message-suggestions-box-1 .search-box {
      padding: 20px 20px 0;
      border: 1px solid #e4dfdf;
    }
    .message-suggestions-box-1 .add-box {
        padding: 20px 20px 0;
    }
    .message-suggestions-box-1 .components-table-demo-nested {
        padding: 20px;
    }
    .message-suggestions-box-1 .message_box {
        padding: 20px;
    }
    .lbsf{
        float: right;margin-right: 24px;
    }
    .padding-tp10{
      padding-top: 15px;
      padding-bottom: 15px;
    }
  .mg5_box{
    padding-left: 0 !important;padding-right: 0 !important;margin-left: 0.5%;
  }
  
  .suggestions_row{
      display: flex;
      flex-wrap: wrap;
  }
  
  .suggestions_col{
      display: flex;
      width: 300px;
      margin: 5px;
  }
  
  .suggestions_col_btn{
      width: 120px;
      margin: 5px;
  }

</style>
