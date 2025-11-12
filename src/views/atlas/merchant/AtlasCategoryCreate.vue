<template>
  <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="分类名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['cat_name', {initialValue:detail.cat_name,rules: [{required: true, message: '请输入分类名称'}]}]" />
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch checked-children="开启" un-checked-children="关闭" v-decorator="['cat_status',{initialValue:detail.cat_status==1 ? true : false,valuePropName: 'checked'}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import atlasaticlecategoryPlatformApi from '@/api/atlas/merchant';
  export default {
    data() {
      return {
        title: '下级分类',
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
          cat_id: 0,
          cat_fid: 0,
          cat_name: '',
          cat_status: 1,
        },
        catId: '',
        catFid: ''
      }
    },
    mounted() {
      this.getEditInfo();
      // console.log( this.catFid)
    },
    methods: {
      edit(catId) {
        this.visible = true
        this.catId = catId
        this.getEditInfo()
        // console.log(this.catId)
        if (this.catId > 0) {
          this.title = '编辑分类'
        } else {
          this.title = '下级分类'
        }
        // console.log(this.title)
      },
      addSub(catFid) {
        //新建子分类
        this.title = '下级分类'
        this.visible = true
        this.catFid = catFid
        this.catId = 0
        // console.log(this.title)
        this.getEditInfo()
      },
      handleSubmit() {
        const {
          form: {
            validateFields
          }
        } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            values.cat_id = this.catId
            values.cat_fid = this.catFid
            this.request(atlasaticlecategoryPlatformApi.getAtlasCategoryCreate, values)
              .then((res) => {
                if (this.catId>0) {
                  this.$message.success('编辑成功')
                } else {
                  this.$message.success('添加成功')
                }
                setTimeout(() => {
                  this.form = this.$form.createForm(this)
                  this.visible = false
                  this.confirmLoading = false
                  this.$emit('ok', values)
                }, 1500)
              })
              .catch((error)=>{
                  this.confirmLoading = false
              })
            // console.log('values', values)
          } else {
            this.confirmLoading = false
          }
        })
      },
      handleCancel() {
        this.visible = false
          setTimeout(() => {
            this.catId = '0'
            this.catFid = '0'
            this.form = this.$form.createForm(this)
          }, 500)
      },
      getEditInfo() {
        this.request(atlasaticlecategoryPlatformApi.getAtlasCategoryInfo, {
            cat_id: this.catId
          })
          .then((res) => {
            this.detail = {
              cat_id: 0,
              cat_fid: 0,
              cat_name: '',
              cat_status: 1,
            }
            if (res) {
              this.detail = res
              console.log(res)
            }
            // console.log(res)
          })
      }
    },
  }
</script>
