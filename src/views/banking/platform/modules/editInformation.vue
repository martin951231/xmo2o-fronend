<template>
    <div>
        <a-modal
            :visible="visible"
            :title="title"
            width="60%"
            @cancel="handleCancel"
            :destroyOnClose="true"
            :confirmLoading="confirmLoading"
            @ok="handleOk"
        >
            <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item label="资讯标题" required>
                    <a-input v-model="formData.title"/>
                </a-form-model-item>
                <a-form-model-item label="图片" required help="建议尺寸104*78">
                  <a-upload
                    name="reply_pic"
                    list-type="picture"
                    :show-upload-list="false"
                    :data="{upload_dir: ''}"
                    action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                    @change="handleUploadChange"
                  >
                    <img v-if="image" style="width: 120px; height: 120px;" :src="image" alt="image" />
                    <div v-else>
                      <a-icon v-if="loading === true" :type="'loading'" />
                      <a-button> <a-icon type="upload" /> 上传 </a-button>
                    </div>
                  </a-upload>
                </a-form-model-item>
                <a-form-model-item label="显示时长" required>
                    <a-radio-group v-model="formData.show_type">
                        <a-radio value="1">
                            永久显示
                        </a-radio>
                        <a-radio value="2">
                            时间段
                        </a-radio>
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item v-if="formData.show_type == 2" label="显示开始时间" required>
                    <a-date-picker v-if="formData.start_time === null"
                        :default-value="null"
                        show-time
                        type="date"
                        placeholder="显示开始时间"
                        style="width: 100%;"
                        @change="startTimeChange"
                    />
                    <a-date-picker v-else
                       :default-value="moment(formData.start_time)"
                       show-time
                       type="date"
                       placeholder="显示开始时间"
                       style="width: 100%;"
                       @change="startTimeChange"
                    />
                </a-form-model-item>
                <a-form-model-item v-if="formData.show_type == 2" label="显示结束时间" required>
                    <a-date-picker v-if="formData.start_time === null"
                        :default-value="null"
                        show-time
                        type="date"
                        placeholder="显示结束时间"
                        style="width: 100%;"
                        @change="endTimeChange"
                    />
                    <a-date-picker v-else
                       :default-value="moment(formData.end_time)"
                       show-time
                       type="date"
                       placeholder="显示结束时间"
                       style="width: 100%;"
                       @change="endTimeChange"
                    />
                </a-form-model-item>
                <a-form-model-item label="资讯内容" >
                    <rich-text :info.sync="formData.content" />
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>
<script>

import bankingPlatformApi from "@/api/banking/platform/index";
import RichText from '@/components/RichText/RichText2'
import moment from 'moment'

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
export default {
    components: { RichText },
    props: {
        visible: Boolean,
        title: String,
        formData: Object
    },
    data() {
        return {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 },
            loading: false,
            image: '',
            confirmLoading:false

        };
    },
    watch: {
        formData(val) {
            this.image = this.formData.image;
        },
    },
    mounted() {
        this.image = this.formData.image;
    },
    methods: {
        moment,
        handleOk() {
            console.log(this.formData, 'dddddd');
            if (this.formData.title === '') {
                this.$message.error("资讯标题必填！");
                return false;
            }
            if (this.formData.image === '') {
              this.$message.error("资讯图片必传！");
              return false;
            }
            if (this.formData.show_type === '2') {
                if (this.formData.start_time === undefined || this.formData.start_time === null) {
                    this.$message.error("显示开始时间必填！");
                    return false;
                }
                if (this.formData.end_time === undefined || this.formData.end_time === null) {
                    this.$message.error("显示结束时间必填！");
                    return false;
                }
            }
            this.confirmLoading = true
            this.request(bankingPlatformApi.editOrAddInformation, this.formData).then((res) => {
                this.$message.success('操作成功!', 1)
                setTimeout(() => {
                    this.image = ''
                    this.formData = {}
                    this.$emit('handleCancel')
                    this.$emit('getDataList',false)
                    this.confirmLoading = false
                },1000)
            })
        },
        handleCancel() {
            this.$emit('handleCancel')
        },
        // 上传图片
        handleUploadChange(info) {
            if (info.file.status === 'uploading') {
                this.loading = true;
                return;
            }
            if (info.file.status === 'done') {
                if (info.file.response.status === 1000) {
                    let imageUrl = info.file.response.data
                    this.$set(this.formData, 'image', imageUrl);
                    getBase64(info.file.originFileObj, imageUrl => {
                        this.image = imageUrl
                        this.loading = false;
                    });
                }
            }
        },
        startTimeChange(value, dateString) {
            this.$set(this.formData, 'start_time', dateString);
        },
        endTimeChange(value, dateString) {
            this.$set(this.formData, 'end_time', dateString);
        },
    },
};
</script>