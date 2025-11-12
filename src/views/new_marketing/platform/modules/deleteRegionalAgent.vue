<template>
    <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
        <a-form-model ref="form">
            <a-form-item :label="L('选择接手区域代理:')" :labelCol="labelCol" :wrapperCol="wrapperCol"
                         :help="L('该区代当前下级团队将归属新区域代理管理')">
                <a-select placeholder="请选择" @change="handleSelectChange" v-model="formData.sel_id">
                    <a-select-option
                            v-for="(item,index) in manager"
                            :value="item.id"
                            :key="index">
                        {{item.name}}
                    </a-select-option>
                </a-select>
            </a-form-item>
        </a-form-model>
        <template slot="footer">
            <a-button key="back" @click="handleCancel">{{ L('取消') }}</a-button>
            <a-button key="submit" type="primary" @click="handleSubmit">{{ L('确定') }}</a-button>
        </template>
    </a-modal>
</template>

<script>
    import ARow from "ant-design-vue/es/grid/Row";
    import ACol from "ant-design-vue/es/grid/Col";
    import marketingPlatformApi from '@/api/new_marketing/platform/index'

    export default {
        name: "deleteRegionalAgent",
        components: {ACol, ARow},
        data() {
            return {
                title: '移除',
                visible: false,
                confirmLoading: false,
                manager: [],
                formData: {
                    id: 0,
                    sel_id: undefined,
                    percent: 0,
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
            delData(id) {
                this.visible = true
                this.formData = {
                    id: id,
                    sel_id: undefined
                }
                this.title = this.L('移除')
                this.request(marketingPlatformApi.reduceWin, {id: id})
                    .then((res) => {
                        console.log(res, "res--res-res")
                        this.manager = res.manager
                    })
                    .catch((error) => {
                        this.confirmLoading = false
                    })
            },
            handleSelectChange(val) {
                this.formData.sel_id = val;
            },
            handleCancel() {
                this.visible = false
            },
            handleSubmit() {
                this.$confirm({
                    title: '是否确定移除该区域代理?',
                    centered: true,
                    onOk: () => {
                        this.confirmLoading = true
                        this.request(marketingPlatformApi.delRegionalAgency, this.formData)
                            .then((res) => {
                                if (res) {
                                    this.$message.success(this.L('移除成功'))
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
                    },
                    onCancel() {
                    },
                })
            },
        }
    }
</script>

<style scoped>

</style>