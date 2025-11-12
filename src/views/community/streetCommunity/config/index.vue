<template>
   <div class="account-community-config-info-view">
        <a-row :gutter="16">
            <a-col :md="24" :lg="16">
                <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">


                    <a-tabs default-active-key="1">
                        <a-tab-pane key="1" >
                            <span slot="tab">
                                <a-icon type="基本设置" />基本设置</span>
                            <div class="message-suggestions-list-box">
                                <a-form-item label="名称">
                                    <a-input style="color:#333333" v-model="area_info.name" :disabled="true"/>
                                </a-form-item>
                                <a-form-item label="所属区域">
                                    <a-cascader
                                            style="color:#333333"
                                            :disabled="true"
                                            :options="area_options"
                                            :value="choose_area"
                                            @change="onChange"
                                    />
                                </a-form-item>
                                <a-form-item label="地址">
                                    <a-input style="color:#333333" v-model="area_info.address"/>
                                </a-form-item>
                                <a-form-item label="面积 (单位：平方米)">
                                    <a-input style="color:#333333" v-model="area_info.area_covered"/>
                                </a-form-item>
                                <a-form-item label="人口">
                                    <a-row>
                                        <a-col :span="23">
                                            <a-input style="color:#000000" :disabled="true" v-model="area_info.population"/>
                                        </a-col>
                                        <a-col :span="1">
                                            <custom-tooltip v-if="$store.getters.config" key="2" size="16px" :text="'该数量根据其下归属的'+$store.getters.config.house_name+'人口总数变化而变化'" />
                                        </a-col>
                                    </a-row>
                                </a-form-item>
                                <a-form-item label="联系电话">
                                    <a-input style="color:#333333" v-model="area_info.phone"/>
                                </a-form-item>
                                <a-form-item label="老年人年龄标准">
                                    <a-col :span="23">
                                        <a-input style="color:#333333" v-model="area_info.age"/>
                                    </a-col>
                                    <a-col :span="1">
                                        <custom-tooltip key="2" size="16px" text="该标准用于判断符合智慧养老的条件限制，以身份证号获取的年龄为准" />
                                    </a-col>
                                </a-form-item>
                                <a-form-item label="logo">
                                    <div>
                                        <a-upload
                                                name="img"
                                                list-type="picture-card"
                                                class="avatar-uploader"
                                                :show-upload-list="false"
                                                :action="upload_url"
                                                :before-upload="beforeUpload"
                                                @change="handleChange"
                                        >
                                            <img v-if="imageUrl" :src="imageUrl" class="imgname imageUrl" alt="img" />
                                            <div v-else>
                                                <a-icon :type="loading ? 'loading' : 'plus'" />
                                                <div class="ant-upload-text">
                                                    上传
                                                </div>
                                            </div>
                                        </a-upload>
                                    </div>
                                </a-form-item>
                            </div>
                        </a-tab-pane>
                        <a-tab-pane key="2">
                            <span slot="tab">
                              <a-icon type="导航配置"/>导航配置</span>
                            <div class="message-suggestions-list-box">
                                <a-form-item label="标题配置">
                                    <a-input :disabled="area_info.visualize_nav_status" :maxLength="15" v-model="area_info.visualize_nav.visualize_title" placeholder="请输入15个字以内"/>
                                </a-form-item>
                                <a-form-item label="导航一">
                                    <a-input :disabled="area_info.visualize_nav_status" :maxLength="4" v-model="area_info.visualize_nav.visualize_nav1" placeholder="请输入4个字以内"/>
                                </a-form-item>
                                <a-form-item label="导航二">
                                    <a-input :disabled="area_info.visualize_nav_status" :maxLength="4" v-model="area_info.visualize_nav.visualize_nav2" placeholder="请输入4个字以内"/>
                                </a-form-item>
                                <a-form-item label="导航三">
                                    <a-input :disabled="area_info.visualize_nav_status" :maxLength="4" v-model="area_info.visualize_nav.visualize_nav3" placeholder="请输入4个字以内"/>
                                </a-form-item>
                                <a-form-item label="导航四">
                                    <a-input :disabled="area_info.visualize_nav_status" :maxLength="10" v-model="area_info.visualize_nav.visualize_nav4" placeholder="请输入10个字以内"/>
                                </a-form-item>
                                <a-form-item label="VR实景" v-if="area_info.visualize_nav && area_info.visualize_nav.have_vr_720yun*1>0">
                                   <a-switch 
                                      checked-children="开启" 
                                      un-checked-children="关闭"
                                      :checked="area_info.visualize_nav.vr720yunConfig.vr_720yun_switch == 1?true:false"
                                      @change="(checked) => {area_info.visualize_nav.vr720yunConfig.vr_720yun_switch = checked?1:0}" />
                                </a-form-item>
                                <a-form-item label="VR实景跳转链接" v-if="area_info.visualize_nav && area_info.visualize_nav.have_vr_720yun*1>0">
                                    <a-input :maxLength="150" v-model="area_info.visualize_nav.vr720yunConfig.vr_720yun_url" placeholder="请输入VR实景跳转链接"/>
                                </a-form-item>
                            </div>
                        </a-tab-pane>
                    </a-tabs>
                    <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                        <a-button type="primary" html-type="submit" :loading="loginBtn" :disabled="loginBtn">
                            更新信息
                        </a-button>
                    </a-form-item>

                </a-form>

            </a-col>
        </a-row>
  </div>
</template>
<script>
import CustomTooltip from '@/components/CustomTooltip/CustomTooltip'
import configStreetCommunityApi from '@/api/community/streetCommunity'
import FormItem from '@/components/FormItem/FormItem'
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
export default {
  name: 'streetCommunityConfigIndex',
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
          'phone': '0564-5741092',
          'visualize_nav':[],
          'visualize_nav_status':false
      },
      loginBtn: false,
      upload_url:'/v20/public/index.php/'+configStreetCommunityApi.streetUpload,
      imageUrl: '',
      logo_img: '',
      img:'',
        loading:false,
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
          this.imageUrl = res.info.logo;
          this.logo_img = res.info.logo_img;
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
          indexParams.address = area_info.address
          indexParams.area_covered = area_info.area_covered
          indexParams.phone = area_info.phone
          indexParams.age = area_info.age

            indexParams.visualize_nav = area_info.visualize_nav
          if (this.img) {
            indexParams.logo = this.img;
          } else if (this.logo_img) {
            indexParams.logo = this.logo_img;
          } else if (this.imageUrl) {
            indexParams.logo = this.imageUrl;
          }
          this.request(configStreetCommunityApi.addIndex,indexParams)
          .then((res) => {
            console.log('res',res)
            if (res) {
                this.$message.success('更新成功！');
            }
            this.loginBtn = false
          }).catch((error)=>{
            this.loginBtn = false
          })
        } else {
          this.loginBtn = false
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
    handleChange(info) {
        if (info.file.status === 'uploading') {
            this.loading = true;
            return;
        }
        if (info.file.status === 'done') {
              // Get this url from response in real world.
              getBase64(info.file.originFileObj, imageUrl => {
                  this.imageUrl = imageUrl;
                  this.loading = false;
              });
              if(info.file.response.status === 1000)
              {
                  this.img = info.file.response.data;
              }
        }
    },
    beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            this.$message.error('You can only upload JPG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            this.$message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
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
    .imgname{
      width: 80px;
    }
</style>