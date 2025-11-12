<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10 h-800">
        <h1 style="font-size: 2rem;text-align: center;">微信小程序直播申请</h1>
        <a-steps :current="current_step" class="step-mt">
            <a-step title="资质申请" sub-title="" description="满足以下条件方可申请">

            </a-step>
            <a-step title="审核中" sub-title="" description="约1-7个工作日" >
            </a-step>

            <a-step title="审核结果" sub-title="" description="审核通过/驳回" />
        </a-steps>

        <div class="step-div" v-if="current_step==0">
            <p style="text-align: left;" class="title">申请条件<span style="font-weight:normal;font-size: 0.8rem;">(名额有限，先到先得)</span></p>
            <li style="text-align: left;padding: 10px;font-size: 1rem;" v-for="item in conditions">
                {{item.title}}
                <a-icon :title="item.tip" v-if="item.result=='success'" style="float: right;" type="check-circle" theme="twoTone" two-tone-color="#1890ff"/>
                <a-icon :title="item.tip" v-else style="float: right;" type="info-circle"  theme="twoTone" two-tone-color="#FAAD14"/>
            </li>

            <a-button v-if="wechat_mini_live_auth !=1" type="primary" disabled style="margin-top: 2rem;">平台已关闭小程序直播接入申请，恢复时间另行通知</a-button>
            <a-button v-else-if="can_submit_audit" type="primary" style="margin-top: 2rem;" @click="submitWechatLiveApply()">申请开通</a-button>
            <a-button v-else type="primary" disabled style="margin-top: 2rem;">暂不满足申请条件</a-button>
        </div>

        <div class="step-div" v-if="current_step==1">
            <img style="margin-bottom: 2rem;" src="@/assets/wechat_live/audit.png">
            <p class="title">申请提交成功，等待审核中</p>
            <p>审核结果将于7个工作日内完成，期间请留意消息中心通知。请耐心等待</p>
        </div>

        <div class="step-div" v-if="current_step==2">
          <div v-if="wechat_live_auth==2">
            <img style="margin-bottom: 2rem;" src="@/assets/wechat_live/audit_fail.png">
            <p class="title">平台禁播</p>
            <p>禁播原因：{{wechat_live_auth_message?wechat_live_auth_message:'无'}}</p>
          </div>

          <div v-else-if="audit_result==1">
            <img style="margin-bottom: 2rem;" src="@/assets/wechat_live/audit_success.png">
            <p class="title">审核通过</p>
            <a-button type="primary" style="margin-top: 2rem;" @click="goConsole()">进入直播控制台</a-button>
          </div>

          <div v-else>
            <img style="margin-bottom: 2rem;" src="@/assets/wechat_live/audit_fail.png">
            <p class="title">审核驳回</p>
            <p>驳回原因：{{audit_message?audit_message:'无'}}</p>
            <a-button type="primary" style="margin-top: 2rem;" @click="setStep(0)">重新申请</a-button>
          </div>
        </div>
        
    </div>
</template>

<script>
import LiveBroadcastMerchantApi from '@/api/liveBroadcast/merchant'

export default {
  data() {
    return {
      conditions:[],
      can_submit_audit:false, //是否满足条件提交申请
      current_step: 0,
      audit_result: 0,  //审核状态  1:审核通过  2：审核驳回
      audit_message:'', //审核信息，展示给用户看
      wechat_live_auth:0, //微信小程序直播权限  0：未开通   1：已开通  2：禁播，是指管理员人工操作
      wechat_live_auth_message:'', //直播权限变动原因
      wechat_mini_live_auth:0, //是否开启新商家接入申请  1：开启
    };
  },
  created() {
    this.getAuditInfo()
  },
  methods: {
    setStep(step){
        this.current_step = step;
    },
    //获取当前申请信息
    getAuditInfo(){
      let _this = this
      _this.request(LiveBroadcastMerchantApi.getAuditInfo, {}).then((res) => {
            _this.conditions = res.conditions;
            _this.current_step = res.current_step;
            _this.audit_result = res.audit_result;
            _this.audit_message = res.audit_message;
            _this.can_submit_audit = res.can_submit_audit;
            _this.wechat_live_auth = res.wechat_live_auth;
            _this.wechat_live_auth_message = res.wechat_live_auth_message;
            _this.wechat_mini_live_auth = res.wechat_mini_live_auth;

            //如果是直播审核通过直接跳转到控制台
            // if(_this.current_step == 2 && _this.wechat_live_auth !=2 && _this.audit_result == 1){
            //   _this.goConsole();
            // }
      })
    },
    //申请开通
    submitWechatLiveApply(){
      let _this = this
      _this.request(LiveBroadcastMerchantApi.submitWechatLiveApply, {}).then((res) => {
            _this.getAuditInfo();
      })
    },
    //跳转控制台
    goConsole(){
      this.$router.push({ path: '/liveBroadcast/merchant/liveCommodityList' })
    }
  }
};
</script>

<style scoped lang="less">
.h-800{
    height: 800px;
    padding: 3rem 5rem;
}

.step-mt{
    margin-top: 2.5rem;
}
.step-div{
    margin: 2.5rem 25%;
    width: 50%;
    padding: 3rem;
    text-align: center;
    border: 1px solid #ddd;
}
.title{
    color:#171a1c;
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: 32px;
    text-align: center;
}
</style>