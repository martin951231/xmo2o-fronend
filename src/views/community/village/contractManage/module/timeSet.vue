<template>
    <a-modal
        title="合同到期提醒设置"
        :width="600"
        :visible="visible"
        @ok="handleOk"
        :confirm-loading="confirmLoading"
        @cancel="handleCancel">
        <div class="set_con">
            <div class="form_item">
                <span>合同到期前：</span>
                <a-input-number style="width: 150px; margin: 0 5px;" v-model="expire_to_report_day" :min="0" />
                <span>天给工作人员推送消息</span>
            </div>
            <div class="desc">默认0天，不需要给工作人员发送短信提醒或站内信息。设置到期前**天08:30给小区工作人员推送合同到期通知</div>
        </div>
    </a-modal>
</template>

<script>
    export default{
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        
        watch: {
            visible: {
                handler(val){
                    if(val){
                        this.getConfig()
                    }
                }
            }
        },
        
        data(){
            return{
                confirmLoading: false,
                expire_to_report_day: 0
            }
        },
        
        methods: {
            handleOk(){
                this.confirmLoading = true
                this.request('/community/platform.contract.Index/setConfig', {expire_to_report_day: this.expire_to_report_day}).then(res=>{
                    this.confirmLoading = false
                    this.$message.success('设置成功！')
                    this.expire_to_report_day = 0
                    this.$emit('close')
                }).catch(err=> {
                    this.confirmLoading = false
                })
            },
            
            handleCancel(){
                this.expire_to_report_day = 0
                this.$emit('close')
            },
            
            getConfig(){
                this.request('/community/platform.contract.Index/getConfig').then(res=> {
                    this.expire_to_report_day = res.config.expire_to_report_day
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .set_con{
        padding: 20px;
        .form_item{
            display: flex;
            align-items: center;
        }
        .desc{
            color: #999;
            margin-top: 7px;
        }
    }
</style>