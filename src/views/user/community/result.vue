<template>
  <a-modal  :width="400" :visible="visible" :footer="null" :maskClosable="false" :confirmLoading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800" style="margin-top: 30px;">
       <span> 点击【继续】后将为你打开新网页{{register_title}}企业微信，请在完成{{register_title}}后回到本页面进行后续操作</span>
         <a-button key="console" v-if="is_hide" type="primary" style="margin-top: 19px;margin-left: 145px;" @click="qyRegister">
           继续
          </a-button>
      <a-button key="console" type="primary" style="margin-top: 19px;margin-left: 110px;" v-if="is_show" @click="install">
        请继续完善注册信息
      </a-button>
      <div style="margin-left: 250px;" v-if="is_show">
          <a  style="color: #c5c6c7;margin-left: 45px;" @click="qyRegister">
            重新{{register_title}}
          </a>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
  import configHouseMeterApi from '@/api/community/houseMeter'
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
      }
    },
    methods: {
      add() {
        this.is_show=false
        this.is_hide=true
        this.visible = true
        this.type = 2
        this.register_title="注册"
      },
      edit() {
        this.is_show=false
        this.is_hide=true
        this.visible = true
        this.type = 3
        this.register_title="安装"
      },
      handleCancel() {
        this.visible = false
      },
      qyRegister(){
        this.is_show=true
        this.is_hide=false
        if (this.type == 2){
          this.request(userApi.qyRegister)
            .then((res) => {
              if (res){
                console.log('res',res);
                this.randomNumber=res.randomNumber
                window.open(res.url,'_blank');

              }
            })
        }
        if (this.type == 3){
          this.request(userApi.qyIstall)
            .then((res) => {
              if (res){
                console.log('res',res);
                this.randomNumber=res.randomNumber
                window.open(res.url,'_blank');
              }
            })
        }
      },
      install(){
        let msg=''
        let type=''
        if (this.type == 2){
          msg='您还未注册企业微信，请完成企业微信注册后继续';
          type='register'
        }
        if (this.type == 3){
          type='install'
           msg='您还未安装企业微信，请完成企业微信安装后继续';
        }
        if (this.randomNumber!=''){
          this.request(userApi.getResult,{randomNumber:this.randomNumber,type:type})
            .then((res) => {
              if ((this.type == 2&&res.register == false)||(this.type == 3&&res.install == false)){
                this.$message.warning(msg);
              }else{
                let key='2'
                this.$parent.ok_emit(key,this.randomNumber)
                this.is_show=false
                this.is_hide=true
                this.visible = false
              }
            })
        }else{
          this.$message.warning(msg);

        }

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