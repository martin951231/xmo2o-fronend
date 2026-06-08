<template>
    <a-modal v-model="visible" :title="isEdit ? '编辑积分规则' : '创建积分规则'" width="500px"
        @ok="handleSubmit" @cancel="handleCancel">
        <a-form-model ref="formRef" :model="localFormData" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }" :rules="formRules">
            <a-form-model-item label="积分规则名称" required prop="name">
                <a-input v-model="localFormData.name" placeholder="请输入积分规则名称" />
            </a-form-model-item>
            <a-form-model-item label="报名积分" required prop="register_score">
                <a-input v-model="localFormData.register_score" placeholder="请输入积分数量" />
                <div class="form-tip">用户报名成功获得的积分</div>
            </a-form-model-item>
            <a-form-model-item label="参与积分" required prop="participate_score">
                <a-input v-model="localFormData.participate_score" placeholder="请输入积分数量" />
                <div class="form-tip">用户签到活动完成后获得的积分</div>
            </a-form-model-item>
            <a-form-model-item label="评论积分" required prop="share_score">
                <a-input v-model="localFormData.share_score" placeholder="请输入积分数量" />
                <div class="form-tip">用户发布评论后获得的积分</div>
            </a-form-model-item>
            <a-form-model-item label="支付积分" required prop="pay_score">
                <a-input v-model="localFormData.pay_score" placeholder="请输入获得积分比例（%）">
                    <template slot="suffix">%</template>
                </a-input>
                <div class="form-tip">根据支付金额比例获得积分</div>
            </a-form-model-item>
            <a-form-model-item label="状态" required prop="status">
                <a-radio-group v-model="localFormData.status">
                    <a-radio :value="1">正常</a-radio>
                    <a-radio :value="2">禁止</a-radio>
                </a-radio-group>
            </a-form-model-item>
        </a-form-model>
    </a-modal>
</template>

<script>
export default {
    name: 'RulesModal',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        isEdit: {
            type: Boolean,
            default: false
        },
        formData: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            visible: this.value,
            localFormData: {
                ...this.formData
            },
            formRules: {
                name: [
                    { required: true, message: '请输入积分规则名称', trigger: 'blur' },
                    { min: 2, max: 100, message: '名称长度在2到100个字符之间', trigger: 'blur' }
                ],
                register_score: [
                    { required: true, message: '请输入报名积分', trigger: 'blur' },
                    { pattern: /^\d+$/, message: '请输入数字', trigger: 'blur' }
                ],
                participate_score: [
                    { required: true, message: '请输入参与积分', trigger: 'blur' },
                    { pattern: /^\d+$/, message: '请输入数字', trigger: 'blur' }
                ],
                share_score: [
                    { required: true, message: '请输入分享积分', trigger: 'blur' },
                    { pattern: /^\d+$/, message: '请输入数字', trigger: 'blur' }
                ],
                pay_score: [
                    { required: true, message: '请输入支付积分', trigger: 'blur' },
                    { pattern: /^\d+(\.\d+)?$/, message: '请输入数字', trigger: 'blur' }
                ],
                status: [
                    { required: true, message: '请选择状态', trigger: 'change' }
                ]
            }
        }
    },
    watch: {
        value(newVal) {
            this.visible = newVal
        },
        formData: {
            handler(newVal) {
                if (newVal && Object.keys(newVal).length > 0) {
                    this.localFormData = {
                        id: newVal.id || '',
                        name: newVal.name || '',
                        register_score: newVal.register_score || '',
                        participate_score: newVal.participate_score || '',
                        share_score: newVal.share_score || '',
                        pay_score: newVal.pay_score || '',
                        status: newVal.status || 1
                    }
                }
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        handleSubmit() {
            this.$refs.formRef.validate((valid) => {
                if (valid) {
                    this.$emit('submit', this.localFormData)
                }
            })
        },
        handleCancel() {
            this.$emit('cancel')
        }
    }
}
</script>

<style lang="less" scoped>
.form-tip {
    margin-top: 4px;
    font-size: 12px;
    color: #999;
    line-height: 1.5;
}
</style>