<template>
   <div class="account-community-config-info-view">
        <a-row :gutter="16">
            <a-col :md="24" :lg="16">
                <a-form
                id="formLogin"
                class="user-layout-login"
                ref="formLogin"
                :form="form"
                @submit="handleSubmit"
                >
                     <form-item 
                        title="名称"
                        type="text"
                        name="name"
                        :disabled="true"
                        :value="area_info.area_name"
                    />
                    <a-form-item
                        label="所属区域"
                    >
                        <a-cascader
                            style="color:#333333"
                            :disabled="true" 
                            :options="area_options"
                            :value="choose_area"
                            @change="onChange"
                        />
                    </a-form-item>
                    <form-item 
                        title="地址"
                        type="text"
                        name="address"
                        :required="true"
                        requiredMessage="请填写地址"
                        :value="area_info.address"
                    />

                    <a-form-item
                        label="面积 (单位：平方米)"
                    >
                        <a-input style="color:#333333" v-model="area_info.area_covered" size="large"/>
                    </a-form-item>

                    
                    <a-form-item
                        label="人口"
                    >
                    <a-row>
                        <a-col :span="23">
                            <a-input style="color:#000000" :disabled="true" v-model="area_info.population" size="large"/>
                        </a-col>
                        <a-col :span="1">
                            <custom-tooltip key="2" size="16px" :text="'该数量根据其下归属的'+$store.getters.config.house_name+'人口总数变化而变化'" />
                        </a-col>
                    </a-row>
                    </a-form-item>


                    <a-form-item
                        label="联系电话"
                    >
                        <a-input style="color:#333333" v-model="area_info.phone" size="large"/>
                    </a-form-item>

                    <a-form-item style="margin-top:24px">
                        <a-button
                        size="large"
                        type="primary"
                        htmlType="submit"
                        class="login-button"
                        :loading="loginBtn"
                        :disabled="loginBtn"
                        >更新信息</a-button>
                    </a-form-item>

                </a-form>

            </a-col>
        </a-row>
  </div>
</template>
<script>
import CustomTooltip from '../../../components/CustomTooltip/CustomTooltip'
import configStreetCommunityApi from '@/api/community/streetCommunity'
import FormItem from '@/components/FormItem/FormItem'

export default {
  components: {
    CustomTooltip,
    FormItem
  },
  data () {
    return {
        area_options: [
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          children: [
            {
              value: 'hangzhou',
              label: 'Hangzhou',
              children: [
                {
                  value: 'xihu',
                  label: 'West Lake',
                  code: 752100,
                },
              ],
            },
          ],
        }
      ],
      choose_area: [],
      form: this.$form.createForm(this),
      area_info: {
          'area_name': '街道哟',
          'address':'步行街',
          'area_covered': '1000',
          'population':10086,
          'phone': '0564-5741092'
      },
      loginBtn: false
    }
  },
  mounted () {
    this.getStreetCommunityConfig()
  },
  methods: {
    getStreetCommunityConfig() {
      this.request(configStreetCommunityApi.config)
        .then((res) => {
          console.log('res',res)
          this.area_info = res.info
          this.area_options = res.area_options
          this.choose_area = res.choose_area
        //   if (res.login_role) {
        //     this.login_role_arr = res.login_role
        //   }
              // res即为接口返回值，在这里做对应的逻辑处理
      })
    },
    handleSubmit  (e) {
      e.preventDefault()
      const {
        form: { validateFields }
      } = this
      this.loginBtn = true
      const area_info = this.area_info
      const validateFieldsKey = ['address']
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          console.log('login form', values)
          const indexParams = { ...values }
          console.log(values)
          indexParams.address = values.address
          indexParams.area_covered = area_info.area_covered
          indexParams.phone = area_info.phone
          
          this.request(configStreetCommunityApi.addIndex,indexParams)
          .then((res) => {
            console.log('res',res)
            if (res) {
                this.$message.success('更新成功！');
            }
            this.loginBtn = false
          })
        }
      })
    },
    onChange(value) {
      console.log(value);
    },
    getPopupContainer(trigger) {
      return trigger.parentElement;
    },
    handleAreaClick(e, label, option) {
      e.stopPropagation();
      console.log('clicked', label, option);
    },
  }
}
</script>

<style lang="less" scoped>
    .account-community-config-info-view {
        margin: 30px 20px;
        background-color: white;
        padding: 30px;
    }
</style>