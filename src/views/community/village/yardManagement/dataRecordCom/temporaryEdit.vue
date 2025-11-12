<template>
    <a-drawer title="详情" :width="900" :visible="visible" @close="handleSubCancel">
        <a-form-model ref="ruleForm" :model="temporaryForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <div class="add_temporary">
                <div class="label_title">车辆信息</div>
                <div class="form_content">
                    <a-form-model-item label="订单编号" class="form_item" prop="order_id">
                        <a-input :disabled="true" v-model="temporaryForm.order_id" placeholder=""></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="车场" class="form_item" prop="park_name">
                        <a-input :disabled="true" v-model="temporaryForm.park_name" placeholder=""></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="车牌号" class="form_item" prop="car_number">
                        <a-input :disabled="true" v-model="temporaryForm.car_number" placeholder=""></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="车辆类型" class="form_item" prop="car_type">
                        <a-input :disabled="true" v-model="temporaryForm.car_type" placeholder=""></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="用户姓名" class="form_item" prop="user_name">
                        <a-input :disabled="true" v-model="temporaryForm.user_name" placeholder=""></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="用户手机号" class="form_item" prop="user_phone">
                        <a-input :disabled="true" v-model="temporaryForm.user_phone" placeholder=""></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="入场通道" class="form_item" prop="in_channel_name">
                        <a-input :disabled="true" v-model="temporaryForm.in_channel_name" placeholder=""></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="入场时间" class="form_item" prop="in_accessTime">
                        <a-input :disabled="true" v-model="temporaryForm.in_accessTime" placeholder=""></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="出场通道" class="form_item" prop="out_channel_name">
                        <a-input :disabled="true" v-model="temporaryForm.out_channel_name" placeholder=""></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="出场时间" class="form_item" prop="out_accessTime">
                        <a-input :disabled="true" v-model="temporaryForm.out_accessTime" placeholder=""></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="停车时间" class="form_item">
                        <a-input :disabled="true" v-model="temporaryForm.park_time_str" placeholder=""></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="应付金额" class="form_item" prop="totalMoney">
                        <a-input :disabled="true" v-model="temporaryForm.totalMoney" placeholder=""></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="优惠券" class="form_item" prop="deductionTotal">
                        <a-input :disabled="true" v-model="temporaryForm.deductionTotal" placeholder=""></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="实付金额" class="form_item" prop="total">
                        <a-input :disabled="true" v-model="temporaryForm.total" placeholder=""></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="支付类型" class="form_item" prop="pay_type">
                        <a-input :disabled="true" v-model="temporaryForm.pay_type" placeholder=""></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="支付时间" class="form_item" prop="pay_time">
                        <a-input :disabled="true" v-model="temporaryForm.pay_time" placeholder=""></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="收费标准" class="form_item" prop="rule_name">
                        <a-input :disabled="true" v-model="temporaryForm.rule_name" placeholder=""></a-input>
                    </a-form-model-item>
                </div>
            </div>
            
            <div class="add_temporary">
                <div class="label_title">进出抓拍图片</div>
                <div class="pic_container">
                    <div class="pic_item" v-if="temporaryForm.in_accessImage">
                        <viewer :images="[temporaryForm.in_accessImage]">
                            <img :src="temporaryForm.in_accessImage">
                        </viewer>
                        <div class="text" style="margin-left: 20px;">入场抓拍</div>
                    </div>
                    <div class="pic_item" v-if="temporaryForm.out_accessImage">
                        <viewer :images="[temporaryForm.out_accessImage]">
                            <img :src="temporaryForm.out_accessImage">
                        </viewer>
                        <div class="text" style="margin-left: 20px;">出场抓拍</div>
                    </div>
                </div>
            </div>
        </a-form-model>
    </a-drawer>
</template>

<script>
    import villageApi from '@/api/community/village';
    import 'viewerjs/dist/viewer.css'
    import Viewer from 'v-viewer'
    import Vue from 'vue'
    Vue.use(Viewer)
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            modelTitle: {
                type: String,
                default: ''
            },
            temporary_id: {
                type: String,
                default: ''
            },
            out_record_id: {
                type: String,
                default: ''
            },
        },
        
        watch:{
            temporary_id: {
                immediate: true,
                handler (val) {
                    this.getTemporaryInfo()
                }
            }
        },
        
        data() {
            return {
                labelCol: { span: 6 },
                wrapperCol: { span: 14 },
                temporaryForm: {
                    name: ''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入车场名称', trigger: 'blur' },
                    ]
                }
            }
        },

        methods: {
            clearForm(){
                this.temporaryForm = {}
            },
            handleSubmit(e) {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        setTimeout(() => {
                            this.$emit('closeTemporary', true)
                            this.clearForm()
                        }, 2000);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleSubCancel(e) {
                this.$refs.ruleForm.resetFields();
                this.$emit('closeTemporary', false)
                this.clearForm()
            },
            
            handleSelectChange(value) {
                console.log(`selected ${value}`);
            },
            
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            getTemporaryInfo(){
                let that = this
                if(that.temporary_id){
                    let post_data={record_id: that.temporary_id};
                    post_data.out_record_id=that.out_record_id;
                    that.request(villageApi.getTempParkInfo, post_data).then((res) => {
                        that.temporaryForm = res
                        that.temporaryForm.record_id = res.record_id
                    })
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    .form_title{
        font-size: 14px;
        font-weight: bold;
    }
    
    .form_line{
        height: 0.5px;
        width: 100%;
        background-color: #eeeeee;
        margin: 10px 0;
    }
    
    .generation_rules{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-top: 5px;
    }
    
    .footer_button{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-right: 50px;
        // position: fixed;
        // bottom: 100;
        // right: 20;
        // z-index: 999;
    }
    
    .form_item{
        width: 49%;
    }
    
    /deep/ textarea{
        overflow-x: hidden;
        overflow-y: scroll !important;
    }
    
    .add_temporary{
        width: 100%;
    }
    
    .form_content{
        display: flex; 
        flex-wrap: wrap;
    }
    
    .label_title{
        font-weight: bold;
        display: flex;
        width: 120px;
        border-left: 6px solid skyblue;
        margin-left: 10px;
        align-items: center;
        padding-left: 15px;
        margin-bottom: 20px;
    }
    
    .pic_container{
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
    }
    
    .pic_item{
        width: 46%;
        img{
            width: 100%;
        }
    }
</style>
