<template>
    <div v-if="formDataDecorate" class="magic-square-decorate-wrap">
        <!-- 组件描述 -->
        <componentDesc :content="desc"></componentDesc>

        <div class="content">
            <a-form-model
                :model="formDataDecorate"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :labelAlign="'left'"
            >
                <a-form-model-item :label="L('魔方密度')">
                    <a-select v-model="formDataDecorate.density" :placeholder="L('请选择')" @change="densityChange">
                        <a-select-option v-for="item in densityOptions" :key="item.value" :value="item.value">
                            {{ item.label }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <div class="width-100 mb-20">
                    <p class="cr-red">{{ L('魔方布局') }}</p>
                    <p class="ant-form-explain">{{ L('移动鼠标选定布局区域大小') }}</p>
                    <div class="decorate-cube mt-10 flex flex-wrap" @mouseleave.stop="clearSelecting()">
                        <ul class="cube-row" v-for="(n, nIndex) in densityNum" :key="nIndex">
                            <li
                                v-for="(i, iIndex) in densityNum"
                                :key="i + '_' + iIndex"
                                class="cube-item flex align-center justify-center"
                                :style="{
                                    width: cubeItemWidth + 'px',
                                    height: cubeItemHeight + 'px',
                                }"
                                :class="{
                                    'item-selecting': isSelecting(i, n),
                                    'item-selected': isSelected(i, n),
                                }"
                                :data-x="i"
                                :data-y="n"
                                @click="onClickCubeItem($event)"
                                @mouseenter="onEnterCubeItem($event)"
                            >
                                <a-icon type="plus" class="plus-icon" />
                            </li>
                        </ul>

                        <div
                            class="cube-selected"
                            v-for="(item, index) in formDataDecorate.list"
                            :key="index + '_' + index"
                            :style="{
                                width: getCubeSelectedWidth(item) + 'px',
                                height: getCubeSelectedHeight(item) + 'px',
                                top: getCubeSelectedTop(item) + 'px',
                                left: getCubeSelectedLeft(item) + 'px',
                            }"
                            :class="{
                                active: currentIndex == index,
                            }"
                            @click="currentCubeSelected(item, index)"
                        >
                            <div v-if="item" class="cube-selected-text flex justify-center align-center">
                                <span v-if="!item.image" style="user-select: none">
                                    {{
                                        Math.round(
                                            (750 / formDataDecorate.density) *
                                                (parseInt(item.end.y) - parseInt(item.start.y) + 1)
                                        )
                                    }}
                                    x
                                    {{
                                        Math.round(
                                            (750 / formDataDecorate.density) *
                                                (parseInt(item.end.x) - parseInt(item.start.x) + 1)
                                        )
                                    }}{{ L('像素或同等比例') }}
                                </span>
                                <img v-else :src="item.image" alt="" />
                            </div>
                            <div
                                class="close-icon"
                                v-show="currentIndex == index"
                                @click.stop="cubeSelectedDel(item, index)"
                            >
                                <a-icon type="close-circle" />
                            </div>
                        </div>
                    </div>
                    <p class="cr-red mt-10" v-show="tips">{{ tips }}</p>
                    <div
                        v-if="currentIndex != -1 && formDataDecorate.list && formDataDecorate.list.length"
                        class="mt-20 flex"
                    >
                        <div class="uploadImgWrap" @click="chooseImage()">
                            <div class="pointer imgwrap" v-if="formDataDecorate.list[currentIndex].image">
                                <img
                                    :src="formDataDecorate.list[currentIndex].image"
                                    alt=""
                                    style="max-width: 100%; min-height: 100%"
                                />
                                <span class="img-update">{{ L('更换图片') }}</span>
                            </div>
                            <div v-else class="flex align-center justify-center flex-column pointer imgwrap">
                                <a-icon type="plus" />
                                <span>{{ L('添加图片') }}</span>
                            </div>
                        </div>
                        <div class="flex-1 linkUrl">
                            <a-form-model-item :label="L('链接')">
                                <a-input
                                    v-model="formDataDecorate.list[currentIndex].link_url"
                                    type="textarea"
                                    autoSize
                                    style="resize: none"
                                ></a-input>
                                <a-button @click="getLinkUrl()">{{ L('链接库选择') }}</a-button>
                            </a-form-model-item>
                        </div>
                    </div>
                </div>
                <a-form-model-item :label="L('图片间隙')">
                    <a-row type="flex">
                        <a-col :span="17">
                            <a-slider v-model="formDataDecorate.img_distance" :max="30" :min="0" />
                        </a-col>
                        <a-col :span="6" :offset="1">
                            <a-input-number v-model="formDataDecorate.img_distance" :min="0" :max="30"></a-input-number>
                        </a-col>
                    </a-row>
                </a-form-model-item>
                <a-form-model-item :label="L('页面间距')">
                    <a-row type="flex">
                        <a-col :span="17">
                            <a-slider v-model="formDataDecorate.page_distance" :max="30" :min="0" />
                        </a-col>
                        <a-col :span="6" :offset="1">
                            <a-input-number
                                v-model="formDataDecorate.page_distance"
                                :min="0"
                                :max="30"
                            ></a-input-number>
                        </a-col>
                    </a-row>
                </a-form-model-item>
            </a-form-model>
        </div>

        <!-- 图片上传和历史图片 -->
        <choose-image
            ref="chooseImage"
            :max="1"
            :upload_dir="'/decorate/images'"
            :type="'image'"
            @callback="uploadCallback"
        />
    </div>
</template>

<script>

import componentDesc from '@/views/common/customPage/modules/common/componentDesc'
import ChooseImage from '@/components/ChooseImage/ChooseImage';
export default {
    components: {
        componentDesc,
        ChooseImage
    },
    props: {
        // 表单数据
        formContent: {
            type: [String,Object],
            default: ''
        }
    },
    data() {
        return {
            desc: {
                title: '魔方'
            },
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            formDataDecorate: '',
            densityOptions: [ // 魔方密度
                {
                    value: '2',
                    label: '2*2'
                },
                {
                    value: '4',
                    label: '4*4'
                },
                {
                    value: '5',
                    label: '5*5'
                },
                {
                    value: '6',
                    label: '6*6'
                },
                {
                    value: '7',
                    label: '7*7'
                },
                {
                    value: '8',
                    label: '8*8'
                },
                {
                    value: '9',
                    label: '9*9'
                }
            ],
            cubeWidth: 420, //魔方宽度
            cubeHeight: 420, //魔方高度
            cudeSelecting: {
                tempStart: null,
                tempEnd: null,
                start: null,
                end: null,
                data: []
            },
            currentIndex: -1,
            // 正在选择与已选层交集坐标xy
            cudeCommonCoord: []
        }
    },
    watch: {
        formDataDecorate: {
            deep: true,
            handler(val) {
                this.$emit('updatePageInfo',val)
            }
        }
    },
    computed:{
        //密度值
        densityNum(){
            let density = this.formDataDecorate.density || 2
            return parseInt(density);
        },
        //单元魔方高度
        cubeItemHeight(){
            return this.cubeHeight/this.densityNum;
        },
        //单元魔方宽度
        cubeItemWidth(){
            return this.cubeWidth/this.densityNum;
        },
        // 图片上传参数
        uploadData() {
            return {
                upload_dir: '/decorate/images',
                source: this.$store.state.customPage.sourceInfo.source,
                source_id: this.$store.state.customPage.sourceInfo.source_id,
                is_decorate: 1
            }
        },
        // 提示
        tips() {
            let text = ''
            if (!this.formDataDecorate.list || (this.formDataDecorate.list && !this.formDataDecorate.list.length)) {
                text = this.L('请选定布局大小')
            }

            if (this.currentIndex != -1 && this.formDataDecorate.list && this.formDataDecorate.list.length) {
                let current = this.formDataDecorate.list[this.currentIndex]
                let {image = '', link_url = ''} = current
                if (!image) {
                    text = this.L('请添加图片')
                }

                // 链接非必填
                // if (image && !link_url) {
                //     text = '请添加链接'
                // }
            }
            return text
        }
    },
    created() {
        if (this.formContent) {
            this.formDataDecorate = {}
            for (let k in this.formContent) {
                if (k == 'img_distance' || k == 'page_distance') {
                    this.formContent[k] = Number(this.formContent[k])
                }
                this.$set(this.formDataDecorate, k, this.formContent[k] )
            }
        }
    },
    methods: {
        // 模仿密度选择
        densityChange(e) {
            this.$set(this.formDataDecorate, 'list', [])
            this.clearSelecting()
            this.currentIndex = -1
        },
        // 获取开始和结束魔方坐标
        updateSelecting() {
            let tempStart = this.cudeSelecting.tempStart;
            let tempEnd = this.cudeSelecting.tempEnd;

            this.cudeSelecting.start = {
                x: Math.min(tempStart.x, tempEnd.x),
                y: Math.min(tempStart.y, tempEnd.y)
            };
            this.cudeSelecting.end = {
                x: Math.max(tempStart.x, tempEnd.x),
                y: Math.max(tempStart.y, tempEnd.y)
            };
        },
        // 清除正在选择的
        clearSelecting() {
            this.cudeSelecting.tempStart = null;
            this.cudeSelecting.tempEnd = null;
            this.cudeSelecting.start = null;
            this.cudeSelecting.end = null;
            this.cudeCommonCoord = []
        },
        // 获取魔方坐标
        coordFromCubeEvent(event) {
            let el = event.currentTarget;
            let x = el.getAttribute('data-x');
            let y = el.getAttribute('data-y');
            return { x: x, y: y };
        },
        // 魔方点击
        onClickCubeItem(event) {
            let domclass = event.currentTarget.getAttribute('class');
            this.currentIndex = -1
            if (-1 !== domclass.indexOf('item-selected')) {
                console.log("已经被占用");
                return;
            }

            let coord = this.coordFromCubeEvent(event);

            if (null == this.cudeSelecting.tempStart) {
                this.cudeSelecting.tempStart = coord;
                this.cudeSelecting.tempEnd = coord;
                this.cudeSelecting.start = coord;
                this.cudeSelecting.end = coord;
                return;
            }

            // 判断正在选择的魔方是否有已选的层
            if (!this.cudeCommonCoord.length) {
                this.cudeSelecting.tempEnd = coord;
            }

            this.updateSelecting();

            // 加入选中的
            let selectedItem = {
                'start': this.cudeSelecting.start,
                'end': this.cudeSelecting.end
            }

            let list = this.formDataDecorate.list || []
            this.cudeSelecting.data.splice(0)
            list.push(selectedItem)
            this.$set(this.formDataDecorate, 'list', list)
            this.currentIndex = list.length - 1
            this.clearSelecting()
        },
        // 魔方moveEnter
        onEnterCubeItem(event) {
            if (this.cudeSelecting.tempStart) {
                let coord = this.coordFromCubeEvent(event);

                // 判断当前选择的结束坐标是否已有已选的魔方，有则不设置临时结束坐标
                this.cudeCommonCoord = this.isCanSelect(coord.x,coord.y) || []
                if (this.cudeCommonCoord.length) return

                this.cudeSelecting.tempEnd = coord;

                this.updateSelecting();
            }
        },
        isContain(x, y, item) {
            return (item.start.x <= x
                && x <= item.end.x
                && item.start.y <= y
                && y <= item.end.y);
        },
        // 判断是否正在选择
        isSelecting(x, y) {
            let item = this.cudeSelecting;
            if (item.tempStart) {
                return this.isContain(x, y, item);
            }
            return false;
        },
        // 判断是否有已选择的层，是否可以选择
        isCanSelect(x, y) {
            let item = this.cudeSelecting;
            let cudeCommonCoord = []
            let list = this.formDataDecorate.list || []
            if (item.tempStart && list.length) {
                let tempStart = {
                    x: Math.min(item.tempStart.x, x),
                    y: Math.min(item.tempStart.y, y)
                }
                let tempEnd = {
                    x: Math.max(item.tempStart.x, x),
                    y: Math.max(item.tempStart.y, y)
                }

                // 正在选择的层坐标集合
                let tempSelecte = []
                for(let i=tempStart.x; i<=tempEnd.x; i++){
                    for(let j=tempStart.y; j<=tempEnd.y; j++){
                        tempSelecte.push(i+''+j)
                    }
                }

                // 已经选择的层
                list.forEach((item,index) => {
                    if (!item.dataCoord) {
                        item.dataCoord = []
                        for(let i=item.start.x; i<=item.end.x; i++){
                            for(let j=item.start.y; j<=item.end.y; j++){
                                item.dataCoord.push(i+''+j)
                            }
                        }
                    }

                    if (item.dataCoord && item.dataCoord.length) {
                        // 获取已选层和正在选择层的交集坐标
                        tempSelecte.forEach((num) => {
                            if (item.dataCoord.indexOf(num) !== -1) {
                                cudeCommonCoord.push(num)
                            }
                        })
                    }
                })
            }
            return cudeCommonCoord
        },
        //判断是否已经选择。
        isSelected(x, y) {
            let list = this.formDataDecorate.list || [];
            for (let i = 0; i < list.length; i++) {
                if (this.isContain(x, y, list[i])) {
                    return true;
                }
            }
            return false;
        },
        //计算选中层的宽度
        getCubeSelectedWidth(item) {
            return (parseInt(item.end.y) - parseInt(item.start.y) + 1) * this.cubeItemWidth
        },
        //计算选中层的高度
        getCubeSelectedHeight(item) {
            return (parseInt(item.end.x) - parseInt(item.start.x) + 1) * this.cubeItemHeight
        },
        //计算选中层的top距离
        getCubeSelectedTop(item) {
            return (item.start.x-1) * this.cubeItemHeight
        },
        //计算选中层的left距离
        getCubeSelectedLeft(item) {
            return (item.start.y-1) * this.cubeItemWidth
        },
        // 选中层点击
        currentCubeSelected(item,index) {
            this.currentIndex = index
            // 清空正在选择的
            this.clearSelecting()
        },
        // 选中层删除
        cubeSelectedDel(item,index) {
            this.formDataDecorate.list.splice(index,1)
            this.currentIndex = -1
        },
        // 魔方添加图片
        chooseImage() {
            this.$refs.chooseImage.openDialog()
        },
        // 魔方添加图片后的回调
        uploadCallback(e) {
            const { list = [] } = e
            let imageUrl = list.length?list[0]:''
            let listFormDataDecorate = this.formDataDecorate.list || []
            let current = listFormDataDecorate[this.currentIndex]
            this.$set(current, 'image', imageUrl)
            this.$set(listFormDataDecorate, this.currentIndex, current)
            this.$set(this.formDataDecorate, 'list', listFormDataDecorate)
        },
        // 功能链接配置
        getLinkUrl() {
            this.$LinkBases({
                source: this.$store.state.customPage.sourceInfo.source, // 必填
                type: 'h5', // 必填
                source_id: this.$store.state.customPage.sourceInfo.source_id,
                // 确定按钮
                handleOkBtn: (res) => {
                    // 点击按钮事件
                    console.log('handleOk', res)
                    this.$nextTick(() => {
                        //链接库动态赋值
                        let list = this.formDataDecorate.list || []
                        let current = list[this.currentIndex]
                        this.$set(current, 'link_url', res.url)

                        this.$set(list, this.currentIndex, current)
                        this.$set(this.formDataDecorate, 'list', list)
                    })
                },
            })
        },
    }
}
</script>

<style scoped>
.magic-square-decorate-wrap ul {
    margin: 0;
    padding: 0;
}
.magic-square-decorate-wrap ul li {
    list-style: none;
}
.magic-square-decorate-wrap >>> .ant-upload.ant-upload-select-picture-card > .ant-upload {
    padding: 0;
}
.width-100 {
    width: 100%;
}
.content {
    padding: 24px;
    width: 100%;
    box-sizing: border-box;
}
.padding-24 {
    padding: 24px;
}
.decorate-cube {
    position: relative;
}
.decorate-cube .cube-row:last-of-type .cube-item {
    border-right: 1px solid #e5e5e5;
}
.decorate-cube .cube-selected {
    position: absolute;
    background-color: #ffffff;
    text-align: center;
    color: #7d7e80;
    cursor: pointer;
    box-sizing: border-box;
}
.decorate-cube .cube-selected.active {
    background: #e0edff;
    border: 1px solid #155bd4;
    z-index: 2;
    cursor: pointer;
}
.decorate-cube .cube-selected.active .cube-selected-text {
    color: #155bd4;
}
.decorate-cube .cube-selected .close-icon {
    position: absolute;
    font-size: 18px;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    z-index: 2;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 50%;
    background: #ffffff;
    box-sizing: border-box;
}
.decorate-cube .cube-selected-text {
    font-size: 12px;
    width: calc(100% - 1px);
    height: calc(100% - 1px);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
    overflow: hidden;
    border: 1px solid #ebedf0;
    box-sizing: content-box;
}
.decorate-cube .cube-selected-text img {
    width: 100%;
    min-height: 100%;
}
.decorate-cube .cube-item:first-child {
    border-top: 1px solid #e5e5e5;
}
.decorate-cube .cube-item {
    background: #f8f8f8;
    border-left: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    cursor: pointer;
    text-align: center;
    box-sizing: border-box;
}
.decorate-cube .cube-item.item-selecting {
    background: #e0edff;
}
.decorate-cube .cube-item.item-selecting .plus-icon {
    display: none;
}
.decorate-cube .cube-item.item-selected {
    background: #e0edff;
    visibility: hidden;
}
.decorate-cube .cube-item.item-selected .plus-icon {
    display: none;
}
.imgwrap {
    margin-right: 10px;
    position: relative;
    width: 100px;
    height: 100px;
    overflow: hidden;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    box-sizing: border-box;
}
.img-update {
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
</style>
