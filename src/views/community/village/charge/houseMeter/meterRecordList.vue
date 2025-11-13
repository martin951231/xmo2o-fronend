<template>
  <div>
    <a-drawer :width="1700" title="抄表记录" :visible="visible_record" :maskClosable = "false" :confirm-loading="confirmLoading"
             @close="handleCancel" :dialog-style="{ top: '20px' }" >
        <div>
            <a-tabs default-active-key="1" @change="changeType">
                <a-tab-pane key="1" tab="抄表记录" force-render>
                </a-tab-pane>
                <a-tab-pane key="2" tab="抄表用量异常记录">
                </a-tab-pane>
            </a-tabs>
        </div>
      <div class="message-suggestions-list-box">
        <div class="search-box" style="margin-top: 12px;margin-left: 10px" >
          <a-row :gutter="48" style="margin-bottom: 12px">
            <a-col :md="5" style="padding-left: 10px;padding-right: 1px;" v-if="isAihorseCustomized">
                <label style="margin-top: 5px;">拆单编号：</label>
                <a-input style="width: 220px" placeholder="请输入拆单编号" v-model="split_record_no" />
            </a-col>
            
            <a-col :md="5"  style="padding-left: 10px;padding-right: 5px;">
              <label style="margin-top: 5px;">{{$store.getters.config.room_name}}：</label>
              <a-cascader class="cascader_style margin_left_10" style="width:260px" :options="options" :load-data="loadDataFunc"
                          :placeholder="'请选择'+$store.getters.config.room_name" change-on-select @change="setVisionsFunc" v-model="room_id" />
            </a-col>
            <a-col :md="8"  class="padding-tp10" style="padding-left: 5px;padding-right: 1px;width: 410px" >
              <label style="margin-top: 5px;">时间筛选：</label>
              <a-range-picker @change="dateChange" :allowClear='true'  style="width: 325px" v-model="date_time">
                <a-icon slot="suffixIcon" type="calendar" />
              </a-range-picker>
            </a-col>
              <a-col :md="4"  class="padding-tp10" style="padding-left: 5px;padding-right: 1px;width: 200px" v-if="is_show">
                  <label class="label_title">交易类型：</label>
                  <a-select show-search placeholder="请选择" style="width: 110px" v-model="transaction_type">
                      <a-select-option v-for="(item,index) in pay_order_type" :value="item.value">
                          {{item.name}}
                      </a-select-option>
                  </a-select>
              </a-col>
            <a-col :md="2"   style="padding-left: 0px;padding-right: 1px;width: 90px;">
              <a-button type="primary" icon="search" @click="searchList()">
                查询
              </a-button>
            </a-col>
            <a-col :md="2" v-if="role_export==1">
              <a-button  type="primary" @click="printList()">Excel导出</a-button>
            </a-col>

            <a-col :md="2"  v-if="role_import==1">
              <a-button  type="primary" @click="$refs.createUploadModal.add(charge_name,project_id)" >导入</a-button>
            </a-col>
          </a-row>

        </div>
        <br>
        <a-table
          :columns="is_show?columns1:columns"
          :data-source="data"
          class="components-table-demo-nested"
          :pagination="pagination"
          @change='table_change'
          :loading="loading"  >
            <span slot="action" slot-scope="text, record" >
                    <span v-if="record.source_type && record.source_type=='revise_data'" style="color:red;">
                        数据矫正记录
                    </span>
                    
                    <span v-else >
                         <span v-if="role_mfymeter==1">
                            <a @click="$refs.addMeter.edit(record)" v-if="record.is_edit==1" >修改</a>
                            <!--
                            <a-divider type="vertical" v-if="record.order_is_pay==1 && record.mdy_change_ammeter>0 && record.mdy_change_money>0" />
                            <a @click="createNewOrder(record)" v-if="record.order_is_pay==1 && record.mdy_change_ammeter>0 && record.mdy_change_money>0" :loading="createNewOrderLoading">生成账单</a>
                            -->
                      </span>
                </span>
          </span>
           <span slot="note_mark" slot-scope="text, record" >
             <div v-if="record.note">{{record.note}}</div>
             <div v-if="record.split_bak" style="color:red;margin-top: 5px;">{{record.split_bak}}</div>
           </span>
        </a-table>
      </div>
    </a-drawer>
    <meter-upload :height='800' :width="500" ref="createUploadModal" @ok="handleOks"/>
    <add-meter ref="addMeter" @okk="handleOks" />
  </div>
</template>

<script>
    import villageApi from '@/api/community/village'
    import { getSystemName } from '@/utils/util';
    import meterUpload from './uploadMeter.vue'
    import addMeter from "./addMeter.vue";
    const columns = [
        { title: '抄表ID', dataIndex: 'id', key: 'id'},
        { title: '住址', dataIndex: 'address', key: 'address'},
        {title: '姓名', dataIndex: 'name', key: 'name' },
        { title: '电话',  dataIndex: 'phone', key: 'phone'},
        { title: '单价(元)',  dataIndex: 'unit_price', key: 'unit_price'},
        { title: '倍率',  dataIndex: 'rate', key: 'rate'},
        { title: '抄表时间',  dataIndex: 'add_time_txt', key: 'add_time_txt'},
        { title: '起度',  dataIndex: 'start_ammeter', key: 'start_ammeter'},
        { title: '止度',  dataIndex: 'last_ammeter', key: 'last_ammeter'},
        { title: '总价(元)',  dataIndex: 'cost_money', key: 'cost_money'},
        { title: '操作人',  dataIndex: 'realname', key: 'realname'},
        { title: '备注',  dataIndex: 'note', key: 'note'},
        { title: '操作', dataIndex: '',width:190,key: 'action',scopedSlots: {customRender: 'action'}},
    ];
    const columns1 = [
        { title: '抄表ID', dataIndex: 'id', key: 'id'},
        { title: '住址', dataIndex: 'address', key: 'address'},
        {title: '姓名', dataIndex: 'name', key: 'name' },
        { title: '电话',  dataIndex: 'phone', key: 'phone'},
        { title: '单价(元)',  dataIndex: 'unit_price', key: 'unit_price'},
        { title: '倍率',  dataIndex: 'rate', key: 'rate'},
        { title: '抄表时间',  dataIndex: 'opt_meter_time_str', key: 'opt_meter_time_str'},
        { title: '起度',  dataIndex: 'start_ammeter', key: 'start_ammeter'},
        { title: '止度',  dataIndex: 'last_ammeter', key: 'last_ammeter'},
        { title: '总价(元)',  dataIndex: 'cost_money', key: 'cost_money'},
        { title: '交易类型',  dataIndex: 'transaction_type_txt', key: 'transaction_type_txt'},
        { title: '操作人',  dataIndex: 'realname', key: 'realname'},
        { title: '备注',  dataIndex: 'note', key: 'note'},
        { title: '操作', dataIndex: '',width:190,key: 'action',scopedSlots: {customRender: 'action'}},
    ];
    const data = [];
    export default {
        components: {
          meterUpload,
          addMeter
        },
        data(){
            return {
                is_show:true,
                visible_record : false,
                confirmLoading : false,
                data,
                columns,
                columns1,
                options: [],
                pay_order_type: [{
                    name: '全部',
                    value: 0
                },{
                    name: '购买',
                    value: 1
                },{
                    name: '缴费',
                    value: 2
                }],
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
                loading: false,
                charge_name:'',
                rule_name:'',
                project_id:0,
                page:1,
                room_id:[],
                transaction_type:'',
                date_time:[],
                tokenName:'',
                sysName: '',
                createNewOrderLoading:false,
                role_export:0,
                role_import:0,
                role_mfymeter:0,
                total_info:[],
                is_unusual:0,
                jzwsxdsj_customized_meter:0,
                isAihorseCustomized:0,
                split_record_no:'',
            }
        },
        mounted(){
            let sysName = getSystemName(location.hash);
            if (sysName) {
                this.tokenName = sysName + '_access_token';
                this.sysName = sysName;
            } else {
                this.sysName = 'village';
            }
        },
        
        methods:{
            // 日期切换，重新赋值
            dateChange(date, dateString) {
                this.date_time = dateString;
                console.log('dateString', this.date_time);
            },
            get(charge_name,project_id,rule_name){
              this.date_time=[];
              this.room_id=[];
                this.charge_name = charge_name;
                this.project_id = project_id;
                this.page=1;
                if(rule_name){
                    this.rule_name = rule_name;
                }
                this.split_record_no='';
                this.getList(charge_name,project_id);
                this.getSingleListByVillage()
                this.visible_record = true;
            },
            printList() {
                this.loading = true;
                this.request(villageApi.printRecordList, {
                    charge_name:this.charge_name,
                    room_id:this.room_id,
                    date_time : this.date_time,
                    tokenName: this.tokenName,
                    rule_name:this.rule_name,
                    project_id:this.project_id,
                    is_unusual:this.is_unusual,
                    split_record_no:this.split_record_no,
                }).then((res) => {
                        window.location.href=res.url;
                        this.loading = false
                    })
            },
            createNewOrder(record){
                let titleStr='生成新收费订单确认';
                let contentStr='止度增加了'+record.mdy_change_ammeter+'，费用增加了'+record.mdy_change_money+'元，您确认生成收费账单吗？'
                var _this=this;
                this.$confirm({
                  title: titleStr,
                  content: contentStr,
                  onOk() {
                      _this.createNewOrderLoading=true;
                     let postdata={idd:record.id,mdy_change_ammeter:record.mdy_change_ammeter,mdy_change_money:record.mdy_change_money,tokenName: _this.tokenName}
                      _this.request(villageApi.addMdyMeterReadingOrder, postdata)
                        .then((res) => {
                           _this.createNewOrderLoading=false;
                           _this.$message.success('操作成功')
                          _this.getList(_this.charge_name,_this.project_id)
                        })
                  },
                  onCancel() {},
                });
                
            },
            handleOks(){
                this.getList(this.charge_name,this.project_id)
            },
            handleCancel(){
                this.visible_record = false;
            },
            onTableChange(page,pageSize){
                this.page = page
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.getList(this.charge_name,this.project_id)
                console.log('onTableChange==>', page, pageSize)
            },
            table_change(e) {
                console.log('e', e)
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.getList(this.charge_name,this.project_id)
                }
            },
            getList(charge_name,project_id){
                this.loading = true;
                this.request(villageApi.getMeterReadingRecord,{
                    charge_name:charge_name,
                    project_id:project_id,
                    page:this.page,
                    limit:this.pagination.pageSize,
                    room_id:this.room_id,
                    date_time : this.date_time,
                    tokenName: this.tokenName,
                    transaction_type:this.transaction_type,
                    is_unusual:this.is_unusual,
                    split_record_no:this.split_record_no,
                }).then((res)=>{
                    this.pagination.total = res.count ? res.count : 0
                    this.pagination.pageSize = res.total_limit ? res.total_limit : 10;
                    this.data = res.list;
                    this.total_info=res.total_info;
                    this.is_show = res.is_show;
                    if(res.jzwsxdsj_customized_meter!=undefined && res.jzwsxdsj_customized_meter>0){
                        this.jzwsxdsj_customized_meter=res.jzwsxdsj_customized_meter;
                    }
                    if(res.isAihorseCustomized!=undefined && res.isAihorseCustomized>0){
                        this.isAihorseCustomized=res.isAihorseCustomized;
                    }
                    if(this.jzwsxdsj_customized_meter>0){
                       this.columns = [
                            { title: '抄表ID', dataIndex: 'id', key: 'id'},
                            { title: '住址', dataIndex: 'address', key: 'address'},
                            {title: '姓名', dataIndex: 'name', key: 'name' },
                            { title: '电话',  dataIndex: 'phone', key: 'phone'},
                            { title: '单价(元)',  dataIndex: 'unit_price', key: 'unit_price'},
                            { title: '倍率',  dataIndex: 'rate', key: 'rate'},
                            { title: '抄表时间',  dataIndex: 'add_time_txt', key: 'add_time_txt'},
                            { title: '起度',  dataIndex: 'start_ammeter', key: 'start_ammeter'},
                            { title: '止度',  dataIndex: 'last_ammeter', key: 'last_ammeter'},
                            { title: '表号',  dataIndex: 'meter_number', key: 'meter_number'},
                            { title: '最大刻度',  dataIndex: 'meter_max_v', key: 'meter_max_v'},
                            { title: '总价(元)',  dataIndex: 'cost_money', key: 'cost_money'},
                            { title: '操作人',  dataIndex: 'realname', key: 'realname'},
                            { title: '备注',  dataIndex: 'note', key: 'note'},
                            { title: '操作', dataIndex: '',width:190,key: 'action',scopedSlots: {customRender: 'action'}},
                        ];
                    }else if(this.isAihorseCustomized>0){
                      this.columns = [
                           { title: '抄表ID', dataIndex: 'id', key: 'id',width:86},
                           { title: '拆单编号', dataIndex: 'split_record_no', key: 'split_record_no',width: 130},
                           { title: '拆分次数', dataIndex: 'split_num', key: 'split_num',width:90},
                           { title: '住址', dataIndex: 'address', key: 'address'},
                           {title: '姓名', dataIndex: 'name', key: 'name' ,width:90},
                           { title: '电话',  dataIndex: 'phone', key: 'phone'},
                           { title: '单价(元)',  dataIndex: 'unit_price', key: 'unit_price'},
                           { title: '倍率',  dataIndex: 'rate', key: 'rate'},
                           { title: '抄表时间',  dataIndex: 'add_time_txt', key: 'add_time_txt',width:110},
                           { title: '拆分时间',  dataIndex: 'last_time_txt', key: 'last_time_txt',width:110},
                           { title: '起度',  dataIndex: 'start_ammeter', key: 'start_ammeter'},
                           { title: '止度',  dataIndex: 'last_ammeter', key: 'last_ammeter'},
                           { title: '总价(元)',  dataIndex: 'cost_money', key: 'cost_money'},
                           { title: '操作人',  dataIndex: 'realname', key: 'realname',width:100},
                           { title: '备注',  dataIndex: 'note', key: 'note',width:180,scopedSlots: {customRender: 'note_mark'}},
                           { title: '操作', dataIndex: '',width:100,key: 'action',scopedSlots: {customRender: 'action'}},
                           
                       ];
                    }
                    if(res.role_export!=undefined){
                        this.role_export=res.role_export;
                        this.role_import=res.role_import;
                        this.role_mfymeter=res.role_mfymeter;
                    }else{
                        this.role_export=1;
                        this.role_import=1;
                        this.role_mfymeter=1;
                    }
                    this.loading = false
                })
            },
            // 进行搜索
            searchList() {
                this.page=1;
                this.getList(this.charge_name,this.project_id)
            },
            // 楼栋号
            getSingleListByVillage() {
                this.request(villageApi.getSingleListByVillage,{
                    tokenName: this.tokenName
                }).then(res => {
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
                        pid: id,
                        tokenName: this.tokenName
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
                        pid: id,
                        tokenName: this.tokenName
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
                        pid: id,
                        tokenName: this.tokenName
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
                    console.log("options", this.options)
                }else if (selectedOptions.length === 4) {
                    console.log("room_id+++",  this.room_id)
                }
            },

            changeType(e) {
                this.page=1;
                if(e == 1){
                    this.is_unusual = 0;
                }else{
                    this.is_unusual = 1;
                }
                this.getList(this.charge_name,this.project_id)
            }
        }
    }
</script>

<style scoped>
   /deep/ .ant-modal-body{padding: 12px;}
</style>