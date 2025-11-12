<template>
    <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel"
             @ok="handleSubmit">
        <div>
            <a-form-model>
                <a-form-model-item
                        label="用户id"
                        :help="msg"
                        required="true"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                >
                    <a-input
                            v-model="memberFormData.phone"
                            placeholder="请输入手机号"
                            disabled="true"
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
    export default {
        name: "editStoreMarketingPerson",
        components: {ACol, ARow},
        data() {
            return {
                title: "编辑分销员",
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
            edit(id,store_id) {
                this.request(mallMerchantApi.editPerson, {id: id,store_id:store_id})
                    .then((res) => {
                        console.log(res,"res==res==res")
                        this.visible = true
                        this.memberFormData = res
                    })
                    .catch((error) => {
                        this.confirmLoading = false
                    })
            },
            handleCancel() {
                this.visible = false
            },
            handleSubmit() {
                this.confirmLoading = true
                this.request(mallMerchantApi.savePerson, this.memberFormData)
                    .then((res) => {
                        if (res) {
                            this.$message.success(this.L('编辑成功'))
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