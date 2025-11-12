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
                <a-form-model-item :label="L('文案')">
                    <a-input v-model="formDataDecorate.txt" :maxLength="4"></a-input>
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
        // 表单数据
        formContent: {
            type: [String, Object],
            default: '',
        },
    },
    data() {
        return {
            desc: {
                title: '进入店铺',
            },
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            formDataDecorate: '',
        }
    },
    watch: {
        formContent: {
            deep: true,
            handler(newVal, oldVal) {
                if (newVal) {
                    this.formDataDecorate = {}
                    for (let k in newVal) {
                        this.$set(this.formDataDecorate, k, newVal[k])
                    }
                } else {
                    this.formDataDecorate = ''
                }
            },
        },
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
</style>