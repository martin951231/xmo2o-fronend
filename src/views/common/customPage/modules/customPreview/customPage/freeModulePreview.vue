<template>
    <div
        class="freeModule-wrap bg-ff"
        :style="{
            'background-color': content.bg_type == '1' ? content.bg_val : '#ffffff',
            'background-image': content.bg_type == '2' ? `url(${content.bg_val})` : '',
            'border-radius': content.border_radius == '1' ? '10px' : '0',
            padding: content.show_distance == '1' ? '10px' : '10px 0',
            'min-height': content.list && content.list.length ? 'auto' : '200px',
        }"
        :class="{
            'box-shadow-style': content.style_type == '1',
        }"
    >
        <draggable v-model="content.list" @change="draggableChange" tag="div" v-bind="dragOptions">
            <template v-for="(item, index) in content.list">
                <div
                    draggable="true"
                    :key="index"
                    @click.stop="compontentClickOpt(item, index)"
                    class="freeModule-component"
                    :class="{
                        active: customIndex == parentCustomIndex && subCustomIndex == index,
                    }"
                >
                    <component :is="item.type" :content="item.content"></component>
                    <div class="components-del-wrap" v-if="customIndex == parentCustomIndex && subCustomIndex == index">
                        <div class="flex align-center justify-between components-del-content">
                            <span>{{ item.label }}</span>
                            <div class="components-del-icon pointer" @click.stop="delOpt(item, index)">
                                <img src="@/assets/customPage/componentsDelIcon.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </draggable>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import magicSquarePreview from '@/views/common/customPage/modules/customPreview/customPage/magicSquarePreview'
import titleTextPreview from '@/views/common/customPage/modules/customPreview/customPage/titleTextPreview'
import hotWordsPreview from '@/views/common/customPage/modules/customPreview/customPage/hotWordsPreview'
import swiperNavPreview from '@/views/common/customPage/modules/customPreview/customPage/swiperNavPreview'
import porcelainAreaPreview from '@/views/common/customPage/modules/customPreview/customPage/porcelainAreaPreview'
import swiperPicPreview from '@/views/common/customPage/modules/customPreview/customPage/swiperPicPreview'
// 预览组件
const components = {
    draggable: draggable,
    magicSquare: magicSquarePreview,
    titleText: titleTextPreview,
    hotWords: hotWordsPreview,
    swiperNav: swiperNavPreview,
    porcelainArea: porcelainAreaPreview,
    swiperPic: swiperPicPreview,
}
export default {
    props: {
        content: {
            type: [String, Object],
            default: '',
        },
        parentCustomIndex: {
            type: [String, Number],
            default: '',
        },
    },
    components,
    data() {
        return {}
    },
    computed: {
        dragOptions() {
            return {
                group: 'freeModule',
                ghostClass: 'ghost',
                animation: 150,
                fallbackOnBody: true,
                swapThreshold: 0.65,
            }
        },
        componentId() {
            return this.$store.state.customPage.componentId
        },
        subCustomIndex() {
            return this.$store.state.customPage.subCustomIndex
        },
        customIndex() {
            return this.$store.state.customPage.customIndex
        },
    },
    methods: {
        // 拖拽change
        draggableChange(e) {
            // console.log('draggableChange----e', e)
            if (e && e.moved) {
                this.$store.dispatch('updateSubCustomIndex', e.moved.newIndex)
            }
        },
        // 预览组件点击
        compontentClickOpt(currentItem, currentIndex) {
            // console.log('自由组件点击---currentItem', currentItem)
            // console.log('自由组件点击---currentIndex', currentIndex)
            this.$store.dispatch('updateSubCustomIndex', currentIndex)
            this.$store.dispatch('updateComponentId', currentItem.type)
            this.$store.dispatch('updateCustomIndex', this.parentCustomIndex)
        },
        // 删除
        delOpt(currentItem, currentIndex) {
            let custom = this.$store.state.customPage.pageInfo.custom || [],
                pageInfo = this.$store.state.customPage.pageInfo
            if (custom.length) {
                custom = custom.map((item, index) => {
                    if (item.type == 'freeModule' && index == this.parentCustomIndex) {
                        if (item.content && item.content.list && item.content.list.length) {
                            item.content.list.splice(currentIndex, 1)
                        }
                        this.$set(pageInfo, 'custom', custom)
                        this.$store.dispatch('updatePageInfo', pageInfo)
                        this.$store.dispatch('updateComponentId', '')
                        this.$store.dispatch('updateCustomIndex', -1)
                        this.$store.dispatch('updateSubCustomIndex', -1)
                    }
                })
            }
        },
    },
}
</script>

<style scoped>
.freeModule-wrap {
    box-sizing: border-box;
    background-position: left top;
    background-repeat: no-repeat;
    background-size: 100%;
    box-sizing: border-box;
    padding: 10px 0;
}
.box-shadow-style {
    box-shadow: 0 2px 16px 0 rgba(203, 203, 203, 0.6);
}
.freeModule-component {
    position: relative;
    z-index: 6;
}
.freeModule-component.active::after {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    content: '';
    border: 2px solid #1890ff;
    box-sizing: border-box;
    cursor: move;
    z-index: 6;
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
</style>