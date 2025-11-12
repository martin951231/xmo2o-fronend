<template>
    <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form" class="project_info">

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true" v-if="post.id == 0">
                    <span class="label_col ant-form-item-required">所属收费科目</span>
                    <a-select
                            style="width: 300px !important;"
                            @change="handleChange"
                            placeholder="请选择所属收费科目"
                            v-decorator="['post.subject_id',{rules: [{ required: true, message: L('请选择收费科目！') }] }]"
                    >
                        <a-select-option :value="item15.id+','+item15.status+','+item15.type"  v-for="(item15,index15) in sensitive_info" :key="index15" >
                            {{item15.name}}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-else>
                    <span class="label_col">所属收费科目</span>
                    <span > {{post.subject_name}}</span>
                </a-form-item>

                <a-form-item label="" :required="true" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="label_col ant-form-item-required">收费项目名称</span>
                        <a-input
                                :maxLength="30"
                                style="width: 300px"
                                placeholder="请输入名称"
                                v-decorator="['post.name',{ initialValue: post.name, rules: [{ required: true, message: L('请输入名称！') }] }]"
                        />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <span class="label_col ant-form-item-required">收费项目图标</span>
                    <a-upload
                        name="img"
                        list-type="picture-card"
                        class="avatar-uploader"
                        :show-upload-list="false"
                        :action="upload_url"
                        :before-upload="beforeUpload"
                        @change="imgChange"
                        v-decorator="['post.img',{ initialValue: post.img,rules: [{ required: true, message: L('请上传图片！') }]}]"
                    >
                        <img v-if="imgUrl" :src="imgUrl" class="imgname" alt="img" />
                        <div v-else>
                            <a-icon :type="uploadLoading ? 'uploadLoading' : 'plus'" />
                            <div class="ant-upload-text">
                                上传
                            </div>
                        </div>
                    </a-upload>
                    <span>建议尺寸：80*80px</span>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="typeStatus && feeType!='park_new'&& feeType!='pile'&& feeType!='new_nuanqifei'&& feeType!='qunuanfei'">
                    <a-col :span="30">
                        <span class="label_col">收费模式</span>
                        <a-radio-group :disabled="is_disabled" @change="chargingMode" v-model="post.type" >
                            <a-radio :value="1">一次性费用</a-radio>
                            <a-radio :value="2" v-if="feeType!='qrcode' && feeType!='electricity_loss'">周期性费用</a-radio>
                            <a-radio :value="3" v-if="type_show">押金</a-radio>
                        </a-radio-group>
                    </a-col>
                </a-form-item>

                <a-form-item label="" v-if="post.type === 1 || feeType == 'park_new'|| feeType == 'pile'|| feeType == 'new_nuanqifei'|| feeType == 'qunuanfei'" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="label_col">一次性费用退款期限</span>
                        收款后
                        <a-input-number
                            :max="9999"
                            style="width: 120px"
                            placeholder="请输入天数"
                            :precision="0"
                            :min="0"
                            v-decorator="['post.refund_period',{ initialValue: post.refund_period }]"
                        />
                        (天)内可进行退款
                        <a-tooltip placement="right">
                            <template slot="title">
                                <span>获取收费设置已缴账单退款期限，已缴账单缴费时间超过该天数则不能进行退款，不填或0则默认不能进行退款,最大填写9999。</span>
                            </template>
                            <span class="help-icon">?</span>
                        </a-tooltip>
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>
                <a-form-item label="" v-if="type_show" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="label_col">押金费用退款期限</span>
                        收款后
                        <a-input-number
                            :max="9999"
                            style="width: 120px"
                            placeholder="请输入天数"
                            :precision="0"
                            :min="0"
                            v-decorator="['post.refund_period',{ initialValue: post.refund_period }]"
                        />
                        (天)后可进行退款
                        <a-tooltip placement="right">
                            <template slot="title">
                                <span>获取收费设置已缴账单退款期限，已缴账单缴费时间超过该天数才能进行退款（不填或默认值的情况），填写后以在押金选项设置的值为准</span>
                            </template>
                            <span class="help-icon">?</span>
                        </a-tooltip>
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                <a-form-item label=""  :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="label_col">状态</span>
                    <a-radio-group  v-decorator="['post.status', {initialValue:post.status}]" >
                        <a-radio :value="1" >
                            开启
                        </a-radio>
                        <a-radio :value="2" >
                            关闭
                        </a-radio>
                    </a-radio-group>
                </a-form-item>


            </a-form>
        </a-spin>
    </a-modal>
</template>
<style lang="less" scoped>
    .imgname{
        width: 100px;
    }

    /deep/ .project_info .ant-form-item{
        margin-left: 30px !important;
        margin-bottom: 15px !important;
    }
    /deep/ .project_info .label_col{
        margin-right: 30px !important;
        font-weight: bold !important;
    }
    /deep/ .project_info .ant-form-item .ant-col-sm-13{
        width: 100% !important;
    }
    /deep/ .project_info .ant-upload-picture-card-wrapper{
        width: 15% !important;
    }
    /deep/ .help-icon{
        cursor: pointer;
        width: 20px;
        line-height: 20px;
        border-radius: 10px;
        background-color: #ddd;
        display: inline-block;
        text-align: center;
    }
</style>
<script>
    import villageApi from '@/api/community/village';
    import streetCommunityApi from '@/api/community/streetCommunity';

    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    export default {
        components: {
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
                confirmLoading: false,
                form: this.$form.createForm(this),
                sensitive_info:[],
                visible: false,
                type_show:false,
                post:{
                    id:0,
                    type:1,
                    refund_period:0,
                    status:'',
                    name:'',
                    subject_id:'',
                    subject_name:'',
                    img:''
                },
                uploadLoading:false,
                upload_url:'/v20/public/index.php/'+streetCommunityApi.uploadMeeting,
                imgUrl:'',
                typeStatus:false,
                is_disabled:false,
                min_refund_period:0,
                feeType: ''
            }
        },
        mounted() {
        },
        methods: {
            handleChange(value) {
                let d=value.split(',');
                this.typeStatus=(d[1] > 0 ) ? true : false;
                if (d[2]=='deposit_new'){
                    this.type_show=true
                    this.post.type=3
                    this.is_disabled=true
                }else{
                    this.type_show=false
                    this.is_disabled=false
                    this.post.type=1
                }
                console.log('type_1',this.post.type)
                this.feeType = d[2]

                this.request(villageApi.ChargeProjectIcon,{type:d[2]}).then((data) => {
                    this.imgUrl=data;
                    this.post.img =data;
                });
            },
            imgChange(info) {
                if (info.file.status === 'uploading') {
                    this.uploadLoading = true;
                    return;
                }

                if (info.file.status === 'done') {
                    // Get this url from response in real world.
                    getBase64(info.file.originFileObj, imageUrl => {
                        this.imgUrl = imageUrl;
                        this.uploadLoading = false;
                    });
                    if(info.file.response.status === 1000)
                    {
                        this.post.img = info.file.response.data;
                    }
                }
            },
            beforeUpload(file) {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    this.$message.error('图片仅支持png/jpg');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('图片必须小于2MB');
                }
                return isJpgOrPng && isLt2M;
            },
            add() {
                this.title = '添加';
                this.visible = true;
                this.post = {
                    id: 0,
                    type:2,
                    status:1,
                    refund_period:0,
                    name:'',
                    subject_id:'',
                    subject_name:'',
                    img:''
                };
                this.typeStatus=false;
                this.imgUrl='';
                this.is_disabled=false;
                this.type_show=false;
                this.chargeSetInfo()
                this.request(villageApi.getChargeSubject).then((data) => {
                    this.sensitive_info= data
                })
            },
            edit(id) {
                this.title = '编辑';
                this.visible = true;
                this.post.id = id;
                this.imgUrl='';
                this.typeStatus=false;
                this.is_disabled=true;
                this.type_show=false;
                this.getEditInfo();
                this.request(villageApi.getChargeSubject).then((data) => {
                    this.sensitive_info= data;
                });
            },
           delete(id){
             // this.title = '删除';
             // this.request(villageApi.deleteProjectId,{id:id}).then((data) => {
             //    alert(data)
             //   console.log(data)
             // });
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
                        let url=villageApi.ChargeProjectAdd;
                        if(this.post.id > 0){
                            url=villageApi.ChargeProjectSub;
                            values.post.id=this.post.id;
                        }else{
                            let d=values.post.subject_id.split(',');
                            values.post.subject_id=d[0];
                        }
                        if (values.post.refund_period > 0 && values.post.refund_period < this.min_refund_period) {
                            this.$message.error('退款期限不能小于收费设置的退款期限')
                            this.confirmLoading = false
                            return false
                        }
						values.post.type = this.post.type;
                        values.post.img=this.post.img;
                        if(this.feeType == 'park_new'||this.feeType == 'pile'||this.feeType == 'new_nuanqifei'||this.feeType == 'qunuanfei'){
                            values.post.type = 1
                        }
                        this.request(url, values.post)
                            .then((res) => {
                                if (this.post.id>0) {
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
                    this.post.id = 0;
                    this.feeType = ''
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            getEditInfo() {
                this.request(villageApi.ChargeProjectEdit, {
                    id: this.post.id
                })
                    .then((res) => {
                        this.post = {
                            id: res.id,
                            type: res.type,
                            status: res.status,
                            name:res.name,
                            subject_name:res.subject_name,
                            refund_period:res.refund_period,
                            img:res.img
                        };
                        if (res.type===3){
                            this.type_show=true;
                        }
                        this.typeStatus=res.typeStatus;
                        this.imgUrl=res.img;
                        this.chargeSetInfo() // 获取收费设置的退款期限
                    })
            },
            chargingMode (value) {
                this.post.type = value.target.value
            },
            // 获取小区收费设置信息
            chargeSetInfo () {
                this.request(villageApi.chargeSetInfo)
                    .then((res) => {
                        if (res.length !== 0) {
                            this.min_refund_period = res.refund_term
                            console.log(this.post.refund_period)
                            console.log(this.min_refund_period)
                            if (this.post.refund_period > 0 && this.post.refund_period < this.min_refund_period) {
                                this.$notification['warning']({
                                    message: '注意',
                                    description:
                                        '当前退款期限小于收费设置的退款期限，已自动更新当前退款期限。'
                                })
                                this.post.refund_period = this.min_refund_period
                            }
                        }
                    })
            }
        }
    }
</script>