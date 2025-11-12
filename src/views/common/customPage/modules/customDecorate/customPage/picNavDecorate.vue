<template>
    <div v-if="formDataDecorate">
        <!-- 组件描述 -->
        <componentDesc :content="desc"></componentDesc>

        <div class="content">
            <a-form-model
                :model="formDataDecorate"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :labelAlign="'left'"
            >
                <div class="content mt-20">
                    <div class="add-nav-wrap mb-20">
                        <!-- 拖拽 -->
                        <draggable v-model="formDataDecorate.list" :disabled="isDisabled">
                            <div
                                class="group-menu-wrap flex align-center"
                                v-for="(item, index) in formDataDecorate.list"
                                :key="index"
                                @click.stop="isDisabled = false"
                            >
                                <a-icon type="close-circle" class="delIcon" @click="delCurNav(item, index)" />
                                <!-- 添加导航图片 -->
                                <div class="uploadImgWrap" @click="chooseImage(item, index)">
                                    <div
                                        class="pointer img-wrap"
                                        v-if="formDataDecorate.list && formDataDecorate.list[index].nav_icon"
                                    >
                                        <img :src="item.nav_icon" alt="" style="max-width: 100%; min-height: 100%" />
                                        <span class="img-update">{{ L('更换图片') }}</span>
                                    </div>
                                    <div v-else>
                                        <div class="flex align-center justify-center flex-column pointer img-wrap">
                                            <a-icon type="plus" />
                                            <span>{{ L('添加图片') }}</span>
                                        </div>
                                        <span class="cr-red">{{ L('请选择一张图片') }}</span>
                                    </div>
                                </div>
                                <!-- 添加导航标题 -->
                                <div class="flex-1 linkUrl">
                                    <a-form-model-item :label="L('标题')">
                                        <a-input
                                            :placeholder="L('请输入导航标题')"
                                            v-model="item.name"
                                            @mouseenter="isDisabled = true"
                                            @mouseleave="isDisabled = false"
                                            @click.stop="isDisabled = true"
                                        ></a-input>
                                    </a-form-model-item>
                                    <!-- 添加链接 -->
                                    <a-form-model-item :label="L('链接')">
                                        <a-input
                                            v-model="item.link_url"
                                            type="textarea"
                                            autoSize
                                            style="resize: none"
                                            @mouseenter="isDisabled = true"
                                            @mouseleave="isDisabled = false"
                                            @click.stop="isDisabled = true"
                                        ></a-input>
                                        <a-button @click="getLinkUrl(item, index)">{{ L('链接库选择') }}</a-button>
                                    </a-form-model-item>
                                </div>
                            </div>
                        </draggable>
                    </div>
                </div>
                <!-- 添加文本导航按钮 -->
                <div class="mt-20 mb-20" v-if="formDataDecorate.list.length < 4 || (sourceInfo.source == 'appoint_activity' && formDataDecorate.list.length < 5)">
                    <a-button block @click="addNavGroup"> <a-icon type="plus" />{{ L('添加图文导航') }}</a-button>
                </div>

                <!-- 添加背景颜色 -->
                <a-form-model-item :label="L('背景颜色')">
                    <a-radio-group v-model="formDataDecorate.bg_color_style">
                        <a-radio :key="3" :value="'3'">{{
                            L('无背景')
                        }}</a-radio>
                        <a-radio v-for="(item, index) in $store.state.customPage.bgColorStyleOptions" :key="index" :value="item.value">{{
                            item.label
                        }}</a-radio>
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item
                    label=""
                    :wrapperCol="{ span: 18, offset: 5 }"
                    v-if="formDataDecorate.bg_color_style == '2'"
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
                <a-form-model-item label=""  class="flex-end" v-if="formDataDecorate.bg_color_style == '1'">
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
                <a-form-model-item :label="L('背景透明度')" class="flex-end" v-if="false">
                    <a-row>
                        <a-col :span="18">
                            <a-slider v-model="formDataDecorate.bg_color_opacity" :max="1" :min="0" :step="0.1" />
                        </a-col>
                        <a-col :span="4" :offset="1">
                            <a-input-number v-model="formDataDecorate.bg_color_opacity" :min="0" :max="1" :step="0.1" />
                        </a-col>
                    </a-row>
                </a-form-model-item>

                <!-- 添加文字颜色 -->
                <a-form-model-item :label="L('文字颜色')" class="flex-end">
                    <div class="flex align-center color-picker-wrap">
                        <span class="color-name">{{ formDataDecorate.font_color }}</span>
                        <label
                            for="font_color"
                            class="color-picker-label"
                            :style="[{ background: formDataDecorate.font_color }]"
                        >
                            <input type="color" v-model="formDataDecorate.font_color" id="font_color" />
                        </label>
                        <a-button @click="resetOpt('font_color')" type="link">{{ L('重置') }}</a-button>
                    </div>
                </a-form-model-item>
            </a-form-model>
        </div>
        <!-- 选择上传图片和历史图片 -->
        <template>
            <choose-image
                ref="chooseNavPic"
                :max="1"
                :upload_dir="'/decorate/images'"
                type="image"
                @callback="uploadNavIconCallback"
            />
        </template>
    </div>
</template>

<script>
import componentDesc from '@/views/common/customPage/modules/common/componentDesc'
import IconFont from '@/utils/icon'
import draggable from 'vuedraggable'
import ChooseImage from '@/components/ChooseImage/ChooseImage'

export default {
    components: {
        componentDesc,
        IconFont,
        draggable,
        ChooseImage,
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
                title: '图文导航',
                desc: '默认展示4个导航，若需更多导航，请继续添加该组件',
            },
            labelCol: { span: 5 },
            wrapperCol: { span: 18 },
            formDataDecorate: '',
            list: [], // 添加的文本导航框的列表数据
            currentIndex: 0,
            // 背景颜色
            bg_color: '#ffffff',
            // 文字颜色
            font_color: '#000000',
            isDisabled: false,
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
        formDataDecorate: {
            deep: true,
            handler(val) {
                this.$emit('updatePageInfo', val)
            },
        },
    },
    mounted() {
        if(this.sourceInfo.source == 'appoint_activity') {
            this.$set(this.desc,'desc','默认展示5个导航，若需更多导航，请继续添加该组件')
        }
        if (this.formContent) {
            this.formDataDecorate = {}
            for (let k in this.formContent) {
                this.$set(this.formDataDecorate, k, this.formContent[k])
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
        }
    },
    methods: {
        // 添加文本导航
        addNavGroup() {
            let list = this.formDataDecorate.list || []
            list.push({
                name: '',
                link_url: '',
                nav_icon: '',
            })
            this.$set(this.formDataDecorate, 'list', list)
        },
        // 删除当前的文本导航
        delCurNav(curItem, curIndex) {
            let list = this.formDataDecorate.list || []
            if (list.length) {
                list.splice(curIndex, 1)
            }
            this.$set(this.formDataDecorate, 'list', list)
        },
        // 功能链接配置
        getLinkUrl(curItem, curIndex) {
            this.currentIndex = curIndex
            this.$LinkBases({
                source: this.$store.state.customPage.sourceInfo.source, // 必填
                type: 'h5', // 必填
                source_id: this.$store.state.customPage.sourceInfo.source_id,
                // 确定按钮
                handleOkBtn: (res) => {
                    // 点击按钮事件
                    // console.log('handleOk', res)
                    this.$nextTick(() => {
                        //链接库动态赋值
                        let list = this.formDataDecorate.list || []
                        let current = list[this.currentIndex]
                        this.$set(current, 'link_url', res.url)
                        this.$set(list, this.currentIndex, current)
                        this.$set(this.formDataDecorate, 'list', list)
                    })
                },
            })
        },
        // 颜色重置
        resetOpt(filed) {
            this.$set(this.formDataDecorate, filed, this[filed])
        },
        // 添加导航图片
        chooseImage(curItem, curIndex) {
            this.currentIndex = curIndex
            this.$refs.chooseNavPic.openDialog()
        },
        // 选取导航图片后的回调
        uploadNavIconCallback(info) {
            let navPicList = info.list
            let imageUrl = navPicList.length ? navPicList[0] : ''
            let listFormDataDecorate = this.formDataDecorate.list || []
            let current = listFormDataDecorate[this.currentIndex]
            this.$set(current, 'nav_icon', imageUrl)
            this.$set(listFormDataDecorate, this.currentIndex, current)
            this.$set(this.formDataDecorate, 'list', listFormDataDecorate)
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
.content {
    padding: 0 24px;
    width: 100%;
    box-sizing: border-box;
}
.padding-24 {
    padding: 24px 0;
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
.delIcon {
    display: none;
}
.group-menu-wrap {
    padding: 12px 16px;
    width: 100%;
    box-sizing: border-box;
    position: relative;
    margin-bottom: 12px;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 0 4px 0 rgb(10 42 97 / 20%);
}
.delIcon {
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(50%, -50%);
    font-size: 18px;
    cursor: pointer;
    color: #bbb;
    background: #ffffff;
    border-radius: 50%;
    z-index: 2;
}
.group-menu-wrap:hover.group-menu-wrap .delIcon {
    display: block;
}
.add-nav-wrap >>> .ant-form-item {
    margin-bottom: 10px;
}
.img-wrap {
    margin-right: 10px;
    position: relative;
    width: 100px;
    height: 100px;
    overflow: hidden;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    box-sizing: border-box;
}
.img-update {
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 24px;
    line-height: 24px;
    text-align: center;
    font-size: 12px;
    color: #ffffff;
    background: rgba(0, 0, 0, 0.4);
}
</style>
