<template>
  <a-modal  :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="集中器名称" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-col :span="18">
            <a-input placeholder="请输入集中器名称" v-model="group.group_name"/>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="逻辑地址" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-col :span="18">
            <a-input placeholder="请输入逻辑地址" v-model="group.group_address"/>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-col :span="18">
            <a-radio-group v-model="group.status" >
              <a-radio :value="1">
                正常
              </a-radio>
              <a-radio :value="2" >
                关闭
              </a-radio>
            </a-radio-group>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import configHouseMeterApi from '@/api/community/houseMeter'
  export default {
    data() {
      this.dateFormat='YYYY-MM-DD';
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
        defaultChecked:true,
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        group: {
          id: 0,
          group_name:'',
          group_address: '',
          status:1,
        },
        id:0,
      }
    },
    methods: {

      add() {
        this.title = '添加'
        this.visible = true
        this. group= {
          id: 0,
          group_name:'',
          group_address: '',
          status:1,
        };
        this.checkedKeys=[];
      },
      edit(id) {
        this.visible = true
        this.id = id
        this.getGroupInfo()
        console.log(this.id)
        if (this.id > 0) {
          this.title = '编辑'
        } else {
          this.title = '添加'
        }
      },
      getGroupInfo(){
        this.request(configHouseMeterApi.meterElectricGroupInfo, {
          id: this.id
        })
          .then((res) => {
            this.group = res
            console.log('group', this.group)

          })
      },
      handleSubmit() {
        this.confirmLoading = true
        if(this.id>0){
          this.group.id= this.id;
          this.request(configHouseMeterApi.meterElectricGroupEdit, this.group)
            .then((res) => {
              if(res)
              {
                this.$message.success('添加成功')
              }else{
                this.$message.success('添加失败')
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
        }else{
          this.request(configHouseMeterApi.meterElectricGroupAdd, this.group)
            .then((res) => {
              if(res)
              {
                this.$message.success('添加成功')
              }else{
                this.$message.success('添加失败')
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
        }

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