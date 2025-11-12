<template>
    <div class="lane_model_container">
        <a-drawer :title="modelTitle" :width="1000" :visible="visible" @close="handleSubCancel">
            <a-form-model ref="ruleForm" :model="laneForm" :rules="rules" :label-col="labelCol"
                :wrapper-col="wrapperCol">
                <div class="add_lane" style="margin-bottom: 70px;">
                    <a-form-model-item label="通道名称" prop="passage_name">
                        <a-input v-model="laneForm.passage_name" placeholder="请输入通道名称"></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="归属区域" prop="passage_area">
                        <a-select show-search placeholder="请选择" style="width: 200px" :filter-option="filterOption" :value="laneForm.passage_area"
                            @change="handleSelectChange" >
                            <a-select-option v-for="(item, index) in areaList" :value="item.id">
                                {{item.garage_num}}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    
                <a-form-model-item label="请选择所属车库" prop="garage_id">
                    <a-select show-search placeholder="请选择" style="width: 200px" :filter-option="filterGarageOption" v-model="laneForm.garage_id" @change="handleSelectGarageChange" >
                        <a-select-option v-for="(item, index) in garageList" :value="item.garage_id">
                            {{item.garage_num}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                    
                    <a-form-model-item label="通道号" prop="channel_number">
                        <a-input v-model="laneForm.channel_number" placeholder="请上输入通道号"></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="请填写设备编号" prop="device_number" v-if="park_sys_type=='D3' || park_sys_type=='A11' || park_sys_type=='HXT85' ">

                        <a-input v-model="laneForm.device_number" placeholder="请填写设备编号"></a-input>
                        <span v-if="park_sys_type=='HXT85'" > HXT85设备请填写相机ID</span>
                    </a-form-model-item>

                    <a-form-model-item label="设备MAC地址" prop="mac_address" v-if="park_sys_type=='A11' || park_sys_type=='HXT85' ||  park_sys_type=='A1' || device_detail_info*1>0">
                        <a-input v-model="laneForm.mac_address" placeholder="请填写设备MAC地址(老的A1设备可能不支持)"></a-input>
                    </a-form-model-item>
		    
                    <a-form-model-item label="车道编号" prop="d7_channelId" v-if="park_sys_type=='D7'">
                        <a-select placeholder="请选择" style="width: 200px" v-model="laneForm.d7_channelId">
                            <a-select-option v-for="(item, index) in channelList" :value="item.businessId">
                                {{item.channelName}}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="通道类型" prop="passage_direction">
                        <a-radio-group name="radioGroup" :default-value="1" v-model="laneForm.passage_direction">
                            <a-radio :value="1">入口</a-radio>
                            <a-radio :value="0">出口</a-radio>
                            <!-- <a-radio :value="2">出入口</a-radio> -->
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="车道类型" prop="passage_type"  v-if="park_sys_type=='A11'">
                        <a-radio-group name="radioGroup"  v-model="laneForm.passage_type" @change="handlePassageChange">
                            <a-radio :value="1">分开</a-radio>
                            <a-radio :value="2">共用</a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="关联车道" prop="passage_relation" v-if="park_sys_type=='A11'&&passage_relation_show==2">
                        <a-select show-search placeholder="请选择" style="width: 200px"  v-model="laneForm.passage_relation">
                            <a-select-option v-for="(item, index) in passageTypeList" :value="item.id">
                                {{item.passage_name}}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="车道编号" prop="d7_channelId" v-if="park_sys_type=='D7'">
                        <a-select placeholder="请选择" style="width: 200px" v-model="laneForm.d7_channelId">
                            <a-select-option v-for="(item, index) in channelList" :value="item.businessId">
                                {{item.channelName}}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="通道坐标" prop="long_lat">
                        <a-input :disabled="true" v-model="laneForm.long_lat" style="width: 200px;"></a-input>
                        <a-button type="primary" style="margin-left: 10px;" @click="openMap()">点击获取经纬度</a-button>
                    </a-form-model-item>
                    
                    <a-form-model-item label="标签" prop="current">
                       <a-transfer
                            :locale = "{
                               itemUnit: '', 
                               itemsUnit: '', 
                               notFoundContent: '列表为空', 
                               searchPlaceholder: '请输入搜索内容' 
                            }"
                            :titles="['未选', '已选']"
                            show-search
                            :rowKey="record => record.key"
                            :data-source="labelList"
                            :list-style="{
                                width: '210px',
                                height: '270px',
                            }"
                            :render="renderItem"
                            :show-select-all="true"
                            :target-keys="targetKeys"
                            @change="handleTransferChange">
                       </a-transfer>
                    </a-form-model-item>

                    <a-form-model-item label="音量控制" v-if="park_sys_type=='D3'|| park_sys_type=='A11'">
                        <div style="display: flex" v-for="(item, index) in deviceSetting.volume" :key="item.key" >
                            <a-col :span="13">
                                <a-time-picker
                                    :allowClear="false"
                                    :value="moment(item.start, 'HH:mm')"
                                    format="HH:mm"
                                    :disabled="item.disable_start"
                                    @change="onVolumeChange('start',$event,index)"
                                /> ~ 
                                <a-time-picker
                                    :allowClear="false"
                                    :value="moment(item.end, 'HH:mm')"
                                    format="HH:mm" 
                                    :disabled="item.disable_end"
                                    @change="onVolumeChange('end',$event,index)"
                                />
                            </a-col>
                            <a-col :span="16">
                                <a-col :span="2">
                                    <a-icon type="sound" theme="twoTone" />
                                </a-col>
                                <a-col :span="15">
                                    <a-slider v-model="item.value" :min="0" :max="9" />
                                </a-col>
                                <a-col :span="6" style="margin-left: 12px;" class="text-primary">
                                    当前音量：{{item.value}}
                                </a-col>
                            </a-col>
                        </div>
                        
                    </a-form-model-item>
                    
                    
                    <a-form-model-item label="通道状态" prop="status">
                        <a-radio-group name="radioGroup" :default-value="1" v-model="laneForm.status">
                            <a-radio :value="1">开启</a-radio>
                            <a-radio :value="2">关闭</a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="设备类型" prop="device_type"  v-if="park_sys_type=='D3'|| park_sys_type=='A11'">
                        <a-radio-group name="radioGroup" :default-value="1" v-model="laneForm.device_type">
                            <a-radio :value="1">横屏</a-radio>
                            <a-radio :value="2">竖屏</a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="网络协议" prop="device_protocol"  v-if="device_protocol_change*1>0 && (park_sys_type=='D3')">
                        <a-radio-group name="radioGroup" v-model="laneForm.device_protocol">
                            <a-radio :value="0">HTTP推送</a-radio>
                            <a-radio :value="1">自建MQTT</a-radio>
                        </a-radio-group><span style="color: red;" v-if="device_protocol_change_tips">配置自建MQTT之前请先咨询售后客服</span>
                        <div style="margin-bottom: 30px;">设备和服务器交互协议，默认选择HTTP推送，建议用HTTP推送，仅支持D3和A11设备</div>
                    </a-form-model-item>
                    <div  v-if="park_sys_type=='D3'|| park_sys_type=='A11'">
                        <a-form-model-item label="设备内网IP"  v-if="device_detail_info*1>0">
                        
                            <a-input v-model="laneForm.device_ip" placeholder="请填写设备内网ip"></a-input>
                        </a-form-model-item>
                        <a-form-model-item label="设备登录账号" prop="device_account" v-if="device_detail_info*1>0">
                        
                            <a-input v-model="laneForm.device_account" placeholder="请填写设备登录账号"></a-input>
                        </a-form-model-item>
                        <a-form-model-item label="设备登录密码" prop="device_pwd" v-if="device_detail_info*1>0">
                        
                            <a-input v-model="laneForm.device_pwd" placeholder="请填设备登录密码"></a-input>
                        </a-form-model-item>
                        
                        <a-form-model-item label="车道视频播放地址" prop="public_v_url" v-if="device_detail_info_port*1>0" >
                        
                            <a-input v-model="laneForm.public_v_url" placeholder="请输入一个可播放的视频url地址"></a-input>
                        </a-form-model-item>
                    </div>
                    <a-form-model-item label="设备登录密码" prop="device_pwd" v-if="park_sys_type=='HXT85'">
                    
                        <a-input v-model="laneForm.device_pwd" placeholder="请填设备登录密码"></a-input>
                    </a-form-model-item>
                    <!--
                    <a-form-model-item label="视频监控选项"  v-if="device_detail_info_port*1>0" style="margin-bottom: 70px;">
                        <a-select show-search placeholder="请选择一个车道视频"  v-model="laneForm.camera_channel_id">
                            <a-select-option :value="0">
                                请选择一个车道视频
                            </a-select-option>
                            <a-select-option v-for="(item, index) in camera_devices" :value="item.channel_id">
                                {{item.camera_device_all_name}}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    -->
                </div>
                <div
                    :style="{
                      position: 'absolute',
                      right: 0,
                      bottom: 0,
                      width: '100%',
                      borderTop: '1px solid #e9e9e9',
                      padding: '10px 16px',
                      background: '#fff',
                      textAlign: 'right',
                      zIndex: 1,
                    }">
                    <a-button :style="{ marginRight: '8px' }" @click="handleSubCancel">取消</a-button>
                    <a-button @click="handleSubmit()" type="primary">提交</a-button>
                </div>
            </a-form-model>
        </a-drawer>
        <a-modal
            v-if = "mapVisible"
            title="百度地图拾取经纬度"
            :visible="mapVisible"
            :width="800"
            @ok="handleMapOk"
            @cancel="handleMapCancel">
            <a-input
            style="width: 200px;"
            type="text"
            id="suggestId"
            name="address_detail"
            placeholder="请输入城市名/地区名"
            v-model="address_detail"
            class="input_style"/>
            <a-button style="margin-left:10px;" type="primary" @click="searchMap">搜索</a-button>
            <div style="color: red;margin-top: 5px;">如果直接搜索名称无法搜索，建议写全称。比如 搜索 （桂花园 ）直接搜索不到结果，我们可以加上 省市区+名称进行搜索（山东 桂花园）再搜索。</div>
            <div id="allmap" style="width:100%; height: 500px; margin-top: 10px;"></div>
        </a-modal>
    </div>
</template>

<script>
    import moment from 'moment';
    import {slider} from 'ant-design-vue';
    import Vue from 'vue';
    Vue.use(slider)
    import {Transfer} from 'ant-design-vue';
    import villageApi from '@/api/community/village';
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            modelTitle: {
                type: String,
                default: ''
            },
            lane_type: {
                type: String,
                default: ''
            },
            lane_id: {
                type: String,
                default: ''
            },
            device_protocol_change:{
                type: [Number,String],
                default: 0
            },
            device_detail_info:{
                type: [Number,String],
                default: 0
            },
            device_detail_info_port:{
                type: [Number,String],
                default: 0
            },
            device_protocol_change_tips:{
                type: [Number,String],
                default: 0
            },
            
            /*
            park_sys_type: {
                type: String,
                default: ''
            }
            */
        },
        
        watch:{
            visible: {
                immediate: true,
                handler(val){
                    this.laneForm = {
                        long_lat: '',
                        passage_area: undefined,
                        status: 1,
                        passage_direction: 1,
                        passage_type: 1,
                        device_type:1,
                        passage_relation_show:1,
                        garage_id:'',
                        park_sys_type:'',
                        mac_address:'',
                        device_protocol:0,
                        camera_channel_id:0,
                        device_ip:'',
                        device_account:'',
                        device_pwd:'',
                    };
                    if(val){
                        this.getParkDeviceSetting();
                    }
                    if(this.lane_type=='edit'){
                        this.getLaneInfo()
                    }else{
                         this.getChannelList()
                    }
                    if(this.visible && this.device_detail_info_port*1>0){
                        this.get_camera_devices()
                    }
                }
            }
        },
        
        data() {
            return {
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                laneForm: {
                    long_lat: '',
                    passage_area: undefined,
                    status: 1,
                    device_type:1,
                    passage_direction: 1,
                    passage_type: 1,
                    garage_id:'',
                    park_sys_type:'',
                    mac_address:'',
                    device_protocol:0,
                    camera_channel_id:0,
                    device_ip:'',
                    device_account:'',
                    device_pwd:'',
                    
                },
                rules: {
                    passage_name: [
                        { required: true, message: '请输入通道名称', trigger: 'blur' },
                    ],
                    channel_number: [
                        { required: true, message: '请输入通道号', trigger: 'blur' },
                    ],
                    device_number: [
                        { required: true, message: '请输入设备编号', trigger: 'blur' },
                    ],
                    garage_id: [
                        { required: true, message: '请选择一个车库', trigger: 'blur' },
                    ],
                },
                dateFormat: 'YYYY-MM-DD',
                selectedKeys: [],
                targetKeys: [],
                labelList: [],
                mapVisible: false,
                address_detail: '北京',
                userlocation: {lng: "", lat: ""},
                userLng: "",
                userLat: "",
                areaList: [],
                passageTypeList:[],
                channelList:[],
                park_sys_type:'',
                deviceSetting:[],
                inputValue1: 8,
                passage_relation_show:1,
                garageList:[],
                camera_devices:[],
            }
        },
        
        mounted(){
            this.getLabelList()  
            this.getAreaList()
        },
        components: {
            'a-transfer': Transfer
        },

        methods: {
            clearForm(){
                this.laneForm = {
                    long_lat: '',
                    passage_area: undefined,
                    status: 1,
                    passage_direction: 1,
                    passage_type: 1,
                    device_type:1,
                    passage_relation_show:1,
                    garage_id:'',
                    park_sys_type:'',
                    mac_address:'',
                    device_protocol:0,
                    camera_channel_id:0,
                    device_ip:'',
                    device_account:'',
                    device_pwd:'',
                }
                this.targetKeys = []
                this.passageTypeList=[]
                this.passage_relation_show=1
            },
            getAreaList(){
                let that = this
                that.request(villageApi.getAreaList, {}).then((res) => {
                    if(res.list){
                        that.areaList = res.list
                    }
                    if(res.area_list){
                        that.areaList=res.area_list;
                    }
                    if(res.garage_list){
                        that.garageList=res.garage_list;
                    }
                    
                })
            },
            getChannelList(){
                let that = this
                let postArr={garage_id:that.laneForm.garage_id};
                that.request(villageApi.getChannelList,postArr).then((res) => {
                    that.channelList = res.list
                    //that.park_sys_type=res.park_sys_type
                })
            },
            moment,
            get_camera_devices(){
                this.request('/community/village_api.CameraDevice/getCameraChannelList').then((res) => {
                    this.camera_devices = res.list
                }).catch(e=>{
                     this.camera_devices = [];
                 })
            },
            handleSubmit(e) {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        let that = this
                        let url = villageApi.addPassage
                        if(this.lane_type == 'edit'){
                            url = villageApi.editPassage
                        }
                        that.laneForm.deviceSetting=that.deviceSetting
                        console.log('that.laneForm',that.laneForm);
                        that.request(url, that.laneForm).then((res) => {
                            if(this.lane_type == 'edit'){
                                that.$message.success('编辑成功！')
                            } else{
                                that.$message.success('添加成功！')
                            }
                            this.$emit('closeLane', true)
                            this.clearForm()
                            this.confirmLoading = false;
                        }).catch(e=>{
                            this.confirmLoading = false;
                        })
                    } else {
                        console.log('error submit!!');
                        this.confirmLoading = false;
                        return false;
                    }
                });
            },
            handleSubCancel(e) {
                //this.$refs.ruleForm.resetFields();
                this.$emit('closeLane', false)
                this.clearForm()
            },
            
            getLaneInfo(){
                let that = this
                if(that.lane_id){
                    that.request(villageApi.getPassageInfo, {id: this.lane_id}).then((res) => {
                        that.laneForm = res
                        that.handlePassageChange()
                        that.laneForm.passage_area = res.passage_area*1 || ''
                        that.laneForm.long_lat = res.lat + ',' + res.long
                        that.targetKeys = res.passage_label.split(',')
                        that.park_sys_type=res.park_sys_type
                        that.getChannelList();
                    })
                }
            },

            //获取设备配置项
            getParkDeviceSetting(){
                let that = this
                let lane_id = 0;
                if(that.lane_id){
                    lane_id = that.lane_id
                }
                that.request(villageApi.getParkDeviceSetting, {id: lane_id}).then((res) => {
                    that.deviceSetting=res
                })
            },

            // 监听按周期结束日期选择变化
            onVolumeChange(key,e, index) {
                // 更新表单数据
                let value = moment(e).format('HH:mm');
                console.log('value',key , index,value)
                this.deviceSetting.volume[index][key] = value
                if(key == 'end'){
                    this.deviceSetting.volume[index+1]['start'] = value
                }
            },
            
            getLabelList(){
                let that = this
                that.request(villageApi.getPassageLabelList, {}).then((res) => {
                    that.labelList = []
                    res.map(v=>{
                        that.labelList.push({
                            key: v.id+'',
                            title: v.label_name
                        })
                    })
                })
            },
            
            handleSelectChange(value) {
                    this.laneForm.passage_area = value*1
                    this.areaList.map(v=>{
                        if(v.id == value){
                            this.laneForm.area_type = v.area_type
                        }
                    })
                this.$forceUpdate()
                console.log(`selected ${value}`);
            },
            
            handleSelectGarageChange(value){
                let garage_id_tmp=value*1;
                this.garageList.map(gv=>{
                        if(gv.garage_id*1 == garage_id_tmp){
                            this.park_sys_type=gv.park_sys_type;
                            this.laneForm.park_sys_type=gv.park_sys_type;
                        }
                    })
                    console.log('garage_id',value,'park_sys_type',this.park_sys_type);
                    if(this.park_sys_type=='D7' || this.park_sys_type=='d7'){
                        this.getChannelList();
                    }
            },
            
            handlePassageChange() {
                this.passage_relation_show = this.laneForm.passage_type
                this.$forceUpdate()
                if (this.laneForm.passage_type==2){
                    let that = this
                    that.request(villageApi.getPassageTypeList, that.laneForm).then((res) => {
                        console.log('gerg',res);
                        that.passageTypeList=res
                    })  
                }
                console.log('shdfkasd',this.laneForm.passage_type);
            },
            
            filterOption(input, option) {
                console.log('input',input);
                if(input){
                    return (
                        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                }
                return false;
            },
            
          filterGarageOption(input, option) {
              if(input){
                  return (
                      option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  );
              }
             return false;
          },  
            
            onDateChange(date, dateString){
                console.log(date, dateString);
            },
            
            renderItem(item) {
                const customLabel = (
                    <span class="custom-item">
                        {item.title}
                    </span>
                );
        
                return {
                    label: customLabel, // for displayed item
                    value: item.title, // for title and filter matching
                };
            },
            
            handleTransferChange(targetKeys, direction, moveKeys) {
                this.targetKeys = targetKeys;
                let work_arr = ''
                this.targetKeys.map((v, i)=>{
                    if(i<this.targetKeys.length-1){
                        work_arr += v+','
                    } else {
                        work_arr += v
                    }
                })
                this.laneForm.passage_label = work_arr
            },
            
            handleMapOk() {
                this.laneForm.long_lat = this.userLat + ',' + this.userLng
                this.mapVisible = false
            },
            
            handleMapCancel() {
                this.mapVisible = false
            },
            
            openMap(){
                this.mapVisible = true
                this.initMap()
            },
            searchMap(){
                if(this.address_detail){
                    this.initMap()
                }
            },
            initMap(){
                this.$nextTick(function () {
                    let th = this;
                    // 创建Map实例
                    // eslint-disable-next-line no-undef
                    let map = new BMap.Map("allmap");
                    // 初始化地图,设置中心点坐标，
                    // eslint-disable-next-line no-undef
                    // let point = new BMap.Point(117.155827, 36.695916); // 创建点坐标，汉得公司的经纬度坐标
                    map.centerAndZoom(th.address_detail, 15);
                    map.enableScrollWheelZoom();
                    // eslint-disable-next-line no-undef
                    var ac = new BMap.Autocomplete({
                        //建立一个自动完成的对象
                        "input": "suggestId",
                        "location": map
                    });
                    
                    let myValue;
                    ac.addEventListener("onconfirm", function (e) {
                        //鼠标点击下拉列表后的事件
                        let _value = e.item.value;
                        myValue =
                            _value.province +
                            _value.city +
                            _value.district +
                            _value.street +
                            _value.business;
                        th.address_detail = myValue;
                        setPlace();
                    });

                    function setPlace() {
                        map.clearOverlays(); //清除地图上所有覆盖物
                        function myFun() {
                            th.userlocation = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
                            map.centerAndZoom(th.userlocation, 18);
                            // eslint-disable-next-line no-undef
                            map.addOverlay(new BMap.Marker(th.userlocation)); //添加标注
                            th.userLng = th.userlocation.lng;
                            th.userLat = th.userlocation.lat;
                        }


                        // eslint-disable-next-line no-undef
                        let local = new BMap.LocalSearch(map, {
                            //智能搜索
                            onSearchComplete: myFun
                        });
                        local.search(myValue);
                        //测试输出坐标（指的是输入框最后确定地点的经纬度）
                        map.addEventListener("click", function () {
                            //经度
                            // console.log(th.userlocation);
                            // this.lng = th.userlocation.lng
                            //维度
                            // console.log(th.lat);
                            // this.lat = th.userlocation.lat
                        });
                    }

                    map.addEventListener("click", function (e) {
                        map.clearOverlays(); //清除地图上所有覆盖物
                        // eslint-disable-next-line no-undef
                        map.addOverlay(new BMap.Marker(e.point)); //添加标注
                        var opts = {
                            width: 180, // 信息窗口宽度
                            height: 60 // 信息窗口高度
                        };
                        // eslint-disable-next-line no-undef
                        var infoWindow = new BMap.InfoWindow("所选位置", opts); // 创建信息窗口对象
                        map.openInfoWindow(infoWindow, e.point);
                        th.userLng = e.point.lng;
                        th.userLat = e.point.lat; // 打开信息窗口
                    });
                });
            },
        },
    }
</script>

<style lang="less" scoped>
    .form_title{
        font-size: 14px;
        font-weight: bold;
    }
    
    .form_line{
        height: 0.5px;
        width: 100%;
        background-color: #eeeeee;
        margin: 10px 0;
    }
    
    .generation_rules{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-top: 5px;
    }
    
    .footer_button{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        // position: fixed;
        // bottom: 100;
        // right: 20;
        // z-index: 999;
    }
    
    /deep/ textarea{
        overflow-x: hidden;
        overflow-y: scroll !important;
    }

    /deep/ .text-primary {
        color: #2681f3 !important;
    }
</style>
