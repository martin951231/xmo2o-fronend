<template>
  <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit"
           @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="关键词名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['name', {initialValue:detail.name,rules: [{required: true, message: '请输入搜索词名称'}]}]"/>
        </a-form-item>
        <a-form-item label="关键词类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="[ 'type',{  initialValue:detail.type }]" @change="change">
            <a-radio :value="0">关键词搜索商品</a-radio>
            <a-radio :value="1">链接页面</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="链接地址" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="detail.type==1">
          <a-input
            v-decorator="['url', {initialValue:detail.url}]" style="width: 228px"/>
          <a class="ant-form-text" @click="setLinkBases">
            从功能库选择
          </a>
        </a-form-item>
        <a-form-item label="是否推荐至首页" :labelCol="labelCol" :wrapperCol="wrapperCol" help="设置后，该关键词将显示在商城首页的热搜区域中">
          <a-switch checked-children="是" un-checked-children="否"
                    v-decorator="['is_first',{initialValue:detail.is_first==1 ? true : false,valuePropName: 'checked'}]"/>
        </a-form-item>
        <a-form-item label="是否高亮" :labelCol="labelCol" :wrapperCol="wrapperCol" help="设置后，在页面展示时会有高亮的标识">
          <a-switch checked-children="是" un-checked-children="否"
                    v-decorator="['hottest',{initialValue:detail.hottest==1 ? true : false,valuePropName: 'checked'}]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script type="text/javascript" src="./static/js/artdialog/jquery.artDialog.js"></script>
<script type="text/javascript" src="./static/js/artdialog/iframeTools.js"></script>
<script>
  import mallPlatformApi from "@/api/mall/platform/index";

  export default {
    data() {
      return {
        title: '新建搜索词',
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
          url: '',
          type: 0,
          is_first: 0,
          hottest: 0,
        },
        id: '0',
      }
    },
    mounted() {
      console.log(this.catFid)
    },
    methods: {
      add() {
        this.visible = true
        this.id = '0'
        this.detail = {
          id: 0,
          type: 0,
          name: '',
          url: '',
          is_first: 0,
          hottest: 0,
        }
      },
      edit(id) {
        this.visible = true
        this.id = id
        this.getEditInfo()
        if (this.id > 0) {
          this.title = '编辑搜索词'
        } else {
          this.title = '新建搜索词'
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
            this.request(mallPlatformApi.addOrEditSearchHot, values)
              .then((res) => {
                if (this.id > 0) {
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
              .catch((error) => {
                this.confirmLoading = false
              })

          } else {
            this.confirmLoading = false
          }
        })
      },
      handleCancel() {
        this.visible = false
        this.id = '0'
        this.form = this.$form.createForm(this)
      },
      getEditInfo() {
        this.request(mallPlatformApi.getEditSearchHot, {
          id: this.id
        })
          .then((res) => {
            this.detail = res
          })
      },
      change(e) {
        this.detail.type = e.target.value
        console.log(e)
        console.log(this.type)
      },
      setLinkBases() {
        this.$LinkBases({
          // visible: true,
          source: 'platform', // 必填
          type: 'h5', // 必填
          // 确定按钮
          handleOkBtn: (res) => {
            // 点击按钮事件
            console.log('handleOk', res)
            this.url = res.url
            this.$nextTick(() => {//链接库动态赋值
              this.form.setFieldsValue({
                url: this.url,
              })
            });
          },
          // handleCancelBtn: () => {
          //   console.log('handleCancel')
          // }
        })
      },
    },
  }
</script>
