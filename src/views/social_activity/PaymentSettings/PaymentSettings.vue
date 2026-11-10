<template>
  <div class="payment-settings">
    <a-card title="支付配置" :bordered="false">
      <a-spin :spinning="loading">
        <a-tabs
          v-if="villageList.length"
          :active-key="activeVillageKey"
          tab-position="left"
          @change="handleVillageChange"
        >
          <a-tab-pane
            v-for="item in villageList"
            :key="String(item.village_id)"
            :tab="item.village_name"
          >
            <a-form-model
              v-if="activeVillageKey === String(item.village_id)"
              ref="formRef"
              :model="formData"
              :rules="rules"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 10 }"
            >
              <a-form-model-item label="开启状态" prop="status">
                <a-switch
                  v-model="formData.status"
                  :checked-value="1"
                  :un-checked-value="0"
                  checked-children="开启"
                  un-checked-children="关闭"
                />
              </a-form-model-item>

              <a-form-model-item label="AppID" prop="app_id">
                <a-input
                  v-model.trim="formData.app_id"
                  :max-length="100"
                  placeholder="请输入 AppID"
                />
              </a-form-model-item>

              <a-form-model-item label="商户号" prop="merchant_no">
                <a-input
                  v-model.trim="formData.merchant_no"
                  :max-length="100"
                  placeholder="请输入商户号"
                />
              </a-form-model-item>

              <a-form-model-item label="通联私钥" prop="private_key">
                <a-textarea
                  v-model="formData.private_key"
                  :rows="8"
                  placeholder="请输入通联私钥"
                />
              </a-form-model-item>

              <a-form-model-item :wrapper-col="{ span: 10, offset: 4 }">
                <a-button
                  v-saction:save
                  type="primary"
                  :loading="submitting"
                  @click="handleSubmit"
                >
                  保存
                </a-button>
              </a-form-model-item>
            </a-form-model>
          </a-tab-pane>
        </a-tabs>
        <a-empty v-else-if="!loading" description="暂无小区" />
      </a-spin>
    </a-card>
  </div>
</template>

<script>
import socialActivityApi from '@/api/social_activity/index'

const defaultFormData = () => ({
    status: 0,
    app_id: '',
    merchant_no: '',
    private_key: ''
})

export default {
    name: 'PaymentSettings',
    data () {
        return {
            loading: false,
            submitting: false,
            villageList: [],
            activeVillageKey: '',
            configRequestId: 0,
            formData: defaultFormData(),
            rules: {
                status: [{ required: true, message: '请选择开启状态', trigger: 'change' }],
                app_id: [{ required: true, whitespace: true, message: '请输入 AppID', trigger: 'blur' }],
                merchant_no: [{ required: true, whitespace: true, message: '请输入商户号', trigger: 'blur' }],
                private_key: [{ required: true, whitespace: true, message: '请输入通联私钥', trigger: 'blur' }]
            }
        }
    },
    created () {
        this.getVillageList()
    },
    methods: {
        getVillageList () {
            this.loading = true
            this.request(socialActivityApi.getVillageList, {})
                .then((res) => {
                    this.villageList = Array.isArray(res) ? res : []
                    if (!this.villageList.length) {
                        this.formData = defaultFormData()
                        return
                    }

                    this.activeVillageKey = String(this.villageList[0].village_id)
                    return this.getConfig(this.villageList[0].village_id)
                })
                .finally(() => {
                    this.loading = false
                })
        },
        getConfig (villageId) {
            const requestId = ++this.configRequestId
            this.loading = true
            return this.request(socialActivityApi.getPayConfig, {
                village_id: villageId
            })
                .then((res) => {
                    if (requestId !== this.configRequestId) {
                        return
                    }

                    const config = res || {}
                    this.formData = {
                        status: Number(config.status) === 1 ? 1 : 0,
                        app_id: config.app_id || '',
                        merchant_no: config.merchant_no || '',
                        private_key: config.private_key || ''
                    }
                })
                .finally(() => {
                    if (requestId === this.configRequestId) {
                        this.loading = false
                    }
                })
        },
        handleVillageChange (villageKey) {
            this.activeVillageKey = villageKey
            this.formData = defaultFormData()
            this.getConfig(this.getCurrentVillageId())
        },
        getCurrentVillageId () {
            const village = this.villageList.find(item => String(item.village_id) === this.activeVillageKey)
            return village ? village.village_id : ''
        },
        handleSubmit () {
            const formRef = Array.isArray(this.$refs.formRef)
                ? this.$refs.formRef[0]
                : this.$refs.formRef

            if (!formRef) {
                return
            }

            formRef.validate((valid) => {
                if (!valid) {
                    return
                }

                this.submitting = true
                this.request(socialActivityApi.savePayConfig, {
                    ...this.formData,
                    village_id: this.getCurrentVillageId()
                })
                    .then(() => {
                        this.$message.success('保存成功')
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
.payment-settings {
    margin: 10px 0;

    ::v-deep .ant-card-body {
        padding: 24px;
    }

    ::v-deep .ant-tabs-left-bar {
        min-width: 180px;
        max-width: 280px;
    }

    ::v-deep .ant-tabs-left .ant-tabs-tab {
        overflow: hidden;
        text-align: left;
        text-overflow: ellipsis;
    }
}
</style>
