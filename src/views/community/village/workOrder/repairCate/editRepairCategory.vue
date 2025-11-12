<template>
  <a-modal  :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item  :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span class="ant-form-item-required" style="float: left;margin-left: 35px;margin-right: 10px;">类别名称:</span>
          <a-col :span="18">
            <a-input placeholder="请输入类别名称" :disabled="disabled"  v-model="group.name" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item  :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <span style="float: left;margin-left: 74px;margin-right: 10px;">状态:</span>
          <a-col :span="18">
            <a-radio-group  v-model="group.status">
              <a-radio :value="1">
                开启
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
  import configVillageApi from "@/api/community/village"
  export default {
    data() {
      return {
        text:'',
        title: '添加',
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
        disabled:false,
        value: null,
        color: '',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        group: {
          id: 0,
          name:'',
          status:1,
          subject_id:0
        },
        id:0,
      }
    },
    methods: {

      add(subject_id) {
        this.title = '添加'
        this.visible = true
        this. group= {
          id: 0,
          name:'',
          status:1,
          subject_id:subject_id,
        };
      },
      edit(id) {
        this.visible = true
        this.id = id
        this.getSubjectInfo()
        console.log(this.id)
        if (this.id > 0) {
          this.title = '编辑'
        } else {
          this.title = '添加'
        }
      },
      getSubjectInfo(){
        this.request(configVillageApi.getCategoryInfo, {
          id: this.id
        })
          .then((res) => {
            this.group.id = res.id
            this.group.status = res.status
            this.group.name=res.subject_name
            this.group.subject_id=res.parent_id
            console.log('group', this.group)
            if (res.flag1==1){
              this.disabled=true
            }else{
              this.disabled=false
            }
          })
      },
      handleSubmit() {
        this.confirmLoading = true
        if(this.id>0){
          this.group.id= this.id;
          this.request(configVillageApi.editCategory, this.group)
            .then((res) => {
              if(res)
              {
                this.$message.success('编辑成功')
              }else{
                this.$message.success('编辑失败')
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
          this.request(configVillageApi.addCategory, this.group)
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