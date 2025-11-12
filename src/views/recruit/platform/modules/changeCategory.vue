<template>
    <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading">
            <a-form>
                <a-form-item :label="L('选择新分类')" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-select style="width: 320px"
                              @change="changeSelect">
                        <a-select-option :key="item.cat_id" :value="item.cat_id" v-for="item in sel_cat">{{
                            item.cat_title }}
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
    import ARow from "ant-design-vue/es/grid/Row";
    import ACol from "ant-design-vue/es/grid/Col";
    import recruitPlatformApi from '@/api/recruit/platform/index'

    export default {
        name: "changeCategory",
        components: {ACol, ARow},
        data() {
            return {
                title: '修改分类',
                visible: false,
                confirmLoading: false,
                sel_cat: [],
                detail: {
                    cat_id: '',
                    sel_cat: [],
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
            add(cat_fid) {
                this.visible = true
                this.detail = {
                    cat_id: '',
                    sel_cat: [],
                    new_id: ""
                }
            },
            edit(cat_id, sel_ids) {
                this.sel_cat = []
                this.detail.sel_cat = sel_ids
                this.visible = true
                this.title = this.L('修改分类')
                this.detail.cat_id = cat_id
                if (this.detail.cat_id > 0) {
                    this.title = this.L('编辑子分类')
                    this.getEditInfo()
                } else {
                    this.title = this.L('添加子分类')
                }
            },
            changeSelect(val) {
                this.detail.new_id = val
            },
            handleCancel() {
                this.visible = false
            },
            handleSubmit() {
                this.confirmLoading = true
                if (this.detail.cat_id) {
                    this.request(recruitPlatformApi.byOtherCategory, this.detail)
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
            getEditInfo() {
                this.request(recruitPlatformApi.getCategory, {
                    cat_id: this.detail.cat_id,
                }).then((res) => {
                    this.sel_cat = res.list
                })
            },
        }
    }
</script>

<style scoped>

</style>