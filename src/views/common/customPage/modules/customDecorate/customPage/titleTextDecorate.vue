<template>
    <div class="title-text-des">
        <componentDesc :content="desc"></componentDesc>
        <div v-if="formDataDecorate" class="title-text-content">
            <a-form-model
                :model="formDataDecorate"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :labelAlign="'left'"
            >
                <a-form-model-item
                    :label="L('标题内容')"
                    :prop="'title_txt'"
                    :rules="{
                        required: true,
                        message: L('标题和描述不能同时为空'),
                        trigger: '',
                    }"
                >
                    <a-input v-model="formDataDecorate.title_txt" :placeholder="L('请输入标题')"></a-input>
                </a-form-model-item>
                <a-form-model-item :label="L('描述内容')">
                    <a-input
                        v-model="formDataDecorate.desc_txt"
                        :placeholder="L('请输入要说明的文字,最多100字')"
                        type="textarea"
                        :maxLength="100"
                        style="resize: none"
                        autoSize
                    ></a-input>
                </a-form-model-item>
                <a-divider />

                <a-form-model-item :label="L('显示位置')">
                    <div class="flex align-center justify-between">
                        <span>{{ getLabel(showPositionOptions, formDataDecorate.text_align) }}</span>
                        <div>
                            <a-radio-group v-model="formDataDecorate.text_align" button-style="solid">
                                <a-radio-button
                                    v-for="item in showPositionOptions"
                                    :key="item.value"
                                    :value="item.value"
                                >
                                    <IconFont :type="item.icon" class="itemIcon" />
                                </a-radio-button>
                            </a-radio-group>
                        </div>
                    </div>
                </a-form-model-item>

                <a-form-model-item :label="L('标题大小')">
                    <div class="flex align-center justify-between">
                        <span>{{ getLabel(titleSize, formDataDecorate.title_font_size) }}</span>
                        <div>
                            <a-radio-group v-model="formDataDecorate.title_font_size" button-style="solid">
                                <a-radio-button v-for="item in titleSize" :key="item.value" :value="item.value">
                                    <IconFont
                                        :type="item.icon"
                                        class="itemIcon"
                                        :style="{
                                            'font-size': item.value + 'px',
                                        }"
                                    />
                                </a-radio-button>
                            </a-radio-group>
                        </div>
                    </div>
                </a-form-model-item>

                <a-form-model-item :label="L('描述大小')">
                    <div class="flex align-center justify-between">
                        <span>{{ getLabel(describeSize, formDataDecorate.desc_font_size) }}</span>
                        <div>
                            <a-radio-group v-model="formDataDecorate.desc_font_size" button-style="solid">
                                <a-radio-button v-for="item in describeSize" :key="item.value" :value="item.value">
                                    <IconFont
                                        :type="item.icon"
                                        class="itemIcon"
                                        :style="{
                                            'font-size': item.value + 'px',
                                        }"
                                    />
                                </a-radio-button>
                            </a-radio-group>
                        </div>
                    </div>
                </a-form-model-item>

                <a-form-model-item :label="L('标题粗细')">
                    <div class="flex align-center justify-between">
                        <span>{{ getLabel(titleThickness, formDataDecorate.title_font_weight) }}</span>
                        <div>
                            <a-radio-group v-model="formDataDecorate.title_font_weight" button-style="solid">
                                <a-radio-button v-for="item in titleThickness" :key="item.value" :value="item.value">
                                    <IconFont :type="item.icon" class="itemIcon" />
                                </a-radio-button>
                            </a-radio-group>
                        </div>
                    </div>
                </a-form-model-item>

                <a-form-model-item :label="L('描述粗细')">
                    <div class="flex align-center justify-between">
                        <span>{{ getLabel(describeThickness, formDataDecorate.desc_font_weight) }}</span>
                        <div>
                            <a-radio-group v-model="formDataDecorate.desc_font_weight" button-style="solid">
                                <a-radio-button v-for="item in describeThickness" :key="item.value" :value="item.value">
                                    <IconFont :type="item.icon" class="itemIcon" />
                                </a-radio-button>
                            </a-radio-group>
                        </div>
                    </div>
                </a-form-model-item>

                <a-form-model-item :label="L('标题颜色')" class="flex-end">
                    <div class="flex align-center color-picker-wrap">
                        <span class="color-name">{{ formDataDecorate.title_color }}</span>
                        <label
                            for="title_color"
                            class="color-picker-label"
                            :style="[{ background: formDataDecorate.title_color }]"
                        >
                            <input type="color" v-model="formDataDecorate.title_color" id="title_color" />
                        </label>
                        <a-button @click="resetOpt('title_color')" type="link">重置</a-button>
                    </div>
                </a-form-model-item>

                <a-form-model-item :label="L('描述颜色')" class="flex-end">
                    <div class="flex align-center color-picker-wrap">
                        <span class="color-name">{{ formDataDecorate.desc_color }}</span>
                        <label
                            for="describe_color"
                            class="color-picker-label"
                            :style="[{ background: formDataDecorate.desc_color }]"
                        >
                            <input type="color" v-model="formDataDecorate.desc_color" id="describe_color" />
                        </label>
                        <a-button @click="resetOpt('desc_color')" type="link">{{ L('重置') }}</a-button>
                    </div>
                </a-form-model-item>
                <a-form-model-item :label="L('背景颜色')">
                    <a-radio-group v-model="formDataDecorate.bg_color_style">
                        <a-radio v-for="(item, index) in $store.state.customPage.bgColorStyleOptions" :key="index" :value="item.value">{{
                            item.label
                        }}</a-radio>
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item
                    label=""
                    :wrapperCol="{ span: 18, offset: 5 }"
                    v-if="formDataDecorate.bg_color_style == 2"
                >
                    <a-upload
                        :action="$store.state.customPage.uploadAction"
                        accept="image/*"
                        list-type="picture-card"
                        :file-list="bgImageFileList"
                        name="reply_pic"
                        :data="uploadData"
                        @change="handleUploadImg($event, 'bgImageFileList', 'bg_image')"
                    >
                        <a-icon type="plus" />
                        <div class="ant-upload-text">{{ L('上传') }}</div>
                    </a-upload>
                </a-form-model-item>
                <a-form-model-item label="" class="flex-end" v-else>
                    <div class="flex align-center color-picker-wrap">
                        <span class="color-name">{{
                            formDataDecorate.bg_color ? formDataDecorate.bg_color : L('无背景色')
                        }}</span>
                        <label
                            for="bg_color"
                            class="color-picker-label"
                            :style="[{ background: formDataDecorate.bg_color }]"
                        >
                            <input type="color" v-model="formDataDecorate.bg_color" id="bg_color" />
                        </label>
                        <a-button @click="resetOpt('bg_color')" type="link">{{ L('重置') }}</a-button>
                    </div>
                </a-form-model-item>
                <a-form-model-item :label="L('背景透明度')" class="flex-end">
                    <a-row>
                        <a-col :span="18">
                            <a-slider v-model="formDataDecorate.bg_color_opacity" :max="1" :min="0" :step="0.1" />
                        </a-col>
                        <a-col :span="4" :offset="1">
                            <a-input-number v-model="formDataDecorate.bg_color_opacity" :min="0" :max="1" :step="0.1" />
                        </a-col>
                    </a-row>
                </a-form-model-item>

                <a-form-model-item
                    :label="L('底部分割线')"
                    :labelCol="{
                        span: 5,
                    }"
                    :wrapperCol="{
                        span: 19,
                    }"
                >
                    <div class="flex align-center justify-between">
                        <span>{{ formDataDecorate.show_bottom_line == 1 ? L('显示') : L('不显示') }}</span>
                        <a-checkbox
                            :checked="formDataDecorate.show_bottom_line == 1 ? true : false"
                            @change="isShowChange"
                        >
                        </a-checkbox>
                    </div>
                </a-form-model-item>
            </a-form-model>
        </div>
    </div>
</template>

<script>
import componentDesc from '@/views/common/customPage/modules/common/componentDesc'
import IconFont from '@/utils/icon'
export default {
    components: {
        componentDesc,
        IconFont,
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
                title: this.L('标题文本'),
            },
            labelCol: {
                span: 5,
            },
            wrapperCol: {
                span: 19,
            },
            rules: {
                title: { required: true, message: this.L('标题和描述不能同时为空'), trigger: '' },
            },
            formDataDecorate: '',
            // 文本显示位置
            showPositionOptions: [
                {
                    value: 'left',
                    label: this.L('居左显示'),
                    icon: 'iconCustomPageTextLeft',
                },
                {
                    value: 'center',
                    label: this.L('居中显示'),
                    icon: 'iconCustomPageTextCenter',
                },
            ],
            // 标题字体大小
            titleSize: [
                {
                    value: '16',
                    label: this.L('大 (16号)'),
                    icon: 'iconCustomPageFontSize',
                },
                {
                    value: '14',
                    label: this.L('中 (14号)'),
                    icon: 'iconCustomPageFontSize',
                },
                {
                    value: '12',
                    label: this.L('小 (12号)'),
                    icon: 'iconCustomPageFontSize',
                },
            ],
            // 描述文本大小
            describeSize: [
                {
                    value: '16',
                    label: this.L('大 (16号)'),
                    icon: 'iconCustomPageFontSize',
                },
                {
                    value: '14',
                    label: this.L('中 (14号)'),
                    icon: 'iconCustomPageFontSize',
                },
                {
                    value: '12',
                    label: this.L('小 (12号)'),
                    icon: 'iconCustomPageFontSize',
                },
            ],

            // 标题字体粗细
            titleThickness: [
                {
                    value: 'normal',
                    label: this.L('常规体'),
                    icon: 'iconCustomPageFontNormal',
                },
                {
                    value: 'bold',
                    label: this.L('加粗体'),
                    icon: 'iconCustomPageFontBold',
                },
            ],
            // 描述字体粗细
            describeThickness: [
                {
                    value: 'normal',
                    label: this.L('常规体'),
                    icon: 'iconCustomPageFontNormal',
                },
                {
                    value: 'bold',
                    label: this.L('加粗体'),
                    icon: 'iconCustomPageFontBold',
                },
            ],
            // 标题颜色
            title_color: '#323233',
            // 描述文本颜色
            desc_color: '#969799',
            // 标题文本背景颜色 默认空 无背景色即透明色
            bg_color: '',
            bgImageFileList: [],
        }
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
    watch: {
        formContent: {
            deep: true,
            handler(newVal, oldVal) {
                if (newVal) {
                    this.initFormDecorate(newVal)
                } else {
                    this.formDataDecorate = ''
                }
            },
        },
        formDataDecorate: {
            deep: true,
            handler(val) {
                this.$emit('updatePageInfo', val)
            },
        },
    },
    mounted() {
        if (this.formContent) {
            this.initFormDecorate(this.formContent)
        }
    },
    methods: {
        initFormDecorate(formContent = '') {
            if (!formContent) {
                this.formDataDecorate = ''
                return
            }
            this.formDataDecorate = {}
            for (let k in formContent) {
                this.$set(this.formDataDecorate, k, formContent[k])
            }
            if (!this.formDataDecorate.bg_color_style) {
                this.$set(this.formDataDecorate, 'bg_color_style', 1)
            } else {
                if (this.formDataDecorate.bg_color_style == 2 && this.formDataDecorate.bg_image) {
                    this.bgImageFileList = [
                        {
                            uid: 'bg_image',
                            status: 'done',
                            url: this.formDataDecorate.bg_image,
                            name: this.formDataDecorate.bg_image,
                        },
                    ]
                }
            }
        },
        // 获取label
        getLabel(list = [], value = '') {
            let label = ''
            if (list.length) {
                list.forEach((item) => {
                    if (item.value == value) {
                        label = item.label
                    }
                })
            }
            return label
        },
        // 重置
        resetOpt(filed) {
            this.$set(this.formDataDecorate, filed, this[filed])
        },
        // 隐藏底部分割线 change 1 显示 2 隐藏
        isShowChange(e) {
            this.$set(this.formDataDecorate, 'show_bottom_line', e.target.checked ? 1 : 2)
        },
        // 上传图片
        handleUploadImg(info = '', filedList = '', fieldForm = '') {
            let fileList = info && info.fileList ? [...info.fileList] : []
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
                this.$set(this.formDataDecorate, fieldForm, imgs[0])
                this[filedList] = fileList
            } else {
                this.$set(this.formDataDecorate, fieldForm, '')
                this[filedList] = []
            }
        },
    },
}
</script>

<style scoped>
.title-text-des .title-text-content {
    padding: 24px;
    width: 100%;
    box-sizing: border-box;
}
.title-text-des .remind-txt {
    color: #f5222d;
    min-height: 16px;
    font-size: 13px;
    line-height: 16px;
    margin-top: 6px;
}
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
</style>
