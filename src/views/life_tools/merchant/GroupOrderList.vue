<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">

        <a-row>
            <h3><a>团体票订单</a></h3>
            <a-divider style="margin-top: 10px;" />
        </a-row>
        <a-row>
            <div style=" padding: 20px;">
                <a-row :gutter="16">
                    <a-col :span="6">
                        <a-card style="width: 310px;height:120px;">
                            <a-row>
                                <a-col :span="6">
                                    <img width="65" height="65"
                                        src="/v20/public/static/life_tools/images/group_all_order.png">
                                </a-col>
                                <a-col :span="15" style="padding-left: 20px;">
                                    <p style="color: #999999;font-size: 16px">团体票总订单</p>
                                    <p style="color: #000000;font-size: 25px;line-height: 15px;">{{total_order}}</p>
                                </a-col>
                                <a-col :span="3">
                                    <a-popover placement="top">
                                        <template slot="content">
                                            <p>已核销的订单总数量</p>
                                        </template>
                                        <a-icon type="info-circle" />
                                    </a-popover>
                                </a-col>
                            </a-row>
                        </a-card>
                    </a-col>
                    <a-col :span="6">
                        <a-card style="width: 310px;height:120px;" help="asfsad">
                            <a-row>
                                <a-col :span="6">
                                    <img width="65" height="65"
                                        src="/v20/public/static/life_tools/images/group_all_money.png">
                                </a-col>
                                <a-col :span="15" style="padding-left: 20px;">
                                    <p style="color: #999999;font-size: 16px">总收入</p>
                                    <p style="color: #000000;font-size: 25px;line-height: 15px;">{{total_order_money}}
                                    </p>
                                </a-col>
                                <a-col :span="3">
                                    <a-popover placement="top">
                                        <template slot="content">
                                            <p>已核销的订单总金额</p>
                                        </template>
                                        <a-icon type="info-circle" />
                                    </a-popover>
                                </a-col>
                            </a-row>
                        </a-card>
                    </a-col>
                    <a-col :span="6">
                        <a-card style="width: 310px;height:120px;">
                            <a-row>
                                <a-col :span="6">
                                    <img width="65" height="65"
                                        src="/v20/public/static/life_tools/images/group_unfinish_order.png">
                                </a-col>
                                <a-col :span="15" style="padding-left: 20px;">
                                    <p style="color: #999999;font-size: 16px">未完成的订单</p>
                                    <p style="color: #000000;font-size: 25px;line-height: 15px;">{{unfinish_order}}</p>
                                </a-col>
                                <a-col :span="3">
                                    <a-popover placement="top">
                                        <template slot="content">
                                            <p>已付款但未核销</p>
                                        </template>
                                        <a-icon type="info-circle" />
                                    </a-popover>
                                </a-col>
                            </a-row>
                        </a-card>
                    </a-col>
                    <a-col :span="6">
                        <a-card style="width: 310px;height:120px;">
                            <a-row>
                                <a-col :span="6">
                                    <img width="65" height="65"
                                        src="/v20/public/static/life_tools/images/group_unfinish_order_money.png">
                                </a-col>
                                <a-col :span="15" style="padding-left: 20px;">
                                    <p style="color: #999999;font-size: 16px">未完成的订单金额</p>
                                    <p style="color: #000000;font-size: 25px;line-height: 15px;">
                                        {{unfinish_order_money}}
                                    </p>
                                </a-col>
                                <a-col :span="3">

                                    <a-popover placement="top">
                                        <template slot="content">
                                            <p>已付款但未核销金额</p>
                                        </template>
                                        <a-icon type="info-circle" />
                                    </a-popover>
                                </a-col>
                            </a-row>
                        </a-card>
                    </a-col>
                </a-row>
            </div>
        </a-row>


        <a-row style="margin-top: 30px;">
            <a-col :span="5" style="line-height: 40px;">
                <a-input-group compact>
                    <a-select style="width: 100px;" v-model="queryParam.search_type">
                        <a-select-option value="0">名称</a-select-option>
                        <a-select-option value="1">手机号</a-select-option>
                        <a-select-option value="2">景区名称</a-select-option>
                        <a-select-option value="3">套餐名称</a-select-option>
                    </a-select>
                    <a-input placeholder="请输入搜索内容" v-model="queryParam.search"
                        style="width: 180px;margin-right: 20px;" />


                </a-input-group>

            </a-col>
            <a-col :span="3">

                状态：
                <a-select style="width: 100px;" v-model="queryParam.status">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">待核销</a-select-option>
                    <a-select-option value="2">已核销</a-select-option>
                    <a-select-option value="3">已退款</a-select-option>
                    <a-select-option value="4">已过期</a-select-option>
                </a-select>

            </a-col>

            <a-col :span="10">

                <a-input-group compact>
                    <span style="line-height: 30px;">预约日期范围：</span>
                    <a-range-picker @change="selectDate" />

                    <a-button type="primary" @click="onSearch()">搜索</a-button>

                </a-input-group>
            </a-col>
        </a-row>

        <a-row style="margin-top: 10px;">
            <a-table style="background: #ffffff" :columns="columns" rowKey="id" :data-source="dataList"
                @change="changePage" :pagination="pagination">


                <!-- 操作栏 -->
                <span slot="action" slot-scope="text,item">
                    <a class="inline-block" @click="detail(text)"  style="margin-right: 10px">{{ L('详情') }}</a>
                    <a v-if="item.is_refund_btn == 1" class="inline-block" @click="refund(text,item.has_refund_num)">{{ L('退款') }}</a>
                </span>

            </a-table>


        </a-row>

        <!-- 退款 -->
        <a-modal title="请输入退款景区门票数量" :width="300" :height="300" :visible="refund_visible" @cancel="closeWindow">
            <a-row>
                数量:
                <a-input-number width="100" v-model="refundParam.num" :min="1" :max="refund_max_num" />
            </a-row>
            <template slot="footer">
                <a-button type="primary" style="float: left;" @click="handleRefund">
                    确定退款
                </a-button>
                <a-button style="float: left;" @click="closeWindow">
                    取消
                </a-button>
            </template>
        </a-modal>

       <orderDetail v-if="currentBtn.props === 'orderDetail'" :visible="detailVisible" :title="currentBtn.title"
            @getDataList="getData" @handleCancel="detailVisible = false" :formData="currentBtn.data"></orderDetail>

    </div>
</template>

<script>
    import moment from 'moment';
    import lifeToolsMerchantApi from '@/api/life_tools/merchant'

    import orderDetail from '@/views/life_tools/merchant/modules/orderDetail'

    const columns = []

    function formatNumber(number) {
        return parseFloat(number).toLocaleString()
    }

    export default {
        components: {
            orderDetail
        },
        data() {
            return {
                total_order: 0, //总订单
                total_order_money: 0, //总收入
                unfinish_order: 0, //未完成的订单
                unfinish_order_money: 0, //未完成的订单金额
                queryParam: {
                    page: 1,
                    search_type: "0",
                    search: '',
                    status: "0",
                    page_size: 10,
                    start_date: null,
                    end_date: null
                },
                refundParam: {
                    num: 0,
                    order_id: 0
                },
                dataList: [],
                pagination: {
                    pageSize: 10,
                    total: 0,
                    current: 1,
                    page: 1
                },
                columns: [{
                        title: this.L('名称'),
                        dataIndex: 'nickname'
                    },
                    {
                        title: this.L('手机号'),
                        dataIndex: 'phone'
                    },
                    {
                        title: this.L('景区名称'),
                        dataIndex: 'title'
                    },
                    {
                        title: this.L('套餐名称'),
                        dataIndex: 'ticket_title'
                    },
                    {
                        title: this.L('数量'),
                        dataIndex: 'num'
                    },
                    {
                        title: this.L('团体票价'),
                        dataIndex: 'price'
                    },
                    {
                        title: this.L('预约时间'),
                        dataIndex: 'ticket_time'
                    },
                    {
                        title: this.L('核销人数'),
                        dataIndex: 'verify_num'
                    },
                    {
                        title: this.L('未核销人数'),
                        dataIndex: 'unverify_num'
                    },
                    {
                        title: this.L('状态'),
                        dataIndex: 'status_text'
                    },
                    {
                        title: this.L('操作'),
                        dataIndex: 'order_id',
                        key: 'order_id',
                        scopedSlots: {
                            customRender: 'action'
                        },
                    }
                ],
                refund_visible: false,
                refund_max_num: 0,
                detailVisible: false,
                currentBtn: {}
            }
        },
        created() {

            // this.getData()
            this.getStatistics()
        },
        mounted() {
            this.getData()
        },
        methods: {
            moment,
            getStatistics() {
                this.request(lifeToolsMerchantApi.getStatisticsData).then((res) => {
                    this.total_order = formatNumber(res.total_order);
                    this.total_order_money = formatNumber(res.total_order_money);
                    this.unfinish_order = formatNumber(res.unfinish_order);
                    this.unfinish_order_money = formatNumber(res.unfinish_order_money);
                })
            },
            getData() {
                this.queryParam.page_size = this.pagination.pageSize
                this.queryParam.page = this.pagination.current;
                this.request(lifeToolsMerchantApi.getOrderList, this.queryParam).then((res) => {
                    this.pagination.total = res.total
                    this.dataList = res.data

                });
            },
            onSearch() {
                this.getData();
            },
            selectDate(dates, dateStrings) {
                this.queryParam.start_date = dateStrings[0];
                this.queryParam.end_date = dateStrings[1];
            },
            // handleTableChange(e) {
            //     if (e.current && e.current > 0) {
            //         this.queryParam['page'] = e.current

            //     }
            // },
            // goGoodsList() {
            //     this.$router.push({
            //         path: '/merchant/merchant.card/goodsList'
            //     })
            // },
            // editGoodsSort(id) {
            //     this.$router.push({
            //         path: '/merchant/merchant.card/goodsSortEdit',
            //         query: {
            //             sort_id: id
            //         }
            //     })
            // },
            // delGoodsSort(id) {

            //     this.$confirm({
            //         title: '是否确定删除该类型?',
            //         centered: true,
            //         onOk: () => {

            //             this.request(cardMerchantApi.delGoodsSort, {
            //                 sort_id: id
            //             }).then((res) => {
            //                 this.$message.success('操作成功！')
            //                 this.getData()


            //             })
            //         },
            //         onCancel() {},
            //     })
            // },
            // //添加分类
            // addBtn() {
            //     this.$router.push('/merchant/merchant.card/goodsSortEdit');
            // },
            changePage(page, pageSize) {
                this.pagination.current = page.current;
                this.getData();
            },
            refund(order_id, num) {
                this.refund_max_num = num;
                this.refund_visible = true;
                this.refundParam.order_id = order_id;
                this.refundParam.num = num;
            },
            detail(order_id) {
                this.request(lifeToolsMerchantApi.getSportsOrderDetail, {
                    order_id: order_id
                }, 'GET').then((res) => {
                    this.currentBtn = {
                        'props': 'orderDetail',
                        'title': '订单详情',
                        'data': res
                    }
                    this.detailVisible = true
                })
            },
            closeWindow() {
                this.refund_visible = false;
            },
            handleRefund() {
                this.request(lifeToolsMerchantApi.groupOrderRefand, this.refundParam).then((res) => {
                    this.$message.success("操作成功！")
                    this.getData();
                    this.refund_visible = false;
                });
            }
        },
    }
</script>
<style type="text/css">
    .ant-card-body {
        /* padding: 20px; */
    }

    .ant-modal-footer {
        height: 52px;
    }
</style>
