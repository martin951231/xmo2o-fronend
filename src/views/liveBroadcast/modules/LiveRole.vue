<template>
    <a-modal
        title="添加主播"
        width="30%"
        :visible="addRoleVisible"
        @cancel="cancalAddRole"
        @ok="submitAddRole"
    >
    <a-form-model :model="addRoleForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }" :rules="addRoleFormRules"  ref="addRoleFormRules">
      <a-form-model-item label="微信号" prop="wechat_id">
            <a-input  v-model="addRoleForm.wechat_id"  placeholder="输入主播微信号"/>
      </a-form-model-item>
      <a-form-model-item label="主播验证">
            <p style="color: red;">扫描下方二维码进行身份认证，未实名认证将无法进行微信直播</p>
            <img style="width: 150px;" src="@/assets/wechat_live/qrcode.png"/>
      </a-form-model-item>
    </a-form-model>
    </a-modal>
</template>

<script>
import LiveBroadcastMerchantApi from '@/api/liveBroadcast/merchant'
export default {
  data() {
    return {
      //添加直播
      name:'Roles',
      addRoleVisible:false,
      addRoleForm:{
        wechat_id:'',
      },
      addRoleFormRules:{
        wechat_id:[{ required: true, message: '微信号不能为空', trigger: 'blur' }],
      },
    }
  },
  mounted() {
    
  },
  methods: {
    resetAddRoleForm(){
      this.addRoleForm = {
        wechat_id: '',
      }
    },
    //取消添加直播
    cancalAddRole(){
      this.addRoleVisible = false;
      this.resetAddRoleForm();
    },
    //添加主播
    addRole(){
      this.addRoleVisible = true;
      this.resetAddRoleForm();
    },
    //提交添加主播
    submitAddRole(){
      this.$refs.addRoleFormRules.validate((valid) => {
        if (valid) {
          this.request(LiveBroadcastMerchantApi.saveRole, this.addRoleForm).then((res) => {
            this.$message.success('添加成功')
            this.addRoleVisible = false;
            this.$emit('updateRolesList', {})
          })
        } else {
          return false
        }
      })
    }   
  },
}
</script>