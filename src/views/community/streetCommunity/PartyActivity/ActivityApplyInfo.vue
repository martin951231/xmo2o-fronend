<template>
  <a-modal :title="title" :width="800" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="报名姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input v-decorator="['user_name', {initialValue:detail.user_name,rules: [{required: true, message: '请输入报名姓名！'}]}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="报名电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input v-decorator="['user_phone', {initialValue:detail.user_phone,rules: [{required: true, message: '请输入报名电话！'}]}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="报名身份证号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input v-decorator="['id_card', {initialValue:detail.id_card,rules: [{required: true, message: '请输入报名身份证号！'}]}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="所属活动" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            {{detail.activity_name}}
          </a-col>
        </a-form-item>
        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="20">
            <a-input type="textarea" v-decorator="['desc', {initialValue:detail.desc}]"/>
          </a-col>
        </a-form-item>
        <a-form-item label="报名状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-radio-group v-decorator="['status',{initialValue:detail.status}]" >
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
    export default {
        data() {
            return {
                title: '新建',
                labelCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 8
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
                    party_activity_id: '',
                    uid:'',
                    user_name: 0,
                    user_phone: 0,
                    id_card: 0,
                    desc: 0,
                    status: '',
                },
                id:0,
                isClear: false,
                loading:false,
                activity_date:[],
                party_activity_id:0,
            }
        },
        methods: {
            edit(id,activity_id) {
                this.visible = true
                this.party_activity_id = activity_id
                this.id = id
                this.getEditInfo()
                console.log(this.id)
                if (this.id > 0) {
                    this.title = '编辑'
                } else {
                    this.title = '新建'
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
                        values.party_activity_id= this.party_activity_id?this.party_activity_id:0;
                        values.id= this.id;
                        console.log(values);
                        this.request(streetCommunityApi.subApply, values)
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
                    this.activity_id = '0'
                    this.join_id = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            getEditInfo() {
                this.request(streetCommunityApi.getApplyInfo, {
                    id: this.id
                })
                    .then((res) => {
                        console.log(res);
                        this.detail = {
                            id: 0,
                            party_activity_id: '',
                            uid:'',
                            user_name: 0,
                            user_phone: 0,
                            id_card: 0,
                            desc: 0,
                            status: '',
                        };
                        if (typeof(res.info)=='object') {
                            this.detail = res.info
                            this.party_activity_id = res.info.party_activity_id;
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