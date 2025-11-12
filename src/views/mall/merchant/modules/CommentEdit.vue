<template>
  <a-modal :title="title" :width="840" :height="640" :visible="visible" @cancel="handleCancel" :footer="null">
    <a-form-model :model="formData" :rules="rules" ref="form">
      <a-form-model-item prop="merchant_reply_content">
        <a-textarea
          v-model="formData.merchant_reply_content"
          placeholder="请输入内容"
          :auto-size="{ minRows: 6, maxRows: 10 }"
          :disabled="type == 2 ? true : false"
        />
      </a-form-model-item>
      <a-form-model-item v-if="type == 1">
        <a-row type="flex" justify="center" align="top">
          <a-col :span="8">
            <a-row type="flex" justify="center" align="top">
              <a-col :span="4"></a-col>
              <a-col :span="4">
                <a-button  @click="handleCancel()"> 取消 </a-button>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-button type="primary" @click="handleSubmit()"> 确定 </a-button>
          </a-col>
        </a-row>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import mallMerchantApi from '@/api/mall/merchant/index'

export default {
  data() {
    return {
      title: '回复评价',
      visible: false,
      rpl_id:'',
      type:1,//1回复评价 2查看评价
      // 表单数据
      formData: {
        merchant_reply_content:'',
      },
      form: this.$form.createForm(this),
      rules: {
        merchant_reply_content: [{ required: true, message: '输入内容不能为空', trigger: 'blur' }],
      },
    }
  },
  methods: {
    //回复评价
    addComment(id) {
      this.visible = true
      this.rpl_id = id
      this.type = 1
      this.$set(this.formData, 'merchant_reply_content', '')
    },
    //查看回复
    showComment(id) {
      this.visible = true
      this.rpl_id = id
      this.type = 2
      this.request(mallMerchantApi.getReplyDetails, {rpl_id:this.rpl_id}).then((res) => {
        this.$set(this.formData, 'merchant_reply_content', res.merchant_reply_content)
      })
    },
    handleSubmit() {
      if (this.formData.merchant_reply_content == '') {
        this.$message.error('评论内容不能为空')
        return
      }
      let params = {rpl_id: this.rpl_id, merchant_reply_content: this.formData.merchant_reply_content}
      this.request(mallMerchantApi.addComment, params).then((res) => {
        this.$message.success('提交成功！')
        this.visible = false
        this.$emit('loadRefresh');
      })
    },
    handleCancel() {
      this.$refs.form.clearValidate(['merchant_reply_content'])
      this.visible = false
    },
  }
}
</script>
<style scoped lang="less">
</style>
