<template>
    <div class="base_config">
        <a-form-model ref="ruleForm" :model="baseConfigForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <a-form-model-item label="物业名称" prop="property_name" extra=" 如果想再次修改物业公司名称,请联系平台修改">
                <a-input :disabled="baseConfigForm.set_name_time?true:false" class="form_width" v-model="baseConfigForm.property_name" />
            </a-form-model-item>
            <a-form-model-item label="物业公司名称简称" prop="property_short_name" extra="如果想再次修改物业公司名称简称,请联系平台修改">
                <a-input :disabled="baseConfigForm.set_short_name_time?true:false" class="form_width" v-model="baseConfigForm.property_short_name" />
            </a-form-model-item>
            <a-form-model-item label="所在省市区" prop="choose_cityarea">
                <a-select @change="(value)=>handleSelectChange(value, 'province')" style="width: 200px;" v-model="baseConfigForm.province_id" placeholder="请选择省">
                    <a-select-option :value="item.area_id" v-for="(item,index) in provinceList" :key="index">{{item.area_name}}</a-select-option>
                </a-select>
                <a-select @change="(value)=>handleSelectChange(value, 'city')" style="width: 200px; margin-left: 20px;" v-model="baseConfigForm.city_id" placeholder="请选择市">
                    <a-select-option :value="item.area_id" v-for="(item,index) in cityList" :key="index">{{item.area_name}}</a-select-option>
                </a-select>
                <a-select @change="(value)=>handleSelectChange(value, 'area')" style="width: 200px; margin-left: 20px;" v-model="baseConfigForm.area_id" placeholder="请选择区">
                    <a-select-option :value="item.area_id" v-for="(item,index) in areaList" :key="index">{{item.area_name}}</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="物业地址" prop="property_address" extra="地址不能带有上面所在地选择的省/市/区信息。">
                <a-input class="form_width" v-model="baseConfigForm.property_address" />
            </a-form-model-item>
            <a-form-model-item label="物业logo" prop="property_logo" extra="建议上传200*200的图片">
                <a-upload name="reply_pic" list-type="picture-card" class="avatar-uploader" :show-upload-list="false" :data="uploadParams"
                    :action="uploadUrl" :before-upload="beforeUpload" @change="handleChange">
                    <img style="width: 6.25rem; height: 6.25rem;" v-if="imageUrl" :src="imageUrl" alt="avatar" />
                    <div v-else>
                        <a-icon :type="loading ? 'loading' : 'plus'" />
                        <div class="ant-upload-text">
                            Upload
                        </div>
                    </div>
                </a-upload>
            </a-form-model-item>

            <a-form-model-item label="物业经纬度" prop="long_lat">
                <a-input :disabled="true" class="form_width" v-model="baseConfigForm.long_lat" />
                <a-button style="margin-left: 20px;" type="primary" @click="openMap()">获取经纬度</a-button>
            </a-form-model-item>

            <a-form-model-item label="物业联系方式" prop="property_phone" extra="电话号码以空格分开">
                <a-input class="form_width" v-model="baseConfigForm.property_phone" />
                <a-button v-clipboard:copy="baseConfigForm.property_phone" v-clipboard:success="copySuccess"
                    v-clipboard:error="copyError" style="margin-left: 20px;" type="primary">
                    点击复制
                </a-button>
            </a-form-model-item>

            <a-form-model-item v-if="baseConfigForm.house_property_login" label="物业登录地址" prop="house_property_login">
                <a-button type="link"  title="当前物业指定的登录地址，点击右侧即可复制链接">
                    {{baseConfigForm.house_property_login}}</a-button>
                <a-button v-clipboard:copy="baseConfigForm.house_property_login" v-clipboard:success="copySuccess"
                    v-clipboard:error="copyError" style="margin-left: 20px;" type="primary">
                    点击复制
                </a-button>
            </a-form-model-item>

            <a-form-model-item :wrapper-col="{ span: 14, offset: 3 }">
                <a-button type="primary" @click="onSubmit">提交</a-button>
                <a-button style="margin-left: 10px;" @click="resetForm">重置</a-button>
            </a-form-model-item>
        </a-form-model>

        <a-modal v-if="mapVisible" title="百度地图拾取经纬度" :visible="mapVisible" :width="800" @ok="handleMapOk"
            @cancel="handleMapCancel">
            <a-input style="width: 200px;" type="text" id="suggestId" name="address_detail" placeholder="请输入城市名/地区名"
                v-model="address_detail" class="input_style" />
            <a-button style="margin-left:10px;" type="primary" @click="searchMap">搜索</a-button>
            <div id="allmap" style="width:100%; height: 500px; margin-top: 10px;"></div>
        </a-modal>
    </div>
</template>

<script>
    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    import propertyApi from '@/api/community/property/packages';
    export default {
        data() {
            return {
                loading: false,
                uploadUrl: '/v20/public/index.php/common/common.UploadFile/uploadImg',
                imageUrl: '',
                labelCol: {
                    span: 3
                },
                wrapperCol: {
                    span: 14
                },
                baseConfigForm: {},
                rules: {
                    property_name: [{
                        required: true,
                        message: '请输入物业名称',
                        trigger: 'blur'
                    }],
                    property_short_name: [{
                        required: true,
                        message: '请输入物业公司简称',
                        trigger: 'blur'
                    }],
                    choose_cityarea: [{
                        required: false,
                        message: '请选择省市区域',
                        trigger: 'blur'
                    }],
                    property_address: [{
                        required: true,
                        message: '请输入物业地址',
                        trigger: 'blur'
                    }],
                    property_logo: [{
                        required: true,
                        message: '请选择物业图标',
                        trigger: 'blur'
                    }],
                    long_lat: [{
                        required: true,
                        message: '请选择经纬度',
                        trigger: 'blur'
                    }],
                    property_phone: [{
                        required: true,
                        message: '请输入物业联系方式',
                        trigger: 'blur'
                    }]
                },
                mapVisible: false,
                address_detail: '北京',
                userlocation: {
                    lng: "",
                    lat: ""
                },
                userLng: "",
                userLat: "",
                provinceList: [],
                cityList: [],
                areaList: [],
                uploadParams: {
                    upload_dir: 'proptery'
                },
                searchArea: false
            }
        },
        
        mounted(){
          this.getBaseConfig()  
        },
        
        methods: {
            getBaseConfig(){
                this.request(propertyApi.propertyConfigSetApi).then((res) => {
                    this.baseConfigForm = res
                    this.baseConfigForm.long_lat = res.long + ',' +res.lat
                    this.imageUrl = res.property_logo
                    if(res.province_id){
                        this.baseConfigForm.province_id = res.province_id
                    } else {
                        this.baseConfigForm.province_id = ''
                    }
                    
                    if(res.city_id){
                        this.baseConfigForm.city_id = res.city_id
                    } else {
                        this.baseConfigForm.city_id = ''
                    }
                    
                    if(res.area_id){
                        this.baseConfigForm.area_id = res.area_id
                    } else {
                        this.baseConfigForm.area_id = ''
                    }
                    
                    if(res.property_address){
                        this.address_detail = res.property_address
                    }
                    this.getProvice()
                    this.getCity(res.province_id)
                    this.getArea(res.city_id)
                })
            },
            
            getProvice(){
                this.request(propertyApi.ajaxProvince).then((res) => {
                    if(res.error && res.error == 1){
                        this.$message.warn(res.info)
                    }
                    this.provinceList = res.list
                    if(!this.baseConfigForm.province_id){
                        this.baseConfigForm.province_id = res.list[0].province_id
                    }
                })
            },
            
            getCity(id, name=''){
                this.request(propertyApi.ajaxCity, {id,name,}).then((res) => {
                    if(res.error && res.error == 1){
                        this.$message.warn(res.info)
                    }
                    this.cityList = res.list
                    if(!this.baseConfigForm.city_id){
                        this.baseConfigForm.city_id = res.list[0].area_id
                        this.getArea(res.list[0].area_id, res.list[0].area_name)
                    }
                })
            },
            
            getArea(id, name=''){
                this.request(propertyApi.ajaxArea, {id,name,}).then((res) => {
                    if(res.error && res.error == 1){
                        this.$message.warn(res.info)
                    }
                    this.areaList = res.list
                    if(!this.baseConfigForm.area_id){
                        this.baseConfigForm.area_id = res.list[0].area_id
                    }
                })
            },
            
            saveForm(params){
                this.request(propertyApi.saveConfig, params).then((res) => {
                    this.$message.success('编辑成功！')
                    this.getBaseConfig()
                })
            },
            
            navigateTo(url) {
                window.open(url)
            },
            copyError() {
                this.$message.error('复制失败！')
            },
            copySuccess() {
                this.$message.success('复制成功！')
            },
            onSubmit() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        if(this.baseConfigForm.property_name && this.baseConfigForm.property_name.length>50){
                            this.$message.warn('物业名称长度限制在50个字符以内');
                            return
                        }
                        
                        if(this.baseConfigForm.property_short_name && this.baseConfigForm.property_short_name.length>50){
                            this.$message.warn('物业公司名字简称长度限制在50个字符以内');
                            return
                        }
                        
                        if(!this.baseConfigForm.province_id || !this.baseConfigForm.city_id || !this.baseConfigForm.area_id){
                            this.$message.warn('请输入完整省市区');
                            return
                        }
                        
                        
                        let params = {
                            property_name: this.baseConfigForm.property_name,
                            property_short_name: this.baseConfigForm.property_short_name,
                            province_id: this.baseConfigForm.province_id,
                            city_id: this.baseConfigForm.city_id,
                            area_id: this.baseConfigForm.area_id,
                            property_address: this.baseConfigForm.property_address,
                            property_logo: this.baseConfigForm.property_logo,
                            long_lat: this.baseConfigForm.long_lat,
                            lat: this.baseConfigForm.lat,
                            long: this.baseConfigForm.long,
                            property_phone: this.baseConfigForm.property_phone
                        }
                        
                        if(this.baseConfigForm.set_name_time){
                            delete params.property_name
                        }
                        if(this.baseConfigForm.set_short_name_time){
                            delete params.property_short_name
                        }
                        
                        this.saveForm(params)
                    }
                });
            },
            resetForm() {
                this.imageUrl = ''
                this.baseConfigForm = {}
                this.cityList = []
                this.areaList = []
                this.baseConfigForm.province_id = ''
                this.baseConfigForm.city_id = ''
                this.baseConfigForm.area_id = ''
                this.$refs.ruleForm.resetFields();
            },
            handleMapOk() {
                if(this.userLng && this.userLat){
                    this.baseConfigForm.long_lat = this.userLng + ',' + this.userLat
                    this.baseConfigForm.lat = this.userLat
                    this.baseConfigForm.long = this.userLng
                    this.mapVisible = false
                    this.searchArea = false
                } else {
                    this.mapVisible = false
                    this.searchArea = false
                }
            },

            handleMapCancel() {
                this.mapVisible = false
                this.searchArea = false
            },

            openMap() {
                this.mapVisible = true
                this.address_detail = this.baseConfigForm.property_address
                this.initMap()
            },
            searchMap() {
                if (this.address_detail) {
                    this.searchArea = true
                    this.initMap()
                }
            },
            initMap() {
                this.$nextTick(function() {
                    let th = this;
                    let map = new BMap.Map("allmap");
                    let point;
                    if(th.baseConfigForm.lat && th.baseConfigForm.long && !this.searchArea){
                        map.clearOverlays();
                        point = new BMap.Point(th.baseConfigForm.long, th.baseConfigForm.lat);
                        let labelopts = {
                            position: point,
                            offset: new BMap.Size(0, 15)
                        };
                        let label = new BMap.Label(th.baseConfigForm.property_name||'暂无物业名称', labelopts);
                        label.setStyle({
                            color: "#fff",
                            backgroundColor: "rgba(0, 0, 0, 0.3)",
                            borderRadius: "10px",
                            padding: "0 10px",
                            fontSize: "10px",
                            lineHeight: "20px",
                            border :"0",
                            transform:'translateX(-50%)'
                        });
                        map.addOverlay(label);
                        map.addOverlay(new BMap.Marker(point));
                    } else {
                        point = th.address_detail || '北京'
                    }
                    map.centerAndZoom(point, 15);
                    map.enableScrollWheelZoom();
                    map.addEventListener("click", function(e) {
                        map.clearOverlays();
                        map.addOverlay(new BMap.Marker(e.point));
                        th.userLng = e.point.lng;
                        th.userLat = e.point.lat;
                    });
                });
            },

            handleChange(info) {
                if (info.file.status === 'uploading') {
                    this.loading = true;
                    return;
                }

                if (info.file.status === 'error') {
                    this.$message.error('上传失败!');
                    this.loading = false;
                    return;
                }

                if (info.file.status === 'done') {
                    this.imageUrl = info.file.response.data.full_url;
                    this.baseConfigForm.property_logo = info.file.response.data.image;
                    this.loading = false;
                }
            },

            beforeUpload(file, res) {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    this.$message.error('You can only upload JPG file!');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('Image must smaller than 2MB!');
                }
                return isJpgOrPng && isLt2M;
            },
            
            handleSelectChange(value, name){
                console.log(value, name)
                if(name=='province'){
                    this.baseConfigForm.province_id = value
                    this.baseConfigForm.city_id = ''
                    this.baseConfigForm.area_id = ''
                    let index = this.provinceList.findIndex(v=>v.area_id == value)
                    this.getCity(value, this.provinceList[index].area_name)
                } else if(name=='city'){
                    this.baseConfigForm.city_id = value
                    this.baseConfigForm.area_id = ''
                    this.cityList.map(v=>{
                        if(v.area_id == value){
                            this.getArea(value, v.area_name)
                        }
                    })
                } else if(name=='area'){
                    this.baseConfigForm.area_id = value
                    this.$forceUpdate()
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    .base_config {
        .form_width {
            width: 300px;
        }
    }
</style>
