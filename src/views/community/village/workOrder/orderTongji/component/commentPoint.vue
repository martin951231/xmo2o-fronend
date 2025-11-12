<template>
    <div class="remark_set" style="width: 800px;">
        <a-form-model ref="ruleForm" :model="remarkForm" :rules="rules" :label-col="labelCol"  :wrapper-col="wrapperCol">
            <div class="add_coupon">
                <a-form-model-item label="用户评价获得" prop="per_works_order_integral" extra="用户评价打星后会增加用户积分,如果工单多次评价只能获得一次积分">
                    <div class="order_compelete">
                        <a-input-number id="inputNumber" v-model="remarkForm.per_works_order_integral" :min="0" :max="99999999"/> &nbsp;&nbsp;积分
                    </div>
                </a-form-model-item>
                
                <a-form-model-item label="当天评价获取最大" prop="day_works_order_integral" extra="当天评价获取的积分数当超过设置最大积分值时，后续评价不会增加积分.用户评价获取积分跟当天评价获取最大积分建议取整数。例：用户评价获取积分为“2”积分，当天评价获取最大为“8”积分。当天评价获取最大积分设置为“0”时，不限制用户评价工单获取积分；">
                    <div class="order_compelete">
                        <a-input-number id="inputNumber" v-model="remarkForm.day_works_order_integral" :min="0" :max="99999999" /> &nbsp;&nbsp;积分（必须大于 【用户评价获得】设置的值）
                    </div>
                </a-form-model-item>
                <div style="text-align: center;" >
                        <a-button  type="primary" style="margin-top: 50px;" @click="handleSubmit()" >保存设置</a-button>
                    </div>
            </div>
        </a-form-model>
    </div>
</template>

<script>
    import villageApi from "@/api/community/village";
    export default {
        data(){
            return{
                labelCol: { span: 4 },
                wrapperCol: { span: 15 },
                remarkForm: {
                    per_works_order_integral:0,
                    day_works_order_integral:0,
                    xtype:'other_set'
                },
                rules: {
                },
            }
        },
        mounted(){
            this.getVillageRepairConfig()
        },
        methods: {
            getVillageRepairConfig(){
                this.request(villageApi.getVillageRepairConfig).then((res) => {
                    if(res && res.repairConfig){
                        this.remarkForm.per_works_order_integral=res.repairConfig.per_works_order_integral;
                        this.remarkForm.day_works_order_integral=res.repairConfig.day_works_order_integral;
                    }
                })
            },
            
            handleSubmit(){
                console.log(this.remarkForm);
                if(this.remarkForm.day_works_order_integral>0 && this.remarkForm.day_works_order_integral<this.remarkForm.per_works_order_integral){
                    this.$message.error('【当天评论获取最大】 必须要大于【用户评论获得】的值！');
                    return false;
                }
                this.remarkForm.xtype='other_set';
                 this.request(villageApi.saveVillageRepairConfig,this.remarkForm).then((res) => {
                    this.$message.success('操作成功！')
                 })
            },
            
    
        }
    }
</script>

<style lang="less" scoped>
    .order_compelete{
        display: flex;
        align-items: center;
        .ant-input-number{width: 120px}
    }
    
</style>