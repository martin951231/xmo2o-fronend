<template>
  <a-modal  :title="title" :width="600" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form" style="padding-left: 35px;">
        <a-form-item  :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-col :span="10">
            <span class="ant-form-item-required" style="float: left;margin-left: 35px;margin-right: 10px;">字段名称:</span>
          </a-col>
          <a-col :span="14">
            <a-input placeholder="请输入字段名称" v-model="group.name"/>
          </a-col>
        </a-form-item>
        <a-form-item  :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-col :span="10">
            <span  style="float: left;margin-left: 35px;margin-right: 10px;">排序值:</span>
          </a-col>
          <a-col :span="14">
            <a-input placeholder="不填则默认为0" v-model="group.sort"/>
          </a-col>
        </a-form-item>
        <a-form-item  :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-col :span="10">
            <span class="ant-form-item-required" style="float: left;margin-left: 35px;margin-right: 10px;">状态:</span>
          </a-col>
          <a-col :span="14">
            <a-radio-group v-model="group.status" >
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
        value: null,
        color: '',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        group: {
          id: 0,
          name:'',
          cate_id:0,
          sort: '',
          status:1,
        },
        id:0,
      }
    },
    methods: {

      add(cate_id) {
        this.title = '添加'
        this.visible = true
        this.id = 0
        this. group= {
          id: 0,
          name:'',
          sort: '',
          cate_id:cate_id,
          status:1,
        };
      },
      edit(cate_id,id) {
        this.visible = true
        this.id = id
        this. group= {
            id: id,
            name:'',
            sort: '',
            cate_id:cate_id,
            status:1,
        }
        this.getCateCustomInfo()
        console.log(this.id)
        if (this.id > 0) {
          this.title = '编辑'
        } else {
          this.title = '添加'
        }
      },
      getCateCustomInfo(){
        this.request(configVillageApi.getCateCustomInfo, {
          id: this.id,cate_id:this. group.cate_id
        })
          .then((res) => {
            this.group.id = res.id
            this.group.status = res.status
            this.group.name=res.name
            this.group.sort=res.sort
            console.log('group', this.group)

          })
      },
      handleSubmit() {
        this.confirmLoading = true
        if(this.id>0){
          this.group.id= this.id;
          this.request(configVillageApi.addCateCustom, this.group)
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
          this.request(configVillageApi.addCateCustom, this.group)
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