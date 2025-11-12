<template>
    <a-drawer :title="title" :visible="visible" :width="700" @close="resetForm(false)" :body-style="{ paddingBottom: '80px' }">
        <a-form-model ref="ruleForm" :model="buildForm" :rules="rules" :label-col="labelCol"
           :wrapper-col="wrapperCol">
           <div style="display: flex;">
               <a-card title="基本信息" style="width: 630px">
                   <a-form-model-item label="楼层名称" prop="layer_name">
                       <a-input class="input_style_240" v-model="buildForm.layer_name" />
                   </a-form-model-item>
                   <a-form-model-item label="楼层编号" prop="layer_number">
                       <a-input-number :max="99" :min="1" class="input_style_240" v-model="buildForm.layer_number" extra="必填项（仅限1-99不重复的数字" />
                   </a-form-model-item>

                   <a-form-model-item label="排序" prop="sort" extra="数字越大越靠前">
                       <a-input-number :min="0" class="input_style_240" v-model="buildForm.sort" />
                   </a-form-model-item>
                   <a-form-model-item label="状态" prop="status">
                       <a-switch checked-children="开启" un-checked-children="关闭" v-model="statusBool" default-checked  />
                   </a-form-model-item>
               </a-card>
           </div>
        </a-form-model>
        <div :style="{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e8e8e8',
              padding: '10px 16px',
              textAlign: 'right',
              left: 0,
              background: '#fff',
              borderRadius: '0 0 4px 4px',
            }">
            <a-button  @click="resetForm(false)" style="margin-right:30px;">
                关闭
            </a-button>
            <a-button type="primary" :loading="confirmLoading" @click="onSubmit" style="margin-right: 50px;">
                保存
            </a-button>
        </div>
    </a-drawer>
</template>

<script>
    import Vue from 'vue';
    import moment from 'moment';
    import {
        ref,
        watch,
        reactive,
        onMounted,
        nextTick,
        defineComponent
    } from '@vue/composition-api';
    import villageNew from "@/api/community/village/villageNewApi";
    export default defineComponent({
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            single_id: {
                type: [String, Number],
                default: 0
            },
             floor_id: {
                type: [String, Number],
                default: 0
            },
            layer_id: {
                type: [String, Number],
                default: 0
            }
        },
        setup(props, context) {
            watch(() => props.visible, (val) => {
                if(val){
                    if(props.layer_id>0){
                        title.value='编辑楼层';
                    }else{
                        title.value='添加楼层';
                    }
                    getLayerInfo(props.single_id,props.floor_id,props.layer_id)
                }
            }, {
                deep: true
            })
            const formDate = (date) =>{
                let year = date.getFullYear()
                let mon = (date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : date.getMonth()+1
                let data = date.getDate()  < 10 ? "0"+(date.getDate()) : date.getDate()
                let newDate = year +"-"+ mon +"-"+ data
                return newDate
            }
            const statusBool = ref(false)
            const searchArea = ref(false)
            const confirmLoading = ref(false)
            const buildForm = ref({})
            const title = ref('编辑楼层')
 
            const rules = ref({
                layer_name: [{ required: true, message: '请输入楼层名称', trigger: 'blur' }],
                layer_number: [{ required: true, message: '请输入楼层编号', trigger: 'blur' }],
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
                        buildForm.value.single_id =props.single_id
                        buildForm.value.status = statusBool.value?1:0
                        console.log('buildForm.value===>', buildForm.value)
                        confirmLoading.value = true
                        saveForm()
                    }
                })
            }
            const resetForm = (flag) => {
                context.emit('closeLayerDrawer', flag)
                buildForm.value = {}
                ruleForm.value.resetFields()
            }

            const saveForm = () => {
                Vue.prototype.request(villageNew.saveUnitRentalLayerInfo, buildForm
                    .value).then((res) => {
                    confirmLoading.value = false
                    if(props.floor_id>0){
                        Vue.prototype.$message.success('编辑成功！')
                    }else{
                        Vue.prototype.$message.success('添加成功！')
                    }
                    resetForm(true)
                }).catch(e=>{
                    confirmLoading.value = false
                })
            }
            const getLayerInfo = (single_id,floor_id,layer_id) => {
                Vue.prototype.request(villageNew.unitRentalLayerInfo, {
                    single_id,floor_id,layer_id,
                }).then((res) => {
                    buildForm.value = res
                    statusBool.value = res.status == 1?true:false
                })
            }
            return {
                confirmLoading,
                onSubmit,
                resetForm,
                buildForm,
                labelCol,
                wrapperCol,
                rules,
                saveForm,

                //如期插件
                ruleForm,
                searchArea,
                formDate,
                moment,
                statusBool,
                title,
                getLayerInfo,
            }
        }
    })
</script>

<style lang="less" scoped>
    .input_style_240 {
        width: 240px;
    }
    .input_style_140{
        width: 140px;
    }
</style>
