<template>
    <a-drawer :title="device_id?'编辑':'添加'" :width="500" :visible="visible" :body-style="{ paddingBottom: '80px' }" @close="onClose">
        <a-form-model ref="ruleForm" :model="addForm" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="设备名称" prop="device_name">
                <a-input style="width: 100%;" v-model="addForm.device_name" placeholder="请输入" />
            </a-form-model-item>
            <a-form-model-item label="设备序号" prop="device_serial">
                <a-input style="width: 100%;" v-model="addForm.device_serial" placeholder="请输入" />
            </a-form-model-item>
            <a-form-model-item label="设备验证码" prop="validate_code">
                <a-input style="width: 100%;" v-model="addForm.validate_code" placeholder="请输入" />
            </a-form-model-item>
            
            <a-form-model-item label="楼栋单元" prop="single_floor">
                <a-cascader
                    v-if="refrashThis"
                    allowClear
                    style="width: 100%;"
                    :options="options"
                    :load-data="loadDataFunc"
                    placeholder="请选择楼栋单元"
                    change-on-select
                    @change="setVisionsFunc"
                    v-model="addForm.single_floor" />
            </a-form-model-item>
            
            <a-form-model-item label="设备登录账号" prop="third_login">
                <a-input style="width: 100%;" v-model="addForm.third_login" placeholder="请输入" />
            </a-form-model-item>
            <a-form-model-item label="设备登录密码" prop="third_login_password">
                <a-input style="width: 100%;" v-model="addForm.third_login_password" placeholder="请输入" />
            </a-form-model-item>
            
            <a-form-model-item label="备注" prop="remark">
                <a-textarea style="width: 100%;" v-model="addForm.remark" placeholder="请输入"
                    :auto-size="{ minRows: 3, maxRows: 3 }" />
            </a-form-model-item>
        </a-form-model>

        <div :style="{
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
            <a-button :style="{ marginRight: '8px' }" @click="onClose">
                取消
            </a-button>
            <a-button type="primary" @click="submitConfirm">
                确定
            </a-button>
        </div>
    </a-drawer>
</template>

<script>
    import villageApi from '@/api/community/village';
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            device_id: {
                type: [String, Number],
                default: ''
            }
        },

        watch: {
            visible: {
                handler(val) {
                    if (val) {
                        // this.getProtocols()
                        this.getSingleListByVillage()
                    }
                    if(val && this.device_id){
                        this.addForm.device_id = this.device_id
                    } else {
                        this.addForm.device_id = ''
                    }
                },
                immediate: true
            }
        },
        
        data() {
            return {
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 16
                },
                protocolList: [],
                rules: {
                    device_protocol: [{
                        required: true,
                        message: '请选择'
                    }],
                    device_name: [{
                        required: true,
                        message: '请输入'
                    }],
                    device_serial: [{
                        required: true,
                        message: '请输入'
                    }],
                    validate_code: [{
                        required: true,
                        message: '请输入'
                    }],
                    remark: [{
                        required: false,
                        message: '请输入'
                    }],
                    third_login: [{
                        required: false,
                        message: '请输入'
                    }],
                    third_login_password: [{
                        required: false,
                        message: '请输入'
                    }],
                    single_floor: [{
                        required: false,
                        message: '请选择'
                    }]
                },
                addForm: {
                    device_protocol: undefined,
                    device_name: '',
                    device_serial: '',
                    validate_code: '',
                    remark: '',
                    single_id: '',
                    floor_id: '',
                    single_floor: [],
                    third_login: '',
                    third_login_password: ''
                },
                options: [],
                refrashThis: true
            }
        },
        
        methods: {
            getProtocols() {
                this.request('/community/village_api.CameraDevice/getCameraThirdProtocols').then((res) => {
                    this.protocolList = res.list
                })
            },
            
            getDetail(){
                this.request('/community/village_api.AlarmDevice/getAlarmDevice', {device_id: this.device_id}).then((res) => {
                    this.addForm = res
                    if(res.single_id && !res.floor_id){
                        this.addForm.single_floor = [res.single_id]
                    }
                    if(res.single_id && res.floor_id){
                        this.setVisionsFunc([res.single_id])
                        this.addForm.single_floor = [res.single_id, res.floor_id]
                    }
                    if(!res.single_id && !res.floor_id){
                        this.addForm.single_floor = []
                    }
                })
            },
            
            onClose() {
                this.$emit('close')
                this.$refs.ruleForm.resetFields();
            },
            submitConfirm() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        if(this.addForm.single_floor.length == 1){
                            this.addForm.single_id = this.addForm.single_floor[0]
                        } else if(this.addForm.single_floor.length == 2){
                            this.addForm.single_id = this.addForm.single_floor[0]
                            this.addForm.floor_id = this.addForm.single_floor[1]
                        } else {
                            this.addForm.single_id = 0
                            this.addForm.floor_id = 0
                        }
                        this.request('/community/village_api.AlarmDevice/addUpdatesAlarmDevice', this.addForm).then(res=> {
                            if(this.addForm.device_id){
                                this.$message.success('更新成功！')
                            } else {
                                this.$message.success('添加成功！')
                            }
                            this.$refs.ruleForm.resetFields();
                            this.$emit('close', true)
                        })
                    }
                });
            },
            // 楼栋号
            getSingleListByVillage() {
                this.request(villageApi.getSingleListByVillage).then(res => {
                    if (res) {
                        const array = []
                        res.map(pro => {
                            array.push({
                                label: pro.name,
                                value: pro.id,
                                isLeaf: false
                            })
                        })
                        this.options = array
                        if(this.device_id){
                            this.getDetail()
                        }
                    }
                })
            },
            // 单元楼
            getFloorList(id) {
                return new Promise(resolve => {
                    this.request(villageApi.getFloorList, {
                        pid: id
                    }).then(res => {
                        resolve(res)
                    })
                })
            },
            
            async loadDataFunc(selectedOptions) {
                const targetOption = selectedOptions[selectedOptions.length - 1];
                // targetOption.loading = true;
                // setTimeout(function() {
                //     targetOption.loading = false;
                // }, 100)
            },
            
            async setVisionsFunc(selectedOptions) {
                if (selectedOptions.length == 1) {
                    const options_temp = [...this.options];
                    const res = await this.getFloorList(selectedOptions[0]);
                    const children = [];
                    res.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: true
                        });
                        options_temp['children'] = children
                    });
                    let index = options_temp.findIndex(item=>item.value == selectedOptions[0])
                    if(index != -1){
                        options_temp[index].children = children
                    }
                    this.options = options_temp
                } else if(selectedOptions.length == 2 || selectedOptions.length == 0){
                    this.refrashThis = false
                    this.$nextTick(()=>{
                        this.refrashThis = true
                    })
                }
            },
        }
    }
</script>

<style lang="less" scoped>
    /deep/ textarea {
        overflow-y: scroll !important;

        &::-webkit-scrollbar {
            width: 0;
        }
    }
</style>
