<template>
    <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form">
                <a-form-item
                        label="规则名称"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                >
                    <a-col  v-if="formData.id == 0">
                        <a-input :maxLength="20" v-decorator="['rule_name', {rules: [{required: true, message: '请输入规则名称！'}]}]" placeholder="请输入规则名称,限20字！" /><span style="color: red">(一旦创建，不可修改)</span>
                    </a-col>
                    <a-col v-else  >
                        {{formData.rule_name}}
                    </a-col>
                    <a-col :span="18">
                        <div class="label_" v-for="(item,index) in group_txt" :key="index">
                            <a-tag  color="#1890ff" > {{item.value}} </a-tag>
                        </div>
                    </a-col>

                </a-form-item>

                <a-form-item label="选择适用业主群" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="18" v-if="formData.id == 0">
                        <a-button type="btn" @click="$refs.chooseGroupChatModal.add()" class="add-goods " style="float: left">选择群聊</a-button>
                    </a-col>
                    <a-col v-else  >
                        <div class="label_" v-for="(item,index) in formData.groups" :key="index">
                            <a-tag  color="#1890ff" > {{item}} </a-tag>
                        </div>
                    </a-col>
                </a-form-item>



                <a-form-item label="设置提醒行为" :labelCol="labelCol" :wrapperCol="wrapperCol" >
                   <a-row>
                       <a-checkbox-group @change="onChangeAction"  v-model="formData.action">
                           <a-checkbox v-for="item of groupAction" :value="item.key" :key="item.key" >
                               {{ item.value }}
                           </a-checkbox>
                       </a-checkbox-group>
                   </a-row>
                    <a-col :span="18">
                        <a-select
                                mode="multiple"
                                placeholder="选择敏感词"
                                style="width: 200px"
                                @change="choiceKeys"
                                v-model="formData.sensitive_id"
                                v-if="is_sensitive_show"
                        >
                            <a-select-option :value="item15.id" v-for="(item15,index15) in sensitive_info" :key="index15" >
                                {{item15.name}}
                            </a-select-option>
                        </a-select>
                    </a-col>
                </a-form-item>


                <a-form-item label="状态"  v-if="formData.id > 0" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-radio-group v-decorator="['formData.status', {initialValue:formData.status}]" @change="onChangeStatus">
                        <a-radio :value="1" >
                            开启
                        </a-radio>
                        <a-radio :value="0" >
                            关闭
                        </a-radio>
                    </a-radio-group>
                </a-form-item>


                <a-form-item label="通知人" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="formData.id == 0">
                    <a-checkbox-group @change="onChangeRemind" :default-value="checkbox_value" >
                        <a-row>
                            <a-col >
                                <a-checkbox value="1" :disabled="true" >群主</a-checkbox>
                                <a-checkbox value="2" @click="$refs.appointEnterpriseStaffModal.chooseSearch()">选择成员</a-checkbox>
                            </a-col>
                        </a-row>
                    </a-checkbox-group>
                </a-form-item>
                <chooseBranch ref="appointEnterpriseStaffModal" @change="appoint_staff"/>
                <choose-group-chat ref="chooseGroupChatModal" @change="change_group_chat"/>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import villageApi from '@/api/community/village'
    import chooseBranch from '../choiceBranch'
    import chooseGroupChat from '../chioceGroupChat'
    export default {
        components: {
            chooseBranch,
            chooseGroupChat
        },
        data() {
            return {
                title: '新建',
                labelCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 7
                    }
                },
                wrapperCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 13
                    }
                },
                visible: false,
                confirmLoading: false,
                form: this.$form.createForm(this),
                id:0,
                fid:0,
                diasabledInput:true,
                formData:{
                    id: 0,
                    rule_name:'',
                    group_id:[],
                    groupAction:[],
                    sensitive_id:[],
                    staff_type:[],
                    appoint_staff_id:[],
                    groups:[],
                    status:'',
                    action:[]
                },
                sensitive_info:[],
                groupAction:[],
                is_select1:false,
                checkbox_value:[],
                group_txt:[],
                is_sensitive_show:false
            }
        },
        mounted() {
        },
        methods: {
            onChangeStatus(e) {
                this.formData.status=e.target.value;
            },
            //选择群聊
            change_group_chat(val){
                let group_id=[];
                this.group_txt=[];
                val.filter((item,i)=>{
                    group_id[i] = item.split('-')[0] +'-'+item.split('-')[1];
                    this.group_txt.push({
                        key:item.split('-')[0],
                        value:item.split('-')[1]
                    })
                });
                this.formData.group_id=group_id;
            },
            //敏感词
            choiceKeys(value) {
                this.formData.sensitive_id=value;
            },
            //指定成员
            appoint_staff(val){
               let appoint_staff_id = [];
                val.filter((item,i)=>{
                    appoint_staff_id[i] = item.split('-')[0];
                });
                this.formData.appoint_staff_id=appoint_staff_id;
            },
            //设置行为
            onChangeAction(e){
                this.formData.action=e;
                if(e.indexOf(8) > -1){
                    this.is_sensitive_show=true;
                }else{
                    this.is_sensitive_show=false;
                    this.formData.sensitive_id=[];
                }
            },
            //通知人
            onChangeRemind(e) {
                this.formData.staff_type=e
            },

            add() {
                this.title = '设置违规群聊'
                this.visible = true
                this.id = '0';
                this.checkedKeys=[];
                this.group_txt=[];
                this.formData.group_id=[];
                this.is_select1=false;
                this.is_sensitive_show=false;
                this.formData = {
                    id: 0,
                    rule_name:'',
                    groupAction:[],
                    sensitive_id:[],
                    staff_type:['1']
                };
                this.checkbox_value=['1'];
                this.request(villageApi.getGroupAction).then((data) => {
                    this.groupAction = data
                })

                this.request(villageApi.choiceSensitive).then((data) => {
                    this.sensitive_info= data
                })
            },
            edit(id) {
                this.visible = true
                this.id = id
                this.getEditInfo()
                this.is_select1=true;
                this.group_txt=[];
                this.checkbox_value=['1'];
                this.request(villageApi.getGroupAction).then((data) => {
                    this.groupAction = data
                })
                this.request(villageApi.choiceSensitive).then((data) => {
                    this.sensitive_info= data
                })

                if (this.id > 0) {
                    this.title = '编辑'
                } else {
                    this.title = '添加'
                }
            },
            handleSubmit() {
                const {
                    form: {
                        validateFields
                    }
                } = this
                this.confirmLoading = true;
                validateFields((errors, values) => {
                    if (!errors) {
                        let url=villageApi.addViolationGroup;
                        if(this.formData.id > 0){
                            url=villageApi.subViolationGroup;
                        }else{
                            this.formData.rule_name=values['rule_name'];
                        }
                        this.request(url, this.formData)
                            .then((res) => {
                                if (this.formData.id>0) {
                                    this.$message.success('编辑成功')
                                } else {
                                    this.$message.success('添加成功')
                                }
                                setTimeout(() => {
                                    this.form = this.$form.createForm(this)
                                    this.visible = false
                                    this.confirmLoading = false
                                    this.$emit('ok')
                                }, 1500)
                            })
                            .catch((error)=>{
                                this.confirmLoading = false
                            })

                    } else {
                        this.confirmLoading = false
                    }
                })
            },
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.id = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            getEditInfo() {
                this.request(villageApi.editViolationGroup, {
                    id: this.id
                })
                    .then((res) => {
                        this.formData.id=res.id;
                        this.formData.rule_name=res.rule_name;
                        this.formData.sensitive_id=res.sensitive_id;
                        this.formData.groups=res.groups;
                        this.formData.status=res.status;
                        this.formData.action=res.action;
                        if(res.sensitive_id != ''){
                            this.is_sensitive_show=true;
                        }else{
                            this.is_sensitive_show=false;
                        }
                    })
            },
        },
    }
</script>
<style>

    .label_{
        display: inline-block;
    }
    .tip-txt {
        margin-left:4px;font-size: 12px;
    }
    .add-box-tip {
        text-align: -webkit-center;
        padding: 0 6px;
        margin-left: 8px;
        border-radius: 15px;
        border: none;
    }
    .ant-form-item label{
        width: auto !important;
    }
</style>