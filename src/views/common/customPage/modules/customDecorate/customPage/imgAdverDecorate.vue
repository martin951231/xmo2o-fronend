<template>
    <div v-if="formDataDecorate">
        <!-- 组件描述 -->
        <componentDesc :content="desc"></componentDesc>

        <div class="content">
            <a-form-model
                :model="formDataDecorate"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :labelAlign="'left'"
            >
                <a-form-model-item :label="L('显示方式')" style="margin-top: 24px">
                    <div class="flex align-center justify-between">
                        <span>{{
                            getLabel($store.state.customPage.styleTypeOptions, formDataDecorate.style_type)
                        }}</span>
                        <div>
                            <a-radio-group
                                v-model="formDataDecorate.style_type"
                                button-style="solid"
                                @change="$store.dispatch('updatePageScroll', true)"
                            >
                                <a-radio-button
                                    v-for="item in $store.state.customPage.styleTypeOptions"
                                    :key="item.value"
                                    :value="item.value"
                                >
                                    <IconFont :type="item.icon" class="itemIcon" />
                                </a-radio-button>
                            </a-radio-group>
                        </div>
                    </div>
                </a-form-model-item>
                <a-divider />
                <div>
                    <a-form-model-item
                        :label="L('添加图片')"
                        :labelCol="{
                            span: 24,
                        }"
                        :wrapperCol="{
                            span: 24,
                        }"
                    >
                        <span>{{ L('最多添加10个广告，鼠标拖拽调整广告顺序，建议尺寸750x350像素') }}</span>
                    </a-form-model-item>
                    <div class="content mt-20">
                        <div class="add-nav-wrap mb-20">
                            <!-- 拖拽 -->
                            <draggable v-model="formDataDecorate.list" :disabled="isDisabled">
                                <div
                                    class="group-menu-wrap flex align-center"
                                    v-for="(item, index) in formDataDecorate.list"
                                    :key="index"
                                    @click.stop="isDisabled = false"
                                >
                                    <a-icon type="close-circle" class="delIcon" @click="delCurNav(item, index)" />
                                    <!-- 添加广告图片 -->
                                    <div class="uploadImgWrap" @click="chooseImage(item, index)">
                                        <div
                                            class="pointer img-wrap"
                                            v-if="formDataDecorate.list && formDataDecorate.list[index].pic"
                                            :class="{
                                                'flex align-center justify-center': formDataDecorate.style_type == 1,
                                            }"
                                        >
                                            <img
                                                :src="item.pic"
                                                alt=""
                                                style="width: 100%"
                                                :style="{ height: formDataDecorate.style_type == 1 ? 'auto' : '100%' }"
                                            />
                                            <span class="img-update">{{ L('更换图片') }}</span>
                                        </div>
                                        <div v-else>
                                            <div class="flex align-center justify-center flex-column pointer img-wrap">
                                                <a-icon type="plus" />
                                                <span>{{ L('添加图片') }}</span>
                                            </div>
                                            <span class="cr-red">{{ L('请添加广告图片') }}</span>
                                        </div>
                                    </div>
                                    <!-- 添加广告标题 -->
                                    <div class="flex-1 linkUrl">
                                        <a-form-model-item :label="L('标题')">
                                            <a-input
                                                :placeholder="L('建议十个字以内,可不填')"
                                                v-model="item.name"
                                                @mouseenter="isDisabled = true"
                                                @mouseleave="isDisabled = false"
                                                @click.stop="isDisabled = true"
                                            ></a-input>
                                        </a-form-model-item>
                                        <!-- 添加链接 -->
                                        <a-form-model-item :label="L('链接')">
                                            <a-input
                                                v-model="item.link_url"
                                                type="textarea"
                                                autoSize
                                                style="resize: none"
                                                @mouseenter="isDisabled = true"
                                                @mouseleave="isDisabled = false"
                                                @click.stop="isDisabled = true"
                                            ></a-input>
                                            <a-button @click="getLinkUrl(item, index)">{{ L('链接库选择') }}</a-button>
                                        </a-form-model-item>
                                    </div>
                                </div>
                            </draggable>
                        </div>
                    </div>
                    <!-- 添加文本导航按钮 -->
                    <div class="mt-20 mb-20" v-if="formDataDecorate.list && formDataDecorate.list.length < 10">
                        <a-button block @click="addNavGroup"> <a-icon type="plus" />{{ L('添加广告') }}</a-button>
                    </div>
                </div>
                <a-divider />
                <div>
                    <!-- 设置图片倒角 -->
                    <a-form-model-item :label="L('图片倒角')">
                        <div class="flex align-center justify-between">
                            <span>{{ getLabel(picRadiusOptions, formDataDecorate.pic_radius) }}</span>
                            <div>
                                <a-radio-group v-model="formDataDecorate.pic_radius" button-style="solid">
                                    <a-radio-button
                                        v-for="item in picRadiusOptions"
                                        :key="item.value"
                                        :value="item.value"
                                    >
                                        <IconFont :type="item.icon" class="itemIcon" />
                                    </a-radio-button>
                                </a-radio-group>
                            </div>
                        </div>
                    </a-form-model-item>

                    <!-- 设置页面边距 -->
                    <a-form-model-item :label="L('页面边距')">
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
                </div>
            </a-form-model>
        </div>
        <!-- 选择上传图片和历史图片 -->
        <template>
            <choose-image
                ref="chooseNavPic"
                :max="1"
                :upload_dir="'/decorate/images'"
                type="image"
                @callback="uploadNavIconCallback"
            />
        </template>
    </div>
</template>

<script>
import componentDesc from '@/views/common/customPage/modules/common/componentDesc'
import IconFont from '@/utils/icon'
import draggable from 'vuedraggable'
import ChooseImage from '@/components/ChooseImage/ChooseImage'

export default {
    components: {
        componentDesc,
        IconFont,
        draggable,
        ChooseImage,
    },
    props: {
        // 表单数据
        formContent: {
            type: [String, Object],
            default: '',
        },
    },
    data() {
        return {
            desc: {
                title: this.L('图片广告'),
            },
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            formDataDecorate: '',
            list: [], // 添加的文本导航框的列表数据
            currentIndex: 0,
            // 图片倒角
            picRadiusOptions: [
                {
                    value: '1',
                    label: this.L('直角'),
                    icon: 'iconCustomPageRightAngle',
                },
                {
                    value: '2',
                    label: this.L('圆角'),
                    icon: 'iconCustomPageBorderRadius',
                },
            ],
            isDisabled: false,
        }
    },
    watch: {
        formDataDecorate: {
            deep: true,
            handler(val) {
                this.$emit('updatePageInfo', val)
            },
        },
    },
    mounted() {
        if (this.formContent) {
            this.formDataDecorate = {}
            for (let k in this.formContent) {
                this.$set(this.formDataDecorate, k, this.formContent[k])
            }
        }
        this.$store.dispatch('updateStyleTypeOptions')
    },
    methods: {
        // 获取label
        getLabel(list = [], value = '') {
            let label = ''
            if (list.length) {
                list.forEach((item) => {
                    if (item.value == value) {
                        label = item.label
                    }
                })
            }
            return label
        },
        // 添加广告
        addNavGroup() {
            // this.$refs.chooseNavPic.openDialog()
            this.currentIndex = this.formDataDecorate.list.length
            let list = this.formDataDecorate.list || []
            list.push({
                name: '',
                link_url: '',
                pic: '',
            })
            this.$set(this.formDataDecorate, 'list', list)
        },
        // 删除当前的广告
        delCurNav(curItem, curIndex) {
            let list = this.formDataDecorate.list || []
            if (list.length) {
                list.splice(curIndex, 1)
            }
            this.$set(this.formDataDecorate, 'list', list)
        },
        // 功能链接配置
        getLinkUrl(curItem, curIndex) {
            this.currentIndex = curIndex
            this.$LinkBases({
                source: this.$store.state.customPage.sourceInfo.source, // 必填
                type: 'h5', // 必填
                source_id: this.$store.state.customPage.sourceInfo.source_id,
                // 确定按钮
                handleOkBtn: (res) => {
                    // 点击按钮事件
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
        // 颜色重置
        resetOpt(filed) {
            let initialVal = this.formContent
            this.$set(this.formDataDecorate, filed, initialVal[filed])
        },
        // 添加广告图片
        chooseImage(curItem, curIndex) {
            this.currentIndex = curIndex
            this.$refs.chooseNavPic.openDialog()
        },
        // 选取广告图片后的回调
        uploadNavIconCallback(info) {
            let navPicList = info.list
            let imageUrl = navPicList.length ? navPicList[0] : ''
            let listFormDataDecorate = this.formDataDecorate.list || []
            let current = listFormDataDecorate[this.currentIndex]
            this.$set(current, 'pic', imageUrl)
            this.$set(listFormDataDecorate, this.currentIndex, current)
            this.$set(this.formDataDecorate, 'list', listFormDataDecorate)
        },
    },
}
</script>

<style scoped>
.content {
    padding: 0 24px;
    width: 100%;
    box-sizing: border-box;
}
.padding-24 {
    padding: 24px 0;
}

.delIcon {
    display: none;
}

.group-menu-wrap {
    padding: 12px 16px;
    width: 100%;
    box-sizing: border-box;
    position: relative;
    margin-bottom: 12px;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 0 4px 0 rgb(10 42 97 / 20%);
    cursor: move;
}
.delIcon {
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(50%, -50%);
    font-size: 18px;
    cursor: pointer;
    color: #bbb;
    background: #ffffff;
    border-radius: 50%;
    z-index: 2;
}
.group-menu-wrap:hover.group-menu-wrap .delIcon {
    display: block;
}
.add-nav-wrap >>> .ant-form-item {
    margin-bottom: 10px;
}
.img-wrap {
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
    display: block;
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
