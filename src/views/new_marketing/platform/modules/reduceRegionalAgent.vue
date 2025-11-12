<template>
    <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
        <a-form-model :model="formData">
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

            <a-form-item :label="L('降级身份')" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-radio-group v-model="formData.identity">
                    <a-radio :value="2"> 业务经理</a-radio>
                    <a-radio :value="1"> 业务员</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item :label="L('选择团队:')" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true"
                         v-if="formData.identity==1"
                         :help="L('降级为业务员后 将归属该团队')">
                <a-select placeholder="请选择" @change="handleSelectChange1">
                    <a-select-option
                            v-for="(item,index) in team"
                            :value="item.id"
                            :key="index">
                        {{item.name}}
                    </a-select-option>
                </a-select>
            </a-form-item>

            <!--<a-form-item :label="L('提成比例')" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="formData.identity==1">
                <a-input-number :min="0" v-model="formData.percent"/>
                <span class="ml-10">% 默认按照团队业务员比例，可针对个人调整比例</span>
            </a-form-item>-->
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
        name: "reduceRegionalAgent",
        components: {ACol, ARow},
        data() {
            return {
                title: '降级',
                visible: false,
                confirmLoading: false,
                manager: [],
                team: [],
                formData: {
                    id: 0,
                    sel_id: undefined,
                    identity: 1,
                    team_id: 0,
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
            add(id) {
                this.visible = true
                this.formData = {
                    id: id,
                    sel_id: undefined,
                    identity: 2,
                    team_id: 0,
                    percent: 0,
                }
                this.manager = []
                this.team = []
                this.request(marketingPlatformApi.reduceWin, {id: id})
                    .then((res) => {
                        this.manager = res.manager
                        this.team = res.team
                    })
                    .catch((error) => {
                        this.confirmLoading = false
                    })
            },
            handleSelectChange(val) {
                this.formData.sel_id = val;
            },
            handleSelectChange1(val) {
                this.formData.team_id = val;
            },
            findRight() {
                this.request(marketingPlatformApi.findRight, {phone: this.formData.phone})
                    .then((res) => {
                        if (res.status) {
                            this.$message.success(this.L('此用户可以添加'))
                            this.formData.uid = res.data.uid
                        } else {
                            this.formData.uid = 0
                            this.$message.error(this.L('没有这个用户信息'))
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
                this.manager = []
                this.team = []
                this.formData.sel_id = undefined
                this.visible = false
            },
            handleSubmit() {
                this.confirmLoading = true
                this.request(marketingPlatformApi.addReduce, this.formData)
                    .then((res) => {
                        if (res) {
                            this.$message.success(this.L('已降级'))
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
        }
    }
</script>

<style scoped>

</style>