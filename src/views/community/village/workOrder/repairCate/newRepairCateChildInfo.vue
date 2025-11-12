<template>
    <a-drawer :title="title" :width="1100" :visible="visible" @close="handleCancel">
        <div class="package-list" >
            <a-card  style="width: 100%;min-height:550px;" :bordered="false">
                <label class="ant-card-head-title" style="font-size: 16px;margin-left: 19px;font-weight: 550;">分类设置</label>
                <div class="card-set">
                    <span class="ant-form-item-required">分类名称:</span>
                    <a-input style="width: 45%;margin-left: 24px;" placeholder="请输入分类名称" v-model="group.name"/>
                </div>
                <div class="card-set" v-if="is_timely">
                    <label class="ant-form-item-required">及时结单时间:</label>
                    <a-time-picker
                            :value="moment(group.timely_time, 'HH:mm')"
                            format="HH:mm"
                            style="width: 15%;margin-left: 8px" placeholder="请选择及时结单时间"
                            @change="onTimeChange"
                            :allowClear="false"
                    />
                    <p style="font-size: 14px;color: #a09d9d;margin-left: 85px;font-weight: 400;margin-top: 10px">格式是【小时:分钟】</p>
                </div>
                
                <div class="card-set" v-if="cate_bind_quality">
                    <label>绑定保修项目:</label>
                    <a-select
                        v-model="group.single_id"
                        show-search
                        placeholder="请选择通知人员"
                        style="width: 200px;margin-left: 8px;"
                        :options="single_list"
                        :filter-option="filterOption"
                        @focus="handleFocus"
                        @blur="handleBlur"
                        @change="handleChange"
                    ></a-select>
                    <a-select
                        v-if="group.single_id"
                        v-model="group.quality_id"
                        show-search
                        placeholder="请选择报修项目"
                        style="width: 200px;margin-left: 8px;"
                        :options="quality_list"
                        :filter-option="filterOption"
                        @change="handleChangeQuality"
                    ></a-select>
                    <p style="font-size: 14px;color: #1890ff;margin-left: 85px;font-weight: 400;margin-top: 10px" v-if="this.selectTip">{{selectTip}}</p>
                    <p style="font-size: 14px;color: #a09d9d;margin-left: 85px;font-weight: 400;margin-top: 10px" v-if="this.id">选择未绑定会解绑当前绑定关系</p>
                </div>
                <div class="card-set" v-if="cate_bind_quality">
                    <span>启用维修基金:</span>
                    <a-radio-group v-model="group.not_timely_report_switch" style="margin-left: 10px;" >
                        <a-radio :value="0">
                            禁用
                        </a-radio>
                        <a-radio :value="1" >
                            开启
                        </a-radio>
                    </a-radio-group>
                    <p style="font-size: 14px;color: #a09d9d;margin-left: 85px;font-weight: 400;margin-top: 10px">
                        默认“禁用”，若不满足“推送督查室设置” 下配置项设置，需要上报到总后台；
                        若“开启”启用维修基金功能时，满足“推送督查室设置” 下配置项设置，也不上报到总后台;
                    </p>
                </div>
                <div class="card-set" v-if="cate_bind_quality && is_supply_station != 1">
                    <span>供暖工单:</span>
                    <a-radio-group v-model="group.to_supply_station" style="margin-left: 35px;" @change="onChangeSupplyStation(group.to_supply_station)">
                        <a-radio :value="0">否</a-radio>
                        <a-radio :value="1">是</a-radio>
                    </a-radio-group>
                    <p style="font-size: 14px;color: #a09d9d;margin-left: 85px;font-weight: 400;margin-top: 10px">
                        ( 默认为否 ) ，选择是时，需要绑定供暖站小区的工单类别;
                    </p>
                </div>
                <div class="card-set" v-if="cate_bind_quality && is_supply_station != 1 && group.to_supply_station == 1 && communityInfo && communityInfo.bind_village_name">
                    <label>供暖站:</label>
                    <a-input style="width: 45%;margin-left: 50px;" placeholder="不填则默认为0" v-model="communityInfo.bind_village_name" disabled/>
                </div>
                <div class="card-set" v-if="cate_bind_quality && is_supply_station != 1 && group.to_supply_station == 1">
                    <label>供暖站分类:</label>
                    <a-select v-model="group.other_village_cate_fid" show-search
                        placeholder="请选择供暖站分类" style="width: 200px;margin-left: 22px;"
                        :options="cateList" :filter-option="filterOptionCateFId" @change="handleChangeCateFId">
                    </a-select>
                    <a-select
                        v-if="group.other_village_cate_fid" v-model="group.other_village_cate_id"
                        show-search placeholder="请选择供暖站子分类" style="width: 200px;margin-left: 8px;"
                        :options="subCateList" :filter-option="filterOptionCateId" @change="handleChangeCateId">
                    </a-select>
                </div>
                <div class="card-set">
                    <label>排序值:</label>
                    <a-input style="width: 45%;margin-left: 50px;" placeholder="不填则默认为0" v-model="group.sort"/>
                    <p style="font-size: 15px;color: #a09d9d;margin-left: 85px;font-weight: 400;margin-top: 10px;">排序值越大展示越靠前</p>
                    <!-- <span>排序值越大展示越靠前</span>-->
                </div>
                <div class="card-set">
                    <span class="ant-form-item-required">状态:</span>
                    <a-radio-group v-model="group.status" style="margin-left: 50px;" >
                        <a-radio :value="1">
                            开启
                        </a-radio>
                        <a-radio :value="2" >
                            关闭
                        </a-radio>
                    </a-radio-group>
                </div>
            </a-card>

            <a-card   style="width: 100%;height: 100%;" :bordered="false">
                <label class="ant-card-head-title" style="font-size: 16px;margin-left: 19px;font-weight: 550;">负责人设置<p style="font-size: 15px;color: #a09d9d;float: right;margin-left: 10px;font-weight: 400">(如不需要自动指派给工作人员不设置即可)</p></label>
                <div  class="card-set">
                    <label>类型:</label>
                    <a-radio-group v-model="group.type"  style="margin-left: 50px;" @change="onChange">
                        <a-radio :value="1">
                            单人
                        </a-radio>
                        <a-radio :value="2" >
                            多人
                        </a-radio>
                    </a-radio-group>
                </div>
                <div class="card-set">
                    <label>负责人:</label>
                    <a-button  icon="plus" style="margin-left: 35px;" v-if="is_show1==1" @click="$refs.createModals.add(group.type)">添加</a-button>
                    <a-button  icon="plus" style="margin-left: 35px;" v-if="is_show1==2" @click="$refs.createModal.add(group.type)">添加</a-button>
                    <a-input style="width: 100px;margin-left: 10px;border: 0px;" v-if="is_show1==2" v-model="usernmae" disabled/>
                    <a-input style="width: 100px;margin-left: 10px;border: 0px;"  hidden v-model="group.uid"/>
                </div>
                <div style="background-color: #ececec; padding: 1px; width: 95%;margin-left: 20px" v-if="is_show">
                    <a-row :gutter="0">
                        <a-col :span="3" style="width: 14.28%">
                            <a-card title="周一" :bordered="false" >
                                <a slot="extra" v-if="weeklist1[0].name!=''" @click="$refs.createModals.edit(1,group.id,scheduling.id1,group.type)"><img  style="width: 20px;" src="../../../../../assets/icon/21.png"/></a>
                                <p v-if="weeklist1[0].name==''">--</p>
                                <div v-else v-for="(item1,index) in weeklist1" style="padding-left: 20px" :key="index">
                                    <span>{{item1.time}}</span><br>
                                    <a-tooltip :trigger="['hover', 'focus']" placement="topLeft" overlay-class-name="numeric-input">
                                        <span slot="title" class="numeric-input-title">
                                         {{item1.name1}}
                                        </span>
                                        <a-input
                                            :value="item1.name"
                                            placeholder=""
                                            :max-length="20"
                                            style="width: 85px;margin-left: -10px;border: 0;text-align: center;"
                                        />
                                        <!-- <span>{{item1.name}}</span>-->
                                    </a-tooltip>

                                </div>
                            </a-card>
                        </a-col>
                        <a-col :span="3" style="width: 14.28%">
                            <a-card title="周二" :bordered="false" >
                                <a slot="extra" v-if="weeklist2[0].name!=''" @click="$refs.createModals.edit(2,group.id,scheduling.id2,group.type)"><img  style="width: 20px;" src="../../../../../assets/icon/21.png"/></a>
                                <p v-if="weeklist2[0].name==''">--</p>
                                <div v-else v-for="(item2,index) in weeklist2" style="padding-left: 20px" :key="index">
                                    <span>{{item2.time}}</span><br>
                                    <a-tooltip :trigger="['hover', 'focus']" placement="topLeft" overlay-class-name="numeric-input">
                                        <span slot="title" class="numeric-input-title">
                                         {{item2.name1}}
                                        </span>
                                        <a-input
                                            :value="item2.name"
                                            placeholder=""
                                            :max-length="20"
                                            style="width: 85px;margin-left: -10px;border: 0;text-align: center;"
                                        />
                                        <!-- <span>{{item1.name}}</span>-->
                                    </a-tooltip>
                                </div>
                            </a-card>
                        </a-col>
                        <a-col :span="3" style="width: 14.28%">
                            <a-card title="周三" :bordered="false" >
                                <a slot="extra" v-if="weeklist3[0].name!=''" @click="$refs.createModals.edit(3,group.id,scheduling.id3,group.type)"><img  style="width: 20px;" src="../../../../../assets/icon/21.png"/></a>
                                <p v-if="weeklist3[0].name==''">--</p>
                                <div v-else v-for="(item3,index) in weeklist3" style="padding-left: 20px" :key="index">
                                    <span>{{item3.time}}</span><br>
                                    <a-tooltip :trigger="['hover', 'focus']" placement="topLeft" overlay-class-name="numeric-input">
                                        <span slot="title" class="numeric-input-title">
                                         {{item3.name1}}
                                        </span>
                                        <a-input
                                            :value="item3.name"
                                            placeholder=""
                                            :max-length="20"
                                            style="width: 85px;margin-left: -10px;border: 0;text-align: center;"
                                        />
                                        <!-- <span>{{item1.name}}</span>-->
                                    </a-tooltip>
                                </div>
                            </a-card>
                        </a-col>
                        <a-col :span="3" style="width: 14.28%">
                            <a-card title="周四" :bordered="false" >
                                <a slot="extra" v-if="weeklist4[0].name!=''" @click="$refs.createModals.edit(4,group.id,scheduling.id4,group.type)"><img  style="width: 20px;" src="../../../../../assets/icon/21.png"/></a>
                                <p v-if="weeklist4[0].name==''">--</p>
                                <div v-else v-for="(item4,index) in weeklist4" style="padding-left: 20px" :key="index">
                                    <span>{{item4.time}}</span><br>
                                    <a-tooltip :trigger="['hover', 'focus']" placement="topLeft" overlay-class-name="numeric-input">
                                        <span slot="title" class="numeric-input-title">
                                         {{item4.name1}}
                                        </span>
                                        <a-input
                                            :value="item4.name"
                                            placeholder=""
                                            :max-length="20"
                                            style="width: 85px;margin-left: -10px;border: 0;text-align: center;"
                                        />
                                        <!-- <span>{{item1.name}}</span>-->
                                    </a-tooltip>
                                </div>
                            </a-card>
                        </a-col>
                        <a-col :span="3" style="width: 14.28%">
                            <a-card title="周五" :bordered="false" >
                                <a slot="extra" v-if="weeklist5[0].name!=''" @click="$refs.createModals.edit(5,group.id,scheduling.id5,group.type)"><img  style="width: 20px;" src="../../../../../assets/icon/21.png"/></a>
                                <p v-if="weeklist5[0].name==''">--</p>
                                <div v-else v-for="(item5,index) in weeklist5" style="padding-left: 20px" :key="index">
                                    <span>{{item5.time}}</span><br>
                                    <a-tooltip :trigger="['hover', 'focus']" placement="topLeft" overlay-class-name="numeric-input">
                                        <span slot="title" class="numeric-input-title">
                                         {{item5.name1}}
                                        </span>
                                        <a-input
                                            :value="item5.name"
                                            placeholder=""
                                            :max-length="20"
                                            style="width: 85px;margin-left: -10px;border: 0;text-align: center;"
                                        />
                                        <!-- <span>{{item1.name}}</span>-->
                                    </a-tooltip>
                                </div>
                            </a-card>
                        </a-col>
                        <a-col :span="3"  style="width: 14.28%">
                            <a-card title="周六" :bordered="false" >
                                <a slot="extra" v-if="weeklist6[0].name!=''" @click="$refs.createModals.edit(6,group.id,scheduling.id6,group.type)"><img  style="width: 20px;" src="../../../../../assets/icon/21.png"/></a>
                                <p v-if="weeklist6[0].name==''">--</p>
                                <div v-else v-for="(item6,index) in weeklist6" style="padding-left: 20px" :key="index">
                                    <span>{{item6.time}}</span><br>
                                    <a-tooltip :trigger="['hover', 'focus']" placement="topLeft" overlay-class-name="numeric-input">
                                        <span slot="title" class="numeric-input-title">
                                         {{item6.name1}}
                                        </span>
                                        <a-input
                                            :value="item6.name"
                                            placeholder=""
                                            :max-length="20"
                                            style="width: 85px;margin-left: -10px;border: 0;text-align: center;"
                                        />
                                        <!-- <span>{{item1.name}}</span>-->
                                    </a-tooltip>
                                </div>
                            </a-card>
                        </a-col>
                        <a-col :span="3" style="width: 14.28%">
                            <a-card title="周日" :bordered="false" >
                                <a slot="extra" v-if="weeklist0[0].name!=''" @click="$refs.createModals.edit(7,group.id,scheduling.id7,group.type)"><img  style="width: 20px;" src="../../../../../assets/icon/21.png"/></a>
                                <p v-if="weeklist0[0].name==''">--</p>
                                <div v-else v-for="(item7,index) in weeklist0" style="padding-left: 20px" :key="index">
                                    <span>{{item7.time}}</span><br>
                                    <a-tooltip :trigger="['hover', 'focus']" placement="topLeft" overlay-class-name="numeric-input">
                                        <span slot="title" class="numeric-input-title">
                                         {{item7.name1}}
                                        </span>
                                        <a-input
                                            :value="item7.name"
                                            placeholder=""
                                            :max-length="20"
                                            style="width: 85px;margin-left: -10px;border: 0;text-align: center;"
                                        />
                                        <!-- <span>{{item1.name}}</span>-->
                                    </a-tooltip>
                                </div>
                            </a-card>
                        </a-col>
                    </a-row>
                </div>
            </a-card>
            <choose-tree :height='800' :width="1000" ref="createModal" @ok="handleOks"/>
            <choose-scheduling :height='800' :width="1000" ref="createModals" @ok="handleOk"/>
			<div class="btn_footer">
                <a-button type="info" @click="handleCancel" style="margin-right:10px;">取消</a-button>
				<a-button type="primary" @click="handleSubmit" :loading="confirmLoading">确定</a-button>
			</div>
        </div>
    </a-drawer>
</template>

<script>
    import moment from 'moment';
    import configVillageApi from "@/api/community/village"
    import chooseTree from "./chooseTree.vue"
    import chooseScheduling from "./chooseScheduling.vue"

    const columns = [
        {
            title: '周一',
            dataIndex: 'cate_name',
            key: 'cate_name',
        },
        {
            title: '周二',
            dataIndex: 'sort',
            key: 'sort',
        },
        {
            title: '周三',
            dataIndex: 'cate_name',
            key: 'cate_name',
        },
        {
            title: '周四',
            dataIndex: 'sort',
            key: 'sort',
        },
        {
            title: '周五',
            dataIndex: 'cate_name',
            key: 'cate_name',
        },
        {
            title: '周六',
            dataIndex: 'sort',
            key: 'sort',
        },
        {
            title: '周日',
            dataIndex: 'cate_name',
            key: 'cate_name',
        },

    ];

    export default {
        name: 'newRepairCateChildInfo',
        components: {
            chooseTree,
            chooseScheduling
        },
        data() {
            return {
                week_show:true,
                one:'00:00~00:00',
                weeklist1:[
                    {
                        name1:'',
                        name:'',
                        time:'',
                    },
                ],
                weeklist2:[
                    {
                        name1:'',
                        name:'',
                        time:'',
                    },
                ],
                weeklist3:[
                    {
                        name1:'',
                        name:'',
                        time:'',
                    },
                ],
                weeklist4:[
                    {
                        name1:'',
                        name:'',
                        time:'',
                    },
                ],
                weeklist5:[
                    {
                        name1:'',
                        name:'',
                        time:'',
                    },
                ],
                weeklist6:[
                    {
                        name1:'',
                        name:'',
                        time:'',
                    },
                ],
                weeklist0:[
                    {
                        name1:'',
                        name:'',
                        time:'',
                    },
                ],
                scheduling:{
                    id1: [],
                    id2: [],
                    id3: [],
                    id4: [],
                    id5: [],
                    id6: [],
                    id7: [],
                },
                data:[],
                is_show:false,
                is_show1:2,
                columns,

                title: '添加工单收费类别',
                usernmae:'',
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
                value: null,
                color: '',
                visible: false,
                confirmLoading: false,
                form: this.$form.createForm(this),
                group: {
                    id: 0,
                    uid:'',
                    director_id:'',
                    name:'',
                    parent_id:0,
                    sort: '',
                    type:1,
                    status:1,
                    timely_time:'00:00',
                    single_id: 0,
                    quality_id: 0,
                    not_timely_report_switch: 0,
                    to_supply_station: 0,
                    other_village_id: 0,
                    other_village_cate_id: null,
                    other_village_cate_fid: null,
                },
                id:0,
                is_timely:false,
                cate_bind_quality:false,
                single_list: [],
                quality_list: [],
                selectTips: {},
                selectTip: "",
                is_supply_station: 0,
                communityInfo: {},
                cateList: [],
                subCateList: [],
            }
        },
        methods: {
            moment,
            onTimeChange(time, timeString) {
               this.group.timely_time= timeString;
            },
            onChangeSupplyStation(value) {
                console.log(`onChangeSupplyStation ${value}`);
                if (value == 1) {
                    this.getBindVillageRepairCate();
                } else {

                }
            },
            handleChange(value) {
                console.log(`selected ${value}`);
                this.group.quality_id = 0;
                this.selectTip = '';
                if (value > 0) {
                    this.getSingleCommunityQualityList(value)
                }
            },
            handleChangeCateFId(value) {
                console.log('handleChangeCateFId', value)
                this.group.other_village_cate_fid = value;
                this.group.other_village_cate_id = null;
                if (value > 0) {
                    this.getBindVillageRepairCate(value)
                }
            },
            handleChangeCateId(value) {
                console.log('handleChangeCateId', value)
                this.group.other_village_id = value;
                this.$forceUpdate();
            },
            handleChangeQuality(value) {
                console.log(`selectedQuality ${value}`);
                this.selectTip = this.selectTips && this.selectTips[value] ?  this.selectTips[value] : '';
            },
            handleBlur() {
                console.log('blur');
            },
            handleFocus() {
                console.log('focus');
            },
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            filterOptionCateFId(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            filterOptionCateId(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            add(parent_id) {
                this.scheduling={
                    id1: [],
                    id2: [],
                    id3: [],
                    id4: [],
                    id5: [],
                    id6: [],
                    id7: [],
                }
                this.title = '添加工单类别'
                this.visible = true
                this.usernmae=''
                this.is_show=false
                this.is_show1=2
                this.week_show=true
                this.selectTip = '';
                this.group= {
                    id: 0,
                    name:'',
                    sort: '',
                    type:1,
                    uid:'',
                    director_id:'',
                    parent_id:parent_id,
                    status:1,
                    timely_time:'00:00',
                    single_id: 0,
                    quality_id: 0,
                    not_timely_report_switch: 0,
                };
                this.is_supply_station = 0;
                this.communityInfo = {};
                this.cateList = [];
                this.subCateList = [];

                this.weeklist1=[
                    {
                        name1:'',
                        name:'',
                        time:'',
                    },
                ]
                this.weeklist2=[
                    {
                        name1:'',
                        name:'',
                        time:'',
                    },
                ]
                this.weeklist3=[
                    {
                        name1:'',
                        name:'',
                        time:'',
                    },
                ]
                this.weeklist4=[
                    {
                        name1:'',
                        name:'',
                        time:'',
                    },
                ]
                this.weeklist5=[
                    {
                        name1:'',
                        name:'',
                        time:'',
                    },
                ]
                this.weeklist6=[
                    {
                        name1:'',
                        name:'',
                        time:'',
                    },
                ]
                this.weeklist0=[
                    {
                        name1:'',
                        name:'',
                        time:'',
                    },
                ]
                this.isTimely();
                this.getCommunityQualitySingleList();
            },
            edit(id) {
                this.week_show=false
                this.visible = true
                this.id = id
                this.selectTip = '';
                
                this.is_supply_station = 0;
                this.communityInfo = {};
                this.cateList = [];
                this.subCateList = [];

                this.scheduling={
                    id1: [],
                    id2: [],
                    id3: [],
                    id4: [],
                    id5: [],
                    id6: [],
                    id7: [],
                }
                this.weeklist1=[
                    {
                        name1:'',
                        name:'',
                        time:'',
                    },
                ]
                this.weeklist2=[
                    {
                        name1:'',
                        name:'',
                        time:'',
                    },
                ]
                this.weeklist3=[
                    {
                        name1:'',
                        name:'',
                        time:'',
                    },
                ]
                this.weeklist4=[
                    {
                        name1:'',
                        name:'',
                        time:'',
                    },
                ]
                this.weeklist5=[
                    {
                        name1:'',
                        name:'',
                        time:'',
                    },
                ]
                this.weeklist6=[
                    {
                        name1:'',
                        name:'',
                        time:'',
                    },
                ]
                this.weeklist0=[
                    {
                        name1:'',
                        name:'',
                        time:'',
                    },
                ]
                this.isTimely();
                this.getCommunityQualitySingleList();
                this.getCateInfo()
                if (this.id > 0) {
                    this.title = '编辑工单类别'
                } else {
                    this.title = '添加工单类别'
                }
            },
            isTimely(){
                this.request(configVillageApi.newRepairIsTimely).then((res) => {
                    this.is_timely=res.is_timely;
                    this.cate_bind_quality=res.cate_bind_quality;
                    this.is_supply_station=res.is_supply_station;
                    this.communityInfo=res.communityInfo;
                    console.log('this.newRepairIsTimely', res)
                })
            },
            getBindVillageRepairCate(parent_id = 0){
                this.request(configVillageApi.getBindVillageRepairCate, {'parent_id' : parent_id}).then((res) => {
                    if (parent_id > 0) {
                        this.subCateList = res.list
                    } else {
                        this.cateList = res.list
                    }
                    console.log('this.cateList', this.cateList)
                    console.log('this.subCateList', this.subCateList)
                })
            },
            getCommunityQualitySingleList(){
                this.request(configVillageApi.getCommunityQualitySingleList).then((res) => {
                    this.single_list = res.list;
                })
            },
            getSingleCommunityQualityList(single_id, quality_id = 0){
                this.request(configVillageApi.getSingleCommunityQualityList, {single_id: single_id, quality_id: quality_id}).then((res) => {
                    this.quality_list = res.list;
                    this.selectTips = res.selectTips;
                    console.log('this.quality_list', this.quality_list)
                    console.log('this.selectTips', this.selectTips)
                    if (quality_id > 0) {
                        this.group.quality_id = quality_id;
                        this.selectTip = this.selectTips && this.selectTips[quality_id] ?  this.selectTips[quality_id] : '';
                    }
                    console.log('group', this.group)
                })
            },
            getCateInfo(){
                this.request(configVillageApi.getCateInfo, {id: this.id}).then((res) => {
                        let quality_id = res.quality_id;
                        this.group=res;
                        console.log('getCateInfo-res', res)
                        this.group.quality_id = 0;
                        if (res.single_id > 0) {
                            this.getSingleCommunityQualityList(res.single_id, quality_id)
                        }
                        if (res.other_village_cate_fid > 0 && res.other_village_cate_id > 0) {
                            this.getBindVillageRepairCate();
                            this.getBindVillageRepairCate(res.other_village_cate_fid);
                        }
                        if (res.type==2){
                            this.is_show=true
                            this.is_show1=1
                            this.usernmae=''
                            this.scheduling=res.scheduling;
                            if (res.director_id != '' && res.director_id.length>0){
                                this.request(configVillageApi.getDirectorLists,{'id':res.director_id})
                                    .then((res) => {
                                        let ii0=0;
                                        let ii1=0;
                                        let ii2=0;
                                        let ii3=0;
                                        let ii4=0;
                                        let ii5=0;
                                        let ii6=0;
                                        res.forEach((v, i) => {
                                            this.week_show=false
                                            if (v.type == 0){
                                                ii0=ii0+1;
                                                this.weeklist0.push(v.child)
                                                if (ii0==1){
                                                    this.$delete(this.weeklist0,0)
                                                    ii0=ii0+1;
                                                }
                                            }else if(v.type == 1){
                                                ii1=ii1+1;
                                                this.weeklist1.push(v.child)
                                                if (ii1==1){
                                                    this.$delete(this.weeklist1,0)
                                                    ii1=ii1+1;
                                                }
                                            }else if(v.type == 2){
                                                this.weeklist2.push(v.child)
                                                ii2=ii2+1;
                                                if (ii2==1){
                                                    this.$delete(this.weeklist2,0)
                                                    ii2=ii2+1;
                                                }
                                            }else if(v.type == 3){
                                                this.weeklist3.push(v.child)
                                                ii3=ii3+1;
                                                if (ii3==1){
                                                    this.$delete(this.weeklist3,0)
                                                    ii3=ii3+1;
                                                }
                                            }else if(v.type == 4){
                                                this.weeklist4.push(v.child)
                                                ii4=ii4+1;
                                                if (ii4==1){
                                                    this.$delete(this.weeklist4,0)
                                                    ii4=ii4+1;
                                                }
                                            }else if(v.type== 5){
                                                this.weeklist5.push(v.child)
                                                ii5=ii5+1;
                                                if (ii5==1){
                                                    this.$delete(this.weeklist5,0)
                                                    ii5=ii5+1;
                                                }
                                            }else if(v.type == 6){
                                                this.weeklist6.push(v.child)
                                                ii6=ii6+1;
                                                if (ii6==1){
                                                    this.$delete(this.weeklist6,0)
                                                    ii6=ii6+1;
                                                }
                                            }
                                        })
                                    })
                            }else{
                                this.week_show=true
                            }
                        }else{
                            this.is_show=false
                            this.is_show1=2
                            this.usernmae=res.usernmae
                        }
                    })
            },
            handleSubmit() {
                if(this.is_timely){
                    if(!this.group.timely_time || (Number(this.group.timely_time.split(':')[0]) <= 0 && Number(this.group.timely_time.split(':')[1]) <= 0)){
                        this.$message.error('请选择及时结单时间（大于0）');
                        return false;
                    }
                }else{
                    this.group.timely_time='';
                }
                this.confirmLoading = true
                this.group.scheduling= this.scheduling;
                let url=configVillageApi.addCate;
                if(this.id>0){
                    this.group.id= this.id;
                    url=configVillageApi.editCate;
                }
                if (this.group.to_supply_station == 1 && this.communityInfo.bind_village_id > 0) {
                    this.group.other_village_id = this.communityInfo.bind_village_id
                }
                this.request(url, this.group)
                    .then((res) => {
                        if(this.id>0){
                            this.$message.success('编辑成功')
                        } else {
                            this.$message.success('添加成功')
                        }
                        setTimeout(() => {
                            this.form = this.$form.createForm(this)
                            this.visible = false
                            this.confirmLoading = false
                            this.$emit('ok')
                        }, 1500)
                    })
                    .catch((error)=>{
                        this.confirmLoading = false
                    })
            },
            onChange(e){
                let radio_value=e.target.value
                if (radio_value==1){
                    this.is_show=false
                    this.is_show1=2
                }else{
                    this.is_show=true
                    this.is_show1=1
                    this.week_show=true
                }
            },
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.id = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            handleOks(value){
                let bb=value[0]
                let aa=bb.split('-')
                this.usernmae=aa[1]
                this.group.uid=aa[0]

            },
            handleOk(value){
                console.log('value',value)
                if (value != '' && value.length>0){
                    value.forEach((vv, ii) => {
                        if (vv.type==1){
                            this.scheduling.id1=vv.id
                            this.weeklist1=[
                                {
                                    name1:'',
                                    name:'',
                                    time:'',
                                },
                            ]
                        }else if(vv.type==2){
                            this.scheduling.id2=vv.id
                            this.weeklist2=[
                                {
                                    name1:'',
                                    name:'',
                                    time:'',
                                },
                            ]
                        }else if(vv.type==3){
                            this.scheduling.id3=vv.id
                            this.weeklist3=[
                                {
                                    name1:'',
                                    name:'',
                                    time:'',
                                },
                            ]
                        }else if(vv.type==4){
                            this.scheduling.id4=vv.id
                            this.weeklist4=[
                                {
                                    name1:'',
                                    name:'',
                                    time:'',
                                },
                            ]
                        }else if(vv.type==5){
                            this.scheduling.id5=vv.id
                            this.weeklist5=[
                                {
                                    name1:'',
                                    name:'',
                                    time:'',
                                },
                            ]
                        }else if(vv.type==6){
                            this.scheduling.id6=vv.id
                            this.weeklist6=[
                                {
                                    name1:'',
                                    name:'',
                                    time:'',
                                },
                            ]
                        }else if(vv.type==7){
                            this.scheduling.id7=vv.id
                            this.weeklist0=[
                                {
                                    name1:'',
                                    name:'',
                                    time:'',
                                },
                            ]
                        }
                        this.request(configVillageApi.getDirectorLists,{'id':vv.id})
                            .then((res) => {
                                let ii0=0;
                                let ii1=0;
                                let ii2=0;
                                let ii3=0;
                                let ii4=0;
                                let ii5=0;
                                let ii6=0;
                                res.forEach((v, i) => {
                                    this.week_show=false
                                    if (v.type == 0){
                                        ii0=ii0+1;
                                        this.weeklist0.push(v.child)
                                        if (ii0==1){
                                            this.$delete(this.weeklist0,0)
                                            ii0=ii0+1;
                                        }
                                    }else if(v.type == 1){
                                        ii1=ii1+1;
                                        this.weeklist1.push(v.child)
                                        if (ii1==1){
                                            this.$delete(this.weeklist1,0)
                                            ii1=ii1+1;
                                        }
                                    }else if(v.type == 2){
                                        this.weeklist2.push(v.child)
                                        ii2=ii2+1;
                                        if (ii2==1){
                                            this.$delete(this.weeklist2,0)
                                            ii2=ii2+1;
                                        }
                                    }else if(v.type == 3){
                                        this.weeklist3.push(v.child)
                                        ii3=ii3+1;
                                        if (ii3==1){
                                            this.$delete(this.weeklist3,0)
                                            ii3=ii3+1;
                                        }
                                    }else if(v.type == 4){
                                        this.weeklist4.push(v.child)
                                        ii4=ii4+1;
                                        if (ii4==1){
                                            this.$delete(this.weeklist4,0)
                                            ii4=ii4+1;
                                        }
                                    }else if(v.type== 5){
                                        this.weeklist5.push(v.child)
                                        ii5=ii5+1;
                                        if (ii5==1){
                                            this.$delete(this.weeklist5,0)
                                            ii5=ii5+1;
                                        }
                                    }else if(v.type == 6){
                                        this.weeklist6.push(v.child)
                                        ii6=ii6+1;
                                        if (ii6==1){
                                            this.$delete(this.weeklist6,0)
                                            ii6=ii6+1;
                                        }
                                    }
                                })
                            })
                    })
                }
            },
        },
        // head-style="background-color: #f7f7f7;border-bottom: 0px solid #e8e8e8;"
    }
</script>
<style scoped>
    /* .ant-form-item label {
        width: 50px;
    } */
    .ant-card-body{padding: 20px 10px 20px 10px;}
    .tip-txt {
        margin-left:4px;font-size: 12px;
    }
    p {
        margin-top: 0;
        margin-bottom: 1em;
        margin-left: 30px;
    }
    .add-box-tip {
        text-align: -webkit-center;
        padding: 0 6px;
        margin-left: 8px;
        border-radius: 15px;
        border: none;
    }
    
    .ant-card-head {
        min-height: 48px;
        margin-bottom: -1px;
        padding: 0 24px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
        font-size: 16px;
        background: transparent;
        border-bottom: 0px solid #e8e8e8;
        border-radius: 2px 2px 0 0;
        zoom: 1;
    }
    .card-set{
        margin-bottom: 15px;
        margin-left: 24px;
    }
    .flex_1 {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .font_icon {
        display: block;
        color: red;
        font-size: 20px;
        margin-top: 5px;
    }
	
	.btn_footer{
		width: 85%;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		height: 50px;
		margin-top: 20px;
	}

</style>