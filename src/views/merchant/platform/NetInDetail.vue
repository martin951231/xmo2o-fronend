<template>
  <div class="content">
    <!-- 入网信息 -->
    <a-descriptions :title="''" bordered v-if="info">
      <a-descriptions-item :label="L('子商户名称')"> {{ info.userName }} </a-descriptions-item>
      <a-descriptions-item :label="L('子商户手机号')"> {{ info.phone }} </a-descriptions-item>
      <a-descriptions-item :label="L('子商户类型')"> {{ form_value_name.userType_name }} </a-descriptions-item>
      <a-descriptions-item :label="L('身份证号码')"> {{ info.certId }} </a-descriptions-item>
      <a-descriptions-item :label="L('经营范围')" :span="2">
        {{ info.businessScope }}
      </a-descriptions-item>
      <a-descriptions-item :label="L(' 审核状态')" :span="3">
        <a-badge v-if="info.audit_state == 0" status="processing" text="审核中" />
        <a-badge v-if="info.audit_state == 1" status="success" text="审核通过" />
        <a-badge v-if="info.audit_state == 2" status="error" text="审核失败" />
      </a-descriptions-item>
      <a-descriptions-item :label="L(' 统一社会信用码')"> {{ info.socialCreditCode }} </a-descriptions-item>
      <a-descriptions-item :label="L(' 统一社会信用证有效期')"> {{ info.socialCreditCodeExpires }} </a-descriptions-item>
      <a-descriptions-item :label="L(' 法人身份证有效期')"> {{ info.certIdExpires }}</a-descriptions-item>
      <a-descriptions-item :label="L(' 法人姓名')"> {{ info.legalPerson }}</a-descriptions-item>
      <a-descriptions-item :label="L(' 法人手机号')"> {{ info.legalPhone }}</a-descriptions-item>
      <a-descriptions-item :label="L(' 企业地址')"> {{ info.address }}</a-descriptions-item>
      <a-descriptions-item :label="L(' 省份编码')"> {{ info.provCode }}</a-descriptions-item>
      <a-descriptions-item :label="L(' 地区编码')"> {{ info.areaCode }}</a-descriptions-item>
      <a-descriptions-item :label="L(' 附件编号')"> {{ info.fileNo }}</a-descriptions-item>
      <a-descriptions-item :label="L(' 银行卡户名')"> {{ info.cardName }}</a-descriptions-item>
      <a-descriptions-item :label="L(' 银行卡号')"> {{ info.cardNo }}</a-descriptions-item>
      <a-descriptions-item :label="L(' 银行账户类型')"> {{ form_value_name.bankAcctType_name }}</a-descriptions-item>
      <a-descriptions-item :label="L(' 开户银行名称')"> {{ info.bankName }}</a-descriptions-item>
      <a-descriptions-item :label="L(' 银行编码')"> {{ info.bankCode }}</a-descriptions-item>
      <a-descriptions-item :label="L(' 账户开户银行所在省份编码')"> {{ info.bankProvCode }}</a-descriptions-item>
      <a-descriptions-item :label="L(' 账户开户银行所在地区编码')"> {{ info.bankAreaCode }}</a-descriptions-item>
    </a-descriptions>
  </div>
</template>
  
<script>
import merchantPlatformApi from '@/api/merchant/platform/index'
export default {
  data() {
    return {
      query: '',
      info: '',
      userTypeList: [
        { text: '小微', value: 0 },
        { text: '个体工商户', value: 1 },
        { text: '企业', value: 2 },
      ],
      bankAcctTypeList: [
        { text: '对公', value: 1 },
        { text: '对私', value: 2 },
      ],
      form_value_name: {}
    }
  },
  created() {
    this.query = this.$route.query
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.request(merchantPlatformApi.getMerchantYibaoInfo, { mer_id: this.query.mer_id }).then((res) => {
        this.info = res
        this.form_value_name['userType_name'] = this.userTypeList.find((v) => v.value == res.userType).text
        this.form_value_name['bankAcctType_name'] = this.bankAcctTypeList.find((v) => v.value == res.bankAcctType).text
      })
    },
  },
}
</script>
  <style scoped lang="less">
</style>