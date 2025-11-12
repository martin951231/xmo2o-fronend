<template>
    <a-modal :title="title" :width="940" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit"
             @cancel="handleCancelModel">
        <a-spin :spinning="confirmLoading">
            <a-form :form="formData" style="max-height: 600px; overflow-y: scroll">
                <a-form-item label="会员手机号" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input
                            placeholder="请输入会员手机号"
                            v-model="formData.phone"
                            oninput="if(value.length > 11)value = value.slice(0, 11)"
                            type="number"
                            @blur="handleChange()"
                            v-bind:disabled="is_dis"
                    />
                </a-form-item>

                <a-form-item label="会员名称" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input
                            placeholder="请输入会员名称"
                            v-model="formData.name"
                    />
                </a-form-item>

                <a-form-item label="会员卡号" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input
                            placeholder="请输入会员卡号"
                            v-model="formData.card_number"
                    />
                </a-form-item>

                <a-form-item label="会员身份" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input
                            placeholder="请输入会员身份"
                            v-model="formData.identity"
                    />
                </a-form-item>

                <a-form-item label="会员部门" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input
                            placeholder="请输入会员部门"
                            v-model="formData.department"
                    />
                </a-form-item>

                <a-form-item label="会员卡余额" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                            placeholder="请输入会员卡余额"
                            v-model="formData.card_money"
                    />
                </a-form-item>

                <a-form-item label="会员卡积分数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                            placeholder="请输入会员卡积分数量"
                            v-model="formData.card_score"
                    />
                </a-form-item>

                <a-form-item label="绑定身份标签" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-select
                        mode="multiple"
                        v-model="formData.lable_ids"
                    >
                        <a-select-option v-for="item in lableList" :key="item.id">
                            {{item.name}}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-switch checked-children="开" un-checked-children="关" :checked="formData.status == 1? true: false"
                              @change="isStatusChange"/>
                </a-form-item>

            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import lifeToolsMerchantApi from '@/api/employee/merchant/index'

    export default {
        name: "editEmployeeCardUser",
        data() {
            return {
                title: '添加员工卡',
                phone_check:true,
                is_dis:false,
                lableList: [],
                formData: {//表单数据
                    card_id: 0,//ID'
                    card_number: "",
                    user_id: 0,
                    name: "",
                    identity: "",
                    status: 1,// '状态'
                    department: "",
                    phone: "",
                    uid: 0,
                    card_money: 0,
                    card_score: 0,
                    lable_ids: undefined,
                },
                visible: false,
                confirmLoading: false,
                labelCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 7
                    }
                },
                wrapperCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 13
                    }
                },
            }
        },
        created() {
            this.getLableList()
        },
        watch: {
            formData() {
                this.getLableList()
            }
        },
        methods: {
            edit(id) {
                this.getLableList()
                this.request(lifeToolsMerchantApi.editCardUser, {user_id: id}).then((res) => {
                    this.$nextTick(()=>{
                        Object.assign(this.$data, this.$options.data.call(this))
                        this.title = "编辑员工卡"
                        this.is_dis=true
                        this.confirmLoading = false
                        this.visible = true
                        this.$set(this, 'formData', res.user)
                    })

                })

            },
            add(card_id) {
                this.is_dis=false
                this.visible = true
                this.title= '添加员工卡'
                this.formData = {//表单数据
                    card_id: card_id,//ID'
                    card_number: "",
                    user_id: 0,
                    name: "",
                    identity: "",
                    status: 1,// '状态'
                    department: "",
                    phone: "",
                    uid: 0,
                    card_money: 0,
                    card_score: 0,
                    lable_ids: undefined,
                }
                this.$set(this, 'formData', this.formData)
                this.getLableList()
            },
            getLableList() {
                this.request(lifeToolsMerchantApi.employLableList, {page: 0}).then((res) => {
                    console.log(12121212,res.data)
                    this.lableList = res.data
                    // this.$nextTick(()=>{
                    //     this.lableList = res.data
                    // })
                    console.log(11111,this.lableList)
                })

            },
            isStatusChange(value) {
                this.formData.status = value ? 1 : 0;
            },
            handleChange() {
                if (!(this.formData.phone == '' || this.formData.phone == undefined || this.formData.phone == null)) {
                        this.request(lifeToolsMerchantApi.findUser, {phone: this.formData.phone,card_id:this.formData.card_id}).then((res) => {
                            if(res.status*1==1){
                                this.phone_check=true
                                this.formData.uid=res.data.uid
                                this.formData.name=res.data.nickname
                            }else if(res.status*1==2){
                                this.phone_check=true
                                this.formData.uid=0
                                this.formData.name=undefined
                            }else{
                                this.phone_check=false
                                this.$message.error(res.msg)
                                this.formData.uid=0
                                this.formData.name=undefined
                            }
                        })
                    }
            },
            handleSubmit() {
                if (!this.phone_check) {
                    this.$message.error('请输入正确手机号')
                    return false;
                }
                if (this.formData.name == "") {
                    this.$message.error('员工名称必填')
                    return false;
                }

                if (this.formData.card_number == "") {
                    this.$message.error('卡号必填')
                    return false;
                }

                if (this.formData.phone == "") {
                    this.$message.error('手机号号必填')
                    return false;
                }

                if (this.formData.department == "") {
                    this.$message.error('部门必填')
                    return false;
                }

                if (this.formData.identity == "") {
                    this.$message.error('身份必填')
                    return false;
                }
                this.request(lifeToolsMerchantApi.saveCardUser, this.formData).then((res) => {
                    this.$message.success('成功')
                    this.lableList = []
                    this.visible = false
                    this.$emit('getSportList')
                })
            },
            handleCancelModel() {
                this.lableList = []
                this.visible = false
                this.$emit('getSportList')
            },
        }
    }
</script>

<style scoped>

</style>