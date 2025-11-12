<template>
    <a-modal :title="title" :width="1000" :visible="visible" :maskClosable="false" :footer="null"
        :confirmLoading="confirmLoading" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading" :height="800">
            <a-card>
                <div v-if="currentIndex == 0">
                    <a-button type="primary" @click="changeXTab(0)" style="margin-right: 30px">订单基本信息</a-button>
                    <a-button type="default" @click="changeXTab(1)" style="margin-right: 30px" v-if="post.pay_type_way>0" >订单退款记录</a-button>
                    <a-button type="default" @click="changeXTab(2)" style="margin-right: 30px" v-if="show_check_detail">
                        退款审核记录</a-button>
                        <a-button type="default" @click="changeXTab(3)" style="margin-right: 30px" v-if="pay_time_modify_record.length>0">
                            支付时间修改记录</a-button>
                        
                </div>
                <div v-else-if="currentIndex == 1">
                    <a-button type="default" @click="changeXTab(0)" style="margin-right: 30px">订单基本信息</a-button>
                    <a-button type="primary" @click="changeXTab(1)" style="margin-right: 30px" v-if="post.pay_type_way>0" >订单退款记录</a-button>
                    <a-button type="default" @click="changeXTab(2)" style="margin-right: 30px" v-if="show_check_detail">
                        退款审核记录</a-button>
                     <a-button type="default" @click="changeXTab(3)" style="margin-right: 30px" v-if="pay_time_modify_record.length>0">
                            支付时间修改记录</a-button>
                </div>
                <div v-else-if="currentIndex == 2">
                    <a-button type="default" @click="changeXTab(0)" style="margin-right: 30px">订单基本信息</a-button>
                    <a-button type="default" @click="changeXTab(1)" style="margin-right: 30px" v-if="post.pay_type_way>0"  >订单退款记录</a-button>
                    <a-button type="primary" @click="changeXTab(2)" style="margin-right: 30px" v-if="show_check_detail">
                        退款审核记录</a-button>
                <a-button type="default" @click="changeXTab(3)" style="margin-right: 30px" v-if="pay_time_modify_record.length>0">
                            支付时间修改记录</a-button>
                </div>
                <div v-else>
                    <a-button type="default" @click="changeXTab(0)" style="margin-right: 30px">订单基本信息</a-button>
                    <a-button type="default" @click="changeXTab(1)" style="margin-right: 30px" v-if="post.pay_type_way>0" >订单退款记录</a-button>
                    <a-button type="default" @click="changeXTab(2)" style="margin-right: 30px" v-if="show_check_detail">
                        退款审核记录</a-button>
                <a-button type="primary" @click="changeXTab(3)" style="margin-right: 30px" v-if="pay_time_modify_record.length>0">
                            支付时间修改记录</a-button>
                </div>
            </a-card>
            <div class="order_list_box" v-if="currentIndex == 0">
                <a-card>
                    <span class="ant-card-head-title"
                        style="font-size: 16px;font-weight: 600; border-bottom: 1px solid #eee; width: 100%; padding-bottom: 3px;">用户信息</span>
                    <div>
                        <span class="ant-card-span1">
                            <label>{{$store.getters.config.room_name}}号:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.numbers" />
                        </span>
                        <span class="ant-card-span2">
                            <label>车位号:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.park_number" />
                        </span>
                        <span class="ant-card-span1">
                            <label>缴费人:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.pay_bind_name" />
                        </span>
                        <span class="ant-card-span2">
                            <label>电话:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.pay_bind_phone" />
                        </span>
                    </div>
                </a-card>
                <a-card>
                    <span class="ant-card-head-title"
                        style="font-size: 16px;font-weight: 600; border-bottom: 1px solid #eee; width: 100%; padding-bottom: 3px;">订单基本信息</span>
                    <div>
                        <span class="ant-card-span1">
                            <label>订单编号:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.order_no" />
                        </span>
                        <span class="ant-card-span2">
                            <label>支付单号:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.order_serial" />
                        </span>
                        <span class="ant-card-span2">
                            <label>所属收费类别:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.subject_charge_name" />
                        </span>
                        <span class="ant-card-span2">
                            <label>所属收费科目:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.subject_name" />
                        </span>
                        <span class="ant-card-span1">
                            <label>收费项目名称:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.project_name" />
                        </span>
                        <span class="ant-card-span1">
                            <label>收费标准:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.charge_name" />
                        </span>
                        <span class="ant-card-span2" v-if="post.is_split_order">
                            <label>账单合并生成：</label>
                            <span class="ant-card-input">{{ post.unify_flage_id ? '否':'是' }}</span>
                        </span>
                        
                        <span class="ant-card-span2" v-if="post.is_split_order  && post.unify_flage_id">
                            <label>账单拆分编号：</label>
                            <span class="ant-card-input">{{ post.unify_flage_id}}</span>
                        </span>
                        
                        <span class="ant-card-span1" v-if="post.service_month_num && post.is_prepare!=1">
                            <label>收费周期:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.service_month_num" />
                        </span>
                        <span class="ant-card-span1" v-else>
                            <label>收费周期:</label>
                            <a-input class="ant-card-input" :disabled="true" value="无" />
                        </span>
                        <span class="ant-card-span1">
                            <label>账单生成时间:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.add_time" />
                        </span>
                        
                        <span class="ant-card-span1">
                            <label>应收费用:</label>
                            <a-input style="color: #18f;" class="ant-card-input" :disabled="true" v-model="post.total_money" />
                        </span>
                        <span class="ant-card-span2">
                            <label>修改后费用:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.modify_money" />
                        </span>
                        <span class="ant-card-span1" v-if="post.order_modify_discount_str">
                            <label>修改优惠信息:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.order_modify_discount_str" />
                        </span>
                        <span class="ant-card-span1">
                            <label>修改原因:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.modify_reason" />
                        </span>
                        <span class="ant-card-span2">
                            <label>实际缴费金额:</label>
                            <a-input class="ant-card-input" style="color: #18f;" :disabled="true"
                                v-model="post.pay_money" />
                        </span>
                        <span class="ant-card-span2" v-if="post.func_kaidalaicn_special*1>0" >
                            <label>红冲金额:</label>
                            <a-input class="ant-card-input" style="color: #18f;" :disabled="true"
                                v-model="post.red_reversal_money" />
                        </span>
                        <span class="ant-card-span2" v-if="post.func_kaidalaicn_special*1>0" >
                            <label>补交金额:</label>
                            <a-input class="ant-card-input" style="color: #18f;" :disabled="true"
                                v-model="post.append_later_money" />
                        </span>
                        <span class="ant-card-span2">
                            <label>计费开始时间:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.service_start_time" />
                        </span>
                        <span class="ant-card-span1">
                            <label>计费结束时间:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.service_end_time" />
                        </span>
                        <span class="ant-card-span1">
                            <label>支付时间:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.pay_time" />
                        </span>
                        <div>
                            <label>支付方式
								<a-tooltip placement="topLeft" title="线下支付是在物业后告，自定义创建的支付方式">
									<a-icon type="question-circle" />
								</a-tooltip>
								:
							</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.pay_type" style="width: 88%;"/>
                        </div>
                         <span class="ant-card-span1" v-if="post.ticket_number">
                             <label>票据编号:</label>
                             <a-input class="ant-card-input" :disabled="true" v-model="post.ticket_number" />
                         </span>
                        <span class="ant-card-span1">
                            <label>线上缴费金额:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.pay_amount_points" />
                        </span>
                        <span class="ant-card-span2">
                            <label>余额支付金额:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.system_balance" />
                        </span>
                        <span class="ant-card-span1">
                            <label>积分抵扣费金额:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.score_deducte" />
                        </span>
                        <span class="ant-card-span2">
                            <label>积分抵扣数量:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.score_used_count" />
                        </span>
                        <span class="ant-card-span2" v-if="post.offline_pay_money">
                            <label>线下支付金额:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.offline_pay_money" />
                        </span>
                        <span class="ant-card-span1">
                            <label>实际到账金额
                                <a-tooltip placement="topLeft" title="实际到账金额=实际缴费金额-退款总金额">
                                    <a-icon type="question-circle" />
                                </a-tooltip>
                                :
                            </label>
                            <a-input class="ant-card-input" style="color: #18f;" :disabled="true"
                                v-model="post.pay_money_real" />
                        </span>
                        <span class="ant-card-span1">
                            <label>优惠方式:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.diy_type" />
                        </span class="ant-card-span2">
                        <span class="ant-card-span2">
                            <label>收款人:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.role_name" />
                        </span>
                        <span class="ant-card-span1">
                            <label>用量:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.ammeter" />
                        </span>
                        <span class="ant-card-span2" v-if="is_show">
                            <label>起度:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.last_ammeter" />
                        </span>
                        <span class="ant-card-span2" v-if="is_show">
                            <label>止度:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.now_ammeter" />
                        </span>
                        <span class="ant-card-span2">
                            <label>开票状态:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.record_status" />
                        </span>
                        <span class="ant-card-span2">
                            <label>备注:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.remark" />
                        </span>

                        <span class="ant-card-span2">
                            <label>押金抵扣:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.deposit_money" />
                        </span>
                        <span class="ant-card-span1" v-if="post.over_paid_money *1>0">
                            <label>多缴金额:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.over_paid_money" />
                        </span>
                        <span class="ant-card-span1" v-if="post.parking_num_txt">
                            <label>车位数:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.parking_num_txt" />
                        </span>
                        <span class="ant-card-span1" v-if="is_show">
                            <label>抄表时间:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.opt_meter_time" />
                        </span>
                        <span class="ant-card-span2" v-if="post.children_arr_info">
                            <label>子车位:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.children_arr_info" />
                        </span>
                    </div>
                    <div>
                        <label>打印编号：</label>
                        <span>{{post.print_no}}</span>
                    </div>
                </a-card>
                <a-card>
                    <span class="ant-card-head-title"
                        style="font-size: 16px;font-weight: 600; border-bottom: 1px solid #eee; width: 100%; padding-bottom: 3px;">违约金信息</span>
                    <span class="ant-card-span1">
                        <label>违约总天数:</label>
                        <a-input class="ant-card-input" :disabled="true" v-model="post.late_payment_day" />
                    </span>
                    <span class="ant-card-span2">
                        <label>违约金总费用:</label>
                        <a-input class="ant-card-input" :disabled="true" style="width: 25%"
                            v-model="post.late_payment_money" />
                    </span>

                </a-card>
                <a-card>
                    <span class="ant-card-head-title"
                        style="font-size: 16px;font-weight: 600; border-bottom: 1px solid #eee; width: 100%; padding-bottom: 3px;">订单优惠信息</span>
                    <span class="ant-card-span1">
                        <label>预缴周期:</label>
                        <a-input class="ant-card-input" :disabled="true" v-model="post.prepare_month_num" />
                    </span>
                    <span class="ant-card-span2">
                        <label>优惠信息:</label>
                        <a-input class="ant-card-input" :disabled="true" style="width: 85%"
                            v-model="post.diy_content" />
                    </span>
                    <span class="ant-card-span1">
                        <label>预缴费用:</label>
                        <a-input class="ant-card-input" :disabled="true" v-model="post.prepare_pay_money" />
                    </span>
                </a-card>
                <a-card>
                    <span class="ant-card-head-title"
                        style="font-size: 16px;font-weight: 600; border-bottom: 1px solid #eee; width: 100%; padding-bottom: 3px;">退款信息</span>
                    <div>
                        <span class="ant-card-span1">
                            <label>账单状态:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.refund_status" />
                        </span>
                        <span class="ant-card-span1">
                            <label>账单模式:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.refund_type" />
                        </span>
                        <span class="ant-card-span1">
                            <label>退款总金额:</label>
                            <a-input style="color: #18f;" class="ant-card-input" :disabled="true" v-model="post.refund_money" />
                        </span>
                        <span class="ant-card-span1">
                            <label>退款原因:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="apply_check_info.apply_reason" />
                        </span>
                    </div>
                </a-card>

                <a-card style="padding-bottom: 24px;" v-if="post.showArr && post.showArr[0]">
                    <span class="ant-card-head-title"
                        style="font-size: 16px;font-weight: 600; border-bottom: 1px solid #eee; width: 100%; padding-bottom: 3px;">导入相关信息</span>
                    <span class="ant-card-span1" style="margin-left: -95px;">
                        <label>{{post.showArr[0].title}}:</label>
                        {{post.showArr[0].value}}
                    </span>
                    <span style="padding-left: 258px;" v-if="post.showArr[1]">
                        <label>{{post.showArr[1].title}}:</label>
                        {{post.showArr[1].value}}
                    </span>
                    <p>
                        <span class="ant-card-span1" v-if="post.showArr[2]">
                            <label>{{post.showArr[2].title}}:</label>
                            {{post.showArr[2].value}}
                        </span>
                        <span style="padding-left: 238px;" v-if="post.showArr[3]">
                            <label>{{post.showArr[3].title}}:</label>
                            {{post.showArr[3].value}}
                        </span>
                    </p>
                    <span class="ant-card-span1" v-if="post.showArr[4]">
                        <label>{{post.showArr[4].title}}:</label>
                        {{post.showArr[4].value}}
                    </span>

                </a-card>

            </div>
            <div class="message-suggestions-list-box" v-if="currentIndex == 1" style="margin-top: 10px;">
                <a-table :columns="columnsRefund" :data-source="dataRefund" class="components-table-demo-nested"
                    :pagination="pagination" @change='tableRefundChange' :loading="loading">
                </a-table>
            </div>

            <div class="order_apply_list" v-if="currentIndex == 2" style="margin: 30px 0px 20px 35px;">
                <div>
                    <p><strong>申请详情</strong> </p>
                    <p><strong>申请人：</strong> {{apply_check_info.apply_name}}</p>
                    <p><strong>申请时间：</strong> {{apply_check_info.add_time_str}}</p>
                    <p><strong>退款金额：</strong> {{apply_check_info.apply_money}} 元</p>
                    <p><strong>退款原因：</strong> {{apply_check_info.apply_reason}}</p>
                </div>
                <a-timeline>
                    <a-timeline-item v-for="(item,index) in dataCheckDetail" :color="item.color_v">
                        <p><strong>审批人：</strong> {{item.pname}}</p>
                        <p><strong>审核状态：</strong> {{item.status_str}}</p>
                        <p><strong>审核时间：</strong> {{item.apply_time_str}}</p>
                        <p><strong>审核说明：</strong> {{item.bak}}</p>
                    </a-timeline-item>
                </a-timeline>
            </div>
            <div class="message-suggestions-list-box" v-if="currentIndex == 3" style="margin-top: 10px;">
                <a-table :columns="columnsPayTimeModify" :data-source="pay_time_modify_record" class="components-table-demo-nested" :pagination="false"
                 :loading="loading">
                </a-table>
            </div>
            
        </a-spin>

        <refund-list ref="RefundModel" />
    </a-modal>
</template>
<style>
    .imgname {
        width: 100px;
    }

    .ant-card-body {
        padding: 0px;
        padding-left: 24px;
        zoom: 1;
    }

    .ant-modal-body {
        padding: 24px;
        zoom: 1;
    }

    .ant-card-bordered {
        border: 0px;
    }

    .ant-input[disabled] {
        color: rgba(0, 0, 0, 0.65);
        background-color: #ffffff;
        cursor: not-allowed;
        opacity: 1;
    }

    .ant-card-input {
        color: #333333;
        width: 68%;
        /* margin-left: 24px;*/
        border: 0px;
    }

    .ant-card-span {
        padding-right: 55px;
    }

    .ant-card-span1 {
        width: 50%;
        display: inline-block;

    }

    .ant-card-span2 {
        width: 50%;
        display: inline-block;
    }

    .ant-card-head {
        min-height: 48px;
        margin-bottom: -1px;
        padding: 0 24px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
        font-size: 14px;
        background: transparent;
        border-bottom: 0px;
        border-radius: 2px 2px 0 0;
        zoom: 1;
    }
</style>
<script>
    import villageApi from '@/api/community/village';
    import RefundList from "@/views/community/village/charge/cashier/refundList";
    const columnsRefund = [{
            title: '退款金额',
            dataIndex: 'refund_money',
            key: 'refund_money'
        },
        {
            title: '线上退款金额',
            dataIndex: 'refund_online_money',
            key: 'refund_online_money'
        },
        {
            title: '余额退款金额',
            dataIndex: 'refund_balance_money',
            key: 'refund_balance_money'
        },
        {
            title: '积分抵扣退款金额',
            dataIndex: 'refund_score_money',
            key: 'refund_score_money'
        },
        {
            title: '积分抵扣退款积分数量',
            dataIndex: 'refund_score_count',
            key: 'refund_score_count'
        },
        {
            title: '退款时间',
            dataIndex: 'add_time',
            key: 'add_time'
        },
        {
            title: '退款原因',
            dataIndex: 'refund_reason',
            key: 'refund_reason'
        },
        {
            title: '操作人',
            dataIndex: 'role_name',
            key: 'role_name'
        },
    ];
    const columnsPayTimeModify =[{
            title: '操作时间',
            dataIndex: 'add_time_str',
            key: 'add_time_str'
        },
        {
            title: '修改人信息',
            dataIndex: 'user_name',
            key: 'user_name'
        },
        {
            title: '修改前支付时间',
            dataIndex: 'front_pay_time',
            key: 'front_pay_time'
        },
        {
            title: '修改后支付时间',
            dataIndex: 'mdfy_pay_time',
            key: 'mdfy_pay_time'
        },
        {
            title: '审核状态',
            dataIndex: 'check_status_str',
            key: 'check_status_str'
        },
        {
            title: '审核时间',
            dataIndex: 'check_time_str',
            key: 'check_time_str'
        },
    ];
    const dataRefund = [];
    export default {
        name: 'payableOrderInfo',
        components: {
            RefundList
        },
        data() {
            return {
                title: '新建',
                setWidth: 700,
                labelCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 7
                    }
                },
                wrapperCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 13
                    }
                },
                confirmLoading: false,
                form: this.$form.createForm(this),
                visible: false,
                id: 0,
                is_show: false,
                check_apply_id: 0,
                show_check_detail: false,
                currentIndex: 0,
                columnsRefund,
                columnsPayTimeModify,
                dataRefund,
                dataCheckDetail: [],
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
                page: 1,
                post: {
                    deposit_money: '',
                    order_id: '',
                    order_no: '',
                    order_serial: '',
                    numbers: '',
                    pay_bind_name: '',
                    pay_bind_phone: '',
                    project_name: '',
                    subject_name: '',
                    total_money: '',
                    modify_money: '',
                    modify_reason: '',
                    pay_money: '',
                    role_name: '',
                    diy_type: '',
                    score_used_count: '',
                    pay_time: '',
                    pay_type: '',
                    service_start_time: '',
                    service_end_time: '',
                    ammeter: '',
                    now_ammeter: '',
                    last_ammeter: '',
                    opt_meter_time: '',
                    children_arr_info: '',
                    record_status: '',
                    refund_status: '',
                    remark: '',
                    late_payment_day: '',
                    late_payment_money: '',
                    service_month_num: '',
                    service_give_month_num: '',
                    prepare_pay_money: '',
                    refund_money: '',
                    refund_type: '',
                    prepare_month_num: '',
                    is_prepare: 1,
                    print_no: '',
                    showArr: [],
                    func_kaidalaicn_special:0,
                },
                apply_check_info: {},
                pay_time_modify_record:[],
            }
        },
        mounted() {},
        methods: {
            add(id, check_apply_id) {
                this.title = '订单详情';
                this.visible = true;
                this.is_show = false;
                this.id = id;
                this.check_apply_id = check_apply_id;
                this.currentIndex = 0;
                this.post = {
                    deposit_money: '',
                    order_id: '',
                    order_no: '',
                    order_serial: '',
                    numbers: '',
                    pay_bind_name: '',
                    pay_bind_phone: '',
                    project_name: '',
                    subject_name: '',
                    total_money: '',
                    modify_money: '',
                    modify_reason: '',
                    role_name: '',
                    pay_money: '',
                    diy_type: '',
                    score_used_count: '',
                    pay_time: '',
                    pay_type: '',
                    service_start_time: '',
                    service_end_time: '',
                    ammeter: '',
                    now_ammeter: '',
                    last_ammeter: '',
                    opt_meter_time: '',
                    record_status: '',
                    refund_status: '',
                    remark: '',
                    late_payment_day: '',
                    late_payment_money: '',
                    service_month_num: '',
                    service_give_month_num: '',
                    prepare_pay_money: '',
                    refund_money: '',
                    refund_type: '',
                    is_prepare: 1,
                    showArr: [],
                    func_kaidalaicn_special:0,
                };
                this.pay_time_modify_record=[];
                this.getOrderInfo();
                if (this.check_apply_id > 0) {
                    this.show_check_detail = true;
                } else {
                    this.show_check_detail = false;
                }
            },

            getOrderInfo() {
                this.loading = true;
                this.request(villageApi.payOrderInfo, {
                        id: this.id
                    })
                    .then((res) => {
                        this.post = res
                        if (res.order_type == 'water' || res.order_type == 'electric' || res.order_type == 'gas') {
                            this.is_show = true
                        }
                        if (res.check_apply_id < 1) {
                            this.check_apply_id = res.check_apply_id;
                            this.show_check_detail = false;
                        }
                        if(res.pay_time_modify_record){
                           this.pay_time_modify_record= res.pay_time_modify_record;
                        }
                        this.loading = false
                    })
            },
            changeXTab(index) {

                this.currentIndex = index
                if (this.currentIndex == 0) {
                    this.getOrderInfo()
                } else if (this.currentIndex == 1) {
                    this.getRefundList()
                } else if(this.currentIndex == 2) {
                    this.getCheckauthDetail()
                }else{
                    
                }
            },
            getRefundList() {
                this.loading = true;
                this.request(villageApi.refundList, {
                        order_id: this.id,
                        page: this.page,
                        limit: this.pagination.pageSize
                    })
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.dataRefund = res.list
                        this.loading = false
                    })
            },
            getCheckauthDetail() {
                this.loading = true;
                this.request(villageApi.getCheckauthDetail, {
                        order_id: this.id,
                        check_apply_id: this.check_apply_id,
                        xtype: 'order_refund',
                        page: this.page
                    })
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.dataCheckDetail = res.list
                        this.apply_check_info = res.apply_info
                        this.loading = false
                    })
            },
            onTableChange(page, pageSize) {
                this.page = page
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.getRefundList()
                console.log('onTableChange==>', page, pageSize)
            },
            // 表格中变动  这里只针对页面页数切换
            tableRefundChange(e) {
                console.log('e', e)
                if (e.current && e.current > 0) {
                    this.page = e.current;
                    this.getRefundList()
                }
            },

            handleCancel() {
                this.visible = false
                this.currentIndex = 0;
                setTimeout(() => {
                    this.post = {};
                    this.form = this.$form.createForm(this)
                }, 500)
            },
        },
    }
</script>

<style lang="less" scoped>
    .ant-card-head-title {
        padding-bottom: 3px;
        color: #000;
    } 
</style>
