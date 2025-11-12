<template>
    <div class="parking_space">
        <div class="header_search">
            <div class="search_item">
                <label class="label_title" style="width: 75px;">订单号：</label>
                <a-input placeholder="请输入车位号" v-model="search_data.order_no" />
            </div>
            <div class="search_item">
                <label class="label_title" style="width: 75px;">申请人：</label>
                <a-input placeholder="请输入申请人" v-model="search_data.nickname" />
            </div>
            <div class="search_item">
                <label class="label_title" style="width: 75px;">手机号：</label>
                <a-input placeholder="请输入车位号" v-model="search_data.phone" />
            </div>
            <div class="search_item">
                <label class="label_title" style="width: 75px;">车位号：</label>
                <a-input placeholder="请输入车位号" v-model="search_data.position_num" />
            </div>

            <div class="search_item" style="margin-left: 20px;">
                <label class="label_title">车库：</label>
                <a-select show-search placeholder="请选择" style="width: 200px" v-model="search_data.garage_id">
                    <a-select-option v-for="(item,index) in garageList" :value="item.garage_id">
                        {{item.garage_num}}
                    </a-select-option>
                </a-select>
            </div>

            <div class="search_item" style="margin-left: 20px;">
                <label class="label_title">状态：</label>
                <a-select show-search placeholder="请选择" style="width: 150px" v-model="search_data.status">
                    <a-select-option v-for="(item,index) in orderStatus" :value="item.k_status">
                        {{item.label}}
                    </a-select-option>
                </a-select>

                <a-button style="margin-left: 10px;" type="primary" @click="queryThis">查询</a-button>
                <a-button style="margin-left: 10px;" @click="clearThis">清空</a-button>
            </div>

            <div class="search_item">
                <a-button v-if="jz_wsxdsj_customized==1" type="primary" class="operation_btn"
                    @click="positionSet">租/抢车位协议
                </a-button>
                <a-button v-if="jz_wsxdsj_customized==1" type="primary" class="operation_btn"
                    @click="limitFuncSet">限时设置</a-button>

            </div>
        </div>
        <div class="table_content">
            <a-table :columns="columns" :row-key="record=>record.id" :pagination="pageInfo" :loading="tableLoadding"
                @change="handleTableChange" :data-source="positionOrder">
                <span slot="action" slot-scope="text, record">
                    <a @click="viewItemDetail(record)">查看</a>
                    <a-divider type="vertical" v-if="record.status*1==0" />
                    <a-popconfirm placement="topRight" v-if="record.status*1==0" ok-text="办理" cancel-text="关闭"
                        @confirm="statusConfirm(record,1)">
                        <template slot="title">
                            <p>{{ getTitleItem(record,1) }}</p>
                            <p style="margin-bottom: 30px;"></p>
                        </template>

                        <a>办理</a>
                    </a-popconfirm>
                    <a-divider type="vertical" v-if="record.status*1==0" />
                    <a-popconfirm placement="topRight" v-if="record.status*1==0" ok-text="取消申请" cancel-text="关闭"
                        @confirm="statusConfirm(record,3)">
                        <template slot="title">
                            <p>{{ getTitleItem(record,2) }}</p>
                            <p style="margin-bottom: 30px;"></p>
                        </template>
                        <a style="color: red;">取消申请</a>
                    </a-popconfirm>
                </span>
            </a-table>


            <a-modal title="时限设置" :width="750" :visible="limitFuncVisible" :maskClosable="false" @ok="handleLimitFuncOk"
                @cancel="handleLimitFuncCancel" :confirmLoading="confirmLoading">
                <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
                    <div class="add_black">
                        <a-form-model-item label="租赁车位时限设置">
                            <a-radio-group v-model="positionFunc.is_position_lease" @change="onLeaseChange">
                                <a-radio :value="0">关闭</a-radio>
                                <a-radio :value="1">开启</a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                    </div>
                </a-form-model>
                <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol"
                    v-if="positionFunc.is_position_lease*1==1">
                    <div class="add_black">
                        <a-form-model-item label="时限设置">
                            租赁车位 <a-input-number placeholder="请输入大于0的数字" :min="0" :max="10000" style="width: 160px;"
                                v-model="positionFunc.last_lease_day" /> 天后，未办理租赁流程，取消订单
                        </a-form-model-item>
                    </div>
                </a-form-model>

                <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
                    <div class="add_black">
                        <a-form-model-item label="抢购车位时限设置">
                            <a-radio-group v-model="positionFunc.is_position_robbuy" @change="onRobBuyChange">
                                <a-radio :value="0">关闭</a-radio>
                                <a-radio :value="1">开启</a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                    </div>
                </a-form-model>
                <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol"
                    v-if="positionFunc.is_position_robbuy*1==1">
                    <div class="add_black">
                        <a-form-model-item label="时限设置">
                            抢购车位 <a-input-number placeholder="请输入大于0的数字" :min="0" :max="10000" style="width: 160px;"
                                v-model="positionFunc.last_robbuy_day" /> 天后，未办理抢购流程，取消订单
                        </a-form-model-item>
                    </div>
                </a-form-model>

                <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
                    <div class="add_black">
                        <a-form-model-item label="抢购/租赁数量设置">
                            小区住户抢购/租赁选择最多车位数量 <a-input-number placeholder="请输入大于0的数字" :min="0" :max="10"
                                style="width: 160px;" v-model="positionFunc.opt_position_num" /> 个车位
                        </a-form-model-item>
                    </div>
                </a-form-model>

            </a-modal>

            <a-modal title="查看详细" :width="700" :visible="viewDetailVisible" @cancel="handleProtocolSetCancel"
                :footer="null">
                <div style="margin-bottom: 30px;">
                    <div class="item_detail">
                        <div class="ant-row">
                            <div class="ant-col ant-col-5 ant-form-item-label"><label title="车库名称" class="">车库名称 </label></div>
                            <div class="ant-col ant-col-18 ant-form-item-control-wrapper"><div class="ant-form-item-control">{{orderDetail.garage_num}}</div></div>
                        </div>
                    </div>  
                     
                     <div class="item_detail">
                         <div class="ant-row">
                             <div class="ant-col ant-col-5 ant-form-item-label"><label title="车位号" class="">车位号 </label></div>
                             <div class="ant-col ant-col-18 ant-form-item-control-wrapper"><div class="ant-form-item-control">{{orderDetail.position_num}}</div></div>
                         </div>
                     </div>
                     
                     <div class="item_detail">
                         <div class="ant-row">
                             <div class="ant-col ant-col-5 ant-form-item-label"><label title="车位面积" class="">车位面积 </label></div>
                             <div class="ant-col ant-col-18 ant-form-item-control-wrapper"><div class="ant-form-item-control">{{orderDetail.position_area}}</div></div>
                         </div>
                     </div>
                     
                     <div class="item_detail">
                         <div class="ant-row ">
                             <div class="ant-col ant-col-5 ant-form-item-label"><label title="备注" class="">备注 </label></div>
                             <div class="ant-col ant-col-18 ant-form-item-control-wrapper"><div class="ant-form-item-control">{{orderDetail.position_note}}</div></div>
                         </div>
                     </div>
                     
                     <div class="item_detail">
                         <div class="ant-row">
                             <div class="ant-col ant-col-5 ant-form-item-label"><label title="订单号" class="">订单号 </label></div>
                             <div class="ant-col ant-col-18 ant-form-item-control-wrapper"><div class="ant-form-item-control">{{orderDetail.order_no}}</div></div>
                         </div>
                     </div>
                     
                     <div class="item_detail">
                         <div class="ant-row">
                             <div class="ant-col ant-col-5 ant-form-item-label"><label title="申请人" class="">申请人 </label></div>
                             <div class="ant-col ant-col-18 ant-form-item-control-wrapper"><div class="ant-form-item-control">{{orderDetail.nickname}}</div></div>
                         </div>
                     </div>
                     
                     
                     <div class="item_detail">
                         <div class="ant-row">
                             <div class="ant-col ant-col-5 ant-form-item-label"><label title="手机号" class="">手机号 </label></div>
                             <div class="ant-col ant-col-18 ant-form-item-control-wrapper"><div class="ant-form-item-control">{{orderDetail.phone}}</div></div>
                         </div>
                     </div>
                     
                     <div class="item_detail">
                         <div class="ant-row">
                             <div class="ant-col ant-col-5 ant-form-item-label"><label title="申请时间" class="">申请时间 </label></div>
                             <div class="ant-col ant-col-18 ant-form-item-control-wrapper"><div class="ant-form-item-control">{{orderDetail.add_time_str}}</div></div>
                         </div>
                     </div>
                     
           <div class="item_detail">
               <div class="ant-row">
                   <div class="ant-col ant-col-5 ant-form-item-label"><label title="类型" class="">类型 </label></div>
                   <div class="ant-col ant-col-18 ant-form-item-control-wrapper"><div class="ant-form-item-control">{{orderDetail.xtype_str}}</div></div>
               </div>
           </div>  
                    
           <div class="item_detail">
               <div class="ant-row">
                   <div class="ant-col ant-col-5 ant-form-item-label"><label title="当前状态" class="">当前状态 </label></div>
                   <div class="ant-col ant-col-18 ant-form-item-control-wrapper"><div class="ant-form-item-control">{{orderDetail.status_str}}</div></div>
               </div>
           </div>
           
           <div class="item_detail" v-if="orderDetail.expire_time_str && orderDetail.status<1">
               <div class="ant-row">
                   <div class="ant-col ant-col-5 ant-form-item-label"><label title="失效时间" class="">失效时间 </label></div>
                   <div class="ant-col ant-col-18 ant-form-item-control-wrapper"><div class="ant-form-item-control">订单将于 <span style="color:red;">{{orderDetail.expire_time_str}}</span> 后自动失效</div></div>
               </div>
           </div>
           
      <div class="item_detail">
          <div class="ant-row">
              <div class="ant-col ant-col-5 ant-form-item-label"><label title="操作时间" class="">操作时间 </label></div>
              <div class="ant-col ant-col-18 ant-form-item-control-wrapper"><div class="ant-form-item-control">{{orderDetail.opt_time_str}}</div></div>
          </div>
      </div>        
             </div>
            </a-modal>
            
            <a-modal title="租/抢车位协议" :width="1100" :visible="protocolSetVisible" @cancel="handleProtocolSetCancel"
                :footer="null">
                <iframe v-if="protocolSetVisible" :src="protocolSetUrl" width="100%" height="700px"
                    style="border: none;"></iframe>
            </a-modal>

        </div>
    </div>
</template>

<script>
    import villageApi from '@/api/community/village';
    const columns = [{
            title: '订单号',
            dataIndex: 'order_no',
            key: 'order_no',
            width:220
        },
        {
            title: '申请人',
            dataIndex: 'nickname',
            key: 'nickname',
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '申请时间',
            dataIndex: 'add_time_str',
            key: 'add_time_str',
            width:200
        },
        {
            title: '类型',
            dataIndex: 'xtype_str',
            key: 'xtype_str',
        },
        {
            title: '车库',
            dataIndex: 'garage_num',
            key: 'garage_num',
        },
        {
            title: '车位',
            dataIndex: 'position_num',
            key: 'position_num',
        },
        {
            title: '状态',
            dataIndex: 'status_str',
            key: 'status_str',
        },
        {
            title: '操作时间',
            dataIndex: 'opt_time_str',
            key: 'opt_time_str',
            width:200
        },
        {
            title: '操作',
            key: 'action',
            scopedSlots: {
                customRender: 'action'
            },
        },
    ];

    export default {
        name: 'robLeasePosition',
        data() {
            return {
                labelCol: {
                    span: 5
                },
                wrapperCol: {
                    span: 18
                },

                search_data: {
                    order_no: '',
                    nickname: '',
                    phone: '',
                    position_num: '',
                    garage_id: 0,
                    status: 0
                },
                pageInfo: {
                    current: 1,
                    pageSize: 10,
                    total: 10,
                    page: 1,
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onChange: (page, pageSize) => this.onTableChange(page, pageSize) //点击页码事件
                },
                columns,
                tableLoadding: false,
                garageList: [],
                positionOrder: [],
                orderStatus: [{
                    k_status: 0,
                    label: '请选择'
                }, {
                    k_status: 1,
                    label: '未办理'
                }, {
                    k_status: 2,
                    label: '已办理'
                }, {
                    k_status: 3,
                    label: '已失效'
                }, {
                    k_status: 4,
                    label: '取消申请'
                }],
                jz_wsxdsj_customized: 0,
                limitFuncVisible: false,
                positionFunc: {
                    is_position_lease: 0,
                    is_position_robbuy: 0,
                    opt_position_num: 1,
                    last_robbuy_day: 1,
                    last_lease_day: 1
                },
                confirmLoading: false,
                protocolSetVisible: false,
                protocolSetUrl: '',
                viewDetailVisible: false,
                orderDetail:{},
            }
        },

        components: {

        },

        mounted() {
            this.getRobleasePositionOrderList()
            this.getGarageList()
        },

        methods: {
            getRobleasePositionOrderList() {
                this.tableLoadding = true
                this.search_data.page = this.pageInfo.page
                this.request(villageApi.getRobleasePositionOrderList, this.search_data).then((res) => {
                    this.positionOrder = res.list
                    this.pageInfo.total = res.count
                    this.pageInfo.pageSize = res.page_size
                    this.tableLoadding = false
                    this.jz_wsxdsj_customized = 0;
                    this.protocolSetUrl = res.protocolSetUrl
                    if (res.jz_wsxdsj_customized != undefined) {
                        this.jz_wsxdsj_customized = res.jz_wsxdsj_customized;
                    }
                    if (res.position_set != undefined && res.position_set) {
                        this.positionFunc = res.position_set
                    }
                    if (res.orderStatus != undefined && res.orderStatus) {
                        this.orderStatus = res.orderStatus
                    }
                }).catch(e => {
                    this.tableLoadding = false;
                })
            },
            viewItemDetail(record){
                
                let postObjData={id:record.id,order_no:record.order_no};
                this.request(villageApi.getRobleasePositionOrderDetail, postObjData).then((res) => {
                    this.orderDetail={};
                    if(res){
                        this.orderDetail=res;
                    }
                    this.viewDetailVisible=true;
                 }).catch(e => {
                    this.tableLoadding = false;
                });
                this.viewDetailVisible=true;
            },
            getTitleItem(record, type) {
                let xtitle = '请确认操作！';
                if (type == 1) {
                    xtitle = '请确认是否已办理了车位' + record.xtype_str + '流程?';
                } else if (type == 2) {
                    xtitle = '请确认是否要取消此' + record.xtype_str + '车位申请?';
                }
                return xtitle;
            },
            statusConfirm(record, opt_type) {
                let postObjData={id:record.id,order_no:record.order_no,opt_type:opt_type};
                this.request(villageApi.handlePositionOrderStatus, postObjData).then((res) => {
                    this.$message.success('操作成功！')
                    this.getRobleasePositionOrderList()
                })
            },
            positionSet() {
                this.protocolSetVisible = true;
            },
            handleProtocolSetCancel() {
                this.protocolSetVisible = false;
                this.viewDetailVisible= false;
                this.limitFuncVisible = false;
            },
            limitFuncSet() {
                this.limitFuncVisible = true;
            },
            handleLimitFuncCancel() {
                this.limitFuncVisible = false;
                this.viewDetailVisible= false;
                this.protocolSetVisible = false;
            },
            handleLimitFuncOk() {
                if (this.positionFunc.is_position_lease * 1 > 0 && this.positionFunc.last_lease_day * 1 < 1) {
                    this.$message.warn('租赁车位时限设置的租赁车位天数必须大于0！')
                    return false;
                }
                if (this.positionFunc.is_position_robbuy * 1 > 0 && this.positionFunc.last_robbuy_day * 1 < 1) {
                    this.$message.warn('抢购车位时限设置的抢购车位天数必须大于0！')
                    return false;
                }
                if (this.positionFunc.opt_position_num * 1 < 1 || this.positionFunc.opt_position_num * 1 > 10) {
                    this.$message.warn('抢购/租赁数量设置，请设置一个包括1到10在内的数')
                    return false;
                }
                this.confirmLoading = true;
                this.positionFunc.xtype = 'limit';
                this.request(villageApi.parkingPositionSet, this.positionFunc).then((res) => {
                    this.$message.success('设置成功！')
                    this.getRobleasePositionOrderList();
                    this.handleLimitFuncCancel();
                    this.confirmLoading = false;
                }).catch(e => {
                    this.confirmLoading = false;
                })
            },
            onLeaseChange(e) {

            },
            onRobBuyChange(e) {

            },
            queryThis() {
                if (this.frequency) {
                    this.$message.warn('请求频繁，请稍后再试')
                    return
                }
                this.frequency = true
                let timeout = setTimeout(() => {
                    this.frequency = false
                    clearTimeout(timeout)
                }, 2000)
                this.pageInfo.page = 1
                this.getRobleasePositionOrderList()
            },
            clearThis() {
                this.pageInfo.page = 1;
                this.pageInfo.current = 1;
                this.pageInfo.total = 0;
                this.limitFuncVisible = false;
                this.protocolSetVisible = false;
                this.viewDetailVisible= false;
                this.getRobleasePositionOrderList()
            },
            handleTableChange(pagenation, filters, sorter) {
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getRobleasePositionOrderList()
            },
            onTableChange(page, pageSize) {
                this.pageInfo.current = page
                this.pageInfo.page = page
                this.getRobleasePositionOrderList()
            },
            getGarageList() {
                let that = this
                that.request(villageApi.getGarageList, {
                    type: 1
                }).then((res) => {
                    that.garageList = res.list
                })
            },

        },
    }
</script>

<style lang="less" scoped>
    .parking_space {
        width: 98%;
        background-color: #ffffff;
        margin: 10px;

        .header_search {
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;

            .search_item {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                margin: 10px 20px;
            }

            .operation_btn {
                margin-left: 20px;
            }
        }

        .table_content {
            padding: 0 20px;
            margin: 10px 0;
        }
    }
</style>