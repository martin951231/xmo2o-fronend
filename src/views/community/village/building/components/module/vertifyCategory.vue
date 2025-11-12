<template>
    <a-modal title="修改质保类别名称申请" :width="500" :visible="visible" :confirmLoading="confirmLoading" @cancel="onClose"
        @ok="handleOk" centered>
        <a-form-model :model="warrantyForm" layout="vertical" ref="ruleForm" :rules="rules">
            <a-form-model-item label="类别名称" prop="categoryArr">
                <a-cascader v-model="warrantyForm.categoryArr" :load-data="()=>{}" change-on-select :options="cateList" placeholder="请选择" @change="handleSelectChange" />
            </a-form-model-item>
            <a-form-model-item label="修改后类别名称" prop="change_name">
                <a-input placeholder="请输入" v-model="warrantyForm.change_name" />
            </a-form-model-item>
            <a-form-model-item label="原因" prop="reason">
                <a-textarea placeholder="请输入" style="height: 100px; resize: none" v-model="warrantyForm.reason" />
            </a-form-model-item>
        </a-form-model>
    </a-modal>
</template>

<script>
    import Vue from 'vue';
    import {
        toRefs,
        ref,
        watch,
        reactive,
        onMounted,
        onUpdated,
        defineComponent
    } from '@vue/composition-api';
    import moment from 'moment';
    export default defineComponent({
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        setup(props, context) {
            const ruleForm = ref()
            const state = reactive({
                confirmLoading: false,
                warrantyForm: {
                    categoryArr: [],
                    change_name: '',
                    quality_id: undefined,
                    reason: ''
                },
                cateList: [],
                rules: {
                    change_name: [{
                        required: true,
                        message: '请输入'
                    }, ],
                    categoryArr: [{
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }, ],
                    reason: [{
                        required: true,
                        message: '请输入'
                    }, ],
                },
            })

            const getCateList = (fid = 0) => {
                return new Promise((resolve, reject) => {
                    Vue.prototype.request(
                        '/community/village_api.workorder.CommunityQuality/getCommunityQualityList', {
                            fid,
                        }).then(res => {
                            if(fid == 0){
                                state.cateList = res.list.map(item=>{
                                    return {
                                        label: item.category_name,
                                        value: item.id,
                                        isLeaf: false
                                    }
                                })
                            }
                            resolve(res.list)
                    }).catch(err=>{
                        reject(err)
                    })
                })
                
            }

            const onClose = () => {
                context.emit('close')
                clearForm()
            }

            const clearForm = () => {
                state.warrantyForm = {
                    categoryArr: [],
                    change_name: '',
                    quality_id: undefined,
                    reason: ''
                }
                state.confirmLoading = false
                ruleForm.value.resetFields();
                state.cateList = []
            }

            const handleOk = () => {
                ruleForm.value.validate(valid => {
                    if (valid) {
                        state.confirmLoading = true
                        if(state.warrantyForm.categoryArr.length != 2){
                            Vue.prototype.$message.warn('请选择二级类别')
                            state.confirmLoading = false
                            return
                        }
                        let params = {
                            change_name: state.warrantyForm.change_name,
                            quality_id: state.warrantyForm.categoryArr[1],
                            reason: state.warrantyForm.reason,
                        }
                        Vue.prototype.request('/community/village_api.workorder.CommunityQuality/applyChangeCommunityQualityName',
                            params).then(res => {
                            state.confirmLoading = false
                            Vue.prototype.$message.success('修改成功！')
                            context.emit('close', true)
                            state.clearForm()
                        }).catch(err => {
                            state.confirmLoading = false
                        })
                    }
                });
            }

            const handleSelectChange = async (value, selectedOptions) => {
                if(selectedOptions.length == 1){
                    const targetOption = selectedOptions[0];
                    const options_temp = [...state.cateList]
                    if(targetOption.children && targetOption.children.length>0) return
                    targetOption.loading = true
                    const list = await getCateList(value[0])
                    let children = []
                    targetOption.loading = false
                    list.map(item=>{
                        children.push({
                           label: item.category_name,
                           value: item.id,
                           isLeaf: true
                        })
                    })
                    
                    options_temp.map(item=>{
                        if(item.value == value[0]){
                            item.children = children
                        }
                    })
                    
                    state.cateList = options_temp
                }
            }

            watch(() => props.visible, val => {
                if (val) {
                    getCateList()
                }
            })

            return {
                ...toRefs(state),
                ruleForm,
                onClose,
                handleOk,
                handleSelectChange
            }
        }
    })
</script>

<style lang="less" scoped>
    /deep/ textarea {
        overflow-x: hidden;
        overflow-y: scroll !important;
    }
</style>