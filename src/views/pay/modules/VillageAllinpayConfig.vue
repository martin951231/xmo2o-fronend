<template>
  <a-card
    :bordered="false"
    :loading="loading"
    :tabList="villageTabs"
    :activeTabKey="activeVillageKey"
    @tabChange="handleVillageChange"
  >
    <a-empty v-if="!loading && !villageList.length" description="当前物业下暂无小区" />
    <a-form v-else :form="form" class="allinpay-form" @submit="handleSubmit">
      <a-form-item label="开启状态" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
        <a-switch
          v-decorator="['status', { valuePropName: 'checked', rules: [{ required: true, message: '请选择开启状态' }] }]"
          checkedChildren="开启"
          unCheckedChildren="关闭"
        />
      </a-form-item>
      <a-form-item label="AppID" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="['appid', { rules: [{ required: true, whitespace: true, message: '请输入 AppID' }] }]"
          placeholder="请输入 AppID"
        />
      </a-form-item>
      <a-form-item label="商户号" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="['mchid', { rules: [{ required: true, whitespace: true, message: '请输入商户号' }] }]"
          placeholder="请输入商户号"
        />
      </a-form-item>
      <a-form-item label="通联私钥" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-button
          class="generate-key-button"
          htmlType="button"
          icon="key"
          :loading="generatingKey"
          @click="generatePrivateKey"
        >
          生成私钥
        </a-button>
        <a-textarea
          v-decorator="[
            'private_key',
            { rules: [{ required: true, whitespace: true, message: '请输入通联私钥' }] },
          ]"
          :rows="6"
          placeholder="请输入 allinpay_private_key"
        />
      </a-form-item>
      <a-form-item :wrapperCol="submitWrapperCol">
        <a-button type="primary" htmlType="submit" :loading="submitting">提交</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import payPropertyApi from '@/api/pay/property'

export default {
  name: 'VillageAllinpayConfig',
  data () {
    return {
      form: this.$form.createForm(this),
      loading: false,
      submitting: false,
      generatingKey: false,
      villageList: [],
      activeVillageKey: '',
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
      submitWrapperCol: { span: 10, offset: 7 }
    }
  },
  computed: {
    villageTabs () {
      return this.villageList.map((item) => ({
        key: String(item.village_id),
        tab: item.village_name
      }))
    },
    activeVillage () {
      return this.villageList.find((item) => String(item.village_id) === this.activeVillageKey)
    }
  },
  mounted () {
    this.getConfigList()
  },
  methods: {
    getConfigList () {
      this.loading = true
      this.request(payPropertyApi.getVillageAllinpayConfig)
        .then((res) => {
          this.villageList = res || []
          if (this.villageList.length) {
            this.activeVillageKey = String(this.villageList[0].village_id)
          }
        })
        .finally(() => {
          this.loading = false
          if (this.villageList.length) {
            this.setFormValues()
          }
        })
    },
    handleVillageChange (key) {
      this.activeVillageKey = String(key)
      this.setFormValues()
    },
    setFormValues () {
      this.$nextTick(() => {
        const config = this.activeVillage || {}
        this.form.setFieldsValue({
          appid: config.appid || '',
          mchid: config.mchid || '',
          private_key: config.private_key || '',
          status: Number(config.status) === 1
        })
      })
    },
    generatePrivateKey () {
      this.generatingKey = true
      this.request(payPropertyApi.generateAllinpayPrivateKey)
        .then((res) => {
          this.form.setFieldsValue({
            private_key: res.private_key
          })
          this.$message.success('私钥生成成功，请提交表单保存')
        })
        .finally(() => {
          this.generatingKey = false
        })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (err || !this.activeVillage) {
          return
        }
        this.submitting = true
        this.request(
          payPropertyApi.setVillageAllinpayConfig,
          {
            village_id: this.activeVillage.village_id,
            appid: values.appid.trim(),
            mchid: values.mchid.trim(),
            private_key: values.private_key.trim(),
            status: values.status ? 1 : 0
          },
          'post'
        )
          .then((res, msg) => {
            this.activeVillage.appid = values.appid.trim()
            this.activeVillage.mchid = values.mchid.trim()
            this.activeVillage.private_key = values.private_key.trim()
            this.activeVillage.status = values.status ? 1 : 0
            this.$message.success(msg || '保存成功')
          })
          .finally(() => {
            this.submitting = false
          })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.allinpay-form {
  padding-top: 32px;
}

.generate-key-button {
  display: block;
  margin-bottom: 12px;
}
</style>
