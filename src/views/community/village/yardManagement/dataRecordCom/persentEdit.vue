<template>
    <a-drawer title="编辑" :width="900" :visible="visible" @close="handleSubCancel">
        <a-form-model ref="ruleForm" :model="persentForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <div class="add_persent">
                <div class="label_title">车辆信息</div>
                <div class="form_content">
                    <a-form-model-item label="订单编号" class="form_item" prop="order_id">
                        <a-input :disabled="true" v-model="persentForm.order_id" placeholder="请输入订单编号"></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="车场" class="form_item" prop="park_name">
                        <a-input :disabled="true" v-model="persentForm.park_name" placeholder="请输入车场"></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="车牌号" class="form_item" prop="car_number">
                        <a-input :disabled="true" v-model="persentForm.car_number" placeholder="请输入车牌号"></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="车辆类型" class="form_item" prop="car_type">
                        <a-input :disabled="true" v-model="persentForm.car_type" placeholder="请输入车辆类型"></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="用户姓名" class="form_item" prop="user_name">
                        <a-input :disabled="true" v-model="persentForm.user_name" placeholder="请输入用户姓名"></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="用户手机号" class="form_item" prop="user_phone">
                        <a-input :disabled="true" v-model="persentForm.user_phone" placeholder="请输入用户手机号"></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="出场通道" class="form_item" prop="channel_name">
                        <a-input :disabled="true" v-model="persentForm.channel_name" placeholder="请输入出场通道"></a-input>
                    </a-form-model-item>
                    
                    <a-form-model-item label="出场时间" class="form_item" prop="accessTime">
                        <a-input :disabled="true" v-model="persentForm.accessTime" placeholder="请输入出场时间"></a-input>
                    </a-form-model-item>
                </div>
                <div class="form_content_2">
                    <a-form-model-item label="标签" prop="label_name">
                       <a-transfer
                            class="form_item_2"
                            :locale = "{
                               itemUnit: '【已选】', 
                               itemsUnit: '【全部】', 
                               notFoundContent: '列表为空', 
                               searchPlaceholder: '请输入搜索内容' 
                            }"
                            show-search
                            :rowKey="record => record.key"
                            :data-source="labelList"
                            :list-style="{
                                width: '210px',
                                height: '270px',
                            }"
                            :render="renderItem"
                            :show-select-all="true"
                            :target-keys="targetKeys"
                            @change="handleTransferChange">
                       </a-transfer>
                    </a-form-model-item>
                    
                   <!-- <a-form-model-item label="备注" prop="current">
                        <a-textarea class="form_item_2" style="padding: 5px width:200px; height: 100px; resize:none;" placeholder="请输入备注内容" v-model="persentForm.remark" />
                    </a-form-model-item> -->
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
    import Vue from 'vue';
    import {Transfer} from 'ant-design-vue';
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
            present_id: {
                type: String,
                default: ''
            }
        },
        
        watch:{
            present_id: {
                immediate: true,
                handler (val) {
                    if(this.visible){
                        this.getPresentInfo()
                        this.getLabelList()  
                    }
                }
            }
        },
        
        components: {
            'a-transfer': Transfer
        },
        
        data() {
            return {
                labelCol: { span: 6 },
                wrapperCol: { span: 14 },
                persentForm: {
                    name: ''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入车场名称', trigger: 'blur' },
                    ]
                },
                targetKeys: [],
                labelList: [],
            }
        },

        methods: {
            clearForm(){
                this.persentForm = {}
                this.targetKeys = []
            },
            handleSubmit(e) {
                let that = this
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        that.request(villageApi.editOutParkInfo, {record_id: that.present_id, label_id: that.targetKeys}).then((res) => {
                            that.$message.success('编辑标签成功！')
                            this.$emit('closePersent', true)
                            this.clearForm()
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleSubCancel(e) {
                this.$refs.ruleForm.resetFields();
                this.$emit('closePersent', false)
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
            getPresentInfo(){
                let that = this
                if(that.present_id){
                    that.request(villageApi.getOutParkInfo, {record_id: that.present_id}).then((res) => {
                        that.persentForm = res
                        that.persentForm.record_id = res.record_id
                        if(res.label_id&&res.label_id.length>0){
                            that.targetKeys = res.label_id
                        }
                    })
                }
            },
            
            getLabelList(){
                let that = this
                that.request(villageApi.getParkLabelList, {}).then((res) => {
                    that.labelList = []
                    res.map(v=>{
                        that.labelList.push({
                            key: v.id+'',
                            title: v.label_name
                        })
                    })
                })
            },
            
            renderItem(item) {
                const customLabel = (
                    <span class="custom-item">
                        {item.title}
                    </span>
                );
                    
                return {
                    label: customLabel, // for displayed item
                    value: item.title, // for title and filter matching
                };
            },
            
            handleTransferChange(targetKeys, direction, moveKeys) {
                this.targetKeys = targetKeys;
                let work_arr = ''
                this.targetKeys.map((v, i)=>{
                    if(i<this.targetKeys.length-1){
                        work_arr += v+','
                    } else {
                        work_arr += v
                    }
                })
                this.persentForm.passage_label = work_arr
            },
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
    
    .add_persent{
        // width: 100%;
    }
    
    .form_content{
        display: flex; 
        flex-wrap: wrap;
    }
    
    .form_content_2{
        width: 100%;
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        transform: translateX(-107px);
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
    .form_item_2{
        float: left;
        display: flex;
        justify-content: flex-start;
    }
    
</style>
