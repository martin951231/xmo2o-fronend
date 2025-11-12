<template>
  <a-modal  :title="title" :width="450" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol"  style="width: 90%">
          <a-col :span="18" style="width: 99%">
            <a-input placeholder="请输入线下支付方式名称" v-model="number.name" style="width: 99%"/>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import newChargeApi from '@/api/community/property/packages';
  export default {
    data() {
      return {
        title: '领用租借',
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
        charge_type_list:[],
        defaultChecked:true,
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        number: {
          id: 0,
          name: '',
        },
        id:0,
      }
    },
    methods: {

      add() {
        this.title = '添加'
        this.visible = true
        this. number= {
          id: 0,
          name: '',
        };
        this.id=0;
        this.checkedKeys=[];
      },
      edit(id) {
        this.visible = true
        this.id = id
        this.getChargeNumberInfo()
        console.log(this.id)
        if (this.id > 0) {
          this.title = '编辑'
        } else {
          this.title = '添加'
        }
      },
      getChargeNumberInfo(){
        this.request(newChargeApi.offlinePayInfo, {
          id: this.id
        })
          .then((res) => {
            this.number = res
            console.log('number', this.number)

          })
      },
      handleSubmit() {
        this.confirmLoading = true
        let url=newChargeApi.addOfflinePay;
        if(this.id>0){
          url=newChargeApi.editOfflinePay;
          this.number.id= this.id;
        }
        this.request(url, this.number)
          .then((res) => {
            if(res)
            {
              if(this.id>0){
              this.$message.success('编辑成功')
              }else {
              this.$message.success('添加成功')
            }

            }else{
              if(this.id>0){
                this.$message.success('编辑失败')
              }else {
                this.$message.success('添加失败')
              }
            }
            setTimeout(() => {
              this.form = this.$form.createForm(this)
              this.visible = false
              this.confirmLoading = false
              this.$emit('ok')
            }, 1500)
          })
          .catch((error)=>{
            this.confirmLoading = false
          })
      },
      handleCancel() {
        this.visible = false
        setTimeout(() => {
          this.id = '0'
          this.form = this.$form.createForm(this)
        }, 500)
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