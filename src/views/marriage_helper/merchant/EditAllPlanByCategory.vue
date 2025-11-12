<template>
    <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading">
            <a-form>
                <a-form-item :label="L('选择新分类')" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-select @change="handleCatChange">
                        <a-select-option v-for="item in sel_list" :key="item.cat_id" :value="item.cat_id">
                            {{item.cat_name }}
                        </a-select-option>
                    </a-select>
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
    import marriageHelperCommentApi from '@/api/marriage_helper/platform'

    export default {
        name: "EditAllPlanByCategory",
        data() {
            return {
                sel_list: [],
                title: '修改分类',
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
                    sel_cat: [],
                },
            }
        },
        methods: {
            edit(cat_id, sel_ids) {
                this.detail.sel_cat = sel_ids
                this.visible = true
                this.title = this.L('修改分类')
                this.getEditInfo(cat_id)
            },
            handleCatChange(val) {
                this.detail.cat_id = val
                console.log(val, "val==val=val=val=val")
            },
            getEditInfo(cat_id) {
                this.sel_list = []
                this.request(marriageHelperCommentApi.getSelCategory, {
                    cat_id: cat_id,
                }).then((res) => {
                    this.sel_list = res
                })
            },
            // 取消删除
            cancel() {
            },
            handleCancel() {
                this.visible = false
            },
            handleSubmit() {
                this.confirmLoading = true
                if (this.detail.cat_id) {
                    this.request(marriageHelperCommentApi.byOtherCategory, this.detail)
                        .then((res) => {
                            this.$message.success(this.L('编辑成功'))
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
                    this.$message.success(this.L('请选择分类再提交'))
                }
            },
        }
    }
</script>

<style scoped>

</style>