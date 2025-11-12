<template>
    <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form">
                <a-form-item label="员工触发" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="18" v-if="post_data.id == 0">
                        <a-button type="btn" @click="$refs.chooseEnterpriseStaffModal.choose('1')" class="add-goods " style="float: left">选择部门成员</a-button>
                        <a-tooltip placement="top" style="display: block;padding:8px ">
                            <template slot="title">
                                <span>监控员工及其业主敏感词内容</span>
                            </template>
                            <img src="../../../../../../assets/image/tan.png">
                        </a-tooltip>
                    </a-col>
                    <a-col v-else :span="18" >
                        {{post_data.staff_name}}
                    </a-col>

                    <a-col :span="18">
                        <div class="label_" v-for="(item,index) in staff_txt" :key="index">
                            <a-tag  color="#1890ff" > {{item.value}} </a-tag>
                        </div>
                    </a-col>

                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                <a-form-item label="提醒通知成员" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-radio-group v-decorator="['post_data.choice_remind', {initialValue:post_data.choice_remind}]"  @change="onChange">
                        <a-radio :value="1" :disabled=is_select1>
                            对应部门负责人（按照企业微信组织架构）
                        </a-radio>
                        <a-radio class="label_2" :value="2" :disabled=is_select1 @click="$refs.appointEnterpriseStaffModal.choose('0')" >
                            指定成员
                        </a-radio>
                        <a-tooltip placement="top">
                            <template slot="title">
                                <span>员工与员工的业主触发敏感词，系统会立即给相应的成员发消息提醒，提醒该员工或是该员工的业主可能出现违规行为。【不对群起效，只监控单聊】</span>
                            </template>
                            <img src="../../../../../../assets/image/tan.png">
                        </a-tooltip>
                    </a-radio-group>
                </a-form-item>

                <a-form-item label="状态"  v-if="post_data.id > 0" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-radio-group v-decorator="['post_data.status', {initialValue:post_data.status}]"  @change="onChange">
                        <a-radio :value="1" >
                            开启
                        </a-radio>
                        <a-radio :value="0" >
                            关闭
                        </a-radio>
                    </a-radio-group>
                </a-form-item>

                <a-form-item label="触发敏感词" :labelCol="labelCol" :wrapperCol="wrapperCol" >
                    <a-col :span="18">
                        <a-select
                                mode="multiple"
                                placeholder="请选择"
                                style="width: 200px"
                                @change="choiceKeys"
                                v-model="post_data.sensitive_info"
                                :disabled="disabled"
                        >
                            <a-select-option :value="item15.id" v-for="(item15,index15) in sensitive_info" :key="index15" >
                                {{item15.name}}
                            </a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                    <chooseBranch ref="chooseEnterpriseStaffModal" @change="change_enterprise_staff"/>
                    <chooseBranch ref="appointEnterpriseStaffModal" @change="appoint_staff"/>
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import villageApi from '@/api/community/village'
    import chooseBranch from '../choiceBranch'
    export default {
        components: {
            chooseBranch,
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
                staff_txt : [],
                post_data:{
                    id: 0,
                    staff_name: '',
                    sensitive_info:[],
                    staff_id:'',
                    choice_remind:1,
                    name:'',
                },
                sensitive_info:[],
                is_select1:false,
                disabled:false
            }
        },
        mounted() {
        },
        methods: {
            choiceKeys(value) {
                this.sensitive_id=value;
            },
            //选择部门成员
            change_enterprise_staff(val){
                let ids_msg=[];
                this.staff_id = [];
                this.staff_txt=[]
                val.filter((item,i)=>{
                    this.staff_id[i] = item.split('-')[0] +'-'+item.split('-')[1];
                    ids_msg[i] = item.split('-')[1];
                    this.staff_txt.push({
                        key:item.split('-')[0],
                        value:item.split('-')[1]
                    })
                });
            },

            //指定成员
            appoint_staff(val){
                this.appoint_staff_id = [];
                val.filter((item,i)=>{
                    this.appoint_staff_id[i] = item.split('-')[0];
                });
            },

            onChange(e) {

            },

            add() {
                this.title = '设置违规员工'
                this.visible = true
                this.id = '0';
                this.checkedKeys=[];
                this.staff_txt=[]
                this.is_select1=false;
                this.disabled=false;
                this.post_data = {
                    id: 0,
                    staff_name: '',
                    sort:0,
                    sensitive_info:[],
                    des:'',
                };
                this.post_data.choice_remind=1;

                this.request(villageApi.choiceSensitive).then((data) => {
                    this.sensitive_info= data
                })

            },
            edit(id) {
                console.log('erererererer',id);
                this.visible = true
                this.id = id
                this.getEditInfo()
                this.is_select1=true;
                this.staff_txt=[];
                this.disabled=true;
                this.request(villageApi.choiceSensitive)
                    .then((res) => {
                        this.sensitive_info = res
                    })
                    .catch((error) => {
                        this.sensitive_info = []
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
                let staff_id = this.staff_id;
                let sensitive_id = this.sensitive_id;
                let appoint_staff_id = this.appoint_staff_id;
                validateFields((errors, values) => {
                    values['post_data']['staff_id']=staff_id;
                    values['post_data']['sensitive_id']=sensitive_id;
                    values['post_data']['appoint_staff_id']=appoint_staff_id;
                    if (!errors) {
                        values['post_data']['id']= this.id;
                        values['post_data']['fid']= this.fid;
                        let url=villageApi.addViolationStaff;
                        if(this.post_data.id > 0){
                            url=villageApi.subViolationStaff;
                        }
                        this.request(url, values.post_data)
                            .then((res) => {
                                if (this.post_data.id>0) {
                                    this.$message.success('编辑成功')
                                } else {
                                    this.$message.success('添加成功')
                                }
                                setTimeout(() => {
                                    this.form = this.$form.createForm(this)
                                    this.visible = false
                                    this.confirmLoading = false
                                    console.log(123)
                                    this.$emit('ok')
                                }, 1500)
                                console.log(345)
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
                this.request(villageApi.editViolationStaff, {
                    id: this.id
                })
                    .then((res) => {
                        this.post_data = {
                            id: res.id,
                            staff_name: res.staff_name,
                        };
                        this.post_data.status=res.status
                       this.post_data.choice_remind=res.remind_type
                        this.post_data.sensitive_info=res.sensitive_info
                        if (typeof(res.info)=='object') {
                            this.post_data = res.info
                        }
                    })
            },
        },
    }
</script>
<style scoped>

    .ant-form-item .label_2{
        width: 50px !important;
    }

    .ant-radio-group{
        width: 535px !important;
    }
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