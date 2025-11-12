<template>
    <a-modal
        :title="title"
        :width="640"
        :visible="visible"
        :confirmLoading="confirmLoading"
        @ok="handleSubmit"
        @cancel="handleCancel"
    >
        <div class="top_name">
            各项比例相加之和为100才能保存成功，当前为：<span style="color: red">{{ number }}</span>
        </div>
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <div
                    v-for="item in detail"
                    :key="item.id"
                    :id="item.id"
                    style="width: 400px; margin: 0 auto; height: 40px; line-height: 40px"
                >
                    <div style="width: 170px; text-align: right; float: left; padding-right: 20px">
                        {{ item.name }}：
                    </div>
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input-number
                            :min="0"
                            :precision="0"
                            :max="100"
                            v-decorator="[
                                'scale' + item.id,
                                { initialValue: item.scale, rules: [{ required: false }] },
                            ]"
                            style="width: 80px"
                            @change="number_list($event, item)"
                        />
                    </a-form-item>
                </div>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
import marriageHelperCommentApi from '@/api/marriage_helper/platform'
export default {
    data() {
        return {
            title: '编辑比例',
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
            visible: false,
            confirmLoading: false,
            form: this.$form.createForm(this),
            detail: [],
            id: 0,
        }
    },
    computed: {
        number() {
            let total = 0
            if (this.detail.length) {
                total = this.detail.reduce((prev, cur) => {
                    return Number(cur.scale) + prev
                }, 0)
            }
            return total
        },
    },
    methods: {
        scale() {
            this.visible = true
            this.getEditInfo()
        },
        number_list(e, current) {
            const {
                form: { validateFields },
            } = this
            this.detail = this.detail.map((item) => {
                if (item.id == current.id) {
                    item.scale = e
                }
                return item
            })
            this.confirmLoading = true
            validateFields((errors, values) => {
                if (!errors) {
                    console.log(values)
                    this.confirmLoading = false
                } else {
                    this.confirmLoading = false
                }
            })
        },
        handleSubmit() {
            const {
                form: { validateFields },
            } = this
            this.confirmLoading = true
            validateFields((errors, values) => {
                if (!errors) {
                    console.log(this.detail.id)
                    values.id = this.detail.id
                    this.request(marriageHelperCommentApi.getBudgetScaleCreate, values)
                        .then((res) => {
                            this.$message.success('编辑成功')
                            setTimeout(() => {
                                this.form = this.$form.createForm(this)
                                this.visible = false
                                this.confirmLoading = false
                                this.$emit('loaddata', this.id)
                            }, 1500)
                        })
                        .catch((error) => {
                            this.confirmLoading = false
                        })
                } else {
                    this.confirmLoading = false
                }
            })
        },
        handleCancel() {
            console.log('123')
            this.visible = false
            setTimeout(() => {
                this.id = '0'
                this.form = this.$form.createForm(this)
            }, 500)
        },
        // 详情
        getEditInfo() {
            this.request(marriageHelperCommentApi.getBudgetScaleInfo, {}).then((res) => {
                this.detail = res.list
            })
        },
    },
}
</script>
<style>
.top_name {
    margin-top: -16px;
    margin-bottom: 12px;
}
</style>