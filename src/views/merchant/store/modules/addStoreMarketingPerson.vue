<template>
    <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel"
             @ok="handleSubmit">
        <div>
            <a-form-model>
                <!--<a-form-model-item
                        label="用户id"
                        :help="msg"
                        required="true"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                >
                    <a-input
                            v-model="memberFormData.phone"
                            placeholder="请输入手机号"
                            @blur="findRight()"
                    ></a-input>
                </a-form-model-item>-->

                <a-form-model-item
                        label="用户id"
                        required="true"
                        :hasFeedback="memberFormData.uid"
                        :validateStatus="memberFormData.uid>0? 'success': 'error'"
                        :help="msg"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                >
                    <a-input
                            v-model="memberFormData.phone"
                            placeholder="请输入手机号"
                            @blur="findRight()"
                    ></a-input>
                </a-form-model-item>

                <a-form-model-item label="抽成设置" required="true" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-radio-group v-model="memberFormData.ratio_type">
                        <a-radio :value="1">
                            统一比例
                        </a-radio>
                        <a-radio :value="2">
                            商品比例
                        </a-radio>
                    </a-radio-group>
                </a-form-model-item>

                <a-form-model-item v-if="memberFormData.ratio_type==1">
                    <a-row>
                        <a-col :span="6">

                        </a-col>
                        <a-col :span="18">
                            <a-input-number
                                    v-model="memberFormData.ratio"
                                    placeholder="请输入"
                                    :min="0"
                                    :max="100"
                            ></a-input-number
                            >
                            <span class="ml-10">% 为改分销员抽取所有商品的统一抽成比例</span>
                        </a-col>
                    </a-row>
                </a-form-model-item>
            </a-form-model>
        </div>
    </a-modal>
</template>

<script>
    import moment from 'moment'
    import mallMerchantApi from '@/api/merchant/store'
    import ARow from "ant-design-vue/es/grid/Row";
    import ACol from "ant-design-vue/es/grid/Col";

    const phoneReg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
    export default {
        name: "addStoreMarketingPerson",
        components: {ACol, ARow},
        data() {
            return {
                title: "添加分销员",
                msg: "",
                visible: false,
                confirmLoading: false,
                // 新增成员 || 编辑成员
                memberFormData: {
                    store_id: 0,
                    name: '',
                    uid: 0,
                    phone: '',
                    ratio_type: '',
                    ratio: '',
                },
                // 新增成员 || 编辑成员校验规则
                memberFormRules: {
                    ratio_type: [{required: true, message: '请选择抽成设置', trigger: 'blur'}],
                    uid: [
                        {required: true, message: '请输入用户id', trigger: 'blur'},
                        {
                            pattern: phoneReg,
                            message: '手机号格式错误',
                            trigger: 'blur',
                        },
                    ],
                },
                labelCol: {
                    xs: {
                        span: 24,
                    },
                    sm: {
                        span: 7,
                    },
                },
                wrapperCol: {
                    xs: {
                        span: 24,
                    },
                    sm: {
                        span: 13,
                    },
                },
            }
        },
        methods: {
            moment,
            add(store_id) {
                this.msg = ""
                this.memberFormData = {
                    store_id: store_id,
                    name: '',
                    uid: 0,
                    phone: '',
                    ratio_type: '',
                    ratio: '',
                }
                this.visible = true
            },
            handleCancel() {
                this.visible = false
            },
            findRight() {
                this.request(mallMerchantApi.regPhone, {
                    phone: this.memberFormData.phone,
                    store_id: this.memberFormData.store_id
                })
                    .then((res) => {
                        if (res.status == 1) {
                            //this.$message.success(this.L('此用户可以添加'))
                            this.memberFormData.uid = res.data.uid
                            this.memberFormData.name = res.data.nickname
                            this.msg = '用户昵称：' + this.memberFormData.name
                        } else if (res.status == 2) {
                            this.memberFormData.uid = 0
                            this.msg = this.L('此用户id已经是分销员,不可以再次添加')
                        } else if (res.status == 3) {
                            this.memberFormData.uid = 0
                            this.msg = this.L('请输入手机号')
                        } else {
                            this.memberFormData.uid = 0
                            this.msg = this.L('用户不存在')
                        }
                    })
                    .catch((error) => {
                        this.confirmLoading = false
                    })
            },
            handleSubmit() {
                if (this.memberFormData.uid == 0) {
                    //this.$message.error(this.L('请输入正确的手机号再提交'))
                    return false;
                }
                this.confirmLoading = true
                this.request(mallMerchantApi.addPerson, this.memberFormData)
                    .then((res) => {
                        if (res) {
                            this.$message.success(this.L('添加成功'))
                        }
                        // 调用父页面方法
                        this.$emit('handleUpdate', {})
                        setTimeout(() => {
                            this.visible = false
                            this.confirmLoading = false
                            this.$emit('ok', '')
                        }, 1500)
                    })
                    .catch((error) => {
                        this.confirmLoading = false
                    })
            },
        }
    }
</script>

<style scoped>

</style>