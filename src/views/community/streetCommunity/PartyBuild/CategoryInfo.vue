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
              <a-radio :value="0">关闭</a-radio>
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
                title: '添加/编辑',
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
        mounted() {
            // this.getCommunitys();
            // this.getEditInfo();
        },
        methods: {
            onSelect(selectedKeys, info) {
                console.log('selected', selectedKeys, info);
            },
            onCheck(checkedKeys, info) {
                console.log('onCheck', checkedKeys, info);
                this.detail.community = checkedKeys;
                this.checkedKeys = checkedKeys
                console.log('community',this.detail.community);
            },
            add() {
                this.title = '添加'
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
                console.log(this.id)
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
                        let r_url;
                        if(this.detail.cat_id > 0){
                            r_url = streetCommunityApi.savePartyBuildCategory;
                        }else{
                            r_url = streetCommunityApi.addPartyBuildCategory
                        }
                        this.request(r_url, values)
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

                        console.log('values', values)

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
                this.request(streetCommunityApi.getPartyBuildCategoryInfo, {
                    cat_id: this.cat_id
                })
                    .then((res) => {
                        console.log('rererererererer',this.cat_id);
                        console.log(res);
                        this.detail = {
                            cat_id: 0,
                            cat_name: '',
                            cat_sort:'',
                            cat_status: 0,
                        };
                        this.checkedKeys=[];
                        if (typeof(res)=='object') {
                            this.detail = res
                            this.checkedKeys = res.community;
                        }
                        console.log('detail',this.detail)
                        console.log('checkedKeys',this.checkedKeys)
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