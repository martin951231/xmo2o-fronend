<template>
    <div class="pages bg-ff flex flex-column">
        <!-- 页头 -->
        <div class="pageHeader" v-if="source != 'platform'">
            <span @click="backOpt()" class="pointer" v-if="showBack"> {{ L('返回') }} </span>
            <span v-else></span>
            <div v-show="active_key == 1">
                <a-button v-show="componentId == 'my'" @click="submitOpt('2')">{{ L('预览效果') }}</a-button>
                <a-button v-show="componentId != 'index'" class="ml-20" type="primary" @click="submitOpt('1')">{{
                    L('保存')
                }}</a-button>
            </div>
        </div>
        <a-tabs v-model="active_key" @change="tabsChange">
            <a-tab-pane key="1" :tab="L('主页装修')" v-if="source != 'platform' && source != 'store'"> </a-tab-pane>
            <a-tab-pane key="2" :tab="L('微页面列表')"> </a-tab-pane>
        </a-tabs>
        <!-- 主页装修 -->
        <div class="flex-1 flex justify-between customContent" v-if="active_key == 1">
            <!-- 左侧组件 -->
            <div class="bg-ff componentPage">
                <!-- 主页装修 -->
                <homePageComponents :source="source" @getComponentInfo="getComponentInfo"></homePageComponents>
            </div>
            <!-- 中间预览区域 -->
            <div class="flex-1 customPreview">
                <preview></preview>
            </div>
            <!-- 组件装修表单 -->
            <decorate></decorate>
        </div>

        <!-- 微页面列表 -->
        <div v-else>
            <customPageList></customPageList>
        </div>

        <!-- 预览 -->
        <componentPreview
            v-if="componentPreviewVisible && componentPreviewInfo"
            :visible="componentPreviewVisible"
            :componentPreviewInfo="componentPreviewInfo"
            @handleCancel="componentPreviewVisible = false"
        ></componentPreview>
    </div>
</template>

<script>
import homePageComponents from '@/views/common/customPage/modules/customComponents/homePageComponents'
import customPageList from '@/views/common/customPage/modules/customPage/customPageList'
import preview from '@/views/common/customPage/modules/customPreview/preview'
import decorate from '@/views/common/customPage/modules/customDecorate/decorate'
import customPageApi from '@/api/common/platform/customPage'
import componentPreview from '@/views/common/customPage/modules/common/componentPreview'
export default {
    components: {
        homePageComponents, // 主页装修组件
        customPageList, // 微页面列表
        preview, // 中间预览区域
        decorate, // 组件装修
        componentPreview, // 预览组件
    },
    data() {
        return {
            // 来源 platform => 平台 merchant => 商家 store => 店铺
            source: this.$route.query.source || '',
            source_id: this.$route.query.source_id || '0',
            active_key: (this.$route.query.source == 'platform' || this.$route.query.source == 'store') ? '2' : '1',
            btnType: 1, // 1 保存  2 预览
            // 预览
            componentPreviewInfo: '',
            componentPreviewVisible: false,
            showBack: window.history.length == 1 ? false : true,
        }
    },
    watch: {
        activeKey: {
            immediate: true,
            handler(val) {
                if (this.source != 'platform' && this.source != 'store') {
                    this.active_key = val
                }
            },
        },
    },
    computed: {
        pageInfo() {
            return this.$store.state.customPage.pageInfo
        },
        componentId() {
            return this.$store.state.customPage.componentId
        },
        sourceInfo() {
            return this.$store.state.customPage.sourceInfo
        },
        activeKey() {
            return this.$store.state.customPage.activeKey
        },
    },
    created() {
        this.$store.dispatch('updateSource', {
            source: this.$route.query.source || '',
            source_id: this.$route.query.source_id || '0',
        })
        this.$store.dispatch('updatePageType', 'homePage')
    },
    mounted() {
        if (this.$store.state.customPage.refreshCustomPageList) {
            this.active_key = '2'
        }
    },
    methods: {
        // 主页装修 微页面列表tabs切换
        tabsChange(key) {
            this.active_key = key
            this.$store.dispatch('updateComponentId', this.active_key == 2 ? '' : this.componentId)
            this.$store.dispatch('updateCustomPageList', false)
            this.$store.dispatch('updateActiveKey', key)
        },
        // 返回
        backOpt() {
            history.go(-1)
            this.$store.dispatch('updateCustomPageList', false)
        },
        // 保存 || 预览 type == 1 保存 type == 2 预览
        submitOpt(type) {
            this.btnType = type
            let params = {
                type: type,
                source: this.sourceInfo.source,
                source_id: this.sourceInfo.source_id,
            }
            if (this.componentId == 'my') {
                // 个人中心
                this.addOrEditpersonalDecOpt(params)
            } else if (this.componentId == 'footerTabbar') {
                // 底部导航
                this.addOrEditNavBottomOpt(params)
            } else if (this.componentId == 'floatBtn') {
                // 悬浮按钮
                this.addOrEditSuspendedWindowOpt(params)
            }
        },
        // 个人中心保存
        addOrEditpersonalDecOpt(params) {
            let pageInfo = this.pageInfo

            if (pageInfo) {
                for (let k in pageInfo) {
                    params[k] = pageInfo[k] || ''
                    if (k == 'head_style_value') {
                        if (pageInfo['head_style'] == '1') {
                            params[k] = pageInfo[k]
                        } else {
                            params[k] = pageInfo['head_style_img'] || pageInfo[k]
                        }
                    }
                }
            }
            params['type'] = this.btnType
            // console.log('params----addOrEditpersonalDecOpt:', params)
            params.source_id = this.$route.query.source_id || '0'
            params.source = this.$route.query.source || ''
            this.request(customPageApi.addOrEditpersonalDec, params).then((res) => {
                if (this.btnType == 1) {
                    this.$message.success(this.L('操作成功'))
                } else {
                    this.componentPreviewVisible = true
                    this.componentPreviewInfo = {
                        link_url: res.url,
                        link_code: res.image,
                    }
                }
            })
        },
        // 底部导航保存 || 编辑
        addOrEditNavBottomOpt(params) {
            let pageInfo = this.pageInfo

            if (pageInfo) {
                for (let k in pageInfo) {
                    params[k] = k == 'is_open' && pageInfo[k] ? 1 : pageInfo[k] || ''
                }
            }

            let checkValidate = true
            // 校验
            if (params.content && params.content.length && params.is_open == 1) {
                for (let i = 0; i < params.content.length; i++) {
                    if (!params.content[i].name) {
                        this.$message.error(this.L('请输入导航X1名称', { X1: i + 1 }))
                        checkValidate = false
                        break
                    }
                    if (!params.content[i].common_image) {
                        this.$message.error(this.L('请上传导航X1普通图片', { X1: i + 1 }))
                        checkValidate = false
                        break
                    }
                    if (!params.content[i].focus_image) {
                        this.$message.error(this.L('请上传导航X1高亮图片', { X1: i + 1 }))
                        checkValidate = false
                        break
                    }
                    if (!params.content[i].link_url) {
                        this.$message.error(this.L('请配置导航链接'))
                        checkValidate = false
                        break
                    }
                }
            }
            console.log(params, 'params----addOrEditNavBottomOpt')
            if (checkValidate) {
                params.source_id = this.$route.query.source_id || '0'
                params.source = this.$route.query.source || ''
                this.request(customPageApi.addOrEditNavBottom, params).then((res) => {
                    this.$message.success(this.L('保存成功'))
                })
            }
        },
        // 悬浮窗编辑或添加
        addOrEditSuspendedWindowOpt(params) {
            let pageInfo = this.pageInfo

            if (pageInfo) {
                for (let k in pageInfo) {
                    params[k] = k == 'is_open' && pageInfo[k] ? 1 : pageInfo[k] || ''
                }
            }

            // 删除应用页面多选字段
            this.$delete(params, 'storeIndexChecked')
            this.$delete(params, 'customPageChecked')

            // 删除控制折叠的字段show
            if (params.content && params.content.length) {
                params.content = params.content.map((item) => {
                    this.$delete(item, 'show')
                    return item
                })
            }
            console.log(params, 'params----addOrEditSuspendedWindowOpt')
            params.source_id = this.$route.query.source_id || '0'
            params.source = this.$route.query.source || ''
            this.request(customPageApi.addOrEditSuspendedWindow, params).then((res) => {
                this.$message.success(this.L('保存成功'))
            })
        },
        // 获取组件信息
        getComponentInfo(res) {
            let pageHeaderInfo = res || '',
                componentId = res && res.id ? res.id : ''
            this.$store.dispatch('updatePageHeaderInfo', pageHeaderInfo)
            this.$store.dispatch('updateComponentId', componentId)
        },
    },
}
</script>

<style scoped>
#app .scroll_content.ant-layout-content {
    padding: 0 !important;
}
.pages {
    width: 100%;
    height: 100vh;
}
.pageHeader {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 400;
    color: #666666;
    font-size: 14px;
    line-height: 1.5;
    height: 57px;
    list-style: none;
    padding: 12px 16px;
    background-color: #fff;
    border-bottom: 1px solid rgb(235, 237, 240);
    box-sizing: border-box;
}
.pages >>> .ant-tabs-bar {
    margin-bottom: 0 !important;
}
.customContent {
    overflow-y: auto;
}
.customPreview {
    background: #f6f7f9;
    overflow-y: auto;
    box-sizing: border-box;
}
.componentPage {
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
}
.componentPage {
    padding: 15px;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
    width: 5px; /*滚动条宽度*/
    height: 5px; /*滚动条高度*/
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
    border-radius: 10px; /*滚动条的背景区域的圆角*/
    background-color: transparent; /*滚动条的背景颜色*/
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
    border-radius: 10px; /*滚动条的圆角*/
    background-color: rgba(0, 0, 0, 0.15); /*滚动条的背景颜色*/
}
</style>
