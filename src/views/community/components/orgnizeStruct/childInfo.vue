<template>
    <a-modal :title="title" :width="1200" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"
        @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading" :height="800">
            <div v-if="property_edit_village" style="text-align: center;margin-bottom: 20px;">{{property_edit_village_tips}}</div>
            <a-form :form="form">
            
                <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="18">
                        <a-input :maxLength="10" placeholder="0，越大越靠前"
                            v-decorator="['post.sort', {initialValue:post.sort}]" />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                <a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="!property_edit_village">
                    <a-col :span="18">
                        <a-select @change="handleGroupType" :disabled="property_edit_village" style="width: 345px" placeholder="请选择类型"
                            v-decorator="['post.group_type',{ initialValue: post.group_type, rules: [{ required: true, message: L('请选择类型！') }] }]">
                            <a-select-option :value="item15.key" v-for="(item15,index15) in group_type" :key="index15" >
                                {{item15.value}}
                            </a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                <a-form-item v-if="$store.getters.config.house_name && is_show_village && !property_edit_village" :label="'选择'+$store.getters.config.house_name" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="18">
                        <a-select @change="handleVillage" style="width: 345px" :placeholder="'请选择'+$store.getters.config.house_name"
                            v-decorator="['post.village_id',{ initialValue: post.village_id, rules: [{ required: true, message: L('请选择'+$store.getters.config.house_name+'！') }] }]">
                            <a-select-option :value="item15.village_id" v-for="(item15,index15) in village_all"
                                :key="index15">
                                {{item15.village_name}}
                            </a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                <a-form-item label="部门类型" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="is_show && !property_edit_village">
                    <a-col :span="18">
                        <a-select @change="handleDepartment" style="width: 345px" placeholder="请选择部门类型"
                            v-decorator="['post.department_type',{ initialValue: post.department_type, rules: [{ required: true, message: L('请选择部门类型！') }] }]">
                            <a-select-option :value="item15.key" v-for="(item15,index15) in department_type"
                                :key="index15">
                                {{item15.value}}
                            </a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                <a-form-item label="部门名称" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="is_show && !property_edit_village">
                    <a-col :span="18">
                        <a-input placeholder="请输入部门名称，长度最多8位" :maxLength="8"
                            v-decorator="['post.name', {initialValue:post.name,rules: [{required: true, message: '请输入部门名称，长度最多8位！'}]}]" />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                <div v-if="!property_edit_village">
                <a-form-item label="企业微信同步状态" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="post.qy_txt">
                    <a-col :span="18">
                        {{post.qy_txt}}
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>
                <a-form-item label="企微同步失败原因" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="post.qy_reasons">
                    <a-col :span="18">
                        {{post.qy_reasons}}
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>
                <a-form-item label="企微同步时间" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="post.qy_time">
                    <a-col :span="18">
                        {{post.qy_time}}
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>
                <a-form-item label="企微部门ID" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="qy_id">
                    <a-col :span="5">
                        <span v-if="!editTrue">{{post.qy_id}}</span>
                        <a-input :maxLength="10" v-model="post.qy_id" v-if="editTrue"/>
                        <span class="icon-wrap" style="margin-left: 10px;" v-if="post.editQy && !editTrue">
                            <a @click="allowEidt(post.editQy)"><a-icon type="form"/></a>
                        </span>
                    </a-col>
                    <a-col :span="19">
                       <span style="font-size:12px;">&nbsp;&nbsp;<span style="color: red;">注意</span>：对应授权企微中【通讯录】中对应部门【部门ID】</span>
                    </a-col>
                </a-form-item>
                </div>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import commonApi from '@/api/community/common';
    import propertyApi from '@/api/community/property/packages';
    import {
        getSystemName
    } from '@/utils/util'
    export default {
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
                post: {
                    id: 0,
                    fid: 0,
                    group_type: undefined,
                    department_type: undefined,
                    sort: 0,
                    name: '',
                    village_id: undefined,
                    editQy: false,
                },
                qy_id: '',
                id: 0,
                fid: 0,
                group_type: [],
                department_type: [],
                village_all: [],
                is_show: false,
                is_show_village: false,
                tokenName: '',
                sysName: '',
                editTrue: false,
                role_type:0,   //1物业 2小区
                xtype:-1, //0是小区 1 小区部门 2物业部门
                village_id:0,
                property_edit_village:false,
                property_edit_village_tips:'',
            }
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
            allowEidt(editQy) {
                if (editQy) {
                    let that = this;
                    this.$confirm({
                        title: '是否确认修改,如果相关组织已有企微数据请谨慎修改（可能会导致无法正常使用）?',
                        okType: 'danger',
                        cancelText: '取消',
                        okText: '确定',
                        onOk () {
                            if (that.post.qy_id == '暂无') {
                                that.post.qy_id = '';
                            }
                            that.editTrue = true
                        }
                    })
                } else {
                    this.editTrue = false
                }
            },
            //添加
            add(id, title,role_type=0,xtype=0,village_id=0) {
                this.title = '【'+title+'】' + '添加子组织';
                this.visible = true;
                this.is_show_village = false;
                this.property_edit_village=false;
                this.property_edit_village_tips='';
                this.editTrue = false
                this.role_type=role_type!=undefined && role_type ? role_type*1:0;
                this.post = {
                    id: 0,
                    fid: id,
                    group_type: undefined,
                    department_type: undefined,
                    sort: 0,
                    name: '',
                    editQy: false,
                };
                this.getGroupParam(id);
            },
            //获取参数
            getGroupParam(id, type = 0) {
                this.request(propertyApi.frameworkGroupParam, {
                    group_id: id,
                    type: type,
                    tokenName: this.tokenName
                }).then((data) => {
                    this.group_type = data.group_type;
                    this.department_type = data.department_type;
                    if (data.is_show) {
                        this.post.group_type = data.key;
                    }
                    this.is_show = data.is_show;
                })
            },
            //类型
            handleGroupType(value) {
                this.request(propertyApi.frameworkPropertyVillage, {
                    type: value,
                    tokenName: this.tokenName
                }).then((data) => {
                    if (data.status == 1) {
                        this.village_all = data.data;
                        this.is_show = false;
                        this.is_show_village = true;
                    } else {
                        this.village_all = [];
                        this.is_show = true;
                        this.is_show_village = false;
                    }
                })
            },
            //部门类型
            handleDepartment(value) {

            },
            //选择小区
            handleVillage(value) {

            },
            //编辑子组织
            edit(id, title,role_type=0,xtype=0,village_id=0) {
                this.title = '【'+title+'】' + '编辑子组织';
                this.visible = true;
                this.is_show_village = false;
                this.editTrue = false
                this.property_edit_village=false;
                this.property_edit_village_tips='';
                this.role_type=role_type!=undefined && role_type ? role_type*1:0;
                this.xtype=xtype!=undefined  ? xtype*1:-1;
                this.village_id=village_id!=undefined && village_id ? village_id*1:0;
                if(this.role_type==1 && this.xtype==0 && this.village_id>0){
                    this.property_edit_village=true;
                }
                this.post = {
                    id: id,
                    fid: id,
                    group_type: undefined,
                    department_type: undefined,
                    sort: 0,
                    name: '',
                    editQy: false,
                };
                this.getGroupParam(id, 1);
                this.getEditInfo()
            },
            //获取子组织数据
            getEditInfo() {
                this.request(propertyApi.frameworkOrganizationQuery, {
                    id: this.post.id,
                    tokenName: this.tokenName
                }).then((res) => {
                    this.post = res.data;
                    this.qy_id = res.data.qy_id;
                    if(res.data.village_id!=undefined && res.data.village_id>0 && res.data.group_type==0 && this.property_edit_village){
                        this.property_edit_village_tips='编辑小区排序：'+res.data.name;
                        this.village_id=res.data.village_id;
                        this.post.group_type=0;
                        this.post.village_id=res.data.village_id;
                    }
                })
            },
            //提交
            handleSubmit() {
                const {
                    form: {
                        validateFields
                    }
                } = this
                this.confirmLoading = true
                validateFields((errors, values) => {
                    if (!errors) {
                        values.post.fid = this.post.fid;
                        let url = commonApi.organizationAdd;
                        if (this.post.id > 0) {
                            values.post.id = this.post.id;
                            url = commonApi.organizationSub;
                        }
                        if (this.post.qy_id) {
                            values.post.qy_id = this.post.qy_id;
                        }
                        values.post.tokenName = this.tokenName;
                        values.post.property_edit_village=this.property_edit_village ? 1:0;
                        if(values.post.property_edit_village==1){
                            values.post.village_id=this.post.village_id;
                        }
                        this.request(url, values.post).then((res) => {
                            if (this.post.id > 0) {
                                this.$message.success('编辑成功')
                            } else {
                                this.$message.success('添加成功')
                            }
                            this.form = this.$form.createForm(this)
                            this.visible = false
                            this.confirmLoading = false
                            this.$emit('ok', values)
                        }).catch((error) => {
                            this.confirmLoading = false
                        })
                    } else {
                        this.confirmLoading = false
                    }
                })
            },
            //取消提交
            handleCancel() {
                this.visible = false
                this.id = '0'
                this.form = this.$form.createForm(this)
            }
        },
    }
</script>
<style lang="less" scoped>
   /deep/ .ant-form-item label {
        width: 50px;
    }

    .tip-txt {
        margin-left: 4px;
        font-size: 12px;
    }

    .add-box-tip {
        text-align: -webkit-center;
        padding: 0 6px;
        margin-left: 8px;
        border-radius: 15px;
        border: none;
    }
</style>
