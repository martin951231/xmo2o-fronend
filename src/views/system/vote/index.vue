<template>
    <div class="vehicle_management">
        <div class="header_search">
            <div class="search_item" style="margin-left: 10px;">
                <div class="search_item">
                    <label class="label_title">小区名称：</label>
                    <a-input style="width: 200px;" placeholder="请输入小区名称" v-model="pageInfo.village_name" />
                </div>
                <div class="search_item" style="margin-left: 20px;">
                    <label class="label_title">标题：</label>
                    <a-input style="width: 200px;" placeholder="请输入标题" v-model="pageInfo.vote_title" />
                </div>
                <div class="search_item" style="margin-left: 20px;">
                    <label class="label_title">日期筛选：</label>
                    <a-range-picker v-if="clearSelect" @change="ondateChange" />
                </div>

                <a-button type="primary" style="margin-left: 10px;" @click="queryThis()">查询</a-button>
                <a-button style="margin-left: 20px;" @click="clearThis()">清空</a-button>
            </div>
        </div>
        <div class="table_content">
            <a-table :columns="columns" :row-key="record=>record.vote_id" :pagination="pageInfo"
                     :loading="tableLoadding" @change="handleTableChange"
                     :data-source="voteList" >
                <span slot="action" slot-scope="text, record">
                    <a @click="showDetail(record.vote_id)">查看</a>
                    <a-divider type="vertical" />
                    <a @click="showResult(record.vote_id)">收集结果</a>
                </span>

                <span slot="car_user_name"  slot-scope="text, record">
                    <a-tooltip placement="top">
                    <template slot="title">
                      <span>{{ record.car_user_name }}</span>
                    </template>
                   {{ record.car_user_name.length > 12 ? record.car_user_name.substring(0,12) + '...' : record.car_user_name }}
                  </a-tooltip>
                </span>

            </a-table>
        </div>
        <a-drawer
            title="查看"
            placement="right"
            :closable="true"
            :visible="detailVisible"
            @close="onClose"
            width="820"
        >
            <div>
                <div class="title">{{ voteDetail.title }}</div>
                <div class="vote_des" :style="voteDetail.des_style">{{ voteDetail.des }}</div>
                <div style="width: 100%; height: 200px;margin-bottom: 20px;" v-if="voteDetail.image.length>0" v-for="(item,index) in voteDetail.image" :key="index">
                    <img :src="item.file_url" style="vertical-align: top;object-fit: cover;width: 100%; height: 100%;">
                </div>
                <div v-if="voteDetail.block.length>0" v-for="(v,i) in voteDetail.block" style="padding: 50px">
                    <div class="block_title">{{ i+1 }}. {{ v.block_title }}</div>
                    <div v-if="v.option.length > 0 && v.block_type==4"><!--多选-->
                        <a-checkbox-group style="width: 100%">
                            <a-row>
                                <a-col :span="8" v-for="(vv,ii) in v.option" :key="ii" style="float: none;width: 100%">
                                    <a-checkbox :value="vv.option_id" :style="radioStyle">
                                        <span v-if="vv.option_type == 0">{{vv.option_name}}</span>
                                        <span v-else><span>{{vv.option_name}}</span><input disabled="disabled" placeholder="填写者回答区" class="tip_content_single"/></span>
                                    </a-checkbox>
                                </a-col>
                            </a-row>
                        </a-checkbox-group>
                    </div>
                    <div v-if="v.option.length > 0 && v.block_type==3"><!--单选-->
                        <a-radio-group style="width: 100%">
                            <a-radio v-for="(option,optionIndex) in v.option" :key="optionIndex" style="float: none" :style="radioStyle" :value="option.option_id">
                                <span v-if="option.option_type == 0">{{option.option_name}}</span>
                                <span v-else><span>{{option.option_name}}</span><input disabled="disabled" placeholder="填写者回答区" class="tip_content_single"/></span>
                            </a-radio>
                        </a-radio-group>
                    </div>
                    <input v-if="v.block_type==1 || v.block_type==2" disabled="disabled" placeholder="填写者回答区" class="tip_content_single" style="width: 100%;margin-left: 0"/>
                    <a-rate v-if="v.block_type==5" v-decorator="['', { initialValue: 0 }]" allow-half disabled="disabled" />
                </div>
            </div>
        </a-drawer>
        <a-drawer
            title="收集结果"
            placement="right"
            :closable="true"
            :visible="resultVisible"
            @close="onClose"
            width="1200"
        >
            <div v-if="voteResult.limit_type==0">
                <div class="vote_des"><span style="color: #2782f4">共{{ voteResult.vote_number }}人参与投票</span>(由于该投票是针对所有住户，所以投票结果仅统计参与人数比)</div>
                <div v-if="voteResult.block.length>0" v-for="(v,i) in voteResult.block" style="padding: 50px">
                    <div class="block_title">{{ i+1 }}. {{ v.block_title }}
                        <span v-if="v.block_type==4" style="color: #2782f4;font-size: 12px;">(实际{{ v.block_number }}人参与)</span>
                        <a-button class="button_show_detail" @click="showOption(v.block_id)">
                        查看详细信息
                        </a-button>
                    </div>
                    <div v-if="v.option.length > 0 && (v.block_type==4 || v.block_type==3)"><!--多选-->
                        <a-table :pagination="false" :columns="option_columns" :data-source="v.option" :row-key="(record) => record.option_id">
                            <a-progress
                                slot="proportion"  slot-scope="text, record" v-if="record.proportion>=0"
                                :stroke-color="{
                                    from: '#87d068',
                                    to: '#108ee9',
                                  }"
                                :percent="record.proportion"
                                status="active"
                            />
                        </a-table>
                    </div>
                    <div v-if="v.block_type==5">
                        <div>收集结果{{ v.block_number }}条</div>
                        <a-rate v-model="v.average" disabled="disabled" />
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="vote_des"><span style="color: #2782f4">共{{ voteResult.vote_number }}人参与投票</span>(由于该投票仅针对业主，所以统计时不仅计算参与人数比，还统计业主的专有部分面积比)</div>
                <div v-if="voteResult.block.length>0" v-for="(v,i) in voteResult.block" style="padding: 50px">
                    <div class="block_title">{{ i+1 }}. {{ v.block_title }}
                        <span v-if="v.block_type==4" style="color: #2782f4;font-size: 12px;">(实际{{ v.block_number }}人参与)</span>
                        <a-button class="button_show_detail" @click="showOption(v.block_id)">
                            查看详细信息
                        </a-button>
                    </div>
                    <div v-if="v.option.length > 0 && (v.block_type==4 || v.block_type==3)"><!--多选-->
                        <a-table :pagination="false" :columns="option_columns2" :data-source="v.option" :row-key="(record) => record.option_id">
                            <a-progress
                                slot="proportion"  slot-scope="text, record" v-if="record.proportion>=0"
                                :stroke-color="{
                                    from: '#87d068',
                                    to: '#108ee9',
                                  }"
                                :percent="record.proportion"
                                status="active"
                            />
                            <span slot="proportion" slot-scope="text, record" v-if="record.proportion>=0">
                                {{ record.option_number }}/{{ v.block_number }}({{ record.proportion }}%)
                            </span>
                            <span slot="proportion_total" slot-scope="text, record" v-if="record.proportion_total>=0">
                                {{ record.option_number }}/{{ voteResult.owner_total }}({{ record.proportion_total }}%)
                            </span>
                            <span slot="option_house_size_proportion" slot-scope="text, record" v-if="record.option_house_size_proportion>=0">
                                {{ record.option_house_size_total }}㎡/{{ v.block_house_size_total }}㎡({{ record.option_house_size_proportion }}%)
                            </span>
                            <span slot="option_house_size_proportion_total" slot-scope="text, record" v-if="record.option_house_size_proportion_total>=0">
                                {{ record.option_house_size_total }}㎡/{{ voteResult.owner_house_size_total }}㎡({{ record.option_house_size_proportion_total }}%)
                            </span>
                        </a-table>
                    </div>
                    <div v-if="v.block_type==5">
                        <div>收集结果{{ v.block_number }}条</div>
                        <a-rate v-model="v.average" disabled="disabled" />
                    </div>
                </div>
            </div>
        </a-drawer>

        <a-drawer
            title="查看详细信息"
            placement="right"
            :closable="true"
            :visible="optionVisible"
            @close="onCloseOptions"
            width="1200"
        >
            <div class="block_title">问题：{{ voteOption.block_title }}</div>
            <a-table :columns="option_detail_columns" :data-source="voteOption" :row-key="(record) => record.join_id">
                <span slot="house_size_proportion" slot-scope="text, record" v-if="record.house_size_proportion>=0">
                    {{ record.housesize }}㎡/{{ voteOption.block_house_size_total }}㎡({{ record.house_size_proportion }}%)
                </span>
                <span slot="house_size_proportion_total" slot-scope="text, record" v-if="record.house_size_proportion_total>=0">
                    {{ record.housesize }}㎡/{{ voteOption.owner_house_size_total }}㎡({{ record.house_size_proportion_total }}%)
                </span>
                <span slot="option_num" slot-scope="text, record">
                    <a-rate v-model="record.option_num" disabled="disabled" />
                </span>
            </a-table>
        </a-drawer>
    </div>
</template>

<script>
    import villageApi from '@/api/system/community/vote';
    const columns = [
        {
            title: '小区名称',
            dataIndex: 'village_name',
            key: 'village_name',
        },
        {
            title: '标题',
            dataIndex: 'vote_title',
            key: 'vote_title',
        },{
            title: '开始时间',
            dataIndex: 'start_time',
            key: 'start_time',
        },{
            title: '结束时间',
            dataIndex: 'end_time',
            key: 'end_time',
        },{
            title: '参与人数',
            dataIndex: 'vote_number',
            key: 'vote_number',
            sorter: (a, b) => a.vote_number - b.vote_number,
        },{
            title: '状态',
            dataIndex: 'status_msg',
            key: 'status_msg'
        },{
            title: '操作',
            key: 'action',
            scopedSlots: {
                customRender: 'action'
            },
        },
    ];
    const option_columns = [
        {
            title: '选项',
            dataIndex: 'option_name',
            key: 'option_name',
            width: 180,
        },
        {
            title: '小计',
            dataIndex: 'option_number',
            key: 'option_number',
            width: 100,
        },
        {
            title: '比例',
            dataIndex: 'proportion',
            key: 'proportion',
            scopedSlots: {
                customRender: 'proportion'
            },
        },
    ];
    const option_columns2 = [
        {
            title: '选项',
            dataIndex: 'option_name',
            key: 'option_name',
            width: 180,
        },
        {
            title: '小计',
            dataIndex: 'option_number',
            key: 'option_number',
            width: 100,
        },
        {
            title: '参与业主投票比例',
            dataIndex: 'proportion',
            key: 'proportion',
            scopedSlots: {
                customRender: 'proportion'
            },
        },
        {
            title: '总业主投票比例',
            dataIndex: 'proportion_total',
            key: 'proportion_total',
            scopedSlots: {
                customRender: 'proportion_total'
            },
        },
        {
            title: '参与业主有效面积比例',
            dataIndex: 'option_house_size_proportion',
            key: 'option_house_size_proportion',
            scopedSlots: {
                customRender: 'option_house_size_proportion'
            },
        },
        {
            title: '所有业主有效面积比例',
            dataIndex: 'option_house_size_proportion_total',
            key: 'option_house_size_proportion_total',
            scopedSlots: {
                customRender: 'option_house_size_proportion_total'
            },
        },
    ];
    const option_detail_columns = [];

    export default {
        data() {
            return {
                columns,
                option_columns,
                option_columns2,
                option_detail_columns,
                pageInfo: {
                    sorter:'',
                    current:1,
                    page:1,
                    pageSize: 10,
                    total:10,
                    village_name: '',
                    vote_title: '',
                    date_type:"1",
                    record_date:'',
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                frequency: false,
                voteList: [],
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
            this.getVoteList()
        },

        methods: {
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
                this.getVoteList()
            },
            clearThis(){
                this.pageInfo = {
                    page: 1,
                    current: 1,
                    village_name: '',
                    vote_title: '',
                    date_type:"1",
                    pageSize: this.pageInfo.pageSize,
                    total: 0
                }
                this.clearSelect = false
                let timeout = setTimeout(()=>{
                    this.clearSelect = true
                    clearTimeout(timeout)
                }, 100)
                this.getVoteList()
            },
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.pageInfo.sorter = '';
                if(sorter.field != undefined && sorter.order != undefined){
                    var asc = (sorter.order == "descend") ? ' desc' : ' asc';
                    this.pageInfo.sorter = sorter.field+asc;
                }
                this.getVoteList()
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.pageSize = pageSize
                this.pageInfo.page = page
                this.getVoteList()
            },
            getVoteList(){
                let that = this
                that.tableLoadding = true
                var param = that.pageInfo;
                if(that.pageInfo.record_date[0] != undefined){
                    param.start_time = that.pageInfo.record_date[0];
                }
                if(that.pageInfo.record_date[1] != undefined){
                    param.end_time = that.pageInfo.record_date[1];
                }
                that.request(villageApi.getVoteList, param).then((res) => {
                    that.voteList = res.data
                    that.pageInfo.total = res.total
                    that.tableLoadding = false
                    that.columns=columns;
                }).catch(e=>{
                    that.tableLoadding = false
                })
            },
            ondateChange(date, dateString) {
                this.pageInfo.record_date = '';
                this.pageInfo.record_date = dateString;
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
