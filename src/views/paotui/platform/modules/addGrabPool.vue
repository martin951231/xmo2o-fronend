<template>
    <a-modal :title="title" :visible="visible" width="40%" :bodyStyle="{ maxHeight: '80vh', overflowY: 'auto' }"
        destroyOnClose :centered="true" @cancel="handleCancle" @ok="handleOk">
        <a-form-model ref="form" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="名称" required>
                <a-input v-model="form.name" placeholder="请输入名称" allowClear />
            </a-form-model-item>
            <a-form-model-item label="状态" required>
                <a-switch checked-children="开启" un-checked-children="关闭" v-model="form.status" />
            </a-form-model-item>
        </a-form-model>
    </a-modal>
</template>
<script>

import paotuiPlatformApi from '@/api/paotui/index'

const formData = {
    name: '',
    status: true
}

export default {
    name: 'addGrabPool',
    data() {
        return {
            id: 0,
            visible: false,
            title: '新增抢单池',
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
            form: { ...formData },
        }
    },
    created() {

    },
    methods: {
        add() {
            this.visible = true
            this.title = '新增抢单池'
            this.form = {
                ...formData,
            }
        },
        edit(item) {
            this.visible = true
            this.title = '编辑抢单池'
            this.form = {
                ...formData,
                ...item
            }
        },
        handleCancle() {
            this.visible = false
            this.title = ''
            this.form = {
                ...formData,
            }
        },
        //提交表单
        handleOk() {
            this.request(paotuiPlatformApi.saveGrabPool, this.form).then((res) => {
                this.$message.success('操作成功')
                this.handleCancle()
                this.$emit('ok');
            })
        },
    },
}

</script>
