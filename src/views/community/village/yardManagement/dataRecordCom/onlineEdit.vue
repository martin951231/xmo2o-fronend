<template>
    <a-drawer title="修改" :width="900" :visible="visible" @close="handleSubCancel">
        <a-form-model ref="ruleForm" :model="onlineForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <div class="add_coupon" style="display: flex; flex-wrap: wrap;">
                <a-form-model-item label="订单编号" class="form_item" prop="order_id">
                    <a-input :disabled="true" v-model="onlineForm.order_id" placeholder="请输入订单编号"></a-input>
                </a-form-model-item>
                
                <a-form-model-item label="车场" class="form_item" prop="park_name">
                    <a-input :disabled="true" v-model="onlineForm.park_name" placeholder="请输入车场"></a-input>
                </a-form-model-item>
                
                <a-form-model-item label="车牌号" class="form_item" prop="car_number">
                    <a-input v-model="onlineForm.car_number" placeholder="请输入车牌号"></a-input>
                </a-form-model-item>
                
                <!-- <a-form-model-item label="车辆类型" class="form_item" prop="car_number">
                    <a-select show-search placeholder="请选择车辆类型" style="width: 120px" :filter-option="filterOption"
                        @change="handleSelectChange" :value="onlineForm.car_type">
                        <a-select-option v-for="(item,index) in car_type_list" :key="item.car_type">
                            {{item.label}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item> -->
                
                <a-form-model-item label="用户姓名" class="form_item" prop="user_name">
                    <a-input :disabled="true" v-model="onlineForm.user_name" placeholder="请输入用户姓名"></a-input>
                </a-form-model-item>
                
                <a-form-model-item label="用户手机号" class="form_item" prop="user_phone">
                    <a-input v-model="onlineForm.user_phone" placeholder="请输入用户手机号"></a-input>
                </a-form-model-item>
                
                <a-form-model-item label="入场通道" class="form_item" prop="channel_name">
                    <a-input :disabled="true" v-model="onlineForm.channel_name" placeholder="请输入入场通道"></a-input>
                </a-form-model-item>
                
                <a-form-model-item label="入场时间" class="form_item" prop="accessTime">
                    <a-date-picker v-if="onlineForm.accessTime" :value="moment(onlineForm.accessTime, dateFormat)" @change="onDateChange"/>
                    <a-date-picker v-else placeholder="请输入入场时间" @change="onDateChange"></a-date-picker>
                </a-form-model-item>
            </div>
            
            <div class="add_coupon">
                <div class="label_title">进出抓拍图片</div>
                <div class="pic_container">
                    <div class="pic_item" v-if="onlineForm.in_accessImage">
                         <viewer :images="[onlineForm.in_accessImage]">
                        <img :src="onlineForm.in_accessImage">
                        </viewer>
                        <div class="text" style="margin-left: 20px;">入场抓拍</div>
                    </div>
                    <div class="pic_item" v-if="onlineForm.out_accessImage">
                        <viewer :images="[onlineForm.out_accessImage]">
                        <img :src="onlineForm.out_accessImage">
                        </viewer>
                        <div class="text" style="margin-left: 20px;">出场抓拍</div>
                    </div>
                </div>
            </div>
            
            <div
                :style="{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  borderTop: '1px solid #e9e9e9',
                  padding: '10px 16px',
                  background: '#fff',
                  textAlign: 'right',
                  zIndex: 1,
                }">
                <a-button :style="{ marginRight: '8px' }" @click="handleSubCancel">取消</a-button>
                <a-button @click="handleSubmit()" type="primary">提交</a-button>
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
    import moment from 'moment';
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
            online_id: {
                type: String,
                default: ''
            }
        },
        
        watch:{
            online_id: {
                immediate: true,
                handler (val) {
                    this.getOnlineInfo()
                }
            }
        },
        
        data() {
            return {
                labelCol: { span: 6 },
                wrapperCol: { span: 14 },
                onlineForm: {
                    name: ''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入车场名称', trigger: 'blur' },
                    ]
                },
                dateFormat: 'YYYY-MM-DD',
                car_type_list: [{car_type: 0, label:'汽车'}, {car_type: 1, label: '电瓶车'}],
            }
        },

        methods: {
            moment,
            clearForm(){
                this.onlineForm = {}
            },
            handleSubmit(e) {
                let that = this
                that.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        that.request(villageApi.editInParkInfo, that.onlineForm).then((res) => {
                            that.$message.success('编辑成功！')
                            that.$emit('closeOnline', true)
                            that.clearForm()
                        })
                    } else {
                        return false;
                    }
                });
            },
            handleSubCancel(e) {
                this.$refs.ruleForm.resetFields();
                this.$emit('closeOnline', false)
                this.clearForm()
            },
            
            handleSelectChange(value) {
                this.onlineForm.car_type = value
                console.log(`selected ${value}`);
            },
            
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            getOnlineInfo(){
                let that = this
                if(that.online_id){
                    that.request(villageApi.getInParkInfo, {record_id: that.online_id}).then((res) => {
                        that.onlineForm = res
                        that.onlineForm.record_id = res.record_id
                    })
                }
            },
            onDateChange(date, dateString){
                this.onlineForm.accessTime = dateString
                console.log(date, dateString);
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
    
    /deep/ textarea{
        overflow-x: hidden;
        overflow-y: scroll !important;
    }
</style>
