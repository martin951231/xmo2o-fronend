<template>
    <div>
        <a-tabs default-active-key="1">
            <a-tab-pane key="1" :tab="title">
            </a-tab-pane>
        </a-tabs>
        <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
            <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }" @submit="handleSubmit">            
                <a-form-item label="信用卡名称" help="建议不要超过10个字">
                    <a-input field-names="title"

                        v-decorator="['title', { initialValue: detail.title,rules: [{ required: true, message: '请输入信用卡名称!' }] }]"
                        placeholder="请输入信用卡名称"
                        />
                </a-form-item>
                <a-form-item label="信用卡简介">
                    <a-input field-names="introduce"
                        v-decorator="['introduce', { initialValue: detail.introduce,rules: [{ required: true, message: '请输入信用卡简介!' }] }]"
                        placeholder="请输入信用卡简介"
                        help="请用一句话描述信用卡的优势"
                        />
                </a-form-item>
                <a-form-item label="信用卡权益">
                    <a-textarea 
                        v-decorator="['credit_card_equities', { initialValue: detail.credit_card_equities,rules: [{ required: true, message: '请输入信用卡权益!' }] }]"
                        placeholder="请输入信用卡权益"
                        />
                </a-form-item>
                <a-form-item label="联系电话">
                    <a-input field-names="phone"
                        v-decorator="['phone', { initialValue: detail.phone,rules: [{ required: true, message: '请输入联系电话!' }] }]"
                        placeholder="请输入联系电话"
                        />
                </a-form-item>
                <a-form-item label="发布人">
                    <a-input field-names="release_people"
                        v-decorator="['release_people', { initialValue: detail.release_people,rules: [{ required: true, message: '请输入发布人!' }] }]"
                        placeholder="请输入发布人"
                        />
                </a-form-item>
                <a-form-item label="修改人" v-if="detail.banking_id">
                    <a-input field-names="edit_people"
                        v-decorator="['edit_people', { initialValue: detail.edit_people,rules: [{ required: true, message: '请输入修改人!' }] }]"
                        placeholder="请输入修改人"
                        />
                </a-form-item>
                <a-form-item label="上传产品图片" help="建议536*336px">
                    <a-upload
                        name="reply_pic"
                        :file-list="fileListCover"
                        :action="uploadImg"
                        :headers="headers"
                        list-type="picture-card"
                        @preview="handlePreviewCover"
                        @change="upLoadChangeCover($event)"
                    >
                    <div v-if="fileListCover.length < 1">
                        <a-icon type="plus" />
                        <div class="ant-upload-text">上传图片</div>
                    </div>
                    </a-upload>
                    <a-modal :visible="previewVisibleCover" :footer="null" @cancel="handleCancelCover">
                        <img alt="example" style="width: 100%" :src="previewImageCover" />
                    </a-modal>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 12, offset: 5 }">    
                    <a-button type="primary" html-type="submit">
                        提交
                    </a-button>
                </a-form-item>

            </a-form>
        </div>
    </div>
</template>

<script>
    import bankingPlatformApi from "@/api/banking/platform/index";
    import uploadApi from '@/api/common/uploads'
    export default {
        components: {
        },
        data() {
            return {
                type: 'credit_card',     
                headers: {
                    authorization: 'authorization-text',
                },
                uploadImg: '/v20/public/index.php' + uploadApi.uploadImg + '?upload_dir=/banking/credit_card',
                baseData : {
                    banking_id: 0,
                    type: "credit_card",
                    title: "",
                    introduce: '',
                    images: '',
                    cover_image: '',
                    phone: '',
                    release_people: '',
                    credit_card_equities: '',
                },
                title:'新建信用卡',
                detail: {},
                fileList: [],
                fileListCover: [],
                previewVisible: false,
                previewVisibleCover: false,
                previewImage: null,
                previewImageCover: null,
                form: this.$form.createForm(this, {
                    name: 'coordinated'
                }),

            };
        },
        mounted() {
            console.log('mounted')
            this.resetForm();
            if (this.$route.query.banking_id) {                
                this.detail.banking_id = this.$route.query.banking_id;
                this.getBankingDetail();
            }
        },
        watch: {
            $route(newVal, oldVal) {
                const query = newVal.query
                if (query.banking_id) {
                    this.detail.banking_id = query.banking_id
                    this.getBankingDetail();
                } else {
                    // 新增 初始化表单
                    this.resetForm();
                }
            }
        },
        methods: {
            resetForm() {
                this.title = '新建信用卡'
                this.form.resetFields();
                this.detail = this.baseData;
            },
            getBankingDetail() {
                this.title = '编辑信用卡'
                this.request(bankingPlatformApi.getBankingDetail, {
                    banking_id: this.detail.banking_id
                }).then((res) => {
                    this.detail = res;
                    this.fileListCover[0] = {
                        uid: 1,
                        name: 'image.png',
                        status: 'done',
                        url: res.cover_image,
                        data: res.cover_image
                    };
                     
                });
            }, 
            async handlePreviewCover(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImageCover = file.url || file.preview;
                this.previewVisibleCover = true;
            },
            // 上传封面图
            upLoadChangeCover(info) {
                 // 图片列表
                let fileList = [...info.fileList]

                fileList = fileList.slice(-1)
                fileList = fileList.map((file) => {
                    if (file.response) {
                    file.url = file.response.data.full_url
                    this.detail.cover_image = info.file.response.data.image
                    }
                    return file
                })
                this.fileListCover = fileList
                if (info.file.status === 'done') {
                } else if (info.file.status === 'error') {
                    this.$message.error(`${info.file.name} 上传失败.`)
                }
            },
            handleCancelCover() {
                this.previewVisibleCover = false;
            },

            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.log(values, 'values')
                        console.log(this.detail, 'detail')
                        values.banking_id = this.detail.banking_id;
                        values.cover_image = this.detail.cover_image;
                        values.images = this.detail.cover_image;
                        values.type = this.detail.type;

                        if (!this.detail.cover_image) {
                            this.$message.error('请上传产品图片！');
                            return false;
                        } 

                        this.request(bankingPlatformApi.saveBanking, values).then((res) => {
                            this.resetForm();
                            this.$message.success(this.L('操作成功！'))
                            localStorage.setItem('refresh',1)
                            this.$router.push({
                                path: '/banking/platform.banking/BankingList'
                            });
                        })
                    }
                });
            }
        },

    }
</script>
