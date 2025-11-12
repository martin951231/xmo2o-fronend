<template>
    <a-modal :title="modelTitle" :width="1100" :visible="visible" :confirm-loading="confirmLoading" @ok="handleSubmit"
        @cancel="handleSubCancel">

        <div style="margin-bottom: 15px;font-size: 16px;font-weight: bold;margin-left: 50px;" v-if="vehicleForm.is_car_stored_func==1 && vehicleForm.stored_balance>0" >储值卡余额：<span style="color: green;">{{vehicleForm.stored_balance}}</span> 元</div>
        <a-form-model ref="ruleForm" :model="vehicleForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <div class="add_space">
                <a-form-model-item label="车辆类型" prop="car_type" class="formitemclass">
                    <a-select show-search placeholder="请选择" style="width: 300px" :filter-option="filterOption" :value="vehicleForm.car_type"
                        @change="(value)=>handleSelectChange(value, 'car_type')">
                        <a-select-option v-for="(item,index) in car_type_list" :value="item.car_type" :key="item.car_type">
                            {{item.label}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                
               <a-form-model-item label="车牌号码" prop="province" class="formitemclass">
                    <a-select show-search placeholder="请选择" mode="combobox"  style="width: 100px" :filter-option="filterOption" :value="vehicleForm.province"
                        @change="(value)=>handleSelectChange(value, 'province')">
                        <a-select-option v-for="(item,index) in city_arr" :value="item" :key="item">
                            {{item}}
                        </a-select-option>
                    </a-select>
                    <a-input style="width: 200px;" placeholder="请输入车牌号" v-model="vehicleForm.car_number" />
                </a-form-model-item>
                
                <a-form-model-item label="绑定对象" prop="binding_type" class="formitemclass">
                    <a-select show-search placeholder="请选择" style="width: 300px" :filter-option="filterOption" :value="vehicleForm.binding_type"
                        @change="(value)=>handleSelectChange(value, 'binding_type')">
                        <a-select-option v-for="(item,index) in bind_type_list" :value="item.binding_type" :key="item.binding_type">
                            {{item.label}}
                        </a-select-option>
                    </a-select>
                    <p> 审核状态选择通过时，此项必选！</p>
                </a-form-model-item>
                
                <a-form-model-item label="绑定房间" prop="room_data" v-if="vehicleForm.binding_type==1 && visible"  class="formitemclass">
                    <a-cascader style="width: 300px;" :options="options" :load-data="loadDataFunc" class="cascader_style margin_left_10"    
                        placeholder="请选择房间" change-on-select @change="setVisionsFunc" :value="vehicleForm.roomArr"/>
                </a-form-model-item>
                
                <a-form-model-item label="绑定业主" prop="pigcms_id" v-if="vehicleForm.binding_type==2"  class="formitemclass">
                    <div style="display: flex; flex-direction: column; margin-top: 5px;">
                        <a-input style="width: 300px;" @change = 'searchUser()' placeholder="手机号或业主姓名搜索业主" v-model="searchVal" />
                        <a-select :open="true" show-search placeholder="请选择" style="width: 300px;" :filter-option="filterOption" :value="vehicleForm.pigcms_id" v-if="searchUserList.length>0"
                            @change="(value)=>handleSelectChange(value, 'pigcms_id')">
                            <a-select-option @change="(value)=>handleSelectChange(value, 'pigcms_id')" v-for="(item,index) in searchUserList" :value="item.pigcms_id" :key="item.pigcms_id">
                                {{item.name}}
                            </a-select-option>
                        </a-select>
                        <p> 审核状态选择通过时，此项必选！</p>
                    </div>
                </a-form-model-item>
                
               <!-- <a-form-model-item label="绑定业主" prop="pigcms_id" v-if="vehicleForm.binding_type==2 && searchUserList.length>0">
                    <a-select show-search placeholder="请选择" style="width: 300px" :filter-option="filterOption" :value="vehicleForm.pigcms_id"
                        @change="(value)=>handleSelectChange(value, 'pigcms_id')">
                        <a-select-option @change="(value)=>handleSelectChange(value, 'pigcms_id')" v-for="(item,index) in searchUserList" :value="item.pigcms_id">
                            {{item.name}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item> -->
                
                <a-form-model-item label="与业主关系" prop="relationship"  class="formitemclass" v-if="vehicleForm.binding_type!=0" >
                    <a-select show-search placeholder="请选择" style="width: 300px" :filter-option="filterOption" :value="vehicleForm.relationship"
                        @change="(value)=>handleSelectChange(value, 'relationship')">
                        <a-select-option v-for="(item,index) in relationship" :value="item.key" :key="item.key">
                            {{item.label}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>

                <a-form-model-item label="姓名" prop="car_user_name" v-if="is_show || vehicleForm.binding_type==0"  class="formitemclass">
                    <a-input :maxLength="18" v-model="vehicleForm.car_user_name" placeholder="请输入姓名" style="width: 300px" ></a-input>
                </a-form-model-item>

                <a-form-model-item label="手机号" prop="car_user_phone" v-if="is_show || vehicleForm.binding_type==0"  class="formitemclass">
                    <a-input-number v-model="vehicleForm.car_user_phone" placeholder="请输入手机号" style="width: 300px"  ></a-input-number>
                </a-form-model-item>

                <a-form-model-item label="车库" prop="garage_id"  class="formitemclass" v-if="is_garage_multiple==1">
                    <a-select show-search placeholder="请选择" mode="multiple"  option-label-prop="label"  optionFilterProp="children" style="width: 380px"  v-model="vehicleForm.garage_id"
                              @change="handleSelectGarageChange">
                        <a-select-option v-for="(item,index) in garage_list" :value="item.garage_id" :label="item.garage_num" :key="item.garage_id">
                            {{item.garage_num}}
                        </a-select-option>
                    </a-select>
                     <p> 审核状态选择通过时，此项必选！</p>
                </a-form-model-item>
                
                <a-form-model-item label="车库" prop="garage_id"  class="formitemclass" v-if="is_garage_multiple<1">
                    <a-select show-search placeholder="请选择" style="width: 320px" :filter-option="filterOption" :value="vehicleForm.garage_id"
                              @change="(value)=>handleSelectChange(value, 'garage_id')">
                        <a-select-option v-for="(item,index) in garage_list" :value="item.garage_id" :key="item.garage_id">
                            {{item.garage_num}}
                        </a-select-option>
                    </a-select>
                     <p> 审核状态选择通过时，此项必选！</p>
                </a-form-model-item>
                
                <a-form-model-item label="车位号" prop="car_position_id"  class="formitemclass">
                    <a-select @popupScroll="handlePopupScroll" @search="handleSearchChange" show-search placeholder="请选择车位号" style="width: 400px"  mode="multiple" optionFilterProp="children" option-label-prop="label" v-model="vehicleForm.car_position_id" @change="selectPosition" >
                        <a-select-option v-for="(item,index) in positionSelect"  :label="item.position_num" :value="item.position_id" :key="item.position_id">
                            {{item.position_num}}【{{item.garage_num}}】
                        </a-select-option>
                    </a-select>
                    <div >
                        <a-tag color="red" v-if="position_bind_car.text1" style="font-size: 14px;" v-for="(item_str,index) in position_bind_info" >{{item_str}}</a-tag>
                        
                    </div>
                </a-form-model-item>
                
                <a-form-model-item label="停车卡号" prop="car_stop_num"  class="formitemclass" v-if="park_sys_type!='third_ai_park'">
                    <a-input v-model="vehicleForm.car_stop_num" placeholder="请上输入停车卡号" style="width: 300px"></a-input>
                </a-form-model-item>
               <!--
                <a-form-model-item label="停车到期时间" prop="end_time" class="formitemclass" v-if="false">
                    <a-date-picker v-if="vehicleForm.end_time && visible" placeholder="请选择停车到期时间" :disabled="disabled" :value="moment(vehicleForm.end_time, dateFormat)" @change="onDateChange" />
                    <a-date-picker v-if="!vehicleForm.end_time && visible" placeholder="请选择停车到期时间" :disabled="disabled" @change="onDateChange" />

                </a-form-model-item>
             -->
                
                <a-form-model-item label="停车卡类" prop="parking_car_type"  class="formitemclass">
                    <a-select show-search placeholder="请选择停车卡类" style="width: 300px" :filter-option="filterOption" :value="vehicleForm.parking_car_type"
                        @change="(value)=>handleSelectChange(value, 'parking_car_type')">
                        <a-select-option v-for="(item,index) in parking_car_type_arr" :value="item.key" :key="item.key">
                            {{item.label}}
                        </a-select-option>
                    </a-select>
                    <div class="label_desc_1122" v-if="parking_car_type_mark">{{parking_car_type_mark}}</div>
                </a-form-model-item>
                
                <a-form-model-item label="车辆颜色" prop="car_color" class="formitemclass">
                    <a-select show-search placeholder="请选择车辆颜色" style="width: 300px" :filter-option="filterOption" :value="vehicleForm.car_color"
                        @change="(value)=>handleSelectChange(value, 'car_color')">
                        <a-select-option v-for="(item,index) in car_color_list" :value="item.id" :key="item.id">
                            {{item.lable}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                
                <a-form-model-item label="品牌型号" prop="car_brands" class="formitemclass">
                    <a-select show-search placeholder="请选择车辆型号" style="width: 300px" :filter-option="filterOption" :value="vehicleForm.brands_type"
                              @change="(value)=>handleSelectChange(value, 'brands_type')">
                        <a-select-option v-for="(item,index) in brands_type_list" :value="item.brand_name" :key="item.brand_name">
                            {{item.brand_name}}
                        </a-select-option>
                    </a-select>
                    <a-input style="width: 290px" v-model="vehicleForm.brands" placeholder="请输入品牌型号"></a-input>
                </a-form-model-item>
                
                <a-form-model-item label="车辆设备号" prop="equipment_no" class="formitemclass" v-if="park_sys_type!='third_ai_park'">
                    <a-input v-model="vehicleForm.equipment_no" placeholder="请输入车辆设备号"></a-input>
                </a-form-model-item>
                
                <a-form-model-item v-if="vehicle_type == 'edit'" label="审核状态" prop="examine_status" class="formitemclass">
                    <a-radio-group name="radioGroup" :default-value="1" v-model="vehicleForm.examine_status">
                        <a-radio :value="1">通过</a-radio>
                        <a-radio :value="2">拒绝</a-radio>
                    </a-radio-group>
                </a-form-model-item>
                
                <a-form-model-item v-if="vehicle_type == 'edit'" label="审核说明" prop="explain" class="formitemclass">
                    <a-textarea style="padding: 5px width:300px; height: 100px; resize:none;" placeholder="请输入" v-model="vehicleForm.examine_response" />
                </a-form-model-item>
                
            </div>
        </a-form-model>
    </a-modal>

</template>

<script>
    import moment from 'moment';
    import villageApi from '@/api/community/village';
    import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
	import store from '@/store';
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
            vehicle_type: {
                type: String,
                default: ''
            },
            car_id: {
                type: String,
                default: ''
            }
        },
        
        watch:{
            car_id: {
                immediate: true,
                handler (val) {
                    this.getSingleListByVillage()
                    this.parking_car_type_mark='';
                    this.position_bind_car={text1:'',text2:'',text3:'',text4:'',text5:''};
                    this.position_bind_info=[];
                    if(this.vehicle_type=='edit'){
                        this.getVehicleInfo();
                    }else{
                        this.is_show = true;
                        this.disabled=false;
                    }
                }
            },
            visible:{
                immediate: true,
                handler (val) {
                    if(val){
                        this.position_bind_info=[];
                        this.position_bind_car={text1:'',text2:'',text3:'',text4:'',text5:''};
                        this.choice_data=[];
                        this.is_show=false;
                    }
                }
            }
        },
        mounted(){
            this.getAddCarConfig()
        },
        
        data() {
            return {
                locale,
                disabled:false,
                confirmLoading: false,
                labelCol: { span: 6 },
                wrapperCol: { span: 16 },
                vehicleForm: {
                    garage_id: '请选择车库',
                    car_type: '',
                    province: '',
                    car_number: '',
                    binding_type: 0,
                    brands_type:'奥迪',
                    brands:'',
                    relationship: '请选择与业主关系',
                    car_position_id: [],
                    car_stop_num: '',
                    room_data: 0,
                    pigcms_id: 0,
                    end_time: null,
                    parking_car_type: '',
                    car_color: '',
                    car_brands: '',
                    equipment_no: '',
                    car_user_name: '',
                    car_user_phone: '',
                    roomArr: [],
                },
                room_data_arr: [],
                rules: {
                    car_type: [{ required: true, message: '请选择车辆类型', trigger: 'blur' }],
                    province: [{ required: true, message: '请填写车牌号码', trigger: 'blur' }],
                    binding_type: [{ required: false, message: '请选择绑定对象', trigger: 'blur' }],
                    relationship: [{ required: false, message: '请选择与业主关系', trigger: 'blur' }],
                    garage_id: [{ required: false, message: '请选择车库', trigger: 'blur' }],
                    room_data: [{ required: false, message: '请选择'+store.getters.config.room_name, trigger: 'blur' }],
                    pigcms_id: [{ required: false, message: '请选择业主', trigger: 'blur' }],
                    examine_status: [{ required: false, message: '请选择审核状态', trigger: 'blur' }],
                    car_user_phone: [{
                        required: false,
                        message: '请输入正确的手机号码或清空手机号',
                        trigger: 'blur'
                    },{
                        validator: this.phoneConfirm
                    }]
                },
                dateFormat: 'YYYY-MM-DD',
                car_color_list: [],
                brands_type_list:[],
                city_arr: [],
                garage_list: [],
                info_list: [],
                parking_car_type_arr: [],
                relationship: [],
                car_type_list: [{car_type: 0, label:'汽车'}, {car_type: 1, label: '电瓶车'}],
                bind_type_list: [{binding_type: 1, label:'房间'}, {binding_type: 2, label: '业主'}, {binding_type: 0, label: '公众'}],
                options: [],
                search: { page: 1 },
                search1: { page: 1 },
                searchVal: '',
                searchUserList: [],
                park_sys_type:'',
                position_list: [],
                is_show: false,
                choice_data: [],
                parking_car_type_mark: '',
                bind_num_str: '',
                positionSelect: [],
                positionPage: 0,
                positionAll: [],
                timeout: null,
                position_bind_car:{text1:'',text2:'',text3:'',text4:'',text5:''},
                position_bind_info:[],
                is_garage_multiple:0,
            }
        },

        methods: {

            handlePopupScroll(e) {
                let that = this
                const {
                    target
                } = e;
                const {
                    scrollTop,
                    scrollHeight,
                    clientHeight
                } = target;
                if (scrollTop + clientHeight == scrollHeight) {
                    if (that.positionPage == 0 && that.positionSelect.length == 301) {
                        that.positionSelect.splice(300, 1)
                    }
                    if (that.positionPage < that.positionAll.length - 1) {
                        that.positionPage++
                        that.positionSelect = [...that.positionSelect, ...that.positionAll[that.positionPage]]
                    } else {
                        console.log('加载完了')
                    }
                }
            },

            handleSearchChange(e) {
                let that = this
                that.debounce(()=>{
                    let index = that.position_list.findIndex(item=>item.position_num == e);
                    if(index != -1 && that.positionSelect.findIndex(item=>item.position_num == e) == -1){
                        that.positionSelect.push(that.position_list[index])
                    }
                })
            },

            debounce(func, wait = 1500, immediate = false) {
                let that = this
                if (that.timeout !== null) clearTimeout(that.timeout);
                // 立即执行，此类情况一般用不到
                if (immediate) {
                    typeof func === "function" && func();
                } else {
                    // 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
                    that.timeout = setTimeout(function() {
                        typeof func === "function" && func();
                    }, wait);
                }
            },

            clearForm() {
                this.vehicleForm = {
                    garage_id: '请选择车库',
                    car_type: '',
                    province: '',
                    car_number: '',
                    binding_type: 0,
                    relationship: '请选择与业主关系',
                    car_position_id: [],
                    car_stop_num: '',
                    room_data: 0,
                    pigcms_id: 0,
                    end_time: null,
                    parking_car_type: '',
                    car_color: '',
                    car_brands: '',
                    brands_type:'奥迪',
                    brands:'',
                    equipment_no: '',
                    car_user_name: '',
                    car_user_phone: '',
                    park_sys_type:'',
                    roomArr: []
                }
                this.searchVal = ''
            },
            moment,
            handleSubmit(e) {
                this.confirmLoading = true;
                if(this.vehicleForm.examine_status*1 ==1 && this.vehicleForm.room_data == 0 && this.vehicleForm.binding_type == 1){
                    this.confirmLoading = false;
                    this.$message.warn('请选择'+store.getters.config.room_name)
                    return
                }
                
                if(this.vehicleForm.examine_status*1 ==1 && this.vehicleForm.pigcms_id == 0 && this.vehicleForm.binding_type == 2){
                    this.confirmLoading = false;
                    this.$message.warn('请选择业主')
                    return
                }
                
                if(this.vehicleForm.examine_status*1 ==1 && this.vehicleForm.relationship == '请选择与业主关系'){
                    this.confirmLoading = false;
                    this.$message.warn('请选择与业主关系')
                    return
                }
                
                if(this.vehicleForm.car_type*1 <1 && this.vehicleForm.examine_status*1 ==1 && this.vehicleForm.garage_id == '请选择车库'){
                    this.confirmLoading = false;
                    this.$message.warn('请选择车库')
                    return
                }
                if (this.vehicleForm.brands_type != ''&&this.vehicleForm.brands_type!='undefined'){
                    this.vehicleForm.car_brands=this.vehicleForm.brands_type+'-'+this.vehicleForm.brands
                }else{
                    this.vehicleForm.car_brands='-'+this.vehicleForm.brands
                }
                if(this.vehicleForm.car_position_id.length>=100) {
                    this.vehicleForm.car_position_id.splice(100, 1)
                }
                console.log(this.vehicleForm)
                
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        let that = this
                        let url = villageApi.addParkCar
                        if(this.vehicle_type == 'edit'){
                            url = villageApi.editCar
                        }
                        that.request(url, that.vehicleForm).then((res) => {
                            if(this.vehicle_type == 'edit'){
                                that.$message.success('编辑成功！')
                            } else{
                                that.$message.success('添加成功！')
                            }
                            this.$emit('closeVehicle', true)
                            this.clearForm()
                            this.confirmLoading = false;
                        }).catch(e=>{
                            this.confirmLoading = false;
                        })
                    } else {
                        this.confirmLoading = false;
                        return false;
                    }
                });
            },
            getAddCarConfig(){
                let that = this
                that.request(villageApi.getAddCarInfo, {}).then((res) => {
                    that.car_color_list = res.car_color_list
                    that.brands_type_list = res.brand
                    that.city_arr = res.city_arr
                    that.garage_list = res.garage_list
                    that.info_list = res.info_list
                    //that.park_sys_type= '';
                    for(let item in res.relationship){
                        that.relationship.push({
                            key: item+'',
                            label: res.relationship[item]
                        })
                    }
                    
                    /*
                    for(let item in res.parking_car_type_arr){
                        that.parking_car_type_arr.push({
                            key: item,
                            label: res.parking_car_type_arr[item]
                        })
                    }
                    */

                })
            },
            handleSubCancel(e) {
                this.$refs.ruleForm.resetFields();
                this.confirmLoading = false;
                this.$emit('closeVehicle', false)
                this.clearForm()
            },

            getPositionsList(garage_id, position_ids = '') {
                let that = this
                that.position_list = [];
                that.positionAll = [];
                that.positionPage = 0;
                let postPositionArr={garage_id:garage_id,car_id:this.car_id,position_ids:position_ids};
                that.request(villageApi.getPositionLists, postPositionArr).then((res) => {
                    if (res.length > 0) {
                        that.position_list = res
                        that.positionAll = that.getArr(that.position_list, 300);
                        that.positionSelect = that.getArr(that.position_list, 300)[0];
                        if (position_ids) {
                            for(let pii=0;pii<position_ids.length;pii++){
                                let index = res.findIndex(item => position_ids[pii] == item.position_id)
                                if (index > 299) {
                                    that.positionSelect.push(res[index])
                                }
                            }
                        }
                    }
                })
            },

            getArr(arr, num) {
                let newArr = [...arr] // 因为splice会改变原数组，要深拷贝一下
                let list = []
                for (let i = 0; i < newArr.length;) {
                    list.push(newArr.splice(i, num))
                }
                return list
            },

            checkParkingCarType(type_id,source_arr=''){
                let that = this;
                if(source_arr){
                    that.disabled=source_arr.status;
                    that.parking_car_type_mark=source_arr.msg;
                    if(that.disabled){
                        that.vehicleForm.end_time=source_arr.end_time;
                    }
                }else{
                    that.request(villageApi.checkParkingCarType, {type_id:type_id}).then((res) => {
                        that.disabled=res.status;
                        that.parking_car_type_mark=res.msg;
                        if(that.disabled){
                            that.vehicleForm.end_time=res.end_time;
                        }
                    })
                }

            },
            handleSelectGarageChange(value){
                console.log('garage', value)
               // this.vehicleForm.car_position_id = []
                for(let ii=0;ii<this.garage_list.length;ii++){
                     if(value.includes(this.garage_list[ii].garage_id)){
                         this.parking_car_type_arr=[];
                         for(let item in this.garage_list[ii].parking_car_type_arr){
                             this.parking_car_type_arr.push({
                                 key: item,
                                 label: this.garage_list[ii].parking_car_type_arr[item]
                             })
                         }
                         break;
                     }
                }
                this.getPositionsList(value)
            },
            selectPosition(value){
                console.log('value',value);
                console.log('car_position_id',this.vehicleForm.car_position_id);
                if(this.vehicleForm.car_position_id.length>=100) {
                    this.vehicleForm.car_position_id.splice(100, 1)
                }

                this.request(villageApi.getPositionBindNum, {
                    car_position_id: this.vehicleForm.car_position_id
                }).then((res) => {
                   if(res.position_bind_car!=undefined){
                       this.position_bind_car=res.position_bind_car;
                   }
                   if(res.position_bind_info!=undefined){
                       this.position_bind_info=res.position_bind_info;
                   }
                })
            },
            
            handleSelectChange(value, type) {
                console.log(value, type)
                this.vehicleForm[type] = value
                if(type=='binding_type'){
                    this.vehicleForm.relationship="7";
                    this.is_show=true;
                }else if(type=='pigcms_id'){
                    this.searchUserList.map(v=>{
                        if(v.pigcms_id == value){
                            this.searchVal = v.name
                            this.searchUserList = []
                        }
                    })
                    this.choice_data.value=value;
                    this.choice_data.type='owner';
                    //this.vehicleForm.car_user_name='';
                    //this.vehicleForm.car_user_phone='';
                    this.vehicleForm.relationship='请选择与业主关系';
                }else if(type == 'parking_car_type'){
                    //this.checkParkingCarType(value);
                }else if(type=='garage_id'){
                    this.vehicleForm.car_position_id = []
                     value=value*1;
 
                    for(let ii=0;ii<this.garage_list.length;ii++){
                         if(this.garage_list[ii].garage_id==value){
                             this.park_sys_type=this.garage_list[ii].park_sys_type
                             this.parking_car_type_arr=[];
                             for(let item in this.garage_list[ii].parking_car_type_arr){
                                 this.parking_car_type_arr.push({
                                     key: item*1,
                                     label: this.garage_list[ii].parking_car_type_arr[item]
                                 })
                             }
                             if (this.park_sys_type=='D7'|| this.park_sys_type=='D3'){
                                 this.car_type_list=[{car_type: 0, label:'汽车'}];
                             }
                             break;
                         }
                    }
                    if(this.park_sys_type=='third_ai_park'){
                         this.vehicleForm.parking_car_type=3652;
                    }
                    console.log('park_sys_type',this.park_sys_type);
                    this.getPositionsList(value)
                }else if(type=='relationship'){
                    this.getUserInfo(value);
                    if(value == 1){
                        this.is_show=false;
                    }else{
                        this.is_show=true;
                    }
                }
                if (type == 'car_position_id') {
                    this.bind_num_str = '';
                    //查询车位号绑定数量
                    this.request(villageApi.getPositionBindNum, {
                        car_position_id: value
                    }).then((res) => {
                        this.bind_num_str = '已绑定车辆数：' + res.num
                    })
                }

                this.$forceUpdate()
                console.log(`selected ${value}`, type, this.vehicleForm);
            },
            
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            
            onDateChange(date, dateString){
                this.vehicleForm.end_time = dateString
                console.log(date, dateString);
            },
            
            getVehicleInfo(){
                let that = this
                this.position_bind_car={text1:'',text2:'',text3:'',text4:'',text5:''};
                this.position_bind_info=[];
                this.is_garage_multiple=0;
                if(this.car_id){
                    that.request(villageApi.getCarInfo, {car_id: this.car_id}).then((res) => {
                        if(res.relationship == 1){
                            that.is_show=false;
                        }else{
                            that.is_show=true;
                        }
                        that.parking_car_type_arr=res.parking_car_type_arr ? res.parking_car_type_arr:[];
                        that.park_sys_type= res.park_sys_type ? res.park_sys_type:'';
                        that.vehicleForm = res
                        if(res.position_bind_car!=undefined){
                            that.position_bind_car=res.position_bind_car;
                        }
                        if(res.position_bind_info!=undefined){
                            that.position_bind_info=res.position_bind_info;
                        }
                        if (res.car_brands==''){
                            that.vehicleForm.brands_type = ''
                        }
                        if (res.children_type==2){
                            that.disabled=true
                        }else{
                            that.disabled=false
                        }
                        that.vehicleForm.end_time = res.end_time
                        that.vehicleForm.binding_type = res.binding_type ? res.binding_type:0;
                        that.searchVal = res.name
                        if(res.relationship){
                            that.vehicleForm.relationship = res.relationship + ''
                        } else{
                            that.vehicleForm.relationship = '请选择与业主关系'
                        }
                        that.vehicleForm.garage_id = res.garage_id || '请选择车库'
                        if(res.parking_car_type == 0){
                            that.vehicleForm.parking_car_type = ''
                        } else {
                            that.vehicleForm.parking_car_type = res.parking_car_type*1;
                        }
                       // that.checkParkingCarType(0,res.check_parking_car_type);
                        that.vehicleForm.pigcms_id = res.pigcms_id || 0
                        that.vehicleForm.room_data = res.room_id || 0
                        if (res.garage_id) {
                            that.getPositionsList(res.garage_id, res.car_position_id)
                        }
                        if(res.is_garage_multiple!=undefined && res.is_garage_multiple){
                           that.is_garage_multiple= res.is_garage_multiple;
                        }
                        if(res.roomArr.length>0 && res.roomArr[0] && res.roomArr[1]){
                            let toFloorArr=[res.roomArr[0]];
                            let toLayerArr=[res.roomArr[0],res.roomArr[1]];
                            let toVacancyArr=[res.roomArr[0],res.roomArr[1],res.roomArr[2]];
                            let toAll=res.roomArr;
                            console.log('roomArr',res.roomArr,'options',this.options);
                            setTimeout(function(){
                                   that.setVisionsFunc(toFloorArr).then((xret)=>{
                                      // console.log('x1ret',xret,'options',that.options);
                                       that.setVisionsFunc(toLayerArr).then((xret)=>{
                                           //console.log('x2ret',xret,'options',that.options);
                                           that.setVisionsFunc(toVacancyArr).then((xret)=>{
                                              // console.log('x3ret',xret,'options',that.options);
                                               that.setVisionsFunc(toAll)
                                           })
                                       })
                                   })
                            },1000)
                            
                            }
                        
                    })
                }
            },
            
            getRoomArr(list, index){
                let arr = []
                list.map((v, i)=> {
                    if(i<= index){
                        arr.push(v)
                    }
                })
                return arr
            },
            
            searchUser(){
                let that = this
                if(this.searchVal){
                    that.request(villageApi.getParkUserInfo, {value: this.searchVal}).then((res) => {
                        that.searchUserList = res
                    })
                } else {
                    that.searchUserList = []
                    that.vehicleForm.pigcms_id = 0
                }
                
            },
            
            // 楼栋号
            getSingleListByVillage() {
                this.request(villageApi.getSingleListByVillage).then(res => {
                    if (res) {
                    let array = []
                    res.map(pro => {
                        array.push({
                        label: pro.name,
                        value: pro.id,
                        isLeaf: false
                        });
                    });
                    this.options = array
                    }
                });
            },
            // 单元楼
            getFloorList(id) {
                return new Promise(resolve => {
                    this.request(villageApi.getFloorList, {
                        pid: id
                    }).then(res => {
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
           setVisionsFunc(selectedOptions) {
                return new Promise( async  (resolve, reject)=>{
                    
                    this.vehicleForm.roomArr = selectedOptions
                    if(selectedOptions.length == 4){
                        this.vehicleForm.room_data = selectedOptions[3]
                        this.choice_data.value=selectedOptions[3];
                        this.choice_data.type='room';
                        this.vehicleForm.car_user_name='';
                        this.vehicleForm.car_user_phone='';
                        //this.vehicleForm.relationship=undefined;
                        this.$forceUpdate()
                        resolve()
                        return true;
                    }
                    if (selectedOptions.length === 1) {
                        const options_temp = [...this.options];
                        const res = await this.getFloorList(selectedOptions[0]);
                        console.log("res", res)
                        const children = [];
                        res.map(pro => {
                            children.push({
                                label: pro.name,
                                value: pro.id,
                                isLeaf: false
                            });
                           // options_temp['children'] = children
                            return true;
                        });
                        const xproduct=options_temp.find(_ => _.value === selectedOptions[0]);
                        if(xproduct) {
                            options_temp.find(_ => _.value === selectedOptions[0])['children'] = children;
                        }
                       this.options = options_temp
                       resolve(res)
                    } else if (selectedOptions.length === 2) {
                        const apps = await this.getLayerList(selectedOptions[1]);
                        const options_temp = [...this.options];
                        // const apps = await getDirectoryApp(selectedOptions[1]);
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
                        if(product && product.children) {
                           const  product_11=product.children.find(_ => _.value === selectedOptions[1]);
                           if(product_11){
                               options_temp.find(_ => _.value === selectedOptions[0]).children.find(_ => _.value === selectedOptions[1])['children'] = children;
                           }
                        }
                        this.options = options_temp
                        resolve(apps)
                    }
                    else if (selectedOptions.length === 3) {
                        const apps = await this.getVacancyList(selectedOptions[2]);
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
                        if(product && product.children){
                            const product_1 = product.children.find(_ => _.value === selectedOptions[1])
                            if(product_1 && product_1.children) {
                               const product_1_2 = product_1.children.find(_ => _.value === selectedOptions[2])
                               if(product_1_2){
                                   options_temp.find(_ => _.value === selectedOptions[0]).children.find(_ => _.value === selectedOptions[1]).children.find(_ => _.value === selectedOptions[2])['children'] = children;
                               }
                            }
                        }
                        this.options = options_temp
                        resolve(apps)
                        //console.log("_this.options", this.options)
                    }
                })
            },

            //获取用户信息
            getUserInfo(value){
                let that = this;
                if(!that.choice_data.value || that.choice_data.value == undefined){
                    return true;
                }

                let data={
                    value:that.choice_data.value,
                    type:that.choice_data.type
                };
                console.log('abc==============',value,data)
                that.request(villageApi.getParkUser0629, data).then((d) => {
                    if(d.status == 1){
                        that.vehicleForm.car_user_name=d.data.name;
                        that.vehicleForm.car_user_phone=d.data.phone;
                    }
                })
            },

            // 手机号验证 非必填
            phoneConfirm(rule, value, callback){
                console.log('value',value)
                if(!value){
                    return true;
                }
                let reg = /^1[3456789]\d{9}$/
                if(!reg.test(value)){
                    callback('请输入正确的手机号码或清空手机号')
                } else {
                    callback()
                }
            },
        },
    }
</script>

<style lang="less" scoped>
    .form_title{
        font-size: 14px;
        font-weight: bold;
    }

    /deep/ .label_desc_1122{
        width: 64%;
        font-size: 12px;
        color: red;
        line-height: 15px;
        transform: translateY(10px);
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
    .add_space {
        display: flex;
        flex-wrap: wrap;
    }
    .formitemclass {
        width: 50%;
    }
</style>