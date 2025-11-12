<template>
  <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['name', {initialValue:detail.name,rules: [{required: true, message: '请输入名称'}]}]" />
        </a-form-item>
        <a-form-item label="显示排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['sort', {initialValue:detail.sort}]" :min="0" />
          <span class="ant-form-text">
            值越大越靠前
          </span>
        </a-form-item>
        <a-form-item  label="选择类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-decorator="['type_id', {initialValue:detail.type_id}]" :min="0"
            style="width:115px;"
          >
            <a-select-option :value="0"> 单选</a-select-option>
            <a-select-option :value="1"> 多选</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="选项值" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea 
          v-decorator="['content', {initialValue:detail.content,rules: [{required: false, message: '请填写选项值'}]}]"
          :rows="4" />
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
        title: '添加填写项',
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
          sort: '',
          content: '',
          type_id: 0,
        },
        catId: '',
        catFid: ''
      }
    },
    mounted() {
      this.id = 0
      this.cat_id = cat_id
      console.log(cat_id)
      this.getEditInfo();
    },
    methods: {
      edit(id) {
        this.visible = true
        this.id = id
        this.cat_id = 0
        this.getEditInfo()
        if (this.id > 0) {
          this.title = '编辑填写项'
        } else {
          this.title = '添加填写项'
        }
      },
      addSub(cat_id) {
        //新建
        this.title = '添加填写项'
        this.visible = true
        this.id = 0

        this.cat_id = cat_id
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
            values.cat_id = this.cat_id
            values.id = this.id
            this.request(atlasaticlecategoryPlatformApi.getAtlasSpecialCreate, values)
              .then((res) => {
                if (this.cat_id>0) {
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
        this.request(atlasaticlecategoryPlatformApi.getAtlasSpecialInfo, {
            id: this.id,
            cat_id: this.cat_id
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
          })
      }
    },
  }
</script>
