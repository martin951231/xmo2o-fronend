<template>
    <div>
        <componentDesc :content="desc"></componentDesc>
        <div v-if="formDataDecorate" class="rich-text-content">
            <a-form-model
                :model="formDataDecorate"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :labelAlign="'left'"
            >
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
                        <span class="color-name">{{ formDataDecorate.bg_color }}</span>
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
                    :label="L('是否全屏显示')"
                    :labelCol="{
                        span: 6,
                    }"
                    :wrapperCol="{
                        span: 18,
                    }"
                >
                    <div class="flex align-center justify-between">
                        <span>{{ formDataDecorate.show_full_screen == 'full' ? L('全屏显示') : L('不全屏显示') }}</span>
                        <a-checkbox
                            :checked="formDataDecorate.show_full_screen == 'full' ? true : false"
                            @change="isShowChange"
                            style="padding: 0 15px"
                        >
                        </a-checkbox>
                    </div>
                </a-form-model-item>
            </a-form-model>
            <custom-rich-text
                :info.sync="formDataDecorate.richTextCode"
                :height="600"
                :autoHeight="true"
                ref="richText"
            />
        </div>
    </div>
</template>

<script>
import componentDesc from '@/views/common/customPage/modules/common/componentDesc'
import IconFont from '@/utils/icon'
import CustomRichText from '@/components/RichText/RichText'

export default {
    components: {
        componentDesc,
        IconFont,
        CustomRichText,
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
                title: '富文本',
                desc: '小程序富文本展示以实际效果为准，左侧预览仅供参考',
            },
            formDataDecorate: '',
            labelCol: {
                span: 5,
            },
            wrapperCol: {
                span: 18,
            },
            // 富文本默认背景颜色
            bg_color: '#ffffff',
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
        this.$nextTick(() => {
            if (this.$refs.richText) {
                if (this.$refs.richText.myConfig) {
                    let toolbars = [
                        [
                            // 'anchor', //锚点
                            'undo', //撤销
                            'redo', //重做
                            'bold', //加粗
                            'italic', //斜体
                            'underline', //下划线
                            'strikethrough', //删除线
                            'indent', //首行缩进
                            // 'snapscreen', //截图
                            'subscript', //下标
                            'fontborder', //字符边框
                            'superscript', //上标
                            'formatmatch', //格式刷
                            'source', //源代码
                            'blockquote', //引用
                            'pasteplain', //纯文本粘贴模式
                            'selectall', //全选
                            'print', //打印
                            'preview', //预览
                            'horizontal', //分隔线
                            'removeformat', //清除格式
                            'time', //时间
                            'date', //日期
                            'unlink', //取消链接
                            'insertrow', //前插入行
                            'insertcol', //前插入列
                            'mergeright', //右合并单元格
                            'mergedown', //下合并单元格
                            'deleterow', //删除行
                            'deletecol', //删除列
                            'splittorows', //拆分成行
                            'splittocols', //拆分成列
                            'splittocells', //完全拆分单元格
                            'deletecaption', //删除表格标题
                            'inserttitle', //插入标题
                            'mergecells', //合并多个单元格
                            'deletetable', //删除表格
                            'cleardoc', //清空文档
                            'insertparagraphbeforetable', //"表格前插入行"
                            // 'insertcode', //代码语言
                            'fontfamily', //字体
                            'fontsize', //字号
                            'paragraph', //段落格式
                            'simpleupload', //单图上传
                            'insertimage', //多图上传
                            'edittable', //表格属性
                            'edittd', //单元格属性
                            'link', //超链接
                            'emotion', //表情
                            'spechars', //特殊字符
                            'searchreplace', //查询替换
                            // 'map', //Baidu地图
                            // 'gmap', //Google地图
                            'insertvideo', //视频
                            'help', //帮助
                            'justifyleft', //居左对齐
                            'justifyright', //居右对齐
                            'justifycenter', //居中对齐
                            'justifyjustify', //两端对齐
                            'forecolor', //字体颜色
                            'backcolor', //背景色
                            'insertorderedlist', //有序列表
                            'insertunorderedlist', //无序列表
                            'fullscreen', //全屏
                            'directionalityltr', //从左向右输入
                            'directionalityrtl', //从右向左输入
                            'rowspacingtop', //段前距
                            'rowspacingbottom', //段后距
                            'pagebreak', //分页
                            // 'insertframe', //插入Iframe
                            'imagenone', //默认
                            'imageleft', //左浮动
                            'imageright', //右浮动
                            // 'attachment', //附件
                            'imagecenter', //居中
                            // 'wordimage', //图片转存
                            'lineheight', //行间距
                            'edittip ', //编辑提示
                            'customstyle', //自定义标题
                            'autotypeset', //自动排版
                            // 'webapp', //百度应用
                            'touppercase', //字母大写
                            'tolowercase', //字母小写
                            // 'background', //背景
                            // 'template', //模板
                            // 'scrawl', //涂鸦
                            // 'music', //音乐
                            'inserttable', //插入表格
                            // 'drafts', // 从草稿箱加载
                            // 'charts', // 图表
                        ],
                    ]
                    this.$set(this.$refs.richText.myConfig, 'toolbars', toolbars)
                }
            }
        })
    },
    methods: {
        initFormDecorate(formContent = '') {
            if(!formContent) {
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
        // 重置
        resetOpt(filed) {
            this.$set(this.formDataDecorate, filed, this[filed])
        },
        // 是否全屏显示  full 全屏 unfull 不全屏
        isShowChange(e) {
            this.$set(this.formDataDecorate, 'show_full_screen', e.target.checked ? 'full' : 'unfull')
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
.rich-text-content {
    padding: 24px;
    width: 100%;
    min-height: 500px;
    box-sizing: border-box;
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
