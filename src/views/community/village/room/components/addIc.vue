<template>
    <a-modal title="添加IC卡" :width="600" :visible="visible" @cancel="handleCancel" @ok="handleOk">
        <a-form-model ref="ruleForm" :model="icForm" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
            <a-form-model-item v-if="visible">
                <span slot='label'><span style="color: red;margin-right:3px;">*</span>设备品牌名称</span>
                <a-select placeholder="请选择设备品牌名称" @change="(value)=>handleSelectChange(value, 'brand_name')">
                    <a-select-option v-for="(item, index) in brandList" :key="index" :value="item.brand_id">
                        {{item.brand_name}}
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item v-if="visible">
                <span slot='label'><span style="color: red;margin-right:3px;">*</span>设备类型名称</span>
                <a-select placeholder="请选择设备类型名称" @change="(value)=>handleSelectChange(value, 'type_name')">
                    <a-select-option v-for="(item, index) in typeList" :key="index" :value="item.type_id">
                        {{item.type_name}}
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="IC卡号" prop="ic_card">
                <a-input :disabled="true" placeholder="请输入IC卡号" v-model="icForm.ic_card" />
                <a @click="rfid_get_card_func">读取卡号</a>
            </a-form-model-item>
        </a-form-model>
    </a-modal>
</template>

<script>
    import Vue from 'vue';
    import {
        ref,
        watch,
        toRefs,
        computed,
        reactive,
        onMounted,
        onUpdated,
        nextTick,
        defineComponent,
        getCurrentInstance
    } from '@vue/composition-api';
    export default defineComponent({
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            },
            roomId: {
                type: [String, Number],
                default: 0
            }
        },
        setup(props, context) {
            let icForm = ref({
                brand_name: '',
                type_name: '',
                ic_card: '',
                vacancy_id: props.roomId
            })
            watch(()=>props.roomId, val=>{
                icForm.value = {
                    brand_name: '',
                    type_name: '',
                    ic_card: '',
                    vacancy_id: val
                }
            })
            const handleCancel = () => {
                ruleForm.value.resetFields()
                context.emit('close', false)
            }
            const ruleForm = ref()
            const handleOk = () => {
                if(!icForm.value.brand_name){
                    Vue.prototype.$message.warn('请选择设备品牌名称！')
                    return
                }
                if(!icForm.value.type_name){
                    Vue.prototype.$message.warn('请选择设备类型名称！')
                    return
                }
                ruleForm.value.validate(valid => {
                    if (valid) {
                        Vue.prototype.request('/community/village_api.Building/subVacancyIcCard', icForm.value).then(res => {
                            Vue.prototype.$message.success('添加成功！')
                            ruleForm.value.resetFields()
                            context.emit('close', true)
                        })
                    } 
                });
            }
            let rules = ref({
                brand_name: [{ required: true, message: '请选择设备品牌名称', trigger: 'blur' },],
                type_name: [{ required: true, message: '请选择设备类型名称', trigger: 'blur' },],
                ic_card: [{ required: true, message: '请输入IC卡号', trigger: 'blur' },]
            })
            let brandList = ref([])
            let labelCol = ref({ span: 6 })
            let wrapperCol = ref({ span: 14 })
            const getIcDeviceBrand = () => {
                Vue.prototype.request('/community/village_api.Building/getIcDeviceBrand').then(res => {
                    brandList.value = res
                })
            }
            let typeList = ref([])
            const getIcDeviceType = (brand_id) => {
                Vue.prototype.request('/community/village_api.Building/getIcDeviceType', {brand_id, }).then(res => {
                    typeList.value = res
                })
            }
            
            const handleSelectChange = (value, type) => {
                if(type == 'brand_name'){
                    typeList.value = []
                    icForm.value.type_name = ''
                    getIcDeviceType(value)
                    brandList.value.map(v=>{
                        if(v.brand_id == value){
                            icForm.value[type] = v.brand_name
                        }
                    })
                } else if(type == 'type_name') {
                    typeList.value.map(v=>{
                        if(v.type_id == value){
                            icForm.value[type] = v.type_name
                        }
                    })
                }
                console.log(icForm.value)
            }
            getIcDeviceBrand()
            
            let rfidreader = ref(null)
            
            const rfid_get_card_func = () => {
                if(rfidreader.value==null){
                    Vue.prototype.$message.warn("您在控制台基本配置中开启了IC卡云读写需要安装软件。软件连接失败，请先下载安装！由于软件需要开机自动启动，安装前请关闭360等安全软件。")
                    return false;
                }
                let FormatID = '1'; //1为10进制(10DEC) ，0为16进制(8HEX)
                let OrderID = '0'; //0为正常 ，1为倒序
                rfidreader.value.Repeat = 1;
                rfidreader.value.HaltAfterSuccess = 1;
                rfidreader.value.RequestTypeACardNo(FormatID, OrderID);
            }
            const rfid_get_card_check = () => {
                let is_rfidreader_ok=true;
                try {
                    let rfidreader=YOWORFIDReader.createNew();
                    rfidreader.value=rfidreader;
                    if(!rfidreader.TryConnect()) {
                        is_rfidreader_ok=false;
                        Vue.prototype.$message.warn("浏览器不支持，请更换浏览器后重试！");
                    }
                } catch(e) {
                    // Vue.prototype.$message.warn("");
                    // if(this.write_iccard_exe_url){
                    //     window.top.location = this.write_iccard_exe_url; 
                    // }
                    is_rfidreader_ok=false;
                }
                
                if(is_rfidreader_ok){
                    rfidreader.value.onResult(function(resultdata) {
                        switch (resultdata.FunctionID) {
                           //IC卡读卡器云服务版本号
                            case 14:
                                break;
                            case 0:
                                if (resultdata && resultdata.Result > 0) {
                                    if(resultdata && resultdata.strData){
                                        icForm.value.ic_card = resultdata.strData
                                    } else{
                                        Vue.prototype.$message.warn("读取失败！")
                                    }
                                }
                                break;
                        }
                    })
                }
            }
            
            rfid_get_card_check()
            
            return {
                handleCancel,
                handleOk,
                brandList,
                getIcDeviceBrand,
                typeList,
                getIcDeviceType,
                icForm,
                labelCol,
                wrapperCol,
                handleSelectChange,
                rules,
                ruleForm,
                rfidreader,
                rfid_get_card_func,
                rfid_get_card_check
            }
        }
    })
</script>

<style>
</style>
