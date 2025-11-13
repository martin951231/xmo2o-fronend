<template>
    <a-drawer :title="title" placement="right" :width="widthDrawer" :closable="true" :visible="drawer_visible"
        @close="onClose">
        <div class="top_box">
            <div class="flex_text_box">
                <div class="text_1">物业编号：</div>
                <div class="text_2">{{user_info.usernum?user_info.usernum:'暂无'}}</div>
            </div>
            <div class="flex_text_box">
                <div class="text_1">业主：</div>
                <div class="text_2">{{user_info.name?user_info.name:'暂无'}}</div>
            </div>
            <div class="flex_text_box">
                <div class="text_1">电话：</div>
                <div class="text_2">{{user_info.phone?user_info.phone:'暂无'}}</div>
            </div>
            <div class="flex_text_box">
                <div class="text_1" v-if="user_info.is_car_position">车库号：</div>
                <div class="text_1" v-if="user_info.is_houses_room">{{$store.getters.config.room_name}}号：</div>
                <div class="text_2">{{user_info.room?user_info.room:'暂无'}}</div>
            </div>
            <div class="flex_text_box" v-if="user_info.is_houses_room">
                <div class="text_1">房屋面积：</div>
                <div class="text_2">{{user_info.housesize?user_info.housesize:'暂无'}}</div>
            </div>
            <div class="flex_text_box" v-if="user_info.is_car_position">
                <div class="text_1">车场面积：</div>
                <div class="text_2">{{user_info.position_area?user_info.position_area:'暂无'}}</div>
            </div>
        </div>
        <div class="message-suggestions-box-1">
            <a-collapse accordion>
                <a-collapse-panel key="1" header="操作说明">
                    <p>
                        1、可按房屋、车位查看所有的已缴账单明细，并且可以操作退款及打印账单，每笔已缴账单详细记录展示各个信息，并且支持导出。
                    </p>
                    <div style="margin-bottom: 15px;">
                        2、<strong>退款且还原账单举例：</strong>某个{{$store.getters.config.room_name}}分别缴纳了1月、2月、3月的物业费，物业服务到期时间为2022年3月31号，然后退了2月的那笔物业费，退款模式选择【退款且还原账单】<br />
                        退款后，物业服务到期时间变更为2022年2月28号，同时会生成一笔应交账单，账单信息与退掉的那笔账单一致，若生成的应交账单不符合当前的缴费情况，可以修改账单金额或作废账单
                    </div>
                    <div style="margin-bottom: 15px;">
                        3、<strong>仅退款，不还原账单举例：</strong>某个{{$store.getters.config.room_name}}分别缴纳了1月、2月、3月的物业费，物业服务到期时间为2022年3月31号，然后3月开始物业费价格下调，退款模式选择【仅退款，不还原账单】，退款金额改为对应差价金额<br />
                        退款后，物业服务服务时间不变，账单依旧显示在已缴账单，状态显示为部分退款
                    </div>
                    <div style="margin-bottom: 15px;">
                        4、一次性收费规则账单不没有计费开始时间和计费结束时间
                    </div>
                    <div>
                        5、点击【设置打印模板】按钮=>选择打印模板后；会联动收银台打印模板功能，已缴账单列表点击打印按钮直接打印
                    </div>
                </a-collapse-panel>
            </a-collapse>
            <div class="search-box" v-if="true">
                <a-row :md="24" type="flex">
                    <!-- <a-col :md="6" :sm="24" class="padding-tp10" style="padding-right:0px;">
          <label style="margin-top: 5px;">房间：</label>
          <a-cascader
            class="cascader_style margin_left_10"
            :options="options"
            :load-data="loadDataFunc"
            placeholder="请选择房间"
            change-on-select
            @change="setVisionsFunc"
            v-model="search.vacancy"/>
        </a-col>
        <a-col :md="6" :sm="24" class="padding-tp10" style="padding-right: 1px">
          <a-input-group compact>
            <label style="margin-top: 5px;">车位号：</label> <a-input style="width: 193px" placeholder="请输入车位号" v-model="search.position_num"/>
          </a-input-group>
        </a-col>
        <a-col :md="6" :sm="24" class="padding-tp10" style="padding-left: 1px; padding-right: 1px;">
          <label style="margin-top: 5px;">所属车库：</label>
          <a-select default-value="0" style="width: 157px" placeholder="请选择车库" v-model="search.garage_id">
            <a-select-option value="0">
              全部
            </a-select-option>
            <a-select-option :value="item.garage_id" v-for="(item,index) in garage_list" :key="index">
              {{ item.garage_num }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="6" :sm="24" class="padding-tp10" style="padding-left: 1px; padding-right: 1px;">
          <label style="margin-top: 5px;">收费项目：</label>
          <a-select default-value="0" style="width: 150px" placeholder="请选择项目" v-model="search.project_id">
            <a-select-option value="0">
              全部
            </a-select-option>
            <a-select-option :value="item1.id" v-for="(item1,index1) in project_list" :key="index1">
              {{ item1.name }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="6" :sm="24" class="padding-tp10" style="padding-right: 1px;padding-left: 1px">
          <a-input-group compact>
            <a-select placeholder="请选择筛选项" style="width: 88px" default-value="name" v-model="search.key_val" @change="keyChange">
              <a-select-option value="name">
                姓名
              </a-select-option>
              <a-select-option value="phone">
                电话
              </a-select-option>

            </a-select>
            <a-input style="width: 150px" :placeholder="key_name" v-model="search.value"/>
          </a-input-group>
        </a-col> -->
                    <a-col :md="5" :sm="12" class="padding-tp10" style="padding-left: 1px; padding-right: 1px;width: 300px;">
                        <label style="margin-top: 5px;">支付方式：</label>
                        <a-select placeholder="请选择支付方式" style="width: 200px" v-model="search.pay_type">
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
                    <a-col :md="5" :sm="12" class="padding-tp10" style="padding-right: 1px;width: 250px;">
                        <label style="margin-top: 5px;">开票状态：</label>
                        <a-select placeholder="请选择开票状态" style="width: 158px" v-model="search.invoice_type">
                            <a-select-option value="0">全部</a-select-option>
                            <a-select-option value="1">已开票</a-select-option>
                            <a-select-option value="2">未开票</a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :md="5" :sm="12" class="padding-tp10" style="padding-right: 1px;width: 250px;">
                        <label style="margin-top: 5px;">账单状态：</label>
                        <a-select placeholder="请选择账单状态" style="width: 150px" v-model="search.order_type">
                            <a-select-option value="0">全部</a-select-option>
                            <a-select-option value="2">部分退款</a-select-option>
                            <a-select-option value="1">正常</a-select-option>
                            <a-select-option value="3">审核中</a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :md="6" :sm="12" class="padding-tp10" style="padding-left: 0px;padding-right: 1px;">
                        <label style="margin-top: 5px;">支付时间筛选：</label>
                        <a-range-picker @change="dateOnChange" :allowClear="true" v-model="search.data"
                            style="width: 260px">
                            <a-icon slot="suffixIcon" type="calendar" />
                        </a-range-picker>
                    </a-col>
                    <a-col :md="5" :sm="12" class="padding-tp10" style="padding-left: 0px;padding-right: 1px;width: 280px;" v-if="func_yumenlao_special>0">
                        <label style="margin-top: 5px;width:90px;">缴费操作人：</label>
                        <a-select placeholder="请选择缴费操作人" style="width: 170px" v-model="search.opt_id">
                            <a-select-option value="">全部</a-select-option>
                            <a-select-option :value="oitem.opt_id" v-for="(oitem,oindex) in allWorkerList" :key="oindex">
                                {{ oitem.name }}
                            </a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :md="8" :sm="24" class="padding-tp10" style="width: 530px;padding-left:0px">
                        <label style="margin-top: 5px;">计费时间筛选：</label>
                        <span>
                            <a-date-picker :disabled-date="disabledServiceStartDate" @change="serviceStartTimeChange"
                                format="YYYY-MM-DD" placeholder="计费开始时间" @openChange="handleServiceStartOpenChange" /> ~
                            <a-date-picker @change="serviceEndTimeChange" :disabled-date="disabledServiceEndDate"
                                format="YYYY-MM-DD" placeholder="计费结束时间" :open="endServiceOpen"
                                @openChange="handleServiceEndOpenChange" />
                        </span>
                    </a-col>
                    <a-col :md="2" :sm="24" class="padding-tp10"
                        style="padding-left: 0px;padding-right: 1px;width: 90px;">
                        <a-button type="primary" icon="search" @click="searchList()">
                            查询
                        </a-button>
                    </a-col>
                    <a-col :md="2" :sm="24" class="padding-tp10" style="padding-left: 0 !important;width: 90px;">
                        <a-button type="primary" @click="printList()">Excel导出</a-button>
                    </a-col>

                    <a-col :md="2" :sm="24" class="padding-tp10 mg5_box" style="display: table !important;">
                        <a-button type="primary" @click="checkSetParint(2,0,0,choice_ids)">同一缴费人批量打印</a-button>
                    </a-col>

                    <a-col :md="2" :sm="24" class="padding-tp10 mg5_box">
                        <a-button type="primary" @click="$refs.PrintModel.add(0,0,2)">设置打印模板</a-button>
                    </a-col>

                    <a-col :md="4" :sm="24"  class="padding-tp10 mg5_box"
                        v-if="func_kaidalaicn_special>0 && user_info.is_houses_room *1>0">
                        <a-button type="primary" @click="modifyPayOrderSpecial('red_reversal' )">红冲</a-button>
                        <a-button type="primary" style="margin-left: 20px;"
                            @click="modifyPayOrderSpecial('append_money')">补交账单</a-button>
                    </a-col>
                </a-row>

            </div>
            <a-table :columns="columns" :data-source="data"
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                class="components-table-demo-nested" :pagination="pagination" @change="table_change" :loading="loading">
                 <span slot="project_name" slot-scope="text, record"><a-tag v-if="record.meter_reading_id*1>0 && record.order_type_flag=='split_order_by_balance'" color="orange" style="font-weight: bold;color: #f53405;">拆</a-tag>{{record.project_name}}</span>
                <span slot="action" slot-scope="text, record">
                    <a @click="$refs.OrderModel.add(record.order_id,record.check_apply_id)">详情</a>
                    <a-divider type="vertical" />
                    <a v-if="role_refund==1 && record.pay_type_way >0 && (!record.my_check_status || record.my_check_status==0)"
                        @click="$refs.RefundModel.add(record.order_id,record.pay_money,record.pay_type_way, [{title:$store.getters.config.room_name+'号/车位号',value:record.numbers},{title:'缴费人',value:record.pay_bind_name},{title:'电话',value:record.pay_bind_phone},{title:'收费项目名称',value:record.project_name}], record.order_type)">退款</a>
                    <a v-if="record.my_check_status==3" style="color: #808080;">已审核</a>
                    <a v-if="record.my_check_status==2"
                        @click="$refs.checkRefundModel.add(record.order_id,record.order_apply_info,'order_refund')">需审核</a>
                    <a-divider type="vertical" />
                    <a @click="checkSetParint(1,record.order_id,record.pigcms_id)">打印</a>
                </span>

            </a-table>
            <payable-order-info ref="OrderModel" />
            <add-refund-info ref="RefundModel" @ok="bindOk" />
            <check-refund-info ref="checkRefundModel" @ok="bindOk" />
            <get-print-template ref="PrintModel" @ok="printBut" />
            <print-order ref="PrintOrderModel" />

            <a-modal :title="modalTitle" :width="600" :visible="visible" v-if="visible" :maskClosable="false"
                :confirmLoading="confirmLoading" @ok="excelExport" @cancel="handleCancel">

                <label style="margin-right: 10px;">导出模式：</label>
                <a-radio-group v-model="exportPattern">
                    <a-radio :value="1">多行显示模式</a-radio>
                    <a-radio :value="2">合并显示模式</a-radio>
                </a-radio-group>

            </a-modal>
            
            <a-modal :width="700" :title="special_modify_title" :destroyOnClose="true" :visible="visible_special_modify" :maskClosable="false"
                :confirm-loading="confirmLoading" @ok="modifyOrderSpecialOpt" @cancel="colseOrderSpecialOpt">
                <div class="modal_box" style="width:600px;margin-left: 30px;">
                    <div class="flex_text_box" style="margin-top:2px;">
                        <div class="text_1">操作类型： </div>
                        <div style="display: inline-block;">
                            <span style="color: #000;font-size: 20px;font-weight: bold;">{{special_opt_type=='red_reversal' ? '红冲':'补交账单' }}</span>
                        </div>
                    </div>
                    <div class="flex_text_box">
                        <div class="text_1">收 费 项： </div>
                        <a-select style="width: 220px"  v-model="tempSpecialOrder.s_project_id" :disabled="true" placeholder="请选择收费项">
                            <a-select-option v-for="pitem in projectSpecialList" :value="pitem.id">
                                {{ pitem.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                    
                    <div class="flex_text_box margin_top_10">
                        <div class="text_1">收费标准：</div>
                        <a-select style="width: 220px" v-model="tempSpecialOrder.s_rule_id"  placeholder="请选择消费标准">
                            <a-select-option v-for="xrule in ruleSpecialList" :value="xrule.id">
                                {{ xrule.charge_name }}
                            </a-select-option>
                        </a-select>
                    </div>
                    
                    <div style="margin-top: 30px;line-height: 35px;">
            
                        <div class="flex_text_box" style="margin: 30px 0px;">
                            <div style="display: inline-block;">{{special_opt_type=='red_reversal' ? '红冲':'补交' }}金额：</div>
                            <div style="display: inline-block;">
                                <a-input-number v-model="tempSpecialOrder.order_special_money" :min="0" :step="0.01" :precision="2"
                                    placeholder="请输入数值(支持2位小数)" @change="onSpecialMoneyChange" style="width: 250px;" />
                            </div>
                        </div>
                        <div class="flex_text_box margin_top_10">
                            <div class="text_1">账单计费时间：</div>
                                <a-range-picker @change="dateServiceTimeChange" :allowClear="true"
                                    style="width: 340px">
                                    <a-icon slot="suffixIcon" type="calendar" />
                                </a-range-picker>
                        </div>

                        
                        <div class="flex_text_box margin_top_10">
                            <div class="text_1">付款时间：</div>
                            <a-date-picker  placeholder="请选择时间" show-time format="YYYY-MM-DD HH:mm:ss" v-model="tempSpecialOrder.pay_time">
                            </a-date-picker>
                        </div>
                        
                        <div class="flex_text_box margin_top_10">
                            <div class="text_1">账单生成时间：</div>
                            <a-date-picker  placeholder="请选择时间" show-time format="YYYY-MM-DD HH:mm:ss" v-model="tempSpecialOrder.add_time">
                            </a-date-picker>
                        </div>
                        <div class="flex_text_box margin_top_10">
                            <div class="text_1"> 备 注： </div>
                            <a-textarea style="width: 350px;height: 80px" placeholder="请填写备注" v-model="tempSpecialOrder.remark" auto-size />
                        </div>
                        <div class="flex_text_box margin_top_10">
                            <div class="text_1">统计是否平摊每个月：</div>
                                <a-radio-group v-model="tempSpecialOrder.split_bill_time">
                                    <a-radio :value="1">是</a-radio>
                                    <a-radio :value="0">否</a-radio>
                                </a-radio-group>
                                
                                <span>根据计费时间拆分跨了几个月</span>
                        </div>
        
                    </div>
            
                </div>
            </a-modal>
            
        
        </div>
    </a-drawer>
</template>
<script>
    import villageApi from '@/api/community/village'
    import PayableOrderInfo from '@/views/community/village/charge/cashier/payableOrderInfo'
    import AddRefundInfo from '@/views/community/village/charge/cashier/addRefundInfo'
    import GetPrintTemplate from '@/views/community/village/charge/cashier/getPrintTemplate'
    import checkRefundInfo from '@/views/community/village/charge/cashier/checkRefundInfo'
    import moment from 'moment'
    import {
        Collapse
    } from 'ant-design-vue'
    import PrintOrder from "@/views/community/village/charge/cashier/printOrder";
    import store from '@/store';
    const columns = [{
            title: '收费项目名称',
            dataIndex: 'project_name',
            key: 'project_name',
            scopedSlots: {
                customRender: 'project_name'
            }
        },
        {
            title: '实际缴费金额',
            dataIndex: 'pay_money',
            key: 'pay_money'
        },
        {
            title: '支付方式',
            dataIndex: 'pay_type',
            key: 'pay_type'
        },
        {
            title: '支付时间',
            dataIndex: 'pay_time',
            key: 'pay_time'
        },
        {
            title: '开票状态',
            dataIndex: 'record_status',
            key: 'record_status'
        },
        {
            title: '账单状态',
            dataIndex: 'order_status',
            key: 'order_status'
        },
        {
            title: '计费开始时间',
            dataIndex: 'service_start_time',
            key: 'service_start_time'
        },
        {
            title: '计费结束时间',
            dataIndex: 'service_end_time',
            key: 'service_end_time'
        },
        {
            title: '账单生成时间',
            dataIndex: 'add_time',
            key: 'add_time'
        },
        {
            title: '操作',
            key: 'action',
            width: 160,
            dataIndex: '',
            scopedSlots: {
                customRender: 'action'
            }
        }
    ]
    const data = []
    export default {
        name: 'PayableOrderList',
        filters: {

        },
        components: {
            GetPrintTemplate,
            AddRefundInfo,
            PayableOrderInfo,
            PrintOrder,
            checkRefundInfo,
            'a-collapse': Collapse,
            'a-collapse-panel': Collapse.Panel,
            moment
        },
        data() {
            return {
                reply_content: '',
                title: '已缴账单列表',
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: 10,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange: (page, pageSize) => this.onTableChange(page, pageSize) //点击页码事件
                },
                search: {
                    keyword: '',
                    key_val: 'name',
                    key_val1: 'paytime',
                    garage_id: '0',
                    pay_type: '0',
                    project_id: '0',
                    page: 1,
                    pigcms_id: 0
                },
                search: {
                    keyword: '',
                    key_val: 'name',
                    key_val1: 'paytime',
                    garage_id: '0',
                    pay_type: '0',
                    project_id: '0',
                    page: 1,
                    pigcms_id: 0,
                    service_start_time: '',
                    service_end_time: ''
                },
                form: this.$form.createForm(this),
                drawer_visible: false,
                visible: false,
                loading: false,
                key_name: '请输入姓名',
                data,
                user_info: {},
                columns,
                options: [],
                garage_list: [],
                project_list: [],
                pay_type_list: [],
                search_data: '',
                page: 1,
                widthDrawer: 1600,
                selectedRowKeys: [],
                choice_ids: [],
                confirmLoading: false,
                exportPattern: 2,
                modalTitle: 'Excel导出',
                role_export: 0,
                role_refund: 0,
                endServiceOpen: false,
                func_kaidalaicn_special: 0,
                visible_special_modify: false,
                special_opt_type: '',
                special_modify_title: '',
                projectSpecialList:[],
                ruleSpecialList:[],
                special_red_reversal:{},
                special_append_money:{},
                tempSpecialOrder: {
                    order_special_money: '',
                    special_opt_type:'',
                    s_rule_id:0,
                    s_project_id:0,
                    pay_time:moment().format('YYYY-MM-DD HH:mm:ss'),
                    add_time:moment().format('YYYY-MM-DD HH:mm:ss'),
                    service_time:'',
                    split_bill_time:0,
                    remark:'',
                },
                allWorkerList:[],
                func_yumenlao_special:0,
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
        created() {
            if (window.screen.width < 1400) {
                this.widthDrawer = 900
            } else if (window.screen.width < 1600) {
                this.widthDrawer = 1250
            }
        },
        activated() {
            //this.getSingleListByVillage()
            //this.getProjectList()
            //this.getGarageList()
            this.payTypeList()
        },
        methods: {
            onTableChange(page, pageSize) {
                this.page = page
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.getList()
                console.log('onTableChange==>', page, pageSize)
            },
            onClose() {
                this.drawer_visible = false
                // setTimeout(() => {
                //     this.post.id = 0;
                //     this.form = this.$form.createForm(this)
                // }, 500)
            },
            // 获取列表信息
            getList() {
                this.loading = true
                this.search['page'] = this.page
                this.search['limit'] = this.pagination.pageSize
                this.request(villageApi.payableOrderList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        if (res.role_refund != undefined) {
                            this.role_export = res.role_export;
                            this.role_refund = res.role_refund;
                        } else {
                            this.role_export = 1;
                            this.role_refund = 1;
                        }
                        console.log('role_refund', this.role_refund)
                        this.loading = false
                    })
            },
            modifyPayOrderSpecial(xtype) {
                this.special_opt_type = xtype;
                this.tempSpecialOrder.special_opt_type=xtype;
                if (xtype == 'red_reversal') {
                    this.special_modify_title = '红冲';
                    this.projectSpecialList=this.special_red_reversal.projectList;
                    this.tempSpecialOrder.s_project_id=this.projectSpecialList ? this.projectSpecialList[0].id:0;
                    this.ruleSpecialList=this.special_red_reversal.ruleList;
                    this.tempSpecialOrder.s_rule_id=this.ruleSpecialList ? this.ruleSpecialList[0].id:0;
                } else if (xtype == 'append_money') {
                    this.special_modify_title = '补交账单';
                    this.projectSpecialList=this.special_append_money.projectList;
                    this.tempSpecialOrder.s_project_id=this.projectSpecialList ? this.projectSpecialList[0].id:0;
                    this.ruleSpecialList=this.special_append_money.ruleList;
                    this.tempSpecialOrder.s_rule_id=this.ruleSpecialList ? this.ruleSpecialList[0].id:0;
                }
                this.tempSpecialOrder.split_bill_time=0;
                this.tempSpecialOrder.pay_time=moment().format('YYYY-MM-DD HH:mm:ss');
                this.tempSpecialOrder.add_time=moment().format('YYYY-MM-DD HH:mm:ss');
                this.tempSpecialOrder.remark='';
                this.visible_special_modify = true;
            },
            modifyOrderSpecialOpt() {
                if (!this.tempSpecialOrder.order_special_money || this.tempSpecialOrder.order_special_money * 1 <= 0) {
                    this.$message.error('请填写金额！')
                    return false
                }
                if (this.special_opt_type != 'red_reversal' && this.special_opt_type != 'append_money') {
                    this.$message.error('操作错误！')
                    return false
                }
                if (!this.tempSpecialOrder.service_time || this.tempSpecialOrder.service_time.length!=2) {
                    this.$message.error('请填写账单计费时间！')
                    return false
                }
                if (!this.tempSpecialOrder.pay_time) {
                    this.$message.error('请填写付款时间！')
                    return false
                }
                if (!this.tempSpecialOrder.add_time) {
                    this.$message.error('请填写账单生成时间！')
                    return false
                }
                this.tempSpecialOrder.special_opt_type = this.special_opt_type;

                this.tempSpecialOrder.user_info=this.user_info;
                this.confirmLoading = true;
                this.request('/community/village_api.Cashier/createSpecialPayOrder', this.tempSpecialOrder).then((res) => {
                    this.$message.success('操作成功！');
                    this.confirmLoading = false
                    this.colseOrderSpecialOpt();
                    this.getList();
                }).catch((error) => {
                    this.confirmLoading = false
                })
            },
            colseOrderSpecialOpt() {
                this.special_opt_type = '';
                this.visible_special_modify = false;
                this.special_modify_title = '';
                this.tempSpecialOrder={
                    order_special_money: '',
                    special_opt_type:'',
                    s_rule_id:0,
                    s_project_id:0,
                    pay_time:moment().format('YYYY-MM-DD HH:mm:ss'),
                    add_time:moment().format('YYYY-MM-DD HH:mm:ss'),
                    service_time:'',
                    split_bill_time:0,
                    remark:'',
                };
            },
            
            onSpecialMoneyChange() {
            
            },
            keyChange(val) {
                if (val == 'name') {
                    this.key_name = '请输入姓名'
                }
                if (val == 'phone') {
                    this.key_name = '请输入电话'
                }
            },
            bindOk() {
                this.getList()
            },
            getProjectList() {
                this.request(villageApi.ChargeProjectList)
                    .then((res) => {
                        this.project_list = res.list
                    })
                    .catch((error) => {
                        this.loading = false
                    })
            },
            getGarageList() {
                this.request(villageApi.garageList)
                    .then((res) => {
                        console.log('garage_list', res)
                        this.garage_list = res
                    })
                    .catch((error) => {
                        this.loading = false
                    })
            },
            getAllWorkerList() {
              this.request('/community/village_api.HouseWorker/getAllWorker2List')
                .then((res) => {
                  if (res.list && res.list.length>0){
                      this.allWorkerList=res.list;
                  }else{
                      this.allWorkerList=[];
                  }
                  if (res.func_yumenlao_special != undefined) {
                      this.func_yumenlao_special = res.func_yumenlao_special * 1;
                  }
                  if(this.func_yumenlao_special>0){
                      
                      this.columns =  [{
                              title: '收费项目名称',
                              dataIndex: 'project_name',
                              key: 'project_name',
                              scopedSlots: {
                                  customRender: 'project_name'
                              }
                          },
                          {
                              title: '实际缴费金额',
                              dataIndex: 'pay_money',
                              key: 'pay_money'
                          },
                          {
                              title: '支付方式',
                              dataIndex: 'pay_type',
                              key: 'pay_type',
                              width: 150,
                          },
                          {
                              title: '支付时间',
                              dataIndex: 'pay_time',
                              key: 'pay_time'
                          },
                          {
                              title: '开票状态',
                              dataIndex: 'record_status',
                              key: 'record_status'
                          },
                          {
                              title: '账单状态',
                              dataIndex: 'order_status',
                              key: 'order_status'
                          },
                          {
                              title: '计费开始时间',
                              dataIndex: 'service_start_time',
                              key: 'service_start_time'
                          },
                          {
                              title: '计费结束时间',
                              dataIndex: 'service_end_time',
                              key: 'service_end_time'
                          },
                          {
                              title: '账单生成时间',
                              dataIndex: 'add_time',
                              key: 'add_time'
                          },
                          {
                              title: '缴费操作人',
                              dataIndex: 'role_name',
                              key: 'role_name'
                          },
                          {
                              title: '操作',
                              key: 'action',
                              width: 160,
                              dataIndex: '',
                              scopedSlots: {
                                  customRender: 'action'
                              }
                          }
                      ];
                      
                  }
                }).catch((error) => {
                      
                })
            },
            payTypeList() {
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
            getSingleListByVillage() {
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
            getFloorList(id) {
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
            getLayerList(id) {
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
            getVacancyList(id) {
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
            async loadDataFunc(selectedOptions) {
                const targetOption = selectedOptions[selectedOptions.length - 1]
                targetOption.loading = true
                setTimeout(function() {
                    targetOption.loading = false
                }, 100)
            },
            // 处理加载漏洞单元（选择、编辑时可用）
            async setVisionsFunc(selectedOptions) {
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
            dateOnChange(date, dateString) {
                this.search.date = dateString
                
            },
            dateServiceTimeChange(date, dateString){
                this.tempSpecialOrder.service_time = dateString
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                console.log('table_change', e)
                if (e.current && e.current > 0) {
                    this.pagination.current = e.current
                    this.page = e.current
                    this.getList()
                    this.selectedRowKeys = []
                    this.choice_ids = []
                }
            },
            search_btn(user_info, other) {
                this.drawer_visible = true;
                this.user_info = user_info;
                this.search = {
                    keyword: '',
                    key_val: 'name',
                    key_val1: 'paytime',
                    garage_id: '0',
                    pay_type: '0',
                    project_id: '0',
                    page: 1,
                    pigcms_id: user_info.pigcms_id
                }
                this.search.vacancy_id = 0;
                if (user_info.vacancy_id != undefined && user_info.vacancy_id > 0) {
                    this.search.vacancy_id = user_info.vacancy_id;
                }
                if (user_info.position_id != undefined && user_info.position_id) {
                    this.search.position_id = user_info.position_id;
                } else {
                    this.search.position_id = 0;
                }
                if (other != undefined && other && other.func_kaidalaicn_special) {
                    this.func_kaidalaicn_special = other.func_kaidalaicn_special * 1;
                }
                if(this.func_kaidalaicn_special==1){
                    this.request('/community/village_api.Charge/getSpecialChargeList').then(res => {
                        if (res) {
                            this.special_red_reversal=res.red_reversal;
                            this.special_append_money=res.append_money;
                        }
                    }).catch((error) => {
                        that.$message.error('获取红冲和补交收费项目标准失败！')
                        return false;
                    })
                }
                this.searchList()
                this.getAllWorkerList()
            },
            // 进行搜索
            searchList() {

                this.page = 1
                const val = {
                    current: 1,
                    pageSize: 10,
                    total: 10
                }
                this.table_change(val)
            },
            // 导出弹出层
            printList() {
                this.visible = true
            },

            //打印按钮
            printBut() {
                this.table_change({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
            },

            // 批量打印=>按钮
            onSelectChange(selectedRowKeys, selectedRows) {
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
            handleCancel() {
                this.visible = false
                this.exportType = 1
            },
            // 导出Excel
            excelExport() {
                this.loading = true
                this.search['exportPattern'] = this.exportPattern
                console.log(this.search)
                this.request(villageApi.printPayOrderList, this.search)
                    .then((res) => {
                        console.log('list', res.list)
                        window.location.href = res.url
                        this.loading = false
                        this.handleCancel()
                    }).catch((error) => {
                        this.loading = false
                    })
            },

            disabledServiceStartDate(startValue) {
                const endValue = this.search.service_end_time;
                if (!startValue || !endValue) {
                    return false;
                }
                return startValue.valueOf() > endValue.valueOf();
            },
            serviceStartTimeChange(date, dateString) {
                console.log('serviceStartTime', dateString);
                this.search.service_start_time = dateString;
            },
            disabledServiceEndDate(endValue) {
                const startValue = this.search.service_start_time;
                if (!endValue || !startValue) {
                    return false;
                }
                return startValue.valueOf() >= endValue.valueOf();
            },
            serviceEndTimeChange(date, dateString) {
                console.log('serviceEndTime', dateString);
                this.search.service_end_time = dateString;
            },
            handleServiceStartOpenChange(open) {
                if (!open) {
                    this.endServiceOpen = true;
                }
            },
            handleServiceEndOpenChange(open) {
                this.endServiceOpen = open;
            },
            //数组去重
            arrUnique(arr, ff = 'pigcms_id') {
                var arr1 = []; // 新建一个数组来存放arr中的值
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (arr1.indexOf(arr[i][ff]) === -1) {
                        arr1.push(arr[i][ff]);
                    }
                }
                return arr1;
            },
            //校验是否设置打印模板 可直接打印
            checkSetParint(type, order_id = 0, pigcms_id = 0, choice_ids = []) {
                let that = this,
                    arr_num = 0;
                if (type == 2) { //批量打印判断
                    if (choice_ids.length < 1) {
                        that.$message.error('请勾选账单')
                        return false;
                    }
                    if ((this.arrUnique(choice_ids, 'room_id').length) > 1) {
                        that.$message.error('当前仅支持同一个' + that.$store.getters.config.room_name + '进行批量打印已缴账单')
                        return false;
                    }
                    if ((this.arrUnique(choice_ids, 'pigcms_id').length) > 1) {
                        that.$message.error('当前仅支持同一个缴费人进行批量打印已缴账单')
                        return false;
                    }

                    if (choice_ids.length > 100) {
                        that.$message.error('最多可选择100个账单打印，您当前选中' + choice_ids.length + '个')
                        return false;
                    }
                }
                this.request(villageApi.checkSetPrint).then((res) => {
                    if (res.template_id && res.template_id > 0) { //设置指定打印模板
                        this.$refs.PrintOrderModel.add(order_id, res.template_id, pigcms_id, choice_ids)
                    } else { //未设置打印模板
                        if (type == 1) { //单条打印
                            this.$refs.PrintModel.add(order_id, pigcms_id)
                        } else { //批量打印
                            this.$refs.PrintModel.batchPrint(choice_ids)
                        }
                    }
                });
            }

        }
    }
</script>
<style lang="less" scoped>
    .message-suggestions-box-1 {
        background-color: white;
        margin-top: 15px;
    }

    .message-suggestions-box-1 .search-box {
        padding: 0px 20px;
        border: 1px solid #e4dfdf;
        padding-bottom: 15px;
    }

    .message-suggestions-box-1 .add-box {
        padding: 20px 20px 0;
    }

    .message-suggestions-box-1 .components-table-demo-nested {
        // padding: 20px;
    }

    .message-suggestions-box-1 .message_box {
        padding: 20px;
    }

    .lbsf {
        float: right;
        margin-right: 24px;
    }

    .padding-tp10 {
        padding-top: 15px;
    }

    .mg5_box {
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-left: 0.5%;
    }

    .top_box {
        width: 100%;
        border: 1px solid #F1F1F1;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 10px;

        .flex_text_box {
            display: flex;
            flex-direction: row;
            align-items: center;

            .text_1 {
                flex-shrink: 0;
            }
        }
    }
</style>