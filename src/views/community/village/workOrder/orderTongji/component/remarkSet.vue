<template>
    <div class="remark_set">
        <a-form-model ref="ruleForm" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div class="add_coupon">
                <a-form-model-item label="启用 / 禁用">
                    <a-switch :default-checked="false" checked-children="启用" un-checked-children="禁用"
                        v-model="auto_evaluate.is_open" @change="switchChange" />
                </a-form-model-item>
                <a-form-model-item label="结单完成后" extra="当设置为 0 时,不支持小数,系统不进行自动好评">
                    <div class="order_compelete">
                        <a-input-number id="inputNumber" v-model="auto_evaluate.stime" :min="0" :max="360" :step="1" :formatter="value => value.replace(/[^\d]/g, '')" />
                        <a-select placeholder="请选择类型" style="width: 200px;margin-left: 10px;"
                            v-model="auto_evaluate.stime_type">
                            <a-select-option value="hour">小时</a-select-option>
                            <a-select-option value="day">天</a-select-option>
                        </a-select>
                        <span style="margin-left: 10px;width: 100px;">后自动好评</span>

                        <span style="margin-left: 10px;width: 115px;">自动好评时打星</span>
                        <a-select placeholder="请选择评分" style="width: 200px;" default-value="5"
                            v-model="auto_evaluate.star">
                            <a-select-option value="1">一星</a-select-option>
                            <a-select-option value="2">二星</a-select-option>
                            <a-select-option value="3">三星</a-select-option>
                            <a-select-option value="4">四星</a-select-option>
                            <a-select-option value="5">五星</a-select-option>
                        </a-select>
                    </div>
                </a-form-model-item>
                <div style="text-align: center;">
                    <a-button type="primary" style="margin-top: 50px;" @click="handleSubmit()">保存设置</a-button>
                </div>
            </div>
        </a-form-model>
    </div>
</template>

<script>
    import villageApi from "@/api/community/village";
    export default {
        data() {
            return {
                labelCol: {
                    span: 4
                },
                wrapperCol: {
                    span: 20
                },
                auto_evaluate: {
                    is_open: false,
                    stime: 0,
                    stime_type: "hour",
                    star: "5"
                },
            }
        },
        mounted() {
            this.getVillageRepairConfig()
        },
        methods: {
            switchChange(e) {
                console.log('e===>', e)
            },
            getVillageRepairConfig() {
                this.request(villageApi.getVillageRepairConfig).then((res) => {
                    if (res && res.repairConfig) {
                        this.auto_evaluate = res.repairConfig.auto_evaluate;
                    }
                })
            },
            handleSubmit() {
                console.log('auto_evaluate===>', this.auto_evaluate)
                let postArr = {}
                postArr.auto_evaluate = this.auto_evaluate
                postArr.xtype = 'auto_evaluate_set';
                this.request(villageApi.saveVillageRepairConfig, postArr).then((res) => {
                    this.$message.success('操作成功！')
                })
            },
        }
    }
</script>

<style lang="less" scoped>
    .order_compelete {
        display: flex;
        align-items: center;
    }
</style>
