<template>
    <div class="message-suggestions-list-box">
        <div class="search-box" style="margin: 0px 0px 10px 20px;" v-if="is_customized_meter_reading==1 || is_aihorse_customized==1">
            <a-row :gutter="48">
                <a-col :md="3" style="padding-left: 5px; padding-right: 10px;">
                     <label style="margin-top: 5px;">缴费类型：</label>
                        <a-select placeholder="请选择缴费类型" style="width: 110px" v-model="search.fee_type">
                            <a-select-option value="0">全部</a-select-option>
                            <a-select-option value="1">预存</a-select-option>
                            <a-select-option value="2">抵扣</a-select-option>
                        </a-select>
                            
                </a-col>
                <a-col :md="3" style="padding-left: 5px;padding-right: 10px;" v-if="is_customized_meter_reading==1">
                     <label style="margin-top: 5px;">预存类型：</label>
                        <a-select placeholder="请选择预存类型" style="width: 110px" v-model="money_type">
                            <a-select-option value="0">全部</a-select-option>
                            <a-select-option value="4" v-if="is_customized_meter_reading==1" >冷水</a-select-option>
                            <a-select-option value="3" v-if="is_customized_meter_reading==1" >热水</a-select-option>
                            <a-select-option value="2" v-if="is_customized_meter_reading==1" >电费</a-select-option>
                            <a-select-option value="1">物业费</a-select-option>
                        </a-select>
                </a-col>
                <a-col :md="6" style="padding-left: 5px;padding-right: 10px;">
                     <label style="margin-top: 5px;">预存时间：</label>
                    <a-range-picker @change="dateOnChange" :allowClear='true' v-model="search_data"
                        style="width: 310px">
                        <a-icon slot="suffixIcon" type="calendar" />
                    </a-range-picker>
                </a-col>    
                <a-col :md="3" style="padding-left: 5px;padding-right: 10px;">
                    <a-input-group compact>
                        <p style="margin-top: 5px;">姓名：</p>
                        <a-input style="width: 70%" v-model="search.name" placeholder="请输入姓名"/>
                    </a-input-group>
                </a-col>
                <a-col :md="3" style="padding-left: 5px;padding-right: 10px;">
                    <a-input-group compact>
                        <p style="margin-top: 5px;">手机号：</p>
                        <a-input style="width: 70%" v-model="search.phone" placeholder="请输入手机号"/>
                    </a-input-group>
                </a-col>
                
                <a-col :md="5" style="padding-left: 5px;padding-right: 10px;width: 300px">
                    <a-input-group compact>
                        <p style="margin-top: 5px;">线下支付方式：</p>
                        <a-select v-model="search.off_pay_type" placeholder="请选择线下支付方式" style="width: 180px">
                            <a-select-option key="0" value="0">
                                请选择
                            </a-select-option>
                            <a-select-option v-for="online in offlinePayList" :key="online.id" :value="online.id">
                                {{ online.name }}
                            </a-select-option>
                        </a-select>
                        </a-input-group>
                </a-col>
                
                <a-col :md="2" style="padding-left: 10px;padding-right: 10px;">
                    <a-button type="primary" icon="search"  @click="searchList()">
                        查询
                    </a-button>
                </a-col>
                
                <a-col :md="2" style="padding-left: 5px;padding-right: 10px;" v-if="is_customized_meter_reading==1 || is_aihorse_customized==1">
                       <a-button type="primary" @click="excelExportData()">Excel导出</a-button>
                   </a-col>
            </a-row>
        </div>
        <div style="margin-bottom: 10px">
            <span v-if="is_aihorse_customized == 1" style="position: relative;font-size: 15px;font-weight: 600;">小区用户住户余额总额：{{ now_money }}</span>
        </div>
        <a-table
                :columns="columns"
                :data-source="data"
                class="components-table-demo-nested"
                :pagination="pagination"
                @change='table_change'
                :loading="loading"
                :row-key="record => record.id"
        >
            <span slot="money" slot-scope="text, record">
                <div v-if="record.type == 1" style="color: green;">{{record.money}}</div>
                <div v-if="record.type == 2" style="color: red;">{{record.money}}</div>
            </span>
            <span slot="room_num" slot-scope="text, record">
                <a class="but_1" @click="$refs.roomListModel.List(record.uid)">{{record.room_num}}</a>
            </span>
            
            <span slot="optaction" slot-scope="text, record">
                <a class="but_1" v-if="record.is_print==1" @click="$refs.printPageModel.printShow(record)">打印</a>
            </span>
            
        </a-table>
        <div style="margin-top: 20px;" v-if="is_aihorse_customized == 1">
            <span v-if="prestore_money_show" style="margin-left: 20px;position: relative;top: -65px;color: red;font-size: 18px;">预存总金额：{{ prestore_money }}</span>
            <span v-if="deduction_money_show" style="margin-left: 20px;position: relative;top: -65px;color: red;font-size: 18px;">抵扣总金额：{{ deduction_money }}</span>
        </div>
        
        <a-modal
          title="导出提示"
          :width="450"
          :visible="exportVisible"
          :maskClosable="false"
          :confirmLoading="confirmLoading"
          :footer="null"
          :closable="false"
          :centered="true"
          >
            <div style="padding: 15px;color: black;font-size: 16px;">
                正在为您导出数据，你稍等 . . .
            </div>
        </a-modal>
        <roomList ref="roomListModel" @ok="roomListInfo"/>
        <printPage ref="printPageModel" />
   </div>
</template>
<style>
    /deep/ .imgname{
        width: 100px;
    }
</style>
<script>
    import villageApi from '@/api/community/village'
    import moment from 'moment';
    import roomList from './roomList';
    import printPage from './printPage';
    const columns = [
        { title: '姓名',  dataIndex: 'name', key: 'name'},
        { title: '手机号',  dataIndex: 'phone', key: 'phone'},
        { title: '订单编号',  dataIndex: 'order_no', key: 'order_no'},
        { title: '预存时间', dataIndex: 'add_time', key: 'add_time' },
        { title: '金额变更前（元）', dataIndex: 'current_money', key: 'current_money',},
        { title: '缴费金额（元）', dataIndex: 'money', key: 'money',scopedSlots: { customRender: 'money' }},
        { title: '金额变更后（元）', dataIndex: 'after_price', key: 'after_price',},
        { title: '备注', dataIndex: 'desc', key: 'desc'},
    ];
    const data = [];
    export default {
        name: 'balanceList',
        filters: {

        },
        components:{
            roomList,
            printPage
        },
        data() {
            return {
                pagination: {current:1,  pageSize: 10, total:10 ,showTotal: total => `共 ${total} 条`},
                search: { uid:'', page: 1 ,fee_type:"0",name:'',phone:'', date:[],'off_pay_type':'0'},
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                search_data: [],
                columns,
                title:'',
                confirmLoading:false,
                is_customized_meter_reading:0,
                is_aihorse_customized:0,
                cockpit:0,
                uid:'',
                money_type:"0",
                exportVisible:false,
                prestore_money:0,
                deduction_money:0,
                now_money:0,
                prestore_money_show:0,
                deduction_money_show:0,
                offlinePayList:[],
            };
        },
        mounted() {
            this.getConfigCustomization()
            this.loading = true;
            this.exportVisible=false;
            this.getListData();
            this.getOfflinePayList();
        },
        methods: {
            getConfigCustomization () {
              this.request(villageApi.getConfigCustomization).then(res => {
                console.log('+++++++', res)
                this.is_customized_meter_reading=0;
                if (res && res.is_customized_meter_reading) {
                    this.is_customized_meter_reading=res.is_customized_meter_reading;
                }
                if (res && res.is_aihorse_customized) {
                  this.is_aihorse_customized=res.is_aihorse_customized*1;
                }
                if (res && res.cockpit) {
                    this.cockpit=res.cockpit;
                }
                if(this.is_customized_meter_reading==1){
                    this.columns=[
                        { title: '姓名',  dataIndex: 'name', key: 'name'},
                        { title: '手机号',  dataIndex: 'phone', key: 'phone'},
                        { title: '关联房间数',  dataIndex: 'room_num', key: 'room_num',scopedSlots: { customRender: 'room_num' }},
                        { title: '订单编号',  dataIndex: 'order_no', key: 'order_no'},
                        { title: '预存类型', dataIndex: 'money_type_str', key: 'money_type_str' },
                        { title: '预存时间', dataIndex: 'add_time', key: 'add_time' },
                        { title: '金额变更前（元）', dataIndex: 'current_money', key: 'current_money',},
                        { title: '缴费金额（元）', dataIndex: 'money', key: 'money',scopedSlots: { customRender: 'money' }},
                        { title: '金额变更后（元）', dataIndex: 'after_price', key: 'after_price',},
                        { title: '备注', dataIndex: 'desc', key: 'desc'},
                    ];
                }else if(this.is_aihorse_customized==1){
                    this.columns = [
                        { title: '姓名',  dataIndex: 'name', key: 'name'},
                        { title: '手机号',  dataIndex: 'phone', key: 'phone'},
                        { title: '订单编号',  dataIndex: 'order_no', key: 'order_no'},
                        { title: '预存时间', dataIndex: 'add_time', key: 'add_time' },
                        { title: '金额变更前（元）', dataIndex: 'current_money', key: 'current_money',},
                        { title: '缴费金额（元）', dataIndex: 'money', key: 'money',scopedSlots: { customRender: 'money' }},
                        { title: '金额变更后（元）', dataIndex: 'after_price', key: 'after_price',},
                        { title: '线下支付方式', dataIndex: 'off_pay_type_str', key: 'off_pay_type_str',},
                        { title: '备注', dataIndex: 'desc', key: 'desc'},
                        {title: '操作', dataIndex: 'optaction', key: 'optaction',width:100, scopedSlots: { customRender: 'optaction' },},
                    ];
                }
              })
            },
            getListData(){
                this.search['page'] = this.pagination.current;
                this.search['money_type']=this.money_type;
                this.request(villageApi.storageUserBalanceRecord, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.prestore_money = res.prestore_money
                        this.deduction_money = res.deduction_money
                        this.now_money = res.now_money
                        this.prestore_money_show = res.prestore_money_show
                        this.deduction_money_show = res.deduction_money_show
                        this.loading = false;
                        this.confirmLoading=true;
                        this.visible=true;
                    })
            },
            getOfflinePayList(){
                this.request(villageApi.getOfflinePayTypeList).then((xres) => {
                    this.offlinePayList=xres.list;
                }).catch((error) => {
                    this.offlinePayList=[];
                });
            },
            handleCancel() {
                this.visible = false;
                setTimeout(() => {
                    this.id = '0';
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            // 日期切换，重新赋值
            dateOnChange(date, dateString) {
                this.search.date = dateString;
                console.log('search', this.search);
            },
            cancel() {

            },
            roomListInfo(){
                this.getListData();
            },
            // 导出Excel
            excelExportData () {
                this.exportVisible=true;
                this.loading = true;
                this.confirmLoading= true;
                this.search['uid']=this.uid;
                this.search['money_type']=this.money_type;
                
                this.request(villageApi.excelExportBalanceRecord, this.search).then((res) => {
                        console.log('res', res)
                        if(res && res.url){
                            window.location.href = res.url
                        }
                        this.loading = false
                        this.exportVisible = false;
                        this.confirmLoading= false;
                    }).catch((error) => {
                    this.loading = false
                    this.exportVisible = false;
                    this.confirmLoading= false;
                })
                
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                let _this=this;
                console.log('e', e)
                if (e.current && e.current>0) {
                    _this.pagination.current = e.current;
                    _this.getListData()
                }
            },

            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.table_change({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
            },
            // 进行重置
            resetList() {
                this.search.keyword='';
                this.search.page=1;
                this.table_change({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .message-suggestions-list-box {
        margin: 20px;
        background-color: white;
    }
    </style>