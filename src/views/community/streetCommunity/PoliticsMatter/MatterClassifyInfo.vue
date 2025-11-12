<template>
  <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="分类名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input v-decorator="['cat_name', {initialValue:detail.cat_name,rules: [{required: true, message: '请输入分类名称！'}]}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="分类排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input
              placeholder="分类排序"
              v-decorator="['cat_sort', {initialValue:detail.cat_sort}]"
            />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="分类状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-radio-group v-decorator="['cat_status',{initialValue:detail.cat_status}]" >
              <a-radio :value="1">开启</a-radio>
              <a-radio :value="2">禁用</a-radio>
            </a-radio-group>
          </a-col>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    var treeData = [];
    export default {
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
                    cat_id: 0,
                    cat_name: '',
                    cat_sort:'',
                    cat_status: 1,
                },
                cat_id:0,
            }
        },
        methods: {
            add() {
                this.title = '新建'
                this.visible = true
                this.cat_id = '0'
                this.detail = {
                    cat_id: 0,
                    cat_name: '',
                    cat_sort:'',
                    cat_status: 1,
                }
                this.checkedKeys=[];
            },
            edit(id) {
                this.visible = true
                this.cat_id = id
                this.getEditInfo()
                if (this.cat_id > 0) {
                    this.title = '编辑'
                } else {
                    this.title = '新建'
                }
                console.log(this.title)
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
                        values.cat_id= this.cat_id;
                        this.request(streetCommunityApi.handleCategory, values)
                            .then((res) => {
                                if (this.detail.cat_id>0) {
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
                    this.cat_id = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            getEditInfo() {
                this.request(streetCommunityApi.getMatterCategoryDetail, {
                    cat_id: this.cat_id
                })
                    .then((res) => {
                        this.detail = {
                            cat_id: 0,
                            cat_name: '',
                            cat_sort:'',
                            cat_status: 0,
                        };
                        this.checkedKeys=[];
                        if (typeof(res.info)=='object') {
                            this.detail = res.info
                        }
                    })
            },
        },
    }
</script>
<style>
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