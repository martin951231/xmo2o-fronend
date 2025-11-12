<template>
    <a-drawer :title="title" :visible="visible" :width="1300" @close="resetForm(false)" :body-style="{ paddingBottom: '80px' }">
        <a-form-model ref="ruleForm" :model="buildForm" :rules="rules" :label-col="labelCol"
           :wrapper-col="wrapperCol">
           <div style="display: flex;">
               <a-card title="基本信息" style="width: 480px">
                   <a-form-model-item :label="$store.getters.config.floor_name+'名称'" prop="floor_name">
                       <a-input class="input_style_240" v-model="buildForm.floor_name" />
                   </a-form-model-item>
                   <a-form-model-item :label="$store.getters.config.floor_name+'编号'" prop="floor_number">
                       <a-input-number :max="99" :min="1" class="input_style_240" v-model="buildForm.floor_number" extra="必填项（仅限1-99不重复的数字" />
                   </a-form-model-item>
                   <a-form-model-item :label="$store.getters.config.floor_name+'地址'" prop="long_lat">
                       <a-input :disabled="true" v-model="buildForm.long_lat" style="width: 200px;"></a-input>
                       <a-button type="primary" style="margin-left: 10px;" @click="openMap()">点击获取经纬度</a-button>
                   </a-form-model-item>
                   <a-form-model-item :label="$store.getters.config.floor_name+'管家名称'" prop="floor_keeper_name">
                        <a-input  class="input_style_240" v-model="buildForm.floor_keeper_name" />
                   </a-form-model-item>
                   <a-form-model-item label="联系方式" prop="floor_keeper_phone">
                        <a-input  class="input_style_240" v-model="buildForm.floor_keeper_phone" />
                   </a-form-model-item>
                   <a-form-model-item label="管家头像" prop="floor_keeper_head">
                       <a-upload name="reply_pic" :multiple="false" :action="uploadUrl" :data="uploadParams" :before-upload="beforeUpload" :showUploadList="false"
                           :headers="headers" @change="(info)=>handleUploadChange(info, 'floor_keeper_head')">
                           <a-button :loading="temimgLoading">上传头像</a-button>
                           <a-button type="link" v-if="imageUrl" @click.stop="previewImage()">查看头像图片</a-button>
                       </a-upload>
                   </a-form-model-item>
                   <a-form-model-item label="排序" prop="sort">
                       <a-input-number :min="0" class="input_style_240" v-model="buildForm.sort" />
                   </a-form-model-item>
                   <a-form-model-item label="状态" prop="status">
                       <a-switch checked-children="开启" un-checked-children="关闭" v-model="statusBool" default-checked  />
                   </a-form-model-item>
               </a-card>
               <a-card title="相关费用" style="width: 320px">
                   <a-form-model-item label="物业费" prop="property_fee">
                       <a-input-number class="input_style_140" v-model="buildForm.property_fee" />
                   </a-form-model-item>
                   <a-form-model-item label="水费" prop="water_fee">
                       <a-input-number class="input_style_140" v-model="buildForm.water_fee" />
                   </a-form-model-item>
                   <a-form-model-item label="电费" prop="electric_fee">
                       <a-input-number class="input_style_140" v-model="buildForm.electric_fee" />
                   </a-form-model-item>
                   <a-form-model-item label="燃气费" prop="gas_fee">
                       <a-input-number class="input_style_140" v-model="buildForm.gas_fee" />
                   </a-form-model-item>
                   <a-form-model-item label="停车费" prop="parking_fee">
                       <a-input-number class="input_style_140" v-model="buildForm.parking_fee" />
                   </a-form-model-item>
               </a-card>
               <a-card :title="$store.getters.config.floor_name+'资料'" style="width: 480px">
                   <a-form-model-item :label="$store.getters.config.floor_name+'面积(m²)'" prop="floor_area">
                       <a-input class="input_style_240" v-model="buildForm.floor_area" />
                   </a-form-model-item>
                   <a-form-model-item label="门户数量" prop="house_num">
                       <a-input-number class="input_style_240" v-model="buildForm.house_num" />
                   </a-form-model-item>
                   <a-form-model-item label="地面建筑层数" prop="floor_upper_layer_num">
                       <a-input-number class="input_style_240" v-model="buildForm.floor_upper_layer_num" />
                   </a-form-model-item>
                   <a-form-model-item label="地下建筑层数" prop="floor_lower_layer_num">
                       <a-input-number class="input_style_240" v-model="buildForm.floor_lower_layer_num" />
                   </a-form-model-item>
                   <a-form-model-item label="起始住人楼层" prop="start_layer_num">
                       <a-input-number class="input_style_240" v-model="buildForm.start_layer_num" />
                   </a-form-model-item>
                   <a-form-model-item label="最高住人楼层" prop="end_layer_num">
                       <a-input-number class="input_style_240" v-model="buildForm.end_layer_num" />
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
              textAlign: 'center',
              left: 0,
              background: '#fff',
              borderRadius: '0 0 4px 4px',
            }">
            <a-button  @click="resetForm(false)" style="margin-right:30px;">
                关闭
            </a-button>
            <a-button type="primary" :loading="confirmLoading" @click="onSubmit">
                保存
            </a-button>
        </div>
        <a-modal title="预览图片" :width="650" :visible="previewVisible" @cancel="handlePreviewCancel" :footer="null">
            <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
                <img preview="2" style="width: 550px;" :src="imageUrl">
            </div>
        </a-modal>
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
        reactive,
        onMounted,
        nextTick,
        defineComponent
    } from '@vue/composition-api';
    import villageNew from "@/api/community/village/villageNewApi";
    import store from '@/store';
    export default defineComponent({
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            single_id: {
                type: [String, Number],
                default: 0
            },
             floor_id: {
                type: [String, Number],
                default: 0
            }
        },
        setup(props, context) {
            watch(() => props.visible, (val) => {
                if(val){
                    if(props.floor_id>0){
                        title.value='编辑'+store.getters.config.floor_name;
                    }else{
                        title.value='添加'+store.getters.config.floor_name;
                    }
                    getFloorInfo(props.single_id,props.floor_id)
                }
            }, {
                deep: true
            })
            const formDate = (date) =>{
                let year = date.getFullYear()
                let mon = (date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : date.getMonth()+1
                let data = date.getDate()  < 10 ? "0"+(date.getDate()) : date.getDate()
                let newDate = year +"-"+ mon +"-"+ data
                return newDate
            }
            const statusBool = ref(false)
            const searchArea = ref(false)
            const confirmLoading = ref(false)
            const buildForm = ref({})
            const title = ref('编辑'+store.getters.config.floor_name)
            let temimgLoading = ref(false)
            //上传图片部分
            const headers = reactive({
                authorization: 'authorization-text'
            })
            const uploadUrl = ref('/v20/public/index.php/common/common.UploadFile/uploadImg')
            const uploadParams = reactive({
                upload_dir: 'village'
            }) 
            const rules = ref({
                floor_name: [{ required: true, message: '请输入'+store.getters.config.floor_name+'名称', trigger: 'blur' }],
                floor_number: [{ required: true, message: '请输入'+store.getters.config.floor_name+'编号', trigger: 'blur' }],
                long_lat: [{ required: true, message: '请选择'+store.getters.config.floor_name+'地址', trigger: 'blur' }],
                floor_area: [{ required: true, message: '请输入'+store.getters.config.floor_name+'面积', trigger: 'blur' }],
                house_num: [{ required: true, message: '请输入所含门户数', trigger: 'blur' }],
            })
            const ruleForm = ref()
            const labelCol = ref({
                span: 6
            })
            const wrapperCol = ref({
                span: 16
            })

            const onSubmit = () => {
                ruleForm.value.validate(valid => {
                    if (valid) {
                        buildForm.value.single_id =props.single_id
                        buildForm.value.status = statusBool.value?1:0
                        console.log('buildForm.value===>', buildForm.value)
                        confirmLoading.value = true
                        saveForm()
                    }
                })
            }

            const resetForm = (flag) => {
                context.emit('closeDrawer', flag)
                buildForm.value = {}
                ruleForm.value.resetFields()
            }

            const saveForm = () => {
                Vue.prototype.request(villageNew.saveUnitRentalFloorInfo, buildForm
                    .value).then((res) => {
                    confirmLoading.value = false
                    if(props.floor_id>0){
                        Vue.prototype.$message.success('编辑成功！')
                    }else{
                        Vue.prototype.$message.success('添加成功！')
                    }
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
                            console.log('res===>',address_detail.value, res)
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
            let imageUrl = ref('')
            const getFloorInfo = (single_id,floor_id) => {
                Vue.prototype.request(villageNew.unitRentalFloorInfo, {
                    single_id,floor_id,
                }).then((res) => {
                    buildForm.value = res
                    buildForm.value.sort = res.sort || 0
                    buildForm.value.long_lat =  res.long + ',' + res.lat
                    imageUrl.value = res.floor_keeper_head
                    let point = new BMap.Point(Number(res.long), Number(res.lat))
                    new BMap.Geocoder().getLocation(point, data => {
                        address_detail.value = data.address
                    })
                    statusBool.value = res.status == 1?true:false
                })
            }
            
            const handleUploadChange = (info, type)=>{
                if (info.file.status === 'uploading') {
                    temimgLoading.value = true
                    return;
                }
                
                if (info.file.status === 'error') {
                    Vue.prototype.$message.error('上传失败!');
                    temimgLoading.value = true
                    return;
                }

                if (info.file.status === 'done') {
                        imageUrl.value = info.file.response.data.full_url
                        buildForm.value.floor_keeper_head = info.file.response.data.image
                        temimgLoading.value = false
                }
            }
            const beforeUpload=(file, res)=> {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    Vue.prototype.$message.error('You can only upload JPG file!');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    Vue.prototype.$message.error('Image must smaller than 2MB!');
                }
                return isJpgOrPng && isLt2M;
            }
            let previewVisible = ref(false)
            const handlePreviewCancel = ()=>{
                previewVisible.value = false
            }
            const previewImage = (type) => {
                previewVisible.value = true
            }
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
                ruleForm,
                searchArea,
                formDate,
                moment,
                statusBool,
                title,
                getFloorInfo,
                uploadUrl,
                uploadParams,
                headers,
                beforeUpload,
                temimgLoading,
                handleUploadChange,
                imageUrl,
                previewVisible,
                handlePreviewCancel,
                previewImage,
            }
        }
    })
</script>

<style lang="less" scoped>
    .input_style_240 {
        width: 240px;
    }
    .input_style_140{
        width: 140px;
    }
</style>
