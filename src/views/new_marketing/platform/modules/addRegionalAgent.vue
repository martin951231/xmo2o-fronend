<template>
    <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
        <a-form-model>
            <a-form-item :label="L('姓名')" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                <a-input
                        placeholder="请输入名称"
                        v-model="formData.name"/>
            </a-form-item>

            <a-form-item :label="L('选择区域')" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                <a-cascader :options="areas" placeholder="选择" :value="sel_areas"
                            @change="onChangeArea"/>
            </a-form-item>

            <a-form-item :label="L('绑定账号')" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                <a-input
                        placeholder="请输入手机号"
                        v-model="formData.phone"
                        @blur="findRight()"/>
            </a-form-item>

            <a-form-item :label="L('店铺业务抽成比例')" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input-number :min="0" v-model="formData.store_percent"/>
                <span class="ml-10">% 不填写则代表无提成,即为0</span>
            </a-form-item>

            <a-form-item :label="L('社区业务抽成比例')" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input-number :min="0" v-model="formData.village_percent"/>
                <span class="ml-10">% 不填写则代表无提成,即为0</span>
            </a-form-item>

            <a-form-item :label="L('备注')" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-textarea
                        placeholder="请输入备注"
                        :autoSize="{ minRows: 3, maxRows: 5 }"
                        v-model="formData.note"
                />
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
        name: "addRegionalAgent",
        components: {ACol, ARow},
        data() {
            return {
                title: '添加区域代理',
                visible: false,
                confirmLoading: false,
                areas: [],
                sel_areas: [],
                formData: {
                    name: "",
                    uid: 0,
                    province_id: 0,
                    city_id: 0,
                    area_id: 0,
                    store_percent: 0,
                    village_percent: 0,
                    note: "",
                    phone: "",
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
            add() {
                this.visible = true
                this.sel_areas = []
                this.formData = {
                    name: "",
                    uid: 0,
                    province_id: 0,
                    city_id: 0,
                    area_id: 0,
                    percent: 0,
                    note: "",
                    phone: "",
                }
                this.request(marketingPlatformApi.findArea, {})
                    .then((res) => {
                        this.areas = res
                    })
                    .catch((error) => {
                        this.confirmLoading = false
                    })
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
            findRight() {
                this.request(marketingPlatformApi.findRight, {phone: this.formData.phone})
                    .then((res) => {
                        if (res.status == 1) {
                            this.$message.success(this.L('此用户可以添加'))
                            this.formData.uid = res.data.uid
                        } else if (res.status == 2) {
                            this.formData.uid = 0
                            this.$message.error(this.L('此用户id已经是业务员,不可以直接成为区域代理'))
                        } else {
                            this.formData.uid = 0
                            this.$message.error(this.L('用户不存在'))
                        }
                    })
                    .catch((error) => {
                        this.confirmLoading = false
                    })
            },
            onChangeArea(value) {
                this.formData.province_id = value[0]
                this.formData.city_id = value[1]
                this.formData.area_id = value[2]
                this.sel_areas = [value[0], value[1], value[2]]
            },
            handleCancel() {
                this.visible = false
            },
            handleSubmit() {
                this.confirmLoading = true
                if (this.sel_areas.length > 0) {
                    this.request(marketingPlatformApi.addRegionalAgency, this.formData)
                        .then((res) => {
                            if (res) {
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
                    this.$message.error(this.L('区域必选'))
                }
            },
        }
    }
</script>

<style scoped>

</style>