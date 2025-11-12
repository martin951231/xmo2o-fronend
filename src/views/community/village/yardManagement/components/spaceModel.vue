<template>
    <a-modal :title="modelTitle" :width="900" :visible="visible" :confirm-loading="confirmLoading" @ok="handleSubmit"
        @cancel="handleSubCancel">
        <a-form-model ref="ruleForm" :model="spaceForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <div class="add_space" v-if="modelTitle == '添加车位'">
                <a-form-model-item label="车库名称" prop="garage_id">
                    <a-select v-if="visible" show-search placeholder="请选择" style="width: 200px" :filter-option="filterOption"
                        @change="(value)=>handleSelectChange(value, 'garage_id')">
                        <a-select-option v-for="(item,index) in garageList" :value="item.garage_id">
                            {{item.garage_num}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                
                <a-form-model-item label="车位号" prop="position_num">
                    <a-input placeholder="请输入车位号" v-model="spaceForm.position_num" style="width: 250px;" />
                </a-form-model-item>
                
                <!-- <a-form-model-item label="搜索业主" prop="room_data">
                   <a-input style="width: 270px;" @change = 'searchUser()' placeholder="根据手机号及业主姓名搜索业主" v-model="searchVal" />
                </a-form-model-item>
                               
                <a-form-model-item label="绑定业主" prop="pigcms_id" v-if="searchUserList.length>0">
                   <a-select show-search placeholder="请选择" style="width: 200px" :filter-option="filterOption" :value="spaceForm.pigcms_id"
                       @change="(value)=>handleSelectChange(value, 'pigcms_id')">
                       <a-select-option @change="(value)=>handleSelectChange(value, 'pigcms_id')" v-for="(item,index) in searchUserList" :value="item.pigcms_id">
                           {{item.name}}
                       </a-select-option>
                   </a-select>
                </a-form-model-item> -->
                <a-form-model-item label="绑定住户" prop="pigcms_id">
                    <div style="display: flex; flex-direction: column; margin-top: 5px;">
                        <a-input style="width: 200px;" @change = 'searchUser()' placeholder="填写住户手机号或姓名" v-model="searchVal" />
                        <a-select :open="true" show-search placeholder="请选择" style="width: 250px;" :filter-option="filterOption" :value="spaceForm.pigcms_id" v-if="searchUserList.length>0"
                            @change="(value)=>handleSelectChange(value, 'pigcms_id')">
                            <a-select-option v-for="(item,index) in searchUserList" :value="item.pigcms_id">
                                {{item.name}}
                            </a-select-option>
                        </a-select>
                    </div>
                </a-form-model-item>
                <a-form-model-item label="车位类型" prop="children_position_type" v-if="children_type">
                    <a-radio-group name="radioGroup" v-model="spaceForm.children_type">
                        <a-radio :value="1">母车位</a-radio>
                        <a-radio :value="2">子车位</a-radio>
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item label="车位面积" prop="position_area">
                    <a-input placeholder="请输入车位面积" v-model="spaceForm.position_area"  style="width: 250px;" />
                </a-form-model-item>
                <a-form-model-item label="车位属性" v-if="jz_wsxdsj_customized==1">
                    <a-radio-group  v-model="spaceForm.opt_type">
                        <a-radio :value="0">无</a-radio>
                        <a-radio :value="1">租赁</a-radio>
                        <a-radio :value="2">抢购</a-radio>
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item label="备注" prop="position_note">
                    <a-textarea style="padding: 5px; width:200px; height: 100px; resize:none;" placeholder="请输入" v-model="spaceForm.position_note" />
                </a-form-model-item>
            </div>
            
            <div class="edit_space" v-else>
                <a-form-model-item label="车库" prop="garage_id">
                    <a-select show-search placeholder="请选择" style="width: 200px" :filter-option="filterOption"
                        @change="(value)=>handleSelectChange(value, 'garage_id')" :value="spaceForm.garage_id" :disabled="true">
                        <a-select-option v-for="(item,index) in garageList" :value="item.garage_id">
                            {{item.garage_num}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                
                <a-form-model-item label="车位号" prop="position_num" >
                    <a-input placeholder="请输入车位号" v-model="spaceForm.position_num" :disabled="xu_disabled" style="width: 250px;" />
                </a-form-model-item>
                
                <a-form-model-item label="当前绑定的住户" prop="current" v-if="!xu_disabled" >
                    【姓名】{{spaceForm.name?spaceForm.name:'暂无'}} 【手机号】{{spaceForm.phone?spaceForm.phone:'暂无'}}
                </a-form-model-item>
                
                <a-form-model-item label="绑定车辆" v-if="position_bind_car==1" >
                <a-select @popupScroll="handlePopupCarScroll" @search="handleSearchCarChange" show-search placeholder="请选择车辆"  mode="multiple" optionFilterProp="children" option-label-prop="label" v-model="car_ids" @change="selectCars" >
                    <a-select-option v-for="(item,index) in carsSelect"  :label="item.car_number" :value="item.car_id" :key="item.car_id">
                        {{item.car_number}}
                    </a-select-option>
                </a-select>
                </a-form-model-item>
               <!-- <a-form-model-item label="搜索业主" prop="room_data">
                   <a-input style="width: 270px;" @change = 'searchUser()' placeholder="根据手机号及业主姓名搜索业主" v-model="searchVal" />
                </a-form-model-item>
               
                <a-form-model-item label="绑定业主" prop="pigcms_id" v-if="searchUserList.length>0">
                   <a-select show-search placeholder="请选择" style="width: 200px" :filter-option="filterOption" :value="spaceForm.pigcms_id"
                       @change="(value)=>handleSelectChange(value, 'pigcms_id')">
                       <a-select-option @change="(value)=>handleSelectChange(value, 'pigcms_id')" v-for="(item,index) in searchUserList" :value="item.pigcms_id">
                           {{item.name}}
                       </a-select-option>
                   </a-select>
                </a-form-model-item> -->
                
                <a-form-model-item label="绑定住户" prop="pigcms_id" v-if="!xu_disabled">
                    <div style="display: flex; flex-direction: column; margin-top: 5px;">
                        <a-input style="width: 250px;" @change = 'searchUser()' placeholder="填写住户手机号或姓名" v-model="searchVal" />
                        <a-select :open="true" show-search placeholder="请选择" style="width: 200px;" :filter-option="filterOption" :value="spaceForm.pigcms_id" v-if="searchUserList.length>0"
                            @change="(value)=>handleSelectChange(value, 'pigcms_id')">
                            <a-select-option v-for="(item,index) in searchUserList" :value="item.pigcms_id">
                                {{item.name}}
                            </a-select-option>
                        </a-select>
                    </div>
                </a-form-model-item>
                
                <a-form-model-item label="停车到期时间" prop="end_time" v-if="visible" >
                    <a-date-picker placeholder="请选择停车到期时间" v-if="spaceForm.end_time" :disabled="disabled" @change="ondateChange" :value="moment(spaceForm.end_time, dateFormat)" />
                    <a-date-picker placeholder="请选择停车到期时间" v-else @change="ondateChange" :disabled="disabled"/>
                </a-form-model-item>
                <a-form-model-item label="车位类型" prop="children_position_type" v-if="spaceForm.children_position_type && !xu_disabled">
                    <a-radio-group  v-model="spaceForm.children_type">
                        <a-radio :value="1" style="padding-right: 10px">母车位</a-radio>
                        <a-radio :value="2">子车位</a-radio>
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item label="车位面积" prop="position_area">
                    <a-input placeholder="请输入车位面积" v-model="spaceForm.position_area" addon-after="平方米"  style="width: 250px;" />
                </a-form-model-item>
                
                <a-form-model-item label="车位属性" v-if="jz_wsxdsj_customized==1">
                    <a-radio-group  v-model="spaceForm.opt_type">
                        <a-radio :value="0">无</a-radio>
                        <a-radio :value="1">租赁</a-radio>
                        <a-radio :value="2">抢购</a-radio>
                    </a-radio-group>
                </a-form-model-item>
                
                <a-form-model-item label="备注" prop="position_note">
                    <a-textarea style="padding: 5px; width:200px; height: 100px; resize:none;" placeholder="请输入" v-model="spaceForm.position_note" />
                </a-form-model-item>
                
                <a-form-model-item label="租售状态" prop="position_type">
                    <a-input :disabled="true" placeholder="请输入租售状态" v-model="spaceForm.position_status_txt" style="width: 250px;" />
                </a-form-model-item>
            </div>
        </a-form-model>
    </a-modal>

</template>

<script>
    import villageApi from '@/api/community/village';
    import moment from 'moment';
    export default {
        props: {
            position_id: {
                type: String,
                default: ''
            },
            children_type:{
                type: [String, Number],
                default: 0
            },
            visible: {
                type: Boolean,
                default: false
            },
            modelTitle: {
                type: String,
                default: ''
            },
            space_type: {
                type: String,
                default: 'add'
            },
            jz_wsxdsj_customized:{
                type: [String, Number],
                default: 0
            },
            position_bind_car:{
                type: [String, Number],
                default: 0
            },
        },
        
        watch:{
            position_id: {
                immediate: true,
                handler (val) {
                    this.spaceForm= {garage_id: '',children_type:1,opt_type:0};
                    this.car_ids=[];
                    if(this.space_type=='edit'){
                        this.getSpaceInfo()
                    }else{
                        this.getCarsList('');
                    }
                    this.searchUserList=[];
                }
            },
        },
        
        mounted(){
            this.getGarageList()
        },
        
        data() {
            return {
                confirmLoading: false,
                children_type_show: false,
                labelCol: { span: 4 },
                wrapperCol: { span: 18 },
                spaceForm: {garage_id: '',children_type:1,opt_type:0},
                rules: {
                    garage_id: [{ required: true, message: '请选择车场', trigger: 'blur' }],
                    position_num: [{ required: true, message: '请输入车位号', trigger: 'blur' }]
                },
                garageList: [],
                dateFormat: 'YYYY/MM/DD',
                disabled:false,
                searchVal: '',
                searchUserList: [],
                xu_disabled:true,
                carsSelect:[],
                car_ids:[],
                cars_list : [],
                cars_all : [],
                cars_page : 0,
            }
        },

        methods: {
            moment,
            getSpaceInfo(){
                let that = this
                this.car_ids=[];
                if(this.position_id){
                    that.request(villageApi.getPositionInfo, {position_id: this.position_id}).then((res) => {
                        that.spaceForm = res
                        if (that.spaceForm.children_type==2){
                            that.disabled=true
                        }else{
                            that.disabled=false
                        }
                        if(res.position_pattern*1 !=2){
                            that.xu_disabled=false
                        }else{
                            that.xu_disabled=true
                        }
                        if(res.bind_cars!=undefined && res.bind_cars){
                            this.car_ids=res.bind_cars;
                        }
                        this.getCarsList(this.car_ids);
                    })
                }
            },
            getGarageList(){
                let that = this
                that.request(villageApi.getGarageList, {}).then((res) => {
                    that.garageList = res.list
                })
            },
            clearForm(){
                this.spaceForm = {garage_id: '',children_type:1,opt_type:0}
                this.searchVal = ''
                this.car_ids=[];
            },
            handleSubmit(e) {
                this.confirmLoading = true;
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        let that = this
                        let url = villageApi.addParkPosition
                        if(this.space_type == 'edit'){
                            url = villageApi.editParkPosition
                        }
                        that.spaceForm.bind_cars=this.car_ids
                        that.request(url, that.spaceForm).then((res) => {
                            if(this.space_type == 'edit'){
                                that.$message.success('编辑成功！')
                            } else{
                                that.$message.success('添加成功！')
                            }
                            this.$emit('closeSpace', true)
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
            handleSubCancel(e) {
                this.clearForm()
                
                this.confirmLoading = false;
                this.searchUserList=[];
                this.$emit('closeSpace', false)
                
            },
            
            handleSelectChange(value, type) {
                this.spaceForm[type] = value
                if(type=='pigcms_id'){
                    this.searchUserList.map(v=>{
                        if(v.pigcms_id == value){
                            this.searchVal = v.name
                            this.searchUserList = []
                            console.log("v.pigcms_id=====>", v.pigcms_id)
                        }
                    })
                }
                this.$forceUpdate()
            },
            
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            
            ondateChange(value, dateString){
                this.spaceForm.end_time = dateString
            },
            
            searchUser(){
                let that = this
                if(this.searchVal){
                    that.request(villageApi.getParkUserInfo, {value: this.searchVal}).then((res) => {
                        that.searchUserList = res
                    })
                } else {
                    that.searchUserList = []
                    that.spaceForm.pigcms_id = ''
                }
                
            },
            selectCars(value){
                console.log('selectCars',value);
            },
            getCarsList(car_ids = '') {
                let that = this
                that.cars_list = [];
                that.cars_all = [];
                that.cars_page = 0;
                let postPositionArr={car_ids:car_ids};
                that.request(villageApi.getPositionBindCarList, postPositionArr).then((res) => {
                    if (res && res.length > 0) {
                        that.cars_list = res
                        that.cars_all = that.getArr(that.cars_list, 500);
                        that.carsSelect = that.getArr(that.cars_list, 500)[0];
                        if (car_ids) {
                            for(let pii=0;pii<car_ids.length;pii++){
                                let index = res.findIndex(item => car_ids[pii] == item.car_id)
                                if (index > 499) {
                                    that.carsSelect.push(res[index])
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
            handlePopupCarScroll(e) {
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
                    if (that.cars_page == 0 && that.carsSelect.length == 501) {
                        that.carsSelect.splice(500, 1)
                    }
                    if (that.cars_page < that.cars_all.length - 1) {
                        that.cars_page++
                        that.carsSelect = [...that.carsSelect, ...that.cars_all[that.cars_page]]
                    } else {
                        console.log('加载完了')
                    }
                }
            },
            
            handleSearchCarChange(e) {
                let that = this
                that.x_debounce(()=>{
                    let index = that.cars_list.findIndex(item=>item.car_number == e);
                    if(index != -1 && that.carsSelect.findIndex(item=>item.car_number == e) == -1){
                        that.carsSelect.push(that.cars_list[index])
                    }
                })
            },
            
            x_debounce(func, wait = 1500, immediate = false) {
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
</style>
