<template>
    <div>
        <!-- 组件描述 -->
        <componentDesc :content="desc"></componentDesc>

        <div v-if="formDataDecorate">
            <a-form-model
                :model="formDataDecorate"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :labelAlign="'left'"
            >
                <div class="content">
                    <a-form-model-item
                        :label="L('页面标题')"
                        :rules="{
                            required: true,
                            message: L('页面标题必填'),
                            trigger: 'change',
                        }"
                    >
                        <a-input v-model="formDataDecorate.page_title" :maxLength="4"></a-input>
                    </a-form-model-item>
                    <a-form-model-item :label="L('头部背景色')">
                        <div class="flex align-center color-picker-wrap">
                            <label
                                for="bg_color"
                                class="color-picker-label"
                                :style="[{ background: formDataDecorate.bg_color }]"
                            >
                                <input type="color" v-model="formDataDecorate.bg_color" id="bg_color" />
                            </label>
                            <span class="color-name">
                                {{ formDataDecorate.bg_color }}
                            </span>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item :label="L('主标题颜色')">
                        <div class="flex align-center color-picker-wrap">
                            <label
                                for="page_title_color"
                                class="color-picker-label"
                                :style="[{ background: formDataDecorate.page_title_color }]"
                            >
                                <input type="color" v-model="formDataDecorate.page_title_color" id="page_title_color" />
                            </label>
                            <span class="color-name">
                                {{ formDataDecorate.page_title_color }}
                            </span>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item :label="L('分类主色调')">
                        <div class="flex align-center color-picker-wrap">
                            <label
                                for="main_color"
                                class="color-picker-label"
                                :style="[{ background: formDataDecorate.main_color }]"
                            >
                                <input type="color" v-model="formDataDecorate.main_color" id="main_color" />
                            </label>
                            <span class="color-name">
                                {{ formDataDecorate.main_color }}
                            </span>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item :label="L('头部悬浮')">
                        <div class="flex align-center justify-between">
                            <span>{{ L('勾选后头部模块不占位') }}</span>
                            <a-checkbox
                                :checked="formDataDecorate.is_fixed == 1 ? true : false"
                                @change="isFixedChange"
                            >
                            </a-checkbox>
                        </div>
                    </a-form-model-item>
                </div>
                <a-divider />
                <div class="content">
                    <p class="fw-bold cr-black">{{ L('分享设置') }}</p>
                    <a-form-model-item :label="L('分享标题')">
                        <a-input v-model="formDataDecorate.share_title" :placeholder="L('请输入分享标题')"></a-input>
                    </a-form-model-item>
                    <a-form-model-item :label="L('分享描述')">
                        <a-textarea
                            style="height: 200px; overflow-y: auto; resize: none"
                            v-model="formDataDecorate.share_desc"
                            :placeholder="L('请输入分享描述')"
                            autoSize
                        />
                    </a-form-model-item>
                    <a-form-model-item :label="L('分享图片')">
                        <div>
                            <a-upload
                                name="reply_pic"
                                :action="$store.state.customPage.uploadAction"
                                :showUploadList="false"
                                :data="uploadData"
                                @change="handleUploadChange($event, 'share_image_wechat')"
                            >
                                <div class="upload-wrap upload-wrap-wechat pointer flex align-center justify-center">
                                    <img
                                        :src="formDataDecorate.share_image_wechat"
                                        v-if="formDataDecorate.share_image_wechat"
                                        alt=""
                                        style="width: 100%; height: 100%"
                                    />
                                    <div v-else class="flex flex-column justify-center align-center">
                                        <a-icon type="plus" />
                                        <span class="mt-20">{{ L('添加分享图片') }}</span>
                                    </div>
                                </div>
                            </a-upload>
                            <div class="mt-10">{{ L('小程序') }}</div>
                            <div class="ant-form-explain">
                                {{ L('建议图片长宽比5:4，如不设置，自动截取页面首屏') }}
                            </div>
                        </div>
                        <div class="mt-20">
                            <a-upload
                                name="reply_pic"
                                :action="$store.state.customPage.uploadAction"
                                :showUploadList="false"
                                :data="uploadData"
                                @change="handleUploadChange($event, 'share_image_h5')"
                            >
                                <div class="upload-wrap upload-wrap-h5 pointer flex align-center justify-center">
                                    <img
                                        :src="formDataDecorate.share_image_h5"
                                        v-if="formDataDecorate.share_image_h5"
                                        alt=""
                                        style="width: 100%; height: 100%"
                                    />
                                    <div v-else class="flex flex-column justify-center align-center">
                                        <a-icon type="plus" />
                                        <span class="mt-20">{{ L('添加分享图片') }}</span>
                                    </div>
                                </div>
                            </a-upload>
                            <div class="mt-10">h5</div>
                            <div class="ant-form-explain">
                                {{ L('建议图片长宽比1:1，如不设置，自动截取页面首屏') }}
                            </div>
                        </div>
                    </a-form-model-item>
                </div>
            </a-form-model>
        </div>
    </div>
</template>

<script>
import componentDesc from '@/views/common/customPage/modules/common/componentDesc'
export default {
    components: {
        componentDesc,
    },
    props: {
        // 表单数据
        formContent: {
            type: [String, Object],
            default: '',
        },
    },
    data() {
        return {
            desc: {
                title: '头部配置',
                desc: '分类头部配置为固定模块',
            },
            labelCol: { span: 5 },
            wrapperCol: { span: 18 },
            formDataDecorate: '',
        }
    },
    watch: {
        formDataDecorate: {
            deep: true,
            handler(val) {
                this.$emit('updatePageInfo', val)
                this.$store.dispatch('updatePageMainColor', this.formDataDecorate.main_color)
            },
        },
    },
    computed: {
        // 来源source source_id
        sourceInfo() {
            return this.$store.state.customPage.sourceInfo
        },
        // 图片上传参数
        uploadData() {
            return {
                upload_dir: '/decorate/images',
                source: this.sourceInfo.source,
                source_id: this.sourceInfo.source_id,
                is_decorate: 1,
            }
        },
    },
    mounted() {
        if (this.formContent) {
            this.formDataDecorate = {}
            for (let k in this.formContent) {
                if (k == 'page_title' && this.formContent[k] && this.formContent[k].length > 4) {
                    this.formContent[k] = this.formContent[k].substring(0, 4)
                }
                this.$set(this.formDataDecorate, k, this.formContent[k])
            }
        }
    },
    methods: {
        isFixedChange(e) {
            this.$set(this.formDataDecorate, 'is_fixed', e.target.checked ? '1' : '2')
        },
        // 上传图片
        handleUploadChange(info, filed) {
            let fileList = [...info.fileList]
            fileList = fileList.slice(-1)
            fileList = fileList.map((file) => {
                if (file.status === 'done' && file.response.status == '1000') {
                    let imageUrl = file.response.data
                    this.$set(this.formDataDecorate, filed, imageUrl)
                }
                return file
            })

            if (info.file.status === 'done') {
                // console.log('done')
            } else if (info.file.status === 'error') {
                // console.log('error')
                this.$message.error(this.L('X1上传失败。', { X1: info.file.name }))
            }
        },
    },
}
</script>

<style scoped>
.content {
    padding: 24px;
    width: 100%;
    box-sizing: border-box;
}
.color-picker-wrap {
    justify-content: flex-end;
}
.color-picker-label {
    width: 80px;
    height: 30px;
    border: 1px solid #666666;
    margin-right: 20px;
}
.color-picker-label input[type='color'] {
    opacity: 0;
}
.color-name {
    height: 30px;
    line-height: 30px;
    min-width: 60px;
    text-align: left;
    vertical-align: middle;
    font-size: 14px;
    font-weight: bold;
}
.upload-wrap {
    width: 200px;
    border: 1px dashed #e7e7e7;
    background: #fafafa;
    overflow: hidden;
}
.upload-wrap-wechat {
    height: 160px;
}
.upload-wrap-h5 {
    height: 200px;
}
.ant-divider-horizontal {
    margin: 0;
}
</style>