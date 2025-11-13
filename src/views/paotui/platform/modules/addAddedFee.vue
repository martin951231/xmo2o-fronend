<template>
    <a-modal :title="title" :visible="visible" width="55%" :bodyStyle="{ maxHeight: '80vh', overflowY: 'auto' }"
        destroyOnClose :centered="true" @cancel="handleCancle" @ok="handleOk">
        <a-form-model ref="form" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="费用名称" required>
                <a-input v-model="form.name" placeholder="请输入名称" allowClear />
            </a-form-model-item>
            <a-form-model-item label="额外收费" required>
                <a-input-number v-model="form.money" :step="0.01" :min="0" :precision="2"/> 元
            </a-form-model-item>

            <a-form-model-item label="生效时间" required>
                <a-time-picker :value="moment(form.begin_time, 'HH:mm:ss')" @change="beginTimeChange" />
                 至
                <a-time-picker :value="moment(form.end_time, 'HH:mm:ss')" @change="endTimeChange" />
            </a-form-model-item>
           
            <a-form-model-item label="绑定业务" required>
                <a-select v-model="form.bind_business" style="width: 250px;">
                    <a-select-option :value="1">
                        帮我买
                    </a-select-option>
                    <a-select-option :value="2">
                        帮我送
                    </a-select-option>
                    <a-select-option :value="3">
                        帮我送（商家）
                    </a-select-option>
                </a-select>
            </a-form-model-item>
             <a-form-model-item label="状态" required>
                <a-switch checked-children="开启" un-checked-children="关闭" v-model="form.status" />
            </a-form-model-item>
        </a-form-model>
    </a-modal>
</template>
<script>

import moment from 'moment';
import paotuiPlatformApi from '@/api/paotui/index'


const formData = {
    name: '',
    money: 0,
    begin_time: '00:00:01',
    end_time: '23:59:59',
    status: true,
    bind_business: 1
}

export default {
    name: 'addAddedFee',
    data() {
        return {
            id: 0,
            visible: false,
            title: '新增增值费用',
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
            form: { ...formData },
        }
    },
    created() {

    },
    methods: {
        moment,
        add() {
            this.visible = true
            this.title = '新增增值费用'
            this.form = {
                ...formData,
            }
        },
        edit(item) {
            this.visible = true
            this.title = '编辑增值费用'
            this.form = {
                ...formData,
                ...item
            }

            console.log('this.form',this.form)
        },
        handleCancle() {
            this.visible = false
            this.title = ''
            this.form = {
                ...formData,
            }
        },
         // 开始时间
        beginTimeChange(date, dateString) {
            this.form.begin_time = dateString
        },
        // 结束时间
        endTimeChange(date, dateString) {
            this.form.end_time = dateString
        },
        //提交表单
        handleOk() {
            this.request(paotuiPlatformApi.saveAddedFee, this.form).then((res) => {
                this.$message.success('操作成功')
                this.handleCancle()
                this.$emit('ok');
            })
        },
    },
}

</script>
