<template>
    <div class="customPageComponentsWrap">
        <div class="pageTitle mb-10 pointer">{{ L('微页面装修组件') }}</div>
        <div v-for="(item, index) in componentsList" :key="index" class="componentsWrap">
            <div class="flex align-center justify-between title pointer" @click="showOpt(item, index)">
                <span class="titleText flex-1">{{ L(item.label) }}</span>
                <a-icon type="caret-up" class="titleIcon ml-10" :class="item.hide ? '' : 'rotateIcon'" />
            </div>
            <div class="flex flex-wrap width-100" :class="item.hide ? 'subItemWrapHide' : 'subItemWrap'">
                <draggable v-model="item.list" class="width-100">
                    <transition-group class="flex flex-wrap width-100">
                        <div
                            v-for="(subItem, subIndex) in item.list"
                            :key="subIndex"
                            @click="componentsSelectOpt(subItem, subIndex)"
                            class="subItem"
                        >
                            <div
                                class="subItemContent flex flex-column align-center justify-center pointer"
                                :class="{
                                    active: componentId == subItem.type,
                                }"
                            >
                                <IconFont :type="subItem.icon" class="subItemIcon" />
                                <span class="subItemLabel">{{ L(subItem.label) }}</span>
                            </div>
                        </div>
                    </transition-group>
                </draggable>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { collapse } from 'ant-design-vue'
Vue.use(collapse)
import IconFont from '@/utils/icon'
import draggable from 'vuedraggable'

export default {
    components: {
        IconFont,
        draggable,
    },
    data() {
        return {}
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
    },
    watch: {
        componentId: {
            deep: true,
            handler() {
                this.updateComponentsStatus()
            },
        },
    },
    methods: {
        // 手风琴
        showOpt(currentItem, currentIndex) {
            let item = JSON.parse(JSON.stringify(currentItem))
            item.hide = !item.hide
            let componentsList = this.componentsList
            this.$set(componentsList, currentIndex, item)
            this.$store.dispatch('updateComponentsList', componentsList)
        },
        // 更新组件id和组件index
        componentsSelectOpt(subItem, subIndex) {
            // 当前编辑组件仍可点击添加，取消限制，若要限制打开注释即可
            // if (this.componentId == subItem.type) return

            this.$store.dispatch('updateComponentId', subItem.type)
            let pageInfo = this.$store.state.customPage.pageInfo,
                custom = pageInfo && pageInfo.custom ? JSON.parse(JSON.stringify(pageInfo.custom)) : []

            // 是否已装修某个组件
            if (this.checkHasDecorate(subItem.type) && subItem.type == 'onlineService') {
                return
            }
            let customIndex = 0
            custom.push(subItem)
            customIndex = custom.length - 1

            this.$set(pageInfo, 'custom', custom)
            this.$store.dispatch('updateCustomIndex', customIndex)
            this.$store.dispatch('updatePageInfo', pageInfo)
        },
        // 更新组件选中状态
        updateComponentsStatus() {
            let componentsList = this.componentsList,
                componentId = this.$store.state.customPage.componentId || ''
            if (componentId) {
                componentsList.forEach((item, index) => {
                    if (item.list && item.list.length) {
                        item.list.forEach((subItem) => {
                            if (subItem.type == componentId) {
                                this.$set(componentsList[index], 'hide', false)
                                this.$store.dispatch('updateComponentsList', componentsList)
                            }
                        })
                    }
                })
            }
        },
        // 是否已装修某个组件
        checkHasDecorate(type) {
            let checkReault = false
            let custom = this.$store.state.customPage.pageInfo.custom || []
            if (custom.length) {
                checkReault = custom.filter((item, index) => {
                    if (item.type == type) {
                        this.$store.dispatch('updateCustomIndex', index)
                        return item
                    }
                }).length
            }
            return checkReault
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
.pageTitle {
    font-size: 14px;
    font-weight: bold;
    color: #1890ff;
}
.componentsWrap {
    width: 100%;
}
.title {
    padding: 10px 0;
}
.titleText {
    white-space: nowrap;
    font-size: 14px;
    font-weight: 400;
    color: #323233;
}
.titleIcon {
    font-size: 12px;
    color: RGBA(128, 132, 157, 1);
    transition: all 0.3s;
}
.rotateIcon {
    transform: rotate(180deg);
    transition: all 0.3s;
}
.subItemWrap {
    padding: 10px 0;
    height: auto;
    opacity: 1;
    transition: all 0.3s;
}
.subItemWrapHide {
    height: 0;
    opacity: 0;
    overflow: hidden;
    transition: all 0.3s;
}
.subItem {
    padding: 5px;
    width: 50%;
    box-sizing: border-box;
}
.subItemContent {
    padding: 10px 0;
    width: 100%;
    height: 100%;
    background: #ffffff;
    color: #323233;
    box-sizing: border-box;
}
.subItemContent:hover,
.subItemContent.active {
    background: rgba(24, 144, 255, 1);
    color: #ffffff;
}
.subItemIcon {
    font-size: 32px;
}
.subItemLabel {
    margin-top: 8px;
    font-size: 12px;
    font-weight: 400;
}
</style>