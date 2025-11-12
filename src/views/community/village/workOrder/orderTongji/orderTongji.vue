<template>
    <div class="bg-box">
        <div class="left_box" :style="right_show?'':'width:0%;'">
            <div class="left_top_box">
                <div class="text_title">工单处理数据</div>
                <div id="main1" class="my_echarts_1"></div>
            </div>
            <div class="left_center_box">
                <div class="text_title">物业评分</div>
                <div class="echarts">
                    <div class="tip_box">
                        <div class="tips" @click="selectde_start(item.type-1)"
                            :style="index==num_1?'background: #2C6FFF;color: #FFFFFF;':''"
                            v-for="(item,index) in tipsItem">
                            {{item.name}}
                        </div>
                    </div>
                    <div class="echarts_box">
                        <div class="mini_box_1" v-if="property_rating && property_rating != ''">
                            <div class="table-right">
                                <div class="table-scroll_right">
                                    <div class="table-flex_body_right" v-for="(item,index) in property_rating">
                                        <div class="text_1" @mouseenter="enters($event,items.title,index)"
                                            @mouseleave="leaver()" v-for="(items,indexs) in item">{{items.title}}</div>
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
                <div id="main2" class="my_echarts_1"></div>
            </div>

            <div class="right_btn" @click="rightshow" :style="right_show?'':'left:10px'">{{right_show?'<':'>'}}
            </div>
        </div>
        <div class="right_box" :style="right_show?'':'width:100%'">
            <div class="top_box">
                <img src="../../../../../assets/images/grid_1.png" style="margin: 15px;" alt="">
                <div class="title">工单处理中心</div>
            </div>
            <div class="top_box" style="height: 130px; margin-top: 10px;">
                <div class="worker_order_list" v-for="(item, index) in work_label_list" :key="index">
                    <div class="name" style="text-align: center;"><div>{{item.name}}</div>
                        <div v-if="item.name=='超时工单'" style="font-size: 12px;margin: 10px 15px 0px 15px;color: #959595;">指的是在及时率开启下，未及时结单的订单</div>
                    </div>
    
                    <div class="value" v-if="item.name=='超时工单'" style="margin-top: 10px;">{{item.value}}/起</div>
                    <div class="value" v-else >{{item.value}}/起</div>
                </div>
            </div>
            <div class="center_box">
                <div class="text_1" style="flex-shrink: 0;">分类：</div>
                <a-select class="select_1" default-value="全部" style="width: 120px" @change="handleChange">
                    <a-icon style="color: #FFFFFF;" slot="suffixIcon" type="caret-down" />
                    <a-select-option value="0">
                        全部
                    </a-select-option>
                    <a-select-option v-for="(item,index) in subject_list" :value="item.category_id">
                        {{item.subject_name}}
                    </a-select-option>
                </a-select>
                <a-select class="select_1" v-model="secondCate" style="width: 100px;" @change="handleChange2">
                    <a-icon style="color: #FFFFFF;" slot="suffixIcon" type="caret-down" />
                    <a-select-option value="0">
                        全部
                    </a-select-option>
                    <a-select-option v-for="(item,index) in options" :value="item.value">
                        {{item.label}}
                    </a-select-option>
                </a-select>

                <a-select class="select_1" default-value="筛选条件" style="width: 150px;color: #86869D;"
                    @change="handleChange3">
                    <a-icon style="color: #FFFFFF;" slot="suffixIcon" type="caret-down" />
                    <a-select-option v-for="(item,index) in shaixuanList" :value="item.value">
                        <a-tooltip :title="item.name">
                            {{item.name}}
                        </a-tooltip>
                    </a-select-option>
                </a-select>
                <a-input class="input_1" placeholder="请输入" v-model="search.search" v-if="is_show"
                    style="width: 140px;" />
                <a-cascader class="input_1" :options="options1" :load-data="loadDataFunc1" :placeholder="'请选择'+$store.getters.config.room_name"
                    change-on-select @change="setVisionsFunc1" style="width: 140px;border: none"
                    v-model="search.room_ids" v-else-if="is_room" />

                <a-select v-else class="select_1" v-model="search.public_id" style="width: 140px"
                    @change="publicAreaChange">
                    <a-select-option v-for="(item,index) in publicAreaList" :value="item.public_area_id">
                        <a-tooltip :title="item.public_area_name">
                            {{item.public_area_name}}
                        </a-tooltip>
                    </a-select-option>
                </a-select>
                <a-select class="select_1" default-value="全部状态" style="width: 135px" @change="handleChange4">
                    <a-icon style="color: #FFFFFF;" slot="suffixIcon" type="caret-down" />
                    <a-select-option value=0>
                        全部状态
                    </a-select-option>
                    <a-select-option value=10>
                        未指派
                    </a-select-option>
                    <a-select-option value=20>
                        已指派
                    </a-select-option>
                    <a-select-option value=30>
                        处理中
                    </a-select-option>
                    <a-select-option value=40>
                        已办结
                    </a-select-option>
                    <a-select-option value=50>
                        已撤回
                    </a-select-option>
                    <a-select-option value=60>
                        已关闭
                    </a-select-option>
                    <a-select-option value=70>
                        已评价
                    </a-select-option>
                    <a-select-option value="timely_1">
                        超时工单
                    </a-select-option>
                    <a-select-option v-if="jz_open" value=16>
                        转供暖商
                    </a-select-option>
                    <a-select-option v-if="jz_open" value=17>
                        转开发商
                    </a-select-option>
                </a-select>
                <div class="text_1" style="flex-shrink: 0;">上报时间：</div>
                <a-range-picker :placeholder="['请选择开始时间','请选择结束时间']" separator="至" class="select_time"
                    @change="onChange" style="width: 300px">
                    <a-icon slot="suffixIcon" type="none" />
                </a-range-picker>
                <div class="btn" @click="findAll()">查询</div>
                <div class="btn" @click="addWorkerOrder()">添加工单</div>
                <div class="btn" @click="excelExport()">Excel导出</div>
            </div>
            <div class="bottom_box">
                <a-table class="table_1" :columns="columns" :data-source="data" :pagination="pagination"
                    :loading="loading" @change="handleTableChange" :rowKey="record=>record.order_id">
                    <span slot="operation" slot-scope="text, record">
                        <a @click="get_detail(record.order_id)">详情</a>
                    </span>
                    <span slot="status_txt" slot-scope="text, record">
                        <span :style="'color:'+record.color ">{{record.status_txt}}</span>
                    </span>
                    <span slot="order_content" slot-scope="text, record">
                        <a-tooltip placement="topLeft" v-if="record.order_content.length > 8">
                            <template slot="title">
                                <span>{{record.order_content}}</span>
                            </template>
                            <span>{{record.order_content}}</span>
                        </a-tooltip>
                        <span v-else>{{record.order_content}}</span>
                    </span>
                </a-table>
            </div>
        </div>
        <a-drawer :title="title0614" width="700" :maskClosable="false" :closable="true" :visible="visible"
            @close="onClose">
            <a-tabs type="card" default-active-key="1" @change="callback" v-if="visible">
                <a-tab-pane key="1" tab="工单详情">
                    <div class="content_box">
                        <div class="item_box">
                            <template v-for="(item,index) in detail.order_arr">
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
                            <div class="text_2" :style="'color:'+detail.order_detail.event_status_color">
                                {{detail.order_detail.event_status_txt}}
                            </div>
                        </div>
                        <div class="title">处理记录</div>
                        <div class="list_4">
                            <div class="list_box">
                                <div class="list" v-for="(item,index) in detail.order_detail.log_info.children">
                                    <div class="text_1">{{item.title}}：</div>
                                    <div class="text_2">{{item.content?item.content:'无'}}</div>
                                </div>
                                <div class="list_2">
                                    <div class="text_1">图例：</div>
                                    <viewer
                                        v-if="detail.order_detail.log_info && detail.order_detail.log_info.imgs && detail.order_detail.log_info.imgs[0]"
                                        :images="detail.order_detail.log_info.imgs">
                                        <img class="img_1" v-for="(src,index) in detail.order_detail.log_info.imgs"
                                            :src="src" :key="index" style="margin-left: 5px">
                                    </viewer>
                                    <div v-else>无</div>
                                </div>
                            </div>
                        </div>
                        <div class="list_5" v-if="show">
                            <div class="tab_box">
                                <div class="tab" @click="changeCurrent(index)"
                                    :style="num == index?'':'background-color: #FFFFFF;color: rgb(49, 88, 255);z-index:10'"
                                    v-for="(item,index) in tab_arr">{{item.name}}</div>
                            </div>
                            <div class="right_box1" v-if="num == 0">
                                <div style="width: 120px; margin-left: -150px;" v-if="detail.order_detail.event_status>=20">在已指派的员工无法处理时，可以重新指派其他员工去处理</div>
                                <a-button type="primary" ghost @click="$refs.createModal.add(1,0)"
                                    style="width: 160px;margin-top: 20px;margin-left: 10px;">
                                    {{worker_name}}
                                </a-button>
                            </div>
                            <div class="right_box2" v-if="num == 1">
                                <a-input class="input_area" placeholder="请输入回复内容" v-model="content_1" type="textarea" />
                            </div>
                        </div>
                    </div>
                    <div :style="{
                        bottom: 0,
                        width: '100%',
                        borderTop: '1px solid #e8e8e8',
                        padding: '10px 16px',
                        textAlign: 'right',
                        left: 0,
                        background: '#fff',
                        borderRadius: '0 0 4px 4px',
                      }">
                        <a-button style="marginRight: 8px" @click="onClose" v-if="is_footer">
                            取消
                        </a-button>
                        <a-button type="primary" @click="onSubmit" v-if="is_footer">
                            确定
                        </a-button>
                    </div>
                </a-tab-pane>
                <a-tab-pane key="2" tab="处理记录">
                    <div class="loading" v-if="event_log_arr.length == 0">
                        加载中...
                    </div>
                    <a-timeline-item class="time_line" v-for="(item2,index2) in event_log_arr">
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
        <choose-tree :height='800' :width="1000" ref="createModal" @ok="handleOks" />
        <addWorkerOlder :workVisible="showWorker" :is_lantiancom="is_lantiancom" @closeWorker="closeWorker" />
        <a-modal
              title="确认导出工单数据？"
              :visible="visibleExport"
              :confirm-loading="exportLoading"
              :closable="false"
              :maskClosable="false"
              :cancel-button-props="cancelbuttonprops"
              @ok="exportHandleOk"
              @cancel="exportHandleCancel"
            >
              <p>{{ confirmText }}</p>
        </a-modal>

        <a-modal :visible="showVideo" :footer="null" @cancel="showVideo=false, videoUrl=''">
            <video style="width: 100%; height: 100%;" autoplay :src="videoUrl" />
        </a-modal>
    </div>
</template>

<script>
    import echarts from 'echarts' //引入echarts
    import villageApi from '@/api/community/village'
    import 'viewerjs/dist/viewer.css'
    import Viewer from 'v-viewer'
    import Vue from 'vue'
    import chooseTree from "../repairCate/chooseTree.vue"
    import {
        getSystemName
    } from '@/utils/util'
    import TagSelectOption from "../../../../../components/TagSelect/TagSelectOption";
    import addWorkerOlder from "./addWorkerOlder.vue"
	import store from '@/store';
    Vue.use(Viewer)
    let columns = [
            {title: '序号', dataIndex: 'order_id', width: '5%'},
            {title: '工单详情', dataIndex: 'order_content', width: '10%', scopedSlots: {customRender: 'order_content'}},
            {title: '工单类目', dataIndex: 'subject_name', width: '10%'},
            {title: '上报分类', dataIndex: 'cate_name', width: '10%'},
            {title: '上报位置', dataIndex: 'address_txt', width: '15%'},
            {title: '上报人员', dataIndex: 'name', width: '6%'},
            {title: '手机号码', dataIndex: 'phone', width: '10%'},
            {title: '上报时间', dataIndex: 'add_time_txt', width: '10%'},
            {title: '状态  ', dataIndex: 'status_txt', width: '9%', scopedSlots: {customRender: 'status_txt'}},
            {title: '重新打开过', dataIndex: 'reopened_txt'},
            {title: '操作', dataIndex: 'operation', scopedSlots: {customRender: 'operation'}},
        ];

    export default {
        name: "orderTongji",
        components: {
            TagSelectOption,
            chooseTree,
            addWorkerOlder
        },
        data() {
            return {
                videoParams: {},
                secondCate: '全部',
                right_show: true,
                data: [],
                show: 0,
                is_footer: 0,
                columns,
                pagination: {},
                loading: false,
                editingKey: '',
                visible: false,
                search: {
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
                },
                workers: [],
                worker_id: 0,
                worker_name: '请选择处理人员',
                event_log_arr: [],
                detail: {
                    order_detail_arr: [],
                    event_log_arr: [],
                    event_log_img: [],
                    order_detail: {
                        area_id: '',
                        area_type: 0,
                        bind_id: 0,
                        cat_fid: 0,
                        cat_fname: '',
                        cat_id: 0,
                        cat_name: '',
                        event_status: 0,
                        event_status_color: '',
                        event_status_txt: '',
                        grid_member_id: 0,
                        grid_range_id: 0,
                        last_time: 0,
                        name: '',
                        now_role: 0,
                        order_address: '',
                        order_content: '',
                        order_go_by_center: 0,
                        order_id: 0,
                        order_imgs: [],
                        order_status: 0,
                        order_time: 1,
                        order_time_txt: '',
                        order_type: 0,
                        order_worker_id: 0,
                        phone: '',
                        polygon_name: '',
                        uid: 0,
                        log_info: [],
                    },
                    event_log: [],
                },
                childrenDrawer: false,
                tab_arr: [{
                        name: '指派给',
                    },
                    {
                        name: '直接回复',
                    }
                ],
                selected: '请选择处理人员',
                num: 0,
                num_1: '',
                content_1: '',
                todayCount: [],
                rate: 0,
                subject_list: [], //工单类目列表
                f_cat_list: [],
                select_default: '全部',
                // 页面高度
                screenHeight: document.body.clientHeight,
                scroll_height: 650,
                tipsItem: [], //物业评分tips
                property_rating: [], //物业评分列表
                series: [],
                legend: [],
                xAxis: [],
                options: [],
                options1: [],
                is_show: true,
                tokenName: '',
                sysName: '',
                delayRequest: false,
                work_label_list: [],

                shaixuanList: [{
                    value: 'name',
                    name: '上报人员'
                }, {
                    value: 'phone',
                    name: '手机号码'
                }, {
                    value: 'address',
                    name: '上报位置-'+store.getters.config.house_name+'名称'
                }, {
                    value: 'public_area',
                    name: '上报位置-公共区域'
                }],

                is_room: false,
                publicAreaList: [],
                showWorker: false,
                title0614: '',
                confirmText: '如果数据多可能要多等待一会哦。',
                visibleExport: false,
                exportLoading: false,
                cancelbuttonprops: {
                    props: {
                        disabled: false
                    }
                },
                jz_open: 0,
                videoUrl: '',
                showVideo: false,
                is_lantiancom:0,               
            }
        },
        mounted() {
            this.get_today_event_count();
            this.event_data();
            this.get_subject_list(0);
            this.getPropertyRating(1);
            this.fetch();
            document.title = '工单处理中心'
            this.scroll_height = this.screenHeight - 55 - 68 - 150;
            this.getFinshOrder()
        },
        inject: ['reload'],
        methods: {
            addWorkerOrder() {
                this.showWorker = true
            },
            closeWorker(flag) {
                this.showWorker = false
                if (flag) {
                    this.fetch(this.search);
                }
            },
            enters(event, title, index) {

            },
            leaver() {

            },

            callback(key) {
                console.log(key);
                if (key == 2) {
                    this.seerecord(this.detail.order_detail.order_id)
                }
            },
            getFinshOrder() {
                this.request(villageApi.getFinshOrder, {}).then((res) => {
                    let finshOrder = []
                    res.map(v => {
                        finshOrder.push({
                            name: v.subject_name,
                            value: v.rate
                        })
                    })
                    this.myEchars2(finshOrder)
                });
            },
            myEcharts1() {
                // 基于准备好的dom，初始化echarts实例
                const myChart1 = this.$echarts.init(document.getElementById('main1'));
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
                myChart1.setOption(option);
            },

            myEchars2(data) {
                const myChart2 = this.$echarts.init(document.getElementById('main2'));
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
                myChart2.setOption(option);
            },
            selectde_start(index) {
                this.num_1 = index;
                this.getPropertyRating(index + 1);
            },
            onSubmit() {
                if (this.num == 1) {
                    if (this.content_1 == '') {
                        this.$message.warning('请输入回复内容');
                        return false;
                    } else {
                        this.request(villageApi.updateWorkOrder, {
                            order_id: this.detail.order_detail.order_id,
                            log_content: this.content_1,
                            event_status_type: 'center_reply_submit',
                        }).then((res) => {
                            console.log(res);
                            this.get_order_detail(this.detail.order_detail.order_id);
                            this.$message.success('回复成功');
                        });
                    }
                } else {
                    if (this.worker_id == 0) {
                        this.$message.warning('请选择指派的工作人员');
                        return false;
                    } else {
                        this.request(villageApi.updateWorkOrder, {
                            type: 1,
                            order_id: this.detail.order_detail.order_id,
                            worker_id: this.worker_id,
                            order_content: '',
                            event_status_type: 'center_assign_work',
                        }).then((res) => {
                            console.log(res);
                            this.get_order_detail(this.detail.order_detail.order_id);
                            this.$message.success('指派成功');
                        });
                    }
                }
            },
            handleTableChange(pagination, filters, sorter) {
                console.log(pagination);
                const pager = {
                    ...this.pagination
                };
                pager.current = pagination.current;
                this.pagination = pager;
                this.fetch({
                    results: pagination.pageSize,
                    page: pagination.current,
                    sortField: sorter.field,
                    sortOrder: sorter.order,
                    ...filters,
                    ...this.search,
                });
            },
            fetch(params = {}) {
                this.loading = true;
                this.request(villageApi.RepairOrderList,
                    params
                ).then((data) => {
                    const pagination = {
                        ...this.pagination
                    };
                    this.jz_open = data.jz_open;
                    if (data.jz_open) {
                        if (data.uploadVideo) {
                            this.videoParams.jz_open = data.jz_open
                            this.videoParams.uploadVideo = data.uploadVideo
                            this.videoParams.uploadVideoMax = data.uploadVideoMax
                            this.videoParams.is_pic_video = data.is_pic_video
                            this.videoParams.uploadImageMax = data.uploadImageMax
                        }
                    }
                    pagination.total = data.total;
                    pagination.pageSize = data.limit;
                    this.loading = false;
                    this.data = data.list;
                    this.is_lantiancom=data.is_lantiancom ? data.is_lantiancom:0;
                    this.pagination = pagination;
                });
            },
            findAll() {
                this.fetch(this.search);
            },
            //今日上报事件数量
            get_today_event_count() {
                this.request(villageApi.getTongji, {

                }).then((res) => {
                    this.todayCount = res;
                    this.work_label_list = [{
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
                    console.log('todayCount', res);
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
                param.type = type;
                this.request(villageApi.getPropertyRating, param).then((res) => {
                    console.log('getPropertyRating', res);
                    this.tipsItem = res.list;
                    this.property_rating = res.info;
                })
            },
            //物业工单统计
            event_data() {
                this.request(villageApi.orderTongji, {

                }).then((res) => {
                    console.log('orderTongji', res);
                    this.series = res.series;
                    this.legend = res.legend;
                    this.xAxis = res.xAxis;
                    this.myEcharts1();
                })
            },
            //物业工单类目列表
            get_subject_list(subject_id = 0) {
                this.request(villageApi.getSubject, {
                    id: subject_id
                }).then((res) => {
                    this.subject_list = res;
                })
            },
            get_event_center() {
                this.request(villageApi.getWorkerOrderLists, {

                }).then((res) => {
                    console.log('sdfds', res)
                })
            },
            get_detail(order_id) {
                this.title0614 = '查看序号【' + order_id + '】详情';
                this.worker_name = '请选择处理人员';
                this.visible = true;
                this.content_1 = '';
                this.num = 0;
                this.show = 0;
                this.tab_arr=[{
                        name: '指派给',
                    },
                    {
                        name: '直接办结回复',
                    }
                ];
                this.get_order_detail(order_id);
                //this.worker_list();
            },
            get_order_detail(order_id) {
                this.request(villageApi.getWorkOrderDetail, {
                    order_id: order_id
                }).then((res) => {
                    console.log('wsedre', res);
                    this.detail = res;
                    if (res.order_detail.event_status >= 30) {
                        this.show = 0;
                        this.is_footer = 0;
                    } else {
                        if(res.order_detail.event_status>=20){
                            this.tab_arr=[{
                                    name: '重新指派给',
                                },
                                {
                                    name: '直接办结回复',
                                }
                            ];
                        }
                        this.show = 1;
                        this.is_footer = 1;
                    }
                    if (res.order_detail.showTab == 4) {
                        this.show = 0;
                        this.is_footer = 0;
                    }
                });
            },
            worker_list() {
                this.request(villageApi.getWorkers, {}).then((res) => {
                    this.workers = res;
                });
            },
            changeCurrent(index) {
                this.num = index
                if (index == 0) {
                    this.content_1 = '';
                }
            },
            rightshow() {
                this.right_show = !this.right_show
            },
            seerecord(order_id) {
                this.request(villageApi.repairGetOrderLog, {
                    order_id: order_id
                }).then((res) => {
                    console.log('log_list', res);
                    this.event_log_arr = res.log.info;
                    console.log('this.detail.event_log_arr', this.detail.event_log_arr);
                });
            },
            showDrawer() {
                this.visible = true;
            },
            onChildrenDrawerClose() {
                this.childrenDrawer = false;
                this.visible = true;
            },
            onClose() {
                this.visible = false;
                this.event_log_arr = []
            },
            onChange(date, dateString) {
                console.log(date, dateString)
                this.search.start_time = dateString[0];
                this.search.end_time = dateString[1];
            },
            Change() {

            },
            handleChange(value, key, column) {
                if (value * 1 == 0) {
                    this.options = []
                    this.search.cat_fid = 0
                    this.search.cat_id = 0
                    this.search.category_id = 0
                    this.secondCate = '全部'
                    return
                }
                this.search.category_id = value;
                this.search.cat_fid = value
                this.secondCate = '全部'
                this.search.cat_id = ''
                this.getCate(value);
            },
            handleChange2(value, key, column) {
                if (value * 1 == 0) {
                    this.secondCate = '全部';
                    this.search.cat_id = 0;
                } else {
                    this.options.map(v => {
                        if (v.value == value) {
                            this.secondCate = v.label
                            this.search.cat_id = v.value
                        }
                    })
                }
            },
            handleChange3(value, key, column) {
                this.search.type = value;
                this.search.public_id = '请选择区域';
                this.search.single_id = 0;
                this.search.floor_id = 0;
                this.search.layer_id = 0;
                this.search.room_id = 0;
                this.search.room_ids = [];
                this.search.search = '';
                if (value == 'address') {
                    this.getSingleListByVillage('room');
                    this.is_show = false;
                    this.is_room = true
                } else if (value == 'public_area') {
                    this.getSingleListByVillage('public_area');
                    this.is_show = false;
                    this.is_room = false;
                } else {
                    this.is_show = true;
                    this.is_room = false;
                }
            },
            handleChange4(value, key, column) {
                this.search.event_status = value;
            },

            publicAreaChange(value, key, column) {
                this.search.public_id = value;
            },
            edit(key) {
                this.visible = true;
            },
            save(key) {
                const newData = [...this.data];
                const newCacheData = [...this.cacheData];
                const target = newData.filter(item => key === item.key)[0];
                const targetCache = newCacheData.filter(item => key === item.key)[0];
                if (target && targetCache) {
                    delete target.editable;
                    this.data = newData;
                    Object.assign(targetCache, target);
                    this.cacheData = newCacheData;
                }
                this.editingKey = '';
            },
            cancel(key) {
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                this.editingKey = '';
                if (target) {
                    Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
                    delete target.editable;
                    this.data = newData;
                }
            },
            handleOks(value) {
                let bb = value[0],
                    aa = bb.split('-'),
                    str = '';
                if (aa.length > 0) {
                    for (var i = 0; i < aa.length; i++) {
                        if (i >= 1) {
                            if (i === aa.length - 1) {
                                str += aa[i];
                            } else {
                                str += aa[i] + "-";
                            }
                        }
                    }
                }
                this.worker_id = aa[0];
                this.worker_name = str;
            },
            //物业工单类别列表
            getCate(category_id = 0) {
                this.request(villageApi.getCate, {
                    category_id: category_id
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
                        this.options = array;
                    }
                });
            },

            //子分类列表
            getFidCate(type_id, type) {
                return new Promise(resolve => {
                    this.request(villageApi.getFidCate, {
                        type_id: type_id,
                        type: type
                    }).then(res => {
                        console.log('+++++++Single', res)
                        console.log("resolve", resolve)
                        resolve(res);
                    });
                });
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
                    const options_temp = [...this.options];
                    const res = await this.getFidCate(selectedOptions[0], 'subject_id');
                    this.search.type_id = selectedOptions[0];
                    console.log("res", res)
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
                    this.options = options_temp
                } else if (selectedOptions.length === 2) {
                    const apps = await this.getFidCate(selectedOptions[1], 'parent_id');
                    this.search.cat_fid = selectedOptions[1];
                    const options_temp = [...this.options];
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
                    product.children.find(_ => _.value === selectedOptions[1])['children'] = children;
                    this.options = options_temp
                } else if (selectedOptions.length === 3) {
                    this.search.cat_id = selectedOptions[2];
                }
            },
            // 楼栋号
            getSingleListByVillage(type) {
                this.request(villageApi.getSingleListByVillage, {
                    xtype: type
                }).then(res => {
                    console.log('+++++++Single', res)
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
                            this.options1 = array
                        } else {
                            this.publicAreaList = res
                        }
                    }
                });
            },
            // 单元楼
            getFloorList(id) {
                return new Promise(resolve => {
                    this.request(villageApi.getFloorList, {
                        pid: id
                    }).then(res => {
                        console.log('+++++++Single', res)
                        console.log("resolve", resolve)
                        resolve(res);
                    });
                });
            },
            // 楼层
            getLayerList(id) {
                return new Promise(resolve => {
                    this.request(villageApi.getLayerList, {
                        pid: id
                    }).then(res => {
                        console.log('+++++++Single', res)
                        if (res) {
                            resolve(res);
                        }
                    });
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
                            resolve(res);
                        }
                    });
                })
            },
            async loadDataFunc1(selectedOptions) {
                const targetOption = selectedOptions[selectedOptions.length - 1];
                targetOption.loading = true;
                setTimeout(function() {
                    targetOption.loading = false;
                }, 100)
            },
            // 处理加载漏洞单元（选择、编辑时可用）
            async setVisionsFunc1(selectedOptions) {
                console.log('setVisionsFunc1', selectedOptions);
                if (selectedOptions.length === 1) {
                    const options_temp = [...this.options1];
                    const res = await this.getFloorList(selectedOptions[0]);
                    this.search.single_id = selectedOptions[0];
                    this.search.floor_id = 0;
                    this.search.layer_id = 0;
                    this.search.room_id = 0;
                    console.log("res", res)
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
                    this.options1 = options_temp
                } else if (selectedOptions.length === 2) {
                    const apps = await this.getLayerList(selectedOptions[1]);
                    this.search.floor_id = selectedOptions[1];
                    this.search.layer_id = 0;
                    this.search.room_id = 0;
                    const options_temp = [...this.options1];
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
                    this.options1 = options_temp
                } else if (selectedOptions.length === 3) {
                    const apps = await this.getVacancyList(selectedOptions[2]);
                    this.search.layer_id = selectedOptions[2];
                    this.search.room_id = 0;
                    const options_temp = [...this.options1];
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
                    this.options1 = options_temp;
                    console.log("_this.options", this.options1)
                } else if (selectedOptions.length == 4) {
                    this.search.room_id = selectedOptions[3];
                }
            },

            // 导出Excel
            excelExport() {
                this.visibleExport = true;
                this.exportLoading = false;
                this.cancelbuttonprops.props.disabled = false;
            },
            exportHandleOk() {
                this.exportLoading = true;
                this.cancelbuttonprops.props.disabled = true;
                this.request(villageApi.excelExportRepairWorksOrder, this.search).then((res) => {
                    console.log('res', res)
                    if (res.url && res.url.length > 10) {
                        this.exportLoading = false;
                        this.visibleExport = false;
                        window.location.href = res.url;
                    } else {
                        this.$message.error('导出失败！')
                    }
                    this.exportLoading = false;
                    this.cancelbuttonprops.props.disabled = false;
                }).catch((error) => {
                    this.exportLoading = false;
                    this.cancelbuttonprops.props.disabled = false;
                })
            },
            exportHandleCancel() {
                this.visibleExport = false;
                this.exportLoading = false;
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

            .btn {
                width: 100px;
                height: 30px;
                background: #2C6FFF;
                border-radius: 10px;
                text-align: center;
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #FFFFFF;
                line-height: 30px;
                margin-left: 38px;
                cursor: pointer;
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
                width: 130px;

                .tab {
                    width: 130px;
                    margin: 0 auto;
                    line-height: 30px;
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
                    width: calc(100% - 7px);
                    height: 100%;
                    margin-left: 7px;
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