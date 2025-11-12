<template>
  <div id="RegisterForm">
    <a-form
      id="components-form-demo-normal-login"
      :form="form"
      class="register-form"
      @submit="handleSubmit"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 19 }"
      labelAlign="left"
      hideRequiredMark
    >
      <div class="form-style">
        <a-form-item :label="L('账号')">
        <a-input
          v-decorator="[
            'account',
            {
              rules: [
                { required: true, message: L('长度为6-16位字符') + '~' },
                { whitespace: true, message: L('输入值不能为空') + '~' },
              ],
            },
          ]"
          :placeholder="L('请输入商家账号')"
        ></a-input>
      </a-form-item>

        <a-form-item :label="L('手机区号')" v-if="international_phone == 1">
        <a-select v-model="countryId" @change="handleCountryChange" >
          <a-select-option v-for="national in nationalData" :key="national.code" :value="national.code">{{ national.show }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="L('手机号码')">
        <a-input
          v-decorator="[
            'phone',
            {
              rules: [
                { required: true, message: L('请输入手机号码') + '~' },
                { whitespace: true, message: L('输入值不能为空') + '~' },
              ],
            },
          ]"
          :placeholder="L('以后可以使用手机号登录')"
        ></a-input>
      </a-form-item>
      <a-form-item :label="L('短信验证码')" v-if="config.open_merchant_reg_sms == 1">
        <a-row :gutter="8">
          <a-col :span="15">
            <a-input
              v-decorator="[
                'smscode',
                {
                  rules: [
                    { required: true, message: L('请填写短信验证码') + '~' },
                    { whitespace: true, message: L('输入值不能为空') + '~' },
                  ],
                },
              ]"
              :placeholder="L('请填写短信验证码')"
            />
          </a-col>
          <a-col :span="9">
            <a-button v-if="time == 0" key="get-code" type="link" @click="getImgCode">{{ L('获取验证码') }}</a-button>
            <a-button v-else type="link" key="code-count">{{ time }} s</a-button>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item :label="L('设置密码')">
        <a-input-password
          v-decorator="[
            'pwd',
            {
              rules: [
                { required: true, message: L('请设置您的密码') + '~' },
                { whitespace: true, message: L('输入值不能为空') + '~' },
                { pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d@$!#%*?&]{8,16}$/, message: L('密码必须是8~16位且包含字母、数字和特殊符号(@、$、!、#、%、*、?、&)') + '~' },
              ],
            },
          ]"
          :placeholder="L('长度大于6位字符')"
        />
      </a-form-item>
      <a-form-item :label="L('商家名称')">
        <a-input
          v-decorator="[
            'name',
            {
              rules: [
                { required: true, message: L('请输入您店铺的品牌名称') + '~' },
                { whitespace: true, message: L('输入值不能为空') + '~' },
              ],
            },
          ]"
          :placeholder="L('您店铺的品牌名称')"
        ></a-input>
      </a-form-item>
      <a-form-item :label="L('邀请码')" v-if="$store.getters.config.open_bd_spread == 1">
        <a-input v-decorator="['invit_code']" :placeholder="L('请联系业务员或业务经理获取邀请码')"></a-input>
      </a-form-item>
      <a-form-item :label="L('营业执照')">
        <a-upload
          name="reply_pic"
          :file-list="tradingCertificateImageList"
          :action="uploadImg"
          :headers="headers"
          @change="tradingCertificateImageChange"
        >
          <a-button> <a-icon type="upload" /> 上传营业执照</a-button>
        </a-upload>
      </a-form-item>
      <a-form-item :label="L('身份证正面')">
        <a-upload
          name="reply_pic"
          :file-list="idCardFrontList"
          :action="uploadImg"
          :headers="headers"
          @change="idCardFrontChange"
        >
          <a-button> <a-icon type="upload" /> 上传身份证正面</a-button>
        </a-upload>
      </a-form-item>
      <a-form-item :label="L('身份证反面')">
        <a-upload
          name="reply_pic"
          :file-list="idCardReverseList"
          :action="uploadImg"
          :headers="headers"
          @change="idCardReverseChange"
        >
          <a-button> <a-icon type="upload" /> 上传身份证反面</a-button>
        </a-upload>
      </a-form-item>
      <a-form-item :label="L('地区')">
        <a-row :gutter="8">
          <a-col :span="6">
            <a-select :value="provinceId" @change="handleProvinceChange" :dropdownMatchSelectWidth="false">
              <a-select-option v-for="province in provinceData" :key="province.id">{{ province.name }}</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <a-select :value="cityId" @change="handleCityChange" :dropdownMatchSelectWidth="false">
              <a-select-option v-for="city in cityData" :key="city.id">{{ city.name }}</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <a-select :value="areaId" @change="handleAreaChange" :dropdownMatchSelectWidth="false">
              <a-select-option v-for="area in areaData" :key="area.id">{{ area.name }}</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <a-select :value="streetId" @change="handleStreetChange" :dropdownMatchSelectWidth="false">
              <a-select-option v-for="street in streetData" :key="street.id">{{ street.name }}</a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </a-form-item>
        <a-form-item :label="L('详细地址')">
            <a-input
                v-decorator="[
            'address',
            {
              rules: [
                { required: true, message: L('请输入详细地址') + '~' },
                { whitespace: true, message: L('输入值不能为空') + '~' },
              ],
            },
          ]"
                :placeholder="L('您店铺的详细位置')"
            ></a-input>
        </a-form-item>
      </div>
      <a-form-item :wrapper-col="{ span: 24 }" style="text-align:center">
        <a-button
          type="primary"
          size="large"
          html-type="submit"
          class="login-form-button"
          style="width: 60%;margin-top: 10px;"
          :loading="registerBtn"
          :disabled="registerBtn"
          >{{ L('注册') }}</a-button
        >
      </a-form-item>
    </a-form>

    <a-modal :title="L('获取验证码')" :visible="visible" @ok="handleOk" @cancel="handleCancel">
      <a-row :gutter="8">
        <a-col :span="8">
          <img style="width: 100%; height: 40px; cursor: pointer" :src="src" @click="changeImage" />
        </a-col>
        <a-col :span="16">
          <a-input size="large" v-model="imgCode" :placeholder="L('请输入4位验证码~')" />
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import userMerchantApi from '@/api/user/merchant'
import uploadApi from '@/api/common/uploads'
export default {
  name: 'RegisterForm',
  components: {},
  props: {
    config: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  data() {
    return {
      headers: {
        authorization: 'authorization-text',
      },
      form: this.$form.createForm(this),
      registerBtn: false,
      visible: false,
      phone: '',
      imgCode: '',
      time: 0,
      provinceData: [], // 省份
      cityData: [], // 城市
      areaData: [], // 区域
      streetData: [], // 街道
      nationalData: [], // 区号
      provinceId: '',
      cityId: '',
      areaId: '',
      streetId:'',
      provinceName: '',
      cityName: '',
      src: userMerchantApi.imgCode,
      countryId: 86,
      international_phone: 0,
      uploadImg: '/v20/public/index.php' + uploadApi.uploadImg + '?upload_dir=/merchant',
      tradingCertificateImageList: [],
      tradingCertificateImage: '',
      idCardFrontList:[],
      idCardFront: '',
      idCardReverseList:[],
      idCardReverse: '',
      account:'',
    }
  },
  created() {
    this.getProvinceData()
    this.getNationalData()
    this.getConfig()
  },

  methods: {
    changeImage() {
      const num = Math.random() * 1000
      this.src = userMerchantApi.imgCode + '?t=' + num
    },
    // 获取当前默认选择城市
    getLocation() {
      this.request(userMerchantApi.getCurrentLocation).then((res) => {
        console.log(res)
        if (res) {
          this.provinceId = res.province_id
          this.cityId = res.city_id
          this.provinceName = res.province_name
          this.cityName = res.city_name
          // 获取城市
          this.getCityData()
        }
      })
    },
    // 获取所有省份
    getProvinceData() {
      this.request(userMerchantApi.getProvinceData).then((res) => {
        console.log(res)
        if (res.error == 0) {
          if (res.list && res.list.length) {
            this.provinceData = res.list
            this.getLocation()
          }
        } else if (res.error == 2) {
          this.provinceData = [{ id: res.id, name: res.name }]
          this.provinceId = res.id
          this.provinceName = res.name
          this.getCityData()
        }
      })
    },
    // 获取手机区号
    getNationalData() {
      this.request(userMerchantApi.getNationalData).then((res) => {
        console.log(res)
        this.nationalData = res
        console.log(this.nationalData)
      })
    },
    // 获取配置
    getConfig() {
      this.request(userMerchantApi.getConfig).then((res) => {
        this.international_phone = res.international_phone
      })
    },
    // 获取某省份下所有城市
    getCityData() {
      this.cityData = []
      const params = {
        id: this.provinceId,
        name: this.provinceName,
      }
      this.request(userMerchantApi.getCityeData, params).then((res) => {
        if (res.list && res.list.length) {
          this.cityData = res.list
          if (this.cityId == '' && this.cityName == '') {
            this.cityId = res.list[0].id
            this.cityName = res.list[0].name
          }
        } else if (res.id && res.name) {
          this.cityData.push({ id: res.id, name: res.name })
          this.cityId = res.id
          this.cityName = res.name
        }
        if (res.info) {
          // 报错 返回错误信息
          this.$message.warning(res.info)
          this.areaData = []
          this.streetData = []
        } else {
          // 获取区域
          this.getAreaData()
        }
      })
    },
    // 获取某城市下所有区域
    getAreaData() {
      this.areaData = []
      this.areaId = ''
      const params = {
        id: this.cityId,
        name: this.cityName,
      }
      this.request(userMerchantApi.getAreaData, params).then((res) => {
        if (res.list && res.list.length) {
          this.areaData = res.list
          this.areaId = res.list[0].id
        } else if (res.id && res.name) {
          this.areaData.push({ id: res.id, name: res.name })
          this.areaId = res.id
        }
        if (res.info) {
          // 报错 返回错误信息
          this.$message.warning(res.info)
          this.areaData = []
          this.streetData = []
        }else{
          this.getStreetData()
        }
      })
    },
    // 获取某区域下所有街道
    getStreetData() {
      this.streetData = []
      this.streetId = ''
      const params = {
        id: this.areaId,
      }
      this.request(userMerchantApi.getStreetData, params).then((res) => {
        if (res.list && res.list.length) {
          this.streetData = res.list
          this.streetId = res.list[0].id
        } else if (res.id && res.name) {
          this.streetData.push({ id: res.id, name: res.name })
          this.streetId = res.id
        }
        if (res.info) {
          // 报错 返回错误信息
          this.$message.warning(res.info)
          this.streetData = []
        }
      })
    },
    // 省份切换
    handleProvinceChange(val) {
      this.provinceData.forEach((item) => {
        if (item.id == val) {
          this.provinceId = item.id
          this.provinceName = item.name
          this.cityId = ''
          this.cityName = ''
          this.areaId = ''
          this.streetId = ''
          this.getCityData()
        }
      })
    },
    // 区号切换
    handleCountryChange(val) {
      this.nationalData.forEach((item) => {
        if (item.code == val) {
          this.countryId = item.code
        }
      })
    },
    handleCityChange(val) {
      this.cityData.forEach((item) => {
        if (item.id == val) {
          this.cityId = item.id
          this.cityName = item.name
          this.getAreaData()
        }
      })
    },
    handleAreaChange(val) {
      this.areaData.forEach((item) => {
        if (item.id == val) {
          this.areaId = item.id
          this.getStreetData()
        }
      })
    },
    handleStreetChange(val) {
      this.streetData.forEach((item) => {
        if (item.id == val) {
          this.streetId = item.id
        }
      })
    },
    // 获取图片验证码
    getImgCode() {
      const {
        form: { validateFields },
      } = this
      const validateFieldsKey = ['phone']
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          this.changeImage()
          this.phone = values.phone
          this.visible = true
        }
      })
    },
    // 上传营业执照
    tradingCertificateImageChange(info) {
      // 图片列表
      let fileList = [...info.fileList]

      fileList = fileList.slice(-1)
      fileList = fileList.map((file) => {
        if (file.response) {
          file.url = file.response.data.full_url
          this.tradingCertificateImage = info.file.response.data.image
        }
        return file
      })
      this.tradingCertificateImageList = fileList

      if (info.file.status === 'done') {
        console.log('done')
      } else if (info.file.status === 'error') {
        console.log('error')
        this.$message.error(`${info.file.name} 上传失败.`)
      }
    },
    // 上传身份证正面图
    idCardFrontChange(info){
       // 图片列表
      let fileList = [...info.fileList]

      fileList = fileList.slice(-1)
      fileList = fileList.map((file) => {
        if (file.response) {
          file.url = file.response.data.full_url
          this.idCardFront = info.file.response.data.image
        }
        return file
      })
      this.idCardFrontList = fileList

      if (info.file.status === 'done') {
        console.log('done')
      } else if (info.file.status === 'error') {
        console.log('error')
        this.$message.error(`${info.file.name} 上传失败.`)
      }
    },
    // 上传身份证反面图
    idCardReverseChange(info){
       // 图片列表
      let fileList = [...info.fileList]

      fileList = fileList.slice(-1)
      fileList = fileList.map((file) => {
        if (file.response) {
          file.url = file.response.data.full_url
          this.idCardReverse = info.file.response.data.image
        }
        return file
      })
      this.idCardReverseList = fileList

      if (info.file.status === 'done') {
        console.log('done')
      } else if (info.file.status === 'error') {
        console.log('error')
        this.$message.error(`${info.file.name} 上传失败.`)
      }
    },
    // 提交图片验证码，确定发送验证码
    handleOk() {
      if (this.imgCode && this.imgCode.length == 4) {
        this.getSmsCode()
      } else {
        this.$message.error(this.L('请输入4位验证码') + '~')
      }
    },
    // 取消发送图片验证码
    handleCancel() {
      this.visible = false
    },
    // 获取短信验证码
    getSmsCode() {
      const params = {
        phone: this.phone,
        verify: this.imgCode,
      }
      this.request(userMerchantApi.getSmsCode, params).then((res) => {
        if (res) {
          this.visible = false
          this.time = 60
          const interval = window.setInterval(() => {
            if (this.time == 0) {
              window.clearInterval(interval)
            } else {
              this.time--
            }
          }, 1000)
        }
      })
    },
    // 提交表单
    handleSubmit(e) {
      e.preventDefault()
      const {
        form: { validateFields },
      } = this
      const validateFieldsKey = ['phone', 'pwd', 'smscode', 'name','invit_code','address','account']
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          console.log('login form', values)
          values.verify = this.imgCode
          if (!this.provinceId || !this.cityId || !this.areaId) {
            this.$message.error(this.L('请选择省份/城市/区域信息'))
            this.registerBtn = false
            return
          }
          values.province_id = this.provinceId
          values.city_id = this.cityId
          values.area_id = this.areaId
          values.street_id = this.streetId
          values.phone_country_type = this.countryId
          values.trading_certificate_image = this.tradingCertificateImage
          values.id_card_front = this.idCardFront
          values.id_card_reverse = this.idCardReverse
          this.registerBtn = true
          // console.log(values)
          this.$emit('handleRegister', values)
        } else {
          setTimeout(() => {
            this.registerBtn = false
          }, 600)
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.form-style{
  max-height: 60vh;
  overflow: hidden;
  overflow-y: auto;
  padding-right: 10px;
}
.form-style::-webkit-scrollbar {
    width: 4px;
}
.form-style::-webkit-scrollbar-thumb {
    border-radius: 15px;
    background: rgba(0,0,0,0.2);
}
.form-style::-webkit-scrollbar-track {
    border-radius: 0;
    background: rgba(0,0,0,0.1);
}
.login-form {
  padding: 20px 10px 0 10px;
  .login-form-button {
    width: 100%;
    height: 40px;
    margin-top: 20px;
  }
}
</style>
