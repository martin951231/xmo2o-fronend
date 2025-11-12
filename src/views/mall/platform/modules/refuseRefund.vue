<template>
    <div>
        <a-modal
            :title="title"
            :visible="visible"
            :maskClosable="false"
            @ok="handleOk"
            @cancel="handleCancel"
            >
            <a-form-model 
                :model="formData" 
                :label-col="labelCol" 
                :wrapper-col="wrapperCol">
                <a-form-model-item label="">
                    <a-input 
                        style="height: 200px;resize:none;"
                        v-model="formData.reason" 
                        type="textarea" 
                        autosize
                        placeholder="请输入拒绝理由" />
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import mallStorestaffApi from "@/api/mall/storestaff/index"
export default {
    props: {
        visible: Boolean,
        title: String,
        order: Object
    },
    data() {
        return {
            labelCol: { span: 0 },
            wrapperCol: { span: 24 },
            formData: {
                order_id: '',
                reason: '',
                status: ''
            },
            expressOptions: []
        }
    },
    created() {
    },
    methods: {
        // 拒绝退款
        handleOk() {
            if (!this.formData.reason) {
                this.$message.error('请输入拒绝理由')
                return
            }
            this.$set(this.formData, 'order_id', this.order.order_id)
            this.$set(this.formData, 'status', this.order.status)
            this.request(mallStorestaffApi.refuseRefund, this.formData).then((data) => {
                this.$message.success('操作成功')
                this.$emit('handleCancel')
                this.$emit('updateList')
            })
        },
        handleCancel() {
            this.$emit('handleCancel')
            Object.assign(this.$data, this.$options.data())
        }
    }
}
</script>

<style scoped>

</style>