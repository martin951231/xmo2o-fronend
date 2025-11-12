<template>
    <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading">
            <a-form>
                <a-form-item :label="L('计划名称')" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input
                            v-model="detail.plan_title"
                            aria-placeholder="限20个字"
                            :maxLength="20"
                    />
                </a-form-item>

                <a-form-item :label="L('链接文案')" :labelCol="labelCol" :wrapperCol="wrapperCol"  aria-placeholder="限10个字">
                    <a-input
                            v-model="detail.link_txt"
                    />
                </a-form-item>
                <a-form-item
                        :label="L('链接选择')"
                        :help="L('可从平台图文素材中选择相关链接图文')"
                        :labelCol="labelCol" :wrapperCol="wrapperCol"
                >
                    <div class="flex">
                        <a-row>
                            <a-col :span="15">
                                <a-input
                                        v-model="detail.link"
                                        :placeholder="L('请输入链接/功能库选择')"
                                        autoSize
                                />
                            </a-col>
                            <a-col :span="9" class="text-left">
                                <a class="ml-20" @click="getLinkUrl()">{{ L('从功能库选择') }}</a>
                            </a-col>
                        </a-row>
                    </div>
                </a-form-item>
            </a-form>
        </a-spin>

        <template slot="footer">
            <a-button key="back" @click="handleCancel">{{ L('取消') }}</a-button>
            <a-button key="submit" type="primary" @click="handleSubmit">{{ L('确定') }}</a-button>
        </template>
    </a-modal>
</template>

<script>
    import ARow from "ant-design-vue/es/grid/Row";
    import ACol from "ant-design-vue/es/grid/Col";
    import marriageHelperCommentApi from '@/api/marriage_helper/platform'
    export default {
        name: "EditPlan",
        components: {ACol, ARow},
        data() {
            return {
                title: '添加计划',
                visible: false,
                confirmLoading: false,
                detail: {
                    plan_id:'',
                    cat_id: '',
                    plan_title:"",
                    link_txt: "",
                    link: "",
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
            add(cat_id) {
                this.visible = true
                this.detail = {
                    plan_id:'',
                    cat_id: cat_id,
                    plan_title:"",
                    link_txt: "",
                    link: "",
                }
            },
            edit(plan_id) {
                this.visible = true
                this.detail.plan_id = plan_id
                // this.getEditInfo()
                if (this.detail.plan_id > 0) {
                    this.title = this.L('编辑计划')
                    this.getEditInfo()
                } else {
                    this.title = this.L('添加计划')
                }
            },
            // 功能链接配置
            getLinkUrl() {
                this.$LinkBases({
                    source: "platform", // 必填
                    type: 'h5', // 必填
                    source_id: '',
                    // 确定按钮
                    handleOkBtn: (res) => {
                        // 点击按钮事件
                        console.log('handleOk', res)
                        this.$nextTick(() => {
                            //链接库动态赋值
                            this.$set(this.detail, 'link', res.url)
                        })
                    },
                })
            },
            handleCancel() {
                this.visible = false
            },
            handleSubmit() {
                this.confirmLoading = true
                if (this.detail.plan_id) {
                    this.request(marriageHelperCommentApi.updatePlan, this.detail)
                        .then((res) => {
                            if (this.detail.plan_id) {
                                this.$message.success(this.L('编辑成功'))
                            } else {
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
                } else {
                    this.request(marriageHelperCommentApi.addPlan, this.detail)
                        .then((res) => {
                            if (this.detail.plan_id) {
                                this.$message.success(this.L('编辑成功'))
                            } else {
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
                }
            },
            getEditInfo() {
                this.request(marriageHelperCommentApi.editPlan, {
                    plan_id: this.detail.plan_id,
                }).then((res) => {
                    this.detail.plan_id = res.plan_id
                    this.detail.cat_id = res.cat_id
                    this.detail.plan_title = res.plan_title
                    this.detail.link_txt = res.link_txt
                    this.detail.link = res.link
                })
            },
        }
    }
</script>

<style scoped>

</style>