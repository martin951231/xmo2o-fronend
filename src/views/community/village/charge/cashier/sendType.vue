<template>
    <div>
      <a-modal
        title="选择催缴对象"
        :width="600"
        :height="400"
        :visible="visible"
        :confirmLoading="confirmLoading"
        :maskClosable = false
        @cancel="handleCancel"
        @ok="handleSubmit"
      >
        <a-spin :spinning="confirmLoading"  :height="800">
          <a-form :form="form">
            <a-form-item label="选择对象" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select style="width: 70%"
                        placeholder="请选择"
                        @change="handleSelectChange"
              >
                <a-select-option value="1">
                  仅业主
                </a-select-option>
                <a-select-option value="2">
                  业主以及家属租客
                </a-select-option>
                <a-select-option value="3">
                  家属和租客
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </a-spin>
      </a-modal>
    </div>
</template>

<script>
    import villageApi from '@/api/community/village'
    export default {
      name: "sendType",
      data(){
        return {
          visible:false,
          confirmLoading:false,
          labelCol: {
            xs: {
              span: 24
            },
            sm: {
              span: 7
            }
          },
          wrapperCol: {
            xs: {
              span: 24
            },
            sm: {
              span: 13
            }
          },
          form: this.$form.createForm(this),
          send_type:0, //发送对象
          type:1,
          list:[],
          is_detail:0,
        }
      },
      methods:{
        select(type=1,list=[],is_detail){
          this.visible = true;
          this.type = type;
          this.list = list;
          this.is_detail = is_detail;
          this.confirmLoading=false
        },
        handleSelectChange(value){
          this.send_type = value;
        },
        handleSubmit(){
          if(this.send_type == 0){
            this.$message.warn('请选择需要发送的对象');
            return false;
          }
          this.confirmLoading=true
          this.request(villageApi.sendMessage,{
            type:this.type,
            send_type:this.send_type,
            list:this.list,
            is_detail:this.is_detail
          }).then((res)=>{
            this.visible = false;
            this.confirmLoading=false
            this.$message.success('发送成功');
          }).catch((error) => {
             this.visible = false;
             this.confirmLoading=false
          })

        },
        handleCancel(){
          this.visible = false;
        },
      },
    }
</script>

<style scoped>

</style>