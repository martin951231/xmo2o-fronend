<template>
    <a-modal :width="750" :title="title" :destroyOnClose="true" :visible="visible" :maskClosable="false" :confirm-loading="confirmLoading"
        @ok="handleSubmit"
        @cancel="handleCancel">
        <a-collapse accordion>
            <a-collapse-panel key="1" header="操作说明">
                <p>
                    在快捷账单模块，可为收费对象绑定收费项目并且支持快速手动生成一次性账单，若有需要修改或作废的账单，也可在收银台进行费用修改及账单作废。<br/>
                    1、生成的一次性账单有缴费时效，若业主没有在该时效内进行缴费，账单自动作废。<br/>
                    2、一次性账单在生成时，若该时间范围内已有待缴账单生成，则不支持生成一次性账单。<br/>
                    3、账单生成周期设置按年生成时，规则说明：<br/>
                    <font style="color: #aaa">  例，账单开始生成时间：2022-01-01，收费周期为“ 1 ”年（默认值），收费截止时间为（ 自动获取值 2022-12-30 ），可对收费截止时间进行修改，修改时间只能大于/等于2022-12-30。
                        大于“2022-12-30”时间，按“日”计算费用，例：收费截止时间（ 修改为 2023-01-20 ），那这个时间比 “ 2022-12-30 ”多 20 天，这个20天的物业费用按照 每日物业费* 20天计算</font><br/>
                    <font style="color: #c35151"> 每日物业费 规则= 按年的收费金额 / 365天进行计算。</font><br/>
                    4、账单生成周期设置按月生成时，规则说明：<br/>
                        <font style="color: #aaa">  例，账单开始生成时间：2022-01-01，收费周期为“ 1 ”月（默认值）， 收费截止时间为（ 自动获取值 2022-01-30 ），可对收费截止时间进行修改，修改的时间只能大于/等于2022-01-30。
                            大于“2022-01-30”时间，按“日”计算费用，例：收费截止时间（ 修改为 2022-03-20 ），那这个时间比 “ 2022-01-30 ”多1个月 20天，1个月按照月收费标准进行收费，这个20天的物业费用按照 每日物业费* 20天计算</font><br/>
                    <font style="color: #c35151">每日物业费 规则= 按月的收费金额 / 30天进行计算</font><br/>
                    5、账单生成周期设置按日生成时，规则说明：<br/>
                            <font style="color: #aaa">  例，账单开始生成时间：2022-01-01，收费周期为“ 1 ”日（默认值），收费截止时间为（ 自动获取值 2022-01-02 ），可对收费截止时间进行修改，修改时间只能大于/等于2022-01-02。
                                大于“2022-01-02”时间，按“日”计算费用，例：收费截止时间（ 修改为 2022-01-22 ），那这个时间比 “ 2022-01-02 ”多 20 天，这个20天的物业费用按照 每日物业费* 20天计算</font><br/>
                </p>
            </a-collapse-panel>
        </a-collapse>
        <div class="modal_box">
            <div class="flex_text_box">
                <div class="text_1">收费项：</div>
                <a-select style="width: 220px" @change="projectChange" placeholder="请选择收费项">
                    <a-select-option v-for="project in project_list" :value="project.id">
                        {{ project.name }}
                    </a-select-option>
                </a-select>
            </div>
            <div class="flex_text_box margin_top_10">
                <div class="text_1">收费标准：</div>
                <a-select style="width: 220px" v-model="rule_id" @change="ruleChange" placeholder="请选择消费标准">
                    <a-select-option v-for="rule in rule_list" :value="rule.id">
                        {{ rule.charge_name }}
                    </a-select-option>
                </a-select>
            </div>
            <div class="flex_text_box margin_top_10" v-if="is_show_area" style="width: 500px">
                <div class="text_1">{{unit_gage}}(自定义计量单位数值)：</div>
                <a-input
                    style="width: 180px"
                    v-model="custom_value"
                    class="input_style margin_left_10"
                    placeholder="请输入自定义单位数值"
                    @change="unitGageChange"/>
            </div>
            <div class="flex_text_box margin_top_10" v-if="is_show_order_time" style="width: 500px">
                <div class="text_1">账单开始生成时间：</div>
                <a-date-picker
                    :mode="date_status"
                    :format="dateFormat"
                    :value="dateValue"
                    placeholder="请选择时间"
                    @change="onChangeTime">
                </a-date-picker>
                <span >不填默认下一个缴费日</span>
            </div>
            <div  v-if="is_show_order_time && config_customization.is_grapefruit_prepaid  && bill_create_set_tmp>1" class="flex_text_box margin_top_10">
            	  <div class="text_1">账单合并生成：</div>
                  <a-radio-group name="radioGroup" :default-value="0" v-model="per_one_order" class="input_style margin_left_10">
            		<a-radio :value="0">是</a-radio>
            		<a-radio :value="1">否</a-radio>
            	  </a-radio-group>
                  <span >默认为是。选择否将结合收费周期值来生成多笔按1个月计费的订单,请谨慎操作!</span>
            </div> 
            <div class="flex_text_box margin_top_10" v-if="is_show_order_time" style="width: 500px">
                <div class="text_1">收费周期：</div>
                <a-input
                    style="width: 200px"
                    v-model="cycle"
                    class="input_style margin_left_10"
                    placeholder="请输入收费周期时长"
                    @change="cycleChange"/>
                <span>{{ cycle_set }}（不填默认1）</span>
            </div>
            <div class="flex_text_box margin_top_10" v-if="is_show_order_time" style="width: 500px">
                <div class="text_1">收费截止时间：</div>
                <a-date-picker
                    :value="dateEndTime"
                    :mode="date_endTime"
                    :format="dateFormat"
                    placeholder="请选择收费截止时间"
                    @change="onChangeTime1" :disabled="true" style="background-color: #d9d9d9;">
                </a-date-picker>
            </div>
            <div class="flex_text_box margin_top_10 margin_bottom_10" style="width: 500px">
                <div class="text_1">缴费时效：</div>
                <a-input
                    style="width: 200px"
                    v-model="expires"
                    class="input_style margin_left_10"
                    placeholder="请输入缴费时效" />
                <span style="font-size: 14px">小时（不填默认1）</span>
            </div>
        </div>
        <div class="rule_detail" v-if="ruleDetailShow">
            <a-descriptions title="基本信息">
                <a-descriptions-item v-for="(item1,index1) in ruleDetail" :key="index1" :label="item1.title" v-if="item1.is_show" >
                    {{ item1.value }}
                </a-descriptions-item>
            </a-descriptions>
            <a-descriptions title="违约金设置">
                <a-descriptions-item v-for="(item2,index2) in ruleLateDetail" :key="index2" :label="item2.title" span="2">
                    {{ item2.value }}
                </a-descriptions-item>
            </a-descriptions>
        </div>
    </a-modal>
</template>

<script>
    import villageApi from "@/api/community/village";
    import moment from "moment";
    export default {
        components: {},
        data() {
            return {
                moment,
                title: '快捷生成账单',
                labelCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 7
                    }
                },
                wrapperCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 13
                    }
                },
                confirmLoading: false,
                form: this.$form.createForm(this),
                visible: false,
                key: '',
                project_id:'',
                is_cycle:0,
                cycle_set:'',
                cycle:'',
                custom_value:'',
                expires:'',
                rule_list:[],
                rule_id: '',
                ruleDetailShow: false,
                ruleDetail:[],
                ruleLateDetail:[],
                project_list:[],
                unit_gage: '',
                valid_time: 1,
                contract_time_end:0,
                date_status: 'date',
                date_endTime:'date',
                dateFormat: 'YYYY-MM-DD',
                dateEndTime:'',
                dateValue:'',
                isOpen: false,
                isOpen1: false,
                is_show_order_time: false,
                is_show_area: false,
                unit_gage:'',
                per_one_order:0,
                config_customization:{life_tools:-1,is_grapefruit_prepaid:0},
                bill_create_set_tmp:0,
            }
        },
        mounted() {
        },
        methods: {
            add(key) {
                console.log('room_id',key)
                this.key=key;
                this.visible = true;
                this.rule_id= '';
                this.expires='';
                this.cycle='';
                this.custom_value='';
                this.project_id=''
                this.rule_list = []
                this.ruleDetailShow= false;
                this.is_show_order_time= false;
                this.is_show_area= false;
                this.unit_gage='';
                this.per_one_order=0;
                this.bill_create_set_tmp=0;
                this.getConfigCustomization();
                this.ChargeProjectLists();
            },
            getConfigCustomization () {
              this.request(villageApi.getConfigCustomization).then(res => {
                console.log('+++++++', res)
                if (res) {
                  this.config_customization = res
                }
              })
            },
            handleChange(value) {
                this.is_input=false
                if (value==2){
                    this.post.refund_money=this.pay_money
                    this.is_input=true
                }
            },
            handleSubmit() {
                let end_time = ''
                if (this.dateEndTime) {
                    const d = new Date(this.dateEndTime)
                    end_time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
                }
                let start_time = ''
                if (this.dateValue) {
                    const d = new Date(this.dateValue)
                    console.log('dateEndTime22',d)
                    start_time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
                }
                if (this.rule_id === '请选择消费标准' || this.rule_id === '') {
                    this.$message.error('请选择消费标准')
                    return false
                }
                if (this.expires=== '0'){
                    this.$message.error('缴费时效不能为0')
                    return false
                }
                if (this.cycle=== '0'){
                    this.$message.error('收费周期不能为0')
                    return false
                }
                console.log('cycle111',this.cycle);
                console.log('expires111',this.expires);
                this.request(villageApi.quickCall, {
                    project_id: this.project_id,
                    rule_id: this.rule_id,
                    end_time: end_time,
                    start_time: start_time,
                    expires: this.expires,
                    key: this.key,
                    custom_value:this.custom_value,
                    cycle: this.cycle,
                    per_one_order:this.per_one_order
                }).then((res) => {
                    this.$message.success('添加成功')
                    this.visible = false
                    this.rule_id = ''
                    this.project_id=''
                    this.rule_list = []
                    this.ruleDetail = []
                    this.ruleLateDetail = []
                    this.ruleDetailShow = false
                    this.is_cycle = false;
                    this.cycle_set='';//周期单位
                    this.cycle='';//缴费周期
                    this.custom_value='';//缴费周期
                    this.$emit('ok');
                })

            },
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.rule_id = ''
                    this.project_id=''
                    this.ruleDetail = []
                    this.ruleLateDetail = []
                    this.ruleDetailShow = false
                    this.is_cycle = false;
                    this.cycle_set='';//周期单位
                    this.cycle='';//缴费周期
                    this.custom_value='';//缴费周期
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            // 消费标准信息
            RuleInfo (rule_id) {
                let end_time = ''
                if (this.dateEndTime) {
                    const d = new Date(this.dateEndTime)
                    console.log('dateEndTime22',d)
                    end_time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
                }
                let start_time = ''
                if (this.dateValue) {
                    const d = new Date(this.dateValue)
                    start_time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
                }
                console.log('start_time',start_time)
                this.bill_create_set_tmp=0;
                this.request(villageApi.getQuickRuleInfo, {
                    rule_id: rule_id,
                    cycle: this.cycle,
                    custom_value:this.custom_value,
                    start_time: start_time,
                    end_time: end_time,
                    key:this.key
                }).then((res) => {
                    console.log('RuleInfo=============', res)
                    
                    if (res.fees_type == 2 && res.unit_gage != ''){
                        this.is_show_area = true 
                    } else {
                        this.is_show_area = false
                    }
                    if (res.charge_type == 1 || res.order_type == 'water' || res.order_type == 'electric' || res.order_type == 'gas')
                    { this.is_show_order_time = false } else { this.is_show_order_time = true }
                    if (this.is_cycle) {
                        this.bill_create_set_tmp=res.bill_create_set;
                        if (res.bill_create_set == 1) {
                            this.cycle_set = '日'
                        } else if (res.bill_create_set == 2) {
                            this.cycle_set = '月'
                        } else {
                            this.cycle_set = '年'
                        }
                    }
                    this.unit_gage = res.unit_gage
                    this.valid_time = res.charge_valid_time1
                    this.contract_time_end = res.contract_time_end
                    this.date_status = 'date'
                    this.date_endTime='date'
                    this.dateFormat = 'YYYY-MM-DD'
                    this.dateEndTime=res.end_time
                    this.dateValue=res.start_time
                    this.ruleDetailShow = true
                    this.ruleDetail = res.ruleList
                    this.ruleLateDetail = res.ruleLateList
                })
            },
            // 收费项目对应的标准列表
            ChargeRuleLists (charge_project_id) {
                this.request(villageApi.ChargeRuleLists, {
                    charge_project_id: charge_project_id
                }).then((res) => {
                    console.log('ChargeRuleLists', res)
                    this.rule_list = res
                })
            },
            projectChange (value) {
                this.request(villageApi.ProjectInfo, {
                    id: value
                }).then((res) => {
                    this.cycle_set = ''
                    if (res.type == 2) {
                        this.is_cycle = 1
                    } else {
                        this.is_cycle = 0
                    }
                })
                this.project_id = value
                this.rule_list = []
                this.rule_id = '请选择消费标准'
                this.ruleDetailShow = false
                this.ruleDetail = []
                this.ruleLateDetail = []
                this.expires='';
                this.cycle='';
                this.dateEndTime=''
                this.ChargeRuleLists(value)
            },
            // 收费项目列表
            ChargeProjectLists () {
                this.request(villageApi.ChargeProjectLists, {

                }).then((res) => {
                    console.log('ChargeProjectLists', res)
                    this.project_list = res
                })
            },
            onOpenChange (status, type) {
                this[type] = status
            },
            cycleChange(){
                this.dateEndTime=''
                this.RuleInfo(this.rule_id)
            },
            unitGageChange(){
                this.dateEndTime=''
                this.RuleInfo(this.rule_id)
            },
            ruleChange (value) {
                this.rule_id = value
                this.dateValue = ''
                this.dateEndTime=''
                this.area_measure = ''
                this.expires='';
                this.cycle='';
                this.RuleInfo(value)
            },
            onChange (value) {
                console.log('change事件', value)
            },
            onChangeTime (date, dateString) {
                const d1 = dateString
                const d2 = this.valid_time
                const d3 = this.contract_time_end
                if ((new Date(d1.replace(/-/g, '/'))) < (new Date(d2.replace(/-/g, '/')))) {
                    this.$message.error('账单生效时间不能小于'+this.valid_time)
                    return false;
                }
                 console.log('d3', d3)
                 
                if ((new Date(d1.replace(/-/g, '/'))) > (new Date(d3.replace(/-/g, '/')))&&this.contract_time_end!=0) {
                    this.$message.error('账单生效时间不能大于'+this.contract_time_end)
                    return false;
                }
                this.dateValue = dateString
                this.cycleChange()
            },
            onChangeTime1(date, dateString) {
                console.log(dateString)
                const d1 = dateString
                const d2 = this.dateEndTime
                if ((new Date(d1.replace(/-/g, '/'))) < (new Date(d2.replace(/-/g, '/')))) {
                    this.$message.error('收费截止时间不能小于默认收费截止时间')
                    return false;
                }
                this.dateEndTime = date
                this.RuleInfo(this.rule_id)
            },
        },
    }
</script>

<style>
     /*公共样式*/
    .margin_top_10 {
        margin-top: 10px;
    }

    .margin_bottom_10 {
        margin-bottom: 10px;
    }

    .margin_top_20 {
        margin-top: 20px;
    }

    .margin_left_10 {
        margin-left: 10px;
    }
    .margin_left_8 {
        margin-left: 8px;
    }

    .flex_text_box {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 20px;
    }
</style>
