<template>
    <a-form-model ref="ruleForm" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <div class="form_con" style="display: flex;flex-wrap: wrap;">
            <a-form-model-item v-for="(item, index) in baseForm" :key="index" style="width: 33.3%;">
                <div slot="label">
                    <span v-if="item.is_must" style="color: red;">*</span>
                    <span>{{item.title}}：</span>
                </div>
                <!-- 文本 -->
                <div class="form_item"  style="width: 280px;"  v-if="item.type == 1">
                    <a-textarea v-if="item.input_type!=undefined && item.input_type=='textarea'"
                        v-model="baseForm[index].value" 
                        style="width: 280px;" 
                        :placeholder="'请输入'+item.title"
                        :disabled="item.is_disabled"
                        :auto-size="{ minRows: 5, maxRows: 10 }"
                    />
                    <a-input :disabled="item.is_disabled" style="width: 200px;" v-model="baseForm[index].value" :placeholder="'请输入'+item.title"  v-else />
                </div>
                <!-- 单选 -->
                <div class="form_item" v-if="item.type == 2">
                    <a-select :disabled="item.is_disabled" v-model="baseForm[index].value" :placeholder="'请选择'+item.title" style="width: 200px;">
                        <a-select-option v-for="(item1, index1) in item.use_field" :value="item1">{{item1}}</a-select-option>
                    </a-select>
                </div>
                <!-- 籍贯 -->
                <div class="form_item" style="display: flex; align-items: center;" v-if="item.type == 3">
                    <a-select placeholder="选择省" @change="(value) => handleSelectChange(value, 'province_id', index)" :disabled="item.is_disabled" v-model="province_id" style="width: 99px;" >
                        <a-select-option v-for="(item1, index1) in provinceList" :value="item1.id+''">{{item1.name}}</a-select-option>
                    </a-select>
                    <a-select placeholder="选择市" @change="(value) => handleSelectChange(value, 'city_id', index)" :disabled="item.is_disabled" v-model="city_id" style="width: 99px; margin-left:2px;">
                        <a-select-option v-for="(item1, index1) in cityList" :value="item1.id+''">{{item1.name}}</a-select-option>
                    </a-select>
                </div>
                <!-- 日期 -->
                <div class="form_item" v-if="item.type == 4">
                    <a-date-picker :disabled="item.is_disabled" v-if="baseForm[index].value" @change="(date, dateString) => onChangeBirthdayTime(date, dateString,index)"  :default-value="moment(baseForm[index].value, 'YYYY-MM-DD')" style="width: 200px;" :placeholder="'请选择'+item.title" format="YYYY-MM-DD" />
                    <a-date-picker :disabled="item.is_disabled" v-else style="width: 200px;" @change="(date, dateString) => onChangeBirthdayTime(date, dateString,index)"  :placeholder="'请选择'+item.title" format="YYYY-MM-DD" />
                </div>
            </a-form-model-item>
        </div>
        <a-form-model-item v-if="baseForm" :wrapper-col="{ span: 14, offset: 2 }">
            <a-button type="primary" @click="onSubmit">保存</a-button>
        </a-form-model-item>
    </a-form-model>
</template>

<script>
    import moment from 'moment';
    import Vue from 'vue';
    import {
        ref,
        watch,
        onMounted,
        nextTick,
        defineComponent
    } from '@vue/composition-api';
    import villageNew from "@/api/community/village/villageNewApi";
    export default defineComponent({
        props: {
            formParams: {
                type: Object,
                default: ()=>{return {}}
            },
            pigcms_id: {
                type: [String, Number],
                default: ''
            }
        },
        setup(props, context) {
            const labelCol = ref({
                span: 6
            })
            const wrapperCol = ref({
                span: 14
            })
            let delayPost = ref(false)
            const baseForm = ref([])
            baseForm.value = props.formParams.field_list
            const rules = ref({})
            const ruleForm = ref()
            
            let provinceList = ref([])
            let province_id = ref('')
            let province_name = ref('')
            const getProvince = () => {
                Vue.prototype.request('/community/village_api.Building/getHouseVillageProvince').then(res=>{
                    provinceList.value = res
                    baseForm.value.map(v=> {
                        if(v.value == 0){
                            v.value = undefined
                        }
                        if(v.type == 3){
                            let arr = v.value.split('#')
                            province_id.value = arr[0]!=0?arr[0]:undefined
                            city_id.value = arr[1]!=0?arr[1]:undefined
                            console.log(v.value, arr)
                            provinceList.value.map(item=>{
                                if(province_id.value == item.id){
                                    province_name.value = item.name
                                    getCity(province_id.value, province_name.value)
                                }
                            })
                        }
                    })
                })
            }
            let city_id = ref('')
            let cityList = ref([])
            const getCity = (id, name) => {
                Vue.prototype.request('/community/village_api.Building/getHouseVillageCity', {id, name,}).then(res=> {
                    cityList.value = res
                })
            }
            
            watch(()=>props.formParams, val=>{
                baseForm.value = val.field_list
                getProvince()
            })
            const onSubmit = ()=> {
                let flag = false
                let resultParams = []
                baseForm.value.map(item=>{
                    if(item.is_must && !item.value){
                        flag = true
                    }
                    resultParams.push({
                        key: item.key,
                        value: item.value?item.value:0,
                        type: item.type,
                        title: item.title,
                        source: item.source,
                        is_must: item.is_must
                    })
                })
                if(flag){
                    Vue.prototype.$message.warn('请填写必填项')
                    return
                }
                if(delayPost.value){
                    Vue.prototype.$message.warn('正在提交中，请稍等...')
                    return 
                }
                delayPost.value = true
                Vue.prototype.request('/community/village_api.Building/subRoomBindUserData', {
                    pigcms_id: props.pigcms_id,
                    basic_data: resultParams
                }).then((res) => {
                    delayPost.value = false
                    Vue.prototype.$message.success('保存成功！')
                }).catch(e=>{
                    delayPost.value = false
                })
            }
            const onChangeBirthdayTime = (date, dateString,index) => {
				baseForm.value[index].value=dateString;
			}
            const handleSelectChange = (value, type, index) => {
                if(type == 'province_id'){
                    province_id.value = value
                    cityList.value = []
                    city_id.value = ''
                    provinceList.value.map(item=>{
                        if(province_id.value == item.id){
                            province_name.value = item.name
                            getCity(province_id.value, province_name.value)
                        }
                    })
                    baseForm.value[index].value = province_id.value + '#'
                } else if(type == 'city_id'){
                    city_id.value = value
                    baseForm.value[index].value = province_id.value + '#' + city_id.value
                }
            }
            
            const resetForm = () => {
                ruleForm.value.resetFields();
            }
            return {
                labelCol,
                wrapperCol,
                baseForm,
                rules,
                onSubmit,
                resetForm,
                moment,
                delayPost,
                
                provinceList,
                province_id,
                province_name,
                getProvince,
                city_id,
                cityList,
                getCity,
                handleSelectChange,
				onChangeBirthdayTime
            }
        }
    })
</script>

<style lang="less" scoped>
    /deep/ textarea {
        overflow-x: hidden;
        overflow-y: scroll !important;
    }
    /deep/ .ant-form-item-label > label::after{
        display: none;
    }
</style>
