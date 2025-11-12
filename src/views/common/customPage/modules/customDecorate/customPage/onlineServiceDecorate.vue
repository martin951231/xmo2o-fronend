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
                <a-form-model-item
                    :label="L('文案')"
                    :prop="'txt'"
                    :rules="{
                        required: true,
                        message: L('文案不能为空'),
                        trigger: '',
                    }"
                >
                    <a-input v-model="formDataDecorate.txt" :maxLength="4"></a-input>
                    <span class="online-service-desc">{{ L('文案建议4个字') }}</span>
                </a-form-model-item>
            </a-form-model>
        </div>
    </div>
</template>

<script>
import componentDesc from '@/views/common/customPage/modules/common/componentDesc'
export default {
    components: {
        componentDesc,
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
                title: this.L('在线客服'),
            },
            labelCol: { span: 20 },
            wrapperCol: { span: 20 },
            formDataDecorate: '',
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
}
</script>

<style scoped>
.content {
    padding: 24px;
    width: 100%;
    box-sizing: border-box;
}
.online-service-desc {
    font-size: 12px;
    color: #969799;
}
</style>
