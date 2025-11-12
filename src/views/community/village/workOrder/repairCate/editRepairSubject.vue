<template>
  <a-modal  :title="title" :width="600" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form" style="padding-left: 35px;">
        <a-form-item  :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-col :span="10">
          <span class="ant-form-item-required" style="float: left;margin-left: 35px;margin-right: 10px;">类目名称:</span>
          </a-col>
          <a-col :span="14">
            <a-input placeholder="请输入类目名称" v-model="group.name"  :disabled="disabled"/>
          </a-col>
        </a-form-item>
        <a-form-item   :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-col :span="10">
          <span class="ant-form-item-required" style="float: left;margin-left: 35px;margin-right: 10px;">背景色:</span>
          </a-col>
          <a-col :span="11">
            <a-input placeholder="请输入背景色"  v-model="group.color"/>
          </a-col>
          <a-col :span="1">
          </a-col>
          <a-col :span="2">
            <colorPicker v-model="color" v-on:change="headleChangeColor" />
          </a-col>
        </a-form-item>
        <a-form-item  :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-col :span="10">
            <span class="ant-form-item-required" style="float: left;margin-left: 35px;margin-right: 10px;">状态:</span>
          </a-col>
          <a-col :span="14">
            <a-radio-group v-model="group.status">
              <a-radio :value="1">
                开启
              </a-radio>
              <a-radio :value="2" >
                关闭
              </a-radio>
            </a-radio-group>
          </a-col>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import configVillageApi from "@/api/community/village"
  import vcolorpicker from 'vcolorpicker'
  import Vue from 'vue'
  Vue.use(vcolorpicker)
  export default {
    data() {
      return {
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
          color: '',
          status:1,
        },
        id:0,
      }
    },
    methods: {

      add() {
        this.title = '添加'
        this.visible = true
        this.disabled=false
        this. group= {
          id: 0,
          name:'',
          color: '',
          status:1,
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
        this.request(configVillageApi.getSubjectInfo, {
          id: this.id
        })
          .then((res) => {
            this.group.id = res.id
            this.group.status = res.status
            this.group.name=res.subject_name
            this.group.color=res.color
            this.color=res.color
            if (res.flag==1){
              this.disabled=true
            }else{
              this.disabled=false
            }
            console.log('group', this.group)

          })
      },
      headleChangeColor(value){
        console.log('color',value)
        this.group.color=value
      },
      handleSubmit1() {
        const {
          form: {
            validateFields
          }
        } = this;
        this.confirmLoading = true;
        validateFields((errors, values) => {
          if (!errors) {
            let url=configVillageApi.addSubject;
            this.group.id= this.id;
            if(this.group.id > 0){
              url=configVillageApi.editSubject;
            }
            this.group.name=values.group.name;
            this.group.status=values.group.status;
            this.group.color=values.group.color;
            this.request(url, this.group)
              .then((res) => {
                if (this.group.id>0) {
                  this.$message.success('编辑成功')
                } else {
                  this.$message.success('添加成功')
                }
                setTimeout(() => {
                  this.form = this.$form.createForm(this);
                  this.visible = false;
                  this.confirmLoading = false;
                  this.$emit('ok')
                }, 1500)
              })
              .catch((error)=>{
                this.confirmLoading = false
              })

          } else {
            this.confirmLoading = false
          }
        })
      },
      handleSubmit() {
        this.confirmLoading = true
        if(this.id>0){
          this.group.id= this.id;
          this.request(configVillageApi.editSubject, this.group)
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
          this.request(configVillageApi.addSubject, this.group)
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