<template>
    <div class="pages bg-ff flex flex-column">
        <!-- 页头 -->
        <div class="pageHeader">
            <span @click="backOpt()" class="pointer" v-if="showBack"> {{ L('返回微页面列表') }} </span>
            <span v-else></span>
            <div>
                <a-button @click="submitOpt(2)">{{ L('预览效果') }}</a-button>
                <a-button class="ml-20" type="primary" @click="submitOpt(1)">{{ L('保存') }}</a-button>
            </div>
        </div>
        <!-- 主页装修 -->
        <div class="flex-1 flex justify-between customContent">
            <!-- 左侧组件 -->
            <div class="bg-ff componentPage">
                <customPageComponents></customPageComponents>
            </div>
            <!-- 中间预览区域 -->
            <div class="flex-1 customPreview">
                <preview></preview>
            </div>
            <!-- 组件装修表单 -->
            <decorate></decorate>
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
import preview from '@/views/common/customPage/modules/customPreview/preview'
import decorate from '@/views/common/customPage/modules/customDecorate/decorate'
import customPageComponents from '@/views/common/customPage/modules/customComponents/customPageComponents'
import componentPreview from '@/views/common/customPage/modules/common/componentPreview'
import customPageApi from '@/api/common/platform/customPage'
import validate from './modules/common/validate.js'
export default {
    components: {
        preview, // 中间预览区域
        decorate, // 组件装修
        customPageComponents, // 微页面装修组件
        componentPreview, // 预览
    },
    data() {
        return {
            // 来源 platform => 平台 merchant => 商家 store => 店铺 appoint_activity => 预约
            source: this.$route.query.source || '',
            source_id: this.$route.query.source_id || '0',
            pageId: this.$route.query.pageId || '',
            formData: {
                id: this.$route.query.pageId || '', // 页面id
                source: this.$route.query.source || '',
                source_id: this.$route.query.source_id || '0',
                page_title: this.L('微页面标题'), //标题
                title_color: '#000000', // 标题颜色
                bg_color_style: '1', // 背景颜色样式 1=自定义背景色 2= 自定义图片
                bg_color: '#f9f9f9', // 背景颜色
                bg_image: [], // 背景图片 多张
                bg_color_default: '#f9f9f9', // 默认背景颜色
                bg_color_nav_style: '1', // 导航颜色样式1=自定义背景色 2= 自定义图片
                bg_color_nav: '#ffffff', // 导航颜色
                bg_color_nav_default: '#ffffff', // 导航颜色
                bg_image_nav: '', // 导航背景图
                bg_color_nav_opacity: 1, // 导航栏透明度
                nav_bottom_display: 0, // 底部导航是否显示 1 显示 0 隐藏
                share_title: '', //分享标题
                share_desc: '', //分享描述
                share_image_wechat: '', //分享图片小程序
                share_image_h5: '', //分享图片h5
            },
            // 预览
            componentPreviewInfo: '',
            componentPreviewVisible: false,
            showBack: window.history.length == 1 ? false : true,
            canSubmit: true,
            pre_page_id: '',//获取详情的id 预览id
        }
    },
    computed: {
        pageInfo() {
            return this.$store.state.customPage.pageInfo
        },
        componentsList() {
            return this.$store.state.customPage.componentsList
        }
    },
    created() {
        if (!this.$route.query.source_id) {
            this.$store.dispatch('updatePageInfo', this.formData)
        }

        this.$store.dispatch('updateSource', {
            source: this.$route.query.source || '',
            source_id: this.$route.query.source_id || '0',
        })
        this.getPageId();
        this.$store.dispatch('updatePageType', 'customPage')
    },
    methods: {
        handlePageInfo(res) {
            if (!res || JSON.stringify(res) == '[]' || JSON.stringify(res) == '{}') {
                res = this.formData
            } else {
                for (let k in res) {
                    res['bg_color_style'] = res['bg_color_style'] ? res['bg_color_style'].toString() : '1'
                    res['bg_color_nav_style'] = res['bg_color_nav_style'] ? res['bg_color_nav_style'].toString() : '1'
                    res['bg_color_nav_opacity'] = res['bg_color_nav_opacity'] == undefined?1:Number(res['bg_color_nav_opacity'])
                    this.$set(this.formData, k, res[k])
                }
            }
            let custom = res && res.custom ? res.custom : []
            if (custom.length) {
                custom = custom.filter((item) => item)
                res.custom = custom.map((item) => {
                    let componentLabelAndRules = this.getComponentLabelAndRules(item.type)
                    if (componentLabelAndRules.rules) {
                        item.rules = componentLabelAndRules.rules
                    }
                    item.label = componentLabelAndRules.label
                    return item
                })
            }
            this.$store.dispatch('updatePageInfo', res)
            this.$store.dispatch('updateComponentId', 'customPageIndex')
        },
        // 获取微页面信息
        getEditMicoPageOpt() {
            if (this.$route.query.source == 'appoint_activity' && this.$route.query.template_id && !this.pageId && !this.pre_page_id) {
                this.handlePageInfo(this.$store.state.customPage.appointCustomTemplate[this.$route.query.template_id])
                return
            }
            if (!this.pageId && !this.pre_page_id) {
                this.$store.dispatch('updatePageInfo', this.formData)
                this.$store.dispatch('updateComponentId', 'customPageIndex')
            } else {
                let params = {
                    source: this.source,
                    source_id: this.source_id,
                    id: this.pre_page_id || this.pageId,
                }
                //type传2 ，代表获取最新的预览数据this.pre_page_id，不存在即获取保存的数据this.pageId
                if(this.pre_page_id){
                    params.type = 2
                }
                this.request(customPageApi.getEditMicoPage, params).then((res) => {
                    this.handlePageInfo(res)
                })
            }
        },
        // 返回
        backOpt() {
            history.go(-1)
            if(this.showBack) {
                this.$store.dispatch('updatePageInfo', '')
            }
        },
        // 组件编辑时获取对应组件的label和rules
        getComponentLabelAndRules(type) {
            let componentsList = this.componentsList
            let rules = [],
                label = ''
            componentsList.forEach((item) => {
                if (item.list && item.list.length) {
                    item.list.forEach((itemList) => {
                        if (itemList.type == type) {
                            if (itemList.rules) {
                                rules = itemList.rules
                            }
                            label = itemList.label
                        }
                    })
                }
            })
            return {
                rules,
                label,
            }
        },
        // 1保存 2预览
        submitOpt(type) {
            if (!this.canSubmit) return
            this.canSubmit = false
            let params = this.pageInfo ? JSON.parse(JSON.stringify(this.pageInfo)) : ''

            params.type = type
            params.source_id = this.$route.query.source_id || '0'
            params.source = this.$route.query.source || ''
            if(type == 1){
                params.id = this.pageId || '';
            }else if(type == 2){
                params.id = this.pre_page_id || '';
            }
            params.page_title = params.page_title ? params.page_title.trim() : ''
            if (!params.page_title) {
                this.$message.error(this.L('请输入页面名称'))
                this.canSubmit = true
                return
            }

            params.share_title = params.share_title ? params.share_title.trim() : ''
            params.share_desc = params.share_desc ? params.share_desc.trim() : ''

            let validateResult = true
            // 自定义内容处理 只要type和content字段
            let custom = params.custom || []
            if (!custom.length) {
                this.$message.error(this.L('当前页面未装修'))
                this.canSubmit = true
                return
            }
            if (custom.length) {
                custom = custom.map((item) => {
                    let obj = {}
                    obj.type = item.type
                    obj.content = item.content
                    return obj
                })
                for (let i = 0; i < custom.length; i++) {
                    let type = custom[i].type
                    let content = custom[i].content || ''
                    let customIndex = i
                    let rules = validate.getRules(params.custom, type)

                    if (rules.length) {
                        let res = validate.validateCheck(content, rules)
                        if (!res.isOk) {
                            this.$message.error(this.L(res.errmsg))
                            validateResult = false
                        }
                    } else {
                        custom.map((item, index) => {
                            // 视频组件验证规则
                            if (item.type == 'customVideo') {
                                if (item.content.video_type_val == '1') {
                                    if (!item.content.choose_video_list) {
                                        this.$message.error(this.L('请添加视频'))
                                        validateResult = false
                                        type = item.type
                                        customIndex = index
                                    } else if (
                                        item.content.surface_type_val == '2' &&
                                        !item.content.choose_surface_list
                                    ) {
                                        this.$message.error(this.L('请添加封面'))
                                        validateResult = false
                                        type = item.type
                                        customIndex = index
                                    }
                                } else {
                                    // 粘贴视频地址时必须添加封面
                                    if (!item.content.paste_video_url.trim()) {
                                        this.$message.error(this.L('请填写视频地址'))
                                        validateResult = false
                                        type = item.type
                                        customIndex = index
                                    } else if (
                                        item.content.surface_type_val == '2' &&
                                        !item.content.choose_surface_list
                                    ) {
                                        this.$message.error(this.L('请添加封面'))
                                        validateResult = false
                                        type = item.type
                                        customIndex = index
                                    }
                                }
                            }
                            if (!validateResult) return
                        })
                    }
                    if (!validateResult) {
                        this.$store.dispatch('updateComponentId', type)
                        this.$store.dispatch('updateCustomIndex', customIndex)
                        break
                    }
                }
            }
            params.custom = custom

            if (!validateResult) {
                this.canSubmit = true
                return
            }
            this.request(customPageApi.addOrEditMicroPage, params)
                .then((res) => {
                    if (type == 1) {
                        this.$message.success(this.L('操作成功'), 1, () => {
                            // 保存成功后返回微页面列表页
                            this.$message.destroy()
                            this.backOpt()
                            this.canSubmit = true
                        })
                        if(this.source != 'appoint_activity') {
                            this.$store.dispatch('updateCustomPageList', true)
                        }
                    } else {
                        this.componentPreviewVisible = true
                        this.componentPreviewInfo = {
                            link_url: res.url,
                            link_code: res.image,
                        }
                        this.canSubmit = true
                    }
                    this.$store.dispatch('updateCustomIndex', -1)
                    this.$store.dispatch('updateComponentId', 'customPageIndex')
                })
                .catch((err) => {
                    this.canSubmit = true
                })
        },
        //获取id
        getPageId(){
            //预约装修页面
            if(this.$route.query.source == 'appoint_activity'){
                let params = {
                    source: this.$route.query.source,
                    source_id: this.$route.query.source_id,
                }
                this.request(customPageApi.getPageId, params).then((res) => {
                    this.pageId = res.page_id
                    this.pre_page_id = res.pre_page_id
                    this.getEditMicoPageOpt();
                })
            }else{
                //平台以及商家的自定义页面 
                this.pageId = this.$route.query.pageId;
                this.getEditMicoPageOpt();
            }
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
    list-style: none;
    padding: 12px 16px;
    background-color: #fff;
    border-bottom: 1px solid rgb(235, 237, 240);
    box-sizing: border-box;
}

.justify-end {
    justify-content: flex-end;
}

.pages >>> .ant-tabs-bar {
    margin-bottom: 0 !important;
}

.customContent {
    overflow-y: auto;
}

.customPreview {
    background: #f6f7f9;
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
    width: 5px;
    /*滚动条宽度*/
    height: 5px;
    /*滚动条高度*/
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
    border-radius: 10px;
    /*滚动条的背景区域的圆角*/
    background-color: transparent;
    /*滚动条的背景颜色*/
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    /*滚动条的圆角*/
    background-color: rgba(0, 0, 0, 0.15);
    /*滚动条的背景颜色*/
}
</style>
