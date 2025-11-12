<template>
  <a-modal  :width="400" :visible="visible" :footer="null" :maskClosable="false" :confirmLoading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800" style="margin-top: 30px;">
      <span> 点击【继续】后将为你打开新网页登录企业微信，请在完成登录后回到本页面进行后续操作</span>
      <div style="text-align: -webkit-center;">
        <a :href="goUrl" target="_blank" v-if="is_hide" type="primary" referrer="unsafe-url">
          <a-button key="console" type="primary" style="margin-top: 18px;"  @click="link">
            继续
          </a-button>
        </a>
      </div>
     
      <a-button key="console" type="primary" style="margin-top: 19px;margin-left: 125px;" v-if="is_show" @click="getNewMessage">
        已完成登录
      </a-button>
    </a-spin>
  </a-modal>
</template>

<script>
  import configHouseMeterApi from '@/api/community/houseMeter'
  import { getTokenName, setCookie } from '@/utils/util'
  import Vue from 'vue'
  import userApi from "@/api/user/community";
  export default {
    data() {
      return {
        is_show:false,
        is_hide:true,
        visible: false,
        confirmLoading: false,
        register_title:"注册",
        type:1,
        randomNumber:'',
        goUrl: '',
      }
    },
    methods: {
      add() {
        this.is_show=false
        this.is_hide=true
        this.visible = true
        this.type = 2
        this.register_title="注册"
        this.getUrl()
      },
      handleCancel() {
        this.visible = false
      },
      getUrl() {
        this.request(userApi.qyLogin)
          .then((res) => {
            if (res){
              console.log('res',res);
              this.randomNumber=res.randomNumber
              if (res.login_url !=''){
                this.goUrl = res.login_url;
              }else{
                this.goUrl = res.url;
              }
            }
          })
      },
      link(){
        this.is_show=true
        this.is_hide=false
      },
      getNewMessage(){
        let type='login'
        this.request(userApi.getResult,{randomNumber: this.randomNumber,type:type})
          .then((res) => {
            console.log('res',res);
            if (res.login==true&&res.ticket!=''){
              this.is_show=false
              this.is_hide=true
              this.visible = false
              Vue.ls.set('property_access_token', res.ticket, null) // vue.ls存储到localstorage,持久化存储
              setCookie('property_access_token', res.ticket, null) // 存入到cookie中
              window.open(res.jump_url);
            }else{
             let   msg='您还未授权登录，请完成授权登录后继续';
              this.$message.warning(msg);
            }
          })
      },
    },
  }
</script>
<style scoped>
  .ant-form-item label {
    width: 50px;
  }
  .tip-txt {
    margin-left:4px;font-size: 12px;
  }
  .add-box-tip {
    text-align: -webkit-center;
    padding: 0 6px;
    margin-left: 8px;
    border-radius: 15px;
    border: none;
  }
</style>