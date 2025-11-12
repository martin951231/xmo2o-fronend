<template>
  <!--老框架使用新框架配置项弹窗 仅支持单独配置项-->
  <div>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-spin :spinning="confirmLoading">
        <div :key="itemTab.tab_id" v-for="itemTab of configTab">
          <a-form @submit="handleSubmit" :form="form">
            <div v-for="itemv of itemTab.list" :key="itemv.name">
              <a-form-item
                v-if="itemv.type == 'richtext'"
                :label="itemv.info"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                :name="itemv.name"
              >
                <rich-text :info.sync="itemv.value" />
              </a-form-item>
              <a-form-item
                v-else-if="itemv.name == 'mobile_head_color'"
                :label="itemv.info"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <color-picker :color.sync="itemv.value" />
              </a-form-item>
              <form-item
                v-else
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                :title="itemv.info"
                :name="itemv.name"
                :type="itemv.type"
                :required="Boolean(itemv.required)"
                :value="itemv.value"
                :tips="itemv.desc"
                :digits="itemv.digits  ? true:false"
                :url="Boolean(itemv.url)"
                :max="itemv.max ? (itemv.max*1):99999999"
                :min="itemv.min ? (itemv.min*1):0"
                :number="itemv.isnumber ? true:false"
                :selectArray="itemv.typeValue"
                :rows="Number(itemv.rows)"
                :placeholder="itemv.placeholder"
                :key="itemv.gid"
                :filetype="itemv.filetype ? itemv.filetype:''"
                :fsize="itemv.fsize ? (itemv.fsize*1):0"
                :maxlength="itemv.maxlength ? (itemv.maxlength*1):21000"
                @uploadChange="uploadChange"
              ></form-item>
            </div>
          </a-form>
        </div>
        <!-- </a-tabs> -->
      </a-spin>
    </a-card>
  </div>
</template>
<script>
import configPlatformApi from '@/api/config/platform/config'
import FormItem from '@/components/FormItem/FormItem'
import ColorPicker from '@/components/ColorPicker/ColorPicker'
import RichText from '@/components/RichText/RichText'
import { transferFormValue } from '@/utils/util'
let _this = this
export default {
  name: 'ConfigPlatform',
  components: {
    FormItem,
    ColorPicker,
    RichText,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      labelCol: { lg: { span: 6 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 14 }, sm: { span: 17 } },
      groupList: [],
      configTab: [],
      configList: [],
      gid: '',
      GLindex: 0,
      confirmLoading: false,
    }
  },
  mounted() {
    _this = this
    if (this.$route.path.indexOf('gid') != -1) {
      this.gid = this.$route.path.slice(this.$route.path.indexOf('=') + 1)
    }
    this.getData(this.gid)
  },
  watch: {
    $route: {
      handler: function () {
        if (this.$route.path.indexOf('gid') != -1) {
          this.gid = this.$route.path.slice(this.$route.path.indexOf('=') + 1)
        } else {
          this.gid = ''
        }
        this.getData(this.gid)
      },
    },
  },
  created() {},
  methods: {
    getData(gid) {
      this.request(configPlatformApi.configData, { gid: gid }, 'get').then((res) => {
        console.log(res.config_list)
        this.groupList = res.group_list
        this.configTab = res.config_list
      })
    },
    // 监听上传数据变化
    uploadChange(e) {
      const name = e.name
      let iv = ''
      if (e.value.length) {
        const file = e.value[0]
        iv = file.response && file.response.data
      }
      this.form.getFieldDecorator(name, { initialValue: iv })
    },
  },
}

// 提交数据
window.dialogConfirm = () => {
  const {
    form: { validateFields },
  } = _this
  _this.confirmLoading = true
  validateFields((errors, values) => {
    if (!errors) {
      let formData = { ...values }
      // 要转换的数据类型
      const types = ['switch', 'date', 'time']
      _this.configTab.forEach((configList) => {
        // 富文本
        configList.list.forEach((item) => {
          if (item['type'] == 'richtext') {
            formData[item.name] = item.value
          }
        })

        // 颜色选择
        const colors = configList.list.find((item) => {
          return item['name'] == 'mobile_head_color'
        })
        if (colors) {
          formData.mobile_head_color = colors.value
        }
        transferFormValue(configList.list, formData, types)
      })
      // 最后的数据
      console.log('Received values of form: ', formData)
      const key = 1
      _this
        .request(configPlatformApi.configDataAmend, formData)
        .then((result) => {
          _this.$message.success('编辑成功', key)
          setTimeout(() => {
            _this.form = _this.$form.createForm(_this)
            _this.getData(_this.gid)
            _this.confirmLoading = false
          }, 1500)
        })
        .catch(() => {
          _this.confirmLoading = false
        })
    } else {
      _this.confirmLoading = false
    }
  })
}
window.dialogCancel = () => {
  _this.form = _this.$form.createForm(_this)
}
</script>