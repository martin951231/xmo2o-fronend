<template>
    <div>
        <a-tabs default-active-key="1">
            <a-tab-pane key="1" :tab="title">
            </a-tab-pane>
        </a-tabs>
        <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">

            <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }" @submit="handleSubmit">
                <a-form-item 
                    label="贷款类型"  
                    >
                    <a-select 
                        style="width: 110px" 
                        v-decorator="['loans_type', { initialValue: detail.loans_type }]"
                    >
                        <a-select-option :value="item.value" :key="item.value" v-for="item in loansTypeArr">
                            {{item.name}}
                        </a-select-option>
                    </a-select> 
                </a-form-item>
                <a-form-item label="贷款标题" help="建议不要超过10个字">
                    <a-input field-names="title"
                        v-decorator="['title', { initialValue: detail.title,rules: [{ required: true, message: '请输入贷款标题!' }] }]"
                        placeholder="请输入贷款标题"
                        />
                </a-form-item>
                <a-form-item label="贷款标签" help="建议不要超过20个字">
                    <a-input field-names="label"
                        v-decorator="['label', { initialValue: detail.label,rules: [{ required: true, message: '请输入贷款标签!' }] }]"
                        placeholder="请输入贷款标签"
                        help="每个标签之间用空格分栏"
                        />
                </a-form-item>
                <a-form-item label="贷款期限">
                    <a-input field-names="loans_time_limit"
                        v-decorator="['loans_time_limit', { initialValue: detail.loans_time_limit,rules: [{ required: true, message: '请输入贷款期限!' }] }]"
                        placeholder="请输入贷款期限"
                        />
                </a-form-item>
                <a-form-item label="贷款利率">
                    <a-input field-names="loans_interest_rate"
                        v-decorator="['loans_interest_rate', { initialValue: detail.loans_interest_rate,rules: [{ required: true, message: '请输入贷款利率!' }] }]"
                        placeholder="请输入贷款利率"
                        />
                </a-form-item>
                <a-form-item label="适用客户" help="建议不要超过100个字">
                    <a-input field-names="for_customer"
                        v-decorator="['for_customer', { initialValue: detail.for_customer,rules: [{ required: true, message: '请输入适用客户!' }] }]"
                        placeholder="请输入适用客户"
                        />
                </a-form-item>
                <a-form-item label="最高额度">
                    <a-input-number field-names="loans_highest_amount"
                        style="width:140px"
                        v-decorator="['loans_highest_amount', { initialValue: detail.loans_highest_amount,rules: [{ required: true, message: '请输入最高额度!' }] }]"
                        placeholder="请输入最高额度"
                        /><span class="ml-10">万</span>
                </a-form-item>
                <a-form-item label="贷款方式">
                     <a-input field-names="loans_method"
                        v-decorator="['loans_method', { initialValue: detail.loans_method}]"
                        placeholder="请输入贷款方式"
                        />

                    <!-- <template v-for="(tag) in detail.loans_method">
                    <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                        <a-tag :key="tag" :closable="true" @close="() => handleClose(tag, 'loans_method')">
                        {{ `${tag.slice(0, 20)}...` }}
                        </a-tag>
                    </a-tooltip>
                    <a-tag v-else :key="tag" :closable="true" @close="() => handleClose(tag, 'loans_method')">
                        {{ tag }}
                    </a-tag>
                    </template>
                    <a-input
                        v-if="inputVisibleLoansMethod"
                        ref="input"
                        type="text"
                        size="small"
                        :style="{ width: '78px' }"
                        :value="inputValue"
                        @change="handleInputChange"
                        @blur="handleInputConfirm('loans_method')"
                        @keyup.enter="handleInputConfirm('loans_method')"
                    />
                    <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showInput">
                        <a-icon type="plus" /> 新增
                    </a-tag> -->
                </a-form-item>
                <a-form-item label="还款方式">
                     <a-input field-names="loans_repayment_method"
                        v-decorator="['loans_repayment_method', { initialValue: detail.loans_repayment_method }]"
                        placeholder="请输入还款方式"
                        />
                    <!-- <template v-for="(tag) in detail.loans_repayment_method">
                    <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                        <a-tag :key="tag" :closable="true" @close="() => handleClose(tag, 'loans_repayment_method')">
                        {{ `${tag.slice(0, 20)}...` }}
                        </a-tag>
                    </a-tooltip>
                    <a-tag v-else :key="tag" :closable="true" @close="() => handleClose(tag, 'loans_repayment_method')">
                        {{ tag }}
                    </a-tag>
                    </template>
                    <a-input
                        v-if="inputVisibleLoansRepaymentMethod"
                        ref="input"
                        type="text"
                        size="small"
                        :style="{ width: '78px' }"
                        :value="inputValue"
                        @change="handleInputChange"
                        @blur="handleInputConfirm('loans_repayment_method')"
                        @keyup.enter="handleInputConfirm('loans_repayment_method')"
                    />
                    <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showInputRepayment">
                        <a-icon type="plus" /> 新增
                    </a-tag> -->
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
                
                <a-form-item label="上传产品详情图片" help="建议659*330px">
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
    const loansTypeArr = [
            {
                value: 1,
                name:'个人贷'
            },
            {
                value: 2,
                name:'企业贷'
            }
        ]
    export default {
        components: {
        },
        data() {
            return {
                type: 'loans',     
                loansTypeArr,
                headers: {
                    authorization: 'authorization-text',
                },
                uploadImg: '/v20/public/index.php' + uploadApi.uploadImg + '?upload_dir=/banking/loans',
                baseData : {
                    banking_id: 0,
                    type: "loans",
                    title: "",
                    introduce: '',
                    images: '',
                    cover_image: '',
                    phone: '',
                    label: '',
                    release_people: '',
                    for_customer: '',
                    loans_type: 1,
                    loans_time_limit: '',
                    loans_interest_rate: '',
                    loans_highest_amount: '',
                    loans_method:'',
                    loans_repayment_method:''
                },
                inputVisibleLoansMethod:false,
                inputVisibleLoansRepaymentMethod:false,
                inputValue:'',

                title:'新建贷款',
                detail: {},
                updateData: {
                    "upload_dir": "banking"
                }, 
                updateDataCover: {
                    "upload_dir": "banking"
                },
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
                this.title="新建贷款"
                this.form.resetFields();
                this.detail = this.baseData;
            },
            getBankingDetail() {
                this.request(bankingPlatformApi.getBankingDetail, {
                    banking_id: this.detail.banking_id
                }).then((res) => {
                    this.detail = res;
                    this.detail.loans_method = this.detail.loans_method.toString()
                    this.detail.loans_repayment_method = this.detail.loans_repayment_method.toString()
                    this.title = '编辑贷款';
                    
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

            handleClose(removedTag,type) {
                const tags = this.detail[type].filter(tag => tag !== removedTag);
                this.detail[type] = tags;
            },

            showInputRepayment() {
                this.inputVisibleLoansRepaymentMethod = true;
                this.$nextTick(function() {
                    this.$refs.input.focus();
                });
            },

            showInput() {
                this.inputVisibleLoansMethod = true;
                this.$nextTick(function() {
                    this.$refs.input.focus();
                });
            },

            handleInputChange(e) {
                this.inputValue = e.target.value;
            },

            handleInputConfirm(type) {
                const inputValue = this.inputValue;
                let tags = this.detail[type];
                if (inputValue && tags.indexOf(inputValue) === -1) {
                    tags = [...tags, inputValue];
                }
                this.detail[type] = tags;
                switch(type){
                    case 'loans_method':
                        this.inputVisibleLoansMethod = false
                        break;
                    case 'loans_repayment_method':
                        this.inputVisibleLoansRepaymentMethod = false
                        break;
                }
                Object.assign(this, {
                    tags,
                    inputValue: '',
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
                        // values.loans_method = this.detail.loans_method;
                        // values.loans_repayment_method = this.detail.loans_repayment_method;

                        if (!this.detail.cover_image) {
                            this.$message.error('请上传产品封面图！');
                            return false;
                        } 
                        if (!this.detail.images) {
                            this.$message.error('请上传产品详情图！');
                            return false;
                        }
                        // if (this.detail.loans_method.length == 0) {
                        //     this.$message.error('请添加贷款方式！');
                        //     return false;
                        // }
                        // if (this.detail.loans_repayment_method.length == 0) {
                        //     this.$message.error('请添加还款方式！');
                        //     return false;
                        // }

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
