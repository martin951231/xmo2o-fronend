<template>
  <a-modal destroyOnClose :title="title" :width="1200"  :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="事项名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input v-decorator="['title', {initialValue:detail.title,rules: [{required: true, message: '请输入事项名称！'}]}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="20">
            <!--<editor v-model="detail.content" :isClear="isClear" :contxt="detail.content" @change="change"></editor>-->
            <rich-text :info.sync="content"/>
          </a-col>
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input v-decorator="['sort', {initialValue:detail.sort}]" />
          </a-col>
        </a-form-item>
        <a-form-item label="会议状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-radio-group v-decorator="['status',{initialValue:detail.status}]" >
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
    import Editor from '@/components/Editor/WEditor'
    import RichText from '@/components/RichText/RichText'
    export default {
        data() {
            return {
                title: '新建',
                labelCol: {
                    xs: {
                        span: 20
                    },
                    sm: {
                        span: 4
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
                    matter_id: 0,
                    title: '',
                    content:'',
                    status: 1,
                    cat_id: 0,
                    area_id: 0,
                },
                matter_id:0,
                cat_id:0,
                isClear: false,
                loading:false,
                content: ''
            }
        },
        watch:{
            content(val){
                console.log(111111111, val)
                this.$set(this.detail, 'content',val)
            }
        },
        components: {
            Editor,
            RichText
        },
        mounted() {
        },
        methods: {
            change(val) {
                console.log(val)
            },
            add(cat_id) {
                this.title = '新建';
                this.visible = true;
                this.cat_id = cat_id;
                this.matter_id = 0;
                this.detail = {
                    meeting_id: 0,
                    title: '',
                    content:' ',
                    status: 1,
                    cat_id: 0,
                    area_id: 0,
                };
            },
            edit(matter_id,cat_id) {
                this.visible = true;
                this.cat_id = cat_id;
                this.matter_id = matter_id;
                this.getEditInfo();
                if (this.matter_id > 0) {
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
                        values.cat_id= this.cat_id?this.cat_id:0;
                        values.matter_id= this.matter_id;
                        values.content = this.detail.content;
                        console.log(values);
                        this.request(streetCommunityApi.subMatter, values)
                            .then((res) => {
                                if (this.detail.matter_id>0) {
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
                this.content = ''
                setTimeout(() => {
                    this.cat_id = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            getEditInfo() {
                this.request(streetCommunityApi.getMatterInfo, {
                    matter_id: this.matter_id
                })
                    .then((res) => {
                        console.log(res);
                        this.detail = {
                            matter_id: 0,
                            title: '',
                            content:'',
                            status: 0,
                            cat_id: 0,
                            area_id: 0,
                        };
                        this.checkedKeys=[];
                        if (typeof(res.info)=='object') {
                            this.detail = res.info
                            this.content = res.info.content
                            this.cat_id = res.info.cat_id;
                            this.matter_id = res.info.matter_id;
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
  .imgname{
    width: 100px;
  }

</style>