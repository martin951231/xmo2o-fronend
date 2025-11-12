<template>
  <div class="main user-layout-register" style="width: 428px;">
    <h3 style="text-align: center;color: #1890ff"><span>账户注册</span>
      <div class="lines" style=""></div>
    </h3>
    <a-form ref="formRegister" :form="form"  id="formRegister" >
      <a-form-item>
        <a-input
          size="large"
          type="text"
          @click="hide=false"
          :placeholder="$store.getters.config.house_name+'名称'"
          autocomplete="off"
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
        <a-select v-if="showProvince" :default-value="search.provinceId" v-model="search.provinceId"  style="width: 115px"  @change="handleProvinceChange">
          <a-select-option v-for="province in provinceData" :key="province.id" :value="province.id" >
            {{ province.name }}
          </a-select-option>
        </a-select>
        <a-select style="width: 115px" v-model="search.cityId" v-if="showCity" @change="handleCityChange" >
          <a-select-option v-for="city in cityData" :key="city.name" :value="city.id">
            {{ city.name }}
          </a-select-option>
        </a-select>
        <a-select style="width: 115px" v-model="search.areaId" v-if="showArea" @change="handleAreaChange" >
          <a-select-option v-for="area in areaData" :key="area.name"  :value="area.id">
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
          <div :style="{ width: '240px' }" >
            <div :class="['user-register', passwordLevelClass]">强度：<span>{{ passwordLevelName }}</span></div>
            <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor " />
            <div style="margin-top: 10px;">
              <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
            </div>
          </div>
        </template>
        <a-form-item>
          <a-input
            size="large"
            type="password"
            @click="handlePasswordInputClick"
            autocomplete="off"
            placeholder="至少6位密码，区分大小写"
            v-decorator="['password', {rules: [{ required: true, message: '至少6位密码，区分大小写'}, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
          ></a-input>
        </a-form-item>
<!--        <router-link  :to="{ name: 'communityPackages' }"   @click="likeClick" style="color: #b61d1d;">-->
<!--        <div class="but-t" style="">-->
<!--            <div class="but-pack">选择套餐</div>-->
<!--            <div class="but-x" v-if="package_title">已选：{{package_price}} {{package_title}} ></div>-->
<!--        </div>-->
<!--        </router-link>-->
        <a @click="likeClick" style="color: #b61d1d;">
          <div class="but-t" style="">
            <div class="but-pack">选择套餐</div>
            <div class="but-x" v-if="package_title">已选：{{package_price}} {{package_title}} ></div>
          </div>
        </a>
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
        <label style="color: #ccc;">注册即表示同意<router-link :to="{ name: 'communityLogin' }" style="color: #ccc;">《{{$store.getters.config.house_name}}注册协议》</router-link></label>
      </div>
      <div class="user-login-others" style="text-align: center;">
        <router-link :to="{ name: 'communityLogin', query:queryParam }" style="color: #b61d1d">使用已有账户登录</router-link>
      </div>
    </a-form>
  </div>
</template>
<script>
import { mixinDevice } from '@/utils/mixin.js'
import userApi from '@/api/user/community/index.js'
import areaPlatformApi from '@/api/common/platform/area.js'
import path from '@/router/router-path.js'
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
var _this = this;

export default {
    name: 'Register',
    components: {
    },
    mixins: [mixinDevice],
    data () {
      return {
          form: this.$form.createForm(this),
          hide:false,
          provinceData,
          showProvince: 0,
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
          package_price: '',
          package_title: '',
          register_data: {
              villageName: '',
              villageAddress: '',
              propertyName: '',
              propertyAdder: '',
              propertyTel: '',
              account:'',
          },
          queryParam: {}
      }
    },
    computed: {
        passwordLevelClass () {
          return levelClass[this.state.passwordLevel]
        },
        passwordLevelName () {
          return levelNames[this.state.passwordLevel]
        },
        passwordLevelColor () {
          return levelColor[this.state.passwordLevel]
        }
    },
    activated(){
        this.queryParam = this.$route.query;
        this.package_id = this.$route.params.id;
        this.package_price = this.$route.params.title;
        this.package_title = this.$route.params.price;
        console.log(this.$route.params.id);
        console.log(this.$route.params.title);
        console.log(this.$route.params.price);
        let register = sessionStorage.getItem('register_data');
        let register_arr = JSON.parse(register);
        if(register_arr && register_arr.time+1800<Math.round(new Date() / 1000))
        {
            sessionStorage.removeItem('register_data');
        }else if(register_arr){
            this.register_data = register_arr;
            this.search.provinceId = register_arr.provinceId;
            this.search.cityId = register_arr.cityId;
            this.search.areaId = register_arr.areaId;
            this.adderss.province = register_arr.province;
            this.adderss.city = register_arr.city;
            this.adderss.area = register_arr.area;
            this.register_data.villageAddress = register_arr.province+register_arr.city+register_arr.area;
        }
        this.getProvince()
        this.getCity()
        this.getArea()
  },
    mounted(){
        this.queryParam = this.$route.query;
        // document.addEventListener('click',function(e){
        //     if (e.target.id !== 'villageAddress') {
        //             this.hide= false;
        //     }
        // })
    },
    methods: {
        likeClick() {
            const { form: { validateFields }} = this
            validateFields({ force: true }, (err, val) => {
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
            this.$router.push({name:'communityPackages',query:this.queryParam})
        },
        handlePasswordLevel (rule, value, callback) {
          let level = 0

          // 判断这个字符串中有没有数字
          if (/[0-9]/.test(value)) {
            level++
          }
          // 判断字符串中有没有字母
          if (/[a-zA-Z]/.test(value)) {
            level++
          }
          // 判断字符串中有没有特殊符号
          if (/[^0-9a-zA-Z_]/.test(value)) {
            level++
          }
          this.state.passwordLevel = level
          this.state.percent = level * 30
          if (level >= 2) {
            if (level >= 3) {
              this.state.percent = 100
            }
            callback()
          } else {
            if (level === 0) {
              this.state.percent = 10
            }
            callback(new Error('密码强度不够'))
          }
        },
        handleProvinceChange (value) {
            this.search.provinceId = value
            let obj = {}
            obj = this.provinceData.find((item)=>{
                return item.id === value;
            });
            this.adderss.province = obj.name
            this.getCity()
            this.$emit('handleSelect', this.search)
            // layer.alert(content, [options, yes])
        },
        handleCityChange (value) {
            this.search.cityId = value
            let obj = {}
            obj = this.cityData.find((item)=>{
                return item.id === value;
            })
            this.adderss.city = obj.name
            this.getArea()
            this.$emit('handleSelect', this.search)
        },
        handleAreaChange (value) {
            let obj = {}
            obj = this.areaData.find((item)=>{
                return item.id === value;
            });
            this.adderss.area = obj.name
            if (this.search.provinceId == 0 || this.search.cityId==0 || this.search.areaId==0) {
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
        getProvince () {
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
        getCity () {
            if(this.search.provinceId>0) {
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
            }else{
                this.cityData = [{
                    'id': '0',
                    'name': '请选择城市'
                }];
            }
            this.showCity = 1;
        },
        getArea () {
           let searchParam = {
               'id': this.search.cityId,
               'type': 3
           }
           if(this.search.cityId>0) {
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
           }else{
               this.areaData = [{
                   'id': '0',
                   'name': '请选择区域'
               }];
           }
            this.showArea = 1
          },
        handlePasswordCheck (rule, value, callback) {
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
        handlePhoneCheck (rule, value, callback) {
          console.log('handlePhoneCheck, rule:', rule)
          console.log('handlePhoneCheck, value', value)
          console.log('handlePhoneCheck, callback', callback)

          callback()
        },
        handlePasswordInputClick () {
          if (!this.isMobile()) {
            this.state.passwordLevelChecked = true
            return
          }
          this.state.passwordLevelChecked = false
        },
        handleSubmit () {
          const { form: { validateFields }, state, $router } = this
          validateFields({ force: true }, (err, values) => {
              values.provinceId = this.search.provinceId
              values.cityId = this.search.cityId
              values.areaId = this.search.areaId
              values.villageAddress = this.adderss.province + this.adderss.city + this.adderss.area
              values.package_id = this.package_id
              console.log(err);
              console.log(values)
              if (!err) {
                state.passwordLevelChecked = false
                  this.request(userApi.regCheck,values)
                      .then((res) => {
                          if (res) {
                              sessionStorage.removeItem('register_data');
                              this.$notification.success({
                                  message: '恭喜您注册成功',
                                  // description: `注册成功`
                              })
                              $router.push({ name: 'communityLogin', params: { ...values } })
                          }
                      })
              }
          })
        },
        requestFailed (err) {
          this.$notification['error']({
            message: '错误',
            description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
            duration: 4
          })
          this.registerBtn = false
        },
    },
  watch: {
    'state.passwordLevel' (val) {
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
<style lang="less">
  .but-t{
    border: 1px solid #ccc;width: 348px;margin-bottom: 30px;height: 38px;
  }
  .but-pack{
    margin: 8px;width: 100px;float: left;
  }
  .but-x{
    float: right;width: 200px;text-align:right;margin: 8px;
  }
  .wrap{
    /*position:fixed;*/
    /*border: 1px solid #eee;*/
    /*width: 348px;*/
    /*height: 100px;*/
    /*background:#fff;*/
    z-index: 99;
  }
  .user-register {

    &.error {
      color: #ff0000;
    }

    &.warning {
      color: #ff7e05;
    }

    &.success {
      color: #52c41a;
    }

  }
  .lines{
    width: 70px;
    background-color: #1890ff;
    height: 2px;
    margin-left: 40%;
    margin-top: 10px
  }
  .user-layout-register {
    /*border: 1px solid red;*/
    padding: 25px 40px 0px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 20px 30px 0 rgba(63,63,65,.06);
  }
  .user-login-others {
    width:428px;
    border-top: solid #eee 1px;
    padding: 20px;
    margin-left: -40px;
    border-radius: 10px;
    background-color: #fcfcfc
  }
  .user-layout-register {
    .ant-input-group-addon:first-child {
      background-color: #fff;
    }
  }
</style>
<style lang="less" scoped>
  .user-layout-register {

    & > h3 {
      font-size: 16px;
      margin-bottom: 20px;
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

    .register-button {
      width: 50%;
    }

    .login {
      float: right;
      line-height: 40px;
    }
  }
</style>
