<template>
    <div>
        <a-modal
            :title="title"
            :visible="visible"
            :maskClosable="false"
            @cancel="handleCancel"
            >
            <a-form-model 
                :model="formData" 
                :label-col="labelCol" 
                :wrapper-col="wrapperCol">
                <a-form-model-item label="快递">
                    <a-select placeholder="请选择" @change="hanleChange">
                        <a-select-option 
                            v-for="item in expressOptions"
                            :key="item.id">
                            {{item.name}}{{item.is_singface && item.is_singface == '1'?'（电子面单）':''}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="快递单号">
                    <a-input v-model="formData.express_no" placeholder="请输入快递单号" />
                </a-form-model-item>
            </a-form-model>
            <template slot="footer">
                <div class="flex justify-center align-center">
                    <a-button 
                        key="back" 
                        class="mr-20" 
                        @click="btnOpt(2)">
                        普通发货
                    </a-button>
                    <a-button 
                        key="submit" 
                        type="primary" 
                        :disabled="fh_type == '2' || (fh_type == '1' && is_singface == 0)?true:false"
                        @click="btnOpt(1)">
                        电子面单发货
                    </a-button>
                </div>
            </template>
        </a-modal>
    </div>
</template>

<script>
import mallStorestaffApi from "@/api/mall/storestaff/index"
export default {
    props: {
        visible: Boolean,
        title: String,
        order: Object,
        fh_type: [String, Number]
    },
    data() {
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            formData: {
                order_id: '',
                activity_type: '',
                periodic_order_id: '',
                current_periodic: '',
                express_type: '', // 1= 电子面单 2=普通发货
                express_no: '',
                express_id: '',
                express_name: '',
                fh_type: '1' // 发货=1 修改快递=2
            },
            expressOptions: [],
            is_singface: 1
        }
    },
    created() {
        this.getExpress()
    },
    methods: {
        // 获取快递
        getExpress() {
            this.request(mallStorestaffApi.getExpress, '').then((data) => {
                this.expressOptions = data || []
            })
        },
        // 快递选择
        hanleChange(val) {
            this.$set(this.formData, 'express_id', val)
            this.expressOptions.forEach(item => {
                if (item.id == val) {
                    this.$set(this.formData, 'express_name', item.name)
                    this.is_singface = item.is_singface
                }
            })
        },
        btnOpt(express_type) {
            this.$set(this.formData, 'express_type', express_type)
            if (!this.formData.express_id) {
                this.$message.error('请选择快递')
                return
            }
            if (express_type == 2) {
                if (!this.formData.express_no) {
                    this.$message.error('请输入快递单号')
                    return
                }
            }
            let {
                    order_id, 
                    goods_activity_type, 
                    order_type, 
                    periodic_order_id, 
                    current_periodic
                } = this.order
            this.$set(this.formData, 'order_id', order_id)
            this.$set(this.formData, 'activity_type', goods_activity_type)
            // 周期购订单
            if (order_type == 'periodic') {
                this.$set(this.formData, 'periodic_order_id', periodic_order_id)
                this.$set(this.formData, 'current_periodic', current_periodic)
            }
            this.$set(this.formData, 'fh_type', this.fh_type)
            this.request(mallStorestaffApi.deliverGoodsByExpress, this.formData).then((data) => {
                let text = this.fh_type == '1' ? '订单发货成功' : '快递更改成功'
                this.$message.success(text)
                Object.assign(this.$data, this.$options.data())
                this.handleCancel()
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