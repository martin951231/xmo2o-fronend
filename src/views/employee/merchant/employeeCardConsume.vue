<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-row>
            <div class="card_tab">
                <router-link to='/merchant/merchant.life_tools/employee_card'>
                    <span>商家员工卡列表</span>
                </router-link>
            </div>
            <div class="card_tab">
                <span class="on">核销列表</span>
            </div>
            <div class="card_tab">
                <router-link to='/merchant/merchant.life_tools/employeeCardRechargeList'>
                    <span>充值记录</span>
                </router-link>
            </div>
            <div class="card_tab">
                <router-link to='/merchant/merchant.life_tools/employeeBillList'>
                    <span>财务报表</span>
                </router-link>
            </div>
            <div class="card_tab">
                <router-link to='/merchant/merchant.life_tools/employeeClearScoreList'>
                    <span>积分清零记录</span>
                </router-link>
            </div>
        </a-row>

        <a-row style="margin-top:10px;">
            <a-col :span="24">

                <a-input-group compact>

                    <a-select :value="queryParams.search_by" @change="selectSearchBy" style="width: 100px;">
                        <a-select-option v-for="(item,index) in searchBy" :key="item.key">
                            {{item.value}}
                        </a-select-option>
                    </a-select>
                    <a-input style="width: 220px" :placeholder="'请输入'+searchByMap[queryParams.search_by]"
                        :value="queryParams.keywords" @change="keywordsChange" />

                    <label style="line-height: 30px;margin-left: 15px;">选择日期：</label>
                    <a-range-picker @change="selectDate" />

                    <label v-if="queryParams.type == 'coupon'"
                        style="line-height: 30px;margin-left: 15px;">核销类型：</label>
                    <a-select v-if="queryParams.type == 'coupon'" :value="queryParams.verify_type"
                        @change="verifyTypeChange" style="width: 100px;">
                        <a-select-option v-for="(item,index) in verifyType" :key="item.key">
                            {{item.value}}
                        </a-select-option>
                    </a-select>

                    <a-button type="primary" @click="searchBtn" style="width: 80px;margin-left: 10px;">搜索</a-button>

                    <a-button type="primary" icon="download" @click="exportTable(exportUrl, queryParams)"
                        style="width: 80px;margin-left: 10px;float: right;">导出</a-button>

                </a-input-group>
            </a-col>
        </a-row>

        <a-row style="margin-top:15px;">

            <a-tabs :active-key="queryParams.type" @change="changeTabs">


                <a-tab-pane v-for="pane in typeList" :key="pane.key" :tab="pane.title">
                    <a-table style="background: #ffffff" :columns="columns" rowKey="pigcms_id" :data-source="dataList"
                        @change="changePage" :pagination="pagination">

                        <!-- 核销金额 -->
                        <span slot="num" slot-scope="text,item">
                            <span>{{item.type == 'coupon' ? item.num : ''}}</span>
                        </span>

                        <!-- 核销积分 -->
                        <span slot="score" slot-scope="text,item">
                            <span>{{item.type == 'score' ? item.num : ''}}</span>
                        </span>

                        <!-- 状态 -->
                        <span slot="type" slot-scope="text,item">
                            <span v-if="item.type == 'overdue'">自动转积分<span v-if="item.is_refund == 1" style="color: red">（已退款）</span></span>
                            <span v-else-if="item.type == 'score'">积分消费<span v-if="item.is_refund == 1" style="color: red">（已退款）</span></span>
                            <span v-else-if="item.type == 'to_score'">手动转积分<span v-if="item.is_refund == 1" style="color: red">（已退款）</span></span>
                            <span v-else-if="item.type == 'money'">余额消费<span v-if="item.is_refund == 1" style="color: red">（已退款）</span></span>
                            <span v-else>食堂消费券<span v-if="item.is_refund == 1" style="color: red">（已退款）</span></span>
                        </span>

                        <!-- 操作 -->
                        <span slot="action" slot-scope="text,item">
                            <a class="inline-block" @click="refund(item.pigcms_id)" v-if="item.is_refund == 0">{{ L('退款') }}</a>
                            <template v-else>
                                <a-popover title="退款原因" placement="topLeft">
                                    <template slot="content">
                                        <p>{{item.refund_remark}}</p>
                                    </template>
                                    <a class="inline-block">{{ L('退款原因') }}</a>
                                </a-popover>
                            </template>

                        </span>

                    </a-table>
                </a-tab-pane>

            </a-tabs>


        </a-row>

        <a-modal v-model="refund_visible" title="退款" @ok="handleRefund">
            <a-textarea :value="refundParams.refund_remark" @change="refundRemark" placeholder="请输入退款备注" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-modal>
    </div>
</template>

<script>
    import lifeMerchantApi from '@/api/employee/merchant/index'
    export default {
        data() {
            return {
                exportUrl: lifeMerchantApi.cardLogExport,
                queryParams: {
                    search_by: 2,
                    keywords: '',
                    start_date: '',
                    end_date: '',
                    type: 'coupon',
                    verify_type: 1
                },
                refundParams: {
                    refund_remark: '',  
                    pigcms_id: 0
                },
                searchBy: [{
                        key: 2,
                        value: '员工姓名'
                    },
                    {
                        key: 3,
                        value: '员工电话'
                    },
                    {
                        key: 4,
                        value: '消费券名称'
                    },
                    {
                        key: 5,
                        value: '会员身份'
                    },
                    {
                        key: 6,
                        value: '会员部门'
                    }
                ],
                verifyType: [{
                        key: 0,
                        value: '全部'
                    },
                    {
                        key: 1,
                        value: '正常核销'
                    },
                    {
                        key: 2,
                        value: '自动转积分'
                    },
                    {
                        key: 3,
                        value: '手动转积分'
                    }
                ],
                searchByMap: {
                    "2": "员工姓名",
                    "3": "员工电话",
                    "4": "消费券名称",
                    "5": "会员身份",
                    "6": "会员部门"
                },
                typeList: [{
                        title: '消费券',
                        key: 'coupon'
                    },
                    {
                        title: '余额',
                        key: 'money'
                    },
                    {
                        title: '积分',
                        key: 'score'
                    },
                    {
                        title: '未核销',
                        key: 'overdue'
                    }
                ],
                dataList: [],
                pagination: {
                    pageSize: 10,
                    total: 0,
                    current: 1,
                    page: 1
                },
                columns: [{
                        title: this.L('会员名称'),
                        dataIndex: 'card_user.name'
                    },
                    {
                        title: this.L('会员卡号'),
                        dataIndex: 'card_user.card_number'
                    },
                    {
                        title: this.L('会员身份'),
                        dataIndex: 'card_user.identity'
                    },
                    {
                        title: this.L('会员部门'),
                        dataIndex: 'card_user.department'
                    },
                    {
                        title: this.L('会员手机号'),
                        dataIndex: 'user.phone'
                    },
                    {
                        title: this.L('店铺名称'),
                        dataIndex: 'store.name'
                    },
                    {
                        title: this.L('消费券名称'),
                        dataIndex: 'coupon_name'
                    },
                    {
                        title: this.L('补助'),
                        dataIndex: 'grant_price',
                    },
                    {
                        title: this.L('个人消费'),
                        dataIndex: 'num',
                    },
                    {
                        title: this.L('总计消费'),
                        dataIndex: 'coupon_price',
                    },
                    {
                        title: this.L('状态'),
                        dataIndex: 'type',
                        key: 'type',
                        scopedSlots: {
                            customRender: 'type'
                        },
                    },
                    {
                        title: this.L('转积分'),
                        dataIndex: 'add_score_num',
                    },
                    {
                        title: this.L('转积分扣除余额'),
                        dataIndex: 'deduct_money',
                    },
                    {
                        title: this.L('核销时间'),
                        dataIndex: 'create_time'
                    },
                    {
                        title: this.L('操作'),
                        dataIndex: 'sort_id',
                        key: 'sort_id',
                        scopedSlots: {
                            customRender: 'action'
                        },
                    }
                ],
                refund_visible: false
            }
        },
        created() {
            this.getData()
        },
        methods: {
            keywordsChange(e) {
                this.queryParams.keywords = e.target.value
            },
            getData() {
                this.refund_visible = false;
                
                this.queryParams.pageSize = this.pagination.pageSize
                this.queryParams.page = this.pagination.current;
                this.request(lifeMerchantApi.cardLogList, this.queryParams).then((res) => {
                    this.pagination.total = res.total
                    this.dataList = res.data

                });
            },
            changePage(page, pageSize) {
                this.pagination.current = page.current;
                this.getData();
            },
            selectDate(value, dateString) {
                this.queryParams.start_date = dateString[0];
                this.queryParams.end_date = dateString[1];
            },
            searchBtn() {
                this.getData();
            },
            selectSearchBy(val) {
                this.queryParams.search_by = val
            },
            verifyTypeChange(val) {
                this.queryParams.verify_type = val
            },
            changeTabs(val) {
                if (val == 'coupon') {
                    this.searchBy = [{
                            key: 2,
                            value: '员工姓名'
                        },
                        {
                            key: 3,
                            value: '员工电话'
                        },
                        {
                            key: 4,
                            value: '消费券名称'
                        },
                        {
                            key: 5,
                            value: '会员身份'
                        },
                        {
                            key: 6,
                            value: '会员部门'
                        },
                    ];
                    this.columns = [{
                            title: this.L('会员名称'),
                            dataIndex: 'card_user.name'
                        },
                        {
                            title: this.L('会员卡号'),
                            dataIndex: 'card_user.card_number'
                        },
                        {
                            title: this.L('会员身份'),
                            dataIndex: 'card_user.identity'
                        },
                        {
                            title: this.L('会员部门'),
                            dataIndex: 'card_user.department'
                        },
                        {
                            title: this.L('会员手机号'),
                            dataIndex: 'user.phone'
                        },
                        {
                            title: this.L('店铺名称'),
                            dataIndex: 'store.name'
                        },
                        {
                            title: this.L('消费券名称'),
                            dataIndex: 'coupon_name'
                        },
                        {
                            title: this.L('补助'),
                            dataIndex: 'grant_price',
                        },
                        {
                            title: this.L('个人消费'),
                            dataIndex: 'num',
                        },
                        {
                            title: this.L('总计消费'),
                            dataIndex: 'coupon_price',
                        },
                        {
                            title: this.L('状态'),
                            dataIndex: 'type',
                            key: 'type',
                            scopedSlots: {
                                customRender: 'type'
                            },
                        },
                        {
                            title: this.L('转积分'),
                            dataIndex: 'add_score_num',
                        },
                        {
                            title: this.L('转积分扣除余额'),
                            dataIndex: 'deduct_money',
                        },
                        {
                            title: this.L('核销时间'),
                            dataIndex: 'create_time'
                        },
                        {
                            title: this.L('操作'),
                            dataIndex: 'sort_id',
                            key: 'sort_id',
                            scopedSlots: {
                                customRender: 'action'
                            },
                        }
                    ];
                } else if (val == 'overdue') {
                    this.searchBy = [{
                            key: 2,
                            value: '员工姓名'
                        },
                        {
                            key: 3,
                            value: '员工电话'
                        },
                        {
                            key: 4,
                            value: '消费券名称'
                        },
                        {
                            key: 5,
                            value: '会员身份'
                        },
                        {
                            key: 6,
                            value: '会员部门'
                        }
                    ];
                    this.columns = [{
                            title: this.L('会员名称'),
                            dataIndex: 'card_user.name'
                        },
                        {
                            title: this.L('会员卡号'),
                            dataIndex: 'card_user.card_number'
                        },
                        {
                            title: this.L('会员身份'),
                            dataIndex: 'card_user.identity'
                        },
                        {
                            title: this.L('会员部门'),
                            dataIndex: 'card_user.department'
                        },
                        {
                            title: this.L('会员手机号'),
                            dataIndex: 'user.phone'
                        },
                        {
                            title: this.L('过期时间'),
                            dataIndex: 'create_time'
                        },
                        {
                            title: this.L('消费券名称'),
                            dataIndex: 'coupon_name'
                        },
                        {
                            title: this.L('未核销原因'),
                            dataIndex: 'description'
                        }

                    ];

                } else if(val == 'money'){
                    if (this.queryParams.search_by == 4) {
                        this.queryParams.search_by = 2;
                    }
                    this.searchBy = [{
                            key: 2,
                            value: '员工姓名'
                        },
                        {
                            key: 3,
                            value: '员工电话'
                        },
                        {
                            key: 5,
                            value: '会员身份'
                        },
                        {
                            key: 6,
                            value: '会员部门'
                        }
                    ];
                    this.columns = [{
                            title: this.L('会员名称'),
                            dataIndex: 'card_user.name'
                        },
                        {
                            title: this.L('会员卡号'),
                            dataIndex: 'card_user.card_number'
                        },
                        {
                            title: this.L('会员身份'),
                            dataIndex: 'card_user.identity'
                        },
                        {
                            title: this.L('会员部门'),
                            dataIndex: 'card_user.department'
                        },
                        {
                            title: this.L('会员手机号'),
                            dataIndex: 'user.phone'
                        },
                        {
                            title: this.L('店铺名称'),
                            dataIndex: 'store.name'
                        },
                        {
                            title: this.L('消费金额'),
                            dataIndex: 'num',
                        },
                        {
                            title: this.L('核销时间'),
                            dataIndex: 'create_time'
                        },
                        {
                            title: this.L('状态'),
                            dataIndex: 'type',
                            key: 'type',
                            scopedSlots: {
                                customRender: 'type'
                            },
                        },
                        {
                            title: this.L('备注'),
                            dataIndex: 'remark'
                        },
                        {
                            title: this.L('操作'),
                            dataIndex: 'sort_id',
                            key: 'sort_id',
                            scopedSlots: {
                                customRender: 'action'
                            },
                        }
                    ];
                    
                    
                    
                }else {
                    if (this.queryParams.search_by == 4) {
                        this.queryParams.search_by = 2;
                    }
                    this.searchBy = [{
                            key: 2,
                            value: '员工姓名'
                        },
                        {
                            key: 3,
                            value: '员工电话'
                        },
                        {
                            key: 5,
                            value: '会员身份'
                        },
                        {
                            key: 6,
                            value: '会员部门'
                        }
                    ];
                    this.columns = [{
                            title: this.L('会员名称'),
                            dataIndex: 'card_user.name'
                        },
                        {
                            title: this.L('会员卡号'),
                            dataIndex: 'card_user.card_number'
                        },
                        {
                            title: this.L('会员身份'),
                            dataIndex: 'card_user.identity'
                        },
                        {
                            title: this.L('会员部门'),
                            dataIndex: 'card_user.department'
                        },
                        {
                            title: this.L('会员手机号'),
                            dataIndex: 'user.phone'
                        },
                        {
                            title: this.L('店铺名称'),
                            dataIndex: 'store.name'
                        },
                        {
                            title: this.L('消费积分'),
                            dataIndex: 'num',
                        },
                        {
                            title: this.L('核销时间'),
                            dataIndex: 'create_time'
                        },
                        {
                            title: this.L('状态'),
                            dataIndex: 'type',
                            key: 'type',
                            scopedSlots: {
                                customRender: 'type'
                            },
                        },
                        {
                            title: this.L('备注'),
                            dataIndex: 'remark'
                        },
                        {
                            title: this.L('操作'),
                            dataIndex: 'sort_id',
                            key: 'sort_id',
                            scopedSlots: {
                                customRender: 'action'
                            },
                        }
                    ];
                }
                this.queryParams.type = val
                this.getData();
            },
            refund(id) {
                this.refund_visible = true;
                this.refundParams.pigcms_id = id;
            },
            refundRemark(e){
                this.refundParams.refund_remark = e.target.value
            },
            handleRefund(){
                if(this.refundParams.refund_remark == ''){
                    this.$message.error('请输入退款备注');
                    return false;
                }
                if(this.refundParams.pigcms_id == ''){
                    this.$message.error('退款id不存在');
                    return false;
                }
                
                this.request(lifeMerchantApi.employeeCouponRefund, this.refundParams).then((res) => {
                     this.refundParams.refund_remark = '';
                     this.refundParams.pigcms_id = 0;
                     this.$message.success('操作成功');
                     this.getData();
                });
                
                this.refund_visible = false;
            },
            exportTable(exportUrl, exportParams){
                this.request(exportUrl, exportParams).then((res)=>{
                    let url = res.file_url;
                    if(url){
                        window.open(url)
                    }
                })
            }

        },
    }
</script>

<style>
    .card_tab {
        text-align: center;
        width: 140px;
        float: left;
        margin: 0 0 20px 0;
    }

    .card_tab span {
        color: #000000;
        font-size: 15px;
        padding: 7px 10px;
    }

    .card_tab span.on {
        color: #1890ff;
        border-bottom: 2px solid #1890ffcc;
    }
</style>
