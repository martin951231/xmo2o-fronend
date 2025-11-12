<template>
    <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading">
            <a-form>
                <a-form-item :label="L('分类名称')" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input
                             v-model="detail.cat_title"
                    />
                </a-form-item>
            </a-form>
        </a-spin>

        <template slot="footer">
            <a-popconfirm
                    v-if="detail.cat_id"
                    class="ant-dropdown-link"
                    style="float: left"
                    :title="L('你确定要删除此分类吗?该分类下所有子分类都一起删除')"
                    :ok-text="L('确定')"
                    :cancel-text="L('取消')"
                    @confirm="delSort()"
                    @cancel="cancel"
            >
                <a-button>{{ L('删除分类') }}</a-button>
            </a-popconfirm>
            <a-button key="back" @click="handleCancel">{{ L('取消') }}</a-button>
            <a-button key="submit" type="primary" @click="handleSubmit">{{ L('确定') }}</a-button>
        </template>
    </a-modal>
</template>

<script>
    import CustomTooltip from '@/components/CustomTooltip/CustomTooltip'
    import recruitPlatformApi from '@/api/recruit/platform/index'

    export default {
        name: "EditTool",
        components: {
            CustomTooltip,
        },
        data() {
            return {
                title: '添加分类',
                visible: false,
                confirmLoading: false,
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
                detail: {
                    cat_id: '',
                    cat_title: "",
                },
            }
        },
        methods: {
            add() {
                this.visible = true
                this.detail = {
                    cat_id: '',
                    level: 1,
                    cat_title: "",
                }
            },
            edit(cat_id) {
                // this.getEditInfo()
                if (this.detail.cat_id > 0) {
                    this.title = this.L('编辑分类')
                    this.getEditInfo()
                } else {
                    this.visible = true
                    this.detail.cat_id = cat_id
                    this.title = this.L('新建分类')
                }
                console.log(this.detail.cat_id)
            },
            getEditInfo() {
                this.request(recruitPlatformApi.editCategory, {
                    cat_id: this.detail.cat_id,
                }).then((res) => {
                    this.visible = true
                    this.detail.cat_id = cat_id
                    this.detail.cat_id = res.cat_id
                    this.detail.cat_title = res.cat_title
                })
            },
            // 删除分类
            delSort() {
                this.request(recruitPlatformApi.delCategory, {cat_id: this.detail.cat_id})
                    .then((res) => {
                        this.$message.success(this.L('删除成功'))
                        // 调用父页面方法
                        this.$emit('handleUpdate', {})
                        // this.form = this.$form.createForm(this)
                        this.visible = false
                        this.confirmLoading = false
                    })
                    .catch((error) => {
                        this.confirmLoading = false
                    })
            },
            // 取消删除
            cancel() {
            },
            handleCancel() {
                this.visible = false
                // this.getEditInfo()
                //this.form = this.$form.createForm(this)
            },
            handleSubmit() {
                this.confirmLoading = true
                if (this.detail.cat_id) {
                    this.request(recruitPlatformApi.updateCategory, this.detail)
                        .then((res) => {
                            if (this.detail.cat_id) {
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
                    this.request(recruitPlatformApi.addCategory, this.detail)
                        .then((res) => {
                            if (this.detail.cat_id) {
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
        }
    }
</script>

<style scoped>

</style>