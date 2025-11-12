<template>
    <div
        v-if="custom && custom.length"
        class="customPage-preview-wrap"
        :style="{
            background: 'linear-gradient(180deg, ' + getPageHeaderColor() + ' 30px,#FFFFFF 120px, #FFFFFF 100%)',
        }"
    >
        <!-- 子分类装修头部 -->
        <categoryHeader v-if="catInfo && catInfo.cat_fid && Number(catInfo.cat_fid) > 0"></categoryHeader>
        <draggable
            v-model="custom"
            @change="draggableChange"
            :move="draggableMove"
            v-bind="dragOptions"
            tag="div"
            group="customPage"
            filter=".forbid"
        >
            <transition-group class="flex draggable-wrap flex-column" type="transition" name="flip-list">
                <template v-for="(item, index) in custom">
                    <div
                        :key="index"
                        class="components-wrap"
                        :id="
                            (componentId == item.type && customIndex == index) || currentIndex == index
                                ? 'componentId'
                                : ''
                        "
                        :class="{
                            active: componentId == item.type && customIndex == index,
                            'active-dashed': currentIndex == index && isCompontentHover,
                            forbid: item.fixed && catInfo.cat_fid != 0,
                            'header-position': headerPosition && index == 1 && item.type != 'hotWords',
                        }"
                        @click="compontentClickOpt(item, index)"
                        @mouseenter="compontentHover($event, item, index)"
                        @mouseleave="compontentLeave()"
                    >
                        <component :is="item.type" :content="item.content" :parentCustomIndex="index"></component>
                        <div
                            class="components-del-wrap"
                            v-if="(componentId == item.type && customIndex == index) || currentIndex == index"
                        >
                            <div class="flex align-center justify-between components-del-content">
                                <span>{{ item.label }}</span>
                                <div
                                    class="components-del-icon pointer"
                                    @click.stop="delOpt(index)"
                                    v-if="getComponentsInfo(item.type).can_del == 1"
                                >
                                    <img src="@/assets/customPage/componentsDelIcon.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </transition-group>
        </draggable>
        <!-- 子分类装修feed -->
        <feedModule v-if="catInfo && catInfo.cat_fid && Number(catInfo.cat_fid) > 0"></feedModule>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import magicSquarePreview from '@/views/common/customPage/modules/customPreview/customPage/magicSquarePreview'
import titleTextPreview from '@/views/common/customPage/modules/customPreview/customPage/titleTextPreview'
import categoryHeaderPreview from '@/views/common/customPage/modules/customPreview/customPage/categoryHeaderPreview'
import hotWordsPreview from '@/views/common/customPage/modules/customPreview/customPage/hotWordsPreview'
import swiperNavPreview from '@/views/common/customPage/modules/customPreview/customPage/swiperNavPreview'
import porcelainAreaPreview from '@/views/common/customPage/modules/customPreview/customPage/porcelainAreaPreview'
import swiperPicPreview from '@/views/common/customPage/modules/customPreview/customPage/swiperPicPreview'
import feedModulePreview from '@/views/common/customPage/modules/customPreview/customPage/feedModulePreview'
import freeModulePreview from '@/views/common/customPage/modules/customPreview/customPage/freeModulePreview'
// 预览组件
const components = {
    draggable: draggable,
    magicSquare: magicSquarePreview,
    titleText: titleTextPreview,
    categoryHeader: categoryHeaderPreview,
    hotWords: hotWordsPreview,
    swiperNav: swiperNavPreview,
    porcelainArea: porcelainAreaPreview,
    swiperPic: swiperPicPreview,
    feedModule: feedModulePreview,
    freeModule: freeModulePreview,
}

export default {
    components,
    data() {
        return {
            currentIndex: -1,
            isCompontentHover: false, // 是否为鼠标滑入
        }
    },
    computed: {
        // 组件信息
        custom: {
            get: function () {
                return this.$store.state.customPage.pageInfo ? this.$store.state.customPage.pageInfo.custom : []
            },
            set: function (val) {
                let pageInfo = this.$store.state.customPage.pageInfo
                this.$set(pageInfo, 'custom', val)
                this.$store.dispatch('updatePageInfo', pageInfo)
            },
        },
        componentId() {
            this.getOffsetTop()
            return this.$store.state.customPage.componentId
        },
        customIndex() {
            this.getOffsetTop()
            return this.$store.state.customPage.customIndex
        },
        dragOptions() {
            return {
                animation: 300,
                group: 'customPage',
                disabled: false,
                ghostClass: 'ghost',
            }
        },
        pageType() {
            return this.$store.state.customPage.pageType
        },
        showFeedEmpty() {
            let show = true
            this.custom.forEach((item) => {
                if (item.type == 'feedModule' && item.list && item.list.length) {
                    show = false
                }
            })
            return show
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
        // 头部是否悬浮占位 1不占位 头部下面的组件需要margin-top:-64px;顶到页面顶部
        headerPosition() {
            let is_fixed = 0
            if (this.custom.length) {
                this.custom.forEach((item) => {
                    if (item.type == 'categoryHeader' && item.content) {
                        is_fixed = item.content.is_fixed
                    }
                })
            }
            return is_fixed == 1 ? true : false
        },
    },
    methods: {
        // 获取头部颜色
        getPageHeaderColor() {
            let pageHeaderColor = '#ffffff'
            if (this.custom.length) {
                this.custom.forEach((item) => {
                    if (item.type == 'categoryHeader' && item.content && item.content.bg_color) {
                        pageHeaderColor = item.content.bg_color
                    }
                })
            }
            return pageHeaderColor
        },
        // 预览组件点击
        compontentClickOpt(currentItem, currentIndex) {
            if (this.catInfo.cat_fid != 0 && currentItem.fixed) return
            this.$store.dispatch('updateCustomIndex', currentIndex)
            this.$store.dispatch('updateComponentId', currentItem.type)
            this.$store.dispatch('updateSubCustomIndex', -1)
            this.isCompontentHover = false
            let pageInfo = this.$store.state.customPage.pageInfo
            let { custom = [] } = pageInfo
            if (custom.length) {
                custom.forEach((item, index) => {
                    if (index == currentIndex) {
                        this.$set(custom[currentIndex], 'isSelected', true)
                    } else {
                        if (item.isSelected) {
                            this.$delete(item, 'isSelected')
                        }
                    }
                })
                pageInfo.custom = custom
            }
            this.$store.dispatch('updatePageInfo', pageInfo)
        },
        // 鼠标滑入
        compontentHover(e, currentItem, currentIndex) {
            if (this.catInfo.cat_fid != 0 && currentItem.fixed) return
            if (e && e.target && e.target.className && e.target.className.indexOf('active') != -1) {
                return
            }
            this.isCompontentHover = true
            this.currentIndex = currentIndex
        },
        // 鼠标滑离
        compontentLeave() {
            this.isCompontentHover = false
            this.currentIndex = -1
        },
        // 删除
        delOpt(currentIndex) {
            let custom = this.custom,
                pageInfo = this.$store.state.customPage.pageInfo
            custom.splice(currentIndex, 1)
            this.$set(pageInfo, 'custom', custom)
            this.$store.dispatch('updatePageInfo', pageInfo)
            this.$store.dispatch('updateComponentId', '')
            this.$store.dispatch('updateCustomIndex', -1)
        },
        // 拖拽change
        draggableChange(e) {
            // console.log('draggableChange----e', e)
            let pageInfo = this.$store.state.customPage.pageInfo
            let { custom = [] } = pageInfo
            if (custom.length) {
                custom.forEach((item, index) => {
                    if (item.isSelected) {
                        this.$store.dispatch('updateCustomIndex', index)
                        this.$store.dispatch('updateComponentId', item.type)
                    }
                })
            }
        },
        // 拖拽移动
        draggableMove(e, originalEvent) {
            console.log('draggableMove-e-预览', e)
            console.log('draggableMove-originalEvent-预览', originalEvent)

            // 将要停靠的元素
            let relatedContext = e.relatedContext.element
            // 被拖拽的元素
            let draggedContext = e.draggedContext.element
            console.log('relatedContext', relatedContext.type)
            console.log('draggedContext', draggedContext.type)

            // 不允许停靠
            if (relatedContext && (relatedContext.fixed || relatedContext.type == 'hotWords')) return false

            // 不允许拖拽
            if (draggedContext && (draggedContext.fixed || draggedContext.type == 'hotWords')) return false

            // 已经装修过hotwords
            if (draggedContext.type == 'hotWords' && this.checkDecorateComponents(draggedContext.type)) return false
            if (relatedContext.type == 'freeModule') return false

            return true
        },
        // 是否可以拖拽
        getComponentsInfo(componentId) {
            let componentsList = this.$store.state.customPage.componentsList || []
            let info = ''
            if (componentsList.length) {
                componentsList.forEach((item) => {
                    if (item.type == componentId) {
                        info = item
                    }
                })
            }
            return info
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
        // 页面滚动距离
        getOffsetTop() {
            this.$nextTick(() => {
                let targetbox = document.getElementById('componentId')
                if (targetbox) {
                    this.$emit('scrollTopOpt', targetbox.offsetTop)
                }
            })
        },
    },
}
</script>

<style scoped>
.customPage-preview-wrap {
    min-height: 667px;
}
.draggable-wrap {
    display: inline-block;
    width: 100%;
}
.components-wrap {
    position: relative;
    width: 100%;
    z-index: 1;
}
.header-position {
    margin-top: -64px;
    z-index: 0;
}
.components-wrap.active::after {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    content: '';
    border: 2px solid #1890ff;
    box-sizing: border-box;
    cursor: move;
    /* z-index: 5; */
}
.components-wrap.active-dashed::after {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    content: '';
    border: 2px dashed #1890ff;
    box-sizing: border-box;
    cursor: move;
    /* z-index: 5; */
}
.components-del-wrap {
    padding: 6px 8px;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(100%, 0);
    background: url(~@/assets/customPage/componentsDelBg.png) no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;
    font-size: 15px;
    font-weight: 400;
    color: #000000;
}
.components-del-content {
    min-width: 120px;
    padding: 6px 8px 6px 14px;
    box-sizing: border-box;
}
.components-del-icon {
    margin-left: 8px;
    padding-left: 8px;
    border-left: 1px solid rgba(230, 230, 230, 1);
    line-height: 1;
}
.ghost {
    /* opacity: 0.1; */
    background: #ffffff;
}
.online-ser-style {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    z-index: 100;
}
</style>