<template>
    <a-modal title="楼层编辑" :visible="visible" :width="500" :loading="confirmLoading" @cancel="resetForm(false)" @ok="onSubmit">
        <a-form-model ref="ruleForm" :model="layerForm" :rules="rules" :label-col="labelCol"
           :wrapper-col="wrapperCol">
           <a-form-model-item label="楼层名称" prop="layer_name">
               <a-input class="input_style_240" v-model="layerForm.layer_name" />
           </a-form-model-item>
           <a-form-model-item label="楼层编号" prop="layer_number">
              <a-input :disabled="true" class="input_style_240" v-model="layerForm.layer_number" />
           </a-form-model-item>
           <a-form-model-item label="状态" prop="status">
              <a-switch v-if="visible" v-model="layerStatus" checked-children="开" un-checked-children="关" @change="checkChange" />
           </a-form-model-item>
        </a-form-model>
    </a-modal>
</template>

<script>
    import Vue from 'vue';
    import {
        ref,
        watch,
        onMounted,
        defineComponent
    } from '@vue/composition-api';
    import store from '@/store';
    import villageNew from "@/api/community/village/villageNewApi";
    export default defineComponent({
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            layer_id: {
                type: [String, Number],
                default: 0
            }
        },
        setup(props, context) {
            const confirmLoading = ref(false)
            const layerForm = ref({})
            const rules = ref({
                layer_name: [{ required: true, message: '请输入'+store.getters.config.floor_name+'名称', trigger: 'blur' }],
                layer_number: [{ required: true, message: '请输入'+store.getters.config.floor_name+'编号', trigger: 'blur' }]
            })
            const ruleForm = ref()
            const labelCol = ref({
                span: 6
            })
            const wrapperCol = ref({
                span: 16
            })

            const onSubmit = () => {
                ruleForm.value.validate(valid => {
                    if (valid) {
                        confirmLoading.value = true
                        saveForm()
                    }
                })
            }

            const resetForm = (flag) => {
                context.emit('exit', flag)
                layerForm.value = {}
                ruleForm.value.resetFields()
            }
            let layerStatus = ref(false)

            const saveForm = () => {
                if(layerStatus.value){
                    layerForm.value.status = 2
                } else{
                    layerForm.value.status = 1
                }
                let params = {
                    layer_id: layerForm.value.id,
                    layer_name: layerForm.value.layer_name,
                    layer_number: layerForm.value.layer_number,
                    status: layerForm.value.status
                }
                Vue.prototype.request('/community/village_api.Building/updatelayerInfoByID', params).then((res) => {
                    confirmLoading.value = false
                    Vue.prototype.$message.success('编辑成功！')
                    resetForm('layer')
                }).catch(e=>{
                    confirmLoading.value = false
                })
            }
            

            const getLayerInfo = (layer_id) => {
                Vue.prototype.request('/community/village_api.Building/layerInfo', {
                    layer_id,
                }).then((res) => {
                    layerForm.value = res
                    if(layerForm.value.status == 2){
                        layerStatus.value = true
                    } else{
                        layerStatus.value = false
                    }
                })
            }
            
            const checkChange = (e) => {
                layerStatus.value = e
            }

            watch(() => props.visible, (val) => {
                if(val){
                    getLayerInfo(props.layer_id)
                }
            }, {
                deep: true
            })

            return {
                confirmLoading,
                onSubmit,
                resetForm,
                layerForm,
                labelCol,
                wrapperCol,
                rules,
                saveForm,
                ruleForm,
                layerStatus,
                checkChange
            }
        }
    })
</script>

<style lang="less" scoped>
    .input_style_240 {
        width: 240px;
    }
</style>
