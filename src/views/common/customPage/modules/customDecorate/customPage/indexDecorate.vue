<template>
    <!--  微页面主页装修 -->
    <div class="bg-ff custom-page-index-decorate" v-if="formData">
        <a-form-model
            :model="formData"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :rules="rules"
            :labelAlign="'left'"
        >
            <a-card :title="L('页面设置')" :bordered="false">
                <a-form-model-item :label="L('页面名称')" prop="page_title">
                    <a-input v-model="formData.page_title"></a-input>
                </a-form-model-item>
                <a-form-model-item :label="L('背景颜色')">
                    <a-radio-group v-model="formData.bg_color_style">
                        <a-radio
                            v-for="(item, index) in $store.state.customPage.bgColorStyleOptions"
                            :key="index"
                            :value="item.value"
                            >{{ item.label }}</a-radio
                        >
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item label="" v-if="formData.bg_color_style == 1" class="flex-end">
                    <div class="flex align-center color-picker-wrap">
                        <span class="color-name">{{ formData.bg_color }}</span>
                        <label for="bg_color" class="color-picker-label" :style="[{ background: formData.bg_color }]">
                            <input type="color" v-model="formData.bg_color" id="bg_color" />
                        </label>

                        <a-button @click="resetOpt('bg_color')" type="link"> {{ L('重置') }}</a-button>
                    </div>
                </a-form-model-item>
                <a-form-model-item label="" v-if="formData.bg_color_style == 2" class="flex-end">
                    <a-upload
                        :action="$store.state.customPage.uploadAction"
                        accept="image/*"
                        list-type="picture-card"
                        :file-list="bgImageFileList"
                        name="reply_pic"
                        :data="uploadData"
                        @change="handleUploadImg($event, 'bgImageFileList', 'bg_image', true)"
                    >
                        <a-icon type="plus" />
                        <div class="ant-upload-text">{{ L('上传') }}</div>
                    </a-upload>
                </a-form-model-item>
                <a-form-model-item :label="L('导航栏背景色')">
                    <a-radio-group v-model="formData.bg_color_nav_style">
                        <a-radio
                            v-for="(item, index) in $store.state.customPage.bgColorStyleOptions"
                            :key="index"
                            :value="item.value"
                            >{{ item.label }}</a-radio
                        >
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item label="" v-if="formData.bg_color_nav_style == 1" class="flex-end">
                    <div class="flex align-center color-picker-wrap">
                        <span class="color-name">{{ formData.bg_color_nav }}</span>
                        <label
                            for="bg_color_nav"
                            class="color-picker-label"
                            :style="[{ background: formData.bg_color_nav }]"
                        >
                            <input type="color" v-model="formData.bg_color_nav" id="bg_color_nav" />
                        </label>

                        <a-button @click="resetOpt('bg_color_nav')" type="link"> {{ L('重置') }}</a-button>
                    </div>
                </a-form-model-item>
                <a-form-model-item label="" v-if="formData.bg_color_nav_style == 2" class="flex-end">
                    <a-upload
                        :action="$store.state.customPage.uploadAction"
                        accept="image/*"
                        list-type="picture-card"
                        :file-list="bgImageNavFileList"
                        name="reply_pic"
                        :data="uploadData"
                        @change="handleUploadImg($event, 'bgImageNavFileList', 'bg_image_nav')"
                    >
                        <a-icon type="plus" />
                        <div class="ant-upload-text">{{ L('上传') }}</div>
                    </a-upload>
                </a-form-model-item>
                <a-form-model-item :label="L('导航栏透明度')" class="flex-end">
                    <a-row>
                        <a-col :span="18">
                            <a-slider v-model="formData.bg_color_nav_opacity" :max="1" :min="0" :step="0.1" />
                        </a-col>
                        <a-col :span="4" :offset="1">
                            <a-input-number v-model="formData.bg_color_nav_opacity" :min="0" :max="1" :step="0.1" />
                        </a-col>
                    </a-row>
                </a-form-model-item>
                <a-form-model-item :label="L('页面标题颜色')">
                    <a-radio-group v-model="formData.title_color">
                        <a-radio v-for="(item, index) in fontColorOptions" :key="index" :value="item.value">{{
                            item.label
                        }}</a-radio>
                    </a-radio-group>
                </a-form-model-item> 
                <a-form-model-item :label="L('底部导航')" v-if="sourceInfo.source != 'appoint_activity' && sourceInfo.source != 'platform'">
                    <div class="flex justify-between align-center">
                        <span>{{
                            formData.nav_bottom_display && formData.nav_bottom_display == '1' ? L('显示') : L('隐藏')
                        }}</span>
                        <a-checkbox
                            @change="navBottomDisplayChange"
                            :checked="formData.nav_bottom_display && formData.nav_bottom_display == '1' ? true : false"
                        >
                        </a-checkbox>
                    </div>
                </a-form-model-item>
            </a-card>
            <a-card :title="L('分享设置')" :bordered="false">
                <a-form-model-item :label="L('分享标题')">
                    <a-input v-model="formData.share_title" :placeholder="L('请输入分享标题')"></a-input>
                </a-form-model-item>
                <a-form-model-item :label="L('分享描述')">
                    <a-textarea
                        style="height: 200px; overflow-y: auto; resize: none"
                        v-model="formData.share_desc"
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
                                    :src="formData.share_image_wechat"
                                    v-if="formData.share_image_wechat"
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
                            {{ L('建议图片长度宽比5:4，如不设置，自动截取页面首屏') }}
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
                                    :src="formData.share_image_h5"
                                    v-if="formData.share_image_h5"
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
                            {{ L('建议图片长度宽比1:1，如不设置，自动获取logo图') }}
                        </div>
                    </div>
                </a-form-model-item>
            </a-card>
        </a-form-model>
    </div>
</template>

<script>
export default {
    data() {
        return {
            formData: '',
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
            fontColorOptions: [
                {
                    label: this.L('黑色'),
                    value: '#000000',
                },
                {
                    label: this.L('白色'),
                    value: '#ffffff',
                },
            ],
            rules: {
                page_title: { required: true, message: this.L('页面名称必填'), trigger: 'blur' },
            },
            bg_color: '#f9f9f9', // 默认背景颜色
            bg_color_nav: '#ffffff', // 默认导航颜色
            bgImageFileList: [], // 页面背景
            bgImageNavFileList: [], // 导航背景
        }
    },
    computed: {
        // 组件id
        componentId() {
            return this.$store.state.customPage.componentId
        },
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
        pageInfo() {
            return this.$store.state.customPage.pageInfo
        },
    },
    watch: {
        formData: {
            deep: true,
            handler(val) {
                if (val) {
                    this.updatePageInfo()
                }
            },
        },
        pageInfo: {
            immediate: true,
            handler(val) {
                if (!this.formData) {
                    this.getEditMicoPageOpt(val)
                }
            },
        },
    },
    mounted() {
        if (this.formData) {
            let val = this.formData
            if (val.bg_image && val.bg_image.length) {
                this.bgImageFileList = val.bg_image.map((item, index) => {
                    return {
                        uid: 'bg_image_' + index,
                        status: 'done',
                        url: item,
                        name: item,
                    }
                })
            }
            if (val.bg_image_nav) {
                this.bgImageNavFileList = [
                    {
                        uid: 'bg_image_nav',
                        status: 'done',
                        url: val.bg_image_nav,
                        name: val.bg_image_nav,
                    },
                ]
            }
        }
    },
    methods: {
        // 更新页面信息
        updatePageInfo() {
            this.$store.dispatch('updatePageInfo', this.formData)
        },
        // 获取微页面装修信息
        getEditMicoPageOpt(val = '') {
            let pageInfo = val ? JSON.stringify(val) : JSON.stringify(this.pageInfo) || ''
            this.formData = pageInfo ? JSON.parse(pageInfo) : this.formData
        },
        // 重置
        resetOpt(filed) {
            this.$set(this.formData, filed, this[filed])
        },
        // 底部导航显隐
        navBottomDisplayChange(e) {
            this.$set(this.formData, 'nav_bottom_display', e.target.checked)
        },
        // 上传图片
        handleUploadChange(info, filed) {
            let fileList = [...info.fileList]
            fileList = fileList.slice(-1)
            fileList = fileList.map((file) => {
                if (file.status === 'done' && file.response.status == '1000') {
                    let imageUrl = file.response.data
                    this.$set(this.formData, filed, imageUrl)
                    console.log(this.formData, 'this.formData')
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
        // 上传图片
        handleUploadImg(info = '', filedList = '', fieldForm = '', multiple = false) {
            let fileList = info && info.fileList ? [...info.fileList] : []
            if (multiple) {
                this[filedList] = fileList
                let imgs = []
                fileList.forEach((file) => {
                    if (file.response && file.status == 'done' && file.response.status == 1000) {
                        let url = file.response.data
                        imgs.push(url)
                    } else {
                        if(file.status == 'done') {
                            imgs.push(file.url)
                        }
                    }
                })
                this.$set(this.formData, fieldForm, imgs)
            } else {
                if (fileList.length) {
                    fileList = fileList.splice(-1)
                    let imgs = []
                    fileList = fileList.map((file) => {
                        if (file.response && file.status == 'done' && file.response.status == 1000) {
                            let url = file.response.data
                            imgs.push(url)
                        }
                        return file
                    })
                    this.$set(this.formData, fieldForm, imgs[0])
                    this[filedList] = fileList
                } else {
                    this.$set(this.formData, fieldForm, '')
                    this[filedList] = []
                }
            }
        },
    },
}
</script>

<style scoped>
.color-picker-wrap {
    justify-content: flex-end;
}
.color-picker-label {
    width: 80px;
    height: 30px;
    border: 1px solid #666666;
}
.color-picker-label input[type='color'] {
    opacity: 0;
}
.color-name {
    height: 30px;
    line-height: 30px;
    min-width: 60px;
    text-align: left;
    margin-right: 20px;
    vertical-align: middle;
    font-size: 14px;
    font-weight: bold;
}
.custom-page-index-decorate >>> .flex-end.ant-form-item.ant-row {
    display: flex;
    justify-content: flex-end;
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
.custom-page-index-decorate >>> .ant-card-head-title {
    font-weight: bold;
}
</style>
