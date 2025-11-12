<template>
    <div>
        <a-modal title="提示" :visible="visible" ok-text="确认" cancel-text="取消" @cancel="hideModal" @ok="submitModal">
            <p>本月用电数据异常，请核对输入是否正确</p>
            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-col :span="18">
                    <a-input  style="width: 300px" v-model="last_ammeter" />
                </a-col>
                <a-col :span="6">
                </a-col>
            </a-form-item>
        </a-modal>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                visible: false,
                last_ammeter: 0,
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
            };
        },
        methods: {
            showModal(last_ammeter) {
                this.visible = true;
                this.last_ammeter = last_ammeter;
            },
            hideModal() {
                this.visible = false;
            },
            submitModal() {
                this.$emit('onSubmit', { last_ammeter: this.last_ammeter })
                this.visible = false;
            },
        },
    };
</script>