<template>
  <div class="ant-spin-container">
    <div style="background: rgb(255, 255, 255);">
      <div style="margin:25px">
        <a href="/" class="login-header-left-img" >
          <img v-if="config.site_logo!='' && config.property_self_logo!=1" :src="config.site_logo" alt="logo" style="height: 50px;vertical-align: top;margin-right: 16px; border-style: none;">
          </a>
      </div>

      <div style="width: 63%; min-width: 1050px; height: 60%; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);">
        <a-tabs type="card" :activeKey="activeKey" @change="active" style="box-shadow: rgb(0 0 0 / 12%) 0px 8px 16px;">
          <a-tab-pane key="1" tab="企业微信注册">
            <div>
              <div class="regster-view" style="border-right: 1px solid rgb(240, 240, 240);">
                <div  class="register-content" style="">
                  <div  class="title" style="">
                    还没有企业微信？
                  </div>
                  <div  class="desc">
                    注册包含物业应用的企业微信——用企微，连接业主
                  </div>
                  <button type="button" class="ant-btn ant-btn-primary" style="width: 240px; height: 43px; line-height: 41px; font-size: 17px;"  @click="$refs.createModalsss.add()">
                    <img  src="../../../assets/communityimg/WeChatLogo.png"
                          style="width: 20px; margin: -3px 6px 0px 0px;"><span>注册企业微信</span>
                  </button>
                </div>
              </div>
              <div  class="regster-view" style="">
                <div  class="register-content" style="">
                  <div  class="title">
                    已经有企业微信？
                  </div>
                  <div class="desc">
                    极速安装物业应用到企业微信——用企微，连接业主
                  </div>
                  <button  type="button" class="ant-btn" style="width: 240px; height: 43px; line-height: 41px; font-size: 17px;"  @click="$refs.createModalsss.edit()">
                    <img  src="../../../assets/communityimg/WeChatLogo.b8312f74.png"
                          style="width: 24px; margin: -3px 6px 0px 0px;"><span>安装到企业微信</span>
                  </button>
                </div>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="账号密码注册">
            <div class="main user-layout-register1" style="width: 428px;margin-left: 30%;margin-top: 3%;margin-bottom: 3%;">
              <a-form ref="formRegister" :form="form" id="formRegister">
                <a @click="likeClick" style="color: #b61d1d;">
                  <div class="but-t" style="">
                    <div v-if="packageTip" class="but-pack">{{packageTip}}</div>
                    <div class="but-x" v-if="package_title">已选：{{package_price}} {{package_title}}</div>
                  </div>
                </a>
                <a-form-item>
                  <a-input
                    size="large"
                    type="text"
                    @click="hide=false"
                    :placeholder="$store.getters.config.house_name+'名称'"
                    autocomplete="off"
                    @change="inputChange"
                    v-decorator="['villageName', {initialValue:register_data.villageName,rules: [{ required: true, message: '请输入'+$store.getters.config.house_name+'名称' }]}]"
                  ></a-input>
                </a-form-item>
                <a-form-item style="position: relative;">
                  <a-input
                    size="large"
                    type="text"
                    @click="hide ? hide=false:hide=true"
                    :placeholder="$store.getters.config.house_name+'地址'"
                    autocomplete="off"
                    readOnly
                    v-decorator="['villageAddress', {initialValue:register_data.villageAddress,rules: [{ required: true, message: '请选择'+$store.getters.config.house_name+'地址' }]}]"
                  ></a-input>
                </a-form-item>
                <a-form-item v-if="hide" style="margin-top: -25px;" class="wrap">
                  <a-select v-if="showProvince" :default-value="search.provinceId" v-model="search.provinceId"
                            style="width: 143px" @change="handleProvinceChange">
                    <a-select-option v-for="province in provinceData" :key="province.id" :value="province.id">
                      {{ province.name }}
                    </a-select-option>
                  </a-select>
                  <a-select style="width: 143px" v-model="search.cityId" v-if="showCity" @change="handleCityChange">
                    <a-select-option v-for="city in cityData" :key="city.name" :value="city.id">
                      {{ city.name }}
                    </a-select-option>
                  </a-select>
                  <a-select style="width: 142px" v-model="search.areaId" v-if="showArea" @change="handleAreaChange">
                    <a-select-option v-for="area in areaData" :key="area.name" :value="area.id">
                      {{ area.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item>
                  <a-input
                    size="large"
                    type="text"
                    @click="hide=false"
                    autocomplete="off"
                    placeholder="物业公司名称"
                    @change="inputChange"
                    v-decorator="['propertyName', {initialValue:register_data.propertyName,rules: [{ required: true, message: '请输入物业公司名称' }]}]"
                  ></a-input>
                </a-form-item>
                <a-form-item>
                  <a-input
                    size="large"
                    type="text"
                    @click="hide=false"
                    autocomplete="off"
                    placeholder="物业联系地址"
                    @change="inputChange"
                    v-decorator="['propertyAdder', {initialValue:register_data.propertyAdder,rules: [{ required: true, message: '请输入物业公司名称' }]}]"
                  ></a-input>
                </a-form-item>
                <a-form-item>
                  <a-input
                    size="large"
                    type="text"
                    @click="hide=false"
                    placeholder="物业联系电话"
                    autocomplete="off"
                    @change="inputChange"
                    v-decorator="['propertyTel', {initialValue:register_data.propertyTel,rules: [{ required: true, message: '请输入物业公司电话' }]}]"
                  ></a-input>
                </a-form-item>
                <a-form-item>
                  <a-input
                    size="large"
                    type="text"
                    @click="hide=false"
                    placeholder="物业后台帐号"
                    autocomplete="off"
                    @change="inputChange"
                    v-decorator="['account', {initialValue:register_data.account,rules: [{ required: true, message: '请输入物业后台帐号' }]}]"
                  ></a-input>
                </a-form-item>
                <a-popover
                  placement="rightTop"
                  @click="hide=false"
                  :trigger="['focus']"
                  :getPopupContainer="(trigger) => trigger.parentElement"
                  v-model="state.passwordLevelChecked">
                  <template slot="content">
                    <div :style="{ width: '240px' }">
                      <div :class="['user-register', passwordLevelClass]">强度：<span>{{ passwordLevelName }}</span></div>
                      <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor "/>
                      <div style="margin-top: 10px;">
                        <span>请至少输入 6 个字符，必须包含大小写字母、数字、特殊字符。请不要使用容易被猜到的密码。</span>
                      </div>
                    </div>
                  </template>
                  <a-form-item>
                    <a-input
                      size="large"
                      type="password"
                      @click="handlePasswordInputClick"
                      autocomplete="off"
                      placeholder="至少6位密码，必须包含大小写字母、数字、特殊字符"
                      @change="inputChange"
                      v-decorator="['password', {rules: [{ required: true, message: '至少6位密码，必须包含大小写字母、数字、特殊字符'}, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
                    ></a-input>
                  </a-form-item>
                </a-popover>
                <a-form-item>
                  <a-button
                    size="large"
                    type="primary"
                    htmlType="submit"
                    class="register-button"
                    :loading="registerBtn"
                    @click.stop.prevent="handleSubmit"
                    :disabled="registerBtn"
                    style="width: 100%">注册
                  </a-button>
                  <!--        <router-link class="login" :to="{ name: 'communityLogin' }">使用已有账户登录</router-link>-->
                </a-form-item>
                <div class="user" style="text-align: center;margin-bottom: 15px;">
                  <label style="color: #ccc;">注册即表示同意
                    <a href="/shequ.php?g=House&c=Login&a=agreement" style="color: #ccc;">《{{$store.getters.config.house_name}}注册协议》</a>
                  </label>
                </div>
                <div class="user-login-others" style="text-align: center;">
                  <router-link :to="{ name: 'communityLogin' }" style="color: #b61d1d">使用已有账户登录</router-link>
                </div>
              </a-form>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <result :height='800' :width="1500" ref="createModalsss" />
  </div>


</template>
<script>
  import {mixinDevice} from '@/utils/mixin.js'
  import userApi from '@/api/user/community/index.js'
  import areaPlatformApi from '@/api/common/platform/area.js'
  import result from "@/views/user/community/result";

  const levelNames = {
    0: '低',
    1: '低',
    2: '中',
    3: '强'
  }
  const levelClass = {
    0: 'error',
    1: 'error',
    2: 'warning',
    3: 'success'
  }
  const levelColor = {
    0: '#ff0000',
    1: '#ff0000',
    2: '#ff7e05',
    3: '#52c41a'
  }
  const provinceData = [{
    'id': '0',
    'name': '请选择省份'
  }]
  const cityData = [{
    'id': '0',
    'name': '请选择城市'
  }]
  const areaData = [{
    'id': '0',
    'name': '请选择区域'
  }]

  let _this = null;
  export default {
    components: {result},
    mixins: [mixinDevice],
    data() {
      return {
        config: {
          site_name: '',
          site_desc: '',
          site_logo: '',
          system_admin_logo: '',
          property_self_logo: '',
        },
        form: this.$form.createForm(this),
        is_show: true,
        hide: false,
        provinceData,
        showProvince: 0,
        randomNumber:'',
        activeKey:'1',
        cityData,
        showCity: 0,
        areaData,
        showArea: 0,
        search: {
          provinceId: '0',
          cityId: '0',
          areaId: '0',
        },
        adderss: {
          province: '',
          city: '',
          area: '',
          infos: ''
        },
        state: {
          time: 60,
          smsSendBtn: false,
          passwordLevel: 0,
          passwordLevelChecked: false,
          percent: 10,
          progressColor: '#FF0000'
        },
        registerBtn: false,
        package_id: '',
        packageTip: '请先点击选择套餐',
        package_price: '',
        package_title: '',
        register_data: {
          villageName: '',
          villageAddress: '',
          propertyName: '',
          propertyAdder: '',
          propertyTel: '',
          account: '',
        },
      }
    },
    mounted() {
      this.getConfig()
      console.log('111',this.activeKey)
      console.log('22222',this.$route.params.id)
      this.package_id = this.$route.params.id;
      if (this.package_id){
        this.activeKey='2'
        this.randomNumber = this.$route.params.randomNumber;
        this.package_id = this.$route.params.id;
        this.package_price = this.$route.params.title;
        this.package_title = this.$route.params.price;
        this.packageTip = '';
        console.log(this.$route.params.id);
        console.log(this.$route.params.title);
        console.log(this.$route.params.price);
        let register = sessionStorage.getItem('register_data');
        let register_arr = JSON.parse(register);
        if (register_arr && register_arr.time + 1800 < Math.round(new Date() / 1000)) {
          sessionStorage.removeItem('register_data');
        } else if (register_arr) {
          this.register_data = register_arr;
          this.search.provinceId = register_arr.provinceId;
          this.search.cityId = register_arr.cityId;
          this.search.areaId = register_arr.areaId;
          this.adderss.province = register_arr.province;
          this.adderss.city = register_arr.city;
          this.adderss.area = register_arr.area;
          this.register_data.villageAddress = register_arr.province + register_arr.city + register_arr.area;
        }
        this.getProvince()
        this.getCity()
        this.getArea()
      }else{
        this.packageTip = '请先点击选择套餐';
        this.activeKey='1'
      }
    },
    computed: {
      passwordLevelClass() {
        return levelClass[this.state.passwordLevel]
      },
      passwordLevelName() {
        return levelNames[this.state.passwordLevel]
      },
      passwordLevelColor() {
        return levelColor[this.state.passwordLevel]
      }
    },
    activated() {

    },
    methods: {
      inputChange(e) {
        console.log('0inputChange',e)
        console.log('1inputChange',this.package_id)
        console.log('2inputChange',this.packageTip)
        if (!this.package_id) {
          this.$message.warning('请先点击选择套餐');
        }
      },
      getConfig() {
        const config = this.$store.getters.config
        if (Object.keys(config).length) {
          this.config = config
        } else {
          setTimeout(() => {
            this.getConfig()
          }, 300)
        }
      },
      active(key) {
        this.activeKey = key;
      if (key==2){
          this.package_id = this.$route.params.id;
          this.randomNumber = this.$route.params.randomNumber;
          this.package_price = this.$route.params.title;
          this.package_title = this.$route.params.price;
          if (this.package_id && this.package_title) {
            this.packageTip = '';
          } else {
            this.packageTip = '请先点击选择套餐';
          }
          console.log(this.$route.params.id);
          console.log(this.$route.params.title);
          console.log(this.$route.params.price);
          let register = sessionStorage.getItem('register_data');
          let register_arr = JSON.parse(register);
          if (register_arr && register_arr.time + 1800 < Math.round(new Date() / 1000)) {
            sessionStorage.removeItem('register_data');
          } else if (register_arr) {
            this.register_data = register_arr;
            this.search.provinceId = register_arr.provinceId;
            this.search.cityId = register_arr.cityId;
            this.search.areaId = register_arr.areaId;
            this.adderss.province = register_arr.province;
            this.adderss.city = register_arr.city;
            this.adderss.area = register_arr.area;
            this.register_data.villageAddress = register_arr.province + register_arr.city + register_arr.area;
          }
          this.getProvince()
          this.getCity()
          this.getArea()
        }
      },
      qyRegister(){
        this.request(userApi.qyRegister)
          .then((res) => {
            if (res){
              console.log('res',res);
              window.location.href=res;
            }
          })
      },
      install(){
        this.request(userApi.qyIstall)
          .then((res) => {
            if (res){
              console.log('res',res);
              window.location.href=res;
            }
          })
      },
      likeClick() {
        const {form: {validateFields}} = this
        validateFields({force: true}, (err, val) => {
          let data_val = {};
          data_val.provinceId = this.search.provinceId;
          data_val.cityId = this.search.cityId;
          data_val.areaId = this.search.areaId;
          data_val.province = this.adderss.province;
          data_val.city = this.adderss.city;
          data_val.area = this.adderss.area;
          data_val.package_id = this.package_id;
          data_val.propertyAdder = val.propertyAdder;
          data_val.propertyName = val.propertyName;
          data_val.propertyTel = val.propertyTel;
          data_val.villageName = val.villageName;
          data_val.account = val.account;
          data_val.time = Math.round(new Date() / 1000);
          // var register = sessionStorage.getItem('register_data');
          sessionStorage.setItem('register_data', JSON.stringify(data_val));
        });
        this.$router.push({name: 'communityPackages', query: {randomNumber: this.randomNumber,},})
      },
      ok_emit(key,randomNumber){
        this.activeKey = key
        this.randomNumber=randomNumber
        this.getProvince()
        this.getCity()
        this.getArea()
        console.log('randomNumber',randomNumber)
      },
      handlePasswordLevel(rule, value, callback) {
        let level = 0

        // 判断这个字符串中有没有数字
        if (/[0-9]/.test(value) && /[a-z]/.test(value)) {
          level++
        }
        // 判断字符串中有没有字母
        if (/[A-Z]/.test(value)) {
          level++
        }
        // 判断字符串中有没有特殊符号
        if (/[^0-9a-zA-Z_]/.test(value)) {
           level++
        }
        if(/[0-9a-zA-Z_]/.test(value) && level<1){
            level=1;
        }
        
        if(value && value.length<6){
            //长度不够
            level=1;
        }
        // 判断字符串中有没有特殊符号
        /*
        var regexTmp = new RegExp('[~!@#$%^&*()_-+={}[]|\:;\"\'<>,.?/]');
        if (regexTmp.test(value)) {
           level++
        }
        */
        this.state.passwordLevel = level
        this.state.percent = level * 30
        if (level >= 2) {
          if (level >= 3) {
            this.state.percent = 100
            callback()
          }else{
              callback(new Error('密码强度不够，必须包含大小写字母、数字、特殊字符'))
          }
          
        } else {
          if (level === 0) {
            this.state.percent = 10
          }
          if(value.length>0){
              callback(new Error('密码强度不够，必须包含大小写字母、数字、特殊字符'))
          }
        }
      },

      handleProvinceChange(value) {
        this.search.provinceId = value
        let obj = {}
        obj = this.provinceData.find((item) => {
          return item.id === value;
        });
        this.adderss.province = obj.name
        this.getCity()
        this.$emit('handleSelect', this.search)
        // layer.alert(content, [options, yes])
      },
      handleCityChange(value) {
        this.search.cityId = value
        let obj = {}
        obj = this.cityData.find((item) => {
          return item.id === value;
        })
        this.adderss.city = obj.name
        this.getArea()
        this.$emit('handleSelect', this.search)
      },
      handleAreaChange(value) {
        let obj = {}
        obj = this.areaData.find((item) => {
          return item.id === value;
        });
        this.adderss.area = obj.name
        if (this.search.provinceId == 0 || this.search.cityId == 0 || this.search.areaId == 0) {
          this.adderss.infos = ''
        } else {
          this.adderss.infos = this.adderss.province + this.adderss.city + this.adderss.area
        }
        this.hide = false
        this.search.areaId = value
        this.$emit('handleSelect', this.search)
        this.form.setFieldsValue({
          //villageAddress: this.adderss.infos,
          villageAddress: this.adderss.province + this.adderss.city + this.adderss.area
        })
      },
      getProvince() {
        this.request(areaPlatformApi.getSelectPropertyProvince)
          .then((res) => {
            console.log(res.list)
            this.provinceData = [{
              'id': '0',
              'name': '请选择省份'
            }];
            if (res.error == 0) {
              this.provinceData = this.provinceData.concat(res.list)
            }
            this.showProvince = 1
          })
      },
      getCity() {
        if (this.search.provinceId > 0) {
          this.request(areaPlatformApi.getSelectPropertyCity, {'id': this.search.provinceId, 'type': 2})
            .then((res) => {
              console.log(res)
              this.cityData = [{
                'id': '0',
                'name': '请选择城市'
              }];
              if (res.error == 0) {
                this.cityData = this.cityData.concat(res.list)
              }

            })
        } else {
          this.cityData = [{
            'id': '0',
            'name': '请选择城市'
          }];
        }
        this.showCity = 1;
      },
      getArea() {
        let searchParam = {
          'id': this.search.cityId,
          'type': 3
        }
        if (this.search.cityId > 0) {
          this.request(areaPlatformApi.getSelectPropertyArea, searchParam)
            .then((res) => {
              this.areaData = [{
                'id': '0',
                'name': '请选择区域'
              }];
              if (res.error == 0) {
                this.areaData = this.areaData.concat(res.list)
              }
              this.showArea = 1
            })
        } else {
          this.areaData = [{
            'id': '0',
            'name': '请选择区域'
          }];
        }
        this.showArea = 1
      },
      handlePasswordCheck(rule, value, callback) {
        const password = this.form.getFieldValue('password')
        console.log('value', value)
        if (value === undefined) {
          callback(new Error('请输入密码'))
        }
        if (value && password && value.trim() !== password.trim()) {
          callback(new Error('两次密码不一致'))
        }
        callback()
      },
      handlePhoneCheck(rule, value, callback) {
        console.log('handlePhoneCheck, rule:', rule)
        console.log('handlePhoneCheck, value', value)
        console.log('handlePhoneCheck, callback', callback)

        callback()
      },
      handlePasswordInputClick() {
        if (!this.isMobile()) {
          this.state.passwordLevelChecked = true
          return
        }
        this.state.passwordLevelChecked = false
      },
      handleSubmit() {
        const {form: {validateFields}, state, $router} = this
        validateFields({force: true}, (err, values) => {
          values.provinceId = this.search.provinceId
          values.cityId = this.search.cityId
          values.areaId = this.search.areaId
          values.villageAddress = this.adderss.province + this.adderss.city + this.adderss.area
          values.package_id = this.package_id
          values.randomNumber = this.randomNumber
          console.log(err);
          console.log(values)
          if (!err) {
            state.passwordLevelChecked = false
            this.request(userApi.regCheck, values)
              .then((res) => {
                if (res) {
                  sessionStorage.removeItem('register_data');
                  this.$notification.success({
                    message: '恭喜您注册成功',
                    // description: `注册成功`
                  })
                  $router.push({name: 'communityLogin', params: {...values}})
                }
              })
          }
        })
      },
      requestFailed(err) {
        this.$notification['error']({
          message: '错误',
          description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
          duration: 4
        })
        this.registerBtn = false
      },
    },
    watch: {
      'state.passwordLevel'(val) {
        console.log(val)
      },
      hide(val) {
        // if(val) {
        //     document.body.addEventListener('click', (e) => {
        //         if (e.target.id !== 'villageAddress') {
        //                 this.hide= false;
        //         }
        //     })
        // } else {
        //     document.body.removeEventListener('click', () => {});
        // }
      }
    }
  }
</script>
<style lang="less" scoped>
  .user-layout-register1 {

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .register-button {
    width: 50%;
  }

  .login {
    line-height: 40px;
  }

  }
  .ant-form-item {
    margin-bottom: 15px;
  }
  .ant-tabs .ant-tabs-top-content, .ant-tabs .ant-tabs-bottom-content {
    width: 100%;
    margin: 40px;
  }
  .but-t{
    border: 1px solid #ccc;
    width: 428px;
    margin-bottom: 18px;
    height: 40px;
  }
  .but-pack{
    margin-left: 15px;
    width: 428px;
    text-align: left;
    line-height: 40px;
  }
  .but-x{
    margin-left: 15px;
    width: 428px;
    text-align: left;
    line-height: 40px;
  }

  .regster-view {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    float: left;
    height: 100%;
    width: calc(50% - 1px);
    text-align: center;
    margin-bottom: 10%;
    margin-top: 10%;
  }
  .register-content {
    width: 100%;
  }
  .title {
    font-size: 20px;
    font-weight: 600;
    color: #1890ff;
  }
  .desc {
    font-size: 16px;
    font-weight: 400;
    color: #666;
    margin: 50px 0 87px 0;
  }
  .login-header-left-img{
    .title{
      font-size: 33px;

      font-weight: 600;
      position: relative;
      top: 2px;
    }

  }
</style>
