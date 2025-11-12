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
                <div>
                    <div class="mt-20 fs-16 fw-bold">{{ L('轮播图片') }}</div>
                    <div>
                        {{ L('鼠标拖拽调整广告图片顺序，宽度一定，高度自适应') }}
                    </div>
                    <div class="mt-20">
                        <div class="add-nav-wrap mb-20">
                            <!-- 拖拽 -->
                            <draggable v-model="formDataDecorate.list" :disabled="isDisabled">
                                <div
                                    class="group-menu-wrap flex align-center"
                                    v-for="(item, index) in formDataDecorate.list"
                                    :key="index"
                                    @click.stop="isDisabled = false"
                                >
                                    <a-icon
                                        type="close-circle"
                                        class="delIcon"
                                        v-show="formDataDecorate.list.length > 2"
                                        @click="delOpt(index)"
                                    />
                                    <!-- 添加广告图片 -->
                                    <div class="uploadImgWrap" @click="chooseImage(item, index)">
                                        <div
                                            class="pointer img-wrap"
                                            v-if="formDataDecorate.list && formDataDecorate.list[index].image"
                                        >
                                            <img
                                                ref="image"
                                                :src="item.image"
                                                alt=""
                                                style="width: 100%; height: 100%"
                                            />
                                            <span class="img-update">{{ L('更换图片') }}</span>
                                        </div>
                                        <div v-else>
                                            <div class="flex align-center justify-center flex-column pointer img-wrap">
                                                <a-icon type="plus" />
                                                <span>{{ L('添加图片') }}</span>
                                            </div>
                                            <span class="cr-red">{{ L('请添加轮播图片') }}</span>
                                        </div>
                                    </div>
                                    <!-- 添加广告标题 -->
                                    <div class="flex-1 linkUrl">
                                        <a-form-model-item :label="L('标题')">
                                            <a-input
                                                :placeholder="L('建议十个字以内,可不填')"
                                                v-model="item.title"
                                                @mouseenter="isDisabled = true"
                                                @mouseleave="isDisabled = false"
                                                @click.stop="isDisabled = true"
                                            ></a-input>
                                        </a-form-model-item>
                                        <!-- 添加链接 -->
                                        <a-form-model-item :label="L('链接')">
                                            <div class="flex">
                                                <a-input
                                                    v-model="item.link_url"
                                                    type="textarea"
                                                    autoSize
                                                    style="resize: none"
                                                    @mouseenter="isDisabled = true"
                                                    @mouseleave="isDisabled = false"
                                                    @click.stop="isDisabled = true"
                                                ></a-input>
                                                <a-button class="ml-5" @click="getLinkUrl(item, index)">{{
                                                    L('链接库选择')
                                                }}</a-button>
                                            </div>
                                        </a-form-model-item>
                                    </div>
                                </div>
                            </draggable>
                        </div>
                    </div>
                    <!-- 添加文本导航按钮 -->
                    <div class="mt-20 mb-20" v-if="formDataDecorate.list && formDataDecorate.list.length < 5">
                        <a-button block @click="addOpt()"> <a-icon type="plus" />{{ L('添加广告') }}</a-button>
                    </div>
                </div>
                <a-divider />
                <div>
                    <!-- 设置图片倒角 -->
                    <a-form-model-item
                        :label="L('轮播图样式')"
                        :labelCol="{ span: 5 }"
                        :wrapperCol="{
                            span: 18,
                        }"
                    >
                        <div class="flex aligin-center justify-between">
                            <span>{{ getLabel(pageDistanceOptions, formDataDecorate.show_distance) }}</span>
                            <a-radio-group v-model="formDataDecorate.show_distance" button-style="solid">
                                <a-radio-button
                                    v-for="item in pageDistanceOptions"
                                    :key="item.value"
                                    :value="item.value"
                                >
                                    <IconFont :type="item.icon" class="itemIcon" />
                                </a-radio-button>
                            </a-radio-group>
                        </div>
                    </a-form-model-item>

                    <!-- 轮播间隙 -->
                    <a-form-model-item :label="L('轮播间隔')">
                        <a-row type="flex">
                            <a-col :span="16">
                                <a-slider v-model="formDataDecorate.duration" :min="0" />
                            </a-col>
                            <a-col :span="7" :offset="1">
                                <a-input-number v-model="formDataDecorate.duration" :min="0"></a-input-number
                                ><span class="ml-5">S</span>
                            </a-col>
                        </a-row>
                    </a-form-model-item>
                </div>
            </a-form-model>
        </div>
        <!-- 选择上传图片和历史图片 -->
        <template>
            <choose-image
                ref="chooseImage"
                :max="1"
                :upload_dir="'/decorate/images'"
                type="image"
                @callback="callback"
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
                title: '轮播图',
                desc: '轮播图广告位展示，最多可添加5条广告',
            },
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            formDataDecorate: '',
            list: [], // 添加的文本导航框的列表数据
            currentIndex: 0,
            // 页面边距
            pageDistanceOptions: [
                {
                    value: '2',
                    label: this.L('无页面边距'),
                    icon: 'iconcatCustomPageNoMargin',
                },
                {
                    value: '1',
                    label: this.L('有页面边距'),
                    icon: 'iconcatCustomPageMargin',
                },
            ],
            isDisabled: false,
        }
    },
    watch: {
        formDataDecorate: {
            deep: true,
            handler(val) {
                if (val && val.list && val.list.length) {
                    val.list.forEach((item, index) => {
                        if (index == 0 && item.image) {
                            this.getImgInfo(item.image, (res) => {
                                val.img_height = res.height
                                val.img_width = res.width
                                this.$emit('updatePageInfo', val)
                            })
                        }
                    })
                }

                this.$emit('updatePageInfo', val)
            },
        },
    },
    mounted() {
        if (this.formContent) {
            this.formDataDecorate = {}
            for (let k in this.formContent) {
                if (k == 'duration') {
                    this.formContent[k] = Number(this.formContent[k])
                }

                this.$set(this.formDataDecorate, k, this.formContent[k])

                if (k == 'list' && this.formContent[k] && this.formContent[k].length) {
                    let list = this.formContent[k]
                    list.forEach((item, index) => {
                        if (index == 0 && item.image) {
                            this.getImgInfo(item.image, (res) => {
                                this.$set(this.formDataDecorate, 'img_height', res.height)
                                this.$set(this.formDataDecorate, 'img_width', res.width)
                            })
                        }
                    })
                }
            }
        }
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
        addOpt() {
            let list = this.formDataDecorate.list || []
            if (list.length == 5) {
                this.$message.error(this.L('最多可添加5条广告'))
                return
            }
            list.push({
                title: '',
                link_url: '',
                image: '',
            })
            this.$set(this.formDataDecorate, 'list', list)
        },
        // 删除当前的广告
        delOpt(curIndex) {
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
        // 添加广告图片
        chooseImage(curItem, curIndex) {
            this.currentIndex = curIndex
            this.$refs.chooseImage.openDialog()
        },
        // 选取广告图片后的回调
        callback(info) {
            let navPicList = info.list
            let imageUrl = navPicList.length ? navPicList[0] : ''
            let listFormDataDecorate = this.formDataDecorate.list || []
            let current = listFormDataDecorate[this.currentIndex]
            this.$set(current, 'image', imageUrl)
            this.$set(listFormDataDecorate, this.currentIndex, current)
            this.$set(this.formDataDecorate, 'list', listFormDataDecorate)
        },
        // 获取图片信息
        getImgInfo(src, callBack) {
            let img = new Image()
            img.src = src
            img.onload = () => {
                if (callBack && img) {
                    callBack(img)
                }
            }
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
    width: 80px;
    height: 80px;
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
