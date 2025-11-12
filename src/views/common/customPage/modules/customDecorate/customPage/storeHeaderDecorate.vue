<template>
    <div v-if="formData">
        <!-- 组件描述 -->
        <componentDesc :content="desc"></componentDesc>

        <div class="content">
            <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol" :labelAlign="'left'">
                <a-form-model-item :label="L('背景颜色')" class="flex-end">
                    <div class="flex align-center color-picker-wrap">
                        <span class="color-name">{{ formData.bg_color }}</span>
                        <label for="bg_color" class="color-picker-label" :style="[{ background: formData.bg_color }]">
                            <input type="color" v-model="formData.bg_color" id="bg_color" />
                        </label>
                        <a-button @click="resetOpt('bg_color')" type="link">{{ L('重置') }}</a-button>
                    </div>
                </a-form-model-item>
                <a-form-model-item :label="L('显示方式')" style="margin-top: 24px; margin-bottom: 0">
                    <span>{{ getLabel($store.state.customPage.styleTypeOptions, formData.style_type) }}</span>
                </a-form-model-item>
                <div class="flex align-center justify-between" style="padding: 0 0 40px">
                    <div>
                        <a-radio-group v-model="formData.style_type" button-style="solid">
                            <a-radio-button
                                v-for="item in $store.state.customPage.styleTypeOptions"
                                :key="item.value"
                                :value="item.value"
                                size="large"
                            >
                                <IconFont :type="item.icon" class="itemIcon" style="padding: 0 20px; font-size: 16px" />
                            </a-radio-button>
                        </a-radio-group>
                    </div>
                </div>

                <a-form-model-item
                    :label="L('设置背景图')"
                    :labelCol="{
                        span: 24,
                    }"
                    :wrapperCol="{
                        span: 24,
                    }"
                >
                    <!-- 添加导航图片 -->
                    <div @click="chooseImage" style="padding-top: 4px; width: 100px">
                        <div class="pointer img-wrap img-wrap-active" v-if="formData.bg_img">
                            <img :src="formData.bg_img" alt="" style="max-width: 100%; min-height: 100%" />
                            <span class="img-update">{{ L('更换图片') }}</span>
                            <a-icon type="close-circle" class="del-icon" @click.stop="delImg()" />
                        </div>
                        <div v-else class="flex align-center justify-center flex-column pointer img-wrap">
                            <a-icon type="plus" style="font-size: 18px" />
                            <span>{{ L('添加图片') }}</span>
                        </div>
                    </div>
                </a-form-model-item>
            </a-form-model>
        </div>
        <!-- 选择上传图片和历史图片 -->
        <choose-image
            ref="chooseHeaderPic"
            :max="1"
            :upload_dir="'/decorate/images'"
            type="image"
            @callback="uploadHeaderImgCb"
        />
    </div>
</template>

<script>
import componentDesc from '@/views/common/customPage/modules/common/componentDesc'
import IconFont from '@/utils/icon'
import ChooseImage from '@/components/ChooseImage/ChooseImage'
export default {
    components: {
        componentDesc,
        IconFont,
        ChooseImage,
    },
    props: {
        formContent: {
            type: [String, Object],
            default: '',
        },
    },
    data() {
        return {
            desc: {
                title: this.L('店铺头部'),
            },
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            formData: '',
            // 店铺背景颜色
            bg_color: '#06c1ae',
        }
    },
    watch: {
        formContent: {
            deep: true,
            handler(newVal, oldVal) {
                if (newVal) {
                    this.formData = {}
                    for (let k in newVal) {
                        this.$set(this.formData, k, newVal[k])
                    }
                } else {
                    this.formData = ''
                }
            },
        },
        formData: {
            deep: true,
            handler(val) {
                this.$emit('updatePageInfo', val)
            },
        },
    },
    mounted() {
        if (this.formContent) {
            this.formData = {}
            for (let k in this.formContent) {
                this.$set(this.formData, k, this.formContent[k])
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
        // 颜色重置
        resetOpt(filed) {
            this.$set(this.formData, filed, this[filed])
        },
        // 点击添加图片按钮
        chooseImage() {
            this.$refs.chooseHeaderPic.openDialog()
        },
        // 选取图片后的回调
        uploadHeaderImgCb(info) {
            let chooseImgList = info.list
            this.$set(this.formData, 'bg_img', chooseImgList[0])
        },
        // 图片删除
        delImg() {
            this.$set(this.formData, 'bg_img', '')
        },
    },
}
</script>

<style scoped>
.content {
    padding: 24px;
    width: 100%;
    box-sizing: border-box;
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
.img-wrap {
    margin-right: 10px;
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    box-sizing: border-box;
}
.img-wrap-active:hover .del-icon {
    display: block;
}
.del-icon {
    position: absolute;
    top: -8px;
    right: -8px;
    font-size: 16px;
    color: #666666;
    display: none;
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
