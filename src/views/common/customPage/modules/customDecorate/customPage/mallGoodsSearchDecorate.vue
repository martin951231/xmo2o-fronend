<template>
    <div v-if="formDataDecorate">
        <!-- 组件描述 -->
        <componentDesc :content="desc"></componentDesc>

        <div class="content">
            <a-form-model 
                :model="formDataDecorate"
                :label-col="labelCol" 
                :wrapper-col="wrapperCol"
                :labelAlign="'left'">
                <a-form-model-item  
                    :label="L('框体样式')" >
                    <div class="flex align-center justify-between">
                        <span>{{getLabel(styleTypeOptions,formDataDecorate.style_type)}}</span>
                        <div>
                            <a-radio-group 
                                v-model="formDataDecorate.style_type"
                                button-style="solid">
                                <a-radio-button 
                                    v-for="item in styleTypeOptions"
                                    :key="item.value"
                                    :value="item.value">
                                    <IconFont :type="item.icon" class="itemIcon" />
                                </a-radio-button>
                            </a-radio-group>
                        </div>
                    </div>
                </a-form-model-item>
                <a-form-model-item :label="L('文本位置')" >
                    <div class="flex align-center justify-between">
                        <span>{{getLabel(textAlignOptions,formDataDecorate.text_align)}}</span>
                        <div>
                            <a-radio-group 
                                v-model="formDataDecorate.text_align"
                                button-style="solid">
                                <a-radio-button 
                                    v-for="item in textAlignOptions"
                                    :key="item.value"
                                    :value="item.value">
                                    <IconFont :type="item.icon" class="itemIcon" />
                                </a-radio-button>
                            </a-radio-group>
                        </div>
                    </div>
                </a-form-model-item>
                <a-form-model-item :label="L('框体高度')" >
                    <a-slider 
                        v-model="formDataDecorate.height_value"
                        :max="40"
                        :min="28" />
                </a-form-model-item>
                <a-form-model-item  :label="L('背景颜色')" class="flex-end">
                    <div class="flex align-center color-picker-wrap">
                        <span class="color-name">{{formDataDecorate.bg_color}}</span>
                        <label 
                            for="bg_color" 
                            class="color-picker-label"
                            :style="[{background: formDataDecorate.bg_color }]">
                            <input 
                                type="color" 
                                v-model="formDataDecorate.bg_color" 
                                id="bg_color" />
                        </label>
                        
                        <a-button @click="resetOpt('bg_color')" type="link">
                            {{L('重置')}}</a-button>
                    </div>
                </a-form-model-item>
                <a-form-model-item  :label="L('框体颜色')" class="flex-end">
                    <div class="flex align-center color-picker-wrap">
                        <span class="color-name">{{formDataDecorate.content_bg_color}}</span>
                        <label 
                            for="content_bg_color" 
                            class="color-picker-label"
                            :style="[{background: formDataDecorate.content_bg_color }]">
                            <input 
                                type="color" 
                                v-model="formDataDecorate.content_bg_color" 
                                id="content_bg_color" />
                        </label>
                        
                        <a-button @click="resetOpt('content_bg_color')" type="link">
                            {{L('重置')}}</a-button>
                    </div>
                </a-form-model-item>
                <a-form-model-item  :label="L('文本颜色')" class="flex-end">
                    <div class="flex align-center color-picker-wrap">
                        <span class="color-name">{{formDataDecorate.font_color}}</span>
                        <label 
                            for="font_color" 
                            class="color-picker-label"
                            :style="[{background: formDataDecorate.font_color }]">
                            <input 
                                type="color" 
                                v-model="formDataDecorate.font_color" 
                                id="font_color" />
                        </label>
                        
                        <a-button @click="resetOpt('font_color')" type="link">
                            {{L('重置')}}</a-button>
                    </div>
                </a-form-model-item>
            </a-form-model>
        </div>
    </div>
</template>

<script>

import componentDesc from '@/views/common/customPage/modules/common/componentDesc'
import {slider} from 'ant-design-vue'
import Vue from 'vue'
Vue.use(slider)
import IconFont from '@/utils/icon'
export default {
    components: {
        componentDesc,
        IconFont
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
                title: '商品搜索'
            },
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            formDataDecorate: '',
            styleTypeOptions: [
                {
                    value: '1',
                    icon: 'iconCustomPageBorderRadius',
                    label: this.L('圆角')
                },
                {
                    value: '2',
                    icon: 'iconCustomPageRightAngle',
                    label: this.L('方形')
                }
            ],
            textAlignOptions: [
                {
                    value: 'left',
                    icon: 'iconCustomPageTextLeft',
                    label: this.L('居左')
                },
                {
                    value: 'center',
                    icon: 'iconCustomPageTextCenter',
                    label: this.L('居中')
                }
            ],
            // 背景色
            bg_color: '#ffffff',
            // 内容背景色
            content_bg_color: '#f9f9f9',
            // 字体颜色
            font_color: '#A7A7A7'
        }
    },
    watch: {
        formContent: {
            deep: true,
            handler(newVal,oldVal) {
                if (newVal) {
                    this.formDataDecorate = {}
                    for (let k in newVal) {
                        this.$set(this.formDataDecorate, k, newVal[k] )
                    }
                } else {
                    this.formDataDecorate = ''
                }
            }
        },
        formDataDecorate: {
            deep: true,
            handler(val) {
                this.$emit('updatePageInfo',val)
            }
        }
    },
    mounted() {
        if (this.formContent) {
            this.formDataDecorate = {}
            for (let k in this.formContent) {
                this.$set(this.formDataDecorate, k, this.formContent[k] )
            }
        }
    },
    methods: {
        // 获取label
        getLabel(list = [],value = '') {
            let label = ''
            if (list.length) {
                list.forEach(item => {
                    if(item.value == value) {
                        label = item.label
                    }
                })
            }
            return label
        },
        // 重置
        resetOpt(filed) {
            this.$set(this.formDataDecorate, filed, this[filed])
        },
    }
}
</script>

<style scoped>
.content {
    padding: 24px;
    width: 100%;
    box-sizing: border-box;
}
.padding-24 {
    padding: 24px;
}
.color-picker-wrap {
    justify-content: flex-end;
}
.color-picker-label {
    width: 80px;
    height: 30px;
    border: 1px solid #666666;
}
.color-picker-label input[type = 'color'] {
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
</style>