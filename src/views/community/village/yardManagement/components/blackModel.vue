<template>
    <a-modal :title="modelTitle" :width="900" :visible="visible" @ok="handleSubmit" :confirm-loading="confirmLoading"
        @cancel="handleSubCancel">
        <a-form-model ref="ruleForm" :model="blackForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <div class="add_black">
                <a-form-model-item label="车牌号码" prop="city_arr">
                    <a-select show-search placeholder="请选择" style="width: 120px" :filter-option="filterOption"
                        @change="handleSelectChange" :value="blackForm.city_arr">
                        <a-select-option v-for="(item,index) in provinceList" :value="item">
                            {{item}}
                        </a-select-option>
                    </a-select>
                    <a-input v-model="blackForm.car_number" style="width: 200px;" placeholder="请输入车牌号码"></a-input>
                </a-form-model-item>
                
                <a-form-model-item label="车主姓名" prop="user_name">
                    <a-input v-model="blackForm.user_name" placeholder="请输入车主姓名"></a-input>
                </a-form-model-item>
                
                <a-form-model-item label="车主手机号" prop="phone">
                    <a-input v-model="blackForm.phone" placeholder="请输入车主手机号"></a-input>
                </a-form-model-item>
                
                <a-form-model-item label="备注" prop="remark">
                    <a-textarea style="padding: 5px width:200px; height: 100px; resize:none;" placeholder="请输入备注内容" v-model="blackForm.remark" />
                </a-form-model-item>
            </div>
        </a-form-model>
    </a-modal>
</template>

<script>
    import villageApi from '@/api/community/village';
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
            black_type: {
                type: String,
                default: ''
            },
            black_id: {
                type: String,
                default: ''
            }
        },
        
        watch:{
            black_id: {
                immediate: true,
                handler (val) {
                    if(this.black_type=='edit'){
                        this.getBlackInfo()
                    }
                }
            }
        },
        
        mounted(){
            this.getParkProvice()
        },
        
        data() {
            return {
                confirmLoading: false,
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                blackForm: {
                    city_arr: ''
                },
                rules: {
                    city_arr: [
                        { required: true, message: '请输入车牌号码', trigger: 'blur' },
                    ]
                },
                provinceList: []
            }
        },

        methods: {
            clearForm(){
                this.blackForm = {city_arr: ''}
            },
            getBlackInfo(){
                let that = this
                if(that.black_id){
                    that.request(villageApi.getBlackCarInfo, {black_id: that.black_id}).then((res) => {
                        that.blackForm = res
                        that.blackForm.city_arr = res.province || ''
                        that.blackForm.black_id = res.id
                    })
                }
            },
            
            getParkProvice(){
                let that = this
                that.request(villageApi.getParkProvice, {black_id: that.black_id}).then((res) => {
                    that.provinceList = res
                })
            },
            
            handleSubmit(e) {
                this.confirmLoading = true;
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        let that = this
                        let url = villageApi.addBlackCar
                        if(this.black_type == 'edit'){
                            url = villageApi.editBlackCar
                        }
                        that.request(url, that.blackForm).then((res) => {
                            if(this.black_type == 'edit'){
                                that.$message.success('编辑成功！')
                            } else{
                                that.$message.success('添加成功！')
                            }
                            this.$emit('closeBlack', true)
                            this.clearForm()
                            this.confirmLoading = false;
                        }).catch(e=>{
                            this.confirmLoading = false;
                        })
                    } else {
                        console.log('error submit!!');
                        this.confirmLoading = false;
                        return false;
                    }
                });
            },
            handleSubCancel(e) {
                this.$refs.ruleForm.resetFields();
                this.confirmLoading = false;
                this.$emit('closeBlack', false)
                this.clearForm()
            },
            
            handleSelectChange(value) {
                this.blackForm.city_arr = value
                this.$forceUpdate()
                console.log(value, this.blackForm)
            },
            
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
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
        // position: fixed;
        // bottom: 100;
        // right: 20;
        // z-index: 999;
    }
    
    /deep/ textarea{
        overflow-x: hidden;
        overflow-y: scroll !important;
    }
</style>
