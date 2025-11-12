<template>
    <div class="access_control_set">
        <a-form-model ref="ruleForm" :model="accessControlForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <a-form-model-item label="允许欠物业费开门" extra="不允许则欠物业费立即不能开门，允许还可以设置延期天数，在延期天数内还可以开门，过期则不能" prop="plot_area">
                <a-radio-group name="radioGroup" v-model="accessControlForm.village_single_support_digit">
                    <a-radio :value="3">允许</a-radio>
                    <a-radio :value="2">不允许</a-radio>
                </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="是否开启智能访客临时开门功能"
                :extra="'智能访客开门功能指业主可以将自己所在'+$store.getters.config.house_name+'的开门权限分享给他的访客好友等，为实现智慧'+$store.getters.config.house_name+'智能门禁增添色彩。（当前平台该功能处于开启状态）'"
                prop="temporary_visitor_switch">
                <a-radio-group name="radioGroup" v-model="accessControlForm.temporary_visitor_switch">
                    <a-radio :value="3">开启</a-radio>
                    <a-radio :value="2">关闭</a-radio>
                </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="智能访客开门最长时效" extra="社区访客临时开门有效期最大限制为7天，如您有需要超过7天以上的权限请协助业主将他的访客添加为 家属 即可实现长期开门。"
                prop="temporary_visitor_time">
                <a-select show-search placeholder="请选择智能访客开门最长时效" style="width: 200px"
                    :value="accessControlForm.temporary_visitor_time" @change="handleChange">
                    <a-select-option v-for="(item,index) in visitorTimeList" :value="item.value">{{item.label}}
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="onSubmit">保存</a-button>
                <a-button style="margin-left: 10px;" @click="resetForm">重置</a-button>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>

<script>
    // import configVillageApi from '@/api/community/village/index.js';
    import Vue from 'vue';
    import {
        ref,
        reactive,
        onMounted,
        defineComponent
    } from '@vue/composition-api';
    export default defineComponent({
        name: 'accessControlSet',
        setup(props, context) {
            onMounted(() => {})

            const visitorTimeList = ref([{
                    label: '1小时',
                    value: 1
                },
                {
                    label: '2小时',
                    value: 2
                },
                {
                    label: '3小时',
                    value: 3
                },
                {
                    label: '4小时',
                    value: 5
                },
                {
                    label: '8小时',
                    value: 8
                },
                {
                    label: '10小时',
                    value: 10
                },
                {
                    label: '12小时',
                    value: 12
                },
                {
                    label: '一天',
                    value: 24
                },
                {
                    label: '两天',
                    value: 48
                },
                {
                    label: '三天',
                    value: 72
                },
                {
                    label: '四天',
                    value: 92
                },
                {
                    label: '五天',
                    value: 120
                },
                {
                    label: '六天',
                    value: 144
                },
                {
                    label: '七天',
                    value: 168
                }
            ])

            let accessControlForm = ref({})
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
                Vue.prototype.request('/community/village_api.VillageConfig/villageInfoUpdate', accessControlForm
                    .value).then((res) => {
                    Vue.prototype.$message.success('保存成功！')
                })
            }

            const handleChange = (value) => {
                console.log(`selected ${value}`)
            }

            return {
                handleChange,
                visitorTimeList,
                accessControlForm,
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
