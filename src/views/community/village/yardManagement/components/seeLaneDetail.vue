<template>
    <div class="lane_model_container">
        <a-drawer :title="modelTitle" :width="900" :visible="visible" @close="handleSubCancel" :footer="null">
            <a-form-model ref="ruleForm" :model="laneForm" :label-col="labelCol"
                :wrapper-col="wrapperCol">
                <div class="add_lane">
                    <a-form-model-item label="通道名称">
                        <span>{{laneForm.passage_name}}</span>
                    </a-form-model-item>
                    <a-form-model-item label="所属车场">
                        <span>{{laneForm.garage_info.garage_num}}</span>
                    </a-form-model-item>
                    <a-form-model-item label="车场唯一编号">
                        <span>{{laneForm.garage_info.third_park_key}}</span>
                    </a-form-model-item>
                    <a-form-model-item label="通道号">
                         <span>{{laneForm.channel_number}}</span>
                    </a-form-model-item>
                    <a-form-model-item label="设备编号">
                        <span>{{laneForm.device_number}}</span><span v-if="laneForm.park_sys_type=='third_ai_park'">（控制机机号）</span>
                    </a-form-model-item>
                    <a-form-model-item label="车道编号">
                         <span>{{laneForm.veh_number}}</span>
                    </a-form-model-item>
                    <a-form-model-item label="通道类型" prop="passage_direction">
                         <span>{{laneForm.garage_info.passage_direction*1==1 ? '入口':'出口' }}</span>
                    </a-form-model-item>
                    <a-form-model-item label="设备MAC地址">
                        <span>{{laneForm.mac_address}}</span><span v-if="laneForm.park_sys_type=='third_ai_park'">（控制板IP）</span>
                    </a-form-model-item>
                    <a-form-model-item label="设备IP">
                        <span>{{laneForm.device_ip}}</span><span v-if="laneForm.park_sys_type=='third_ai_park'">（摄像机IP）</span>
                    </a-form-model-item>
                    <a-form-model-item label="通道状态">
                         <span>{{laneForm.garage_info.status*1==1 ? '开启':'关闭' }}</span>
                    </a-form-model-item>
                    <a-form-model-item label="岗亭编号">
                         <span>{{laneForm.park_param }}</span>
                    </a-form-model-item>
                    <a-form-model-item label="设备在线状态">
                         <span>{{laneForm.is_online_str }}</span>
                    </a-form-model-item>
                </div>

            </a-form-model>
        </a-drawer>

    </div>
</template>

<script>
    import moment from 'moment';
    import {slider} from 'ant-design-vue';
    import Vue from 'vue';
    Vue.use(slider)
    import {Transfer} from 'ant-design-vue';
    import villageApi from '@/api/community/village';
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            garage_id: {
                type: [String,Number],
                default: 0
            },
            passage_id: {
                type: [String,Number],
                default: 0
            },
        },
        
        watch:{
            visible: {
                immediate: true,
                handler(val){
                     this.getLaneInfo()
                }
            }
        },
        
        data() {
            return {
                labelCol: { span: 5 },
                wrapperCol: { span: 18 },
                laneForm: {
                    long_lat: '',
                    passage_area: '',
                    status: 1,
                    device_type:1,
                    passage_direction: 1,
                    passage_type: 1,
                    garage_id:'',
                    park_sys_type:'',
                    mac_address:'',
                    garage_info:{},
                },
                modelTitle:'',
            }
        },
        
        mounted(){

        },
        components: {
            'a-transfer': Transfer
        },

        methods: {
            clearForm(){
                this.laneForm = {
                    long_lat: '',
                    passage_area: undefined,
                    status: 1,
                    passage_direction: 1,
                    passage_type: 1,
                    garage_id:'',
                    park_sys_type:'',
                    mac_address:'',
                    garage_info:{},
                }
            },
            moment,

            handleSubCancel(e) {
                this.$emit('closeLane', false)
                this.clearForm()
            },
            
            getLaneInfo(){
                this.modelTitle='车道信息查看';
                let that = this
                if(that.passage_id){
                    that.request(villageApi.getPassageInfo, {id: this.passage_id}).then((res) => {
                        that.laneForm = res
                    })
                }
            },
        },
    }
</script>

<style lang="less" scoped>
    .form_title{
        font-size: 14px;
        font-weight: bold;
    }
    .ant-form-item{
            margin-bottom: 2px;
    }
    .form_line{
        height: 0.5px;
        width: 100%;
        background-color: #eeeeee;
        margin: 10px 0;
    }
    
    .generation_rules{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-top: 5px;
    }
    
    .footer_button{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
</style>
