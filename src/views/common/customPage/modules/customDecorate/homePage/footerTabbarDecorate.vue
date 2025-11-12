<template>
    <!-- 底部导航装修 -->
    <div class="footerTabbarDecorate">
        <!-- 组件描述 -->
        <componentDesc :content="desc"></componentDesc>

        <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol" :labelAlign="'left'">
            <a-card :bordered="false">
                <a-form-model-item :label="L('是否启用底部导航')" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }">
                    <div class="text-right">
                        <a-switch v-model="formData.is_open" />
                    </div>
                </a-form-model-item>
                <div v-if="formData.is_open">
                    <a-form-model-item :label="L('背景颜色')" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                        <div class="flex justify-between align-center colorPickerWrap">
                            <span class="color-name">{{ formData.bg_color }}</span>
                            <label
                                for="bg_color"
                                class="colorPickerLabel"
                                :style="[{ background: formData.bg_color || '#ffffff' }]"
                            >
                                <input type="color" v-model="formData.bg_color" id="bg_color" />
                            </label>

                            <a-button @click="resetOpt('bg_color')" type="link"> {{ L('重置') }}</a-button>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item :label="L('导航文字颜色')" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                        <div class="flex justify-between align-center colorPickerWrap">
                            <span class="color-name">{{ formData.nav_font_color }}</span>
                            <label
                                for="nav_font_color"
                                class="colorPickerLabel"
                                :style="[{ background: formData.nav_font_color || '#000000' }]"
                            >
                                <input type="color" v-model="formData.nav_font_color" id="nav_font_color" />
                            </label>

                            <a-button @click="resetOpt('nav_font_color')" type="link"> {{ L('重置') }}</a-button>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item :label="L('选中颜色')" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                        <div class="flex justify-between align-center colorPickerWrap">
                            <span class="color-name">{{ formData.select_color }}</span>
                            <label
                                for="select_color"
                                class="colorPickerLabel"
                                :style="[{ background: formData.select_color || '#ffffff' }]"
                            >
                                <input type="color" v-model="formData.select_color" id="select_color" />
                            </label>

                            <a-button @click="resetOpt('select_color')" type="link"> {{ L('重置') }}</a-button>
                        </div>
                    </a-form-model-item>
                </div>
            </a-card>

            <div v-if="formData.is_open">
                <a-form-model-item
                    v-for="(domain, index) in formData.content"
                    :key="index"
                    :label-col="{ span: 0 }"
                    :wrapper-col="{ span: 24 }"
                    class="flex"
                >
                    <div class="navHeader">
                        <div class="navHeaderTitle">{{ L('导航X1', { X1: index + 1 }) }}</div>
                        <div class="navHeaderExtra" v-if="!domain.is_default" @click="delNav(index)">
                            <a href="javascript:void(0);"><a-icon type="delete" /></a>
                        </div>
                    </div>
                    <div class="navContent">
                        <a-form-model-item :label="L('名称')" class="flex">
                            <a-input :maxLength="4" v-model="domain.name" :placeholder="L('请输入')">
                                <span slot="suffix"> {{ domain.name.length }}/4 </span>
                            </a-input>
                        </a-form-model-item>
                        <a-form-model-item :label="L('图标')">
                            <div class="flex align-center">
                                <div>
                                    <a-upload
                                        name="reply_pic"
                                        :action="$store.state.customPage.uploadAction"
                                        :data="uploadData"
                                        :showUploadList="false"
                                        @change="handleUploadChange($event, index, 'common_image')"
                                        :disabled="loading['common_image'] && currentIndex == index"
                                    >
                                        <div
                                            class="imgWrap pointer"
                                            :class="
                                                loading['common_image'] && currentIndex == index
                                                    ? 'disabledCursor'
                                                    : 'pointer'
                                            "
                                        >
                                            <img
                                                :src="
                                                    domain.common_image
                                                        ? domain.common_image
                                                        : $store.state.customPage.defaultImg
                                                "
                                                alt=""
                                            />
                                            <span class="imgTips">
                                                {{
                                                    loading['common_image'] && currentIndex == index
                                                        ? L('上传中')
                                                        : domain.common_image
                                                        ? L('更换图片')
                                                        : L('上传图片')
                                                }}
                                            </span>
                                        </div>
                                        <div class="mt-10 text-center">{{ L('普通') }}</div>
                                    </a-upload>
                                </div>

                                <div class="ml-20">
                                    <a-upload
                                        name="reply_pic"
                                        :action="$store.state.customPage.uploadAction"
                                        :data="uploadData"
                                        :showUploadList="false"
                                        @change="handleUploadChange($event, index, 'focus_image')"
                                        :disabled="loading['focus_image'] && currentIndex == index"
                                    >
                                        <div
                                            class="imgWrap"
                                            :class="
                                                loading['focus_image'] && currentIndex == index
                                                    ? 'disabledCursor'
                                                    : 'pointer'
                                            "
                                        >
                                            <img
                                                :src="
                                                    domain.focus_image
                                                        ? domain.focus_image
                                                        : $store.state.customPage.defaultImg
                                                "
                                                alt=""
                                            />
                                            <span class="imgTips">{{
                                                loading['focus_image'] && currentIndex == index
                                                    ? L('上传中')
                                                    : domain.focus_image
                                                    ? L('更换图片')
                                                    : L('上传图片')
                                            }}</span>
                                        </div>
                                        <div class="mt-10 text-center">{{ L('高亮') }}</div>
                                    </a-upload>
                                </div>
                            </div>
                        </a-form-model-item>
                        <a-form-model-item :label="L('配置链接')" v-if="!domain.is_default">
                            <div class="flex">
                                <a-textarea
                                    style="max-height: 100px; overflow-y: auto; resize: none"
                                    v-model="domain.link_url"
                                    :placeholder="L('请输入链接/功能库选择')"
                                    autoSize
                                />
                                <a-button class="ml-10" @click="getLinkUrl(index)">{{ L('从功能库选择') }}</a-button>
                            </div>
                        </a-form-model-item>
                        <a-form-model-item class="index" :label="L('链接')" v-else-if="domain.is_default">
                            <span>{{ L('首页') }}</span>
                        </a-form-model-item>

                        <div class="ant-form-explain">
                            {{ L('图片尺寸要求：不大于22*22像素，支持PNG格式') }}
                        </div>
                    </div>
                </a-form-model-item>

                <div
                    class="mt-20 mb-20 addBtn"
                    v-if="!formData.content || (formData.content && formData.content.length < 4)"
                >
                    <a-button block @click="addNav()"> <a-icon type="plus" />{{ L('添加导航') }} </a-button>
                </div>
            </div>
        </a-form-model>
    </div>
</template>
<script>
import customPageApi from '@/api/common/platform/customPage'
import componentDesc from '@/views/common/customPage/modules/common/componentDesc'

export default {
    components: {
        componentDesc,
    },
    data() {
        return {
            desc: '',
            descStore: {
                title: '底部导航',
                desc: '店铺的各个页面可以通过导航串联起来，通过精心设置的导航，方便买家在栏目间快速切换，引导买家前往你期望的页面。',
            },
            descMerchant: {
                title: '底部导航',
                desc: '商家的各个页面可以通过导航串联起来，通过精心设置的导航，方便买家在栏目间快速切换，引导买家前往你期望的页面。',
            },
            emptyData: ['', null, undefined, 'null', 'undefined'],
            isValidate: false, // 校验是否为空
            bg_color: '#2b2d30',
            nav_font_color: '#969799',
            select_color: '#ff4444',
            formData: {
                id: '',
                source: '',
                source_id: '',
                is_open: true,
                bg_color: '#2b2d30',
                nav_font_color: '#969799',
                select_color: '#ff4444',
                content: [
                    {
                        name: this.L('首页'), //名称
                        common_image: '', //普通图片
                        focus_image: '', //高亮图片
                        link_url: '/pages/customPage/index', //链接地址
                        is_default: true, // 第一个导航固定链接为店铺首页，不可修改链接
                        type: 'index', // 导航类型，index =>首页
                    },
                    {
                        name: '',
                        common_image: '',
                        focus_image: '',
                        link_url: '',
                    },
                    {
                        name: '',
                        common_image: '',
                        focus_image: '',
                        link_url: '',
                    },
                    {
                        name: '',
                        common_image: '',
                        focus_image: '',
                        link_url: '',
                    },
                ],
            },
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            loading: {
                common_image: false,
                focus_image: false,
            },
            currentIndex: -1,
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
                source: this.$store.state.customPage.sourceInfo.source,
                source_id: this.$store.state.customPage.sourceInfo.source_id,
                is_decorate: 1,
            }
        },
    },
    watch: {
        formData: {
            deep: true,
            handler(val) {
                this.updatePageInfo()
            },
        },
    },
    mounted() {
        if (this.sourceInfo.source == 'store') {
            this.desc = this.descStore
        } else {
            this.desc = this.descMerchant
        }
        this.getNavBottomDec()
    },
    methods: {
        // 获取底部导航装修信息
        getNavBottomDec() {
            let params = {
                source: this.sourceInfo.source,
                source_id: this.sourceInfo.source_id,
            }
            this.request(customPageApi.getNavBottomDec, params).then((res) => {
                if (res && JSON.stringify(res) != '[]' && JSON.stringify(res) != '{}') {
                    if (res) {
                        // 是否开启底部导航转化布尔值
                        if (res.is_open && res.is_open == 1) {
                            res.is_open = true
                        } else {
                            res.is_open = false
                        }
                        this.bg_color = res.bg_color = res.bg_color || this.bg_color
                        this.nav_font_color = res.nav_font_color = res.nav_font_color || this.nav_font_color
                        this.select_color = res.select_color = res.select_color || this.select_color
                    }
                    this.formData = res || ''
                }

                this.updatePageInfo()
            })
        },
        // 更新页面信息
        updatePageInfo() {
            this.$store.dispatch('updatePageInfo', this.formData)
        },
        // 重置
        resetOpt(filed) {
            let initialVal = this[filed]
            this.$set(this.formData, filed, initialVal)
        },
        // 上传图片
        handleUploadChange(info, current, type) {
            this.currentIndex = current
            this.loading[type] = true
            let fileList = [...info.fileList]
            fileList = fileList.slice(-1)
            fileList = fileList.map((file) => {
                if (file.status === 'done' && file.response.status == '1000') {
                    let imageUrl = file.response.data
                    let content = this.formData.content || []
                    content = content.map((item, index) => {
                        if (index == current) {
                            item[type] = imageUrl
                        }
                        return item
                    })
                    this.$set(this.formData, 'content', content)
                    this.loading[type] = false
                    this.currentIndex = -1
                }
                return file
            })
            // console.log(this.formData, 'formData---handleUploadChange')
            if (info.file.status === 'done') {
                // console.log('done')
                this.loading[type] = false
                this.currentIndex = -1
            } else if (info.file.status === 'error') {
                // console.log('error')
                this.$message.error(this.L(`X1上传失败。`, { X1: info.file.name }))
                this.loading[type] = false
                this.currentIndex = -1
            }
        },
        // 添加导航
        addNav() {
            let content = this.formData.content || []
            content.push({
                name: '',
                common_image: '',
                focus_image: '',
                link_url: '',
            })
            this.$set(this.formData, 'content', content)
        },
        // 删除导航
        delNav(index) {
            let content = this.formData.content || []
            content.splice(index, 1)
            this.$set(this.formData, 'content', content)
        },
        // 功能链接配置
        getLinkUrl(current) {
            this.$LinkBases({
                source: this.sourceInfo.source, // 必填
                type: 'h5', // 必填
                source_id: this.sourceInfo.source_id,
                // 确定按钮
                handleOkBtn: (res) => {
                    // 点击按钮事件
                    // console.log('handleOk', res)
                    this.$nextTick(() => {
                        let content = this.formData.content || []
                        content = content.map((item, index) => {
                            if (index == current) {
                                item.link_url = res.url
                            }
                            return item
                        })
                        this.$set(this.formData, 'content', content)
                    })
                },
            })
        },
    },
}
</script>

<style scoped>
.colorPickerLabel {
    width: 80px;
    height: 30px;
    border: 1px solid #666666;
}
.colorPickerLabel input[type='color'] {
    opacity: 0;
}
.color-name {
    height: 30px;
    min-width: 60px;
    text-align: left;
    margin-right: 20px;
    vertical-align: middle;
    font-size: 14px;
    font-weight: bold;
}
.flex.ant-form-item {
    display: flex;
}
.navHeader {
    width: 100%;
    min-height: 48px;
    margin-bottom: -1px;
    padding: 0 24px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 14px;
    background: #f4f4f4;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.navHeaderTitle {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.navHeaderExtra {
    color: rgba(0, 0, 0, 0.65);
    font-weight: normal;
    font-size: 14px;
}
.navContent {
    width: 100%;
    padding: 24px;
    box-sizing: border-box;
}
.imgWrap {
    position: relative;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    overflow: hidden;
    box-sizing: border-box;
}
.imgWrap img {
    width: 100%;
    height: 100%;
}
.imgTips {
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
.addBtn {
    padding: 0 24px;
}
.index >>> .ant-form-item-label > label {
    color: red;
}
.disabledCursor {
    cursor: not-allowed;
}
</style>