<template>
    <a-drawer :title="modelTitle" :width="900" :visible="visible" 
        @close="handleSubCancel">
        <a-form-model ref="ruleForm" :model="couponForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <div class="add_coupon">
                <a-form-model-item label="优惠券" prop="cid">
                    <a-select show-search placeholder="请选择" style="width: 200px" :filter-option="filterOption"
                        @change="handleSelectChange" :value="couponForm.cid">
                        <a-select-option v-for="(item,index) in couponList" :value="item.c_id" :key="index">
                            {{item.c_title}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                
                <a-form-model-item label="优惠券所属停车场" prop="garageInfo" v-if="garageInfo && garageInfo['garage_num']">
                    <a-input :disabled="true" v-model="garageInfo['garage_num']"></a-input>
                </a-form-model-item>

                <a-form-model-item label="每次停车免费金额" prop="free_money">
                    <a-input :disabled="true" v-model="couponForm.free_money" placeholder="请输入每次停车免费金额"></a-input>
                </a-form-model-item>
                
                <a-form-model-item label="添加数量" prop="num">
                    <a-input @change="computeMoney" v-model="couponForm.num" placeholder="请输入添加数量"></a-input>
                </a-form-model-item>
                
                <a-form-model-item label="应收金额" prop="receivable_money">
                    <a-input :disabled="true" v-model="couponForm.receivable_money" placeholder="请输入应收金额"></a-input>
                </a-form-model-item>
                
                <a-form-model-item label="实收金额" prop="paid_money">
                    <a-input v-model="couponForm.paid_money" placeholder="请输入实收金额"></a-input>
                </a-form-model-item>
                
                <a-form-model-item label="二维码状态" prop="status" extra="静态码可下载打印,固定给用户扫码领取;动态码每次领取后会实时刷新二维码,防止重复领取">
                    <a-radio-group name="radioGroup" :default-value="1" v-model="couponForm.status">
                        <a-radio :value="1">静态码</a-radio>
                        <a-radio :value="2">动态码</a-radio>
                    </a-radio-group>
                </a-form-model-item>
                
                <a-form-model-item label="备注" prop="current">
                    <a-textarea style="padding: 5px width:200px; height: 100px; resize:none;" placeholder="请输入备注内容" v-model="couponForm.remark" />
                </a-form-model-item>
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
            mid: {
                type: String,
                default: ''
            }
        },
        watch:{
            mid: {
                immediate: true,
                handler (val) {
                    this.couponForm.mid = val
                }
            },
        },
        data() {
            return {
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                couponForm: {
                    cid: null,
                    status: 1
                },
                rules: {
                    cid: [{ required: true, message: '请选择优惠券', trigger: 'blur' },],
                    num: [{ required: true, message: '请填写添加数量', trigger: 'blur' },],
                    paid_money: [{ required: true, message: '请输入实收金额', trigger: 'blur' },],
                    status: [{ required: true, message: '请选择二维码类型', trigger: 'blur' },]
                },
                couponList: [],
                c_price: '',
                garageInfo: {}
            }
        },
        
        mounted(){
            this.getcouponList()
        },

        methods: {
            clearForm(){
                this.couponForm = {status: 1, cid: null}
                this.c_price = 0
            },
            handleSubmit(e) {
                let that = this
                that.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        that.request(villageApi.add_park_shop_coupons, that.couponForm).then((res) => {
                            that.$message.success('添加成功！')
                            this.$emit('closeCoupon', true)
                            this.clearForm()
                        })
                    } else {
                        return false;
                    }
                });
            },
            handleSubCancel(e) {
                this.$refs.ruleForm.resetFields();
                this.$emit('closeCoupon', false)
                this.clearForm()
            },
            
            handleSelectChange(value) {
                this.couponForm.cid = value
                this.couponList.map(v=>{
                    if(v.c_id == value){
                        this.couponForm.free_money = v.c_free_price
                        this.c_price = v.c_price
                        if(this.couponForm.num && this.c_price){
                            this.couponForm.receivable_money = parseFloat(this.c_price) * parseInt(this.couponForm.num).toFixed(2);
                        } else{
                            this.couponForm.receivable_money = ''
                        }
                    }
                })
                this.request(villageApi.getParkCouponGarage, {c_id: value}).then((res) => {
                    console.log('getParkCouponGarage-', res)
                    this.garageInfo = res.info
                })
                this.$forceUpdate()
            },
            
            computeMoney(){
                if(this.c_price && this.couponForm.num){
                    this.couponForm.receivable_money = parseFloat(this.c_price) * parseInt(this.couponForm.num).toFixed(2);
                } else{
                    this.couponForm.receivable_money = ''
                }
            },
            
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            getcouponList(){
                let that = this
                that.request(villageApi.getParkCouponsLists, {}).then((res) => {
                    that.couponList = res.list
                })
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
