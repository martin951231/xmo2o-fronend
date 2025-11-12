<template>
    <div v-if="custom && custom.length" class="customPage-preview-wrap" id="previewContentWrap">
        <draggable v-model="custom" @change="draggableChange" v-bind="dragOptions" :disabled="componentId == 'onlineService'" >
            <transition-group class="flex flex-wrap draggable-wrap" type="transition" name="flip-list">
                <div
                    v-for="(item, index) in custom"
                    :key="index"
                    class="components-wrap"
                    :id="
                        (componentId == item.type && customIndex == index) || currentIndex == index ? 'componentId' : ''
                    "
                    :class="{
                        active: componentId == item.type && customIndex == index,
                        'active-dashed': currentIndex == index && isCompontentHover,
                        'online-ser-style': item.type == 'onlineService',
                    }"
                    @click="compontentClickOpt(item, index)"
                    @mouseenter="compontentHover($event, item, index)"
                    @mouseleave="compontentLeave()"
                >
                    <component :is="item.type" :content="{...item.content,componentId:item.type}"></component>
                    <div
                        class="components-del-wrap"
                        v-if="(componentId == item.type && customIndex == index) || currentIndex == index"
                    >
                        <div class="flex align-center justify-between components-del-content">
                            <span>{{ item.label }}</span>
                            <div class="components-del-icon pointer" @click.stop="delOpt(index)">
                                <img src="@/assets/customPage/componentsDelIcon.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </transition-group>
        </draggable>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import enterStorePreview from '@/views/common/customPage/modules/customPreview/customPage/enterStorePreview'
import couponPreview from '@/views/common/customPage/modules/customPreview/customPage/couponPreview'
import marketingActivitiesPreview from '@/views/common/customPage/modules/customPreview/customPage/marketingActivitiesPreview'
import mallActivitiesPreview from '@/views/common/customPage/modules/customPreview/customPage/mallActivitiesPreview'
import mallGoodsSearchPreview from '@/views/common/customPage/modules/customPreview/customPage/mallGoodsSearchPreview'
import magicSquarePreview from '@/views/common/customPage/modules/customPreview/customPage/magicSquarePreview'
import mallGoodsPreview from '@/views/common/customPage/modules/customPreview/customPage/mallGoodsPreview'
import shopModulesPreview from '@/views/common/customPage/modules/customPreview/customPage/shopModulesPreview'
import titleTextPreview from '@/views/common/customPage/modules/customPreview/customPage/titleTextPreview'
import richTextPreview from '@/views/common/customPage/modules/customPreview/customPage/richTextPreview'
import textNavPreview from '@/views/common/customPage/modules/customPreview/customPage/textNavPreview'
import helpLinePreview from '@/views/common/customPage/modules/customPreview/customPage/helpLinePreview'
import helpBlankPreview from '@/views/common/customPage/modules/customPreview/customPage/helpBlankPreview'
import imgAdverPreview from '@/views/common/customPage/modules/customPreview/customPage/imgAdverPreview'
import picNavPreview from '@/views/common/customPage/modules/customPreview/customPage/picNavPreview'
import customVideoPreview from '@/views/common/customPage/modules/customPreview/customPage/customVideoPreview'
import customModulePreview from '@/views/common/customPage/modules/customPreview/customPage/customModulePreview'
import onlineServicePreview from '@/views/common/customPage/modules/customPreview/customPage/onlineServicePreview'
import noticePreview from '@/views/common/customPage/modules/customPreview/customPage/noticePreview'
import contactStorePreview from '@/views/common/customPage/modules/customPreview/customPage/contactStorePreview'
import storeMapPreview from '@/views/common/customPage/modules/customPreview/customPage/storeMapPreview'
import storeHeaderPreview from '@/views/common/customPage/modules/customPreview/customPage/storeHeaderPreview'
import appointGoodsSearchPreview from '@/views/common/customPage/modules/customPreview/customPage/appointGoodsSearchPreview.vue'
import appointGoodsPreview from '@/views/common/customPage/modules/customPreview/customPage/appointGoodsPreview.vue'
// 预览组件
const components = {
    draggable: draggable,
    enterStore: enterStorePreview,
    coupon: couponPreview,
    marketingActivities: marketingActivitiesPreview,
    mallLimited: mallActivitiesPreview,
    mallBargain: mallActivitiesPreview,
    mallGroup: mallActivitiesPreview,
    mallPeriod: mallActivitiesPreview,
    mallGoodsSearch: mallGoodsSearchPreview,
    shopGoodsSearch: mallGoodsSearchPreview,
    magicSquare: magicSquarePreview,
    mallGoods: mallGoodsPreview,
    shopModules: shopModulesPreview,
    shopGoods: mallGoodsPreview,
    titleText: titleTextPreview,
    richText: richTextPreview,
    textNav: textNavPreview,
    helpLine: helpLinePreview,
    helpBlank: helpBlankPreview,
    imgAdver: imgAdverPreview,
    picNav: picNavPreview,
    customVideo: customVideoPreview,
    customModule: customModulePreview,
    onlineService: onlineServicePreview,
    notice: noticePreview,
    contactStore: contactStorePreview,
    storeMap: storeMapPreview,
    storeHeader: storeHeaderPreview,
    appointGoodsSearch: appointGoodsSearchPreview,
    appointGoods: appointGoodsPreview,
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
    },
    watch: {
        // 监听页面视图是否需要更新滚动距离
        '$store.state.customPage.pageScroll': {
            immediate: true,
            handler(val) {
                if (val == true) {
                    this.getOffsetTop()
                }
            },
        },
    },
    methods: {
        // 预览组件点击
        compontentClickOpt(currentItem, currentIndex) {
            this.$store.dispatch('updateCustomIndex', currentIndex)
            this.$store.dispatch('updateComponentId', currentItem.type)
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
            if (e && e.target && e.target.className && e.target.className.indexOf('active') != -1) return
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
            let pageInfo = this.$store.state.customPage.pageInfo
            let { custom = [] } = pageInfo
            if (custom.length) {
                custom.forEach((item, index) => {
                    if (item.isSelected) {
                        this.$store.dispatch('updateCustomIndex', index)
                        this.$store.dispatch('updateComponentId', item.type)
                        this.compontentClickOpt(item,index)
                    }
                })
            }
        },
        // 页面滚动距离
        getOffsetTop() {
            this.$nextTick(() => {
                let targetbox = document.getElementById('componentId')
                if (targetbox) {
                    this.$emit('scrollTopOpt', targetbox.offsetTop)
                    this.$store.dispatch('updatePageScroll', false)
                }
            })
        },
    },
}
</script>

<style scoped>
.draggable-wrap {
    display: inline-block;
    width: 100%;
    min-height: 667px;
}
.components-wrap {
    position: relative;
    width: 100%;
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
