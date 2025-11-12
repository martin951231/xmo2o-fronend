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
                <div class="content mt-20">
                    <div class="add-nav-wrap mb-20">
                        <!-- 拖拽 -->
                        <draggable v-model="formDataDecorate.list" :disabled="isDisabled">
                            <div
                                class="group-menu-wrap"
                                v-for="(item, index) in formDataDecorate.list"
                                :key="index"
                                @click.stop="isDisabled = false"
                            >
                                <a-icon type="close-circle" class="delIcon" @click="delCurNav(item, index)" />
                                <!-- 添加导航标题 -->
                                <a-form-model-item
                                    :label="L('标题')"
                                    :prop="'list.' + index + '.name'"
                                    :rules="{
                                        required: true,
                                        message: L('标题不能为空'),
                                        trigger: 'change',
                                    }"
                                >
                                    <a-input
                                        :placeholder="L('请输入导航标题')"
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
                        </draggable>
                    </div>
                </div>
                <!-- 添加文本导航按钮 -->
                <div class="mt-20 mb-20">
                    <a-button block @click="addNavGroup"> <a-icon type="plus" />{{ L('添加文本导航') }}</a-button>
                </div>

                <!-- 添加背景颜色 -->
                <a-form-model-item :label="L('背景颜色')" class="flex-end">
                    <div class="flex align-center color-picker-wrap">
                        <span class="color-name">{{ formDataDecorate.bg_color }}</span>
                        <label
                            for="bg_color"
                            class="color-picker-label"
                            :style="[{ background: formDataDecorate.bg_color }]"
                        >
                            <input type="color" v-model="formDataDecorate.bg_color" id="bg_color" />
                        </label>
                        <a-button @click="resetOpt('bg_color')" type="link">{{ L('重置') }}</a-button>
                    </div>
                </a-form-model-item>
                <!-- 添加文字颜色 -->
                <a-form-model-item :label="L('文字颜色')" class="flex-end">
                    <div class="flex align-center color-picker-wrap">
                        <span class="color-name">{{ formDataDecorate.font_color }}</span>
                        <label
                            for="font_color"
                            class="color-picker-label"
                            :style="[{ background: formDataDecorate.font_color }]"
                        >
                            <input type="color" v-model="formDataDecorate.font_color" id="font_color" />
                        </label>
                        <a-button @click="resetOpt('font_color')" type="link">{{ L('重置') }}</a-button>
                    </div>
                </a-form-model-item>
            </a-form-model>
        </div>
    </div>
</template>

<script>
import componentDesc from '@/views/common/customPage/modules/common/componentDesc'
import IconFont from '@/utils/icon'
import draggable from 'vuedraggable'

export default {
    components: {
        componentDesc,
        IconFont,
        draggable,
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
                title: this.L('文本导航'),
            },
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
            formDataDecorate: '',
            list: [], // 添加的文本导航框的列表数据
            currentIndex: 0,
            // 背景颜色
            bg_color: '#ffffff',
            // 文字颜色
            font_color: '#000000',
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
    },
    methods: {
        // 添加文本导航
        addNavGroup() {
            let list = this.formDataDecorate.list || []
            list.push({
                name: '',
                link_url: '',
            })
            this.$set(this.formDataDecorate, 'list', list)
        },
        // 删除当前的文本导航
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
                    // console.log('handleOk', res)
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
            this.$set(this.formDataDecorate, filed, this[filed])
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
.color-picker-wrap {
    justify-content: flex-end;
}
.color-picker-label {
    width: 80px;
    height: 30px;
    border: 1px solid #666666;
}
.color-picker-label input[type='color'] {
    opacity: 0;
}
.color-name {
    height: 30px;
    line-height: 30px;
    min-width: 60px;
    text-align: left;
    margin-right: 20px;
    vertical-align: middle;
    font-size: 14px;
    font-weight: bold;
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
</style>
