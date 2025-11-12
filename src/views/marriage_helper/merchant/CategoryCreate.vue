<template>
  <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="选择岗位" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select
            v-decorator="['pos_id', {initialValue:detail.pos_id,rules: [{required: false, message: '请选择岗位'}]}]"
            placeholder="请选择岗位"
            >
                <a-select-option
                    v-for="items in categoryList"
                    :key="items.pos_id"
                    :pos_id="items.pos_id"
                    >{{items.name}}
                </a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item label="分类名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['cat_name', {initialValue:detail.cat_name,rules: [{required: true, message: '请输入名称'}]}]" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" help="值越大越靠前">
          <a-input-number v-decorator="['sort',{initialValue:detail.sort}]" :min="0"/>
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group name="status" :default-value="{initialValue:detail.status}" v-decorator="['status',{initialValue:detail.status}]" :min="0">
            <a-radio :value="0">
              正常
            </a-radio>
            <a-radio :value="1">
              关闭
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import marriageHelperCommentApi from '@/api/marriage_helper/platform'

  export default {
    data() {
      return {
        categoryList:[],
        title: '添加分类',
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
          cat_id:0,
          pos_id:'',
          cat_name: '',
          sort:0,
          status: 0,
        },
        cat_id:0,
      }
    },
    mounted() {},
    methods: {
      edit(cat_id) {
        this.visible = true
        this.cat_id = cat_id
        this.getEditInfo()
        this.getPositionCategoryList();
        if (this.cat_id > 0) {
          this.title = '编辑分类'
        } else {
          this.title = '添加分类'
        }
      },
      add() {
        //新建子分类
        this.title = '添加分类'
        this.getPositionCategoryList();
        this.visible = true
        this.detail = {
          cat_id:0,
          cat_name: '',
          sort:0,
          status: 0,
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
            values.cat_id = this.detail.cat_id
            this.request(marriageHelperCommentApi.getCategoryCreate, values)
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
                  this.$emit('loaddata', this.cat_id)
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
        this.request(marriageHelperCommentApi.getCategoryInfo, {
            cat_id: this.cat_id
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
        this.request(marriageHelperCommentApi.getCategoryPositionList, {
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
