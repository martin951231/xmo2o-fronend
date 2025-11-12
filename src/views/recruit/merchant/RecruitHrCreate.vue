<template>
  <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="姓" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['first_name', {initialValue:detail.first_name,rules: [{required: true, message: '请输入姓'}]}]" style="width:130px; float:left" />
        </a-form-item>
        <a-form-item label="名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['last_name', {initialValue:detail.last_name,rules: [{required: true, message: '请输入名'}]}]" style="width:130px; float:left"/>
        </a-form-item>
        <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-decorator="['sex', {initialValue:detail.sex,rules: [{required: true, message: '请选择性别'}]}]"
            style="width:130px;"
          >
            <a-select-option :value="1"> 男</a-select-option>
            <a-select-option :value="2"> 女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="登录手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['phone', {initialValue:detail.phone,rules: [{required: true, message: '请输入登录手机号'},{validator:phoneCheck.bind(this)}]}]" />
        </a-form-item>
        <a-form-item label="职位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['position', {initialValue:detail.position,rules: [{required: true, message: '请输入职位'}]}]" />
        </a-form-item>
        <a-form-item label="微信号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['wechat', {initialValue:detail.wechat,rules: [{required: false},{validator:weixinCheck.bind(this)}]}]" />
        </a-form-item>
        <a-form-item label="邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['email', {initialValue:detail.email,rules: [{required: false},{validator:emailCheck.bind(this)}]}]" />
        </a-form-item>
        <a-form-item label="QQ号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="['qq', {initialValue:detail.qq,rules: [{required: false}]}]" style="width:320px" />
        </a-form-item>
        <a-form-item label="固定电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['tel', {initialValue:detail.tel,rules: [{required: false},{validator:dianhuaCheck.bind(this)}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import recruitMerchantApi from '@/api/recruit/merchant';

  export default {
    data() {
      return {
        title: 'Hr信息新增',
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
          sex: 1,
          first_name: '',
          last_name: '',
          position: '',
          phone: '',
          email: '',
          qq: '',
          tel: '',
          wechat: '',
        },
        id: 0,
        sex: 1,
      }
    },
    mounted() {
      this.getEditInfo();
    },
    methods: {
      edit(id) {
        this.visible = true
        this.id = id
        console.log('++++++++++++++++',this.id)
        this.getEditInfo()
        if (this.id > 0) {
          this.title = 'Hr信息编辑'
        } else {
          this.title = 'Hr信息新增'
        }
      },
      add() {
        //新建子分类
        this.title = 'Hr信息新增'
        this.visible = true
        this.id = 0
        this.detail.sex = 1
        this.initData();
      },
      initData(){
        this.detail = {
          id: 0,
          sex: 1,
          first_name: '',
          last_name: '',
          position: '',
          phone: '',
          email: '',
          qq: '',
          tel: '',
          wechat: '',
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
            values.id = this.id
            this.request(recruitMerchantApi.getRecruitHrCreate, values)
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
      // 手机号验证
      phoneCheck (rule, value, callbackFn) {
        const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
        if (!reg.test(value)) {
          callbackFn('请输入正确手机号码')
          return
        }
        callbackFn()
      },
      // 微信号禁止中文
      weixinCheck (rule, value, callbackFn) {
        const reg = /[u4E00-u9FA5]/g
        if(value === ''){
        }else if (!reg.test(value)) {
          callbackFn('请输入正确微信号')
          return
        }
        callbackFn()
      },
      // 邮箱验证
      emailCheck (rule, value, callbackFn) {
        const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
        if(value === ''){
        }else if (!reg.test(value)) {
          callbackFn('请输入正确邮箱')
          return
        }
        callbackFn()
      },
      // 固定电话验证
      dianhuaCheck (rule, value, callbackFn) {
        const reg = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
        if(value === ''){
        }else if (!reg.test(value)) {
          callbackFn('请输入正确固定电话')
          return
        }
        callbackFn()
      },
      handleCancel() {
        this.visible = false
          setTimeout(() => {
            this.id = '0'
            this.form = this.$form.createForm(this)
          }, 500)
      },
      getEditInfo() {
        console.log('-------------',this.id)
        this.request(recruitMerchantApi.getRecruitHrInfo, {
            id: this.id
          })
          .then((res) => {
            this.detail = {
              id: 0,
              sex: 1,
              first_name: '',
              last_name: '',
              position: '',
              phone: '',
              email: '',
              qq: '',
              tel: '',
              wechat: '',
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
