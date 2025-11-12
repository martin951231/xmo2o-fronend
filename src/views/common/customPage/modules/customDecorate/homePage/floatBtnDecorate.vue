<template>
    <!-- 悬浮按钮装修 -->
    <div class="floatBtnDecorate">
        <!-- 组件描述 -->
        <componentDesc :content="desc"></componentDesc>

        <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol" :labelAlign="'left'">
            <a-form-model-item
                :label="L('是否启用悬浮窗')"
                :labelCol="{ span: 8 }"
                :wrapperCol="{ span: 16 }"
                class="isOpen"
            >
                <div class="text-right">
                    <a-switch v-model="formData.is_open" />
                </div>
            </a-form-model-item>
            <a-tabs default-active-key="1" v-if="formData.is_open">
                <a-tab-pane key="1" :tab="L('内容设置')">
                    <div class="content">
                        <div class="mb-20">
                            <h4>{{ L('窗口') }}</h4>
                            <div class="ant-form-explain">
                                {{ L('点击悬浮窗口会跳转到对应的页面，为保证页面效果，最多勾选2个悬浮窗。') }}
                            </div>
                        </div>
                        <a-form-model-item
                            v-for="(domain, index) in formData.content"
                            :key="index"
                            :label-col="{ span: 0 }"
                            :wrapper-col="{ span: 24 }"
                            class="flex"
                        >
                            <div class="floatBtnWrap">
                                <div class="floatBtnHeader pointer" @click.self="showOpt(index)">
                                    <a-icon type="menu" @click="showOpt(index)" class="mr-20" />
                                    <a-checkbox
                                        :checked="domain.checked"
                                        @change="checkBoxChange($event, domain, index)"
                                    >
                                        {{ domain.name }}
                                    </a-checkbox>
                                </div>
                                <div :class="domain.show ? 'floatBtnContent' : 'floatBtnContentHide'">
                                    <a-form-model-item :label="L('图标')">
                                        <div class="flex align-center">
                                            <div>
                                                <a-upload
                                                    name="reply_pic"
                                                    :action="$store.state.customPage.uploadAction"
                                                    :data="uploadData"
                                                    :showUploadList="false"
                                                    @change="handleUploadChange($event, index, 'image')"
                                                    :disabled="loading && currentIndex == index"
                                                >
                                                    <div
                                                        class="imgWrap"
                                                        :class="
                                                            loading && currentIndex == index
                                                                ? 'disabledCursor'
                                                                : 'pointer'
                                                        "
                                                    >
                                                        <img
                                                            :src="
                                                                domain.image
                                                                    ? domain.image
                                                                    : $store.state.customPage.defaultImg
                                                            "
                                                            alt=""
                                                        />
                                                        <span class="imgTips">{{
                                                            loading && currentIndex == index
                                                                ? L('上传中')
                                                                : L('更换图片')
                                                        }}</span>
                                                    </div>
                                                </a-upload>
                                            </div>
                                        </div>
                                    </a-form-model-item>

                                    <div class="ant-form-explain">
                                        {{ L('建议使用 50*50 像素的圆形 png 图片') }}
                                    </div>
                                </div>
                            </div>
                        </a-form-model-item>
                    </div>
                </a-tab-pane>
                <a-tab-pane key="2" :tab="'应用页面'">
                    <div class="content">
                        <div class="flex align-center justify-between mb-20">
                            <span
                                >{{ L('X1首页', { X1: sourceInfo.source == 'store' ? '店铺' : '商家' }) }}
                                <span class="ml-10">
                                    {{ L(formData.storeIndexChecked ? '应用' : '不应用') }}
                                </span></span
                            >

                            <a-checkbox
                                :checked="formData.storeIndexChecked"
                                @change="applyPageChange($event, 'storeIndexChecked')"
                            >
                            </a-checkbox>
                        </div>
                        <div class="flex align-center justify-between">
                            <span
                                >{{ L('微页面')
                                }}<span class="ml-10">
                                    {{ L(formData.customPageChecked ? '应用' : '不应用') }}
                                </span></span
                            >

                            <a-checkbox
                                :checked="formData.customPageChecked"
                                @change="applyPageChange($event, 'customPageChecked')"
                            >
                            </a-checkbox>
                        </div>
                    </div>
                </a-tab-pane>
            </a-tabs>
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
            desc: {
                title: '悬浮窗',
                desc: '悬浮窗便于你在各页面放置统一的快捷入口，建议配置用户经常访问的页面入口。',
            },
            formData: {
                id: '',
                source: '',
                source_id: '',
                is_open: true,
                content: [
                    {
                        name: this.L('店铺主页'), //名称
                        checked: true,
                        image: require('@/assets/customPage/storeIndexFloatBtn.png'),
                        type: 'storeIndex', // 按钮类型
                    },
                    // 当前版本先隐藏
                    // {
                    //     name: '购物车',
                    //     checked: true,
                    //     image: require('@/assets/customPage/shoppingCardFloatBtn.png'),
                    //     type: 'shoppingCard',
                    // },
                    {
                        name: this.L('在线客服'),
                        checked: false,
                        image: require('@/assets/customPage/customerServiceFloatBtn.png'),
                        type: 'customerService',
                    },
                    {
                        name: this.L('页面分享'),
                        checked: false,
                        image: require('@/assets/customPage/shareFloatBtn.png'),
                        type: 'share',
                    },
                    {
                        name: this.L('个人中心'),
                        checked: false,
                        image: require('@/assets/customPage/myFloatBtn.png'),
                        type: 'my',
                    },
                    {
                        name: this.L('返回顶部'),
                        checked: false,
                        image: require('@/assets/customPage/backTopFloatBtn.png'),
                        type: 'backTop',
                    },
                ],
                storeIndexChecked: true, // 应用页面 店铺首页
                customPageChecked: false, // 应用页面 微页面
                apply_page: 2,
            },
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            loading: false,
            currentIndex: -1,
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
        this.getSuspendedWindow()
    },
    methods: {
        // 获取装修信息
        getSuspendedWindow() {
            let params = {
                source: this.sourceInfo.source,
                source_id: this.sourceInfo.source_id,
            }
            this.request(customPageApi.getSuspendedWindow, params).then((res) => {
                if (res && JSON.stringify(res) != '[]' && JSON.stringify(res) != '{}') {
                    if (res) {
                        // 是否开启底部导航转化布尔值
                        if (res.is_open && res.is_open == 1) {
                            res.is_open = true
                        } else {
                            res.is_open = false
                        }

                        // content为空时取默认值this.formData.content 当前版本先隐藏购物车按钮
                        res.content = res.content || this.formData.content || []
                        if (res.content && res.content.length) {
                            res.content = res.content
                                .map((item, index) => {
                                    item.show = item.checked =
                                        item.checked && (item.checked == true || item.checked == 'true') ? true : false
                                    item.type = item.type || this.formData.content[index]['type']
                                    return item
                                })
                                .filter((item) => item.type != 'shoppingCard')
                        }

                        // 应用页面
                        if (res.apply_page) {
                            if (res.apply_page == '2') {
                                res.storeIndexChecked = true
                                res.customPageChecked = false
                            } else if (res.apply_page == '3') {
                                res.storeIndexChecked = false
                                res.customPageChecked = true
                            } else {
                                res.storeIndexChecked = true
                                res.customPageChecked = true
                            }
                        }
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
        // 上传图片
        handleUploadChange(info, current, type) {
            this.currentIndex = current
            this.loading = true
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
                    this.currentIndex = -1
                    this.loading = false
                }
                return file
            })
            // console.log(this.formData,'formData---handleUploadChange')
            if (info.file.status === 'done') {
                // console.log('done')
                this.currentIndex = -1
                this.loading = false
            } else if (info.file.status === 'error') {
                // console.log('error')
                this.$message.error(this.L(`X1上传失败。`, { X1: info.file.name }))
                this.currentIndex = -1
                this.loading = false
            }
        },
        // 多选框
        checkBoxChange(e, currentItem, currentIndex) {
            let content = this.formData.content || []
            if (content.length) {
                let checkedContent = content.filter((item) => item.checked) || []
                if (checkedContent.length > 1 && !currentItem.checked) {
                    this.$message.error(this.L('最多勾选2个悬浮窗'))
                } else {
                    content = content.map((item, index) => {
                        if (index == currentIndex) {
                            item.checked = !item.checked
                        }
                        return item
                    })
                }
            }
            this.$set(this.formData, 'content', content)
        },
        // 手风琴
        showOpt(currentIndex) {
            let content = this.formData.content || []
            if (content.length) {
                content = content.map((item, index) => {
                    if (index == currentIndex) {
                        item['show'] = item['show'] == undefined ? true : !item['show']
                    }
                    return item
                })
            }

            this.$set(this.formData, 'content', content)
        },
        // 页面应用多选框
        applyPageChange(e, filed) {
            this.$set(this.formData, filed, e.target.checked)
            let { storeIndexChecked, customPageChecked, apply_page } = this.formData
            if (storeIndexChecked && customPageChecked) {
                apply_page = 1
            } else if (storeIndexChecked && !customPageChecked) {
                apply_page = 2
            } else if (!storeIndexChecked && customPageChecked) {
                apply_page = 3
            } else {
                apply_page = 0
            }
            this.$set(this.formData, 'apply_page', apply_page)
        },
    },
}
</script>

<style scoped>
.floatBtnDecorate >>> .isOpen.ant-form-item {
    padding: 0 24px;
    margin: 12px 0;
}
.floatBtnDecorate >>> .ant-tabs-nav .ant-tabs-tab {
    padding: 12px 24px;
    box-sizing: border-box;
}
.floatBtnDecorate .content {
    width: 100%;
    padding: 24px;
    box-sizing: border-box;
}
.floatBtnDecorate >>> form .ant-upload {
    background: #f4f4f4;
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
.floatBtnWrap {
    border-radius: 4px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 12%);
    border: 1px solid rgb(0 0 0 / 6%);
    box-sizing: border-box;
}
.floatBtnHeader {
    padding: 5px 16px 4px;
    color: rgba(0, 0, 0, 0.65);
    font-weight: 500;
    border-bottom: 1px solid #e8e8e8;
    box-sizing: border-box;
}
.floatBtnContent {
    height: auto;
    padding: 12px 16px;
    box-sizing: border-box;
    transition: all 0.3s;
}
.floatBtnContentHide {
    height: 0;
    overflow: hidden;
    transition: all 0.3s;
}
.disabledCursor {
    cursor: not-allowed;
}
</style>