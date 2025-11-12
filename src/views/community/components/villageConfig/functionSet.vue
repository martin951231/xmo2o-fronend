<template>
    <div class="fuction_set">
        <a-form-model ref="ruleForm" :model="functionForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <!-- 注意样式排版 -->
            <div style="background-color: #ececec;">
                <a-row :gutter="[8,8]">
                    <a-col :span="12">
                        <a-card  :bordered="false"  >
                             <template slot="title">
                                 <a-icon type="pay-circle" /> 费用相关配置
                             </template>
                            <a-tooltip placement="top" v-if="$store.getters.config" :title="'设置物业服务'+$store.getters.config.house_name+'时间范围，设置后物业只能收取合同时间内收费项目，未到合同开始时间或结束时间不能收费；未设置物业服务'+$store.getters.config.house_name+'时间范围，则不影响。'" :get-popup-container="getPopupContainer">
                                <a-form-model-item label="合同时间" prop="contract_time">
                                    <!-- contract_time_start contract_time_end -->
                                    <a-range-picker @change="onChange" />
                                </a-form-model-item>
                            </a-tooltip>
                            <a-tooltip placement="top" title="选择预存时，用户端展示预存入口；选择预缴时，用户端展示预缴入口；选择预存、预缴时，用户端展示预存、预缴入口" :get-popup-container="getPopupContainer">
                            <a-form-model-item label="收费预存配置项" prop="design_parking_area"   extra="">
                                <a-radio-group v-model="functionForm.is_set_public_num" @change="onChange">
                                    <a-radio :value="1">预存</a-radio>
                                    <a-radio :value="2">预缴</a-radio>
                                    <a-radio :value="3">预存、预缴</a-radio>
                                </a-radio-group>
                            </a-form-model-item>
                            </a-tooltip>

                        </a-card>
                    </a-col>
                    <a-col :span="12">
                        <a-card   :bordered="false">
                            <template slot="title">
                                <a-icon type="tool" /> 硬件相关配置
                            </template>
                            <a-tooltip placement="top" title="开启后业主管理页面将会开启IC卡读写的功能。需要另外购买读IC卡硬件进行支持。" :get-popup-container="getPopupContainer">
                                <a-form-model-item label="IC卡云读写" extra="" prop="remark">
                                    <a-radio-group name="radioGroup" v-model="functionForm.write_iccard">
                                        <a-radio :value="1">开启</a-radio>
                                        <a-radio :value="2">关闭</a-radio>
                                    </a-radio-group>
                                </a-form-model-item>
                            </a-tooltip>

                            <a-tooltip placement="top" title="开启后业主管理页面将会开启身份证信息读取的功能。需要另外购买身份证阅读硬件进行支持。" :get-popup-container="getPopupContainer">
                            <a-form-model-item label="身份证云读取" extra="" prop="remark">
                                <a-radio-group name="radioGroup" v-model="functionForm.read_idcard">
                                    <a-radio :value="1">开启</a-radio>
                                    <a-radio :value="0">关闭</a-radio>
                                </a-radio-group>
                            </a-form-model-item>
                            </a-tooltip>
                            <a-tooltip placement="top" title="目前在人脸门禁部分型号及对接公安政务系统时需要使用到身份证号码，未来也会有更多的场景需要使用。若身份证号码未录入会导致这些功能无法正常使用。届时需要时需要自行进行二次收集，加大困难。请谨慎开启可选。" :get-popup-container="getPopupContainer">
                            <a-form-model-item label="身份证号填写设置" prop="set_id_code"
                                               extra="">
                                <a-radio-group v-model="functionForm.set_id_code" @change="onChange">
                                    <a-radio :value="1">强制填写</a-radio>
                                    <a-radio :value="2">可选填写</a-radio>
                                </a-radio-group>
                            </a-form-model-item>
                            </a-tooltip>

                        </a-card>
                    </a-col>

                </a-row>
                <a-row :gutter="[8,8]">
                    <a-col :span="12">
                        <a-card  :bordered="false">
                            <template slot="title">
                                <a-icon type="team" /> {{$store.getters.config.house_name}}安全配置
                            </template>

                            <a-tooltip placement="top" title="作用于装修申请单提交受理时间。" :get-popup-container="getPopupContainer">
                            <a-form-model-item label="办公时间" prop="work_time">
                                <a-time-picker :value="moment(functionForm.start_time, 'HH:mm:ss')" @change="onChange" /> ~
                                <a-time-picker :value="moment(functionForm.end_time, 'HH:mm:ss')" @change="onChange" />
                            </a-form-model-item>
                            </a-tooltip>

                            <a-tooltip placement="top" title="业主寻求帮助时联系物业的电话，只能填写一个联系方式。" :get-popup-container="getPopupContainer">
                            <a-form-model-item label="寻求帮助" prop="design_parking_area" extra="">
                                <a-input class="input_style_240" v-model="functionForm.design_parking_area" />
                            </a-form-model-item>
                            </a-tooltip>

                            <a-tooltip placement="top" title="业主一键报警时联系社区物业的电话，只能填写一个联系方式。" :get-popup-container="getPopupContainer">
                            <a-form-model-item label="业主一键报警" prop="touch_alarm_phone" extra="">
                                <a-input class="input_style_240" v-model="functionForm.touch_alarm_phone" />
                            </a-form-model-item>
                            </a-tooltip>

                            <a-tooltip placement="top" :title="'不是业主，是否能进入平台中'+$store.getters.config.house_name+'的页面。'" :get-popup-container="getPopupContainer">
                            <a-form-model-item label="允许游客访问" prop="tourist" extra="">
                                <a-radio-group v-model="functionForm.tourist" @change="onChange">
                                    <a-radio :value="1">允许</a-radio>
                                    <a-radio :value="0">禁止</a-radio>
                                </a-radio-group>
                            </a-form-model-item>
                            </a-tooltip>
                            <a-tooltip placement="top" :title="'限制时间即表示用户在查看'+$store.getters.config.house_name+'视频监控时限制日期、时间，不限制时间即表示用户在查看'+$store.getters.config.house_name+'视频监控时限制日期、时间。'" :get-popup-container="getPopupContainer">
                            <a-form-model-item label="视频监控设置" prop="is_limit_date"
                                               extra="">
                                <a-radio-group v-model="functionForm.is_limit_date" @change="onChange">
                                    <a-radio :value="1">限制时间</a-radio>
                                    <a-radio :value="0">不限制时间</a-radio>
                                </a-radio-group>
                            </a-form-model-item>
                            </a-tooltip>

                            <a-tooltip placement="top" title="开启定位功能，在巡检任务的时候显示定位功能图标。" :get-popup-container="getPopupContainer">
                            <a-form-model-item label="智慧巡检码设置" prop="is_xunjian_position" extra="">
                                <a-radio-group v-model="functionForm.is_xunjian_position" @change="onChange">
                                    <a-radio :value="1">开启自动定位功能</a-radio>
                                    <a-radio :value="0">关闭自动定位功能</a-radio>
                                </a-radio-group>
                            </a-form-model-item>
                            </a-tooltip>
                        </a-card>
                    </a-col>
                    <a-col :span="12">
                        <a-card  :bordered="false">
                            <template slot="title">
                                <a-icon type="notification" /> 工单报修、通知配置
                            </template>

                            <a-tooltip placement="top" title="自行抢单：业主发布了投诉或报修时，工作人员自行抢接这个任务；分配指定：业主发布了投诉或报修时，由平台直接分发给某个特定的工作人员。" :get-popup-container="getPopupContainer">
                            <a-form-model-item label="接任务类型" prop="handle_type"
                                               extra="">
                                <a-radio-group v-model="functionForm.handle_type" @change="onChange">
                                    <a-radio :value="1">自动抢单</a-radio>
                                    <a-radio :value="0">分配指定</a-radio>
                                </a-radio-group>
                            </a-form-model-item>
                            </a-tooltip>


                            <a-tooltip placement="top" title="业主发布了投诉或报修后多少小时内没有工作人员接任务，则由平台指定给特定的工作人员。" :get-popup-container="getPopupContainer">
                            <a-form-model-item label="超时指定的时间" prop="hour" extra="">
                                <a-input-number id="inputNumber" v-model="functionForm.hour" :min="1" :max="24" @change="onChange" />小时
                            </a-form-model-item>
                            </a-tooltip>

                            <a-tooltip placement="top" title="及时率是计算工作人员接单到结单的时间，工单类目设置时间为30分钟，在该时间内结单算正常，超过时间算问题工单。" :get-popup-container="getPopupContainer">
                            <a-form-model-item label="新版工单及时率" prop="is_timely"
                                               extra="">
                                <a-radio-group v-model="functionForm.is_timely" @change="onChange">
                                    <a-radio :value="1">启用</a-radio>
                                    <a-radio :value="0">禁用</a-radio>
                                </a-radio-group>
                            </a-form-model-item>
                            </a-tooltip>

                            <a-tooltip placement="top" title="自动抢单功能，是指对工单类别，没有绑定负责人或不在负责人处理时间的情况下，业主发布工单时工作人员自行抢接这个任务;例:投诉工单或报修工单。" :get-popup-container="getPopupContainer">
                            <a-form-model-item label="新版工单自动抢单" prop="is_grab_order"
                                               extra="">
                                <a-radio-group v-model="functionForm.is_grab_order" @change="onChange">
                                    <a-radio :value="1">启用</a-radio>
                                    <a-radio :value="0">禁用</a-radio>
                                </a-radio-group>
                            </a-form-model-item>
                            </a-tooltip>

                            <a-tooltip placement="top" title="业主发布工单多少小时内没有工作人员接任务，则由平台指定给特定的工作人员;例:投诉工单或报修工单。" :get-popup-container="getPopupContainer">
                            <a-form-model-item label="超时指定的时间" prop="hour" extra="">
                                <a-input-number id="inputNumber" v-model="functionForm.hour" :min="1" :max="24" @change="onChange" />小时
                            </a-form-model-item>
                            </a-tooltip>


                        </a-card>
                    </a-col>

                </a-row>
                <a-row :gutter="[8,8]">
                    <a-col :span="12">
                        <a-card  :bordered="false">
                            <template slot="title">
                                <a-icon type="windows" /> 功能启用配置
                            </template>

                            <a-tooltip placement="top" title="开通后，请重新配置可视化页面。" :get-popup-container="getPopupContainer">
                            <a-form-model-item label="可视化页面类型" prop="visualization_page_type" extra="">
                                <a-radio-group v-model="functionForm.visualization_page_type" @change="onChange">
                                    <a-radio :value="1">新版可视化页面</a-radio>
                                    <a-radio :value="0">老版可视化页面</a-radio>
                                </a-radio-group>
                            </a-form-model-item>
                            </a-tooltip>

                            <a-tooltip placement="top" title="允许则已缴账单支持多种打印方式，打印编号为多个；不允许则已缴账单打印后，不支持其他打印方式，列表上打印按钮不可操作，打印编号是唯一值，且不会变。" :get-popup-container="getPopupContainer">
                            <a-form-model-item label="已缴账单打印多次" prop="print_number_times"
                                               extra="">
                                <a-radio-group v-model="functionForm.print_number_times" @change="onChange">
                                    <a-radio :value="1">允许</a-radio>
                                    <a-radio :value="0">不允许</a-radio>
                                </a-radio-group>
                            </a-form-model-item>
                            </a-tooltip>

                            <a-tooltip placement="top" title="" :get-popup-container="getPopupContainer">
                            <a-form-model-item label="催缴通知方式" prop="urge_notice_type">
                                <a-radio-group v-model="functionForm.urge_notice_type" @change="onChange">
                                    <a-radio :value="1">短信通知</a-radio>
                                    <a-radio :value="2">微信模板通知</a-radio>
                                    <a-radio :value="3">短信和微信模板通知</a-radio>
                                </a-radio-group>
                            </a-form-model-item>
                            </a-tooltip>

                            <a-tooltip placement="top" title="开通后，功能库中的 社区活动 功能可正常使用" :get-popup-container="getPopupContainer">
                            <a-form-model-item label="社区活动" prop="has_activity" extra="">
                                <a-radio-group v-model="functionForm.has_activity" @change="onChange">
                                    <a-radio :value="1">开启</a-radio>
                                    <a-radio :value="0">关闭</a-radio>
                                </a-radio-group>
                            </a-form-model-item>
                            </a-tooltip>

                            <a-tooltip placement="top" title="为业主可及时收到重要通知，提高新闻群发的送达率，可设置业主申请入住时是否需要关注公众号" :get-popup-container="getPopupContainer">
                            <a-form-model-item label="公众号关注设置" prop="is_set_public_num"
                                               extra="">
                                <a-radio-group v-model="functionForm.is_set_public_num" @change="onChange">
                                    <a-radio :value="1">强制关注</a-radio>
                                    <a-radio :value="2">可选关注</a-radio>
                                    <a-radio :value="3">无需关注</a-radio>
                                </a-radio-group>
                            </a-form-model-item>
                            </a-tooltip>

                            <a-tooltip placement="top" title="【新/老版工单】：默认为启用当前配置，启用后，后台新/老版工单的入口都展示，管理端也展示新/老版工单入口，老版工单后台支持创建工单；【新版工单】：启用当前配置时，老版工单的后台/管理端入口不展示。只展示新版工单；【新/版工单清晰版】：启用当前配置时，展示后台的新/老版工单入口（老版工单不能创建工单，只允许查看已有的工单数据），管理端只展示新版工单入口，老版不展示。" :get-popup-container="getPopupContainer">
                            <a-form-model-item label="新/老版工单启用" prop="works_order_switch"
                                               extra="">
                                <a-radio-group v-model="functionForm.works_order_switch" @change="onChange">
                                    <a-radio :value="0">新/老版工单</a-radio>
                                    <a-radio :value="1">新版工单</a-radio>
                                    <a-radio :value="2">新/版工单清晰版</a-radio>
                                </a-radio-group>
                            </a-form-model-item>
                            </a-tooltip>

                            <a-tooltip placement="top" title="默认启用新/老版停车，启用新/老版停车时，新/老版的智慧停车模块都显示；启用新版停车时，老版智慧停车入口隐藏（车位管理、车辆管理、“智能硬件-智慧停车“功能）" :get-popup-container="getPopupContainer">
                            <a-form-model-item label="新/老版停车配置" prop="park_new_switch"
                                               extra="">
                                <a-radio-group v-model="functionForm.park_new_switch" @change="onChange">
                                    <a-radio :value="1">启用新版停车</a-radio>
                                    <a-radio :value="2">启用新/老版停车</a-radio>
                                </a-radio-group>
                            </a-form-model-item>
                            </a-tooltip>
                        </a-card>
                    </a-col>
                    <a-col :span="12">
                        <a-card :bordered="false">
                            <template slot="title">
                                <a-icon type="unlock" /> 其他配置
                            </template>
                        </a-card>
                    </a-col>

                </a-row>
            </div>


            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="onSubmit">保存</a-button>
                <a-button style="margin-left: 10px;" @click="resetForm">重置</a-button>
            </a-form-model-item>

        </a-form-model>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {
        ref,
        reactive,
        onMounted,
        defineComponent
    } from '@vue/composition-api';
    import moment from 'moment';

    export default defineComponent({
        name: 'functionSet',
        setup(props, context) {
            let functionForm = ref({})
            const labelCol = ref({
                span: 4
            })
            const wrapperCol = ref({
                span: 14
            })
            let ruleForm = ref(null)
            const rules = reactive({})

            const onSubmit = () => {
                Vue.prototype.$confirm({
                    title: '提示',
                    content: '确定要保存此表单内容吗？',
                    onOk() {
                        ruleForm.value.validate(valid => {
                            if (valid) {
                                saveForm()
                            }
                        })
                    },
                    onCancel() {},
                });
            }
            const resetForm = () => {
                baseSetForm.value = {}
                ruleForm.value.resetFields()
            }
            const saveForm = () => {
                Vue.prototype.request('/community/village_api.VillageConfig/villageInfoUpdate', baseSetForm
                    .value).then((res) => {
                    Vue.prototype.$message.success('保存成功！')
                })
            }

            const onChange = (value) => {
                console.log(value)
            }

            onMounted(() => {

            })

            return {
                functionForm,
                labelCol,
                wrapperCol,
                ruleForm,
                rules,
                onSubmit,
                resetForm,
                saveForm,
                onChange,
                moment,
            }
        }
    })
</script>

<style lang="less" scoped>
    .fuction_set {
        width: 100%;

        .input_style_240 {
            width: 360px;
        }
    }

</style>
