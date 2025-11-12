<template>
    <div ref="wrap">
        <div
            class="decorate-cube flex"
            v-if="cudeSelectedShow"
            :style="{
                width: cubeWidth + 'px',
                height: contentHeight + 'px',
            }"
        >
            <div
                class="cube-row-wrap"
                :style="{
                    width: cubeWidth - Number(content.page_distance) * 2 + 'px',
                    height: contentHeight + 'px',
                    left: content.page_distance + 'px',
                }"
            >
                <div
                    class="cube-selected"
                    v-for="(item, index) in content.list"
                    :key="index + '_' + index"
                    :style="{
                        width: getCubeSelectedWidth(item) + 'px',
                        height: getCubeSelectedHeight(item) + 'px',
                        overflow: 'hidden',
                        top: getCubeSelectedTop(item) + 'px',
                        left: getCubeSelectedLeft(item) + 'px',
                    }"
                >
                    <img v-if="item.image" :src="item.image" style="width: 100%; height: 100%" alt="" />
                </div>
            </div>
        </div>

        <div v-else class="magic-square-wrap flex align-center justify-center flex-column">
            <img src="@/assets/customPage/magicSquareBg.png" alt="" />
            <span class="tips-text">{{ L('点击编辑魔方') }}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        content: {
            type: [String, Object],
            default: '',
        },
    },
    data() {
        return {
            cubeWidth: 375, //魔方宽度
            cubeHeight: 375, //魔方高度
        }
    },
    updated() {
        this.cubeWidth = this.$refs.wrap.clientWidth
        this.cubeHeight = this.$refs.wrap.clientWidth
    },
    computed: {
        //密度值
        densityNum() {
            let density = this.content.density || 2
            return parseInt(density)
        },
        //单元魔方高度
        cubeItemHeight() {
            return this.cubeHeight / this.densityNum
        },
        //单元魔方宽度
        cubeItemWidth() {
            return (this.cubeWidth - Number(this.content.page_distance) * 2) / this.densityNum
        },
        cudeSelectedShow() {
            let list = this.content && this.content.list && this.content.list.length ? this.content.list : []
            if (list.length) {
                list =
                    list.filter((item) => {
                        return item.image
                    }) || []
            }
            return list.length ? true : false
        },
        // 魔方占位高
        contentHeight() {
            let list = this.content && this.content.list && this.content.list.length ? this.content.list : []
            let cube_x = []
            if (list.length) {
                cube_x =
                    list.map((item) => {
                        return item.image ? Math.max(item.start.x, item.end.x) : ''
                    }) || []
            }
            let max_x = 0
            if (cube_x.length) {
                max_x =
                    cube_x.sort((a, b) => {
                        return a - b
                    })[cube_x.length - 1] - 0
            }
            return this.cudeSelectedShow ? max_x * this.cubeItemHeight : this.cubeHeight
        },
    },
    methods: {
        //计算选中层的宽度
        getCubeSelectedWidth(item) {
            return (
                (parseInt(item.end.y) - parseInt(item.start.y) + 1) * this.cubeItemWidth -
                Number(this.content.img_distance)
            )
        },
        //计算选中层的高度
        getCubeSelectedHeight(item) {
            return (
                (parseInt(item.end.x) - parseInt(item.start.x) + 1) * this.cubeItemHeight -
                Number(this.content.img_distance)
            )
        },
        //计算选中层的右边距离
        getCubeSelectedTop(item) {
            return (item.start.x - 1) * this.cubeItemHeight + Number(this.content.img_distance) / 2
        },
        //计算选中层的左边距离
        getCubeSelectedLeft(item) {
            return (item.start.y - 1) * this.cubeItemWidth + Number(this.content.img_distance) / 2
        },
    },
}
</script>

<style scoped>
.magic-square-wrap {
    width: 100%;
    height: 196px;
    font-size: 14px;
    font-weight: 400;
    color: #9a9a9c;
    background: #f1f3f5;
}
.tips-text {
    margin-top: 18px;
}
.decorate-cube {
    width: 100%;
    position: relative;
    overflow: hidden;
}
.decorate-cube .cube-selected {
    position: absolute;
    box-sizing: border-box;
}
.cube-row-wrap {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>