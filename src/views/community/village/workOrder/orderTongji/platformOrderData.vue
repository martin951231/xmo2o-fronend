<template>
    <div class="bg-box">
        <div class="left_box" :style="show_right?'':'width:0%;'">
            <div class="left_top_box">
                <div class="text_title" style="width: 100%; display: flex; align-items: center;">
                    <a-select v-model="currentVillageId" show-search style="width: 150px; margin-left: 10px;" @change="(value)=>handleSelectChange(value, 'top_village')">
                        <a-icon style="color: #FFFFFF;" slot="suffixIcon" type="caret-down" />
                        <a-select-option v-for="(item,index) in villageList" :key="index" :value="item.village_name+'-'+item.village_id">
                            {{item.village_name}}
                        </a-select-option>
                    </a-select>
                    <span style="margin-left: 10px;">工单处理数据</span>
                </div>
                <div id="orderDeal" class="my_echarts_1"></div>
                <div v-if="legend.length == 0" class="my_echarts_1" style="display: flex; align-items: center; justify-content:center; color: #999;">暂无数据</div>
            </div>
            <div class="left_center_box">
                <div class="text_title">物业评分</div>
                <div class="echarts">
                    <div class="tip_box">
                        <div class="tips" @click="selectdeStart(item.type-1)"
                            :style="index==cateIndex?'background: #2C6FFF;color: #FFFFFF;':''"
                            v-for="(item,index) in tipsItem" :key="index">
                            {{item.name}}
                        </div>
                    </div>
                    <div class="echarts_box">
                        <div class="mini_box_1" v-if="propertyRating && propertyRating != ''">
                            <div class="table-right">
                                <div class="table-scroll_right">
                                    <div class="table-flex_body_right" v-for="(item,index) in propertyRating" :key="index">
                                        <div class="text_1" v-for="(items,indexs) in item" :key="indexs">{{items.title}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tip_text_box" v-else>
                            <div class="tip_text">暂无记录</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="left_bottom_box">
                <div class="text_title">工单结案率</div>
                <div id="orderRate" class="my_echarts_1"></div>
                <div v-if="finshOrder.length == 0" class="my_echarts_1" style="display: flex; align-items: center; justify-content:center; color: #999;">
                    <span style="margin-bottom: 50px;">暂无数据</span>
                </div>
            </div>
            <div class="right_btn" @click="showRight" :style="show_right?'':'left:10px'">{{show_right?'<':'>'}}</div>
        </div>
        <div class="right_box" :style="show_right?'':'width:100%'">
            <div class="top_box">
                <img src="../../../../../assets/images/grid_1.png" style="margin: 15px;" alt="">
                <div class="title">工单处理中心</div>
            </div>
            <div class="top_box" style="height: 130px; margin-top: 10px;">
                <div class="worker_order_list" v-for="(item, index) in workLabelList" :key="index">
                    <div class="name">{{item.name}}</div>
                    <div class="value">{{item.value}}/起</div>
                </div>
            </div>
            <div class="center_box">
                <a-select show-search class="select_1" default-value="全部小区" style="width: 120px" @change="(value)=>handleSelectChange(value, 'village')">
                    <a-icon style="color: #FFFFFF;" slot="suffixIcon" type="caret-down" />
                    <a-select-option :value="0">
                        全部小区
                    </a-select-option>
                    <a-select-option v-for="(item,index) in villageList" :key="index" :value="item.village_name+'-'+item.village_id">
                        {{item.village_name}}
                    </a-select-option>
                </a-select>
                <a-select v-if="refrashThis" class="select_1" default-value="全部类目" style="width: 120px" @change="(value)=>handleSelectChange(value, 'cate')">
                    <a-icon style="color: #FFFFFF;" slot="suffixIcon" type="caret-down" />
                    <a-select-option value="0">
                        全部类目
                    </a-select-option>
                    <a-select-option v-for="(item,index) in subjectList" :value="item.category_id" :key="index">
                        {{item.subject_name}}
                    </a-select-option>
                </a-select>
                <a-select v-if="refrashThis" class="select_1" default-value="全部类别" v-model="secondCate" style="width: 100px;" @change="(value)=>handleSelectChange(value, 'second_cate')">
                    <a-icon style="color: #FFFFFF;" slot="suffixIcon" type="caret-down" />
                    <a-select-option value="0">
                        全部类别
                    </a-select-option>
                    <a-select-option v-for="(item,index) in cateOptions" :value="item.value" :key="index">
                        {{item.label}}
                    </a-select-option>
                </a-select>
                <a-select class="select_1" default-value="筛选条件" style="width: 150px;"
                    @change="(value)=>handleSelectChange(value, 'shaixuan')">
                    <a-icon style="color: #FFFFFF;" slot="suffixIcon" type="caret-down" />
                    <a-select-option v-for="(item,index) in shaixuanList" :value="item.value" :key="index">
                        <a-tooltip :title="item.name">
                            {{item.name}}
                        </a-tooltip>
                    </a-select-option>
                </a-select>
                <a-input class="input_1" placeholder="请输入" v-model="searchForm.search" v-if="isShow"
                    style="width: 120px;" />
                <a-cascader class="input_1" :options="singleOptions" :load-data="loadDataFunc" placeholder="请选择房间"
                    change-on-select @change="setVisionsFunc" style="width: 140px;border: none"
                    v-model="searchForm.room_ids" v-else-if="isRoom"/>
                <a-select v-else-if="isMarkType" class="select_1" v-model="searchForm.mark_type" style="width: 140px"
                    @change="(value)=>handleSelectChange(value, 'mark_type')">
                    <a-select-option v-for="(item,index) in markTypeList" :value="item.value" :key="index">
                        <a-tooltip :title="item.label">
                            {{item.label}}
                        </a-tooltip>
                    </a-select-option>
                </a-select>
                <a-select v-else class="select_1" v-model="searchForm.public_id" style="width: 140px"
                    @change="(value)=>handleSelectChange(value, 'public_area')">
                    <a-select-option v-for="(item,index) in publicAreaList" :value="item.public_area_id" :key="index">
                        <a-tooltip :title="item.public_area_name">
                            {{item.public_area_name}}
                        </a-tooltip>
                    </a-select-option>
                </a-select>
                <a-select class="select_1" default-value="全部状态" style="width: 135px" @change="(value)=>handleSelectChange(value, 'status')">
                    <a-icon style="color: #FFFFFF;" slot="suffixIcon" type="caret-down" />
                    <a-select-option v-for="(item, index) in statusList" :key="index" :value='item.value'>
                        {{item.label}}
                    </a-select-option>
                </a-select>
                <div class="text_1" style="flex-shrink: 0;">上报时间：</div>
                <a-range-picker :placeholder="['请选择开始时间','请选择结束时间']" separator="至" class="select_time"
                    @change="handleDateChange" style="width: 300px">
                    <a-icon slot="suffixIcon" type="none" />
                </a-range-picker>
                
                <div class="primaty_btn" @click="queryAll()">查询</div>
                
                <div class="primaty_btn" @click="setVisible = true">督察室设置</div>
            </div>
            <div class="bottom_box">
                <a-table :rowKey="record=>record.order_id" class="table_1" :columns="tableColumns" :data-source="tableList" :pagination="pagination"
                    :loading="tableLoading" @change="handleTableChange">
                    <span slot="operation" slot-scope="text, record">
                        <a @click="getDetail(record.order_id)">详情</a>
                    </span>
                    <span slot="status_txt" slot-scope="text, record">
                        <span :style="'color:'+record.color ">{{record.status_txt}}</span>
                    </span>
                    <span slot="order_content" slot-scope="text, record" style="cursor: pointer;">
                        <a-tooltip placement="topLeft" v-if="record.order_content.length > 6">
                            <template slot="title">
                                <span>{{record.order_content}}</span>
                            </template>
                            <span>{{record.order_content}}</span>
                        </a-tooltip>
                        <span v-else>{{record.order_content}}</span>
                    </span>
                    <span slot="subject_name" slot-scope="text, record" style="cursor: pointer;">
                        <a-tooltip placement="topLeft" v-if="record.subject_name.length > 5">
                            <template slot="title">
                                <span>{{record.subject_name}}</span>
                            </template>
                            <span>{{record.subject_name}}</span>
                        </a-tooltip>
                        <span v-else>{{record.subject_name}}</span>
                    </span>
                    <span slot="cate_name" slot-scope="text, record" style="cursor: pointer;">
                        <a-tooltip placement="topLeft" v-if="record.cate_name.length > 5">
                            <template slot="title">
                                <span>{{record.cate_name}}</span>
                            </template>
                            <span>{{record.cate_name}}</span>
                        </a-tooltip>
                        <span v-else>{{record.cate_name}}</span>
                    </span>
                    <span slot="mark_type_text" slot-scope="text, record" style="cursor: pointer;">
                        <a-tooltip placement="topLeft" v-if="record.mark_type_text.length > 5">
                            <template slot="title">
                                <span>{{record.mark_type_text}}</span>
                            </template>
                            <span>{{record.mark_type_text}}</span>
                        </a-tooltip>
                        <span v-else>{{record.mark_type_text}}</span>
                    </span>
                    <span slot="address_txt" slot-scope="text, record" style="cursor: pointer;">
                        <a-tooltip placement="topLeft" v-if="record.address_txt.length > 5">
                            <template slot="title">
                                <span>{{record.address_txt}}</span>
                            </template>
                            <span>{{record.address_txt}}</span>
                        </a-tooltip>
                        <span v-else>{{record.address_txt}}</span>
                    </span>
                </a-table>
            </div>
        </div>
        <a-drawer :title="orderDetailTitle" width="700" :maskClosable="false" :closable="true" :visible="detailVisible"
            @close="onClose">
            <a-tabs type="card" default-active-key="1" @change="handleTabChange" v-if="detailVisible">
                <a-tab-pane key="1" tab="工单详情">
                    <div class="content_box">
                        <div class="item_box">
                            <template v-for="(item,index) in orderDetail.order_arr">
                                <div class="list" v-if="item.type == 1">
                                    <div class="text_1">{{item.title}}：</div>
                                    <div class="text_2">{{item.content?item.content:'无'}}</div>
                                </div>
                                <div v-if="item.type == 3" class="list_2">
                                    <div class="text_1">{{item.title}}：</div>
                                    <viewer :images="item.imgs">
                                        <img class="img_1"
                                            v-for="(src,src_index) in item.imgs"
                                            :src="src" :key="src_index" style="margin-left: 5px">
                                    </viewer>
                                </div>
                                <div v-if="item.type == 4" class="list_2">
                                    <div class="text_1">{{item.title}}：</div>
                                    <img @click="playVideo(src.video)" class="img_1"
                                        v-for="(src,src_index) in item.videos" :src="src.image" :key="src.image"
                                        style="margin-left: 5px">
                                </div>
                            </template>
                        </div>
                        <div class="list_3">
                            <div class="text_1">状态：</div>
                            <div class="text_2" v-if="orderDetail.order_detail" :style="'color:'+orderDetail.order_detail.event_status_color">
                                {{orderDetail.order_detail.event_status_txt}}
                            </div>
                        </div>
                        <div class="title">处理记录</div>
                        <div class="list_4">
                            <div class="list_box" v-if="orderDetail.order_detail">
                                <div class="list" v-for="(item,index) in orderDetail.order_detail.log_info.children">
                                    <div class="text_1">{{item.title}}：</div>
                                    <div class="text_2">{{item.content?item.content:'无'}}</div>
                                </div>
                                <div class="list_2">
                                    <div class="text_1">图例：</div>
                                    <viewer
                                        v-if="orderDetail.order_detail.log_info && orderDetail.order_detail.log_info.imgs && orderDetail.order_detail.log_info.imgs[0]"
                                        :images="orderDetail.order_detail.log_info.imgs">
                                        <img class="img_1" v-for="(src,index) in orderDetail.order_detail.log_info.imgs"
                                            :src="src" :key="index" style="margin-left: 5px">
                                    </viewer>
                                    <div v-else>无</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </a-tab-pane>
                <a-tab-pane key="2" tab="处理记录">
                    <div class="loading" v-if="eventLogArr.length == 0">
                        加载中...
                    </div>
                    <a-timeline-item class="time_line" v-for="(item2,index2) in eventLogArr">
                        <div>
                            <div class="list_4">
                                <div class="list_box">
                                    <div class="list">
                                        <div class="text_1">类型：</div>
                                        <div class="text_2">{{item2.title?item2.title:'无'}}</div>
                                    </div>
                                    <div class="list" v-for="(item1,index1) in item2.tip">
                                        <div class="text_1" v-if="item1.title != '' ">{{item1.title?item1.title:'无'}}：
                                        </div>
                                        <div class="text_1" v-else>图例：</div>
                                        <div class="text_2" v-if="item1.title != '' ">
                                            {{item1.content?item1.content:'无'}}
                                        </div>
                                        <div class="text_2" v-else>
                                            <viewer v-if="item1.imgs.length > 0" :images="item1.imgs">
                                                <img class="img_1" v-for="(src,index) in item1.imgs" :src="src"
                                                    :key="index" style="margin-left: 5px;height: 60px;width: 60px">
                                            </viewer>
                                        </div>
                                    </div>
                                </div>
                                <div class="right_time" style="float: right; width: 200px;">
                                    {{item2.log_time}}
                                </div>
                            </div>
                        </div>
                    </a-timeline-item>
                </a-tab-pane>
            </a-tabs>
        </a-drawer>
        <a-modal :visible="showVideo" :footer="null" @cancel="showVideo=false, videoUrl=''">
            <video style="width: 100%; height: 100%;" autoplay :src="videoUrl" />
        </a-modal>
        
        <inspectionRoom :visible="setVisible" @close="setVisible = false" />
    </div>
</template>

<script>
    import echarts from 'echarts'
    import villageApi from '@/api/community/village'
    import 'viewerjs/dist/viewer.css'
    import Viewer from 'v-viewer'
    import Vue from 'vue'
    import inspectionRoom from './component/setInspectionRoom.vue';
    import {
        getSystemName
    } from '@/utils/util'
    Vue.use(Viewer)
    const tableColumns = [{
            title: '序号',
            dataIndex: 'order_id',
            width: '5%',
        },
        {
            title: '工单详情',
            dataIndex: 'order_content',
            width: '10%',
            scopedSlots: {
                customRender: 'order_content'
            },
        },
        {
            title: '工单类目',
            dataIndex: 'subject_name',
            width: '10%',
            scopedSlots: {
                customRender: 'subject_name'
            },
        },
        {
            title: '上报分类',
            dataIndex: 'cate_name',
            width: '10%',
            scopedSlots: {
                customRender: 'cate_name'
            },
        },
        {
            title: '上报来源',
            dataIndex: 'mark_type_text',
            width: '10%',
            scopedSlots: {
                customRender: 'mark_type_text'
            },
        },
        {
            title: '上报位置',
            dataIndex: 'address_txt',
            width: '15%',
            scopedSlots: {
                customRender: 'address_txt'
            },
        },
        {
            title: '上报人员',
            dataIndex: 'name',
            width: '11%',
        },
        {
            title: '手机号码',
            dataIndex: 'phone',
            width: '10%',
        },
        {
            title: '上报时间',
            dataIndex: 'add_time_txt',
            width: '10%',
        },
        {
            title: '状态  ',
            dataIndex: 'status_txt',
            width: '9%',
            scopedSlots: {
                customRender: 'status_txt'
            },
        },
        {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: {
                customRender: 'operation'
            },
        }
    ];

    export default {
        name: "orderTongji",
        components: {
            inspectionRoom
        },
        data() {
            return {
                refrashThis: true,
                finshOrder: [],
                currentVillageId: '',
                villageList: [],
                secondCate: '全部类别',
                show_right: true,
                tableList: [],
                tableColumns,
                pagination: {},
                tableLoading: false,
                detailVisible: false,
                searchForm: {
                    village_id: 0,
                    category_id: 0,
                    cat_fid: 0,
                    type_id: 0,
                    cat_id: 0,
                    search: '',
                    type: '',
                    start_time: '',
                    end_time: '',
                    event_status: 0,
                    single_id: 0,
                    floor_id: 0,
                    layer_id: 0,
                    room_id: 0,
                    room_ids: [],
                    public_id: '请选择区域',
                    mark_type: '请选择上报类型',
                },
                eventLogArr: [],
                orderDetail: {},
                cateIndex: -1,
                subjectList: [], //工单类目列表
                f_cat_list: [],
                select_default: '全部',
                // 页面高度
                screenHeight: document.body.clientHeight,
                scrollHeight: 650,
                tipsItem: [], //物业评分tips
                propertyRating: [], //物业评分列表
                series: [],
                legend: [],
                xAxis: [],
                cateOptions: [],
                singleOptions: [],
                isShow: true,
                tokenName: '',
                sysName: '',
                delayRequest: false,
                workLabelList: [],
                shaixuanList: [{
                    value: 'name',
                    name: '上报人员'
                }, {
                    value: 'phone',
                    name: '手机号码'
                }, {
                    value: 'address',
                    name: '上报位置-小区名称'
                }, {
                    value: 'public_area',
                    name: '上报位置-公共区域'
                }, {
                    value: 'mark_type',
                    name: '上报来源'
                }],
                isRoom: false,
                publicAreaList: [],
                orderDetailTitle: '',
                videoUrl: '',
                showVideo: false,
                statusList: [{
                    label: '全部状态', 
                    value: 0
                },{
                    label: '未指派', 
                    value: 10
                },{
                    label: '已指派', 
                    value: 20
                },{
                    label: '处理中', 
                    value: 30
                },{
                    label: '已办结', 
                    value: 40
                },{
                    label: '已撤回', 
                    value: 50
                },{
                    label: '已关闭', 
                    value: 60
                },{
                    label: '已评价', 
                    value: 70
                },{
                    label: '转供暖商', 
                    value: 16
                },{
                    label: '转开发商', 
                    value: 17
                },],
                setVisible: false,
                isMarkType: false,
                markTypeList: [],
            }
        },
        mounted() {
            document.title = '工单处理中心'
            this.scrollHeight = this.screenHeight - 55 - 68 - 150;
            this.getTableList();
            this.getVillageList()
        },
        inject: ['reload'],
        methods: {
            handleTabChange(key) {
                if (key == 2) {
                    this.lookDetails(this.orderDetail.order_detail.order_id)
                }
            },
            getFinshOrder() {
                let village_id = this.searchForm.village_id
                let index = this.villageList.findIndex(v=>v.village_name +'-' +v.village_id == this.currentVillageId)
                if(index!=-1){
                    village_id = this.villageList[index].village_id
                }
                this.request('/community/platform.RepairWorkOrder/getFinshOrder', {
                    village_id: village_id
                }).then((res) => {
                    this.finshOrder = []
                    res.map(v => {
                        this.finshOrder.push({
                            name: v.subject_name,
                            value: v.rate
                        })
                    })
                    this.$echarts.dispose(document.getElementById('orderRate'))
                    this.setSecondChart(this.finshOrder)
                });
            },
            setFirstChart() {
                // 基于准备好的dom，初始化echarts实例
                const myChart = this.$echarts.init(document.getElementById('orderDeal'));
                const option = {
                    legend: {
                        data: this.legend,
                        icon: 'rect',
                        itemGap: 10, //图例item间距
                        itemWidth: 10,
                        itemHeight: 10,
                        textStyle: {
                            padding: [4, 0, 0, 0],
                            color: '#CAF2F5',
                            fontSize: 12,
                            verticalAlign: 'middle',
                        }
                    },
                    grid: {
                        x: 25,
                        y: 100,
                        x2: 5,
                        y2: 25,
                        borderWidth: 1
                    },
                    calculable: true,
                    xAxis: [{
                        type: 'category',
                        data: this.xAxis,
                        axisLine: {
                            show: true,
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            color: 'rgba(255,255,255, 1)',
                        },
                        splitLine: {
                            show: false,
                        },
                    }],
                    yAxis: [{
                        type: 'value',
                        axisLine: {
                            show: false,
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            color: 'rgba(255,255,255, 0.5)',
                        },
                        splitLine: {
                            show: false,
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type: 'dashed',
                                color: 'rgba(255,255,255,0.1)',
                                width: 2,
                            },
                        },
                    }],
                    series: this.series
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            },

            setSecondChart(data) {
                const myChart = this.$echarts.init(document.getElementById('orderRate'));
                const option = {
                    series: [{
                        name: '',
                        type: 'pie',
                        radius: [20, 57],
                        center: ['50%', '40%'],
                        roseType: 'radius',
                        itemStyle: {
                            borderRadius: 50
                        },
                        data: data
                    }]
                };
                myChart.setOption(option);
            },
            selectdeStart(index) {
                this.cateIndex = index;
                this.getPropertyRating(index + 1);
            },
            handleTableChange(pagination, filters, sorter) {
                const pager = {
                    ...this.pagination
                };
                pager.current = pagination.current;
                this.pagination = pager;
                this.getTableList({
                    results: pagination.pageSize,
                    page: pagination.current,
                    sortField: sorter.field,
                    sortOrder: sorter.order,
                    ...filters,
                    ...this.searchForm,
                });
            },
            getTableList(params = {}) {
                this.tableLoading = true;
                this.request('/community/platform.RepairWorkOrder/getOrderList',
                    params
                ).then((data) => {
                    const pagination = {
                        ...this.pagination
                    };
                    pagination.total = data.total;
                    pagination.pageSize = data.limit;
                    this.tableLoading = false;
                    this.tableList = data.list;
                    this.pagination = pagination;
                    if(!data.jz_open){
                        let index1 = this.statusList.findIndex(v=>v.value == 16)
                        let index2 = this.statusList.findIndex(v=>v.value == 17)
                        if(index1 != -1){
                            this.statusList.splice(index1, 1)
                        }
                        if(index2 != -1){
                            this.statusList.splice(index2, 1)
                        }
                    }
                });
            },
            queryAll() {
                this.getTableList(this.searchForm);
            },
            //今日上报事件数量
            getTodayEventCount() {
                let village_id = this.searchForm.village_id
                let index = this.villageList.findIndex(v=>v.village_name +'-' +v.village_id == this.currentVillageId)
                if(index!=-1){
                    village_id = this.villageList[index].village_id
                }
                this.request('/community/platform.RepairWorkOrder/getTongji', {
                    village_id: village_id
                }).then((res) => {
                    this.workLabelList = [{
                        name: "超时工单",
                        value: res.timely_count ? res.timely_count : 0
                    }, {
                        name: "今日上报工单",
                        value: res.submit_count
                    }, {
                        name: "今日回复工单",
                        value: res.reply_count
                    }, {
                        name: "今日处理工单",
                        value: res.handle_count
                    }]
                })
            },
            //物业评分
            getPropertyRating(type = 0) {
                let param = {};
                let sysName = getSystemName(location.hash);
                if (sysName) {
                    this.tokenName = sysName + '_access_token';
                    this.sysName = sysName;
                } else {
                    this.sysName = 'village';
                    this.tokenName = 'village_access_token';
                }
                param.tokenName = this.tokenName;
                let index = this.villageList.findIndex(v=>v.village_name +'-' +v.village_id == this.currentVillageId)
                if(index!=-1){
                    param.village_id = this.villageList[index].village_id
                }
                param.type = type;
                this.request('/community/platform.RepairWorkOrder/getPropertyRating', param).then((res) => {
                    this.tipsItem = res.list;
                    this.propertyRating = res.info;
                })
            },
            //物业工单统计
            getEventData() {
                let village_id = this.searchForm.village_id
                let index = this.villageList.findIndex(v=>v.village_name +'-' +v.village_id == this.currentVillageId)
                if(index!=-1){
                    village_id = this.villageList[index].village_id
                }
                this.request('/community/platform.RepairWorkOrder/orderTongji', {
                    village_id: village_id
                }).then((res) => {
                    this.series = res.series;
                    this.legend = res.legend;
                    this.xAxis = res.xAxis;
                    this.$echarts.dispose(document.getElementById('orderDeal'))
                    this.setFirstChart();
                })
            },
            //物业工单类目列表
            getSubjectList(subject_id = 0) {
                this.request('/community/platform.RepairWorkOrder/getSubject', {
                    id: subject_id,
                    village_id: this.searchForm.village_id
                }).then((res) => {
                    this.subjectList = res;
                })
            },
            getDetail(order_id) {
                this.orderDetailTitle = '查看序号【' + order_id + '】详情';
                this.detailVisible = true;
                this.getOrderDetail(order_id);
            },
            getOrderDetail(order_id) {
                this.request('/community/platform.RepairWorkOrder/getWorkOrderDetail', {
                    order_id: order_id,
                    village_id: this.searchForm.village_id
                }).then((res) => {
                    this.orderDetail = res;
                });
            },
            showRight() {
                this.show_right = !this.show_right
            },
            lookDetails(order_id) {
                this.request('/community/platform.RepairWorkOrder/repairGetOrderLog', {
                    order_id: order_id,
                    village_id: this.searchForm.village_id
                }).then((res) => {
                    this.eventLogArr = res.log.info;
                });
            },
            onClose() {
                this.detailVisible = false;
                this.eventLogArr = []
            },
            handleDateChange(date, dateString) {
                this.searchForm.start_time = dateString[0];
                this.searchForm.end_time = dateString[1];
            },
            handleSelectChange(value, type){
                if(type == 'top_village'){
                    this.currentVillageId = value
                    this.getEventData();
                    this.getFinshOrder()
                    this.getPropertyRating(1);
                    this.getTodayEventCount();
                } else if(type == 'village'){
                    this.subjectList = []
                    this.cateOptions = []
                    this.searchForm.category_id = ''
                    this.searchForm.cat_fid = ''
                    this.searchForm.cat_id = ''
                    this.secondCate = '全部类别'
                    this.refrashThis = false
                    this.$nextTick(()=>{
                        this.refrashThis = true
                    })
                    let index = this.villageList.findIndex(v=>v.village_name+'-'+v.village_id == value)
                    if(index != -1){
                        this.currentVillageId = value
                        this.searchForm.village_id = this.villageList[index].village_id
                        this.getSubjectList(0);
                        this.getTodayEventCount();
                        this.getEventData();
                        this.getPropertyRating(1);
                        this.getFinshOrder()
                    } else {
                        this.searchForm.village_id = 0
                    }
                } else if(type == 'cate'){
                    if (value * 1 == 0) {
                        this.cateOptions = []
                    }
                    this.secondCate = '全部类别'
                    this.searchForm.category_id = value
                    this.searchForm.cat_fid = value
                    this.searchForm.cat_id = ''
                    this.getCate(value);
                } else if(type == 'second_cate'){
                    if (value * 1 == 0) {
                        this.secondCate = '全部类别';
                        this.searchForm.cat_id = 0;
                    } else {
                        this.cateOptions.map(v => {
                            if (v.value == value) {
                                this.secondCate = v.label
                                this.searchForm.cat_id = v.value
                            }
                        })
                    }
                } else if(type == 'shaixuan'){
                    this.searchForm.type = value
                    this.searchForm.public_id = '请选择区域'
                    this.searchForm.mark_type = '请选择区域'
                    this.searchForm.single_id = 0
                    this.searchForm.floor_id = 0
                    this.searchForm.layer_id = 0
                    this.searchForm.room_id = 0
                    this.searchForm.room_ids = []
                    this.searchForm.search = ''
                    if (value == 'address') {
                        this.getSingleListByVillage('room');
                        this.isShow = false;
                        this.isRoom = true
                    } else if (value == 'public_area') {
                        this.getSingleListByVillage('public_area');
                        this.isMarkType = false;
                        this.isShow = false;
                        this.isRoom = false;
                    } else if (value == 'mark_type') {
                        this.get_mark_type();
                        this.isMarkType = true;
                        this.isShow = false;
                        this.isRoom = false;
                    } else {
                        this.isShow = true;
                        this.isRoom = false;
                    }
                } else if(type == 'status'){
                    this.searchForm.event_status = value;
                } else if(type == 'public_area'){
                    this.searchForm.public_id = value;
                } else if(type == 'mark_type'){
                    this.searchForm.mark_type = value;
                }
            },
            //物业工单类别列表
            getCate(category_id = 0) {
                this.request('/community/platform.RepairWorkOrder/getCate', {
                    category_id: category_id,
                    village_id: this.searchForm.village_id
                }).then(res => {
                    if (res) {
                        let array = []
                        res.map(pro => {
                            array.push({
                                label: pro.name,
                                value: pro.id,
                                isLeaf: false
                            });
                        });
                        this.cateOptions = array;
                    }
                });
            },
            //子分类列表
            getFidCate(type_id, type) {
                return new Promise(resolve => {
                    this.request(villageApi.getFidCate, {
                        type_id: type_id,
                        type: type,
                        village_id: this.searchForm.village_id
                    }).then(res => {
                        resolve(res);
                    });
                });
            },
            get_mark_type() {
                this.request('/community/platform.RepairWorkOrder/get_mark_type', {
                    village_id: this.searchForm.village_id
                }).then(res => {
                    if (res.select) {
                        console.log('res', res)
                        this.markTypeList = res.select
                    }
                });
            },
            // 楼栋号
            getSingleListByVillage(type) {
                this.request('/community/platform.RepairWorkOrder/getSingleListByVillage', {
                    xtype: type,
                    village_id: this.searchForm.village_id
                }).then(res => {
                    if (res) {
                        if (type != 'public_area') {
                            let array = []
                            res.map(pro => {
                                array.push({
                                    label: pro.name,
                                    value: pro.id,
                                    isLeaf: false
                                });
                            });
                            this.singleOptions = array
                        } else {
                            this.publicAreaList = res
                        }
                    }
                });
            },
            // 单元楼
            getFloorList(id) {
                return new Promise(resolve => {
                    this.request('/community/platform.RepairWorkOrder/getFloorList', {
                        pid: id,
                        village_id: this.searchForm.village_id
                    }).then(res => {
                        resolve(res);
                    });
                });
            },
            // 楼层
            getLayerList(id) {
                return new Promise(resolve => {
                    this.request('/community/platform.RepairWorkOrder/getLayerList', {
                        pid: id,
                        village_id: this.searchForm.village_id
                    }).then(res => {
                        if (res) {
                            resolve(res);
                        }
                    });
                })
            },
            // 房间
            getVacancyList(id) {
                return new Promise(resolve => {
                    this.request('/community/platform.RepairWorkOrder/getVacancyList', {
                        pid: id,
                        village_id: this.searchForm.village_id
                    }).then(res => {
                        if (res) {
                            resolve(res);
                        }
                    });
                })
            },
            async loadDataFunc(selectedOptions) {
                const targetOption = selectedOptions[selectedOptions.length - 1];
                targetOption.loading = true;
                setTimeout(function() {
                    targetOption.loading = false;
                }, 100)
            },
            // 处理加载漏洞单元（选择、编辑时可用）
            async setVisionsFunc(selectedOptions) {
                if (selectedOptions.length === 1) {
                    const options_temp = [...this.singleOptions];
                    const res = await this.getFloorList(selectedOptions[0]);
                    this.searchForm.single_id = selectedOptions[0];
                    this.searchForm.floor_id = 0;
                    this.searchForm.layer_id = 0;
                    this.searchForm.room_id = 0;
                    const children = [];
                    res.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: false
                        });
                        options_temp['children'] = children
                        return true;
                    });
                    options_temp.find(_ => _.value === selectedOptions[0])['children'] = children;
                    this.singleOptions = options_temp
                } else if (selectedOptions.length === 2) {
                    const apps = await this.getLayerList(selectedOptions[1]);
                    this.searchForm.floor_id = selectedOptions[1];
                    this.searchForm.layer_id = 0;
                    this.searchForm.room_id = 0;
                    const options_temp = [...this.singleOptions];
                    const children = [];
                    apps.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: false
                        });
                        return true;
                    });
                    const product = options_temp.find(_ => _.value === selectedOptions[0]);
                    product.children.find(_ => _.value === selectedOptions[1])['children'] = children;
                    this.singleOptions = options_temp
                } else if (selectedOptions.length === 3) {
                    const apps = await this.getVacancyList(selectedOptions[2]);
                    this.searchForm.layer_id = selectedOptions[2];
                    this.searchForm.room_id = 0;
                    const options_temp = [...this.singleOptions];
                    // const apps = await getDirectoryApp(selectedOptions[1]);
                    const children = [];
                    apps.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: true
                        });
                        return true;
                    });
                    const product = options_temp.find(_ => _.value === selectedOptions[0]);
                    const product_1 = product.children.find(_ => _.value === selectedOptions[1])
                    product_1.children.find(_ => _.value === selectedOptions[2])['children'] = children;
                    this.singleOptions = options_temp;
                } else if (selectedOptions.length == 4) {
                    this.searchForm.room_id = selectedOptions[3];
                }
            },
            
            getVillageList(){
                this.request('/community/platform.RepairWorkOrder/getVillageList', {
                    village_id: this.searchForm.village_id
                }).then(res => {
                    this.villageList = res.list
                    this.currentVillageId = this.villageList[0].village_name + '-' + this.villageList[0].village_id
                    this.getEventData();
                    this.getFinshOrder()
                    this.getPropertyRating(1);
                    this.getTodayEventCount();
                });
            },

            playVideo(url) {
                this.videoUrl = url
                this.showVideo = true
            }
        },
    }
</script>

<style lang="less" scoped>
    .bg-box {
        background-image: url(../../../../../assets/images/grid_bg.png);
        width: 100%;
        height: 100%;
        background-size: cover;
        color: #666;
        font-family: Microsoft YaHei, Arial, Helvetica, sans-serif;
        font-size: 14px;
        position: relative;
        display: flex;
        flex-direction: row;
        padding: 10px;
        color: #747b8b;
        font-size: 16px;
        overflow: hidden;
    }

    /deep/ input {
        border-style: none;
        border: none;
        outline: none;
    }

    .left_box {
        width: 22.4%;
        height: 100%;
        // background-color: #1598ED;
        margin-right: 0.63%;
        transition: 0.1s ease;
        overflow: hidden;

        .left_top_box {
            height: 25.2%;
            background: rgba(26, 25, 57, 0.8);
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;

            .a-carousel {
                width: 244px !important;
                margin-top: 2%;

                .left_icon {
                    width: 25px;
                    height: 25px;
                    //background-color: #0A8DDF;
                }

                .right_icon {
                    width: 25px;
                    height: 25px;
                    //background-color: #0A8DDF;
                }

                .swiper_box {
                    width: 244px;
                    height: 200px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    padding-top: 48px;

                    .text_1 {
                        font-size: 18px;
                        font-family: Microsoft YaHei;
                        font-weight: bold;
                        color: #FFCC00;
                        line-height: 18px;
                        position: absolute;
                        top: 5%;
                        left: 50%;
                        transform: translateX(-50%);
                        /*移动自身的一半*/
                    }

                    .border_1 {
                        width: 9px;
                        height: 9px;
                        border: 2px solid #FFFFFF;
                        border-bottom: 0px;
                        border-right: 0px;
                        opacity: 0.5;
                    }

                    .border_2 {
                        width: 9px;
                        height: 9px;
                        border: 2px solid #FFFFFF;
                        border-bottom: 0px;
                        border-left: 0px;
                        opacity: 0.5;
                        position: absolute;
                        right: 0;
                        top: 48px;
                    }

                    .border_3 {
                        width: 9px;
                        height: 9px;
                        border: 2px solid #FFFFFF;
                        border-top: 0px;
                        border-left: 0px;
                        opacity: 0.5;
                        position: absolute;
                        right: 0;
                        bottom: 0;
                    }

                    .border_4 {
                        width: 9px;
                        height: 9px;
                        border: 2px solid #FFFFFF;
                        border-top: 0px;
                        border-right: 0px;
                        opacity: 0.5;
                        position: absolute;
                        left: 0;
                        bottom: 0;
                    }

                    .item_box {
                        width: 230px;
                        height: 135px;
                        background: rgba(52, 49, 90, 0.48);
                        border: 3px solid rgba(255, 255, 255, 0.48);
                        border-radius: 20px;
                        margin: 0px auto;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;

                        .text_2 {
                            font-size: 24px;
                            font-family: Microsoft YaHei;
                            font-weight: bold;
                            color: #FFCC00;
                            line-height: 24px;
                        }

                        .text_3 {
                            font-size: 16px;
                            font-family: Microsoft YaHei;
                            font-weight: 400;
                            color: #FFFFFF;
                            line-height: 16px;
                            margin-top: 15px;
                        }
                    }

                    .text_title {
                        font-size: 18px;
                        font-family: Microsoft YaHei;
                        font-weight: bold;
                        color: #FFCC00;
                        line-height: 18px;
                        position: absolute;
                        top: -28px;
                    }
                }
            }

        }

        .left_center_box {
            height: 36.6%;
            background: rgba(26, 25, 57, 0.8);
            margin-top: 2.5%;
            display: flex;
            flex-direction: column;
            align-items: center;

            .text_title {
                font-size: 18px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #FFCC00;
                line-height: 18px;
                margin-top: 5%;
            }

            .echarts {
                width: 100%;
                height: 91%;

                .tip_box {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-evenly;
                    margin: 0px 47px;
                    margin-top: 30px;

                    .tips {
                        width: 70px;
                        height: 25px;
                        background: rgba(255, 255, 255, 0.18);
                        border-radius: 4px;
                        font-size: 12px;
                        font-family: Source Han Sans CN;
                        font-weight: 400;
                        color: #DDDDF7;
                        line-height: 25px;
                        text-align: center;
                        cursor: pointer;
                    }
                }

                .echarts_box {
                    width: 100%;
                    height: 81%;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .mini_box_1 {
                        width: 90%;
                        height: 80%;
                        position: relative;

                        .table-right {
                            width: 100%;
                            height: 95%;
                            border: 0px solid rgba(19, 60, 123, 1);
                            position: relative;

                            .table-scroll_right {
                                width: 100%;
                                height: 100%;
                                overflow-y: scroll;
                                margin-top: 4.4%;

                                .table-flex_body_right {
                                    width: 98%;
                                    display: flex;
                                    flex-direction: row;
                                    background-color: rgba(37, 84, 193, 0.27);
                                    margin: 8px 0px;

                                    .text_1 {
                                        width: 100%;
                                        text-align: center;
                                        font-size: 12px;
                                        padding: 5px 0;
                                        color: rgba(174, 207, 218, 1);
                                        text-overflow: ellipsis;
                                        overflow: hidden;
                                        word-break: break-all;
                                        border-right: 0px solid rgba(19, 60, 123, 1);
                                        border-bottom: 0px solid rgba(19, 60, 123, 1);
                                        cursor: default;
                                    }

                                    .text_1:first-of-type {
                                        width: 100%;
                                        text-align: center;
                                        font-size: 12px;
                                        padding: 5px 0;
                                        color: rgba(174, 207, 218, 1);
                                        white-space: nowrap;
                                        text-overflow: ellipsis;
                                        overflow: hidden;
                                        word-break: break-all;
                                    }
                                }

                                .table-flex_body_right:first-of-type {
                                    width: 96.5%;
                                    display: flex;
                                    flex-direction: row;
                                    background-color: rgba(44, 111, 255, 0.7);
                                    position: absolute;
                                    margin-top: -28px;

                                    .text_1 {
                                        width: 100%;
                                        text-align: center;
                                        font-size: 12px;
                                        padding: 5px 0;
                                        background-color: rgba(0, 150, 255, 0.3);
                                        color: #58AEDB;
                                        white-space: nowrap;
                                        text-overflow: ellipsis;
                                        overflow: hidden;
                                        word-break: break-all;
                                    }
                                }

                                .table-flex_body_right:first-of-type:hover {
                                    width: 96.5%;
                                    display: flex;
                                    flex-direction: row;
                                    background-color: rgba(33, 99, 129, 0.7);
                                    position: absolute;
                                    margin-top: -28px;

                                    .text_1 {
                                        width: 100%;
                                        text-align: center;
                                        font-size: 12px;
                                        padding: 5px 0;
                                        background-color: rgba(0, 150, 255, 0.3);
                                        color: #58AEDB;
                                        white-space: nowrap;
                                        text-overflow: ellipsis;
                                        overflow: hidden;
                                        word-break: break-all;
                                    }
                                }

                                .table-flex_body_right:hover {
                                    background-color: rgba(240, 171, 51, 1);

                                    .text_1 {
                                        color: rgba(0, 0, 0, 1);
                                    }
                                }
                            }
                        }
                    }

                    .tip_text_box {
                        width: 90%;
                        height: 80%;
                        margin: 15px 15px 15px 18px;
                        padding-right: 10px;
                        overflow-y: scroll;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        .tip_text {
                            font-size: 14px;
                            color: #0056af;
                        }
                    }

                }
            }
        }

        .left_top_box {
            height: 36.6%;
            background: rgba(26, 25, 57, 0.8);
            // margin-top: 2.5%;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;

            .text_title {
                font-size: 18px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #FFCC00;
                line-height: 18px;
                margin-top: 5%;
            }

            .my_echarts_1 {
                width: 100%;
                height: 80%;
                position: absolute;
                bottom: 0%;
                left: 0%;
            }
        }

        .left_bottom_box {
            height: 36.6%;
            background: rgba(26, 25, 57, 0.8);
            margin-top: 2.5%;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;

            .text_title {
                font-size: 18px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #FFCC00;
                line-height: 18px;
                margin-top: 5%;
            }

            .my_echarts_1 {
                width: 100%;
                height: 100%;
                position: absolute;
                bottom: 0%;
                left: 0%;
            }
        }

        .right_btn {
            width: 10px;
            height: 50px;
            background: #5A568C;
            opacity: 0.47;
            border-radius: 0px 10px 10px 0px;
            position: fixed;
            left: 22.55%;
            top: 50%;
            transform: translateY(-50%);
            /*移动自身的一半*/
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            cursor: pointer;
            transition: 0.1s ease;
        }
    }

    .right_box {
        width: 77.5%;
        height: 100%;

        ::-webkit-scrollbar {
            width: 6px;
            height: 16px;
            background-color: rgba(0, 62, 142, 0.3);
            right: 5px;
            display: none;
        }

        /*定义滚动条轨道 内阴影+圆角*/
        ::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            background-color: rgba(0, 62, 142, 0.3);
            display: none;
        }

        /*定义滑块 内阴影+圆角*/
        ::-webkit-scrollbar-thumb {
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
            background-color: rgba(0, 150, 255, 0.8);
            display: none;
        }

        // background-color: #1598ED;
        .top_box {
            width: 100%;
            height: 55px;
            background: rgba(26, 25, 57, 0.8);
            display: flex;
            flex-direction: row;
            align-items: center;

            .worker_order_list {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 120px;
                width: 200px;
                background-color: rgba(26, 25, 57, 0.8);
                flex-direction: column;
                margin-left: 30px;

                .name {
                    font-size: 18px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    color: #FFCC00;
                    line-height: 18px;
                }

                .value {
                    font-size: 18px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    color: #FFCC00;
                    line-height: 18px;
                    margin-top: 30px;
                }
            }

            .worker_order_list:nth-child(1) {
                margin-left: 0;
            }

            .title {
                font-size: 18px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #FFFFFF;
                line-height: 18px;
            }
        }

        .center_box {
            width: 100%;
            height: 68px;
            background: rgba(26, 25, 57, 0.8);
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 10px;

            .text_1 {
                font-size: 15px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #DDDDF7;
                line-height: 30px;
                margin-left: 15px;
            }

            .select_1 {
                width: 110px;
                height: 30px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                overflow: hidden;
                font-size: 15px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #DDDDF7;
                line-height: 30px;
                margin-left: 12px;
                border-style: none;
                border: none;
                outline: none;

                /deep/ .ant-select-selection--single {
                    height: 30px;
                    background-color: rgba(255, 255, 255, 0.1);
                    border: 0px;
                    border-style: none;
                    border: none;
                    outline: none;

                    .ant-select-selection__rendered {
                        line-height: 30px;
                    }
                }

                /deep/ .ant-cascader-input.ant-input {
                    border-style: none;
                    border: none;
                    outline: none;
                }

                /deep/ .ant-cascader-picker:focus .ant-cascader-input {
                    -webkit-box-shadow: none !important;
                    box-shadow: none !important;
                    border-style: none !important;
                    border: none !important;
                    outline: none !important;
                }

                /deep/ .ant-input:hover {
                    -webkit-box-shadow: none !important;
                    border-style: none;
                    border: none;
                    outline: none;
                }

                /deep/ .ant-input:focus {
                    -webkit-box-shadow: none !important;
                    box-shadow: none !important;
                    border-style: none !important;
                    border: none !important;
                    outline: none !important;
                }
            }

            .select_3 {
                border: none;
                outline: none;

                /deep/ .ant-cascader-input.ant-input {
                    -webkit-box-shadow: none !important;
                    border-style: none;
                    border: none;
                    outline: none;
                }

                /deep/ .ant-cascader-picker:focus .ant-cascader-input {
                    -webkit-box-shadow: none !important;
                    box-shadow: none !important;
                    border-style: none !important;
                    border: none !important;
                    outline: none !important;
                }

                /deep/ .ant-input:hover {
                    -webkit-box-shadow: none !important;
                    border-style: none;
                    border: none;
                    outline: none;
                }

                /deep/ .ant-input:focus {
                    -webkit-box-shadow: none !important;
                    box-shadow: none !important;
                    border-style: none !important;
                    border: none !important;
                    outline: none !important;
                }
            }

            .input_1 {
                width: 160px;
                height: 30px;
                line-height: 30px;
                background: rgba(255, 255, 255, 0.1);
                border: 0px;
                border-radius: 10px;
                margin-left: 12px;
                text-align: center;
                color: #ddddf7;
                border-style: none;
                border: none;
                outline: none;

                /deep/ .ant-cascader-input.ant-input {
                    -webkit-box-shadow: none !important;
                    border-style: none;
                    border: none;
                    outline: none;
                }

                /deep/ .ant-cascader-picker:focus .ant-cascader-input {
                    -webkit-box-shadow: none !important;
                    box-shadow: none !important;
                    border-style: none !important;
                    border: none !important;
                    outline: none !important;
                }

                /deep/ .ant-input:hover {
                    -webkit-box-shadow: none !important;
                    border-style: none;
                    border: none;
                    outline: none;
                }

                /deep/ .ant-input:focus {
                    -webkit-box-shadow: none !important;
                    box-shadow: none !important;
                    border-style: none !important;
                    border: none !important;
                    outline: none !important;
                }
            }

            .select_time {
                width: 300px;
                height: 30px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;

                /deep/ .ant-input {
                    width: 300px;
                    height: 30px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    border: 0px;
                    border-style: none;
                    border: none;
                    outline: none;
                }

                /deep/ .ant-calendar-range-picker-separator {
                    line-height: 23px !important;
                    color: rgba(221, 221, 247, 1) !important;
                }

                /deep/ .ant-calendar-range-picker-input {
                    color: rgba(221, 221, 247, 1);
                }

                // 选择时间框
                /deep/ .ant-calendar-picker-container {
                    position: absolute !important;
                    top: 135px !important;
                }
            }

            .primaty_btn {
                padding: 2px 20px;
                background: #2C6FFF;
                border-radius: 50px;
                text-align: center;
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #FFFFFF;
                margin-left: 10px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
        }


        .bottom_box {
            height: 67.5%;
            margin-top: 10px;
            overflow-y: scroll;

            .table_1 {
                /deep/ .ant-table-thead>tr>th {
                    border: 0px;
                    background-color: rgba(26, 25, 57, 0.8);
                    color: rgba(221, 221, 247, 1);
                }

                /deep/ .ant-table-tbody>tr:nth-of-type(odd) {
                    background: rgba(7, 7, 23, 0.8);
                }

                /deep/ .ant-table-tbody>tr:nth-of-type(even) {
                    background: rgba(23, 22, 52, 0.8);
                }

                /deep/ .ant-table-tbody>tr:hover {
                    background: rgba(7, 7, 23, 0.8) !important;
                }

                /deep/ .ant-table-tbody>tr>td {
                    white-space: nowrap;
                    border: 0px;
                    color: rgba(221, 221, 247, 1);
                    max-width: 50px;
                    text-overflow: ellipsis;
                    line-clamp: 2;
                    overflow: hidden;
                }

                /deep/ .ant-table-row-cell-break-word {
                    // text-overflow: -o-ellipsis-lastline;
                    // overflow: hidden;
                    // text-overflow: ellipsis;
                    // display: -webkit-box;
                    // -webkit-line-clamp: 2;
                    // line-clamp: 2;
                    // -webkit-box-orient: vertical;
                }

                /deep/ .ant-table-tbody>tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)>td {
                    background: rgba(255, 255, 255, 0) !important;
                }
            }
        }
    }

    // right 弹层
    .content_box {
        .item_box {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
            flex-wrap: wrap;

            .list {
                display: flex;
                flex-direction: row;
                align-items: center;
                width: 50%;

                .text_1 {
                    font-size: 16px;
                    line-height: 30px;
                    flex-shrink: 0;
                    font-weight: 700;
                }

                .text_2 {
                    font-size: 16px;
                    line-height: 30px;
                    color: #aaaaaa;
                }
            }
        }

        .list_1 {
            display: flex;
            flex-direction: row;

            .text_1 {
                font-size: 16px;
                line-height: 30px;
                font-weight: 700;
                flex-shrink: 0;
            }

            .text_2 {
                font-size: 16px;
                line-height: 30px;
                color: #aaaaaa;
                overflow: hidden;
            }
        }

        .list_2 {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            width: 50%;

            .text_1 {
                font-size: 16px;
                line-height: 30px;
                font-weight: 700;
                flex-shrink: 0;
            }

            .img_1 {
                width: 60px;
                height: 60px;
                margin-left: 10px;
                margin-top: 10px;
            }

            .img_1:first-of-type {
                width: 60px;
                height: 60px;
                margin-left: 0px;
            }
        }

        .list_3 {
            display: flex;
            flex-direction: row;
            align-items: center;

            .text_1 {
                font-size: 16px;
                line-height: 30px;
                font-weight: 700;
            }

            .text_2 {
                font-size: 16px;
                line-height: 30px;
                color: red;
            }
        }

        .title {
            font-size: 16px;
            line-height: 30px;
            font-weight: 700;
        }

        .list_4 {
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            .list_box {
                width: 80%;

                .list {
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    .text_1 {
                        font-size: 16px;
                        line-height: 30px;
                        flex-shrink: 0;
                    }

                    .text_2 {
                        font-size: 16px;
                        line-height: 30px;
                        color: #aaaaaa;
                        overflow: hidden;
                    }
                }

                .list_2 {
                    display: flex;
                    flex-direction: row;
                    align-items: flex-start;

                    .text_1 {
                        font-size: 16px;
                        line-height: 30px;
                        flex-shrink: 0;
                    }

                    .img_1 {
                        width: 60px;
                        height: 60px;
                        margin-left: 10px;
                    }

                    .img_1:first-of-type {
                        width: 60px;
                        height: 60px;
                        margin-left: 0px;
                    }
                }
            }

            .text_3 {
                width: 50%;
                font-size: 16px;
                line-height: 30px;
                color: rgb(109, 136, 255);
                text-align: right;
                cursor: pointer;
            }
        }

        .list_5 {
            border: 1px solid rgb(49, 88, 255);
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            border-radius: 5px;
            margin-top: 10px;

            .tab_box {
                display: flex;
                flex-direction: column;
                width: 20px;

                .tab {
                    width: 40px;
                    margin: 0 auto;
                    line-height: 24px;
                    font-size: 16px;
                    background-color: rgb(49, 88, 255);
                    border-radius: 5px;
                    color: #FFFFFF;
                    padding: 10px;
                    border: 1px solid rgb(49, 88, 255);
                    cursor: pointer;
                }

                .tab:last-of-type {
                    margin-top: -10px;
                }
            }

            .right_box1 {
                width: 100%;
                display: flex;
                justify-content: center;

                .select_2 {
                    height: 30px;
                }
            }

            .right_box2 {
                width: 100%;

                .input_area {
                    border: 0px;
                    width: calc(100% - 21px);
                    height: 100%;
                    margin-left: 21px;
                }
            }
        }
    }

    .time_line {
        .list_4 {
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            .list_box {
                width: 100%;

                .list {
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    .text_1 {
                        font-size: 16px;
                        line-height: 30px;
                        flex-shrink: 0;
                    }

                    .text_2 {
                        font-size: 16px;
                        line-height: 30px;
                        color: #aaaaaa;
                    }
                }

                .list_2 {
                    display: flex;
                    flex-direction: row;
                    align-items: flex-start;

                    .text_1 {
                        font-size: 16px;
                        line-height: 30px;
                        flex-shrink: 0;
                    }

                    .img_1 {
                        width: 60px;
                        height: 60px;
                        margin-left: 10px;
                    }

                    .img_1:first-of-type {
                        width: 60px;
                        height: 60px;
                        margin-left: 0px;
                    }
                }
            }

            .text_3 {
                width: 50%;
                font-size: 16px;
                line-height: 30px;
                color: rgb(109, 136, 255);
                text-align: right;
            }
        }
    }

    // 输入框
    /deep/ .ant-table-placeholder {
        position: relative;
        z-index: 1;
        margin-top: -1px;
        padding: 16px 16px;
        color: rgba(0, 0, 0, 0.25);
        font-size: 14px;
        text-align: center;
        background: rgba(0, 0, 0, 0);
        border-top: 0px solid #e8e8e8;
        border-bottom: 0px solid #e8e8e8;
        border-radius: 0 0 2px 2px;
    }

    /deep/ .ant-empty-description {
        color: #DDDDF7;
    }

    // 选择时间框
    /deep/ .ant-calendar-picker-container {
        position: absolute !important;
        top: 135px !important;
    }

    /* For demo */
    .ant-carousel>.slick-slide {
        text-align: center;
        height: 160px;
        line-height: 160px;
        background: #364d79;
        overflow: hidden;
    }

    .ant-carousel>.custom-slick-arrow {
        width: 25px;
        height: 25px;
        font-size: 25px;
        color: #fff;
        background-color: rgba(31, 45, 61, 0.11);
        opacity: 0.3;
    }

    .ant-carousel>.custom-slick-arrow:before {
        display: none;
    }

    .ant-carousel>.custom-slick-arrow:hover {
        opacity: 0.5;
    }

    ::-webkit-scrollbar {
        width: 6px;
        height: 16px;
        background-color: rgba(0, 62, 142, 0.3);
        right: 5px;
        // display: none;
    }

    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        background-color: rgba(0, 62, 142, 0.3);
        // display: none;
    }

    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
        background-color: rgba(44, 111, 255, 0.7);
        // display: none;
    }

    // /deep/ .ant-table td { white-space: nowrap; }
    /deep/ .ant-pagination-prev .ant-pagination-item-link {
        background: rgba(7, 7, 23, 0.5);
        color: #FFFFFF !important;
    }

    /deep/ .ant-pagination-next .ant-pagination-item-link {
        background: rgba(7, 7, 23, 0.5);
        color: #FFFFFF !important;
    }

    /deep/ .ant-pagination-item {
        background: rgba(7, 7, 23, 0.5);
    }

    /deep/ .ant-pagination-item a {
        color: #FFFFFF !important;
    }
</style>