<template>
    <div class="basice_set">
        <a-form-model ref="ruleForm" :model="baseSetForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol" v-if="$store.getters.config">
            <a-form-model-item :label="$store.getters.config.house_name+'名称'" prop="village_name">
                <a-input class="input_style_240" v-model="baseSetForm.village_name" />
            </a-form-model-item>


            <a-form-model-item :label="$store.getters.config.house_name+'logo'" prop="village_logo" extra="建议上传200*200的图片">
                <a-upload name="avatar" list-type="picture-card" class="avatar-uploader" :show-upload-list="false"
                    :action="uploadUrl" :before-upload="beforeUpload" @change="handleUploadChange">
                    <img style="width: 6.25rem; height: 6.25rem;" v-if="imageUrl" :src="imageUrl" alt="avatar" />
                    <div v-else>
                        <a-icon :type="loading ? 'loading' : 'plus'" />
                        <div class="ant-upload-text">
                            Upload
                        </div>
                    </div>
                </a-upload>
            </a-form-model-item>
            <a-form-model-item label="所在省市区" prop="province_area">
                <!-- <a-select show-search placeholder="请选择" style="width: 120px" @change="(value)=>housePositionChange1(value, 0)">
                    <a-select-option v-for="(item,index) in housePositionList" :value="item.name">
                        {{item.name}}
                    </a-select-option>
                </a-select>
                
                <a-select v-if="positionChild1.length!=0" show-search placeholder="请选择" style="width: 120px" @change="(value)=>housePositionChange1(value, 1)">
                    <a-select-option v-for="(item,index) in positionChild1" :value="item.name">
                        {{item.name}}
                    </a-select-option>
                </a-select>
                
                <a-select v-if="positionChild2.length!=0" show-search placeholder="请选择" style="width: 120px" @change="(value)=>housePositionChange1(value, 2)">
                    <a-select-option v-for="(item,index) in positionChild2" :value="item.name">
                        {{item.name}}
                    </a-select-option>
                </a-select>
                
                <a-select v-if="positionChild3.length!=0" show-search placeholder="请选择" style="width: 120px" @change="(value)=>housePositionChange1(value, 3)">
                    <a-select-option v-for="(item,index) in positionChild3" :value="item.name">
                        {{item.name}}
                    </a-select-option>
                </a-select> -->
            </a-form-model-item>

            <a-form-model-item :label="$store.getters.config.house_name+'地址'" extra="地址不能带有上面所在地选择的省/市/区/街道/社区信息。" prop="village_address">
                <a-input class="input_style_240" v-model="baseSetForm.village_address" />
            </a-form-model-item>

            <a-form-model-item :label="$store.getters.config.house_name+'经纬度'" prop="lang_lat">
                <a-input :disabled="true" v-model="baseSetForm.long_lat" style="width: 200px;"></a-input>
                <a-button type="primary" style="margin-left: 10px;" @click="openMap()">点击获取经纬度</a-button>
            </a-form-model-item>


            <a-form-model-item :label="$store.getters.config.house_name+'登录地址'" prop="house_village_login">
                <a-input class="input_style_240" style="width:200px;" v-model="baseSetForm.house_village_login" />
                <a-button v-clipboard:copy="baseSetForm.house_village_login" v-clipboard:success="firstCopySuccess"
                          v-clipboard:error="firstCopyError" type="primary" style="margin-left: 10px;">点击复制</a-button>
            </a-form-model-item>

            <a-form-model-item label="物业联系方式" prop="property_phone" extra="电话号码以空格分开">
                <a-input class="input_style_240" v-model="baseSetForm.property_phone" />
            </a-form-model-item>
            <a-form-model-item label="物业联系地址" prop="property_address">
                <a-input class="input_style_240" v-model="baseSetForm.property_address" />
            </a-form-model-item>

            <a-form-model-item :label="'该'+$store.getters.config.house_name+$store.getters.config.single_name+'是否超过100栋'" :extra="'选择是，'+$store.getters.config.single_name+'号即可支持三位， 不支持编辑'" prop="remark">
                <a-radio-group name="radioGroup" v-model="baseSetForm.village_single_support_digit">
                    <a-radio :value="3">是</a-radio>
                    <a-radio :value="2">否</a-radio>
                </a-radio-group>
            </a-form-model-item>



            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="onSubmit">保存</a-button>
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
    import Vue from 'vue';
    import villageSetApi from "@/api/community/village/villageNewApi";
    import {
        ref,
        reactive,
        onMounted,
        defineComponent
    } from '@vue/composition-api';
    import moment from 'moment';
    export default defineComponent({
        name: 'basiceSet',
        setup(props, context) {

            const labelCol = ref({
                span: 4
            })
            const wrapperCol = ref({
                span: 14
            })

            //复制面板
            const firstCopySuccess = () => {
                Vue.prototype.$message.success('复制成功！')
            }

            const firstCopyError = () => {
                Vue.prototype.$message.error('复制失败！')
            }

            //表单操作
            let baseSetForm = ref({})
            let ruleForm = ref(null)
            const rules = reactive({})
            const onSubmit = () => {
                Vue.prototype.$confirm({
                    title: '提示',
                    content: '确定要保存此表单内容吗？',
                    onOk() {
                        ruleForm.value.validate(valid => {
                            if (valid) {
                                saveForm()
                            }
                        })
                    },
                    onCancel() {},
                });
            }

            const onChange = (value) => {
                console.log(value)
            }

            const resetForm = () => {
                baseSetForm.value = {}
                ruleForm.value.resetFields()
            }

            const saveForm = () => {
                Vue.prototype.request('/community/village_api.VillageConfig/villageInfoUpdate', baseSetForm
                    .value).then((res) => {
                    Vue.prototype.$message.success('保存成功！')
                })
            }

            const getBaseConfig = () => {
                Vue.prototype.request(villageSetApi.baseConfig, {}).then((res) => {
                    baseSetForm.value = res
                })
            }

            //图片上传
            const uploadUrl = ref('/v20/public/index.php/common/common.UploadFile/uploadPictures')
            let imageUrl = ref('')
            let loading = ref(false)
            const handleUploadChange = (info) => {
                if (info.file.status === 'uploading') {
                    loading.value = true;
                    return;
                }

                if (info.file.status === 'error') {
                    Vue.prototype.$message.error('上传失败!');
                    loading.value = false;
                    return;
                }

                if (info.file.status === 'done') {
                    getBase64(info.file.originFileObj, imageUrl => {
                        imageUrl.value = imageUrl;
                        baseSetForm.value.village_logo = imageUrl
                        loading.value = false;
                    });
                }
            }

            const getBase64 = (img, callback) => {
                const reader = new FileReader();
                reader.addEventListener('load', () => callback(reader.result));
                reader.readAsDataURL(img);
            }

            const beforeUpload = (file) => {
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

            // 通过百度地图拾取经纬度

            const mapVisible = ref(false)
            const userLat = ref('')
            const userLng = ref('')
            const address_detail = ref('北京')
            const handleMapOk = () => {
                baseSetForm.value.long_lat = userLng.value + ',' + userLat.value
                mapVisible.value = false
            }

            const handleMapCancel = () => {
                mapVisible.value = false
            }

            const openMap = () => {
                mapVisible.value = true
                initMap()
            }
            const searchMap = () => {
                if (address_detail.value) {
                    initMap()
                }
            }
            const initMap = () => {
                Vue.prototype.$nextTick(function() {
                    let map = new BMap.Map("allmap");
                    map.centerAndZoom(address_detail.value, 15);
                    map.enableScrollWheelZoom();
                    map.addEventListener("click", function(e) {
                        map.clearOverlays();
                        map.addOverlay(new BMap.Marker(e.point));
                        userLng.value = e.point.lng;
                        userLat.value = e.point.lat;
                    });
                });
            }

            onMounted(() => {
                getBaseConfig()
            })

            return {
                imageUrl,
                loading,
                ruleForm,
                labelCol,
                wrapperCol,
                baseSetForm,
                rules,
                onSubmit,
                resetForm,
                getBaseConfig,
                onChange,
                getBase64,
                moment,
                uploadUrl,
                beforeUpload,
                handleUploadChange,
                openMap,
                mapVisible,
                userLat,
                userLng,
                address_detail,
                handleMapOk,
                searchMap,
                initMap,
                handleMapCancel,
                firstCopySuccess,
                firstCopyError
            }
        }
    })
</script>

<style lang="less" scoped>
    .basice_set {
        width: 100%;

        .input_style_240 {
            width: 360px;
        }
    }

    /deep/ textarea {
        overflow-x: hidden;
        overflow-y: scroll !important;
    }
</style>
