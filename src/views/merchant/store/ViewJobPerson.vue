<template>
    <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel"
             :footer="null">
        <a-spin :spinning="confirmLoading">
            <div>
                <a-form-model
                        v-bind="{
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
          }"
                        :model="formData"
                >
                    <a-form-item label="上传图片" :required="true" :help="L('图片为真人半身照片,建议尺寸为200*100')">
                        <a-row>
                            <a-input hidden v-model="formData.headimg"></a-input>
                            <template>
                                <div class="clearfix">
                                    <a-upload
                                            list-type="picture-card"
                                            :file-list="fileList1"
                                            disabled
                                    >
                                        <!--                                            <a-icon type="plus"/>-->
                                        <!--                                            <div class="ant-upload-text">-->
                                        <!--                                                上传图片-->
                                        <!--                                            </div>-->
                                    </a-upload>
                                    <!--                                        <a-modal :visible="previewVisible1" :footer="null"-->
                                    <!--                                                 @cancel="handleCancel1">-->
                                    <!--                                            <img alt="example" style="width: 100%" :src="previewImage"/>-->
                                    <!--                                        </a-modal>-->
                                </div>
                            </template>
                        </a-row>
                    </a-form-item>

                    <a-form-item label="技师名称" :required="true" :help="L('建议填写真实姓名')">
                        <a-row>
                            <a-col :span="18">
                                <a-input placeholder="请输入名称" v-model="formData.name"></a-input>
                            </a-col>
                            <a-col :span="6" class="text-left">
                                1-8字符
                            </a-col>
                        </a-row>
                    </a-form-item>

                    <a-form-item label="岗位" :required="true">
                        <a-select v-model="formData.job_id" @change="handleCountryChange">
                            <a-select-option v-for="item in job_sel" :key="item.id"
                                             :value="item.id">{{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item label="从业时间" :required="true">
                        <a-row>
                            <a-col :span="24">
                                <a-date-picker
                                        format="YYYY-MM-DD"
                                        :value="date_moment(formData.job_time, 'YYYY-MM-DD')"
                                        placeholder="请选择从业时间"
                                        @change="onDateStartChange"
                                        :getCalendarContainer="
                                      triggerNode => {
                                          return triggerNode.parentNode
                                      }
                                  "
                                />
                            </a-col>
                        </a-row>
                    </a-form-item>

                    <a-form-item label="擅长" :required="true">
                        <a-input placeholder="请输入技师擅长" v-model="formData.specialty"></a-input>
                    </a-form-item>

                    <a-form-item label="简介">
                        <a-textarea :rows="4" placeholder="请输入简介" v-model="formData.desc"
                                    :maxLength="200"></a-textarea>
                    </a-form-item>
                </a-form-model>
            </div>
        </a-spin>
        <template slot="footer">
            <!--            <a-button @click="sureAdd" v-show="current == 0">{{ L('确定') }}</a-button>-->
            <!--<a-button type="primary" @click="next" v-show="current == 0">{{ L('去认证') }}</a-button>-->

            <!--            <a-button @click="handleCancel" v-show="current == 1">{{ L('取消') }}</a-button>-->
            <!--            <a-button type="primary" @click="subRes" v-show="current ==1">{{ L('提交申请') }}</a-button>-->
        </template>
    </a-modal>
</template>

<script>
    import mallMerchantApi from '@/api/merchant/store'
    import ARow from "ant-design-vue/es/grid/Row";
    import ACol from "ant-design-vue/es/grid/Col";
    import AFormItem from "ant-design-vue/es/form/FormItem";
    import moment from 'moment'

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = error => reject(error)
        })
    }

    export default {
        name: "ViewJobPerson",
        components: {AFormItem, ACol, ARow},
        props: {
            // 存放路径
            upload_dir: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                dateFormat: 'YYYY-MM-DD',
                title: '查看详情',
                phone: "",
                avatar: "",
                msg: "",
                fileList1: [],
                current: 0,
                visible: false,
                previewVisible1: false,
                is_res: false,
                store_id: "",
                confirmLoading: false,
                previewImage: '',
                action: '/v20/public/index.php/common/common.UploadFile/uploadPictures',
                uploadName: 'reply_pic',
                steps: [
                    {
                        title: '填写技师',
                        content: 'First-content',
                    },
                    {
                        title: '申请认证技师',
                        content: 'Second-content',
                    },
                ],
                job_sel: [],
                person_id: "",
                formData: {
                    id: "",
                    headimg: "",
                    store_id: "",
                    job_id: "",
                    name: "",
                    job_time: "",
                    specialty: "",
                    desc: "",
                    uid: 0,
                    detail: "",
                }
            };
        },
        methods: {
            moment,
            date_moment(time, dateFormat) {
                if (!time) {
                    return ''
                }
                return moment(time, dateFormat);
            },
            onDateStartChange(start_time_moment, start_time) {
                this.formData.job_time = start_time
                this.$set(this.formData, 'job_time', start_time)
            },
            add(store_id) {
                this.person_id = ""
                this.store_id = store_id
                this.visible = true
                this.formData = {
                    id: "",
                    headimg: "",
                    store_id: store_id,
                    job_id: "",
                    name: "",
                    job_time: "",
                    specialty: "",
                    desc: "",
                    uid: 0,
                    detail: "",
                }
                this.request(mallMerchantApi.selJob, {}).then((res) => {
                    this.job_sel = res
                })
            },
            edit(id) {
                this.request(mallMerchantApi.editJob, {id: id}).then((res) => {
                    this.job_sel = res.sel_job
                    this.visible = true
                    this.is_res = false
                    this.formData = res.list
                    this.phone = res.list.phone
                    this.avatar = res.list.avatar
                    this.formData.job_time = moment(res.list.job_time)
                    this.fileList1 = []
                    let param1 = {
                        uid: 'image',
                        name: 'image_1',
                        status: 'done',
                        url: res.list.headimg
                    }
                    this.fileList1.push(param1)
                })
            },
            next() {
                // if (this.formData.id * 1 > 0) {
                //     this.request(mallMerchantApi.updateJob, this.formData).then((res) => {
                //         this.person_id = res
                //         this.current++;
                //     })
                // } else {
                //     this.request(mallMerchantApi.addJob, this.formData).then((res) => {
                //         this.person_id = res
                this.current++;
                //     })
                // }
            },
            sureAdd() {
                this.request(mallMerchantApi.addJob, this.formData).then((res) => {
                    // 调用父页面方法
                    this.$emit('handleUpdate', {})
                    this.current = 0
                    this.visible = false
                })
            },
            subRes() {
                if (this.is_res) {
                    this.request(mallMerchantApi.authentica, {
                        id: this.person_id,
                        uid: this.formData.uid,
                        detail: this.formData.detail
                    }).then((res) => {
                        this.$message.success('已经提交申请，请等待审核结果！')
                        // 调用父页面方法
                        this.$emit('handleUpdate', {})
                        this.current = 0
                        this.visible = false
                    })
                } else {
                    this.$message.error('请输入有效的技师账号(手机号)验证！')
                }
            },
            prev() {
                this.current--;
            },
            handleCancel1() {
                this.formData.headimg = ""
                this.previewVisible1 = false
            },
            handleCancel() {
                this.current = 0
                this.visible = false
                // 调用父页面方法
                this.$emit('handleUpdate', {})
            },
            async handlePreview1(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImage = file.url || file.preview;
                this.previewVisible1 = true;
            },
            handleChange({fileList}) {
                if (fileList.length > 0) {
                    let len = fileList.length - 1
                    this.fileList1 = fileList
                    if (this.fileList1[len].status == 'done') {
                        this.formData.headimg = this.fileList1[len].response.data
                        this.fileList1[0].uid = 'logo'
                        this.fileList1[0].name = 'logo_1'
                        this.fileList1[0].status = 'done'
                        this.fileList1[0].url = this.fileList1[len].response.data
                        if (fileList.length > 1) {
                            this.fileList1.splice(0, len)
                        }
                    }

                }
            },
            resJob() {
                this.request(mallMerchantApi.resJob, {phone: this.phone}).then((res) => {
                    if (res.uid) {
                        this.is_res = true
                        this.msg = "该账号可申请认证"
                        this.formData.uid = res.uid
                        this.avatar = res.avatar
                    } else {
                        this.is_res = false
                        this.msg = "该账号不存在或者已经被认证"
                    }
                })
            },
            handleCountryChange(val) {
                this.formData.job_id = val
            }
        },
    }
</script>

<style scoped>
    .steps-content {
        margin-top: 16px;
        border: 1px dashed #e9e9e9;
        border-radius: 6px;
        background-color: #fafafa;
        min-height: 200px;
        text-align: center;
        padding-top: 80px;
    }

    .steps-action {
        margin-top: 24px;
    }
</style>