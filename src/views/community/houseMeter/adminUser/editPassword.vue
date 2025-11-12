<template>
  <div class="account-community-config-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
          <a-form-item
            label="原密码"
          >
            <a-input  type="password" style="color:#333333;width: 40%" v-model="pwd.old_password"/>
          </a-form-item>

          <a-form-item
            label="新密码"
          >
            <a-input  type="password" style="color:#333333;width: 40%" v-model="pwd.new_password"/> 不修改密码请留空，最少6个字符
          </a-form-item>

          <a-form-item
            label="确认密码"
          >
            <a-input  type="password" style="color:#333333;width: 40%" v-model="pwd.confirm_password"/> 请再输入一次上面的新密码，以便确认输入对了
          </a-form-item>

          <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
            <a-button type="primary" html-type="submit" :loading="loginBtn">
              确定
            </a-button>
          </a-form-item>

        </a-form>

      </a-col>
    </a-row>
  </div>
</template>
<script>
  import configHouseMeterApi from '@/api/community/houseMeter'

  export default {
    name: 'houseMeterAdminUserEditPassword',
    data() {
      return {
        form: this.$form.createForm(this),
        pwd: {
          'old_password': '',
          'new_password': '',
          'confirm_password': '',
        },
      }
    },

    methods: {

      handleSubmit(e) {
        e.preventDefault()
        const {
          form: {validateFields}
        } = this
        const pwd = this.pwd
        const indexParams={}
        indexParams.old_password = pwd.old_password
        indexParams.new_password = pwd.new_password
        indexParams.confirm_password = pwd.confirm_password
        this.request(configHouseMeterApi.passwordEdit, indexParams)
          .then((res) => {
            console.log('res', res)
            if (res) {
              this.$message.success('更新成功！');
            }
            this.loginBtn = false;
          }).catch((error) => {
          this.loginBtn = false;
        })
      },

    getPopupContainer(trigger) {
      return trigger.parentElement;
    }
    ,
    handleAreaClick(e, label, option) {
      e.stopPropagation();
      console.log('clicked', label, option);
    }
    ,

  }
  }
</script>

<style lang="less" scoped>
  .account-community-config-info-view {
    margin: 30px 20px;
    background-color: white;
    padding: 30px;
  }

  .imgname {
    width: 80px;
  }
</style>