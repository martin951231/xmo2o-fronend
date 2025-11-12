<template>
    <!-- 分类装修 -->
    <div class="pages bg-ff flex flex-column">
        <!-- 页头 -->
        <div class="pageHeader">
            <span> {{ L('分类页面装修') }} </span>
            <div>
                <a-button class="ml-20" type="primary" @click="submitOpt()">{{ L('保存') }}</a-button>
            </div>
        </div>
        <!-- 主页装修 -->
        <div class="flex-1 flex justify-between customContent">
            <!-- 左侧组件 -->
            <div class="bg-ff componentPage">
                <catCustomPageComponents></catCustomPageComponents>
            </div>
            <!-- 中间预览区域 -->
            <div class="flex-1 customPreview">
                <preview></preview>
            </div>
            <!-- 组件装修表单 -->
            <decorate></decorate>
        </div>
    </div>
</template>

<script>
import preview from '@/views/common/customPage/modules/customPreview/preview'
import decorate from '@/views/common/customPage/modules/customDecorate/decorate'
import catCustomPageComponents from '@/views/common/customPage/modules/customComponents/catCustomPageComponents'
import customPageApi from '@/api/common/platform/customPage'
import validate from './modules/common/validate.js'
export default {
    components: {
        preview, // 中间预览区域
        decorate, // 组件装修
        catCustomPageComponents, // 分类装修组件
    },
    data() {
        return {
            // 来源 index-平台首页，category-店铺分类
            source: this.$route.query.source || '',
            source_id: this.$route.query.source_id || '0',
            formData: {
                source: this.$route.query.source || '',
                source_id: this.$route.query.source_id || '0',
                cat_fid: '0',
                cat_name: '',
            },
            defaultComponents: [
                // 没有装修的页面默认显示的组件
                'categoryHeader',
                'swiperNav',
                'porcelainArea',
                'swiperPic',
                'feedModule',
            ],
            canSubmit: true,
        }
    },
    computed: {
        pageInfo() {
            return this.$store.state.customPage.pageInfo
        },
        componentsList() {
            return this.$store.state.customPage.componentsList
        },
    },
    created() {
        this.$store.dispatch('updatePageType', 'catCustomPage')
        this.$store.dispatch('updateSource', {
            source: this.$route.query.source || '',
            source_id: this.$route.query.source_id || '0',
        })
    },
    mounted() {
        this.getEditMicoPageOpt()
    },
    methods: {
        // 获取微页面信息
        getEditMicoPageOpt() {
            let params = {
                source: this.source,
                source_id: this.source_id,
            }
            this.request(customPageApi.getDiypageDetail, params).then((res) => {
                this.$set(this.formData, 'cat_fid', res.cat_fid)
                this.$set(this.formData, 'cat_name', res.cat_name)

                let custom = res && res.custom ? res.custom : []
                if (custom.length) {
                    // 已装修
                    res.custom = custom.map((item, index) => {
                        let componentLabelAndRules = this.getComponentLabelAndRules(item.type)
                        if (componentLabelAndRules.rules) {
                            item.rules = componentLabelAndRules.rules
                        }
                        item.label = componentLabelAndRules.label
                        item.fixed = componentLabelAndRules.fixed
                        if (item.type == 'categoryHeader') {
                            if (item.content) {
                                item.content.page_title = res.cat_name
                                this.$store.dispatch('updatePageMainColor', item.content.main_color)
                            }
                            this.$store.dispatch('updateComponentId', 'categoryHeader')
                            this.$store.dispatch('updateCustomIndex', index)
                        }
                        return item
                    })
                    res.custom.forEach((item) => {
                        if (item.fixed == 'top') {
                            res.custom.splice(0, 1, item)
                        }
                        if (item.fixed == 'bottom') {
                            res.custom.splice(res.custom.length - 1, 1, item)
                        }
                    })

                    this.$store.dispatch('updatePageInfo', res)
                } else {
                    // 未装修
                    this.initFormData()
                }
            })
        },
        // 未装修默认组件
        initFormData() {
            let custom = this.formData.custom || []
            let defaultComponents = JSON.parse(JSON.stringify(this.defaultComponents))
            let isHasCategoryHeader = false
            if (this.formData && this.formData.cat_fid && Number(this.formData.cat_fid) > 0) {
                defaultComponents = this.defaultComponents.filter((item) => {
                    if (item == 'categoryHeader' || item == 'swiperPic' || item == 'feedModule') {
                        return item
                    }
                })
            }
            if (!custom.length && this.componentsList.length) {
                this.componentsList.forEach((item, index) => {
                    if (defaultComponents.indexOf(item.type) != -1) {
                        custom.push(item)
                    }
                })
                custom.forEach((item, index) => {
                    // 子分类装修
                    if (this.formData && this.formData.cat_fid && Number(this.formData.cat_fid) > 0) {
                        if (item.fixed == 'top') {
                            custom.splice(0, 1, item)
                        }
                        if (item.fixed == 'bottom') {
                            custom.splice(custom.length - 1, 1, item)
                        }
                    }

                    if (item.type == 'categoryHeader' && item.content) {
                        if (item.content.main_color) {
                            this.$store.dispatch('updatePageMainColor', item.content.main_color)
                        }
                        if (this.formData.cat_name) {
                            item.content.page_title = this.formData.cat_name
                        }

                        isHasCategoryHeader = true
                        this.$store.dispatch('updateComponentId', 'categoryHeader')
                        this.$store.dispatch('updateCustomIndex', index)
                        if (this.formData.cat_fid && Number(this.formData.cat_fid) > 0) {
                            isHasCategoryHeader = false
                        }
                    }
                })
                this.$set(this.formData, 'custom', custom)
                this.$store.dispatch('updatePageInfo', this.formData)

                if (!isHasCategoryHeader) {
                    this.$store.dispatch('updateComponentId', custom[0].type)
                    this.$store.dispatch('updateCustomIndex', 0)
                }
            }
        },
        // 返回
        backOpt() {
            history.go(-1)
        },
        // 组件编辑时获取对应组件的label和rules
        getComponentLabelAndRules(type) {
            let componentsList = this.componentsList
            let rules = [],
                label = '',
                fixed = ''
            componentsList.forEach((item) => {
                if (item.type == type) {
                    if (item.rules) {
                        rules = item.rules
                    }
                    label = item.label
                    fixed = item.fixed
                }
            })
            return {
                rules,
                label,
                fixed,
            }
        },
        // 保存
        submitOpt() {
            if (!this.canSubmit) return
            this.canSubmit = false
            let params = {
                source: this.$route.query.source || '',
                source_id: this.$route.query.source_id || '0',
            }

            let validateResult = true,
                validateSubResult = true
            // 自定义内容处理 只要type和content字段
            let custom = this.pageInfo.custom || []
            if (custom.length) {
                custom = custom.map((item) => {
                    let { type, content } = item
                    let page_distance = 0
                    // 自由区块页面边距及自由区块内组件页面边距处理
                    if (type == 'freeModule') {
                        if (content && content.show_distance && content.show_distance == '1' && content.page_distance) {
                            page_distance = Number(content.page_distance)
                        }
                        let list = content.list || []
                        if (list.length) {
                            list = list.map((listItem) => {
                                let listContent = listItem.content || ''
                                if (listContent.show_distance && listContent.show_distance == '1') {
                                    listContent.page_distance = Number(listContent.page_distance)
                                } else {
                                    listContent.page_distance = Number(page_distance)
                                }
                                return listItem
                            })
                        }
                    }
                    let obj = {}
                    obj.type = type
                    obj.content = content
                    return obj
                })

                let index = custom.findIndex(item => {
                    return item.type == 'swiperNav' && (!item.content || (item.content && !item.content.list))
                })
                if(index != -1) {
                    this.$delete(custom,index)
                }

                for (let i = 0; i < custom.length; i++) {
                    let type = custom[i].type
                    let content = custom[i].content || ''

                    // 自由区块校验
                    if (type === 'freeModule') {
                        let rules = validate.getRules(this.pageInfo.custom, type)
                        if (rules.length) {
                            let res = validate.validateCheck(content, rules)
                            if (!res.isOk) {
                                this.$message.error(this.L(res.errmsg))
                                validateResult = false
                            }
                            if (!validateResult) {
                                this.$store.dispatch('updateComponentId', type)
                                this.$store.dispatch('updateCustomIndex', i)
                                this.$store.dispatch('updateSubCustomIndex', -1)
                                break
                            }
                        }
                        if (content && content.list && content.list.length) {
                            let list = content.list
                            for (let j = 0; j < list.length; j++) {
                                let subType = list[j].type
                                let subContent = list[j].content || ''
                                let subRules = validate.getRules(list, subType)
                                if (subRules.length) {
                                    let subRes = validate.validateCheck(subContent, subRules)
                                    if (!subRes.isOk) {
                                        this.$message.error(this.L(subRes.errmsg))
                                        validateSubResult = false
                                    }
                                }
                                if (!validateSubResult) {
                                    this.$store.dispatch('updateComponentId', subType)
                                    this.$store.dispatch('updateCustomIndex', i)
                                    this.$store.dispatch('updateSubCustomIndex', j)
                                    break
                                }
                            }
                        }
                    } else {
                        // 其他组件校验
                        let rules = validate.getRules(this.pageInfo.custom, type)
                        if (rules.length) {
                            let res = validate.validateCheck(content, rules)
                            if (!res.isOk) {
                                this.$message.error(this.L(res.errmsg))
                                validateResult = false
                            }
                            if (!validateResult) {
                                this.$store.dispatch('updateComponentId', type)
                                this.$store.dispatch('updateCustomIndex', i)
                                this.$store.dispatch('updateSubCustomIndex', -1)
                                break
                            }
                        }
                    }
                }
            }
            params.custom = custom

            if (!validateResult || !validateSubResult) {
                this.canSubmit = true
                return
            }
            this.request(customPageApi.saveDiypage, params)
                .then((res) => {
                    console.log('微页面添加/编辑提交res：', res)
                    this.$message.success(this.L('操作成功'), 1, () => {
                        // 保存成功后返回微页面列表页
                        this.$message.destroy()
                        this.canSubmit = true
                    })
                })
                .catch((err) => {
                    this.canSubmit = true
                })
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
