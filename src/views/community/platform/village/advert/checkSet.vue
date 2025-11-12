<template>
    <div class="check_set">
        <a-alert type="info" show-icon>
            <template slot="description">
                <div class="title" style="font-weight: bold;">提示说明</div>
                <div class="desc">1、设置添加广告的审核管理人员</div>
                <div class="desc">2、广告审核流程从上往下进行设置，最多可以设置5人进行审核。审核流程可根据当前角色减少申请流程（只有设置的审批人发起转单会减少审核流程）</div>
            </template>
        </a-alert>
        <div v-if="orderReviewForm.msg" >
            <a-alert type="warning" show-icon>
                <template slot="description">
                    <div class="title" style="font-weight: bold;">有在审核的流程未结束（{{orderReviewForm.msg}}），不可改动相关设置 </div>
                </template>
            </a-alert>
        </div>
        <a-form-model ref="ruleForm" :model="orderReviewForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <a-form-model-item label="是否启用转单审批流程" prop="check_open">
                <a-radio-group name="radioGroup" v-model="orderReviewForm.check_open">
                    <a-radio :value="0">关闭</a-radio>
                    <a-radio :value="1">开启</a-radio>
                </a-radio-group>
            </a-form-model-item>

            <a-form-model-item label="添加审批人">
                <div class="select_container">
                    <div class="select_item" v-for="(item, index) in selectList" :key="index">
                        <a-select allowClear placeholder="请选择审批人" style="width: 350px" v-model="selectList[index].value">
                            <a-select-option v-for="(item, index) in workList" :value="item.value" :key="index">{{item.name}}</a-select-option>
                        </a-select>
                        <a-button @click="operateThis(item, index)" style="margin-left: 10px;"
                            :type="index==0?'primary':'danger'">{{index==0?'增加':'删除'}}</a-button>
                    </div>
                </div>
            </a-form-model-item>

            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="onSubmit">保存</a-button>
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
        defineComponent,
        toRefs
    } from '@vue/composition-api';
    export default defineComponent({
        name: 'orderReviewSet',
        setup(props, context) {
            const ruleForm = ref(null)
            const state = reactive({
                workList: [],
                selectList: [{
                    value: undefined,
                    index: 0
                }],
                orderReviewForm: {
                    property_id: 0,
                    village_id: 0,
                    xtype: '',
                    check_open: 0,
                    check_level: []
                },
                labelCol: {
                    span: 4
                },
                wrapperCol: {
                    span: 4
                },
                rules: {}
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
            const saveForm = () => {
                let flag = false
                state.selectList.map(v=>{
                    if(!v.value){
                        flag = true
                    }
                })
                if(flag){
                    Vue.$message.warn('请先完善审批人信息')
                    return
                }
                console.log('1state.selectList', state.selectList)
                state.orderReviewForm.check_level = []
                state.selectList.map((v, i)=>{
                    console.log('v', i)
                    state.orderReviewForm.check_level.push({
                        level_v: i,
                        level_wid: state.selectList[i].value
                    })
                    console.log('state.selectList[i].value', state.selectList[i].value)
                })
                Vue.prototype.request('/community/platform.advert.CheckConfig/advertCheckSet',
                    state.orderReviewForm).then((res) => {
                    Vue.prototype.$message.success('设置成功！')
                })
            }
            
            const getList = () => {
                Vue.prototype.request('/community/platform.advert.CheckConfig/getAdminList', {}).then(res=>{
                    state.workList = res.list
                })
            }
            
            const getSetInfo = () => {
                Vue.prototype.request('/community/platform.advert.CheckConfig/getAdvertCheckSetInfo', {
                    xtype: 'house_advert_check'
                }).then(res=>{
                    state.orderReviewForm = res.info
                    if(res.info.check_level && res.info.check_level.length>0){
                        state.selectList = []
                        res.info.check_level.map((v, i)=>{
                            state.selectList.push({
                                value: v.level_wid*1,
                                index: i
                            })
                        })
                        console.log('state.selectList', state.selectList)
                    }
                })
            }

            const operateThis = (item, index) => {
                if (index == 0) {
                    state.selectList.push({
                        value: undefined,
                        index: state.selectList.length
                    })
                } else {
                    state.selectList[index].value = undefined
                    state.selectList.splice(index, 1)
                }
            }

            onMounted(() => {
                getList()
                getSetInfo()
            })
            
            return {
                ruleForm,
                onSubmit,
                saveForm,
                operateThis,
                ...toRefs(state)
            }
        }
    })
</script>

<style lang="less" scoped>
    .check_set {
        width: 100%;
        .select_container{
            width: 100%;
            transform: translateY(-5px);
            .select_item{
                width: 500px;
                margin-top: 10px;
                display: flex;
                align-items: center;
            }
        }
    }
</style>
