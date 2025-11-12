<template>
  <div @click="mobileColor">
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-tabs :default-active-key="0" @change="firstTabChange">
        <a-tab-pane :key="index" :tab="item.gname" v-for="(item, index) of groupList">
          <a-tabs type="card" @change="secondTabChange" >
            <a-tab-pane :key="itemTab.tab_id" :tab="itemTab.name" v-for="itemTab of configTab">
              <a-form @submit="handleSubmit" :form="form">
                <div style="font-size:18px;color:#000;margin:30px 0 40px 212px;" v-if="itemTab.tab_id == 'marketing_service'">申请业务经理资格设置</div>
                <div style="font-size:18px;color:#000;margin:30px 0 40px 212px;" v-if="itemTab.tab_id == 'marketing_agent'">申请区域代理资格设置</div>
		<div v-for="(itemv,index) of itemTab.list" :key="itemv.name">
                <div v-if="(itemv.name !== 'mobile_head_floor_color' && itemv.name !== 'mobile_head_affect' && itemv.name !== 'mobile_head_bg_img') || (((itemv.name === 'mobile_head_floor_color' && mobileEffect==1) || itemv.name === 'mobile_head_affect' || (itemv.name === 'mobile_head_bg_img' && mobileEffect==2)) && huizhisq)" :key="itemv.name">
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
                    v-else-if="itemv.name === 'mobile_head_color'"
                    :label="itemv.info"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :name="itemv.name"
                  >
                    <div class="color-picker">
                      <colorPicker class="color-box" ref="mobileHeadInfo" v-model="colorHeadInfo" @change="headleHeadChangeColor" />
                      <p class="color-name">{{ colorHeadInfo }}</p>
                    </div>
                  </a-form-item>

                  <a-form-item
                    v-else-if="itemv.name === 'mobile_head_floor_color' && mobileEffect==1"
                    :label="itemv.info"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :name="itemv.name"
                  >
                    <div class="color-picker">
                      <colorPicker class="color-box" ref="mobileFloorInfo" v-model="colorFloorInfo" @change="headleFloorChangeColor" />
                      <p class="color-name">{{ colorFloorInfo }}</p>
                    </div>
                  </a-form-item>
                      <form-item
                         v-else-if="itemv.name === 'mobile_head_bg_img' && mobileEffect==2"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        :title="itemv.info"
                        :name="itemv.name"
                        :type="itemv.type"
                        :required="Boolean(itemv.required)"
                        :value="itemv.value"
                        :tips="itemv.desc"
                        :digits="itemv.digits ? true:false"
                        :url="Boolean(itemv.url)"
                        :max="itemv.max ? (itemv.max*1):99999999"
                        :min="itemv.min ? (itemv.min*1):0"
                        :number="itemv.isnumber ? true:false"
                        :selectArray="itemv.typeValue"
                        :rows="Number(itemv.rows)"
                        :placeholder="itemv.placeholder"
                        :key="itemv.gid"
                        :filetype="itemv.filetype ? itemv.filetype:''"
                        :fsize="itemv.fsize ? itemv.fsize:0"
                        :maxlength="itemv.maxlength ? (itemv.maxlength*1):21000"
                        @uploadChange="uploadChange"
                      ></form-item>

                  <a-form-item
                    v-else-if="itemv.name === 'mobile_head_affect'"
                    :label="itemv.info"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :extra="itemv.desc"
                  >
                    <a-row :gutter="8">
                      <a-col :span="12">
                        <a-radio-group
                          :key="itemv.name"
                          v-decorator="[itemv.name, { initialValue: itemv.value }]"
                          :name="itemv.name"
                          :options="itemv.typeValue"
                          @change="effectChange"
                        ></a-radio-group>
                      </a-col>
                    </a-row>
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
                    :digits="itemv.digits ? true:false"
                    :url="Boolean(itemv.url)"
                    :max="itemv.max ? (itemv.max*1):99999999"
                    :min="itemv.min ? (itemv.min*1):0"
                    :number="itemv.isnumber ? true:false"
                    :selectArray="itemv.typeValue"
                    :rows="Number(itemv.rows)"
                    :placeholder="itemv.placeholder"
                    :key="itemv.gid"
                    :filetype="itemv.filetype ? itemv.filetype:''"
                    :fsize="itemv.fsize ? itemv.fsize:0"
                    :maxlength="itemv.maxlength ? (itemv.maxlength*1):21000"
                    @uploadChange="uploadChange"
                  ></form-item>
                  </div>
                </div>
                <div class="padding_bottom" style="padding-bottom: 50px;"></div>
                <a-form-item class="bottom_form" :wrapperCol="{ span: 24 }" style="text-align: left">
                  <a-button style="padding: 6px 50px;" htmlType="submit" type="primary">提交</a-button>
                  <!--                  <a-button htmlType="submit" type="primary" style="margin-left:10px;">获取及时聊天的key</a-button>-->
                </a-form-item>
              </a-form>
            </a-tab-pane>
          </a-tabs>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>
<script>
import configPlatformApi from '@/api/config/platform/config'
import FormItem from '@/components/FormItem/FormItem'
import RichText from '@/components/RichText/RichText'
import { transferFormValue,_updateMenu } from '@/utils/util'
import vcolorpicker from 'vcolorpicker'

export default {
  name: 'ConfigPlatform',
  components: {
    FormItem,
    RichText,
      vcolorpicker
  },
  data () {
    return {
      form: this.$form.createForm(this),
      labelCol: { lg: { span: 6 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 14 }, sm: { span: 17 } },
      groupList: [],
      configTab: [],
      configList: [],
      currentList: undefined,
      gid: '',
      GLindex: 0,
        colorHeadInfo: '',
        colorFloorInfo: '',
      mobileEffect: 0, // 主题效果
        huizhisq: false // 营山域名限制开关
    }
  },
  mounted () {
    if (this.$route.path.indexOf('gid') != -1) {
      this.gid = this.$route.path.slice(this.$route.path.indexOf('=') + 1)
    }
    console.log(1111, this.gid)
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
        if (this.gid || this.$route.path.indexOf('platform.config') > -1) {
          this.getData(this.gid)
        }
      }
    }
  },
  created () {},
  methods: {
    firstTabChange (index) {
      const item = this.groupList[index]
      this.GLindex = index
      this.getTabData(item.gid)
    },
    secondTabChange (key) {
      console.log(key)
    },
    getTabData (gid) {
      this.request(configPlatformApi.config, { gid: gid }, 'get').then((res) => {
        this.configTab = res.config_list
          this.mobileEffect = res.mobile_head_affect
          this.huizhisq = res.huizhisq
          this.colorHeadInfo = res.colorHeadInfo
          this.colorFloorInfo = res.colorFloorInfo
      })
    },
    getData (gid) {
      this.request(configPlatformApi.config, { gid: gid }, 'get').then((res) => {
        console.log(res.config_list)
        this.groupList = res.group_list
        this.configTab = res.config_list
          this.mobileEffect = res.mobile_head_affect
          this.huizhisq = res.huizhisq
          this.colorHeadInfo = res.colorHeadInfo
          this.colorFloorInfo = res.colorFloorInfo
      })
    },
    // 监听上传数据变化
    uploadChange (e) {
      console.log('-------------success', e)
      const name = e.name
      let iv = ''
      if (e.value.length) {
        const file = e.value[0]
        iv = file.response && file.response.data
      }
      this.form.getFieldDecorator(name, { initialValue: iv })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const formData = { ...values }
          console.log('formData ===============', formData)
          // 要转换的数据类型
          const types = ['switch', 'date', 'time']
          this.configTab.forEach((configList) => {
            // 富文本
            configList.list.forEach((item) => {
              if (item['type'] == 'richtext') {
                formData[item.name] = item.value
              }
            })
            transferFormValue(configList.list, formData, types)
          })
          formData.mobile_head_color=this.colorHeadInfo;
          formData.mobile_head_floor_color=this.colorFloorInfo;
          // 最后的数据
          console.log('Received values of form: ', formData)
          const key = 1
          this.$message.loading({ content: '正在提交...', duration: 0, key })
          this.request(configPlatformApi.amendConfig, formData)
            .then((result) => {
              const item = this.groupList[this.GLindex]
              this.getTabData(item.gid)
              this.$message.success({ content: result.msg, key })

              // 更新config
              this.$store.dispatch('SetConfig')
              // 更新菜单
              if(formData.open_mall_order_area != undefined && formData.open_mall_order_area == 0) {
                _updateMenu(this.$route.path,this)
              }
            })
            .catch(() => {
              this.$message.destroy()
            })
        }
      })
    },
      effectChange (even) {
        if (even.target.value === '1') {
            this.mobileEffect = 0
        } else if(even.target.value === '0'){
            this.mobileEffect = 1
        }else{
            this.mobileEffect = even.target.value
            this.mobileEffect=parseInt(this.mobileEffect);
        }
        console.log('mobileEffect', this.mobileEffect)
      },
      headleHeadChangeColor (val) {
        this.colorHeadInfo = val
         console.log('colorHeadInfo: ', val)
          this.form.setFieldsValue({
              mobile_head_color: val
          })
      },
      headleFloorChangeColor (val) {
          this.colorFloorInfo = val
          console.log('colorHeadInfo: ', val)
         this.form.setFieldsValue({
              mobile_head_floor_color: val
          })
      },
      mobileColor () {
          if(this.$refs.mobileHeadInfo && this.$refs.mobileHeadInfo[0]){
              this.$refs.mobileHeadInfo[0].openStatus = false
          }
          if(this.$refs.mobileFloorInfo && this.$refs.mobileFloorInfo[0]){
              this.$refs.mobileFloorInfo[0].openStatus = false
          }
      }
  }
}
</script>
<style scoped lang="less">
.color-picker {
    margin: 10px;
    display: flex;
    justify-content: flex-start;
    /deep/ .m-colorPicker .box{
      width: 220px;
    }
    .color-box {
        /deep/ .colorBtn {
            width: 80px;
            height: 30px;
            border: 1px solid #666666;
        }
        /deep/ .box {
            z-index: 999;
        }
    }
    .color-name {
        display: inline-block;
        margin: 0px 20px;
        line-height: 30px;
        vertical-align: middle;
        font-size: 14px;
        font-weight: bold;
    }
}

.bottom_form{
    background: #fff;
    position: fixed;
    right: 820px;
    bottom: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
