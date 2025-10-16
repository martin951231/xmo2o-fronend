<template>
    <div class="message-suggestions-box-1">
        <a-collapse accordion>
            <a-collapse-panel key="1" header="操作说明">
                <p>1、查看当前业主的所有的已缴账单明细，并且可以操作退款及打印账单，每笔已缴账单详细记录展示各个信息，并且支持导出。</p>
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
        <div class="search-box">
            <a-row class="suggestions_row">
                <a-col :md="8" :sm="24" style="display: flex;width: 340px;margin: 5px;" v-if="is_vacancy_show">
                    <label style="margin-top: 5px;width:80px;">{{$store.getters.config.room_name}}：</label>
                    <a-cascader class="cascader_style" :options="options" :load-data="loadDataFunc"
                        :placeholder="'请选择'+$store.getters.config.room_name" change-on-select @change="setVisionsFunc"
                        v-model="search.vacancy" />
                </a-col>
                <a-col :md="8" :sm="24" class="suggestions_col" style="width: 210px;">
                    <a-input-group compact>
                        <label style="margin-top: 5px;">车位号：</label> <a-input style="width: 150px" placeholder="请输入车位号"
                            v-model="search.position_num" />
                    </a-input-group>
                </a-col>
                <a-col :md="8" :sm="24" class="suggestions_col" v-if="is_vacancy_show" style="width: 240px">
                    <a-input-group compact>
                        <a-select placeholder="请选择筛选项" style="width: 80px" default-value="name" v-model="search.key_val"
                            @change="keyChange">
                            <a-select-option value="name">
                                姓名
                            </a-select-option>
                            <a-select-option value="phone">
                                电话
                            </a-select-option>
                        </a-select>
                        <a-input style="width: 150px" :placeholder="key_name" v-model="search.value" />
                    </a-input-group>
                </a-col>
                <a-col :md="8" :sm="24" class="suggestions_col" style="width: 220px">
                    <label style="margin-top: 5px;">账单状态：</label>
                    <a-select placeholder="请选择账单状态" style="width: 150px" v-model="search.order_type">
                        <a-select-option value="0">全部</a-select-option>
                        <a-select-option value="2">部分退款</a-select-option>
                        <a-select-option value="1">正常</a-select-option>
                        <a-select-option value="3">审核中</a-select-option>
                    </a-select>
                </a-col>
                <a-col :md="8" :sm="24" class="suggestions_col" style="width: 220px">
                    <label style="margin-top: 5px;">开票状态：</label>
                    <a-select placeholder="请选择开票状态" style="width: 150px" v-model="search.invoice_type">
                        <a-select-option value="0">全部</a-select-option>
                        <a-select-option value="1">已开票</a-select-option>
                        <a-select-option value="2">未开票</a-select-option>
                    </a-select>
                </a-col>
                <a-col :md="8" :sm="24" class="suggestions_col" style="width: 230px" v-if="have_ticket_number>0">
                    <label style="margin-top: 5px;">票据编号：</label>
                    <a-input style="width: 160px" placeholder="请输入票据编号" v-model="search.ticket_number" />
                </a-col>
            </a-row>
            <a-row style="margin:15px 0px;">
                <a-col :md="6" :sm="12" class="" style="padding-right: 5px;">
                    <label style="margin-top: 5px;">所属楼栋：</label>
                    <a-select mode="multiple" style="width:80%;" placeholder="请选择项目" v-model="search.single_id_arr">
                
                        <a-select-option :value="item_s.id" v-for="(item_s,index_s) in singleList" :key="index_s">
                            {{ item_s.name }}
                        </a-select-option>
                    </a-select>
                </a-col>
                <a-col :md="6" :sm="12">
                    <label style="margin-top: 5px;">所属车库：</label>
                    <a-select mode="multiple" style="width:80%;" placeholder="请选择车库" v-model="search.garage_id">
                        <a-select-option :value="item.garage_id" v-for="(item,index) in garage_list" :key="index">
                            {{ item.garage_num }}
                        </a-select-option>
                    </a-select>
                </a-col>
                <a-col :md="6" :sm="12" class="" style="padding-left: 10px; padding-right: 5px;">
                    <label style="margin-top: 5px;">收费项目：</label>
                    <a-select mode="multiple" style="width:80%;" placeholder="请选择项目" v-model="search.project_id"
                        @change="projectItemChange">

                        <a-select-option :value="item1.id" v-for="(item1,index1) in project_list" :key="index1">
                            {{ item1.name }}
                        </a-select-option>
                    </a-select>
                </a-col>
                <a-col :md="6" :sm="12" class="" style="padding-left: 5px; padding-right: 10px;">
                    <label style="margin-top: 5px;">收费标准：</label>
                    <a-select mode="multiple" style="width:80%;" placeholder="收费标准" v-model="search.rule_id">
                        <a-select-option :value="item2.id" v-for="(item2,index2) in project_rule_list" :key="index2">
                            {{ item2.charge_name }}
                        </a-select-option>
                    </a-select>
                </a-col>
            </a-row>
            <a-row>
                <a-col :md="6" :sm="12" class="" style="width: 380px;">
                      <label style="margin-top: 5px;">支付方式：</label>
                      <a-select placeholder="请选择支付方式" mode="multiple" style="width: 80%;" v-model="search.pay_type">
                          <a-select-option :value="item2.id" v-for="(item2,index2) in pay_type_list" :key="index2">
                              {{ item2.name }}
                          </a-select-option>
                          <!-- <a-select-option value="alipay">支付宝</a-select-option>
                <a-select-option value="wechat">微信</a-select-option>
                <a-select-option value="unionpay">银联</a-select-option>
                <a-select-option value="balance">余额抵扣</a-select-option>-->
                      </a-select>
                  </a-col>
                <a-col :md="8" :sm="24" class="suggestions_col" style="width: 380px;">
                    <label style="margin-top: 5px;">支付时间筛选：</label>
                    <a-range-picker @change="dateOnChange" :allowClear="true" v-model="search.data"
                        style="width: 270px;">
                        <a-icon slot="suffixIcon" type="calendar" />
                    </a-range-picker>
                </a-col>

                <a-col :md="8" :sm="24" class="suggestions_col" style="width: 490px;">
                    <label style="margin-top: 5px;">计费时间筛选：</label>
                    <span>
                        <a-date-picker v-model="service_start_time" :disabled-date="disabledServiceStartDate"
                            @change="serviceStartTimeChange" format="YYYY-MM-DD" placeholder="计费开始时间"
                            @openChange="handleServiceStartOpenChange" /> ~
                        <a-date-picker v-model="service_end_time" @change="serviceEndTimeChange"
                            :disabled-date="disabledServiceEndDate" format="YYYY-MM-DD" placeholder="计费结束时间"
                            :open="endServiceOpen" @openChange="handleServiceEndOpenChange" />
                    </span>
                </a-col>
                <a-col :md="6" :sm="12" class="suggestions_col" v-if="func_yumenlao_special>0">
                    <label style="margin-top: 5px;width:90px;">缴费操作人：</label>
                    <a-select placeholder="请选择缴费操作人" style="width: 170px" v-model="search.opt_id">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option :value="oitem.opt_id" v-for="(oitem,oindex) in allWorkerList" :key="oindex">
                            {{ oitem.name }}
                        </a-select-option>
                    </a-select>
                </a-col>
                </a-row>
                <a-row>
                <a-col :md="2" :sm="24" class="suggestions_col_btn" style="padding-left: 5px;">
                    <a-button type="primary" icon="search" @click="searchList()">
                        查询
                    </a-button>
                </a-col>
                <a-col :md="2" :sm="24" class="suggestions_col_btn" v-if="role_export==1"
                    style="padding-left: 5px;padding-right: 10px;">

                    <a-button type="primary" @click="printList()">Excel导出</a-button>
                </a-col>

                <a-col :md="2" :sm="24" class="suggestions_col_btn"
                    style="width: 180px;padding-left: 5px;padding-right: 10px;">
                    <a-button type="primary" @click="checkSetParint(2,0,0,choice_ids,'')">同一缴费人批量打印</a-button>
                </a-col>

                <a-col :md="2" :sm="24" class="suggestions_col_btn" style="padding-left: 5px;padding-right: 10px;">
                    <a-button type="primary" @click="$refs.PrintModel.add(0,0,2)">设置打印模板</a-button>
                </a-col>

                <a-col :md="2" :sm="24" class="suggestions_col_btn" style="padding-left: 5px;padding-right: 10px;"
                    v-if="orderPayTimeCheckOpen<1">
                    <a-button type="primary" @click="modifyPayTime('')">修改支付时间</a-button>
                </a-col>
                <a-col :md="2" :sm="24" class="suggestions_col_btn" style="padding-left: 10px;padding-right: 10px;"
                    v-if="role_import_pay==1">
                    <a-button type="primary" @click="importBillPayOrder()">导入已缴账单</a-button>
                </a-col>

            </a-row>

        </div>
        <a-table :columns="columns" :data-source="data"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            class="components-table-demo-nested" :pagination="pagination" @change="table_change" :loading="loading">
            <template slot="pay_type" slot-scope="text, record">
                <span
                    :style="{color: record.pay_type_way==2 || record.pay_type_way==22?'#1890ff':''}">{{record.pay_type}}</span>
            </template>
            <span slot="action" slot-scope="text, record">
                <a @click="$refs.OrderModel.add(record.order_id,record.check_apply_id)">详情</a>
                <a-divider type="vertical" />
                <a v-if="record.fact_pay_all_money*1>0 && role_refund==1 && record.pay_type_way >0 && (!record.my_check_status || record.my_check_status==0)"
                    @click="$refs.RefundModel.add(record.order_id,record.pay_money,record.pay_type_way, [{title: $store.getters.config.room_name+'号/车位号',value:record.numbers},{title:'缴费人',value:record.pay_bind_name},{title:'电话',value:record.pay_bind_phone},{title:'收费项目名称',value:record.project_name}], record.order_type,record)">退款</a>
                <a v-if="record.my_check_status==3" style="color: #808080;">已审核</a>
                <a v-if="record.my_check_status==2 && record.check_apply_type=='order_refund'"
                    @click="$refs.checkRefundModel.add(record.order_id,record.order_apply_info,'order_refund')">需审核</a>
                <a-divider type="vertical" />
                <a :disabled="record.is_button"
                    @click="checkSetParint(1,record.order_id,record.pigcms_id,[],record)">打印</a>
                <div style="margin-top: 10px;" v-if="orderPayTimeCheckOpen>0 && record.my_check_status<1">
                    <a-divider type="vertical" />
                    <a @click="modifyPayTime(record)">修改支付时间</a>
                </div>
            </span>

        </a-table>
        <span
            style="margin-left: 35px;position: relative;top: -65px;color: red;font-size: 18px;">实际缴费总金额：{{ total_pay_money }}</span>
        <span
            style="margin-left: 35px;position: relative;top: -65px;color: red;font-size: 18px;">实际到账金额：{{ total_pay_money_real }}</span>
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

        <a-modal title="请稍等,正在为您导出数据..." :visible="export_tips_visible" :closable="false" :mask-closable="false"
            :footer="null" :width="550">
            <div>
                <a-spin size="large" />
                <span style=" margin-left: 25px;">导出数据中,请耐心等待,数量越多时间越长。</span>
                <p style="margin: 15px;">若长时间未成功导出，建议调整筛选条件减少导出数量，然后分多次导出。</p>
            </div>
        </a-modal>
        <a-modal :width="550" title="修改已选订单的支付时间" :visible="visible_pay_time" :maskClosable="false"
            :confirm-loading="confirmLoading" @ok="modifyPayTimeOpt" @cancel="colseModifyPayTimeOpt">
            <div class="modal_box">
                <a-alert message="修改账单支付时间适用场景，因业主线下已支付物业费用，当时未录入到系统账单，需要提前或延后账单支付时间" type="success" />
                <div class="flex_text_box" style="margin: 30px 0px;">
                    <div style="display: inline-block;">修改支付时间：</div>
                    <div style="display: inline-block;">
                        <a-date-picker style="width: 250px;" show-time format="YYYY-MM-DD HH:mm:ss"
                            @change="changePayTime" />
                    </div>
                </div>
            </div>
        </a-modal>

        <a-modal title="设置订单票据提醒" :width="600" :visible="ticket_visible" :maskClosable="false"
            :confirmLoading="confirmLoading" @ok="ticketSetOK" @cancel="ticketCancel">
            <div class="text_2" style=" margin: 0px 0px 20px 120px;">
                <a-radio-group v-model="ticket_set_print">
                    <a-radio :value="0">不设置直接打印</a-radio>
                    <a-radio :value="1">设置订单票据</a-radio>
                </a-radio-group>
            </div>
            <div class="text_2" style="display: inline-block;" v-if="ticket_set_print*1>0">
                搜索选择票据编号：<a-select style="width: 250px" show-search placeholder="请输入票据号搜素" v-model="order_ticket_number"
                    :default-active-first-option="false" :show-arrow="false" :filter-option="false" :allowClear="true"
                    :not-found-content="null" @search="handleTicketNumberSearch" @change="searchTicketNumberChange"
                    @blur="handleTicketNumberBlur" @focus="handleTicketNumberFocus">
                    <a-select-option :value="item.ticket" v-for="(item,index) in ticketNumberList" :key="index">
                        {{ item.ticket }}
                    </a-select-option>
                </a-select>
            </div>
            <p style="margin-left: 125px; margin-top: 10px;" v-if="ticket_set_print*1>0">请在框里输入信息搜索，并在搜到的下拉框中选择数据</p>
        </a-modal>

        <a-modal :width="550" :title="special_modify_title" :visible="visible_special_modify" :maskClosable="false"
            :confirm-loading="confirmLoading" @ok="modifyOrderSpecialOpt" @cancel="colseOrderSpecialOpt">
            <div class="modal_box">
                <div class="flex_text_box" style="margin: 30px 0px;">
                    <div style="display: inline-block;">{{special_opt_type=='red_reversal' ? '红冲':'补交' }}金额：</div>
                    <div style="display: inline-block;">
                        <a-input-number v-model="order_special_money" :min="0" :step="0.01" :precision="2"
                            placeholder="请输入数值(支持2位小数)" @change="onSpecialMoneyChange" style="width: 250px;" />
                    </div>
                </div>
            </div>
        </a-modal>

        <importBill :visible="importBillPayVisibile" @exit="closeImportBillPay" uploadType="billPayExcel" />
    </div>

</template>
<script>
    import villageApi from '@/api/community/village'
    import PayableOrderInfo from '@/views/community/village/charge/cashier/payableOrderInfo'
    import AddRefundInfo from '@/views/community/village/charge/cashier/addRefundInfo'
    import GetPrintTemplate from '@/views/community/village/charge/cashier/getPrintTemplate'
    import checkRefundInfo from '@/views/community/village/charge/cashier/checkRefundInfo'
    import importBill from "../components/importBill.vue"
    import {
        Collapse
    } from 'ant-design-vue'
    import PrintOrder from '@/views/community/village/charge/cashier/printOrder.vue'
    import moment from 'moment'
    import store from '@/store';
    const columns = [{
            title: store.getters.config.room_name + '号/车位号',
            dataIndex: 'numbers',
            key: 'numbers',
            width: 170
        },
        {
            title: '缴费人',
            dataIndex: 'pay_bind_name',
            key: 'pay_bind_name',
            width: 80
        },
        {
            title: '电话',
            dataIndex: 'pay_bind_phone',
            key: 'pay_bind_phone',
            width: 120,
        },
        {
            title: '收费项目名称',
            dataIndex: 'project_name',
            key: 'project_name',
            width: 150,
        },
        {
            title: '实际缴费金额',
            dataIndex: 'pay_money',
            key: 'pay_money',
            width: 80
        },
        {
            title: '支付方式',
            dataIndex: '',
            key: 'pay_type',
            width: 120,
            scopedSlots: {
                customRender: 'pay_type'
            }
        },
        {
            title: '支付时间',
            dataIndex: 'pay_time',
            key: 'pay_time',
            width: 120,
        },
        {
            title: '开票状态',
            dataIndex: 'record_status',
            key: 'record_status',
            width: 70
        },
        {
            title: '账单状态',
            dataIndex: 'order_status',
            key: 'order_status',
            width: 60
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
            width: 150,
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
        props: {
            pigcmsId: {
                type: Number,
                default: 0
            },
            village_id: {
                type: Number,
                default: 0
            },
            usernum: {
                type: String,
                default: ''
            }
        },
        components: {
            GetPrintTemplate,
            AddRefundInfo,
            PayableOrderInfo,
            PrintOrder,
            checkRefundInfo,
            importBill,
            'a-collapse': Collapse,
            'a-collapse-panel': Collapse.Panel
        },
        data() {
            return {
                reply_content: '',
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: 10,
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '30', '50', '80'], // 每页数量选项
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                },
                search: {
                    keyword: '',
                    key_val: 'name',
                    key_val1: 'paytime',
                    garage_id: [],
                    pay_type: [],
                    project_id: [],
                    page: 1,
                    pigcms_id: 0,
                    service_start_time: '',
                    service_end_time: '',
                    rule_id: [],
                    ticket_number: '',
                    single_id_arr:[],
                    opt_id:'',
                },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                key_name: '请输入姓名',
                data,
                columns,
                options: [],
                garage_list: [],
                project_list: [],
                project_rule_list: [],
                pay_type_list: [],
                search_data: {},
                page: 1,
                selectedRowKeys: [],
                choice_ids: [],
                confirmLoading: false,
                exportPattern: 2,
                modalTitle: 'Excel导出',
                is_vacancy_show: true,
                is_namephone_show: true,
                role_export: 0,
                role_refund: 0,
                endServiceOpen: false,
                total_pay_money: 0,
                total_pay_money_real: 0,
                export_tips_visible: false,
                excelExportOutFileUrl: '',
                service_start_time: null,
                service_end_time: null,
                visible_pay_time: false,
                modify_pay_time: null,
                have_ticket_number: 0,
                ticket_visible: false,
                ticketNumberList: [],
                order_ticket_number: '',
                ticket_set_print: 0,
                no_ticket_order_record: '',
                role_import_pay: false,
                importBillPayVisibile: false,
                orderPayTimeCheckOpen: 0,
                tmpRecord: '',
                func_kaidalaicn_special: 0,
                visible_special_modify: false,
                special_opt_type: '',
                special_modify_title: '',
                order_special_money: '',
                singleList:[],
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
        activated() {

        },
        mounted() {
            let payStart = this.$route.query.payStart
            let payEnd = this.$route.query.payEnd
            let service_start_time = this.$route.query.serviceStart
            let service_end_time = this.$route.query.serviceEnd
            let projectString = this.$route.query.projectString
            if (projectString) {
                projectString = projectString.trim().replace(/(^,)|(,$)/g, '');
                let project_id = projectString.split(",");
                this.search.project_id = project_id;
            }
            if (payStart && payEnd) {
                this.search.data = [moment(payStart), moment(payEnd)];
                this.search.date = [payStart, payEnd];
            }

            if (service_start_time) {
                this.service_start_time = moment(service_start_time);
                this.search.service_start_time = service_start_time;
            }
            if (service_end_time) {
                this.service_end_time = moment(service_end_time);
                this.search.service_end_time = service_end_time;
            }
            console.log("pigcmsId======>", this.pigcmsId)
            console.log("village_id======>", this.village_id)
            console.log("usernum======>", this.usernum)
            if (this.pigcmsId > 0) {
                this.search.pigcms_id = this.pigcmsId;
                this.is_vacancy_show = false;
                this.is_namephone_show = false;
            } else {
                this.is_vacancy_show = true;
                this.is_namephone_show = true;
                this.search.pigcms_id = 0;
            }
            this.singleList=[];
            this.export_tips_visible = false;
            this.have_ticket_number = 0;
            this.getAllWorkerList()
            this.getProjectList()
            this.getSingleListByVillage()
            this.payTypeList()
            this.getList()
            this.getGarageList()
            this.getProjectRuleList()
            
        },
        methods: {
            moment,
            // 获取列表信息
            getList() {
                this.visible_pay_time = false;
                this.visible_special_modify = false;
                this.special_opt_type = '';
                this.special_modify_title = '';
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
                        if (res.total_pay_money != undefined) {
                            this.total_pay_money = res.total_pay_money;
                        }
                        if (res.total_pay_money_real != undefined) {
                            this.total_pay_money_real = res.total_pay_money_real;
                        }
                        if (res.have_ticket_number != undefined) {
                            this.have_ticket_number = res.have_ticket_number;
                        }

                        if (res.role_import_pay != undefined) {
                            this.role_import_pay = res.role_import_pay;
                        }
                        if (res.orderPayTimeCheckOpen != undefined) {
                            this.orderPayTimeCheckOpen = res.orderPayTimeCheckOpen;
                        }
                        if (res.func_kaidalaicn_special != undefined) {
                            this.func_kaidalaicn_special = res.func_kaidalaicn_special * 1;
                        }
                        this.loading = false
                    })
            },
            keyChange(val) {
                if (val == 'name') {
                    this.key_name = '请输入姓名'
                }
                if (val == 'phone') {
                    this.key_name = '请输入电话'
                }
            },
            modifyPayTime(xrecord) {
                this.tmpRecord = xrecord;
                if (!xrecord && this.choice_ids.length < 1) {
                    this.$message.error('请至少勾选一条账单数据！')
                    return false
                }
                this.visible_pay_time = true;
            },
            colseModifyPayTimeOpt() {
                this.visible_pay_time = false;
                this.modify_pay_time = null;
            },
            modifyPayTimeOpt() {
                if (!this.modify_pay_time) {
                    this.$message.error('请选择要修改的时间！')
                    return false
                }
                if (!this.tmpRecord && this.choice_ids.length < 1) {
                    this.$message.error('请至少勾选一条账单数据！')
                    return false
                }
                let modifyPostArr = {};
                modifyPostArr.modify_pay_time = this.modify_pay_time;
                modifyPostArr.choice_orders = this.choice_ids;
                if (this.tmpRecord) {
                    modifyPostArr.choice_orders = [{
                        orderid: this.tmpRecord.order_id,
                        pigcms_id: this.tmpRecord.pigcms_id,
                        room_id: this.tmpRecord.room_id
                    }];
                }
                this.confirmLoading = true;
                this.request('/community/village_api.Cashier/modifyPayTimeOpt', modifyPostArr).then((res) => {
                    this.$message.success('操作成功！');
                    this.visible_pay_time = false;
                    this.modify_pay_time = null;
                    this.confirmLoading = false
                    this.getList();
                }).catch((error) => {
                    this.confirmLoading = false
                })
            },
            changePayTime(dateM, dateString) {
                this.modify_pay_time = dateString;
                console.log('dateM', dateM, 'dateString', dateString);
            },
            /**红冲*补交账单不要了****/
            modifyPayOrderSpecial(xtype) {
                this.special_opt_type = xtype;
                if (this.choice_ids.length < 1) {
                    this.$message.error('请至少勾选一条账单数据！')
                    return false
                }
                if (xtype == 'red_reversal') {
                    this.special_modify_title = '红冲';
                } else if (xtype == 'append_money') {
                    this.special_modify_title = '补交账单';
                }
                this.visible_special_modify = true;
            },
            modifyOrderSpecialOpt() {
                if (!this.order_special_money || this.order_special_money * 1 <= 0) {
                    this.$message.error('请填写金额！')
                    return false
                }
                if (this.special_opt_type != 'red_reversal' && this.special_opt_type != 'append_money') {
                    this.$message.error('操作错误！')
                    return false
                }
                if (this.choice_ids.length < 1) {
                    this.$message.error('请至少勾选一条账单数据！')
                    return false
                }
                let modifyPostArr = {};
                modifyPostArr.modify_opt_type = this.special_opt_type;
                modifyPostArr.opt_money = this.order_special_money;
                modifyPostArr.choice_orders = this.choice_ids;
                this.confirmLoading = true;
                this.request('/community/village_api.Cashier/modifyPayOrderSpecialOpt', modifyPostArr).then((res) => {
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
                this.order_special_money = '';
            },

            onSpecialMoneyChange() {

            },
            
            bindOk() {
                this.getList()
            },
            getProjectList() {
                this.request(villageApi.ChargeProjectList, {
                        type: 'selectdata'
                    })
                    .then((res) => {
                        this.project_list = res.list
                        let projects = [];
                        if (this.search.project_id) {
                            for (let i in this.search.project_id) {
                                if (this.search.project_id[i]) {
                                    projects[i] = parseInt(this.search.project_id[i]);
                                }
                            }
                        }
                        setTimeout(() => {
                            this.search.project_id = projects;
                        }, 300)
                    })
                    .catch((error) => {
                        this.loading = false
                    })
            },
            projectItemChange(v_id) {
                this.getProjectRuleList();
            },
            getProjectRuleList() {
                this.project_rule_list = [];
                this.search.rule_id = [];
                let postTmpData = {
                    charge_project_id: this.search.project_id,
                    type: 'selectdata'
                };
                this.request(villageApi.ChargeRuleList, postTmpData)
                    .then((res) => {
                        this.project_rule_list = res.list
                        console.log(this.project_rule_list);
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
                      this.columns = [{
                              title: store.getters.config.room_name + '号/车位号',
                              dataIndex: 'numbers',
                              key: 'numbers',
                              width: 170
                          },
                          {
                              title: '缴费人',
                              dataIndex: 'pay_bind_name',
                              key: 'pay_bind_name',
                              width: 80
                          },
                          {
                              title: '电话',
                              dataIndex: 'pay_bind_phone',
                              key: 'pay_bind_phone',
                              width: 120,
                          },
                          {
                              title: '收费项目名称',
                              dataIndex: 'project_name',
                              key: 'project_name',
                              width: 150,
                          },
                          {
                              title: '实际缴费金额',
                              dataIndex: 'pay_money',
                              key: 'pay_money',
                              width: 80
                          },
                          {
                              title: '支付方式',
                              dataIndex: '',
                              key: 'pay_type',
                              width: 120,
                              scopedSlots: {
                                  customRender: 'pay_type'
                              }
                          },
                          {
                              title: '支付时间',
                              dataIndex: 'pay_time',
                              key: 'pay_time',
                              width: 120,
                          },
                          {
                              title: '开票状态',
                              dataIndex: 'record_status',
                              key: 'record_status',
                              width: 70
                          },
                          {
                              title: '账单状态',
                              dataIndex: 'order_status',
                              key: 'order_status',
                              width: 60
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
                              width: 150,
                              dataIndex: '',
                              scopedSlots: {
                                  customRender: 'action'
                              }
                          }
                      ]
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
                    if (res) {
                        this.singleList=res;
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
                console.log('search1111', this.search)
            },
            onTableChange(page, pageSize) {
                this.page = page
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                //this.getList()
                //console.log('onTableChange==>', page, pageSize)
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
            // 进行搜索
            searchList() {
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
            printList() {
                this.export_tips_visible = false;
                this.visible = true
            },

            // 打印按钮
            printBut() {
                this.table_change({
                    current: 1,
                    pageSize: 10,
                    total: 10
                })
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
                this.search['is_asyn_export'] = 1;
                this.excelExportOutFileUrl = '';
                console.log(this.search)
                this.visible = false;
                this.export_tips_visible = true;
                this.request(villageApi.printPayOrderList, this.search).then((res) => {
                    this.loading = false
                    if (res.excelExportOutFileUrl != undefined && res.export_id != undefined && res.export_id) {
                        this.excelExportOutFileUrl = res.excelExportOutFileUrl;
                        this.CheckExportOutStatus();
                    } else {

                        window.location.href = res.url
                        this.handleCancel()
                    }
                }).catch((error) => {
                    this.loading = false
                    this.handleCancel()
                })
            },

            CheckExportOutStatus() {
                let excelExportOutFileUrlCheck = this.excelExportOutFileUrl + '&ajax=village_ajax'
                console.log('excelExportOutFileUrlCheck', this.excelExportOutFileUrlCheck)
                this.request(excelExportOutFileUrlCheck, {
                        tokenName: 'village_access_token',
                        ajax: 'village_ajax'
                    })
                    .then((res) => {
                        console.log('exportOutStatus', res)
                        if (res.error_code == 0) {
                            clearTimeout(this.setTimeoutS)
                            this.setTimeoutS = null
                            window.location.href = this.excelExportOutFileUrl;
                            this.export_tips_visible = false;

                            return false;
                        } else if (res.error_code == 404) {
                            this.export_tips_visible = false;

                            clearTimeout(this.setTimeoutS)
                            this.setTimeoutS = null
                            this.$message.error(res.error_msg)
                            return false
                        } else {
                            this.setTimeoutS = setTimeout(this.CheckExportOutStatus, 2000);
                        }
                    }).catch((error) => {
                        this.$message.error('出错了，请刷新页面重试！')
                        this.export_tips_visible = false;

                    })
            },
            closeImportBillPay() {
                this.importBillPayVisibile = false;
                this.getList();
            },
            importBillPayOrder() {
                this.importBillPayVisibile = true;
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
            // 数组去重
            arrUnique(arr, ff = 'pigcms_id') {
                var arr1 = [] // 新建一个数组来存放arr中的值
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (arr1.indexOf(arr[i][ff]) === -1) {
                        arr1.push(arr[i][ff])
                    }
                }
                return arr1
            },
            ticketSetOK() {
                if (this.ticket_set_print * 1 > 0 && !this.order_ticket_number) {
                    that.$message.error('请为订单设置一个票据')
                    return false
                }
                console.log('no_ticket_order_record', this.no_ticket_order_record);
                if (this.ticket_set_print * 1 < 1) {
                    this.checkSetParint(1, this.no_ticket_order_record.order_id, this.no_ticket_order_record.pigcms_id,
                        [], '');
                    this.ticketCancel();
                } else if (this.ticket_set_print * 1 > 0 && this.order_ticket_number) {
                    let xparam = {
                        order_id: this.no_ticket_order_record.order_id,
                        order_ticket_number: this.order_ticket_number,
                        summary_id: this.no_ticket_order_record.summary_id,
                    }
                    this.request('/community/village_api.Cashier/setOrderTicketNumber', xparam).then((res) => {
                        this.checkSetParint(1, this.no_ticket_order_record.order_id, this.no_ticket_order_record
                            .pigcms_id, [], '');
                        this.getList();
                        this.ticketCancel();

                    }).catch((error) => {

                    })
                }

            },
            ticketCancel() {
                this.ticket_visible = false;
                this.no_ticket_order_record = '';
                this.order_ticket_number = '';
                this.ticket_set_print = 0;
                this.ticketNumberList = [];

            },

            // 搜索失去焦点
            handleTicketNumberBlur(value) {
                this.order_ticket_number = value
            },

            // 再次获取焦点时
            handleTicketNumberFocus() {
                console.log('ticket_number', this.order_ticket_number)
                this.ticketNumberList = []
            },
            searchTicketNumberChange(value) {
                console.log('TicketNumber', value, '===>', this.order_ticket_number)
            },
            // 数组去重
            arrUnique(arr, ff = 'pigcms_id') {
                var arr1 = [] // 新建一个数组来存放arr中的值
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (arr1.indexOf(arr[i][ff]) === -1) {
                        arr1.push(arr[i][ff])
                    }
                }
                return arr1
            },
            handleTicketNumberSearch(value) {
                console.log('searchTicketNumber', value)
                if (!value || value.length < 1) {
                    this.ticketNumberList = []
                    this.order_ticket_number = ''
                    return false
                }
                let xparam = {
                    search_v: value
                }
                this.request(villageApi.getCanUseTicketNumberList, xparam).then((res) => {
                    if (res.list.length > 0) {
                        this.ticketNumberList = res.list
                    }
                })
            },
            // 校验是否设置打印模板 可直接打印
            checkSetParint(type, order_id = 0, pigcms_id = 0, choice_ids = [], record = '') {
                const that = this;
                const arr_num = 0
                if (type == 2) { // 批量打印判断
                    if (choice_ids.length < 1) {
                        that.$message.error('请勾选账单')
                        return false
                    }
                    if ((this.arrUnique(choice_ids, 'room_id').length) > 1) {
                        that.$message.error('当前仅支持同一个' + store.getters.config.room_name + '进行批量打印已缴账单')
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
                        this.no_ticket_order_record = '';
                        this.order_ticket_number = '';
                        this.ticket_set_print = 0;
                        this.ticketNumberList = [];
                        if (this.have_ticket_number > 0 && type == 1 && record && !record.ticket_number) {
                            this.ticket_visible = true;
                            this.no_ticket_order_record = record;
                            this.order_ticket_number = ''
                            return false;
                        }
                        this.request(villageApi.checkSetPrint).then((res) => {
                            if (res.template_id && res.template_id > 0) { // 设置指定打印模板
                                this.$refs.PrintOrderModel.add(order_id, res.template_id, pigcms_id,
                                    choice_ids)
                            } else { // 未设置打印模板
                                if (type == 1) { // 单条打印
                                    this.$refs.PrintModel.add(order_id, pigcms_id)
                                } else { // 批量打印
                                    this.$refs.PrintModel.batchPrint(choice_ids)
                                }
                            }
                        })

                    }
                })
            }

        }
    }
</script>
<style lang="less" scoped>
    .message-suggestions-box-1 {
        margin: 30px 20px;
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

    .lbsf {
        float: right;
        margin-right: 24px;
    }

    .padding-tp10 {
        padding-top: 15px;
        padding-bottom: 15px;
    }

    .mg5_box {
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-left: 0.5%;
    }

    .cascader_style {
        width: 280px;
    }

    .suggestions_row {
        display: flex;
        flex-wrap: wrap;
    }

    .suggestions_col {
        display: flex;
        width: 250px;
        margin: 5px;
    }

    .suggestions_col_btn {
        width: 120px;
        margin: 5px;
    }
</style>