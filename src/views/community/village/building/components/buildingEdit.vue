<template>
    <a-drawer :title="title" :visible="visible" :width="1300" @close="resetForm(false)" :body-style="{ paddingBottom: '80px' }">
        <a-form-model ref="ruleForm" :model="buildForm" :rules="rules" :label-col="labelCol"
           :wrapper-col="wrapperCol">
           <div style="display: flex;">
               <a-card title="基本信息" style="width: 750px">
                   <a-form-model-item :label="$store.getters.config.single_name+'名称'" prop="single_name">
                       <a-input class="input_style_240" v-model="buildForm.single_name" />
                   </a-form-model-item>
                   <a-form-model-item :label="$store.getters.config.single_name+'编号'" prop="single_number">
                       <a-input-number :max="99" :min="1" class="input_style_240" v-model="buildForm.single_number" />
                   </a-form-model-item>
                   <a-form-model-item :label="$store.getters.config.single_name+'地址'" prop="long_lat">
                       <a-input :disabled="true" v-model="buildForm.long_lat" style="width: 200px;"></a-input>
                       <a-button type="primary" style="margin-left: 10px;" @click="openMap()">点击获取经纬度</a-button>
                   </a-form-model-item>
                   <a-form-model-item label="合同时间"
                       :extra="'设置'+$store.getters.config.single_name+'时间范围，设置后物业只能收取合同时间内收费项目，未到合同开始时间或结束时间不能收费；未设置物业服务'+$store.getters.config.house_name+'时间范围，则不影响。'">
                       <a-range-picker :disabledDate="disabledDate" v-if="startTime && dateFormat" :value="[moment(startTime, dateFormat), moment(endTime, dateFormat)]" @change="onDateChange" />
                       <a-range-picker :disabledDate="disabledDate" v-else @change="onDateChange" />
                   </a-form-model-item>
                   <a-form-model-item label="排序" prop="sort">
                       <a-input-number :min="0" class="input_style_240" v-model="buildForm.sort" />
                   </a-form-model-item>
                   <a-form-model-item label="状态" prop="status">
                       <a-switch checked-children="开启" un-checked-children="关闭" v-model="statusBool" default-checked  />
                   </a-form-model-item>
                   <a-form-model-item label="海康智慧社区楼栋"  v-if="hik_info_vision_i_community==1" extra="如果切换绑定的楼栋,将会解除该楼栋下的所有已绑定的对应关系。切换后请去手动重新绑定已有的单元,房间数据">
                       <a-select  placeholder="请选择匹配的楼栋" style="width: 240px"
                           @change="handleSingleSelectChange"  v-model="buildForm.third_single_index_id" >
                           <a-select-option value="">请选择一个匹配的楼栋</a-select-option>
                           <a-select-option v-for="(item, index) in hik_info_community_single" :value="item.index_code" :index="index" :disabled="item.is_disabled" >
                               {{item.name}}</a-select-option>
                       </a-select>
                   </a-form-model-item>
                   
               </a-card>
               <a-card :title="$store.getters.config.single_name+'资料'" style="width: 550px">
                   <a-form-model-item :label="$store.getters.config.single_name+'面积(m²)'" prop="measure_area">
                       <a-input class="input_style_240" v-model="buildForm.measure_area" />
                   </a-form-model-item>
                   <a-form-model-item :label="'所含'+$store.getters.config.floor_name+'数'" prop="floor_num">
                       <a-input-number class="input_style_240" v-model="buildForm.floor_num" />
                   </a-form-model-item>
                   <a-form-model-item label="所含房屋数" prop="vacancy_num">
                       <a-input-number class="input_style_240" v-model="buildForm.vacancy_num" />
                   </a-form-model-item>
                   <a-form-model-item label="地面建筑层数" prop="upper_layer_num">
                       <a-input-number class="input_style_240" v-model="buildForm.upper_layer_num" />
                   </a-form-model-item>
                   <a-form-model-item label="地下建筑层数" prop="lower_layer_num">
                       <a-input-number class="input_style_240" v-model="buildForm.lower_layer_num" />
                   </a-form-model-item>
               </a-card>
           </div>
        </a-form-model>
        <div :style="{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e8e8e8',
              padding: '10px 16px',
              textAlign: 'right',
              left: 0,
              background: '#fff',
              borderRadius: '0 0 4px 4px',
            }">
            <a-button style="marginRight: 8px" @click="resetForm(false)">
                关闭
            </a-button>
            <a-button type="primary" :loading="confirmLoading" @click="onSubmit">
                保存
            </a-button>
        </div>
        
        <a-modal v-if="mapVisible" title="百度地图拾取经纬度" :visible="mapVisible" :width="800" @ok="handleMapOk"
            @cancel="handleMapCancel">
            <a-input style="width: 200px;" type="text" id="suggestId" name="address_detail" placeholder="请输入城市名/地区名"
                v-model="address_detail" class="input_style" />
            <a-button style="margin-left:10px;" type="primary" @click="searchMap">搜索</a-button>
            <div id="allmap" style="width:100%; height: 500px; margin-top: 10px;"></div>
        </a-modal>
    </a-drawer>
</template>

<script>
    import Vue from 'vue';
    import moment from 'moment';
    import {
        ref,
        watch,
        onMounted,
        nextTick,
        defineComponent
    } from '@vue/composition-api';
    import villageNew from "@/api/community/village/villageNewApi";
    import store from "@/store"; 
    export default defineComponent({
        props: {
            title: {
                type: String,
                default: ''
            },
            visible: {
                type: Boolean,
                default: false
            },
            single_id: {
                type: [String, Number],
                default: 0
            }
        },
        setup(props, context) {
            const formDate = (date) =>{
                let year = date.getFullYear()
                let mon = (date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : date.getMonth()+1
                let data = date.getDate()  < 10 ? "0"+(date.getDate()) : date.getDate()
                let newDate = year +"-"+ mon +"-"+ data
                return newDate
            }
            const disabledDate = (current) => {
                return current && !(current > moment(buildForm.value.village_contract_time_start) && current < moment(buildForm.value.village_contract_time_end))
            }
            const statusBool = ref(false)
            const startTime = ref('')
            const endTime = ref('')
            const dateFormat = ref('YYYY/MM/DD')
            const searchArea = ref(false)
            const confirmLoading = ref(false)
            const buildForm = ref({})
            const hik_info_vision_i_community= ref(0)
            const hik_info_community_single= ref([])
            const rules = ref({
                single_name: [{ required: true, message: '请输入'+store.getters.config.single_name+'名称', trigger: 'blur' }],
                single_number: [{ required: true, message: '请输入'+store.getters.config.single_name+'编号', trigger: 'blur' }],
                long_lat: [{ required: true, message: '请选择'+store.getters.config.single_name+'地址', trigger: 'blur' }],
                sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
                status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
                measure_area: [{ required: true, message: '请输入'+store.getters.config.single_name+'面积', trigger: 'blur' }],
                floor_num: [{ required: true, message: '请输入所含'+store.getters.config.floor_name+'数', trigger: 'blur'}],
                vacancy_num: [{ required: true, message: '请输入所含房屋数', trigger: 'blur' }],
                upper_layer_num: [{ required: true, message: '请输入地面建筑层数', trigger: 'blur' }],
                lower_layer_num: [{ required: true, message: '请输入地下建筑层数', trigger: 'blur' }]
            })
            const ruleForm = ref()
            const labelCol = ref({
                span: 6
            })
            const wrapperCol = ref({
                span: 16
            })
            const onDateChange = (e) => {
                if(e[0] && e[1]){
                    startTime.value = e[0].format('YYYY-MM-DD')
                    endTime.value = e[1].format('YYYY-MM-DD')
                    buildForm.value.contract_time_start = e[0].format('YYYY-MM-DD')
                    buildForm.value.contract_time_end = e[1].format('YYYY-MM-DD')
                    return
                }
                startTime.value = ''
                endTime.value = ''
                buildForm.value.contract_time_start = ''
                buildForm.value.contract_time_end = ''
            }

            const onSubmit = () => {
                ruleForm.value.validate(valid => {
                    if (valid) {
                        buildForm.value.single_id = buildForm.value.id
                        buildForm.value.status = statusBool.value?1:0
                        confirmLoading.value = true
                        saveForm()
                    }
                })
            }
            
            const handleSingleSelectChange=(value,option)=>{
                 console.log('value',value);
                 console.log('option',option);
                 
            }
             
            const resetForm = (flag) => {
                context.emit('closeDrawer', flag)
                buildForm.value = {}
                ruleForm.value.resetFields()
            }

            const saveForm = () => {
                Vue.prototype.request(villageNew.updateBuildingInfoByID, buildForm
                    .value).then((res) => {
                    confirmLoading.value = false
                    Vue.prototype.$message.success('编辑成功！')
                    resetForm(true)
                }).catch(e=>{
                    confirmLoading.value = false
                })
            }

            //百度地图拾取经纬度部分
            const mapVisible = ref(false)
            const userLat = ref('')
            const userLng = ref('')
            let address_detail = ref('')
            const handleMapOk = () => {
                buildForm.value.long_lat = userLng.value + ',' + userLat.value
                buildForm.value.long = userLng.value
                buildForm.value.lat = userLat.value
                mapVisible.value = false
                searchArea.value = false
            }

            const handleMapCancel = () => {
                mapVisible.value = false
                searchArea.value = false
            }

            const openMap = () => {
                mapVisible.value = true
                initMap()
            }
            const searchMap = () => {
                if (address_detail.value) {
                    searchArea.value = true
                    initMap()
                }
            }
            const initMap = () => {
                nextTick(function() {
                    let map = new BMap.Map("allmap");
                    let point;
                    if(buildForm.value.lat && buildForm.value.long && !searchArea.value){
                        map.clearOverlays();
                        point = new BMap.Point(buildForm.value.long, buildForm.value.lat);
                        let labelopts = {
                            position: point,
                            offset: new BMap.Size(0, 15)
                        };
                        map.addOverlay(new BMap.Marker(point));
                        map.centerAndZoom(point, 15);
                        map.enableScrollWheelZoom();
                    } else {
                        let myGeocoder = new BMap.Geocoder();
                        myGeocoder.getPoint(address_detail.value, function(res) {
                            if (res) {
                                map.clearOverlays();
                                point = new BMap.Point(res.lng, res.lat);
                                let labelopts = {
                                    position: point,
                                    offset: new BMap.Size(0, 15)
                                };
                                map.addOverlay(new BMap.Marker(point));
                                map.centerAndZoom(point, 15);
                                map.enableScrollWheelZoom();
                            } else {
                              console.log('未能找到该地址');
                              Vue.prototype.$message.warn('未能找到该地址')
                            }
                        },'亚夏汽车大厦')
                    }
                    
                    map.addEventListener("click", function(e) {
                        map.clearOverlays();
                        map.addOverlay(new BMap.Marker(e.point));
                        userLng.value = e.point.lng;
                        userLat.value = e.point.lat;
                        new BMap.Geocoder().getLocation(e.point, res => {
                            address_detail.value = res.address
                        })
                    });
                });
            }

            const getBuildInfo = (single_id) => {
                Vue.prototype.request(villageNew.buildingInfo, {
                    single_id,
                }).then((res) => {
                    buildForm.value = res
                    buildForm.value.sort = res.sort || 0
                    buildForm.value.long_lat =  res.long + ',' + res.lat
                    let point = new BMap.Point(Number(res.long), Number(res.lat))
                    new BMap.Geocoder().getLocation(point, data => {
                        address_detail.value = data.address
                    })
                    statusBool.value = res.status == 1?true:false
                    startTime.value = res.contract_time_start
                    endTime.value = res.contract_time_end
                    hik_info_vision_i_community.value=0;
                    if(res.hik_info_vision_i_community){
                        hik_info_vision_i_community.value=res.hik_info_vision_i_community
                    }
                    hik_info_community_single.value=[]
                    if(res.hik_info_community_single){
                        hik_info_community_single.value=res.hik_info_community_single
                    }
                })
            }

            watch(() => props.visible, (val) => {
                if(val){
                    getBuildInfo(props.single_id)
                }
            }, {
                deep: true
            })

            return {
                confirmLoading,
                onSubmit,
                resetForm,
                buildForm,
                labelCol,
                wrapperCol,
                rules,
                saveForm,
                //地图拾取经纬度部分
                openMap,
                mapVisible,
                userLat,
                userLng,
                address_detail,
                handleMapOk,
                searchMap,
                initMap,
                handleMapCancel,
                //如期插件
                onDateChange,
                ruleForm,
                searchArea,
                dateFormat,
                formDate,
                startTime,
                endTime,
                moment,
                statusBool,
                disabledDate,
                hik_info_vision_i_community,
                hik_info_community_single,
                handleSingleSelectChange
            }
        }
    })
</script>

<style lang="less" scoped>
    .input_style_240 {
        width: 240px;
    }
</style>
