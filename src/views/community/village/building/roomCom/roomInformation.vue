<template>
    <div class="container">
        <a-form-model ref="ruleForm" :rules="rules" :model="roomForm" :label-col="labelCol" :wrapper-col="wrapperCol" v-if="!pageLoading">
            <div class="form_title" style="font-weight: 600;">基本信息</div>
            <div class="form_con" style="margin-top: 10px;">
                <a-form-model-item label="物业编号" class="form_item">
                    <a-input v-model="roomForm.usernum" :disabled="true" />
                </a-form-model-item>
                <a-form-model-item :label="$store.getters.config.room_name+'物业编号'" class="form_item" :extra="'由'+$store.getters.config.single_name+'编号、'+$store.getters.config.floor_name+'编号、楼层编号和房屋编号依次拼接而成'">
                    <a-input v-model="roomForm.property_number" placeholder="请输入物业编号" />
                </a-form-model-item>
                <a-form-model-item :label="$store.getters.config.single_name+'/'+$store.getters.config.floor_name+'/楼层'" class="form_item">
                    <a-input v-model="roomForm.address" :placeholder="'请输入'+$store.getters.config.single_name+'/'+$store.getters.config.floor_name+'/楼层'" :disabled="true" />
                </a-form-model-item>
                <a-form-model-item :label="$store.getters.config.room_name+'号'" class="form_item">
                    <a-input v-model="roomForm.room" :placeholder="'请输入'+$store.getters.config.room_name+'号'" />
                </a-form-model-item>

                <a-form-model-item class="form_item" :extra="'设置'+$store.getters.config.room_name+'时间范围，设置后物业只能收取合同时间内收费项目，未到合同开始时间或结束时间不能收费；未设置物业服务'+$store.getters.config.house_name+'时间范围，则不影响。'">
                    <span slot="label">
                        <a-tooltip
                            :title="'设置'+$store.getters.config.room_name+'时间范围，设置后物业只能收取合同时间内收费项目，未到合同开始时间或结束时间不能收费；未设置物业服务'+$store.getters.config.house_name+'时间范围，则不影响。'">
                            <a-icon type="question-circle-o" />
                            合同时间
                        </a-tooltip>
                    </span>
                    <!-- <div v-if="roomForm.contract_time_start && roomForm.contract_time_end" style="display: flex; align-items: center;">
                        <a-date-picker :value="moment(roomForm.contract_time_start, dateFormat)" @change="(date, dateString)=>onDateChange(date, dateString, 'contract_time_start')" /> - 
                        <a-date-picker :disabled="true" :value="moment(roomForm.contract_time_end, dateFormat)" @change="(date, dateString)=>onDateChange(date, dateString, 'contract_time_end')" />
                    </div>
                    <div v-else style="display: flex; align-items: center;">
                        <a-date-picker @change="(date, dateString)=>onDateChange(date, dateString, 'contract_time_start')" /> - 
                        <a-date-picker @change="(date, dateString)=>onDateChange(date, dateString, 'contract_time_end')" />
                    </div> -->
                    <a-range-picker :disabled-date="disabledDate" v-if="roomForm.contract_time_start && roomForm.contract_time_end" :value="[moment(roomForm.contract_time_start, dateFormat), moment(roomForm.contract_time_end, dateFormat)]" @change="onDateChange" />
                    <a-range-picker :disabled-date="disabledDate" v-else  @change="onDateChange" />
                </a-form-model-item>
                <a-form-model-item :label="$store.getters.config.room_name+'别名编号'" class="form_item" :extra="'为'+$store.getters.config.room_name+'取一个数字别名,必须具有唯一性'" >
                    <a-input v-model="roomForm.room_alias_id" :placeholder="'请输入'+$store.getters.config.room_name+'别名编号'" />
                </a-form-model-item>
                <a-form-model-item label="房屋类型" class="form_item">
                    <a-select show-search placeholder="请选择" style="width: 200px" :filter-option="filterOption" :value="roomForm.house_type"
                        @change="(value)=>handleSelectChange(value, 'house_type')">
                        <a-select-option v-for="(item,index) in roomParams.room_type_list" :value="item.key">
                            {{item.value}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="使用状态" class="form_item" extra="">
                    <a-select show-search placeholder="请选择" style="width: 200px" :filter-option="filterOption" :value="roomForm.user_status"
                        @change="(value)=>handleSelectChange(value, 'user_status')">
                        <a-select-option v-for="(item,index) in roomParams.user_status_list" :value="item.key">
                            {{item.value}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                
                <a-form-model-item label="入住日期" class="form_item" extra="填写入住日期会改变使用状态为业主入住" v-if="is_aihorse_customized">
                <a-date-picker
                   style="width: 220px"
                  v-model="roomForm.house_in_time"
                  @change="changeHouseInTime"
                  format="YYYY-MM-DD"
                />
                
                </a-form-model-item>
                <!--
                客户不要这个定制功能了 先注释掉
                <a-form-model-item label="水费预存金额" class="form_item" extra="" v-if="is_aihorse_customized">
                    <a-input-number :min="0" v-model="roomForm.water_balance" :precision="2" :step="0.01" style="width: 200px"/>
                </a-form-model-item>
                -->
                <a-form-model-item label="出售状态" class="form_item" extra="仅供标记使用，不会自动变化的，需要自行编辑维护">
                    <a-select show-search placeholder="请选择" style="width: 200px" :filter-option="filterOption" :value="roomForm.sell_status"
                        @change="(value)=>handleSelectChange(value, 'sell_status')">
                        <a-select-option v-for="(item,index) in roomParams.sell_status_list" :value="item.key">
                            {{item.value}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item class="form_item" label="租赁时间">

                    <a-range-picker  v-if="roomForm.lease_time_start && roomForm.lease_time_end" :value="[moment(roomForm.lease_time_start, dateFormat), moment(roomForm.lease_time_end, dateFormat)]" @change="onDateLeaseChange" />
                    <a-range-picker  v-else  @change="onDateLeaseChange" />
                </a-form-model-item>
                <a-form-model-item label="房屋面积" class="form_item">
                    <a-input v-model="roomForm.housesize" placeholder="请输入房屋面积" />
                </a-form-model-item>
                <a-form-model-item label="供暖面积" class="form_item" v-if="roomForm.heating_area_judge">
                    <a-input v-model="roomForm.heating_size" placeholder="请输入供暖面积" />
                </a-form-model-item>
                <a-form-model-item label="计费面积" class="form_item" v-if="roomForm.billable_area_judge">
                    <a-input v-model="roomForm.billable_size" placeholder="请输入计费面积" />
                </a-form-model-item>
                                
                <a-form-model-item label="排序" class="form_item" extra="数字越大越靠前">
                    <a-input v-model="roomForm.sort" placeholder="请输入排序" />
                </a-form-model-item>
                <a-form-model-item :label="$store.getters.config.room_name+'状态'" class="form_item">
                    <a-radio-group v-model="roomForm.status">
                        <a-radio :value="1">开启</a-radio>
                        <a-radio :value="0">禁用</a-radio>
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item label="房间编号" class="form_item" extra="用于设备同步使用,相同单元下必须具有唯一性" >
                    <a-input v-model="roomForm.room_number" placeholder="请输入房间编号" />
                </a-form-model-item>
                
                <a-form-item label="房屋附件" class="form_item"  v-if="is_aihorse_customized">
                    <div class="clearfix">
                        <div>
                            <a-upload
                                list-type="picture-card"
                                name="reply_pic"
                                :data="{ upload_dir: 'village/room'}"
                                :multiple="false"
                                :file-list="fileListStart"
                                action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                                @change="handleUploadChangeStart"
                                @preview="handleUploadPreviewStart"
                            >
                                <div v-if="img_length_start < 8">
                                    <a-icon type="plus"/>
                                    <div class="ant-upload-text">
                                        选择图片
                                    </div>
                                </div>
                            </a-upload>
                            <a-modal :visible="previewImgVisible" :footer="null" @cancel="handleUploadCancelStart" :width="900">
                                <img alt="example" style="width: 96%" :src="previewImageStart"/>
                            </a-modal>
                        </div>
                    </div>
                </a-form-item> 
                
            </div>
            <div class="form_title" style="font-weight: 600;margin-top: 10px; diplay:flex; align-items:center;" v-if="a185_indoor_module.status">
                室内机管理
                <span style="font-weight: 500; color: green; margin-left:20px; font-size:14px;">注意：室内机编号仅限于 A185智能门禁配合使用</span>
            </div>
            <div class="form_con" style="margin-top: 10px;" v-if="a185_indoor_module.status">
                <a-form-model-item label="室内机设备号" class="form_item">
                    <a-input v-model="roomForm.indoor_device_sn" placeholder="请输入室内机设备号" />
                </a-form-model-item>
                <a-form-model-item label="状态" class="form_item">
                    <a-radio-group v-model="roomForm.indoor_status">
                        <a-radio :value="1">开启</a-radio>
                        <a-radio :value="0">禁用</a-radio>
                    </a-radio-group>
                </a-form-model-item>
            </div>
            
            <div class="form_title" style="font-weight: 600;margin-top: 10px; diplay:flex; align-items:center;" v-if="water_electric_gas_module.status || many_water_electric_meter.is_open==1 || yumenlao_special_meter.is_open==1">
                设备管理
                <span  v-if="water_electric_gas_module.status" style="font-weight: 500; color:green; margin-left:20px; font-size:14px;">注意：对接水电燃仪表设备，由设备方提供水电燃设备接口</span>
                <span style="font-weight: 500; color: red; margin-left:20px; font-size:14px;">表号具有唯一性，不可重复填写</span>
            
            </div>
            <div class="form_con" style="margin-top: 10px;" v-if="water_electric_gas_module.status">
                <a-form-model-item label="冷水表编号" class="form_item">
                    <a-input v-model="roomForm.water_number" placeholder="请输入冷水表编号" />
                </a-form-model-item>
                <a-form-model-item label="热水表编号" class="form_item">
                    <a-input v-model="roomForm.heat_water_number" placeholder="请输入热水表编号" />
                </a-form-model-item>
                <a-form-model-item label="电表编号" class="form_item">
                    <a-input v-model="roomForm.ele_number" placeholder="请输入电表编号" />
                </a-form-model-item>
                <a-form-model-item label="燃气表编号" class="form_item">
                    <a-input v-model="roomForm.gas_number" placeholder="请输入燃气表编号" />
                </a-form-model-item>
            </div>
            
            <div class="form_con" style="margin-top: 10px;" v-if="yumenlao_special_meter.meters.length>0">
                   <a-form-model-item :label="yitem.xtitle" v-for="(yitem,yindex) in yumenlao_special_meter.meters" class="form_item">
                   <a-input  placeholder="请输入表编号"  v-model="yitem.meter_code" />
                   </a-form-model-item>
            </div>
            <a-divider v-if="many_water_electric_meter.is_open==1" />
            <div class="form_con many_water_electric_meter" style="margin-top: 10px;" v-if="many_water_electric_meter.is_open==1">
                <div class="water_meter" style="display: block;width: 100%;">
                    <div class="water_item" v-for="(witem,windex) in many_water_electric_meter.water_data">
                        <a-form-model-item label="水表编号" class="form_item">
                        <a-input  placeholder="请输入水表编号"  v-model="witem.meter_number" />
                        </a-form-model-item>
                        <a-form-model-item label="最大刻度" class="form_item">
                            <a-input placeholder="请填写水表最大刻度值" style="width: 200px;" v-model="witem.meter_max_v" />
                            <a-button  @click="addOneWaterMeter()" style="margin-left: 25px;" v-if="windex<1" >添加水表</a-button>
                            <a-button type="danger" @click="delOneWaterMeter(windex)" style="margin-left: 25px;" v-if="windex>0" > 删 除 </a-button>
                        </a-form-model-item>
                    </div>
                </div>
                <a-divider  />
                 <div class="electric_meter" style="display: block;width: 100%;">
                    <div class="electric_item"  v-for="(eitem,eindex) in many_water_electric_meter.electric_data">
                        <a-form-model-item label="电表编号" class="form_item">
                        <a-input  placeholder="请输入电表编号" v-model="eitem.meter_number"/>
                        </a-form-model-item>
                        <a-form-model-item label="最大刻度" class="form_item">
                            <a-input  placeholder="请填写电表最大刻度值" style="width: 200px;" v-model="eitem.meter_max_v" />
                            <a-button  @click="addOneElectricMeter()" style="margin-left: 25px;" v-if="eindex<1">添加电表</a-button>
                            <a-button type="danger" @click="delOneElectricMeter(eindex)" style="margin-left: 25px;" v-if="eindex>0" > 删 除 </a-button>
                        </a-form-model-item>
                    </div>
                </div>
                
            </div> 
            
            <div class="form_con" style="margin-top: 10px;">
                <a-form-model-item style="width:55%;" label="海康智慧社区房间"  v-if="hik_info_vision_i_community==1" extra="如果没有数据请去楼栋管理页面 更新数据,并检查相应的楼栋、单元是否绑定了海康智慧社区楼栋、单元">
                    <a-select  placeholder="请选择匹配的房间" style="width:95%;"
                        @change="handleRoomSelectChange"  v-model="roomForm.third_room_id" >
                        <a-select-option value="">请选择一个匹配的房间</a-select-option>
                        <a-select-option v-for="(item, index) in hik_info_community_room" :value="item.index_code" :index="index" :disabled="item.is_disabled" >
                            {{item.name}}</a-select-option>
                    </a-select>
                </a-form-model-item>
            </div>
            <a-form-model-item style="width: 100%;" :wrapper-col="{ span: 14, offset: 2 }">
                <a-button type="primary" @click="onSubmit">保存</a-button>
                <!-- <a-button style="margin-left: 10px;" @click="resetForm">重置</a-button> -->
            </a-form-model-item>
        </a-form-model>
        <div v-else class="loading" style="width: 100%;height: 500px;display: flex;align-items: center;justify-content: center;flex-direction: column;">
            <a-icon style="font-size: 26px;" type="loading" />
            <div style="color: #666666;font-size: 20px; margin-top: 10px;">加载中...</div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import moment from 'moment';
    import {
        ref,
        watch,
        reactive,
        onMounted,
        onUpdated,
        defineComponent,
        getCurrentInstance
    } from '@vue/composition-api';
    export default defineComponent({
        props: {
            roomParams: {
                type: Object,
                default: ()=>{return {}}
            },
            roomId: {
                type: [String, Number],
                defalut: ''
            }
        },
        setup(props, context) {
            //人员信息
            const rules = ref({})
            let pageLoading = ref(true)
            let roomForm = ref({
                vacancy_id: '',
                property_number: '',
                address: '',
                room: '',
                house_type: '',
                user_status: '',
                sell_status: '',
                status: '',
                indoor_device_sn: '',
                indoor_status: '',
                water_number: '',
                heat_water_number: '',
                ele_number: '',
                gas_number: '',
                room_alias_id:'',
                room_number:'',
                third_room_id:'',
                house_in_time:'',
                water_balance:'',
                lease_time_start:'',
                lease_time_end:'',
            })
            let water_electric_gas_module = ref({})
            let many_water_electric_meter = ref({})
            let yumenlao_special_meter= ref({})
            let delayPost = ref(false)
            
            let fileListStart= ref([])
            let img_length_start= ref(0)
            let previewImgVisible= ref(false)
            let previewImageStart= ref('')
            let room_imgs= ref([])
            const onSubmit = ()=>{
                if(delayPost.value){
                    Vue.prototype.$message.warn('正在提交中，请稍等...')
                    return 
                }
                
                room_imgs.value=[];
                fileListStart.value.map(v=>{
                    let urlTmp=v.response && v.response.data ? v.response.data:'';
                    if(!urlTmp && v.url){
                        urlTmp=v.url;
                    }
                    room_imgs.value.push(urlTmp);
                })
                roomForm.value.room_imgs=room_imgs.value;
                roomForm.value.water_meter_data=many_water_electric_meter.value.water_data;
                roomForm.value.electric_meter_data=many_water_electric_meter.value.electric_data;
                roomForm.value.yumenlao_special_meter=yumenlao_special_meter.value.meters;
                delayPost.value = true
                Vue.prototype.request('/community/village_api.Building/subRoomAttribute', roomForm.value).then((res) => {
                    delayPost.value = false
                    Vue.prototype.$message.success('编辑成功！')
                }).catch(e=>{
                    delayPost.value = false
                })
            }
            const addOneWaterMeter=()=>{
                if(many_water_electric_meter.value.water_data.length >= many_water_electric_meter.value.meter_max_num){
                    Vue.prototype.$message.warn('水表最多只能有'+ many_water_electric_meter.value.meter_max_num+'个')
                    return true;
                }
                many_water_electric_meter.value.water_data.push({id: 0, meter_type: "water", meter_number: "", meter_max_v: ""});
            }
            const addOneElectricMeter=()=>{
                if(many_water_electric_meter.value.electric_data.length >= many_water_electric_meter.value.meter_max_num){
                    Vue.prototype.$message.warn('电表最多只能有'+ many_water_electric_meter.value.meter_max_num +'个')
                    return true;
                }
                many_water_electric_meter.value.electric_data.push({id: 0, meter_type: "electric", meter_number: "", meter_max_v: ""});
            }
            const delOneWaterMeter=(index)=>{
                many_water_electric_meter.value.water_data.splice(index,1);
            }
            const delOneElectricMeter=(index)=>{
                many_water_electric_meter.value.electric_data.splice(index,1);
            }
            
            const resetForm = ()=>{}
            const labelCol=ref({ span: 5 })
            const wrapperCol=ref({ span: 18 })
            const dateFormat = ref('YYYY/MM/DD')
            let a185_indoor_module = ref({})
            const hik_info_vision_i_community= ref(0)
            const is_aihorse_customized= ref(0)
            const hik_info_community_room= ref([])
            const onDateChange = (ee) => {
                if(ee && ee.length==2){
                    roomForm.value.contract_time_start = moment(ee[0]).format(dateFormat.value)
                    roomForm.value.contract_time_end = moment(ee[1]).format(dateFormat.value)
                }else{
                    roomForm.value.contract_time_start ='';
                    roomForm.value.contract_time_end = '';
                }
            }
            
            const onDateLeaseChange = (el) => {
                if(el && el.length==2){
                    roomForm.value.lease_time_start = moment(el[0]).format(dateFormat.value)
                    roomForm.value.lease_time_end = moment(el[1]).format(dateFormat.value)
                }else{
                    roomForm.value.lease_time_start ='';
                    roomForm.value.lease_time_end = '';
                }
                
            }
            
            // const onDateChange = (date, dateString, type) => {
            //     roomForm.value[type] = dateString
            // }
            
            onMounted(()=>{
                console.log('pageLoading===>',pageLoading.value)
                getRoomInfo()
            })

           const changeHouseInTime=(date,dateString)=>{
                roomForm.value.house_in_time=dateString;
            }
            const handleSelectChange = (value, type) => {
                roomForm.value[type] = value
                getCurrentInstance()
            }
            const handleRoomSelectChange=(value,option)=>{
                 console.log('value',value);
                 console.log('option',option);
                 
            }
            const filterOption = (input, option) => {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            }
            
            const disabledDate = (current) => {
                return current && !(current > moment(roomForm.value.village_contract_time_start) && current < moment(roomForm.value.village_contract_time_end))
            }
            
            const getRoomInfo = ()=>{
                roomForm.value = {}
                Vue.prototype.request('/community/village_api.Building/getRoomDetails', {
                    vacancy_id: props.roomId
                }).then((res) => {
                    a185_indoor_module.value = res.a185_indoor_module
                    water_electric_gas_module.value = res.water_electric_gas_module
                    many_water_electric_meter.value = res.many_water_electric_meter
                    yumenlao_special_meter.value = res.yumenlao_special_meter
                    roomForm.value = {...res.room_info, ...res.a185_indoor_module.data, ...res.water_electric_gas_module.data}
                    if(roomForm.value.village_contract_time_start && roomForm.value.village_contract_time_end){
                        disabledDate()
                    }
                    fileListStart.value=[];
                    img_length_start.value=0;
                    if(res.room_imgs){
                       fileListStart.value= res.room_imgs
                       img_length_start.value=res.room_imgs.length
                    }
                    
                    hik_info_vision_i_community.value=0;
                    is_aihorse_customized.value=0;
                    if(res.is_aihorse_customized){
                        is_aihorse_customized.value=res.is_aihorse_customized
                    }
                    if(res.hik_info_vision_i_community){
                        hik_info_vision_i_community.value=res.hik_info_vision_i_community
                    }
                    hik_info_community_room.value=[]
                    if(res.hik_info_community_room){
                        hik_info_community_room.value=res.hik_info_community_room
                    }
                    pageLoading.value = false
                }).catch(res=>{
                    pageLoading.value = false
                })
            }
            
           const handleUploadChangeStart=({fileList})=> {
                fileListStart.value = fileList
                img_length_start.value=fileList.length
            }
           const handleUploadCancelStart=() =>{
                previewImgVisible.value = false;
            }
           const  getBase64=(file)=> {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
              });
            }
           const handleUploadPreviewStart= async (file)=> {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj)
                }
                previewImageStart.value = file.url || file.preview;
                previewImgVisible.value = true;
            }
        
            return{
                rules,
                roomForm,
                labelCol,
                wrapperCol,
                onSubmit,
                resetForm,
                handleSelectChange,
                filterOption,
                moment,
                dateFormat,
                onDateChange,
                a185_indoor_module,
                water_electric_gas_module,
                pageLoading,
                disabledDate,
                many_water_electric_meter,
                addOneWaterMeter,
                addOneElectricMeter,
                delOneWaterMeter,
                delOneElectricMeter,
                hik_info_vision_i_community,
                hik_info_community_room,
                handleRoomSelectChange,
                is_aihorse_customized,
                changeHouseInTime,
                room_imgs,
                handleUploadPreviewStart,
                handleUploadCancelStart,
                handleUploadChangeStart,
                fileListStart,
                previewImgVisible,
                img_length_start,
                previewImageStart,
                getBase64,
                onDateLeaseChange,
                yumenlao_special_meter,
            }
        }
    })
</script>

<style lang="less" scoped>
    .form_con{
        display: flex;
        flex-wrap: wrap;
        .form_item{
            width: 50%;
        }
    }
    .many_water_electric_meter .water_item .form_item ,.many_water_electric_meter .electric_item .form_item  {
            width: 48%;
            display: inline-block;

    }
</style>