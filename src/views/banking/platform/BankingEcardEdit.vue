<template> 
    <div>
        <a-tabs default-active-key="1">
            <a-tab-pane key="1" :tab="title">
            </a-tab-pane>
        </a-tabs>
        <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">

            <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }" @submit="handleSubmit">
                <a-form-item label="e支付名称" help="建议不要超过10个字">
                    <a-input 
                        field-names="title"
                        v-decorator="['title', { initialValue: detail.title,rules: [{ required: true, message: '请输入e支付名称!' }] }]"
                        placeholder="请输入e支付名称" 
                        />
                </a-form-item>
                <a-form-item label="功能优势" help="每个优势标签之间用空格隔开">
                    <a-input
                        field-names="label"
                        v-decorator="['label', { initialValue: detail.label,rules: [{ required: true, message: '请输入功能优势!' }] }]"
                        placeholder="请输入功能优势"
                        />
                </a-form-item>
                <a-form-item label="业务简介">
                    <a-textarea 
                        v-decorator="['introduce', { initialValue: detail.introduce,rules: [{ required: true, message: '请输入业务简介!' }] }]"
                        placeholder="请输入业务简介"
                        />
                </a-form-item>
                <a-form-item label="使用客户">
                    <a-textarea 
                        field-names="for_customer"
                        v-decorator="['for_customer', { initialValue: detail.for_customer,rules: [{ required: true, message: '请输入使用客户!' }] }]"
                        placeholder="请输入使用客户"
                        />
                </a-form-item>
                <a-form-item label="联系电话">
                    <a-input 
                        field-names="phone"
                        v-decorator="['phone', { initialValue: detail.phone,rules: [{ required: true, message: '请输入联系电话!' }] }]"
                        placeholder="请输入联系电话"
                        />
                </a-form-item>
                <a-form-item label="发布人">
                    <a-input
                        field-names="release_people"
                        v-decorator="['release_people', { initialValue: detail.release_people,rules: [{ required: true, message: '请输入发布人!' }] }]"
                        placeholder="请输入发布人"
                        />
                </a-form-item>
                <a-form-item label="修改人" v-if="detail.banking_id">
                    <a-input
                        field-names="edit_people"
                        v-decorator="['edit_people', { initialValue: detail.edit_people,rules: [{ required: true, message: '请输入修改人!' }] }]"
                        placeholder="请输入修改人"
                        />
                </a-form-item>
                <a-form-item label="上传产品封面图片" help="建议200*200px">
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
                
                <a-form-item label="上传产品详情图片" help="建议750*600px">
                    <a-upload
                        name="reply_pic"
                        :file-list="fileList"
                        :action="uploadImg"
                        :headers="headers"
                        list-type="picture-card"
                        @preview="handlePreview"
                        @change="upLoadChange($event)"
                    >
                    <div v-if="fileList.length < 1">
                        <a-icon type="plus" />
                        <div class="ant-upload-text">上传图片</div>
                    </div>
                    </a-upload>
                    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                        <img alt="example" style="width: 100%" :src="previewImage" />
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
                type: 'ecard',
                headers: {
                    authorization: 'authorization-text',
                },
                uploadImg: '/v20/public/index.php' + uploadApi.uploadImg + '?upload_dir=/banking/ecard',
                baseData : {
                    banking_id: 0,
                    type: "ecard",
                    title: "",
                    introduce: '',
                    images: '',
                    cover_image: '',
                    phone: '',
                    label: '',
                    release_people: '',
                    for_customer: '',
                },
                title:"新建E支付",
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
            console.log('watch')
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
                this.title = '新建E支付'
                this.form.resetFields();
                this.detail = this.baseData;
            },
            getBankingDetail() {
                this.title = '编辑E支付'
                this.request(bankingPlatformApi.getBankingDetail, {
                    banking_id: this.detail.banking_id
                }).then((res) => {
                    this.detail = res;
                    
                    let imageList = [];
                    if (res.images.length > 0) {
                        for (const i in res.images) {
                            imageList.push({
                                uid: i + 1,
                                name: 'image.png',
                                status: 'done',
                                url: res.images[i],
                                data: res.images[i]
                            });
                        }
                    }
                    this.fileList = imageList;
                    this.fileListCover[0] = {
                        uid: 1,
                        name: 'image.png',
                        status: 'done',
                        url: res.cover_image,
                        data: res.cover_image
                    };
                     
                });
            },
            async handlePreview(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImage = file.url || file.preview;
                this.previewVisible = true;
            },  
            async handlePreviewCover(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImageCover = file.url || file.preview;
                this.previewVisibleCover = true;
            },
            // 上传详情图
            upLoadChange(info) {
                 // 图片列表
                let fileList = [...info.fileList]

                fileList = fileList.slice(-1)
                fileList = fileList.map((file) => {
                    if (file.response) {
                    file.url = file.response.data.full_url
                    this.detail.images = info.file.response.data.image
                    }
                    return file
                })
                this.fileList = fileList
                if (info.file.status === 'done') {
                } else if (info.file.status === 'error') {
                    this.$message.error(`${info.file.name} 上传失败.`)
                }
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

            handleCancel() {
                this.previewVisible = false;
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
                        values.images = this.detail.images;
                        values.type = this.detail.type;

                        if (!this.detail.cover_image) {
                            this.$message.error('请上传产品封面图！');
                            return false;
                        } 
                        if (!this.detail.images) {
                            this.$message.error('请上传产品详情图！');
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
