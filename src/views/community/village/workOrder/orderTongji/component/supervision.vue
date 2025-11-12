<template>
    <div class="remark_set" style="width: 800px;">
        <a-form-model ref="ruleForm" :model="baseForm" :rules="rules" :label-col="labelCol"  :wrapper-col="wrapperCol">
            <div class="add_coupon">
                <a-form-model-item label="业主施工方案设置" prop="refuse_order_nums_report" extra="设置为“无”代表不限制，不会上报到总后台；业主拒绝施工方案超过设置次数后，工单将推送对督查室（总后台工单处理中心）">
                    业主拒绝工单施工方案
                    <span>
                        <a-select
                            v-model="baseForm.refuse_order_nums_report"
                            placeholder="请选择次数"
                            style="width: 80px"
                            :options="refuseSelects"
                            @focus="refuseHandleFocus"
                            @blur="refuseHandleBlur"
                            @change="refuseHandleChange"
                        ></a-select>
                    </span>次以上，工单上报总后台
                </a-form-model-item>
                <a-form-model-item label="不满意工单设置" prop="not_over_stars_report" extra="设置为“无”代表不限制，不会上报到总后台；">
                    用户对工单评分，等于或低于
                    <span>
                        <a-select 
                            placeholder="请选择评分" 
                            style="width: 80px;"
                            :options="starSelects"
                            v-model="baseForm.not_over_stars_report">
                        </a-select>
                    </span>时，工单上报总后台
                </a-form-model-item>
                
                <a-form-model-item label="公共区域维修上报" prop="not_timely_report_switch" extra="开启公共区域维修上报，用户在提交工单时，上报的工单属于公共区域（根据工单上报位置区分）工单是属于不限时效工单（需要上报到督查室）；关闭公共区域维修上报，工单不需要上报到督查室">
                    <a-switch :default-checked="false" checked-children="上报" un-checked-children="关闭"
                        v-model="baseForm.not_timely_report_switch_1" @change="switchChange"/>
                </a-form-model-item>
                <a-form-model-item label="工单超时设置" prop="over_timely_report" extra="从用户提交事件工单后开始计时（从上报工单时间），n分钟后，工作人员未接单上报总后台。">
                    工单未接单超过<a-input-number id="over_timely_report" style="width: 80px"  v-model="baseForm.over_timely_report" :min="0" :precision="0"/>
                    分钟,工单上报总后台
                </a-form-model-item>
                <a-form-model-item label="超时未处理设置" prop="over_not_processed_report" extra="从工作人员接单后开始计时，n分钟后算起">
                    工作人员接单<a-input-number id="over_not_processed_report" style="width: 80px"  v-model="baseForm.over_not_processed_report" :min="0" :precision="0"/>分钟后，工作人员未处理上报总后台。
                    <div>
                    并发送模板消息通知工作人员且同时通知小区管理员
                        <a-select
                            v-model="baseForm.over_not_processed_work_id"
                            show-search
                            placeholder="请选择通知人员"
                            style="width: 150px"
                            :options="work_selects"
                            @change="handleWorkChange"
                        ></a-select>
                         </div>
                </a-form-model-item>

                
                <a-form-model-item label="工作人员施工方案" prop="refuse_project_nums_report" extra="设置为“无”代表不限制，不会上报到总后台；工作人员拒绝施工方案超过设置次数后，工单将推送对督查室（总后台工单处理中心）">
                    工作人员拒绝施工方案
                    <span>
                        <a-select
                            v-model="baseForm.refuse_project_nums_report"
                            placeholder="请选择次数"
                            style="width: 80px"
                            :options="refuseProjectSelects"
                        ></a-select>
                    </span>次以上，工单上报总后台
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
                wrapperCol: { span: 18 },
                baseForm: {
                    refuse_order_nums_report:'0',
                    refuse_project_nums_report: '0',
                    not_over_stars_report: '0',
                    not_timely_report_switch_1: false,
                    not_timely_report_switch: 0,
                    over_timely_report: '',
                    over_not_processed_report: 0,
                    over_not_processed_work_id:0,
                    xtype:'supervision'
                },
                rules: {},
                refuseSelects: [
                    {'value': '0', 'label':'无'},
                    {'value': '1', 'label':'1'},
                    {'value': '2', 'label':'2'},
                    {'value': '3', 'label':'3'},
                    {'value': '4', 'label':'4'},
                    {'value': '5', 'label':'5'},
                    {'value': '6', 'label':'6'},
                    {'value': '7', 'label':'7'},
                    {'value': '8', 'label':'8'},
                ],
                refuseProjectSelects: [
                    {'value': '0', 'label':'无'},
                    {'value': '1', 'label':'1'},
                    {'value': '2', 'label':'2'},
                    {'value': '3', 'label':'3'},
                    {'value': '4', 'label':'4'},
                    {'value': '5', 'label':'5'},
                    {'value': '6', 'label':'6'},
                    {'value': '7', 'label':'7'},
                    {'value': '8', 'label':'8'},
                ],
                starSelects: [
                    {'value': '0', 'label':'无'},
                    {'value': '1', 'label':'一星'},
                    {'value': '2', 'label':'二星'},
                    {'value': '3', 'label':'三星'},
                    {'value': '4', 'label':'四星'},
                    {'value': '5', 'label':'5星'},
                ],
                work_selects:[],
            }
        },
        mounted(){
            this.getVillageRepairConfig()
        },
        methods: {
            handleWorkChange(value) {
                console.log(`selected ${value}`);
            },
            refuseHandleChange(value) {
                console.log(`selected ${value}`);
            },
            refuseHandleBlur() {
                console.log('blur');
            },
            refuseHandleFocus() {
                console.log('focus');
            },
            switchChange(event) {
                console.log('switchChange', event);
            },
            getVillageRepairConfig(){
                this.request(villageApi.getVillageRepairConfig).then((res) => {
                    if(res && res.repairConfig){
                        this.baseForm.refuse_order_nums_report = '' + res.repairConfig.refuse_order_nums_report;
                        this.baseForm.not_over_stars_report = '' + res.repairConfig.not_over_stars_report;
                        this.baseForm.over_timely_report = '' + res.repairConfig.over_timely_report;
                        this.baseForm.refuse_project_nums_report = '' + res.repairConfig.refuse_project_nums_report;
                        this.baseForm.over_not_processed_report = '' + res.repairConfig.over_not_processed_report;
                        this.baseForm.over_not_processed_work_id= res.repairConfig.over_not_processed_work_id;
                        if (res.repairConfig.not_timely_report_switch == 1) {
                            this.baseForm.not_timely_report_switch_1 = false;
                        } else {
                            this.baseForm.not_timely_report_switch_1 = true;
                        }
                        this.work_selects = res.selects
                    }
                })
            },
            
            handleSubmit(){
                console.log(this.baseForm);
                this.baseForm.xtype='supervision';
                if (this.baseForm.not_timely_report_switch_1) {
                    this.baseForm.not_timely_report_switch = 0;
                } else {
                    this.baseForm.not_timely_report_switch = 1;
                }
                 this.request(villageApi.saveVillageRepairConfig,this.baseForm).then((res) => {
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