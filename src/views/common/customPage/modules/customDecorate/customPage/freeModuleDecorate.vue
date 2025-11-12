<template>
    <div>
        <!-- 组件描述 -->
        <componentDesc :content="desc"></componentDesc>

        <div v-if="formDataDecorate" class="content">
            <a-form-model
                :model="formDataDecorate"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :labelAlign="'left'"
            >
                <a-form-model-item :label="L('倒角设置')">
                    <div class="flex aligin-center justify-between">
                        <span>{{ getLabel(borderRadiusOptions, formDataDecorate.border_radius) }}</span>
                        <a-radio-group v-model="formDataDecorate.border_radius" button-style="solid">
                            <a-radio-button v-for="item in borderRadiusOptions" :key="item.value" :value="item.value">
                                <IconFont :type="item.icon" class="itemIcon" />
                            </a-radio-button>
                        </a-radio-group>
                    </div>
                </a-form-model-item>
                <a-form-model-item :label="L('边距设置')">
                    <div class="flex align-center justify-between">
                        <span>{{ formDataDecorate.show_distance == 1 ? L('显示') : L('不显示') }}</span>
                        <a-checkbox
                            :checked="formDataDecorate.show_distance == 1 ? true : false"
                            @change="isChange($event, 'show_distance')"
                        >
                        </a-checkbox>
                    </div>
                </a-form-model-item>
                <a-form-model-item :label="L('区块样式')">
                    <div class="flex align-center justify-between">
                        <span>{{ formDataDecorate.style_type == 1 ? L('卡片投影') : L('不显示卡片投影') }}</span>
                        <a-checkbox
                            :checked="formDataDecorate.style_type == 1 ? true : false"
                            @change="isChange($event, 'style_type')"
                        >
                        </a-checkbox>
                    </div>
                </a-form-model-item>
                <a-form-model-item :label="L('背景设置')">
                    <div class="flex aligin-center justify-between mt-10">
                        <span></span>
                        <a-radio-group v-model="formDataDecorate.bg_type" @change="radioChange">
                            <a-radio v-for="item in bgTypeOptions" :key="item.value" :value="item.value">
                                {{ item.label }}
                            </a-radio>
                        </a-radio-group>
                    </div>
                </a-form-model-item>

                <div class="flex align-center color-picker-wrap" v-show="formDataDecorate.bg_type == '1'">
                    <span class="color-name mr-20">
                        {{ formDataDecorate.bg_val }}
                    </span>
                    <label
                        for="title_color"
                        class="color-picker-label"
                        :style="[{ background: formDataDecorate.bg_val }]"
                    >
                        <input type="color" v-model="formDataDecorate.bg_val" id="title_color" />
                    </label>
                </div>

                <div class="uploadImgWrap" @click="chooseImage()" v-show="formDataDecorate.bg_type == '2'">
                    <div class="pointer img-wrap" v-if="formDataDecorate.bg_val">
                        <img :src="formDataDecorate.bg_val" alt="" style="max-width: 100%; min-height: 100%" />
                        <span class="img-update">{{ L('更换图片') }}</span>
                    </div>
                    <div v-else>
                        <div class="flex align-center justify-center flex-column pointer img-wrap">
                            <a-icon type="plus" />
                            <span>{{ L('添加图片') }}</span>
                        </div>
                        <span class="cr-red">{{ L('请选择一张图片') }}</span>
                    </div>
                </div>
            </a-form-model>
        </div>
        <choose-image ref="chooseImage" :max="1" :upload_dir="'/decorate/images'" type="image" @callback="callback" />
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
        // 表单数据
        formContent: {
            type: [String, Object],
            default: '',
        },
    },
    data() {
        return {
            desc: {
                title: '自由区块',
                desc: '区块内部可自定义堆砌其他组件',
            },
            formDataDecorate: '',
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            borderRadiusOptions: [
                {
                    value: '1',
                    label: this.L('圆角'),
                    icon: 'iconCustomPageRightAngle',
                },
                {
                    value: '2',
                    label: this.L('直角'),
                    icon: 'iconCustomPageBorderRadius',
                },
            ],
            bgTypeOptions: [
                {
                    value: '1',
                    label: this.L('自定义颜色'),
                },
                {
                    value: '2',
                    label: this.L('图片'),
                },
            ],
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
        isChange(e, filed) {
            this.$set(this.formDataDecorate, filed, e.target.checked ? '1' : '2')
        },
        radioChange(e) {
            this.$set(this.formDataDecorate, 'bg_val', e.target.value == '1'?'#ffffff':'')
        },
        // 添加导航图片
        chooseImage() {
            this.$refs.chooseImage.openDialog()
        },
        // 选取图片后的回调
        callback(info) {
            let list = info.list
            let imageUrl = list.length ? list[0] : ''
            this.$set(this.formDataDecorate, 'bg_val', imageUrl)
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
.color-picker-label {
    width: 80px;
    height: 30px;
    border: 1px solid #666666;
    margin-right: 20px;
}
.color-picker-label input[type='color'] {
    opacity: 0;
}
.color-name {
    height: 30px;
    line-height: 30px;
    min-width: 60px;
    text-align: left;
    vertical-align: middle;
    font-size: 14px;
    font-weight: bold;
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