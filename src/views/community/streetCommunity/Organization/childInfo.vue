<template>
  <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input placeholder="0，越大越靠前" v-decorator="['sort', {initialValue:detail.sort}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="部门名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input placeholder="请输入部门名称,最多8个字" :maxLength="8" v-decorator="['name', {initialValue:detail.name,rules: [{required: true, message: '请输入部门名称,最多8个字！'},{max:8, message: '部门名称最多8个字！'}]}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="部分介绍" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-textarea
              placeholder="请输入部门介绍"
              v-decorator="['des', {initialValue:detail.des}]"
            />
          </a-col>
          <a-col :span="6">
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
                    id: 0,
                    name: '',
                    sort:0,
                    des:'',
                },
                id:0,
                fid:0,
            }
        },
        mounted() {
        },
        methods: {
            add(id) {
                this.title = '添加'
                this.visible = true
                this.id = '0';
                this.fid = id;
                this.detail = {
                    id: 0,
                    name: '',
                    sort:0,
                    des:'',
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
                const {
                    form: {
                        validateFields
                    }
                } = this
                this.confirmLoading = true
                validateFields((errors, values) => {
                    if (!errors) {
                        values.id= this.id;
                        values.fid= this.fid;
                        this.request(streetCommunityApi.subBranch, values)
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
                                    this.$emit('ok', values)
                                }, 1500)
                            })
                            .catch((error)=>{
                                this.confirmLoading = false
                            })

                        console.log('values', values)

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
            getEditInfo() {
                this.request(streetCommunityApi.getBranchInfo, {
                    id: this.id
                })
                    .then((res) => {
                        console.log(res);
                        this.detail = {
                            id: 0,
                            name: '',
                            sort:0,
                            des:'',
                        };
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