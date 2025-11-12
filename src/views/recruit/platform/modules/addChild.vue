<template>
    <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading">
            <a-form>
                <a-form-item :label="L('类别名称')" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true"
                             :help="L('1-8字符')">
                    <a-input
                            v-model="detail.cat_title"
                    />
                </a-form-item>

                <a-form-item :label="L('排序')" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                            v-model="detail.sort"
                    />
                </a-form-item>
                <!--                <a-form-item-->
                <!--                        :label="L('链接选择')"-->
                <!--                        :help="L('可从平台图文素材中选择相关链接图文')"-->
                <!--                        :labelCol="labelCol" :wrapperCol="wrapperCol"-->
                <!--                >-->
                <!--                    <div class="flex">-->
                <!--                        <a-row>-->
                <!--                            <a-col :span="15">-->
                <!--                                <a-input-->
                <!--                                        v-model="detail.cat_url"-->
                <!--                                        :placeholder="L('请输入链接/功能库选择')"-->
                <!--                                        autoSize-->
                <!--                                />-->
                <!--                            </a-col>-->
                <!--                            <a-col :span="9" class="text-left">-->
                <!--                                <a class="ml-20" @click="getLinkUrl()">{{ L('从功能库选择') }}</a>-->
                <!--                            </a-col>-->
                <!--                        </a-row>-->
                <!--                    </div>-->
                <!--                </a-form-item>-->

                <!--                <a-form-item :label="L('角标文案')" :labelCol="labelCol" :wrapperCol="wrapperCol"-->
                <!--                             :help="L('用于前端角标展示,不填则不展示角标')">-->
                <!--                    <a-row>-->
                <!--                        <a-col :span="6">-->
                <!--                            <a-input-->
                <!--                                    v-model="detail.logo_title"-->
                <!--                            />-->
                <!--                        </a-col>-->
                <!--                        <a-col :span="18" class="text-left">-->
                <!--                            1-5字符-->
                <!--                        </a-col>-->
                <!--                    </a-row>-->
                <!--                </a-form-item>-->
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
        name: "addChild",
        components: {ACol, ARow},
        data() {
            return {
                title: '添加类别',
                visible: false,
                confirmLoading: false,
                detail: {
                    cat_id: '',
                    cat_fid: "",
                    cat_title: "",
                    sort: "",
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
                    cat_fid: cat_fid,
                    cat_title: "",
                    cat_description: "",
                    cat_url: "",
                    logo_title: "",
                    level: 2,
                }
            },
            edit(cat_id) {

                this.detail.cat_id = cat_id
                // this.getEditInfo()
                if (this.detail.cat_id > 0) {
                    this.title = this.L('编辑子分类')
                    this.getEditInfo()
                } else {
                    this.title = this.L('添加子分类')
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
                            this.$set(this.detail, 'cat_url', res.url)
                        })
                    },
                })
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
            getEditInfo() {
                this.request(recruitPlatformApi.editCategory, {
                    cat_id: this.detail.cat_id,
                }).then((res) => {
                    this.visible = true
                    this.detail.cat_id = res.cat_id
                    this.detail.cat_title = res.cat_title
                    this.detail.sort = res.sort
                })
            },
        }
    }
</script>

<style scoped>

</style>