<template>
    <a-modal :title="$store.getters.config.house_name+$store.getters.config.floor_name+'编辑'" :visible="visible" :width="600" :loading="confirmLoading" @cancel="resetForm(false)" @ok="onSubmit">
        <a-form-model ref="ruleForm" :model="unitForm" :rules="rules" :label-col="labelCol"
           :wrapper-col="wrapperCol">
           <a-form-model-item :label="$store.getters.config.floor_name+'名称'" prop="floor_name">
               <a-input class="input_style_240" v-model="unitForm.floor_name" />
           </a-form-model-item>
           <a-form-model-item :label="$store.getters.config.floor_name+'编号'" prop="floor_number">
              <a-input class="input_style_240" v-model="unitForm.floor_number" />
           </a-form-model-item>
           <a-form-model-item label="IC卡门禁编号" v-if="unitForm.write_iccard*1>0" extra="多个门禁机编号以英文的逗号区分 例如(0,4)，单个门禁机直接填写门禁机编号">
              <a-input class="input_style_240" v-model="unitForm.door_control" />
           </a-form-model-item>
            <a-form-model-item label="采集点位id" prop="dwid" v-if="show_dwid">
                <a-input class="input_style_240" v-model="unitForm.dwid" />
            </a-form-model-item>
           <a-form-model-item label="海康智慧社区单元"  v-if="hik_info_vision_i_community==1" extra="如果没有数据请去楼栋管理页面 更新数据,并检查此楼栋是否绑定了海康智慧社区楼栋 。如果切换绑定的单元,将会解除该单元下的所有已绑定的对应关系。切换后请去手动重新绑定已有的房间数据">
               <a-select  placeholder="请选择匹配的单元" class="input_style_240"
                   @change="handleFloorSelectChange"  v-model="unitForm.third_floor_index_id" >
                   <a-select-option value="">请选择一个匹配的单元</a-select-option>
                   <a-select-option v-for="(item, index) in hik_info_community_floor" :value="item.index_code" :index="index" :disabled="item.is_disabled" >
                       {{item.name}}</a-select-option>
               </a-select>
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
    import villageNew from "@/api/community/village/villageNewApi";
    import store from '@/store';
    export default defineComponent({
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            floor_id: {
                type: [String, Number],
                default: 0
            }
        },
        setup(props, context) {
            const confirmLoading = ref(false)
            const unitForm = ref({})
            const rules = ref({
                floor_name: [{ required: true, message: '请输入'+store.getters.config.floor_name+'名称', trigger: 'blur' }],
                floor_number: [{ required: true, message: '请输入'+store.getters.config.floor_name+'编号', trigger: 'blur' }]
            })
            const ruleForm = ref()
            const labelCol = ref({
                span: 6
            })
            const wrapperCol = ref({
                span: 16
            })
            const hik_info_vision_i_community= ref(0)
            const show_dwid = ref(0)
            const hik_info_community_floor= ref([])
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
                unitForm.value = {}
                ruleForm.value.resetFields()
            }

            const saveForm = () => {
                let params = {
                    floor_id: unitForm.value.floor_id,
                    floor_name: unitForm.value.floor_name,
                    floor_number: unitForm.value.floor_number
                }
                if(hik_info_vision_i_community.value==1){
                    params.third_floor_index_id=unitForm.value.third_floor_index_id;
                }
                if(show_dwid.value > 0){
                    params.dwid=unitForm.value.dwid;
                }
                if(unitForm.value.write_iccard*1>0){
                    params.door_control=unitForm.value.door_control;
                }
                Vue.prototype.request('/community/village_api.Building/updateFloorInfoByID', params).then((res) => {
                    confirmLoading.value = false
                    Vue.prototype.$message.success('编辑成功！')
                    resetForm('unit')
                }).catch(e=>{
                    confirmLoading.value = false
                })
            }

            const getFloorInfo = (floor_id) => {
                Vue.prototype.request('/community/village_api.Building/floorInfo', {
                    floor_id,
                }).then((res) => {
                    unitForm.value = res
                    hik_info_vision_i_community.value=0;
                    if(res.hik_info_vision_i_community){
                        hik_info_vision_i_community.value=res.hik_info_vision_i_community
                    }
                    hik_info_community_floor.value=[]
                    if(res.hik_info_community_floor){
                        hik_info_community_floor.value=res.hik_info_community_floor
                    }
                    show_dwid.value = res.show_dwid
                })
            }

            watch(() => props.visible, (val) => {
                if(val){
                    getFloorInfo(props.floor_id)
                }
            }, {
                deep: true
            })
            const handleFloorSelectChange=(value,option)=>{
                 console.log('value',value);
                 console.log('option',option);
                 
            }
            return {
                confirmLoading,
                onSubmit,
                resetForm,
                unitForm,
                labelCol,
                wrapperCol,
                rules,
                saveForm,
                ruleForm,
                hik_info_vision_i_community,
                show_dwid,
                hik_info_community_floor,
                handleFloorSelectChange
            }
        }
    })
</script>

<style lang="less" scoped>
    .input_style_240 {
        width: 240px;
    }
</style>
