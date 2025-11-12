<template>
    <a-modal :title="title" :width="600" :visible="visible" @ok="handleSubmit" @cancel="handleCancel">
        <p>您最多可添加10个标签（限填5个字）</p>
    <a-form :form="form">
        <a-form-item
                v-for="(k, index) in form.getFieldValue('keys')"
                :key="k"
                v-bind="formItemLayout"
                :required="false"
                style="margin-bottom:0px"
        >
            <a-input
                    v-decorator="[
          `names[${k}]`,
          {
            initialValue:label_nams[k],
            validateTrigger: ['change', 'blur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请填写标签',
              },
            ],
          },
        ]"
                    placeholder=""
                    style="width: 60%; margin-right: 8px;"
            />
            <a-icon
                    v-if="form.getFieldValue('keys').length > 1"
                    class="dynamic-delete-button"
                    type="minus-circle-o"
                    :disabled="form.getFieldValue('keys').length === 1"
                    @click="() => remove(k)"
            />
        </a-form-item>
        <a-form-item v-bind="formItemLayout">
            <a-button type="solid" style="width: 60%;color: #1890ff;border: 1px solid #1890ff" @click="add" v-if="form.getFieldValue('keys').length <= 9">
                <a-icon type="plus" /> 新增
            </a-button>
        </a-form-item>
    </a-form>
    </a-modal>
</template>

<script>
    import qaApi from '@/api/qa'
    let id = 0;
    export default {
        data() {
            return {
                title: '标签设置',
                visible: false,
                formItemLayout: {
                    labelCol: {
                        xs: { span: 24 },
                        sm: { span: 4 },
                    },
                    wrapperCol: {
                        xs: { span: 10 },
                        sm: { span: 10 },
                    },
                },
                label_nams:[]
            };
        },
        beforeCreate() {
            this.form = this.$form.createForm(this, { name: 'add_label' });
            this.form.getFieldDecorator('keys', { initialValue: [], preserve: true });
        },
        methods: {
            //默认标签
            get_label(){
                this.request(qaApi.getLabels, {}).then((res) => {
                    id = res.length;
                    var keys = [];
                    for (let i = 0; i < id; i++) {
                        keys.push(i);
                        this.label_nams.push(res[i]['label_name']);
                    }
                    const {form} = this;
                    form.setFieldsValue({
                        keys: keys,
                    });
                })
            },
            add_label() {
                this.visible = true;
                this.get_label();
            },
            handleCancel() {
                this.visible = false;
            },
            remove(k) {
                const {form} = this;
                const keys = form.getFieldValue('keys');
                if (keys.length === 1) {
                    return;
                }
                form.setFieldsValue({
                    keys: keys.filter(key => key !== k),
                });
            },
            add() {
                const {form} = this;
                const keys = form.getFieldValue('keys');
                const nextKeys = keys.concat(id++);
                console.log(nextKeys);
                form.setFieldsValue({
                    keys: nextKeys,
                });
            },

            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        const {keys, names} = values;
                        console.log(values)
                        this.request(qaApi.saveLabels, {label_names:names}).then((res) => {
                            this.visible = false;
                            this.$message.success(this.L('设置成功'))
                            this.$emit('refreshLists',{})
                        })
                    }
                });
            },
        },
    };
</script>
<style>
    .dynamic-delete-button {
        cursor: pointer;
        position: relative;
        top: 4px;
        font-size: 24px;
        color: #999;
        transition: all 0.3s;
    }
    .dynamic-delete-button:hover {
        color: #777;
    }
    .dynamic-delete-button[disabled] {
        cursor: not-allowed;
        opacity: 0.5;
    }
</style>