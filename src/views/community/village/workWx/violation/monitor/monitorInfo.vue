<template>
  <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="敏感词名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input placeholder='请输入敏感词名称！' v-model="detail.name" />单个敏感词名称最多6个字。
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import villageApi from '@/api/community/village'
  import streetCommunityApi from '@/api/community/streetCommunity'
  var treeData = [];
  export default {
    name: "monitorInfo.vue",
    data() {
      return {
        title: '新建',
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
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        detail: {
          id: 0,
          name: '',
        },
        id:0,
      }
    },
    mounted() {
    },
    methods: {
      add() {
        this.title = '添加'
        this.visible = true
        this.id = '0'
        this.detail = {
          id: 0,
          name: '',
        }
        this.checkedKeys=[];
      },
      edit(id) {
        console.log('erererererer',id);
        this.visible = true
        this.id = id
        this.getEditInfo()
        if (this.id > 0) {
          this.title = '编辑'
        } else {
          this.title = '添加'
        }
        console.log(this.title)
      },
      handleSubmit() {

        this.confirmLoading = true
        this.request(villageApi.addSensitive, {'name':this.detail.name})
              .then((res) => {
                if (this.detail.id>0) {
                  this.$message.success('编辑成功')
                } else {
                  this.$message.success('添加成功')
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

</style>