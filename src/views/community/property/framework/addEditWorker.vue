<template>
    <div class="modal_container">
        <a-modal :title="title" :width="1000" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"
            @ok="handleSubmit" @cancel="handleCancel"  :ok-button-props="ok_button_props" :cancel-button-props="cancel_button_props" >
            <a-spin :spinning="confirmLoading" :height="800">
                <a-form-model ref="ruleForm" :model="detail" class="div_box" :labelCol="labelCol"
                    :wrapperCol="wrapperCol" :rules="rules">
                    <a-form-model-item label="编号">
                        <a-input :disabled="disabledattr" placeholder="请输入工号" v-model="detail.job_number" />
                    </a-form-model-item>
                    <a-form-model-item label="姓名" prop="name">
                        <a-input :disabled="disabledattr" placeholder="请输入姓名" v-model="detail.name" />
                    </a-form-model-item>
                    <a-form-model-item label="性别">
                        <a-radio-group v-model="detail.gender" :disabled="disabledattr">
                            <a-radio :value="1">男</a-radio>
                            <a-radio :value="2">女</a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="手机号码" prop="phone" extra="此手机号需与注册的手机号一致,才能开门成功">
                        <a-input :disabled="disabledattr" placeholder="请输入手机号码" v-model="detail.phone" @change="phoneBlur" />
                    </a-form-model-item>
                    
                    <a-form-model-item label="身份证号"  extra="填写后该用户可通过身份证进入门禁">
                        <a-input :disabled="disabledattr" placeholder="请输入身份证号" v-model="detail.id_card" />
                    </a-form-model-item>

                    <a-form-model-item label="入职时间">
                        <a-date-picker v-if="detail.job_create_time" :disabled="disabledattr" placeholder="请选择入职时间"
                            @change="onChange" :value="moment(detail.job_create_time, dateFormat)" :format="dateFormat">
                        </a-date-picker>
                        <a-date-picker v-else :disabled="disabledattr" placeholder="请选择入职时间" @change="onChange">
                        </a-date-picker>
                    </a-form-model-item>
                    <a-form-model-item label="账号" prop="account">
                        <a-input @change="accountFoucs" :disabled="is_edit" placeholder="请输入登录账号"
                            v-model="detail.account" />
                    </a-form-model-item>

                    <a-form-model-item label="密码" extra="如果不填写密码或为空，则默认密码 123abc"
                        v-if="is_add">
                        <a-input :disabled="disabledattr" placeholder="请输入登录密码" v-model="detail.pwd" />
                    </a-form-model-item>

                    <a-form-model-item label="密码"  extra="如果不填写密码或为空，则密码不做修改" v-else>
                        <a-input :disabled="disabledattr" placeholder="请输入登录密码" v-model="detail.pwd" />
                    </a-form-model-item>

                    <a-form-model-item label="备注" >
                        <a-input :disabled="disabledattr" placeholder="请输入内容" v-model="detail.remarks" />
                    </a-form-model-item>

                </a-form-model>
            </a-spin>
        </a-modal>
    </div>
</template>

<script>
    import propertyApi from '@/api/community/property/packages';
    import common from '@/utils/variable'
    import moment from 'moment';
    import {
        getSystemName
    } from '@/utils/util'
    export default {
        data() {
            return {
                title: '添加人员信息',
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 16
                },
                lookVisiable: false,
                visible: false,
                is_edit: false,
                disabledattr:false,
                confirmLoading: false,
                isfooter:'',
                detail: {
                    hw_id:0,
                    phone:'',
                    name:'',
                    job_number:'',
                    id_card:'',
                    gender:1,
                    account:'',
                    pwd:'',
                    job_create_time:'',
                    remarks:'',
                },
                hw_id:0,
                dateFormat: 'YYYY-MM-DD',
                ok_button_props:{},
                cancel_button_props:{},
                is_add:true,
                propsList: [],
                rules: {
                    name: [{
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur'
                    }],
                    account: [{
                        required: true,
                        message: '请输入账号',
                        trigger: 'blur'
                    }],

                    phone: [{
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    }, {
                        validator: this.phoneConfirm
                    }]
                },
                tokenName: '',
            }
        },
        components: {

        },
        mounted() {
            let sysName = getSystemName(location.hash);
            if (sysName) {
                this.tokenName = sysName + '_access_token';
                this.sysName = sysName;
            } else {
                this.sysName = 'village';
            }
           
        },
        methods: {
            moment,
            phoneConfirm(rule, value, callback) {
                let reg = /^1[3456789]\d{9}$/
                if (!reg.test(value)) {
                    callback('请输入正确的手机号码')
                } else {
                    callback()
                }
            },
            onChange(date, dateString) {
                this.detail.job_create_time = dateString;
            },
            addMember() {
                this.is_edit = false
                this.disabledattr=false
                this.is_add=true;
                this.title = '添加人员信息'
                this.visible = true
                this.ok_button_props={};
                this.cancel_button_props={};
                this.detail= {
                    hw_id:0,
                    phone:'',
                    name:'',
                    job_number:'',
                    id_card:'',
                    gender:1,
                    account:'',
                    pwd:'',
                    job_create_time:'',
                    remarks:'',
                };
                this.hw_id=0;
            },
            phoneBlur() {
                if (this.is_add) {
                    this.detail.account = this.detail.phone
                }
            },
            handleSubmit() {
                this.confirmLoading = true
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        this.detail.tokenName = this.tokenName
                        this.request(propertyApi.savePropertyWorkerInfo, this.detail).then((res) => {
                            if (this.detail.hw_id * 1 > 0) {
                                    this.$message.success('修改成功！')
                            } else {
                                    this.$message.success('添加成功')
                            }
                            this.confirmLoading = false;
                            this.visible = false;
                            this.$emit('ok');
                            this.clearForm();
                            this.$refs.ruleForm.resetFields();
                         
                        }).catch((error) => {
                            this.confirmLoading = false
                        })
                    } else {
                        this.confirmLoading = false
                        return false;
                    }
                });
            },
            clearForm() {
                this.detail={
                    hw_id:0,
                    phone:'',
                    name:'',
                    job_number:'',
                    id_card:'',
                    gender:1,
                    account:'',
                    pwd:'',
                    job_create_time:'',
                    remarks:'',
                }
            },
            accountFoucs() {

            },

            handleCancel() {
                this.visible = false
                this.clearForm()
                this.$refs.ruleForm.resetFields();
            },

            editMember(detail) {
                this.is_add=false;
                this.is_edit = true;
                this.disabledattr=false;
                this.ok_button_props={};
                this.cancel_button_props={};
                this.detail=detail;
                this.detail.pwd='';
                this.hw_id=detail.hw_id;
                this.title = '编辑人员信息';
                if(detail.status*1==0){
                    this.title = '查看人员信息';
                }
                if(detail.status*1==0 || detail.status*1==4){
                    this.disabledattr=true;
                    this.ok_button_props={ props: { disabled: true } };
                    this.cancel_button_props={ props: { disabled: true } };
                    this.title = '【' + detail.name + '】' + '信息查看';
                }
                this.request(propertyApi.getOnePropertyWorkerInfo, {
                    hw_id: this.hw_id,
                    tokenName: this.tokenName
                }).then((res) => {
                    this.detail = res;
                    this.detail.pwd='';
                    this.title = '【' + this.detail.name + '】' + '信息编辑'
                    this.disabledattr=false;
                    this.ok_button_props={};
                    this.cancel_button_props={};
                    if(this.detail.status*1==0 || this.detail.status*1==4){
                        this.disabledattr=true;
                        this.ok_button_props={ props: { disabled: true } };
                        this.cancel_button_props={ props: { disabled: true } };
                        this.title = '【' + this.detail.name + '】' + '信息查看';
                    }
                    this.visible = true
                })
            },

            handleLookCancel() {
                this.lookVisiable = false
                this.propsList = []
            },
        }
    }
</script>
<style>
    .ant-form-item label {
        width: 50px;
    }

    .div_box .ant-form-item {
        display: inline-block !important;
        width: 50% !important;
    }

    .look_content {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
    }

    .look_item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 36%;
        margin: 5px 20px;
    }

    .item_title {
        font-weight: bold;
    }

    .item_value {
        margin-left: 10px;
    }

    .upload_content {
        width: 100%;
        height: 300px;
    }

    .ant-input-number {
        width: 100%;
    }
</style>
