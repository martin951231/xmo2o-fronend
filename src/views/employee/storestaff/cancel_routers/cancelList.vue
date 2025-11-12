<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">

        <a-row style="margin-top: 40px;" :gutter="24" type="flex" >
            <a-col :xl="4" style="border:1px solid #f0f0f0" class="card-item" :offset="1">
                <chart-card title="核销总收入" :total="total_price">
                    <div>
                        <mini-area :data="price_list" />
                    </div>
                    <template slot="footer">
                        <span slot="term">今日收入： {{today_price}}</span>
                    </template>
                </chart-card>
            </a-col>

            <a-col  :xl="4" style="border:1px solid #f0f0f0" class="card-item" :offset="1">
                <chart-card title="核销总补贴" :total="total_grant">
                    <div>
                        <mini-area :data="grant_list" />
                    </div>
                    <template slot="footer">
                        <span slot="term">今日补贴： {{today_grant}}</span>
                    </template>
                </chart-card>
            </a-col>
            <a-col  :xl="4" style="border:1px solid #f0f0f0" class="card-item" :offset="1">
                <chart-card title="员工余额消费" :total="total_money">
                    <div>
                        <mini-area :data="money_list" />
                    </div>
                    <template slot="footer">
                        <span slot="term">今日余额消费： {{today_money}}</span>
                    </template>
                </chart-card>
            </a-col>
            <a-col  :xl="4" style="border:1px solid #f0f0f0" class="card-item" :offset="1">
                <chart-card title="员工积分消费" :total="total_score">
                    <div>
                        <mini-area :data="score_list" />
                    </div>
                    <template slot="footer">
                        <span slot="term">今日积分消费 ： {{today_score}}</span>
                    </template>
                </chart-card>
            </a-col>

        </a-row>
        <a-row style="margin-top:40px;">
            <a-col :span="24">

                <a-input-group compact>
                    <label style="line-height: 30px;margin-left: 15px;">搜索：</label>
                    <a-select :value="queryParams.search_by" @change="selectSearchBy" style="width: 100px;">
                        <a-select-option v-for="(item, index) in searchBy" :key="item.key">
                            {{ item.value }}
                        </a-select-option>
                    </a-select>
                    <a-input style="width: 220px" :placeholder="'请输入'+searchByMap[queryParams.search_by]"
                        :value="queryParams.keywords" @change="keywordsChange" />

                    <label style="line-height: 30px;margin-left: 15px;">选择日期：</label>
                    <a-range-picker @change="selectDate" />
                    <a-button type="primary" @click="searchBtn" style="width: 80px;margin-left: 10px;">搜索</a-button>

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
                            <span>{{ item.type == 'coupon' ? item.num : '' }}</span>
                        </span>

                        <!-- 核销积分 -->
                        <span slot="score" slot-scope="text,item">
                            <span>{{ item.type == 'score' ? item.num : '' }}</span>
                        </span>
                        
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
    import {
        ChartCard,
        MiniArea,
        MiniBar,
        RankList,
        Bar,
        Trend,
        NumberInfo,
        MiniSmoothArea
    } from '@/components'
    export default {
        components: {
            ChartCard,
            MiniArea,
            MiniBar,
            RankList,
            Bar,
            Trend,
            NumberInfo,
            MiniSmoothArea
        },
        data() {
            return {
                total_price: 0,
                today_price: 0,
                total_grant: 0,
                today_grant: 0,
                total_money: 0,
                today_money: 0,
                total_score: 0,
                today_score: 0,
                price_list: [],
                grant_list: [],
                money_list: [],
                score_list: [],
                queryParams: {
                    search_by: 2,
                    keywords: '',
                    start_date: '',
                    end_date: '',
                    type: 'coupon'
                },
                refundParams: {
                    refund_remark: '',  
                    pigcms_id: 0
                },
                refund_visible: false,
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
                    }
                ],
                searchByMap: {
                    '2': '员工姓名',
                    '3': '员工电话',
                    '4': '消费券名称'
                },
                typeList: [{
                        title: '消费券核销',
                        key: 'coupon'
                    },
                    {
                        title: '余额消费',
                        key: 'money'
                    },
                    {
                        title: '积分消费',
                        key: 'score'
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
                        title: this.L('店员名称'),
                        dataIndex: 'staff.name'
                    },
                    {
                        title: this.L('消费券名称'),
                        dataIndex: 'coupon_name'
                    },
                    {
                        title: this.L('补助'),
                        dataIndex: 'grant_price'
                    },
                    {
                        title: this.L('个人消费'),
                        dataIndex: 'num'
                    },
                    {
                        title: this.L('总计消费'),
                        dataIndex: 'coupon_price'
                    },
                    {
                        title: this.L('核销时间'),
                        dataIndex: 'create_time'
                    },
                    {
                        title: this.L('操作'),
                        dataIndex: 'pigcms_id',
                        scopedSlots: { customRender: 'action' },
                    }
                ]
            }
        },
        created() {
            this.getData()
            this.getStatistics()
        },
        methods: {
            keywordsChange(e) {
                this.queryParams.keywords = e.target.value
            },
            getData() {
                this.refund_visible = false;
                
                this.queryParams.pageSize = this.pagination.pageSize
                this.queryParams.page = this.pagination.current
                this.request(lifeMerchantApi.cardLogStorestaffList, this.queryParams).then((res) => {
                    this.pagination.total = res.total
                    this.dataList = res.data
                })
            },
            getStatistics(){
                this.request(lifeMerchantApi.getStaffDataStatistics, this.queryParams).then((res) => {
                   this.total_price = res.total_price;
                   this.today_price = res.today_price;
                   this.price_list = res.price_list;
                   
                   this.total_grant = res.total_grant;
                   this.today_grant = res.today_grant;
                   this.grant_list = res.grant_list;
                   
                   this.total_money = res.total_money;
                   this.today_money = res.today_money;
                   this.money_list = res.money_list;
                   
                   this.total_score = res.total_score;
                   this.today_score = res.today_score;
                   this.score_list = res.score_list;
                })
            },
            changePage(page, pageSize) {
                this.pagination.current = page.current
                this.getData()
            },
            selectDate(value, dateString) {
                this.queryParams.start_date = dateString[0]
                this.queryParams.end_date = dateString[1]
            },
            searchBtn() {
                this.getData()
            },
            selectSearchBy(val) {
                this.queryParams.search_by = val
            },
            refund(id) {
                this.refund_visible = true;
                this.refundParams.pigcms_id = id;
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
                
                this.request(lifeMerchantApi.staffRefundMoney, this.refundParams).then((res) => {
                     this.refundParams.refund_remark = '';
                     this.refundParams.pigcms_id = 0;
                     this.$message.success('操作成功');
                     this.getData();
                });
                
                this.refund_visible = false;
            },
            refundRemark(e){
                this.refundParams.refund_remark = e.target.value
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
                        }
                    ]
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
                            title: this.L('店员名称'),
                            dataIndex: 'staff.name'
                        },
                        {
                            title: this.L('消费券名称'),
                            dataIndex: 'coupon_name'
                        },

                        {
                            title: this.L('补助'),
                            dataIndex: 'grant_price'
                        },
                        {
                            title: this.L('个人消费'),
                            dataIndex: 'num'
                        },
                        {
                            title: this.L('总计消费'),
                            dataIndex: 'coupon_price'
                        },
                        {
                            title: this.L('核销时间'),
                            dataIndex: 'create_time'
                        },
                        {
                            title: this.L('操作'),
                            dataIndex: 'pigcms_id',
                            scopedSlots: { customRender: 'action' },
                        }
                    ]
                } else {
                    if (this.queryParams.search_by == 4) {
                        this.queryParams.search_by = 2
                    }
                    this.searchBy = [{
                            key: 2,
                            value: '员工姓名'
                        },
                        {
                            key: 3,
                            value: '员工电话'
                        }

                    ]
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
                            title: this.L('店员名称'),
                            dataIndex: 'staff.name'
                        },
                        {
                            title: this.L('个人消费'),
                            dataIndex: 'num'
                        },
                        {
                            title: this.L('核销时间'),
                            dataIndex: 'create_time'
                        },
                        {
                            title: this.L('备注'),
                            dataIndex: 'remark'
                        },
                        {
                            title: this.L('操作'),
                            dataIndex: 'pigcms_id',
                            scopedSlots: { customRender: 'action' },
                        }
                    ]
                }
                this.queryParams.type = val
                this.getData()
            }
        }
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
