<template>
    <div class="vehicle_management">
        <div class="table_content">
            <a-tabs default-active-key="village" @change="callback">
                <a-tab-pane key="village" tab="缴费率">
                    <a-tabs type="card" @change="callbackVillage">
                        <a-tab-pane key="village" tab="小区排名">
                            <a-table :columns="column_village" :row-key="record=>record.sort" :pagination="pageInfo"
                                     :loading="tableLoadding" @change="handleTableChange"
                                     :data-source="list" >
                            </a-table>
                        </a-tab-pane>
                        <a-tab-pane key="charge_type" tab="收费类别">
                            <a-table :columns="column_charge_type" :row-key="record=>record.sort" :pagination="pageInfo"
                                     :loading="tableLoadding" @change="handleTableChange"
                                     :data-source="list" >
                            </a-table>
                        </a-tab-pane>
                    </a-tabs>
                </a-tab-pane>
                <a-tab-pane key="repair" tab="工单完成率" force-render>
                    <a-table :columns="column_repair" :row-key="record=>record.sort" :pagination="pageInfo"
                             :loading="tableLoadding" @change="handleTableChange"
                             :data-source="list" >
                    </a-table>
                </a-tab-pane>
                <a-tab-pane key="patrol_inspection" tab="巡检完成率">
                    <a-table :columns="column_patrol_inspection" :row-key="record=>record.sort" :pagination="pageInfo"
                             :loading="tableLoadding" @change="handleTableChange"
                             :data-source="list" >
                    </a-table>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
    import villageApi from '@/api/system/community/houseStatistics';
    const column_village = [
        {
            title: '排名',
            dataIndex: 'sort',
            key: 'sort',
        },
        {
            title: '小区名称',
            dataIndex: 'village_name',
            key: 'village_name',
        },
        {
            title: '所属物业',
            dataIndex: 'property_name',
            key: 'property_name',
        },
        {
            title: '应收费用',
            dataIndex: 'modify_money_all',
            key: 'modify_money_all',
        },
        {
            title: '免收费用',
            dataIndex: 'discount_money_all',
            key: 'discount_money_all',
        },
        {
            title: '实收费用',
            dataIndex: 'pay_money_all',
            key: 'pay_money_all',
        },
        {
            title: '退款费用',
            dataIndex: 'refund_money_all',
            key: 'refund_money_all',
        },
        {
            title: '实际费用',
            dataIndex: 'now_pay_money_all',
            key: 'now_pay_money_all',
        },
        {
            title: '缴费率',
            dataIndex: 'contribution_rate',
            key: 'contribution_rate',
        }
    ];
    const column_charge_type = [
        {
            title: '排名',
            dataIndex: 'sort',
            key: 'sort',
        },
        {
            title: '收费类别',
            dataIndex: 'charge_type_name',
            key: 'charge_type_name',
        },
        {
            title: '小区名称',
            dataIndex: 'village_name',
            key: 'village_name',
        },
        {
            title: '所属物业',
            dataIndex: 'property_name',
            key: 'property_name',
        },
        {
            title: '应收费用',
            dataIndex: 'modify_money_all',
            key: 'modify_money_all',
        },
        {
            title: '免收费用',
            dataIndex: 'discount_money_all',
            key: 'discount_money_all',
        },
        {
            title: '实收费用',
            dataIndex: 'pay_money_all',
            key: 'pay_money_all',
        },
        {
            title: '退款费用',
            dataIndex: 'refund_money_all',
            key: 'refund_money_all',
        },
        {
            title: '实际费用',
            dataIndex: 'now_pay_money_all',
            key: 'now_pay_money_all',
        },
        {
            title: '缴费率',
            dataIndex: 'contribution_rate',
            key: 'contribution_rate',
        }
    ];
    const column_repair = [
        {
            title: '排名',
            dataIndex: 'sort',
            key: 'sort',
        },
        {
            title: '小区名称',
            dataIndex: 'village_name',
            key: 'village_name',
        },
        {
            title: '所属物业',
            dataIndex: 'property_name',
            key: 'property_name',
        },
        {
            title: '工单总数',
            dataIndex: 'count',
            key: 'count',
        },
        {
            title: '待处理',
            dataIndex: 'todo_num',
            key: 'todo_num',
        },
        {
            title: '处理中',
            dataIndex: 'processing_num',
            key: 'processing_num',
        },
        {
            title: '已处理',
            dataIndex: 'processed_num',
            key: 'processed_num',
        },
        {
            title: '完成率',
            dataIndex: 'completion_rate',
            key: 'completion_rate',
        }
    ];
    const column_patrol_inspection = [
        {
            title: '排名',
            dataIndex: 'sort',
            key: 'sort',
        },
        {
            title: '小区名称',
            dataIndex: 'village_name',
            key: 'village_name',
        },
        {
            title: '所属物业',
            dataIndex: 'property_name',
            key: 'property_name',
        },
        {
            title: '巡检总次数',
            dataIndex: 'patrol_inspection_num_all',
            key: 'patrol_inspection_num_all',
        },
        {
            title: '待巡检',
            dataIndex: 'todo_num',
            key: 'todo_num',
        },
        {
            title: '已巡检',
            dataIndex: 'patrol_inspection_completion_num_all',
            key: 'patrol_inspection_completion_num_all',
        },
        {
            title: '完成率',
            dataIndex: 'completion_rate',
            key: 'completion_rate',
        }
    ];

    export default {
        data() {
            return {
                column_village,
                column_charge_type,
                column_repair,
                column_patrol_inspection,
                pageInfo: {
                    current:1,
                    page:1,
                    pageSize: 10,
                    total:10,
                    record_date:'',
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                type:'village',
                frequency: false,
                list: [],
                tableLoadding: false,
                vote_id: '',
                headers: {
                    authorization: 'authorization-text'
                },
                clearSelect: true,
                voteDetail: [],
                detailVisible: false,
                voteResult: [],
                resultVisible: false,
                radioStyle: {
                    display: 'block',
                    height: '30px',
                    lineHeight: '30px',
                },
                voteOption: [],
                optionVisible: false,
            }
        },

        components: {
            // vehicleModel
        },

        mounted(){
            this.getList()
        },

        methods: {
            callback(key) {
                this.type=key;
                this.pageInfo = {
                    page: 1,
                    current: 1,
                    pageSize: this.pageInfo.pageSize,
                    total: 0
                }
                this.getList()
            },
            callbackVillage(key) {
                this.type_village=key;
                this.pageInfo = {
                    page: 1,
                    current: 1,
                    pageSize: this.pageInfo.pageSize,
                    total: 0
                }
                this.getList()
            },
            queryThis(){
                if(this.frequency) {
                    this.$message.warn('请求频繁，请稍后再试')
                    return
                }
                this.frequency = true
                let timeout = setTimeout(()=>{
                    this.frequency = false
                    clearTimeout(timeout)
                }, 2000)
                this.pageInfo.page = 1
                this.getList()
            },
            clearThis(){
                this.pageInfo = {
                    page: 1,
                    current: 1,
                    pageSize: this.pageInfo.pageSize,
                    total: 0
                }
                this.clearSelect = false
                let timeout = setTimeout(()=>{
                    this.clearSelect = true
                    clearTimeout(timeout)
                }, 100)
                this.getList()
            },
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getList()
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.pageSize = pageSize
                this.pageInfo.page = page
                this.getList()
            },
            getList(){
                let that = this
                that.tableLoadding = true
                var param = that.pageInfo;
                var url = '';
                if(that.type == 'village' || that.type == 'charge_type'){
                    url = villageApi.getContributionRateList;
                    param.type = that.type_village;
                }else if(that.type == 'repair'){
                    url = villageApi.getRepairRateList;
                }else if(that.type == 'patrol_inspection'){
                    url = villageApi.getPatrolInspectionRateList;
                }else {
                    return false;
                }
                that.request(url, param).then((res) => {
                    //获取四种表格
                    this.columns = [
                        {
                            title: '排名',
                            dataIndex: 'sort',
                            key: 'sort',
                        },
                        {
                            title: '小区名称',
                            dataIndex: 'village_name',
                            key: 'village_name',
                        },
                        {
                            title: '所属物业',
                            dataIndex: 'property_name',
                            key: 'property_name',
                        },
                    ];
                    that.list = res.data
                    that.pageInfo.total = res.total
                    that.tableLoadding = false
                    that.columns=columns;
                }).catch(e=>{
                    that.tableLoadding = false
                })
            },
            showDetail(id){
                let that = this;
                that.request(villageApi.getVoteDetail, {vote_id:id}).then((res) => {
                    that.voteDetail = []
                    that.voteDetail.title = res.base_data.vote_title
                    that.voteDetail.des = res.base_data.vote_des
                    that.voteDetail.des_style = res.base_data.vote_des_style
                    that.voteDetail.image = res.base_data.vote_image
                    that.voteDetail.block = res.vote_block
                    that.detailVisible = true;
                })
            },
            showResult(id){
                let that = this;
                that.request(villageApi.getVoteResult, {vote_id:id}).then((res) => {
                    that.voteResult = []
                    that.voteResult.vote_number = res.base_data.vote_number
                    that.voteResult.limit_type = res.base_data.limit_type
                    that.voteResult.owner_total = res.base_data.owner_total
                    that.voteResult.owner_house_size_total = res.base_data.owner_house_size_total
                    that.voteResult.block = res.vote_block
                    if(that.voteResult.block.length>0){
                        that.voteResult.block.map((v,i)=>{
                            if(v.option.length>0){
                                that.voteResult.block[i].option.push({
                                    option_id: v.block_id+'_'+i,
                                    option_name: '本题有效填写人次',
                                    option_number: v.block_number,
                                    proportion: -1,
                                    proportion_total: -1,
                                    option_house_size_proportion: -1,
                                    option_house_size_proportion_total: -1,
                                });
                            }
                        })
                    }
                    that.resultVisible = true;
                })
            },
            onClose() {
                this.voteDetail = [];
                this.voteResult = [];
                this.detailVisible = false;
                this.resultVisible = false;
            },
            showOption(id){
                let that = this;
                that.request(villageApi.getVoteResultOne, {block_id:id}).then((res) => {
                    that.voteOption = res.data
                    that.voteOption.block_title = res.vote_block.block_title
                    that.voteOption.owner_house_size_total = res.vote_info.owner_house_size_total
                    that.voteOption.block_house_size_total = res.vote_block.block_house_size_total
                    that.option_detail_columns = [
                        {
                            title: 'ID',
                            dataIndex: 'join_id',
                            key: 'join_id',
                        },
                        {
                            title: '姓名',
                            dataIndex: 'name',
                            key: 'name',
                        },
                        {
                            title: '联系方式',
                            dataIndex: 'phone',
                            key: 'phone'
                        },
                        {
                            title: '地址',
                            dataIndex: 'address',
                            key: 'address'
                        },
                        {
                            title: '住户身份',
                            dataIndex: 'relative',
                            key: 'relative'
                        },
                        {
                            title: '最后投票IP',
                            dataIndex: 'join_ip',
                            key: 'join_ip'
                        },
                        {
                            title: '选择内容',
                            dataIndex: 'vote_option_info',
                            key: 'vote_option_info'
                        },
                        {
                            title: '投票时间',
                            dataIndex: 'vote_time',
                            key: 'vote_time'
                        },
                        {
                            title: '参与业主有效面积比例',
                            dataIndex: 'house_size_proportion',
                            key: 'house_size_proportion',
                            scopedSlots: {
                                customRender: 'house_size_proportion'
                            },
                        },
                        {
                            title: '所有业主有效面积比例',
                            dataIndex: 'house_size_proportion_total',
                            key: 'house_size_proportion_total',
                            scopedSlots: {
                                customRender: 'house_size_proportion_total'
                            },
                        },
                    ];
                    if(res.vote_info.limit_type == 0){
                        var new_column = [];
                        that.option_detail_columns.map((v,i)=>{
                            if(v.dataIndex != 'house_size_proportion' && v.dataIndex != 'house_size_proportion_total'){
                                new_column.push(v);
                            }
                        });
                        that.option_detail_columns = new_column;
                    }
                    that.option_detail_columns.map((v,i)=>{
                        if(v.dataIndex == 'vote_option_info' && (res.vote_block.block_type == 1 || res.vote_block.block_type == 2)){
                            that.option_detail_columns[i] = {
                                title: '填写内容',
                                dataIndex: 'option_txt',
                                key: 'option_txt'
                            };
                        }else
                        if(v.dataIndex == 'vote_option_info' && res.vote_block.block_type == 5){
                            that.option_detail_columns[i] = {
                                title: '评分',
                                dataIndex: 'option_num',
                                key: 'option_num',
                                scopedSlots: {
                                    customRender: 'option_num'
                                },
                            };
                        }
                    });
                    that.optionVisible = true;
                })
            },
            onCloseOptions() {
                this.voteOption = [];
                this.optionVisible = false;
            },
        },
    }
</script>

<style lang="less" scoped>
    .vehicle_management {
        width: 98%;
        background-color: #ffffff;
        margin: 10px;

        .header_search {
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
            display: flex;

            .search_item {
                display: flex;
                align-items: center;
                justify-content: flex-start;
            }

            .operation_btn{
                margin-left: 20px;
            }
        }

        .table_content {
            padding: 0 20px;
            margin: 10px 0;
        }
    }
    .title {
        text-align: center;
        font-size: 20px;
        font-weight: 700;
        color: #3d4757;
    }
    .vote_des {
        padding: 20px;
    }
    .tip_content_single {
        background: #fff;
        padding: 0 0 6px;
        color: #aeb5c0;
        font-weight: 400;
        border: none;
        width: 89%;
        font-size: 12px;
        letter-spacing: 0;
        outline: none;
        border-bottom: 1px solid #dcdfe6;
        margin-left: 10px;
        line-height: 10px;
    }
    .block_title {
        font-weight: 700;
        margin-bottom: 10px;
    }
    .button_show_detail {
        margin-left: 10px;
    }

</style>
