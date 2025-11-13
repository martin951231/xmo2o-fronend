<template>
    <div class="customDraggableForm flex">
        <!-- 左侧组件导航栏 -->
        <div class="left-box">
            <div class="left-box-item" v-for="item in leftComponentList" :key="item.id" :style="{'--hoverBgColor':item.hoverBgColor}">
                <div class="item-title">{{item.title}}</div>
                <div class="item-content">
                    <draggable
                        v-model="item.children"
                        :sort="false"
                        @start="draggableComponentStart"
                        @end="draggableComponentEnd"
                        :group="{ name: 'form', pull: 'clone', put: false }"
                        :clone="cloneRule"
                        style="display: grid;grid-template-columns: repeat(2, 1fr);gap: 10px 5px;"
                    >
                        <div class="item-child" :title="child.title" :style="{backgroundColor: item.btnBgColor}" v-for="child in item.children" :key="child.id">
                            <div class="item-icon">
                                <IconFont :type="child.icon" :style="{color: item.iconColor}" />
                            </div>
                            <div class="item-name">{{child.title}}</div>
                        </div>
                    </draggable>
                </div>
            </div>
        </div>
        <!-- 中间内容 -->
        <div class="center-box flex-1">
            <div style="max-width: 850px;margin: 10px auto 0 auto" v-if="formData.status == 1 || formData.status == 3">
                <a-alert :message="L('当前问卷已发布，不支持编辑，在页面中新增组件和修改文字不生效')" banner />
            </div>
            <div class="form-box rounded">
                <!-- 表头区域 -->
                <div class="form-header cursor-pointer" @click="formHeaderClick" :class="selectFormDataIndex == -1 ? 'rounded rounded-b-0 main-border' : ''">
                    <div class="form-header-image" :style="{padding: formData.formHeaderImage ? '0' : '16px 0'}">
                        <a-spin :spinning="loading" :tip="loadingTip">
                            <a-upload
                                action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                                accept="image/*"
                                name="reply_pic"
                                :data="{ upload_dir: 'questionnaireSurvey/images' }"
                                :showUploadList="false"
                                :before-upload="beforeUpload"
                                @change="handleUploadImg($event, 'formData', 'formHeaderImage',false)"
                            >
                                <div class="form-header-image-content" v-if="formData.formHeaderImage">
                                    <img class="rounded rounded-b-0" :src="formData.formHeaderImage" />
                                    <div class="mask rounded rounded-b-0 flex justify-center align-center" :style="{opacity: selectFormDataIndex == -1?1:0}">
                                        <a-icon type="camera" :style="{fontSize: '32px',color: '#fff'}" class="camera" />
                                        <div class="delete-header-image rounded" @click.stop="deleteHeaderImage">
                                            <a-icon type="delete" :style="{fontSize: '16px'}" />
                                        </div>
                                    </div>
                                </div>
                                <div v-else>
                                    <a-icon type="camera" :style="{fontSize: '32px'}" class="camera" />
                                </div>
                            </a-upload>
                        </a-spin>
                        <div v-if="!formData.formHeaderImage" style="margin-top: 8px; color: #333">{{L('表头图片建议尺寸 686 x 228')}}</div>
                    </div>
                    <div class="form-header-title">
                        <a-input :maxLength="100" size="large" :placeholder="L('请输入标题')" v-model="formData.title" class="text-center formTitle form-input" />
                        <a-textarea autosize :placeholder="L(`这里可以输入表单描述。\n如：感谢您抽出几分钟时间填写以下内容，我们现在马上开始吧！`)" v-model="formData.description" class="formDesc form-input" />
                    </div>
                </div>

                <!-- 自定义表单区域 -->
                <div class="custom-form-box">
                    <template v-if="!formData.questions.length">
                        <div class="flex justify-center align-center rounded main-border" style="border-color: #1890ff !important;position: absolute;width: 100%;height: 100px;">
                            <div style="color: #1890ff">{{L('从左侧拖拽组件到此处')}}</div>
                        </div>
                    </template>
                    <draggable v-model="formData.questions" group="form" @change="changeCustomForm" style="min-height: 100px;">
                        <!-- 动态渲染不同组件 -->
                        <component
                            :ref="`${item.type}Component`"
                            v-for="(item,index) in formData.questions"
                            @componentCallBack="componentCallBack"
                            :key="item.id"
                            :is="`${item.type}Component`"
                            :content="item"
                            :index="index"
                            :isSelect="selectFormDataIndex===index?true:false"
                            :no="item.no"
                        >
                            <template v-slot:footerActions>
                                <!-- 这里的内容会被渲染到子组件的footer插槽中 -->
                                <div class="flex justify-between align-center footer-actions" v-if="selectFormDataIndex===index" @click.stop>
                                    <div class="left flex justify-between align-center">
                                        <template v-if="item.type == 'radio' || item.type == 'checkbox' || item.type == 'select' || item.type == 'image' || item.type == 'file'">
                                            <template v-if="item.type == 'radio' || item.type == 'checkbox' || item.type == 'select'">
                                                <div class="item cursor-pointer add" @click.stop="footerActionsClick(null,item,index,'option')">
                                                    <a-icon type="plus" />
                                                    {{L('添加选项')}}
                                                </div>
                                                <a-divider type="vertical" />
                                                <a-checkbox :checked="item.extra_config.is_other?true:false" @change="footerActionsClick($event,item,index,'is_other')">{{L('显示其他')}}</a-checkbox>
                                            </template>
                                            <template v-if="item.type == 'image' || item.type == 'file'">
                                                <div class="item">
                                                    <span class="mr-10">{{L('上传数量')}}</span>
                                                    <a-input-number style="width: 120px" v-model="item.extra_config.max_count" :min="1" :max="10" />
                                                </div>
                                            </template>
                                        </template>
                                    </div>
                                    <div class="right">
                                        <a-checkbox :checked="item.required?true:false" @change="footerActionsClick($event,item,index,'required')">{{L('必填')}}</a-checkbox>
                                    </div>
                                </div>
                            </template>
                            <template v-slot:rightActions>
                                <div class="drag-handle-icon"></div>
                                <div class="rightActions">
                                    <a-tooltip placement="left">
                                        <template slot="title">
                                            <span>{{L('复制')}}</span>
                                        </template>
                                        <div class="item" @click.stop="componentCallBack('copy',item,index)">
                                            <a-icon type="copy" />
                                        </div>
                                    </a-tooltip>
                                    <a-tooltip placement="left">
                                        <template slot="title">
                                            <span>{{L('删除')}}</span>
                                        </template>
                                        <div class="item" @click.stop="componentCallBack('delete',item,index)">
                                            <a-icon type="delete" />
                                        </div>
                                    </a-tooltip>
                                </div>
                            </template>
                        </component>
                    </draggable>
                    <!-- 页脚富文本 -->
                    <div class="footer" style="margin-top: 60px" v-if="formData.status != 1 && formData.status != 3">
                        <div class="text-center mb-10">{{L('底部内容')}}</div>
                        <rich-text :info.sync="formData.footerContent" />
                    </div>
                    <!-- 页脚富文本 -->
                    <div v-else-if="formData.footerContent" class="footer" style="margin-top: 60px;padding: 0 20px">
                        <div class="text-center mb-10">{{L('底部内容')}}</div>
                        <div v-html="formData.footerContent" class="footerContent"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 预览表单 -->
        <a-drawer :visible="viewComponentVisible" width="600px" :title="('预览')" wrapClassName="wrapClassName" destroyOnClose @close="viewComponentVisible=false">
            <div class="center-box">
                <div class="form-box rounded" style="max-width: 100%;">
                    <!-- 表头区域 -->
                    <div class="form-header cursor-pointer">
                        <div class="form-header-image" style="border: none;padding-top: 0" v-if="formData.formHeaderImage">
                            <div class="form-header-image-content" style="width: 100%">
                                <img class="rounded rounded-b-0" :src="formData.formHeaderImage" />
                            </div>
                        </div>
                        <div class="form-header-title">
                            <h2 class="mt-20">{{formData.title}}</h2>
                            <p style="text-align: left">{{formData.description}}</p>
                        </div>
                    </div>

                    <!-- 自定义表单区域 -->
                    <div class="custom-form-box">
                        <!-- 动态渲染不同组件 -->
                        <component
                            :ref="`${item.type}Component`"
                            v-for="(item,index) in formData.questions"
                            :key="item.id"
                            :is="`${item.type}Component`"
                            :content="item"
                            :index="index"
                            :no="item.no"
                            :disabled="false"
                        ></component>
                    </div>

                    <!-- 页脚富文本 -->
                    <div class="footer" style="margin-top: 60px;padding: 0 20px" v-if="formData.footerContent">
                        <div v-html="formData.footerContent" class="footerContent"></div>
                    </div>

                    <div class="submit">
                        <a-button type="primary" style="width:80px;">{{L('提交')}}</a-button>
                    </div>
                </div>
            </div>
        </a-drawer>
    </div>
</template>

<script>
import { imgUploadHandle } from '@/utils/util.js'
import { v4 as uuidv4 } from 'uuid' // 使用 uuidv4 的导入方式
import IconFont from '@/utils/icon'
import draggable from 'vuedraggable'
import { cloneDeep } from 'lodash'
import TitleComponent from './TitleComponent'
import RadioComponent from './RadioComponent'
import CheckboxComponent from './CheckboxComponent'
import TextareaComponent from './TextareaComponent'
import SelectComponent from './SelectComponent'
import ImageComponent from './ImageComponent'
import RatingComponent from './RatingComponent'
import NameComponent from './NameComponent'
import PhoneComponent from './PhoneComponent'
import SexComponent from './SexComponent'
import AreaAddressComponent from './AreaAddressComponent'
import RichText from '@/components/RichText/RichText2'
export default {
    components: {
        IconFont,
        draggable,
        TitleComponent,
        RadioComponent,
        CheckboxComponent,
        TextareaComponent,
        SelectComponent,
        ImageComponent,
        RatingComponent,
        NameComponent,
        PhoneComponent,
        SexComponent,
        AreaAddressComponent,
        RichText,
    },
    data() {
        return {
            // id: 唯一标识
            // title: 标题名称
            // name: 名称
            // type: 类型
            // max_count: 最多上传几个文件
            // required: 是否必填
            // question_options: 单选/多选选项
            // placeholder: 占位符
            // value: 表单值
            // is_other: 是否显示其他
            // is_other_name: 其他名称
            // is_other_value: 其他值
            // allow_format: 允许上传的文件格式
            // style: 样式
            leftComponentList: [
                {
                    id: 1,
                    title: this.L('基础'),
                    iconColor: '#0c54fe',
                    btnBgColor: '#ebf3ff',
                    hoverBgColor: 'rgba(0,45,113,0.125)',
                    children: [
                        // {
                        //     id: uuidv4(),
                        //     title: this.L('标题'),
                        //     type: 'title',
                        //     required: false,
                        //     value: this.L('标题'),
                        //     style: {
                        //         fontSize: 12,
                        //         color: '#000000',
                        //     },
                        //     icon: 'iconH1',
                        //     placeholder: this.L('请输入标题'),
                        // },
                        {
                            id: uuidv4(),
                            title: this.L('单选'),
                            type: 'radio',
                            required: false,
                            question_options: [
                                {
                                    value: uuidv4(),
                                    label: this.L('选项1'),
                                },
                                {
                                    value: uuidv4(),
                                    label: this.L('选项2'),
                                },
                                {
                                    value: uuidv4(),
                                    label: this.L('选项3'),
                                },
                            ],
                            placeholder: this.L('请选择'),
                            value: '',
                            extra_config: {
                                is_other: false,
                                is_other_name: this.L('其他'),
                                is_other_value: '',
                            },
                            icon: 'iconRadioChecked',
                        },
                        {
                            id: uuidv4(),
                            title: this.L('多选'),
                            type: 'checkbox',
                            required: false,
                            question_options: [
                                {
                                    value: uuidv4(),
                                    label: this.L('选项1'),
                                    checked: false,
                                },
                                {
                                    value: uuidv4(),
                                    label: this.L('选项2'),
                                    checked: false,
                                },
                                {
                                    value: uuidv4(),
                                    label: this.L('选项3'),
                                    checked: false,
                                },
                            ],
                            placeholder: this.L('请选择'),
                            value: [],
                            extra_config: {
                                is_other: false,
                                is_other_name: this.L('其他'),
                                is_other_value: '',
                            },
                            icon: 'iconCheckboxChecked',
                        },
                        {
                            id: uuidv4(),
                            title: this.L('文本'),
                            type: 'textarea',
                            required: false,
                            placeholder: this.L('请输入内容'),
                            value: '',
                            icon: 'iconEdit',
                        },
                        {
                            id: uuidv4(),
                            title: this.L('下拉选择'),
                            type: 'select',
                            required: false,
                            question_options: [
                                {
                                    value: uuidv4(),
                                    label: this.L('选项1'),
                                },
                                {
                                    value: uuidv4(),
                                    label: this.L('选项2'),
                                },
                                {
                                    value: uuidv4(),
                                    label: this.L('选项3'),
                                },
                            ],
                            placeholder: this.L('请选择'),
                            value: '',
                            icon: 'iconSelect',
                            extra_config: {
                                is_other: false,
                                is_other_name: this.L('其他'),
                                is_other_value: '',
                            },
                        },
                        {
                            id: uuidv4(),
                            title: this.L('图片'),
                            type: 'image',
                            required: false,
                            placeholder: this.L('请上传'),
                            value: '',
                            icon: 'iconImage',
                            extra_config: {
                                max_count: 1,
                            },
                        },
                        // {
                        //     id: uuidv4(),
                        //     title: this.L('附件'),
                        //     type: 'file',
                        //     required: false,
                        //     placeholder: this.L('请上传'),
                        //     value: '',
                        //     max_count: 1,
                        //     icon: 'iconFile',
                        // },
                        {
                            id: uuidv4(),
                            title: this.L('评分'),
                            type: 'rating',
                            required: false,
                            placeholder: this.L('请选择'),
                            value: '',
                            icon: 'iconStar',
                        },
                    ],
                },
                {
                    id: 2,
                    title: this.L('个人信息'),
                    iconColor: '#039a66',
                    btnBgColor: '#eaf9f4',
                    hoverBgColor: '#deede8',
                    children: [
                        {
                            id: uuidv4(),
                            title: this.L('姓名'),
                            type: 'name',
                            required: false,
                            value: '',
                            icon: 'iconName',
                            placeholder: this.L('请输入姓名'),
                        },
                        {
                            id: uuidv4(),
                            title: this.L('性别'),
                            type: 'sex',
                            required: false,
                            value: '',
                            question_options: [
                                {
                                    value: 1,
                                    label: this.L('男'),
                                },
                                {
                                    value: 2,
                                    label: this.L('女'),
                                },
                                {
                                    value: 0,
                                    label: this.L('保密'),
                                },
                            ],
                            icon: 'iconSex',
                        },
                        {
                            id: uuidv4(),
                            title: this.L('手机号'),
                            type: 'phone',
                            required: false,
                            value: '',
                            icon: 'iconPhone',
                            placeholder: this.L('请输入手机号'),
                            extra_config: {
                                reg: '/^1[3456789]\\d{9}$/',
                            },
                        },
                        {
                            id: uuidv4(),
                            title: this.L('地址'),
                            type: 'areaAddress',
                            required: false,
                            value: {
                                province: '',
                                city: '',
                                area: '',
                                address: '',
                            },
                            icon: 'iconAddress',
                            placeholder: this.L('请选择省/市/区(县)'),
                        },
                    ],
                },
            ],
            //整个表单数据
            formData: {
                formHeaderImage: '', //表单头部图片
                title: '未命名', //表单标题
                description: '', //表单描述
                questions: [], //拖过去的自定义组件数组
                status: '',
            },
            selectFormDataIndex: -1, //选中的表单项下标
            loadingTip: this.L('加载中...'),
            loading: false,
            viewComponentVisible: false, //预览组件弹窗
        }
    },
    computed: {},
    created() {},
    beforeDestroy() {},
    methods: {
        setFormData(data) {
            this.formData = cloneDeep(data)
            this.updateFormNo()
        },
        getFormData() {
            return this.formData
        },
        //预览组件事件
        showViewComponent(flag = true) {
            this.viewComponentVisible = flag
        },
        //左侧拖拽开始事件
        draggableComponentStart(evt) {
            // console.log(evt, 'draggableComponentStart')
        },
        draggableComponentEnd(evt) {
            // console.log(evt, 'draggableComponentEnd')
        },
        // 拖拽结束时触发
        async changeCustomForm(evt) {
            console.log(evt, this.formData.questions, 'changeCustomForm')
            if (evt.moved) {
                this.selectFormDataIndex = evt.moved.newIndex
            }
            this.updateFormNo()
        },
        updateFormNo() {
            let i = 0
            this.formData.questions = this.formData.questions.map((v) => {
                if (v.type != 'title') {
                    i++
                    v.no = i
                }
                return v
            })
            this.$emit('changeFormEvent', this.formData)
        },
        //点击表单头部
        formHeaderClick() {
            this.selectFormDataIndex = -1
        },
        //表单组件底部操作事件
        footerActionsClick(e, item, index, field) {
            //查找当前组件的ref，必须与id保持一致时才查得出来
            const itemComponent = this.$refs[`${item.type}Component`].find((v) => v.form.id == item.id)
            switch (field) {
                case 'required':
                    this.$set(this.formData.questions[index], field, e.target.checked)
                    break
                case 'is_other':
                    this.$set(this.formData.questions[index].extra_config, field, e.target.checked)
                    break
                case 'option':
                    this.formData.questions[index].question_options.push({
                        label: '',
                        value: uuidv4(),
                    })
                    break
                default:
                    break
            }
            itemComponent?.updateForm(this.formData.questions[index])
            this.updateFormNo()
        },
        //表单组件$bus事件回调
        componentCallBack(type, item, index, params) {
            //查找当前组件的ref，必须与id保持一致时才查得出来
            const itemComponent = this.$refs[`${item.type}Component`].find((v) => v.form.id == item.id)
            switch (type) {
                case 'componentClick':
                    this.selectFormDataIndex = index
                    break
                case 'copy':
                    let newElement = cloneDeep(itemComponent.form || item)
                    newElement.id = uuidv4()
                    this.formData.questions.splice(index + 1, 0, newElement)
                    break
                case 'delete':
                    this.$delete(this.formData.questions, index)
                    break
                case 'deleteOption':
                    this.formData.questions[index].question_options = this.formData.questions[
                        index
                    ].question_options.filter((v) => v.value != params.value)
                    break
                case 'deleteOther':
                    this.formData.questions[index].extra_config.is_other = false
                    this.formData.questions[index].extra_config.is_other_name = ''
                    break
                default:
                    break
            }
            itemComponent?.updateForm(this.formData.questions[index])
            this.updateFormNo()
        },
        cloneRule(element) {
            //深度拷贝，并且更新id，解决同一对象元素的浅拷贝问题
            let newElement = cloneDeep(element)
            newElement.id = uuidv4()
            return newElement
        },
        //删除头部图片
        deleteHeaderImage() {
            this.formData.formHeaderImage = ''
        },
        beforeUpload(file) {
            this.loading = true
            return true
        },
        // 上传图片
        handleUploadImg(info, fieldForm = '', field = '', multiple = false) {
            this.loadingTip = this.L('上传中，请稍等...')
            const { fileList = [], resultData = {} } = imgUploadHandle(info, multiple)
            this[fieldForm][field] = resultData.fileUrl || ''
            if (info.file.status == 'done' && info.file.response) {
                this.loading = false
            }
        },
    },
}
</script>

<style lang="less" scoped>
@mainBorderStyle: 1px dashed #c2c8d1;
@survey-title-color: rgba(0, 0, 0, 0.85);
@box-width: 840px;
@main-border-radius: 8px;
.rounded {
    border-radius: @main-border-radius !important;
}
.rounded-b-0 {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
}
.main-border {
    border: @mainBorderStyle !important;
}
.center-box {
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    .form-box {
        max-width: @box-width;
        background-color: #fff;
        margin: 20px auto;
        box-shadow: 0px 2px 14px rgba(0, 0, 0, 0.03);
        .form-header {
            padding-bottom: 20px;
            text-align: center;
            border: 1px dashed transparent;
            .form-header-image {
                border-bottom: 1px solid rgba(0, 0, 0, 0.06);
                padding: 16px 0;
                .camera {
                    transition: all 0.3s;
                    &:hover {
                        scale: 1.2;
                    }
                }
                .form-header-image-content {
                    position: relative;
                    width: @box-width;
                    height: 228px;
                    &:hover {
                        .mask {
                            opacity: 1 !important;
                        }
                    }
                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                    .mask {
                        position: absolute;
                        left: 0;
                        right: 0;
                        top: 0;
                        bottom: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, 0.2);
                        opacity: 0;
                        transition: all 0.2s;
                        .delete-header-image {
                            position: absolute;
                            top: 10px;
                            right: 10px;
                            background-color: rgba(255, 255, 255, 0.7);
                            padding: 2px 6px;
                        }
                    }
                }
            }
            .form-header-title {
                display: flex;
                flex-direction: column;
                padding: 0 32px;
                .formTitle {
                    font-size: 18px;
                    margin-top: 30px !important;
                }
                .formTitle,
                .formDesc {
                    margin-top: 16px;
                    color: @survey-title-color;
                }
            }
        }
    }
}
.submit {
    padding: 40px;
    text-align: center;
}
.customDraggableForm {
    width: 100%;
    height: 100%;
    background-color: #f8f9fd;
    .left-box {
        width: 228px;
        height: 100%;
        background-color: #fff;
        padding: 25px 20px;
        overflow-y: auto;
        .left-box-item {
            margin-bottom: 30px;
            .item-title {
                color: #000;
                font-weight: 500;
                font-size: 14px;
                margin-bottom: 15px;
            }
            .item-content {
                .item-child {
                    width: 100%;
                    height: 36px;
                    line-height: 36px;
                    padding: 0 8px;
                    text-align: center;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.1s;
                    display: flex;
                    &:hover {
                        background-color: var(--hoverBgColor) !important;
                    }
                    .item-name {
                        font-size: 12px;
                        color: #333;
                    }
                    .item-icon {
                        margin-right: 8px;
                        font-size: 16px;
                    }
                }
            }
        }
    }
    .custom-form-box {
        min-height: 100px;
        position: relative;
        .item-child {
            display: flex;
            align-items: center;
            width: 91px;
            height: 36px;
            box-sizing: border-box;
            padding: 0 8px;
            border-radius: 4px;
            .item-name {
                font-size: 12px;
                color: #333;
            }
            .item-icon {
                margin-right: 8px;
                font-size: 16px;
            }
        }
    }
}

.input-style {
    border-radius: @main-border-radius;
    border: 1px dashed transparent;
    outline: none;
    background: transparent;
    resize: none; /* 禁用调整大小 */
}

::v-deep .ant-btn {
    border-radius: @main-border-radius;
}

::v-deep .ant-select-selection {
    border-radius: @main-border-radius;
}

::v-deep .form-input {
    /* 覆盖 Ant Design Vue 中 a-input 获取焦点时的边框颜色 */
    &.ant-input {
        &:extend(.input-style);
    }
    &.ant-input:focus {
        border: @mainBorderStyle !important;
        -webkit-box-shadow: none !important;
        box-shadow: none !important;
    }
    &:hover {
        border: @mainBorderStyle;
    }
    .ant-input {
        &:extend(.input-style);
        &.ant-input:focus {
            border: @mainBorderStyle !important;
            -webkit-box-shadow: none !important;
            box-shadow: none !important;
        }
        &:hover {
            border: @mainBorderStyle;
        }
    }
}

// 组件样式
::v-deep .question-wrap {
    background-color: #fff;
    transition: all 0.2s ease;
    border: 1px dashed transparent;
    cursor: grab;
    border: 1px dashed transparent;
    position: relative;
    &:hover {
        border: @mainBorderStyle;
        .rightActions {
            visibility: visible;
        }
    }
    &.selected {
        box-shadow: rgba(0, 0, 0, 0.02) 0 0 0 100vh inset;
        border: @mainBorderStyle;
    }
    .ant-input {
        border-radius: @main-border-radius;
    }
    .form-input {
        /* 覆盖 Ant Design Vue 中 a-input 获取焦点时的边框颜色 */
        &.ant-input:focus {
            border-color: rgba(0, 0, 0, 0.5) !important;
        }
        &:hover {
            border-color: rgba(0, 0, 0, 0.5) !important;
        }
    }
    .rightActions {
        top: 50%;
        transform: translateY(-50%);
        position: absolute;
        right: -27px;
        background-color: #edf4ff;
        transition: opacity 0.25s ease-in-out;
        border-radius: 0 4px 4px 0;
        visibility: hidden;
        .item {
            padding: 6px;
            cursor: pointer;
        }
    }
    .footer-actions {
        padding: 20px 0 20px 0;
        .add {
            &:hover {
                color: #158ffe;
            }
        }
    }
    .question-wrap-item {
        padding: 0 60px;
        position: relative;
        .question-title {
            font-weight: 700;
            color: @survey-title-color;
            font-size: 16px;
            padding: 10px 0;
            position: relative;
            .no {
                position: absolute;
                top: 14px;
                left: 0;
                transform: translateX(-100%);
                color: @survey-title-color;
                font-size: 18px;
                font-weight: bold;
                &.required::before {
                    content: '*';
                    position: absolute;
                    left: -6px;
                    color: #ff4d4f;
                    font-weight: 400;
                    font-size: 14px;
                }
            }
        }
        .form-input {
            font-weight: 700;
            color: @survey-title-color;
            font-size: 16px;
            &::placeholder {
                color: rgba(0, 0, 0, 0.35); /* 设置为灰色 */
            }
        }
        .ant-radio-group,
        .ant-checkbox-group {
            width: 100%;
        }
        .question-wrap-center-input {
            border: none !important;
            position: relative;
            &:hover {
                .delete-icon,
                .move-icon {
                    opacity: 1;
                }
            }
            .ant-input-affix-wrapper {
                .ant-input {
                    padding-left: 40px;
                }
            }
            .ant-input {
                color: @survey-title-color;
                font-size: 14px;
            }
            .delete-icon {
                opacity: 0;
                transition: all 0.2s;
            }
            .move-icon {
                display: flex;
                align-items: center;
                width: 25px;
                height: 40px;
                opacity: 0;
                transition: all 0.2s;
                cursor: move;
                .anticon {
                    position: absolute;
                }
                .anticon:first-child {
                    left: 5px;
                }
            }
        }
        .other-input {
            padding-left: 40px;
        }
    }
}
</style>
<style lang="less">
.wrapClassName {
    overflow: hidden;
    .center-box {
        overflow-y: auto;
        padding: 15px;
    }
    .ant-drawer-body {
        padding: 0;
        width: 100%;
        height: calc(100vh - 55px);
    }
    .ant-drawer-content {
        background-color: #f8f9fd;
    }
    .form-box {
        position: relative;
        margin: 0 auto !important;
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            top: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            z-index: 99;
        }
    }
}
::v-deep {
    .footerContent {
        overflow: hidden;
        img {
            max-width: 100%;
        }
    }
}
</style>