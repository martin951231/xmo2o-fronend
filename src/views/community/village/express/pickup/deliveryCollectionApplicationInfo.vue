<template>
    <a-modal :title="title" :width="`65vw`" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading"  :height="`70vh`">
            <a-form :form="form" class="project_info_form">
                <a-form-item
                    name="express_code"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="快递单号"
                    required
                >
                    <a-input
                        placeholder="请输入快递单号"
                        v-decorator="['post.express_code',{rules: [{ required: true, message: L('请填写快递单号！') }] }]"
                    />
                </a-form-item>
                <a-form-item
                    name="pickup_code"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="取件码"
                    required
                >
                    <a-input
                        placeholder="请输入取件码"
                        v-decorator="['post.pickup_code',{rules: [{ required: true, message: L('请填写取件码！') }] }]"
                    />
                </a-form-item>
                <a-form-item
                    name="recipient_name"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="收件人"
                >
                    <a-input
                        v-decorator="['post.recipient_name',{rules: [{ required: true, message: L('请填写收件人！') }] }]"
                        placeholder="请输入收件人"
                    />
                </a-form-item>
                <a-form-item
                    name="recipient_phone"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="收件电话"
                >
                    <a-input
                        placeholder="请输入收件电话"
                        v-decorator="['post.recipient_phone',{rules: [{ required: true, message: L('请填写收件电话！') }] }]"
                    />
                </a-form-item>
                <a-form-item
                    name="pickup_point"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="取件地址"
                >
                    <a-select
                        placeholder="请选择取件地址"
                        v-decorator="['post.pickup_point',{rules: [{ required: true, message: L('请选择取件地址！') }] }]"
                    >
                        <a-select-option v-for="item in villageProject" :key="item.id">
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    name="project_id"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="项目小区"
                >
                    <a-select
                        v-decorator="['post.project_id',{rules: [{ required: true, message: L('请选择小区！') }] }]"
                    >
                        <a-select-option v-for="item in villageProject" :key="item.id">
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    name="express_status"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="快递状态"
                >
                    <a-select
                        v-decorator="['post.express_status',{rules: [{ required: true, message: L('请选择状态！') }] }]"
                    >
                        <a-select-option v-for="item in statusList" :key="item.value">{{ item.lable }}</a-select-option>
                    </a-select>
                </a-form-item>
<!--                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">-->
<!--                    <span class="label_col ant-form-item-required">取件图片</span>-->
<!--                    <a-upload-->
<!--                        name="pickup_img"-->
<!--                        list-type="picture-card"-->
<!--                        class="avatar-uploader"-->
<!--                        :show-upload-list="false"-->
<!--                        :action="upload_url"-->
<!--                        :before-upload="beforeUpload"-->
<!--                        @change="imgChange"-->
<!--                    >-->
<!--                        <img v-if="imgUrl" :src="imgUrl" class="imgname" alt="img" />-->
<!--                        <div v-else>-->
<!--                            <a-icon :type="uploadLoading ? 'uploadLoading' : 'plus'" />-->
<!--                            <div class="ant-upload-text">-->
<!--                                上传-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </a-upload>-->
<!--                    <span>建议尺寸：80*80px</span>-->
<!--                </a-form-item>-->
                <a-form-item
                    name="remark"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="备注"
                >
                    <a-input v-model="form.remark" placeholder="请输入备注" />
                </a-form-item>

            </a-form>
        </a-spin>
    </a-modal>
</template>
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
                xs: { span: 38 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 38 },
                sm: { span: 18 },
            },
            confirmLoading: false,
            form: this.$form.createForm(this),
            sensitive_info:[],
            visible: false,
            is_disabled:false,
            uploadLoading:false,
            upload_url:'/v20/public/index.php/'+streetCommunityApi.uploadMeeting,
            imgUrl: '',
            post: {
                id: 0,
                status:1,
                refund_period:0,
                name:'',
                phone:'',
            },
            villageProject: [],
            statusList:[
                {lable: '已作废',value: 0},
                {lable: '已取回',value: 1},
                {lable: '待取件',value: 2},
            ],
        }
    },
    mounted() {
    },
    methods: {
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
                status:1,
                refund_period:0,
                name:'',
                phone:'',
            };
            this.imgUrl='';
        },
        edit(id) {
            this.title = '编辑';
            this.visible = true;
            this.post.id = id;
            this.imgUrl='';
            this.is_disabled=true;
        },
        handleCancel() {
            this.visible = false;
            this.form.resetFields();
        },
        handleSubmit() {
            this.confirmLoading = true;
            this.form.validateFields((err, values) => {
                if (!err) {
                    this.post = {...this.post, ...values};
                }
                this.confirmLoading = false;
            }).then(() => {
                if (this.post.id === 0) {
                    this.request(villageApi.DeliveryCollectionApplicationAdd, this.post, {
                        success: (res) => {
                            this.$message.success('提交成功');
                            this.visible = false;
                            this.form.resetFields();
                            this.confirmLoading = false;
                            this.getList();
                        },
                        error: (res) => {
                            this.confirmLoading = false;
                        }
                    });
                } else {
                    this.request(villageApi.DeliveryCollectionApplicationEdit, this.post, {
                        success: (res) => {
                            this.$message.success('提交成功');
                            this.visible = false;
                            this.form.resetFields();
                            this.confirmLoading = false;
                            this.getList();
                        },
                        error: (res) => {
                            this.confirmLoading = false;
                        }
                    });
                }
            }).catch(() => {
                this.confirmLoading = false;
            })
        }
    }
}
</script>
<style lang="less" scoped>
.imgname{
    width: 100px;
}
/deep/ .project_info_form{
    .ant-select-selection--single,.ant-input{
        height: 40px;
    }
}

</style>