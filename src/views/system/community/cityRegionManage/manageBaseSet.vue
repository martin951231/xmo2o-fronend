<template>
  <div class="community-house-city-region-manage-view">
      <div>
            <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 8 }" @submit="handleBaseSubmit" >
              <a-form-item label="名称" >
                    <a-input placeholder="请输入城市名称" v-model.trim="cityRegionInfo.region_name" disabled />
              </a-form-item>
              
            <a-form-item label="所属区域" >
                  <a-input placeholder="请输入所属区域" v-model.trim="cityRegionInfo.region_address" disabled />
            </a-form-item>
            
            <a-form-item label="地址" >
                  <a-input placeholder="请输入地址" v-model.trim="cityRegionInfo.detail_address" />
            </a-form-item>
            <a-form-item label="联系电话" >
                  <a-input placeholder="请输入联系电话" v-model.trim="cityRegionInfo.phone" />
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
    name: 'manageBaseSet',
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
      handleBaseSubmit(e) {
        e.preventDefault();
        this.btnLoading =true;
        this.cityRegionInfo.xtype='base_set';
        this.request(houseCityApi.saveCityRegionInfo, this.cityRegionInfo)
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