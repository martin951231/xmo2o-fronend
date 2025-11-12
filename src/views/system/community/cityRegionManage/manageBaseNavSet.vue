<template>
  <div class="community-house-city-region-manage-view">
      <div>
            <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 8 }" @submit="handleSubmit" >
              <a-form-item label="标题配置" >
                    <a-input placeholder="请输入城市名称" v-model.trim="cityRegionInfo.visualization_title"  />
              </a-form-item>
              
            <a-form-item label="导航一" >
                  <a-input placeholder="请输入导航名称" v-model.trim="cityRegionInfo.navinfo.nav1"  />
            </a-form-item>
            <a-form-item label="导航二" >
                  <a-input placeholder="请输入导航名称" v-model.trim="cityRegionInfo.navinfo.nav2" />
            </a-form-item>
            <a-form-item label="导航三" >
                  <a-input placeholder="请输入导航名称" v-model.trim="cityRegionInfo.navinfo.nav3" />
            </a-form-item>
            <a-form-item label="导航四" >
                  <a-input placeholder="请输入导航名称" v-model.trim="cityRegionInfo.navinfo.nav4" />
            </a-form-item>
            
              <a-form-item :wrapper-col="{ span: 12, offset: 5 }" style="margin-top: 30px;">
                <a-button type="primary" html-type="submit" :loading="btnLoading">
                  保存信息
                </a-button>
              </a-form-item>
            </a-form>
         </div>
  </div>
</template>
<script>
  import houseCityApi from '@/api/system/community/house'
  import { Collapse } from 'ant-design-vue';

  export default {
    name: 'manageBaseNavSet',
    data() {
      return {
            form: this.$form.createForm(this),
            btnLoading   : false,
            cityRegionInfo:{},
      }
    },
      components: {
          'a-collapse':Collapse,
          'a-collapse-panel':Collapse.Panel,
      },
    activated () {

    },
    mounted() {
       this.getCityRegionInfo()
    },
    methods: {
      handleSubmit(e) {
        e.preventDefault()
        this.cityRegionInfo.xtype='nav_set';
        this.request(houseCityApi.saveCityRegionInfo,this.cityRegionInfo)
          .then((res) => {
            this.$message.success('保存成功！');
            this.btnLoading = false;
          }).catch((error) => {
            this.btnLoading = false;
        })
      },

      // 获取设置信息
      getCityRegionInfo() {
        this.btnLoading =false;
        this.request(houseCityApi.getCityRegionInfo)
          .then((res) => {
            if (res){
              this.cityRegionInfo=res;
            }
          })
      },

    }
  }
</script>

<style  scoped>
  .community-house-city-region-manage-view {
    background-color: white;
    min-height: 660px;
    padding: 20px;
  }
</style>