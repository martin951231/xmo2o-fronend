<template>
    <div class="customPageComponentsWrap">
        <div class="flex flex-wrap width-100">
            <draggable
                v-model="list"
                class="width-100"
                :options="draggableOptions"
                :move="draggableMove"
                @end="draggableEnd"
            >
                <transition-group class="width-100">
                    <div
                        v-for="(subItem, subIndex) in list"
                        :key="subIndex"
                        :id="subItem.type"
                        @mouseup="componentsSelectOpt(subItem, subIndex)"
                        class="subItem"
                    >
                        <div
                            class="subItemContent flex align-center justify-between pointer text-wrap"
                            :class="{
                                active: componentId == subItem.type,
                            }"
                        >
                            <IconFont :type="subItem.icon" class="subItemIcon" />
                            <span class="subItemLabel text-wrap">{{ subItem.label }}</span>
                        </div>
                    </div>
                </transition-group>
            </draggable>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { collapse } from 'ant-design-vue'
Vue.use(collapse)
import IconFont from '@/utils/icon'
import draggable from 'vuedraggable'
import customPageApi from '@/api/common/platform/customPage'
import customPageDecorateData from './customPageDecorateData.js'
export default {
    components: {
        IconFont,
        draggable,
    },
    data() {
        return {
            list: [], // 装修组件
            draggableOptions: {
                group: {
                    name: 'customPage',
                    pull: 'clone',
                },
                sort: false,
            },
            draggedElement: '', // 被拖拽的元素
            relatedIndex: -1, // 将要停靠的元素index
        }
    },
    computed: {
        componentId() {
            return this.$store.state.customPage.componentId
        },
        customIndex() {
            return this.$store.state.customPage.customIndex
        },
        componentsList() {
            return this.$store.state.customPage.componentsList
        },
        sourceInfo() {
            return this.$store.state.customPage.sourceInfo
        },
        // 是否为子分类装修
        catInfo() {
            let pageInfo = this.$store.state.customPage.pageInfo
            let info = {
                cat_id: pageInfo.source_id || '',
                cat_name: pageInfo.cat_name || '',
                cat_fid: pageInfo.cat_fid || '0',
            }
            return info
        },
    },
    mounted() {
        this.getComponentsList()
    },
    methods: {
        // 获得装修组件
        getComponentsList() {
            let params = {
                source: this.sourceInfo.source || '',
                source_id: this.sourceInfo.source_id || '',
            }
            this.request(customPageApi.getDiypageModel, params).then((res) => {
                this.list = res.list || []
                if (this.list.length) {
                    this.initComponentsList()
                }
            })
        },
        // 初始化组件装修字段和校验规则
        initComponentsList() {
            let isHasCategoryHeader = false
            if (customPageDecorateData && customPageDecorateData.length && this.list.length) {
                this.list = this.list.map((item, index) => {
                    customPageDecorateData.forEach((contentItem) => {
                        if (item.type && contentItem.type && item.type == contentItem.type) {
                            if (contentItem.content) {
                                this.$set(item, 'content', contentItem.content)
                            }

                            if (contentItem.rules) {
                                this.$set(item, 'rules', contentItem.rules)
                            }

                            if (item.type == 'categoryHeader') {
                                isHasCategoryHeader = true
                                this.$store.dispatch('updateComponentId', 'categoryHeader')
                                this.$store.dispatch('updateCustomIndex', index)
                            }

                            if (this.catInfo.cat_fid != 0) {
                                isHasCategoryHeader = false
                            }
                        }
                    })
                    return item
                })
                this.$store.dispatch('updateComponentsList', this.list)
                if (!isHasCategoryHeader) {
                    this.$store.dispatch('updateComponentId', this.list[0].type)
                    this.$store.dispatch('updateCustomIndex', 0)
                }
            }
        },
        // 更新组件id和组件index
        componentsSelectOpt(subItem, subIndex) {
            let pageInfo = this.$store.state.customPage.pageInfo
            let custom = pageInfo && pageInfo.custom ? JSON.parse(JSON.stringify(pageInfo.custom)) : []
            let customIndex = this.customIndex + 1
            let isAddComponent = true

            // 头部与feed流与热搜词固定位置，且不可重复添加
            if (subItem.type == 'categoryHeader' || subItem.type == 'feedModule') {
                isAddComponent = false
            } else {
                if (subItem.type == 'hotWords' && this.checkDecorateComponents(subItem.type)) {
                    isAddComponent = false
                }
            }
            if (!isAddComponent) {
                custom.forEach((item, index) => {
                    if (item.type == subItem.type) {
                        customIndex = index
                    }
                })
            } else {
                if (subItem.type == 'hotWords') {
                    customIndex = 1
                } else {
                    if (this.customIndex == -1) {
                        customIndex = custom.length - 1
                    } else {
                        if (
                            this.checkDecorateComponents('hotWords') &&
                            (this.customIndex == 0 || this.customIndex == 1)
                        ) {
                            customIndex = this.customIndex == 0 ? this.customIndex + 2 : this.customIndex + 1
                        }

                        // 获取当前选中的组件信息，如果是固定底部的组件
                        let componentInfo = this.getComponentInfo(this.componentId)
                        if (componentInfo && componentInfo.fixed == 'bottom') {
                            customIndex = custom.length - 1
                        }
                    }
                }
                custom.splice(customIndex, 0, subItem)
            }
            this.$set(pageInfo, 'custom', custom)
            this.$store.dispatch('updateComponentId', subItem.type)
            this.$store.dispatch('updateCustomIndex', customIndex)
            this.$store.dispatch('updatePageInfo', pageInfo)
            this.$store.dispatch('updateSubCustomIndex', -1)
        },
        // 拖拽移动
        draggableMove(e, originalEvent) {
            // console.log('draggableMove---e---组件', e)
            // console.log('draggableMove---originalEvent---组件', originalEvent)
            // 将要停靠的元素
            let relatedContext = e.relatedContext.element
            // 被拖拽的元素
            let draggedContext = e.draggedContext.element

            // 不允许停靠
            if (relatedContext && (relatedContext.fixed || relatedContext.type == 'hotWords')) return false

            // 不允许拖拽
            if (draggedContext && draggedContext.fixed) return false

            // 已经装修过hotwords
            if (draggedContext.type == 'hotWords' && this.checkDecorateComponents(draggedContext.type)) return false

            // 没有装修过hotwords
            if (draggedContext.type == 'hotWords' && !this.checkDecorateComponents(draggedContext.type)) {
                if (e.relatedContext.index != 1) {
                    return false
                } else {
                    let pageInfo = this.$store.state.customPage.pageInfo
                    let custom = pageInfo.custom || []
                    if (custom && custom.length) {
                        custom.splice(1, 0, draggedContext)
                    }
                    this.$set(pageInfo, 'custom', custom)
                    this.$store.dispatch('updatePageInfo', pageInfo)
                    return false
                }
            }

            if (relatedContext.type == 'freeModule') {
                if (draggedContext.type == 'hotWords' || draggedContext.type == 'freeModule' || draggedContext.fixed)
                    return false
                this.draggedElement = draggedContext
                this.relatedIndex = e.relatedContext.index
                return false
            }
            this.$store.dispatch('updateCustomIndex', e.relatedContext.index + 1)
            this.$store.dispatch('updateComponentId', draggedContext.type)
            return true
        },
        // 拖拽结束
        draggableEnd(e) {
            // console.log('this.relatedIndex',this.relatedIndex)
            if (this.draggedElement && this.relatedIndex != -1) {
                let pageInfo = this.$store.state.customPage.pageInfo
                let custom = pageInfo.custom || []
                if (custom && custom.length) {
                    custom = custom.map((item, index) => {
                        if (item.type == 'freeModule' && index == this.relatedIndex && item.content) {
                            if (!item.content.list) {
                                item.content.list = []
                            }
                            item.content.list.push(this.draggedElement)
                        }
                        return item
                    })
                    this.$set(pageInfo, 'custom', custom)
                    pageInfo = JSON.parse(JSON.stringify(pageInfo))
                    this.$store.dispatch('updatePageInfo', pageInfo)
                    this.draggedElement = ''
                    this.relatedIndex = -1
                }
            }
        },
        // 判断是否装修了某个组件
        checkDecorateComponents(componentId) {
            let checkResult = false
            let pageInfo = this.$store.state.customPage.pageInfo
            let custom = pageInfo && pageInfo.custom ? JSON.parse(JSON.stringify(pageInfo.custom)) : []
            if (custom.length && componentId) {
                custom.forEach((item, index) => {
                    if (item.type == componentId) {
                        checkResult = true
                    }
                })
            }
            return checkResult
        },
        // 获取组件信息
        getComponentInfo(componentId) {
            let info = ''
            if (this.componentsList.length) {
                this.componentsList.forEach((item) => {
                    if (item.type == componentId) {
                        info = item
                    }
                })
            }
            return info
        },
    },
}
</script>

<style scoped>
.width-100 {
    width: 100%;
    box-sizing: border-box;
}
.customPageComponentsWrap {
    width: 160px;
    box-sizing: border-box;
}
.subItem {
    width: 100%;
    box-sizing: border-box;
}
.subItemContent {
    padding: 10px 0;
    width: 100%;
    height: 100%;
    background: #ffffff;
    color: #323233;
    box-sizing: border-box;
    font-size: 14px;
}
.subItemContent:hover,
.subItemContent.active {
    color: rgba(24, 144, 255, 1);
}
.subItemIcon {
    margin-right: 8px;
    font-size: 22px;
}
.subItemLabel {
    flex: 1;
    font-weight: 400;
}
</style>