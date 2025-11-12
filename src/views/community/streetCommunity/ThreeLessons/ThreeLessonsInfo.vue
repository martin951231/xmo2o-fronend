<template>
  <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="分类名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input :maxLength="30" v-decorator="['cat_name', {initialValue:detail.cat_name,rules: [{required: true, message: '请输入分类名称！'}]}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>

        <a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-select
                    show-search
                    option-filter-prop="children"
                    placeholder="请选择类型"
                    v-decorator="['type', {initialValue:detail.type,rules: [{required: true, message: '请选择类型！'}]}]"
            >
              <a-select-option :value="item.key" v-for="(item,index) in party_type" :key="index">
                {{item.value}}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>

        <a-form-item label="分类排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input
                    :maxLength="10"
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
              <a-radio :value="2">关闭</a-radio>
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
              party_type:[],
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
                this.title = '新建'
                this.visible = true
                this.cat_id = '0'
                this.detail = {
                    cat_id: 0,
                    cat_name: '',
                    cat_sort:'',
                    cat_status: 1,
                  type:undefined,
                }
                this.checkedKeys=[];
                this.getPartyType();
            },
            edit(id) {
                this.visible = true
                this.cat_id = id
              this.getPartyType();
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
                        this.request(streetCommunityApi.subLessonsClass, values)
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
                this.request(streetCommunityApi.getLessonsClassInfo, {
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
                      if(res.info.type == 0){
                        res.info.type=undefined
                      }
                        this.checkedKeys=[];
                        if (typeof(res.info)=='object') {
                            this.detail = res.info
                            this.checkedKeys = res.info.community;
                        }
                        console.log('detail',this.detail)
                        console.log('checkedKeys',this.checkedKeys)
                    })
            },
          //获取类型
          getPartyType(){
            this.request(streetCommunityApi.getMeetingBranchType).then((res) => {
              this.party_type=res;
            })
          },
        },
    }
</script>
<style lang="less" scoped>
  /deep/ .ant-form-item label {
    width: 50px;
  }
  /deep/ .tip-txt {
    margin-left:4px;font-size: 12px;
  }
  /deep/ .add-box-tip {
    text-align: -webkit-center;
    padding: 0 6px;
    margin-left: 8px;
    border-radius: 15px;
    border: none;
  }
</style>