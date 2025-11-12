<template>
    <div>
    <div class="base_set">
        <a-form-model ref="ruleForm" :model="baseForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <div class="add_coupon">
                <a-form-model-item label="新版工单及时率" prop="is_timely" extra="及时率是计算工作人员接单到结单的时间,工单类目设置时间为30分钟,在该时间内结单算正常,超过时间算问题工单">
                    <a-radio-group name="radioGroup" :default-value="1" v-model="baseForm.is_timely">
                        <a-radio :value="1">启用</a-radio>
                        <a-radio :value="0">禁用</a-radio>
                    </a-radio-group>
                </a-form-model-item>
                
                <a-form-model-item label="新版工单自动抢单" prop="is_grab_order" extra="自动抢单功能是指对工单类别,没有绑定负责人处理时间的情况下,业主发布工单时工作人员自行抢接这个任务,例如投诉工单或保修工单">
                    <a-radio-group name="radioGroup" :default-value="1" v-model="baseForm.is_grab_order" @change="changeGrabOrder">
                        <a-radio :value="1">启用</a-radio>
                        <a-radio :value="0">禁用</a-radio>
                    </a-radio-group>
                </a-form-model-item>
                
                <a-form-model-item label="超时指定的时间" prop="grab_order_time">
                    <a-input-number id="inputNumber" v-model="baseForm.grab_order_time" :min="0" />
                    小时（业主发布工单多少没有工作人员接任务，由平台指定给特定的工作人员，例如投诉工单或报修工单）
                    <a-button type="primary" @click="goBindWorker">去绑定</a-button>
                </a-form-model-item>
                
                <a-form-model-item label="是否启用新版工单" prop="works_order_switch">
                    
                    <a-radio-group name="radioGroup" :value="1"  v-if="v_works_order_switch > 0" >
                       <a-radio :value="0" disabled >否</a-radio>
                       <a-radio :value="1" disabled >是</a-radio>
                    </a-radio-group>
                    
                   <a-radio-group name="radioGroup" :default-value="0"  v-model="baseForm.works_order_switch" v-else >
                       <a-radio :value="0">否</a-radio>
                       <a-radio :value="1">是</a-radio>
                   </a-radio-group> 
                </a-form-model-item>
                <div v-if="is_jz_customized_open == 1">
                    <a-form-model-item label="楼栋管家接受工单" prop="is_build_work_order" extra="小区住户在添加事件工单时，根据住户选择的“对应位置”，提交给楼栋管家，需要由楼栋管家先确认，在进入下一级">
                        <a-radio-group name="radioGroup" :default-value="0" v-model="baseForm.is_build_work_order">
                            <a-radio :value="1">启用</a-radio>
                            <a-radio :value="0">禁用</a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="照片/视频是否必填" prop="is_pic_video" extra="默认为“否”状态，若选择“是”状态，用户端/移动端/后台，在上报工单时，照片/视频是必填项">
                        <a-radio-group name="radioGroup" :default-value="0" v-model="baseForm.is_pic_video">
                            <a-radio :value="1">是</a-radio>
                            <a-radio :value="0">否</a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="未及时接单信息通知" prop="not_receive_interval" extra="从工单提交开始计时，n分钟后，没有工作人员接单发送模板信息通知小区管理员。">
                        工单提交后 <a-input-number id="not_receive_interval" style="width: 60px"  v-model="baseForm.not_receive_interval" :min="0" :precision="0"/>
                        分钟无工作人员接单，发送模板信息通知小区管理员
                        <span>
                            <a-select
                                v-model="baseForm.not_receive_work_id"
                                show-search
                                placeholder="请选择通知人员"
                                style="width: 150px"
                                :options="selects"
                                :filter-option="filterOption"
                                @focus="handleFocus"
                                @blur="handleBlur"
                                @change="handleChange"
                            ></a-select>
                        </span>
                    </a-form-model-item>
                    <a-form-model-item v-if="is_developer==1 || is_supply_station==1" label="禁止转单设置" prop="not_to_facilities" extra="默认为“允许”状态，“禁止”状态，物业管家不能转单给当前小区">
                        <a-radio-group name="radioGroup" :default-value="0" v-model="baseForm.not_to_facilities">
                            <a-radio :value="1">禁止</a-radio>
                            <a-radio :value="0">允许</a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="收费工单结单设置" prop="auto_end_bill_order" extra="默认为“关闭”状态，若选择“启用”状态，可以设置自动结单时长">
                        <a-radio-group name="radioGroup" :default-value="0" v-model="baseForm.auto_end_bill_order">
                            <a-radio :value="1">启用</a-radio>
                            <a-radio :value="0">关闭</a-radio>
                        </a-radio-group>
                        <div v-if="baseForm.auto_end_bill_order == 1">
                            业主同意收费工单后<a-input-number id="auto_end_interval" style="width: 70px"  v-model="baseForm.auto_end_interval" :min="0" :precision="0"/>小时后，自动结单
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="自动派单" prop="auto_dispatch_order" v-if="is_supply_station == 1">
                        <a-radio-group name="radioGroup" :default-value="0" v-model="baseForm.auto_dispatch_order" @change="changeAutoDispatchrder">
                            <a-radio :value="1">启用</a-radio>
                            <a-radio :value="0">禁用</a-radio>
                        </a-radio-group>
                        <div class="extra-div-box">
                            <p>1、所有工作人员打卡签到，能显示在线状态。</p>
                            <p>2、所有在线工作人员随机指派。</p>
                            <p>3、一人接单并结单后，指派给其他闲时人员。</p>
                            <p>4、所有在线人员都接单过并结单后，计算闲时最长人员派单。</p>
                            <p>5、自动派单 跟 自动抢单 不能同时开启，只能选择其中一种配置 启用。</p>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="工作人员签到时效" prop="auto_end_bill_order" v-if="is_supply_station == 1">
                        <a-radio-group name="radioGroup" :default-value="0" v-model="baseForm.sign_in_type">
                            <a-radio :value="1">二十四小时</a-radio>
                            <a-radio :value="0">二十四小时（零点前）</a-radio>
                        </a-radio-group>
                        <div class="extra-div-box">
                            <p>1、二十四小时：从当前工作人员签到的时间计算，连续24小时（时效），过了24小时重新签到，系统自动派单。</p>
                            <p>2、二十四小时（零点前）：是工作人员任何时间开始时间签到，有效期只到当天的23:59:59，第二天凌晨可重新签到，系统自动派单。</p>
                        </div>
                    </a-form-model-item>
                    
                    <a-form-model-item v-if="is_developer==1" label="小区转单接收员" prop="order_recipient_work_id" extra="只能设置一个工作人员进行接其他小区转过来的工单。">
                        <span>
                            <a-select v-model="baseForm.order_recipient_work_id" show-search placeholder="请选择小区转单接收员" style="width: 120px" :options="selectWorks" :filter-option="filterOptionWork"
                                @focus="handleFocusWork" @blur="handleBlurWork" @change="handleChangeWork">
                            </a-select>
                        </span>
                    </a-form-model-item>
                    
                    <a-form-model-item label="维修账单超时设置" prop="over_fee_confirm_interval" extra="">
                        收费工单业主超过<a-input-number id="over_fee_confirm_interval" style="width: 60px"  v-model="baseForm.over_fee_confirm_interval" :min="0" :precision="0"/>
                        分钟，未进行确认直接默认<span>
                            <a-select v-model="baseForm.over_fee_confirm_operate" show-search placeholder="请选择操作" style="width: 120px" :options="selectOperates" :filter-option="filterOptionOperates" 
                                @focus="handleFocusOperates" @blur="handleBlurOperates" @change="handleChangeOperates">
                            </a-select>
                        </span>工单自动进入下一步流程。
                    </a-form-model-item>

                    <a-form-model-item label="非万事兴开发商小区" prop="auto_dispatch_order" v-if="is_developer == 1 && baseForm.is_contact_available != 1">
                        <a-radio-group name="radioGroup" :default-value="0" v-model="baseForm.auto_contact_available">
                            <a-radio :value="1">自动推送</a-radio>
                            <a-radio :value="0">手动推送</a-radio>
                        </a-radio-group>
                        <div class="extra-div-box">
                            <p>1、普通小区自动推送，非万事兴开发商小区信息反馈给业主。</p>
                            <p>2、普通小区工作人员手动操作，把非万事兴开发商小区信息反馈给业主。</p>
                        </div>
                    </a-form-model-item>
                </div>
            </div>
        </a-form-model>
        <a-card :bordered="false" style="text-align: center;" >
            <a-button  type="primary" style="margin-top: 20px;margin-right: 15px;margin-bottom: 30px;" @click="handleSubmit()" >保存设置</a-button>
        </a-card>
    </div>
    
        <a-modal title="绑定指定工作人员" :width="850" :visible="bindWorkerVisiable" :maskClosable="false" @cancel="cancelBindWorker"
            :footer="null">
            <iframe v-if="bindWorkerVisiable" :src="bindWorkerUrl" width="100%"  style="height:600px;border: none;"></iframe>
        </a-modal>
        
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
                    is_timely:0,
                    is_grab_order:0,
                    grab_order_time:0,
                    works_order_switch:0,
                    not_receive_work_id:0,
                },
                v_works_order_switch:1,
                rules:{},
                bindWorkerUrl:'',
                bindWorkerVisiable:false,
                is_jz_customized_open: 0,
                is_supply_station: 0,
                is_developer: 0,
                selects: [],
                selectWorks: [],
                selectOperates: [],
                
            }
        },
        mounted(){
            this.getVillageRepairConfig()
        },
        methods: {
            handleChange(value) {
                console.log(`selected ${value}`);
            },
            handleBlur() {
                console.log('blur');
            },
            handleFocus() {
                console.log('focus');
            },
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            handleChangeWork(value) {
                console.log(`selected ${value}`);
            },
            handleBlurWork() {
                console.log('blur');
            },
            handleFocusWork() {
                console.log('focus');
            },
            filterOptionWork() {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            handleChangeOperates(value) {
                console.log(`selected ${value}`);
            },
            handleBlurOperates() {
                console.log('blur');
            },
            handleFocusOperates() {
                console.log('focus');
            },
            filterOptionOperates() {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            changeGrabOrder(event) {
                let value = event.target.value;
                console.log('value', value)
                if (value == 1 && this.is_jz_customized_open == 1 && this.is_supply_station == 1 && this.baseForm.auto_dispatch_order == 1) {
                    this.baseForm.auto_dispatch_order = 0;
                    this.$message.success('[自动派单]自动切换为禁用！')
                }
            },
            changeAutoDispatchrder(event) {
                let value = event.target.value;
                console.log('value', value)
                if (value == 1 && this.baseForm.is_grab_order == 1 && this.is_supply_station == 1) {
                    this.baseForm.is_grab_order = 0;
                    this.$message.success('[新版工单自动抢单]自动切换为禁用！')
                }
            },
            goBindWorker(){
                this.bindWorkerVisiable=true;
            },
            cancelBindWorker(){
                this.bindWorkerVisiable=false;
            },
            getVillageRepairConfig(){
                this.request(villageApi.getVillageRepairConfig).then((res) => {
                    if(res){
                        this.bindWorkerUrl=res.bindWorkerUrl
                        this.baseForm=res.repairConfig;
                        this.v_works_order_switch=this.baseForm.works_order_switch;
                        let toCommon = 0;
                        if (res.configTableList && res.configTableList[0]) {
                            toCommon = 1;
                            this.$emit('toCommonTabList', res.configTableList)
                        }
                        if(toCommon != 1 && res.is_comment_point && (res.is_comment_point==1 || res.is_comment_point=='1')){
                            this.$emit('toChild', 'is_comment_point')
                        }else{
                            this.$emit('toChild', '')
                        }
                        if(res.is_jz_customized_open && (res.is_jz_customized_open==1 || res.is_jz_customized_open=='1')){
                            this.is_jz_customized_open = 1;
                        }else{
                            this.is_jz_customized_open = 0;
                        }
                        if(res.is_supply_station && (res.is_supply_station==1 || res.is_supply_station=='1')){
                            this.is_supply_station = 1;
                        } else {
                            this.is_supply_station = 0;
                        }
                        if(res.is_developer && (res.is_developer==1 || res.is_developer=='1')){
                            this.is_developer = 1;
                        } else {
                            this.is_developer = 0;
                        }
                        if (toCommon != 1 && this.is_jz_customized_open == 1 && this.is_supply_station != 1 && this.is_developer != 1) {
                            this.$emit('toCustomized', 'is_jz_customized_open')
                        } else if(toCommon != 1 && this.is_jz_customized_open == 1) {
                            this.$emit('toCustomized', 'is_jz_customized_open_1')
                        }
                        this.selects = res.selects
                        if (res.selectWorks) {
                            this.selectWorks = res.selectWorks
                        }
                        if (res.selectOperates) {
                            this.selectOperates = res.selectOperates
                        }
                    }
                })
            },
            handleSubmit(){
                this.baseForm.xtype='base_set';
                this.request(villageApi.saveVillageRepairConfig,this.baseForm).then((res) => {
                        this.$message.success('操作成功！')
                        this.getVillageRepairConfig()
                    })
                },
        }
    }
</script>

<style lang="less" scoped>
.extra-div-box {
    color: rgba(0, 0, 0, 0.45);
}
.extra-div-box p {
    padding: 0;
    margin: 0;
    color: rgba(0, 0, 0, 0.45);
    line-height:1.5em;
}
</style>