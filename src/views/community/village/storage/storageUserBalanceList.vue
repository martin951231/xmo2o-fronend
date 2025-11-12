<template>
    <div class="message-suggestions-list-box userList" >
        <div class="content-p1" >
            <div style="margin-bottom: 10px">
                <a-collapse accordion>
                    <a-collapse-panel key="1" header="操作说明">
                        <span style="font-weight:500 ">
                            1、展示的是当前小区手机号唯一的业主 <br>
                            2、不同手机号业主对应的余额、关联房间数、关联车位数  <br>
                            例如： 张三在平台注册了一个账号，手机号是 18312345678， 并且在该小区1号楼和5号楼都是户主，对于小区而言他仅仅是一个业主，只是拥有了多套房产（或车位），所以这里不会显示两条张三的信息。而且这个住户的余额就是张三在这个平台上的总余额 。 如果张三分别用两个手机号（18312345678、18387654321）注册了平台用户且分别绑定了该小区的两个不同的房间，那么这里就会显示两个张三的余额信息
                        
                        </span>
                    </a-collapse-panel>
                </a-collapse>
            </div>
        </div>
        <div class="search-box">
            <a-row :gutter="48">
                <a-col :md="4" :sm="10" style="padding-left: 20px;padding-right:1px;">
                    <a-input-group compact>
                        <p style="margin-top: 5px;">姓名：</p>
                        <a-input style="width: 75%" v-model="search.name" placeholder="请输入姓名"/>
                    </a-input-group>
                </a-col>
                <a-col :md="4" :sm="10" style="padding-left: 20px;padding-right:1px;">
                    <a-input-group compact>
                        <p style="margin-top: 5px;">手机号：</p>
                        <a-input style="width: 75%" v-model="search.phone" placeholder="请输入手机号"/>
                    </a-input-group>
                </a-col>
                
                <a-col :md="6" :sm="10" style="padding-left: 20px;padding-right:1px;">
                  <label style="margin-top: 5px;">选择房间：</label>
                  <a-cascader
                    class="cascader_style margin_left_10"
                    style="width: 300px;"
                    :options="options"
                    :load-data="loadDataFunc"
                    placeholder="请选择房间"
                    change-on-select
                    @change="setVisionsFunc"
                    v-model="search.vacancy"/>
                </a-col>
                        
                <a-col :md="2" :sm="10" style="padding-left: 20px;padding-right:1px;">
                    <a-button type="primary" icon="search" @click="searchList()">
                        查询
                    </a-button>
                </a-col>
                <a-col :md="2" :sm="10" style="padding-left: 20px;padding-right:1px;">
                    <a-button  @click="resetList()">重置</a-button>
                </a-col>
            </a-row>
            <a-row :gutter="48" style="margin-top: 24px">
                <a-col :md="3">
                    <a-button type="primary"  @click="addAllUserMoney()">
                        批量修改住户余额
                    </a-button>
                </a-col>
                <a-col :md="2" >
                    <a-button type="primary" @click="$refs.uploadMoneyModel.add()">导入住户余额</a-button>
                </a-col>
                <a-col :md="2"  v-if="is_customized_meter_reading==1 || is_aihorse_customized==1" >
                       <a-button type="primary" @click="excelUserExportData()">Excel导出</a-button>
                </a-col>
                
                <a-col :md="2" style="padding-left:10px" v-if="is_customized_meter_reading==1" >
                          <a-button type="primary" @click="balanceLimitTipsSet()">住户余额最低限额</a-button>
                 </a-col>
                 
                 <a-col :md="2"  style="padding-left:42px"  v-if="is_customized_meter_reading==1" >
                           <a-button type="primary" @click="balancePrestoreSet()">预存设置</a-button>
                  </a-col>
            </a-row>
        </div>

        <a-table
                :columns="columns"
                :data-source="data"
                class="components-table-demo-nested"
                :pagination="pagination"
                :loading="loading"
                :row-selection="rowSelection"
                rowKey="uid"
        >

            <span slot="action" slot-scope="text, record">
                <a class="but_1" @click="$refs.balanceModel.add(record.uid,is_customized_meter_reading)">增加/减少</a>
                <a class="but_1" @click="$refs.balanceListModel.List(record.uid,is_customized_meter_reading,is_aihorse_customized)">余额记录</a>
                <a class="but_1" @click="$refs.orderListModel.List(record.uid,is_customized_meter_reading)">消费记录</a>
            </span>
            <span slot="room_num" slot-scope="text, record">
                <a class="but_1" @click="$refs.roomListModel.List(record.uid)">{{record.room_num}}</a>
            </span>
            <span slot="position_num" slot-scope="text, record">
                <a class="but_1" @click="$refs.positionListModel.List(record.uid)">{{record.position_num}}</a>
            </span>
        </a-table>
        <a-modal
          title="导出提示"
          :width="450"
          :visible="exportUserVisible"
          :maskClosable="false"
          :loading="loading"
          :footer="null"
          :closable="false"
          :centered="true"
          >
            <div style="padding: 15px;color: black;font-size: 16px;">
                正在为您导出数据，你稍等 . . .
            </div>
        </a-modal>
        
        <a-modal
          title="住户余额最低限额"
          :width="700"
          :visible="balanceLimitVisible"
          :maskClosable="false"
          :confirmLoading="confirmLoading"
          :centered="true"
          @ok="handleLimitSubmit" @cancel="handleLimitCancel"
          >
        <div class="content-p1" >
            <div style="margin-bottom: 10px">
                <a-collapse accordion>
                    <a-collapse-panel key="1" header="操作说明">
                        <span style="font-weight:500 ">
                            业主冷水、热水、电费余额账号，小于或等于设置的住户最低余额限额时，<br/>
                            系统自动发送短信给业主，实施短暂停水或停电，60秒后自动恢复，提示业主及时预存余额
                        </span>
                    </a-collapse-panel>
                </a-collapse>
            </div>
        </div>
        
        <div class="balance_limit_div">
            <a-form :form="form" class="balance_limit_tips">
                <a-form-item label="冷水余额">
                   <a-switch  checked-children="开启"  @change="waterSwitchChange" v-model="cold_water_balance_open" un-checked-children="关闭" style="margin-right: 30px;margin-left: 30px;" /> <a-input-number :min="0" :max="9999" :precision="0" :step="1" :disabled="cold_water_balance.is_open ? false:true" style="width: 180px" placeholder="请设置最低的余额金额" v-model="cold_water_balance.balance" /> 元
                </a-form-item>

            <a-form-item label="热水余额">
                   <a-switch  checked-children="开启"  @change="hotWaterSwitchChange" v-model="hot_water_balance_open" un-checked-children="关闭" style="margin-right: 30px;margin-left: 30px;" /> <a-input-number :min="0" :max="9999" :precision="0" :step="1"  :disabled="hot_water_balance.is_open ? false:true" style="width: 180px" placeholder="请设置最低的余额金额" v-model="hot_water_balance.balance" /> 元
                </a-form-item>

            <a-form-item label="电费余额">
                   <a-switch  checked-children="开启"  @change="onElectricSwitchChange" v-model="electric_balance_open" un-checked-children="关闭" style="margin-right: 30px;margin-left: 30px;" /> <a-input-number :min="0" :max="9999" :precision="0" :step="1" :disabled="electric_balance.is_open ? false:true" style="width: 180px" placeholder="请设置最低的余额金额" v-model="electric_balance.balance" /> 元
                </a-form-item>
            </a-form>
        </div>
        
        </a-modal>
        
        
        <a-modal
          title="预存设置"
          :width="850"
          :visible="balancePrestoreVisible"
          :maskClosable="false"
          :confirmLoading="confirmLoading"
          :centered="true"
          @ok="handlePrestoreSubmit" @cancel="handlePrestoreCancel"
          >
        <div class="content-p1" >
            <div style="margin-bottom: 10px">
                <a-collapse accordion>
                    <a-collapse-panel key="1" header="操作说明">
                        <span style="font-weight:500 ">
                            1、启用后需要勾选收费类别 ，勾选中的收费类别所生成的待缴账单，必须要先缴完，才能进行预存余额<br>
                        </span>
                    </a-collapse-panel>
                </a-collapse>
            </div>
        </div>
        
        <div class="balance_limit_div balance_prestore_div">
            <a-form :form="form" class="balance_limit_tips">
                <a-form-item label="物业费优先缴费配置" extra="开启物业费优先缴费配置后业主在用户端给缴费时必须先缴物业费账单后才可以缴费其他账单">
                          <a-switch  checked-children="开启"  @change="propertyFeePayFirstChange" v-model="property_fee_pay_first_open" un-checked-children="关闭" style="margin-right: 30px;margin-left: 30px;" /> 
         </a-form-item>
                  
                <a-form-item label="冷水预存设置">
                   <a-switch  checked-children="开启"  @change="waterSwitchPrestoreChange" v-model="cold_water_prestore_open" un-checked-children="关闭" style="margin-right: 30px;margin-left: 30px;" /> 
                </a-form-item>
         <a-form-item v-if="cold_water_prestore_open">
                    <a-checkbox-group @change="onColdWaterChangePrestore" :default-value="cold_water_prestore.prestore_set" style="margin-left: 25px;font-size:20px;">
                        <a-checkbox v-for="(item,index) in charge_type_arr"  :value="item.key"  style="margin-left: 10px;">
                         {{ item.value}}
                        </a-checkbox>
                        </a-checkbox-group>

           </a-form-item>
           
            <a-form-item label="热水预存设置">
                   <a-switch  checked-children="开启"  @change="hotWaterSwitchPrestoreChange" v-model="hot_water_prestore_open" un-checked-children="关闭" style="margin-right: 30px;margin-left: 30px;" /> 
            </a-form-item>
        <a-form-item v-if="hot_water_prestore_open">
                   <a-checkbox-group @change="onHotWaterChangePrestore" :default-value="hot_water_prestore.prestore_set" style="margin-left: 25px;font-size:20px;">
                       <a-checkbox v-for="(item,index) in charge_type_arr"  :value="item.key"  style="margin-left: 10px;">
                        {{ item.value}}
                       </a-checkbox>
                       </a-checkbox-group>
        
          </a-form-item>
          
            <a-form-item label="电费预存设置">
                   <a-switch  checked-children="开启"  @change="onElectricSwitchPrestoreChange" v-model="electric_prestore_open" un-checked-children="关闭" style="margin-right: 30px;margin-left: 30px;" /> 
                </a-form-item>
                <a-form-item v-if="electric_prestore_open">
                           <a-checkbox-group @change="onElectricChangePrestore" :default-value="electric_prestore.prestore_set" style="margin-left: 25px;font-size:20px;">
                               <a-checkbox v-for="(item,index) in charge_type_arr"  :value="item.key"  style="margin-left: 10px;">
                                {{ item.value}}
                               </a-checkbox>
                               </a-checkbox-group>
                
                  </a-form-item>
                  
                <a-form-item label="燃气费预存设置">
                       <a-switch  checked-children="开启"  @change="onGasSwitchPrestoreChange" v-model="gas_prestore_open" un-checked-children="关闭" style="margin-right: 30px;margin-left: 30px;" /> 
                    </a-form-item>
                    <a-form-item v-if="gas_prestore_open">
                               <a-checkbox-group @change="onGasChangePrestore" :default-value="gas_prestore.prestore_set" style="margin-left: 25px;font-size:20px;">
                                   <a-checkbox v-for="(item,index) in charge_type_arr"  :value="item.key"  style="margin-left: 10px;">
                                    {{ item.value}}
                                   </a-checkbox>
                                   </a-checkbox-group>
                    
                      </a-form-item>
                      
            </a-form>
        </div>
        
        </a-modal>
        
        <balanceInfo ref="balanceModel" @ok="balanceInfo"/>
        <allBalanceInfo ref="allBalanceModel" @ok="balanceInfo"/>
        <balanceList ref="balanceListModel" @ok="balanceListInfo"/>
        <roomList ref="roomListModel" @ok="roomListInfo"/>
        <positionList ref="positionListModel" @ok="positionListInfo"/>
        <orderList ref="orderListModel" @ok="orderInfo"/>
        <uploadUserMoney ref="uploadMoneyModel" @ok="orderInfo"/>
    </div>
</template>
<script>
    import villageApi from '@/api/community/village';
    import balanceInfo from './balanceInfo';
    import allBalanceInfo from './allBalanceInfo';
    import balanceList from './balanceList';
    import roomList from './roomList';
    import positionList from './positionList';
    import orderList from './orderList';
    import uploadUserMoney from './uploadUserMoney';
    import { Collapse } from 'ant-design-vue';
    const columns = [
        { title: '姓名',  dataIndex: 'name', key: 'name'},
        { title: '手机号', dataIndex: 'phone', key: 'phone' },
        { title: '余额', dataIndex: 'now_money', key: 'now_money' },
        { title: '关联房间数', dataIndex: 'room_num', key: 'room_num',scopedSlots: { customRender: 'room_num' }, },
        { title: '关联车位数', dataIndex: 'position_num', key: 'position_num',scopedSlots: { customRender: 'position_num' }, },
        {title: '操作', dataIndex: 'operation', key: 'operation', scopedSlots: { customRender: 'action' },},
    ];
    const data = [];
    export default {
        name: 'storageUserBalanceList',
        filters: {

        },
        components:{
            allBalanceInfo,
            balanceInfo,
            balanceList,
            positionList,
            roomList,
            orderList,
            uploadUserMoney,
            'a-collapse': Collapse,
            'a-collapse-panel': Collapse.Panel
        },
        data() {
            return {
                reply_content: '',
                pagination: {
                    current:1, 
                    pageSize: 10, 
                    total:10,
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                search: { name: '', phone: '', page: 1 ,vacancy:[]},
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
                oldVersion: '',
                selectedRowKeys: [],
                is_customized_meter_reading:0,
                is_aihorse_customized:0,
                exportUserVisible:false,
                balanceLimitVisible:false,
                balancePrestoreVisible:false,
                cold_water_balance:{'is_open':0,'balance':''},
                cold_water_balance_open:false,
                hot_water_balance:{'is_open':0,'balance':''},
                hot_water_balance_open:false,
                electric_balance:{'is_open':0,'balance':''},
                electric_balance_open:false,
                confirmLoading:false,
                charge_type_arr:[],
                cold_water_prestore:{'is_open':0,'prestore_set':[]},
                cold_water_prestore_open:false,
                hot_water_prestore:{'is_open':0,'prestore_set':[]},
                hot_water_prestore_open:false,
                electric_prestore:{'is_open':0,'prestore_set':[]},
                electric_prestore_open:false,
                gas_prestore:{'is_open':0,'prestore_set':[]},
                gas_prestore_open:false,
                property_fee_pay_first_open:false,
                property_fee_pay_first:{'is_open':0},
                options: [],
            };
        },
         mounted() {
            this.getConfigCustomization()
            this.getList()
            this.getSingleListByVillage()
        },
        computed: {
            // 表格选择操作
            rowSelection () {
                return {
                    selectedRowKeys: this.selectedRowKeys,
                    onChange: this.onSelectChange
                }
            },
        },
        methods: {
            onSelectChange (selectedRowKeys, selectedRows) {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
                this.selectedRowKeys = selectedRowKeys
                console.log('villagess', this.selectedRowKeys)
            },
 	    onTableChange(page,pageSize){
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.getList()
                console.log('onTableChange==>', page, pageSize)
            },
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
                
                if(this.is_customized_meter_reading==1){
                    this.columns = [
                        { title: '姓名',  dataIndex: 'name', key: 'name'},
                        { title: '手机号', dataIndex: 'phone', key: 'phone' },
                        { title: '冷水余额', dataIndex: 'cold_water_balance', key: 'cold_water_balance' },
                        { title: '热水余额', dataIndex: 'hot_water_balance', key: 'hot_water_balance' },
                        { title: '电费余额', dataIndex: 'electric_balance', key: 'electric_balance' },
                        { title: '物业余额', dataIndex: 'now_money', key: 'now_money' },
                        { title: '关联房间数', dataIndex: 'room_num', key: 'room_num',scopedSlots: { customRender: 'room_num' }, },
                        { title: '关联车位数', dataIndex: 'position_num', key: 'position_num',scopedSlots: { customRender: 'position_num' }, },
                        {title: '操作', dataIndex: 'operation', key: 'operation', scopedSlots: { customRender: 'action' },},
                    ];
                }else if(res && res.yuanjino2o_customized_func*1==1){
                     this.columns = [
                        { title: '姓名',  dataIndex: 'name', key: 'name'},
                        { title: '手机号', dataIndex: 'phone', key: 'phone' },
                        { title: '余额', dataIndex: 'now_money', key: 'now_money' },
                        { title: '关联房间数', dataIndex: 'room_num', key: 'room_num',width:110,scopedSlots: { customRender: 'room_num' }, },
                        { title: '业主名称', dataIndex: 'user_bind_name', key: 'user_bind_name' },
                        { title: '房间号', dataIndex: 'room_address', key: 'room_address'},
                        { title: '关联车位数', dataIndex: 'position_num', key: 'position_num',width:110,scopedSlots: { customRender: 'position_num' }, },
                        {title: '操作', dataIndex: 'operation', key: 'operation', scopedSlots: { customRender: 'action' },},
                    ];
                }
              })
            },
            // 获取列表信息
            getList() {
                this.loading = true;
                this.search['page'] = this.pagination.current;
                this.search['limit'] = this.pagination.pageSize;
                this.request(villageApi.storageUserList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0;
                        this.data = res.list;
                        this.loading = false;
                        this.oldVersion = res.oldVersion
                        this.cold_water_balance_open=false;
                        this.hot_water_balance_open=false;
                        this.electric_balance_open=false;
                        this.cold_water_prestore_open=false;
                        this.hot_water_prestore_open=false;
                        this.electric_prestore_open=false;
                        this.gas_prestore_open=false;
                        if(res.meter_extended_data !=undefined && res.meter_extended_data && res.meter_extended_data.cold_water_balance){
                            this.cold_water_balance = res.meter_extended_data.cold_water_balance;
                            this.cold_water_balance_open=this.cold_water_balance.is_open ? true:false;
                        }
                        if(res.meter_extended_data !=undefined && res.meter_extended_data && res.meter_extended_data.hot_water_balance){
                            this.hot_water_balance = res.meter_extended_data.hot_water_balance;
                            this.hot_water_balance_open=this.hot_water_balance.is_open ? true:false;
                        }
                        if(res.meter_extended_data !=undefined && res.meter_extended_data && res.meter_extended_data.electric_balance){
                            this.electric_balance = res.meter_extended_data.electric_balance;
                            this.electric_balance_open=this.electric_balance.is_open ? true:false;
                        }
                        if(res.meter_extended_data !=undefined && res.meter_extended_data && res.meter_extended_data.cold_water_prestore){
                            this.cold_water_prestore = res.meter_extended_data.cold_water_prestore;
                            this.cold_water_prestore_open=this.cold_water_prestore.is_open ? true:false;
                        }
                        if(res.meter_extended_data !=undefined && res.meter_extended_data && res.meter_extended_data.hot_water_prestore){
                            this.hot_water_prestore = res.meter_extended_data.hot_water_prestore;
                            this.hot_water_prestore_open=this.hot_water_prestore.is_open ? true:false;
                        }
                        if(res.meter_extended_data !=undefined && res.meter_extended_data && res.meter_extended_data.electric_prestore){
                            this.electric_prestore = res.meter_extended_data.electric_prestore;
                            this.electric_prestore_open=this.electric_prestore.is_open ? true:false;
                        }
                        if(res.meter_extended_data !=undefined && res.meter_extended_data && res.meter_extended_data.gas_prestore){
                            this.gas_prestore = res.meter_extended_data.gas_prestore;
                            this.gas_prestore_open=this.gas_prestore.is_open ? true:false;
                        }
                        if(res.meter_extended_data !=undefined && res.meter_extended_data && res.meter_extended_data.property_fee_pay_first){
                            this.property_fee_pay_first = res.meter_extended_data.property_fee_pay_first;
                            this.property_fee_pay_first_open=this.property_fee_pay_first.is_open ? true:false;
                        }
                        
                       if(res.charge_type_arr !=undefined && res.charge_type_arr){
                           this.charge_type_arr = res.charge_type_arr;
                       }     
                        
                    })
            },
            balanceLimitTipsSet(){
                this.balancePrestoreVisible=false;
                this.balanceLimitVisible=true;
            },
            balancePrestoreSet(){
                this.balanceLimitVisible=false;
                this.balancePrestoreVisible=true;
            },
            handleLimitSubmit(){
                this.confirmLoading=true;
                let postArr={};
                postArr.cold_water_balance=this.cold_water_balance;
                postArr.hot_water_balance=this.hot_water_balance;
                postArr.electric_balance=this.electric_balance;
                console.log(postArr);
                this.request(villageApi.storageLimitBalanceTips, postArr)
                    .then((res) => {
                        this.confirmLoading = false
                        this.handleLimitCancel();
                        this.$message.success('保存成功！')
                        this.getList();
                    }) .catch((error) => {
                        this.confirmLoading = false
                    })
            },
            handleLimitCancel(){
                this.balanceLimitVisible=false;
                this.balancePrestoreVisible=false;
                this.confirmLoading=false;
            },
            handlePrestoreCancel(){
                this.balanceLimitVisible=false;
                this.balancePrestoreVisible=false;
                this.confirmLoading=false;
            },
            waterSwitchChange(ischecked){
                this.cold_water_balance.is_open=ischecked ? 1:0;
            },
            hotWaterSwitchChange(ischecked){
                this.hot_water_balance.is_open=ischecked ? 1:0;
            },
            onElectricSwitchChange(ischecked){
                this.electric_balance.is_open=ischecked ? 1:0;
            },
            propertyFeePayFirstChange(ischecked){
                this.property_fee_pay_first.is_open=ischecked ? 1:0;
            },
            waterSwitchPrestoreChange(ischecked){
                this.cold_water_prestore.is_open=ischecked ? 1:0;
            },
            onColdWaterChangePrestore(checkedValue){
                this.cold_water_prestore.prestore_set=checkedValue;
                console.log('checkedValue',checkedValue);
            },
            
            hotWaterSwitchPrestoreChange(ischecked){
                this.hot_water_prestore.is_open=ischecked ? 1:0;
            },
            onHotWaterChangePrestore(checkedValue){
                this.hot_water_prestore.prestore_set=checkedValue;
                console.log('checkedValue',checkedValue);
            },
    
            onElectricSwitchPrestoreChange(ischecked){
                this.electric_prestore.is_open=ischecked ? 1:0;
            },
            onElectricChangePrestore(checkedValue){
                this.electric_prestore.prestore_set=checkedValue;
                console.log('checkedValue',checkedValue);
            },
            
            onGasSwitchPrestoreChange(ischecked){
                this.gas_prestore.is_open=ischecked ? 1:0;
            },
            onGasChangePrestore(checkedValue){
                this.gas_prestore.prestore_set=checkedValue;
                console.log('checkedValue',checkedValue);
            },
            
            handlePrestoreSubmit(){
                let postArr={};
                postArr.cold_water_prestore=this.cold_water_prestore;
                if(this.cold_water_prestore.is_open*1==1 && this.cold_water_prestore.prestore_set.length<1){
                    this.$message.error('请至少勾选一个冷水预存设置项！')
                    return false;
                }
                postArr.hot_water_prestore=this.hot_water_prestore;
                if(this.hot_water_prestore.is_open*1==1 && this.hot_water_prestore.prestore_set.length<1){
                    this.$message.error('请至少勾选一个热水预存设置项！')
                    return false;
                }
                postArr.electric_prestore=this.electric_prestore;
                if(this.electric_prestore.is_open*1==1 && this.electric_prestore.prestore_set.length<1){
                    this.$message.error('请至少勾选一个电费预存设置项！')
                    return false;
                }
                postArr.gas_prestore=this.gas_prestore;
                if(this.gas_prestore.is_open*1==1 && this.gas_prestore.prestore_set.length<1){
                    this.$message.error('请至少勾选一个燃气费预存设置项！')
                    return false;
                }
                postArr.property_fee_pay_first=this.property_fee_pay_first;
                this.confirmLoading=true;
                this.request(villageApi.storageFeePrestoreSet, postArr)
                    .then((res) => {
                        this.confirmLoading = false
                        this.handlePrestoreCancel();
                        this.$message.success('保存成功！')
                        this.getList();
                    }) .catch((error) => {
                        this.confirmLoading = false
                    })
            },
            // 导出Excel
            excelUserExportData () {
                this.exportUserVisible=true;
                this.loading = true;
                this.request(villageApi.exportUserBalanceRecord, this.search).then((res) => {
                        console.log('res', res)
                        if(res && res.url){
                            window.location.href = res.url
                        }
                        this.loading = false
                        this.exportUserVisible = false;
                    }).catch((error) => {
                    this.loading = false
                    this.exportUserVisible = false;
                })
            },
            addAllUserMoney(){
                console.log('uid',this.selectedRowKeys)
                if (this.selectedRowKeys.length>0){
                    this.$refs.allBalanceModel.add(this.selectedRowKeys,this.is_customized_meter_reading)
                }else{
                    this.$message.error('请先选择用户')
                    return false;
                }
            },
            // 操作余额
            balanceInfo(val) {
                this.getList();
            },

            //余额记录
            balanceListInfo(){
                this.getList();
            },
            //房间列表
            roomListInfo(){
                this.getList();
            },
            //车位列表
            positionListInfo(){
                this.getList();
            },
            //消费记录
            orderInfo(val){
                this.getList();
            },

            // 进行搜索
            searchList() {
                console.log('search', this.search);
 		this.pagination.current = 1
                this.pagination.pageSize = 10
                this.table_change({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
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
            // 进行重置
            resetList() {
                this.search = {  name: '',phone: '', page: 1,vacancy:[] };
		        this.pagination.current = 1
                this.pagination.pageSize = 10
                this.table_change({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });

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
        }
    };
</script>
<style lang="less" scoped>

    /deep/ .but_1{
        margin-right: 10px;display: inline-block;
    }
    .content-p1{
        color: #52A5FF;font-weight: bold;padding: 10px 10px 0 10px;
    }
    .message-suggestions-list-box {
        margin: 20px;
        background-color: white;
    }
    .message-suggestions-list-box .search-box {
        padding: 5px 20px 0;
    }
    .message-suggestions-list-box .add-box {
        padding: 20px 20px 0;
    }
    .message-suggestions-list-box .components-table-demo-nested {
        padding: 20px;
    }
    /deep/ .message-suggestions-list-box .message_box {
        padding: 20px;
    }
    /deep/ .lbsf{
       float: right;margin-right: 24px;
    }
    /deep/ .balance_limit_tips .ant-form-item-control-wrapper{
        display: inline-block;
    }
    .balance_limit_div{
            margin: 25px;
    }
   /deep/ .balance_prestore_div .ant-form-item-label{
           vertical-align: top;
   }
</style>