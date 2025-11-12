<template>
    <div class="village_info_set">
        <a-form-model ref="ruleForm" :model="villageData" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol" v-if="$store.getters.config">
            <a-form-model-item :label="$store.getters.config.house_name+'占地面积'" prop="plot_area">
                <a-input class="input_style_240" v-model="villageData.plot_area" addon-after="单位：㎡(平方米)" />
            </a-form-model-item>
            <a-form-model-item :label="$store.getters.config.house_name+'建筑面积'" prop="building_area">
                <a-input class="input_style_240" v-model="villageData.building_area" addon-after="单位：㎡(平方米)" />
            </a-form-model-item>
            <a-form-model-item :label="$store.getters.config.house_name+'公共场所面积'" prop="public_area">
                <a-input class="input_style_240" v-model="villageData.public_area" addon-after="单位：㎡(平方米)" />
            </a-form-model-item>
            <a-form-model-item :label="$store.getters.config.house_name+'绿化面积'" prop="green_area">
                <a-input class="input_style_240" v-model="villageData.green_area" addon-after="单位：㎡(平方米)" />
            </a-form-model-item>
            <a-form-model-item :label="$store.getters.config.house_name+'设计车位面积'" prop="design_parking_area">
                <a-input class="input_style_240" v-model="villageData.design_parking_area" addon-after="单位：㎡(平方米)" />
            </a-form-model-item>
            <a-form-model-item label="备注" prop="remark">
                <a-textarea class="input_style_240" style="height: 100px; resize: none" v-model="villageData.remark" />
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
    import villageSetApi from "@/api/community/village/villageNewApi";
	import store from "@/store"; 
    import {
        ref,
        reactive,
        onMounted,
        defineComponent
    } from '@vue/composition-api';
    export default {
        name: 'villageInfoSet',
        setup(props, context) {
            let villageData = ref({})
            let formLayout = ref('formLayout')
            let ruleForm = ref(null)
            const labelCol = ref({
                span: 4
            })
            const wrapperCol = ref({
                span: 14
            })
            const rules = reactive({
                plot_area: [{
                    required: true,
                    message: '请输入'+store.getters.config.house_name+'占地面积',
                    trigger: 'blur'
                }],
                building_area: [{
                    required: true,
                    message: '请输入'+store.getters.config.house_name+'建筑面积',
                    trigger: 'blur'
                }],
                public_area: [{
                    required: true,
                    message: '请输入'+store.getters.config.house_name+'公共场所面积',
                    trigger: 'blur'
                }],
                green_area: [{
                    required: true,
                    message: '请输入'+store.getters.config.house_name+'占地面积',
                    trigger: 'blur'
                }],
                design_parking_area: [{
                    required: true,
                    message: '请输入'+store.getters.config.house_name+'设计车位面积',
                    trigger: 'blur'
                }],
                remark: [{
                    required: true,
                    message: '请输入备注',
                    trigger: 'blur'
                }]
            })
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
                villageData.value = {}
                ruleForm.value.resetFields()
            }

            const saveForm = () => {
                Vue.prototype.request('/community/village_api.VillageConfig/villageInfoUpdate', villageData.value)
                    .then((res) => {
                        Vue.prototype.$message.success('保存成功！')
                    })
            }

            const getVillageInfo = () => {
                Vue.prototype.request(villageSetApi.villageInfo, {}).then((res) => {
                    villageData.value = res
                })
            }

            onMounted(() => {
                getVillageInfo()
            })

            return {
                ruleForm,
                labelCol,
                wrapperCol,
                villageData,
                rules,
                formLayout,
                onSubmit,
                resetForm,
                getVillageInfo
            }
        }
    }
</script>

<style lang="less" scoped>
    .village_info_set {
        width: 100%;

        .input_style_240 {
            width: 360px;
        }
    }

    /deep/ textarea {
        overflow-x: hidden;
        overflow-y: scroll !important;
    }
</style>
