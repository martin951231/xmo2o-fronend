<template>
    <a-modal :title="modelTitle" :width="900" :visible="visible" @ok="handleSubmit" :confirm-loading="confirmLoading"
        @cancel="handleSubCancel">
        <a-form-model ref="ruleForm" :model="couponForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <div class="add_coupon">

                <a-form-model-item label="请选择所属车库" prop="garage_id">
                    <a-select show-search placeholder="请选择" style="width: 200px" :filter-option="filterGarageOption" v-model="couponForm.garage_id">
                        <a-select-option v-for="(item, index) in garageSelectList" :value="item.garage_id" :key="index">
                            {{item.garage_num}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>

                <a-form-model-item label="优惠券名称" prop="c_title">
                    <a-input :disabled="coupon_type == 'edit'" v-model="couponForm.c_title" placeholder="请输入优惠券名称"></a-input>
                </a-form-model-item>
                <a-form-model-item label="单价" prop="c_price">
                    <a-input :disabled="coupon_type == 'edit'" v-model="couponForm.c_price" placeholder="请输入单价"></a-input>
                </a-form-model-item>
                
                <a-form-model-item label="每次停车免费金额" prop="c_free_price">
                    <a-input v-model="couponForm.c_free_price" placeholder="请输入金额"></a-input>
                </a-form-model-item>
                
                <a-form-model-item label="备注" prop="remark">
                    <a-textarea style="padding: 5px width:200px; height: 100px; resize:none;" placeholder="请输入备注内容" v-model="couponForm.remark" />
                </a-form-model-item>
                
                <a-form-model-item label="状态" prop="status">
                    <a-radio-group name="radioGroup" :default-value="0" v-model="couponForm.status">
                        <a-radio :value="0">启用</a-radio>
                        <a-radio :value="1">禁用</a-radio>
                    </a-radio-group>
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
            coupon_type: {
                type: String,
                default: ''
            },
            coupon_id: {
                type: String,
                default: ''
            }
        },
        
        watch:{
            coupon_id: {
                immediate: true,
                handler (val) {
                    if(this.coupon_type=='edit'){
                        this.getcouponInfo()
                    }
                }
            },
            visible: {
                immediate: true,
                handler (val) {
                    if (val) {
                        this.getParkingGarageSelectList()
                    }
                }
            }
        },
        
        data() {
            return {
                confirmLoading: false,
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                couponForm: {
                    status: 0
                },
                rules: {
                    c_title: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
                    c_price: [{ required: true, message: '请输入单价', trigger: 'blur' }],
                    c_free_price: [{ required: true, message: '请输入每次停车免费金额', trigger: 'blur' }]
                },
                garageSelectList: []
            }
        },
        methods: {
            filterGarageOption(input, option) {
                if(input){
                    return (
                        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                }
                return false;
            },  
            clearForm(){
                this.couponForm = {
                    status: 0
                }
            },
            handleSubmit(e) {
                this.confirmLoading = true;
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        let that = this
                        let url = villageApi.add_park_coupons
                        if(this.coupon_type == 'edit'){
                            url = villageApi.edit_park_coupons
                        }
                        that.request(url, that.couponForm).then((res) => {
                            if(this.coupon_type == 'edit'){
                                that.$message.success('编辑成功！')
                            } else{
                                that.$message.success('添加成功！')
                            }
                            this.$emit('closeCouponAdd', true)
                            this.clearForm()
                            this.confirmLoading = false;
                        }).catch(e=>{
                            this.confirmLoading = false;
                        })
                    } else {
                        this.confirmLoading = false;
                        return false;
                    }
                });
            },
            handleSubCancel(e) {
                this.$refs.ruleForm.resetFields();
                this.confirmLoading = false;
                this.$emit('closeCouponAdd', false)
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
            getParkingGarageSelectList(){
                let that = this
                that.request(villageApi.getParkingGarageSelectList, {}).then((res) => {
                    that.garageSelectList = res.select
                })
            },
            getcouponInfo(){
                let that = this
                if(that.coupon_id){
                    that.request(villageApi.get_park_coupons_info, {c_id: that.coupon_id}).then((res) => {
                        that.couponForm = res
                    })
                }
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
