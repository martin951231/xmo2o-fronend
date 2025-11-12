<template>
  <a-modal :title="title" :width="900" :visible="visible" :footer="null" :maskClosable="false" :confirmLoading="confirmLoading"  @cancel="handleCancel">
    <a-card title="街道功能库">
      <div class="header-func">
        使用方法：点击“选中”直接返回对应模块外链代码，或者点击“详细”选择具体的内容外链
      </div>
      <div class="header-title">
        请选择模块：
      </div>
      <div class="body-item" v-for="(item,index) in appList" :key="index">
        <div class="son_items" >
          <div class="items-left">{{item.name}}</div>
          <a @click="selected_url(item.linkcode)"><div class="items-right">选中</div></a>
        </div>
      </div>
    </a-card>
  </a-modal>
</template>
<script>
    import configVillageApi from '@/api/community/village'
    import { getSystemName } from '@/utils/util'
    export default {
        name: 'functionLibrary',
        data() {
            return {
                title: '插入连接或者关键词',
                visible: false,
                confirmLoading: false,
                appList: {
                    title: '',
                    url: '',
                },
                id:0,
                type:'',
                tokenName: '',
                sysName: ''
            }
        },
        methods: {
            FunctionLibrary(type,id) {
                let sysName = getSystemName(location.hash);
                if (sysName) {
                    this.tokenName = sysName + '_access_token';
                    this.sysName = sysName;
                } else {
                    this.sysName = 'village';
                }
                this.title='插入连接或者关键词',
                this.visible = true;
                this.id = id;
                this.type = type;
                this.AppLists();
            },
            AppLists() {
                let _this = this
                console.log('id',this.id);
                console.log('type',this.type);
                let param = {
                    id:this.id,
                    type:this.type
                };
                if (this.tokenName) {
                    param['tokenName'] = this.tokenName;
                }
                this.request(configVillageApi.childLibrary, param)
                    .then((res) => {
                        console.log('res', res)
                        this.appList = res.list
                    })
            },
            selected_url(url){
                this.$emit('ok', url)
                this.visible = false;
            },
            handleCancel() {
                this.visible = false
            },
        },
    }
</script>
<style>
  .header-func{
    border: 1px solid #ffdf84;
    background-color: #fbffca;
    padding: 10px;
  }
  .header-title{
    font-size: 17px;
    margin: 10px;
  }
  .body-item{
    margin-top: 10px;
    height: 100%;
  }
  .son_items{
    height: 30px;
    width: 100%;
    float: left;
    background-color: #eee;
    font-size: 15px;
    margin: 5px;
  }
  .items-left{
    float: left;
    padding: 5px 5px 5px 10px;
  }
  .items-right{
    float: right;
    padding: 5px 10px 5px 5px;
  }
</style>