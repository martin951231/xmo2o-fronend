<template>
    <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form" class="project_info">

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true" v-if="post.id == 0">
                    <span class="label_col ant-form-item-required">标签类型</span>
                    <a-select
                            style="width: 300px !important;"
                            placeholder="请选择标签类型"
                            v-decorator="['post.label_type',{rules: [{ required: true, message: L('请选择标签类型！') }] }]"
                    >
                        <a-select-option :value="key"  v-for="(value,key) in sensitive_info" :key="key" >
                            {{value}}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-else>
                    <span class="label_col">标签类型</span>
                    <span > {{post.label_type}}</span>
                </a-form-item>

                <a-form-item label="" :required="true" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="label_col ant-form-item-required">标签名称</span>
                        <a-input
                                :maxLength="30"
                                style="width: 300px"
                                placeholder="请输入名称"
                                v-decorator="['post.label_name',{initialValue:post.label_name, rules: [{ required: true, message: L('请输入名称！') }] }]"
                        />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                <a-form-item label=""  :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="label_col">状态</span>
                    <a-radio-group  v-decorator="['post.status', {initialValue:post.status}]" >
                        <a-radio :value="0" >
                            开启
                        </a-radio>
                        <a-radio :value="1" >
                            关闭
                        </a-radio>
                    </a-radio-group>
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>
<style lang="less" scoped>
    .imgname{
        width: 100px;
    }

    /deep/ .project_info .ant-form-item{
        margin-left: 30px !important;
        margin-bottom: 15px !important;
    }
    /deep/ .project_info .label_col{
        margin-right: 30px !important;
        font-weight: bold !important;
    }
    /deep/ .project_info .ant-form-item .ant-col-sm-13{
        width: 100% !important;
    }
    /deep/ .project_info .ant-upload-picture-card-wrapper{
        width: 15% !important;
    }
</style>
<script>
    import villageApi from '@/api/community/village'
    export default {
        components: {
        },
        data () {
            return {
                title: '新建',
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
                confirmLoading: false,
                form: this.$form.createForm(this),
                sensitive_info: [],
                visible: false,
                post: {
                    id: 0,
                    status: 0,
                    label_type: '',
                    label_name: ''
                }
            }
        },
        methods: {
            add () {
                this.title = '添加'
                this.visible = true
                this.post = {
                    id: 0,
                    status: 0,
                    label_type: '',
                    label_name: ''
                }
                this.request(villageApi.getLabelType).then((data) => {
                    this.sensitive_info = data
                })
            },
            edit (id) {
                this.title = '编辑'
                this.visible = true
                this.post.id = id
                this.getEditInfo()
                this.request(villageApi.getLabelType).then((data) => {
                    this.sensitive_info = data
                })
            },

            handleSubmit () {
                const {
                    form: {
                        validateFields
                    }
                } = this
                this.confirmLoading = true

                validateFields((errors, values) => {
                    if (!errors) {
                        const url = villageApi.changeUserLabel
                        if (this.post.id > 0) {
                            values.post.id = this.post.id
                            values.post.type = 'update'
                        } else {
                            values.post.type = 'add'
                        }
                        values.post.label_name=values.post.label_name.trim();
                        console.log('label_name',values.post.label_name)
                        if(!values.post.label_name||values.post.label_name.length<1){
                            this.confirmLoading = false
                            this.$message.error('标签名称不能为空！');
                            return false;
                        }
                        console.log(values.post)
                        this.request(url, values.post)
                            .then((res) => {
                                if (this.post.id > 0) {
                                    this.$message.success('编辑成功')
                                } else {
                                    this.$message.success('添加成功')
                                }
                                setTimeout(() => {
                                    this.form = this.$form.createForm(this)
                                    this.visible = false
                                    this.confirmLoading = false
                                    this.$emit('ok')
                                }, 1500)
                            })
                    } else {
                        this.confirmLoading = false
                    }
                })
            },
            handleCancel () {
                this.visible = false
                setTimeout(() => {
                    this.post.id = 0
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            getEditInfo () {
                this.request(villageApi.getUserLabelInfo, {
                    id: this.post.id
                })
                    .then((res) => {
                        this.post = {
                            id: res.id,
                            status: res.status,
                            label_type: res.label_type,
                            label_name: res.label_name
                        }
                    })
            }
        }
    }
</script>