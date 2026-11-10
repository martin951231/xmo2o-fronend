<template>
    <a-modal :title="title" :width="1300" :visible="visible" :maskClosable="false" :footer="null"
        :confirmLoading="confirmLoading" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading" :height="800">
            <a-card class="order-info-tab-card">
                <div class="order-info-tabs">
                    <a-button :type="currentIndex == 0 ? 'primary' : 'default'" @click="changeXTab(0)">订单基本信息</a-button>
                    <a-button :type="currentIndex == 1 ? 'primary' : 'default'" @click="changeXTab(1)" v-if="post.pay_type_way>0">订单退款记录</a-button>
                    <a-button :type="currentIndex == 2 ? 'primary' : 'default'" @click="changeXTab(2)" v-if="show_check_detail">退款审核记录</a-button>
                    <a-button :type="currentIndex == 3 ? 'primary' : 'default'" @click="changeXTab(3)" v-if="pay_time_modify_record.length>0">支付时间修改记录</a-button>
                    <a-button :type="currentIndex == 4 ? 'primary' : 'default'" @click="changeXTab(4)" v-if="hasDepositDeductInfo()">押金抵扣记录</a-button>
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
                        <span class="ant-card-span2" v-if="isDepositOrder(post)">
                            <label>押金状态:</label>
                            <a-input class="ant-card-input" :disabled="true" v-model="post.deposit_status_text" />
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
            <div class="deposit-deduct-box" v-if="currentIndex == 4" style="margin-top: 10px;">
                <a-card>
                    <span class="ant-card-head-title"
                        style="font-size: 16px;font-weight: 600; border-bottom: 1px solid #eee; width: 100%; padding-bottom: 3px;">押金余额</span>
                    <span class="ant-card-span1">
                        <label>押金总额:</label>
                        <a-input class="ant-card-input" :disabled="true" :value="depositDeductInfo.balance.total_money" />
                    </span>
                    <span class="ant-card-span2">
                        <label>已抵扣金额:</label>
                        <a-input class="ant-card-input" :disabled="true" :value="depositDeductInfo.balance.used_money" />
                    </span>
                    <span class="ant-card-span1">
                        <label>押金余额:</label>
                        <a-input class="ant-card-input" :disabled="true" :value="depositDeductInfo.balance.available_money" />
                    </span>
                </a-card>
                <a-card style="margin-top: 16px;" v-if="depositAttachmentRoomId">
                    <span class="ant-card-head-title"
                        style="font-size: 16px;font-weight: 600; border-bottom: 1px solid #eee; width: 100%; padding-bottom: 3px;">押金附件</span>
                    <div class="deposit-attachment-box">
                        <a-upload
                            name="file"
                            :multiple="true"
                            :show-upload-list="false"
                            :accept="depositAttachmentGroup.accept"
                            :data="{ path: 'houseRoomAttachment' }"
                            action="/v20/public/index.php/community/village_api.ChatSidebar/uploadFile"
                            :headers="uploadHeaders"
                            :before-upload="beforeDepositAttachmentUpload"
                            @change="handleDepositAttachmentUpload"
                        >
                            <a-button type="primary" :loading="depositAttachmentLoading">
                                <a-icon type="upload" />
                                上传
                            </a-button>
                        </a-upload>
                        <span class="deposit-attachment-tip">仅同步这里上传的押金附件到业主房间信息</span>
                        <div class="deposit-attachment-list" v-if="depositAttachmentFiles.length">
                            <template v-for="file in depositAttachmentFiles">
                                <span :key="depositAttachmentFileKey(file, 'file')" class="deposit-attachment-file">
                                    <a :href="file.file_url_full || file.url" target="_blank">{{ file.original_name || file.name }}</a>
                                </span>
                                <a
                                    :key="depositAttachmentFileKey(file, 'delete')"
                                    class="deposit-attachment-delete"
                                    @click="removeDepositAttachment(file)"
                                >删除</a>
                            </template>
                        </div>
                        <div class="deposit-attachment-empty" v-else>暂无押金附件</div>
                    </div>
                </a-card>
                <a-card style="margin-top: 16px;">
                    <span class="ant-card-head-title"
                        style="font-size: 16px;font-weight: 600; border-bottom: 1px solid #eee; width: 100%; padding-bottom: 3px;">押金抵扣记录</span>
                    <a-table :columns="columnsDepositDeduct" :data-source="depositDeductInfo.list" class="components-table-demo-nested deposit-deduct-table"
                        :pagination="false" :loading="loading" rowKey="origin_order_no" :scroll="{ x: 1300 }">
                    </a-table>
                </a-card>
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
            title: '退款明细',
            dataIndex: 'refund_detail_text',
            key: 'refund_detail_text',
            width: 260
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
    const columnsDepositDeduct = [{
            title: '缴费人',
            dataIndex: 'pay_bind_name',
            key: 'pay_bind_name'
        },
        {
            title: '收款人',
            dataIndex: 'role_name',
            key: 'role_name'
        },
        {
            title: '抵扣金额',
            dataIndex: 'deduct_money',
            key: 'deduct_money'
        },
        {
            title: '抵扣后余额',
            dataIndex: 'after_balance',
            key: 'after_balance'
        },
        {
            title: '抵扣时间',
            dataIndex: 'deduct_time',
            key: 'deduct_time'
        },
        {
            title: '抵扣备注',
            dataIndex: 'remark',
            key: 'remark'
        },
        {
            title: '抵扣原订单编号',
            dataIndex: 'origin_order_no',
            key: 'origin_order_no'
        },
        {
            title: '抵扣原订单收费项目名称',
            dataIndex: 'origin_project_name',
            key: 'origin_project_name'
        },
        {
            title: '抵扣原订单收费项目周期',
            dataIndex: 'origin_project_period',
            key: 'origin_project_period'
        },
    ];
    const depositDeductColumnWidth = {
        pay_bind_name: 90,
        role_name: 90,
        deduct_money: 100,
        after_balance: 110,
        deduct_time: 160,
        remark: 120,
        origin_order_no: 160,
        origin_project_name: 190,
        origin_project_period: 220
    };
    columnsDepositDeduct.forEach(item => {
        item.width = depositDeductColumnWidth[item.dataIndex] || 120
    });
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
                columnsDepositDeduct,
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
                    room_id: '',
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
                depositDeductInfo: {
                    show: 0,
                    balance: {},
                    list: []
                },
                depositAttachmentGroup: {
                    accept: '.jpg,.jpeg,.png,.gif,.bmp,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar',
                    allow_exts: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar']
                },
                depositAttachmentFiles: [],
                depositAttachmentLoading: false,
                uploadHeaders: {
                    authorization: 'authorization-text'
                },
            }
        },
        mounted() {},
        computed: {
            depositAttachmentRoomId() {
                return this.post && this.post.room_id ? this.post.room_id : 0
            }
        },
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
                    room_id: '',
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
                this.depositDeductInfo = {
                    show: 0,
                    balance: {},
                    list: []
                };
                this.depositAttachmentFiles = [];
                this.depositAttachmentLoading = false;
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
                        this.post = this.normalizeDepositDeductMoney(res)
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
                        this.depositDeductInfo = res.deposit_deduct_info || {
                            show: 0,
                            balance: {},
                            list: []
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
                } else if(this.currentIndex == 4) {
                    this.getDepositAttachmentList()
                    this.loading = false
                }else{
                    
                }
            },
            isDepositOrder(record) {
                if (!record) {
                    return false
                }
                const statusText = String(record.deposit_status_text || record.deposit_status_name || record.deposit_status || '')
                return record.order_type == 'deposit_bill' ||
                    record.order_type_flag == 'deposit_bill' ||
                    record.source_type == 'deposit_bill' ||
                    record.is_deposit_order == 1 ||
                    Number(record.deposit_category_id || 0) > 0 ||
                    !!record.deposit_category_key ||
                    !!record.deposit_cate_key ||
                    Number(record.deposit_account_status || 0) > 0 ||
                    Number(record.deposit_status || 0) > 0 ||
                    statusText.indexOf('\u51bb\u7ed3') > -1 ||
                    statusText.indexOf('\u89e3\u51bb') > -1
            },
            normalizeDepositProjectName(info) {
                const post = Object.assign({}, info)
                if (!this.isDepositOrder(post)) {
                    return post
                }
                const categoryName = post.deposit_category_name || post.deposit_cate_name || post.category_name || post.cate_name || ''
                post.is_deposit_order = 1
                if (categoryName) {
                    post.project_name = categoryName
                    post.charge_name = categoryName
                    post.order_name = categoryName
                }
                return post
            },
    normalizeDepositDeductMoney(info) {
        const post = this.normalizeDepositProjectName(info)
        const depositMoney = this.parseMoney(post.deposit_money)
        const totalMoney = this.parseMoney(post.total_money)
        const modifyMoneyText = post.modify_money === undefined || post.modify_money === null
            ? ''
            : String(post.modify_money).trim()
        const hasModifyMoney = /-?\d+(?:\.\d+)?/.test(modifyMoneyText)
        const payableMoney = hasModifyMoney ? this.parseMoney(post.modify_money) : totalMoney
        const realPayMoney = Math.max(payableMoney - depositMoney, 0)
        post.pay_money = this.formatMoney(realPayMoney)
        post.pay_money_real = this.formatMoney(realPayMoney)
        return post
    },
            parseMoney(value) {
                const money = parseFloat(String(value || '').replace(/[^\d.-]/g, ''))
                return isNaN(money) ? 0 : money
            },
            formatMoney(value) {
                return Number(value || 0).toFixed(2)
            },
            hasDepositDeductInfo() {
                if (this.post && this.post.order_type == 'deposit_bill') {
                    return true
                }
                if (this.depositDeductInfo && Number(this.depositDeductInfo.show) > 0) {
                    return true
                }
                if (this.depositDeductInfo && this.depositDeductInfo.list && this.depositDeductInfo.list.length > 0) {
                    return true
                }
                const depositMoney = parseFloat(String(this.post.deposit_money || '').replace(/[^\d.-]/g, ''))
                return depositMoney > 0
            },
            getDepositAttachmentList() {
                if (!this.depositAttachmentRoomId) {
                    this.depositAttachmentFiles = []
                    return
                }
                this.request(villageApi.getDepositAttachmentList, {
                    vacancy_id: this.depositAttachmentRoomId
                }).then((res) => {
                    const group = res.group || {}
                    this.depositAttachmentGroup = {
                        ...this.depositAttachmentGroup,
                        ...group
                    }
                    this.depositAttachmentFiles = group.files || []
                })
            },
            beforeDepositAttachmentUpload(file) {
                const ext = (file.name || '').split('.').pop().toLowerCase()
                const allowExts = this.depositAttachmentGroup.allow_exts || []
                if (allowExts.length && allowExts.indexOf(ext) === -1) {
                    this.$message.error('押金附件格式不支持')
                    return false
                }
                if (file.size > 20 * 1024 * 1024) {
                    this.$message.error('单个附件不能超过20M')
                    return false
                }
                return true
            },
            handleDepositAttachmentUpload(info) {
                this.depositAttachmentLoading = info.file.status === 'uploading'
                if (info.file.status === 'done') {
                    this.depositAttachmentLoading = false
                    if (info.file.response.status === 1000) {
                        const fileData = info.file.response.data || {}
                        this.depositAttachmentFiles = this.depositAttachmentFiles.concat([{
                            file_url: fileData.url,
                            original_name: fileData.name || info.file.name,
                            size: info.file.size || 0,
                            suffix: (info.file.name || '').split('.').pop(),
                            add_time: Math.floor(Date.now() / 1000)
                        }])
                        this.saveDepositAttachmentList()
                    } else {
                        this.$message.error(info.file.response.msg || `${info.file.name} 上传失败`)
                    }
                } else if (info.file.status === 'error') {
                    this.depositAttachmentLoading = false
                    this.$message.error(`${info.file.name} 上传失败`)
                }
            },
            removeDepositAttachment(file) {
                this.depositAttachmentFiles = this.depositAttachmentFiles.filter(item => item.file_url !== file.file_url)
                this.saveDepositAttachmentList()
            },
            saveDepositAttachmentList() {
                if (!this.depositAttachmentRoomId) {
                    return
                }
                this.depositAttachmentLoading = true
                this.request(villageApi.saveDepositAttachmentList, {
                    vacancy_id: this.depositAttachmentRoomId,
                    files: this.depositAttachmentFiles
                }).then((res) => {
                    const group = res.group || {}
                    this.depositAttachmentGroup = {
                        ...this.depositAttachmentGroup,
                        ...group
                    }
                    this.depositAttachmentFiles = group.files || []
                    this.$emit('deposit-attachment-change', {
                        order_id: this.post.order_id,
                        has_deposit_attachment: this.depositAttachmentFiles.length > 0 ? 1 : 0
                    })
                    this.$message.success('押金附件已同步')
                }).finally(() => {
                    this.depositAttachmentLoading = false
                })
            },
            depositAttachmentFileKey(file, suffix) {
                return `${file.uid || file.file_url || file.name}_${suffix}`
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

    .order-info-tab-card /deep/ .ant-card-body {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        padding-left: 24px;
        overflow-x: auto;
    }

    .order-info-tab-card /deep/ .ant-card-body > div {
        display: inline-flex;
        align-items: center;
        flex-wrap: nowrap;
        white-space: nowrap;
    }

    .order-info-tab-card /deep/ .ant-btn {
        flex: 0 0 auto;
        margin-right: 30px;
    }

    .deposit-deduct-table /deep/ .ant-table-thead > tr > th,
    .deposit-deduct-table /deep/ .ant-table-tbody > tr > td {
        white-space: nowrap;
    }

    .deposit-attachment-box {
        padding-top: 16px;
    }

    .deposit-attachment-tip {
        margin-left: 12px;
        color: #999;
    }

    .deposit-attachment-list {
        margin-top: 12px;
        line-height: 28px;
    }

    .deposit-attachment-file {
        display: inline-block;
        margin-right: 8px;
        padding: 0 8px;
        background: #f5f5f5;
        border: 1px solid #e8e8e8;
        border-radius: 2px;
    }

    .deposit-attachment-delete {
        margin-right: 16px;
        color: #f5222d;
    }

    .deposit-attachment-empty {
        margin-top: 12px;
        color: #999;
    }
</style>
