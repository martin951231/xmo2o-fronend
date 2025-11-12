<template>
    <a-modal
        title="添加设备"
        :visible="visible"
        :confirm-loading="confirmLoading"
        :width="900"
        @ok="handleOk"
        @cancel="handleCancel">
        <a-form-model ref="ruleForm" :model="deviceForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <div class="form_con">
                <a-form-model-item label="设备品牌" prop="device_brand" class="form_item">
                    <a-select placeholder="请选择" style="width: 200px;" :filter-option="filterOption" :value="deviceForm.device_brand"
                        @change="(value)=>handleSelectChange(value, 'device_brand')">
                        <a-select-option v-for="(item,index) in brandList" :value="item.id">
                            {{item.title}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="品牌类型" prop="type" class="form_item">
                    <a-select placeholder="请选择" style="width: 200px;" :filter-option="filterOption" :value="deviceForm.brand_type"
                        @change="(value)=>handleSelectChange(value, 'brand_type')">
                        <a-select-option v-for="(item,index) in brandTypeList" :value="item.id">
                            {{item.title}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                
                <a-form-model-item label="电桩类型" prop="pile_type" class="form_item">
                    <a-select placeholder="请选择" style="width: 200px;" :filter-option="filterOption" :value="deviceForm.pile_type"
                        @change="(value)=>handleSelectChange(value, 'pile_type')">
                        <a-select-option v-for="(item,index) in pileTypeList" :value="item.value">
                            {{item.label}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="设备名称" prop="equipment_name" class="form_item">
                    <a-input style="width: 200px;" placeholder="请输入" v-model="deviceForm.equipment_name" />
                </a-form-model-item>
                <a-form-model-item label="设备唯一编码" prop="equipment_num" class="form_item">
                    <a-input style="width: 200px;" placeholder="请输入" v-model="deviceForm.equipment_num" />
                </a-form-model-item>
                <a-form-model-item label="设备功率" prop="power" class="form_item">
                    <a-input style="width: 200px;" placeholder="请输入" v-model="deviceForm.power" />
                </a-form-model-item>
                <a-form-model-item label="最大电压" prop="max_voltage" class="form_item">
                    <a-input style="width: 200px;" placeholder="请输入" v-model="deviceForm.max_voltage" />
                </a-form-model-item>
                <a-form-model-item label="最小电压" prop="min_voltage" class="form_item">
                    <a-input style="width: 200px;" placeholder="请输入" v-model="deviceForm.min_voltage" />
                </a-form-model-item>
                <a-form-model-item label="最大电流" prop="max_electric_current" class="form_item">
                    <a-input style="width: 200px;" placeholder="请输入" v-model="deviceForm.max_electric_current" />
                </a-form-model-item>
                <a-form-model-item label="最小电流" prop="min_electric_current" class="form_item">
                    <a-input style="width: 200px;" placeholder="请输入" v-model="deviceForm.min_electric_current" />
                </a-form-model-item>
                <a-form-model-item label="最高温度" prop="max_temperature" class="form_item">
                    <a-input style="width: 200px;" placeholder="请输入" v-model="deviceForm.max_temperature" />
                </a-form-model-item>
                <a-form-model-item label="最低温度" prop="min_temperature" class="form_item">
                    <a-input style="width: 200px;" placeholder="请输入" v-model="deviceForm.min_temperature" />
                </a-form-model-item>
                <a-form-model-item label="枪头数量" prop="socket_num" class="form_item">
                    <a-input style="width: 200px;" placeholder="请输入" v-model="deviceForm.socket_num" />
                </a-form-model-item>
                <a-form-model-item label="备注" prop="remark" class="form_item">
                    <a-textarea style="padding: 5px width:100%; height: 100px; resize:none;" placeholder="请输入" v-model="deviceForm.remark"/>
                </a-form-model-item>
            </div>
        </a-form-model>
    </a-modal>
</template>

<script>
    export default{
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            device_id: {
                type: Number,
                default: 0
            }
        },
        data(){
            return{
                confirmLoading: false,
                ModalText: '1234567890-',
                labelCol: { span: 6 },
                wrapperCol: { span: 14 },
                deviceForm: {
                    device_brand: '',
                    device_type: '',
                    brand: '',
                    brand_type: '',
                    equipment_name: '',
                    equipment_num: '',
                    power: '',
                    min_voltage: '',
                    max_voltage: '',
                    min_electric_current: '',
                    max_electric_current: '',
                    min_temperature: '',
                    max_temperature: '',
                    socket_num: '',
                    remark: '',
                    pile_type: ''
                },
                rules: {
                    device_brand: [{required: true, message: '请选择', trigger: 'blur'}],
                    device_type: [{required: true, message: '请选择', trigger: 'blur'}],
                    brand: [{required: true, message: '请输入', trigger: 'blur'}],
                    brand_type: [{required: true, message: '请输入', trigger: 'blur'}],
                    equipment_name: [{required: true, message: '请输入', trigger: 'blur'}],
                    equipment_num: [{required: true, message: '请输入', trigger: 'blur'}],
                    power: [{required: true, message: '请输入', trigger: 'blur'}],
                    min_voltage: [{required: true, message: '请输入', trigger: 'blur'}],
                    max_voltage: [{required: true, message: '请输入', trigger: 'blur'}],
                    min_electric_current: [{required: true, message: '请输入', trigger: 'blur'}],
                    max_electric_current: [{required: true, message: '请输入', trigger: 'blur'}],
                    min_temperature: [{required: true, message: '请输入', trigger: 'blur'}],
                    max_temperature: [{required: true, message: '请输入', trigger: 'blur'}],
                    socket_num: [{required: true, message: '请输入', trigger: 'blur'}],
                    remark: [{required: false, message: '请输入', trigger: 'blur'}],
                    pile_type: [{required: true, message: '请输入', trigger: 'blur'}]
                },
                feetypeList: [],
                brandList: [],
                brandTypeList: [],
                pileTypeList: [{label: '直流', value: 1}, {label: '交流', value: 2}]
            }
        },
        watch:{
            visible: {
                handler(val){
                    if(val){
                        this.getBrandlist()
                        if(this.device_id){
                            this.getDetail(this.device_id)
                        }
                    }
                },
                immediate: true
            }
        },
        methods: {
            handleOk(){
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        let url = '/community/village_api.Pile/addEquipment';
                        if(this.device_id){
                            url = '/community/village_api.Pile/editEquipment'
                            this.deviceForm.id = this.device_id
                        }
                        this.request(url, this.deviceForm).then(res => {
                            if(this.device_id){
                                this.$message.success("编辑成功！")
                            } else {
                                this.$message.success("添加成功！")
                            }
                            this.closeThis('refrash')
                        })
                    }
                });
            },
            handleCancel(){
                this.closeThis()
            },
            closeThis(type){
                this.deviceForm = {
                    device_brand: '',
                    device_type: '',
                    brand: '',
                    brand_type: '',
                    equipment_name: '',
                    equipment_num: '',
                    power: '',
                    min_voltage: '',
                    max_voltage: '',
                    min_electric_current: '',
                    max_electric_current: '',
                    min_temperature: '',
                    max_temperature: '',
                    socket_num: '',
                    remark: ''
                }
                this.$refs.ruleForm.resetFields();
                this.$emit('closeDevice', type)
            },
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            handleSelectChange(value, type){
                console.log(value, type)
                this.deviceForm[type] = value
                if(type == 'device_brand'){
                    this.brandTypeList = []
                    this.deviceForm.device_type = ''
                    this.getBrandTypeList(value)
                }
                this.$forceUpdate()
            },
            getBrandlist(){
                let that = this
                that.request('/community/village_api.Pile/getBrandlist').then((res) => {
                    that.brandList = res
                })
            },
            getBrandTypeList(brand_id){
                let that = this
                that.request('/community/village_api.Pile/getBrandTypeList', {brand_id,}).then((res) => {
                    that.brandTypeList = res
                })
            },
            getDetail(id){
                let that = this
                that.request('/community/village_api.Pile/getEquipmentDetail', {id,}).then((res) => {
                    that.deviceForm = res.info
                    that.deviceForm.pile_type = res.info.type
                    that.getBrandTypeList(res.info.device_brand)
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    /deep/ textarea{
        overflow-x: hidden;
        overflow-y: scroll !important;
    }
    
    .form_con{
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        .form_item{
            width: 50%;
        }
    }
</style>