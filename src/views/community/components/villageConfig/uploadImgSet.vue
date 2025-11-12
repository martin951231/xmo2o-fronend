<template>
    <div class="upload_img_set">
        <a-alert message="说明：默认开启“拍照上传、图片上传”选项，APP、h5、小程序根据开启的选项进行展示" type="info" show-icon />
        <a-form-model ref="ruleForm" :model="uploadImgForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <a-form-model-item label="人脸设置" prop="face_door_set">
                <a-radio-group name="radioGroup" v-model="uploadImgForm.face_door_set">
                    <a-radio :value="1">拍照上传、图片上传</a-radio>
                    <a-radio :value="2">拍照上传</a-radio>
                </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="工单设置" prop="work_order_set">
                <a-radio-group name="radioGroup" v-model="uploadImgForm.work_order_set">
                    <a-radio :value="1">拍照上传、图片上传</a-radio>
                    <a-radio :value="2">拍照上传</a-radio>
                </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="巡检设置" prop="wisdom_qrcode_set">
                <a-radio-group name="radioGroup" v-model="uploadImgForm.wisdom_qrcode_set">
                    <a-radio :value="1">拍照上传、图片上传</a-radio>
                    <a-radio :value="2">拍照上传</a-radio>
                </a-radio-group>
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="onSubmit">保存</a-button>
                <a-button style="margin-left: 10px;" @click="resetForm">重置</a-button>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {
        ref,
        reactive,
        onMounted,
        defineComponent
    } from '@vue/composition-api';
    export default defineComponent({
        name: 'uploadImgSet',
        setup(props, context) {
            let uploadImgForm = ref({})
            let ruleForm = ref(null)
            const labelCol = ref({
                span: 4
            })
            const wrapperCol = ref({
                span: 14
            })
            const rules = reactive({})
            const onSubmit = () => {
                Vue.prototype.$confirm({
                    title: '提示',
                    content: '确定要保存此表单内容吗？',
                    onOk() {
                        ruleForm.value.validate(valid => {
                            if (valid) {
                                saveForm()
                            }
                        })
                    },
                    onCancel() {},
                });
            }

            const resetForm = () => {
                accessControlForm.value = {}
                ruleForm.value.resetFields()
            }

            const saveForm = () => {
                Vue.prototype.request('/community/village_api.VillageConfig/villageInfoUpdate',
                    accessControlForm.value).then((res) => {
                    Vue.prototype.$message.success('保存成功！')
                })
            }

            onMounted(() => {

            })

            return {
                uploadImgForm,
                ruleForm,
                labelCol,
                wrapperCol,
                rules,
                onSubmit,
                resetForm,
                saveForm
            }
        }
    })
</script>

<style lang="less" scoped>

</style>
