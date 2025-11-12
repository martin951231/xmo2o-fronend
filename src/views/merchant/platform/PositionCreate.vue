<template>
  <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="选择店铺分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select
            v-decorator="['cat_id', {initialValue:detail.cat_id,rules: [{required: true, message: '请选择店铺分类'}]}]"
            placeholder="请选择店铺分类"
            >
                <a-select-option
                    v-for="items in categoryList"
                    :key="items.cat_id"
                    :cat_id="items.cat_id"
                    >{{items.cat_name}}
                </a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item label="岗位名称" :labelCol="labelCol" :wrapperCol="wrapperCol" help="1-6个字符">
          <a-input v-decorator="['name', {initialValue:detail.name,rules: [{required: true, message: '请输入名称'}]}]" placeholder="请输入名称" :maxLength="6"/>
        </a-form-item>
        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            v-model="value"
            placeholder="添加备注"
            :auto-size="{ minRows: 3, maxRows: 5 }"
            v-decorator="['remarks', {initialValue:detail.remarks,rules: [{required: false}]}]"
            />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import merchantPlatformApi from '@/api/merchant/platform/index'
  export default {
    data() {
      return {
        categoryList:[],
        title: '添加岗位',
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
          id:0,
          cat_id:'',
          name: '',
          remarks: '',
        },
        id:0,
      }
    },
    mounted() {},
    methods: {
      edit(id) {
        this.visible = true
        this.id = id
        this.getEditInfo()
        this.getPositionCategoryList();
        if (this.id > 0) {
          this.title = '编辑岗位'
        } else {
          this.title = '添加岗位'
        }
      },
      add() {
        //新建子分类
        this.title = '添加岗位'
        this.getPositionCategoryList();
        this.visible = true
        this.detail = {
            id: 0,
            name:'',
            remarks:'',
        }
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
            values.id = this.detail.id
            this.request(merchantPlatformApi.getPositionCreate, values)
              .then((res) => {
                if (this.id>0) {
                  this.$message.success('编辑成功')
                } else {
                  this.$message.success('添加成功')
                }
                setTimeout(() => {
                    this.form = this.$form.createForm(this)
                    this.visible = false
                    this.confirmLoading = false
                    this.$emit('loaddata', this.id)
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
            this.id = '0'
            this.form = this.$form.createForm(this)
          }, 500)
      },
    //   详情
      getEditInfo() {
        this.request(merchantPlatformApi.getPositionInfo, {
            id: this.id
          })
          .then((res) => {
            this.detail = {
                id: 0,
                name:'',
                remarks:'',
            }
            if (res) {
              this.detail = res
            }
          })
      },
    //   分类
      getPositionCategoryList() {
        this.request(merchantPlatformApi.getPositionCategoryList, {
            id: this.id
          })
          .then((res) => {
            if (res) {
              this.categoryList = res
            }
          })
      }
    },
  }
</script>
